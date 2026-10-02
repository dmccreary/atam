---
title: STRIDE Threat Model Explorer
description: Apply STRIDE to a data flow diagram of a healthcare patient portal: select any component or data flow, read the threat in each applicable category, and record a mitigation for it while a tracker shows which of the six categories you have covered.
image: /sims/stride-threat-explorer/stride-threat-explorer.png
og:image: /sims/stride-threat-explorer/stride-threat-explorer.png
twitter:image: /sims/stride-threat-explorer/stride-threat-explorer.png
social:
   cards: false
quality_score: 0
---

# STRIDE Threat Model Explorer

<iframe src="main.html" height="572" width="100%" scrolling="no"></iframe>

[Run the STRIDE Threat Model Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim is a small threat-modeling workbench. The top half is a **data flow diagram** of a healthcare patient portal: a browser or mobile client (external entity, drawn as a plain rectangle), four processes (rounded rectangles: API gateway, authentication service, patient portal service, and EHR integration), a database (data store, drawn with double horizontal lines), and five numbered data flows. Dashed **trust boundaries** separate the untrusted internet, the trusted internal services, and the highly trusted data zone.

Selecting an element lists the six **STRIDE** categories: **S**poofing, **T**ampering, **R**epudiation, **I**nformation disclosure, **D**enial of service, and **E**levation of privilege. Not every category applies to every kind of element. Following the STRIDE-per-element convention, processes are analyzed for all six, an external entity for spoofing and repudiation, a data store for tampering, repudiation, information disclosure, and denial of service, and a data flow for tampering, information disclosure, and denial of service. For each applicable threat you can record a mitigation; the circles at the top right fill in as soon as each category has at least one mitigation somewhere in the system. The 45 threats and mitigations are representative teaching examples, not a complete threat model.

## How to Use

1. Start with the **API Gateway**, which is selected when the sim loads. Read the six threats.
2. Before pressing **+ Add mitigation**, decide what you would do about the threat. Then press it to record and reveal a typical mitigation. Press it again to undo.
3. **Click another component or a numbered data flow.** Notice which STRIDE categories are grayed out for that element type and why.
4. Watch the **S T R I D E** circles at the top right fill in, and the small counters on each element (for example 2/6).
5. Toggle **Show trust boundaries** to see which flows cross from one zone to another; **Reset mitigations** starts over.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/stride-threat-explorer/main.html"
        height="572"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Graduate / Professional

### Duration
20-25 minutes

### Prerequisites
The security sub-properties (confidentiality, integrity, availability, non-repudiation), the six STRIDE categories, and how to read a data flow diagram.

### Bloom's Taxonomy Level
Apply (L3)

### Learning Objective
Students will be able to apply the STRIDE framework to a system's data flow diagram, identifying at least one threat from each STRIDE category for the depicted system.

### Activities

1. **Guided example** (5 min): Students work through the API Gateway, stating their own mitigation for each threat before revealing the recorded one.
2. **Cover all six** (8 min): Students fill all six tracker circles using as few elements as possible, then explain why they had to visit a process to do it.
3. **Boundary crossings** (5 min): Students compare flow 1 and flow 5 (which cross trust boundaries) with flow 3 (which does not) and argue which deserves mitigation first.
4. **Extend the model** (5 min): Students add one threat the sim does not list for any element, name its STRIDE category, and propose a mitigation.

### Assessment
Give students a new element (for example, an appointment-reminder service that sends SMS messages) and ask for one threat per applicable STRIDE category with a mitigation each, plus one security scenario written in six-part form.

## References

1. Shostack, A. (2014). *Threat Modeling: Designing for Security*. Wiley.
2. Howard, M., & Lipner, S. (2006). *The Security Development Lifecycle*. Microsoft Press.
3. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley. (Security tactics.)
4. OWASP. [Threat Modeling](https://owasp.org/www-community/Threat_Modeling).
