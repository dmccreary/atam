---
title: Resilience Pattern Interaction Simulator
description: Students will be able to analyze the combined effect of circuit breaker, retry, and bulkhead patterns on availability and latency under a specified failure scenario, and identify which combination best achieves a given availability response measure.
status: scaffold
library: p5.js
bloom_level: Analyze (L4) — Examine how resilience patterns interact under failure conditions to determine which combination most effectively addresses a given availability scenario.
---

# Resilience Pattern Interaction Simulator

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to analyze the combined effect of circuit breaker, retry, and bulkhead patterns on availability and latency under a specified failure scenario, and identify which combination best achieves a given availability response measure.

- **Bloom Level:** Analyze (L4) — Examine how resilience patterns interact under failure conditions to determine which combination most effectively addresses a given availability scenario.
- **Bloom Verb:** Examine
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 9: Architectural Tactics and Design Principles](../../chapters/09-architectural-tactics-principles/index.md).

```text
Type: microsim
**sim-id:** resilience-pattern-simulator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Simulate the interaction of circuit breaker, retry, and bulkhead patterns under a service failure scenario, showing how different combinations of these tactics affect overall system availability and latency.

Bloom Level: Analyze (L4) — Examine how resilience patterns interact under failure conditions to determine which combination most effectively addresses a given availability scenario.
Bloom Verb: Examine

Learning Objective: Students will be able to analyze the combined effect of circuit breaker, retry, and bulkhead patterns on availability and latency under a specified failure scenario, and identify which combination best achieves a given availability response measure.

Canvas layout:
- Top: Architecture diagram showing two services (Service A calling Service B) with toggle switches for: Circuit Breaker, Retry (with backoff config), Bulkhead
- Center: Animated request flow visualization showing requests (dots) flowing from A to B; dots turn red on failure, gray when rejected by circuit breaker
- Left panel: Request metrics — requests per second, success rate, average latency, P99 latency
- Right panel: Pattern state panel — circuit breaker state (Closed/Half-Open/Open), retry count for in-flight requests, bulkhead pool utilization
- Bottom: "Inject Failure" button to simulate Service B becoming slow (5s response time) or failing completely
- Timeline chart at very bottom showing success rate over the last 60 seconds

Resilience configuration controls:
- Circuit Breaker: Enable/Disable toggle, Failure Threshold slider (1-10 failures), Reset Timeout slider (5-60 seconds)
- Retry: Enable/Disable toggle, Max Retries slider (0-5), Backoff Type selector (Fixed/Exponential), Initial Delay slider (100ms-2s)
- Bulkhead: Enable/Disable toggle, Pool Size slider (1-20 threads)

Failure injection scenarios:
- "Slow Downstream": Service B responds in 5s (instead of 50ms) — tests retry/circuit breaker interaction
- "Complete Failure": Service B returns 500 errors immediately — tests circuit breaker speed
- "Intermittent Failure": Service B fails 30% of requests randomly — tests retry effectiveness vs. retry storm risk

Data Visibility Requirements:
- Always show request success rate prominently
- When circuit breaker trips, show a clear visual indicator and the time until half-open probe
- Show retry count per request in the request flow visualization
- Show bulkhead pool exhaustion when it occurs

Instructional Rationale: Interactive failure injection with configurable patterns is appropriate for Analyze because students must observe pattern interactions with real failure scenarios, not just read descriptions. The real-time metrics make the performance/availability tradeoff visible.

Color scheme: Green dots for successful requests, Red for failures, Gray for circuit-breaker-rejected requests. Orange for retried requests. Blue for bulkhead pool visualization.

Responsive: Main simulation area scales to container width.
```

## Related Resources

- [Chapter 9: Architectural Tactics and Design Principles](../../chapters/09-architectural-tactics-principles/index.md)
