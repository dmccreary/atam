---
title: ATAM Output to Action Pipeline
description: Students will be able to trace an ATAM risk finding from its identification in the evaluation session through its documentation in the risk register, its prioritization in the improvement plan, its scheduling in the architecture roadmap, and its verification through fitness function monitoring.
status: scaffold
library: p5.js
bloom_level: Understand (L2) — Explain how ATAM evaluation outputs are transformed into actionable organizational documents and ongoing monitoring practices.
---

# ATAM Output to Action Pipeline

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to trace an ATAM risk finding from its identification in the evaluation session through its documentation in the risk register, its prioritization in the improvement plan, its scheduling in the architecture roadmap, and its verification through fitness function monitoring.

- **Bloom Level:** Understand (L2) — Explain how ATAM evaluation outputs are transformed into actionable organizational documents and ongoing monitoring practices.
- **Bloom Verb:** Explain
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 10: Sensitivity, Tradeoffs, Risk Analysis, and ATAM Reporting](../../chapters/10-risk-analysis-atam-reporting/index.md).

```text
Type: workflow
**sim-id:** atam-output-pipeline<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Visualize the complete pipeline from ATAM evaluation outputs through risk register, improvement plan, architecture roadmap, and ongoing risk monitoring — showing how evaluation findings translate into organizational action.

Bloom Level: Understand (L2) — Explain how ATAM evaluation outputs are transformed into actionable organizational documents and ongoing monitoring practices.
Bloom Verb: Explain

Learning Objective: Students will be able to trace an ATAM risk finding from its identification in the evaluation session through its documentation in the risk register, its prioritization in the improvement plan, its scheduling in the architecture roadmap, and its verification through fitness function monitoring.

Canvas layout:
- Six pipeline stages connected by horizontal arrows
- Each stage: title, description, output artifact name, and participant role responsible
- An example risk finding "card" flows through the pipeline (clicking "Run Example" animates it)
- Info panel on right shows full content for clicked stage or artifact

Pipeline stages:
1. ATAM Evaluation Session
   Output: Raw finding (sensitivity point / tradeoff / risk / non-risk)
   Owner: Evaluation team + note-taker

2. Risk Classification
   Output: Classified risk with severity, probability, scenario reference
   Owner: Evaluation leader

3. Risk Theme Aggregation
   Output: Risk themes with constituent risks and business impact
   Owner: Evaluation leader + senior architect

4. Architecture Evaluation Report
   Output: Full report: executive summary, risk catalog, themes, recommendations
   Owner: Evaluation team

5. Architecture Improvement Plan
   Output: Prioritized work items with owners and target dates
   Owner: Architecture Review Board + project leads

6. Ongoing Monitoring
   Output: Fitness functions, observability alerts, periodic re-evaluation schedule
   Owner: DevOps / SRE + governance

Example risk finding animation:
"Ordering service calls inventory service synchronously; no circuit breaker present"
→ Classified: Availability risk, Severity H, Probability M
→ Grouped under theme: "No Systematic Resilience Strategy"
→ Appears in report: Section 4.2, Risk AV-003
→ Improvement plan: "Implement circuit breaker on inventory service calls, Sprint 14, Owner: Backend team lead"
→ Monitoring: Fitness function — "Circuit breaker trip rate < 1% per 1000 requests; alert on > 5% within 60s"

Interactive elements:
- Click each stage for full description
- "Run Example" button animates the example finding through all six stages
- Click any artifact name to see its template or sample content

Color scheme: Blue for evaluation stages, Teal for documentation stages, Green for action stages, Orange for monitoring.

Responsive: Stages stack vertically on narrow screens.
```

## Related Resources

- [Chapter 10: Sensitivity, Tradeoffs, Risk Analysis, and ATAM Reporting](../../chapters/10-risk-analysis-atam-reporting/index.md)
