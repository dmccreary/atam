# Session Log — pattern-quality-matrix

**Date:** 2026-06-03
**Chapter:** 8 — Architectural Patterns and Styles
**Library:** p5.js
**Bloom level:** Analyze (L4) — *Compare*
**Final validation:** 98/100 (Grade A) · Playwright control-visibility: PASS

## What it does

An 8×8 matrix comparing eight architectural patterns (rows) against eight
quality attributes (columns). Each cell is colored and lettered: green S
(supports), red T (threatens), yellow Y (complex/depends), gray N (neutral).
Clicking a cell shows the tradeoff mechanism and ATAM probing advice; clicking
a column header sorts the patterns by that attribute (best-supporting first);
clicking a pattern name shows its summary + full profile; a Compare mode shows
two patterns side by side.

## Instructional design check

- **Bloom verb:** Compare (Analyze, L4).
- **Pattern chosen:** a comparison matrix with click-to-explore mechanisms and
  column sorting — directly supports cross-pattern comparison and "which
  pattern for attribute X?" The derived ATAM-watch line connects each rating
  back to evaluation practice.

## Implementation notes

- `// CANVAS_HEIGHT: 576` → iframe 578. drawHeight 530 + controlHeight 46.
- Authored the full 8×8 rating grid (64 cells) plus a concise mechanism
  sentence per cell — this is the comparative content the L4 objective needs.
  The "In ATAM" advice is derived from the rating (T → probe as a likely risk;
  S → confirm under load; Y → probe both directions; N → low priority), so it
  stays consistent without 64 separately-authored strings.
- Column sort ranks by S(3) > Y(2) > N(1) > T(0); clicking the active column
  again returns to default order. Row/column/cell hit-testing all in
  `mousePressed`.

## Layout review

- **Cycle 1:** PASS. Legend, gold column headers, all 64 colored S/T/Y/N
  cells, pattern row headers, detail panel, and the two controls render with no
  clipping or overlap. Spot-checked cell colors against the data (Layered and
  Microservices rows) — correct.

## Files

- `docs/sims/pattern-quality-matrix/pattern-quality-matrix.js` (new, ~290 lines)
- `docs/sims/pattern-quality-matrix/index.md`
- `docs/sims/pattern-quality-matrix/pattern-quality-matrix.png`
- `docs/chapters/08-architectural-patterns-styles/index.md` (iframe height 580→578)
