# Session Log — resilience-pattern-simulator

**Date:** 2026-06-03
**Chapter:** 9 — Architectural Tactics and Principles
**Library:** p5.js (live simulation)
**Bloom level:** Analyze (L4) — *Examine*
**Final validation:** 98/100 (Grade A) · Playwright control-visibility: PASS

## What it does

Service A sends requests to Service B with three toggleable resilience patterns
(circuit breaker, retry, bulkhead). Request dots flow across the channel and
turn green (success), red (failure), orange (retried), or gray (rejected by the
breaker or a full bulkhead pool). Four failure-injection modes (Healthy, Slow,
Complete Fail, Intermittent) drive Service B. A live circuit-breaker state
machine (CLOSED → OPEN → HALF-OPEN with countdown), real-time success rate /
latency / pool / retry metrics, and a 60-sample success-rate timeline make the
pattern interactions observable.

## Instructional design check

- **Bloom verb:** Examine (Analyze, L4).
- **Animation justified:** the spec calls for interactive failure injection so
  pattern interactions are observed, not read — the Step-3 "Analyze with failure
  scenarios" case. Pause is provided.

## Implementation notes

- `// CANVAS_HEIGHT: 586` → iframe 588. drawHeight 540 + controlHeight 46.
- Circuit breaker: consecutive-failure count trips OPEN at the threshold; opens
  for ~4s then HALF-OPEN; a probe success closes it, a probe failure re-opens.
- Retry re-launches a failed in-flight dot (orange, `rN` label) up to max
  retries; bulkhead rejects when `inFlight ≥ poolSize`.
- Slow mode succeeds at 5000ms (latency blows up but the breaker doesn't trip —
  illustrating that timeouts, not just errors, matter).

## Layout review

- **Cycle 1:** PASS. Toggles, circuit badge, A/B service boxes + channel, the
  four-metric row, the failure-mode tabs, the success-rate timeline, the three
  config sliders, and Pause all render with no clipping. A 40-request warm start
  seeds the metrics and timeline so the first frame is informative (in-flight
  dots are transient/animated, cf. part-1 gotcha #3 headless throttling).

## Files

- `docs/sims/resilience-pattern-simulator/resilience-pattern-simulator.js` (new, ~290 lines)
- `docs/sims/resilience-pattern-simulator/index.md`
- `docs/sims/resilience-pattern-simulator/resilience-pattern-simulator.png`
- `docs/chapters/09-architectural-tactics-principles/index.md` (iframe height 580→588)
