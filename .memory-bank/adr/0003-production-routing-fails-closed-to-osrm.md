# ADR 0003: Production Routing Fails Closed To Explicit OSRM Configuration

- Status: Accepted
- Confidence: Verified
- Source: `agents/DECISIONS.md`, `agents/VERIFIED_WORKLOG.md`

## Context

Routing affects dispatch ranking and fare estimation. Silent fallback to mock routing in production is unsafe.

## Decision

Production must explicitly use `ROUTING_PROVIDER="osrm"` with `OSRM_BASE_URL` configured. Missing, invalid, or failing production routing configuration must fail closed.

## Consequences

- `mock` routing is local/development-only.
- Deployment documentation and environment examples must stay aligned with routing behavior.
- Future routing providers require explicit architecture and deployment decisions.

## Evidence

- `artifacts/api-server/src/lib/routing.ts`
- `.env.example`
- `DEPLOYMENT.md`
- `agents/DECISIONS.md`
