---
title: Distributed Tracing Waterfall View
description: Distributed Tracing Waterfall View
status: scaffold
library: p5.js
bloom_level: TBD
---

# Distributed Tracing Waterfall View

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

TBD

- **Bloom Level:** TBD
- **Bloom Verb:** TBD
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 16: Observability, Reliability, and Cloud Operations](../../chapters/16-observability-reliability/index.md).

```text
Type: Interactive diagram
**sim-id:** distributed-trace-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Purpose:** Simulate a distributed trace waterfall for a 5-service e-commerce request (API Gateway → Auth Service → Product Service → Inventory DB → Recommendation Service), showing spans, timing, and latency contributions.

**Controls:**
- Service latency sliders (each service: 1–200ms)
- "Inject Slowness" buttons per service to simulate a bottleneck
- Toggle "Database slow query" checkbox

**Display:**
- Horizontal waterfall timeline showing span start/end for each service
- Cumulative latency indicator (p50/p95 estimate)
- Color coding: green < 50ms, yellow 50–150ms, red > 150ms per span
- Total trace duration prominently displayed

**Behavior:** When a service's latency exceeds a configurable threshold, it highlights the span in red and displays "ATAM Sensitivity Point Detected" banner.
```

## Related Resources

- [Chapter 16: Observability, Reliability, and Cloud Operations](../../chapters/16-observability-reliability/index.md)
