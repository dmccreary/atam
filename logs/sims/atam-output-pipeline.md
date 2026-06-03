# Session Log — atam-output-pipeline

**Date:** 2026-06-03
**Chapter:** 10 — Risk Analysis and ATAM Reporting
**Library:** p5.js
**Bloom level:** Understand (L2) — *Explain*
**Final validation:** 98/100 (Grade A) · Playwright control-visibility: PASS

## What it does

A six-stage pipeline showing how one ATAM finding becomes organizational action:
Evaluation Session → Risk Classification → Risk Theme Aggregation → Evaluation
Report → Improvement Plan → Ongoing Monitoring. Each stage box names its output
and the responsible role, color-coded by category (blue evaluation, teal
documentation, green action, orange monitoring). A single worked example (a
missing circuit breaker) flows through all six stages; the detail panel shows
each stage's owner, output, and the example artifact at that stage.

## Instructional design check

- **Bloom verb:** Explain (Understand, L2).
- Reused the discrete step-through pattern from `scenario-to-fitness-pipeline`
  (Run Example advances one stage at a time) rather than continuous animation —
  the right fit for an explain objective.

## Implementation notes

- `// CANVAS_HEIGHT: 548` → iframe 550. drawHeight 500 + controlHeight 46.
- Single example (no scenario tabs); each stage carries owner + output + the
  concrete artifact, so the same finding is seen changing shape across stages.

## Layout review

- **Cycle 1:** PASS. All six color-coded stage boxes (output + italic owner),
  arrows, active-stage highlight, and the detail/artifact panel render with no
  clipping; owner text fits within each box.

## Files

- `docs/sims/atam-output-pipeline/atam-output-pipeline.js` (new, ~170 lines)
- `docs/sims/atam-output-pipeline/index.md`
- `docs/sims/atam-output-pipeline/atam-output-pipeline.png`
- `docs/chapters/10-risk-analysis-atam-reporting/index.md` (iframe height 520→550)
