---
title: Scenario Construction Workbench
description: Students will be able to transform a general scenario template into a concrete, system-specific scenario with a quantitative response measure, for any of the five typed scenario families (performance, availability, security, modifiability, scalability).
status: scaffold
library: p5.js
bloom_level: Apply (L3) — Use the six-component scenario model to construct well-formed concrete quality attribute scenarios from general templates.
---

# Scenario Construction Workbench

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to transform a general scenario template into a concrete, system-specific scenario with a quantitative response measure, for any of the five typed scenario families (performance, availability, security, modifiability, scalability).

- **Bloom Level:** Apply (L3) — Use the six-component scenario model to construct well-formed concrete quality attribute scenarios from general templates.
- **Bloom Verb:** Construct
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 6: Quality Attribute Scenarios](../../chapters/06-quality-attribute-scenarios/index.md).

```text
Type: microsim
**sim-id:** scenario-construction-workbench<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive workbench for constructing well-formed quality attribute scenarios using the six-component model, with instant feedback on completeness and quality, and library of general scenario templates to start from.

Bloom Level: Apply (L3) — Use the six-component scenario model to construct well-formed concrete quality attribute scenarios from general templates.
Bloom Verb: Construct

Learning Objective: Students will be able to transform a general scenario template into a concrete, system-specific scenario with a quantitative response measure, for any of the five typed scenario families (performance, availability, security, modifiability, scalability).

Canvas layout:
- Top: Quality attribute selector tabs (Performance, Availability, Security, Modifiability, Scalability)
- Left panel: Six labeled input fields for the six scenario components
- Center: Completeness meter (0-100%) and "ATAM-Ready" indicator
- Right panel: General scenario template for selected quality attribute, with "Load Template" button
- Bottom: "Evaluate Scenario" button showing detailed per-component feedback

Template library (one per quality attribute type):
Performance: "N requests of type X arrive at rate Y; system must respond within Z ms at the Pnn percentile"
Availability: "Component X fails; system must recover/degrade within T seconds with at most M data loss"
Security: "Adversarial actor attempts X attack type; system must detect and respond with Y within Z seconds"
Modifiability: "New requirement X must be implemented; change must be confined to Y modules within Z effort"
Scalability: "Workload increases by Nx; system must scale to handle it within T minutes with P% cost increase"

Completeness scoring (same as Chapter 5 workbench but extended):
- Each empty field: -15 points
- Generic/vague field (no numbers, no specifics): -10 points
- Specific field with quantitative measure: +15 points

Behavior:
- Selecting a quality attribute tab changes the general template and field hints
- "Load Template" pre-fills fields with a partially complete example
- As student fills fields, completeness meter animates
- "Evaluate Scenario" shows per-field feedback: "✓ Specific" / "⚠ Add a quantitative measure" / "✗ Too vague"
- "Save to Catalog" button (multiple scenarios can be saved) enables catalog building exercise

Instructional Rationale: Active construction from templates is appropriate because the Apply objective requires practice with concrete values. Loading templates reduces blank-page anxiety while still requiring students to supply the system-specific details.

Color scheme: Tabs in quality attribute colors from Chapter 5. Completeness meter in red-yellow-green gradient. Gold for component field headers.

Responsive: Panels stack vertically on narrow screens.
```

## Related Resources

- [Chapter 6: Quality Attribute Scenarios](../../chapters/06-quality-attribute-scenarios/index.md)
