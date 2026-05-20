# ADR 0007: Treat Mobile App As Flutter Client Surface

- Status: Proposed
- Confidence: Inferred
- Source: User direction in project conversation, `agents/ARCHITECTURE_NOTES.md`

## Context

The current repository does not contain a Flutter app. The product direction is to support passengers and drivers through a native mobile app while keeping backend and admin/frontend responsibilities separate.

## Decision

Plan the mobile app as a future Flutter client that consumes `api.gnncab.com` and uses Firebase services for push notifications, crash reporting, and analytics.

## Consequences

- The absence of current mobile code is not a blocker for backend/admin stabilization.
- API contracts, authentication, trip state transitions, realtime tracking, and payment flows must be designed to support native mobile clients.
- Mobile implementation should not require a backend rewrite.

## Evidence

- `agents/ARCHITECTURE_NOTES.md`
- `agents/DECISIONS.md`

## Review Note

This ADR is proposed because the app implementation is not yet present in the repository.
