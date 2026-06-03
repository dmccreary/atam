---
title: Risk Register and Theme Aggregation
description: Interactive p5.js MicroSim for assessing a populated ATAM risk register grouped into themes, sortable by severity and probability.
image: /sims/risk-register-explorer/risk-register-explorer.png
og:image: /sims/risk-register-explorer/risk-register-explorer.png
twitter:image: /sims/risk-register-explorer/risk-register-explorer.png
social:
   cards: false
quality_score: 0
---

# Risk Register and Theme Aggregation

<iframe src="main.html" height="588" width="100%" scrolling="no"></iframe>

[Run the Risk Register Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim presents a populated ATAM risk register for a healthcare patient portal, organized into risk **themes**. Each theme expands into its constituent risks, badged by **Severity** and **Probability** (red H, orange M, yellow L). Clicking a risk shows its full documentation — evidence, mechanism, and a recommended mitigation. You can sort risks by combined priority, filter by severity, and toggle mitigations, so you can assess which architectural improvements would reduce the most severe risk most efficiently.

## How to Use

1. **Click a theme** (gold header) to expand or collapse its risks; the impact badge shows the theme's business impact.
2. **Click a risk** to read its evidence, mechanism, severity, probability, and priority score in the detail panel.
3. **Sort by Severity × Probability** to surface the highest-priority risks within each theme.
4. **Show Mitigation** reveals the recommended fix for the selected risk; **Severity** filter narrows to H, M, or L.
5. Expand **Non-Risks** to see the well-addressed scenarios, and read the summary bar for the totals.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/risk-register-explorer/main.html"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / Professional

### Duration
15-20 minutes

### Prerequisites
Familiarity with risk severity/probability rating and ATAM risk themes.

### Bloom's Taxonomy Level
Evaluate (L5)

### Learning Objective
Students will be able to interpret a populated risk register, identify the highest-priority risk themes, and recommend which architectural improvements would address the most severe risks most efficiently.

### Activities

1. **Prioritize** (6 min): Students sort by severity × probability and name the top three risks across all themes.
2. **One fix, many risks** (7 min): Students identify the theme whose mitigation would close the most high-priority risks at once.
3. **Justify** (5 min): Students recommend the first improvement the team should fund and justify it from the register.

### Assessment
Give students a fixed improvement budget (one theme) and ask them to choose which theme to fund and defend the choice using severity × probability.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Kazman, R., Klein, M., & Clements, P. (2000). *ATAM: Method for Architecture Evaluation* (CMU/SEI-2000-TR-004).
