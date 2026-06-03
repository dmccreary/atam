# Session Log — risk-register-explorer

**Date:** 2026-06-03
**Chapter:** 10 — Risk Analysis and ATAM Reporting
**Library:** p5.js
**Bloom level:** Evaluate (L5) — *Assess*
**Final validation:** 98/100 (Grade A) · Playwright control-visibility: PASS

## What it does

A populated risk register for a healthcare patient portal, grouped into three
risk themes plus a non-risks group. Each theme (gold header, with a business-
impact badge) expands into its constituent risks, each badged by Severity (S)
and Probability (P) — red H, orange M, yellow L. Clicking a risk shows full
documentation (evidence, mechanism, severity/probability, priority score, and a
recommended mitigation). Sort by severity × probability, filter by severity, and
toggle mitigations; a summary bar totals risks by quality attribute.

## Instructional design check

- **Bloom verb:** Assess (Evaluate, L5).
- **Pattern chosen:** an interactive register the student evaluates — expand,
  sort by combined priority, and weigh which theme's mitigation buys the most
  risk reduction. The priority score (sev×prob) makes the evaluative judgement
  concrete.

## Implementation notes

- `// CANVAS_HEIGHT: 586` → iframe 588. drawHeight 540 + controlHeight 46.
- Reused the expandable-outline + truncate pattern from utility-tree-explorer.
  Sort reorders risks within each theme by `lvl(sev)*lvl(prob)`; severity filter
  hides non-matching risks; mitigation text is gated behind the toggle.

## Layout review

- **Cycle 1:** PASS. Theme headers with impact badges, expanded risks with
  aligned S/P badges, the green Non-Risks group, the detail panel, the summary
  bar, and the three controls all render with no clipping.

## Files

- `docs/sims/risk-register-explorer/risk-register-explorer.js` (new, ~230 lines)
- `docs/sims/risk-register-explorer/index.md`
- `docs/sims/risk-register-explorer/risk-register-explorer.png`
- `docs/chapters/10-risk-analysis-atam-reporting/index.md` (iframe height 580→588)
