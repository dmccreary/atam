# Quiz: Architectural Tactics and Design Principles

Test your understanding of the quality attribute tactic catalog, resilience patterns, design principles, and tactic interactions. Each question is followed by a collapsed answer block.

## Questions

### Question 1

**[Remember]** What distinguishes a **quality attribute tactic** from an **architectural pattern**?

A. Tactics are documented; patterns are informal knowledge shared among senior architects  
B. A tactic has a direct, known effect on a single quality attribute; a pattern is a structural arrangement composed of multiple tactics  
C. Tactics are used for performance only; patterns address all quality attributes  
D. Tactics are code-level decisions; patterns are system-level decisions  

??? note "Answer"
    The correct answer is **B**. A **tactic** is a design decision with a direct, known effect on a specific quality attribute response measure — it affects a quality attribute immediately without relying on intermediary effects. A **pattern** is a structural arrangement of components that, as a whole, creates conditions favorable to certain quality attributes. The key relationship: patterns are *composed of* multiple tactics. For example, the microservices pattern employs circuit breakers (availability tactic), caching (performance tactic), dependency injection (modifiability tactic), and others simultaneously. Tactics are the building blocks; patterns are the structures assembled from those blocks.

---

### Question 2

**[Remember]** The **circuit breaker pattern** operates in three states. What are they, and what triggers the transition from Closed to Open?

A. Active, Passive, and Recovery — triggered by a configuration change  
B. Closed (normal), Open (fault), and Half-open (testing) — triggered when a failure threshold is crossed  
C. Green, Yellow, and Red — triggered by latency thresholds exceeding SLA  
D. Connected, Disconnected, and Reconnecting — triggered by network partition detection  

??? note "Answer"
    The correct answer is **B**. The three states are: **Closed** (normal operation — calls pass through; failures are tracked), **Open** (fault state — after a failure threshold is crossed, calls are short-circuited and immediately return an error or fallback; the dependency is not called), and **Half-open** (testing state — after a timeout, a limited number of probe calls are allowed through; if they succeed, the circuit closes; if they fail, it re-opens). The Closed → Open transition is triggered when the number of failures (or failure rate) within a time window crosses a configured threshold. This prevents cascade failures by failing fast rather than exhausting thread pools waiting for timeouts.

---

### Question 3

**[Remember]** What is the **bulkhead pattern**, and which quality attribute does it primarily address?

A. A pattern that routes requests through multiple load balancers simultaneously, addressing performance  
B. A pattern that isolates different parts of a system into separate resource pools so a failure in one part doesn't cascade to others, addressing availability  
C. A pattern that encrypts network traffic between services, addressing security  
D. A pattern that caches database results in memory, addressing performance  

??? note "Answer"
    The correct answer is **B**. The **bulkhead pattern** is named after ship design: watertight compartments prevent a single breach from flooding the entire vessel. In software, bulkheads are implemented as separate thread pools, connection pools, or process groups for different operation categories. If all operations share a single thread pool and one slow operation exhausts it, all operations fail. With bulkheads, each category gets its own pool — exhausting the pool for slow external calls doesn't affect the pool serving fast internal operations. The primary quality attribute addressed is **availability** through failure isolation.

---

### Question 4

**[Remember]** What is **information hiding**, and who articulated this principle?

A. The principle that sensitive data must be encrypted at rest and in transit — articulated by Bruce Schneier  
B. The principle that a module should hide its design decisions (especially those most likely to change) from its clients, exposing only the minimal interface needed — articulated by David Parnas in 1972  
C. The principle that system internals should not be visible to end users — articulated by Jakob Nielsen  
D. The principle that source code should not be publicly accessible — articulated by the Open Source Initiative  

??? note "Answer"
    The correct answer is **B**. **Information hiding** was articulated by **David Parnas in 1972** and states that a module should hide its design decisions from its clients, exposing only the minimal interface needed to accomplish the module's purpose. The "design decisions" Parnas meant are those most likely to change — implementation details, data representations, and algorithms. Information hiding is the structural mechanism that makes modifiability tactics effective: if a module hides its data representation, it can change that representation without affecting any client. If it hides its algorithm, it can replace the algorithm without breaking anything depending on it.

---

### Question 5

**[Understand]** Explain the difference between **active redundancy** and **passive (cold) redundancy** as availability tactics, and describe the tradeoff between them.

??? note "Answer"
    **Active redundancy** (also called hot standby): all redundant copies are operational and handling requests simultaneously. When one copy fails, the remaining copies continue serving traffic without interruption. Failure detection is immediate — the failed copy simply stops receiving traffic. **Passive redundancy** (cold standby): backup copies are not active until a failure is detected in the primary. When the primary fails, the backup must be started, initialized, and placed into service before it can handle requests. There is a recovery time between detection and restoration. The tradeoff: **Active redundancy** provides faster failover (effectively zero downtime) but costs more to run — all copies consume compute and memory resources even when the primary is healthy. **Passive redundancy** is less expensive to operate (backups are idle) but introduces a recovery time window during which the service is unavailable or degraded. For a (H,H) availability scenario specifying "recovery within 10 seconds," active redundancy may be required; for a scenario accepting "recovery within 5 minutes," passive redundancy may be cost-effective.

---

### Question 6

**[Understand]** Explain **module cohesion** and **module coupling** as design principles, and describe how they relate to ATAM's modifiability scenarios.

??? note "Answer"
    **Module cohesion** is the degree to which the elements within a module belong together logically — a highly cohesive module serves a single, well-defined purpose. **Module coupling** is the degree to which two modules depend on each other — low coupling means modules can evolve independently; high coupling means a change to one likely requires a change to the other. They are related inversely: high cohesion tends to produce low coupling (a module that does one thing well has fewer reasons to depend on other modules), while low cohesion produces high coupling (a module that does many things must reach into many other modules). In ATAM, modifiability scenarios measure the **blast radius** of a change — how many components must be modified to implement a desired change. Blast radius is directly determined by coupling: high coupling means changes propagate widely; low coupling means they stay localized. A modifiability scenario like "adding a new payment method should require changes only to the payment module" is achievable only if the payment module has high cohesion (owns the full payment concern) and low coupling (doesn't share state or logic with checkout, cart, or order services).

---

### Question 7

**[Understand]** Describe the **retry pattern** and explain why retry without a circuit breaker is described as a "trap." What specific failure mode does the unmitigated retry create?

??? note "Answer"
    The **retry pattern** automatically retries a failed operation with the expectation that a transient fault may have resolved. For transient faults (brief network glitch, momentary resource exhaustion) this is effective: the first attempt fails, the retry succeeds, the user experiences minimal disruption. The problem arises with **persistent faults** (crashed service, misconfigured deployment). When a dependency fails persistently, every caller retries up to its maximum count before finally giving up — and under high load, all callers are retrying simultaneously. If each call retries 3 times with a 2-second timeout per attempt, a service that takes 100 requests/second now receives 300 requests/second directed at the failing dependency — amplifying load by the retry factor at exactly the moment the dependency is most vulnerable to being overwhelmed. This is the "retry storm" failure mode. The circuit breaker is the complementary tactic: it handles persistent faults by detecting the failure pattern and immediately short-circuiting calls (returning a fallback instead of retrying), preserving resources for recovery. Retry handles transient faults; circuit breaker handles persistent faults. Without both, the retry pattern can actively worsen a persistent failure.

---

### Question 8

**[Understand]** What is **dependency injection** as a modifiability tactic, and how does it relate to the hexagonal architecture style from Chapter 8?

??? note "Answer"
    **Dependency injection** is a modifiability tactic where a component receives its dependencies from an external source rather than creating or locating them internally. Instead of `OrderService` instantiating `PostgresOrderRepository` directly (creating tight coupling to a specific implementation), the `OrderService` declares that it needs something that implements `OrderRepository` (an interface), and the dependency injection framework provides the specific implementation at runtime. This decouples the component from its dependency's specific implementation, allowing the implementation to be swapped without modifying the dependent component — the core mechanism for achieving low coupling. **Hexagonal architecture** (ports and adapters) operationalizes dependency injection at the architectural level. The "ports" are the interfaces (e.g., `OrderRepository`) that the domain core declares as dependencies; the "adapters" are the concrete implementations (e.g., `PostgresOrderRepository`, `InMemoryOrderRepository` for testing). Dependency injection is the mechanism that wires concrete adapters to abstract ports at runtime, enabling the domain core to operate independently of infrastructure. This is why hexagonal architecture excels at testability (inject a test double through the port) and portability (inject a different adapter to swap infrastructure).

---

### Question 9

**[Apply]** A utility tree has a **(H,H) scenario**: "When the recommendation service is unavailable, the product listing page must continue displaying products without recommendations, returning within 800ms." Identify the specific tactics from the chapter that the architecture must employ to satisfy this scenario, and explain what each tactic contributes.

??? note "Answer"
    Three tactics are needed to satisfy this scenario: (1) **Circuit Breaker on the recommendation service dependency.** Without a circuit breaker, when the recommendation service is unavailable, the product listing page will wait for the recommendation call to time out before returning — potentially violating the 800ms response measure. With a circuit breaker, after the recommendation service fails its threshold, subsequent calls short-circuit immediately (returning null/empty in milliseconds rather than waiting for timeout). The circuit breaker converts a blocking failure into a fast failure, protecting the 800ms response measure. (2) **Graceful Degradation in the product listing page.** The page must be architecturally designed to render *without* recommendations — an empty recommendation slot, a "trending products" static fallback, or simply no recommendation section. This is a design decision, not just a circuit breaker configuration: the page must handle the null/empty case from the circuit breaker's fallback without throwing an error or blocking rendering. (3) **Timeout configuration.** Even without a circuit breaker, a well-configured timeout (e.g., 200ms) on the recommendation service call ensures that even the first few failures (before the circuit opens) do not consume the full 800ms budget. The timeout is a demand-side performance tactic that bounds the worst-case latency impact of any single slow dependency call.

---

### Question 10

**[Apply]** A microservices system has 12 services, each with a thread pool of 50 threads. Service A must call Services B, C, and D synchronously to serve a user request. Service D suddenly slows to 8-second response times. Describe the cascade failure that occurs, identify the failure mode by name, and prescribe the tactic combination that addresses it.

??? note "Answer"
    **Cascade failure description:** Service A's 50 threads begin filling with requests waiting for Service D's 8-second responses. Within seconds (50 threads × 8 seconds = ~400 seconds of blocked thread capacity, exhausted by ~6 requests/second of D-dependent traffic), Service A's thread pool is fully exhausted. New requests to Service A — including those that don't require D at all — are now rejected because no threads are available to handle them. If other services depend on Service A, the exhaustion propagates: services upstream of A now also receive failures. **Failure mode name:** Thread pool exhaustion cascade (sometimes called a "thundering herd" or "cascading failure"). **Tactic combination to address it:** (1) **Bulkhead** — isolate calls to Service D in a separate, smaller thread pool (e.g., 10 threads). Service D call exhaustion is now contained to that pool; Service A's primary thread pool (40 threads) remains available for requests that don't need D. (2) **Circuit Breaker** — after D's failure rate crosses the threshold, open the circuit and immediately return a fallback for D-dependent requests without consuming any thread. This drains the D-specific thread pool during the open state. (3) **Timeout** — set an aggressive timeout (e.g., 500ms) on all calls to D, so even before the circuit opens, threads hold for 500ms maximum rather than 8 seconds — dramatically reducing the rate of pool exhaustion.

---

### Question 11

**[Apply]** You are reviewing an architecture's approach to a (H,H) performance scenario: "Product search must return results in under 300ms at p99." The team proposes implementing an aggressive 5-minute cache TTL for all search results. Explain the **tactic interaction** this creates with a consistency scenario, and propose how to manage the interaction architecturally.

??? note "Answer"
    **Tactic interaction:** The caching tactic improves performance by serving search results from fast in-memory storage rather than executing a live database query. The interaction with consistency arises because cached data may not reflect recent changes during the 5-minute TTL window. If a product is marked out-of-stock or a price is updated, the cache will continue serving the stale data to customers for up to 5 minutes. If the system has a consistency scenario (e.g., "product inventory displayed to a customer must reflect inventory changed within the last 60 seconds"), the 5-minute TTL directly violates this scenario — a 300-second staleness window is far outside the 60-second requirement. **Managing the interaction architecturally:** (1) **Targeted cache invalidation** — when inventory or price data changes, immediately invalidate only the affected cache entries rather than relying on TTL expiration. This preserves the performance benefit (most cache entries remain valid) while satisfying the consistency requirement for the specific changed items. Implementation requires cache invalidation events emitted by the inventory/pricing services. (2) **Tiered TTL** — apply different TTLs by data type: product description and image data (rarely changes) uses a 30-minute TTL; price and inventory data uses a 60-second TTL matching the consistency requirement. (3) **Stakeholder negotiation** — if neither technical solution is feasible in the available time, document the tradeoff explicitly: "The 5-minute TTL satisfies the performance scenario but violates the 60-second consistency scenario. The stakeholder must choose which scenario takes precedence, or authorize the additional development effort required for targeted invalidation."

---

### Question 12

**[Analyze]** The chapter argues that "high coupling makes every quality attribute tactic harder to apply." Analyze this claim by examining three specific scenarios where high coupling directly prevents or severely limits the effective application of a quality attribute tactic, and conclude by explaining what this implies for the sequence in which architectural improvements should be made.

??? note "Answer"
    Three scenarios demonstrating that high coupling blocks tactic application: (1) **Bulkhead tactic blocked by shared thread pool:** To apply the bulkhead pattern, you must be able to assign different categories of operations to separate thread pools. But if the application is a monolith where all operations share a single executor service and there is no way to categorize which threads handle which operations, the bulkhead cannot be applied without significant refactoring of the concurrency model. The tactic assumes you have defined operation categories with separable execution contexts — which high coupling at the thread management level prevents. (2) **Circuit breaker blocked by shared library coupling:** A circuit breaker wraps calls to a specific external dependency. But if two services share a common library that directly accesses a database, rather than communicating through a defined service interface, there is no call boundary to wrap with a circuit breaker. The database access is distributed across the library's call sites throughout the codebase. Applying a circuit breaker requires first refactoring the library into a defined service with a discoverable interface — eliminating the tight coupling before the tactic can be applied. (3) **Caching blocked by shared state:** A caching tactic assumes you can cache the output of a specific component's operation. But if multiple components share access to the same mutable state (e.g., a shared in-memory object model rather than a database), caching one component's view of that state becomes invalid the moment another component mutates it — without a notification mechanism. Effective caching requires that the component owning the state is the only writer (low coupling through data ownership), so it can emit invalidation events when its state changes. **Implication for improvement sequence:** This analysis implies that reducing coupling is a *prerequisite* for applying most quality attribute tactics. Before investing in resilience patterns, caching, or bulkheads, the architecture must first achieve the structural properties — defined interfaces, owned data stores, separable execution contexts — that give tactics something to act on. This is why ATAM's evaluation of coupling and cohesion (through modifiability scenarios) is often more foundational than the evaluation of individual tactics: the structural properties determine whether tactical improvements are even feasible.

