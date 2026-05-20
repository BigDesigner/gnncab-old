# LocalStorage JWT / XSS Posture Audit

## Summary

- Status: Mitigated
- Confidence: Verified
- Date: 2026-05-20

The admin/frontend app previously stored the JWT in `localStorage` and read it for HTTP and WebSocket authentication. Browser auth now uses an HttpOnly cookie session, while bearer tokens remain accepted for native/mobile compatibility.

## Evidence

| Area | Evidence | Risk |
|---|---|---|
| Previous token storage | `artifacts/gnncab/src/components/auth-context.tsx` stored `gnncab_token` in `localStorage`. | Mitigated for browser clients. |
| Previous HTTP auth | `artifacts/gnncab/src/lib/fetch-interceptor.ts` read `gnncab_token` and sent `Authorization: Bearer <token>`. | Mitigated for browser clients. |
| Previous WebSocket auth | `artifacts/gnncab/src/hooks/use-websocket.tsx` sent the JWT through a WebSocket subprotocol value. | Mitigated for browser clients. |
| Session duration | `.env.example` defaults `JWT_EXPIRES_IN=24h`. | Long-lived stolen tokens remain useful for too long. |

## Current Mitigations

| Mitigation | Confidence | Evidence |
|---|---|---|
| WebSocket no longer carries JWT in URL query params for browser clients. | Verified | `artifacts/gnncab/src/hooks/use-websocket.tsx` |
| Browser HTTP auth uses HttpOnly cookie session. | Verified | `artifacts/api-server/src/lib/auth-cookie.ts`, `artifacts/gnncab/src/lib/fetch-interceptor.ts` |
| Browser WebSocket auth uses the HttpOnly cookie during the handshake. | Verified | `artifacts/api-server/src/lib/websocket.ts`, `artifacts/gnncab/src/hooks/use-websocket.tsx` |
| Cookie-authenticated unsafe browser requests require CSRF validation. | Verified | `artifacts/api-server/src/middlewares/csrf.ts`, `artifacts/api-server/src/app.ts`, `artifacts/gnncab/src/lib/fetch-interceptor.ts` |
| API uses Helmet security headers. | Verified | `artifacts/api-server/src/app.ts` |
| CORS and WebSocket browser origins are explicit and fail closed. | Verified | `artifacts/api-server/src/app.ts`, `artifacts/api-server/src/lib/websocket.ts` |

## Recommended Direction

Continue hardening toward short-lived access tokens and a production-ready native/mobile auth strategy.

Recommended phased migration:

1. Keep bearer-token response temporarily only for native/mobile clients if needed.
2. Shorten browser token lifetime or split access/refresh semantics.
3. Decide whether native/mobile clients should use bearer tokens, refresh tokens, or a separate mobile session flow.
4. Review cross-subdomain cookie settings before deploying admin and API on separate hosts.

## Decision Required

The browser localStorage risk is mitigated. A broader token lifetime, refresh token, and native/mobile auth decision is still required before production launch.
