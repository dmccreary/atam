---
title: Performance Metric Relationships
description: Move arrival rate, service time, and concurrency limit sliders to see how throughput, response time, queue depth, and p50/p95/p99 latency are tied together by Little's Law, and what happens when the queue saturates.
image: /sims/performance-metrics-explorer/performance-metrics-explorer.png
og:image: /sims/performance-metrics-explorer/performance-metrics-explorer.png
twitter:image: /sims/performance-metrics-explorer/performance-metrics-explorer.png
social:
   cards: false
quality_score: 0
---

# Performance Metric Relationships

<iframe src="main.html" height="547" width="100%" scrolling="no"></iframe>

[Run the Performance Metrics Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim connects the performance vocabulary of the chapter with one equation, **Little's Law**: L = λ × W. The average number of requests in a system (L) equals the arrival rate (λ) times the average time each request spends there (W). Three sliders set the workload: how fast requests arrive, how long one request takes to serve, and how many requests may be in service at once. Four panels respond together: the queue and the busy workers, the Little's Law calculation with the current numbers, the response-time distribution with its p50, p95, and p99 markers, and a throughput gauge.

The product of arrival rate and service time is the **offered load**: the number of workers the workload needs on average. While it stays below the concurrency limit the system is stable, throughput equals the arrival rate, and waiting is short. As the offered load approaches the limit, the queue lengthens and the tail of the distribution stretches: p99 grows much faster than the median, which is why requirements should name a percentile rather than an average. Once the offered load exceeds the limit there is no steady state at all. Throughput is pinned at capacity, the queue grows every second, and every latency percentile keeps rising.

The numbers come from a standard **M/M/c queueing model** (random arrivals, exponentially distributed service times, c parallel workers). Little's Law holds for any stable system; the exact shape of the latency distribution is specific to this model and is not a measurement of any real product.

## How to Use

1. Read the default case: 200 requests per second, 50 ms of service time, and a concurrency limit of 12. Check the panel's arithmetic: 200 × 0.0612 s is about 12.2 requests in the system.
2. Lower the **Concurrency limit** one step at a time toward 10. Watch the queue, the percentage of requests that wait, and the p99 marker.
3. Go one step further so that arrival rate × service time exceeds the limit. The panels turn red: read how fast the queue grows.
4. Restore the limit, then raise the **Arrival rate** or the **Service time** instead and find the point where the same saturation happens.
5. Before each change, predict L from λ and W, then check your prediction against the panel.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/performance-metrics-explorer/main.html"
        height="547"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Graduate / Professional

### Duration
15-20 minutes

### Prerequisites
The definitions of latency, response time, and throughput, and what a percentile is.

### Bloom's Taxonomy Level
Apply (L3)

### Learning Objective
Students will be able to use Little's Law to relate arrival rate, response time, and the number of requests in a system, and predict when a concurrency limit saturates and tail latency grows.

### Activities

1. **Check the law** (4 min): For three slider settings of their choice, students compute L = λ × W by hand and compare with the panel.
2. **Find the knee** (6 min): Holding arrival rate and service time fixed, students lower the concurrency limit and record p50 and p99 at each step, then describe how the two diverge.
3. **Size the pool** (5 min): Given 400 requests per second and a 30 ms service time, students find the smallest limit that keeps p99 under 145 ms in this model and explain the headroom above the offered load.
4. **Two levers** (5 min): Starting from a saturated system, students recover stability once by raising the limit and once by cutting service time, and say which architectural tactic each corresponds to.

### Assessment
Give students a response measure (for example, "p95 response time under 200 ms at 300 requests per second") and a 60 ms service time. Ask for the offered load, the minimum concurrency that is stable, a limit that meets the measure in this model, and the assumption they would most want to verify with a load test.

## References

1. Little, J. D. C. (1961). A Proof for the Queuing Formula: L = λW. *Operations Research*, 9(3), 383-387.
2. Gregg, B. (2020). *Systems Performance: Enterprise and the Cloud* (2nd ed.). Addison-Wesley. (Queueing theory, utilization, and latency percentiles.)
3. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley. (Performance tactics.)
