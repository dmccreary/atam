# Session Log — adr-evolution-timeline

**Date:** 2026-06-03
**Chapter:** 8 — Architectural Patterns and Styles
**Library:** p5.js
**Bloom level:** Understand (L2) — *Explain*
**Final validation:** 98/100 (Grade A) · Playwright control-visibility: PASS

## What it does

A two-track timeline across three years. Six ADR cards sit above the axis,
color-coded by status (green Active, orange Superseded, gray Deprecated); five
system events sit below — blue circles for requirement changes, gold diamonds
for ATAM evaluations. A dashed orange arrow shows ADR-003 superseding ADR-001,
and selecting an event draws blue arrows to the ADR(s) it triggered. A detail
panel shows each ADR's Context / Decision / Consequences or each event's
triggered ADRs. **Show ADR-Only** collapses the events track.

## Instructional design check

- **Bloom verb:** Explain (Understand, L2).
- **Pattern chosen:** concrete data + click-to-read; no animation — matches the
  Step-3 guidance for an explain objective. The relationship arrows are what
  make the "ATAM findings → ADRs" link explicit and explainable.

## Implementation notes

- `// CANVAS_HEIGHT: 586` → iframe 588. drawHeight 540 + controlHeight 46.
- Items are positioned by a normalized time `t∈[0,1]` across the span; ADR
  cards alternate two rows (and events two rows) to avoid horizontal overlap.
- **Layout choice:** timeline on top, full width; detail panel as a full-width
  strip below — gives the horizontal timeline room rather than squeezing a
  right panel beside it (the spec's "panel stacks below on narrow screens"
  fallback, applied at all widths for readability).

## Layout review

- **Cycle 1 FAIL:** two ADR card titles overflowed the 118px card and clipped
  their last word ("Microservices for hot **paths**", "WebSocket dashboard
  **stream**"). **Fix:** shortened those titles to "Microservices migration"
  and "WebSocket streaming" so each fits one line.
- **Cycle 2:** re-captured — all six cards read cleanly, supersede arrow,
  year bands, both ATAM diamonds and three event circles, and detail panel all
  render with no clipping. PASS.

## Files

- `docs/sims/adr-evolution-timeline/adr-evolution-timeline.js` (new, ~250 lines)
- `docs/sims/adr-evolution-timeline/index.md`
- `docs/sims/adr-evolution-timeline/adr-evolution-timeline.png`
- `docs/chapters/08-architectural-patterns-styles/index.md` (iframe height 520→588)
