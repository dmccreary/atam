---
title: Technical Debt Accumulation Simulator
description: Interactive p5.js MicroSim for technical debt accumulation simulator.
image: /sims/technical-debt-simulator/technical-debt-simulator.png
og:image: /sims/technical-debt-simulator/technical-debt-simulator.png
twitter:image: /sims/technical-debt-simulator/technical-debt-simulator.png
social:
   cards: false
quality_score: 0
---

# Technical Debt Accumulation Simulator

<iframe src="main.html" height="552" width="100%" scrolling="no"></iframe>

[Run the Technical Debt Accumulation Simulator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim models how technical debt accumulates over 24 months as a function of architectural quality, feature pressure, and refactoring investment, and how it erodes feature-delivery velocity. Toggling "Show ATAM Effect" demonstrates how an early architecture evaluation bends the debt trajectory, making the return on investment of ATAM tangible.

## How to Use

Press **Start** to run the simulation. Adjust the three sliders to change architectural quality, business feature pressure, and monthly refactoring investment, and watch the three curves respond. Enable **Show ATAM Effect** to see how an evaluation at month 3 changes the outcome. Press **Reset** to start over.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/technical-debt-simulator/main.html"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / Professional

### Duration
10-15 minutes

### Prerequisites
Familiarity with the concepts of technical debt and delivery velocity.

### Bloom's Taxonomy Level
Apply (L3)

### Learning Objective
Students can manipulate architectural quality and feature pressure to observe how debt accumulates and predicts delivery slowdown, and use this model to justify the ROI of architecture evaluation.

### Activities

1. **Exploration** (5 min): Students freely interact with the MicroSim to discover its behavior.
2. **Guided Practice** (5 min): Working from the learning objective above, students answer 2-3 focused questions posed by the instructor.
3. **Discussion** (5 min): Students share observations and connect them back to ATAM concepts.

### Assessment
Ask students to find a slider combination that produces an unrecoverable "debt spiral," then explain why early evaluation would have helped.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Kazman, R., Klein, M., & Clements, P. (2000). *ATAM: Method for Architecture Evaluation* (CMU/SEI-2000-TR-004).
