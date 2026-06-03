---
title: Cloud-Native Architecture Quality Attribute Stack
description: Students will be able to identify at least three quality attribute contributions and one quality attribute risk at each layer of the cloud-native technology stack.
status: scaffold
library: p5.js
bloom_level: Analyze (L4) — Examine how each layer of the cloud-native stack contributes to specific quality attributes and introduces specific risks.
---

# Cloud-Native Architecture Quality Attribute Stack

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to identify at least three quality attribute contributions and one quality attribute risk at each layer of the cloud-native technology stack.

- **Bloom Level:** Analyze (L4) — Examine how each layer of the cloud-native stack contributes to specific quality attributes and introduces specific risks.
- **Bloom Verb:** Examine
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 13: Cloud-Native Architecture](../../chapters/13-cloud-native-architecture/index.md).

```text
Type: diagram
**sim-id:** cloud-native-qa-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive layer diagram showing the cloud-native technology stack (hardware → IaaS → containers → Kubernetes → services → applications) with quality attribute contributions and tradeoffs visible at each layer — click any layer to see its quality attribute profile.

Bloom Level: Analyze (L4) — Examine how each layer of the cloud-native stack contributes to specific quality attributes and introduces specific risks.
Bloom Verb: Examine

Learning Objective: Students will be able to identify at least three quality attribute contributions and one quality attribute risk at each layer of the cloud-native technology stack.

Canvas layout:
- Vertical stack of five technology layers, each as a horizontal band
- Each layer labeled with: technology name, a brief role description, 2-3 "supports QA" badges (green), and 1-2 "threatens QA" badges (red)
- Clicking any layer expands a detail panel on the right showing full quality attribute analysis
- Arrow annotations on the right side showing which quality attributes are managed at which layer (e.g., "Scalability managed by Kubernetes HPA")

Layers (bottom to top):
1. IaaS / Managed Services: "Virtual compute, storage, networking provided by cloud provider"
   Supports: Availability (physical redundancy), Scalability (elastic provisioning)
   Threatens: Vendor lock-in (proprietary services), Cost predictability

2. Containers / Docker: "Packaging and isolation layer"
   Supports: Portability, Consistency, Deployability
   Threatens: Security (shared kernel), Complexity (image management)

3. Kubernetes Orchestration: "Auto-healing, scaling, and service discovery"
   Supports: Availability (auto-healing), Scalability (HPA), Deployability (rolling updates)
   Threatens: Complexity (steep learning curve), Performance (network overhead)

4. Infrastructure as Code / GitOps: "Declarative, version-controlled infrastructure"
   Supports: Deployability (reproducible), Reliability (no drift), Auditability
   Threatens: Learning curve, Change velocity (reviews required)

5. Application / Service Mesh: "Business logic and cross-cutting concerns"
   Supports: Modifiability, Security (mTLS via mesh), Observability
   Threatens: Performance (sidecar overhead), Operational complexity

Interactive elements:
- Click any layer to expand full quality attribute analysis in right panel
- "Show QA" button for each quality attribute highlights which layers contribute to it
- Hover "supports" badges to see the specific mechanism

Color scheme: Five distinct layer colors from bottom (gray) to top (gold). Green badges for supports, red for threatens.

Responsive: Stack compresses proportionally; detail panel moves below on narrow screens.
```

## Related Resources

- [Chapter 13: Cloud-Native Architecture](../../chapters/13-cloud-native-architecture/index.md)
