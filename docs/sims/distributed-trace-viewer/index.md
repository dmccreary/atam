---
title: Distributed Tracing Visualization
description: Interactive p5.js waterfall of a slow checkout request across nine services: click spans, compare against a fast baseline, and highlight the critical path to find the root cause of the latency.
image: /sims/distributed-trace-viewer/distributed-trace-viewer.png
og:image: /sims/distributed-trace-viewer/distributed-trace-viewer.png
twitter:image: /sims/distributed-trace-viewer/distributed-trace-viewer.png
social:
   cards: false
quality_score: 0
---

# Distributed Tracing Visualization

<iframe src="main.html" height="552" width="100%" scrolling="no"></iframe>

[Run the Distributed Trace Viewer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim shows one distributed trace: a `POST /checkout` request that took 850 ms. Each horizontal bar is a **span** (one operation in one service) placed on a shared time axis and indented under the span that called it, so the picture is both a call tree and a timeline. Spans that ran well past their baseline are outlined in red and carry a marker such as **MISS**, **SLOW QUERY**, or **EXTERNAL**. You can switch to the 430 ms fast baseline, overlay the two traces, focus on one service, and turn on the **critical path** to see which span owns each millisecond of the request.

The trace has two separate problems. A cache miss in the pricing service forces a 190 ms multi-join database query that does not exist in the baseline (the root cause the team can fix), and the external card gateway takes 360 ms instead of 130 ms (latency the team can only contain). Parent spans such as `price.calculate` look slow but have almost no **self time**; they inherit the delay from their children. All timings are illustrative teaching data.

## How to Use

1. Read the waterfall top to bottom: `checkout.process` is the root span, and each indented bar is a call made by the bar above it.
2. **Click a span** to see its start time, duration, self time, share of the trace, tags, and a short diagnosis. Click it again to clear the selection.
3. Change the view to **Fast baseline** to see the same request on a good day, then to **Compare** to overlay the baseline (gray bars) and see how much longer each span took.
4. Tick **Critical path**. Gold segments mark the span responsible for each moment of the request, and the panel ranks the largest contributors.
5. Use the **service filter** to dim everything except one service, for example `database`, which appears twice.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/distributed-trace-viewer/main.html"
        height="552"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Graduate / Professional

### Duration
15-20 minutes

### Prerequisites
Microservice call chains, the difference between latency and response time, and basic caching.

### Bloom's Taxonomy Level
Analyze (L4)

### Learning Objective
Students will be able to read a distributed trace waterfall diagram, identify the critical path spans contributing most to total latency, and diagnose the root cause of a latency issue from trace data.

### Activities

1. **Predict** (3 min): Before clicking anything, students write down which span they think is the root cause of the 850 ms request and why.
2. **Inspect** (6 min): Students click the four red-outlined child spans and record duration versus self time for each. They explain why `price.calculate` (210 ms) is not itself the problem.
3. **Compare** (5 min): In Compare view, students list which spans changed, which span is new, and which spans only started later because earlier spans ran long.
4. **Rank** (4 min): With Critical path on, students rank the top three contributors and separate what the team can fix (the pricing query) from what it can only contain (the external gateway).

### Assessment
Give students the scenario "95th percentile checkout response time shall not exceed 500 ms" and ask them to name the two findings in this trace, classify each as an ATAM risk or sensitivity point, and propose one tactic for each.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Sigelman, B. H., et al. (2010). *Dapper, a Large-Scale Distributed Systems Tracing Infrastructure*. Google Technical Report dapper-2010-1.
3. OpenTelemetry. [Traces](https://opentelemetry.io/docs/concepts/signals/traces/). OpenTelemetry documentation of traces, spans, and context propagation.
