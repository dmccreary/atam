---
title: Caching Tactic Explorer
description: Interactive p5.js MicroSim simulating cache strategies (write-through, write-behind, cache-aside) with a live request stream and performance vs consistency metrics.
image: /sims/caching-tactic-explorer/caching-tactic-explorer.png
og:image: /sims/caching-tactic-explorer/caching-tactic-explorer.png
twitter:image: /sims/caching-tactic-explorer/caching-tactic-explorer.png
social:
   cards: false
quality_score: 0
---

# Caching Tactic Explorer

<iframe src="main.html" height="558" width="100%" scrolling="no"></iframe>

[Run the Caching Tactic Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim simulates a cache under a live request stream (80% reads, 20% writes) so the performance-versus-consistency tradeoff of each caching strategy can be *felt*, not just read. A strategy selector switches between Write-Through, Write-Behind, and Cache-Aside; a request stream shows each operation colored by cache hit, miss, or write; a cache-state panel shows current entries with TTL freshness bars; and a metrics panel shows hit rate, average latency, and consistency lag in real time.

## How to Use

1. **Pick a strategy** and watch the metrics change. Write-Through keeps consistency lag at zero but raises write latency; Write-Behind drops write latency but lets consistency lag grow.
2. **Adjust TTL and cache size** with the sliders and watch the hit rate respond.
3. Compare **average latency** against the reference (a cache hit is 5 ms; a miss to the database is 50 ms).
4. Click **Introduce Stale Read** to mark an entry stale (a write that bypassed invalidation) — its freshness bar turns orange and shows how many milliseconds out of date it is.
5. **Pause** to freeze the simulation and inspect a moment.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/caching-tactic-explorer/main.html"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / Professional

### Duration
15-20 minutes

### Prerequisites
Familiarity with caching, TTL, and the performance/consistency tradeoff.

### Bloom's Taxonomy Level
Apply (L3)

### Learning Objective
Students will be able to configure a cache with an appropriate strategy, TTL, and size for a given performance scenario, and explain the consistency implications of their configuration.

### Activities

1. **Strategy comparison** (6 min): Students run all three strategies and record hit rate, average latency, and consistency lag for each.
2. **Tune for a target** (7 min): Given a target ("average read latency under 20 ms"), students adjust TTL and size to reach it and explain why.
3. **Consistency cost** (5 min): Using Write-Behind plus Introduce Stale Read, students explain the risk a fast-write configuration accepts.

### Assessment
Give students a scenario ("read-heavy product catalog, tolerates 30s staleness") and ask them to choose a strategy and TTL and justify it from the metrics.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Kleppmann, M. (2017). *Designing Data-Intensive Applications*. O'Reilly. (Caching and consistency.)
