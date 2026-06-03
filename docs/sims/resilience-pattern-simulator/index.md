---
title: Resilience Pattern Interaction Simulator
description: Interactive p5.js MicroSim showing how circuit breaker, retry, and bulkhead patterns interact under injected failure to shape availability and latency.
image: /sims/resilience-pattern-simulator/resilience-pattern-simulator.png
og:image: /sims/resilience-pattern-simulator/resilience-pattern-simulator.png
twitter:image: /sims/resilience-pattern-simulator/resilience-pattern-simulator.png
social:
   cards: false
quality_score: 0
---

# Resilience Pattern Interaction Simulator

<iframe src="main.html" height="588" width="100%" scrolling="no"></iframe>

[Run the Resilience Pattern Simulator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim simulates Service A calling Service B with three resilience patterns you can toggle — circuit breaker, retry, and bulkhead. Request dots flow across the channel and turn green (success), red (failure), orange (retried), or gray (rejected by the circuit breaker or a full bulkhead pool). You inject failure into Service B and watch the success rate, average latency, circuit-breaker state, and a 60-sample success-rate timeline respond in real time — so the availability/latency interactions of the patterns are observed, not just described.

## How to Use

1. **Toggle patterns** (Circuit Breaker, Retry, Bulkhead) and adjust their sliders (failure threshold, max retries, pool size).
2. **Inject a failure** into Service B: Healthy, Slow (5s responses), Complete Fail, or Intermittent (30% random failures).
3. Watch the **circuit-breaker badge** trip from CLOSED → OPEN and later probe in HALF-OPEN; note the countdown to the half-open probe.
4. Compare the **success-rate timeline** with the circuit breaker on versus off under Complete Fail, and observe how Retry helps with Intermittent failure but can worsen a Slow downstream.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/resilience-pattern-simulator/main.html"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / Professional

### Duration
20-25 minutes

### Prerequisites
Familiarity with circuit breaker, retry/backoff, and bulkhead resilience patterns.

### Bloom's Taxonomy Level
Analyze (L4)

### Learning Objective
Students will be able to analyze the combined effect of circuit breaker, retry, and bulkhead patterns on availability and latency under a specified failure scenario, and identify which combination best achieves a given availability response measure.

### Activities

1. **Circuit breaker value** (7 min): Under Complete Fail, students compare success rate and latency with the circuit breaker on vs off and explain the difference.
2. **Retry double-edge** (8 min): Under Intermittent failure, students show retry helps; under Slow, they show retry can compound latency (a retry storm).
3. **Combine** (6 min): Students find the toggle/slider combination that best holds success rate up under Intermittent failure and justify it.

### Assessment
Give students an availability response measure ("≥ 95% success under 30% intermittent failure") and ask them to find and justify a pattern configuration that meets it.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Nygard, M. (2018). *Release It!* (2nd ed.). Pragmatic Bookshelf. (Circuit breaker, bulkhead, timeouts.)
