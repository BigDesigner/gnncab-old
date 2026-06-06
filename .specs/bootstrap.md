# Bootstrap

## Repository Summary

| Field | Value | Confidence | Evidence |
|---|---|---|---|
| Project | GNNcab ride-hailing / local transportation dispatch platform | Verified | `.archive/agents-backup/TASK.md`, `.specs/constitution.md` |
| Package manager | pnpm via Corepack | Verified | `package.json`, `pnpm-workspace.yaml`, `.npmrc` |
| Backend | Node.js, TypeScript, Express | Verified | `artifacts/api-server/package.json`, `.specs/constitution.md` |
| Admin/frontend | React + Vite | Verified | `artifacts/gnncab/package.json` |
| Database | PostgreSQL with Drizzle | Verified | `lib/db/package.json`, `lib/db/drizzle/` |
| Realtime | WebSocket | Verified | `.specs/constitution.md`, `artifacts/api-server/src/lib/websocket.ts` |
| Mobile app | Future Flutter client | Inferred | `.archive/agents-backup/ARCHITECTURE_NOTES.md`, project direction |
| Deployment target | DigitalOcean Ubuntu VM with Nginx, PM2, PostgreSQL | Verified | `DEPLOYMENT.md`, `deploy/` |

## Setup Commands

| Command | Purpose | Confidence | Notes |
|---|---|---|---|
| `corepack pnpm install --frozen-lockfile` | Install workspace dependencies | Verified | Use `--no-frozen-lockfile` only when intentionally updating the lockfile. |
| `corepack pnpm run typecheck` | Run root typecheck across libs, artifacts, and scripts | Verified | Currently reaches known app type errors. |
| `corepack pnpm run build` | Run typecheck and package build scripts | Verified | Depends on typecheck health. |

## Local Development

| Surface | Command | Confidence | Notes |
|---|---|---|---|
| Admin/frontend | `corepack pnpm --filter ./artifacts/gnncab run dev` | Verified | Vite serves the admin/frontend app. |
| Backend | `corepack pnpm --filter ./artifacts/api-server run dev` | Verified | Requires environment variables and database availability for healthy runtime. |
| Scripts | `corepack pnpm --filter @workspace/scripts run typecheck` | Verified | Used by production admin bootstrap and seed tooling. |

## Environment

| Area | Confidence | Notes |
|---|---|---|
| Production env template | Verified | `.env.example` and `DEPLOYMENT.md` document required runtime configuration. |
| Routing | Verified | Production must use explicit OSRM configuration. |
| Allowed origins | Verified | Production must fail closed without explicit safe origins. |
| Database | Verified | PostgreSQL is required for backend health and startup cleanup. |

## Deployment

| Area | Confidence | Notes |
|---|---|---|
| Setup | Verified | `deploy/setup.sh` handles new/empty DB bootstrap only. |
| Update | Verified | `deploy/update.sh` requires backup-gated DB migration path. |
| Process manager | Verified | PM2 defaults to single-worker safe mode. |
| Reverse proxy | Verified | Nginx config lives under `deploy/`. |
| Backup/restore | Verified | `deploy/backup.sh` and `deploy/backup-restore.sh` are maintained product files. |

## Suggested Validation Commands

| Command | Purpose | Requires Installed Tool | Notes |
|---|---|---|---|
| `corepack pnpm run typecheck` | TypeScript workspace validation | Node.js, Corepack, pnpm | Known failures are tracked in `.memory-bank/bugs/bug-list.md`. |
| `corepack pnpm run build` | Build validation | Node.js, Corepack, pnpm | Blocked until typecheck is clean. |
| `bash -n deploy/setup.sh deploy/update.sh deploy/backup.sh deploy/backup-restore.sh` | Shell syntax validation | Linux bash | Previously verified on Ubuntu, rerun after shell edits. |
| `shellcheck deploy/*.sh` | Shell static analysis | shellcheck | Previously clean for patched target files. |
