---
title: Deployment Strategy Decision Matrix
description: Students will be able to select the most appropriate deployment strategy for a given set of quality attribute priorities (rollback speed, zero-downtime requirement, cost tolerance, traffic validation need) and justify the selection with tradeoff analysis.
status: scaffold
library: p5.js
bloom_level: Evaluate (L5) — Assess deployment strategies to select the approach that best fits a given set of quality attribute requirements and constraints.
---

# Deployment Strategy Decision Matrix

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to select the most appropriate deployment strategy for a given set of quality attribute priorities (rollback speed, zero-downtime requirement, cost tolerance, traffic validation need) and justify the selection with tradeoff analysis.

- **Bloom Level:** Evaluate (L5) — Assess deployment strategies to select the approach that best fits a given set of quality attribute requirements and constraints.
- **Bloom Verb:** Assess
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 13: Cloud-Native Architecture](../../chapters/13-cloud-native-architecture/index.md).

```text
Type: microsim
**sim-id:** deployment-strategy-selector<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive decision tool showing how deployment strategy selection affects quality attribute scenarios for deployability, availability, cost, and complexity — allowing students to select quality attribute priorities and see the recommended strategy.

Bloom Level: Evaluate (L5) — Assess deployment strategies to select the approach that best fits a given set of quality attribute requirements and constraints.
Bloom Verb: Assess

Learning Objective: Students will be able to select the most appropriate deployment strategy for a given set of quality attribute priorities (rollback speed, zero-downtime requirement, cost tolerance, traffic validation need) and justify the selection with tradeoff analysis.

Canvas layout:
- Left: Quality attribute priority sliders (Zero-Downtime Requirement, Rollback Speed Priority, Cost Sensitivity, Canary Validation Need — each 1-5)
- Center: Deployment strategy comparison cards (Blue-Green, Canary, Rolling Update, Recreate) showing scores on each dimension
- Right: "Best Fit" recommendation with explanation and tradeoffs accepted
- Bottom: Timeline visualization showing the deployment sequence for the recommended strategy

Strategy scores:
Blue-Green: Zero-Downtime=5, Rollback=5, Cost=1, Validation=2
Canary: Zero-Downtime=4, Rollback=4, Cost=3, Validation=5
Rolling Update: Zero-Downtime=4, Rollback=3, Cost=5, Validation=2
Recreate (full stop): Zero-Downtime=1, Rollback=2, Cost=5, Validation=1

Behavior:
- Moving sliders updates the "gap" between student requirements and each strategy's scores
- Best-fit strategy highlighted with minimum total gap
- "Simulate Deployment" button animates the timeline for the selected strategy
- "Compare All" shows all four strategies side-by-side in a radar chart

Instructional Rationale: Slider-driven selection is appropriate for Evaluate because students must explicitly state their quality attribute priorities before seeing recommendations, preventing anchoring.

Color scheme: Blue for Blue-Green, Green for Canary, Orange for Rolling, Red for Recreate.

Responsive: Controls stack vertically on narrow screens.
```

## Related Resources

- [Chapter 13: Cloud-Native Architecture](../../chapters/13-cloud-native-architecture/index.md)
