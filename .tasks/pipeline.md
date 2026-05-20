# Pipeline

## Current State

| Area | Status | Confidence | Evidence |
|---|---|---|---|
| Branch | `master`, ahead of `origin/master` by 2 commits | Verified | `git status --short --branch` |
| Worktree at start | Clean | Verified | `git status --short --branch` |
| Production blockers | Closed at patch/content level | Verified | `agents/SESSION_SNAPSHOT.md` |
| Current phase | Phase 1 stabilization and production runtime hardening | Verified | `agents/SESSION_STATE.md` |
| Mobile app | Planned as Flutter, not yet implemented in repo | Verified / Inferred | No `pubspec.yaml`; candidate topology docs |

## Immediate Next Actions

1. Deepen backend health/readiness beyond the current shallow health endpoint. Completed: `/api/livez` and `/api/readyz` were added alongside the existing `/api/healthz` summary.
2. Fix backend typecheck issues in narrow domain-safe slices. Completed: backend typecheck now passes.
3. Fix admin/frontend typecheck issues after backend domain contract is clarified. Completed: full workspace typecheck now passes.
4. Re-check `.env.example` and deploy-facing guidance against current runtime truth.

## High-Risk Follow-Up

| Item | Status | Notes |
|---|---|---|
| LocalStorage JWT / XSS posture | Open | Review before production launch. |
| Backup/restore operational drill | Open | Scripts are hardened, but drill is still needed. |
| WebSocket fallback telemetry review | Open | Required before final query-token fallback retirement. |
| Long-term realtime scaling direction | Open | Single-worker vs Redis-backed cluster mode. |
| Flutter app planning | Open | API, auth, trip state, payment, and location contracts must be explicit first. |

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
| Backend targeted typecheck | Validate backend fixes | Run after backend changes. |
| Frontend targeted typecheck | Validate admin/frontend fixes | Run after frontend changes. |
| Deploy shell checks | Validate deployment script edits | Run after deploy changes. |
