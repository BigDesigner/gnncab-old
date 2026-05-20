# Boundary Conditions

## Security Boundaries

| Boundary | Rule | Confidence | Evidence |
|---|---|---|---|
| Authentication | JWT authentication is required for protected flows. | Verified | `agents/STANDARD.md` |
| Authorization | Role-based access control is required. | Verified | `agents/STANDARD.md` |
| Browser origins | Wildcard production origins are forbidden. | Verified | `agents/STANDARD.md`, `agents/VERIFIED_WORKLOG.md` |
| WebSocket browser auth | Browser clients use subprotocol token transport, not URL query tokens. | Verified | `agents/VERIFIED_WORKLOG.md` |
| Query-token fallback | Temporary compatibility only for no-`Origin` requests. | Verified | `agents/SESSION_SNAPSHOT.md` |
| Audit logging | Security-sensitive admin actions should be auditable. | Verified | `agents/STANDARD.md` |

## Ride-Hailing Domain Boundaries

| Boundary | Rule | Confidence | Evidence |
|---|---|---|---|
| Passenger-driver access | Users must not access trips, locations, or payments outside their authorized scope. | Inferred | Ride-hailing domain requirement |
| Trip state machine | Trip status transitions must be explicit and recoverable after restart. | Verified | `agents/DECISIONS.md`, startup recovery notes |
| Driver availability | Driver status and trip assignment must not diverge silently. | Verified | `agents/VERIFIED_WORKLOG.md` |
| Realtime location | Location tracking must minimize exposure and respect user role boundaries. | Inferred | Product domain |
| Payments | Payment/refund state must not rely on frontend trust. | Inferred | Product domain |
| Admin privilege | Admin tools must fail closed and produce audit evidence. | Verified | `agents/STANDARD.md` |

## Deployment Boundaries

| Boundary | Rule | Confidence | Evidence |
|---|---|---|---|
| Backend hosting | DigitalOcean is the current production deployment target. | Verified | `DEPLOYMENT.md`, `deploy/` |
| Candidate public topology | Backend on DigitalOcean; public/static surfaces on Cloudflare. | Verified | `agents/ARCHITECTURE_NOTES.md`, `agents/DECISIONS.md` |
| PM2 workers | Single-worker default until Redis-backed realtime is verified. | Verified | `agents/DECISIONS.md` |
| Database updates | Production DB updates require checked-in migrations and backup gate. | Verified | `agents/VERIFIED_WORKLOG.md` |
| Routing | Production routing must fail closed to OSRM. | Verified | `agents/DECISIONS.md` |

## Operational Boundaries

| Boundary | Rule | Confidence | Evidence |
|---|---|---|---|
| Source of truth | Repository code/config wins over stale documentation. | Verified | `agents/AI_GUARDRAILS.md` |
| Release output | `release/` is generated output, not maintained source. | Verified | `agents/SESSION_SNAPSHOT.md` |
| Deployment scripts | `deploy/` is part of the product and must remain synchronized. | Verified | `agents/AGENTS.md`, `agents/STANDARD.md` |
