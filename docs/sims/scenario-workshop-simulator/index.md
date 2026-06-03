---
title: Scenario Brainstorming and Prioritization Workshop Simulator
description: Students will be able to simulate the ATAM scenario brainstorming and prioritization process, observe how different stakeholder voting patterns produce different priority orderings, and identify scenarios that represent coverage gaps in a catalog.
status: scaffold
library: p5.js
bloom_level: Apply (L3) — Use scenario brainstorming and dot voting to produce a prioritized scenario catalog from multiple stakeholder perspectives.
---

# Scenario Brainstorming and Prioritization Workshop Simulator

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to simulate the ATAM scenario brainstorming and prioritization process, observe how different stakeholder voting patterns produce different priority orderings, and identify scenarios that represent coverage gaps in a catalog.

- **Bloom Level:** Apply (L3) — Use scenario brainstorming and dot voting to produce a prioritized scenario catalog from multiple stakeholder perspectives.
- **Bloom Verb:** Use
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 6: Quality Attribute Scenarios](../../chapters/06-quality-attribute-scenarios/index.md).

```text
Type: microsim
**sim-id:** scenario-workshop-simulator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Simulate the scenario brainstorming and dot-voting prioritization process from an ATAM Phase 2 workshop, with multiple stakeholder perspectives contributing scenarios and the aggregate priority ordering emerging dynamically.

Bloom Level: Apply (L3) — Use scenario brainstorming and dot voting to produce a prioritized scenario catalog from multiple stakeholder perspectives.
Bloom Verb: Use

Learning Objective: Students will be able to simulate the ATAM scenario brainstorming and prioritization process, observe how different stakeholder voting patterns produce different priority orderings, and identify scenarios that represent coverage gaps in a catalog.

Canvas layout:
- Top: Stakeholder selector panel (4 buttons: Business Owner, Security Officer, Operations Lead, Product Manager)
- Left: Scenario sticky-note grid (3×4 grid of generated scenarios, each showing QA type, brief description, vote count)
- Right: Live priority bar chart updating as votes are cast
- Bottom: "Vote" button (active for currently selected stakeholder), remaining votes counter, "Show Coverage" button

Pre-populated scenarios (12, one per grid cell):
1. (Performance) API responds under 200ms under 500 concurrent users
2. (Availability) Payment service failover under 30 seconds
3. (Security) Credential-stuffing attack detection and blocking
4. (Modifiability) New payment method in under 5 developer-days
5. (Scalability) Handle 10× normal load during Black Friday
6. (Availability) Database failover with zero committed data loss
7. (Security) GDPR right-to-erasure within 72 hours
8. (Performance) Batch report generation within 2-hour SLA
9. (Modifiability) New product category without recommendation service change
10. (Scalability) Auto-scale without manual operator intervention
11. (Security) Admin account compromise detection within 60 seconds
12. (Availability) Graceful degradation when search is unavailable

Default voting distributions (editable):
- Business Owner: 2 votes on #1, 2 votes on #5, 1 vote on #4
- Security Officer: 3 votes on #3, 2 votes on #11
- Operations Lead: 2 votes on #2, 2 votes on #6, 1 vote on #10
- Product Manager: 3 votes on #9, 2 votes on #4

Behavior:
- Student selects stakeholder and clicks scenarios to allocate votes (max 5 per stakeholder)
- Bar chart updates in real time as votes are added
- "Show Coverage" button shows a coverage matrix: which QAs have scenarios, which are under-represented
- "Coverage Gap" warning appears if any quality attribute has zero scenarios
- "Add Scenario" button allows student to generate a new scenario for a gap area

Instructional Rationale: Active simulation of the workshop process is appropriate for Apply because students need to experience the priority dynamics, not just read about them. The coverage assessment feature teaches the coverage-gap-identification skill.

Color scheme: Sticky notes colored by QA type (matches Chapter 5 QA colors). Bar chart in gradient from high (gold) to low (gray). Warning indicators in red.

Responsive: Grid and chart resize proportionally to container width.
```

## Related Resources

- [Chapter 6: Quality Attribute Scenarios](../../chapters/06-quality-attribute-scenarios/index.md)
