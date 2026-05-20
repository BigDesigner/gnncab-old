# Migration Map

## Purpose

Track how existing GNNcab documentation maps into the new memory-bank structure.

> [!IMPORTANT]
> No existing documentation was deleted or archived during this restructuring. The active `agents/` directory remains in place as historical and operational memory.

| Original Path | New Path | Archive Path | Action | Notes |
|---|---|---|---|---|
| `agents/BOOTSTRAP.md` | `.specs/bootstrap.md`, `.tasks/pipeline.md` | Not applicable | Summarized / Left in place | Active bootstrap state was summarized while preserving the original file. |
| `agents/STANDARD.md` | `.specs/constitution.md`, `.specs/boundary-conditions.md` | Not applicable | Summarized / Left in place | Engineering, language, security, and dispatch-zone rules were carried forward. |
| `agents/AGENTS.md` | `.specs/constitution.md`, `.memory-bank/system-coherence.md` | Not applicable | Summarized / Left in place | Agent operating rules and deployment responsibility were preserved. |
| `agents/DECISIONS.md` | `.memory-bank/adr/*.md` | Not applicable | Migrated / Left in place | Key decisions were split into ADR files. |
| `agents/ARCHITECTURE_NOTES.md` | `.memory-bank/adr/0006-candidate-public-deployment-topology.md`, `.specs/boundary-conditions.md` | Not applicable | Summarized / Left in place | Candidate topology and dispatch scaling notes were preserved. |
| `agents/VERIFIED_WORKLOG.md` | `.memory-bank/changelog/verified-worklog.md` | Not applicable | Summarized / Left in place | Historical verified work was indexed without moving the source file. |
| `agents/NEXT_ACTIONS.md` | `.tasks/pipeline.md`, `.memory-bank/bugs/bug-list.md` | Not applicable | Summarized / Left in place | Current next task and high-risk follow-ups were copied forward. |
| `agents/SESSION_STATE.md` | `.tasks/pipeline.md`, `.tasks/handoff.md` | Not applicable | Summarized / Left in place | Current project state and risks were summarized. |
| `agents/SESSION_SNAPSHOT.md` | `.tasks/handoff.md`, `.tasks/pipeline.md` | Not applicable | Summarized / Left in place | Handoff-ready state was preserved. |
| `DEPLOYMENT.md` | `.specs/bootstrap.md`, `.specs/boundary-conditions.md` | Not applicable | Linked / Left in place | Deployment guide remains the detailed operational source. |
