---
title: Security Architecture Layers
description: Concentric defense-in-depth rings (perimeter, transport, authentication, authorization, data, monitoring) with six attack arrows: remove a layer to see which attacks get further, and use the STRIDE gap finder to see which threat categories depend on a single layer.
image: /sims/security-architecture-layers/security-architecture-layers.png
og:image: /sims/security-architecture-layers/security-architecture-layers.png
twitter:image: /sims/security-architecture-layers/security-architecture-layers.png
social:
   cards: false
quality_score: 0
---

# Security Architecture Layers

<iframe src="main.html" height="577" width="100%" scrolling="no"></iframe>

[Run the Security Architecture Layers MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim draws **defense in depth** as six concentric rings around the protected patient data. From the outside in they are perimeter, transport, authentication, authorization, data protection, and monitoring. Six numbered attack arrows come from outside, and each ends, with a black bar, at the first active layer that stops it: a volumetric DDoS at the perimeter, eavesdropping at the transport layer, credential stuffing at authentication, a stolen token used for privilege escalation at authorization, and database exfiltration after a server compromise at the data layer.

Uncheck a layer and the arrows redraw. Some attacks then run all the way to the center, some are caught by a later layer, and some are only limited: SQL injection is rejected by the WAF at the perimeter, and if the perimeter is removed, field-level encryption still keeps the most sensitive fields unreadable. Monitoring never blocks anything, but it decides whether a successful attack is noticed; passive eavesdropping produces no events, so it is the one attack monitoring cannot see. The **gap finder** highlights the layers that address a chosen STRIDE category. Information disclosure is covered by three layers; repudiation, denial of service, and elevation of privilege each depend on one.

The model is deliberately simplified. Real controls overlap more than this, and the primary defense against SQL injection (parameterized queries in application code) is not one of the rings.

## How to Use

1. Read the rings from the outside in, and follow each numbered arrow to the layer that stops it.
2. **Click an attack number** (or its row in the list) to see how the attack works, which mechanism stops it, and why the outer layers let it through.
3. **Click a ring** to see its mechanisms and the STRIDE categories it addresses.
4. **Uncheck a layer** under the drawing and watch which arrows travel further. A red center means at least one attack reached the data.
5. Choose a category in the **gap finder** to see which layers address it and whether there is any depth. **Restore all layers** resets the checkboxes.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/security-architecture-layers/main.html"
        height="577"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Graduate / Professional

### Duration
15-20 minutes

### Prerequisites
STRIDE threat categories, the difference between authentication and authorization, and encryption in transit versus at rest.

### Bloom's Taxonomy Level
Analyze (L4)

### Learning Objective
Students will be able to map STRIDE threat categories to the defense-in-depth layers that address them, identify security layer gaps, and determine which attacks would succeed if a specific layer were absent.

### Activities

1. **Predict** (4 min): With all layers on, students predict for each attack what happens if the layer that stops it is removed: caught later, limited, or successful.
2. **Remove and check** (6 min): Students remove one layer at a time, record the outcome of all six attacks, and compare with their predictions.
3. **Gap analysis** (5 min): Using the gap finder, students build a table of STRIDE category against layers and mark the categories that have no depth.
4. **Detection matters** (5 min): Students remove Monitoring together with one other layer and explain how the consequences of the breach change even though the same attack succeeds.

### Assessment
Describe a system that has a WAF, TLS, and role-based access control but no MFA, no encryption at rest, and no central logging. Ask students which of the six attacks succeed, which STRIDE categories are uncovered, and which single addition they would make first and why.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley. (Security tactics.)
2. Shostack, A. (2014). *Threat Modeling: Designing for Security*. Wiley.
3. Rose, S., Borchert, O., Mitchell, S., & Connelly, S. (2020). *Zero Trust Architecture* (NIST Special Publication 800-207). National Institute of Standards and Technology.
