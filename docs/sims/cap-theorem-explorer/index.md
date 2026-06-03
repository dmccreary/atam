---
title: CAP Theorem Interactive Explorer
description: Students will be able to predict the behavior of CP and AP database systems under a network partition and select the appropriate consistency model given the quality attribute priorities of a specific scenario.
status: scaffold
library: p5.js
bloom_level: Apply (L3) — Use CAP theorem knowledge to select the appropriate consistency model for a given quality attribute scenario.
---

# CAP Theorem Interactive Explorer

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Students will be able to predict the behavior of CP and AP database systems under a network partition and select the appropriate consistency model given the quality attribute priorities of a specific scenario.

- **Bloom Level:** Apply (L3) — Use CAP theorem knowledge to select the appropriate consistency model for a given quality attribute scenario.
- **Bloom Verb:** Use
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 11: Distributed Systems Architecture Fundamentals](../../chapters/11-distributed-systems-fundamentals/index.md).

```text
Type: microsim
**sim-id:** cap-theorem-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive simulation of the CAP theorem trade-off, allowing students to experience the concrete consequences of CP vs AP choices during a simulated network partition event.

Bloom Level: Apply (L3) — Use CAP theorem knowledge to select the appropriate consistency model for a given quality attribute scenario.
Bloom Verb: Use

Learning Objective: Students will be able to predict the behavior of CP and AP database systems under a network partition and select the appropriate consistency model given the quality attribute priorities of a specific scenario.

Canvas layout:
- Top: System diagram showing two database replicas (Node A, Node B) connected by a network link
- Center left: Node A panel — showing current stored value and request queue
- Center right: Node B panel — showing current stored value and request queue
- Between nodes: Network link indicator (green=healthy, red=partitioned)
- Bottom: Request simulation — buttons to "Send Write to A", "Send Read from B", "Heal Partition", "Create Partition"
- Right panel: Current mode selector (CP / AP) and behavior explanation
- Bottom panel: Simulation log showing what happened to each request

Behavior in CP mode during partition:
- Writes to Node A: succeed (coordinator can still reach A)
- Reads from Node B: return error ("Consistency error: cannot guarantee up-to-date data during partition")
- This illustrates: CP sacrifices availability to maintain consistency

Behavior in AP mode during partition:
- Writes to Node A: succeed
- Reads from Node B: succeed but return potentially stale value (shows a badge: "Warning: This value may be X seconds stale")
- After partition heals: Node B automatically syncs with Node A (eventual consistency convergence animated)
- This illustrates: AP sacrifices consistency to maintain availability

Scenario presets:
- Financial ledger: "CP is required — customers must never see incorrect balances"
- Shopping cart: "AP is acceptable — showing a slightly stale cart is better than an error"
- User profile updates: "AP is acceptable with read-your-writes guarantee"

Interactive elements:
- Toggle between CP and AP mode using a prominent switch
- Create/Heal partition with buttons
- Send requests and observe the simulated response
- "Explain Current Behavior" button provides a context-sensitive explanation

Data Visibility Requirements:
- Always show the current stored value on each node
- When partition is active, show clearly whether values have diverged
- After healing in AP mode, animate convergence to show eventual consistency in action

Instructional Rationale: Active simulation of partition scenarios is appropriate for Apply because students must observe the concrete behavioral consequences of CP vs AP choices, not just understand the theorem abstractly.

Color scheme: Green for healthy network, Red for partitioned state. Blue for CP mode, Orange for AP mode. Amber for stale value warnings.

Responsive: Dual-node layout scales proportionally; stacks vertically on narrow screens.
```

## Related Resources

- [Chapter 11: Distributed Systems Architecture Fundamentals](../../chapters/11-distributed-systems-fundamentals/index.md)
