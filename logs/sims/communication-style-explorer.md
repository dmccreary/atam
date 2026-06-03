# Session Log — communication-style-explorer

**Date:** 2026-06-03
**Chapter:** 8 — Architectural Patterns and Styles
**Library:** p5.js (custom radar)
**Bloom level:** Evaluate (L5) — *Assess*
**Final validation:** 98/100 (Grade A) · Playwright control-visibility: PASS

## What it does

A radar chart comparing REST, gRPC, GraphQL, and WebSocket across five
dimensions (Performance, Interoperability, Real-Time, Schema Enforcement,
Operational Simplicity). Five sliders set a red dashed requirement polygon
over the four style polygons. A recommendation panel highlights the best-fit
style (fewest unmet high-priority requirements), lists the unmet gaps, and an
Explain Choice toggle gives a tradeoff justification. Three worked scenarios
load preset slider values.

## Instructional design check

- **Bloom verb:** Assess (Evaluate, L5).
- **Pattern chosen:** slider-driven exploration that forces students to
  externalize priorities *before* seeing a recommendation — directly the
  spec's anti-anchoring rationale. The best-fit metric is transparent
  (minimize summed unmet requirement), so the recommendation is explainable,
  not a black box.

## Implementation notes

- `// CANVAS_HEIGHT: 552` → iframe 554. drawHeight 500 + controlHeight 52.
- Best-fit = argmin of Σ max(0, req−score) over axes, tie-broken by total
  |req−score|. Unmet gaps and the Explain text are both derived from the
  scores, so they stay consistent for any slider configuration.
- **Radar label clipping (part-1 gotcha #5):** used abbreviated axis labels
  (Perf / Interop / Real-Time / Schema / Simplicity), a 30px radius pad inside
  the available box, and quadrant-based text alignment (LEFT on the right side,
  RIGHT on the left, CENTER top/bottom). Verified in the screenshot — no label
  is clipped at the default all-3 setting.

## Layout review

- **Cycle 1:** PASS. All five sliders + value readouts, the radar with four
  style polygons and the requirement overlay, every axis label, the right
  legend + recommendation panel, and the four bottom buttons render with no
  clipping. Recommendation verified correct (all-3 → gRPC, unmet Interop 3/2).

## Files

- `docs/sims/communication-style-explorer/communication-style-explorer.js` (new, ~230 lines)
- `docs/sims/communication-style-explorer/index.md`
- `docs/sims/communication-style-explorer/communication-style-explorer.png`
- `docs/chapters/08-architectural-patterns-styles/index.md` (iframe height 540→554)
