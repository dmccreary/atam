# Session Log — caching-tactic-explorer

**Date:** 2026-06-03
**Chapter:** 9 — Architectural Tactics and Principles
**Library:** p5.js (live simulation)
**Bloom level:** Apply (L3) — *Use*
**Final validation:** 98/100 (Grade A) · Playwright control-visibility: PASS

## What it does

A live cache simulation. A strategy selector switches between Write-Through,
Write-Behind, and Cache-Aside. A request stream (80% reads, 20% writes) shows
each operation colored by hit (green) / miss (yellow) / write (red) with its
latency; a cache-state panel lists entries with TTL freshness bars (orange when
stale); a metrics panel shows hit rate, average latency (against the 5ms-hit /
50ms-miss reference), and consistency lag. TTL and cache-size sliders, a
staleness toggle, Pause, and Introduce Stale Read complete it.

## Instructional design check

- **Bloom verb:** Use (Apply, L3).
- **Animation justified:** the spec's rationale is explicit — the
  latency/consistency tradeoff must be *felt*. This matches the Step-3 table's
  "Apply with real-time feedback → animation often YES." A Pause control is
  provided; this is a deliberate exception to the default-paused guideline.

## Implementation notes

- `// CANVAS_HEIGHT: 556` → iframe 558. drawHeight 510 + controlHeight 46.
- Write strategy drives the tradeoff: Write-Through writes cache+DB (55ms, lag
  0); Write-Behind writes cache only (5ms) and accrues `pendingSync` → growing
  consistency lag; Cache-Aside invalidates on write (50ms). LRU eviction when
  the cache hits the size cap; skewed key popularity so hits actually occur.

## Layout review

- **Cycle 1 FAIL:** the screenshot captured the initial empty state — headless
  Chrome throttles the rAF loop, so bk-capture catches frame ~0 before any
  request is generated (the animated-p5 capture limitation, cf. part-1 gotcha
  #3). **Fix:** added a 30-request **warm start** in `setup()` so the first
  rendered frame already shows a populated stream, cache, and non-zero metrics.
- **Cycle 2:** re-captured — stream shows colored ops, cache shows 6 entries
  with freshness bars, metrics read 60% hit / 28.3ms / 0.0s lag. PASS.

## Files

- `docs/sims/caching-tactic-explorer/caching-tactic-explorer.js` (new, ~250 lines)
- `docs/sims/caching-tactic-explorer/index.md`
- `docs/sims/caching-tactic-explorer/caching-tactic-explorer.png`
- `docs/chapters/09-architectural-tactics-principles/index.md` (iframe height 560→558)
