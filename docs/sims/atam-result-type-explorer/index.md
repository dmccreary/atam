---
title: ATAM Result Type Explorer
description: Interactive p5.js classification MicroSim for differentiating sensitivity points, tradeoff points, risks, and non-risks from concrete architectural decisions.
image: /sims/atam-result-type-explorer/atam-result-type-explorer.png
og:image: /sims/atam-result-type-explorer/atam-result-type-explorer.png
twitter:image: /sims/atam-result-type-explorer/atam-result-type-explorer.png
social:
   cards: false
quality_score: 0
---

# ATAM Result Type Explorer

<iframe src="main.html" height="558" width="100%" scrolling="no"></iframe>

[Run the ATAM Result Type Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim is a classification activity for the four ATAM result types. Each card presents a concrete architectural decision with its scenario context; you classify it as a **Sensitivity Point**, **Tradeoff Point**, **Risk**, or **Non-Risk**, and a feedback panel shows the correct type, the reasoning, the quality attributes involved, and what an evaluation team would document. Eight diverse examples span all four types across multiple quality attribute contexts, so the definitional distinctions are practiced rather than memorized.

## How to Use

1. Read the **decision card** and its scenario context.
2. Click one of the four **classification buttons**. The correct type is highlighted and the feedback panel explains why.
3. Read the **Why**, the affected **quality attributes**, and what **ATAM documents** for this finding.
4. Click **Next Decision ▶** to move on. Your running **score** tracks correct answers.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/atam-result-type-explorer/main.html"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / Professional

### Duration
15-20 minutes

### Prerequisites
Familiarity with the ATAM definitions of sensitivity point, tradeoff point, risk, and non-risk.

### Bloom's Taxonomy Level
Analyze (L4)

### Learning Objective
Students will be able to classify a given architectural decision into the correct ATAM result type and explain the reasoning that justifies the classification.

### Activities

1. **Classify all eight** (10 min): Students work through every card and record their score.
2. **Justify** (5 min): For the two cards they found hardest, students write their own one-sentence justification before revealing feedback.
3. **Contrast** (5 min): Students explain the difference between a sensitivity point and a tradeoff point using two cards from the set.

### Assessment
Give students three new decisions and ask them to classify each and justify the classification in one sentence.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Kazman, R., Klein, M., & Clements, P. (2000). *ATAM: Method for Architecture Evaluation* (CMU/SEI-2000-TR-004).
