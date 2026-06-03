---
title: Federated Learning Architecture
description: Federated Learning Architecture
status: scaffold
library: p5.js
bloom_level: TBD
---

# Federated Learning Architecture

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
[Chapter 18: Advanced Data, Emerging AI, and Autonomous Architectures](../../chapters/18-advanced-data-emerging-ai/index.md).

```text
Type: Interactive simulation
**sim-id:** federated-learning-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Purpose:** Animated visualization of the federated learning training loop showing model distribution, local training, gradient aggregation, and model improvement across rounds.

**Components:**
- Central coordinator (hub)
- 6 participating nodes (hospitals, devices, banks) with simulated local datasets
- Communication channel animations

**Controls:**
- Privacy budget slider (differential privacy ε): 0.1–10 (lower = more privacy, more noise)
- Non-IID heterogeneity slider: low–high (more heterogeneity = slower convergence)
- Number of rounds slider: 1–100
- Fraction of nodes per round: 0.2–1.0

**Display:**
- Animated model update flows (compression level visualization)
- Convergence curve: global model accuracy vs. rounds
- Privacy-utility tradeoff chart
- "Model leakage risk" indicator based on privacy budget
```

## Related Resources

- [Chapter 18: Advanced Data, Emerging AI, and Autonomous Architectures](../../chapters/18-advanced-data-emerging-ai/index.md)
