---
title: Utility Tree Interactive Explorer
description: Students will be able to identify each level of a utility tree (root, quality attribute branch, sub-attribute node, leaf scenario), interpret the importance and difficulty ratings, and explain why (H,H) scenarios receive priority analytical attention.
status: scaffold
library: p5.js
bloom_level: Understand (L2) — Explain the hierarchical structure of a utility tree and interpret the importance/difficulty ratings of leaf-level scenarios.
---

# Utility Tree Interactive Explorer

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to identify each level of a utility tree (root, quality attribute branch, sub-attribute node, leaf scenario), interpret the importance and difficulty ratings, and explain why (H,H) scenarios receive priority analytical attention.

- **Bloom Level:** Understand (L2) — Explain the hierarchical structure of a utility tree and interpret the importance/difficulty ratings of leaf-level scenarios.
- **Bloom Verb:** Explain
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 7: Utility Trees and Scenario Prioritization](../../chapters/07-utility-trees-prioritization/index.md).

```text
Type: diagram
**sim-id:** utility-tree-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Provide an interactive, expandable utility tree visualization showing a complete example tree for a healthcare patient portal system, with color-coded (H,H)/(H,M)/(M,H)/(M,M) scenario ratings, and click-to-expand nodes revealing scenario details.

Bloom Level: Understand (L2) — Explain the hierarchical structure of a utility tree and interpret the importance/difficulty ratings of leaf-level scenarios.
Bloom Verb: Explain

Learning Objective: Students will be able to identify each level of a utility tree (root, quality attribute branch, sub-attribute node, leaf scenario), interpret the importance and difficulty ratings, and explain why (H,H) scenarios receive priority analytical attention.

Canvas layout:
- Tree visualization expanding downward from root
- Root node (top center): "Utility" in gold
- Level 2 branches (quality attribute names): 4 branches visible by default (Performance, Availability, Security, Modifiability), expandable to 6
- Level 3 sub-attribute nodes under each branch
- Level 4 leaf scenarios with (Importance, Difficulty) rating badges
- Color coding: (H,H) = red, (H,M) or (M,H) = orange, (H,L) = gold, (M,M) = blue, (L,*) = gray
- Detail panel on the right showing full scenario when a leaf is clicked
- "Focus Mode" button that dims all nodes except (H,H) ones

Example tree content (healthcare patient portal):
Performance branch:
- Sub-attribute: Response Latency
  - Leaf: Patient appointment search returns results in <800ms at p99 under peak load [H,H]
  - Leaf: Patient record retrieval completes in <2s for records with >500 attachments [H,M]
- Sub-attribute: Batch Processing
  - Leaf: Nightly claim reconciliation completes within 4-hour window [M,M]

Availability branch:
- Sub-attribute: Fault Tolerance
  - Leaf: EHR integration failure does not prevent appointment scheduling [H,H]
  - Leaf: Authentication service failure redirects to backup IdP within 10 seconds [H,M]
- Sub-attribute: Planned Maintenance
  - Leaf: Maintenance window limited to 30 minutes per week, off-peak [H,L]

Security branch:
- Sub-attribute: Access Control
  - Leaf: PHI access limited to authenticated, authorized users; all access logged [H,H]
  - Leaf: Admin account compromise detected and locked within 60 seconds [H,H]
- Sub-attribute: Data Protection
  - Leaf: All PHI encrypted at rest and in transit [H,L]

Modifiability branch:
- Sub-attribute: Feature Evolution
  - Leaf: New insurance provider integration added without changing patient-facing features [H,H]
  - Leaf: HIPAA regulation change implementable within one sprint cycle [M,H]

Interactive elements:
- Click any node to expand its children; click again to collapse
- Click any leaf node to see full six-component scenario in detail panel
- Click (Importance, Difficulty) badge to see the rating rationale
- "Focus (H,H)" button collapses all non-(H,H) leaves and highlights the remaining ones
- Drag-and-drop: drag a leaf to a different sub-attribute to see how the tree restructures

Color scheme: Gold root, blue branches, teal sub-attribute nodes, color-coded leaves by rating. Gray background.

Responsive: Tree scales horizontally; collapses to single-column list on narrow screens.
```

## Related Resources

- [Chapter 7: Utility Trees and Scenario Prioritization](../../chapters/07-utility-trees-prioritization/index.md)
