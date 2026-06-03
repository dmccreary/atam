# Session Log — utility-tree-builder

**Date:** 2026-06-03
**Chapter:** 7 — Utility Trees and Prioritization
**Library:** p5.js
**Bloom level:** Create (L6) — *Design*
**Final validation:** 98/100 (Grade A) · Playwright control-visibility: PASS

## What it does

A guided builder for designing a utility tree. A four-step editor (1: add a
quality-attribute branch via dropdown; 2: add a sub-attribute to the selected
branch; 3: add a leaf scenario to the selected sub-attribute; 4: rate the
selected leaf with Importance/Difficulty dropdowns) drives a live indented tree
visualization with color-coded rating badges. A status bar shows the live
(H,H) count and a **Validate Tree** button reports structural issues against
ATAM's expectations.

## Instructional design check

- **Bloom verb:** Design (Create, L6).
- **Pattern chosen:** scaffolded construction. The numbered steps and the
  selection-driven editor reduce the cognitive load of building a tree from a
  blank page while still requiring the student to supply every system-specific
  branch, sub-attribute, scenario, and rating. The validator closes the loop on
  correctness — exactly the spec's rationale.
- Seeded with **Load Example** (called in setup) so the sim never opens blank.

## Implementation notes

- `// CANVAS_HEIGHT: 586` → iframe 588. drawHeight 540 + controlHeight 46.
- DOM controls (2 selects for branch + 2 for rating, 2 text inputs, several
  buttons) are p5 createSelect/createInput/createButton parented to `<main>`
  and absolutely positioned by `updateLayout()` (called from setup +
  windowResized, not per-frame, to avoid jitter).
- Selection model is a `{b,s,l}` path; clicking a tree row sets it and the
  editor steps act on it. Adding to the wrong context yields a guiding message
  ("Select a branch first").
- `validateTree()` checks: ≥3 branches, ≥2 sub-attributes/branch, ≥1
  scenario/sub-attribute, ≥2 (H,H) scenarios — returns specific messages.

## Deferred (per part-1 gotcha #6)

- The specced **Auto-Rate** (keyword-based suggested ratings) and the
  six-component leaf form were simplified: leaves are a single scenario
  statement plus the two rating dropdowns. This keeps the L6 design loop
  (structure + rating + validation) front-and-center without a six-field form
  per leaf. Noted for a possible v2.

## Layout review

- **Cycle 1:** PASS. All four editor steps with their DOM controls, the
  "Selected:" path line, the live tree (root → branches → sub-attributes →
  rated leaves) with badges aligned inside the panel, the (H,H) status badge,
  and the three bottom controls all render with no clipping or overlap.

## Files

- `docs/sims/utility-tree-builder/utility-tree-builder.js` (new, ~300 lines)
- `docs/sims/utility-tree-builder/index.md`
- `docs/sims/utility-tree-builder/utility-tree-builder.png`
- `docs/chapters/07-utility-trees-prioritization/index.md` (iframe height 620→588)
