# Quiz: Architecture Principles and Governance

Test your understanding of architecture governance mechanisms, principles, fitness functions, and evolutionary architecture. Each question is followed by a collapsed answer block.

## Questions

### Question 1

**[Remember]** Which of the following best describes an **architecture principle**?

A. A mandatory technical constraint imposed by a regulatory body  
B. A declarative statement that guides architectural decision-making, with explicit rationale  
C. A diagram showing the system's component relationships  
D. A specific technology choice that all teams must use  

??? note "Answer"
    The correct answer is **B**. An architecture principle is a declarative statement that guides how teams reason about the system — not a requirement specifying what the system must do. Crucially, effective principles carry explicit **rationale** explaining why the principle exists, not just what it says. This allows engineers to recognize edge cases where the principle applies and when principled exceptions are warranted. Option A describes an **architectural constraint** (non-negotiable), Option C describes a view/diagram, and Option D describes an **architecture standard**.

---

### Question 2

**[Remember]** What are the four functions of an effective **Architecture Review Board (ARB)**?

A. Hiring architects, writing code standards, conducting security audits, and approving budgets  
B. Standard-setting, review and approval, waiver management, and continuous evolution  
C. Deploying systems, monitoring runtime behavior, managing incidents, and approving releases  
D. Writing reference architectures, interviewing vendors, selecting cloud providers, and training teams  

??? note "Answer"
    The correct answer is **B**. The four ARB functions are: (1) **Standard-setting** — defining and publishing architecture principles, reference architectures, and standards; (2) **Review and approval** — evaluating significant architectural decisions for conformance and risk; (3) **Waiver management** — adjudicating legitimate deviations from standards with documented rationale; and (4) **Continuous evolution** — updating standards as technology and business needs change. The other options describe operational, hiring, or procurement activities that are not ARB responsibilities.

---

### Question 3

**[Remember]** In the technology radar, what do the four rings — **Adopt, Trial, Assess, Hold** — represent?

A. The four quadrants of technology categories (languages, tools, platforms, techniques)  
B. The four stages of a technology's market maturity curve  
C. Four levels of adoption recommendation from "safe to use broadly" to "avoid in new projects"  
D. Four levels of organizational authority required to approve a technology  

??? note "Answer"
    The correct answer is **C**. The rings represent adoption recommendations: **Adopt** means the technology is proven and recommended for broad use without ARB review; **Trial** means it shows promise but requires careful justification; **Assess** means teams should explore it but not yet commit to production use; **Hold** means avoid using it in new projects (it may be acceptable in existing systems but should not be introduced fresh). The quadrants (option A) are the four *categories* on the radar, separate from the rings.

---

### Question 4

**[Remember]** What is a **system context diagram** and when is it used in ATAM?

A. A diagram showing the internal microservices of a system and their APIs  
B. A diagram placing the system under evaluation at the center, showing all external entities that interact with it, used as the first architectural artifact in ATAM evaluations  
C. A diagram showing the deployment topology of servers and containers  
D. A timeline diagram showing how the architecture will evolve over three years  

??? note "Answer"
    The correct answer is **B**. A system context diagram shows only the system's **boundary** and **external interactions** — not its internal structure. It includes: the system under evaluation as a clear central element, all direct human users and their roles, all external systems, and directional arrows showing information flows. In ATAM evaluations it is typically the first architectural artifact presented, enabling stakeholders (many non-technical) to confirm they agree on the system's scope before analyzing internal decisions.

---

### Question 5

**[Understand]** Explain the difference between an **architecture principle** and an **architectural constraint**, using a concrete example of each.

??? note "Answer"
    An **architecture principle** is a guideline for decision-making — it guides reasoning but allows principled exceptions when the rationale supports deviation. Example: "All inter-service communication must be asynchronous unless the business scenario requires synchronous response." Teams can deviate if they can justify the need for synchrony. An **architectural constraint** is a non-negotiable boundary that cannot be overridden — it arises from regulatory requirements, contractual obligations, or physical limits. Example: "All personally identifiable data must remain within EU jurisdiction" (imposed by GDPR). A team cannot simply decide this is inconvenient and override it. The key distinction: principles guide choices within a solution space; constraints bound the solution space itself.

---

### Question 6

**[Understand]** The chapter describes the **governance gap** — the distance between the architecture you intended and the architecture you actually have. Explain how this gap arises and name three governance mechanisms that help close it.

??? note "Answer"
    The governance gap arises because systems evolve under real-world pressures: deadline pressure, team turnover, incomplete understanding of constraints, and accumulated shortcuts. Each small deviation — a shared database introduced under time pressure, a direct cross-layer call added for convenience — moves the implemented architecture further from the intended design. Over time, these deviations compound into a "distributed monolith" or other unintended structural form. Three governance mechanisms that close the gap: (1) **Architecture principles** with explicit rationale — giving teams the reasoning to make correct decisions independently; (2) **Automated conformance checking** using tools like ArchUnit, which enforce architectural rules as CI/CD tests that fail builds on violations; (3) **Architecture fitness functions** — executable tests for quality attribute thresholds (e.g., p99 latency < 200ms) that run continuously and alert when architectural properties degrade.

---

### Question 7

**[Understand]** Explain the concept of **separation of concerns** and describe the architectural problem that occurs when concerns are NOT separated.

??? note "Answer"
    **Separation of concerns**, articulated by Dijkstra in 1974, is the principle that a software element should address one — and only one — coherent responsibility. When concerns are properly separated, changes are localized: a change to the data access layer should not require changes to the presentation layer. When concerns are NOT separated, changes **cascade**: a bug fix in the payment module touches the user interface; a database schema change breaks the reporting service. These cascade effects are the architectural debt that ATAM is designed to surface before implementation makes them expensive. Concretely, if a presentation layer component reaches directly into the data access layer (bypassing the business logic layer), then a database schema change must be coordinated with both the data layer and the presentation layer simultaneously — doubling the blast radius of the change.

---

### Question 8

**[Understand]** What is an **architecture fitness function**, and how does it differ from a traditional software test?

??? note "Answer"
    An **architecture fitness function** is an objective function that evaluates how well the current architecture satisfies a specific architectural characteristic. The key difference from a traditional test: a traditional test verifies *functional correctness* (does the code do what it's supposed to?); a fitness function verifies *architectural properties* (is the structural or quality attribute property still being maintained?). Examples: a fitness function might assert that no class in the `presentation` package imports from the `data` package (structural), that API p99 latency is below 200ms (performance), or that all PII fields are encrypted (compliance). Fitness functions make architectural constraints **executable** — they encode governance rules as tests that run continuously in CI/CD pipelines, turning architectural violations into build failures rather than audit findings.

---

### Question 9

**[Apply]** Your organization's reference architecture specifies Kubernetes for container orchestration, but a new project team proposes using bare-metal deployments because their workload is latency-sensitive and they believe the Kubernetes overhead is unacceptable. Describe the correct governance process and what the ARB should require from the team.

??? note "Answer"
    This is a **waiver request** to the Architecture Review Board. The correct process: the team submits a waiver request documenting their rationale — a concrete cost-benefit analysis, measured performance data showing the Kubernetes overhead actually exceeds acceptable thresholds, and an assessment of the operational risks (managing bare-metal infrastructure without orchestration). The ARB should evaluate: (1) Is the performance concern supported by evidence, or is it speculative? (2) What availability, modifiability, and deployability scenarios does bare-metal threaten (no rolling updates, no self-healing, no declarative configuration)? (3) Are there mitigating Kubernetes configurations (bare-metal Kubernetes, specific scheduling policies) that address the latency concern without full deviation? If the waiver is granted, it should be **time-bounded** (with a review at 12 months), document the rationale for the exception, and include a technology radar review trigger. The ADR for this decision should be filed.

---

### Question 10

**[Apply]** A team has a quality attribute scenario: "Under normal load, the product recommendation API must return results in under 300ms at p99." Write a fitness function specification for this scenario, specifying the tool type, trigger, assertion, and threshold.

??? note "Answer"
    **Fitness function specification:**
    - **Name:** Recommendation API Latency p99
    - **Category:** Performance
    - **Tool type:** Load testing tool (e.g., k6, Gatling, or Locust)
    - **Trigger:** Run on every pull request merge to main branch, and on a scheduled nightly run
    - **Test setup:** Send a sustained load of 100 virtual users making recommendation API requests for 5 minutes (representing "normal load" as defined in the scenario)
    - **Assertion:** p99 response time of the recommendation API endpoint must be ≤ 300ms
    - **Threshold:** Any result where p99 > 300ms fails the build (or triggers an alert for the nightly run)
    - **Evidence preserved:** Test run report with full latency distribution stored as a build artifact for audit purposes
    This fitness function makes the scenario continuously verifiable — it becomes part of the architecture's immune system, catching performance regressions before they reach production.

---

### Question 11

**[Apply]** A well-intentioned but overloaded ARB approves every proposal submitted to it within 24 hours, regardless of quality. A second ARB takes 6-8 weeks to review any proposal and is known for rejecting projects on procedural grounds. Identify the anti-pattern each ARB represents and describe what an effective ARB does differently.

??? note "Answer"
    The first ARB is the **rubber-stamp ARB** — a review body that approves everything because it lacks the authority, information, or time to do otherwise. The rubber stamp provides the form of governance without the substance; teams learn they can submit anything and it will be approved. The second ARB is the **bottleneck ARB** — so demanding and slow that teams learn to route around it, building systems without review or creating "shadow" architecture governance outside the formal process. An effective ARB does three things differently: (1) **Reviews early**, when architecture is a sketch rather than a running system, so changes are still cheap; (2) **Operates with clear, published criteria** — teams know before submitting what evidence is required; (3) **Delegates decisions appropriately** — settling decisions once at the organizational level and empowering individual architects to make decisions within established principles, reserving formal review for significant deviations.

---

### Question 12

**[Analyze]** The chapter describes **evolutionary architecture** as an approach that "embraces change as inevitable and designs systems to adapt incrementally without losing structural integrity." Analyze the relationship between evolutionary architecture and ATAM. How do the outputs of an ATAM evaluation contribute to an organization's ability to practice evolutionary architecture?

??? note "Answer"
    Evolutionary architecture and ATAM are complementary and mutually reinforcing practices. ATAM produces four outputs — risks, non-risks, sensitivity points, and tradeoff points — each of which directly informs evolutionary architecture practice. **Risks** become the first targets for fitness function coverage: if an ATAM evaluation identifies a risk that the architecture may violate a specific quality attribute under certain conditions, a fitness function encoding that scenario's response measure makes the risk continuously visible. **Sensitivity points** identify which architectural decisions have the strongest effect on specific quality attributes — these are precisely the decisions that evolutionary architecture must protect or carefully manage as the system changes. **Tradeoff points** become the constraints that bound architectural evolution: if a particular decision simultaneously affects two quality attributes in opposing directions, future changes that touch that decision must be evaluated for their effect on both attributes. The utility tree from ATAM provides the quality attribute priority ordering that fitness functions enforce — ensuring that as the system evolves, it evolves *within* the stakeholder-validated quality attribute bounds rather than drifting away from them.

