# Quiz: Quality Attributes

Test your understanding of quality attribute definitions, taxonomy, conflicts, and the stimulus-response framework. Each question is followed by a collapsed answer block.

## Questions

### Question 1

**[Remember]** Which of the following is a **quality attribute requirement**, not a functional requirement?

A. "The system must allow users to reset their password via email."  
B. "The system must calculate quarterly tax liability from submitted transactions."  
C. "The password reset flow must complete in under 3 seconds for 99% of requests."  
D. "The system must store customer orders in a relational database."  

??? note "Answer"
    The correct answer is **C**. A **quality attribute requirement** specifies *how well* the system does something — it characterizes operational or developmental properties rather than specific capabilities. "Under 3 seconds for 99% of requests" is a performance quality attribute requirement. Options A, B, and D all specify *what* the system must do (password reset capability, tax calculation capability, data storage capability) — these are functional requirements. The distinction is architecturally significant because functional requirements tell you what to build, while quality attribute requirements constrain *how* to build it.

---

### Question 2

**[Remember]** The SEI quality attribute taxonomy divides attributes into two major categories. Which pair correctly labels these categories and gives an accurate example of each?

A. Functional attributes (e.g., usability) and non-functional attributes (e.g., performance)  
B. Runtime attributes (observable in a running system, e.g., availability) and development-time attributes (manifest during development/operations, e.g., modifiability)  
C. User-facing attributes (e.g., usability) and system-facing attributes (e.g., scalability)  
D. Static attributes (e.g., modifiability) and dynamic attributes (e.g., security)  

??? note "Answer"
    The correct answer is **B**. The SEI taxonomy groups quality attributes into **runtime attributes** — those observable in a running system (performance, availability, security, usability, reliability, interoperability, scalability) — and **development-time attributes** — those that manifest during development and operations (modifiability, testability, deployability, portability). This taxonomy is more than organization: runtime attributes often trade off against each other through operational behavior, while development-time attributes often trade off through the cost of architectural mechanisms. Runtime and development-time attributes frequently trade off against each other through structural complexity.

---

### Question 3

**[Remember]** Which of the following quality attribute conflicts is specifically caused by the CAP theorem?

A. Security vs. Usability (authentication friction reduces ease of use)  
B. Modifiability vs. Performance (abstraction layers add indirection overhead)  
C. Scalability vs. Consistency (horizontal scale often requires eventual consistency)  
D. Deployability vs. Reliability (frequent deployments increase transient risk)  

??? note "Answer"
    The correct answer is **C**. The **CAP theorem** (Consistency, Availability, Partition tolerance) states that in the presence of a network partition, a distributed system must choose between consistency and availability. Achieving horizontal scalability requires distributing state across nodes, which creates network partitions under failure conditions — forcing a choice between strong consistency and high availability/scalability. Options A, B, and D describe real quality attribute conflicts from the chapter's table, but none is specifically driven by the CAP theorem.

---

### Question 4

**[Remember]** What are the six components of the **architectural stimulus-response** model for quality attribute requirements?

A. Goal, scenario, architecture, tactics, risks, and tradeoffs  
B. Stimulus source, stimulus, environment, artifact, response, and response measure  
C. User, action, system, result, metric, and priority  
D. Input, processing, output, latency, reliability, and security level  

??? note "Answer"
    The correct answer is **B**. The six components are: **Stimulus source** (who or what generates the event), **Stimulus** (the specific event or condition), **Environment** (the conditions under which the stimulus occurs), **Artifact** (the specific system element that must respond), **Response** (the system's behavior in response), and **Response measure** (the quantitative criterion that determines whether the response is acceptable). This structure is the bridge from vague quality attribute statements to analyzable, testable requirements — and is the foundation of ATAM quality attribute scenarios.

---

### Question 5

**[Understand]** Explain the distinction between **availability** and **reliability** as quality attributes, using a concrete example to illustrate the difference.

??? note "Answer"
    **Availability** measures the fraction of time the system is operational and accessible — it is a time-based metric (e.g., 99.9% availability means the system is up 99.9% of the time). **Reliability** measures the probability that the system performs its required functions *correctly* under stated conditions — it is a correctness metric. A system can be available but not reliable: imagine a financial reporting system that is always running (high availability) but occasionally produces incorrect tax calculations due to a floating-point rounding bug (low reliability). Conversely, a batch processing system that runs once a week might have low availability (it is only "up" briefly) but be highly reliable (when it runs, it always produces correct results). In ATAM, these are evaluated separately: availability scenarios probe failure recovery and uptime; reliability scenarios probe correctness and error rates.

---

### Question 6

**[Understand]** Explain why **modifiability** is described in the chapter as "an investment" and connect this to the concept of option value.

??? note "Answer"
    The chapter frames modifiability as an option on future change — investing in modifiability now (through clear interfaces, separation of concerns, and lower coupling) preserves the ability to make changes cheaply later when the business requires them. Like a financial option, modifiability investment has an upfront cost (architectural complexity, interface discipline, development time for clean abstractions) and a future payoff (each required change is cheaper than it would otherwise be). Systems with long expected lifespans under active development justify high modifiability investment because the option will be exercised many times. Short-lived or read-only systems justify less modifiability investment because the option is rarely exercised. This framing connects modifiability directly to the architecture business case from Chapter 4: an architecture team can justify modifiability investment by estimating how many changes will be needed, how much each change costs under the current architecture, and how much cheaper each change becomes under a more modifiable architecture.

---

### Question 7

**[Understand]** The **Quality Attribute Workshop (QAW)** is described as the recommended preparation technique before ATAM Phase 1. Describe its purpose and explain how it differs from the scenario brainstorming that happens in Phase 2.

??? note "Answer"
    The **QAW** is a facilitated technique, developed at the SEI alongside ATAM, specifically for eliciting quality attribute requirements from diverse stakeholder groups who have not yet worked together to articulate those requirements. It guides stakeholders through structured scenario generation exercises to produce a prioritized scenario set that feeds into the utility tree construction. The key difference from Phase 2 scenario brainstorming: the QAW is a **pre-evaluation preparation activity** designed to extract initial quality attribute requirements before the formal evaluation begins — it produces the raw material that populates the initial utility tree in Phase 1. Phase 2 scenario brainstorming is a **within-evaluation activity** that extends and validates the utility tree already constructed in Phase 1, adding scenarios from the broader stakeholder community that the architecture team may not have anticipated. The QAW is narrow (building the initial dataset); Phase 2 brainstorming is broad (validating and extending that dataset with diverse perspectives).

---

### Question 8

**[Understand]** **Testability** and **deployability** are described as "modern attributes" that have grown in architectural significance since the original ATAM framework. Explain how each of these attributes is affected by architectural decisions, using one example of an architecture pattern or style that supports each.

??? note "Answer"
    **Testability** is the ease with which a system can be verified through testing. Architectural decisions directly determine testability by controlling whether components can be exercised in isolation and whether dependencies can be substituted. The **hexagonal architecture (ports and adapters)** pattern strongly supports testability: by separating the domain core from infrastructure through defined interfaces (ports), the core logic can be tested without live databases, external services, or network connectivity — injecting test doubles through the ports instead. **Deployability** is the ease and safety of releasing new versions. Architectural decisions around deployment independence, observability, and rollback capability determine deployability. **Microservices architecture** strongly supports deployability: each service can be deployed independently with zero-downtime strategies (blue-green, canary), and a failed service deployment affects only that service's functionality rather than requiring a full-system rollback.

---

### Question 9

**[Apply]** A stakeholder says: "Our system must be highly secure." Using the six-component stimulus-response model, transform this vague statement into a well-formed quality attribute requirement for a login API.

??? note "Answer"
    **Well-formed security requirement using the six-component model:**
    - **Stimulus source:** External attacker
    - **Stimulus:** 5,000 login attempts using known username/password pairs from a credential-stuffing attack, originating from 500 distinct IP addresses over 15 minutes
    - **Environment:** Normal business operation (system not currently under other attacks or degradation)
    - **Artifact:** Authentication service and its rate-limiting/account-lockout infrastructure
    - **Response:** Rate limiting activates after 5 failed attempts per account within 10 minutes; affected accounts are locked pending user verification via a secondary channel; attack traffic is blocked at the edge; all failed attempts are logged with timestamp, source IP, and target account identifier
    - **Response measure:** Zero successful unauthorized logins during the attack window; legitimate users with correct credentials are unaffected; each failed attempt is logged within 1 second of occurrence

---

### Question 10

**[Apply]** An architecture team is designing a system with three simultaneous quality attribute requirements rated (H,H) in their utility tree: sub-100ms API response time, 99.99% availability, and end-to-end encryption of all data. Using the quality attribute conflict table from the chapter, identify at least two conflicts among these three requirements and suggest how each might be managed architecturally.

??? note "Answer"
    **Conflict 1: Performance vs. Security.** End-to-end encryption adds computational overhead (TLS handshake costs, encryption/decryption per-request CPU consumption) that competes directly with the sub-100ms response time requirement. Management: Offload TLS termination and encryption to a dedicated hardware security module (HSM) or a purpose-built security infrastructure layer (API gateway with hardware-accelerated TLS). Use session token caching to amortize authentication costs across multiple requests rather than full verification per request. **Conflict 2: Performance vs. Availability.** Achieving 99.99% availability requires redundancy (multiple replicas), and keeping replicas in sync requires coordination protocols that add latency — particularly for write operations that must be acknowledged by multiple replicas before returning. Management: Use asynchronous replication for non-critical operations (accepting slightly relaxed consistency for reads) and synchronous replication only for operations where data loss would be catastrophic. Design read paths to serve from replicas without coordination overhead. Note: the goal is not to eliminate these conflicts but to manage them so the architectural decisions stay within acceptable bounds on all three quality attributes simultaneously.

---

### Question 11

**[Apply]** A product manager says, "Scalability is our top priority." An operations lead says, "Availability is my top priority." Describe the **quality attribute prioritization process** an ATAM facilitator would use to resolve this disagreement, and explain why "splitting the difference" (treating both as equally important) is not an acceptable resolution.

??? note "Answer"
    The ATAM facilitator's role is not to decide who is right, but to make the tradeoff explicit and guide the stakeholders to a defensible decision. The process: (1) Make the **conflict line visible**: "Achieving maximum scalability often requires eventual consistency (trading consistency for availability-at-scale), while achieving maximum availability may require synchronous replication that limits horizontal scalability — these pull in different directions." (2) **Elicit concrete consequences**: Ask the product manager "what specific scale scenario are you worried about?" and the operations lead "what specific failure scenario are you worried about?" — often the concrete answers reveal that the scenarios don't actually conflict (e.g., the scale scenario is about user growth, the availability scenario is about hardware failure; both can be addressed simultaneously). (3) If genuine conflict remains, escalate to a **decision-making authority** who can make the business call. Why "splitting the difference" is wrong: treating both as equally important produces an architecture that is designed to satisfy neither fully — it neither scales as well as a purely scalability-optimized design, nor is as available as a purely availability-optimized design. Documented, explicit prioritization enables the architecture to commit to the right set of tactics for the chosen priority.

---

### Question 12

**[Analyze]** The chapter states that "quality attributes are not checkboxes — they are dimensions of a design space, and architectural decisions are positions in that space." Analyze this statement by examining how a single architectural decision — choosing to use an in-memory cache (e.g., Redis) for a user session store — simultaneously affects at least four quality attributes, both positively and negatively.

??? note "Answer"
    The decision to use an in-memory cache for user session storage is a single architectural choice that positions the system simultaneously along multiple quality attribute dimensions: **Performance (positive):** Session lookups from an in-memory store like Redis are typically sub-millisecond, dramatically faster than database-backed session storage. This directly supports sub-second response time requirements. **Availability (mixed):** Adding Redis as a required dependency for session validation creates a new single point of failure — if Redis becomes unavailable, authenticated users cannot be validated, effectively taking the application offline for all authenticated operations. Mitigated by Redis Cluster or Sentinel configuration for high availability, but these add operational complexity. **Security (threat):** In-memory session stores with long TTLs extend the window during which a stolen session token can be used — the session survives server restarts and is accessible across multiple application instances (expanding the attack surface compared to a per-server session). **Modifiability (positive/negative):** The cache becomes a shared infrastructure dependency — easy to swap for a different cache technology (low coupling to any specific implementation) but creates operational coupling between the application and the Redis infrastructure version and configuration. **Scalability (positive):** Redis enables stateless application servers — because session state is externalized, any application server can handle any user's request, enabling horizontal scaling without sticky sessions. This shows how a single architectural decision produces a complex, multi-dimensional position in quality attribute space — not a simple "good" or "bad" outcome.

