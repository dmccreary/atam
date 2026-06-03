---
title: Communication Style Tradeoff Explorer
description: Interactive p5.js radar MicroSim for assessing which communication style (REST, gRPC, GraphQL, WebSocket) best fits a set of quality attribute priorities.
image: /sims/communication-style-explorer/communication-style-explorer.png
og:image: /sims/communication-style-explorer/communication-style-explorer.png
twitter:image: /sims/communication-style-explorer/communication-style-explorer.png
social:
   cards: false
quality_score: 0
---

# Communication Style Tradeoff Explorer

<iframe src="main.html" height="554" width="100%" scrolling="no"></iframe>

[Run the Communication Style Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim compares the four common communication styles — REST, gRPC, GraphQL, and WebSocket — across five dimensions on a radar chart: Performance, Interoperability, Real-Time suitability, Schema Enforcement, and Operational Simplicity. Five sliders let you express your own quality attribute priorities as a red requirement polygon overlaid on the four style polygons. A recommendation panel names the best-fit style and lists any unmet gaps, so the choice comes from your stated priorities rather than a familiar default.

## How to Use

1. **Set the five sliders** to express how much each dimension matters for your scenario (1–5). The red dashed requirement polygon updates live.
2. Read the **Best fit** panel — the highlighted style polygon is the one that leaves the fewest of your high-priority requirements unmet.
3. Check **Unmet gaps**: dimensions where your requirement exceeds the recommended style's score.
4. Click **Explain Choice** for a one-paragraph tradeoff justification.
5. Load **Scenario 1–3** to try three worked cases (public API, financial microservices, live collaborative editor).

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/communication-style-explorer/main.html"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / Professional

### Duration
15-20 minutes

### Prerequisites
Familiarity with REST, gRPC, GraphQL, and WebSocket, and with quality attribute tradeoffs.

### Bloom's Taxonomy Level
Evaluate (L5)

### Learning Objective
Students will be able to select the most appropriate communication style for a given quality attribute scenario set and explain the tradeoff implications of their choice using the five comparison dimensions.

### Activities

1. **Predict then check** (6 min): Students set sliders for a scenario *before* loading it, then compare their requirement polygon and chosen style with the recommendation.
2. **Tradeoff justification** (6 min): For each of the three built-in scenarios, students use Explain Choice and restate the justification in their own words.
3. **Gap analysis** (5 min): Students find a slider setting where the best fit still has an unmet gap, and propose how they would mitigate it.

### Assessment
Give students a new scenario description and ask them to set the sliders, record the recommended style, and write a two-sentence tradeoff justification.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Richardson, C. (2018). *Microservices Patterns*. Manning. (Inter-service communication styles.)
