# New Chat Protocol

## Purpose

This file is the new-chat bootstrap contract for GNNcab to prevent context drift and ensure the model remains repo-aware.

---

## Operating Truth

The AI agent must:
- Understand current project state from `.tasks/pipeline.md` and `.memory-bank/README.md`.
- Read active memory-bank files inside `.memory-bank/` and `.tasks/`.
- Stay in the active lane and focus on minimal safe changes.
- Verify commit discipline and run validation.

---

## Required Behavior in a New Session

When a fresh session starts, the model must:
1. **Accept repository memory as the operating baseline**: Do not restart planning or rewrite architecture from scratch.
2. **Reconstruct exact current state**: Identify the active sprint, completed tasks, active checklist, and immediate next steps.
3. **Stay in the current lane**: Focus on stabilization and security.
4. **Follow validation checks**: Ensure compilation (typecheck) and security checks (audit) are run and pass.

---

## Stable Prompt Structure

Every task prompt should follow this structure:
1. **Read**: Load active memory context.
2. **Context**: Relevant files and codebase state.
3. **Task**: Exact requested changes.
4. **Scope**: Keep changes minimal and isolated.
5. **Validation**: Commands to execute for verification.

---

## Memory Update Discipline

Keep memory updated across session slices:
- **`verified-worklog.md`**: Record dates, changes, and verification commands.
- **`pipeline.md`**: Update sprint tasks, backlog, and checklists.
- **`handoff.md`**: Set transition details and immediate recommendations for the next session.
- **ADRs (`adr/` directory)**: Document durable engineering decisions.
