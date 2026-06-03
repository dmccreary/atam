---
title: Tactic Interaction Web
description: Students will be able to identify at least three tactic interaction chains (where applying tactic A improves QA-1 but degrades QA-2, which may require applying tactic B to compensate), and explain why these interactions are ATAM tradeoff points.
status: scaffold
library: vis-network
bloom_level: Analyze (L4) — Examine tactic interactions to identify where applying a tactic to improve one quality attribute creates risks for another, and trace the interaction chain through multiple tactics.
---

# Tactic Interaction Web

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to identify at least three tactic interaction chains (where applying tactic A improves QA-1 but degrades QA-2, which may require applying tactic B to compensate), and explain why these interactions are ATAM tradeoff points.

- **Bloom Level:** Analyze (L4) — Examine tactic interactions to identify where applying a tactic to improve one quality attribute creates risks for another, and trace the interaction chain through multiple tactics.
- **Bloom Verb:** Examine
- **Library:** vis-network

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 9: Architectural Tactics and Design Principles](../../chapters/09-architectural-tactics-principles/index.md).

```text
Type: diagram
**sim-id:** tactic-interaction-web<br/>
**Library:** vis-network<br/>
**Status:** Specified

Purpose: Interactive network graph showing architectural tactics as nodes, quality attributes as colored zones, and tactic interactions as directed edges — allowing students to explore how applying one tactic affects other quality attributes.

Bloom Level: Analyze (L4) — Examine tactic interactions to identify where applying a tactic to improve one quality attribute creates risks for another, and trace the interaction chain through multiple tactics.
Bloom Verb: Examine

Learning Objective: Students will be able to identify at least three tactic interaction chains (where applying tactic A improves QA-1 but degrades QA-2, which may require applying tactic B to compensate), and explain why these interactions are ATAM tradeoff points.

Node types:
- Quality Attribute nodes (large circles, colored by QA): Performance, Availability, Security, Modifiability, Consistency
- Tactic nodes (smaller rectangles): Caching, Redundancy, Retry, Encryption, Circuit Breaker, Rate Limiting, Connection Pooling, Dependency Injection, Information Hiding

Edge types:
- Green arrows: "Tactic improves this QA" (pointing from tactic to QA)
- Red dashed arrows: "Tactic degrades this QA" (pointing from tactic to QA)
- Orange arrows: "This QA degradation may require this compensating tactic" (pointing from one tactic to another)

Sample interaction chains:
Chain 1: Caching → improves Performance, degrades Consistency; Consistency degradation → may require Cache Invalidation Strategy (compensating tactic)
Chain 2: Redundancy → improves Availability, degrades Performance (coordination); performance degradation → may require Asynchronous Replication (compensating tactic)
Chain 3: Encryption → improves Security, degrades Performance; performance degradation → may require Hardware Security Module (HSM) offload (compensating tactic)

Interactive elements:
- Click any tactic node to highlight all its green (improves) and red (degrades) edges
- Click any QA node to highlight all tactics that affect it
- Click any edge to see the specific mechanism and a realistic example
- "Show Interaction Chains" mode: click a tactic and see the full chain of compensation tactics required

vis-network configuration:
- Physics: force-directed layout with repulsion between nodes
- Node colors: blue for QA nodes, gold for tactic nodes, orange for compensation chain nodes
- Edge colors: green for improvement, red for degradation, orange for compensation

Responsive: Canvas scales to container width; physics layout recomputes on resize.
```

## Related Resources

- [Chapter 9: Architectural Tactics and Design Principles](../../chapters/09-architectural-tactics-principles/index.md)
