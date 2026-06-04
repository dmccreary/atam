---
title: Distributed System Component Explorer
description: Interactive p5.js MicroSim of a distributed-system topology with click-to-explore components, a service-mesh toggle, and a failure mode.
image: /sims/distributed-system-explorer/distributed-system-explorer.png
og:image: /sims/distributed-system-explorer/distributed-system-explorer.png
twitter:image: /sims/distributed-system-explorer/distributed-system-explorer.png
social:
   cards: false
quality_score: 0
---

# Distributed System Component Explorer

<iframe src="main.html" height="528" width="100%" scrolling="no"></iframe>

[Run the Distributed System Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim shows a realistic distributed-system topology: external clients, a load balancer and API gateway (ingress), four services each with a sidecar proxy inside a service-mesh envelope, a mesh control plane, a message broker, a service registry, and a database per service. Components are color-coded by category. Click any component to read its definition, the quality attributes it supports and threatens, and the ATAM question you would ask about it.

## How to Use

1. **Click any component** to open its detail panel — definition, what it **supports**, what it **threatens**, and an **ATAM question**.
2. Toggle **Service Mesh: ON/OFF** to add or remove the sidecar proxies and control plane, and read how that changes security and observability coverage.
3. Turn on **Failure Mode**, then click a service to take it down — the diagram marks it DOWN and the detail panel explains how health propagates (registry marks it unhealthy, the load balancer stops routing to it).

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/distributed-system-explorer/main.html"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / Professional

### Duration
15-20 minutes

### Prerequisites
None beyond a basic idea of services and databases.

### Bloom's Taxonomy Level
Understand (L2)

### Learning Objective
Students will be able to identify the major infrastructure components of a distributed system, explain each component's purpose, and describe the quality attribute implications of each component's design choices.

### Activities

1. **Name the roles** (6 min): Students click every component and write a one-line role for each.
2. **Mesh or not** (5 min): Students toggle the service mesh and list what is gained and lost.
3. **Failure walk** (5 min): In failure mode, students take down a service and trace which components must react.

### Assessment
Give students a component and ask them to state one quality attribute it supports, one it threatens, and one ATAM question to ask about it.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Richardson, C. (2018). *Microservices Patterns*. Manning.
