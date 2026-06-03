---
title: Distributed Systems Architecture Fundamentals
description: Core distributed systems concepts — service decomposition, API gateways, service mesh, event-driven messaging, distributed transactions, CAP theorem, eventual consistency, and distributed tracing — as the foundation for ATAM evaluation of modern systems.
generated_by: claude skill chapter-content-generator
date: 2026-06-03 01:50:00
version: 0.08
---

# Distributed Systems Architecture Fundamentals

## Summary

Most systems evaluated with ATAM today are distributed — microservices, event-driven platforms, or service-oriented architectures running across multiple hosts and networks. This chapter introduces the foundational concepts that make distributed systems architecturally distinct: how services are decomposed and discovered, how messages flow through gateways and meshes, how distributed transactions create tradeoffs between consistency and availability (the CAP theorem), and how distributed tracing makes complex call chains observable. These concepts are prerequisites for evaluating the quality attribute tradeoffs in the advanced distributed and cloud-native chapters that follow.

## Concepts Covered

This chapter covers the following 14 concepts from the learning graph:

1. Distributed System Architecture
2. Service Decomposition
3. API Gateway Pattern
4. Service Mesh Architecture
5. Event-Driven Messaging
6. Message Queue Architecture
7. Publish-Subscribe Pattern
8. Service Registry
9. Service Discovery
10. Distributed Transaction
11. CAP Theorem
12. Eventual Consistency
13. Two-Phase Commit
14. Distributed Tracing

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Software Architecture Foundations](../01-software-architecture-foundations/index.md)
- [Chapter 8: Architectural Patterns and Styles](../08-architectural-patterns-styles/index.md)
- [Chapter 10: Sensitivity, Tradeoffs, Risk Analysis, and ATAM Reporting](../10-risk-analysis-atam-reporting/index.md)

---

!!! mascot-welcome "Distributed Systems: Where ATAM Gets Really Interesting"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Vista waving welcome">
    Fellow architects, you are about to enter the territory where the most architecturally consequential decisions happen in modern systems — and where the most important ATAM scenarios live. Distributed systems multiply the complexity of every quality attribute: availability is not about one process, it's about dozens of services; performance is not about one database query, it's about a chain of network calls; consistency is not automatic, it's an explicit design decision with measurable tradeoffs. This chapter gives you the conceptual foundation to evaluate distributed systems with ATAM's full analytical power. Let's take the high-level view!

## What Makes a Distributed System Architecturally Distinctive?

A **distributed system** is a system in which components located on networked computers communicate and coordinate their actions by passing messages. The definition sounds simple, but it encodes a set of fundamental challenges that distinguish distributed systems from single-process systems:

- **Partial failure:** In a distributed system, some components can fail while others continue operating. This partial failure mode is absent in single-process systems (where process failure is all-or-nothing) and creates the central availability challenge: how do you design a system that degrades gracefully when some of its parts fail?
- **Concurrency:** Multiple processes run simultaneously and interact through shared resources or message passing, creating race conditions, ordering issues, and consistency challenges that do not exist in sequential single-process execution.
- **No global clock:** Different machines have different system clocks that drift over time and cannot be perfectly synchronized. This makes event ordering and causal reasoning fundamentally harder in distributed systems.
- **Network unreliability:** Messages between services can be delayed, duplicated, reordered, or lost. The network is not a reliable pipe, and any distributed system design that assumes it is will fail in production.

These properties create quality attribute challenges that ATAM evaluations of distributed systems must specifically address:

- Performance scenarios must account for network latency between services, not just in-process computation time
- Availability scenarios must consider partial failure modes where some services are up and others are down
- Consistency scenarios must explicitly address the tradeoffs between strong and eventual consistency
- Modifiability scenarios must consider the deployment coordination overhead of changing multiple services

## Service Decomposition: The First Distributed Design Decision

**Service decomposition** is the process of dividing a system's functionality into discrete, independently deployable services. This is the fundamental distributed systems design decision — it determines the granularity of the resulting architecture and the boundaries that govern how services interact.

Before we examine decomposition strategies, let us define the two decomposition dimensions that matter most for ATAM analysis:

- **Functional decomposition:** Division by business capability (order management, inventory, payment processing, user accounts) — this is the microservices ideal
- **Technical decomposition:** Division by technical concern (data access layer, business logic layer, presentation layer) — this is the layered architecture ideal

Good service decomposition produces services with the following properties, each directly affecting ATAM quality attribute scenarios:

- **High cohesion:** Each service is responsible for a single, well-defined business capability. Changes to one business area affect one service.
- **Low coupling:** Services interact through stable, versioned interfaces. A service's implementation can change without requiring changes to its consumers.
- **Independently deployable:** A service can be updated, scaled, and restarted without requiring coordination with other services.
- **Owning its data:** Each service owns its data store exclusively. No direct database-to-database access between services.

The last property — data ownership — is the most consequential for ATAM analysis. Services that share databases cannot be independently deployed or scaled, and their coupling makes modifiability scenarios difficult to achieve. But eliminating shared databases creates consistency challenges: if two services own separate data stores, maintaining consistency between them requires explicit coordination, which introduces distributed transaction complexity.

## The API Gateway Pattern

The **API Gateway pattern** places a single entry point between external clients and the internal services of a distributed system. The API gateway handles cross-cutting concerns — authentication, rate limiting, routing, protocol translation, request aggregation — on behalf of all services behind it.

From an ATAM quality attribute perspective:

**Primarily supports:**
- **Security:** Authentication and authorization can be enforced once at the gateway rather than duplicated in every service
- **Performance:** Request aggregation reduces the number of round trips clients must make; the gateway can fan out to multiple services and aggregate responses
- **Modifiability:** Internal service topology can change without affecting external clients, as long as the gateway's API surface remains stable

**Primarily threatens:**
- **Availability:** The API gateway is a potential single point of failure; if it is unavailable, all external access is blocked
- **Performance (paradoxically):** Adding a gateway adds a network hop; if the gateway is a bottleneck, it degrades all downstream performance

**ATAM sensitivity point:** The API gateway's availability configuration — whether it is deployed as a cluster, what its failover behavior is, and whether its circuit breaker is correctly configured — is a sensitivity point for every external availability scenario.

## Service Mesh Architecture

The **service mesh** is a dedicated infrastructure layer for handling service-to-service communication within a distributed system. A service mesh consists of a data plane (lightweight proxies, called sidecars, deployed alongside each service) and a control plane (centralized configuration and observability management).

Unlike the API gateway (which handles external traffic), a service mesh handles internal traffic between services. It provides: mutual TLS (mTLS) for service-to-service encryption, circuit breakers and retries at the infrastructure layer (without requiring application code changes), distributed tracing and observability, and traffic management (load balancing, canary routing, traffic shifting).

**Quality attribute implications:**
- **Security (strong):** mTLS ensures that all service-to-service communication is encrypted and mutually authenticated, eliminating a large class of network-based attacks
- **Availability (strong):** Infrastructure-level circuit breakers and retries are applied consistently without relying on application teams to implement them correctly
- **Observability (strong):** The sidecar proxy captures all inter-service communication, providing automatic distributed tracing and metrics without application code instrumentation
- **Performance (cost):** Every request passes through two sidecar proxies (one on each side), adding latency — typically 1-5ms per hop but potentially significant for high-frequency internal calls

**ATAM evaluation implication:** When a service mesh is present, the evaluation team should assess whether its resilience features (circuit breakers, retries, timeouts) are correctly configured for the (H,H) availability scenarios, and whether the per-hop latency overhead has been accounted for in the performance scenarios.

## Event-Driven Messaging: Queues and Publish-Subscribe

**Event-driven messaging** decouples producers and consumers through an intermediary message broker. Two primary messaging patterns serve distinct architectural needs:

A **message queue** provides point-to-point communication: a producer sends a message to a named queue, and exactly one consumer reads it. Message queues decouple producers from consumers in time (the consumer need not be running when the producer sends) and in space (producer and consumer do not know each other's addresses). They are ideal for work distribution, command processing, and task queuing.

The **publish-subscribe (pub/sub) pattern** provides one-to-many communication: a producer publishes an event to a topic, and multiple subscribers each receive their own copy. Pub/sub enables fan-out — one event triggering reactions in multiple services — without the producer needing to know its consumers. It is ideal for domain event propagation, system integration, and real-time data pipelines.

The quality attribute tradeoffs of event-driven messaging were introduced in Chapter 8. Two specific ATAM implications deserve emphasis here:

**Availability:** Message queues and pub/sub brokers (Kafka, RabbitMQ, Amazon SQS/SNS) provide durability — messages persist until consumed, so temporary consumer unavailability does not lose messages. This is a powerful availability tactic for scenarios involving consumer outages.

**Consistency:** Asynchronous messaging introduces **eventual consistency** — the state visible to a consumer lags behind the state the producer recorded. For scenarios requiring strong consistency (a financial transaction must be reflected in all systems simultaneously), asynchronous messaging requires additional coordination.

!!! mascot-thinking "Messaging Brokers Are Not Free"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Vista thinking">
    A common misconception in distributed systems design: adding a message broker solves availability problems by decoupling producers and consumers. This is true — but the broker itself introduces new availability and performance concerns. If the broker is unavailable, messages cannot be delivered. If the broker becomes a throughput bottleneck, message delivery lag increases, worsening eventual consistency. In ATAM evaluations, the message broker should appear in availability scenarios not just as a solution but as a component with its own failure modes and performance characteristics. The broker is never just infrastructure; it's a critical path component.

## Service Discovery and the Service Registry

In a static architecture, services communicate with hardcoded addresses. In a dynamic distributed system — where services scale up and down, restart on new hosts, and migrate between environments — addresses change constantly. **Service discovery** is the mechanism by which services locate each other dynamically.

Two service discovery patterns address this need:

**Client-side discovery:** Each service client queries a **service registry** — a directory of available service instances with their current addresses and health status — and selects an instance directly. Client-side discovery gives clients full control over load balancing and routing algorithms but requires each client to implement discovery logic.

**Server-side discovery:** The client makes a request to a load balancer or API gateway, which queries the service registry and routes to an available instance. This approach simplifies clients at the cost of adding a routing intermediary.

The **service registry** (implemented by Consul, Kubernetes Services DNS, or Netflix Eureka) is the authoritative record of which service instances are currently healthy and available. It is kept current through two mechanisms: **self-registration** (services announce themselves when they start and deregister when they stop) and **health checking** (the registry periodically probes each registered instance and removes unhealthy ones).

**ATAM sensitivity point:** The service registry's health check configuration — how frequently it checks, what it checks, and how quickly it removes unhealthy instances — is a sensitivity point for availability scenarios. A health check interval of 10 seconds means the system can route requests to a failing instance for up to 10 seconds before removing it from the registry.

#### Diagram: Distributed System Component Explorer

<iframe src="../../sims/distributed-system-explorer/main.html" width="100%" height="580px" scrolling="no"></iframe>

<details markdown="1">
<summary>Distributed System Component Explorer</summary>
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
</details>

## The CAP Theorem: The Fundamental Distributed Tradeoff

The **CAP theorem**, formulated by Eric Brewer in 2000 and formally proved by Gilbert and Lynch in 2002, states that a distributed data system can guarantee at most two of the following three properties simultaneously:

- **Consistency (C):** Every read receives the most recent write or an error. All nodes see the same data at the same time.
- **Availability (A):** Every request receives a response (not an error), though that response may not reflect the most recent write.
- **Partition Tolerance (P):** The system continues operating even when network partitions prevent some nodes from communicating.

The critical insight is that network partitions are not hypothetical — they happen in all production distributed systems. Therefore, partition tolerance is not optional; it is a requirement. The practical choice is between **CP systems** (sacrifice availability during partitions to maintain consistency) and **AP systems** (sacrifice consistency during partitions to maintain availability).

Let us make these choices concrete:

- A **CP database** (like HBase, MongoDB in strong consistency mode, Zookeeper) will return an error rather than stale data during a network partition. This is the right choice when correctness is critical and stale reads are worse than unavailability — financial ledgers, inventory systems, authorization servers.
- An **AP database** (like Cassandra, DynamoDB, CouchDB) will continue serving reads and writes during a partition, but different nodes may return different values until the partition heals. This is the right choice when availability is critical and temporary inconsistency is acceptable — shopping cart contents, user activity feeds, social media timelines.

**ATAM implication:** The CAP theorem makes consistency vs. availability a formal architectural tradeoff point. Any scenario that requires both strong consistency and high availability is making a claim that the CAP theorem says is impossible to fully satisfy under partition. The evaluation team must identify such scenarios explicitly and present the tradeoff to stakeholders for resolution.

## Eventual Consistency: The AP System's Promise

**Eventual consistency** is the consistency model of AP systems. It promises that, in the absence of new updates, all replicas will *eventually* converge to the same value — but it makes no guarantee about how quickly. During the convergence window, different nodes may return different values for the same key.

Eventual consistency is not a failure mode — it is a design decision. Many of the most scalable and available systems in the world (Amazon DynamoDB, Apache Cassandra, Amazon S3) operate on eventually consistent foundations because their use cases can tolerate temporary inconsistency in exchange for global scale and high availability.

The architectural challenge of eventual consistency is designing the application layer to handle the inconsistency window gracefully. Techniques include:

- **Read-your-own-writes:** After a write, subsequent reads from the same client are guaranteed to reflect that write (even if other clients may not yet see it)
- **Monotonic reads:** A client that has seen a value at time T will never see an older value in subsequent reads
- **Causal consistency:** If operation A causally precedes operation B (A's result influenced B), all processes will see A before B

**ATAM scenario:** An availability scenario that requires the system to continue serving during a partition AND a consistency scenario that requires all clients to see the same value simultaneously are in direct conflict — the CAP theorem guarantees they cannot both be fully satisfied. This is a structural tradeoff point that the evaluation team must document and present for stakeholder resolution.

## Distributed Transactions: Two-Phase Commit and Its Problems

When a business operation spans multiple services — each owning its own database — completing the operation requires updating multiple data stores atomically. A **distributed transaction** is a transaction that spans multiple, independent data stores and requires that either all updates commit or all roll back.

The traditional mechanism for distributed transactions is **Two-Phase Commit (2PC)**:

- **Phase 1 (Prepare):** A transaction coordinator sends a "prepare" message to all participants. Each participant prepares the update and responds "ready" or "abort."
- **Phase 2 (Commit or Abort):** If all participants responded "ready," the coordinator sends "commit" to all; otherwise, it sends "abort."

Two-phase commit provides strong consistency guarantees — either all participants commit or none do. But it has significant quality attribute costs:

- **Availability:** The entire transaction blocks if any participant becomes unavailable during Phase 2. If the coordinator fails after Phase 1 but before Phase 2, all participants remain in the "prepared" state indefinitely — a "blocking" failure mode.
- **Performance:** All participants must hold locks on their data resources for the duration of the protocol, increasing contention and latency.
- **Scalability:** Distributed locking across services limits concurrency and creates scalability bottlenecks.

These costs are significant enough that 2PC is rarely used in modern microservices architectures. The Saga pattern (covered in Chapter 12) provides an alternative that sacrifices immediate consistency for higher availability and performance.

## Distributed Tracing: Making the Invisible Visible

**Distributed tracing** is the observability technique for tracking a single request as it flows through multiple services in a distributed system. Without distributed tracing, debugging a latency issue or failure in a microservices system is like trying to solve a mystery without a timeline — you have logs from dozens of services with no way to connect them to a single causal chain.

A distributed trace is a collection of **spans** — discrete records of operations — connected by a **trace ID** that propagates through all services involved in a single request. Each span records:

- The service name and operation
- Start time and duration
- Success or failure status
- Parent span ID (linking it to the operation that invoked it)
- Key metadata (database queries executed, cache hits/misses, downstream service calls)

The resulting trace is a hierarchical timeline of everything that happened to fulfill a single request — which services were involved, how long each took, and where failures or slowdowns occurred.

**ATAM implication:** Distributed tracing is an observability tactic that addresses **testability** and **maintainability** scenarios. Any (H,H) scenario involving rapid diagnosis of production latency issues or failure attribution implicitly requires distributed tracing infrastructure. In evaluations, the absence of distributed tracing in a complex microservices system is a risk finding for observability and operational efficiency scenarios.

#### Diagram: CAP Theorem Interactive Explorer

<iframe src="../../sims/cap-theorem-explorer/main.html" width="100%" height="568px" scrolling="no"></iframe>

<details markdown="1">
<summary>CAP Theorem Interactive Explorer</summary>
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
</details>

#### Diagram: Distributed Tracing Visualization

<iframe src="../../sims/distributed-trace-viewer/main.html" width="100%" height="520px" scrolling="no"></iframe>

<details markdown="1">
<summary>Distributed Trace Viewer</summary>
Type: diagram
**sim-id:** distributed-trace-viewer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive Gantt-style waterfall diagram showing a distributed trace for a realistic request through a microservices system, with clickable spans revealing their details and latency contribution analysis.

Bloom Level: Analyze (L4) — Examine a distributed trace to identify the root cause of a latency issue, pinpointing which service and operation is the bottleneck.
Bloom Verb: Examine

Learning Objective: Students will be able to read a distributed trace waterfall diagram, identify the critical path spans contributing most to total latency, and diagnose the root cause of a latency issue from trace data.

Canvas layout:
- Horizontal Gantt-style waterfall
- Each span displayed as a horizontal bar, labeled with service name and operation
- Spans indented to show parent-child relationships (hierarchical call tree)
- Duration shown on each span
- Total trace duration shown at top
- A "critical path" highlight button outlines the longest sequential path in gold
- Detail panel on right showing span metadata when clicked

Example trace (checkout service request, total = 850ms):
- checkout-service: checkout.process [0ms - 850ms] — root span
  - auth-service: token.validate [5ms - 45ms, 40ms duration]
  - inventory-service: inventory.check [50ms - 180ms, 130ms duration]
    - database: SELECT inventory WHERE product_id=... [60ms - 170ms, 110ms duration]
  - pricing-service: price.calculate [185ms - 395ms, 210ms duration] ← SLOW
    - cache-service: cache.get [185ms - 200ms, 15ms duration] ← MISS
    - database: complex pricing query [200ms - 390ms, 190ms duration] ← ROOT CAUSE
  - payment-service: payment.authorize [400ms - 780ms, 380ms duration] ← SLOW
    - external-gateway: authorize.card [410ms - 770ms, 360ms duration] ← external latency
  - order-service: order.create [785ms - 840ms, 55ms duration]

Interactive elements:
- Click any span to see: service name, operation, start time, duration, tags (cache hit/miss, SQL query, HTTP status)
- "Show Critical Path" button highlights the sequential chain contributing most to total latency
- "Filter by Service" dropdown to focus on one service's spans
- "Compare Traces" mode allows loading a second trace for comparison (fast vs. slow version)
- Annotation markers showing anomalies: cache miss, slow query, external latency

Color scheme: Each service in a distinct color. Red highlight for spans exceeding their expected baseline. Gold for critical path.

Responsive: Trace scrolls horizontally; vertical height scales with span count.
</details>

!!! mascot-celebration "You Now Think in Distributed Systems!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Vista celebrating">
    Fellow architects, you just internalized the distributed systems mental model that separates ATAM practitioners who can evaluate enterprise-scale systems from those who can only evaluate single-process applications. You understand the partial failure challenge, the CAP theorem's fundamental tradeoff, the API gateway and service mesh as quality attribute tools, event-driven messaging's availability-consistency tension, and distributed tracing as the observability superpower. Every modern system you evaluate will involve these concepts — and now you have the vocabulary to analyze them with ATAM's full rigor. Onward to the advanced patterns chapter!

## Key Takeaways

Distributed systems introduce quality attribute challenges that ATAM evaluations must specifically address:

- **Partial failure** is the defining distributed systems challenge — some components fail while others continue, requiring explicit graceful degradation design
- **Service decomposition** decisions determine the granularity of quality attribute boundaries — high cohesion and low coupling are structural prerequisites for most quality attribute improvements
- **API gateways** centralize cross-cutting concerns (security, routing, throttling) but introduce single-point-of-failure and bottleneck risks
- **Service meshes** provide infrastructure-level resilience and security (mTLS, circuit breakers) without application code changes, at the cost of per-hop latency overhead
- **Event-driven messaging** (queues, pub/sub) improves availability through temporal decoupling but introduces eventual consistency
- **Service discovery** and service registries enable dynamic routing but their health check configuration is a sensitivity point for availability scenarios
- **CAP theorem** proves that consistency, availability, and partition tolerance cannot all be simultaneously guaranteed — the choice between CP and AP is an explicit ATAM tradeoff point
- **Eventual consistency** is the AP system's promise: all replicas converge eventually; the application must tolerate the inconsistency window
- **Two-phase commit** provides strong consistency for distributed transactions but degrades availability and performance — largely replaced by Saga patterns in modern microservices
- **Distributed tracing** makes complex call chains observable; its absence is a risk finding for observability and operational efficiency scenarios

??? question "Self-Check: Distributed Systems Fundamentals — Click to Reveal Answers"
    **Q1:** An e-commerce system has a (H,H) availability scenario ("the shopping cart must continue working when the inventory service is unavailable") and a (H,H) consistency scenario ("the cart must never show items with zero available inventory"). Explain why these two scenarios may create a CAP theorem tradeoff point.

    **Answer:** This is a classic CAP tradeoff. Continuing to show the cart when inventory is unavailable (availability scenario) requires serving data from a local cache or replica even when the authoritative inventory data cannot be reached. But serving cached inventory data risks showing items as available when inventory has actually reached zero (consistency scenario). During a network partition where the inventory service is unavailable, the system must choose: (1) fail the cart availability scenario by refusing to show the cart without authoritative inventory data (CP behavior), or (2) fail the consistency scenario by showing potentially stale inventory availability (AP behavior). Neither can be fully satisfied simultaneously during a partition. The ATAM finding is a tradeoff point requiring stakeholder resolution: under what conditions is showing a stale (but available) cart preferable to showing an error? The typical resolution in e-commerce is AP with compensating logic: accept the order optimistically and cancel with notification if inventory check fails at fulfillment time.

    ---

    **Q2:** A microservices architecture uses 2PC for financial transactions. An ATAM evaluation finds the (H,H) availability scenario: "The payment processing flow must complete within 30 seconds for 99.9% of transactions under peak load." What availability risk does 2PC create for this scenario?

    **Answer:** Two-Phase Commit creates a **blocking failure mode** that threatens the 30-second completion guarantee. If the coordinator or any participant becomes unavailable after Phase 1 (all participants prepared) but before Phase 2 (commit/abort confirmed), all participants remain in the prepared state — holding locks on their data — until the coordinator recovers. Under peak load, the probability of a coordinator failure during a 2PC transaction is non-trivial, and recovery can take minutes. Additionally, participants hold locks for the duration of the protocol, creating contention under concurrent peak load that can cause the 30-second threshold to be breached even when no failure occurs. The mitigation recommendation is to replace 2PC with a Saga pattern using choreography or orchestration, which achieves eventual consistency without distributed locking.

    ---

    **Q3:** An operations team reports that they frequently cannot diagnose latency issues in their 15-service microservices architecture because "by the time we look at the logs, the problem is gone and the logs don't tell us which service was slow." Classify this as an ATAM result type and describe the architectural tactic that addresses it.

    **Answer:** This is an **architectural risk** for a testability/observability quality attribute scenario. If the system has a (H,H) scenario for operational diagnosability (e.g., "Latency degradation affecting >1% of users must be diagnosed to the root cause service within 15 minutes of detection"), the absence of distributed tracing creates a credible risk of failing that scenario — which the operations team has already observed empirically. The architectural tactic required is **distributed tracing**: instrumentation of all services to propagate trace IDs through all requests, capture spans for all operations, and export trace data to a trace aggregation system (Jaeger, Zipkin, AWS X-Ray). The sensitivity point is the trace sampling rate — 100% sampling enables complete diagnostics but may have performance overhead; 1% sampling is cheap but may miss infrequent issues.
