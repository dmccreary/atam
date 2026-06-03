---
title: Distributed Systems Patterns
description: Advanced distributed systems patterns — service contracts, API versioning, Saga transactions, sidecar and ambassador patterns, database-per-service, synchronous vs. asynchronous communication, and contract-first design.
generated_by: claude skill chapter-content-generator
date: 2026-06-03 02:10:00
version: 0.08
---

# Distributed Systems Patterns

## Summary

Building on the fundamentals of Chapter 11, this chapter covers the advanced patterns that architects use to manage complexity, compatibility, and data ownership in production distributed systems. Students examine how service contracts, API versioning, and backward compatibility govern how services evolve without breaking consumers; how the Saga pattern coordinates multi-service transactions without distributed locking; and how sidecar and ambassador patterns extend service capabilities through infrastructure rather than application code. The chapter also analyzes the database-per-service versus shared-database tradeoff and the synchronous/asynchronous communication dimension that runs through every distributed architecture decision.

## Concepts Covered

This chapter covers the following 15 concepts from the learning graph:

1. Saga Transaction Pattern
2. Service Contract
3. API Versioning
4. Backward Compatibility
5. Integration Patterns
6. Sidecar Pattern
7. Ambassador Pattern
8. Database per Service Pattern
9. Shared Database Pattern
10. Synchronous vs Async Comm
11. gRPC vs REST Comparison
12. Idempotency in Services
13. Schema Registry
14. Message Transformation
15. Contract-First Design

## Prerequisites

This chapter builds on concepts from:

- [Chapter 8: Architectural Patterns and Styles](../08-architectural-patterns-styles/index.md)
- [Chapter 9: Architectural Tactics and Design Principles](../09-architectural-tactics-principles/index.md)
- [Chapter 11: Distributed Systems Architecture Fundamentals](../11-distributed-systems-fundamentals/index.md)

---

!!! mascot-welcome "Advanced Patterns: The Distributed Architect's Playbook"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Vista waving welcome">
    Fellow architects, Chapter 11 gave you the theory — this chapter gives you the plays. The patterns here are the ones you'll encounter in every mature distributed system, and understanding their quality attribute tradeoffs is essential for ATAM evaluation. How does a Saga handle distributed transactions without locking? What does contract-first design do for modifiability? How does database-per-service affect consistency scenarios? These are the questions this chapter answers. Let's build your distributed systems playbook!

## Service Contracts: The Architecture's Promises

A **service contract** is the formal specification of what a service provides and what it requires — the promises a service makes to its consumers and the promises it expects in return. Service contracts are the architectural mechanism that enables independent evolution of services.

Before we examine individual contract patterns, let us define the contract components precisely:

- **API interface:** The operations the service exposes (for REST: URLs, HTTP methods, request/response schemas; for gRPC: Protocol Buffer service definitions; for events: event schema definitions)
- **Quality attributes of the interface:** Response time guarantees, availability commitments, error rate limits
- **Consumer requirements:** What the service needs from its dependencies (expressed as its own service contracts with downstream services)

Well-defined service contracts serve modifiability in three specific ways. First, they allow the service implementation to change without breaking consumers — as long as the contract is honored. Second, they enable consumer-driven testing — consumers can validate that a service still honors its contract through automated contract tests. Third, they make the blast radius of a change explicit — any change that modifies the contract affects all consumers; any change that stays within the implementation boundary affects none.

## API Versioning and Backward Compatibility

**API versioning** is the practice of managing changes to a service contract over time — specifically, how to introduce new versions of a contract without forcing all consumers to upgrade simultaneously. Versioning strategy is one of the most consequential modifiability decisions in distributed systems.

Two fundamental concepts govern versioning:

- **Backward compatibility:** A new version of the API can be used by clients written for the old version without modification. Old clients continue to work correctly.
- **Forward compatibility:** An old version of the API can process messages sent by clients written for a new version. Old servers can process new client requests.

In practice, most versioning strategies aim for backward compatibility (because you control the server and can update it before clients) while also striving for forward compatibility (because you cannot always update all clients simultaneously).

Common versioning approaches and their modifiability implications:

**URL-based versioning (`/api/v1/`, `/api/v2/`):** Different versions are entirely separate API surfaces. Simple to understand, but requires maintaining multiple API implementations simultaneously — high modifiability cost over time.

**Header-based versioning:** Version is specified in a request header. Cleaner URLs but requires all clients to handle versioning headers — more complex client implementation.

**Content negotiation:** Version is specified through content type headers (Accept: application/vnd.company.v2+json). Most RESTful but requires sophisticated routing and content negotiation.

**Semantic versioning with additive changes only:** New fields added, deprecated fields maintained — never remove or rename. This is the most modifiability-friendly approach for schema evolution.

**ATAM implication:** API versioning strategy is a sensitivity point for modifiability scenarios. A strategy that requires all consumers to upgrade simultaneously before a service can deploy a new version is a modifiability risk — it creates coordination dependencies that inflate the cost and risk of each change.

## Contract-First Design

**Contract-first design** inverts the typical development sequence: instead of building the service implementation and deriving the API from it, you define the API contract first and then implement the service to fulfill it. The contract becomes the specification that both the server-side implementation and all client-side consumers are built against.

Tools that support contract-first design:

- **OpenAPI (Swagger):** Define REST API contracts in YAML/JSON before writing any code; generate server stubs and client SDKs from the contract
- **Protocol Buffers (.proto files):** Define gRPC service interfaces before implementing them; generate client and server code for any supported language
- **AsyncAPI:** Define event-driven API contracts (publish/subscribe message schemas) before implementing producers or consumers
- **Consumer-Driven Contract Testing (CDCT):** Consumers define the subset of the contract they use; the server runs consumer contract tests on every build to verify it still honors consumer requirements

Contract-first design strengthens modifiability by forcing the interface definition to be treated as a first-class architectural artifact, separate from implementation. It also enables parallel development — the server team and client teams can work simultaneously once the contract is agreed upon.

**ATAM quality attribute:**  Contract-first design is primarily a modifiability and interoperability tactic. It is a non-risk confirmation in evaluations where it is present for high-priority modifiability scenarios, and a risk factor when absent in systems with complex multi-consumer APIs.

## The Saga Pattern: Distributed Transactions Without Locking

The **Saga pattern** is the primary modern alternative to Two-Phase Commit for coordinating multi-service transactions. A Saga is a sequence of local transactions — one per participating service — where each transaction publishes an event or message that triggers the next transaction in the sequence. If any step fails, the Saga executes compensating transactions to undo the completed steps.

Before examining the two Saga coordination styles, let us understand the key concept of a **compensating transaction** — an operation that semantically undoes a previously completed transaction. If Service A reserves inventory (transaction), the compensating transaction is Service A releasing that reservation. Compensating transactions do not literally roll back (the data has changed); they produce a new operation that returns the system to a semantically equivalent state.

**Choreography-based Saga:** Each service publishes events when its local transaction completes and subscribes to events from other services. No central coordinator — each service knows its role and reacts to events.

- Supports: Availability (no central coordinator is a single point of failure), Scalability (no coordinator bottleneck), Modifiability (services are decoupled)
- Threatens: Debuggability (the workflow is implicit in event subscriptions, making it hard to trace), Testability (testing the full workflow requires running all services)

**Orchestration-based Saga:** A central orchestrator (Saga Execution Coordinator) sends commands to each service and awaits completion events. The workflow is explicit in the orchestrator's code.

- Supports: Debuggability (the workflow is explicit), Testability (the orchestrator can be tested independently), Understandability
- Threatens: Availability (the orchestrator is a single point of failure for the Saga), Coupling (services must know how to respond to the orchestrator's commands)

**ATAM evaluation:** Saga patterns are specifically relevant to consistency scenarios in microservices architectures. The evaluation team should ask: for each multi-service operation, is there a Saga in place? Is the compensation logic tested? What happens if a compensation fails? The ability to compensate reliably is often a sensitivity point for data consistency scenarios.

!!! mascot-thinking "The Compensating Transaction Challenge"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Vista thinking">
    Here is a practical challenge with Saga compensation that surprises many architects: compensation is not always semantically reversible. If a Saga step sends an email notification, you cannot "un-send" the email. If a Saga step charges a credit card, you must issue a refund (a new transaction), not a true rollback. This means Saga compensation requires careful business logic design — not just technical rollback. In ATAM evaluations, the question to ask is not just "does this Saga have compensation?" but "has the compensation logic been designed for all failure modes, including those where compensation itself may fail?" Compensation failure leaves the system in a partially completed state that requires manual intervention — a significant operational risk.

#### Diagram: Saga Pattern Flow Simulator

<iframe src="../../sims/saga-flow-simulator/main.html" width="100%" height="580px" scrolling="no"></iframe>

<details markdown="1">
<summary>Saga Transaction Pattern Flow Simulator</summary>
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
</details>

## Sidecar and Ambassador Patterns

Two infrastructure patterns from the cloud-native ecosystem extend service capabilities without modifying service code, representing important modifiability tactics in distributed systems.

**The Sidecar pattern** deploys a helper container or process alongside the primary service container. The sidecar shares the same host (or pod in Kubernetes) as the primary service, giving it access to the same network and filesystem. The sidecar handles infrastructure concerns — logging, metrics collection, distributed tracing, service mesh proxy — that are cross-cutting across all services but should not pollute application code.

The sidecar's key quality attribute contribution is **modifiability through separation**: infrastructure concerns are separated from application concerns, allowing each to evolve independently. Upgrading the logging sidecar does not require redeploying the application. Changing the service mesh proxy implementation does not require application code changes.

**The Ambassador pattern** is a specific form of sidecar where the helper process acts as an outbound proxy for the primary service. The ambassador handles concerns related to making outbound calls: connection pooling, retry logic, circuit breaking, service discovery. From the service's perspective, it makes a simple local call; the ambassador handles the distributed systems complexity of that call.

**ATAM implication:** Both patterns are modifiability and availability tactics. When present, they reduce the blast radius of cross-cutting concern changes and enforce resilience policies consistently. Their absence means each service must independently implement these concerns — increasing variability, inconsistency, and the blast radius of changes to cross-cutting logic.

## Database per Service vs. Shared Database

One of the most consequential design decisions in microservices architecture is whether each service owns its own database (database-per-service) or whether services share databases (shared database).

**Database per Service** is the microservices ideal:

- **Supports:** Modifiability (schema changes to one service's database don't affect others), Deployability (each service can deploy independently), Technology heterogeneity (each service can choose the database type best suited to its data)
- **Threatens:** Consistency (cross-service data consistency requires distributed coordination — Sagas or eventual consistency), Queryability (business queries that span multiple services' data require API composition or read-side projections)

**Shared Database** is the operationally simpler alternative:

- **Supports:** Consistency (ACID transactions span all services sharing the database), Queryability (SQL queries can join across service boundaries)
- **Threatens:** Modifiability (schema changes affect all services sharing the database — the blast radius of any schema change is the entire set of sharing services), Deployability (services sharing a database cannot deploy independently if a schema migration is required), Scalability (the shared database is a bottleneck)

The critical insight for ATAM evaluation: **shared databases are coupling in disguise.** A microservices architecture where services share a database is structurally a monolith with a microservices facade. The services cannot be independently deployed or scaled if they share database resources, and every schema migration requires coordinating all service teams — which is exactly the coordination overhead microservices are supposed to eliminate.

**ATAM finding pattern:** When an ATAM evaluation finds shared databases in a microservices architecture, this is an **architectural risk** for both modifiability and deployability scenarios, and potentially a **sensitivity point** for the consistency scenario (depending on whether the sharing is providing ACID consistency that would be lost with separation).

## Idempotency: Making Services Retry-Safe

**Idempotency** is the property of an operation where applying it multiple times produces the same result as applying it once. In distributed systems, idempotency is a critical correctness property because network failures and retries mean any operation may be executed multiple times.

Consider a payment processing service. If a client sends a "charge $100" request and the network drops the response, the client doesn't know if the charge succeeded. If it retries, and the service is not idempotent, the customer may be charged twice. An idempotent payment service uses an idempotency key (a unique ID per request provided by the client) to detect duplicate requests and return the same response as the original without re-executing the charge.

Idempotency is a sensitivity point for consistency scenarios involving write operations with retry logic. Any service that is retried under failure conditions must be idempotent or risk data corruption. In ATAM evaluations, the question to ask for each retry-able service call is: "Is this operation idempotent, and how is idempotency enforced?"

## Schema Registry and Message Transformation

In event-driven architectures, producers and consumers share event schemas — the structure and semantics of the messages they exchange. As services evolve, schemas change, creating compatibility challenges similar to API versioning.

A **schema registry** is a centralized catalog of event and message schemas, with version management and compatibility enforcement. When a producer publishes a message, it registers the schema in the registry; when a consumer processes a message, it validates the message against the registered schema. The registry can enforce compatibility rules: backward-compatible changes only (new optional fields, no removed fields) or specific compatibility modes.

**Message transformation** is the process of converting messages between different schema versions or formats — typically performed by a transformation service or within an API gateway. Message transformation enables services with incompatible schema versions to communicate through a translator.

**ATAM implication:** The absence of a schema registry in a large event-driven system is a risk finding for modifiability and reliability scenarios. Without schema validation, a schema change by one producer can silently break all consumers — which is a reliability risk. The schema registry enforces that compatibility is verified before deployment.

#### Diagram: API Versioning and Contract-First Design Patterns

<iframe src="../../sims/api-versioning-explorer/main.html" width="100%" height="540px" scrolling="no"></iframe>

<details markdown="1">
<summary>API Versioning and Contract-First Design Explorer</summary>
Type: diagram
**sim-id:** api-versioning-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive visualization comparing four API versioning strategies (URL-based, header-based, content negotiation, additive-only/semantic) across modifiability, complexity, and consumer migration dimensions, with a contract-first workflow illustration.

Bloom Level: Evaluate (L5) — Assess API versioning strategies to select the approach most appropriate for a given modifiability scenario and consumer ecosystem.
Bloom Verb: Assess

Learning Objective: Students will be able to compare API versioning strategies across dimensions of operational complexity, consumer migration burden, and modifiability cost, and select the most appropriate strategy for a given set of quality attribute priorities.

Canvas layout:
- Left panel: Versioning strategy cards (four strategies), each with: approach description, modifiability score (1-5), complexity score (1-5), consumer migration effort (1-5)
- Center: Scenario selector — student selects "system context" (public API with many external consumers, internal microservices, event streaming platform) and quality attribute priorities (performance, modifiability, simplicity)
- Right panel: "Best fit" recommendation with justification, and the specific tradeoffs the recommended strategy accepts

Strategy details:
1. URL Versioning (/v1/, /v2/): Modifiability=3, Complexity=2, Migration=3
   Pro: Simple, explicit; Con: Duplicate implementations, URL pollution
2. Header Versioning: Modifiability=4, Complexity=3, Migration=2
   Pro: Clean URLs; Con: Complex routing, client implementation overhead
3. Content Negotiation: Modifiability=4, Complexity=4, Migration=2
   Pro: Most REST-pure; Con: Complex content type handling
4. Additive-Only Semantic Versioning: Modifiability=5, Complexity=1, Migration=5
   Pro: No breaking changes, simplest; Con: Schema accumulates deprecated fields

Contract-first workflow diagram (lower panel):
- Step 1: Define OpenAPI/Protobuf contract (shown as a YAML file icon)
- Step 2: Generate server stubs and client SDKs (arrow to code icons)
- Step 3: Implement server (arrow to server box)
- Step 4: Consumer-driven contract tests run on every build (arrow to test runner icon)
- Step 5: Schema registry validates compatibility before deployment

Interactive elements:
- Click any strategy card for full pros/cons and when-to-use guidance
- Adjust scenario and priorities to see recommendation change
- Hover contract-first workflow steps to see implementation tools

Color scheme: Blue for strategy cards, Gold for recommendation panel, Teal for contract-first workflow.

Responsive: Strategy cards stack vertically on narrow screens.
</details>

## Synchronous vs. Asynchronous Communication: The Architectural Dimension

The choice between synchronous and asynchronous communication between services runs through every distributed systems pattern and every ATAM scenario in this domain. Before we close this chapter, let us make this dimension explicit.

**Synchronous communication** (REST, gRPC, direct service call) means the caller blocks and waits for a response before continuing. The caller and callee are temporally coupled — if the callee is slow, the caller is slow; if the callee is unavailable, the caller fails.

**Asynchronous communication** (event-driven messaging, message queues, pub/sub) means the caller sends a message and continues without waiting. The caller and callee are temporally decoupled — the callee can process the message at any time; the caller does not wait for it.

The quality attribute implications of this choice are the most fundamental tradeoff in distributed architecture:

| Dimension | Synchronous | Asynchronous |
|-----------|-------------|--------------|
| Performance (latency) | Lower for single request | Higher for single request (broker overhead) |
| Availability | Caller fails if callee is unavailable | Caller continues; callee can process when available |
| Consistency | Easy to implement strong consistency | Requires explicit eventual consistency design |
| Debuggability | Request-response traces are linear | Event chains require distributed tracing |
| Error handling | Errors propagate in the call return | Errors require dead letter queues and monitoring |
| Transaction support | Natural ACID within a synchronous call | Requires Saga pattern for multi-step transactions |

**ATAM evaluation principle:** There is no universally correct choice. The right communication style depends entirely on the quality attribute priorities established in the utility tree. A system where availability and scalability scenarios are (H,H) and consistency scenarios are (H,M) or (M,H) should favor asynchronous communication. A system where strong consistency is (H,H) and latency is (H,H) with synchronous SLA requirements favors synchronous communication with careful circuit breaker and retry design.

!!! mascot-tip "Async Is Not a Silver Bullet"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Vista giving a tip">
    Vista's pro tip for distributed architecture evaluation: asynchronous communication is not automatically "better." It trades one set of problems for another. Synchronous communication is easier to reason about, easier to debug, and naturally provides request-response semantics that many business operations require. Asynchronous communication provides better availability and scalability but requires explicit handling of message ordering, duplicate delivery, dead letter queues, and eventual consistency. In ATAM evaluations, the communication style should match the quality attribute scenario priorities — not default to "async because it's modern."

!!! mascot-warning "The Shared Database Trap in Microservices"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Vista warning">
    A warning Vista cannot state emphatically enough: a microservices architecture where services share databases is not a microservices architecture — it is a distributed monolith with all of microservices' operational complexity and none of its modifiability benefits. Vista has seen many teams adopt microservices for deployability and modifiability gains, only to undermine both by keeping the shared database "temporarily" (for three years). In every ATAM evaluation of a microservices system, checking data ownership is mandatory. If services share databases, flag it as an architectural risk for both modifiability and deployability scenarios. The "temporary" shared database is rarely temporary.

!!! mascot-celebration "Your Distributed Systems Pattern Library Is Complete!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Vista celebrating">
    Outstanding, fellow architects! You now have the complete distributed systems pattern playbook for ATAM evaluation. You can evaluate service contracts and API versioning for modifiability scenarios. You can assess Saga patterns for distributed transaction scenarios. You can identify database ownership violations as risks to modifiability and deployability scenarios. You can recognize when the synchronous/asynchronous choice is creating quality attribute conflicts. And you know the idempotency and schema registry requirements that make these systems reliable at scale. That is the full distributed systems evaluation superpower. Onward to cloud-native architecture!

## Key Takeaways

Advanced distributed systems patterns each carry specific quality attribute tradeoffs critical for ATAM analysis:

- **Service contracts** are the architectural promises that enable independent service evolution; **contract-first design** elevates them to a formal design input
- **API versioning** determines the modifiability cost of API changes; strategies range from maintaining multiple versions (high operational cost) to additive-only changes (simplest)
- **Backward compatibility** means new servers serve old clients; its absence forces synchronized upgrades — a modifiability risk
- **Saga pattern** (choreography or orchestration) coordinates multi-service transactions without distributed locking; compensation logic must handle partial failures
- **Sidecar pattern** separates infrastructure concerns from application code, enabling independent evolution of cross-cutting concerns
- **Database per service** enables independent deployment and schema evolution; **shared database** undermines modifiability and deployability despite providing consistency
- **Synchronous communication** is simpler and supports strong consistency; **asynchronous** provides availability and scalability at the cost of eventual consistency complexity
- **Idempotency** makes services retry-safe; its absence creates data corruption risk in any system with retry logic
- **Schema registry** enforces event schema compatibility, preventing silent consumer breakage from producer schema changes
- The synchronous vs. asynchronous choice should be driven by utility tree quality attribute priorities, not architectural fashion

??? question "Self-Check: Distributed Systems Patterns — Click to Reveal Answers"
    **Q1:** A microservices order management system uses choreography-based Sagas for order placement. The Saga involves inventory reservation, payment processing, and shipping confirmation. The ATAM utility tree has a (H,H) consistency scenario: "A customer must never be double-charged for a single order, even if the system receives duplicate requests." What specific pattern addresses this scenario, and where must it be applied?

    **Answer:** The scenario requires **idempotency** on the payment processing step of the Saga. Specifically: the payment service must accept an **idempotency key** (typically the order ID or a client-generated UUID per request) and use it to detect and deduplicate requests. If the same idempotency key is received a second time, the service must return the same response as the original without re-executing the payment. This must be applied at: (1) the payment service's charge operation (the operation that calls the payment gateway), with the idempotency key stored in the service's database and checked before each charge attempt; and (2) the Saga's compensation logic — if compensation is triggered after a payment was already processed, the compensation (refund) must also be idempotent. Without idempotency at the payment step, network retries or Saga retry logic could charge the customer multiple times — a violation of the (H,H) consistency scenario.

    ---

    **Q2:** A development team argues that their microservices architecture can use a shared PostgreSQL database "because we need ACID transactions across services." How would you respond as an ATAM evaluator, and what alternatives would you recommend?

    **Answer:** This is a classic **architectural risk finding** for modifiability and deployability scenarios. The team's consistency concern is valid, but the solution (shared database) creates architectural debt that will compound over time. As an ATAM evaluator: (1) Acknowledge that ACID consistency is a real requirement that the Saga pattern handles with eventual consistency rather than true atomicity — a genuine quality attribute tradeoff that stakeholders must acknowledge. (2) Document the shared database as an architectural risk for modifiability and deployability: every schema change must be coordinated across all sharing services; independent deployment is not achievable with a shared schema; the shared database becomes a coupling bottleneck. (3) Recommend alternatives: if the services are so tightly coupled by their data that they must share a database, perhaps they should be a single service (the microservices decomposition is premature). If they genuinely can be separate, evaluate Saga-based eventual consistency for the transaction, or use "shared database, separate schemas" as a transitional step toward full separation.

    ---

    **Q3:** An event-driven system has no schema registry. The platform team maintains event schemas in documentation wikis. An ATAM evaluation identifies a (H,H) modifiability scenario: "New event consumers can be added within one sprint without requiring changes to existing producers or consumers." What risk does the absence of a schema registry create for this scenario?

    **Answer:** Without a schema registry, there is no automated mechanism to detect schema compatibility violations before deployment. A producer team can unknowingly remove a field that existing consumers depend on, rename a field that breaks consumer deserialization, or change a field's type — and the consumers will fail silently (or loudly) at runtime. The risk: the one-sprint deployment target for new consumers cannot be achieved reliably because new consumer development may be delayed or broken by unexpected schema changes that were not communicated through documentation. The documentation wiki is a human process, not a technical enforcement mechanism. The mitigation is a schema registry (Confluent Schema Registry, AWS Glue Schema Registry) with compatibility mode enforcement — preventing producers from deploying schema changes that break registered consumers, and automatically generating consumer code from registered schemas to eliminate manual schema tracking.
