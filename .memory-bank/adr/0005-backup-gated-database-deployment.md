# ADR 0005: Use Checked-In Migrations And Backup-Gated Database Updates

- Status: Accepted
- Confidence: Verified
- Source: `agents/VERIFIED_WORKLOG.md`

## Context

Production database schema changes are high-risk and must be reproducible. Live `drizzle-kit push` is not an acceptable production schema path.

## Decision

Use checked-in Drizzle migrations for production database updates. Require a successful local backup gate before DB-changing update-time migration.

## Consequences

- `deploy/setup.sh` remains for new/empty DB bootstrap.
- `deploy/update.sh` must not apply DB-changing migrations without backup.
- Backup and restore scripts are part of the production safety boundary.

## Evidence

- `lib/db/drizzle/`
- `lib/db/package.json`
- `deploy/setup.sh`
- `deploy/update.sh`
- `deploy/backup.sh`
- `deploy/backup-restore.sh`
- `DEPLOYMENT.md`
