# Quiz: Distributed Systems Architecture Fundamentals

Test your understanding of distributed systems concepts including CAP theorem, service decomposition, API gateways, service meshes, event-driven messaging, and distributed tracing. Each question is followed by a collapsed answer block.

## Questions

### Question 1

What are the four fundamental properties that make distributed systems architecturally distinctive from single-process systems?

??? note "Answer"
    The four properties are: (1) **Partial failure** — some components can fail while others continue operating, creating a failure mode absent in single-process systems where failure is all-or-nothing. (2) **Concurrency** — multiple processes run simultaneously and interact through shared resources or message passing, creating race conditions and consistency challenges. (3) **No global clock** — different machines have different system clocks that drift over time, making event ordering and causal reasoning harder. (4) **Network unreliability** — messages between services can be delayed, duplicated, reordered, or lost; the network is not a reliable pipe.

---

### Question 2

Which of the following is NOT a property of well-decomposed services in a distributed system?

A. High cohesion — each service is responsible for a single, well-defined business capability  
B. Shared database — services access a common database to ensure consistency  
C. Low coupling — services interact through stable, versioned interfaces  
D. Independently deployable — a service can be updated without coordinating with other services  

??? note "Answer"
    The correct answer is **B**. Services owning their own data stores exclusively is a fundamental property of good service decomposition — "no direct database-to-database access between services." Sharing a database creates coupling that prevents independent deployment and scaling, and makes modifiability scenarios difficult to achieve. While eliminating shared databases creates consistency challenges that require distributed transaction patterns (like Sagas), the modifiability and deployability benefits typically outweigh this cost. Options A, C, and D are all genuine properties of well-decomposed services.

---

### Question 3

State the CAP theorem. Why is partition tolerance effectively mandatory in production distributed systems?

??? note "Answer"
    The **CAP theorem** states that a distributed data system can guarantee at most two of three properties simultaneously: **Consistency** (every read receives the most recent write or an error), **Availability** (every request receives a response, though it may not reflect the most recent write), and **Partition Tolerance** (the system continues operating when network partitions prevent some nodes from communicating). Partition tolerance is effectively mandatory because network partitions are not hypothetical events — they occur in all production distributed systems due to network hardware failures, misconfigurations, software bugs, and temporary congestion. Since P cannot be sacrificed, the real architectural choice is between **CP** (sacrifice availability during partitions to maintain consistency) and **AP** (sacrifice consistency during partitions to maintain availability).

---

### Question 4

A distributed system uses Cassandra (an AP database) for its user session store. The (H,H) consistency scenario states: "A user's logged-out session must be invalidated across all nodes within 5 seconds of logout." What ATAM result type does this create?

A. Non-Risk — Cassandra is highly available so sessions will always be accessible  
B. Sensitivity Point — the replication factor is the only parameter that matters  
C. Tradeoff Point — the AP choice improves availability but threatens the 5-second invalidation consistency requirement  
D. Architectural Risk — Cassandra cannot store session data  

??? note "Answer"
    The correct answer is **C**. This is a **tradeoff point**. Choosing an AP database like Cassandra *improves* availability (the session store remains accessible during network partitions and node failures) while *threatening* the consistency scenario (AP systems do not guarantee that writes — including session invalidations — propagate to all nodes within a bounded time window). The 5-second invalidation window may not be achievable with AP eventual consistency semantics, especially during partitions. Stakeholders must decide whether the availability benefit of AP is worth the risk of a session remaining valid on some nodes for longer than 5 seconds after logout.

---

### Question 5

Explain the difference between a **message queue** and the **publish-subscribe pattern**. Give one scenario where each is the better choice.

??? note "Answer"
    A **message queue** provides point-to-point communication: a producer sends a message to a named queue, and exactly one consumer reads it. It decouples producers and consumers in time and space. Best suited for: work distribution, command processing, task queuing (e.g., an image processing service where each upload is processed by exactly one worker). The **publish-subscribe (pub/sub) pattern** provides one-to-many communication: a producer publishes an event to a topic, and multiple subscribers each receive their own copy. Best suited for: domain event propagation, fan-out scenarios (e.g., an "order placed" event that triggers notifications, inventory updates, and analytics simultaneously, with each subscriber receiving its own copy independently).

---

### Question 6

Why is the **service registry's health check configuration** described as a sensitivity point for availability scenarios?

??? note "Answer"
    The service registry's health check configuration is a sensitivity point because its specific settings have a disproportionate effect on availability scenario achievability. If the health check interval is 10 seconds, the system can route requests to a failing service instance for up to 10 seconds before removing it from the registry — during which 10 seconds of requests may receive errors or timeouts. A health check interval of 5 seconds halves this window; an interval of 30 seconds triples it. The check endpoint, timeout threshold, and failure threshold multiplier all have similarly disproportionate effects on how quickly unhealthy instances are removed from rotation. Small changes to these configuration values produce large changes in availability scenario achievability — the definition of a sensitivity point.

---

### Question 7

An e-commerce shopping cart service must continue working when the inventory service is unavailable (H,H availability scenario) AND must never show items with zero available inventory (H,H consistency scenario). Explain the CAP theorem tradeoff this creates and describe the typical resolution.

??? note "Answer"
    This is a classic CAP tradeoff point. Continuing to show the cart when inventory is unavailable (availability scenario) requires serving data from a local cache or replica without contacting the authoritative inventory service. But serving cached data risks showing items as available when inventory has actually reached zero (consistency scenario). During a network partition, the system must choose: (CP) refuse to show the cart without authoritative inventory data — satisfying consistency but failing availability — or (AP) show the cart with potentially stale inventory data — satisfying availability but risking inconsistency. The CAP theorem guarantees these cannot both be fully satisfied during a partition. The typical e-commerce resolution is **AP with compensating logic**: accept add-to-cart optimistically, then perform authoritative inventory check at checkout or order placement, and cancel with notification if inventory is insufficient. This accepts temporary inconsistency during browsing in exchange for continuous cart availability.

---

### Question 8

What are the primary **quality attribute costs** of Two-Phase Commit (2PC) for distributed transactions?

A. Security and auditability  
B. Availability, performance, and scalability  
C. Modifiability and deployability  
D. Testability and observability  

??? note "Answer"
    The correct answer is **B**. 2PC degrades **availability** because if the coordinator or any participant fails during Phase 2, all participants remain in the "prepared" state indefinitely — a blocking failure mode. It degrades **performance** because all participants must hold locks on their data for the full duration of the protocol, increasing contention and latency. It limits **scalability** because distributed locking across services creates concurrency bottlenecks. These costs are significant enough that 2PC is rarely used in modern microservices architectures — the Saga pattern is the common alternative, trading immediate consistency for higher availability and performance.

---

### Question 9

Describe the structure of a distributed trace. What problem does it solve that cannot be solved with traditional per-service logging?

??? note "Answer"
    A distributed trace is a collection of **spans** — discrete timed records of operations — connected by a **trace ID** that propagates through all services involved in a single request. Each span records: the service name and operation, start time and duration, success or failure status, a parent span ID (linking it to the calling operation), and key metadata (database queries, cache hits/misses, downstream calls). The result is a hierarchical timeline of everything that happened to fulfill one request. Traditional per-service logging cannot solve this because log entries from different services for the same request have no connection to each other — correlating them manually requires knowing which services were involved, when the request arrived at each, and sifting through logs from dozens of services. Distributed tracing makes this correlation automatic, enabling root-cause diagnosis of latency issues and failures across complex service chains.

---

### Question 10

Which of the following best describes the **API gateway's** relationship to the availability quality attribute?

A. It only supports availability — it provides redundancy for all downstream services  
B. It has no effect on availability — it is transparent infrastructure  
C. It supports availability via centralized cross-cutting concerns but threatens it as a potential single point of failure  
D. It always threatens availability by adding network hops  

??? note "Answer"
    The correct answer is **C**. The API gateway has a dual relationship with availability. It *supports* availability by centralizing authentication, rate limiting, and routing — without it, these cross-cutting concerns must be implemented and kept consistent in every service. It *threatens* availability because it is a potential single point of failure: if the gateway is unavailable, all external access is blocked regardless of whether individual services are healthy. This is why the API gateway's own availability configuration — cluster deployment, failover behavior, circuit breaker settings — is a **sensitivity point** for every external-facing availability scenario. The gateway must be designed with the same or higher availability than the services it protects.

---

### Question 11

Scenario: An operations team reports they cannot diagnose latency issues in their 15-service microservices architecture because "the logs don't tell us which service was slow." They have per-service logging but no distributed tracing. Using ATAM terminology, classify this situation and identify the architectural tactic required.

??? note "Answer"
    This is an **architectural risk** for a testability/observability quality attribute scenario. If the system has (or should have) a scenario such as "latency degradation affecting more than 1% of users must be diagnosed to the root-cause service within 15 minutes of detection," the absence of distributed tracing creates a credible risk of failing that scenario — which the operations team has already empirically confirmed. The required architectural tactic is **distributed tracing**: instrumentation of all services to propagate trace IDs through all requests, capture spans for all operations, and export trace data to a trace aggregation system (Jaeger, Zipkin, AWS X-Ray). Additionally, the trace **sampling rate** is a **sensitivity point** for both the observability scenario (100% sampling provides complete diagnostics but has overhead) and the performance scenario (high sampling rates affect throughput on high-frequency services).

---

### Question 12 (Analyze)

A cloud-native team designs a new service mesh deployment across 20 microservices. The service mesh adds 2ms latency per inter-service hop via sidecar proxies. The architecture has an average request that traverses 4 service hops. The (H,H) performance scenario requires p99 latency ≤ 50ms. A security architect argues the service mesh is essential because it provides mTLS and circuit breakers. Analyze this situation as an ATAM tradeoff point, including the stakeholder decision that must be made.

??? note "Answer"
    This is a **tradeoff point** between security/availability and performance. The service mesh *strongly supports* **security** (mTLS eliminates a large class of network-based attacks on service-to-service communication) and **availability** (infrastructure-level circuit breakers are applied consistently without relying on application teams). It *threatens* **performance**: 2ms per hop × 4 hops = 8ms of overhead added to every request purely from sidecar proxies. If the baseline service processing time (without mesh) already consumes most of the 50ms budget, the additional 8ms may push p99 over the threshold. The stakeholder decision required: "Is the security and availability benefit of consistent mTLS and circuit breaking worth an 8ms degradation in our performance budget?" Analysis should include: measuring the current p99 without the mesh to determine the actual headroom remaining; evaluating whether circuit breakers could be implemented at the application layer as an alternative; and quantifying the security risk of *not* having mTLS. The ATAM finding documents both sides and presents the explicit choice to stakeholders rather than making the decision technically without authorization.

---

*End of Quiz — Chapter 11*
