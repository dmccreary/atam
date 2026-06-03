---
title: Architectural Pattern Quality Attribute Matrix
description: Students will be able to compare at least six architectural patterns across four quality attribute dimensions, identify the pattern most suitable for a given set of (H,H) quality attribute scenarios, and explain the tradeoff mechanism responsible for each pattern's strength or weakness.
status: scaffold
library: p5.js
bloom_level: Analyze (L4) — Compare architectural patterns across quality attribute dimensions to determine which pattern best fits a given set of prioritized quality attribute requirements.
---

# Architectural Pattern Quality Attribute Matrix

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to compare at least six architectural patterns across four quality attribute dimensions, identify the pattern most suitable for a given set of (H,H) quality attribute scenarios, and explain the tradeoff mechanism responsible for each pattern's strength or weakness.

- **Bloom Level:** Analyze (L4) — Compare architectural patterns across quality attribute dimensions to determine which pattern best fits a given set of prioritized quality attribute requirements.
- **Bloom Verb:** Compare
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 8: Architectural Patterns and Styles](../../chapters/08-architectural-patterns-styles/index.md).

```text
Type: diagram
**sim-id:** pattern-quality-matrix<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive matrix showing the quality attribute profile of major architectural patterns — which attributes each pattern primarily supports (green), threatens (red), or is neutral on (gray) — with click-to-explore cells revealing the specific tradeoff mechanism.

Bloom Level: Analyze (L4) — Compare architectural patterns across quality attribute dimensions to determine which pattern best fits a given set of prioritized quality attribute requirements.
Bloom Verb: Compare

Learning Objective: Students will be able to compare at least six architectural patterns across four quality attribute dimensions, identify the pattern most suitable for a given set of (H,H) quality attribute scenarios, and explain the tradeoff mechanism responsible for each pattern's strength or weakness.

Canvas layout:
- Grid: Patterns on rows (8 patterns), Quality Attributes on columns (8 attributes)
- Each cell: colored indicator (green=supports, red=threatens, gray=neutral, yellow=complex/depends)
- Clicking any cell opens a detail panel showing: the specific tradeoff mechanism, a realistic example, and what ATAM scenarios to watch for with this pattern+attribute combination
- Column header click: sorts patterns by that quality attribute (best-supporting at top)
- Row header click: shows full pattern summary and quality attribute profile

Patterns (rows):
1. Layered Architecture
2. Microservices
3. Event-Driven Architecture
4. CQRS
5. Strangler Fig
6. Hexagonal / Clean Architecture
7. Pipe-and-Filter
8. SOA (legacy reference)

Quality Attributes (columns):
Performance, Availability, Security, Modifiability, Scalability, Testability, Deployability, Interoperability

Cell values (sample):
Microservices / Modifiability: Green — "Independent deployment boundary limits blast radius"
Microservices / Performance: Red — "Service-to-service network calls add latency; synchronous chains compound it"
Event-Driven / Availability: Green — "Producer/consumer decoupling; consumer unavailability doesn't affect producers"
Event-Driven / Consistency: Yellow — "Eventual consistency: temporal window where state diverges"
Layered / Testability: Green — "Each layer testable in isolation by stubbing adjacent layers"
Layered / Performance: Yellow — "Layer traversal overhead; acceptable for moderate load, problematic for high-throughput"

Interactive elements:
- Click any cell to see mechanism detail
- Click column header to sort by that attribute
- "Compare Two Patterns" button lets student select two patterns and see a side-by-side profile
- Hover any cell for one-line summary tooltip

Color scheme: Green cells for "Primarily Supports", Red cells for "Primarily Threatens", Yellow cells for "Complex/Depends", Gray cells for Neutral. Header row and column in gold.

Responsive: Matrix scrolls horizontally on narrow screens; column headers stay fixed.
```

## Related Resources

- [Chapter 8: Architectural Patterns and Styles](../../chapters/08-architectural-patterns-styles/index.md)
