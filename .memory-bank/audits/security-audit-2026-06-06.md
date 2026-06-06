# Security Audit - 2026-06-06

## Scope

| Field | Value |
|---|---|
| Repository | GNNcab |
| Branch | `master` |
| Commit inspected | `f8fbb64` |
| Worktree state at audit start | Clean |
| Audit type | Static deep inspection plus local validation commands |
| Primary focus | Authentication, authorization, BOLA/IDOR, CSRF, WebSocket realtime, location privacy, payments, routing, deployment boundaries, dependency posture |

> [!IMPORTANT]
> This audit inspected the current repository state only. It did not perform dynamic penetration testing against a running deployment, database, browser session, or real external payment/routing provider.

## Validation Commands

| Command | Result | Notes |
|---|---|---|
| `corepack pnpm audit --prod` | Passed | No known production dependency vulnerabilities reported. |
| `corepack pnpm --filter @workspace/api-server run typecheck` | Passed | Backend TypeScript typecheck passed. |
| `corepack pnpm run typecheck` | Failed | Fails in `@workspace/mockup-sandbox` because `vite` types cannot be resolved and several plugin callback params are implicit `any`. |
| `corepack pnpm --filter @workspace/gnncab run typecheck` | Failed | Fails because `artifacts/gnncab/vite.config.ts` cannot resolve `vite` types. |
| Static pattern scan | Completed | Searched for token/localStorage, secret, password, dangerous HTML/eval/exec patterns. |

## Positive Controls Observed

| Area | Status | Evidence |
|---|---|---|
| CORS origin policy | Strong | `artifacts/api-server/src/app.ts:10-44` rejects missing, wildcard, malformed, or unsafe origins. |
| Browser session storage | Improved | `artifacts/api-server/src/lib/auth-cookie.ts:10-18` sets the auth cookie as HttpOnly and Secure in production. |
| CSRF protection | Present | `artifacts/api-server/src/middlewares/csrf.ts:7-38` requires a matching CSRF header for unsafe cookie-authenticated requests. |
| Request body size | Controlled | `artifacts/api-server/src/app.ts:62-64` limits JSON and urlencoded bodies to 1 MB. |
| Rate limiting | Present | `artifacts/api-server/src/app.ts:68-98` defines global, auth, and admin rate limits. |
| SQL injection posture | Good | Main query paths use Drizzle query builders and parameter binding. |
| Password hashing | Good | `artifacts/api-server/src/lib/password.ts:1-10` uses bcrypt with 12 salt rounds. |
| Production routing fail-closed | Good | `artifacts/api-server/src/lib/routing.ts:81-88` throws in production when OSRM is unavailable. |
| Seed script production guard | Good | `scripts/src/seed.ts:20-24` aborts when `NODE_ENV=production`. |

## Findings

### SEC-001 - Driver location WebSocket broadcast is overbroad

| Field | Value |
|---|---|
| Severity | High |
| Confidence | Verified |
| Area | Realtime location privacy / BOLA |
| Evidence | `artifacts/api-server/src/lib/websocket.ts:252-257`, `artifacts/api-server/src/lib/websocket.ts:373-377` |

Driver `LOCATION_UPDATE` messages are broadcast to every connected customer socket. The filter checks only `c.role === "customer"` and does not restrict delivery to the customer currently assigned to, or authorized for, the driver's active trip.

For a ride-hailing product, this is a material privacy boundary. Any authenticated customer could receive live driver location events for unrelated drivers if connected at the right time.

Recommended remediation:

1. Resolve active trip recipients before broadcasting driver location updates.
2. Send driver location only to the assigned trip customer, relevant admin/ops users, and optionally the driver themself.
3. Include trip id in the realtime payload and verify that recipient membership is current.
4. Apply the same recipient scoping when relaying Redis `DRIVER_LOCATION` events across workers.

### SEC-002 - Trip status broadcasts are overbroad by default

| Field | Value |
|---|---|
| Severity | High |
| Confidence | Verified |
| Area | Trip privacy / realtime BOLA |
| Evidence | `artifacts/api-server/src/lib/websocket.ts:315-338`, call sites such as `artifacts/api-server/src/routes/trips.ts:317`, `artifacts/api-server/src/routes/trips.ts:346`, `artifacts/api-server/src/routes/trips.ts:444` |

`broadcastTripUpdate` sends trip status updates to all connected clients when `recipientUserIds` is omitted. Most trip route call sites pass `undefined`, so unrelated authenticated users can receive trip ids and status transitions for trips they do not own.

Recommended remediation:

1. Make `recipientUserIds` required for non-admin trip events.
2. Compute recipients from the trip's `customerId`, assigned driver user id, and authorized admin/ops channels.
3. Fail closed when recipients cannot be resolved.
4. Add regression tests covering customer A not receiving customer B trip updates.

### SEC-003 - Public routing estimate endpoint accepts unbounded coordinates

| Field | Value |
|---|---|
| Severity | Medium |
| Confidence | Verified |
| Area | Input validation / backend resource protection |
| Evidence | `artifacts/api-server/src/routes/routing.ts:8-21` |

The trip creation route validates coordinate ranges, but `/api/routing/estimate` only checks that fields are numbers. It does not constrain latitude/longitude to valid ranges before calling `estimateRoute`.

Impact:

- Invalid coordinate values can be forwarded to OSRM.
- Extreme values can produce bad route provider behavior, noisy logs, or unnecessary backend work.
- The endpoint is authenticated, but still exposed to any logged-in role.

Recommended remediation:

1. Use `z.number().min(-90).max(90)` for latitudes.
2. Use `z.number().min(-180).max(180)` for longitudes.
3. Consider limiting this endpoint to customer/driver/admin roles explicitly and rate-limiting it separately if OSRM cost becomes material.

### SEC-004 - Auth responses still return bearer JWTs to browser clients

| Field | Value |
|---|---|
| Severity | Medium |
| Confidence | Verified |
| Area | Browser auth / token exposure |
| Evidence | `artifacts/api-server/src/routes/auth.ts:86-99`, `artifacts/api-server/src/routes/auth.ts:175-188` |

Login and register set the HttpOnly session cookie, but they also return the JWT in the JSON response. The frontend no longer stores the token, which is good, but the token still passes through browser JavaScript memory and developer tools responses.

This may be intentional for native/mobile compatibility, but it blurs the browser-vs-native contract.

Recommended remediation:

1. Split browser cookie login from native/mobile token login, or gate token response behind an explicit client type.
2. For browser/admin login, return only user/session metadata.
3. Keep native/mobile bearer issuance explicit and document refresh-token behavior before Flutter work begins.

### SEC-005 - CSRF middleware skips protection when both cookie and bearer header are present

| Field | Value |
|---|---|
| Severity | Medium |
| Confidence | Verified |
| Area | CSRF / mixed auth modes |
| Evidence | `artifacts/api-server/src/middlewares/csrf.ts:13-18`, `artifacts/api-server/src/middlewares/auth.ts:17-20` |

The CSRF middleware bypasses checks whenever an `Authorization: Bearer ...` header exists. The auth middleware then prefers bearer token over cookie token. This is reasonable for native clients, but it means a browser context that can add an Authorization header bypasses CSRF even if cookies are also present.

This is not immediately exploitable by ordinary cross-site form or image requests because custom Authorization headers trigger CORS preflight. It still deserves a clearer policy before production.

Recommended remediation:

1. Treat browser origins and bearer auth as separate modes.
2. If `Origin` is present and a session cookie is present, require CSRF regardless of bearer header unless the endpoint is explicitly native-only.
3. Add tests for mixed cookie plus bearer requests.

### SEC-006 - CSP allows inline scripts and inline styles

| Field | Value |
|---|---|
| Severity | Medium |
| Confidence | Verified |
| Area | XSS hardening / deployment |
| Evidence | `deploy/nginx.conf:52-58` |

The Nginx Content Security Policy includes `script-src 'self' 'unsafe-inline'` and `style-src 'self' 'unsafe-inline'`. This weakens XSS defense-in-depth, especially for an admin panel that handles operational data.

Recommended remediation:

1. Remove `unsafe-inline` from `script-src`.
2. Use nonces or hashed inline scripts if any are truly required.
3. Keep `style-src 'unsafe-inline'` only if Tailwind/runtime styling requires it, and document why.
4. Verify the Vite build works with the stricter policy.

### SEC-007 - Frontend and full workspace typecheck currently fail

| Field | Value |
|---|---|
| Severity | Medium |
| Confidence | Verified |
| Area | Release hygiene / supply-chain confidence |
| Evidence | `corepack pnpm run typecheck`, `corepack pnpm --filter @workspace/gnncab run typecheck` |

The backend typecheck passes, but the full workspace typecheck fails due Vite type resolution in `@workspace/mockup-sandbox`, and the admin/frontend package typecheck fails because `vite` types cannot be resolved from `artifacts/gnncab/vite.config.ts`.

This is not a direct runtime vulnerability, but it reduces confidence in production readiness and can mask future security-sensitive regressions.

Recommended remediation:

1. Fix workspace dependency/catalog resolution for Vite types.
2. Decide whether `mockup-sandbox` should be part of release validation.
3. Make the release validation command deterministic and documented.

### SEC-008 - Stale frontend requirements doc still says JWT is stored in localStorage

| Field | Value |
|---|---|
| Severity | Low |
| Confidence | Verified |
| Area | Documentation drift / agent drift |
| Evidence | `artifacts/gnncab/requirements.yaml:22-25` |

The code has moved away from localStorage JWT storage, but `requirements.yaml` still says the JWT is stored in localStorage and attached by the fetch interceptor.

Impact:

- Future agents or developers may reintroduce the old browser-token pattern.
- Security documentation becomes less trustworthy.

Recommended remediation:

1. Update `requirements.yaml` to describe HttpOnly cookie auth and CSRF header behavior.
2. Add a short browser auth contract to `.specs/boundary-conditions.md`.

## Production Readiness Assessment

| Area | Assessment |
|---|---|
| Backend auth base | Promising, but not production-final until browser/native token contracts are split. |
| Admin/frontend auth | Improved, but frontend typecheck and stale docs must be cleaned up. |
| Realtime/location privacy | Not production-ready. SEC-001 and SEC-002 should block launch. |
| Payment model | Admin-only refund path and owner read checks exist, but no external payment provider integration was observed in this audit. Treat payment as simulated/internal until proven otherwise. |
| Routing | Production fail-closed OSRM posture is good, but route estimate input validation should be tightened. |
| Deployment hardening | Nginx has good TLS/HSTS/rate-limit shape, but CSP should be made stricter. |
| Dependency vulnerabilities | No known production vulnerabilities reported by `pnpm audit --prod`. |

## Recommended Fix Order

1. Fix WebSocket recipient scoping for driver location events.
2. Fix trip status broadcast recipient scoping.
3. Add coordinate bounds to `/api/routing/estimate`.
4. Split browser cookie auth from native/mobile bearer token issuance.
5. Clarify mixed cookie/bearer CSRF policy and add tests.
6. Fix frontend/workspace typecheck failures.
7. Tighten CSP and verify the built admin app under the stricter policy.
8. Update stale frontend requirements documentation.

## Notes For Next Audit

- Run dynamic BOLA tests with at least two customers, one driver, and one admin.
- Add WebSocket integration tests that assert unrelated users receive no trip/location payloads.
- Re-run dependency audit after any package updates.
- Verify deployment with real `ALLOWED_ORIGINS`, `AUTH_COOKIE_DOMAIN`, TLS, and Cloudflare/DigitalOcean topology.
