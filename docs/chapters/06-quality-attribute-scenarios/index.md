---
title: Quality Attribute Scenarios
description: The six-component stimulus-response scenario model, general and concrete scenarios, brainstorming techniques, prioritization, and typed scenario families for performance, availability, security, modifiability, and scalability.
generated_by: claude skill chapter-content-generator
date: 2026-06-03 00:20:00
version: 0.08
---

# Quality Attribute Scenarios

## Summary

Scenarios are the primary analytical tool in ATAM — they translate abstract quality attribute requirements into concrete, testable statements about system behavior under specific conditions. This chapter teaches students to construct well-formed scenarios using the six-component stimulus-response model (stimulus source, stimulus, environment, artifact, response, and response measure), and to work from general scenarios toward concrete, system-specific instances. Students also practice the scenario brainstorming and prioritization techniques used in live ATAM workshops, and learn the five typed scenario families that correspond to the most commonly evaluated quality attributes.

## Concepts Covered

This chapter covers the following 18 concepts from the learning graph:

1. Quality Attribute Scenario
2. Scenario Stimulus Source
3. Scenario Stimulus
4. Scenario Environment
5. Scenario Artifact
6. Scenario Response
7. Scenario Response Measure
8. General Scenario
9. Concrete Scenario
10. Scenario Brainstorming
11. Scenario Prioritization
12. Scenario Coverage Assessment
13. Scenario Catalog
14. Performance Scenario
15. Availability Scenario
16. Security Scenario
17. Modifiability Scenario
18. Scalability Scenario

## Prerequisites

This chapter builds on concepts from:

- [Chapter 4: Stakeholder and Business Analysis](../04-stakeholder-business-analysis/index.md)
- [Chapter 5: Quality Attributes](../05-quality-attributes/index.md)

---

!!! mascot-welcome "Scenarios: The Superpower's Ammunition"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Vista waving welcome">
    Fellow architects, here is something that separates ATAM practitioners from everyone else at the architecture review table: they think in scenarios. Not in adjectives ("fast," "secure," "scalable"), not in technologies ("microservices," "Kubernetes," "GraphQL"), but in precise, testable, cause-and-effect statements about what the system must do when specific things happen. This chapter is where you develop that skill. By the end, you will construct scenarios so crisp that any architect can evaluate an architecture against them without asking a single clarifying question. That is your ATAM superpower in action!

## Why Scenarios? From Ambiguity to Analysis

The central challenge of software architecture evaluation is this: architectural decisions are abstract, but their consequences are concrete. An architect who says "we will use a shared-nothing microservices architecture" is describing a structural choice. The stakeholders who will live with the consequences care about something very different — will my search query complete in under two seconds? Will the system stay up when the payment service crashes? Will my team be able to add a new product category without touching the recommendation engine?

A **quality attribute scenario** bridges this gap. It translates an abstract quality attribute requirement into a concrete, testable statement of system behavior under specific conditions. Scenarios are the unit of analysis in ATAM — every risk, every sensitivity point, every tradeoff point is identified and evaluated relative to specific scenarios.

Before we dissect the scenario structure, let us establish precise definitions for the terms we will use throughout this chapter:

- **Quality Attribute Scenario:** A concrete, stimulus-response statement that specifies, under defined conditions, what a system must do to satisfy a specific quality attribute requirement
- **Stimulus Source:** The entity (person, system, time-based trigger) that generates the initiating event
- **Stimulus:** The specific event or condition that triggers the system's response
- **Environment:** The operational conditions under which the stimulus occurs (normal load, peak load, failure mode, startup, etc.)
- **Artifact:** The specific system element, component, or subsystem that is stimulated and must respond
- **Response:** The behavior the system exhibits in response to the stimulus
- **Response Measure:** The quantitative criterion that determines whether the response is acceptable

These six components together form a complete, unambiguous specification of an architectural requirement. Any scenario that cannot be expressed in all six components is too vague to drive architectural analysis.

## General vs. Concrete Scenarios

The SEI quality attribute taxonomy distinguishes between **general scenarios** and **concrete scenarios**. Understanding this distinction is important for scenario workshops because it explains why you start with general scenarios and refine them into concrete ones, rather than trying to construct concrete scenarios from scratch.

A **general scenario** is a template-level scenario that describes a category of quality attribute situation without being specific to any particular system. General scenarios are valuable because they enumerate the logical space of concerns for a quality attribute — they help workshop participants generate scenarios by providing prompts rather than blank pages.

For example, the SEI's general scenarios for availability include:

- A fault occurs (crash, error, omission, incorrect timing, incorrect value) under normal operation; the system masks the fault and continues normal operation with no downtime
- A fault occurs during peak load; the system degrades gracefully and continues serving critical functions at reduced capacity
- Maintenance is performed during a maintenance window; the system is unavailable for no more than a specified duration

A **concrete scenario** instantiates a general scenario for a specific system, with specific values in every field. The first general availability scenario above might become, for an e-commerce checkout system:

- **Stimulus Source:** Internal health monitor
- **Stimulus:** Payment processing service becomes unresponsive (connection timeout after 5 seconds)
- **Environment:** Black Friday, 2,000 concurrent checkout sessions active
- **Artifact:** Checkout flow and payment processing integration
- **Response:** Checkout flow displays "payment temporarily unavailable — your cart is saved" and queues the payment for retry; remaining checkout steps (address, shipping) continue normally
- **Response Measure:** Zero checkout sessions lost; payment retry succeeds within 3 minutes for 99% of queued transactions; total revenue impact under $10,000 per hour of payment disruption

That transformation — from general template to specific instance — is the work of a scenario workshop. The general scenario provides the prompt; stakeholders provide the system-specific details; the evaluation team ensures the response measure is quantitative.

!!! mascot-thinking "The Response Measure Is Everything"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Vista thinking">
    Vista's most important scenario advice: do not declare a scenario complete until you have a quantitative response measure. "The system recovers quickly" is not a response measure. "The system returns to normal operation within 30 seconds, with no more than 0.1% of requests failing during the recovery window" is a response measure. The response measure is what enables you to say whether the architecture satisfies the scenario — and it is what transforms ATAM from an opinion contest into an evidence-based evaluation. If your stakeholders cannot produce a number, ask them: "What degradation would cause you to escalate to your CTO at 2am?" The answer usually contains a quantitative threshold.

## The Six Components in Detail

### Stimulus Source

The stimulus source identifies *who or what* initiates the scenario. Common stimulus source categories include:

- **End users** — the humans operating the system through a user interface
- **External systems** — partner services, third-party APIs, data feeds, or dependent systems
- **System components** — internal services, processes, or agents that generate events (including failure events)
- **Time-based triggers** — scheduled jobs, timers, calendar events
- **Human operators** — administrators, DevOps engineers, architects making configuration changes
- **Adversarial actors** — external attackers, malicious insiders (relevant for security scenarios)

The stimulus source matters because different sources have different characteristics — arrival rates, trust levels, error rates, attack vectors — that influence architectural choices. A stimulus from a trusted internal component is handled differently from a stimulus from an unauthenticated external user.

### Stimulus

The stimulus is the specific event that the source generates. Precision is essential here. "A request arrives" is too vague — requests for what operation? At what rate? Containing what data? "A user submits a checkout request with a cart of 47 items, total value $3,240" is a useful stimulus.

For fault scenarios, the stimulus is the failure event: "the primary database replica loses network connectivity." For security scenarios, it is the attack vector: "an attacker submits 10,000 password attempts against the login API from 500 different IP addresses over 10 minutes."

### Environment

The environment describes the conditions under which the scenario plays out. Environment is particularly important for performance and availability scenarios because the same system behavior may be acceptable under low load and unacceptable under peak load.

Common environment specifications include:

- **Load conditions:** Normal load (described statistically), peak load, spike load, sustained overload
- **Operational state:** Normal operation, degraded mode (some components already failed), maintenance window, startup, shutdown
- **External conditions:** Network partition active, external dependencies unavailable, regional cloud zone failure
- **Time context:** Business hours, off-hours, fiscal quarter end, holiday season

### Artifact

The artifact is the specific element of the system that must respond to the stimulus. Specifying the artifact is important because it scopes the evaluation — not all components are relevant to all scenarios, and identifying the relevant component(s) is the first step in identifying which architectural decisions affect scenario achievement.

For many scenarios, the artifact is a specific service or module. For cross-cutting scenarios (security, observability), the artifact may be a group of components or an architectural concern that spans the system.

### Response

The response describes what the system must *do* in response to the stimulus — its observable behavior. Responses may include: returning data, sending an acknowledgment, logging an event, activating a failover, degrading service, rejecting a request, triggering an alert, or redirecting to a backup system.

### Response Measure

The response measure is the quantitative criterion that determines whether the response is good enough. Without a response measure, a scenario is a wish, not a requirement. Response measures are typically expressed in terms of:

- **Time:** p95 latency < 300ms, time to recovery < 30 seconds, batch processing completes within 2 hours
- **Rate:** Error rate < 0.1%, throughput > 5,000 requests/second, success rate > 99.9%
- **Count:** Zero data loss events per year, fewer than 3 failed transactions per 10,000
- **Cost:** Change implementable within 2 sprint cycles, deployment achievable with zero downtime

## Typed Scenario Families

Different quality attributes have characteristic scenario structures. Understanding these typed scenario families helps workshop facilitators prompt participants toward complete, useful scenarios.

### Performance Scenarios

Performance scenarios specify how the system handles a workload demand, measuring the system's throughput and/or latency response. The canonical structure includes a rate of arrivals (the load), the response time under that load, and the percentile at which the measure applies.

**Template:**
- Source: [User/external system type]
- Stimulus: [N] requests of type [X] arrive at rate [Y] per second
- Environment: Normal/peak load, [concurrency level] concurrent sessions
- Artifact: [Specific component/service]
- Response: Requests are processed and responses returned
- Measure: [P50/P95/P99] response time under [Z]ms; error rate under [W]%

**Example concrete performance scenario:**
- Source: Mobile application users
- Stimulus: Product search requests arrive at 500 per second
- Environment: Peak load (Black Friday), 10,000 concurrent sessions
- Artifact: Product search service and its backing Elasticsearch cluster
- Response: Search results are returned with at most the top 20 matches
- Measure: P99 response time under 800ms; error rate under 0.5%

### Availability Scenarios

Availability scenarios specify how the system behaves when a component fails, a dependency becomes unavailable, or a maintenance operation is performed. They test the system's ability to mask, recover from, or gracefully degrade in the face of failures.

**Template:**
- Source: [Internal monitor / operator / external trigger]
- Stimulus: [Component X] experiences [failure type]
- Environment: [Normal/peak operation, with/without prior degradation]
- Artifact: [System element responsible for continuity]
- Response: System [masks fault / fails over / degrades gracefully / notifies operators]
- Measure: [Downtime < X minutes; data loss = 0; affected users < Y%; recovery time < Z seconds]

**Example concrete availability scenario:**
- Source: Infrastructure monitoring agent
- Stimulus: Primary PostgreSQL database node crashes with an OOM kill signal
- Environment: Normal operation, 400 concurrent active sessions
- Artifact: User account service and its database connection pool
- Response: Connection pool detects failure, switches to hot standby replica within 2 health-check cycles, in-flight write transactions are retried once
- Measure: Service downtime under 10 seconds; zero committed transaction data lost; all in-flight transactions complete or explicitly notified as failed

### Security Scenarios

Security scenarios specify how the system responds to attempts to breach its security properties: unauthorized access, injection attacks, data exfiltration, privilege escalation, and denial of service.

**Example concrete security scenario:**
- Source: External attacker
- Stimulus: 50,000 login attempts using a credential-stuffing attack (known username/password pairs from a previous breach of another service) targeting the authentication API from 2,000 distinct IP addresses over 30 minutes
- Environment: Normal operation
- Artifact: Authentication service and its rate-limiting infrastructure
- Response: Rate limiting activates after 5 failed attempts per account within 10 minutes; affected accounts locked pending user verification; attack traffic blocked at edge
- Measure: Zero successful unauthorized logins; legitimate users with correct credentials unaffected; security event logged within 1 second of each failed attempt with source IP and account identifier

### Modifiability Scenarios

Modifiability scenarios specify how much effort is required to implement a defined change. They are the architectural equivalent of a "change request" — they describe a realistic anticipated change and measure how many components must be touched, how long it takes, and what the risk of regression is.

**Example concrete modifiability scenario:**
- Source: Product team
- Stimulus: Business requirement to add a new payment method (cryptocurrency wallet integration) to the checkout flow
- Environment: Normal development operation, one sprint cycle
- Artifact: Payment processing module and its integration with the checkout service
- Response: New payment method is implemented and deployed to production
- Measure: Changes confined to the payment module and its direct integration adapter; no changes required to the checkout flow, cart service, or order management service; implementation completed within 5 developer-days

### Scalability Scenarios

Scalability scenarios specify how the system responds to a sustained increase in workload — not a spike (that is a performance scenario) but a permanent or semi-permanent elevation in demand.

**Example concrete scalability scenario:**
- Source: Business growth event (acquisition of 200,000 new users following a product launch)
- Stimulus: Sustained increase of 5× normal daily active user count, maintained for 30 days
- Environment: Post-launch growth period
- Artifact: User service, recommendation engine, and supporting data infrastructure
- Response: System scales horizontally by provisioning additional compute instances; no manual configuration changes required
- Measure: P99 latency degradation under 20% from baseline; infrastructure cost growth proportional to user growth (linear scaling, not superlinear); zero manual operator intervention required

#### Diagram: Scenario Construction Workbench

<iframe src="../../sims/scenario-construction-workbench/main.html" width="100%" height="592px" scrolling="no"></iframe>

<details markdown="1">
<summary>Scenario Construction Workbench</summary>
Type: microsim
**sim-id:** scenario-construction-workbench<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive workbench for constructing well-formed quality attribute scenarios using the six-component model, with instant feedback on completeness and quality, and library of general scenario templates to start from.

Bloom Level: Apply (L3) — Use the six-component scenario model to construct well-formed concrete quality attribute scenarios from general templates.
Bloom Verb: Construct

Learning Objective: Students will be able to transform a general scenario template into a concrete, system-specific scenario with a quantitative response measure, for any of the five typed scenario families (performance, availability, security, modifiability, scalability).

Canvas layout:
- Top: Quality attribute selector tabs (Performance, Availability, Security, Modifiability, Scalability)
- Left panel: Six labeled input fields for the six scenario components
- Center: Completeness meter (0-100%) and "ATAM-Ready" indicator
- Right panel: General scenario template for selected quality attribute, with "Load Template" button
- Bottom: "Evaluate Scenario" button showing detailed per-component feedback

Template library (one per quality attribute type):
Performance: "N requests of type X arrive at rate Y; system must respond within Z ms at the Pnn percentile"
Availability: "Component X fails; system must recover/degrade within T seconds with at most M data loss"
Security: "Adversarial actor attempts X attack type; system must detect and respond with Y within Z seconds"
Modifiability: "New requirement X must be implemented; change must be confined to Y modules within Z effort"
Scalability: "Workload increases by Nx; system must scale to handle it within T minutes with P% cost increase"

Completeness scoring (same as Chapter 5 workbench but extended):
- Each empty field: -15 points
- Generic/vague field (no numbers, no specifics): -10 points
- Specific field with quantitative measure: +15 points

Behavior:
- Selecting a quality attribute tab changes the general template and field hints
- "Load Template" pre-fills fields with a partially complete example
- As student fills fields, completeness meter animates
- "Evaluate Scenario" shows per-field feedback: "✓ Specific" / "⚠ Add a quantitative measure" / "✗ Too vague"
- "Save to Catalog" button (multiple scenarios can be saved) enables catalog building exercise

Instructional Rationale: Active construction from templates is appropriate because the Apply objective requires practice with concrete values. Loading templates reduces blank-page anxiety while still requiring students to supply the system-specific details.

Color scheme: Tabs in quality attribute colors from Chapter 5. Completeness meter in red-yellow-green gradient. Gold for component field headers.

Responsive: Panels stack vertically on narrow screens.
</details>

## Scenario Brainstorming in ATAM Workshops

One of the most important skills for ATAM practitioners is **scenario brainstorming** — the ability to facilitate a group of stakeholders in rapidly generating a large, diverse set of candidate scenarios. The goal is breadth first, depth second: generate as many scenarios as possible before filtering and prioritizing.

Effective brainstorming techniques for ATAM workshops include:

**Warm-up scenarios:** Before asking stakeholders to generate scenarios for the system under evaluation, give them a two-minute exercise generating scenarios for a familiar, neutral system (a hypothetical coffee shop ordering app, a library management system). This primes the scenario-generation mental mode without triggering defensiveness about the actual system.

**Perspective rotation:** Ask each stakeholder group to generate scenarios from a specific vantage point. "You are an attacker who wants to steal customer data — what would you do?" generates security scenarios that engineers rarely produce. "You are a customer during a regional outage — what do you need the system to do?" generates availability scenarios from the user perspective.

**Failure mode prompts:** Provide prompts from the five typed scenario families: "What are the top three things that could go slow? That could fail? That could be attacked? That could be hard to change? That might need to scale 10x?" These prompts reliably generate scenarios across the quality attribute space.

**The "2am call" technique:** Ask stakeholders: "What scenario, if it happened, would cause you to receive a phone call at 2am?" This consistently generates the highest-severity scenarios because it forces stakeholders to think about real consequences rather than theoretical concerns.

**Silent generation:** Give participants 5 minutes to write scenarios individually on sticky notes before any group discussion. This prevents the "HiPPO effect" (Highest Paid Person's Opinion) from anchoring the group on a narrow set of concerns.

!!! mascot-tip "Quantity First, Quality Second"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Vista giving a tip">
    A common brainstorming mistake is stopping to debate whether a scenario is "realistic" or "important" during generation. Save that conversation for prioritization. During brainstorming, the goal is to surface every concern — no matter how unlikely-seeming — because the least expected scenario is often the most architecturally revealing. Vista has seen scenarios dismissed as "too unlikely to matter" during brainstorming turn out to be the defining risk of an evaluation. Generate first, filter second. Every scenario that makes it to a sticky note gets a chance to be heard before it is eliminated.

## Scenario Prioritization: The Vote That Drives the Evaluation

Not every scenario receives equal analytical attention in an ATAM evaluation. **Scenario prioritization** is the process by which the stakeholder group collectively determines which scenarios are important enough to drive the evaluation's analytical focus.

The standard ATAM prioritization technique is **dot voting**: each stakeholder receives a fixed number of votes (typically five) and allocates them freely among the candidate scenarios. The aggregate vote count produces a priority ranking. Scenarios in the top quartile of votes become the primary analytical focus — these are the scenarios that the architectural approach analysis will probe in depth. Lower-priority scenarios are still documented in the scenario catalog but receive less analytical attention.

Dot voting has several valuable properties for ATAM:

- It is fast: a group of twenty stakeholders can prioritize fifty scenarios in fifteen minutes
- It is transparent: every stakeholder can see exactly how the priorities were allocated
- It reveals conflict: when business and technical stakeholders allocate votes to entirely different scenarios, the conflict is immediately visible
- It produces a documented, stakeholder-endorsed priority ordering that the evaluation team can defend to executives

**Scenario coverage assessment** is the post-brainstorming check that ensures the scenario catalog addresses all major quality attribute concerns. The evaluation team reviews the prioritized catalog and asks: are all eight canonical quality attributes represented? Are the scenarios comprehensive for the system's domain? Are there obvious concerns from the stakeholder analysis that have not appeared as scenarios?

If major coverage gaps exist, the evaluation team uses targeted prompts to fill them before proceeding to architectural approach analysis. A scenario catalog that covers performance and availability but ignores security is not a complete ATAM scenario catalog.

#### Diagram: Scenario Brainstorming and Prioritization Workshop Simulator

<iframe src="../../sims/scenario-workshop-simulator/main.html" width="100%" height="612px" scrolling="no"></iframe>

<details markdown="1">
<summary>Scenario Brainstorming and Prioritization Workshop Simulator</summary>
Type: microsim
**sim-id:** scenario-workshop-simulator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Simulate the scenario brainstorming and dot-voting prioritization process from an ATAM Phase 2 workshop, with multiple stakeholder perspectives contributing scenarios and the aggregate priority ordering emerging dynamically.

Bloom Level: Apply (L3) — Use scenario brainstorming and dot voting to produce a prioritized scenario catalog from multiple stakeholder perspectives.
Bloom Verb: Use

Learning Objective: Students will be able to simulate the ATAM scenario brainstorming and prioritization process, observe how different stakeholder voting patterns produce different priority orderings, and identify scenarios that represent coverage gaps in a catalog.

Canvas layout:
- Top: Stakeholder selector panel (4 buttons: Business Owner, Security Officer, Operations Lead, Product Manager)
- Left: Scenario sticky-note grid (3×4 grid of generated scenarios, each showing QA type, brief description, vote count)
- Right: Live priority bar chart updating as votes are cast
- Bottom: "Vote" button (active for currently selected stakeholder), remaining votes counter, "Show Coverage" button

Pre-populated scenarios (12, one per grid cell):
1. (Performance) API responds under 200ms under 500 concurrent users
2. (Availability) Payment service failover under 30 seconds
3. (Security) Credential-stuffing attack detection and blocking
4. (Modifiability) New payment method in under 5 developer-days
5. (Scalability) Handle 10× normal load during Black Friday
6. (Availability) Database failover with zero committed data loss
7. (Security) GDPR right-to-erasure within 72 hours
8. (Performance) Batch report generation within 2-hour SLA
9. (Modifiability) New product category without recommendation service change
10. (Scalability) Auto-scale without manual operator intervention
11. (Security) Admin account compromise detection within 60 seconds
12. (Availability) Graceful degradation when search is unavailable

Default voting distributions (editable):
- Business Owner: 2 votes on #1, 2 votes on #5, 1 vote on #4
- Security Officer: 3 votes on #3, 2 votes on #11
- Operations Lead: 2 votes on #2, 2 votes on #6, 1 vote on #10
- Product Manager: 3 votes on #9, 2 votes on #4

Behavior:
- Student selects stakeholder and clicks scenarios to allocate votes (max 5 per stakeholder)
- Bar chart updates in real time as votes are added
- "Show Coverage" button shows a coverage matrix: which QAs have scenarios, which are under-represented
- "Coverage Gap" warning appears if any quality attribute has zero scenarios
- "Add Scenario" button allows student to generate a new scenario for a gap area

Instructional Rationale: Active simulation of the workshop process is appropriate for Apply because students need to experience the priority dynamics, not just read about them. The coverage assessment feature teaches the coverage-gap-identification skill.

Color scheme: Sticky notes colored by QA type (matches Chapter 5 QA colors). Bar chart in gradient from high (gold) to low (gray). Warning indicators in red.

Responsive: Grid and chart resize proportionally to container width.
</details>

## The Scenario Catalog as Living Document

The **scenario catalog** is the complete, organized collection of scenarios produced by the ATAM evaluation process. It is not a static deliverable produced once and archived — it is a living document that informs governance, testing, and evolutionary architecture decisions throughout the system's life.

A well-organized scenario catalog:

- Groups scenarios by quality attribute for easy reference
- Includes priority scores from the stakeholder workshop
- Records the stakeholder who contributed each scenario (for traceability)
- Links each scenario to the architectural approaches it tests and the risks it reveals
- Includes fitness function specifications — automated tests or monitoring rules that provide continuous verification of each high-priority scenario

The link between scenario catalog and fitness functions is particularly important. In Chapter 2, we introduced fitness functions as automated architectural constraints. The scenario catalog is the source of fitness function specifications: every high-priority scenario with a quantitative response measure is a candidate fitness function. "P99 latency under 200ms at 500 concurrent users" becomes a performance test in the CI/CD pipeline. "Zero committed transaction data loss on failover" becomes a chaos engineering test. "No unauthorized login succeeds after 5 failed attempts" becomes a security integration test.

In this way, the scenario catalog connects ATAM's analytical output directly to the development team's day-to-day engineering practice — making the evaluation a living part of the system's evolution rather than a one-time audit.

#### Diagram: Scenario Catalog to Fitness Function Pipeline

<iframe src="../../sims/scenario-to-fitness-pipeline/main.html" width="100%" height="552px" scrolling="no"></iframe>

<details markdown="1">
<summary>Scenario Catalog to Fitness Function Pipeline</summary>
Type: workflow
**sim-id:** scenario-to-fitness-pipeline<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show the flow from a prioritized scenario catalog entry through fitness function specification to automated CI/CD enforcement, making the connection between ATAM analysis and day-to-day engineering concrete.

Bloom Level: Analyze (L4) — Examine the relationship between a quality attribute scenario and its derived fitness function, tracing the architectural traceability chain.
Bloom Verb: Trace

Learning Objective: Students will be able to trace a quality attribute scenario through the fitness function pipeline, identifying each transformation step and the artifact produced at each stage.

Canvas layout:
- Horizontal flow of five pipeline stages, connected by arrows
- Each stage shown as a rounded rectangle with a colored header
- Within each stage: input, transformation description, and output
- A scenario example card flowing through the pipeline (animated when "Run Pipeline" button is clicked)
- Detail panel on the right showing full artifact contents when a stage is clicked

Pipeline stages:
1. Scenario Catalog Entry
   Input: Stakeholder scenario as described in workshop
   Transform: Formalize into six-component structure
   Output: Well-formed scenario with quantitative response measure

2. Risk Assessment
   Input: Formalized scenario
   Transform: Evaluate current architecture against response measure; identify gap
   Output: Risk status (Meets / At Risk / Missing Capability)

3. Fitness Function Specification
   Input: "At Risk" or "Missing Capability" scenario
   Transform: Define executable test: tool, trigger, assertion, threshold
   Output: Fitness function specification document

4. Implementation
   Input: Fitness function specification
   Transform: Implement as automated test, load test, chaos test, or metric threshold
   Output: Executable test in CI/CD pipeline

5. Continuous Monitoring
   Input: Deployed fitness function
   Transform: Execute on each build/deployment/scheduled interval
   Output: Pass/Fail result with evidence; fail blocks deployment or triggers alert

Example scenario flowing through: "P99 API latency < 200ms at 500 concurrent users"
Stage 1 output: Full six-component scenario card
Stage 2 output: Risk card showing current P99 = 340ms at 500 users (At Risk)
Stage 3 output: Fitness function spec: "k6 load test, 500 VUs, 10-minute duration, P99 assertion < 200ms"
Stage 4 output: k6 test script in CI/CD pipeline with pass/fail threshold
Stage 5 output: CI/CD dashboard showing last 5 results

Interactive elements:
- Click each stage for full description and artifact details
- "Run Pipeline" button animates the scenario card flowing stage-by-stage
- Switch between three example scenarios (performance, availability, security) using scenario selector

Color scheme: Blue for Scenario Catalog, Yellow for Risk Assessment, Orange for Specification, Green for Implementation, Teal for Monitoring.

Responsive: Stages reflow to vertical stack on narrow screens.
</details>

!!! mascot-warning "Don't Skip the Response Measure"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Vista warning">
    The most common scenario quality failure Vista observes in student ATAM exercises: scenarios where the response measure is either missing or qualitative. "The system recovers quickly" is not a response measure. "User is notified of system unavailability" is not a response measure. Neither of these gives the evaluation team anything to evaluate the architecture against. If you find yourself writing a scenario without a number in the response measure field, stop and ask the stakeholder: "Quickly means what — 5 seconds? 30 seconds? 5 minutes?" The discomfort of that question is exactly right. It forces the stakeholder to commit to a standard, which is the only way to determine whether the architecture meets it.

!!! mascot-celebration "You Are Now a Scenario Machine!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Vista celebrating">
    Phenomenal work, fellow architect! You now have the complete scenario toolkit: the six-component model, the general-to-concrete workflow, the five typed families, the brainstorming techniques, the prioritization process, and the connection to fitness functions that makes your scenarios live beyond the evaluation. Every time you sit in an architecture discussion and someone says "we need to be highly available," you will automatically think: "Highly available for whom, under what failure mode, measured how?" That reflex is your ATAM superpower expressing itself. Next chapter: building the utility tree from your scenario catalog.

## Key Takeaways

Quality attribute scenarios are the unit of analysis that transforms ATAM from opinion to evidence:

- A **quality attribute scenario** is a six-component stimulus-response statement: stimulus source, stimulus, environment, artifact, response, and response measure — all six must be present for the scenario to be analytically useful
- **General scenarios** are templates that enumerate the logical space of concerns for a quality attribute; **concrete scenarios** instantiate those templates with system-specific values
- **Typed scenario families** (performance, availability, security, modifiability, scalability) have characteristic structures that workshop facilitators can use as prompts
- **Scenario brainstorming** prioritizes breadth over depth; the "2am call" technique and perspective rotation reliably surface high-severity, diverse scenarios
- **Dot voting** is the standard ATAM prioritization technique — fast, transparent, and conflict-revealing
- **Scenario coverage assessment** ensures the catalog spans all major quality attribute concerns before analysis begins
- **The scenario catalog** is a living document that links ATAM findings to fitness function specifications, connecting the evaluation to day-to-day engineering practice

??? question "Self-Check: Scenario Quality Assessment — Click to Reveal Answers"
    **Q1:** Identify the missing or weak components in this scenario: "The system must handle traffic spikes. Under heavy load, the system should scale automatically without impacting users."

    **Answer:** This scenario is missing or vague in five of six components. Stimulus Source: unclear (what generates the spike?). Stimulus: vague ("heavy load" — what is the quantified load level?). Environment: unspecified. Artifact: unspecified (which components must scale?). Response: described ("scale automatically") but mechanistically vague. Response Measure: completely missing — "without impacting users" is not a measurable criterion. Improved version would specify: source = marketing campaign launch; stimulus = user session rate increases from 1,000 to 8,000 concurrent within 5 minutes; environment = normal weekday operation; artifact = web tier and session management service; response = auto-scaling activates within 2 minutes, provisioning additional instances; measure = P99 response time does not degrade more than 50ms above baseline during scaling event.

    ---

    **Q2:** A workshop participant says, "We need a scenario for when our cloud provider has an outage." Which quality attribute does this scenario address, and what type of scenario family does it belong to?

    **Answer:** This is an **availability** scenario — specifically a fault/failure scenario where the failure source is an external infrastructure provider rather than an internal component. The scenario family is availability. To make it concrete, the evaluation team needs to specify: which cloud region (or entire provider), which services are affected (compute, storage, networking), what the system's response is (fail over to a secondary region, activate disaster recovery, gracefully degrade), and what the response measure is (RTO: recovery time objective, RPO: recovery point objective).

    ---

    **Q3:** After a scenario brainstorming session, you review the catalog and notice that it contains 12 performance scenarios, 8 availability scenarios, 6 security scenarios, 2 modifiability scenarios, and zero interoperability scenarios. What does this coverage gap indicate, and how would you address it?

    **Answer:** The coverage gap in modifiability and interoperability indicates that the brainstorming session was dominated by operational stakeholders (who naturally think in performance and availability terms) and under-represented product/engineering stakeholders who think about feature evolution and integration. The lack of interoperability scenarios is particularly concerning for any system that integrates with external partners. To address the gap: use targeted prompts ("What will be hardest to change in two years?", "What external systems do you depend on, and what would happen if they changed their API?") and specifically invite stakeholders whose roles involve managing integrations and system evolution — enterprise architects, integration team leads, and business analysts — to a focused scenario generation session for the underrepresented attributes.
