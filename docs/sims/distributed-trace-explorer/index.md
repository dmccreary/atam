---
title: Distributed Trace Latency What-If Explorer
description: Set the latency of each service in a five-span product page trace and watch the waterfall, the critical path, the slack of the parallel branch, and a simulated p95 respond, to find the sensitivity points of a response time scenario.
image: /sims/distributed-trace-explorer/distributed-trace-explorer.png
og:image: /sims/distributed-trace-explorer/distributed-trace-explorer.png
twitter:image: /sims/distributed-trace-explorer/distributed-trace-explorer.png
social:
   cards: false
quality_score: 0
---

# Distributed Trace Latency What-If Explorer

<iframe src="main.html" height="572" width="100%" scrolling="no"></iframe>

[Run the Trace Latency What-If MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The [Distributed Tracing Visualization](../distributed-trace-viewer/index.md) in Chapter 11 asks you to read one fixed trace and diagnose it. This MicroSim does the opposite: **you change the trace** and watch what happens to the response time. It models a product page request in which the API Gateway does its own work, calls the Auth Service, and then calls the Product Service and the Recommendation Service **in parallel**; the Product Service does its own work and then queries the Inventory DB. The end-to-end time is therefore

`total = gateway + auth + max(product + inventory, recommendation)`

Five sliders set each service's own work (its self time). The waterfall redraws at once, the spans on the **critical path** get a gold outline, and the panel reports the **slack** of the parallel branch that finishes early: the amount it can slow down before the request gets slower. A span on the critical path is a sensitivity point for the response time scenario, because every millisecond added there is a millisecond added to the response. A span with slack is not, until its slack is used up.

Scenario response measures are normally written as percentiles, so the sim also estimates the **p50 and p95** by simulating 2,000 requests in which every span varies around its slider value (log-normally, with each span's own p95 equal to twice its median). The banner turns red and names the largest contributor on the critical path when the estimated p95 exceeds the budget. The p50 is a little higher than "This trace" because the request waits for the slower of two varying branches. All figures are an illustrative model, not measurements of any system.

## How to Use

1. Read the default waterfall: the gold-outlined spans form the critical path, and Recommendation has 15 ms of slack.
2. **Predict first**: before moving a slider, say whether the total will change, and by how much.
3. Raise **Recommendation** slowly. Nothing happens to the total until its slack is used up; after that it joins the critical path and Product and Inventory DB gain slack instead.
4. Tick **Slow database query (×5)** to multiply the Inventory DB time by five, as a missing index would.
5. **Click any span** to inject 150 ms of slowness into it (click again to remove it).
6. Move the **p95 budget** slider to tighten or relax the scenario and watch the banner.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/distributed-trace-explorer/main.html"
        height="572"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Graduate / Professional

### Duration
15-20 minutes

### Prerequisites
Spans, traces, and the waterfall view (see the Distributed Tracing Visualization MicroSim in Chapter 11), latency percentiles, and ATAM sensitivity points.

### Bloom's Taxonomy Level
Analyze (L4)

### Learning Objective
Students will be able to predict how a change in one service's latency changes the end-to-end duration of a trace, differentiate spans on the critical path from spans with slack, and identify the sensitivity points of a response time scenario.

### Activities

1. **Predict** (4 min): With the defaults, students predict the new total for three changes (Auth +40 ms, Recommendation +10 ms, Recommendation +40 ms), then test each one and explain the result that surprised them.
2. **Find the slack** (4 min): Students adjust the sliders until both parallel branches are on the critical path, then describe what the waterfall looks like at that point and why.
3. **Break the budget** (5 min): Students switch on the slow database query, read the banner, and list two architectural tactics that would bring the p95 back under 250 ms (for example an index, a cache in front of the query, or moving the query off the critical path).
4. **Percentiles do not add** (4 min): Students compare "This trace" with the estimated p50 and p95 and explain why a budget built by adding typical span times is too optimistic.

### Assessment
Give students the scenario "the product page shall respond within 250 ms at p95" and a set of slider values, and ask them to list the sensitivity points, state which span has slack and how much, and say whether speeding up the Recommendation Service would help. A correct answer ties each claim to the critical path.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Sigelman, B. H., et al. (2010). *Dapper, a Large-Scale Distributed Systems Tracing Infrastructure*. Google Technical Report dapper-2010-1.
3. Dean, J., & Barroso, L. A. (2013). The Tail at Scale. *Communications of the ACM*, 56(2), 74-80.
4. OpenTelemetry. [Traces](https://opentelemetry.io/docs/concepts/signals/traces/). OpenTelemetry documentation of traces, spans, and context propagation.
