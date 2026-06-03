# Session Log — atam-result-type-explorer

**Date:** 2026-06-03
**Chapter:** 10 — Risk Analysis and ATAM Reporting
**Library:** p5.js
**Bloom level:** Analyze (L4) — *Differentiate*
**Final validation:** 98/100 (Grade A) · Playwright control-visibility: PASS

## What it does

A classification activity for the four ATAM result types. Each of eight cards
presents a concrete architectural decision with scenario context; the student
classifies it as Sensitivity Point, Tradeoff Point, Risk, or Non-Risk. A
feedback panel then shows correct/incorrect, the right type, the reasoning, the
quality attributes involved, and what an ATAM team would document. A running
score tracks correct answers; the unanswered state shows a quick reference of
the four definitions.

## Instructional design check

- **Bloom verb:** Differentiate (Analyze, L4).
- **Pattern chosen:** classification-with-immediate-feedback — the right fit for
  differentiating definitional categories on concrete examples (not recall). The
  eight cards deliberately cover all four types across multiple QA contexts.

## Implementation notes

- `// CANVAS_HEIGHT: 556` → iframe 558. drawHeight 510 + controlHeight 46.
- Color coding per spec: Sensitivity blue, Tradeoff orange, Risk red, Non-Risk
  green. Each card answerable once; buttons lock and highlight the correct type
  after answering. Score = correct / answered out of 8.

## Layout review

- **Cycle 1:** PASS. Decision card, the 2×2 color-coded buttons, and the
  feedback panel (with the quick-reference list in the unanswered state) all
  render with no clipping; long decision text wraps inside the card.

## Files

- `docs/sims/atam-result-type-explorer/atam-result-type-explorer.js` (new, ~190 lines)
- `docs/sims/atam-result-type-explorer/index.md`
- `docs/sims/atam-result-type-explorer/atam-result-type-explorer.png`
- `docs/chapters/10-risk-analysis-atam-reporting/index.md` (iframe height 560→558)
