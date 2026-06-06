# Migration Map

## Purpose

Track how existing GNNcab documentation maps into the new memory-bank structure.

> [!IMPORTANT]
> The active `agents/` directory has been successfully moved to the new hidden folder structure (`.agents/`, `.memory-bank/`, `.specs/`, `.tasks/`). All original legacy files are safely archived under `.archive/agents-backup/`.


| Original Path (Legacy) | New Path | Archive Path | Action | Notes |
|---|---|---|---|---|
| `agents/BOOTSTRAP.md` | `.specs/bootstrap.md`, `.tasks/pipeline.md` | `.archive/agents-backup/BOOTSTRAP.md` | Moved / Archived | Active bootstrap state was summarized; original file removed from root. |
| `agents/STANDARD.md` | `.specs/constitution.md`, `.specs/boundary-conditions.md` | `.archive/agents-backup/STANDARD.md` | Moved / Archived | Engineering, language, security, and dispatch rules carried forward. |
| `agents/AGENTS.md` | `.specs/constitution.md`, `.memory-bank/system-coherence.md` | `.archive/agents-backup/AGENTS.md` | Moved / Archived | Agent operating rules and deployment responsibility preserved. |
| `agents/DECISIONS.md` | `.memory-bank/adr/0001` through `0008` | `.archive/agents-backup/DECISIONS.md` | Moved / Archived | Key decisions were split into separate ADR files. |
| `agents/ARCHITECTURE_NOTES.md` | `.memory-bank/adr/0006-candidate-public-deployment-topology.md`, `.specs/boundary-conditions.md` | `.archive/agents-backup/ARCHITECTURE_NOTES.md` | Moved / Archived | Candidate topology and dispatch scaling notes preserved. |
| `agents/VERIFIED_WORKLOG.md` | `.memory-bank/changelog/verified-worklog.md` | `.archive/agents-backup/VERIFIED_WORKLOG.md` | Moved / Archived | Historical verified work was fully indexed. |
| `agents/NEXT_ACTIONS.md` | `.tasks/pipeline.md`, `.memory-bank/bugs/bug-list.md` | `.archive/agents-backup/NEXT_ACTIONS.md` | Moved / Archived | Next actions and backlog checklist items migrated. |
| `agents/SESSION_STATE.md` | `.tasks/pipeline.md`, `.tasks/handoff.md` | `.archive/agents-backup/SESSION_STATE.md` | Moved / Archived | Current project state and active risks summarized. |
| `agents/SESSION_SNAPSHOT.md` | `.tasks/handoff.md`, `.tasks/pipeline.md` | `.archive/agents-backup/SESSION_SNAPSHOT.md` | Moved / Archived | Boot and handoff state preserved. |
| `agents/AI_GUARDRAILS.md` | `.specs/constitution.md`, `.specs/boundary-conditions.md` | `.archive/agents-backup/AI_GUARDRAILS.md` | Moved / Archived | Core AI constraint rules carried forward. |
| `agents/AI_PIPELINE.md` | `.agents/ai-pipeline.md` | `.archive/agents-backup/AI_PIPELINE.md` | Relocated / Recreated | Updated development workflow for active agents. |
| `agents/CHATGPT_NEW_CHAT_PROTOCOL.md` | `.agents/new-chat-protocol.md` | `.archive/agents-backup/CHATGPT_NEW_CHAT_PROTOCOL.md` | Relocated / Recreated | Updated bootstrap contract for fresh chat sessions. |
| `DEPLOYMENT.md` | `.specs/bootstrap.md`, `.specs/boundary-conditions.md` | Not applicable | Linked / Left in place | Deployment guide remains in the repository root. |

