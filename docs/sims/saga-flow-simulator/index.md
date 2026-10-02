---
title: Saga Pattern Flow Simulator
description: Step through a choreography-based saga for placing an order across Order, Inventory, Payment, and Shipping services, inject a failure at any step, and trace the compensating transactions that run in reverse order.
image: /sims/saga-flow-simulator/saga-flow-simulator.png
og:image: /sims/saga-flow-simulator/saga-flow-simulator.png
twitter:image: /sims/saga-flow-simulator/saga-flow-simulator.png
social:
   cards: false
quality_score: 0
---

# Saga Pattern Flow Simulator

<iframe src="main.html" height="502" width="100%" scrolling="no"></iframe>

[Run the Saga Pattern Flow Simulator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim steps through a **choreography-based saga**: an e-commerce order that spans four services, each with its own database. There is no central coordinator and no distributed lock. Each service runs one **local transaction** (T1 to T5), commits it, and publishes an event; the next service reacts to that event. The sim shows every service's status (Pending, Processing, Committed, Failed, Compensating, Compensated), the data it currently holds, and the payload of the event that was just published.

Press **Inject Failure** while a service is processing and its local transaction aborts. The services that already committed must then run **compensating transactions** (C3 refund the charge, C2 release the stock, C1 reject the order) in reverse order, each triggered by the previous service's event. A compensation is a new transaction that semantically undoes an earlier one; it is not a rollback, which is why a refunded charge still appears in the payment history. Between steps the system is visibly in an intermediate state (stock reserved but not yet paid for), which is the isolation that a saga gives up in exchange for availability.

In an **orchestration-based** saga the same transactions and compensations would run, but a central orchestrator would send a command to each service and decide what to do next, instead of the services reacting to each other's events. Order numbers, amounts, and IDs are illustrative.

## How to Use

1. Press **Next Step** to run one local transaction at a time. Watch the active service's status change and read the event payload on the right.
2. After step 1, 2, or 3 a service is shown as **PROCESSING**. Press **Inject Failure** to make that service's transaction fail instead of commit.
3. Keep pressing **Next Step** to run each compensating transaction. Red arrows above the services carry the failure and compensation events.
4. Read the **Log** line to see the order in which transactions and compensations ran, and the saga badge for the overall outcome.
5. Press **Reset** and fail a different step. Compare how many compensations each failure point requires.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/saga-flow-simulator/main.html"
        height="502"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Graduate / Professional

### Duration
15-20 minutes

### Prerequisites
Local ACID transactions, event-driven messaging (publish/subscribe), and why Two-Phase Commit is avoided across microservices.

### Bloom's Taxonomy Level
Apply (L3)

### Learning Objective
Students will be able to trace the flow of a Saga transaction through its service steps, identify which compensating transactions are required for each step, and determine what system state results from a partial failure at each point in the Saga.

### Activities

1. **Happy path** (4 min): Students step through all five transactions and, after each step, state what an outside observer could see (for example, stock reserved but card not yet charged).
2. **Predict, then fail** (8 min): For each of the three failure points, students first write the list of compensations they expect, in order, then inject the failure and check their list against the Log line.
3. **Compensation is not rollback** (4 min): Students explain why the payment step ends as "Refunded $59.98" rather than "No charge", and name one saga step that could not be compensated at all (for example, an email already sent).
4. **Choreography vs. orchestration** (4 min): Students redraw the payment-failure path with a central orchestrator and list one quality attribute each style supports and one it threatens.

### Assessment
Ask students to add a fifth participant, a Loyalty Service that awards points after payment, and to write its forward transaction, its compensating transaction, and the events it must publish and subscribe to. Then ask what happens if the compensation itself fails.

## References

1. Garcia-Molina, H., & Salem, K. (1987). Sagas. *Proceedings of the 1987 ACM SIGMOD International Conference on Management of Data*, 249-259.
2. Richardson, C. (2018). *Microservices Patterns*. Manning. (Chapter 4: Managing transactions with sagas.)
3. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
