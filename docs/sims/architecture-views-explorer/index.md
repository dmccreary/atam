---
title: Architecture Views Explorer
description: Interactive vis-network MicroSim for architecture views explorer.
image: /sims/architecture-views-explorer/architecture-views-explorer.png
og:image: /sims/architecture-views-explorer/architecture-views-explorer.png
twitter:image: /sims/architecture-views-explorer/architecture-views-explorer.png
social:
   cards: false
quality_score: 0
---

# Architecture Views Explorer

<iframe src="main.html" height="602" width="100%" scrolling="no"></iframe>

[Run the Architecture Views Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>

## About This MicroSim

Three views (Component & Connector, Deployment, and Security) of the same e-commerce system. It demonstrates why a single diagram cannot capture an architecture: each view answers different stakeholders' concerns and deliberately omits others.

## How to Use

Click the **tabs** to switch views. Click any **node** to see which stakeholders care about it and why. The footer panel shows the viewpoint "recipe": which stakeholders the view serves, what it shows, and what it deliberately omits.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/architecture-views-explorer/main.html"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / Professional

### Duration
10-15 minutes

### Prerequisites
Awareness that an architecture serves multiple stakeholders.

### Bloom's Taxonomy Level
Understand (L2)

### Learning Objective
Students can explain why multiple views are necessary by switching between views of the same system and identifying which stakeholder concerns each view addresses and which it omits.

### Activities

1. **Exploration** (5 min): Students freely interact with the MicroSim to discover its behavior.
2. **Guided Practice** (5 min): Working from the learning objective above, students answer 2-3 focused questions posed by the instructor.
3. **Discussion** (5 min): Students share observations and connect them back to ATAM concepts.

### Assessment
Ask students which view they would use to answer an operations engineer's question about scaling, and why the security view would not help.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Kazman, R., Klein, M., & Clements, P. (2000). *ATAM: Method for Architecture Evaluation* (CMU/SEI-2000-TR-004).
