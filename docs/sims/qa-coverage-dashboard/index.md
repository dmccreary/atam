---
title: Quality Attribute Coverage Dashboard
description: Interactive p5.js MicroSim for quality attribute coverage dashboard.
image: /sims/qa-coverage-dashboard/qa-coverage-dashboard.png
og:image: /sims/qa-coverage-dashboard/qa-coverage-dashboard.png
twitter:image: /sims/qa-coverage-dashboard/qa-coverage-dashboard.png
social:
   cards: false
quality_score: 0
---

# Quality Attribute Coverage Dashboard

<iframe src="main.html" height="552" width="100%" scrolling="no"></iframe>

[Run the Quality Attribute Coverage Dashboard MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A radar chart of a system's quality-attribute profile, plotting the current architecture against target requirements and highlighting the gaps in red. It supports assessing strengths, risks, and the decisions behind each score.

## How to Use

Choose an **example system** from the dropdown. Red spokes mark **gaps** where targets exceed current scores. Click any **axis label** to see its definition, the key architectural decisions that drive it, and improvement tactics.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/qa-coverage-dashboard/main.html"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / Professional

### Duration
10-15 minutes

### Prerequisites
Familiarity with the core ATAM quality attributes.

### Bloom's Taxonomy Level
Evaluate (L5)

### Learning Objective
Students can interpret a quality attribute radar chart, identify which attributes are well-addressed and which are risks, and connect scores to the architectural decisions that produce them.

### Activities

1. **Exploration** (5 min): Students freely interact with the MicroSim to discover its behavior.
2. **Guided Practice** (5 min): Working from the learning objective above, students answer 2-3 focused questions posed by the instructor.
3. **Discussion** (5 min): Students share observations and connect them back to ATAM concepts.

### Assessment
Ask students to identify the largest gap for a system and name the architectural decisions that would close it.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Kazman, R., Klein, M., & Clements, P. (2000). *ATAM: Method for Architecture Evaluation* (CMU/SEI-2000-TR-004).
