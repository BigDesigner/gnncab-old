# ADR 0001: Preserve Backend-First Monorepo During Stabilization

- Status: Accepted
- Confidence: Verified
- Source: `agents/DECISIONS.md`

## Context

GNNcab is currently a backend-first TypeScript monorepo with an Express API, WebSocket realtime flows, Drizzle/PostgreSQL persistence, deploy scripts, and a React/Vite admin/frontend surface.

## Decision

Preserve the existing backend-first monorepo architecture during stabilization. Prefer narrow production-safety fixes over refactors or rebuilds.

## Consequences

- Do not replace the current system with a new scaffold.
- Keep backend, deploy, database, and frontend changes tightly scoped.
- Treat a future Flutter app as a new client surface, not as a reason to rewrite the backend.

## Evidence

- `agents/DECISIONS.md`
- `agents/STANDARD.md`
- `package.json`
- `artifacts/api-server/package.json`
- `artifacts/gnncab/package.json`
- `lib/db/package.json`
