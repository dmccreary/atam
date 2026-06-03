---
title: CAP Theorem Interactive Explorer
description: Interactive p5.js MicroSim that drives two replicas through a network partition in CP vs AP mode to make the CAP tradeoff concrete.
image: /sims/cap-theorem-explorer/cap-theorem-explorer.png
og:image: /sims/cap-theorem-explorer/cap-theorem-explorer.png
twitter:image: /sims/cap-theorem-explorer/cap-theorem-explorer.png
social:
   cards: false
quality_score: 0
---

# CAP Theorem Interactive Explorer

<iframe src="main.html" height="568" width="100%" scrolling="no"></iframe>

[Run the CAP Theorem Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim makes the CAP theorem concrete. Two database replicas (Node A and Node B) are joined by a network link. You choose **CP** (consistency) or **AP** (availability) mode, write to A, read from B, and create or heal a network partition. Under a partition, the difference becomes visible: a **CP** system rejects reads from B to avoid returning stale data, while an **AP** system serves a possibly stale value and converges once the partition heals. Three scenario presets show when each model is the right choice.

## How to Use

1. Pick **CP** or **AP** with the mode switch.
2. **Send Write → A** and **Read ← B** while the network is healthy — everything is consistent.
3. **Create Partition**, then write to A and read from B again. In CP the read is rejected; in AP it returns a stale value with a warning.
4. **Heal Partition** in AP mode to watch Node B converge to Node A (eventual consistency).
5. Load a **scenario** (Financial ledger, Shopping cart, Profile update) to see which model fits and why; use **Explain** for the rationale.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/cap-theorem-explorer/main.html"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / Professional

### Duration
15-20 minutes

### Prerequisites
Familiarity with replication and the CAP theorem (consistency, availability, partition tolerance).

### Bloom's Taxonomy Level
Apply (L3)

### Learning Objective
Students will be able to predict the behavior of CP and AP database systems under a network partition and select the appropriate consistency model given the quality attribute priorities of a specific scenario.

### Activities

1. **Predict** (6 min): Before reading from B under a partition, students predict the result in CP and in AP, then verify.
2. **Convergence** (5 min): Students observe AP convergence after healing and explain "eventual consistency" in their own words.
3. **Choose** (6 min): For each preset scenario, students justify the recommended model from the quality attribute priorities.

### Assessment
Give students three new scenarios and ask them to choose CP or AP and justify the choice from the partition behavior.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Kleppmann, M. (2017). *Designing Data-Intensive Applications*. O'Reilly. (Consistency and the CAP theorem.)
