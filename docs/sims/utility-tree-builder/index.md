---
title: Utility Tree Construction Workshop Simulator
description: Interactive p5.js MicroSim for designing a utility tree — add quality attribute branches, sub-attributes, and rated leaf scenarios with live validation.
image: /sims/utility-tree-builder/utility-tree-builder.png
og:image: /sims/utility-tree-builder/utility-tree-builder.png
twitter:image: /sims/utility-tree-builder/utility-tree-builder.png
social:
   cards: false
quality_score: 0
---

# Utility Tree Construction Workshop Simulator

<iframe src="main.html" height="588" width="100%" scrolling="no"></iframe>

[Run the Utility Tree Builder MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim is a guided builder for constructing a utility tree. A four-step editor on the left lets you add quality attribute **branches**, **sub-attribute** nodes, and rated **leaf scenarios**; the tree visualizes live on the right with color-coded (Importance, Difficulty) badges. An (H,H) counter and a **Validate Tree** button check your tree against the structural rules ATAM expects, scaffolding the otherwise blank-page task of designing a tree from scratch.

## How to Use

1. **Add a branch**: pick a quality attribute and click **Add Branch**.
2. **Select a node** by clicking it in the tree on the right — the editor steps act on whatever is selected.
3. **Add a sub-attribute** to the selected branch (step 2), then **add a leaf scenario** to the selected sub-attribute (step 3).
4. **Rate** the selected leaf with the Importance and Difficulty dropdowns (step 4); the leaf's badge updates immediately.
5. Watch the **(H,H) scenarios** counter, and click **Validate Tree** for specific structural feedback (enough branches, sub-attributes per branch, a scenario per sub-attribute, ratings present, and at least two (H,H) scenarios).

Use **Load Example** to start from a partially built tree, or **Clear** to start fresh.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/utility-tree-builder/main.html"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / Professional

### Duration
20-25 minutes

### Prerequisites
Familiarity with quality attributes, the six-component scenario, and (Importance, Difficulty) rating.

### Bloom's Taxonomy Level
Create (L6)

### Learning Objective
Students will be able to build a complete utility tree for a provided system description, including quality attribute branches, sub-attribute nodes, rated leaf scenarios, and an identified set of (H,H) priority scenarios.

### Activities

1. **Scaffolded build** (10 min): Given a one-paragraph system description, students build a tree with at least three branches, two sub-attributes each, and rated scenarios.
2. **Validate and revise** (8 min): Students click Validate Tree and resolve every flagged issue until the tree is well-formed.
3. **Justify priorities** (5 min): Students explain why their (H,H) scenarios deserve first analytical attention.

### Assessment
Students submit a validated utility tree for an assigned system; the tree must pass all structural checks and include at least two well-justified (H,H) scenarios.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Kazman, R., Klein, M., & Clements, P. (2000). *ATAM: Method for Architecture Evaluation* (CMU/SEI-2000-TR-004).
