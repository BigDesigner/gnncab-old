# ADR 0008: Use Miles For US Distance Units

- Status: Accepted
- Confidence: Verified
- Source: User direction, code update on 2026-05-20

## Context

GNNcab is intended for use in the United States. Public distance values, dispatch radius behavior, route estimates, fare calculations, and frontend display should use miles rather than kilometers.

## Decision

Use miles as the canonical distance unit for GNNcab product surfaces and API contracts.

## Consequences

- API fields use `distanceMiles`.
- The trips table uses `distance_miles`.
- Nearby-driver search radius is interpreted as miles.
- Haversine and OSRM distance conversion return miles.
- Frontend displays `mi`.
- Future pricing variables should use per-mile naming.

## Evidence

- `artifacts/api-server/src/lib/dispatch.ts`
- `artifacts/api-server/src/lib/routing.ts`
- `lib/db/src/schema/trips.ts`
- `lib/api-spec/openapi.yaml`
- `artifacts/gnncab/src/pages/customer/dashboard.tsx`
