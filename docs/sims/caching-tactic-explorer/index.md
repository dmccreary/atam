---
title: Caching Tactic Anatomy
description: Students will be able to configure a cache with appropriate strategy, TTL, and invalidation policy for a given performance scenario, and explain the consistency implications of their configuration.
status: scaffold
library: p5.js
bloom_level: Apply (L3) — Use caching strategy knowledge to configure a cache for a specific performance vs. consistency tradeoff scenario.
---

# Caching Tactic Anatomy

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to configure a cache with appropriate strategy, TTL, and invalidation policy for a given performance scenario, and explain the consistency implications of their configuration.

- **Bloom Level:** Apply (L3) — Use caching strategy knowledge to configure a cache for a specific performance vs. consistency tradeoff scenario.
- **Bloom Verb:** Use
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 9: Architectural Tactics and Design Principles](../../chapters/09-architectural-tactics-principles/index.md).

```text
Type: microsim
**sim-id:** caching-tactic-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive simulation of cache behavior showing the performance impact, cache hit rate, and consistency tradeoffs of different caching strategies (write-through, write-behind, cache-aside), with student-controlled parameters.

Bloom Level: Apply (L3) — Use caching strategy knowledge to configure a cache for a specific performance vs. consistency tradeoff scenario.
Bloom Verb: Use

Learning Objective: Students will be able to configure a cache with appropriate strategy, TTL, and invalidation policy for a given performance scenario, and explain the consistency implications of their configuration.

Canvas layout:
- Top: Cache strategy selector (Write-Through, Write-Behind/Write-Back, Cache-Aside)
- Left: Live request stream showing incoming read/write operations with hit/miss indicators
- Center: Cache state panel showing current entries, TTLs, and freshness indicators
- Right: Metrics panel showing: hit rate (%), average latency (ms), consistency lag (seconds)
- Bottom: Configuration panel — TTL slider (0-3600 seconds), cache size (10-1000 entries), "Enable Staleness Warning" toggle

Cache strategies explained (visible in a collapsible reference panel):
- Write-Through: Every write goes to cache AND database synchronously; cache is always consistent; writes are slower
- Write-Behind: Writes go to cache immediately, database updated asynchronously; writes are fast; risk of data loss on cache crash
- Cache-Aside (Lazy): Application reads from database on miss and populates cache; application manages cache; flexible but more code

Behavior:
- Simulated request stream: 80% reads, 20% writes at configurable rate
- Each request shows in the stream panel with color coding: green (cache hit), yellow (cache miss → DB), red (write operation)
- Metrics update in real-time as requests are processed
- "Introduce Stale Read" button: simulates a write that bypasses cache invalidation; staleness indicator appears on affected entries
- "Cache Eviction" event triggered when cache is full, with visual of LRU eviction

Data Visibility Requirements:
- Always show current hit rate prominently
- Show average read latency comparison: cache hit (5ms) vs. cache miss + DB (50ms)
- When staleness occurs, show exactly how many ms old the stale entry is

Instructional Rationale: Real-time simulation with configurable parameters is appropriate for Apply because students must make configuration decisions and observe their consequences. Static description would not make the latency/consistency tradeoff felt.

Color scheme: Green for hits, Red for writes, Yellow for misses. Blue for cache entries in good state, Orange for stale entries.

Responsive: Panels resize to container width.
```

## Related Resources

- [Chapter 9: Architectural Tactics and Design Principles](../../chapters/09-architectural-tactics-principles/index.md)
