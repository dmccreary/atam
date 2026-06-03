---
title: STRIDE Threat Model Explorer
description: Students will be able to apply the STRIDE framework to a system's data flow diagram, identifying at least one threat from each STRIDE category for the depicted system.
status: scaffold
library: p5.js
bloom_level: Apply (L3) — Use the STRIDE framework to identify threats at specific components and data flows in a system architecture.
---

# STRIDE Threat Model Explorer

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to apply the STRIDE framework to a system's data flow diagram, identifying at least one threat from each STRIDE category for the depicted system.

- **Bloom Level:** Apply (L3) — Use the STRIDE framework to identify threats at specific components and data flows in a system architecture.
- **Bloom Verb:** Use (Apply STRIDE)
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 14: Security Architecture](../../chapters/14-security-architecture/index.md).

```text
Type: diagram
**sim-id:** stride-threat-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive system diagram (data flow diagram style) for a realistic example system (healthcare patient portal), with STRIDE threat categories applied to each component and data flow — allowing students to identify threats at each point.

Bloom Level: Apply (L3) — Use the STRIDE framework to identify threats at specific components and data flows in a system architecture.
Bloom Verb: Use (Apply STRIDE)

Learning Objective: Students will be able to apply the STRIDE framework to a system's data flow diagram, identifying at least one threat from each STRIDE category for the depicted system.

Canvas layout:
- Data flow diagram showing: Browser/Mobile Client, API Gateway, Authentication Service, Patient Portal Service, EHR Integration, Database
- Arrows showing data flows between components, labeled with flow type (patient data, auth token, prescriptions)
- Each component shown as a rounded rectangle; data stores as double-horizontal-lined rectangles; external entities as rectangles
- Trust boundary lines (dashed) separating untrusted (client), trusted (internal services), and highly trusted (database) zones

Interaction:
- Click any component or data flow arrow to open a STRIDE analysis panel for that element
- Panel shows the six STRIDE categories with a description of the relevant threat for that element
- "Add Mitigation" button per threat to record a mitigation strategy
- Toggle "Show Trust Boundaries" to highlight zones

Example STRIDE analysis for API Gateway:
- Spoofing: Attacker uses stolen JWT token to authenticate as legitimate user → Mitigation: Token binding, short token lifetime, revocation list
- Tampering: Attacker modifies API request payload in transit → Mitigation: HTTPS with certificate pinning
- Repudiation: API calls not logged with sufficient detail → Mitigation: Structured request logging with user ID, timestamp, operation, outcome
- Information Disclosure: Verbose error messages expose internal architecture → Mitigation: Sanitize error messages; log details internally only
- Denial of Service: Synthetic traffic overwhelms gateway → Mitigation: Rate limiting, WAF, DDoS mitigation service
- Elevation of Privilege: Forged claims in JWT token → Mitigation: Signature verification, claims validation, audience restriction

Color scheme: Red for Spoofing/Tampering/Elevation threats, Orange for Information Disclosure, Yellow for Repudiation/DoS. Blue for trusted zone, Gray for untrusted zone.

Responsive: Diagram scales to container width; components reposition proportionally.
```

## Related Resources

- [Chapter 14: Security Architecture](../../chapters/14-security-architecture/index.md)
