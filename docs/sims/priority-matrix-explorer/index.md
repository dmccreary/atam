---
title: Priority Matrix and Analytical Roadmap
description: Interactive p5.js MicroSim for assessing a utility tree's scenario distribution across a 2x2 Importance-by-Difficulty priority matrix.
image: /sims/priority-matrix-explorer/priority-matrix-explorer.png
og:image: /sims/priority-matrix-explorer/priority-matrix-explorer.png
twitter:image: /sims/priority-matrix-explorer/priority-matrix-explorer.png
social:
   cards: false
quality_score: 0
---

# Priority Matrix and Analytical Roadmap

<iframe src="main.html" height="572" width="100%" scrolling="no"></iframe>

[Run the Priority Matrix Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim plots a healthcare patient-portal utility tree's leaf scenarios on a 2×2 priority matrix — **Importance** on the vertical axis, **Difficulty** on the horizontal. Each quadrant carries an analytical recommendation, and the top-right **Critical — Analyze First (H,H)** quadrant is the set an ATAM team examines first. Dots are colored by quality attribute and can be dragged between quadrants so students can judge whether a given distribution focuses the evaluation appropriately.

## How to Use

1. **Click a dot** to read its full scenario and its Importance/Difficulty rating in the detail panel.
2. **Drag a dot** to reclassify it. The **(H,H) Analyze-First** badge updates live, so you can see how reclassification changes the analytical roadmap.
3. **Show Critical Path** links the (H,H) scenarios in evaluation order.
4. **Filter** cycles through the quality attributes, dimming the others so you can assess one attribute's distribution at a time.
5. **Reset** restores the original ratings.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/priority-matrix-explorer/main.html"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / Professional

### Duration
15-20 minutes

### Prerequisites
Familiarity with utility trees and the (Importance, Difficulty) rating of leaf scenarios.

### Bloom's Taxonomy Level
Evaluate (L5)

### Learning Objective
Students will be able to interpret the priority-matrix distribution of a utility tree, evaluate whether the (H,H) scenario count and distribution is appropriate for a complete evaluation, and identify which scenarios the team should analyze first.

### Activities

1. **Read the distribution** (5 min): Students count the (H,H) scenarios and name the quality attributes that dominate the critical quadrant.
2. **Stress test** (5 min): Students drag a borderline scenario across the Importance line and discuss how an over-full (H,H) quadrant dilutes a fixed analysis budget.
3. **Roadmap** (5 min): Using Show Critical Path, students propose the order in which the team should analyze the critical scenarios and justify it.

### Assessment
Ask students whether a utility tree with twelve (H,H) scenarios and a one-day evaluation is well-formed, and to use the matrix to argue for re-rating some scenarios.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Kazman, R., Klein, M., & Clements, P. (2000). *ATAM: Method for Architecture Evaluation* (CMU/SEI-2000-TR-004).
