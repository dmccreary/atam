---
title: Scenario Brainstorming and Prioritization Workshop Simulator
description: Interactive p5.js MicroSim that simulates an ATAM Phase-2 scenario workshop — stakeholders cast dot votes across a scenario catalog and the priority ordering and coverage gaps emerge live.
image: /sims/scenario-workshop-simulator/scenario-workshop-simulator.png
og:image: /sims/scenario-workshop-simulator/scenario-workshop-simulator.png
twitter:image: /sims/scenario-workshop-simulator/scenario-workshop-simulator.png
social:
   cards: false
quality_score: 0
---

# Scenario Brainstorming and Prioritization Workshop Simulator

<iframe src="main.html" height="612" width="100%" scrolling="no"></iframe>

[Run the Scenario Workshop Simulator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim simulates the scenario brainstorming and dot-voting prioritization that happens in an ATAM Phase 2 workshop. Four stakeholders — Business Owner, Security Officer, Operations Lead, and Product Manager — each hold five dot votes. A catalog of twelve scenarios, colored by quality attribute, sits in a sticky-note grid. As votes are cast, a live priority bar chart reorders, and a coverage view reveals which quality attributes are well-covered and which are under-represented.

## How to Use

1. **Select a stakeholder** by clicking one of the four chips at the top. The number in parentheses is their remaining votes.
2. **Click scenarios** in the grid to spend that stakeholder's votes. Each click adds one dot vote; the badge on each note shows its running total, and the highest-voted scenarios turn gold.
3. Watch the **Priority (dot votes)** bar chart on the right reorder in real time.
4. Click **Load Default Votes** to apply a realistic distribution where each stakeholder votes their own concerns — notice how the aggregate ordering differs from any single perspective.
5. Click **Show Coverage** to switch the right panel to a coverage view: scenario count and total votes per quality attribute, with the thinnest-covered attributes flagged as *under-represented*.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/scenario-workshop-simulator/main.html"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / Professional

### Duration
15-20 minutes

### Prerequisites
Familiarity with quality attribute scenarios and the ATAM scenario-prioritization (dot voting) step.

### Bloom's Taxonomy Level
Apply (L3)

### Learning Objective
Students will be able to simulate the ATAM scenario brainstorming and prioritization process, observe how different stakeholder voting patterns produce different priority orderings, and identify scenarios and quality attributes that represent coverage gaps.

### Activities

1. **Single-perspective run** (5 min): Using only the Security Officer's votes, students note the resulting top scenarios, then reset and repeat for the Business Owner — observing how priorities shift with perspective.
2. **Aggregate run** (5 min): Students click **Load Default Votes** and discuss why the consensus ordering differs from any one stakeholder's.
3. **Coverage analysis** (5 min): Students open **Show Coverage** and identify the under-represented quality attributes, then propose a new scenario that would strengthen coverage.

### Assessment
Ask students to explain, using the simulator, why a high-vote scenario is not automatically the most important one for the architecture, and how coverage analysis guards against a popularity-only prioritization.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Kazman, R., Klein, M., & Clements, P. (2000). *ATAM: Method for Architecture Evaluation* (CMU/SEI-2000-TR-004).
