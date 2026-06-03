---
title: Utility Tree Construction Workshop Simulator
description: Students will be able to build a complete utility tree for a provided system description, including quality attribute branches, sub-attribute nodes, rated leaf scenarios, and an identified list of (H,H) priority scenarios.
status: scaffold
library: p5.js
bloom_level: Create (L6) — Design a utility tree for a given system by constructing quality attribute branches, sub-attribute nodes, and rated leaf-level scenarios.
---

# Utility Tree Construction Workshop Simulator

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to build a complete utility tree for a provided system description, including quality attribute branches, sub-attribute nodes, rated leaf scenarios, and an identified list of (H,H) priority scenarios.

- **Bloom Level:** Create (L6) — Design a utility tree for a given system by constructing quality attribute branches, sub-attribute nodes, and rated leaf-level scenarios.
- **Bloom Verb:** Design
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 7: Utility Trees and Scenario Prioritization](../../chapters/07-utility-trees-prioritization/index.md).

```text
Type: microsim
**sim-id:** utility-tree-builder<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive tool for building a utility tree step-by-step, allowing students to add quality attribute branches, create sub-attribute nodes, write leaf scenarios, and assign importance/difficulty ratings, with real-time visualization of the tree structure.

Bloom Level: Create (L6) — Design a utility tree for a given system by constructing quality attribute branches, sub-attribute nodes, and rated leaf-level scenarios.
Bloom Verb: Design

Learning Objective: Students will be able to build a complete utility tree for a provided system description, including quality attribute branches, sub-attribute nodes, rated leaf scenarios, and an identified list of (H,H) priority scenarios.

Canvas layout:
- Left panel: Step-by-step construction panel with current step highlighted
- Center: Live tree visualization updating as elements are added
- Right panel: Scenario editor form (six fields + importance/difficulty selectors)
- Bottom: (H,H) scenario counter and "Validate Tree" button

Construction steps (guided):
Step 1: Select quality attribute branches from checklist (Performance, Availability, Security, Modifiability, Interoperability, Scalability, others)
Step 2: For each selected branch, add 2-4 sub-attribute nodes (text input)
Step 3: For each sub-attribute, add 1-3 leaf scenarios using the six-component form
Step 4: Rate each leaf scenario (Importance: H/M/L, Difficulty: H/M/L) using dropdowns
Step 5: Review priority matrix — system automatically groups scenarios into (H,H), (H,M/L), (M/H,H), (M,M) quadrants

Controls:
- "Add Branch" button adds a new quality attribute branch
- "Add Sub-Attribute" button (context-sensitive to selected branch) adds a node
- "Add Scenario" button (context-sensitive to selected sub-attribute) opens scenario editor
- Importance and Difficulty dropdowns per leaf scenario
- "Auto-Rate" button applies suggested ratings based on scenario text keywords (demonstration mode)

Validation (when "Validate Tree" button clicked):
- Minimum structure check: at least 3 branches, 2 sub-attributes per branch, 1 scenario per sub-attribute
- Coverage check: at least one scenario per major quality attribute in scope
- Rating check: all leaf scenarios rated on both dimensions
- (H,H) check: at least 2 (H,H) scenarios exist
- Provides feedback: "Tree structure complete" / "Add sub-attributes to Performance branch" / "Missing importance rating on 3 scenarios"

Instructional Rationale: Step-by-step construction with guided prompts is appropriate for the Create objective because it scaffolds the complex task of tree building while requiring students to supply all system-specific content. The validation feedback closes the loop on correctness.

Color scheme: Gold for root, Blue for branches, Teal for sub-attributes, color-coded leaves by (I,D) rating. Green for validated elements.

Responsive: Layout reflows to vertical on narrow screens.
```

## Related Resources

- [Chapter 7: Utility Trees and Scenario Prioritization](../../chapters/07-utility-trees-prioritization/index.md)
