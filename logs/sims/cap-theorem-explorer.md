# Session Log — cap-theorem-explorer

**Date:** 2026-06-03
**Chapter:** 11 — Distributed Systems Fundamentals
**Library:** p5.js
**Bloom level:** Apply (L3) — *Use*
**Final validation:** 98/100 (Grade A) · Playwright control-visibility: PASS

## What it does

A CAP-theorem simulation. Two replicas (Node A, Node B) joined by a network
link, a CP/AP mode switch, and buttons to write to A, read from B, and create or
heal a partition. Under a partition, CP rejects reads from B (consistency over
availability) while AP returns a stale value with a warning and converges after
healing (availability over consistency). Three scenario presets (financial
ledger, shopping cart, profile update) recommend a model. A log narrates each
event.

## Instructional design check

- **Bloom verb:** Use (Apply, L3).
- **Event-driven, not continuously animated:** the simulation advances on button
  clicks, so the default frame is static and informative — appropriate, and it
  also sidesteps the headless-capture throttling issue. The only motion is a
  brief AP convergence transition after healing.

## Implementation notes

- `// CANVAS_HEIGHT: 566` → iframe 568. drawHeight 520 + controlHeight 46.
- Version counters (aVer/bVer) model divergence: a partitioned write bumps A
  only; bVer < aVer means B is stale. Behavior panel and log are both derived
  from (mode, partitioned, divergence) so they always agree.

## Layout review

- **Cycle 1:** PASS. Mode toggle, both node boxes with the colored network link,
  behavior panel, simulation log, three scenario buttons, and the four bottom
  controls all render with no clipping.

## Files

- `docs/sims/cap-theorem-explorer/cap-theorem-explorer.js` (new, ~210 lines)
- `docs/sims/cap-theorem-explorer/index.md`
- `docs/sims/cap-theorem-explorer/cap-theorem-explorer.png`
- `docs/chapters/11-distributed-systems-fundamentals/index.md` (iframe height 560→568)
