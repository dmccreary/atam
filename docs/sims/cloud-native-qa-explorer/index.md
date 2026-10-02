---
title: Cloud-Native Architecture Quality Attribute Stack
description: Interactive layer diagram of the cloud-native stack (IaaS, containers, Kubernetes, infrastructure as code, application and service mesh) showing which quality attributes each layer supports and which it puts at risk.
image: /sims/cloud-native-qa-explorer/cloud-native-qa-explorer.png
og:image: /sims/cloud-native-qa-explorer/cloud-native-qa-explorer.png
twitter:image: /sims/cloud-native-qa-explorer/cloud-native-qa-explorer.png
social:
   cards: false
quality_score: 0
---

# Cloud-Native Architecture Quality Attribute Stack

<iframe src="main.html" height="542" width="100%" scrolling="no"></iframe>

[Run the Cloud-Native Quality Attribute Stack MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim draws the cloud-native technology stack as five layers, from IaaS and managed services at the bottom to the application and its service mesh at the top. Every layer carries green **supports** badges and red **threatens** badges: Kubernetes, for example, supports availability (auto-healing), scalability (the HorizontalPodAutoscaler), and deployability (rolling updates), and pays for them with operational complexity and extra network hops. Clicking a layer opens the full analysis, including the specific mechanism behind each badge and the question an ATAM evaluation team would ask about that layer.

The highlight menu turns the diagram sideways: pick one quality attribute and see every layer that touches it. Some attributes are built up across layers (deployability needs an immutable image, an orchestrator, and infrastructure as code), some are traded inside the stack (the mesh adds mutual TLS while the shared kernel remains a weak point), and one (simplicity) is put at risk by almost every layer. The ratings are qualitative and follow the chapter text.

## How to Use

1. Read the stack from the bottom up. Each band shows the layer's role, what it supports (green, +), and what it threatens (red, −).
2. **Hover over a badge** to see the mechanism behind it, for example how Kubernetes provides auto-healing.
3. **Click a layer** to open its full analysis and its ATAM sensitivity or tradeoff note. Click it again to close it.
4. Use **Highlight a quality attribute** to dim everything except the layers that support or threaten that attribute, and read the cross-layer summary.
5. Try Simplicity, Security, and Cost, then set the menu back to (none).

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/cloud-native-qa-explorer/main.html"
        height="542"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Graduate / Professional

### Duration
10-15 minutes

### Prerequisites
Containers, Kubernetes basics, infrastructure as code, and the quality attribute vocabulary from earlier chapters.

### Bloom's Taxonomy Level
Analyze (L4)

### Learning Objective
Students will be able to identify at least three quality attribute contributions and one quality attribute risk at each layer of the cloud-native technology stack.

### Activities

1. **Layer inventory** (5 min): For each of the five layers, students record three supported attributes and one threatened attribute, with the mechanism in their own words.
2. **One attribute, all layers** (4 min): Students highlight Deployability, Security, and Cost in turn and classify each as built up across layers, traded between layers, or conflicted within one layer.
3. **Find the price** (3 min): Students identify the attribute threatened by the most layers and explain why that is not an argument against adopting the stack.
4. **Write a scenario** (3 min): Students pick one red badge and turn it into a six-part quality attribute scenario with a measurable response.

### Assessment
Remove one layer (for example, "the team deploys containers by hand, with no orchestrator") and ask students which supported attributes are lost, which risks disappear, and whether the result is a risk or a non-risk for a stated availability scenario.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Burns, B., Beda, J., Hightower, K., & Evenson, L. (2022). *Kubernetes: Up and Running* (3rd ed.). O'Reilly.
3. Cloud Native Computing Foundation. [CNCF Cloud Native Definition](https://github.com/cncf/toc/blob/main/DEFINITION.md).
