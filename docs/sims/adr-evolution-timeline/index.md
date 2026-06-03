---
title: ADR to Architecture Evolution Pipeline
description: Students will be able to trace an architectural decision through its ADR history, identify what triggered each revision, and explain the relationship between ATAM evaluation findings and ADR creation.
status: scaffold
library: p5.js
bloom_level: Understand (L2) — Explain how Architecture Decision Records document the evolution of architectural decisions over time, and how ATAM evaluations generate new or superseding ADRs.
---

# ADR to Architecture Evolution Pipeline

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to trace an architectural decision through its ADR history, identify what triggered each revision, and explain the relationship between ATAM evaluation findings and ADR creation.

- **Bloom Level:** Understand (L2) — Explain how Architecture Decision Records document the evolution of architectural decisions over time, and how ATAM evaluations generate new or superseding ADRs.
- **Bloom Verb:** Explain
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 8: Architectural Patterns and Styles](../../chapters/08-architectural-patterns-styles/index.md).

```text
Type: timeline
**sim-id:** adr-evolution-timeline<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive timeline showing the evolution of a system's architectural decisions through a series of ADRs, from initial design through two ATAM evaluation cycles, demonstrating how ADRs capture the architectural decision history.

Bloom Level: Understand (L2) — Explain how Architecture Decision Records document the evolution of architectural decisions over time, and how ATAM evaluations generate new or superseding ADRs.
Bloom Verb: Explain

Learning Objective: Students will be able to trace an architectural decision through its ADR history, identify what triggered each revision, and explain the relationship between ATAM evaluation findings and ADR creation.

Canvas layout:
- Horizontal timeline with two tracks: ADR track (top) and system events track (bottom)
- ADR entries shown as labeled cards above the timeline, color-coded by status (green=Active, orange=Superseded, gray=Deprecated)
- System events shown as labeled markers below (requirements change, ATAM evaluation, production incident, business pivot)
- Connecting arrows between system events and the ADRs they triggered or updated
- Detail panel on the right showing full ADR content when an entry is clicked

Example timeline entries:

Year 1:
- Event: System design begins
- ADR-001: Use layered architecture (Active, accepted based on initial team size and MVP requirements)
- ADR-002: Use REST APIs for all external interfaces (Active)

Year 2:
- Event: Scale-out requirements emerge (10× growth)
- ADR-003: Migrate high-load services to microservices (Active, supersedes parts of ADR-001)
- ADR-001 status → Superseded (with link to ADR-003)
- Event: ATAM Evaluation #1 — identifies authentication service as (H,H) latency risk
- ADR-004: Add Redis caching layer to authentication service (Active, addresses ATAM finding)

Year 3:
- Event: Real-time dashboard feature required
- ADR-005: Add WebSocket for dashboard event streaming (Active)
- Event: ATAM Evaluation #2 — identifies WebSocket connection management as (M,H) scenario
- ADR-006: Implement sticky load balancer with health-check-aware session persistence (Active)

Interactive elements:
- Click any ADR card to see its full content (Context, Decision, Consequences)
- Click any system event marker to see what ADRs it triggered or modified
- Hover connecting arrows to see the relationship type ("triggered by", "supersedes", "addresses finding")
- "Show ADR-Only" button collapses system events track to show the ADR decision history alone

Color scheme: Green for Active ADRs, Orange for Superseded, Gray for Deprecated. Blue for system events, Gold for ATAM evaluation events.

Responsive: Timeline scrolls horizontally; panel stacks below on narrow screens.
```

## Related Resources

- [Chapter 8: Architectural Patterns and Styles](../../chapters/08-architectural-patterns-styles/index.md)
