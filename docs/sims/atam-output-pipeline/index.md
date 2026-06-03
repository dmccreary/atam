---
title: ATAM Output to Action Pipeline
description: Interactive p5.js MicroSim tracing an ATAM finding through six stages from the evaluation session to ongoing monitoring.
image: /sims/atam-output-pipeline/atam-output-pipeline.png
og:image: /sims/atam-output-pipeline/atam-output-pipeline.png
twitter:image: /sims/atam-output-pipeline/atam-output-pipeline.png
social:
   cards: false
quality_score: 0
---

# ATAM Output to Action Pipeline

<iframe src="main.html" height="550" width="100%" scrolling="no"></iframe>

[Run the ATAM Output Pipeline MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim visualizes how an ATAM evaluation finding turns into organizational action, traced through six stages: **Evaluation Session → Risk Classification → Risk Theme Aggregation → Architecture Evaluation Report → Architecture Improvement Plan → Ongoing Monitoring**. Each stage names the output artifact it produces and the role responsible for it, color-coded by category (blue = evaluation, teal = documentation, green = action, orange = monitoring). A single example finding — a missing circuit breaker — flows through all six stages so students can follow the path from raw observation to a live fitness function.

## How to Use

1. **Click any stage** to read its owner, its output, and the example artifact it produces.
2. Click **Run Example ▶** to advance the example finding one stage at a time; completed stages gain a ✓ and the active stage shows ▶.
3. Notice how the same finding changes shape at each stage — from a raw observation, to a classified risk, to a theme, to a report entry, to a planned work item, to a monitored fitness function.

The step-through is intentionally discrete so each transformation and its owner can be examined.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/atam-output-pipeline/main.html"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / Professional

### Duration
10-15 minutes

### Prerequisites
Familiarity with ATAM evaluation outputs (risks, themes) and the idea of fitness functions.

### Bloom's Taxonomy Level
Understand (L2)

### Learning Objective
Students will be able to trace an ATAM risk finding from its identification in the evaluation session through the risk register, the improvement plan, the architecture roadmap, and verification through fitness function monitoring.

### Activities

1. **Trace** (5 min): Students step through all six stages and record the artifact name and owner at each.
2. **Role map** (5 min): Students list which roles are responsible across the pipeline and where responsibility hands off.
3. **Discussion** (5 min): Students explain why an evaluation that stops at the report (no plan, no monitoring) fails to deliver value.

### Assessment
Give students a new raw finding and ask them to write the artifact each of the six stages would produce, including a concrete fitness function for the monitoring stage.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Kazman, R., Klein, M., & Clements, P. (2000). *ATAM: Method for Architecture Evaluation* (CMU/SEI-2000-TR-004).
