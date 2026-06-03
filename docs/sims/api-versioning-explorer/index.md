---
title: API Versioning and Contract-First Design Patterns
description: Students will be able to compare API versioning strategies across dimensions of operational complexity, consumer migration burden, and modifiability cost, and select the most appropriate strategy for a given set of quality attribute priorities.
status: scaffold
library: p5.js
bloom_level: Evaluate (L5) — Assess API versioning strategies to select the approach most appropriate for a given modifiability scenario and consumer ecosystem.
---

# API Versioning and Contract-First Design Patterns

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to compare API versioning strategies across dimensions of operational complexity, consumer migration burden, and modifiability cost, and select the most appropriate strategy for a given set of quality attribute priorities.

- **Bloom Level:** Evaluate (L5) — Assess API versioning strategies to select the approach most appropriate for a given modifiability scenario and consumer ecosystem.
- **Bloom Verb:** Assess
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 12: Distributed Systems Patterns](../../chapters/12-distributed-systems-patterns/index.md).

```text
Type: diagram
**sim-id:** api-versioning-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive visualization comparing four API versioning strategies (URL-based, header-based, content negotiation, additive-only/semantic) across modifiability, complexity, and consumer migration dimensions, with a contract-first workflow illustration.

Bloom Level: Evaluate (L5) — Assess API versioning strategies to select the approach most appropriate for a given modifiability scenario and consumer ecosystem.
Bloom Verb: Assess

Learning Objective: Students will be able to compare API versioning strategies across dimensions of operational complexity, consumer migration burden, and modifiability cost, and select the most appropriate strategy for a given set of quality attribute priorities.

Canvas layout:
- Left panel: Versioning strategy cards (four strategies), each with: approach description, modifiability score (1-5), complexity score (1-5), consumer migration effort (1-5)
- Center: Scenario selector — student selects "system context" (public API with many external consumers, internal microservices, event streaming platform) and quality attribute priorities (performance, modifiability, simplicity)
- Right panel: "Best fit" recommendation with justification, and the specific tradeoffs the recommended strategy accepts

Strategy details:
1. URL Versioning (/v1/, /v2/): Modifiability=3, Complexity=2, Migration=3
   Pro: Simple, explicit; Con: Duplicate implementations, URL pollution
2. Header Versioning: Modifiability=4, Complexity=3, Migration=2
   Pro: Clean URLs; Con: Complex routing, client implementation overhead
3. Content Negotiation: Modifiability=4, Complexity=4, Migration=2
   Pro: Most REST-pure; Con: Complex content type handling
4. Additive-Only Semantic Versioning: Modifiability=5, Complexity=1, Migration=5
   Pro: No breaking changes, simplest; Con: Schema accumulates deprecated fields

Contract-first workflow diagram (lower panel):
- Step 1: Define OpenAPI/Protobuf contract (shown as a YAML file icon)
- Step 2: Generate server stubs and client SDKs (arrow to code icons)
- Step 3: Implement server (arrow to server box)
- Step 4: Consumer-driven contract tests run on every build (arrow to test runner icon)
- Step 5: Schema registry validates compatibility before deployment

Interactive elements:
- Click any strategy card for full pros/cons and when-to-use guidance
- Adjust scenario and priorities to see recommendation change
- Hover contract-first workflow steps to see implementation tools

Color scheme: Blue for strategy cards, Gold for recommendation panel, Teal for contract-first workflow.

Responsive: Strategy cards stack vertically on narrow screens.
```

## Related Resources

- [Chapter 12: Distributed Systems Patterns](../../chapters/12-distributed-systems-patterns/index.md)
