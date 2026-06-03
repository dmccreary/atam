---
title: Vertical vs. Horizontal Scaling Tradeoffs
description: Vertical vs. Horizontal Scaling Tradeoffs
status: scaffold
library: p5.js
bloom_level: TBD
---

# Vertical vs. Horizontal Scaling Tradeoffs

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
**sim-id:** scaling-tradeoff-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Purpose:** Side-by-side comparison of vertical and horizontal scaling strategies showing cost curves, capacity ceilings, and fault isolation properties under different workload models.

**Controls:**
- Workload type selector: stateless, stateful, database-write-heavy
- Growth rate slider: 5%–50% monthly
- Current load slider
- Parallelizable fraction slider (Amdahl's p): 0.5–1.0

**Display:**
- Left panel: vertical scaling — instance size vs. cost curve with saturation point
- Right panel: horizontal scaling — nodes vs. throughput curve with Amdahl's wall
- Bottom: time-to-saturation for each strategy at current growth rate
- Recommendation panel: "given these parameters, horizontal scaling hits Amdahl's wall at N nodes"
```

## Related Resources

- [Chapter 15: Performance Engineering and Scaling](../../chapters/15-performance-engineering-scaling/index.md)
