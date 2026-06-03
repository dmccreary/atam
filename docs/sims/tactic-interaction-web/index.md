---
title: Tactic Interaction Web
description: Interactive vis-network MicroSim showing how architectural tactics improve one quality attribute while degrading another, and which compensating tactic the tradeoff requires.
image: /sims/tactic-interaction-web/tactic-interaction-web.png
og:image: /sims/tactic-interaction-web/tactic-interaction-web.png
twitter:image: /sims/tactic-interaction-web/tactic-interaction-web.png
social:
   cards: false
quality_score: 0
---

# Tactic Interaction Web

<iframe src="main.html" height="562" width="100%" scrolling="no"></iframe>

[Run the Tactic Interaction Web MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim is a network graph of architectural tactics and the quality attributes they affect. Quality attributes are blue ellipses (Performance, Availability, Security, Modifiability, Consistency); tactics are gold boxes (Caching, Redundancy, Retry, Encryption, Circuit Breaker, Rate Limiting, Connection Pooling, Dependency Injection, Information Hiding); compensating tactics are orange boxes. Green arrows mean a tactic improves an attribute, red dashed arrows mean it degrades one, and orange arrows point to the compensating tactic a tradeoff requires. These tactic interactions are exactly the tradeoff points an ATAM evaluation is built to surface.

## How to Use

1. **Click a tactic** (gold) to read what it improves (green) and degrades (red); its connected edges highlight.
2. **Click a quality attribute** (blue) to see every tactic that affects it.
3. **Click an edge** to read the specific mechanism and a realistic example.
4. Turn on **Show Interaction Chains**, then click **Caching**, **Redundancy**, or **Encryption** to trace its tradeoff to the compensating tactic it requires (e.g., Caching → degrades Consistency → Cache Invalidation Strategy).

When embedded, use the navigation buttons in the corner to zoom and pan.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/tactic-interaction-web/main.html"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / Professional

### Duration
15-20 minutes

### Prerequisites
Familiarity with architectural tactics and quality attributes.

### Bloom's Taxonomy Level
Analyze (L4)

### Learning Objective
Students will be able to identify at least three tactic interaction chains (where applying tactic A improves one quality attribute but degrades another, which may require a compensating tactic B) and explain why these interactions are ATAM tradeoff points.

### Activities

1. **Map a tactic** (5 min): Students click three tactics and record what each improves and degrades.
2. **Trace chains** (7 min): In chain mode, students trace all three compensation chains and write each as "Tactic → improves X, degrades Y → compensate with Z."
3. **Discussion** (5 min): Students explain why a tactic that only ever helps would never appear as an ATAM tradeoff point.

### Assessment
Give students a new tactic (e.g., "Load Shedding") and ask them to predict one attribute it improves, one it degrades, and a plausible compensating tactic.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Kazman, R., Klein, M., & Clements, P. (2000). *ATAM: Method for Architecture Evaluation* (CMU/SEI-2000-TR-004).
