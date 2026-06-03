---
title: Security Architecture Layers
description: Students will be able to map STRIDE threat categories to the defense-in-depth layers that address them, identify security layer gaps, and determine which attacks would succeed if a specific layer were absent.
status: scaffold
library: p5.js
bloom_level: Analyze (L4) — Examine how defense-in-depth layers address specific STRIDE threat categories and identify which layers are missing or insufficient.
---

# Security Architecture Layers

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to map STRIDE threat categories to the defense-in-depth layers that address them, identify security layer gaps, and determine which attacks would succeed if a specific layer were absent.

- **Bloom Level:** Analyze (L4) — Examine how defense-in-depth layers address specific STRIDE threat categories and identify which layers are missing or insufficient.
- **Bloom Verb:** Examine
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 14: Security Architecture](../../chapters/14-security-architecture/index.md).

```text
Type: diagram
**sim-id:** security-architecture-layers<br/>
**Library:** p5.js<br/>
**Library:** vis-network<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive visualization of defense-in-depth security layers for a modern web application, showing how each layer intercepts specific attack types and what security mechanisms are present at each layer.

Bloom Level: Analyze (L4) — Examine how defense-in-depth layers address specific STRIDE threat categories and identify which layers are missing or insufficient.
Bloom Verb: Examine

Learning Objective: Students will be able to map STRIDE threat categories to the defense-in-depth layers that address them, identify security layer gaps, and determine which attacks would succeed if a specific layer were absent.

Canvas layout:
- Concentric rings (target/bullseye style) from outer to inner: Perimeter, Transport, Authentication, Authorization, Data, Monitoring
- Each ring contains labeled security mechanisms (e.g., WAF, DDoS mitigation in Perimeter ring)
- Attack vectors shown as arrows approaching from the outside, stopped at the appropriate ring
- Click any ring to see the mechanisms in that layer and which STRIDE threats they address
- Toggle individual rings "on" or "off" to see what attacks would reach the next layer

Ring contents:
Perimeter: WAF, DDoS mitigation, IP allowlisting, rate limiting
Transport: TLS 1.3, mTLS for service-to-service, certificate management
Authentication: MFA, OAuth 2.0 / OIDC, mTLS client certs, session management
Authorization: RBAC, ABAC, permission validation, resource-level access control
Data: Encryption at rest, field-level encryption, tokenization, data masking
Monitoring: SIEM, IDS/IPS, anomaly detection, security event logging, incident response

Attack vectors (arrows):
- Volumetric DDoS → stopped at Perimeter by DDoS mitigation
- SQL injection via API → stopped at Transport/Auth layers by input validation
- Credential stuffing → stopped at Authentication by MFA and rate limiting
- Stolen token used for privilege escalation → stopped at Authorization by permission validation
- Database exfiltration after server compromise → stopped at Data by encryption at rest

Interactive elements:
- Click any ring to expand full mechanism list and STRIDE coverage
- "Remove Layer" buttons to simulate what happens when a layer is absent
- Click any attack arrow to see its full path and which layers would block it
- "Security Gap Finder" mode: highlight layers that do not address certain STRIDE categories

Color scheme: Rings from red (outer/perimeter) to blue (inner/data), with green for monitoring. Attack arrows in orange.

Responsive: Concentric rings scale proportionally to container width.
```

## Related Resources

- [Chapter 14: Security Architecture](../../chapters/14-security-architecture/index.md)
