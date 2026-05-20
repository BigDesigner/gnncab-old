# Verified Worklog

## Source

This file indexes verified work from `agents/VERIFIED_WORKLOG.md`, `agents/NEXT_ACTIONS.md`, and recent repository commits. The original files remain in place.

## Completed Milestones

| Date | Area | Status | Evidence |
|---|---|---|---|
| 2026-03-16 | PM2 readiness | Verified | `agents/VERIFIED_WORKLOG.md`, backend bootstrap notes |
| 2026-03-16 | Single-worker PM2 default | Verified | `deploy/ecosystem.config.cjs`, `DEPLOYMENT.md` |
| 2026-03-17 | Browser origin and WebSocket auth hardening | Verified | `agents/VERIFIED_WORKLOG.md` |
| 2026-03-18 | Deployment setup/update truth alignment | Verified | `deploy/setup.sh`, `deploy/update.sh`, `DEPLOYMENT.md` |
| 2026-03-18 | Production admin bootstrap hardening | Verified | `scripts/src/bootstrap-admin.ts`, `scripts/src/seed.ts` |
| 2026-03-18 | Checked-in database migration path | Verified | `lib/db/drizzle/`, `deploy/update.sh` |
| 2026-03-18 | Backup/restore hardening and rollback runbook | Verified | `deploy/backup.sh`, `deploy/backup-restore.sh`, `DEPLOYMENT.md` |
| 2026-03-19 | Production routing fail-closed behavior | Verified | `.env.example`, `artifacts/api-server/src/lib/routing.ts`, `DEPLOYMENT.md` |
| 2026-03-19 | Real Ubuntu deploy script validation | Verified | `agents/VERIFIED_WORKLOG.md` |
| 2026-05-19 | Windows workspace tooling repair | Verified | Commit `32338a7` |
| 2026-05-19 | Candidate public deployment topology documented | Verified | Commit `42c1164`, `agents/ARCHITECTURE_NOTES.md`, `agents/DECISIONS.md` |
| 2026-05-20 | Structured project memory bank created | Verified | Commit `4a62f08`, `.memory-bank/`, `.specs/`, `.tasks/`, `.agents/runtime-manifest.json` |
| 2026-05-20 | Health/readiness and workspace typecheck repaired | Verified | Commit `16a7f50`, `/api/livez`, `/api/readyz`, `corepack pnpm run typecheck` |
| 2026-05-20 | Runtime environment and US distance unit alignment | Verified | Commit `12e2ec5`, `.env.example`, `DEPLOYMENT.md`, `lib/api-spec/openapi.yaml`, DB schema/migrations, frontend display |
| 2026-05-20 | Browser auth moved away from localStorage JWT storage | Verified | Session closing commit, `artifacts/api-server/src/lib/auth-cookie.ts`, `artifacts/gnncab/src/lib/fetch-interceptor.ts`, `artifacts/gnncab/src/components/auth-context.tsx` |
| 2026-05-20 | Cookie-authenticated browser requests protected with CSRF validation | Verified | Session closing commit, `artifacts/api-server/src/middlewares/csrf.ts`, `artifacts/api-server/src/app.ts`, `artifacts/gnncab/src/lib/fetch-interceptor.ts` |
| 2026-05-20 | Browser WebSocket auth moved to HttpOnly cookie handshake | Verified | Session closing commit, `artifacts/api-server/src/lib/websocket.ts`, `artifacts/gnncab/src/hooks/use-websocket.tsx` |

## Known Incomplete Work

| Area | Status | Notes |
|---|---|---|
| Token lifetime and native/mobile auth strategy | Open | Browser cookie auth is mitigated; production still needs explicit access/refresh/native strategy. |
| Backup/restore drill | Open | Operational drill still needs to be performed. |
| WebSocket query-token fallback retirement | Open | Requires post-deploy telemetry review. |
| Flutter app implementation | Open | Mobile app is planned but not yet present in the repository. |

## Validation Notes

| Date | Command | Result | Notes |
|---|---|---|---|
| 2026-05-20 | `corepack pnpm run typecheck` | Passed | Full workspace typecheck passed after health/readiness and type repairs. |
| 2026-05-20 | `corepack pnpm run typecheck` | Passed | Full workspace typecheck passed after env/deploy alignment and US distance unit changes. |
| 2026-05-20 | `corepack pnpm run typecheck` | Passed | Full workspace typecheck passed after browser cookie auth and CSRF changes. |
| 2026-05-20 | `git diff --check` | Passed | No whitespace errors detected before session close. |
