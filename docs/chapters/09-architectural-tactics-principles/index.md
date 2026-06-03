---
title: Architectural Tactics and Design Principles
description: Quality attribute tactics catalog, performance and availability tactics, resilience patterns (circuit breaker, bulkhead, retry), and foundational design principles — coupling, cohesion, information hiding, encapsulation, and dependency injection.
generated_by: claude skill chapter-content-generator
date: 2026-06-03 01:10:00
version: 0.08
---

# Architectural Tactics and Design Principles

## Summary

While patterns describe overall structural forms, tactics are the fine-grained design decisions that directly push a single quality attribute in a desired direction. This chapter covers the quality attribute tactic catalog and the major tactic families — performance (caching, load balancing), availability (redundancy, replication, fault tolerance), security (see Chapter 14), and modifiability (dependency injection, plugin architecture). Students also learn the classic design principles — module coupling and cohesion, information hiding, encapsulation — that govern how well a tactic can be applied or reversed, and explore tactic interactions where applying one tactic undermines another quality attribute.

## Concepts Covered

This chapter covers the following 23 concepts from the learning graph:

1. Quality Attribute Tactic Catalog
2. Performance Tactic
3. Availability Tactic
4. Security Tactic
5. Modifiability Tactic
6. Caching Tactic
7. Load Balancing Tactic
8. Redundancy Tactic
9. Replication Tactic
10. Fault Tolerance Tactic
11. Circuit Breaker Pattern
12. Retry Pattern
13. Bulkhead Pattern
14. Tactic Interaction
15. Component Decomposition
16. Interface Definition
17. Module Coupling
18. Module Cohesion
19. Information Hiding Principle
20. Encapsulation in Architecture
21. Dependency Injection Pattern
22. Plugin Architecture Pattern
23. Interoperability Tactic

## Prerequisites

This chapter builds on concepts from:

- [Chapter 5: Quality Attributes](../05-quality-attributes/index.md)
- [Chapter 8: Architectural Patterns and Styles](../08-architectural-patterns-styles/index.md)

---

!!! mascot-welcome "Tactics: The Precision Instruments of Architecture"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Vista waving welcome">
    Fellow architects, patterns are your architectural vocabulary — tactics are your surgical instruments. Where a pattern says "use microservices," a tactic says "add a circuit breaker to this specific service dependency to protect this specific availability scenario." Tactics are how you *implement* the quality attribute requirements your utility tree identified. This chapter gives you the tactic catalog that every ATAM evaluator keeps close at hand — so when you analyze an architectural approach, you can identify exactly which tactics are present, which are missing, and what quality attribute gaps each gap creates. Let's weigh the tradeoffs!

## What Is a Quality Attribute Tactic?

Before diving into the catalog, let us establish a precise definition. A **quality attribute tactic** is a design decision that has a direct, known effect on a quality attribute response measure. The key word is *direct* — a tactic affects a quality attribute immediately, without relying on intermediary effects or emergent system behavior.

This definition distinguishes tactics from patterns in a useful way. A **pattern** is a structural arrangement of components that, as a whole, creates conditions favorable to certain quality attributes. A **tactic** is a specific mechanism within that structure that achieves a particular quality attribute outcome. Patterns are composed of tactics; tactics are the building blocks.

The **Quality Attribute Tactic Catalog** is the SEI's organized collection of known tactics for each major quality attribute. It is an invaluable reference for ATAM evaluators — when analyzing whether an architectural approach addresses a (H,H) scenario, the evaluator asks: which relevant tactics does this approach employ? Are those tactics sufficient to achieve the response measure? What tactics are missing?

The catalog is organized by quality attribute. For each quality attribute, tactics are grouped into sub-categories corresponding to the main mechanisms by which that quality attribute can be controlled. Before examining individual tactics, let us establish the foundational design principles that determine how effectively tactics can be applied.

## Foundational Design Principles

Tactics do not operate in a vacuum. Their effectiveness depends on the degree to which the system's structure supports their application. The foundational design principles — coupling, cohesion, information hiding, and encapsulation — determine the structural receptiveness of a system to tactical improvement.

### Module Coupling

**Module coupling** is the degree to which two modules depend on each other. High coupling means that a change to one module is likely to require a change to the other. Low coupling means that modules can evolve independently. Coupling is measured not just by the presence of a dependency, but by the nature of that dependency — content coupling (one module directly reads another's internal state) is worse than control coupling (one module passes parameters that control another's behavior) which is worse than data coupling (modules share only data through defined interfaces).

The architectural significance of coupling for ATAM is direct: high coupling degrades modifiability by increasing blast radius, degrades testability by making independent testing impossible, and degrades deployability by creating deployment dependencies. Every modifiability tactic is ultimately a mechanism for reducing or managing coupling.

### Module Cohesion

**Module cohesion** is the degree to which the elements within a module belong together logically. A module with high cohesion serves a single, well-defined purpose; a module with low cohesion is a grab-bag of unrelated functionality. Cohesion is the flip side of coupling: high cohesion tends to produce low coupling (a module that does one thing well has less reason to depend on other modules), while low cohesion tends to produce high coupling (a module that does many things must reach into many other modules to get what it needs).

Separation of concerns (from Chapter 2) is the structural expression of cohesion — it is the architectural practice of organizing modules so that each is highly cohesive. Highly cohesive modules are easier to change (changes are localized), easier to test (the module's behavior is well-defined), and easier to reason about.

### Information Hiding

The **information hiding principle**, articulated by David Parnas in 1972, states that a module should hide its design decisions from its clients, exposing only the minimal interface needed to accomplish the module's purpose. The "design decisions" Parnas had in mind were those most likely to change — the implementation details, data representations, and algorithms that a module uses internally.

Information hiding is the structural mechanism that makes modifiability tactics effective. If a module hides its data representation, it can change that representation without affecting any client. If a module hides its algorithm, it can replace the algorithm without breaking anything that depends on it. The SEI's modifiability tactics are largely tactics for improving information hiding — creating abstractions, defining stable interfaces, and confining design decisions within modules.

### Encapsulation

**Encapsulation in architecture** extends information hiding to the component level. An encapsulated component exposes a defined set of interfaces and prevents any external access to its internal state or logic. In distributed systems, encapsulation is achieved through API contracts (the only way to interact with a service is through its published API), event schemas (the only way to observe a service's state changes is through its published events), and data ownership (each service owns its data store exclusively — no direct database-to-database access).

!!! mascot-thinking "Coupling Is the Enemy of Every Tactic"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Vista thinking">
    Here is a unifying insight that connects all the design principles: high coupling makes every quality attribute tactic harder to apply. You cannot add a circuit breaker around a shared library. You cannot independently scale a module that shares a database with three other modules. You cannot test a component in isolation if it depends on five other live services. Tactics assume you have something to wrap — a clean interface, a defined boundary, an owned resource. When the architecture lacks those boundaries, tactics cannot take hold. In ATAM evaluations, discovering high coupling is often the root cause explanation for why multiple different (H,H) scenarios cannot be addressed with simple tactics.

## Performance Tactics

Performance tactics target two sub-goals: controlling demand (reducing the work the system must do) and managing resources (using available capacity more efficiently).

**Demand-side tactics:**

- **Manage event arrival:** Control the rate at which requests arrive at a component. Techniques include throttling (rejecting requests above a rate threshold), load shedding (dropping low-priority requests when overloaded), and priority queuing (processing high-priority requests before low-priority ones).
- **Manage sampling rate:** For scenarios involving monitoring or data collection, reduce sampling frequency to decrease processing load.
- **Bound execution time:** Set maximum execution time limits for operations; time out and fail-fast rather than blocking indefinitely.

**Resource-side tactics:**

- **Caching:** Store frequently accessed data in fast storage (memory, local disk) to avoid repeated expensive computations or remote calls. Caching is the most powerful and most dangerous performance tactic — it is powerful because it can reduce latency by orders of magnitude; dangerous because it introduces consistency risk (the cache may serve stale data) and complexity (cache invalidation is famously difficult).
- **Increase computational resources:** Add CPU, memory, or storage — the simplest but most expensive tactic.
- **Introduce concurrency:** Allow multiple requests to be processed simultaneously. Concurrency can be at the thread, process, or distributed level; each level has different overhead and contention characteristics.
- **Maintain multiple copies of computations:** Pre-compute results and store them for retrieval — a form of caching where the computation is done offline rather than on demand.
- **Schedule resources appropriately:** Assign priority to request processing based on importance, deadline, or SLA tier.

**Load balancing** is both a performance tactic and an availability tactic. As a performance tactic, it distributes requests across multiple instances to prevent any single instance from becoming a bottleneck. As an availability tactic, it routes around failed instances. Load balancing algorithms include round-robin (equal distribution), least connections (route to the least busy instance), and consistent hashing (route similar requests to the same instance for cache efficiency).

#### Diagram: Caching Tactic Anatomy

<iframe src="../../sims/caching-tactic-explorer/main.html" width="100%" height="558px" scrolling="no"></iframe>

<details markdown="1">
<summary>Caching Tactic Anatomy Explorer</summary>
Type: microsim
**sim-id:** caching-tactic-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive simulation of cache behavior showing the performance impact, cache hit rate, and consistency tradeoffs of different caching strategies (write-through, write-behind, cache-aside), with student-controlled parameters.

Bloom Level: Apply (L3) — Use caching strategy knowledge to configure a cache for a specific performance vs. consistency tradeoff scenario.
Bloom Verb: Use

Learning Objective: Students will be able to configure a cache with appropriate strategy, TTL, and invalidation policy for a given performance scenario, and explain the consistency implications of their configuration.

Canvas layout:
- Top: Cache strategy selector (Write-Through, Write-Behind/Write-Back, Cache-Aside)
- Left: Live request stream showing incoming read/write operations with hit/miss indicators
- Center: Cache state panel showing current entries, TTLs, and freshness indicators
- Right: Metrics panel showing: hit rate (%), average latency (ms), consistency lag (seconds)
- Bottom: Configuration panel — TTL slider (0-3600 seconds), cache size (10-1000 entries), "Enable Staleness Warning" toggle

Cache strategies explained (visible in a collapsible reference panel):
- Write-Through: Every write goes to cache AND database synchronously; cache is always consistent; writes are slower
- Write-Behind: Writes go to cache immediately, database updated asynchronously; writes are fast; risk of data loss on cache crash
- Cache-Aside (Lazy): Application reads from database on miss and populates cache; application manages cache; flexible but more code

Behavior:
- Simulated request stream: 80% reads, 20% writes at configurable rate
- Each request shows in the stream panel with color coding: green (cache hit), yellow (cache miss → DB), red (write operation)
- Metrics update in real-time as requests are processed
- "Introduce Stale Read" button: simulates a write that bypasses cache invalidation; staleness indicator appears on affected entries
- "Cache Eviction" event triggered when cache is full, with visual of LRU eviction

Data Visibility Requirements:
- Always show current hit rate prominently
- Show average read latency comparison: cache hit (5ms) vs. cache miss + DB (50ms)
- When staleness occurs, show exactly how many ms old the stale entry is

Instructional Rationale: Real-time simulation with configurable parameters is appropriate for Apply because students must make configuration decisions and observe their consequences. Static description would not make the latency/consistency tradeoff felt.

Color scheme: Green for hits, Red for writes, Yellow for misses. Blue for cache entries in good state, Orange for stale entries.

Responsive: Panels resize to container width.
</details>

## Availability Tactics

Availability tactics target two sub-goals: fault detection (identifying that something has gone wrong) and fault recovery (restoring normal service after a fault is detected).

**Fault detection tactics:**

- **Ping/Echo:** A monitoring component regularly sends ping messages to system components and expects echo responses within a timeout. Lack of response signals a fault.
- **Heartbeat:** System components periodically emit signals indicating they are alive. Absence of a heartbeat signals a fault. Similar to Ping/Echo but initiated by the monitored component.
- **Timestamp:** Detect incorrect sequencing or delayed message delivery by examining message timestamps.
- **Condition monitoring:** Continuously check system properties (queue depth, memory usage, error rate) against thresholds; alert when thresholds are crossed.
- **Sanity checking:** Verify that component outputs satisfy expected invariants — correct range, valid format, reasonable value.

**Fault recovery tactics:**

- **Redundancy:** Maintain multiple copies of a component so that if one fails, others can take over. Redundancy can be active (all copies handle requests simultaneously; failure detection is immediate) or passive/cold (backup copies are not active until a failure is detected; switchover takes time).
- **Replication:** Maintain multiple copies of data so that if one data store fails, another copy is available. Replication can be synchronous (all copies updated before acknowledging a write — strong consistency, higher latency) or asynchronous (the primary acknowledges before copies are updated — lower latency, risk of data loss on primary failure).
- **Failover:** Automatically switch to a redundant component when a primary component fails. Failover time is a key response measure in availability scenarios.
- **Rollback:** When a deployment or operation produces a fault, revert to the previous state. Rollback requires that the previous state is available and that the rollback operation itself is reliable.
- **Graceful degradation:** When full service cannot be provided due to component failure, reduce the scope of service rather than failing completely. "The portal continues serving appointment scheduling with cached data when the EHR integration is unavailable" is a graceful degradation design.

## Resilience Patterns: Circuit Breaker, Retry, and Bulkhead

Three specific availability tactics deserve extended treatment because they are ubiquitous in modern distributed systems and central to availability scenario analysis.

Before examining each pattern, we need two definitions. A **transient fault** is a failure that resolves itself after a short time — a brief network glitch, a momentary resource exhaustion spike. A **persistent fault** is a failure that will not self-resolve — a crashed service, a misconfigured deployment. Effective resilience design treats these two fault types very differently.

### The Circuit Breaker Pattern

The **circuit breaker pattern** wraps calls to a potentially failing dependency and monitors the failure rate. It operates in three states:

- **Closed (normal operation):** Calls pass through to the dependency; failures are tracked
- **Open (fault state):** After a failure threshold is crossed, calls are short-circuited and immediately return an error or fallback response; the dependency is not called at all
- **Half-open (testing state):** After a timeout, a limited number of probe calls are allowed through; if they succeed, the circuit closes; if they fail, the circuit re-opens

The circuit breaker prevents **cascade failures** — the pattern where one slow or failing service causes all services that depend on it to exhaust their thread pools waiting for responses, eventually causing the entire system to fail under load. By failing fast (returning immediately when the circuit is open), the circuit breaker preserves the calling service's responsiveness.

Circuit breakers are a **sensitivity point** for availability scenarios. Whether the system has circuit breakers on external dependencies, what the threshold configuration is (how many failures before tripping), and what the fallback behavior is during the open state are all architectural decisions that directly determine the availability scenario response measure.

### The Retry Pattern

The **retry pattern** automatically retries a failed operation with the expectation that a transient fault may have resolved. Retry is effective for transient faults and dangerous for persistent faults — retrying a persistent failure amplifies the load on an already struggling system.

Effective retry implementations use:

- **Exponential backoff:** Double the wait time between retries (1s, 2s, 4s, 8s...) to prevent all retrying clients from hammering a recovering service simultaneously
- **Jitter:** Add randomness to the backoff interval to prevent synchronized retry storms
- **Maximum retry count:** Stop retrying after N attempts to avoid infinite loops
- **Retry budgets:** Limit the total time and count spent on retries across all calls

In ATAM evaluations, retry implementations must be examined carefully for their interaction with timeout scenarios. A service that retries three times with 5-second timeouts per attempt can take 15 seconds to fail a single operation — which may violate a performance scenario's response measure even while eventually succeeding at the availability level.

### The Bulkhead Pattern

The **bulkhead pattern** isolates different parts of a system so that a failure in one part does not cascade to other parts. The metaphor comes from ship design: watertight compartments (bulkheads) prevent a single breach from flooding the entire vessel.

In software, bulkheads are typically implemented as separate thread pools, connection pools, or process groups for different categories of operations. If all requests share a single thread pool and one category of request (e.g., slow external payment calls) exhausts the pool, all other requests (including fast internal operations) are also blocked. With bulkheads, the payment service gets its own thread pool; exhausting it does not affect the thread pool serving internal operations.

Bulkheads are a **tradeoff point** in availability vs. resource efficiency: they improve availability by providing isolation, at the cost of reduced resource utilization (dedicated pools cannot be borrowed by other operations during idle periods).

#### Diagram: Resilience Pattern Interaction Simulator

<iframe src="../../sims/resilience-pattern-simulator/main.html" width="100%" height="588px" scrolling="no"></iframe>

<details markdown="1">
<summary>Resilience Pattern Interaction Simulator</summary>
Type: microsim
**sim-id:** resilience-pattern-simulator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Simulate the interaction of circuit breaker, retry, and bulkhead patterns under a service failure scenario, showing how different combinations of these tactics affect overall system availability and latency.

Bloom Level: Analyze (L4) — Examine how resilience patterns interact under failure conditions to determine which combination most effectively addresses a given availability scenario.
Bloom Verb: Examine

Learning Objective: Students will be able to analyze the combined effect of circuit breaker, retry, and bulkhead patterns on availability and latency under a specified failure scenario, and identify which combination best achieves a given availability response measure.

Canvas layout:
- Top: Architecture diagram showing two services (Service A calling Service B) with toggle switches for: Circuit Breaker, Retry (with backoff config), Bulkhead
- Center: Animated request flow visualization showing requests (dots) flowing from A to B; dots turn red on failure, gray when rejected by circuit breaker
- Left panel: Request metrics — requests per second, success rate, average latency, P99 latency
- Right panel: Pattern state panel — circuit breaker state (Closed/Half-Open/Open), retry count for in-flight requests, bulkhead pool utilization
- Bottom: "Inject Failure" button to simulate Service B becoming slow (5s response time) or failing completely
- Timeline chart at very bottom showing success rate over the last 60 seconds

Resilience configuration controls:
- Circuit Breaker: Enable/Disable toggle, Failure Threshold slider (1-10 failures), Reset Timeout slider (5-60 seconds)
- Retry: Enable/Disable toggle, Max Retries slider (0-5), Backoff Type selector (Fixed/Exponential), Initial Delay slider (100ms-2s)
- Bulkhead: Enable/Disable toggle, Pool Size slider (1-20 threads)

Failure injection scenarios:
- "Slow Downstream": Service B responds in 5s (instead of 50ms) — tests retry/circuit breaker interaction
- "Complete Failure": Service B returns 500 errors immediately — tests circuit breaker speed
- "Intermittent Failure": Service B fails 30% of requests randomly — tests retry effectiveness vs. retry storm risk

Data Visibility Requirements:
- Always show request success rate prominently
- When circuit breaker trips, show a clear visual indicator and the time until half-open probe
- Show retry count per request in the request flow visualization
- Show bulkhead pool exhaustion when it occurs

Instructional Rationale: Interactive failure injection with configurable patterns is appropriate for Analyze because students must observe pattern interactions with real failure scenarios, not just read descriptions. The real-time metrics make the performance/availability tradeoff visible.

Color scheme: Green dots for successful requests, Red for failures, Gray for circuit-breaker-rejected requests. Orange for retried requests. Blue for bulkhead pool visualization.

Responsive: Main simulation area scales to container width.
</details>

## Modifiability Tactics

Modifiability tactics target the reduction of coupling and the preservation of architectural changeability. Before defining individual tactics, recall the central modifiability concern from Chapter 5: **blast radius** — how many components must change to implement a desired modification?

The primary modifiability tactics are organized around two approaches: reducing the ripple effect of changes and isolating change within well-defined boundaries.

**Interface definition:** Expose a module's services through a defined, stable interface that hides the module's implementation. The interface is the change-stable abstraction; the implementation can evolve behind it. Every major service API, event schema, and data contract in a well-designed system is an interface definition serving modifiability.

**Information hiding:** Ensure that each module's design decisions — especially those most likely to change — are not visible outside the module. This is Parnas's original principle applied at every level of architecture.

**Component decomposition:** Divide a monolithic component into smaller, more focused units, each responsible for a single concern. Finer decomposition reduces blast radius by reducing the scope of any single component's responsibilities.

**Dependency injection:** Rather than having a component create or locate its dependencies (which creates tight coupling to specific implementations), inject the dependencies from outside. Dependency injection decouples a component from its dependency's specific implementation, allowing the implementation to be swapped without modifying the dependent component. This is the primary architectural pattern enabling the hexagonal architecture style from Chapter 8.

**Plugin architecture:** Design the system so that new functionality can be added as independently deployable plugins that conform to a defined interface. The core system is stable; functionality is extended by adding plugins rather than modifying the core. Plugin architectures are a common response to modifiability scenarios that require new capabilities to be added without redeploying the main application.

**Defer binding:** Postpone the binding of a design decision as late as possible. Configuration files that determine behavior at startup are late-bound (compared to hardcoded values). Runtime feature flags that determine behavior per-request are even later-bound. Late binding makes modifying behavior cheaper because the modification is a configuration change rather than a code change and redeployment.

## Tactic Interactions: Where Complexity Lives

One of the most important insights in the SEI tactic catalog is that **tactic interactions** are the rule, not the exception. Applying a tactic to improve one quality attribute almost always has side effects on other quality attributes. The evaluation team's job is to identify these interactions when they affect (H,H) scenarios.

The following table presents the most commonly observed tactic interactions in distributed systems:

| Tactic Applied | Quality Attribute Improved | Quality Attribute Degraded | Mechanism |
|---------------|---------------------------|---------------------------|-----------|
| Caching | Performance (latency) | Consistency (staleness risk) | Cached data may not reflect most recent writes |
| Redundancy | Availability (fault tolerance) | Performance (coordination overhead) | Keeping replicas in sync requires communication |
| Retry | Availability (transient fault recovery) | Performance (latency under failure) | Retry adds latency when failures occur |
| Encryption | Security (confidentiality) | Performance (CPU overhead for crypto) | Encryption/decryption consumes computational resources |
| Circuit Breaker | Availability (cascade prevention) | Consistency (caller may proceed with stale state) | Open circuit returns fallback, not current truth |
| Rate limiting | Security (denial of service prevention) | Usability (legitimate users throttled) | Rate limits are calibrated for attackers, may catch peak legitimate traffic |
| Connection pooling | Performance (connection overhead) | Availability (pool exhaustion = all requests fail) | A fixed pool can be exhausted under spike load |

In ATAM practice, tactic interactions are **tradeoff points**. When the evaluation team identifies that applying a needed tactic will degrade another quality attribute with a (H,H) scenario, they have found an architectural conflict that requires stakeholder resolution. The conflict should be documented explicitly: "Applying caching to address the performance scenario will create a staleness risk for the consistency scenario — these scenarios trade off against each other and the stakeholder must choose the acceptable consistency window."

#### Diagram: Tactic Interaction Web

<iframe src="../../sims/tactic-interaction-web/main.html" width="100%" height="540px" scrolling="no"></iframe>

<details markdown="1">
<summary>Tactic Interaction Web</summary>
Type: diagram
**sim-id:** tactic-interaction-web<br/>
**Library:** vis-network<br/>
**Status:** Specified

Purpose: Interactive network graph showing architectural tactics as nodes, quality attributes as colored zones, and tactic interactions as directed edges — allowing students to explore how applying one tactic affects other quality attributes.

Bloom Level: Analyze (L4) — Examine tactic interactions to identify where applying a tactic to improve one quality attribute creates risks for another, and trace the interaction chain through multiple tactics.
Bloom Verb: Examine

Learning Objective: Students will be able to identify at least three tactic interaction chains (where applying tactic A improves QA-1 but degrades QA-2, which may require applying tactic B to compensate), and explain why these interactions are ATAM tradeoff points.

Node types:
- Quality Attribute nodes (large circles, colored by QA): Performance, Availability, Security, Modifiability, Consistency
- Tactic nodes (smaller rectangles): Caching, Redundancy, Retry, Encryption, Circuit Breaker, Rate Limiting, Connection Pooling, Dependency Injection, Information Hiding

Edge types:
- Green arrows: "Tactic improves this QA" (pointing from tactic to QA)
- Red dashed arrows: "Tactic degrades this QA" (pointing from tactic to QA)
- Orange arrows: "This QA degradation may require this compensating tactic" (pointing from one tactic to another)

Sample interaction chains:
Chain 1: Caching → improves Performance, degrades Consistency; Consistency degradation → may require Cache Invalidation Strategy (compensating tactic)
Chain 2: Redundancy → improves Availability, degrades Performance (coordination); performance degradation → may require Asynchronous Replication (compensating tactic)
Chain 3: Encryption → improves Security, degrades Performance; performance degradation → may require Hardware Security Module (HSM) offload (compensating tactic)

Interactive elements:
- Click any tactic node to highlight all its green (improves) and red (degrades) edges
- Click any QA node to highlight all tactics that affect it
- Click any edge to see the specific mechanism and a realistic example
- "Show Interaction Chains" mode: click a tactic and see the full chain of compensation tactics required

vis-network configuration:
- Physics: force-directed layout with repulsion between nodes
- Node colors: blue for QA nodes, gold for tactic nodes, orange for compensation chain nodes
- Edge colors: green for improvement, red for degradation, orange for compensation

Responsive: Canvas scales to container width; physics layout recomputes on resize.
</details>

## Interoperability Tactics

Interoperability tactics enable communication between systems that were not originally designed to work together. Three principal interoperability tactics deserve attention:

**Discover:** Enable components to locate services or resources dynamically at runtime rather than having dependencies hardcoded. Service discovery (Consul, Eureka, Kubernetes Service DNS) implements this tactic. Dynamic discovery allows services to relocate (new IP after restart) without requiring configuration updates in all dependent services.

**Tailor interface:** Add an adaptation layer (adapter, transformer, gateway) between two components with incompatible interfaces. The adapter translates between the representation formats or protocols used by each component. API gateways that translate REST to gRPC, or schema mapping services that transform between data models, implement this tactic.

**Coordinate and orchestrate:** When multiple services must collaborate to complete a business operation, coordination tactics determine how their interaction is managed. Orchestration (a central coordinator directs all participants) is simpler to reason about but creates coupling to the orchestrator. Choreography (each participant reacts to events and performs its role without central direction) is more decoupled but harder to trace. Both are interoperability tactics with different tradeoff profiles.

!!! mascot-warning "Retry Without Circuit Breaker Is a Trap"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Vista warning">
    Here is a failure mode Vista has observed in architecture reviews far too many times: a team implements retry (correctly) to handle transient faults, but does not implement a circuit breaker alongside it. When a downstream service fails persistently, every caller retries up to its maximum count before finally failing. Under high load, every caller is retrying simultaneously, amplifying the load on the failing service by the retry factor — exactly the wrong behavior during a recovery attempt. Retry and circuit breaker are a tactic pair: retry handles transient faults, circuit breaker handles persistent faults. Missing either half of the pair creates a dangerous failure mode.

!!! mascot-celebration "Your Tactic Catalog Is Now Loaded!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Vista celebrating">
    You have just loaded the architect's toolkit — the tactic catalog that makes ATAM's architectural approach analysis precise and actionable. When you evaluate an architecture against a (H,H) availability scenario, you now know exactly what to look for: circuit breakers on critical dependencies, redundancy for single points of failure, retry with backoff, bulkheads for isolation, graceful degradation for non-critical paths. When you find any of these missing, you have a risk finding. When you find them all present and well-configured, you have a non-risk confirmation. That analytical vocabulary is your ATAM superpower at its finest.

## Key Takeaways

Tactics are the fine-grained building blocks that patterns are composed of, and they are the unit of analysis for ATAM's architectural approach evaluation:

- **Tactics** directly affect a specific quality attribute; **patterns** are structural arrangements composed of multiple tactics
- **Foundational design principles** — coupling, cohesion, information hiding, encapsulation — determine a system's receptiveness to tactical improvement
- **Performance tactics** control demand (throttling, load shedding) or manage resources (caching, concurrency, load balancing)
- **Availability tactics** detect faults (ping/echo, heartbeat, monitoring) or recover from them (redundancy, replication, failover, graceful degradation)
- **Circuit breaker** prevents cascade failures by failing fast when a dependency is persistently failing
- **Retry** handles transient faults; must be paired with circuit breaker or it amplifies load on persistent failures
- **Bulkhead** isolates failure domains so one failing component doesn't exhaust shared resources
- **Modifiability tactics** — interface definition, information hiding, dependency injection, plugin architecture, deferred binding — reduce blast radius and decouple components
- **Tactic interactions** are ATAM tradeoff points: applying a tactic to improve one quality attribute frequently degrades another; these interactions must be documented and stakeholder-resolved
- **Interoperability tactics** — service discovery, interface adaptation, orchestration — enable heterogeneous system integration

??? question "Self-Check: Tactic Analysis — Click to Reveal Answers"
    **Q1:** A utility tree has a (H,H) scenario: "When the recommendation service is unavailable, the product listing page must continue displaying products without recommendations, returning within 800ms." What availability tactics would you look for in the architecture to confirm this scenario is addressed?

    **Answer:** Three tactics are needed: (1) **Circuit Breaker** on the recommendation service dependency — when the recommendation service fails, the circuit opens and calls return immediately with a null/empty recommendation result rather than blocking for timeout. (2) **Graceful Degradation** in the product listing page — the page must be designed to render without recommendations (empty recommendation slot or default "trending products" fallback), not fail when the recommendation field is empty. (3) **Timeout configuration** — even without a circuit breaker, a well-configured timeout (e.g., 200ms) on the recommendation call prevents the full 800ms budget from being consumed waiting for a slow service. Without all three, the scenario is likely at risk.

    ---

    **Q2:** Explain the tactic interaction between caching and eventual consistency, and describe a scenario type where this interaction becomes an ATAM tradeoff point.

    **Answer:** The caching tactic improves performance by serving reads from fast local storage rather than the authoritative data store. The interaction with consistency arises because cached data may not reflect recent writes — there is a window (the cache TTL) during which the cache serves stale data. This becomes an ATAM tradeoff point when the system has both a (H,H) performance scenario ("product search must return in under 300ms") and a (H,H) or (H,M) consistency scenario ("product inventory displayed to a customer must reflect inventory changed within the last 60 seconds"). If the cache TTL is 5 minutes (for performance) but the consistency scenario requires currency within 60 seconds, the two scenarios are in direct conflict. Resolution requires either a shorter TTL (more consistency, some performance degradation), a targeted invalidation strategy (better solution but higher complexity), or stakeholder negotiation about the acceptable consistency window.

    ---

    **Q3:** A microservices architecture has 12 services, each with its own thread pool of 50 threads. Service A calls Services B, C, and D synchronously to fulfill a user request. Service D suddenly becomes very slow (responses in 8 seconds instead of 50ms). What availability failure mode do you anticipate, and which tactic combination addresses it?

    **Answer:** The anticipated failure mode is **thread pool exhaustion cascade**: Service A's 50 threads fill with requests all waiting for Service D's slow responses. Within seconds, Service A can no longer accept new requests (thread pool exhausted), causing all users to receive errors regardless of whether their request needs Service D at all. If B and C also depend on A's availability, the cascade spreads. The tactic combination: (1) **Bulkhead** — give Service D calls a separate, smaller thread pool (e.g., 10 threads) so exhaustion is isolated; Service A's primary thread pool remains available for requests that don't need D. (2) **Circuit Breaker** — after D's failure rate crosses the threshold, break the circuit and return an immediate fallback for D-dependent requests without consuming any thread resources. (3) **Timeout** — set an aggressive timeout (e.g., 500ms) on all calls to D so slow responses don't hold threads for 8 seconds each.
