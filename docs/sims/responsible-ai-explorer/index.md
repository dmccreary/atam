---
title: Responsible AI Architecture Components
description: Map fifteen responsible AI requirements in five dimensions to the architectural components that address them, add or remove components from a credit-scoring architecture, and run a gap analysis that ranks the unaddressed requirements by risk and by regulation.
image: /sims/responsible-ai-explorer/responsible-ai-explorer.png
og:image: /sims/responsible-ai-explorer/responsible-ai-explorer.png
twitter:image: /sims/responsible-ai-explorer/responsible-ai-explorer.png
social:
   cards: false
quality_score: 0
---

# Responsible AI Architecture Components

<iframe src="main.html" height="572" width="100%" scrolling="no"></iframe>

[Run the Responsible AI Architecture Components MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Responsible AI becomes an architecture question as soon as you ask *which component makes this true?* This MicroSim uses one scenario, a **credit-scoring model used in the EU and the US**, and lays out three things side by side:

- **Requirements** (left): fifteen requirements, three for each of the five dimensions (fairness, safety, transparency, accountability, privacy). A check mark means some component in the current architecture addresses it.
- **Components** (middle): twelve architectural components. Solid tiles are in the architecture; dashed tiles have not been built.
- **Coverage** (right): a radar chart of requirements addressed per dimension, and bars showing how many of the requirements tied to each regulation are addressed.

Point at a dimension, a requirement, or a component to light up what it maps to. Click a component to read its purpose, implementation examples, and how an ATAM evaluation would view it, then add it to or remove it from the architecture and watch the coverage change. **Gap analysis** lists the unaddressed requirements with the highest risk first, names the component that would close each gap, and places the gaps on a likelihood by impact matrix.

The letters G, E, and C mark the regulation a requirement helps satisfy: the **GDPR**, the **EU AI Act** (credit scoring of people is a high-risk use), and the US **Equal Credit Opportunity Act**. The tags are a study aid that points to the relevant law. They are not legal advice, and a real compliance assessment needs counsel. The likelihood and impact ratings are illustrative judgments for this scenario, not survey data. A requirement that shows as addressed has a component assigned to it; whether that component works well is a separate question.

## How to Use

1. Read the starting architecture: five components are built and 7 of 15 requirements are addressed.
2. **Point at a dimension header** (for example Transparency) to see which components serve it, and at a **requirement** to read why it matters and which regulation it relates to.
3. **Click a component**, read the panel, and press **Add to architecture** or **Remove from architecture**.
4. Tick **Gap analysis** to rank the unaddressed requirements and see them on the risk matrix.
5. Choose **GDPR**, **EU AI Act**, or **ECOA** to dim the requirements that regulation does not touch and to filter the gap list.
6. Press **Reset** to return to the starting architecture.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/responsible-ai-explorer/main.html"
        height="572"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Graduate / Professional

### Duration
15-20 minutes

### Prerequisites
The responsible AI dimensions (fairness, safety, transparency, accountability, privacy), the model registry and guardrails from this chapter, and ATAM risks and tradeoff points.

### Bloom's Taxonomy Level
Evaluate (L5)

### Learning Objective
Students will be able to assess an AI system architecture against responsible AI requirements by mapping each requirement to the component that addresses it, identifying the gaps, and prioritizing them by likelihood, impact, and regulatory exposure.

### Activities

1. **Read the map** (4 min): Students point at each dimension header in turn and list the components that serve it. They identify the two components that address more than one requirement.
2. **Three components only** (6 min): With a budget of three more components, students decide which to build, using the gap analysis. They justify the order and report the coverage they reach.
3. **One regulation** (4 min): Students filter by ECOA and name the smallest set of components that addresses every ECOA-tagged requirement.
4. **Find the tradeoff** (5 min): Students read the ATAM view of Data minimization, Fairness monitor, and Private training and write one tradeoff point that involves two responsible AI dimensions pulling against each other.

### Assessment
Give students a different starting architecture (for example, guardrails, audit log, and explainability service only) and ask them to list the unaddressed requirements, pick the three they would close first with a justification based on likelihood, impact, and regulation, and state one risk and one tradeoff point they would record in an ATAM evaluation of the result.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. European Union. (2024). [Regulation (EU) 2024/1689 (Artificial Intelligence Act)](https://eur-lex.europa.eu/eli/reg/2024/1689/oj). Official Journal of the European Union.
3. European Union. (2016). [Regulation (EU) 2016/679 (General Data Protection Regulation)](https://eur-lex.europa.eu/eli/reg/2016/679/oj). Official Journal of the European Union.
4. National Institute of Standards and Technology. (2023). [Artificial Intelligence Risk Management Framework (AI RMF 1.0)](https://doi.org/10.6028/NIST.AI.100-1). NIST AI 100-1.
5. Mitchell, M., et al. (2019). Model Cards for Model Reporting. *Proceedings of the Conference on Fairness, Accountability, and Transparency (FAT\* 2019)*, 220-229.
