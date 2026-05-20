# Constitution

## Purpose

Define the durable engineering rules for GNNcab.

## Language

All repository files must be written in English:

- source code
- comments
- documentation
- configuration
- commit messages

Turkish is reserved for conversation with the project owner.

## Engineering Priorities

1. Security
2. Production stability
3. Correctness
4. Minimal change scope
5. Maintainability

## Architecture Rules

- Do not rebuild the project from scratch.
- Do not replace working systems without explicit instruction.
- Preserve the backend-first monorepo during stabilization.
- Treat deployment files as product code.
- Keep `release/` as generated output only.
- Treat future Flutter work as a client-surface addition, not a backend rewrite trigger.

## Change Discipline

- Prefer the smallest safe fix.
- Avoid opportunistic refactors.
- Do not widen a task without user approval.
- Never stage the entire worktree.
- Never stage unrelated user changes.
- Keep one logical change per commit.

## Deployment Discipline

Any change affecting runtime behavior, environment variables, ports, paths, WebSocket behavior, build output, database, process model, or production dependency must review:

- `deploy/`
- `DEPLOYMENT.md`
- `.env.example`

## Validation Discipline

Security-sensitive or runtime-impacting changes must be validated with targeted checks where possible. If validation cannot run, record the reason and do not claim success.

## UI And App Discipline

- Admin frontend should remain operational, dense, and work-focused.
- Passenger/driver mobile work should prioritize reliability, realtime clarity, payment safety, and privacy.
- Do not hide critical operational state behind decorative UI.
