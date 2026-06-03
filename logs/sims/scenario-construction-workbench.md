# Session Log — scenario-construction-workbench

**Date:** 2026-06-03
**Chapter:** 6 — Quality Attribute Scenarios
**Library:** p5.js
**Bloom level:** Apply (L3) — *Construct*
**Final validation:** 98/100 (Grade A) · Playwright control-visibility: PASS

## What it does

Interactive workbench for transforming a general scenario template into a
concrete, system-specific quality attribute scenario. Five tabs select a
typed scenario family (Performance, Availability, Security, Modifiability,
Scalability), each with its own general template and a measure-field hint.
Six labeled fields capture the scenario components; a live completeness meter
and an ATAM-Ready badge react to specificity; **Evaluate** gives per-component
feedback; **Save to Catalog** builds a coverage set across quality attributes.

## Instructional design check

- **Bloom verb:** Construct (Apply, L3)
- **Pattern chosen:** active construction from templates with live scoring —
  aligned with the spec. Templates reduce blank-page anxiety while still
  requiring the student to supply system-specific, quantitative details
  (the Response Measure is intentionally left blank on Load Template).
- **No continuous animation** — appropriate for an Apply objective; the only
  motion is the meter lerping toward the score.

## Implementation notes

- Built on the Chapter 5 `qa-requirement-workbench` pattern (six DOM inputs
  positioned over a p5 canvas, `fieldScore()` 0/5/10/15 specificity scoring,
  meter lerp). Extended with: 5 typed-family tabs (hit-tested in
  `mousePressed`), per-family general templates + worked examples, an
  Evaluate mode showing per-component verdicts, and a saved-scenario catalog.
- `// CANVAS_HEIGHT: 590` → iframe 592. drawHeight 540 + controlHeight 50.
- Tabs span the full canvas width; the measure-field label carries an
  inline `(e.g. <hint>)` cue that changes per family.

## Layout review

- **Cycle 1 FAIL:** bottom control hint was drawn at `drawHeight +
  controlHeight + 1`, i.e. 1px below the canvas, so it was clipped at the
  iframe edge. **Fix:** moved the hint into the empty space to the right of
  the four buttons, vertically centered in the control strip (matches the
  reference workbench), and gated it on `canvasWidth >= 560`.
- **Cycle 2:** re-captured — hint fully visible, all four buttons visible,
  tabs/fields/meter/badge/catalog all render cleanly. PASS.

## Files

- `docs/sims/scenario-construction-workbench/scenario-construction-workbench.js` (new, ~290 lines)
- `docs/sims/scenario-construction-workbench/index.md` (real About/How-to/Lesson Plan/References)
- `docs/sims/scenario-construction-workbench/scenario-construction-workbench.png` (screenshot)
- `docs/chapters/06-quality-attribute-scenarios/index.md` (iframe height 580→592)
- `mkdocs.yml` (nav regenerated, 52 entries)
