---
title: Deployment Strategy Decision Matrix
description: Set your needs for zero downtime, rollback speed, low cost, and live-traffic validation, then see which deployment strategy (blue-green, canary, rolling update, or recreate) has the smallest gap, what tradeoff it accepts, and how its release unfolds phase by phase.
image: /sims/deployment-strategy-selector/deployment-strategy-selector.png
og:image: /sims/deployment-strategy-selector/deployment-strategy-selector.png
twitter:image: /sims/deployment-strategy-selector/deployment-strategy-selector.png
social:
   cards: false
quality_score: 0
---

# Deployment Strategy Decision Matrix

<iframe src="main.html" height="597" width="100%" scrolling="no"></iframe>

[Run the Deployment Strategy Selector MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim turns the choice of a deployment strategy into an explicit tradeoff analysis. You first state four needs on a 1 to 5 scale: how essential **zero downtime** is, how fast a **rollback** must be, how **cost-sensitive** the system is, and how much you need to **validate a release with live traffic** before everyone gets it. Each strategy card shows what that strategy delivers on the same four dimensions. Filled pips are what it delivers, the small black marker is your need, and a red outlined pip is a need the strategy does not meet. The total shortfall is the strategy's **gap**; the smallest gap wins, and a tie goes to the operationally simpler strategy.

The four strategies differ in mechanism. **Blue-green** runs two complete environments and switches the load balancer between them: instant rollback, at roughly double the infrastructure during the release. **Canary** sends a small share of real traffic to the new version and widens it as metrics stay healthy. **Rolling update** replaces instances a batch at a time with no extra environment, so the traffic share follows the instance count. **Recreate** stops the old version before starting the new one, which is the simplest and cheapest option and the only one with downtime. The timeline shows the selected strategy's phases, and **Compare All** overlays all four on a radar chart against your needs. Scores are qualitative teaching ratings, and the traffic percentages are examples.

## How to Use

1. Before reading the cards, set the four **sliders** to the needs of a system you have in mind (1 = does not matter, 5 = essential).
2. Read the cards: the dark-bordered card is the best fit. A red outlined pip with a number such as −2 is an unmet need.
3. Read the recommendation panel for the reasoning, the **tradeoff accepted**, and how rollback works.
4. Press **Simulate Deployment** to walk through the release sequence, or click any phase. The bar under each phase is the traffic split between versions.
5. **Click another card** to see that strategy's sequence, and press **Compare All** for the radar chart.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/deployment-strategy-selector/main.html"
        height="597"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Graduate / Professional

### Duration
15-20 minutes

### Prerequisites
Load balancing, container orchestration basics, and the deployability and availability quality attributes.

### Bloom's Taxonomy Level
Evaluate (L5)

### Learning Objective
Students will be able to select the most appropriate deployment strategy for a given set of quality attribute priorities (rollback speed, zero-downtime requirement, cost tolerance, traffic validation need) and justify the selection with tradeoff analysis.

### Activities

1. **State needs first** (4 min): For a payment API and for an internal nightly batch tool, students set the sliders before looking at the cards, then record the recommendation and its gap.
2. **Find the tipping point** (6 min): Starting from the defaults, students change one slider at a time and record the value at which the recommendation switches, and to which strategy.
3. **Trace the mechanism** (5 min): Students step through all four timelines and state, for each, how long both versions run side by side and what a rollback involves.
4. **Argue the other side** (5 min): Students pick the runner-up and write the stakeholder argument for choosing it anyway.

### Assessment
Give a deployability scenario (for example, "a defective release must be reverted within one minute with no failed customer requests") and ask students to choose a strategy, name the tradeoff accepted, and classify the decision as a risk or a non-risk for that scenario.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley. (Deployability tactics and patterns.)
2. Humble, J., & Farley, D. (2010). *Continuous Delivery*. Addison-Wesley. (Blue-green deployments and canary releasing.)
3. Kubernetes documentation. [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/). (Rolling update and Recreate strategies.)
