---
title: Active-Passive vs. Active-Active Failover
description: Active-Passive vs. Active-Active Failover
status: scaffold
library: vis-network
bloom_level: TBD
---

# Active-Passive vs. Active-Active Failover

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
[Chapter 16: Observability, Reliability, and Cloud Operations](../../chapters/16-observability-reliability/index.md).

```text
Type: Interactive simulation
**sim-id:** failover-architecture-explorer<br/>
**Library:** vis-network<br/>
**Status:** Specified

**Purpose:** Animated comparison of active-passive and active-active multi-region architectures showing traffic routing, replication flows, and failover behavior.

**Nodes:**
- Region A (primary): load balancer, app tier, database primary
- Region B (standby/secondary): load balancer, app tier, database replica
- DNS layer (global)
- Client nodes (5 geographic locations)

**Modes:**
- Active-Passive: all traffic → Region A; replication arrows to Region B; "Simulate Failure" button triggers animated failover sequence showing DNS cutover and passive→active promotion
- Active-Active: traffic split across regions; write routing arrows to primary database; replication arrows bidirectional

**Display:** RTO/RPO indicators update dynamically based on replication lag slider and failover time configuration.
```

## Related Resources

- [Chapter 16: Observability, Reliability, and Cloud Operations](../../chapters/16-observability-reliability/index.md)
