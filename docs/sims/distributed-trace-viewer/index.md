---
title: Distributed Tracing Visualization
description: Students will be able to read a distributed trace waterfall diagram, identify the critical path spans contributing most to total latency, and diagnose the root cause of a latency issue from trace data.
status: scaffold
library: p5.js
bloom_level: Analyze (L4) — Examine a distributed trace to identify the root cause of a latency issue, pinpointing which service and operation is the bottleneck.
---

# Distributed Tracing Visualization

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to read a distributed trace waterfall diagram, identify the critical path spans contributing most to total latency, and diagnose the root cause of a latency issue from trace data.

- **Bloom Level:** Analyze (L4) — Examine a distributed trace to identify the root cause of a latency issue, pinpointing which service and operation is the bottleneck.
- **Bloom Verb:** Examine
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 11: Distributed Systems Architecture Fundamentals](../../chapters/11-distributed-systems-fundamentals/index.md).

```text
Type: diagram
**sim-id:** distributed-trace-viewer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive Gantt-style waterfall diagram showing a distributed trace for a realistic request through a microservices system, with clickable spans revealing their details and latency contribution analysis.

Bloom Level: Analyze (L4) — Examine a distributed trace to identify the root cause of a latency issue, pinpointing which service and operation is the bottleneck.
Bloom Verb: Examine

Learning Objective: Students will be able to read a distributed trace waterfall diagram, identify the critical path spans contributing most to total latency, and diagnose the root cause of a latency issue from trace data.

Canvas layout:
- Horizontal Gantt-style waterfall
- Each span displayed as a horizontal bar, labeled with service name and operation
- Spans indented to show parent-child relationships (hierarchical call tree)
- Duration shown on each span
- Total trace duration shown at top
- A "critical path" highlight button outlines the longest sequential path in gold
- Detail panel on right showing span metadata when clicked

Example trace (checkout service request, total = 850ms):
- checkout-service: checkout.process [0ms - 850ms] — root span
  - auth-service: token.validate [5ms - 45ms, 40ms duration]
  - inventory-service: inventory.check [50ms - 180ms, 130ms duration]
    - database: SELECT inventory WHERE product_id=... [60ms - 170ms, 110ms duration]
  - pricing-service: price.calculate [185ms - 395ms, 210ms duration] ← SLOW
    - cache-service: cache.get [185ms - 200ms, 15ms duration] ← MISS
    - database: complex pricing query [200ms - 390ms, 190ms duration] ← ROOT CAUSE
  - payment-service: payment.authorize [400ms - 780ms, 380ms duration] ← SLOW
    - external-gateway: authorize.card [410ms - 770ms, 360ms duration] ← external latency
  - order-service: order.create [785ms - 840ms, 55ms duration]

Interactive elements:
- Click any span to see: service name, operation, start time, duration, tags (cache hit/miss, SQL query, HTTP status)
- "Show Critical Path" button highlights the sequential chain contributing most to total latency
- "Filter by Service" dropdown to focus on one service's spans
- "Compare Traces" mode allows loading a second trace for comparison (fast vs. slow version)
- Annotation markers showing anomalies: cache miss, slow query, external latency

Color scheme: Each service in a distinct color. Red highlight for spans exceeding their expected baseline. Gold for critical path.

Responsive: Trace scrolls horizontally; vertical height scales with span count.
```

## Related Resources

- [Chapter 11: Distributed Systems Architecture Fundamentals](../../chapters/11-distributed-systems-fundamentals/index.md)
