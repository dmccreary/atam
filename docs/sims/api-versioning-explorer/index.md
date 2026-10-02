---
title: API Versioning and Contract-First Design Patterns
description: Compare URL versioning, header versioning, content negotiation, and additive-only evolution for a scenario you choose, see which strategy fits best and what tradeoff it accepts, and walk through the contract-first workflow that keeps changes compatible.
image: /sims/api-versioning-explorer/api-versioning-explorer.png
og:image: /sims/api-versioning-explorer/api-versioning-explorer.png
twitter:image: /sims/api-versioning-explorer/api-versioning-explorer.png
social:
   cards: false
quality_score: 0
---

# API Versioning and Contract-First Design Patterns

<iframe src="main.html" height="542" width="100%" scrolling="no"></iframe>

[Run the API Versioning Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim is a decision aid for one of the most consequential modifiability choices in a distributed system: how a service contract changes without forcing every consumer to upgrade at once. Four strategy cards show qualitative 1 to 5 ratings for **modifiability**, **operational complexity** (a cost, so fewer pips is better), **consumer migration ease**, and **fit for the system context** you select. You set the context (public API, internal microservices, or event streaming), the quality attribute you care most about, and whether the change **breaks** existing consumers or is purely **additive**. The gold panel names the best-fit strategy, the runner-up, the reasoning, and the tradeoff you accept by choosing it.

The key distinction is the change type. A backward-compatible change (a new optional field) needs no new version at all, so additive-only evolution wins in every context. A breaking change (a rename or removal) cannot be expressed additively, so one of the three explicit strategies must carry it, and which one depends on who the consumers are. The teal strip at the bottom shows the **contract-first workflow**: define the contract, generate stubs and SDKs, implement, run consumer-driven contract tests, and gate deployment on a compatibility check.

The ratings follow the chapter's specification; the context-fit ratings and the scoring formula are qualitative teaching devices, not measurements. With these ratings content negotiation is never the top choice: it matches header versioning on modifiability and migration but costs more complexity, which is itself a finding worth discussing.

## How to Use

1. Read the four cards. Green pips are benefits, orange pips are complexity cost, and blue pips are fit for the selected context.
2. Use the three menus under the drawing to set the **context**, your **priority**, and the **change type**. The best-fit card turns gold and the panel explains why.
3. Switch the change type between **breaking** and **additive** and watch additive-only evolution go from not applicable to best fit.
4. **Click a card** to read how the strategy works, its main advantage and drawback, and when to use it. Click it again to return to the recommendation.
5. **Hover over or click** the five contract-first workflow steps to see the tools and practices behind each one.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/api-versioning-explorer/main.html"
        height="542"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Graduate / Professional

### Duration
15-20 minutes

### Prerequisites
Service contracts, backward and forward compatibility, and basic HTTP (paths, headers, media types).

### Bloom's Taxonomy Level
Evaluate (L5)

### Learning Objective
Students will be able to compare API versioning strategies across dimensions of operational complexity, consumer migration burden, and modifiability cost, and select the most appropriate strategy for a given set of quality attribute priorities.

### Activities

1. **Commit first** (4 min): Before touching the menus, students write down which strategy they would choose for a public API that must rename a field, and why.
2. **Test the choice** (6 min): Students set that scenario, compare the recommendation with their own answer, and then change one input at a time to find which input changes the recommendation.
3. **Find the dominated option** (5 min): Students explain from the ratings why content negotiation never wins, and describe a requirement that is not in the model under which they would still choose it.
4. **Close the loop** (5 min): Using the workflow strip, students identify which step would have caught an accidental breaking change before deployment, for a REST API and for an event stream.

### Assessment
Present a scenario (for example, an internal order-events stream that must change a field's type) and ask students to select a versioning strategy, state the tradeoff they accept, and name the contract-first control that enforces it. Grade the justification, not the choice.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Richardson, C. (2018). *Microservices Patterns*. Manning. (Chapter 3: Interprocess communication, including API evolution and semantic versioning.)
3. Newman, S. (2021). *Building Microservices* (2nd ed.). O'Reilly. (Handling change between microservices; consumer-driven contracts.)
4. Preston-Werner, T. [Semantic Versioning 2.0.0](https://semver.org/).
5. OpenAPI Initiative. [OpenAPI Specification](https://spec.openapis.org/oas/latest.html).
