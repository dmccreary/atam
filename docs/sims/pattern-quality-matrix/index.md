---
title: Architectural Pattern Quality Attribute Matrix
description: Interactive p5.js MicroSim comparing eight architectural patterns across eight quality attributes, with click-to-explore tradeoff mechanisms.
image: /sims/pattern-quality-matrix/pattern-quality-matrix.png
og:image: /sims/pattern-quality-matrix/pattern-quality-matrix.png
twitter:image: /sims/pattern-quality-matrix/pattern-quality-matrix.png
social:
   cards: false
quality_score: 0
---

# Architectural Pattern Quality Attribute Matrix

<iframe src="main.html" height="578" width="100%" scrolling="no"></iframe>

[Run the Pattern Quality Matrix MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim is an 8×8 matrix that compares eight architectural patterns — Layered, Microservices, Event-Driven, CQRS, Strangler Fig, Hexagonal, Pipe-and-Filter, and SOA — across eight quality attributes. Each cell shows whether a pattern primarily **supports** (green), **threatens** (red), is **complex/depends** (yellow), or is **neutral** (gray) on that attribute. Clicking a cell reveals the specific tradeoff mechanism and what to probe for in an ATAM evaluation, helping students choose the pattern best suited to a set of prioritized quality attribute scenarios.

## How to Use

1. **Click any cell** to read the tradeoff mechanism behind its rating and the related ATAM probing advice.
2. **Click a column header** to sort the patterns by that quality attribute (best-supporting at the top) — a fast way to answer "which pattern is strongest for X?"
3. **Click a pattern name** to see its one-line summary and its full quality-attribute profile.
4. **Compare Two Patterns** lets you pick two patterns and view their ratings side by side.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/pattern-quality-matrix/main.html"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / Professional

### Duration
15-20 minutes

### Prerequisites
Familiarity with common architectural patterns and the quality attributes used in ATAM.

### Bloom's Taxonomy Level
Analyze (L4)

### Learning Objective
Students will be able to compare at least six architectural patterns across multiple quality attribute dimensions, identify the pattern most suitable for a given set of (H,H) quality attribute scenarios, and explain the tradeoff mechanism responsible for each pattern's strength or weakness.

### Activities

1. **Find the strength** (5 min): For three quality attributes, students sort by the column and name the top pattern, then read the mechanism.
2. **Choose for a scenario set** (8 min): Given two (H,H) scenarios (e.g., high Scalability + high Modifiability), students use the matrix to pick a pattern and justify it from the cell mechanisms.
3. **Compare** (5 min): Students compare Microservices and Event-Driven side by side and explain where they diverge.

### Assessment
Give students a prioritized quality attribute profile and ask them to recommend a pattern, citing the supporting and threatening cells that justify the choice.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Richards, M., & Ford, N. (2020). *Fundamentals of Software Architecture*. O'Reilly.
