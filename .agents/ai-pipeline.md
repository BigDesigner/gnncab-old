# AI Pipeline

Last updated: 2026-05-30 (Migrated to `.agents/ai-pipeline.md`)

## Purpose

Define the official AI-assisted development workflow for this repository so sessions remain consistent, auditable, and production-safe.

## Model Usage Policy

- Use a high-capability coding model for repository analysis, patching, and validation-critical tasks.
- Use smaller/faster models only for low-risk formatting or drafting work that does not decide runtime behavior.
- Do not treat model output as truth; repository state and executed verification are the source of truth.

## Operational Stages

### 1) SESSION BOOT

- Read active project state from `.tasks/pipeline.md` and `.memory-bank/README.md`.
- Confirm current task, known safe baseline, open work, and dirty-worktree constraints.
- Do not assume unstaged files belong to current scope.

### 2) ANALYSIS

- Inspect only the files needed for the requested task.
- Identify exact risk, affected runtime path, and minimal safe change surface.
- Prefer narrow stabilization over redesign.

### 3) PATCH

- Implement the smallest safe change that satisfies the task.
- Keep architecture intact unless explicitly requested otherwise.
- Avoid opportunistic cleanup and unrelated edits.

### 4) PATCH REVIEW

- Re-read changed files and confirm behavior against requirements.
- Verify no forbidden broadening (scope, architecture, unrelated files).
- Confirm security and production constraints are preserved.

### 5) VALIDATION

- Run the narrowest relevant checks (for example targeted TypeScript/project checks).
- Mark work as complete only when verification is actually run and passes.
- If verification cannot be run, state it explicitly.

### 6) MEMORY UPDATE

- Update `.memory-bank/changelog/verified-worklog.md` and other relevant `.memory-bank/` files with verified outcomes.
- Keep next task explicit, narrow, and production-oriented.

### 7) COMMIT

- Stage only task-scope files; never use broad staging commands like `git add .` on dirty worktrees.
- Verify staged file list before commit (`git diff --cached --name-only`).
- Create one logical commit per stabilization slice.

### 8) SESSION SNAPSHOT

- Update `.tasks/handoff.md` and `.tasks/pipeline.md` at meaningful handoff points so the next operator can continue cleanly.

## Operational Guardrails

- Security and production stability take priority over speed.
- No wildcard browser-origin behavior in production hardening paths.
- Keep compatibility fallbacks explicit and temporary.
- Generated output under `release/` is ignored during normal review and repository analysis unless explicitly requested.
- Do not use destructive git/file actions unless explicitly requested.
- Do not revert unrelated user changes.
