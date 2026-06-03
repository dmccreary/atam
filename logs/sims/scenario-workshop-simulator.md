# Session Log — scenario-workshop-simulator

**Date:** 2026-06-03
**Chapter:** 6 — Quality Attribute Scenarios
**Library:** p5.js
**Bloom level:** Apply (L3) — *Use*
**Final validation:** 98/100 (Grade A) · Playwright control-visibility: PASS

## What it does

Simulates an ATAM Phase-2 scenario brainstorming and dot-voting workshop.
Four stakeholders (Business Owner, Security Officer, Operations Lead, Product
Manager) each hold five dot votes. Twelve pre-populated scenarios, colored by
quality attribute, sit in a 3×4 sticky-note grid. Selecting a stakeholder and
clicking notes casts votes; a live priority bar chart reorders in real time;
a **Show Coverage** toggle swaps the chart for a per-quality-attribute coverage
view that flags under-represented attributes.

## Instructional design check

- **Bloom verb:** Use (Apply, L3).
- **Pattern chosen:** active simulation of the workshop dynamics — students
  *experience* how perspective changes priority rather than reading about it.
  Aligned with the spec's rationale.
- **Load Default Votes** demonstrates the aggregate-vs-single-perspective
  insight; the coverage view teaches the coverage-gap-identification skill.

## Implementation notes

- `// CANVAS_HEIGHT: 610` → iframe 612. drawHeight 560 + controlHeight 50.
- Stakeholder chips and scenario notes are both hit-tested in `mousePressed`;
  clicking a note spends one vote from the selected stakeholder if they have
  any remaining (`s.votes`).
- Priority chart sorts scenario numbers by `votes[]` descending; the highest
  vote badge turns gold. Coverage panel computes scenario count + vote sum per
  QA and flags `count === minCount` as under-represented (and `count === 0` as
  a hard GAP, though all five QAs are represented in this catalog).
- Reused the shared QA color palette from Chapter 5/6.

## Deferred (per part-1 gotcha #6: core interaction first)

- **Add Scenario** (generate a new scenario into a gap area) was specced as an
  extra. Deferred — the coverage view already delivers the gap-identification
  learning objective; adding an inline scenario editor is a heavier feature
  that would clutter the control strip. Noted for a possible v2.

## Layout review

- **Cycle 1:** PASS on first capture. All 12 notes (QA strip + number +
  wrapped description + vote badge), 4 stakeholder chips with remaining-vote
  counts, the priority chart (#1–#12), and the three control buttons + hint
  all render within the iframe with no clipping or overlap. Screenshot shows
  the honest zero-vote default state.

## Files

- `docs/sims/scenario-workshop-simulator/scenario-workshop-simulator.js` (new, ~250 lines)
- `docs/sims/scenario-workshop-simulator/index.md`
- `docs/sims/scenario-workshop-simulator/scenario-workshop-simulator.png`
- `docs/chapters/06-quality-attribute-scenarios/index.md` (iframe height 580→612)
