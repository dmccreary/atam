---
title: Distributed System Component Explorer
description: Students will be able to identify the major infrastructure components of a distributed system, explain each component's purpose, and describe the quality attribute implications of each component's design choices.
status: scaffold
library: p5.js
bloom_level: Understand (L2) — Explain the role of each distributed system infrastructure component and its quality attribute implications.
---

# Distributed System Component Explorer

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to identify the major infrastructure components of a distributed system, explain each component's purpose, and describe the quality attribute implications of each component's design choices.

- **Bloom Level:** Understand (L2) — Explain the role of each distributed system infrastructure component and its quality attribute implications.
- **Bloom Verb:** Explain
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 11: Distributed Systems Architecture Fundamentals](../../chapters/11-distributed-systems-fundamentals/index.md).

```text
Type: diagram
**sim-id:** distributed-system-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive architecture diagram showing the major components of a distributed system (API gateway, service mesh, message broker, service registry, services, databases) and how they interact, with click-to-explore capability for each component and its quality attribute implications.

Bloom Level: Understand (L2) — Explain the role of each distributed system infrastructure component and its quality attribute implications.
Bloom Verb: Explain

Learning Objective: Students will be able to identify the major infrastructure components of a distributed system, explain each component's purpose, and describe the quality attribute implications of each component's design choices.

Canvas layout:
- Central architecture diagram showing a realistic distributed system topology
- External clients at top, API gateway below them, service mesh envelope around internal services
- Four internal services with their sidecar proxies (small proxy icons beside each service)
- Message broker (Kafka icon) connected to two services via event streams
- Service registry connected to each service and the load balancer
- Databases (one per service, data ownership pattern) below services
- Each component labeled and color-coded by category
- Detail panel on right showing component description when clicked

Component categories:
- Ingress (gold): API Gateway, Load Balancer
- Services (blue): Service A, Service B, Service C, Service D
- Service Mesh (teal): Sidecar Proxy (per service), Control Plane
- Messaging (orange): Message Broker (Kafka)
- Discovery (purple): Service Registry
- Data (green): Database per Service (4 databases)

Interactive elements:
- Click any component to see: definition, quality attribute implications (what it supports, what it threatens), ATAM evaluation questions for this component
- Hover any connection arrow to see: protocol, synchrony (sync/async), and latency category
- "Failure Mode" button: click any service to simulate it going down; watch how the system diagram updates to show health status propagation
- Toggle "With Service Mesh" / "Without Service Mesh" to see the difference in security and observability coverage

Color scheme: Gold for ingress, Blue for services, Teal for mesh, Orange for messaging, Purple for discovery, Green for data.

Responsive: Diagram scales to container width; components reposition proportionally.
```

## Related Resources

- [Chapter 11: Distributed Systems Architecture Fundamentals](../../chapters/11-distributed-systems-fundamentals/index.md)
