import { db } from "@workspace/db";
import { driverProfilesTable, tripsTable, tripEventsTable } from "@workspace/db/schema";
import { eq, and, notInArray, sql } from "drizzle-orm";
import { logAudit, AuditAction } from "./audit.js";
import { broadcastTripUpdate } from "./websocket.js";

const DISPATCH_TIMEOUT_MS = 60_000;
const MAX_DISPATCH_RADIUS_MILES = 10;
const MAX_DISPATCH_ATTEMPTS = 3;

function haversineDistanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const EARTH_RADIUS_MILES = 3958.7613;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function findNearestAvailableDriver(
  pickupLat: number,
  pickupLng: number,
  cityId?: string,
  excludeDriverIds: string[] = []
): Promise<{ driverId: string; distanceMiles: number } | null> {
  const conditions: ReturnType<typeof eq>[] = [eq(driverProfilesTable.status, "AVAILABLE")];
  if (cityId) conditions.push(eq(driverProfilesTable.cityId, cityId));

  let query = db
    .select()
    .from(driverProfilesTable)
    .where(
      excludeDriverIds.length > 0
        ? and(...conditions, notInArray(driverProfilesTable.id, excludeDriverIds))
        : and(...conditions)
    );

  const drivers = await query;

  let nearest: { driverId: string; distanceMiles: number } | null = null;
  for (const driver of drivers) {
    if (driver.currentLat == null || driver.currentLng == null) continue;
    const dist = haversineDistanceMiles(pickupLat, pickupLng, driver.currentLat, driver.currentLng);
    if (dist > MAX_DISPATCH_RADIUS_MILES) continue;
    if (!nearest || dist < nearest.distanceMiles) {
      nearest = { driverId: driver.id, distanceMiles: dist };
    }
  }
  return nearest;
}

/**
 * Reads the trip's dispatch attempt history from trip_events (DRIVER_ASSIGNED events).
 * Returns the list of driver IDs that have already been tried.
 */
async function getPreviouslyTriedDrivers(tripId: string): Promise<string[]> {
  const events = await db
    .select()
    .from(tripEventsTable)
    .where(and(eq(tripEventsTable.tripId, tripId), eq(tripEventsTable.status, "DRIVER_ASSIGNED")));

  const driverIds: string[] = [];
  for (const ev of events) {
    const meta = ev.metadata as Record<string, unknown> | null;
    if (meta?.driverId && typeof meta.driverId === "string") {
      driverIds.push(meta.driverId);
    }
  }
  return driverIds;
}

/**
 * Assigns the given driver to the trip and starts the 60-second acceptance timer.
 */
async function assignDriverToTrip(
  tripId: string,
  driverId: string,
  distanceMiles: number
): Promise<void> {
  const now = new Date();

  await db.transaction(async (tx) => {
    await tx.update(tripsTable)
      .set({ driverId, status: "DRIVER_ASSIGNED", assignedAt: now, updatedAt: now })
      .where(eq(tripsTable.id, tripId));

    await tx.insert(tripEventsTable).values({
      tripId,
      status: "DRIVER_ASSIGNED",
      actorId: null,
      actorRole: "system",
      metadata: { driverId, distanceMiles },
    });

    await tx.update(driverProfilesTable)
      .set({ status: "BUSY", updatedAt: now })
      .where(eq(driverProfilesTable.id, driverId));
  });

  broadcastTripUpdate(tripId, "DRIVER_ASSIGNED", undefined);

  // 60-second acceptance timer — if driver doesn't respond, try next driver
  setTimeout(async () => {
    try {
      const [trip] = await db.select().from(tripsTable).where(eq(tripsTable.id, tripId)).limit(1);
      if (!trip || trip.status !== "DRIVER_ASSIGNED" || trip.driverId !== driverId) return;

      const now2 = new Date();
      await db.transaction(async (tx) => {
        await tx.update(tripsTable)
          .set({ status: "DRIVER_NO_RESPONSE", updatedAt: now2 })
          .where(eq(tripsTable.id, tripId));

        await tx.insert(tripEventsTable).values({
          tripId,
          status: "DRIVER_NO_RESPONSE",
          actorId: null,
          actorRole: "system",
          metadata: { driverId, timeoutMs: DISPATCH_TIMEOUT_MS },
        });

        await tx.update(driverProfilesTable)
          .set({ status: "AVAILABLE", updatedAt: now2 })
          .where(eq(driverProfilesTable.id, driverId));
      });

      broadcastTripUpdate(tripId, "DRIVER_NO_RESPONSE", undefined);
      await logAudit({ entity: "trip", entityId: tripId, action: AuditAction.TRIP_DRIVER_NO_RESPONSE, severity: "MEDIUM", metadata: { driverId } });

      // Try to re-dispatch to the next nearest available driver
      await tryRedispatch(tripId);
    } catch (err) {
      console.error("[Dispatch] Timeout handler error:", err);
    }
  }, DISPATCH_TIMEOUT_MS);
}

/**
 * Attempts to find the next best driver for a trip, excluding all previously tried ones.
 * Called after DRIVER_REJECTED or DRIVER_NO_RESPONSE.
 */
export async function tryRedispatch(tripId: string): Promise<boolean> {
  const [trip] = await db.select().from(tripsTable).where(eq(tripsTable.id, tripId)).limit(1);
  if (!trip) return false;

  // Only re-dispatch from these states
  const retryableStatuses = ["DRIVER_NO_RESPONSE", "DRIVER_REJECTED", "REQUESTED"];
  if (!retryableStatuses.includes(trip.status)) return false;

  const triedDrivers = await getPreviouslyTriedDrivers(tripId);

  // Limit total dispatch attempts to avoid infinite loops
  if (triedDrivers.length >= MAX_DISPATCH_ATTEMPTS) {
    const now = new Date();
    await db.transaction(async (tx) => {
      await tx.update(tripsTable)
        .set({ status: "TIMEOUT", updatedAt: now })
        .where(eq(tripsTable.id, tripId));
      await tx.insert(tripEventsTable).values({
        tripId,
        status: "TIMEOUT",
        actorId: null,
        actorRole: "system",
        metadata: { reason: "Max dispatch attempts reached", attempts: triedDrivers.length },
      });
    });
    broadcastTripUpdate(tripId, "TIMEOUT", undefined);
    await logAudit({ entity: "trip", entityId: tripId, action: "DISPATCH_TIMEOUT", metadata: { attempts: triedDrivers.length } });
    return false;
  }

  const nearest = await findNearestAvailableDriver(
    trip.pickupLat,
    trip.pickupLng,
    trip.cityId ?? undefined,
    triedDrivers
  );

  if (!nearest) {
    const now = new Date();
    await db.transaction(async (tx) => {
      await tx.update(tripsTable)
        .set({ status: "TIMEOUT", updatedAt: now })
        .where(eq(tripsTable.id, tripId));
      await tx.insert(tripEventsTable).values({
        tripId,
        status: "TIMEOUT",
        actorId: null,
        actorRole: "system",
        metadata: { reason: "No available drivers in range", triedDrivers },
      });
    });
    broadcastTripUpdate(tripId, "TIMEOUT", undefined);
    await logAudit({ entity: "trip", entityId: tripId, action: "DISPATCH_NO_DRIVER", metadata: { triedDrivers } });
    return false;
  }

  await assignDriverToTrip(tripId, nearest.driverId, nearest.distanceMiles);
  await logAudit({ entity: "trip", entityId: tripId, action: AuditAction.TRIP_DRIVER_REASSIGNED, severity: "MEDIUM", metadata: { driverId: nearest.driverId, attempt: triedDrivers.length + 1 } });
  return true;
}

/**
 * Initial dispatch: called when a trip is first created.
 */
export async function dispatchTrip(
  tripId: string,
  pickupLat: number,
  pickupLng: number,
  cityId?: string
): Promise<boolean> {
  const nearest = await findNearestAvailableDriver(pickupLat, pickupLng, cityId);

  if (!nearest) {
    const now = new Date();
    await db.transaction(async (tx) => {
      await tx.update(tripsTable)
        .set({ status: "TIMEOUT", updatedAt: now })
        .where(eq(tripsTable.id, tripId));
      await tx.insert(tripEventsTable).values({
        tripId,
        status: "TIMEOUT",
        actorId: null,
        actorRole: "system",
        metadata: { reason: "No available drivers at initial dispatch", pickupLat, pickupLng, cityId },
      });
    });
    broadcastTripUpdate(tripId, "TIMEOUT", undefined);
    await logAudit({ entity: "trip", entityId: tripId, action: "DISPATCH_NO_DRIVER", metadata: { pickupLat, pickupLng, cityId } });
    return false;
  }

  await assignDriverToTrip(tripId, nearest.driverId, nearest.distanceMiles);
  await logAudit({ entity: "trip", entityId: tripId, action: "DRIVER_ASSIGNED", metadata: { driverId: nearest.driverId, distanceMiles: nearest.distanceMiles } });
  return true;
}

export function estimateRoute(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): { distanceMiles: number; durationMinutes: number; estimatedFare: number; currency: string } {
  const distanceMiles = haversineDistanceMiles(fromLat, fromLng, toLat, toLng);
  const durationMinutes = Math.ceil((distanceMiles / 30) * 60);
  const baseFare = 2.5;
  const perMileRate = 1.2;
  const estimatedFare = Math.round((baseFare + distanceMiles * perMileRate) * 100) / 100;
  return { distanceMiles: Math.round(distanceMiles * 100) / 100, durationMinutes, estimatedFare, currency: "USD" };
}

export function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  return haversineDistanceMiles(lat1, lng1, lat2, lng2);
}
