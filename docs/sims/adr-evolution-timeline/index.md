---
title: ADR Evolution Timeline
description: Interactive p5.js MicroSim showing how Architecture Decision Records evolve over three years as requirements change and ATAM evaluations produce findings.
image: /sims/adr-evolution-timeline/adr-evolution-timeline.png
og:image: /sims/adr-evolution-timeline/adr-evolution-timeline.png
twitter:image: /sims/adr-evolution-timeline/adr-evolution-timeline.png
social:
   cards: false
quality_score: 0
---

# ADR Evolution Timeline

<iframe src="main.html" height="588" width="100%" scrolling="no"></iframe>

[Run the ADR Evolution Timeline MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim traces a system's architectural decisions across three years as a two-track timeline. Architecture Decision Records (ADRs) sit above the axis, color-coded by status (green = Active, orange = Superseded, gray = Deprecated). System events sit below — blue markers for requirement changes and gold diamonds for ATAM evaluations. Relationship arrows show which event triggered each ADR, and a dashed arrow shows one ADR superseding another. It makes concrete how ATAM evaluation findings flow directly into new or superseding decision records.

## How to Use

1. **Click an ADR card** to read its full Context, Decision, and Consequences.
2. **Click a system event** (blue circle or gold ATAM diamond) to see what it triggered — a blue arrow points to the ADR(s) it produced.
3. Note the **dashed orange arrow**: ADR-003 (microservices) supersedes ADR-001 (layered), so ADR-001's status is Superseded.
4. Click **Show ADR-Only** to collapse the events track and view the decision history on its own.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/adr-evolution-timeline/main.html"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / Professional

### Duration
10-15 minutes

### Prerequisites
Familiarity with Architecture Decision Records (ADRs) and the ATAM evaluation process.

### Bloom's Taxonomy Level
Understand (L2)

### Learning Objective
Students will be able to trace an architectural decision through its ADR history, identify what triggered each revision, and explain the relationship between ATAM evaluation findings and ADR creation.

### Activities

1. **Trace a decision** (5 min): Students follow ADR-001 → ADR-003 and explain why and when it was superseded.
2. **Find the ATAM link** (5 min): Students click both gold ATAM events and name the ADR each produced and the finding behind it.
3. **Discussion** (5 min): Students explain why recording superseded decisions (rather than deleting them) is valuable architectural history.

### Assessment
Give students a new finding ("ATAM Evaluation #3 flags the message broker as a single point of failure") and ask them to draft the triggered ADR's Context, Decision, and Consequences.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Nygard, M. (2011). *Documenting Architecture Decisions*. (The original ADR proposal.)
