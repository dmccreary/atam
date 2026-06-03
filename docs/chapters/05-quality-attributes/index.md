---
title: Quality Attributes
description: The eight canonical ATAM quality attributes, plus testability, deployability, safety, and others — their definitions, taxonomy, conflicts, prioritization, and translation into measurable requirements.
generated_by: claude skill chapter-content-generator
date: 2026-06-03 00:05:00
version: 0.08
---

# Quality Attributes

## Summary

Quality attributes are the measurable properties of a system — performance, availability, security, modifiability, and more — that drive architectural decision-making in ATAM. This chapter defines each quality attribute precisely, explains how they are organized in a quality taxonomy, and examines the conflicts that arise when multiple attributes compete for the same architectural resources. Students also learn to distinguish quality attribute requirements from functional requirements and to structure requirements in the stimulus-response form that feeds directly into scenario construction.

## Concepts Covered

This chapter covers the following 22 concepts from the learning graph:

1. Quality Attribute Definition
2. Performance Quality Attribute
3. Availability Quality Attribute
4. Security Quality Attribute
5. Modifiability Quality Attribute
6. Interoperability Quality Attribute
7. Scalability Quality Attribute
8. Reliability Quality Attribute
9. Usability Quality Attribute
10. Testability Quality Attribute
11. Deployability Quality Attribute
12. Portability Quality Attribute
13. Safety Quality Attribute
14. Maintainability Quality Attr
15. Energy Efficiency Quality Attr
16. Quality Attribute Taxonomy
17. Quality Attribute Conflict
18. Quality Attribute Prioritization
19. Functional vs Quality Req
20. Quality Attribute Requirement
21. Architectural Stimulus Response
22. Quality Attribute Workshop

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Software Architecture Foundations](../01-software-architecture-foundations/index.md)
- [Chapter 4: Stakeholder and Business Analysis](../04-stakeholder-business-analysis/index.md)

---

!!! mascot-welcome "The Vocabulary of Architectural Excellence"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Vista waving welcome">
    Fellow architects, from up here Vista can see the whole landscape of software quality — and it is a glorious mess of competing demands. Performance wants everything fast. Security wants everything locked down. Modifiability wants everything loose and flexible. These forces push in different directions simultaneously, and your job is to understand them precisely enough to navigate the tradeoffs. This chapter is your quality attribute field guide. Master this vocabulary and you will never again be lost in a stakeholder conversation about "system quality." Let's weigh the tradeoffs!

## Functional vs. Quality Requirements: The Critical Distinction

Before we define individual quality attributes, we need to nail a distinction that trips up even experienced architects: the difference between **functional requirements** and **quality attribute requirements**.

A **functional requirement** specifies what a system must *do* — the capabilities, behaviors, and features the system provides. "The system must allow users to reset their password via email" is a functional requirement. "The system must calculate quarterly tax liability from submitted transaction data" is a functional requirement.

A **quality attribute requirement** (also called a non-functional requirement or a *-ility*) specifies how *well* the system must do what it does. It characterizes the operational or developmental properties of the system rather than its specific capabilities. "The password reset flow must complete in under three seconds for 99% of requests" is a quality attribute requirement. "The tax calculation must be auditable — every input and output must be logged with sufficient detail to reconstruct any computation" is a quality attribute requirement.

The architectural significance of this distinction is profound. Functional requirements tell you *what* to build. Quality attribute requirements tell you *how* to build it — they constrain the architectural decisions about structure, patterns, and technologies. Two systems with identical functional requirements can have wildly different architectures depending on their quality attribute requirements. A payment processor and a personal finance app might both need to "store transaction records," but the performance, security, and availability requirements for those two systems produce entirely different architectural choices.

In ATAM, quality attribute requirements are the primary subject of evaluation. The utility tree is a hierarchy of quality attribute scenarios, not functional scenarios. The risks and tradeoff points ATAM identifies are quality attribute risks. The architectural approaches ATAM analyzes are quality attribute tactics. Functional requirements matter — but they are not ATAM's analytical focus.

## Quality Attribute Definition and Taxonomy

A **quality attribute** is a measurable or testable property of a system that indicates how well the system satisfies the needs of its stakeholders beyond its core functional behavior. The IEEE 25010:2011 standard provides one of the most widely referenced taxonomies; the SEI quality attribute model used in ATAM identifies eight primary attributes that cover the majority of real-world architectural concerns.

The eight canonical ATAM quality attributes are:

- **Performance** — how quickly and efficiently the system responds to requests
- **Availability** — the fraction of time the system is operational and accessible
- **Security** — the system's ability to resist unauthorized access and malicious interference
- **Modifiability** — the ease with which the system can be changed to accommodate new requirements
- **Interoperability** — the system's ability to exchange information and work cooperatively with other systems
- **Scalability** — the system's ability to handle growing workloads without degradation
- **Reliability** — the system's ability to perform its required functions without failure
- **Usability** — the ease with which intended users can achieve their goals

Beyond the canonical eight, several additional quality attributes appear regularly in modern system evaluation:

- **Testability** — the ease with which the system can be verified through testing
- **Deployability** — the ease and safety with which new versions can be released to production
- **Portability** — the ease with which the system can be moved to different environments or platforms
- **Safety** — the system's ability to avoid causing unacceptable harm to people or the environment
- **Maintainability** — the ease with which the system can be diagnosed, corrected, and adapted over time
- **Energy efficiency** — the system's consumption of computational resources per unit of useful work

These attributes are organized into a **quality attribute taxonomy** that groups them by concern area. The SEI taxonomy groups quality attributes into two major categories: **runtime attributes** (those that are observable in a running system, such as performance, availability, security, and usability) and **development-time attributes** (those that manifest during development and operations, such as modifiability, testability, deployability, and portability).

This taxonomy is more than organizational tidiness. The two categories tend to conflict differently. Runtime quality attributes often trade off against each other in the system's operational behavior. Development-time attributes often trade off against each other through the cost of architectural mechanism. And runtime attributes frequently trade off against development-time attributes through added structural complexity — security mechanisms add latency; testability infrastructure adds development overhead; deployability pipelines add operational cost.

## The Eight Core Quality Attributes in Depth

### Performance

**Performance** refers to the system's responsiveness — specifically, the relationship between incoming requests (stimuli) and the system's responses in terms of throughput, latency, and resource utilization.

Performance is almost always specified in terms of two primary metrics:

- **Latency:** The elapsed time between a request and its response. Latency is typically specified at a percentile (p50, p95, p99) rather than an average, because averages hide the tail latency that creates the worst user experiences.
- **Throughput:** The rate at which the system processes requests — transactions per second, messages per second, or requests per minute.

Performance is the quality attribute most sensitive to architectural choices about synchrony, caching, data access patterns, and resource allocation. Synchronous request chains are the most common performance trap — a system that chains six synchronous service calls to fulfill a single user request compounds their latencies multiplicatively. Caching, asynchronous processing, and pre-computation are the most common performance tactics.

### Availability

**Availability** is the proportion of time the system is operational and delivering its intended service, typically expressed as a percentage (99.9% = "three nines," 99.99% = "four nines"). The corollary to availability is **downtime** — a system with 99.9% annual availability experiences approximately 8.7 hours of downtime per year; 99.99% allows about 52 minutes per year.

Availability encompasses two sub-properties: **reliability** (how infrequently failures occur) and **recoverability** (how quickly the system recovers when failures do occur). A system can achieve high availability through high reliability (building components that rarely fail), high recoverability (detecting failures and recovering quickly), or both.

The architectural tactics for availability include redundancy (eliminating single points of failure), health monitoring and active redundancy, rollback and rollforward recovery, and graceful degradation (continuing to provide reduced service when full service is unavailable).

### Security

**Security** in the quality attribute sense refers to the system's ability to protect its assets — data, functionality, and computational resources — from unauthorized access, disclosure, modification, and disruption. Security encompasses four classic sub-properties: **confidentiality** (data accessible only to authorized entities), **integrity** (data modified only by authorized means), **availability** (system accessible only to authorized users), and **non-repudiation** (actions attributable to their actors).

Security is the quality attribute most likely to trade off against performance (encryption adds computational overhead), usability (authentication friction reduces ease of use), and modifiability (security mechanisms that cross-cut many components are harder to change).

### Modifiability

**Modifiability** is the ease and cost with which a system can be changed to accommodate new requirements, fix defects, or adapt to environmental changes. Modifiability is typically evaluated in terms of the **blast radius** of a change — how many components must be modified, rebuilt, and redeployed to implement a given change — and the **coupling** between components that determines the blast radius.

Modifiability is one of the most strategically important quality attributes because architectural decisions made early in a system's life determine its modifiability for years afterward. A system with poor modifiability accumulates architectural debt — each change becomes more expensive than the last, and eventually the system reaches a state where meaningful evolution requires full re-platforming.

!!! mascot-thinking "Modifiability Is an Investment"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Vista thinking">
    Here is a useful mental model for modifiability: think of it as an option on future change. A more modifiable architecture is worth more in expectation because it preserves the ability to make changes cheaply when the business requires them. The cost of modifiability investment is paid upfront (in architectural complexity, clear interfaces, and separation of concerns); the return is collected over the system's lifetime every time a change is needed. Systems with long expected lifespans under active development justify high modifiability investment. Short-lived systems or read-only systems justify less. This framing connects modifiability directly to the business case analysis from Chapter 4.

### Interoperability

**Interoperability** is the system's ability to exchange information and invoke services with other systems, operating correctly both individually and cooperatively. Interoperability has two aspects: **syntactic interoperability** (the systems can exchange data in compatible formats) and **semantic interoperability** (the systems agree on the meaning of the exchanged data).

Modern architectures face interoperability challenges at multiple levels: API compatibility (versioning, backward compatibility), data format compatibility (JSON, XML, Protobuf), identity and authentication compatibility (OAuth, SAML, certificates), and semantic compatibility (does "customer" in System A mean the same thing as "customer" in System B?).

### Scalability

**Scalability** is the system's ability to handle increasing workload without degradation — either by handling more requests with existing resources (vertical scaling) or by adding resources proportionally (horizontal scaling). Scalability is closely related to performance and availability but distinct: a system can be high-performance under low load and unscalable under high load; a system can be highly available for a small user base and unavailable for a large one.

Horizontal scalability (adding more servers rather than bigger servers) is the architectural goal of most modern distributed systems because it avoids the physical limits of vertical scaling and the single points of failure that large single servers create. Achieving horizontal scalability requires stateless or externalized state management — the most common scalability tactic.

### Reliability

**Reliability** is the probability that the system performs its required functions correctly under stated conditions for a specified period. It is related to but distinct from availability: availability measures the fraction of time the system is operational; reliability measures the correctness of operation when it is running. A system that is always available but produces incorrect results is available but not reliable.

### Usability

**Usability** is the ease, efficiency, and satisfaction with which intended users accomplish their goals using the system. Usability encompasses learnability (how quickly a new user becomes proficient), efficiency (how quickly an experienced user completes tasks), error tolerance (how well the system prevents and recovers from user errors), and satisfaction (how pleasant the experience is).

Usability is the quality attribute most directly tied to user behavior, making it difficult to specify precisely without user research. In architectural terms, usability drives decisions about response time (slow systems are perceived as difficult to use), error handling (graceful error messages versus cryptic failure codes), and progressive disclosure (complex features available but not cluttering the interface for typical users).

#### Diagram: Quality Attribute Taxonomy and Conflict Map

<iframe src="../../sims/quality-attribute-taxonomy/main.html" width="100%" height="542px" scrolling="no"></iframe>

<details markdown="1">
<summary>Quality Attribute Taxonomy and Conflict Map</summary>
Type: diagram
**sim-id:** quality-attribute-taxonomy<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Visualize the quality attribute taxonomy (runtime vs. development-time categories), and show the common conflict lines between quality attributes as interactive edges that reveal the specific tradeoff when clicked.

Bloom Level: Analyze (L4) — Differentiate between runtime and development-time quality attributes, and identify common conflict pairs with their architectural tradeoff implications.
Bloom Verb: Differentiate

Learning Objective: Students will be able to classify quality attributes into runtime and development-time categories, identify at least five common quality attribute conflict pairs, and explain the architectural tradeoff each conflict represents.

Canvas layout:
- Two large vertical bands: "Runtime Quality Attributes" (left, light blue) and "Development-Time Quality Attributes" (right, light orange)
- Quality attribute nodes as labeled circles placed within the appropriate band
- Red dashed lines connecting conflicting attribute pairs, with a conflict label on the line
- A detail panel below that shows the conflict description and typical architectural manifestation when a conflict line is clicked

Runtime attributes (blue circles):
- Performance, Availability, Security, Usability, Reliability, Interoperability, Scalability

Development-time attributes (orange circles):
- Modifiability, Testability, Deployability, Portability, Safety, Maintainability, Energy Efficiency

Conflict lines (red dashed):
- Performance ↔ Security ("encryption/decryption overhead adds latency")
- Performance ↔ Availability ("redundancy adds routing overhead")
- Security ↔ Usability ("authentication friction reduces ease of use")
- Scalability ↔ Consistency ("horizontal scale often requires eventual consistency")
- Modifiability ↔ Performance ("abstraction layers add indirection overhead")
- Deployability ↔ Reliability ("frequent deployments increase transient risk")
- Testability ↔ Performance ("instrumentation and observability hooks add overhead")
- Interoperability ↔ Security ("open APIs increase attack surface")

Interactive elements:
- Click any quality attribute circle to see its full definition and example measurement
- Click any conflict line to see the specific architectural tradeoff, a realistic example, and common mitigation approaches
- Toggle "Show Runtime Only" and "Show Development-Time Only" buttons
- A "Quiz Me" mode where conflict lines are hidden and student is asked to identify which pairs conflict

Color scheme: Blue for runtime attributes, Orange for development-time attributes. Red for conflict lines. Gold for selected/highlighted items.

Responsive: Layout scales to container width; attributes reflow to a list on very narrow screens.
</details>

## Quality Attribute Conflicts: Where Tradeoffs Live

The most intellectually rich terrain in quality attribute analysis is not the definitions — it is the **conflicts**. A **quality attribute conflict** occurs when improving one quality attribute inherently degrades another, given the current architecture and available resources. These conflicts are ATAM's tradeoff points — and they are the places where architectural judgment is most valuable.

The following table summarizes the most commonly observed quality attribute conflicts in distributed systems, with the architectural mechanism that creates each conflict:

| Conflict Pair | Mechanism | Common Resolution Tactics |
|--------------|-----------|--------------------------|
| Performance vs. Security | Encryption, authentication, and authorization all consume CPU cycles and add latency | Offload to dedicated security infrastructure (API gateways, hardware security modules) |
| Scalability vs. Consistency | Distributed state management requires coordination protocols that add latency and conflict with horizontal scaling | Choose consistency level by operation (strong for writes, eventual for reads) |
| Modifiability vs. Performance | Abstraction layers and dependency injection add indirection; interfaces add marshaling overhead | Accept the overhead for non-critical paths; optimize only hot paths |
| Availability vs. Consistency | CAP theorem: in the presence of network partitions, choose availability or consistency | Design for eventual consistency with conflict resolution, or use strong consistency only for critical transactions |
| Security vs. Interoperability | Tight access controls and proprietary formats resist integration; open APIs increase attack surface | Federated identity, API gateways, and security-as-a-service |
| Deployability vs. Reliability | Frequent deployments introduce transient failures; zero-downtime deployment adds complexity | Feature flags, blue-green deployments, canary releases |

Notice that the resolution tactics in the table do not eliminate the conflict — they manage it. This is a fundamental truth about quality attribute tradeoffs: they cannot be fully resolved, only allocated. The goal is not to find an architecture that has no tradeoffs, but to find one whose tradeoffs align with the stakeholder priorities established in the utility tree.

## Quality Attribute Prioritization

Given that quality attributes conflict, every architectural decision implicitly prioritizes some quality attributes over others. **Quality attribute prioritization** makes this implicit ordering explicit, defensible, and traceable to stakeholder input.

Prioritization is not an architectural exercise — it is a stakeholder exercise facilitated by architects. The evaluation team does not decide which quality attribute is most important; the stakeholders do, guided by the business goal and driver analysis from Chapter 4. The evaluation team's role is to:

1. Make the conflict lines explicit: "Optimizing performance here will degrade modifiability in the following way..."
2. Present options with their tradeoff implications: "We can achieve the performance target with this caching approach, at the cost of accepting eventual consistency for up to 30 seconds..."
3. Facilitate the stakeholder decision: "Given these tradeoffs, which would you accept?"
4. Document the decision and its rationale for the architectural record

The primary mechanism for capturing prioritization is the utility tree (Chapter 7), but the conceptual work of prioritization begins here, with a clear understanding of what each quality attribute means and what conflicts it creates.

!!! mascot-tip "The Prioritization Superpower Move"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Vista giving a tip">
    Vista's pro tip for quality attribute prioritization workshops: before you discuss priorities, make the conflict lines visible. Draw a conflict matrix on a whiteboard — or use the interactive taxonomy from this chapter — and invite stakeholders to see which attributes trade off against which. Once stakeholders see that "security AND performance AND modifiability all at maximum" is physically impossible in the same architectural decision, the prioritization conversation shifts from "I want everything" to "given these constraints, which matters most for this system." That framing shift is often where ATAM's most valuable insights emerge.

## Additional Quality Attributes in the Modern Stack

The canonical eight ATAM quality attributes predate cloud-native architectures, DevOps, and AI-augmented systems. Several additional quality attributes have grown in architectural significance since the original ATAM framework was published:

**Testability** — the ease with which the system can be verified — has become a first-class architectural concern with the adoption of test-driven development and continuous delivery. Architectures with high testability are designed so that components can be exercised in isolation, dependencies can be substituted, and behavior can be observed without running the full system. Hexagonal architecture (ports and adapters) is the canonical pattern for testability; it separates core domain logic from infrastructure so that tests do not require live databases, external services, or network connectivity.

**Deployability** — the ease and safety of releasing new versions — drives the entire DevOps and continuous delivery movement. Architectures with high deployability support small, frequent, reversible deployments with automated verification. The key architectural properties are: deployment independence (modules can deploy without coordinating with other modules), observability (the effects of a deployment are visible in near-real-time), and rollback capability (a bad deployment can be reversed without data loss).

**Safety** — the avoidance of harm — is a mandatory quality attribute in any system where software failures can cause physical, financial, or societal harm. Safety-critical systems (medical devices, automotive systems, industrial controls, aircraft) have formal safety standards (IEC 61508, DO-178C, ISO 26262) that impose specific architectural requirements: fail-safe defaults, hardware interlocks, redundant processing channels, and formal verification of safety-critical components.

**Energy efficiency** is increasingly important as large-scale cloud deployments, AI workloads, and sustainability commitments place computational resource consumption under organizational scrutiny. Architecturally, energy efficiency is achieved through workload consolidation, right-sizing, event-driven processing (no polling), and deferred/batched non-time-critical processing.

## Stimulus-Response Form and Quality Attribute Requirements

The bridge from quality attribute concept to ATAM scenario is the **architectural stimulus-response** model. A quality attribute requirement expressed only as an adjective ("the system must be highly available") is not analyzable. It provides no target for architectural decisions to aim at and no criterion against which an evaluation can assess the architecture.

A quality attribute requirement expressed in stimulus-response form is both analyzable and testable. The basic structure is:

- **Stimulus source:** The entity that generates the stimulus (a user, an external system, the passage of time, a failure)
- **Stimulus:** The event or condition that triggers a response
- **Environment:** The conditions under which the stimulus arrives (normal load, peak load, degraded mode, during deployment)
- **Artifact:** The specific system element that must respond
- **Response:** The system's behavior in response to the stimulus
- **Response measure:** The quantitative criterion by which the response is evaluated

This six-component structure is the foundation of ATAM quality attribute scenarios, which Chapter 6 develops in full detail. For now, the key insight is that a good quality attribute requirement is a scenario stub — it specifies everything needed to evaluate whether an architectural decision achieves the required quality.

The **Quality Attribute Workshop (QAW)** is a facilitated technique, developed at the SEI alongside ATAM, specifically for eliciting quality attribute requirements from diverse stakeholder groups. A QAW session guides stakeholders through structured scenario generation exercises, producing a prioritized scenario set that feeds directly into the utility tree construction. QAW is the recommended preparation technique for ATAM Phase 1 when stakeholders have not previously worked together to articulate quality attribute requirements.

#### Diagram: Quality Attribute Requirement Construction Workbench

<iframe src="../../sims/qa-requirement-workbench/main.html" width="100%" height="562px" scrolling="no"></iframe>

<details markdown="1">
<summary>Quality Attribute Requirement Construction Workbench</summary>
Type: microsim
**sim-id:** qa-requirement-workbench<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive tool for constructing quality attribute requirements in stimulus-response form, with immediate feedback on whether the requirement is specific and measurable enough to be useful in an ATAM evaluation.

Bloom Level: Apply (L3) — Use the stimulus-response framework to construct well-formed quality attribute requirements from vague stakeholder statements.
Bloom Verb: Use

Learning Objective: Students will be able to take a vague quality attribute statement ("the system must be fast") and transform it into a well-formed six-component stimulus-response requirement suitable for ATAM scenario construction.

Canvas layout:
- Left panel: Six labeled input fields corresponding to the stimulus-response components (Stimulus Source, Stimulus, Environment, Artifact, Response, Response Measure)
- Center: A "Quality Meter" visualization that scores the requirement's specificity (0-100%) based on how many fields are filled with specific, measurable content
- Right panel: "Assessment" showing which quality attribute the requirement addresses and a "Is This ATAM-Ready?" verdict
- Below: Three example tabs showing vague-to-specific transformations for Performance, Availability, and Security

Input field prompts:
- Stimulus Source: "Who or what triggers this? (user, external system, internal timer...)"
- Stimulus: "What exactly happens? (submits a request, sends a message, component fails...)"
- Environment: "Under what conditions? (normal load, peak load, degraded mode, during deployment...)"
- Artifact: "Which system element must respond? (login service, database, API gateway...)"
- Response: "What must the system do? (return results, send alert, failover to replica...)"
- Response Measure: "How do you measure success? (< Xms at p99, < X% error rate, within X seconds...)"

Quality Meter scoring:
- Each field that contains generic text ("fast", "good", "high") adds 5 points
- Each field with specific, measurable content adds 15 points
- Maximum 90 points when all six fields have specific content
- 90-100: "ATAM-Ready — this is a well-formed scenario"
- 60-89: "Getting there — add specificity to response measure and environment"
- Below 60: "Too vague — stakeholders and architects cannot use this"

Example transformations:
- Performance example: "The system must be fast" → six-component version with p99 latency < 200ms at 500 concurrent users
- Availability example: "High availability" → 99.9% uptime with recovery within 30 seconds of failure detection
- Security example: "The system must be secure" → unauthorized access attempt triggers lockout after 5 failed attempts within 60 seconds, logged with timestamp and source IP

Behavior:
- As student fills fields, Quality Meter animates to new score
- Quality attribute auto-detected from stimulus keywords (e.g., "latency" → Performance, "fails" → Availability)
- "Evaluate" button shows detailed feedback on each field
- "Load Example" button pre-fills a vague example for student to improve

Instructional Rationale: Active construction with real-time feedback is appropriate because the Apply objective requires students to practice the transformation with concrete values. The Quality Meter gamifies specificity, making the value of measurable requirements immediately felt.

Color scheme: Red at 0-40%, Yellow at 40-70%, Green at 70-100% on the Quality Meter. Blue for input fields, Gold for field headers.

Responsive: Panels stack vertically on narrow screens.
</details>

## Putting Quality Attributes to Work in ATAM

The purpose of the quality attribute vocabulary developed in this chapter is to enable precise architectural conversation. When a stakeholder says "the system must be reliable," the ATAM evaluator's job is to ask: "What does 'reliable' mean specifically for this system? What is the stimulus — what event are you worried about? What response measure would tell you that the system is reliable enough?"

That conversion from adjective to stimulus-response scenario is where the analytical power enters. Once every quality attribute concern is expressed as a measurable scenario, the evaluation team can assess architectural decisions against concrete targets rather than vague aspirations.

Quality attributes are not checkboxes. They are dimensions of a design space, and architectural decisions are positions in that space. ATAM's job — enabled by the precise vocabulary of this chapter — is to map the position of the proposed architecture in that space and assess whether it is close enough to the targets that matter most to the stakeholders who will live with the consequences.

#### Diagram: Quality Attribute Coverage Dashboard

<iframe src="../../sims/qa-coverage-dashboard/main.html" width="100%" height="552px" scrolling="no"></iframe>

<details markdown="1">
<summary>Quality Attribute Coverage Dashboard</summary>
Type: chart
**sim-id:** qa-coverage-dashboard<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Radar chart showing quality attribute coverage for a hypothetical system, allowing students to explore how architectural decisions shift the profile, with clickable attributes revealing the key architectural decisions that affect each.

Bloom Level: Evaluate (L5) — Assess a system's quality attribute profile and identify which architectural decisions are most responsible for its strengths and weaknesses.
Bloom Verb: Assess

Learning Objective: Students will be able to interpret a quality attribute radar chart for a given system, identify which attributes are well-addressed and which are risks, and connect specific quality attribute scores to the architectural decisions that produce them.

Canvas layout:
- Central radar/spider chart with eight axes for the core ATAM quality attributes
- A "Current Architecture" polygon plotted in blue
- A "Target Requirements" polygon plotted in orange (thinner, dashed)
- Gap between polygons highlighted in red where requirements exceed current scores
- Legend and quality attribute detail panel to the right
- Dropdown to select from three example systems (e-commerce, healthcare records, IoT platform)

Axes and example scores for e-commerce system:
- Performance: Current=8, Target=9 (gap highlighted)
- Availability: Current=9, Target=9
- Security: Current=6, Target=8 (significant gap)
- Modifiability: Current=5, Target=7 (gap)
- Interoperability: Current=7, Target=7
- Scalability: Current=8, Target=9 (gap)
- Reliability: Current=8, Target=8
- Usability: Current=7, Target=7

Interactive elements:
- Click any axis label to see: definition, current score rationale, target score rationale, top three architectural decisions affecting this attribute, and suggested improvement tactics
- Toggle between three example systems to compare profiles
- "Edit Scores" mode: drag polygon vertices to explore how changing one attribute affects others (with conflict warnings when moving conflicting attributes in the same direction simultaneously)
- "Show Conflicts" overlay: draws red dashed lines between conflicting attributes when both are moved toward target simultaneously

Color scheme: Blue for current architecture, Orange for targets, Red for gaps. Gold for selected axis.

Responsive: Radar chart scales to container width.
</details>

!!! mascot-celebration "You Speak Quality Attribute Fluently Now!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Vista celebrating">
    Look at you — you went from "the system must be fast" to "p99 latency must be under 200ms at 500 concurrent users during peak Black Friday load on the checkout API." That is the transformation that makes ATAM work. You now have the vocabulary to turn every vague stakeholder wish into a concrete, measurable, architecturally analyzable requirement. In the next chapter, you'll learn to package these requirements into the formal quality attribute scenario structure that feeds the utility tree. Your superpower level just increased significantly!

## Key Takeaways

Quality attributes are the dimensions along which architectural excellence is measured and traded:

- **Quality attribute requirements** specify *how well* a system does something; **functional requirements** specify *what* it does — and architectural decisions are driven primarily by quality attribute requirements
- **The eight canonical ATAM quality attributes**: performance, availability, security, modifiability, interoperability, scalability, reliability, and usability
- **Additional modern attributes**: testability, deployability, portability, safety, maintainability, and energy efficiency
- **Quality attribute taxonomy** divides attributes into runtime (observable in a running system) and development-time (manifest during development and operations)
- **Quality attribute conflicts** are unavoidable — every architectural decision privileges some attributes over others; ATAM's job is to make these conflicts visible and stakeholder-resolved rather than implicit and accidental
- **Quality attribute prioritization** is a stakeholder activity facilitated by architects, not a technical activity performed by architects alone
- **The stimulus-response form** (stimulus source, stimulus, environment, artifact, response, response measure) transforms vague quality attribute statements into analyzable, testable requirements
- **The Quality Attribute Workshop (QAW)** is the recommended preparation technique for eliciting quality attribute requirements from diverse stakeholder groups before ATAM Phase 1

??? question "Self-Check: Quality Attribute Mastery — Click to Reveal Answers"
    **Q1:** Classify each of the following as functional requirement (F) or quality attribute requirement (QA): (a) "Users can reset their password via email." (b) "Password reset must succeed for 99% of attempts within 5 seconds." (c) "The system must encrypt all passwords using bcrypt." (d) "The system must process 10,000 transactions per hour."

    **Answer:** (a) F — this specifies what the system does. (b) QA — this specifies how well it does it (performance). (c) This is borderline: it specifies a concrete technical constraint (encryption algorithm choice), which makes it a **quality attribute requirement instantiated as a constraint** — specifically, a security implementation standard. (d) QA — throughput is a performance quality attribute requirement.

    ---

    **Q2:** A stakeholder says, "Security is our highest priority — we cannot compromise on it." A second stakeholder says, "We absolutely need sub-100ms response times or users will abandon the app." Explain what quality attribute conflict this represents and describe one architectural approach that could mitigate — but not eliminate — the conflict.

    **Answer:** This is a **Security vs. Performance** conflict. Security measures (TLS encryption, authentication token verification, authorization checks) all consume CPU cycles and add latency, so a strict security posture tends to degrade performance. One mitigation: offload security enforcement to a dedicated **API gateway or sidecar proxy** that handles authentication and authorization as close to the network edge as possible, using hardware-accelerated TLS and pre-validated tokens cached for the duration of a session. This reduces the per-request security overhead from full verification to cache lookup, improving latency while maintaining security coverage. The conflict is not eliminated — the gateway itself adds a network hop — but the latency cost is reduced from O(full-auth) to O(cache-lookup).

    ---

    **Q3:** Convert the following vague requirement into well-formed stimulus-response form: "The system must recover quickly from database failures."

    **Answer:** Example well-formed version — Stimulus source: Internal health monitor. Stimulus: Primary database node becomes unresponsive (health check fails for 3 consecutive checks). Environment: Normal business hours, 200 concurrent active sessions. Artifact: User-facing application tier and its database connection layer. Response: Automatically failover to read replica, promote replica to primary, and resume serving requests with at most one failed transaction per active session. Response measure: Total time to full service restoration is under 30 seconds; error rate during failover window does not exceed 0.5% of concurrent sessions.
