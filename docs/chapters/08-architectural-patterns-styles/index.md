---
title: Architectural Patterns and Styles
description: Foundational architectural patterns — layered, microservices, event-driven, DDD, REST, gRPC, and more — examined through the lens of the quality attributes each pattern primarily supports or threatens.
generated_by: claude skill chapter-content-generator
date: 2026-06-03 00:50:00
version: 0.08
---

# Architectural Patterns and Styles

## Summary

Architectural patterns are reusable structural solutions to recurring design problems, and understanding their quality attribute tradeoffs is essential to ATAM analysis. This chapter surveys the major patterns and styles — from classical layered and client-server architectures through microservices, event-driven, CQRS, Strangler Fig, event sourcing, DDD with bounded contexts, and modern communication styles (REST, gRPC, GraphQL, WebSocket) — and analyzes each through the lens of the quality attributes it strengthens and the new risks it introduces. Architecture Decision Records are introduced as the documentation practice that preserves pattern selection rationale.

## Concepts Covered

This chapter covers the following 22 concepts from the learning graph:

1. Architectural Pattern
2. Architectural Tactic
3. Layered Architecture Pattern
4. Client-Server Architecture
5. Service-Oriented Architecture
6. Microservices Architecture
7. Event-Driven Architecture
8. Pipe-and-Filter Architecture
9. Broker Architecture Pattern
10. MVC Architecture Pattern
11. CQRS Pattern
12. Strangler Fig Pattern
13. Event Sourcing Pattern
14. Domain-Driven Design
15. Bounded Context
16. Hexagonal Architecture
17. Clean Architecture Pattern
18. REST Architecture Style
19. gRPC Communication Pattern
20. GraphQL Architecture
21. WebSocket Architecture
22. Architecture Decision Record

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Software Architecture Foundations](../01-software-architecture-foundations/index.md)
- [Chapter 5: Quality Attributes](../05-quality-attributes/index.md)

---

!!! mascot-welcome "Patterns: The Building Blocks of Your Superpower"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Vista waving welcome">
    Fellow architects, from up here I can see something that every junior architect eventually discovers: the best architects don't design from scratch — they compose from patterns. Patterns are architectural vocabulary that carries embedded quality attribute knowledge. When you say "event-driven architecture," every experienced architect in the room immediately knows what quality attributes you are optimizing for and what tradeoffs you are accepting. This chapter gives you that vocabulary. More importantly, it teaches you to evaluate patterns through an ATAM lens — seeing not just what a pattern provides, but what it costs. Let's weigh the tradeoffs!

## Patterns vs. Tactics: Two Levels of Architectural Decision

Before diving into the pattern catalog, we need a precise distinction between two related concepts: **architectural patterns** and **architectural tactics**.

An **architectural pattern** is a named, reusable structural solution to a recurring architectural design problem. Patterns operate at the level of the overall system organization — they describe how major components are arranged and how they communicate. Microservices, layered architecture, event-driven architecture, and CQRS are all patterns.

An **architectural tactic** is a design decision that directly affects a quality attribute response — a specific mechanism used to achieve or improve a quality attribute. Tactics operate at a finer granularity than patterns. "Active redundancy" (keeping a hot standby ready to take over immediately) is an availability tactic. "Connection pooling" is a performance tactic. "Façade" (exposing a simplified interface to hide internal complexity) is a modifiability tactic.

The relationship between patterns and tactics is hierarchical: patterns are composed of multiple tactics. A microservices pattern typically employs multiple availability tactics (health checks, circuit breakers, retry logic), multiple performance tactics (caching, asynchronous processing), and multiple modifiability tactics (independent deployment, bounded context encapsulation). Understanding a pattern's tactics is the key to understanding its quality attribute implications — which is exactly what an ATAM evaluation needs.

## Classical Patterns: The Foundation

### Layered Architecture

The **layered architecture pattern** (also called n-tier or multi-tier architecture) organizes components into horizontal layers, where each layer provides services to the layer above and consumes services from the layer below. The canonical three-layer decomposition separates Presentation, Business Logic, and Data Access. More refined decompositions add Service, Application, and Infrastructure layers.

**Quality attributes primarily supported:**

- **Modifiability (strong):** Changes to one layer are encapsulated within that layer's boundaries; the layer above depends only on the layer's interface, not its implementation
- **Testability (strong):** Each layer can be tested independently by stubbing the layers it depends on
- **Portability:** The presentation layer can be replaced (web to mobile, for example) without touching business logic

**Quality attributes threatened:**

- **Performance (weak):** Every request must traverse multiple layer boundaries, each adding a small latency cost; deep layering amplifies this overhead
- **Scalability:** Layers are typically deployed together, preventing independent scaling of components with different load profiles

**ATAM evaluation implication:** When an architecture uses layered structure, performance and scalability scenarios deserve special scrutiny — particularly if high-throughput or elastic scaling are quality attribute priorities.

### Client-Server Architecture

The **client-server pattern** divides a system into two logical components: clients (which request services) and servers (which provide them). The simplest distributed architecture, client-server underpins web applications, desktop applications with backend services, and mobile applications with cloud APIs.

**Quality attributes primarily supported:**

- **Availability:** Server-side services can be upgraded or replaced without client changes
- **Security:** Security controls can be centralized on the server, rather than relying on client-side enforcement

**Quality attributes threatened:**

- **Availability (paradoxically):** If the server is a single instance, it is also a single point of failure
- **Scalability:** Simple client-server models assume a single server; scaling requires additional patterns (load balancing, horizontal scaling)

### Service-Oriented Architecture (SOA)

**Service-Oriented Architecture (SOA)** organizes a system as a collection of services that communicate through standardized interfaces, typically orchestrated by an Enterprise Service Bus (ESB). SOA was the dominant enterprise integration pattern of the 2000s.

**Quality attributes primarily supported:**

- **Interoperability (strong):** Standardized interfaces (SOAP/WSDL/XML) enable heterogeneous systems to communicate
- **Reusability:** Services designed for reuse can be composed into new business processes without new development

**Quality attributes threatened:**

- **Performance:** ESB orchestration and heavyweight XML serialization add significant latency
- **Modifiability:** Centralized ESBs become bottlenecks for change — modifying a service often requires ESB reconfiguration
- **Deployability:** Monolithic ESB deployments are difficult to update without system-wide impact

**Note:** Modern microservices architectures evolved from SOA's lessons — retaining the service decomposition principle while replacing the centralized ESB with decentralized, choreographed communication.

## Microservices Architecture

The **microservices architecture pattern** decomposes a system into a collection of small, independently deployable services, each owning its own data and communicating through lightweight protocols (typically REST APIs or asynchronous messaging).

Microservices is the most discussed and most misunderstood pattern in modern distributed systems. Its quality attribute profile is rich in both benefits and costs, which makes it an excellent subject for ATAM scenario analysis.

**Quality attributes primarily supported:**

- **Modifiability (strong):** Each service can be modified and redeployed independently; the blast radius of a change is bounded by the service's boundary
- **Scalability (strong):** Services can scale independently based on their specific load profiles
- **Deployability (strong):** Services can be deployed continuously with zero-downtime strategies
- **Technology heterogeneity:** Different services can use different technology stacks, allowing the right tool for each job

**Quality attributes threatened:**

- **Performance:** Service-to-service network calls are orders of magnitude slower than in-process function calls; microservices architectures that naively convert in-process calls to network calls can dramatically increase latency
- **Availability:** Each service-to-service dependency is a potential failure point; a deep synchronous call chain creates a system whose availability is the product of all constituent services' availabilities
- **Operational complexity:** Managing dozens or hundreds of independent deployments, their configuration, their networking, and their observability is a significant operational burden

**ATAM evaluation implication:** Microservices architectures require thorough performance and availability scenario analysis. Synchronous call chains are a red flag for latency and availability cascades. Scenarios probing failure modes of external dependencies and peak-load behavior of the combined system are essential.

!!! mascot-thinking "The Microservices Availability Trap"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Vista thinking">
    Here's an availability math problem that surprises many architects: if five microservices are each 99.9% available and a request requires calling all five synchronously, the combined availability is 0.999⁵ = 99.5% — a full four hours of downtime per year, even though each individual service has only 52 minutes of downtime per year. The microservices architecture multiplied the failure probability five-fold. This is one of the most important ATAM tradeoff points to surface in a microservices evaluation: synchronous dependency chains can systematically undermine overall availability, regardless of individual service SLAs. The fix is asynchronous communication, circuit breakers, and graceful degradation — but only if the availability scenario is prioritized (H,H) and analyzed explicitly.

## Event-Driven Architecture

The **event-driven architecture (EDA)** pattern organizes components as producers and consumers of events — discrete, immutable records of things that happened. Producers emit events without knowing who will consume them; consumers react to events without needing to know who produced them. This decoupling is EDA's defining property.

**Quality attributes primarily supported:**

- **Availability (strong):** Producers and consumers are decoupled; a consumer that is temporarily unavailable does not affect producers
- **Scalability (strong):** Event streams can fan out to multiple consumers in parallel; consumers can scale independently
- **Modifiability:** New consumers can be added without modifying existing producers; event schema changes can be versioned

**Quality attributes threatened:**

- **Consistency:** Events propagate asynchronously, creating temporal windows where different parts of the system have different views of state (eventual consistency)
- **Debuggability:** Tracing a business transaction through a series of events is significantly harder than tracing a synchronous call chain
- **Latency:** For operations that require a response (the user is waiting for acknowledgment), asynchronous event processing may not satisfy the response latency scenario

### CQRS and Event Sourcing

Two patterns that frequently accompany event-driven architectures deserve separate attention.

**CQRS (Command Query Responsibility Segregation)** separates the models used for writing state (commands) from the models used for reading state (queries). This separation allows read and write operations to be independently optimized, scaled, and even deployed.

- **Primarily supports:** Performance (read models can be optimized for query patterns), Scalability (read and write sides scale independently)
- **Primarily threatens:** Consistency (read models are eventually consistent with write models), Complexity

**Event Sourcing** stores the history of state changes as an immutable event log, rather than storing the current state directly. The current state is derived by replaying events from the log.

- **Primarily supports:** Auditability (the complete history is available), Modifiability (new projections can be built from existing event history), Reliability (events are durable)
- **Primarily threatens:** Performance (replaying events to reconstruct state is expensive without snapshots), Complexity

#### Diagram: Architectural Pattern Quality Attribute Matrix

<iframe src="../../sims/pattern-quality-matrix/main.html" width="100%" height="580px" scrolling="no"></iframe>

<details markdown="1">
<summary>Architectural Pattern Quality Attribute Matrix</summary>
Type: diagram
**sim-id:** pattern-quality-matrix<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive matrix showing the quality attribute profile of major architectural patterns — which attributes each pattern primarily supports (green), threatens (red), or is neutral on (gray) — with click-to-explore cells revealing the specific tradeoff mechanism.

Bloom Level: Analyze (L4) — Compare architectural patterns across quality attribute dimensions to determine which pattern best fits a given set of prioritized quality attribute requirements.
Bloom Verb: Compare

Learning Objective: Students will be able to compare at least six architectural patterns across four quality attribute dimensions, identify the pattern most suitable for a given set of (H,H) quality attribute scenarios, and explain the tradeoff mechanism responsible for each pattern's strength or weakness.

Canvas layout:
- Grid: Patterns on rows (8 patterns), Quality Attributes on columns (8 attributes)
- Each cell: colored indicator (green=supports, red=threatens, gray=neutral, yellow=complex/depends)
- Clicking any cell opens a detail panel showing: the specific tradeoff mechanism, a realistic example, and what ATAM scenarios to watch for with this pattern+attribute combination
- Column header click: sorts patterns by that quality attribute (best-supporting at top)
- Row header click: shows full pattern summary and quality attribute profile

Patterns (rows):
1. Layered Architecture
2. Microservices
3. Event-Driven Architecture
4. CQRS
5. Strangler Fig
6. Hexagonal / Clean Architecture
7. Pipe-and-Filter
8. SOA (legacy reference)

Quality Attributes (columns):
Performance, Availability, Security, Modifiability, Scalability, Testability, Deployability, Interoperability

Cell values (sample):
Microservices / Modifiability: Green — "Independent deployment boundary limits blast radius"
Microservices / Performance: Red — "Service-to-service network calls add latency; synchronous chains compound it"
Event-Driven / Availability: Green — "Producer/consumer decoupling; consumer unavailability doesn't affect producers"
Event-Driven / Consistency: Yellow — "Eventual consistency: temporal window where state diverges"
Layered / Testability: Green — "Each layer testable in isolation by stubbing adjacent layers"
Layered / Performance: Yellow — "Layer traversal overhead; acceptable for moderate load, problematic for high-throughput"

Interactive elements:
- Click any cell to see mechanism detail
- Click column header to sort by that attribute
- "Compare Two Patterns" button lets student select two patterns and see a side-by-side profile
- Hover any cell for one-line summary tooltip

Color scheme: Green cells for "Primarily Supports", Red cells for "Primarily Threatens", Yellow cells for "Complex/Depends", Gray cells for Neutral. Header row and column in gold.

Responsive: Matrix scrolls horizontally on narrow screens; column headers stay fixed.
</details>

## Domain-Driven Design, Bounded Contexts, and Hexagonal Architecture

**Domain-Driven Design (DDD)**, introduced by Eric Evans in 2003, is an approach to software design that emphasizes modeling the problem domain accurately and using that domain model as the foundation for architectural decisions. DDD is not a pattern itself, but it produces two architectural patterns that are central to modern distributed systems.

A **bounded context** is a named, explicit boundary within which a particular domain model is consistent and valid. Different parts of a large system can use different models of the same business concept — "customer" means something different in the ordering system than in the analytics system — and bounded contexts make these differences explicit rather than hiding them behind a single global model that satisfies no one perfectly.

In ATAM terms, bounded contexts are primarily a **modifiability** tactic: by confining a domain model to a bounded context, changes to that model are isolated within the context's boundary. Cross-context changes are explicit (they require modifying the context's interface or the mapping between contexts), which makes the blast radius of domain model changes visible and manageable.

**Hexagonal architecture** (also called Ports and Adapters, or Clean Architecture) separates a system into three zones: the domain core (business logic and domain model), the application (use-case orchestration), and the infrastructure (external services, databases, UI). Communication between zones flows through defined interfaces (ports), and all dependencies point inward toward the domain core.

The quality attribute implications of hexagonal architecture are primarily about **testability** (the core can be tested without any infrastructure) and **portability** (the infrastructure can be swapped without touching the core). Clean Architecture, popularized by Robert Martin, applies similar principles and adds a clear mapping from use-case to interactor to entity.

## The Strangler Fig Pattern

The **Strangler Fig pattern** is a migration strategy for incrementally replacing a legacy system with a modern architecture. Inspired by the strangler fig vine that grows around a host tree until the host dies, the pattern wraps the legacy system with a new façade, gradually routes functionality from the legacy implementation to new implementations, and eventually retires the legacy system when all functionality has been migrated.

- **Primarily supports:** Modifiability (incremental migration avoids the "big bang" rewrite risk), Deployability (each migrated capability can be deployed independently), Risk management (the legacy system remains operational until each new component is validated)
- **Primarily threatens:** Performance (the routing layer adds latency), Complexity (maintaining two implementations of the same functionality simultaneously is operationally challenging)

**ATAM relevance:** When an evaluation team encounters a Strangler Fig migration in progress, performance and complexity scenarios become critical. The routing layer is a sensitivity point for latency; the dual-implementation period is a sensitivity point for consistency and operational burden.

## Communication Styles: REST, gRPC, GraphQL, WebSocket

The patterns surveyed above describe structural organization. Communication style is an orthogonal dimension — it describes how components communicate, independent of how they are organized. The four dominant communication styles in modern distributed systems each have distinct quality attribute profiles.

Two key terms to define before comparing them. **Synchronous communication** means the caller waits for a response before proceeding — it blocks while the remote operation executes. **Asynchronous communication** means the caller sends a message and continues without waiting — the response (if any) arrives separately.

**REST (Representational State Transfer)** is a stateless, resource-oriented communication style using standard HTTP methods (GET, POST, PUT, DELETE). REST is the default choice for web APIs due to its simplicity, tooling ecosystem, and wide adoption.

- **Supports:** Interoperability (universal HTTP support), Cachability (GET responses can be cached), Simplicity
- **Threatens:** Performance (verbose JSON/XML payloads, HTTP overhead for high-frequency calls), Discoverability (REST APIs require out-of-band documentation)

**gRPC** is a high-performance RPC framework using Protocol Buffers (binary serialization) over HTTP/2. gRPC is preferred for internal service-to-service communication where performance is critical.

- **Supports:** Performance (binary serialization is 5-10× more efficient than JSON), Streaming (bidirectional streaming enables real-time communication), Strong typing (Protocol Buffers enforce schema)
- **Threatens:** Interoperability (requires gRPC client support; browser clients need a proxy), Debuggability (binary format is not human-readable)

**GraphQL** is a query language for APIs that allows clients to request exactly the data they need, reducing over-fetching and under-fetching. GraphQL is particularly suited to frontends with complex data requirements.

- **Supports:** Performance (eliminates over-fetching), Usability (clients control data shape), Evolvability (fields can be added without breaking clients)
- **Threatens:** Performance (N+1 query problem if not addressed with DataLoader patterns), Security (flexible queries can be abused for resource exhaustion), Complexity

**WebSocket** provides a persistent, full-duplex communication channel over a single TCP connection. WebSocket is the standard for real-time, bidirectional communication (live dashboards, chat, collaborative editing).

- **Supports:** Performance for real-time use cases (no HTTP overhead per message), Latency (messages travel in both directions without request-response overhead)
- **Threatens:** Scalability (stateful connections require sticky load balancing or shared state), Availability (connection loss requires reconnection logic)

The following table summarizes the communication style comparison:

| Style | Best For | Performance | Interop | Complexity |
|-------|----------|------------|---------|-----------|
| REST | External APIs, CRUD operations | Medium | Very High | Low |
| gRPC | Internal service-to-service | Very High | Medium | Medium |
| GraphQL | Frontend with complex data needs | High (when tuned) | High | High |
| WebSocket | Real-time bidirectional communication | High for real-time | Medium | High |

#### Diagram: Communication Style Tradeoff Explorer

<iframe src="../../sims/communication-style-explorer/main.html" width="100%" height="540px" scrolling="no"></iframe>

<details markdown="1">
<summary>Communication Style Tradeoff Explorer</summary>
Type: microsim
**sim-id:** communication-style-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive simulator comparing the four communication styles (REST, gRPC, GraphQL, WebSocket) across five dimensions, with scenario-based matching that lets students select quality attribute requirements and see which style best fits.

Bloom Level: Evaluate (L5) — Assess which communication style best fits a set of quality attribute requirements and justify the selection with tradeoff analysis.
Bloom Verb: Assess

Learning Objective: Students will be able to select the most appropriate communication style for a given quality attribute scenario set, and explain the tradeoff implications of their choice using the five comparison dimensions.

Canvas layout:
- Left panel: Five quality attribute requirement sliders (Performance Priority, Interoperability Priority, Real-Time Requirement, Schema Enforcement, Simplicity Priority — each 1-5)
- Center: Radar chart showing how each of the four communication styles scores on these dimensions, with the student's "requirement" polygon overlaid
- Right panel: Recommendation panel showing best-fit style and gap analysis (where requirements exceed scores)
- Bottom: Scenario selector with three pre-built scenarios to load

Radar axes:
- Performance (internal throughput) — gRPC scores 5, REST scores 3, GraphQL 3, WebSocket 4
- Interoperability — REST scores 5, GraphQL 4, gRPC 2, WebSocket 2
- Real-Time Suitability — WebSocket scores 5, gRPC 4, REST 1, GraphQL 2
- Schema Enforcement — gRPC scores 5, GraphQL 4, REST 2, WebSocket 1
- Operational Simplicity — REST scores 5, gRPC 3, GraphQL 2, WebSocket 2

Pre-built scenarios:
1. Public API for e-commerce: high interoperability, moderate performance, no real-time → REST recommended
2. Microservices backbone for financial transactions: high performance, high schema enforcement, no real-time → gRPC recommended
3. Live collaborative document editor: high real-time, moderate performance, low interop → WebSocket recommended

Behavior:
- Moving sliders updates the requirement polygon on the radar in real-time
- Best-fit style is highlighted when requirement polygon most closely matches a style's polygon
- "Explain Choice" button reveals a text panel explaining why the selected style fits and what tradeoffs it accepts
- Clicking any style's polygon highlights it and shows its full tradeoff profile

Instructional Rationale: Slider-driven exploration is appropriate for the Evaluate objective because it forces students to externalize their quality attribute priorities before seeing recommendations, preventing anchoring on a familiar default choice.

Color scheme: Gold for REST polygon, Blue for gRPC, Green for GraphQL, Orange for WebSocket, Red dashed for student requirement polygon.

Responsive: Radar and panels scale to container width.
</details>

## Architecture Decision Records

Patterns are only valuable when their selection rationale is preserved. An architecture team that chose microservices three years ago but no longer remembers *why* cannot evaluate whether new requirements justify deviating from that choice — or abandoning it entirely. **Architecture Decision Records (ADRs)** are the documentation practice that captures the rationale behind significant architectural decisions, including pattern selections.

An ADR is a short, structured document (typically one to two pages) that records a single architectural decision. The standard ADR format, popularized by Michael Nygard, includes:

- **Title:** A short, imperative phrase describing the decision ("Use gRPC for service-to-service communication")
- **Status:** Proposed, Accepted, Deprecated, Superseded
- **Context:** The forces at play that motivated the decision — the business drivers, quality attribute requirements, and technical constraints that made this decision necessary
- **Decision:** The specific choice made, including the pattern, technology, or approach selected
- **Consequences:** The expected outcomes of the decision — both positive (quality attributes supported) and negative (quality attributes threatened or new risks introduced)

ADRs serve ATAM evaluations in two important ways. First, they provide the architectural rationale that the evaluation team needs to assess whether existing decisions were well-reasoned. A decision documented with an ADR is a decision the evaluation team can evaluate against the current utility tree — has the context changed enough that the original decision should be revisited? Second, ATAM evaluation findings become the source of new ADRs — every architectural change recommended by an ATAM evaluation should be documented as a new or superseding ADR, creating a traceable record of how the architecture evolved in response to evaluation findings.

!!! mascot-tip "Every (H,H) Scenario Needs an ADR"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Vista giving a tip">
    Vista's documentation principle: every architectural decision that affects a (H,H) scenario deserves an ADR. Why? Because (H,H) scenarios represent the highest-stakes tradeoffs in the system. If the business context changes and a (H,H) scenario changes in importance or difficulty, future architects need to understand what was decided, why, and under what assumptions — so they can judge whether the original decision still holds. An ATAM evaluation that finds a (H,H) scenario and recommends an architectural change but produces no ADR has done half the governance job. Document the decision.

#### Diagram: ADR to Architecture Evolution Pipeline

<iframe src="../../sims/adr-evolution-timeline/main.html" width="100%" height="588px" scrolling="no"></iframe>

<details markdown="1">
<summary>Architecture Decision Record Evolution Timeline</summary>
Type: timeline
**sim-id:** adr-evolution-timeline<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive timeline showing the evolution of a system's architectural decisions through a series of ADRs, from initial design through two ATAM evaluation cycles, demonstrating how ADRs capture the architectural decision history.

Bloom Level: Understand (L2) — Explain how Architecture Decision Records document the evolution of architectural decisions over time, and how ATAM evaluations generate new or superseding ADRs.
Bloom Verb: Explain

Learning Objective: Students will be able to trace an architectural decision through its ADR history, identify what triggered each revision, and explain the relationship between ATAM evaluation findings and ADR creation.

Canvas layout:
- Horizontal timeline with two tracks: ADR track (top) and system events track (bottom)
- ADR entries shown as labeled cards above the timeline, color-coded by status (green=Active, orange=Superseded, gray=Deprecated)
- System events shown as labeled markers below (requirements change, ATAM evaluation, production incident, business pivot)
- Connecting arrows between system events and the ADRs they triggered or updated
- Detail panel on the right showing full ADR content when an entry is clicked

Example timeline entries:

Year 1:
- Event: System design begins
- ADR-001: Use layered architecture (Active, accepted based on initial team size and MVP requirements)
- ADR-002: Use REST APIs for all external interfaces (Active)

Year 2:
- Event: Scale-out requirements emerge (10× growth)
- ADR-003: Migrate high-load services to microservices (Active, supersedes parts of ADR-001)
- ADR-001 status → Superseded (with link to ADR-003)
- Event: ATAM Evaluation #1 — identifies authentication service as (H,H) latency risk
- ADR-004: Add Redis caching layer to authentication service (Active, addresses ATAM finding)

Year 3:
- Event: Real-time dashboard feature required
- ADR-005: Add WebSocket for dashboard event streaming (Active)
- Event: ATAM Evaluation #2 — identifies WebSocket connection management as (M,H) scenario
- ADR-006: Implement sticky load balancer with health-check-aware session persistence (Active)

Interactive elements:
- Click any ADR card to see its full content (Context, Decision, Consequences)
- Click any system event marker to see what ADRs it triggered or modified
- Hover connecting arrows to see the relationship type ("triggered by", "supersedes", "addresses finding")
- "Show ADR-Only" button collapses system events track to show the ADR decision history alone

Color scheme: Green for Active ADRs, Orange for Superseded, Gray for Deprecated. Blue for system events, Gold for ATAM evaluation events.

Responsive: Timeline scrolls horizontally; panel stacks below on narrow screens.
</details>

!!! mascot-celebration "Your Pattern Vocabulary Is Now ATAM-Grade!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Vista celebrating">
    Outstanding work, fellow architects! You now have a full pattern vocabulary equipped with quality attribute analysis — which is precisely the lens an ATAM evaluator applies to every architectural decision. When you see microservices, you think: great for modifiability and deployability, watch availability carefully on synchronous chains. When you see event-driven, you think: excellent for availability and scalability, examine consistency scenarios closely. And when you see no ADRs documenting the pattern choices, you know you have a governance gap to flag. That analytical reflex is your ATAM superpower running at full power. Next: the tactics that implement quality attributes within these patterns.

## Key Takeaways

Architectural patterns encode quality attribute tradeoffs — understanding those tradeoffs is the foundation of ATAM's architectural approach analysis:

- An **architectural pattern** is a named structural solution to a recurring problem; an **architectural tactic** is a specific mechanism used to achieve a quality attribute response — patterns are composed of tactics
- **Layered architecture** primarily supports modifiability and testability; threatens performance under high load
- **Microservices** strongly supports modifiability, scalability, and deployability; threatens performance through network overhead and availability through synchronous dependency chains
- **Event-driven architecture** supports availability and scalability through decoupling; threatens consistency and debuggability through asynchrony
- **CQRS** optimizes read/write performance independently; introduces eventual consistency and operational complexity
- **Event Sourcing** provides complete audit history and flexible projections; challenges performance (replay cost) and operational complexity
- **Domain-Driven Design with Bounded Contexts** is a modifiability tactic that confines domain model changes within explicit context boundaries
- **Hexagonal/Clean Architecture** optimizes testability and portability by isolating the domain core from infrastructure
- **Strangler Fig** enables incremental migration with manageable risk; introduces routing complexity and performance overhead
- **Communication styles** (REST, gRPC, GraphQL, WebSocket) are orthogonal to organizational patterns and each has a distinct quality attribute profile
- **Architecture Decision Records** capture the rationale behind architectural decisions, enabling future evaluations to assess whether context has changed enough to revisit those decisions

??? question "Self-Check: Pattern Quality Attribute Analysis — Click to Reveal Answers"
    **Q1:** An architecture team proposes microservices for a new patient portal system. The ATAM utility tree has a (H,H) scenario: "When the EHR integration service is unavailable, the portal must continue serving appointment scheduling with cached provider data, recovering within 30 seconds of EHR restoration." What specific availability risk does microservices pose for this scenario, and what tactic would you recommend to address it?

    **Answer:** The availability risk is that a synchronous dependency on the EHR integration service in the appointment scheduling flow creates a failure cascade: when EHR is unavailable, any synchronous call to it will time out or fail, causing the appointment scheduling service to fail with it. The architecture must not assume EHR availability in the critical path of appointment scheduling. The recommended tactic is a combination of: (1) **circuit breaker pattern** — detect EHR unavailability and short-circuit calls after a threshold of failures, returning a degraded (cached) response instead of waiting for timeout; (2) **cache-aside pattern** — maintain a local cache of provider availability data, updated asynchronously from EHR, used as fallback when EHR is unavailable; (3) **async writes** — queue appointment requests locally when EHR is unavailable and reconcile when connectivity restores.

    ---

    **Q2:** A team is migrating from a monolithic architecture to microservices using the Strangler Fig pattern. An ATAM evaluation identifies a (H,M) performance scenario: "API response time for product search must remain under 800ms at P99 during the migration." What specific risk does the Strangler Fig pattern introduce for this scenario?

    **Answer:** The Strangler Fig routing layer — typically implemented as a reverse proxy or API gateway — adds a network hop and routing overhead to every request. During the migration period, some requests are routed to the legacy monolith and some to the new microservices, creating two different performance profiles that must both satisfy the 800ms threshold. The specific risks are: (1) the routing layer itself adds latency (typically small, 5-20ms, but non-zero); (2) the new microservices implementation of the product search feature may have different performance characteristics than the monolith (potentially better or worse); (3) during mixed-mode operation, cache warming, connection pooling, and request distribution are more complex, creating potential for intermittent latency spikes. The evaluation team should recommend load testing the routing layer independently and establishing a performance baseline for the new search microservice before cutting over production traffic.

    ---

    **Q3:** When would you recommend GraphQL over REST for a system's external API? What ATAM quality attribute concern should be explicitly addressed in the evaluation?

    **Answer:** GraphQL is preferable to REST when clients have highly variable data requirements — specifically when over-fetching (receiving far more data than needed) or under-fetching (requiring multiple round trips to assemble a view) is a significant performance concern, such as a rich frontend application with many different view types. The ATAM quality attribute concern that must be explicitly addressed is **security**: GraphQL's query flexibility is also an attack surface — a malicious or careless client can submit queries that trigger N+1 database lookups, deeply nested traversals, or resource-intensive computations. The evaluation should include a (H,M or H,H) security scenario: "A client submits a deeply nested or introspection-heavy GraphQL query; the system limits query complexity and execution time without affecting legitimate client requests." Architectural mitigations include query depth limiting, query complexity scoring, and persisted queries.
