---
title: Architecture Fitness Function Dashboard
description: Interactive p5.js MicroSim for architecture fitness function dashboard.
image: /sims/fitness-function-dashboard/fitness-function-dashboard.png
og:image: /sims/fitness-function-dashboard/fitness-function-dashboard.png
twitter:image: /sims/fitness-function-dashboard/fitness-function-dashboard.png
social:
   cards: false
quality_score: 0
---

# Architecture Fitness Function Dashboard

<iframe src="main.html" height="592" width="100%" scrolling="no"></iframe>

[Run the Architecture Fitness Function Dashboard MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A simulated monitoring dashboard with eight architecture fitness functions across structural, performance, security, compliance, and quality categories. It lets students recognize what a fitness-function violation looks like and which category a given architectural constraint belongs to.

## How to Use

Use the **Introduce Violation** dropdown to break a constraint and watch the relevant card fail, the overall health indicator change, and an alert appear in the event log. Click any card to read what it measures. **Fix Violations** restores health; **Run All Checks** re-evaluates every card.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/fitness-function-dashboard/main.html"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / Professional

### Duration
10-15 minutes

### Prerequisites
Familiarity with the idea of automated architectural checks.

### Bloom's Taxonomy Level
Apply (L3)

### Learning Objective
Students can identify which category of fitness function a given architectural constraint maps to, and recognize what a violation looks like in a monitoring context.

### Activities

1. **Exploration** (5 min): Students freely interact with the MicroSim to discover its behavior.
2. **Guided Practice** (5 min): Working from the learning objective above, students answer 2-3 focused questions posed by the instructor.
3. **Discussion** (5 min): Students share observations and connect them back to ATAM concepts.

### Assessment
Introduce each violation type and ask students to name the fitness-function category it belongs to before clicking the card.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Kazman, R., Klein, M., & Clements, P. (2000). *ATAM: Method for Architecture Evaluation* (CMU/SEI-2000-TR-004).
