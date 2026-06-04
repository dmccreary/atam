# Quiz: Architectural Patterns and Styles

Test your understanding of architectural patterns, their quality attribute tradeoffs, communication styles, and Architecture Decision Records. Each question is followed by a collapsed answer block.

## Questions

### Question 1

**[Remember]** What is the key difference between an **architectural pattern** and an **architectural tactic**?

A. Patterns are documented; tactics are informal and undocumented  
B. Patterns describe structural arrangements of components; tactics are specific mechanisms that directly affect a quality attribute response — patterns are composed of tactics  
C. Patterns are used in large enterprises; tactics are used in small teams  
D. Patterns are about security; tactics are about performance  

??? note "Answer"
    The correct answer is **B**. An **architectural pattern** is a named, reusable structural solution to a recurring design problem — it operates at the level of overall system organization (microservices, layered, event-driven). An **architectural tactic** is a specific mechanism that directly affects a quality attribute response (active redundancy, connection pooling, circuit breaker). Patterns are *composed of* multiple tactics: a microservices pattern employs availability tactics (health checks, circuit breakers), performance tactics (caching, async processing), and modifiability tactics (bounded context encapsulation) simultaneously. Tactics are the building blocks; patterns are the composed structures.

---

### Question 2

**[Remember]** Which architectural pattern is the **Strangler Fig** most closely associated with, and what problem does it primarily solve?

A. Event sourcing — storing the history of state changes as an immutable log  
B. Incremental migration of a legacy system to a modern architecture without a "big bang" rewrite  
C. Separating read and write models to independently optimize query and command performance  
D. Organizing a system around bounded domain contexts that own their data independently  

??? note "Answer"
    The correct answer is **B**. The **Strangler Fig pattern** is a migration strategy inspired by the strangler fig vine that grows around a host tree until the host dies. It wraps a legacy system with a new façade, gradually routes functionality from the legacy implementation to new implementations, and retires the legacy system when all functionality has been migrated. Its primary value is risk management: it avoids the "big bang rewrite" risk where all functionality is replaced simultaneously. Instead, each piece of functionality is migrated and validated independently before the legacy system is retired in that area.

---

### Question 3

**[Remember]** Which of the following correctly describes the primary quality attribute strength of **event-driven architecture (EDA)**?

A. Strong performance through reduced network latency  
B. Strong consistency through synchronous state updates  
C. Strong availability and scalability through producer/consumer decoupling  
D. Strong modifiability through centralized event orchestration  

??? note "Answer"
    The correct answer is **C**. EDA's defining property is the decoupling of producers and consumers through an event stream. This decoupling produces two primary quality attribute benefits: **availability** (a consumer that is temporarily unavailable does not affect producers — the event remains in the stream until the consumer recovers) and **scalability** (events can fan out to multiple consumers in parallel, and consumers can scale independently based on their specific load). The primary threats EDA introduces are consistency (eventual consistency through asynchrony) and debuggability (tracing a transaction through events is harder than tracing a synchronous call chain).

---

### Question 4

**[Remember]** An **Architecture Decision Record (ADR)** contains which of the following fields?

A. Author, date, effort estimate, and code review checklist  
B. Title, status, context, decision, and consequences  
C. Requirements traceability, test plan, and deployment instructions  
D. Risk score, probability, impact, and mitigation budget  

??? note "Answer"
    The correct answer is **B**. The standard ADR format (popularized by Michael Nygard) includes: **Title** (a short, imperative phrase: "Use gRPC for service-to-service communication"); **Status** (Proposed, Accepted, Deprecated, Superseded); **Context** (the forces that motivated the decision — business drivers, quality attribute requirements, technical constraints); **Decision** (the specific choice made); and **Consequences** (expected outcomes, both positive quality attributes supported and negative quality attributes threatened or new risks introduced). ADRs are intentionally brief (1-2 pages) and focused on a single decision.

---

### Question 5

**[Understand]** Explain the **microservices availability trap** described in the chapter. Include the specific mathematical mechanism that makes a microservices system potentially less available than its individual components.

??? note "Answer"
    The microservices availability trap arises from **synchronous dependency chaining**. If multiple microservices are chained synchronously (each request must call the next in sequence), the combined availability of the chain is the *product* of the individual services' availabilities — not the average. The chapter's example: five services each at 99.9% availability chained synchronously produce 0.999⁵ = 99.5% combined availability — a full four hours of downtime per year, even though each individual service has only 52 minutes of downtime per year. The microservices architecture multiplied the failure probability fivefold. This is counterintuitive because organizations adopt microservices expecting improved reliability, but synchronous coupling between services creates a hidden availability debt. The fix — asynchronous communication, circuit breakers, and graceful degradation — only addresses the problem if the availability scenario is explicitly identified as (H,H) and analyzed in the evaluation.

---

### Question 6

**[Understand]** Compare **REST** and **gRPC** as communication styles across at least three quality attribute dimensions. Under what architectural context should each be preferred?

??? note "Answer"
    **Performance:** gRPC uses binary Protocol Buffer serialization over HTTP/2 — typically 5-10× more efficient than REST's JSON/HTTP/1.1. REST's textual format and HTTP overhead make it slower for high-frequency internal calls. **Interoperability:** REST's universal HTTP support means virtually any client (browser, mobile, legacy system) can consume a REST API. gRPC requires a gRPC client library; browser clients need a gRPC-Web proxy layer. **Debuggability:** REST responses are human-readable JSON easily inspected with curl or browser dev tools. gRPC binary format requires tooling to decode. **Schema enforcement:** gRPC Protocol Buffers enforce a typed schema with versioning built in; REST APIs rely on external documentation (OpenAPI/Swagger) for schema definition. **Preferred contexts:** REST is preferred for external APIs exposed to heterogeneous clients (public APIs, browser-facing services) where broad compatibility and simplicity matter more than performance. gRPC is preferred for internal service-to-service communication in polyglot microservices environments where performance is critical, strong typing is valued, and all consumers can use the gRPC library.

---

### Question 7

**[Understand]** How do **CQRS** and **Event Sourcing** differ as patterns, and what quality attributes does each primarily address? When are they typically used together?

??? note "Answer"
    **CQRS (Command Query Responsibility Segregation)** separates the models used for writing state (commands) from the models used for reading state (queries). Read models can be independently optimized for specific query patterns and scaled independently of write operations. CQRS primarily addresses **performance** (read models optimized for query patterns) and **scalability** (read and write sides scale independently). It primarily threatens **consistency** (read models are eventually consistent with write models) and adds **complexity**. **Event Sourcing** stores the complete history of state changes as an immutable event log; current state is derived by replaying events. It primarily addresses **auditability** (complete history available), **modifiability** (new projections can be built from existing event history), and **reliability** (events are durable). It primarily threatens **performance** (replaying events to reconstruct state is expensive without snapshots) and adds **complexity**. They are often used together because CQRS's read models are natural projections of an event-sourced write model: the event log feeds into multiple read-model projections, each optimized for a specific query pattern. The combination is powerful for audit-intensive, query-diverse systems (financial services, healthcare records) but imposes significant operational and cognitive complexity.

---

### Question 8

**[Understand]** What role do ADRs play in ATAM evaluations, both as **inputs** to an evaluation and as **outputs** from one?

??? note "Answer"
    As **inputs to an evaluation**: ADRs provide the architectural rationale that the evaluation team needs to assess whether existing decisions were well-reasoned. A decision documented with an ADR — including the context that motivated it, the alternatives considered, and the consequences anticipated — allows the evaluation team to ask: "Has the context changed enough that this decision should be revisited? Is the architecture still achieving the quality attribute consequences the ADR anticipated?" Without ADRs, the evaluation team must reverse-engineer rationale from code and conversation, which is slower and error-prone. As **outputs from an evaluation**: ATAM findings become the source of new or superseding ADRs. Every architectural change recommended by an ATAM evaluation — a new tactic, a revised pattern, a changed communication style — should be documented as a new ADR or as a supersession of an existing ADR. This creates a traceable record of how the architecture evolved in response to evaluation findings, ensuring future evaluations can see the context of each decision.

---

### Question 9

**[Apply]** An e-commerce company currently uses a **layered monolithic architecture**. They are considering migrating to microservices. Their utility tree has three (H,H) scenarios: (1) the ability to deploy new product catalog features independently from checkout, (2) handle 10× load spikes during promotional events without manual intervention, and (3) maintain 99.9% checkout availability even when the recommendation service fails. Evaluate how microservices addresses each (H,H) scenario and identify the risks introduced.

??? note "Answer"
    **Scenario 1 — Independent deployment:** Microservices directly addresses this. Each service (product catalog, checkout) has an independent deployment pipeline; a product catalog feature can be deployed without touching or redeploying the checkout service. The risk: this independence is only achieved if the services have well-defined interfaces and no shared database — if they share a database or have implicit behavioral dependencies, "independent deployment" may trigger hidden failures.

    **Scenario 2 — 10× load spikes:** Microservices addresses this through independent horizontal scaling. During a promotional spike, only the product catalog and checkout services need to scale, not the entire monolith. The risk: if scaling requires coordinating multiple services (e.g., the session service, authentication service, and payment service must also scale), the 10× target requires auto-scaling infrastructure (Kubernetes HPA, AWS Auto Scaling) to be correctly configured for each service — operational complexity that is significant.

    **Scenario 3 — 99.9% checkout availability despite recommendation failure:** Microservices introduces a risk here, not a benefit. If the checkout flow calls the recommendation service synchronously, a recommendation service failure degrades or fails checkout — the opposite of the scenario requirement. The microservices approach requires explicit design: the recommendation call must be asynchronous or have a circuit breaker that short-circuits immediately when the recommendation service is unavailable, returning an empty recommendation rather than blocking checkout. Without this explicit design, microservices *increases* the risk to this scenario.

---

### Question 10

**[Apply]** A team is building a real-time financial trading dashboard that must display live market prices updated every 100ms. They are choosing between REST (polling) and WebSocket. Using the communication style comparison from the chapter, justify which style is appropriate and identify the ATAM quality attribute concerns the chosen style introduces.

??? note "Answer"
    **WebSocket** is the correct choice for this use case. The requirement — live price updates every 100ms — is a real-time, bidirectional, high-frequency communication pattern. REST polling at 100ms intervals would require 10 HTTP requests per second per client — each with full HTTP header overhead, connection setup costs, and server-side request handling. At scale (1,000 concurrent users = 10,000 requests/second), this creates significant unnecessary server load and latency overhead. WebSocket's persistent, full-duplex connection allows the server to push price updates to clients without per-message connection overhead, achieving lower latency at lower resource cost. **Quality attribute concerns introduced by WebSocket:** (1) **Scalability** — WebSocket connections are stateful; a load balancer must use sticky sessions (always routing a client to the same server) or all servers must share connection state via a pub-sub broker (e.g., Redis). Sticky sessions reduce load balancing effectiveness and create server failure blast radius. (2) **Availability** — WebSocket connection loss (server restart, network interruption) requires explicit client-side reconnection logic with backoff; users will see brief data gaps during reconnections. (3) **Operational complexity** — WebSocket connections are long-lived and must be monitored differently from stateless HTTP connections; connection leak detection and cleanup requires specific infrastructure tooling.

---

### Question 11

**[Apply]** Write an Architecture Decision Record (ADR) for the following decision: your team has decided to use **bounded contexts** from Domain-Driven Design to organize the microservices for an e-commerce platform, separating Order Management, Inventory, and Customer domains into independent services with their own data stores.

??? note "Answer"
    **ADR-012: Use DDD Bounded Contexts to Organize E-Commerce Domain Microservices**

    **Status:** Accepted

    **Context:** The e-commerce platform has grown to 15 microservices, many of which share a "customer" or "product" concept but implement it slightly differently. Service-to-service calls are increasing as teams try to share domain logic, creating tight coupling, deployment coordination requirements, and inconsistent data models. The utility tree's top (H,H) scenarios require: (1) independent deployability of Order Management changes without affecting Inventory or Customer services, and (2) modifiability to add new business capabilities within one sprint cycle. The current shared-model approach is making both scenarios progressively harder as the system grows.

    **Decision:** Organize microservices into three bounded contexts — Order Management, Inventory, and Customer — each with an explicit, published anti-corruption layer for cross-context communication. Each bounded context owns its data store exclusively (no direct cross-context database access). Cross-context communication occurs via defined API contracts or async events. The "customer" concept in Order Management (billing address, payment method) is explicitly modeled separately from the "customer" in Customer (profile, preferences, history) with a context mapping document defining the translation.

    **Consequences:** Positive — each bounded context can evolve its domain model independently without cross-context coordination; blast radius of domain model changes is bounded; independent deployability of each context is now structurally enforced. Negative — cross-context queries that previously joined tables directly now require API calls or materialized read models; eventual consistency between contexts for shared concepts (e.g., customer address updated in Customer context must propagate to Order Management for billing); higher initial complexity in setting up context mapping and anti-corruption layers.

---

### Question 12

**[Analyze]** The chapter states that "understanding a pattern's tactics is the key to understanding its quality attribute implications." Analyze the **event-driven architecture** pattern by decomposing it into at least four specific tactics and examining how each tactic produces the pattern's quality attribute profile.

??? note "Answer"
    Event-driven architecture produces its characteristic quality attribute profile through several specific tactics working together: (1) **Asynchronous messaging tactic** — producers send events to a persistent message broker (Kafka, RabbitMQ, AWS SQS) without waiting for consumer acknowledgment. This is the foundational tactic that produces EDA's availability benefit: consumers can be temporarily unavailable without blocking producers, because events persist in the broker until consumed. This same tactic produces EDA's consistency threat: because messages propagate asynchronously, consumers have a temporal lag before they see new events, creating a window where different parts of the system have different views of state. (2) **Event persistence tactic** — events are stored durably in the broker, not just transmitted and discarded. This produces EDA's modifiability benefit (new consumers can subscribe to historical events and replay them to build state) and its reliability benefit (events are not lost if a consumer crashes). It also enables event sourcing when applied at the application level. (3) **Publish-subscribe tactic** — producers publish to topics without knowing who will consume; consumers subscribe to topics without knowing who published. This produces EDA's scalability benefit: new consumer instances can be added transparently to handle increased load, and new consumer types can be added to process events for new business purposes without modifying producers. It produces the debuggability threat: there is no explicit, traceable call chain connecting producer to consumer — distributed tracing infrastructure must be added to reconstruct the logical flow of a business transaction across events. (4) **Event schema versioning tactic** — events carry version identifiers, and consumers handle multiple schema versions. This produces EDA's modifiability benefit: event producers can evolve their schema while consumers migrate gradually, avoiding the coordinated deployment requirement of synchronous RPC changes. Without this tactic, the modifiability benefit is significantly reduced: any event schema change requires simultaneous coordinated update of all consumers.

