---
title: CDN Request Routing and Cache Flow
description: CDN Request Routing and Cache Flow
status: scaffold
library: vis-network
bloom_level: TBD
---

# CDN Request Routing and Cache Flow

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

TBD

- **Bloom Level:** TBD
- **Bloom Verb:** TBD
- **Library:** vis-network

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 15: Performance Engineering and Scaling](../../chapters/15-performance-engineering-scaling/index.md).

```text
Type: Interactive diagram
**sim-id:** cdn-architecture-explorer<br/>
**Library:** vis-network<br/>
**Status:** Specified

**Purpose:** Interactive map showing CDN PoP locations, origin servers, and request routing. Users click on simulated user locations to see which PoP handles their request and the latency comparison (with CDN vs. direct to origin).

**Nodes:**
- Origin server (central, labeled with data center location)
- 8 CDN PoPs (distributed geographically — Americas, Europe, Asia-Pacific)
- 5 simulated user locations

**Interactions:**
- Click user node → animated request path to nearest PoP → cache hit/miss decision → response path back
- Toggle "CDN Enabled/Disabled" to show direct origin routing with latency comparison
- Cache hit rate display updates as different users/request types are simulated
```

## Related Resources

- [Chapter 15: Performance Engineering and Scaling](../../chapters/15-performance-engineering-scaling/index.md)
