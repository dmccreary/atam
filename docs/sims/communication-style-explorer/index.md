---
title: Communication Style Tradeoff Explorer
description: Students will be able to select the most appropriate communication style for a given quality attribute scenario set, and explain the tradeoff implications of their choice using the five comparison dimensions.
status: scaffold
library: p5.js
bloom_level: Evaluate (L5) — Assess which communication style best fits a set of quality attribute requirements and justify the selection with tradeoff analysis.
---

# Communication Style Tradeoff Explorer

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to select the most appropriate communication style for a given quality attribute scenario set, and explain the tradeoff implications of their choice using the five comparison dimensions.

- **Bloom Level:** Evaluate (L5) — Assess which communication style best fits a set of quality attribute requirements and justify the selection with tradeoff analysis.
- **Bloom Verb:** Assess
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 8: Architectural Patterns and Styles](../../chapters/08-architectural-patterns-styles/index.md).

```text
Type: microsim
**sim-id:** communication-style-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive simulator comparing the four communication styles (REST, gRPC, GraphQL, WebSocket) across five dimensions, with scenario-based matching that lets students select quality attribute requirements and see which style best fits.

Bloom Level: Evaluate (L5) — Assess which communication style best fits a set of quality attribute requirements and justify the selection with tradeoff analysis.
Bloom Verb: Assess

Learning Objective: Students will be able to select the most appropriate communication style for a given quality attribute scenario set, and explain the tradeoff implications of their choice using the five comparison dimensions.

Canvas layout:
- Left panel: Five quality attribute requirement sliders (Performance Priority, Interoperability Priority, Real-Time Requirement, Schema Enforcement, Simplicity Priority — each 1-5)
- Center: Radar chart showing how each of the four communication styles scores on these dimensions, with the student's "requirement" polygon overlaid
- Right panel: Recommendation panel showing best-fit style and gap analysis (where requirements exceed scores)
- Bottom: Scenario selector with three pre-built scenarios to load

Radar axes:
- Performance (internal throughput) — gRPC scores 5, REST scores 3, GraphQL 3, WebSocket 4
- Interoperability — REST scores 5, GraphQL 4, gRPC 2, WebSocket 2
- Real-Time Suitability — WebSocket scores 5, gRPC 4, REST 1, GraphQL 2
- Schema Enforcement — gRPC scores 5, GraphQL 4, REST 2, WebSocket 1
- Operational Simplicity — REST scores 5, gRPC 3, GraphQL 2, WebSocket 2

Pre-built scenarios:
1. Public API for e-commerce: high interoperability, moderate performance, no real-time → REST recommended
2. Microservices backbone for financial transactions: high performance, high schema enforcement, no real-time → gRPC recommended
3. Live collaborative document editor: high real-time, moderate performance, low interop → WebSocket recommended

Behavior:
- Moving sliders updates the requirement polygon on the radar in real-time
- Best-fit style is highlighted when requirement polygon most closely matches a style's polygon
- "Explain Choice" button reveals a text panel explaining why the selected style fits and what tradeoffs it accepts
- Clicking any style's polygon highlights it and shows its full tradeoff profile

Instructional Rationale: Slider-driven exploration is appropriate for the Evaluate objective because it forces students to externalize their quality attribute priorities before seeing recommendations, preventing anchoring on a familiar default choice.

Color scheme: Gold for REST polygon, Blue for gRPC, Green for GraphQL, Orange for WebSocket, Red dashed for student requirement polygon.

Responsive: Radar and panels scale to container width.
```

## Related Resources

- [Chapter 8: Architectural Patterns and Styles](../../chapters/08-architectural-patterns-styles/index.md)
