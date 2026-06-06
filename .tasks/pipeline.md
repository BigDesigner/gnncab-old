# Pipeline

## Current State

| Area | Status | Confidence | Evidence |
|---|---|---|---|
| Branch | `master`, ahead of `origin/master` by 9 commits | Verified | `git status --short --branch` |
| Worktree at current slice | Clean, security audit remediations committed | Verified | `git status --short --branch` |
| Production blockers | Closed completely | Verified | `walkthrough.md` |
| Current phase | Security hardening and production readiness complete | Verified | `verified-worklog.md` |
| Mobile app | Planned as Flutter, not yet implemented in repo | Verified / Inferred | No `pubspec.yaml`; candidate topology docs |

## Immediate Next Actions

1. Deepen backend health/readiness beyond the current shallow health endpoint. Completed: `/api/livez` and `/api/readyz` were added.
2. Fix backend typecheck issues. Completed: backend typecheck now passes.
3. Fix admin/frontend typecheck issues. Completed: full workspace typecheck now passes.
4. Re-check `.env.example` and deploy-facing guidance. Completed: API bootstrap updates and env example alignment completed.
5. Resolve dependency security vulnerabilities. Completed: Configured catalogs and overrides in `pnpm-workspace.yaml` to achieve 0 vulnerabilities.
6. Run deep inspect security audit. Completed: Performed comprehensive manual and automated security review, resulting in `.memory-bank/audits/deep-security-inspection.md`.
7. Clean up and migrate legacy `agents/` directory. Completed: Relocated necessary active documents to `.agents/` and archived all files under `.archive/agents-backup/` before removing the root directory.
8. Implement security audit remediations. Completed: Fixed WebSocket driver location scoping, trip status broadcast leakage, coordinate bounds, cookie/bearer auth split, CSRF bypass, Nginx CSP, and TS compilation warnings.

## High-Risk Follow-Up

| Item | Status | Notes |
|---|---|---|
| LocalStorage JWT / XSS posture | Closed | Browser auth uses HttpOnly cookie session and CSRF. Plaintext JWT token is masked to browser clients. |
| Backup/restore operational drill | Open | Scripts are hardened, but drill is still needed. |
| WebSocket fallback telemetry review | Open | Required before final query-token fallback retirement. |
| Long-term realtime scaling direction | Open | Single-worker vs Redis-backed cluster mode. |
| Flutter app planning | Open | API, auth, trip state, payment, and location contracts must be explicit first. |
| US distance units | Closed | Distance fields, calculations, API schemas, DB schema, and frontend display now use miles. |

## Backlog

- Create Flutter app workspace when mobile scope begins.
- Add app-facing deep link/download page strategy for `app.gnncab.com`.
- Decide Cloudflare Pages/Workers split for admin/public web surfaces.
- Define release-readiness checklist for first production deployment.

## Suggested Validation Plan

| Command | Purpose | Status |
|---|---|---|
| `corepack pnpm run typecheck` | Workspace typecheck | Passed on 2026-05-20. |
| `corepack pnpm --filter @workspace/api-server run typecheck` | Backend typecheck | Passed on 2026-05-20. |
| `corepack pnpm run typecheck` | Workspace typecheck after env/deploy alignment | Passed on 2026-05-20. |
| `corepack pnpm run typecheck` | Workspace typecheck after browser cookie auth and CSRF changes | Passed on 2026-05-20. |
| `pnpm audit` | Check dependency vulnerabilities | Passed on 2026-05-30 (0 vulnerabilities). |
| `corepack pnpm run typecheck` | Workspace typecheck after dependency updates | Passed on 2026-05-30. |
| `corepack pnpm run typecheck` | Workspace typecheck after security audit fixes | Passed on 2026-06-06. |
| `corepack pnpm run build` | Validate production bundle compilation | Passed on 2026-06-06. |
| `corepack pnpm audit --prod` | Verify production dependencies safety | Passed on 2026-06-06. |
