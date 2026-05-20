# ADR 0004: Enforce Browser Origin And WebSocket Token Boundaries

- Status: Accepted
- Confidence: Verified
- Source: `agents/VERIFIED_WORKLOG.md`, `agents/STANDARD.md`

## Context

GNNcab uses authenticated browser and realtime flows. Browser-origin requests and WebSocket authentication must not rely on unsafe wildcard origins or token-in-URL transport.

## Decision

Browser HTTP and WebSocket origins must use an explicit allowlist. Browser WebSocket clients must use subprotocol token transport. Query-token fallback is temporary and only for compatibility-oriented no-`Origin` requests.

## Consequences

- Wildcard production origins are forbidden.
- Browser-style requests with `Origin` cannot use query-token fallback.
- Query-token fallback retirement remains a post-deploy telemetry decision.

## Evidence

- `agents/VERIFIED_WORKLOG.md`
- `artifacts/api-server/src/app.ts`
- `artifacts/api-server/src/lib/websocket.ts`
- `artifacts/gnncab/src/hooks/use-websocket.tsx`
