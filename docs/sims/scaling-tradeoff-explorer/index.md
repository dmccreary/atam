---
title: Vertical vs. Horizontal Scaling Tradeoffs
description: Compare scaling up with scaling out for a workload: see the cost curve and hard ceiling of a bigger machine next to the Amdahl's Law throughput curve of more machines, and how many months each strategy lasts at a chosen growth rate.
image: /sims/scaling-tradeoff-explorer/scaling-tradeoff-explorer.png
og:image: /sims/scaling-tradeoff-explorer/scaling-tradeoff-explorer.png
twitter:image: /sims/scaling-tradeoff-explorer/scaling-tradeoff-explorer.png
social:
   cards: false
quality_score: 0
---

# Vertical vs. Horizontal Scaling Tradeoffs

<iframe src="main.html" height="502" width="100%" scrolling="no"></iframe>

[Run the Scaling Tradeoff Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim puts the two basic scaling tactics side by side. **Vertical scaling** (the left chart) replaces a machine with a larger one. It needs no change to the application, but the cost curve bends upward, there is a largest size that money cannot exceed, and all of the capacity sits on one machine. **Horizontal scaling** (the right chart) adds machines. Cost grows in a straight line and a failed node removes only a share of capacity, but throughput follows **Amdahl's Law**: with a parallelizable fraction p, n nodes give a speedup of 1 ÷ ((1 − p) + p ÷ n), which can never exceed 1 ÷ (1 − p).

The workload menu sets a typical value of p (stateless service 0.95, stateful service 0.80, write-heavy database 0.60), and you can then move p yourself. The sim marks the instance size and the node count that the current load needs, shows **Amdahl's wall** (the node count at which 90% of the maximum speedup has been reached), projects how many months each strategy lasts at the chosen growth rate, and states what the result means.

Everything here is an **illustrative model**, not vendor data: one baseline node handles 1,000 requests per second, instance sizes run from 1× to 16×, a larger instance is assumed to deliver proportionally more capacity, and each doubling of size triples the cost (the chapter's rule of thumb). Real price lists, and the serial fraction of a real system, have to be measured.

## How to Use

1. Start with the **Stateless service** workload. Read the two status lines: the instance size and the node count that the current load needs, and what each costs.
2. Switch the workload to **Stateful service** and then **Database, write-heavy**. Watch the Amdahl limit (red dashed line) drop and the wall move left.
3. Raise **Current load** until the yellow marker on the right chart disappears: the load is above the limit, and no number of nodes can carry it.
4. Move **Growth** and compare the two bars under the charts: which strategy saturates first, and how soon?
5. Move **Parallelizable fraction p** by small steps between 0.90 and 1.00 and note how strongly the limit reacts.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/scaling-tradeoff-explorer/main.html"
        height="502"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Graduate / Professional

### Duration
15-20 minutes

### Prerequisites
Amdahl's Law, the definitions of vertical and horizontal scaling, and compound growth.

### Bloom's Taxonomy Level
Analyze (L4)

### Learning Objective
Students will be able to compare vertical and horizontal scaling for a given workload by relating the cost curve and size ceiling of scaling up to the Amdahl's Law limit of scaling out, and estimate how long each strategy lasts at a given growth rate.

### Activities

1. **Compute the limit** (4 min): For p = 0.80, 0.90, and 0.95, students compute 1 ÷ (1 − p) by hand and confirm the limit shown in the right chart.
2. **Three workloads** (6 min): At 3,000 requests per second and 15% monthly growth, students record for each workload the instance size, the node count, and the months to saturation, and say which strategy fails first and why.
3. **Where the money goes** (4 min): Students find a load at which the single instance costs at least three times as much as the nodes that carry the same load (look just past a size boundary), then explain why teams still scale up.
4. **Change the architecture** (6 min): For the write-heavy database, students name two tactics that raise p (for example sharding, or moving reads to replicas) and estimate how far p must rise for scaling out to outlast scaling up.

### Assessment
Give students a scenario (for example, "a stateful service at 5,000 requests per second growing 20% per month, with a measured serial fraction of 15%") and ask for the Amdahl limit, whether scaling out can carry the load in six months, and the ATAM finding they would record (risk, sensitivity point, or tradeoff point) with a justification.

## References

1. Amdahl, G. M. (1967). Validity of the single processor approach to achieving large scale computing capabilities. *AFIPS Spring Joint Computer Conference Proceedings*, 30, 483-485.
2. Gregg, B. (2020). *Systems Performance: Enterprise and the Cloud* (2nd ed.). Addison-Wesley. (Scalability models and capacity planning.)
3. Kleppmann, M. (2017). *Designing Data-Intensive Applications*. O'Reilly. (Scaling up versus scaling out; replication and partitioning.)
4. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
