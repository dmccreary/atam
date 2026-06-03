# Session Log — scenario-to-fitness-pipeline

**Date:** 2026-06-03
**Chapter:** 6 — Quality Attribute Scenarios
**Library:** p5.js
**Bloom level:** Analyze (L4) — *Trace*
**Final validation:** 98/100 (Grade A) · Playwright control-visibility: PASS

## What it does

Traces a single quality attribute scenario through a five-stage pipeline —
Scenario Catalog Entry → Risk Assessment → Fitness Function Specification →
Implementation → Continuous Monitoring. The five stages render as a horizontal
flow of color-headed boxes connected by arrows. A detail panel below shows the
active stage's Input / Transform / Output plus the concrete *artifact* produced
for the selected example scenario (Performance, Availability, or Security).

## Instructional design check

- **Bloom verb:** Trace (Analyze, L4).
- **Spec requested animation** ("Run Pipeline animates the card flowing
  stage-by-stage"). Per the skill's Step-3 checkpoint, continuous motion is a
  poor fit for an Analyze/Trace objective. **Modified to a discrete
  step-through:** Run Pipeline advances the active stage one box at a time
  (every ~36 frames), each completed stage gets a ✓, the active stage shows ▶.
  This lets the learner *examine* each transformation rather than watch a card
  glide past — better trace support. Documented in index.md too.

## Implementation notes

- `// CANVAS_HEIGHT: 550` → iframe 552. drawHeight 500 + controlHeight 50.
- Three example scenarios share the identical five-stage shape but differ in
  the concrete artifact at each stage (k6 load test vs Litmus chaos test vs
  security replay test) — this contrast is the core L4 insight.
- Stage boxes and scenario tabs both hit-tested in `mousePressed`; clicking a
  stage stops the auto-run and jumps the trace there.
- Default state is PAUSED (running=false) per convention.

## Layout review

- **Cycle 1 FAIL:** the active-stage "▶ tracing" marker was drawn over the
  box body text, overlapping the output summary. **Fix:** moved the done (✓)
  and active (▶) status glyphs into the right side of the colored header bar,
  where there is free space and no overlap.
- **Cycle 2:** re-captured — header glyph clean, body text fully readable,
  all five stages + arrows + detail panel + artifact card render without
  clipping. PASS.

## Files

- `docs/sims/scenario-to-fitness-pipeline/scenario-to-fitness-pipeline.js` (new, ~230 lines)
- `docs/sims/scenario-to-fitness-pipeline/index.md`
- `docs/sims/scenario-to-fitness-pipeline/scenario-to-fitness-pipeline.png`
- `docs/chapters/06-quality-attribute-scenarios/index.md` (iframe height 520→552)
