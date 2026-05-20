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

## Known Incomplete Work

| Area | Status | Notes |
|---|---|---|
| Health/readiness depth | Open | Immediate next safe backend task. |
| Backend typecheck | Open | Known TypeScript/domain mismatches remain after tooling repair. |
| Frontend typecheck | Open | Known map/query/marker type issues remain after tooling repair. |
| Backup/restore drill | Open | Operational drill still needs to be performed. |
| WebSocket query-token fallback retirement | Open | Requires post-deploy telemetry review. |
