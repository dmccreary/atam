---
title: Availability Architecture Analyzer
description: Availability Architecture Analyzer
status: scaffold
library: p5.js
bloom_level: TBD
---

# Availability Architecture Analyzer

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
Type: Interactive simulation
**sim-id:** availability-architecture-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Purpose:** Interactive system availability calculator. Users build a system architecture by placing components in series or parallel configurations and see the resulting system availability, MTBF, MTTR, and allowed downtime.

**Controls:**
- Add component button: specify individual availability (99%–99.999%)
- Series/Parallel toggle for each component group
- MTTR slider per component (1–240 minutes)

**Display:**
- Architecture diagram showing component arrangement
- Real-time system availability calculation
- "Nines" indicator (two through six nines)
- Annual/monthly downtime budget in minutes
- Weakest-link identification (component contributing most to unavailability)
- SLO compliance indicator against configurable target
```

## Related Resources

- [Chapter 16: Observability, Reliability, and Cloud Operations](../../chapters/16-observability-reliability/index.md)
