# Pipeline

## Current State

| Area | Status | Confidence | Evidence |
|---|---|---|---|
| Branch | `master`, ahead of `origin/master` by 5 commits | Verified | `git status --short --branch` |
| Worktree at current slice | Dirty with auth hardening changes pending commit | Verified | `git status --short --branch` |
| Production blockers | Closed at patch/content level | Verified | `agents/SESSION_SNAPSHOT.md` |
| Current phase | Phase 1 stabilization and production runtime hardening | Verified | `agents/SESSION_STATE.md` |
| Mobile app | Planned as Flutter, not yet implemented in repo | Verified / Inferred | No `pubspec.yaml`; candidate topology docs |

## Immediate Next Actions

1. Deepen backend health/readiness beyond the current shallow health endpoint. Completed: `/api/livez` and `/api/readyz` were added alongside the existing `/api/healthz` summary.
2. Fix backend typecheck issues in narrow domain-safe slices. Completed: backend typecheck now passes.
3. Fix admin/frontend typecheck issues after backend domain contract is clarified. Completed: full workspace typecheck now passes.
4. Re-check `.env.example` and deploy-facing guidance against current runtime truth. Completed: API bootstrap now loads `.env` before runtime modules, `.env.example` no longer advertises unsupported dispatch tuning variables, and deployment guidance documents current env/runtime expectations.

## High-Risk Follow-Up

| Item | Status | Notes |
|---|---|---|
| LocalStorage JWT / XSS posture | Mitigated | Browser auth now uses HttpOnly cookie session with CSRF protection for cookie-authenticated unsafe requests; remaining work is token lifetime and native/mobile auth policy. |
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
- Decide remaining auth policy: token lifetime and native/mobile bearer/refresh-token strategy.

## Suggested Validation Plan

| Command | Purpose | Status |
|---|---|---|
| `corepack pnpm run typecheck` | Workspace typecheck | Passed on 2026-05-20. |
| `corepack pnpm --filter @workspace/api-server run typecheck` | Backend typecheck | Passed on 2026-05-20. |
| Backend targeted typecheck | Validate backend fixes | Run after backend changes. |
| Frontend targeted typecheck | Validate admin/frontend fixes | Run after frontend changes. |
| Deploy shell checks | Validate deployment script edits | Run after deploy changes. |
| `corepack pnpm run typecheck` | Workspace typecheck after env/deploy alignment | Passed on 2026-05-20. |
| `corepack pnpm run typecheck` | Workspace typecheck after browser cookie auth and CSRF changes | Passed on 2026-05-20. |
