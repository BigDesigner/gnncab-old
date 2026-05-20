# Bug And Risk List

## Current Known Issues

| ID | Area | Confidence | Status | Evidence | Suggested Next Action |
|---|---|---|---|---|---|
| BUG-001 | Backend typecheck | Verified | Closed | `corepack pnpm run typecheck` previously reached backend errors after Windows tooling fix. | Closed by aligning driver status schema, route param typing, and audit action typing. |
| BUG-002 | Driver status model | Verified | Closed | Baseline migration includes `RESERVED`; TypeScript schema had lost it. | Closed by restoring `RESERVED` to `driverStatusEnum`. |
| BUG-003 | Admin audit event typing | Verified | Closed | Admin activation/deactivation actions were narrower than the selected audit action variable type. | Closed by widening the local audit action variable to `string`. |
| BUG-004 | Frontend typecheck | Verified | Closed | Leaflet icon typing, generated query hook options, and nullable marker coordinates failed typecheck. | Closed by fixing icon instance usage, query key options, and marker coordinate guards. |
| RISK-001 | Health/readiness depth | Verified | Closed | `agents/NEXT_ACTIONS.md` listed shallow health endpoint as immediate next task. | Closed by adding `/api/livez` and `/api/readyz` while preserving `/api/healthz`. |
| RISK-002 | WebSocket query-token fallback | Verified | Open | Temporary no-`Origin` fallback remains for compatibility. | Keep telemetry review before final retirement. |
| RISK-003 | Payment/location/realtime safety | Inferred | Open | GNNcab is a ride-hailing platform with passenger, driver, payment, and location flows. | Treat authorization, audit, and privacy boundaries as release blockers when touched. |
| RISK-004 | Env/runtime drift | Verified | Closed | `.env.example` included unsupported dispatch tuning variables and API env loading depended on module import order. | Closed by removing unsupported env examples and loading `.env` before runtime module imports. |
| RISK-005 | Browser JWT storage | Verified | Mitigated | Admin/frontend previously stored JWT in `localStorage`; browser auth now uses HttpOnly cookie session with CSRF protection for cookie-authenticated unsafe requests. | Decide remaining token lifetime and native/mobile auth policy before production launch. |
| RISK-006 | US distance unit mismatch | Verified | Closed | The product targets the United States but API/UI/DB used kilometer naming and calculations. | Closed by switching canonical distance fields and calculations to miles. |

## Validation Notes

| Date | Command | Result | Notes |
|---|---|---|---|
| 2026-05-20 | `corepack pnpm --filter @workspace/api-server run typecheck` | Failed | Existing backend failures remain in startup driver status, route param typing, and admin audit event typing. No new `health.ts` error appeared in the reported output. |
| 2026-05-20 | `corepack pnpm --filter @workspace/api-server run typecheck` | Passed | Backend typecheck passed after driver enum, route parameter, and audit action typing fixes. |
| 2026-05-20 | `corepack pnpm run typecheck` | Passed | Full workspace typecheck passed for libs, backend, admin/frontend, mockup sandbox, and scripts. |
| 2026-05-20 | `corepack pnpm run typecheck` | Passed | Full workspace typecheck passed after env/deploy alignment. |
| 2026-05-20 | `corepack pnpm run typecheck` | Passed | Full workspace typecheck passed after browser cookie auth and CSRF changes. |
