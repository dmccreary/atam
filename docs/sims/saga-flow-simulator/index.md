---
title: Saga Pattern Flow Simulator
description: Students will be able to trace the flow of a Saga transaction through its service steps, identify which compensating transactions are required for each step, and determine what system state results from a partial failure at each point in the Saga.
status: scaffold
library: p5.js
bloom_level: Apply (L3) — Use the Saga pattern to trace a distributed transaction through its steps and compensation logic.
---

# Saga Pattern Flow Simulator

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to trace the flow of a Saga transaction through its service steps, identify which compensating transactions are required for each step, and determine what system state results from a partial failure at each point in the Saga.

- **Bloom Level:** Apply (L3) — Use the Saga pattern to trace a distributed transaction through its steps and compensation logic.
- **Bloom Verb:** Trace
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 12: Distributed Systems Patterns](../../chapters/12-distributed-systems-patterns/index.md).

```text
Type: microsim
**sim-id:** saga-flow-simulator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive simulation of a choreography-based Saga transaction (e-commerce order placement spanning inventory, payment, and shipping services), showing the happy path and compensation path when a step fails.

Bloom Level: Apply (L3) — Use the Saga pattern to trace a distributed transaction through its steps and compensation logic.
Bloom Verb: Trace

Learning Objective: Students will be able to trace the flow of a Saga transaction through its service steps, identify which compensating transactions are required for each step, and determine what system state results from a partial failure at each point in the Saga.

Canvas layout:
- Three service boxes horizontally: Inventory Service, Payment Service, Shipping Service
- Horizontal event flow arrows between services
- Transaction steps numbered 1-6 along the flow
- Status indicators per service: Pending / Processing / Committed / Compensating / Compensated
- A "Saga State" panel showing the overall Saga status (In Progress / Succeeded / Compensating / Failed)
- A step-by-step navigator: "Next Step" button and "Inject Failure" button

Happy path steps:
1. Order Service creates Order [PENDING] and publishes OrderCreated event
2. Inventory Service receives OrderCreated, reserves inventory, publishes InventoryReserved
3. Payment Service receives InventoryReserved, charges credit card, publishes PaymentProcessed
4. Shipping Service receives PaymentProcessed, creates shipment, publishes ShipmentCreated
5. Order Service receives ShipmentCreated, marks Order [CONFIRMED]

Compensation path (if Payment fails at Step 3):
3a. PaymentService fails, publishes PaymentFailed
4a. Inventory Service receives PaymentFailed, releases reservation, publishes InventoryReleased
5a. Order Service marks Order [CANCELLED]

Interactive controls:
- "Next Step" advances through the Saga one step at a time
- "Inject Failure" (available at each step) simulates a failure at the current step, triggering compensation
- "Reset" returns to initial state
- Step-by-step mode shows event payloads for each arrow

Data Visibility Requirements:
- Always show each service's current state (pending/processing/committed/compensating/compensated)
- Show the event payload when an arrow is active
- When compensation is triggered, highlight the compensation arrows in red
- Show the Saga's overall success/failure status prominently

Instructional Rationale: Step-by-step simulation with failure injection is appropriate for Apply because students must trace both the forward and compensation paths with concrete steps, not just understand the concept abstractly.

Color scheme: Blue for forward flow arrows, Red for compensation arrows. Green for Committed states, Orange for Compensating, Gray for Compensated.

Responsive: Service boxes resize proportionally; flow arrows adapt to container width.
```

## Related Resources

- [Chapter 12: Distributed Systems Patterns](../../chapters/12-distributed-systems-patterns/index.md)
