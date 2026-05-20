# LocalStorage JWT / XSS Posture Audit

## Summary

- Status: Open
- Confidence: Verified
- Date: 2026-05-20

The admin/frontend app currently stores the JWT in `localStorage` and reads it for HTTP and WebSocket authentication.

## Evidence

| Area | Evidence | Risk |
|---|---|---|
| Token storage | `artifacts/gnncab/src/components/auth-context.tsx` stores `gnncab_token` in `localStorage`. | Any successful XSS can read and exfiltrate the bearer token. |
| HTTP auth | `artifacts/gnncab/src/lib/fetch-interceptor.ts` reads `gnncab_token` and sends `Authorization: Bearer <token>`. | Token exposure gives API access until expiry. |
| WebSocket auth | `artifacts/gnncab/src/hooks/use-websocket.tsx` sends the JWT through a WebSocket subprotocol value. | Better than URL query strings, but still depends on JS-readable token storage. |
| Session duration | `.env.example` defaults `JWT_EXPIRES_IN=24h`. | Long-lived stolen tokens remain useful for too long. |

## Current Mitigations

| Mitigation | Confidence | Evidence |
|---|---|---|
| WebSocket no longer carries JWT in URL query params for browser clients. | Verified | `artifacts/gnncab/src/hooks/use-websocket.tsx` |
| API uses Helmet security headers. | Verified | `artifacts/api-server/src/app.ts` |
| CORS and WebSocket browser origins are explicit and fail closed. | Verified | `artifacts/api-server/src/app.ts`, `artifacts/api-server/src/lib/websocket.ts` |

## Recommended Direction

Use an HttpOnly, Secure, SameSite cookie session or refresh-token strategy for browser clients, with short-lived access tokens and explicit CSRF protection where needed.

Recommended phased migration:

1. Add backend support for setting an HttpOnly auth cookie on login.
2. Add logout support that clears the cookie.
3. Update API client fetch configuration to send credentials.
4. Keep bearer-token response temporarily only for native/mobile clients if needed.
5. Update WebSocket browser auth to avoid JS-readable long-lived tokens.
6. Shorten browser token lifetime or split access/refresh semantics.
7. Remove `localStorage` token persistence after compatibility is confirmed.

## Decision Required

This is a public auth contract change and affects the future Flutter app. Do not implement the full migration without an explicit architecture decision covering browser admin, passenger/driver app, and WebSocket authentication.
