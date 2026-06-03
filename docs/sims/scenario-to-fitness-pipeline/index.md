---
title: Scenario Catalog to Fitness Function Pipeline
description: Interactive p5.js MicroSim tracing a quality attribute scenario through five pipeline stages from catalog entry to a CI/CD fitness-function gate.
image: /sims/scenario-to-fitness-pipeline/scenario-to-fitness-pipeline.png
og:image: /sims/scenario-to-fitness-pipeline/scenario-to-fitness-pipeline.png
twitter:image: /sims/scenario-to-fitness-pipeline/scenario-to-fitness-pipeline.png
social:
   cards: false
quality_score: 0
---

# Scenario Catalog to Fitness Function Pipeline

<iframe src="main.html" height="552" width="100%" scrolling="no"></iframe>

[Run the Scenario to Fitness Function Pipeline MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim makes the connection between ATAM analysis and day-to-day engineering concrete by tracing a single quality attribute scenario through a five-stage pipeline: **Scenario Catalog Entry → Risk Assessment → Fitness Function Specification → Implementation → Continuous Monitoring**. At each stage the simulator shows the *input*, the *transformation*, the *output*, and the concrete *artifact* produced for the selected example scenario — so students can follow the architectural traceability chain end to end.

## How to Use

1. **Choose an example scenario** with the tabs (Performance, Availability, Security).
2. **Click any stage** in the pipeline to inspect the input, transform, output, and the concrete artifact that stage produces for the chosen scenario.
3. Click **Run Pipeline ▶** to advance the trace one stage at a time, watching each completed stage gain a ✓ and the active stage marked *tracing*.
4. Compare how the same five-stage shape produces a load test, a chaos test, or a security test depending on the quality attribute.

The step-through is intentionally discrete: tracing means examining each transformation, not watching a card glide past.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/scenario-to-fitness-pipeline/main.html"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / Professional

### Duration
10-15 minutes

### Prerequisites
Familiarity with quality attribute scenarios, fitness functions, and CI/CD pipelines.

### Bloom's Taxonomy Level
Analyze (L4)

### Learning Objective
Students will be able to trace a quality attribute scenario through the fitness function pipeline, identifying each transformation step and the artifact produced at each stage.

### Activities

1. **Trace** (5 min): For the Performance scenario, students step through all five stages and write down the artifact name at each stage.
2. **Compare** (5 min): Students switch to the Availability and Security scenarios and identify what changes (the test tool and assertion) and what stays the same (the five-stage shape).
3. **Discussion** (5 min): Students explain how the Risk Assessment status (At Risk vs Missing Capability) determines whether a fitness function is even needed.

### Assessment
Give students a new scenario ("Search returns results in under 1 second for 95% of queries") and ask them to name the artifact each of the five stages would produce.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Ford, N., Parsons, R., & Kua, P. (2017). *Building Evolutionary Architectures*. O'Reilly. (Fitness functions.)
