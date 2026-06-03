---
title: Risk Register and Theme Aggregation
description: Students will be able to interpret a populated risk register, identify the highest-priority risk themes, and recommend which architectural improvements would address the most severe risks most efficiently.
status: scaffold
library: p5.js
bloom_level: Evaluate (L5) — Assess a risk register to prioritize mitigation efforts, identify high-severity risk themes, and determine which architectural improvements would have the greatest risk-reduction impact.
---

# Risk Register and Theme Aggregation

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to interpret a populated risk register, identify the highest-priority risk themes, and recommend which architectural improvements would address the most severe risks most efficiently.

- **Bloom Level:** Evaluate (L5) — Assess a risk register to prioritize mitigation efforts, identify high-severity risk themes, and determine which architectural improvements would have the greatest risk-reduction impact.
- **Bloom Verb:** Assess
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 10: Sensitivity, Tradeoffs, Risk Analysis, and ATAM Reporting](../../chapters/10-risk-analysis-atam-reporting/index.md).

```text
Type: diagram
**sim-id:** risk-register-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive risk register visualization showing individual risks organized by quality attribute and severity, with theme aggregation — clicking a theme reveals the constituent risks, and clicking a risk shows its full documentation.

Bloom Level: Evaluate (L5) — Assess a risk register to prioritize mitigation efforts, identify high-severity risk themes, and determine which architectural improvements would have the greatest risk-reduction impact.
Bloom Verb: Assess

Learning Objective: Students will be able to interpret a populated risk register, identify the highest-priority risk themes, and recommend which architectural improvements would address the most severe risks most efficiently.

Canvas layout:
- Left panel: Risk theme cards (4-5 themes) with theme name, affected QAs, risk count, and business impact rating (H/M/L)
- Center: Expandable risk tree — clicking a theme expands its constituent individual risks; each risk card shows QA, severity (H/M/L), probability (H/M/L), and scenario reference
- Right panel: Full risk detail when a risk item is clicked — decision, evidence, mechanism, severity, probability, mitigation options
- Top bar: Filter controls — filter by QA, severity, probability, theme
- Bottom: Summary stats — total risks by type (Sensitivity Points, Tradeoffs, Risks, Non-Risks) and by theme

Example risk register (healthcare patient portal):
Theme 1: "No Systematic Resilience Strategy for External Dependencies"
- Risk: No circuit breaker on EHR integration [Availability, H, M]
- Risk: Synchronous payment call blocks checkout on payment timeout [Availability, H, H]
- Risk: Authentication service has no fallback for IdP unavailability [Availability, H, M]

Theme 2: "Insufficient Load Testing for Peak Season"
- Risk: Search service untested at 3× normal load [Performance, H, H]
- Risk: Database connection pool sized for average, not peak, concurrency [Performance, H, M]

Theme 3: "PHI Access Control Coverage Gaps"
- Risk: Bulk export API bypasses per-field access control [Security, H, H]
- Risk: Admin audit log not capturing indirect PHI access via joins [Security, M, H]

Non-Risks: 6 items (well-addressed availability and performance scenarios)

Interactive elements:
- Click any theme to expand/collapse its constituent risks
- Click any risk card to see full documentation in right panel
- "Sort by Severity × Probability" button reorders risks by combined priority score
- "Show Mitigation Plan" toggle shows recommended mitigations overlaid on risk cards
- "Generate Theme Summary" button produces a formatted theme summary paragraph for each theme

Color scheme: Red for High severity, Orange for Medium, Yellow for Low. Themes in dark gold headers. Non-risks in green.

Responsive: Tree layout reflows to a flat list on narrow screens.
```

## Related Resources

- [Chapter 10: Sensitivity, Tradeoffs, Risk Analysis, and ATAM Reporting](../../chapters/10-risk-analysis-atam-reporting/index.md)
