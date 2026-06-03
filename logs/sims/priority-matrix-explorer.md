# Session Log — priority-matrix-explorer

**Date:** 2026-06-03
**Chapter:** 7 — Utility Trees and Prioritization
**Library:** p5.js
**Bloom level:** Evaluate (L5) — *Assess*
**Final validation:** 98/100 (Grade A) · Playwright control-visibility: PASS

## What it does

A 2×2 priority matrix — Importance (vertical) × Difficulty (horizontal) —
populated with the eleven leaf scenarios of a healthcare patient-portal utility
tree. Each quadrant carries an analytical recommendation (Critical/Confirm/
Watch/Monitor) and dots are colored by quality attribute. Students click a dot
to read its scenario, drag dots between quadrants to reclassify, toggle a
critical-path overlay over the (H,H) set, filter by quality attribute, and
watch a live "(H,H) Analyze-First" count.

## Instructional design check

- **Bloom verb:** Assess (Evaluate, L5).
- **Pattern chosen:** an interactive judgement tool — students manipulate the
  distribution and read the consequence (the (H,H) count, the critical path).
  Drag-to-reclassify is the evaluative act; the live count gives immediate
  feedback. Aligned with the spec.

## Implementation notes

- Chapter-7 QA palette per the spec (Performance **red**, Availability blue,
  Security green, Modifiability purple, Scalability teal) — deliberately
  different from the Ch5/6 palette; kept internally consistent across all three
  Chapter 7 sims.
- `// CANVAS_HEIGHT: 570` → iframe 572. drawHeight 520 + controlHeight 50.
- Dragging updates each dot's continuous (imp, diff); (H,H) = imp≥0.5 ∧
  diff≥0.5, recomputed live.

## Layout review

- **Cycle 1 FAIL (accuracy):** the (H,H) badge read **6**, not the specced 5 —
  medium-importance level sat exactly on the 0.5 midline, so jitter pushed a
  (M,H) scenario above it. **Fix:** lowered M to 0.42.
- **Cycle 2 FAIL (visual):** only 3 of the 5 (H,H) dots were visible — the old
  deterministic jitter `(i%3-1, (i*7)%3-1)` produced exact collisions (#1 under
  #4, #2 under #5). **Fix:** replaced with a golden-angle spread
  (`a = i·2.39996`, radius 0.065) so co-located dots fan out uniquely without
  crossing a quadrant boundary.
- **Cycle 3:** re-captured — all 11 dots visible and correctly distributed
  (5 H,H / 3 H,L / 2 Watch / 1 Monitor), badge reads 5. PASS.

## Files

- `docs/sims/priority-matrix-explorer/priority-matrix-explorer.js` (new, ~270 lines)
- `docs/sims/priority-matrix-explorer/index.md`
- `docs/sims/priority-matrix-explorer/priority-matrix-explorer.png`
- `docs/chapters/07-utility-trees-prioritization/index.md` (iframe height 520→572)
