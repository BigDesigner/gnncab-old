import { Router, type IRouter } from "express";
import { pool } from "@workspace/db";
import { isStartupReady } from "../lib/startup.js";
import { isWebSocketReady } from "../lib/websocket.js";

const router: IRouter = Router();

type CheckStatus = "ok" | "fail";

async function getReadinessChecks(): Promise<{
  db: CheckStatus;
  ws: CheckStatus;
  startup: CheckStatus;
}> {
  let dbStatus: "ok" | "fail" = "ok";

  try {
    await pool.query("SELECT 1");
  } catch {
    dbStatus = "fail";
  }

  return {
    db: dbStatus,
    ws: isWebSocketReady() ? "ok" : "fail",
    startup: isStartupReady() ? "ok" : "fail",
  } as const;
}

function allChecksOk(checks: Record<string, CheckStatus>): boolean {
  return Object.values(checks).every((value) => value === "ok");
}

router.get("/livez", (_req, res) => {
  res.status(200).json({
    status: "ok",
    checks: {
      process: "ok",
    },
    uptimeSeconds: process.uptime(),
  });
});

router.get("/readyz", async (_req, res) => {
  const checks = await getReadinessChecks();
  const ready = allChecksOk(checks);

  res.status(ready ? 200 : 503).json({
    status: ready ? "ok" : "fail",
    checks,
    uptimeSeconds: process.uptime(),
  });
});

router.get("/healthz", async (_req, res) => {
  const checks = await getReadinessChecks();

  const status = allChecksOk(checks) ? "ok" : checks.db === "fail" ? "fail" : "degraded";

  res.status(status === "fail" ? 503 : 200).json({
    status,
    checks,
    uptimeSeconds: process.uptime(),
  });
});

export default router;
