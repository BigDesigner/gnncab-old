# ADR 0006: Candidate Public Deployment Topology

- Status: Proposed
- Confidence: Verified
- Source: `agents/ARCHITECTURE_NOTES.md`, `agents/DECISIONS.md`

## Context

GNNcab is expected to have a stateful backend, an admin frontend, public web surfaces, mobile app deep links/download pages, and a native mobile app.

## Decision

Treat the following as the candidate future topology:

| Surface | Candidate Host |
|---|---|
| `api.gnncab.com` | DigitalOcean backend |
| `admin.gnncab.com` | Cloudflare Pages/Workers static frontend |
| `www.gnncab.com` | Cloudflare landing page |
| `app.gnncab.com` | Mobile deep links, app download page, possible web fallback |
| Flutter app | Talks to `api.gnncab.com`; uses Firebase FCM, Crashlytics, and Analytics |

## Consequences

- Backend remains the stateful system core.
- Cloudflare is preferred for static/public web surfaces and small edge behavior.
- The native app should be distributed through app stores, not hosted as a Worker.

## Evidence

- `agents/ARCHITECTURE_NOTES.md`
- `agents/DECISIONS.md`
