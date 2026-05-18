# ARCHITECTURE_NOTES

Last updated: 2026-05-18

## 1) Purpose of this document

Capture non-blocking architectural observations for future planning without changing current stabilization priorities, task order, or active workflow.

## 2) Dispatch Engine Observation

The current dispatch engine is process-centric.

- Dispatch orchestration depends on a single running process.
- Restart continuity is repaired through boot-time recovery logic.
- Safe horizontal scaling requires Redis/pubsub before cluster mode can be enabled.

## 3) Current Safe Operating Model

The current model is stable for present scale and operating assumptions:

- Production default is single-worker safe mode.
- Boot-time cleanup and continuity recovery protect restart-sensitive dispatch paths.
- This observation is not a bug report and does not indicate current instability.

## 4) Potential Future Evolution

If scale or availability requirements increase, likely evolution paths include:

- Making cross-worker realtime guarantees explicit with Redis/pubsub and validated operational wiring.
- Moving more dispatch continuity from process-local timers toward durable orchestration primitives.

These are future architecture considerations, not current implementation requests.

## 5) Why this is NOT a current task

- The current stabilization lane is production hardening and verified risk reduction, not architecture redesign.
- No immediate runtime blocker requires widening scope now.
- Recording this note preserves context for future architecture work while keeping current execution disciplined.

## 6) Candidate Public Deployment Topology

Future product deployment can be split by responsibility:

```text
api.gnncab.com
  -> DigitalOcean backend

admin.gnncab.com
  -> Cloudflare Pages/Workers static frontend

www.gnncab.com
  -> Cloudflare landing page

app.gnncab.com
  -> mobile deep links / app download page / maybe web fallback

Flutter app
  -> talks to api.gnncab.com
  -> uses Firebase FCM/Crashlytics/Analytics
```

This is a candidate future topology, not a current deploy requirement.

The important boundary is that the backend remains the stateful system core on DigitalOcean, while Cloudflare is used for DNS/CDN/static frontend surfaces and small edge behavior. The mobile app is distributed through mobile app stores; Cloudflare can host app-facing web/deep-link/download pages, not the native app binary itself.
