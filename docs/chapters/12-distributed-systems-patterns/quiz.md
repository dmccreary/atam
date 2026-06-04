# Quiz: Distributed Systems Patterns

Test your understanding of advanced distributed systems patterns including Saga transactions, API versioning, service contracts, database ownership, and synchronous versus asynchronous communication. Each question is followed by a collapsed answer block.

## Questions

### Question 1

What is a **service contract** and what three properties does it define?

??? note "Answer"
    A service contract is the formal specification of what a service provides and what it requires — the promises a service makes to its consumers and the promises it expects in return. It defines three properties: (1) **API interface** — the operations the service exposes (for REST: URLs, HTTP methods, request/response schemas; for gRPC: Protocol Buffer service definitions; for events: event schema definitions). (2) **Quality attributes of the interface** — response time guarantees, availability commitments, error rate limits. (3) **Consumer requirements** — what the service needs from its own dependencies, expressed as its service contracts with downstream services.

---

### Question 2

Which of the following API versioning strategies has the highest modifiability score and the lowest operational complexity?

A. URL-based versioning (`/api/v1/`, `/api/v2/`)  
B. Header-based versioning  
C. Content negotiation  
D. Additive-only semantic versioning  

??? note "Answer"
    The correct answer is **D**. Additive-only semantic versioning is rated as the highest modifiability strategy (score 5/5) with the lowest complexity (score 1/5) because it never introduces breaking changes — new optional fields are added, deprecated fields are maintained, and nothing is ever removed or renamed. The tradeoff is that schema accumulates deprecated fields over time. URL-based versioning (A) requires maintaining multiple API implementations simultaneously — high operational cost. Header-based (B) and content negotiation (C) require more complex routing and client implementation. For internal microservices, additive-only is typically the best default choice.

---

### Question 3

Explain the difference between **choreography-based** and **orchestration-based** Saga patterns. What does each sacrifice for what it gains?

??? note "Answer"
    **Choreography-based Saga**: each service publishes events when its local transaction completes and subscribes to events from other services. No central coordinator — each service knows its role and reacts to events. It *supports* availability (no single coordinator is a failure point), scalability (no coordinator bottleneck), and modifiability (services are loosely decoupled). It *threatens* debuggability (the workflow is implicit in event subscriptions, making end-to-end tracing difficult) and testability (testing the full workflow requires all services running). **Orchestration-based Saga**: a central Saga Execution Coordinator sends commands to each service and waits for completion events. The workflow is explicit in the orchestrator's code. It *supports* debuggability (workflow is explicit), testability (orchestrator can be tested independently), and understandability. It *threatens* availability (the orchestrator is a single point of failure for the Saga) and introduces coupling (services must know the orchestrator's command format).

---

### Question 4

A payment service in a choreography-based Saga receives a "charge $100" request. The network drops the response before the client receives it. The client retries the request. What property must the payment service have to prevent a double charge, and how is it typically implemented?

??? note "Answer"
    The payment service must be **idempotent**: applying the same operation multiple times produces the same result as applying it once. Idempotency is implemented using an **idempotency key** — a unique identifier per request provided by the client (typically the order ID or a client-generated UUID). On receiving a request, the service first checks whether a record with that idempotency key already exists in its database. If a matching record exists, it returns the original response without re-executing the charge. If no matching record exists, it executes the charge, persists the result with the idempotency key, and returns the response. This prevents double charges regardless of how many times the client retries due to network failures or timeouts.

---

### Question 5

Why is a microservices architecture where all services share a single PostgreSQL database described as "a distributed monolith"?

??? note "Answer"
    Services sharing a database have the operational complexity of microservices (multiple deployments, distributed communication, service-to-service calls) but lose the key modifiability and deployability benefits microservices are supposed to provide. Specifically: (1) **Schema changes affect all services** — any schema migration must be coordinated across all teams whose services access the shared schema, exactly the coordination overhead microservices are designed to eliminate. (2) **Independent deployment is impossible** when a schema migration is required — all services that depend on the changed schema must be updated together. (3) **Shared databases become coupling bottlenecks** — the database is a single point of scaling failure and a single point of failure for all services. The "microservices facade" hides what is structurally a monolithic data model.

---

### Question 6

Which of the following best describes **contract-first design**?

A. Ensuring that the service implementation is completed before API clients begin development  
B. Defining the API contract before implementation, then generating server stubs and client SDKs from it  
C. Writing consumer code before the provider service is designed  
D. Negotiating pricing contracts with cloud providers before beginning architecture design  

??? note "Answer"
    The correct answer is **B**. Contract-first design inverts the typical development sequence: instead of building the service implementation and deriving the API from it, the API contract is defined first (using OpenAPI, Protocol Buffers, or AsyncAPI), and the service implementation is built to fulfill the contract. Server stubs and client SDKs are generated from the contract specification, enabling parallel development — the server team and client teams can work simultaneously once the contract is agreed upon. This elevates the interface definition to a first-class architectural artifact separate from implementation.

---

### Question 7

Scenario: An order management system uses a choreography-based Saga for order placement: (1) Order created, (2) Inventory reserved, (3) Payment charged, (4) Shipment scheduled. The payment service fails at step 3. What compensating transactions must execute, and what system state should result?

??? note "Answer"
    When the Payment Service fails at step 3 and publishes a PaymentFailed event: (1) The **Inventory Service** must receive the PaymentFailed event and execute its compensating transaction: release the inventory reservation it committed in step 2 (publishing an InventoryReleased event). (2) The **Order Service** must receive notification of the Saga failure and mark the Order status as CANCELLED. The Payment Service itself did not complete a successful charge, so it has no compensation to perform — if it had partially completed (e.g., the charge was sent to the gateway but the response was lost), it must issue a reversal. The final system state should be: Order status = CANCELLED, inventory reservation released (inventory available for other orders), no charge to the customer's payment method.

---

### Question 8

What is the **schema registry** and what architectural risk does its absence create in a large event-driven system?

??? note "Answer"
    A schema registry is a centralized catalog of event and message schemas with version management and compatibility enforcement. Producers register their message schemas; consumers validate received messages against registered schemas. The registry can enforce compatibility rules: backward-compatible changes only (new optional fields, no removed or renamed fields). **Without a schema registry**: there is no automated mechanism to detect schema compatibility violations before deployment. A producer can unknowingly remove a field that existing consumers depend on, rename a field, or change a field's type — and consumers will fail at runtime, often silently (deserialization errors that produce null fields rather than hard exceptions). This is an architectural risk for both **modifiability** (consumers break unexpectedly when producers evolve their schemas) and **reliability** (runtime failures from schema incompatibilities degrade service quality without triggering clear error signals).

---

### Question 9

Compare synchronous and asynchronous service communication across four quality attribute dimensions.

??? note "Answer"
    | Dimension | Synchronous | Asynchronous |
    |---|---|---|
    | **Availability** | Caller fails if callee is unavailable | Caller continues; callee can process when available |
    | **Consistency** | Easy to implement strong consistency (request-response is atomic) | Requires explicit eventual consistency design; messages may be processed out of order |
    | **Latency (single request)** | Lower for single request (direct call) | Higher (broker overhead, queuing delay) |
    | **Debuggability** | Request-response traces are linear | Event chains require distributed tracing to follow |

    Neither is universally better — the right choice depends entirely on which quality attributes are highest priority in the utility tree.

---

### Question 10

A development team proposes that all inter-service communication should be asynchronous "because async is more modern and scalable." What ATAM evaluation principle should guide the evaluation team's response?

A. Agree — asynchronous communication always produces better quality attributes  
B. Challenge the decision — async is only acceptable for non-critical paths  
C. The communication style should be driven by utility tree quality attribute priorities, not architectural fashion  
D. Require the team to justify the decision in a design review  

??? note "Answer"
    The correct answer is **C**. ATAM's fundamental principle is that architectural decisions should be justified by their quality attribute effects relative to the stakeholder-prioritized scenarios in the utility tree, not by technical fashion or trend. If the utility tree shows (H,H) performance scenarios requiring synchronous request-response SLAs, or (H,H) strong consistency scenarios, asynchronous communication may be the wrong choice for those paths. Conversely, if availability and scalability are the dominant (H,H) scenarios and consistency is less critical, asynchronous communication is likely correct. The ATAM evaluator's job is to surface this analysis, not to prescribe a communication style.

---

### Question 11

Scenario: A new consumer team wants to add a second subscriber to the OrderPlaced event stream in an event-driven architecture. The (H,H) modifiability scenario requires "new event consumers can be added within one sprint without requiring changes to existing producers or consumers." The architecture currently has no schema registry and manages event schemas through a documentation wiki. What ATAM finding would you document?

??? note "Answer"
    Document this as an **architectural risk** for the modifiability scenario. The wiki-based schema management is a human process, not a technical enforcement mechanism. Without a schema registry: (1) A producer team can unknowingly break the new consumer's schema expectations by deploying a schema change that was documented in the wiki but not communicated directly; (2) Consumer development may discover schema incompatibilities only at integration or runtime, pushing the new consumer beyond the one-sprint target; (3) There is no automated validation that the new consumer's schema expectations are met by the current producer schema before deployment. The mitigation is a schema registry with compatibility enforcement — preventing producers from deploying schema changes that break registered consumers, and generating typed consumer code from registered schemas. Document severity as high (the scenario is (H,H)) and probability as medium-high (wiki drift is common as team sizes and velocity increase).

---

### Question 12 (Analyze)

A financial trading platform's ATAM evaluation reveals two (H,H) scenarios in direct tension: "Trade execution must respond in under 50ms at P99 under peak trading volume" (performance) and "Trade execution must continue with fallback pricing when the real-time pricing service is unavailable" (availability). The current architecture uses synchronous gRPC calls to the pricing service in the critical path. Analyze this as a tradeoff point, describe both resolution options, and identify what additional analysis is needed before a recommendation can be made.

??? note "Answer"
    This is a **tradeoff point**: the synchronous gRPC call *supports* the performance scenario (gRPC over HTTP/2 with binary serialization achieves sub-50ms under normal conditions) while *threatening* the availability scenario (when the pricing service is unavailable or slow, synchronous calls block until timeout, causing trade execution to fail or exceed the latency target). Resolution options: **Option 1 — Maintain synchronous gRPC**: performance scenario is preserved; availability scenario must be addressed through circuit breaker with cached pricing fallback (the circuit breaker trips when pricing is slow, substituting a cached price). Risk: the cached price may be stale — is stale pricing acceptable for fallback? **Option 2 — Switch to asynchronous with pre-cached pricing**: availability scenario is preserved; performance impact of async overhead must be measured — does the async path still achieve sub-50ms at P99? Additional analysis required: (1) What is the acceptable staleness of fallback pricing (business question for stakeholders, not a technical question)? (2) What is the measured P99 latency of the async path under peak load? (3) How frequently does the pricing service become unavailable — informing whether this is a high-probability or low-probability risk? The evaluation team should present both options with these data points to stakeholders and let the business priority drive the resolution.

---

*End of Quiz — Chapter 12*
