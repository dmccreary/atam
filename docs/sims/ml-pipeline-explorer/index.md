---
title: ML Pipeline Architecture Flow
description: ML Pipeline Architecture Flow
status: scaffold
library: vis-network
bloom_level: TBD
---

# ML Pipeline Architecture Flow

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
[Chapter 17: AI and Machine Learning System Architecture](../../chapters/17-ai-ml-system-architecture/index.md).

```text
Type: Interactive workflow diagram
**sim-id:** ml-pipeline-explorer<br/>
**Library:** vis-network<br/>
**Status:** Specified

**Purpose:** Interactive visualization of the complete ML pipeline from data ingestion through deployment, with quality attribute risk indicators at each stage and ATAM evaluation hooks.

**Nodes:** Data Sources, Data Ingestion, Feature Engineering, Feature Store, Model Training, Model Registry, Model Evaluation, Deployment (Batch/Online/Streaming), Monitoring

**Interactions:**
- Click each node to see: quality attribute risks, common failure modes, ATAM sensitivity points
- Toggle pipeline type (batch, online, streaming) to see architecture variations
- "Simulate Drift" button shows monitoring alerts activating

**Display:** Risk heat map overlay showing which pipeline stages are most commonly flagged in ATAM evaluations.
```

## Related Resources

- [Chapter 17: AI and Machine Learning System Architecture](../../chapters/17-ai-ml-system-architecture/index.md)
