# Handoff

## Current Handoff Snapshot

| Field | Value |
|---|---|
| Mode | Interactive |
| Branch | `master` |
| Last committed baseline | Pending commit after auth hardening session close |
| Worktree at session close | Pending commit with auth hardening and memory updates |
| Current phase | Phase 1 stabilization and production runtime hardening |
| Immediate next task | Decide remaining auth policy: token lifetime and native/mobile strategy |

## What Changed In This Memory Restructure

- Added `.memory-bank/` as the structured memory index.
- Added `.specs/` for bootstrap, boundaries, and constitution.
- Added `.tasks/` for active pipeline and handoff state.
- Added `.agents/runtime-manifest.json` for agent write boundaries.
- Preserved all existing `agents/` files in place.
- Did not archive or delete any historical documentation.
- Did not modify application source code.

## Known Failures And Risks

- Full workspace typecheck currently passes.
- Health/readiness depth is implemented with separate liveness and readiness endpoints.
- Backend route param typing, driver status enum, and admin audit action typing were repaired.
- Frontend/admin map marker and query option typing were repaired.
- `.env.example` and deployment guidance were aligned with runtime truth.
- API bootstrap now loads `.env` before importing modules that validate environment variables.
- LocalStorage JWT / XSS posture was audited and recorded in `.memory-bank/audits/local-storage-jwt-xss-posture.md`.
- Browser auth now uses an HttpOnly cookie session instead of localStorage token persistence.
- Cookie-authenticated unsafe browser requests now require double-submit CSRF protection.
- Browser WebSocket auth now uses the HttpOnly cookie handshake; query-token fallback is restricted to no-Origin compatibility clients.
- Deployment notes now call out `AUTH_COOKIE_DOMAIN=.gnncab.com` when admin and API run on separate subdomains.
- Flutter app is planned but not yet present in the repository.

## Verified In This Session

| Command | Result | Notes |
|---|---|---|
| `corepack pnpm run typecheck` | Passed | Full workspace typecheck passed after auth hardening changes. |
| `git diff --check` | Passed | No whitespace errors detected. |
| Browser localStorage JWT pattern search | Passed | No old `gnncab_token`, `gnncab_user`, `localStorage` token, WebSocket `auth.${token}`, or browser `Authorization: Bearer` patterns found. |

## Next Recommended Action

Decide remaining auth policy: token lifetime and native/mobile bearer/refresh-token strategy.

## Files Touched

See the closing commit for the exact file list.
