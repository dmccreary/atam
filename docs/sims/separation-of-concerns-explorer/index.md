---
title: Separation of Concerns in a Layered Architecture
description: Interactive p5.js MicroSim for separation of concerns in a layered architecture.
image: /sims/separation-of-concerns-explorer/separation-of-concerns-explorer.png
og:image: /sims/separation-of-concerns-explorer/separation-of-concerns-explorer.png
twitter:image: /sims/separation-of-concerns-explorer/separation-of-concerns-explorer.png
social:
   cards: false
quality_score: 0
---

# Separation of Concerns in a Layered Architecture

<iframe src="main.html" height="472" width="100%" scrolling="no"></iframe>

[Run the Separation of Concerns in a Layered Architecture MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A three-layer architecture (Presentation, Business Logic, Data Access) that contrasts clean separation of concerns with a concern violation. It shows how a single change to the Data Access layer propagates to far more components when a layer is skipped.

## How to Use

Switch between **Clean Architecture** and **Concern Violation** modes. Click **Trigger Data-Layer Change** to highlight the components a change affects and read the blast-radius count. Click any component to see its responsibility.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/separation-of-concerns-explorer/main.html"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / Professional

### Duration
10-15 minutes

### Prerequisites
Familiarity with layered architecture.

### Bloom's Taxonomy Level
Understand (L2)

### Learning Objective
Students can explain why separating concerns into distinct layers reduces the blast radius of a change, using a concrete visual example.

### Activities

1. **Exploration** (5 min): Students freely interact with the MicroSim to discover its behavior.
2. **Guided Practice** (5 min): Working from the learning objective above, students answer 2-3 focused questions posed by the instructor.
3. **Discussion** (5 min): Students share observations and connect them back to ATAM concepts.

### Assessment
Ask students to compare the blast-radius count between clean and violation modes and explain the difference in terms of skipped layers.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Kazman, R., Klein, M., & Clements, P. (2000). *ATAM: Method for Architecture Evaluation* (CMU/SEI-2000-TR-004).
