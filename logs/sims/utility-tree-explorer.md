# Session Log — utility-tree-explorer

**Date:** 2026-06-03
**Chapter:** 7 — Utility Trees and Prioritization
**Library:** p5.js
**Bloom level:** Understand (L2) — *Explain*
**Final validation:** 98/100 (Grade A) · Playwright control-visibility: PASS

## What it does

An expandable utility tree for a healthcare patient portal, rendered as an
indented collapsible outline: gold root (Utility) → blue quality attribute
branches → teal sub-attributes → leaf scenarios. Each leaf carries a
color-coded (Importance, Difficulty) badge. Clicking a leaf opens a detail
panel with the branch→sub path, the rating label, and a one-sentence rationale.
A Focus (H,H) mode hides lower-priority leaves to spotlight the critical set.

## Instructional design check

- **Bloom verb:** Explain (Understand, L2).
- **Pattern chosen:** concrete-data visibility + click-to-reveal, exactly the
  Step-3 recommendation for an Understand/explain objective (no animation). The
  detail-panel rationale is the "interpret the ratings" payload.
- **Rendering choice:** an indented outline rather than a graphical node-link
  tree. With 11 long leaf statements, a downward node-link tree cannot show
  readable leaf text in a fixed canvas; the outline keeps all four levels and
  every rating badge legible and makes expand/collapse natural. Faithful to the
  "expanding downward from root … collapses to single-column list" intent.

## Implementation notes

- `// CANVAS_HEIGHT: 600` → iframe 602. drawHeight 560 + controlHeight 40.
- `buildRows()` flattens the tree honoring each node's `open` flag and the
  focus filter; `mousePressed` maps click-y to a row and toggles expand or
  selects a leaf. Rating badges align in a column; leaf text is binary-search
  truncated with an ellipsis to fit before the badge.
- Rating color map per spec: (H,H) red, (H,M|M,H) orange, (H,L) gold, (M,M)
  blue, (L,*) gray. Chapter-7 QA branch color = blue (level color), consistent
  with the other two Chapter 7 sims.

## Deferred (per part-1 gotcha #6)

- **Drag-and-drop leaf restructuring** and the **expand-to-6-branches** extra
  (only 4 branches have specced content) were left out — they add complexity
  without serving the L2 "explain the structure / interpret ratings" objective.
  The six-component-per-leaf detail was condensed to statement + rating + a
  rationale sentence, which directly teaches rating interpretation.

## Layout review

- **Cycle 1:** PASS. All 11 leaves and their badges visible, badge column
  clears the detail panel by ~20px, truncation clean, legend readable, all
  three controls visible. No clipping or overlap.

## Files

- `docs/sims/utility-tree-explorer/utility-tree-explorer.js` (new, ~280 lines)
- `docs/sims/utility-tree-explorer/index.md`
- `docs/sims/utility-tree-explorer/utility-tree-explorer.png`
- `docs/chapters/07-utility-trees-prioritization/index.md` (iframe height 600→602)
