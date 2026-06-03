---
title: Performance Metric Relationships
description: Performance Metric Relationships
status: scaffold
library: p5.js
bloom_level: TBD
---

# Performance Metric Relationships

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
[Chapter 15: Performance Engineering and Scaling](../../chapters/15-performance-engineering-scaling/index.md).

```text
Type: Interactive simulation
**sim-id:** performance-metrics-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Purpose:** Visualize the relationships between latency, throughput, response time, and concurrency using Little's Law. Users manipulate arrival rate and service time sliders to see how all metrics change.

**Controls:**
- Arrival Rate slider (requests/second): 10–1000
- Service Time slider (ms): 1–500
- Concurrency Limit slider: 1–100

**Display panels:**
- Live Little's Law calculation showing L, λ, W
- Latency distribution histogram (p50/p95/p99 markers)
- Throughput gauge
- Queue depth indicator

**Behavior:** When arrival rate × service time > concurrency limit, the queue grows visually and p99 latency spikes dramatically — illustrating queue saturation.
```

## Related Resources

- [Chapter 15: Performance Engineering and Scaling](../../chapters/15-performance-engineering-scaling/index.md)
