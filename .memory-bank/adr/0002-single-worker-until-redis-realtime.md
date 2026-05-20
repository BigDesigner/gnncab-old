# ADR 0002: Keep Production Single-Worker Until Redis-Backed Realtime Is Verified

- Status: Accepted
- Confidence: Verified
- Source: `agents/DECISIONS.md`, `agents/ARCHITECTURE_NOTES.md`

## Context

The dispatch and WebSocket runtime currently rely on process-local state. Silent cross-worker realtime delivery failure would be worse than reduced throughput.

## Decision

Production must default to a single PM2 worker until Redis/pubsub or an equivalent cross-worker realtime mechanism is provisioned and verified end-to-end.

## Consequences

- PM2 production default remains `instances: 1` and fork mode.
- Cluster mode is a future architecture task, not a default deployment mode.
- Readiness and health work should reflect the current single-worker operating model.

## Evidence

- `agents/DECISIONS.md`
- `agents/VERIFIED_WORKLOG.md`
- `deploy/ecosystem.config.cjs`
