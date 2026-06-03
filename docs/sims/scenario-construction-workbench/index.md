---
title: Scenario Construction Workbench
description: Interactive p5.js MicroSim for constructing well-formed quality attribute scenarios from typed templates with a live completeness meter.
image: /sims/scenario-construction-workbench/scenario-construction-workbench.png
og:image: /sims/scenario-construction-workbench/scenario-construction-workbench.png
twitter:image: /sims/scenario-construction-workbench/scenario-construction-workbench.png
social:
   cards: false
quality_score: 0
---

# Scenario Construction Workbench

<iframe src="main.html" height="592" width="100%" scrolling="no"></iframe>

[Run the Scenario Construction Workbench MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A workbench for turning a general scenario template into a concrete, system-specific quality attribute scenario. Five tabs select a scenario family — Performance, Availability, Security, Modifiability, or Scalability — each with its own general template and a measure-field hint. As you fill the six scenario components, a live Completeness meter and an ATAM-Ready badge react to how specific and measurable your content is. Well-formed scenarios can be saved to a catalog to build a coverage set across quality attributes.

## How to Use

1. **Pick a scenario family** by clicking one of the five colored tabs.
2. **Load Template** pre-fills a partially complete worked example — the Response Measure is intentionally left blank so you supply the quantitative bar.
3. **Fill the six components**: Source, Stimulus, Environment, Artifact, Response, and Response Measure. The green/amber/red dot beside each field marks how specific it is.
4. **Evaluate Scenario** shows per-component feedback (✓ Specific, ⚠ Add a quantitative measure, ✗ Too vague).
5. **Save to Catalog** stores a well-formed scenario so you can build a set spanning several quality attributes.

A scenario reaches **ATAM-Ready** when every component is specific and the response measure is quantitative.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/scenario-construction-workbench/main.html"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / Professional

### Duration
10-15 minutes

### Prerequisites
Familiarity with the six-component quality attribute scenario model and the five quality attribute families used in ATAM.

### Bloom's Taxonomy Level
Apply (L3)

### Learning Objective
Students will be able to transform a general scenario template into a concrete, system-specific scenario with a quantitative response measure, for any of the five typed scenario families.

### Activities

1. **Exploration** (5 min): Students load a template for each quality attribute family and observe how the general template differs from a concrete scenario.
2. **Guided Practice** (5 min): For two different families, students construct a scenario that reaches the ATAM-Ready badge, then Save it to the catalog.
3. **Discussion** (5 min): Students compare catalogs and discuss why the response measure is the component that makes a scenario testable.

### Assessment
Give students a vague goal ("the checkout should scale for Black Friday") and ask them to construct a Scalability scenario that reaches an ATAM-Ready (90%+) completeness score.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Kazman, R., Klein, M., & Clements, P. (2000). *ATAM: Method for Architecture Evaluation* (CMU/SEI-2000-TR-004).
