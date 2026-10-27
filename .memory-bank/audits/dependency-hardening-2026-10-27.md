# Dependency Hardening - 2026-10-27

## Scope

Baseline: `e8b0c8d`, branch `master`, clean worktree. Inspected nine workspace manifests, catalog, overrides, lockfile and deployment setup. Tested on Windows with Node 24.14.0 and pnpm 10.32.1. Versions and advisories were queried from npm on this date.

## Results

| Check | Before | After |
|---|---|---|
| Full audit | 73 advisories: 12 critical, 32 high, 22 moderate, 7 low | Zero advisories, no exclusions |
| Production audit | Not separately captured | Zero advisories |
| Frozen lockfile installation | Initial ws override mismatch found | Passed after alignment |
| Workspace typecheck and all production builds | Checked after updates | Passed |
| Native bcrypt and Drizzle/Zod smoke tests | Added | 3 passed |
| React Query and Zod code generation | Added isolated smoke config | Passed without warnings |

## Changes

- Pinned pnpm 10.32.1 in packageManager, engines, deploy setup and CI. Declared Node 24 runtime range and aligned Node types to major 24.
- Updated compatible workspace dependencies including Express, React 19, React Query 5, Drizzle, pg, ws, ioredis, Radix, Tailwind and build tooling. Exact resolutions are recorded in pnpm-lock.yaml.
- Upgraded Orval to 8.45.0, Vite to 7.3.7, esbuild to 0.28.2 and Zod to 4.6.7. Adapted the trip metadata record signature for Zod 4.
- Removed platform package exclusions so optional native binaries can resolve on deployment platforms. Preserved the release-age gate.
- Explicitly allowed bcrypt's native installation script and removed unused build-script allowlist entries. pnpm enforcement no longer deletes alternate lockfiles.
- Made React Query v5 explicit in Orval config; corrected two nullable OpenAPI reference wrappers without changing their intended meaning.
- Added Windows/Linux CI for frozen installation, smoke tests, codegen, build and audit; weekly Dependabot configuration for npm and Actions. These become active after pushing and enabling Actions.

Sources: [Zod advisory](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5), [Orval advisory](https://github.com/advisories/GHSA-p4cg-3328-rvfg), [esbuild advisory](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr), [selector parser advisory](https://github.com/advisories/GHSA-rj75-hqrm-r3gf).

## Executed Commands

- `corepack pnpm install --frozen-lockfile`
- `corepack pnpm run build` (includes workspace typecheck)
- `corepack pnpm run test:dependencies`
- `corepack pnpm --filter @workspace/api-spec run codegen:check`
- `corepack pnpm audit --json`
- `corepack pnpm audit --prod --json`

## Remaining Work And Limits

- Recharts 2.15.4 is deprecated. Its v3 migration requires chart API and visual regression work; the current version has no reported advisories in this scan.
- pnpm 12, TypeScript 7, Vite 8/plugin-react 6, ioredis 6, date-fns 4, resolver 6, resizable-panels 4, lucide 1 and other major migrations remain separate compatibility work. pnpm 10 is the tested version, not the newest major.
- Admin build still emits a tooltip sourcemap warning and a roughly 700 kB chunk warning; builds succeed.
- Linux CI was prepared but not executed locally. No production DB, Redis, routing or payment integration was tested.
- Codegen smoke redirects output to ignored tmp/codegen-smoke using the real configuration. It exercises generation but does not compile temporary generated clients; checked-in clients pass workspace typecheck.
- Zero advisories is a dated registry result, not proof of application security. Authorization, concurrency, payments and location privacy still need integration tests.
