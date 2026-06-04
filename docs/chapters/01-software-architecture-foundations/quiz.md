# Quiz: Software Architecture Foundations

Test your understanding of the core vocabulary and concepts of software architecture. Each question is followed by a collapsed answer block.

## Questions

### Question 1

**[Remember]** Which of the following best defines "software architecture" according to the SEI formulation used in this chapter?

A. A set of UML diagrams that document the components in a system  
B. The set of structures needed to reason about a system, encompassing elements, their externally visible properties, and relationships among them  
C. The implementation blueprint that developers follow when writing code  
D. A collection of design patterns applied to solve recurring problems  

??? note "Answer"
    The correct answer is **B**. The SEI definition emphasizes three things: *structures* (plural — no single diagram captures everything), *reasoning* (architecture is a cognitive tool, not decoration), and *externally visible properties* (architecture is concerned with what is observable at interfaces between parts, not internal implementation details). Options A and C describe artifacts or activities, not the concept itself. Option D describes design patterns, which are a different level of abstraction.

---

### Question 2

**[Remember]** Which of the following is an example of an **architectural connector**, not an architectural component?

A. A payment processing microservice  
B. A relational database  
C. An asynchronous Kafka topic  
D. An API gateway  

??? note "Answer"
    The correct answer is **C**. An architectural **connector** is an interaction mechanism — a pathway through which components communicate, coordinate, and share data. A Kafka topic is a connector: it is the conduit between a producer component and one or more consumer components. Options A, B, and D are all **components** — principal computational elements or data stores that "do work" and appear at the level of the system's overall structure.

---

### Question 3

**[Remember]** According to the chapter, what is the "blast radius" test used to distinguish between architectural decisions and design decisions?

A. The test measures how much CPU and memory a decision consumes  
B. The test assesses whether a decision's consequences propagate through the entire system or remain localized to one module  
C. The test calculates the financial cost of reversing a decision  
D. The test determines how many security vulnerabilities a decision introduces  

??? note "Answer"
    The correct answer is **B**. The "blast radius" test asks: does this decision's consequences propagate across the whole system (architectural decision) or stay primarily within one module (design decision)? A decision whose effects are felt by multiple components, constrain future options across the system, and produce observable non-functional consequences is architectural. A decision affecting only the internal structure of one component is a design decision.

---

### Question 4

**[Remember]** What is the difference between an **architecture viewpoint** and an **architecture view**?

A. A viewpoint is created by executives; a view is created by engineers  
B. A viewpoint is the specification (the "recipe"); a view is the artifact produced by applying that specification to a specific system (the "dish")  
C. A viewpoint shows the runtime behavior; a view shows the static structure  
D. A viewpoint is informal; a view is a formal, machine-processable document  

??? note "Answer"
    The correct answer is **B**. The chapter uses the mnemonic "a viewpoint is the recipe; a view is the dish." A viewpoint defines the rules — what elements to show, what relationships matter, who the audience is. A view is the actual artifact you produce by applying those rules to your specific system. One viewpoint (e.g., a deployment viewpoint) can be applied to many different systems, producing a different view for each.

---

### Question 5

**[Understand]** Explain why software architecture requires **multiple views** rather than a single comprehensive diagram.

??? note "Answer"
    A software architecture cannot be captured in a single diagram because any single representation emphasizes some aspects and necessarily obscures others. This is not a documentation failure — it is a fundamental property of complex systems. Different stakeholders have different concerns: a security engineer needs to see trust boundaries and authentication flows; a performance engineer needs to see data volumes and latency paths; a developer needs to see module dependencies and interfaces. These audiences have different questions requiring different views. Multiple views together give a complete picture that no single diagram can provide.

---

### Question 6

**[Understand]** An organization uses a shared PostgreSQL database accessed directly by three different microservices. Explain the architectural concern this creates, using the vocabulary of components, connectors, and quality attributes.

??? note "Answer"
    The shared database is a **connector** — a pathway through which the three microservices communicate indirectly by reading and writing shared state. This type of connector creates **tight coupling** between the services: a schema change to the database requires coordinating changes across all three services simultaneously, eliminating independent deployability. This connector choice primarily threatens **modifiability** (high blast radius for database schema changes) and **deployability** (services cannot deploy independently). It also creates potential **performance** contention (shared connection pools, lock conflicts) and **availability** risk (a database failure affects all three services at once). The chapter notes this as "a somewhat notorious" connector type precisely because of these quality attribute implications.

---

### Question 7

**[Understand]** The chapter describes technical debt using Ward Cunningham's metaphor from 1992. Explain the metaphor and why **architectural debt** is considered the most dangerous form of technical debt.

??? note "Answer"
    Technical debt is the accumulation of shortcuts, workarounds, and suboptimal decisions that make future work harder — like financial debt, it accrues interest: the longer you carry it, the more it costs to service. Architectural debt is the most dangerous species because architectural shortcuts propagate into every component that touches the affected area. A single poorly-chosen coupling point between services can silently constrain team autonomy, deployment independence, and performance headroom across the entire system — often for years before anyone names it as the source of the problem. Unlike a local code quality issue, which affects one module, an architectural shortcut affects everything built against the flawed assumption.

---

### Question 8

**[Understand]** Compare two architectural styles from the chapter's table — **Event-Driven** and **Client-Server** — on the dimensions of scalability and simplicity. What tradeoff does each make?

??? note "Answer"
    **Event-Driven** architecture has loose coupling and natural scalability as its primary strength — events can fan out to multiple consumers and consumers can scale independently. Its core tradeoff is that gaining scalability comes at the cost of observability and debugging complexity (tracing a transaction through asynchronous events is much harder than following a synchronous call). **Client-Server** architecture has conceptual simplicity and a clear separation between requester and provider as its primary strength, but the central server becomes a bottleneck as load grows, limiting scalability. Its tradeoff is simplicity vs. scalability. Event-Driven systems must invest in observability tooling to compensate for debugging complexity; Client-Server systems must add load balancing and horizontal scaling patterns to compensate for the single-server bottleneck.

---

### Question 9

**[Apply]** A team is designing a new e-commerce platform. They need to support rapid feature additions by multiple teams simultaneously and plan to grow from 1,000 to 1,000,000 users within 18 months. Based on the architectural style table in this chapter, which style(s) are best aligned with their quality attribute priorities, and what tradeoffs must they consciously accept?

??? note "Answer"
    The team's priorities are **modifiability** (rapid feature additions by multiple teams) and **scalability** (1,000× growth). The **microservices** style is best aligned: it provides independent deployability (multiple teams can ship without coordinating deployments) and horizontal scalability (services scale independently based on load). The tradeoffs they must consciously accept are: (1) **operational complexity** — managing many independent deployments requires robust DevOps tooling, service discovery, distributed tracing, and monitoring; (2) **performance** — network overhead between services is orders of magnitude slower than in-process calls, requiring careful attention to synchronous call chains; (3) **availability** — synchronous dependency chains create cascade failure risk that must be addressed with circuit breakers and graceful degradation. Accepting these tradeoffs consciously — and planning for them — is exactly what architecture-centric development and ATAM enable.

---

### Question 10

**[Apply]** A startup decides to defer all architectural documentation because "we move too fast for docs." Using Boehm's cost curve described in this chapter, explain the risk this creates and what they should do instead.

??? note "Answer"
    Boehm's cost curve shows that an architecture defect found during architecture review costs approximately 1× to fix; found during integration, it costs ~100×; found in production, the multiplier can reach 1000×. By deferring documentation, the team is not eliminating architectural decisions — they are making them implicitly, without shared understanding or deliberate evaluation. When these implicit decisions turn out to be wrong (as they frequently do), fixing them requires coordinating changes across all the code that depended on the flawed assumption. The risk is a "debt spiral" where accumulated architectural shortcuts make every future change more expensive. The practical alternative is lightweight, continuous documentation using Architecture Decision Records (ADRs) — short documents that capture what was decided and why — which takes minutes per decision but preserves the reasoning that prevents expensive future surprises.

---

### Question 11

**[Apply]** You are reviewing a quality goal statement from a project stakeholder: "The system should perform well under load." Rewrite this as a proper **architecture quality goal** as defined in this chapter.

??? note "Answer"
    The original statement is too vague to be evaluable — it provides no target for architectural decisions to aim at. A proper architecture quality goal is specific, measurable, and stakeholder-approved. An example rewrite: "Under peak load of 10,000 concurrent users, 95% of product search queries must complete in under 500 milliseconds, measured at the API gateway." This version specifies the load condition (10,000 concurrent users), the specific operation (product search), the percentile (95th), the response time target (500ms), and the measurement point (API gateway). This specificity is the entire point — only with this level of precision can an architectural decision be evaluated against the goal.

---

### Question 12

**[Analyze]** The chapter states that "architecture evaluation is the analytical core of what ATAM enables." Analyze why **timing** is critical to the value of architecture evaluation. What makes evaluation *before* implementation so much more valuable than evaluation *after* implementation?

??? note "Answer"
    Timing is critical because architectural decisions have a specific cost structure: they are inexpensive to change when they are still on paper (or in a design document), and exponentially expensive to change once they have been implemented across the codebase. Once an architectural decision is implemented, every component built against it has inherited its assumptions. Fixing a flawed assumption then requires coordinating changes across all those dependent components — touching potentially hundreds of files, migrating live data, managing organizational friction, and scheduling downtime. Architecture evaluation before implementation preserves optionality: the evaluation surfaces problems at the moment when the cost of changing course is still low. After implementation, the same problems become expensive retrofits. Beyond cost, there is a compounding factor: architectural debt accrues interest — the longer a flawed decision remains in place, the more new code is written against it, and the more expensive the eventual correction becomes. ATAM's power is specifically its ability to systematically surface risks *at the moment of maximum leverage*.

