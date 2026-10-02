---
title: Availability Architecture Analyzer
description: Build a system from stages in series and replicas in parallel, then read its availability, nines, downtime per year and month, expected outages, weakest link, and whether it meets an SLO target.
image: /sims/availability-architecture-explorer/availability-architecture-explorer.png
og:image: /sims/availability-architecture-explorer/availability-architecture-explorer.png
twitter:image: /sims/availability-architecture-explorer/availability-architecture-explorer.png
social:
   cards: false
quality_score: 0
---

# Availability Architecture Analyzer

<iframe src="main.html" height="537" width="100%" scrolling="no"></iframe>

[Run the Availability Architecture Analyzer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim is a calculator drawn as a **reliability block diagram**. The request has to pass through every stage from left to right, so the stages are **in series** and their availabilities multiply. Inside a stage, the replicas are **in parallel**: the stage is down only when every replica is down at the same time.

| Arrangement | Formula | Example |
|---|---|---|
| Series | A1 × A2 × ... | 0.999 × 0.999 × 0.999 ≈ 99.7% |
| Parallel (n replicas, each with availability A) | 1 − (1 − A)^n | two at 99.9% give 1 − 0.001² = 99.9999% |

Click a stage to select it, then change the availability of one replica, the number of replicas, and its mean time to repair (MTTR). The left panel shows the system availability on a scale of nines next to the SLO target, the downtime per year and per month, and the expected number and length of outages. The right panel shows how much downtime each stage contributes and marks the **weakest link** in red.

The default design misses a 99.95% target because of its single database. Give the database a second replica and the weakest link moves to the load balancer: the limiting component is usually the one with no redundancy, not the one with the lowest availability figure.

The parallel formula assumes that replicas fail **independently**. Real replicas share failure causes (the same bug, the same zone, the same bad deployment), so real redundancy is worth less than the formula promises. The default availabilities and repair times are illustrative inputs, not vendor figures. A year is taken as 365 days (525,600 minutes), which gives the familiar table: 99.9% is 8.76 hours per year, 99.99% is 52.6 minutes, and 99.999% is 5.26 minutes.

## How to Use

1. **Click a stage** in the diagram to select it. The controls below now edit that stage.
2. Change **Replica availability**, **Replicas** (1 to 4 in parallel), and **MTTR** (1 to 240 minutes).
3. Read the **system availability** and compare the triangle marker with the SLO line on the scale of nines.
4. Find the **weakest link** in the right panel, fix it, and see which stage becomes the weakest next.
5. Use **Add stage** and **Remove stage** to lengthen or shorten the chain (up to six stages), and change the **SLO target**.
6. Change only the **MTTR** of a stage. The availability figures do not move, but the number and length of the expected outages do.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/availability-architecture-explorer/main.html"
        height="537"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Graduate / Professional

### Duration
15-20 minutes

### Prerequisites
Availability as a percentage, MTBF and MTTR, and the idea of a service level objective (SLO).

### Bloom's Taxonomy Level
Apply (L3)

### Learning Objective
Students will be able to calculate the availability of a system built from components in series and in parallel, convert it to downtime per year, identify the weakest link, and determine whether the design meets an availability SLO.

### Activities

1. **Predict** (3 min): Before touching anything, students estimate by hand the availability of the default four-stage system and name its weakest link, then compare with the display.
2. **Meet the SLO** (5 min): Students find the cheapest change (fewest added replicas) that makes the default design meet 99.95%, and then 99.99%. They record each change and the resulting weakest link.
3. **Series penalty** (4 min): Students add two single-replica stages at 99.9% and explain why the system availability fell below that of every individual component.
4. **Same nines, different outages** (4 min): Students set one stage to an MTTR of 5 minutes and then 240 minutes and describe how the pattern of outages changes while the availability stays the same, and which pattern users would prefer.

### Assessment
Give students the scenario "the order service shall be available 99.95% of the time, measured over a year" and a five-stage design, and ask them to compute the system availability, state the annual downtime budget and whether the design fits inside it, identify the weakest link, and name one assumption in the calculation that an ATAM evaluation team should challenge.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley. Chapter 4, Availability.
2. Beyer, B., Jones, C., Petoff, J., & Murphy, N. R. (Eds.). (2016). [Site Reliability Engineering: How Google Runs Production Systems](https://sre.google/sre-book/table-of-contents/). O'Reilly Media.
3. Trivedi, K. S., & Bobbio, A. (2017). *Reliability and Availability Engineering: Modeling, Analysis, and Applications*. Cambridge University Press.
