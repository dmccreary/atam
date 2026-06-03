---
title: Priority Matrix and Analytical Roadmap
description: Students will be able to interpret the priority matrix distribution of a utility tree, evaluate whether the (H,H) scenario count and distribution is appropriate for a complete evaluation, and identify which scenarios the evaluation team should address first.
status: scaffold
library: p5.js
bloom_level: Evaluate (L5) — Assess the priority distribution of a utility tree's scenarios and determine whether the analytical roadmap appropriately focuses on (H,H) scenarios.
---

# Priority Matrix and Analytical Roadmap

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to interpret the priority matrix distribution of a utility tree, evaluate whether the (H,H) scenario count and distribution is appropriate for a complete evaluation, and identify which scenarios the evaluation team should address first.

- **Bloom Level:** Evaluate (L5) — Assess the priority distribution of a utility tree's scenarios and determine whether the analytical roadmap appropriately focuses on (H,H) scenarios.
- **Bloom Verb:** Assess
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 7: Utility Trees and Scenario Prioritization](../../chapters/07-utility-trees-prioritization/index.md).

```text
Type: diagram
**sim-id:** priority-matrix-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive 2×2 priority matrix (Importance vs. Difficulty) showing a populated utility tree's scenarios distributed across quadrants, with click-to-explore and drag-to-reclassify interaction.

Bloom Level: Evaluate (L5) — Assess the priority distribution of a utility tree's scenarios and determine whether the analytical roadmap appropriately focuses on (H,H) scenarios.
Bloom Verb: Assess

Learning Objective: Students will be able to interpret the priority matrix distribution of a utility tree, evaluate whether the (H,H) scenario count and distribution is appropriate for a complete evaluation, and identify which scenarios the evaluation team should address first.

Canvas layout:
- Large 2×2 matrix with axes: Importance (H/M/L, vertical, increasing upward) and Difficulty (L/M/H, horizontal, increasing rightward)
- Quadrant labels: Top-right = "Critical — Analyze First (H,H)", Top-left = "Confirm — Verify and Document (H,L)", Bottom-right = "Watch — Address If Resources Permit (L,H)", Bottom-left = "Monitor (L,L)"
- Scenario dots placed within appropriate quadrant, colored by quality attribute
- "Analytical sequence" arrows showing the recommended order of attention
- A legend panel listing each quality attribute and its color
- Detail panel showing scenario summary when a dot is clicked

Populated example scenarios (from healthcare patient portal utility tree):
(H,H) quadrant:
- Patient appointment search <800ms under peak load [Performance, red]
- EHR integration failure doesn't prevent scheduling [Availability, blue]
- PHI access only for authenticated/authorized users [Security, green]
- Admin account compromise detected within 60 seconds [Security, green]
- New insurance provider integration without patient-facing changes [Modifiability, purple]

(H,L) quadrant:
- Patient record retrieval <2s for large records [Performance, red]
- Maintenance window <30 min per week [Availability, blue]
- All PHI encrypted at rest and in transit [Security, green]

(M,H) quadrant:
- HIPAA regulation change implementable in one sprint [Modifiability, purple]
- Authentication failover to backup IdP within 10 seconds [Availability, blue]

(L,L) quadrant:
- Nightly claim reconciliation within 4-hour window [Performance, red]

Interactive elements:
- Click any dot to see full scenario summary
- Drag dots between quadrants to explore how reclassification changes the analytical focus
- "Show Critical Path" button draws arrows connecting (H,H) scenarios in order of evaluation priority
- Filter button to show only a specific quality attribute's scenarios
- "(H,H) Count: N" badge updates when dots are moved

Color scheme: Red for Performance, Blue for Availability, Green for Security, Purple for Modifiability, Teal for Scalability. Quadrant backgrounds in distinct light tints.

Responsive: Matrix scales proportionally to container width.
```

## Related Resources

- [Chapter 7: Utility Trees and Scenario Prioritization](../../chapters/07-utility-trees-prioritization/index.md)
