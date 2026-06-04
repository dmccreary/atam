# Quiz: Quality Attribute Scenarios

Test your understanding of the six-component scenario model, typed scenario families, brainstorming techniques, and prioritization. Each question is followed by a collapsed answer block.

## Questions

### Question 1

**[Remember]** Which of the following is the correct set of six components in the quality attribute scenario model?

A. Goal, actor, system, action, outcome, and metric  
B. Stimulus source, stimulus, environment, artifact, response, and response measure  
C. User, request, load, component, behavior, and threshold  
D. Input, context, system state, process, output, and quality level  

??? note "Answer"
    The correct answer is **B**. The six components are: **Stimulus source** (who or what initiates the event), **Stimulus** (the specific event or condition), **Environment** (the operational conditions), **Artifact** (the specific system element that must respond), **Response** (the system's observable behavior), and **Response measure** (the quantitative criterion for success). All six must be present for a scenario to be analytically useful — a scenario missing any component is too vague to drive architectural analysis or evaluate against an architecture.

---

### Question 2

**[Remember]** What is the difference between a **general scenario** and a **concrete scenario**?

A. A general scenario is written by architects; a concrete scenario is written by stakeholders  
B. A general scenario is a template describing a category of quality attribute situation; a concrete scenario instantiates that template with system-specific values in all six components  
C. A general scenario covers multiple quality attributes; a concrete scenario covers only one  
D. A general scenario is used in Phase 1; a concrete scenario is only produced in Phase 2  

??? note "Answer"
    The correct answer is **B**. A **general scenario** is a template-level scenario that describes a category of quality attribute situation without being specific to any particular system — it enumerates the logical space of concerns for a quality attribute and helps workshop participants generate scenarios by providing prompts. A **concrete scenario** instantiates a general scenario for a specific system, with specific values in every field. For example, a general availability scenario ("a component fails during peak load; the system degrades gracefully") becomes a concrete scenario when you specify which component, what "peak load" means quantitatively, which system element must respond, and what "degrades gracefully" means in measurable terms.

---

### Question 3

**[Remember]** In a scenario brainstorming session, what is the **"2am call" technique** designed to produce?

A. Usability scenarios that reflect the difficulty of learning the system  
B. Availability scenarios based on developer on-call experience  
C. The highest-severity scenarios by asking stakeholders what event would cause them to receive a 2am phone call  
D. Performance scenarios that reflect the system's peak load at night  

??? note "Answer"
    The correct answer is **C**. The "2am call" technique asks stakeholders: "What scenario, if it happened, would cause you to receive a phone call at 2am?" This reliably generates the highest-severity scenarios because it forces stakeholders to think about real consequences rather than theoretical concerns. The scenarios that emerge are those the stakeholder genuinely fears — which are precisely the scenarios most worth analyzing architecturally. While availability scenarios are common outputs, the technique can surface severe performance, security, and data loss scenarios as well.

---

### Question 4

**[Remember]** What does **dot voting** accomplish in an ATAM scenario prioritization session?

A. It selects which ATAM team members will present each section of the evaluation  
B. It determines which architectural pattern the team will adopt  
C. It produces a stakeholder-weighted priority ordering of scenarios quickly and transparently  
D. It assigns importance and difficulty ratings to utility tree nodes  

??? note "Answer"
    The correct answer is **C**. **Dot voting** gives each stakeholder a fixed number of votes (typically five) to allocate freely across candidate scenarios. The aggregate vote count produces a priority ranking. It is used specifically for scenario prioritization because it is fast (20 stakeholders can prioritize 50 scenarios in 15 minutes), transparent (every stakeholder sees the full vote distribution), conflict-revealing (when business and technical stakeholders vote for entirely different scenarios, the conflict is immediately visible), and produces a documented, stakeholder-endorsed priority ordering.

---

### Question 5

**[Understand]** Explain why the **response measure** is the most critical component in a quality attribute scenario, using an example from the chapter to illustrate your point.

??? note "Answer"
    The response measure is the only component that makes a scenario **evaluable** — it provides the quantitative criterion against which an architectural decision can be assessed. Without a response measure, a scenario is a wish, not a requirement. "The system recovers quickly" cannot drive architectural analysis because "quickly" provides no target. Does "quickly" mean 5 seconds? 30 seconds? 5 minutes? Each of those thresholds would require a completely different architectural approach (hot standby vs. warm standby vs. cold backup). The chapter's example: "p99 latency under 200ms at 500 concurrent users" is a response measure that tells the evaluation team exactly what to probe — which architectural approaches affect latency under this load, whether the current approach can achieve 200ms at the 99th percentile, and what the sensitivity points are. The chapter advises: if you find yourself writing a scenario without a number in the response measure field, stop and ask the stakeholder "quickly means what — 5 seconds? 30 seconds?" That discomfort forces the stakeholder to commit to a standard.

---

### Question 6

**[Understand]** Describe the characteristic structure of a **modifiability scenario** and explain how it differs structurally from a **performance scenario**.

??? note "Answer"
    A **modifiability scenario** specifies how much effort is required to implement a defined change. Its stimulus is a business requirement for a specific change (e.g., "add a new payment method"). Its response is the implementation and deployment of that change. Its response measure is expressed in terms of **cost and blast radius**: how many components must be changed, how many developer-days the change requires, and whether the change requires redeploying other components. Example: "A new payment method can be integrated with changes confined to the payment module and its adapter, completable in 5 developer-days, with no changes required to the checkout, cart, or order services." A **performance scenario** specifies how the system handles a workload demand. Its stimulus is a rate of arriving requests; its response is returning those requests; its response measure is expressed in terms of **time at a percentile** (P99 response time under Nms at X concurrent users). The structural difference: modifiability measures the cost of *changing* the system; performance measures the speed of the system *operating*.

---

### Question 7

**[Understand]** What is a **scenario catalog** and why is it described as a "living document" rather than a static deliverable?

??? note "Answer"
    The **scenario catalog** is the complete, organized collection of scenarios produced by the ATAM evaluation process. It is a living document — not archived after the evaluation — because it continues to serve the system's development lifecycle in several ways: it groups scenarios by quality attribute for ongoing reference; it includes priority scores and contributing stakeholder identities for traceability; it links each scenario to the architectural approaches it tests and the risks it reveals; and it includes fitness function specifications that provide continuous automated verification of high-priority scenarios. The catalog's most important living-document property is the direct link to fitness functions: every high-priority scenario with a quantitative response measure is a candidate fitness function in the CI/CD pipeline. As the system evolves, new scenarios can be added and old ones updated without invalidating the existing catalog — it grows with the system rather than being replaced.

---

### Question 8

**[Understand]** Explain **scenario coverage assessment** — what it checks and what evaluation teams do when they find coverage gaps.

??? note "Answer"
    **Scenario coverage assessment** is the post-brainstorming quality check that ensures the scenario catalog addresses all major quality attribute concerns before analysis begins. The evaluation team reviews the prioritized catalog and asks: Are all eight canonical quality attributes (performance, availability, security, modifiability, interoperability, scalability, reliability, usability) represented? Are the scenarios comprehensive for the system's domain? Are there obvious concerns from the stakeholder analysis that have not appeared as scenarios? A scenario catalog with 12 performance scenarios, 8 availability scenarios, and zero interoperability scenarios is not complete — the absence of interoperability scenarios likely means interoperability-focused stakeholders were underrepresented. When gaps are found, the evaluation team uses targeted prompts to fill them: "What external systems do you depend on, and what would happen if they changed their API?" or "What will be hardest to change in this system two years from now?" These targeted prompts reliably generate scenarios for the underrepresented quality attributes.

---

### Question 9

**[Apply]** Identify the missing or weak components in the following scenario and rewrite it as a complete, well-formed scenario: "The system must handle traffic spikes. Under heavy load, the system should scale automatically without impacting users."

??? note "Answer"
    **Problems with the original:** Stimulus source is unclear (what causes the spike?); stimulus is vague ("heavy load" — what specific load level?); environment is unspecified; artifact is unspecified (which components must scale?); response is mechanistically vague ("scale automatically"); response measure is completely absent ("without impacting users" is not measurable).

    **Well-formed rewrite:**
    - **Stimulus source:** Marketing campaign launch (the organization's own marketing team sends a promotional email to 500,000 subscribers at 9am)
    - **Stimulus:** User session rate increases from 1,000 to 8,000 concurrent sessions within 5 minutes of the campaign email delivery
    - **Environment:** Normal weekday operation; no prior degradation; infrastructure in steady state
    - **Artifact:** Web tier, application tier, and the auto-scaling infrastructure managing both
    - **Response:** Auto-scaling detects the load increase within 90 seconds, provisions additional compute instances, and distributes incoming sessions across the expanded pool
    - **Response measure:** P99 response time does not degrade more than 50ms above baseline (< 300ms total) during the scaling event; zero requests return 5xx errors during the scaling window; scaling completes within 3 minutes of the load increase beginning

---

### Question 10

**[Apply]** Write a complete, well-formed **availability scenario** for a distributed e-commerce system, using the template structure described in the chapter. The scenario should address a database node failure during a high-traffic period.

??? note "Answer"
    **Availability scenario — database node failure during peak load:**
    - **Stimulus source:** Infrastructure monitoring agent
    - **Stimulus:** Primary PostgreSQL order database node receives an OOM (out-of-memory) kill signal and becomes unresponsive; health check fails for 3 consecutive checks (15 seconds)
    - **Environment:** Black Friday peak load: 3,500 concurrent checkout sessions active, 150 orders per minute being processed
    - **Artifact:** Order service and its database connection layer, including connection pool and failover configuration
    - **Response:** Connection pool detects the primary node failure, promotes the hot-standby replica to primary within two health-check cycles, reroutes all new connections to the promoted replica; in-flight write transactions are automatically retried once against the new primary; the system continues processing new orders
    - **Response measure:** Service downtime (complete inability to process any order) under 20 seconds; zero committed transaction data lost; in-flight transactions either complete successfully or return an explicit, customer-visible error (not silent failure); order processing rate returns to normal within 30 seconds of failover completion

---

### Question 11

**[Apply]** After a scenario brainstorming session for a financial services trading platform, you review the catalog: 15 performance scenarios, 7 availability scenarios, 4 security scenarios, 1 modifiability scenario, 0 interoperability scenarios, and 0 usability scenarios. Diagnose the coverage problem and describe specifically how you would address each gap.

??? note "Answer"
    **Diagnosis:** The catalog reflects the concerns of technical/operational stakeholders (performance, availability) and partially reflects security concerns, but is severely underrepresented in modifiability, interoperability, and usability. For a financial trading platform, all three gaps are significant risks: trading systems must integrate with exchanges, market data feeds, and clearing houses (interoperability); regulatory changes require system modifications (modifiability); and traders depend on the interface being fast and error-tolerant (usability). **Addressing modifiability gap:** Invite business analysts and compliance officers to a targeted session with the prompt: "What regulatory changes have affected trading systems in the past 3 years? What business capability changes do you anticipate needing in the next 2 years?" These prompts reliably generate modifiability scenarios. **Addressing interoperability gap:** Invite integration team leads and dependent system owners (exchange connectivity team, clearing house interface team) to specifically generate scenarios around: "What would happen if the exchange changed its API format? What if the market data provider changed their protocol?" **Addressing usability gap:** Invite actual traders (end users) or user research representatives: "What interface behaviors cause errors that cost money? What response time degradation causes traders to make wrong decisions?" These prompts ground usability scenarios in measurable business consequences rather than subjective preference.

---

### Question 12

**[Analyze]** The chapter states that the scenario catalog "connects ATAM's analytical output directly to the development team's day-to-day engineering practice — making the evaluation a living part of the system's evolution rather than a one-time audit." Analyze the specific mechanisms through which a scenario catalog achieves this connection, and evaluate the conditions under which this connection is most likely to break down.

??? note "Answer"
    The scenario catalog achieves the connection to daily engineering practice through three specific mechanisms: (1) **Fitness function derivation** — every high-priority scenario with a quantitative response measure becomes a fitness function specification: a performance test in the load testing suite, a chaos engineering test for availability scenarios, a security integration test for security scenarios. These run on every build, making scenario adherence a continuous engineering check rather than a periodic audit. (2) **Definition of done integration** — scenarios become acceptance criteria for features that touch the architectural areas they probe; a new checkout feature isn't "done" until the relevant performance and availability scenarios are verified against it. (3) **ADR linkage** — each architectural decision that affects a high-priority scenario is documented in an Architecture Decision Record, creating traceable documentation of why the decision was made and which scenarios it was designed to address. The connection is most likely to break down under several conditions: (a) the fitness functions are written but their failure is not treated as a blocking condition (it becomes an alert that teams learn to ignore); (b) the scenario catalog is treated as a document artifact rather than a living reference — it is written once and not updated as the system evolves, causing it to drift out of alignment with actual stakeholder priorities; (c) team turnover causes the connection between scenarios and implementation decisions to become tacit knowledge that leaves with the original team, and new team members don't know why specific tests exist or what architectural property they protect.

