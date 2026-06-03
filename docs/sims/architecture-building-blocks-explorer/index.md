---
title: Architecture Building Blocks Explorer
description: Interactive vis-network MicroSim for architecture building blocks explorer.
image: /sims/architecture-building-blocks-explorer/architecture-building-blocks-explorer.png
og:image: /sims/architecture-building-blocks-explorer/architecture-building-blocks-explorer.png
twitter:image: /sims/architecture-building-blocks-explorer/architecture-building-blocks-explorer.png
social:
   cards: false
quality_score: 0
---

# Architecture Building Blocks Explorer

<iframe src="main.html" height="562" width="100%" scrolling="no"></iframe>

[Run the Architecture Building Blocks Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>

## About This MicroSim

An interactive map of a sample e-commerce system showing components and the connectors between them. It makes the building blocks of architecture concrete and shows how each connector choice (REST, gRPC, async event, direct database access) carries quality-attribute consequences.

## How to Use

Click any blue **component** to read its role and the quality attributes it most affects. Click a labeled **connector** to see its latency profile and the tradeoff it introduces. Use the **Architectural Style** selector to switch between Microservices, Monolith, and Event-Driven views and compare their quality-attribute profiles.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/architecture-building-blocks-explorer/main.html"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / Professional

### Duration
10-15 minutes

### Prerequisites
Basic familiarity with services, databases, and APIs.

### Bloom's Taxonomy Level
Understand (L2)

### Learning Objective
Students can explain the roles of components, connectors, and styles by identifying each in a realistic sample system and articulating why each connector choice has quality-attribute consequences.

### Activities

1. **Exploration** (5 min): Students freely interact with the MicroSim to discover its behavior.
2. **Guided Practice** (5 min): Working from the learning objective above, students answer 2-3 focused questions posed by the instructor.
3. **Discussion** (5 min): Students share observations and connect them back to ATAM concepts.

### Assessment
Ask students to identify which connector in the microservices view couples two services' availability, and which alternative connector would decouple them.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Kazman, R., Klein, M., & Clements, P. (2000). *ATAM: Method for Architecture Evaluation* (CMU/SEI-2000-TR-004).
