# Bug And Risk List

## Current Known Issues

| ID | Area | Confidence | Status | Evidence | Suggested Next Action |
|---|---|---|---|---|---|
| BUG-001 | Backend typecheck | Verified | Open | `corepack pnpm run typecheck` reaches backend errors after Windows tooling fix. | Resolve driver status/domain mismatch and route param typing issues in narrow slices. |
| BUG-002 | Driver status model | Verified | Open | Startup logic references `RESERVED`, while driver status schema allows `AVAILABLE`, `BUSY`, `OFFLINE`. | Decide whether `RESERVED` is a real persisted state or should be removed from startup cleanup. |
| BUG-003 | Admin audit event typing | Verified | Open | Admin activation/deactivation events do not match the current audit event type union. | Align event names with schema/type contract. |
| BUG-004 | Frontend typecheck | Verified | Open | Leaflet icon typing, generated query hook options, and nullable marker coordinates fail typecheck. | Fix frontend type issues after backend domain blockers. |
| RISK-001 | Health/readiness depth | Verified | Open | `agents/NEXT_ACTIONS.md` lists shallow health endpoint as immediate next task. | Deepen readiness so production can distinguish process-up from dependency-ready. |
| RISK-002 | WebSocket query-token fallback | Verified | Open | Temporary no-`Origin` fallback remains for compatibility. | Keep telemetry review before final retirement. |
| RISK-003 | Payment/location/realtime safety | Inferred | Open | GNNcab is a ride-hailing platform with passenger, driver, payment, and location flows. | Treat authorization, audit, and privacy boundaries as release blockers when touched. |
