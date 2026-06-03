---
title: Lambda vs. Kappa Architecture Comparison
description: Lambda vs. Kappa Architecture Comparison
status: scaffold
library: vis-network
bloom_level: TBD
---

# Lambda vs. Kappa Architecture Comparison

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
[Chapter 18: Advanced Data, Emerging AI, and Autonomous Architectures](../../chapters/18-advanced-data-emerging-ai/index.md).

```text
Type: Interactive comparison
**sim-id:** data-architecture-patterns<br/>
**Library:** vis-network<br/>
**Status:** Specified

**Purpose:** Side-by-side animated flow comparison of Lambda, Kappa, and Data Lakehouse architectures showing data flow from ingestion through serving.

**Panels:**
- Lambda: Data Sources → Kafka → (Batch Layer: HDFS + Spark / Speed Layer: Flink) → Serving Layer → Query
- Kappa: Data Sources → Kafka (durable log) → Flink → Serving Store → Query
- Lakehouse: Data Sources → Ingestion → Object Storage (Delta/Iceberg) → Query Engine → Analytics

**Interactions:**
- Click each component to see: technology examples, quality attribute strengths, failure modes
- "Simulate Reprocessing" button: shows how each architecture handles historical recomputation
- Quality attribute comparison radar chart: latency, consistency, operational complexity, cost
```

## Related Resources

- [Chapter 18: Advanced Data, Emerging AI, and Autonomous Architectures](../../chapters/18-advanced-data-emerging-ai/index.md)
