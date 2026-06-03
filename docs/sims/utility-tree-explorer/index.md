---
title: Utility Tree Interactive Explorer
description: Interactive p5.js MicroSim for exploring a complete healthcare-portal utility tree with color-coded Importance/Difficulty rating badges.
image: /sims/utility-tree-explorer/utility-tree-explorer.png
og:image: /sims/utility-tree-explorer/utility-tree-explorer.png
twitter:image: /sims/utility-tree-explorer/utility-tree-explorer.png
social:
   cards: false
quality_score: 0
---

# Utility Tree Interactive Explorer

<iframe src="main.html" height="602" width="100%" scrolling="no"></iframe>

[Run the Utility Tree Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim presents a complete utility tree for a healthcare patient-portal system as an indented, expandable outline. It shows the four levels of every utility tree — the gold **root** (overall Utility), blue quality attribute **branches**, teal **sub-attribute** nodes, and **leaf scenarios** — and gives each leaf a color-coded **(Importance, Difficulty)** rating badge. Clicking a leaf explains why it earned its rating, which is the skill the chapter is teaching: interpreting ratings to find the scenarios that deserve priority analytical attention.

## How to Use

1. **Expand and collapse** any node by clicking it (or use **Expand All** / **Collapse All**).
2. **Read the rating badges** on the leaves. The color tells you the priority class: red (H,H) is *analyze first*, orange is high-value, gold is a quick win, blue is secondary, gray is monitor-only.
3. **Click a leaf scenario** to open the detail panel, which shows its branch → sub-attribute path, its rating label, and a one-sentence rationale for the Importance and Difficulty.
4. **Focus (H,H)** hides every lower-priority leaf so the critical set across the whole tree stands out.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/utility-tree-explorer/main.html"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / Professional

### Duration
10-15 minutes

### Prerequisites
None beyond an introduction to quality attributes.

### Bloom's Taxonomy Level
Understand (L2)

### Learning Objective
Students will be able to identify each level of a utility tree (root, quality attribute branch, sub-attribute node, leaf scenario), interpret the importance and difficulty ratings, and explain why (H,H) scenarios receive priority analytical attention.

### Activities

1. **Name the levels** (4 min): Students click through the tree and label an example of each of the four levels.
2. **Interpret ratings** (5 min): Students open three different leaves and explain, in their own words, why each pair of ratings makes sense.
3. **Focus** (4 min): Students click Focus (H,H) and list the critical scenarios, then explain why those five would be analyzed first.

### Assessment
Give students an unrated leaf scenario and ask them to assign and justify an (Importance, Difficulty) rating consistent with the examples in the tree.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Kazman, R., Klein, M., & Clements, P. (2000). *ATAM: Method for Architecture Evaluation* (CMU/SEI-2000-TR-004).
