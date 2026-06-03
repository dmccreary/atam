---
title: Risk Result Type Explorer
description: Students will be able to classify a given architectural decision into the correct ATAM result type (sensitivity point, tradeoff point, risk, non-risk) and explain the reasoning that justifies the classification.
status: scaffold
library: p5.js
bloom_level: Analyze (L4) — Differentiate between sensitivity points, tradeoff points, risks, and non-risks given concrete architectural decision descriptions.
---

# Risk Result Type Explorer

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to classify a given architectural decision into the correct ATAM result type (sensitivity point, tradeoff point, risk, non-risk) and explain the reasoning that justifies the classification.

- **Bloom Level:** Analyze (L4) — Differentiate between sensitivity points, tradeoff points, risks, and non-risks given concrete architectural decision descriptions.
- **Bloom Verb:** Differentiate
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 10: Sensitivity, Tradeoffs, Risk Analysis, and ATAM Reporting](../../chapters/10-risk-analysis-atam-reporting/index.md).

```text
Type: microsim
**sim-id:** atam-result-type-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive classification tool showing example architectural decisions and asking students to classify each as a sensitivity point, tradeoff point, risk, or non-risk — with immediate feedback and explanation.

Bloom Level: Analyze (L4) — Differentiate between sensitivity points, tradeoff points, risks, and non-risks given concrete architectural decision descriptions.
Bloom Verb: Differentiate

Learning Objective: Students will be able to classify a given architectural decision into the correct ATAM result type (sensitivity point, tradeoff point, risk, non-risk) and explain the reasoning that justifies the classification.

Canvas layout:
- Left panel: Architectural decision card with scenario context, system description, and decision description
- Center: Four classification buttons: "Sensitivity Point", "Tradeoff Point", "Risk", "Non-Risk"
- Right panel: Feedback panel (appears after classification) — shows correct answer, explanation, and which quality attributes are involved
- Bottom: Progress tracker (decisions classified correctly / total) and "Next Decision" button

Decision cards (8 total, presented in sequence):
1. "The authentication service uses JWT tokens with a 15-minute expiration, cached in Redis." — With (H,H) performance and (M,H) security scenarios. Answer: Tradeoff Point (performance via caching vs. security if Redis is compromised)
2. "The search service has no index on the product_name field, and the (H,H) performance scenario requires 100ms search response." — Answer: Risk (architecture lacks the tactic needed to achieve the scenario)
3. "The checkout service uses a connection pool of 200 connections to the payment database, sized for 3× peak traffic." — Answer: Non-Risk (well-analyzed, adequately provisioned)
4. "The load balancer routes all requests round-robin; changing algorithm to least-connections improves average response time by 40%." — Answer: Sensitivity Point (load balancing algorithm has disproportionate performance impact)
5. "Microservices communicate synchronously — this achieves 50ms P99 latency but means the ordering service fails when the inventory service is slow." — Answer: Tradeoff Point (performance vs. availability)
6. "The backup restore process has never been tested; the (H,H) availability scenario requires recovery within 30 minutes." — Answer: Risk (untested recovery = unknown, likely insufficient)
7. "Event-driven architecture provides availability via decoupling but introduces eventual consistency in the order status view." — Answer: Tradeoff Point (availability vs. consistency)
8. "The API gateway enforces rate limiting at 1000 req/s per client; the (H,H) security scenario requires DDoS protection." — Answer: Non-Risk (tactic is present and appropriately configured for the scenario)

Feedback panel content per decision: correct/incorrect indicator, explanation of why this classification is correct, which quality attributes are affected, and what an ATAM evaluation team would document for this finding.

Instructional Rationale: Classification practice with immediate feedback is appropriate for Analyze because students must apply the definitional distinctions with concrete examples, not just recall definitions. Eight diverse examples cover all four types in multiple quality attribute contexts.

Color scheme: Blue for Sensitivity Point, Orange for Tradeoff Point, Red for Risk, Green for Non-Risk. Gold for correct answers.

Responsive: Cards and buttons resize proportionally.
```

## Related Resources

- [Chapter 10: Sensitivity, Tradeoffs, Risk Analysis, and ATAM Reporting](../../chapters/10-risk-analysis-atam-reporting/index.md)
