---
title: Scenario Catalog to Fitness Function Pipeline
description: Students will be able to trace a quality attribute scenario through the fitness function pipeline, identifying each transformation step and the artifact produced at each stage.
status: scaffold
library: p5.js
bloom_level: Analyze (L4) — Examine the relationship between a quality attribute scenario and its derived fitness function, tracing the architectural traceability chain.
---

# Scenario Catalog to Fitness Function Pipeline

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to trace a quality attribute scenario through the fitness function pipeline, identifying each transformation step and the artifact produced at each stage.

- **Bloom Level:** Analyze (L4) — Examine the relationship between a quality attribute scenario and its derived fitness function, tracing the architectural traceability chain.
- **Bloom Verb:** Trace
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 6: Quality Attribute Scenarios](../../chapters/06-quality-attribute-scenarios/index.md).

```text
Type: workflow
**sim-id:** scenario-to-fitness-pipeline<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show the flow from a prioritized scenario catalog entry through fitness function specification to automated CI/CD enforcement, making the connection between ATAM analysis and day-to-day engineering concrete.

Bloom Level: Analyze (L4) — Examine the relationship between a quality attribute scenario and its derived fitness function, tracing the architectural traceability chain.
Bloom Verb: Trace

Learning Objective: Students will be able to trace a quality attribute scenario through the fitness function pipeline, identifying each transformation step and the artifact produced at each stage.

Canvas layout:
- Horizontal flow of five pipeline stages, connected by arrows
- Each stage shown as a rounded rectangle with a colored header
- Within each stage: input, transformation description, and output
- A scenario example card flowing through the pipeline (animated when "Run Pipeline" button is clicked)
- Detail panel on the right showing full artifact contents when a stage is clicked

Pipeline stages:
1. Scenario Catalog Entry
   Input: Stakeholder scenario as described in workshop
   Transform: Formalize into six-component structure
   Output: Well-formed scenario with quantitative response measure

2. Risk Assessment
   Input: Formalized scenario
   Transform: Evaluate current architecture against response measure; identify gap
   Output: Risk status (Meets / At Risk / Missing Capability)

3. Fitness Function Specification
   Input: "At Risk" or "Missing Capability" scenario
   Transform: Define executable test: tool, trigger, assertion, threshold
   Output: Fitness function specification document

4. Implementation
   Input: Fitness function specification
   Transform: Implement as automated test, load test, chaos test, or metric threshold
   Output: Executable test in CI/CD pipeline

5. Continuous Monitoring
   Input: Deployed fitness function
   Transform: Execute on each build/deployment/scheduled interval
   Output: Pass/Fail result with evidence; fail blocks deployment or triggers alert

Example scenario flowing through: "P99 API latency < 200ms at 500 concurrent users"
Stage 1 output: Full six-component scenario card
Stage 2 output: Risk card showing current P99 = 340ms at 500 users (At Risk)
Stage 3 output: Fitness function spec: "k6 load test, 500 VUs, 10-minute duration, P99 assertion < 200ms"
Stage 4 output: k6 test script in CI/CD pipeline with pass/fail threshold
Stage 5 output: CI/CD dashboard showing last 5 results

Interactive elements:
- Click each stage for full description and artifact details
- "Run Pipeline" button animates the scenario card flowing stage-by-stage
- Switch between three example scenarios (performance, availability, security) using scenario selector

Color scheme: Blue for Scenario Catalog, Yellow for Risk Assessment, Orange for Specification, Green for Implementation, Teal for Monitoring.

Responsive: Stages reflow to vertical stack on narrow screens.
```

## Related Resources

- [Chapter 6: Quality Attribute Scenarios](../../chapters/06-quality-attribute-scenarios/index.md)
