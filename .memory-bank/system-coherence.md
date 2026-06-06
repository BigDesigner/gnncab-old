# System Coherence

## Purpose

This document defines how humans and AI agents should preserve project memory, avoid context drift, and keep GNNcab changes safe.

> [!IMPORTANT]
> The legacy `agents/` directory has been archived. All active memory-bank files are located in `.memory-bank/`, `.tasks/`, and `.specs/`. Historical files are archived under `.archive/agents-backup/`.

## Session Start Protocol

1. Check the current branch and worktree state.
2. Read `.memory-bank/active-session.json`.
3. Read `.tasks/pipeline.md` for the current next action.
4. Use `.archive/agents-backup/SESSION_SNAPSHOT.md` and `.archive/agents-backup/BOOTSTRAP.md` when deeper historical continuity is needed.
5. Confirm that the requested work is compatible with the current stabilization lane.


## Scope Discipline

- Preserve the backend-first monorepo architecture unless the user explicitly asks for architectural change.
- Do not widen health, deployment, auth, realtime, or dispatch work into a redesign without approval.
- Keep application source changes separate from documentation-memory changes.

## Pre-Change Checklist

| Check | Required Action |
|---|---|
| Branch | Confirm the current branch before edits. |
| Worktree | Inspect dirty files and avoid staging unrelated user changes. |
| Source of truth | Prefer repository code/config over old notes when they disagree. |
| Deployment impact | Review `deploy/` and `DEPLOYMENT.md` when runtime behavior changes. |

## Post-Change Checklist

| Check | Required Action |
|---|---|
| Memory | Update `.tasks/pipeline.md` or `.memory-bank/bugs/bug-list.md` when state changes. |
| Validation | Record suggested or executed checks. |
| Git | Stage and commit only with explicit user approval. |
| Handoff | Update `.tasks/handoff.md` at meaningful handoff points. |

## Unconfirmed Decision Protocol

If information is `Unconfirmed` and affects architecture, security, deployment, payments, location privacy, realtime tracking, or public API behavior, ask the user before turning it into an accepted decision.

For lower-risk facts, mark them as `Unconfirmed` and continue.

## Ride-Hailing Safety Focus

GNNcab includes passenger-driver dispatch, realtime location, payment-facing flows, admin operations, and production deployment concerns. Any change in these areas must be treated as high-risk until verified.
