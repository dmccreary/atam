---
title: Sensitivity, Tradeoffs, Risk Analysis, and ATAM Reporting
description: ATAM's four result types — risks, non-risks, sensitivity points, and tradeoff points — risk classification, severity and probability assessment, the risk register, risk themes, and producing the architecture evaluation report and executive briefing.
generated_by: claude skill chapter-content-generator
date: 2026-06-03 01:30:00
version: 0.08
---

# Sensitivity, Tradeoffs, Risk Analysis, and ATAM Reporting

## Summary

The heart of ATAM analysis is identifying where architectural decisions create risk, tension, or vulnerability. This chapter covers the four result types produced by an ATAM evaluation — sensitivity points, tradeoff points, architectural risks, and non-risks — and teaches students to identify, classify, and communicate each type to diverse audiences. Students learn to aggregate individual risk findings into risk themes that resonate with executive stakeholders, build and maintain a risk register, and produce the architecture evaluation report and roadmap that translate technical findings into actionable organizational guidance. The chapter also completes the ATAM process thread by covering facilitation techniques, consensus building, and post-evaluation review.

## Concepts Covered

This chapter covers the following 27 concepts from the learning graph:

1. Sensitivity Point
2. Tradeoff Point
3. Architectural Risk
4. Non-Risk
5. Risk Theme
6. Risk Identification
7. Risk Classification
8. Risk Severity Assessment
9. Risk Probability Assessment
10. Risk Register
11. Risk Communication
12. Risk-Driven Architecture
13. Architectural Debt
14. Risk Mitigation Strategy
15. Risk Monitoring
16. Conflicting Quality Attributes
17. Design Rationale
18. Architecture Decision Impact
19. Sensitivity Analysis
20. Risk Theme Documentation
21. Architecture Debt Management
22. Architecture Improvement Plan
23. Architecture Evaluation Report
24. ATAM Consensus Building
25. ATAM Facilitation Techniques
26. Post-Evaluation Review
27. Architecture Roadmap

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: ATAM Introduction and Process Phases](../03-atam-introduction-process/index.md)
- [Chapter 4: Stakeholder and Business Analysis](../04-stakeholder-business-analysis/index.md)
- [Chapter 5: Quality Attributes](../05-quality-attributes/index.md)
- [Chapter 7: Utility Trees and Scenario Prioritization](../07-utility-trees-prioritization/index.md)

---

!!! mascot-welcome "This Is Where ATAM Produces Its Gold"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Vista waving welcome">
    Fellow architects, all the scenarios, utility trees, and tactic analysis from the previous chapters converge here. This chapter is where ATAM produces the four gold outputs that make it worth doing: sensitivity points, tradeoff points, risks, and non-risks. These are the findings that justify the evaluation investment — the architectural intelligence that stakeholders can act on, that developers can implement, and that executives can make decisions with. Master this chapter and you will know not just how to find architectural problems, but how to communicate them in a way that actually changes what gets built. Let's take the high-level view!

## The Four ATAM Result Types: A Precise Taxonomy

ATAM's analytical output is not a single undifferentiated list of "problems." It is a structured taxonomy of four distinct result types, each carrying different analytical and communication implications. Before we examine each in detail, let us establish clear definitions:

- **Sensitivity Point:** An architectural decision that has a strong, acute effect on a single quality attribute — a decision where small changes produce large quality attribute changes
- **Tradeoff Point:** An architectural decision that simultaneously affects two or more quality attributes in opposing directions — a decision that improves one quality attribute while degrading another
- **Architectural Risk:** An architectural decision (or absence of decision) that may lead to failure in a quality attribute scenario under realistic conditions
- **Non-Risk:** An architectural decision that the evaluation team has analyzed and found to be well-reasoned, adequate for the associated quality attribute scenarios, and not a risk given current stakeholder priorities and constraints

These four types are not a severity scale. A non-risk is not a "low risk" — it is a confirmed positive finding that the architecture is doing something right. A sensitivity point is not inherently a risk — it is a location in the architecture that deserves careful attention because small changes there have large quality attribute consequences. A tradeoff point is a place where two quality attributes are in tension; how that tension is resolved is a stakeholder decision, not a technical one.

## Sensitivity Points: Where Small Changes Have Big Consequences

A **sensitivity point** is an architectural decision where a relatively small change in that decision produces a disproportionately large change in a quality attribute's achievability. Sensitivity points are the *levers* of the architecture — the places where targeted improvement produces the greatest quality attribute gain, and where inadvertent change can cause the greatest quality attribute loss.

Before an evaluation team can identify sensitivity points, they must know what they are looking for. Sensitivity points are typically found by asking: "For this (H,H) scenario, which single architectural decision, if changed, would most dramatically affect the scenario's achievability?" That decision — the one with the highest marginal impact on the scenario — is the sensitivity point.

Common examples of sensitivity points in distributed systems:

- **Thread pool configuration for a service that depends on a slow external API:** A pool of 50 threads may just barely handle peak load; reducing to 40 causes queuing; reducing to 30 causes timeouts. The thread pool size is a sensitivity point for the availability and performance scenarios.
- **Cache TTL in a system with an important consistency scenario:** TTL of 60 seconds satisfies the consistency scenario; TTL of 120 seconds violates it. The TTL value is a sensitivity point for consistency.
- **Synchronous vs. asynchronous communication for a critical service dependency:** Synchronous produces the required latency under low load but fails the availability scenario under high load when the dependency is slow. The communication synchrony choice is a sensitivity point for both performance and availability.
- **Database indexing strategy for a high-priority search scenario:** Adding an index on the search field reduces query time from 800ms to 40ms. The index is a sensitivity point for the performance scenario.

In ATAM documentation, a sensitivity point is recorded with: the specific decision, the quality attribute(s) affected, the direction of sensitivity (increase/decrease), and the evidence (measured data, analysis, analogous systems).

## Tradeoff Points: The Architectural Dilemmas

A **tradeoff point** is an architectural decision that simultaneously serves one quality attribute well and undermines another. Tradeoff points are where the most important stakeholder conversations occur — because they represent choices that cannot be optimized away and must be explicitly resolved.

**An important distinction:** A tradeoff point is not a risk. A tradeoff point is an acknowledged conflict between two quality attributes resulting from a specific architectural decision. It becomes a risk only if the decision was made without explicit stakeholder authorization, or if the architectural decision is insufficient for the higher-priority scenario.

Let us work through a concrete tradeoff point to see the analysis in action. Consider a microservices architecture for a financial trading platform with two (H,H) scenarios:

- **Performance:** Trade execution API must respond in under 50ms at P99 under peak trading volume
- **Availability:** Trade execution must continue with fallback pricing when the real-time pricing service is unavailable

The architectural decision under analysis: "We use synchronous gRPC calls to the pricing service in the critical path of trade execution."

Analysis:
- This decision *supports* the performance scenario: gRPC over HTTP/2 with binary serialization achieves sub-50ms under normal conditions
- This decision *threatens* the availability scenario: when the pricing service is unavailable, synchronous calls block until timeout, causing trade execution to fail

This is a tradeoff point — one decision, two quality attributes, opposing effects. The evaluation team documents the tradeoff and presents it to stakeholders: "We can maintain the synchronous gRPC call (performance preserved, availability at risk) or switch to asynchronous with a cached pricing fallback (availability preserved, performance potentially affected by async overhead). Which is more important for this system?"

The stakeholder discussion — and its documented resolution — becomes the design rationale for the chosen approach.

#### Diagram: Risk Result Type Explorer

<iframe src="../../sims/atam-result-type-explorer/main.html" width="100%" height="558px" scrolling="no"></iframe>

<details markdown="1">
<summary>ATAM Result Type Explorer</summary>
Type: microsim
**sim-id:** atam-result-type-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive classification tool showing example architectural decisions and asking students to classify each as a sensitivity point, tradeoff point, risk, or non-risk — with immediate feedback and explanation.

Bloom Level: Analyze (L4) — Differentiate between sensitivity points, tradeoff points, risks, and non-risks given concrete architectural decision descriptions.
Bloom Verb: Differentiate

Learning Objective: Students will be able to classify a given architectural decision into the correct ATAM result type (sensitivity point, tradeoff point, risk, non-risk) and explain the reasoning that justifies the classification.

Canvas layout:
- Left panel: Architectural decision card with scenario context, system description, and decision description
- Center: Four classification buttons: "Sensitivity Point", "Tradeoff Point", "Risk", "Non-Risk"
- Right panel: Feedback panel (appears after classification) — shows correct answer, explanation, and which quality attributes are involved
- Bottom: Progress tracker (decisions classified correctly / total) and "Next Decision" button

Decision cards (8 total, presented in sequence):
1. "The authentication service uses JWT tokens with a 15-minute expiration, cached in Redis." — With (H,H) performance and (M,H) security scenarios. Answer: Tradeoff Point (performance via caching vs. security if Redis is compromised)
2. "The search service has no index on the product_name field, and the (H,H) performance scenario requires 100ms search response." — Answer: Risk (architecture lacks the tactic needed to achieve the scenario)
3. "The checkout service uses a connection pool of 200 connections to the payment database, sized for 3× peak traffic." — Answer: Non-Risk (well-analyzed, adequately provisioned)
4. "The load balancer routes all requests round-robin; changing algorithm to least-connections improves average response time by 40%." — Answer: Sensitivity Point (load balancing algorithm has disproportionate performance impact)
5. "Microservices communicate synchronously — this achieves 50ms P99 latency but means the ordering service fails when the inventory service is slow." — Answer: Tradeoff Point (performance vs. availability)
6. "The backup restore process has never been tested; the (H,H) availability scenario requires recovery within 30 minutes." — Answer: Risk (untested recovery = unknown, likely insufficient)
7. "Event-driven architecture provides availability via decoupling but introduces eventual consistency in the order status view." — Answer: Tradeoff Point (availability vs. consistency)
8. "The API gateway enforces rate limiting at 1000 req/s per client; the (H,H) security scenario requires DDoS protection." — Answer: Non-Risk (tactic is present and appropriately configured for the scenario)

Feedback panel content per decision: correct/incorrect indicator, explanation of why this classification is correct, which quality attributes are affected, and what an ATAM evaluation team would document for this finding.

Instructional Rationale: Classification practice with immediate feedback is appropriate for Analyze because students must apply the definitional distinctions with concrete examples, not just recall definitions. Eight diverse examples cover all four types in multiple quality attribute contexts.

Color scheme: Blue for Sensitivity Point, Orange for Tradeoff Point, Red for Risk, Green for Non-Risk. Gold for correct answers.

Responsive: Cards and buttons resize proportionally.
</details>

## Architectural Risk: From Finding to Documented Risk

An **architectural risk** is an architectural decision (or the absence of a decision) that has a credible probability of causing a quality attribute scenario to fail under realistic conditions. Risks are not hypothetical — they are grounded in specific scenarios, specific architectural decisions, and specific evidence that the scenario may not be achieved.

**Risk identification** involves asking, for each (H,H) scenario: "Is there a credible risk that this architecture, as currently designed, will fail to meet this scenario's response measure under the specified conditions?" The evaluation team examines the architectural approaches in place, the tactics employed, and the evidence available (design documents, measurements, analogous systems) to assess whether the scenario is at risk.

Once identified, risks must be precisely documented. A risk with only a vague description ("the architecture might have availability problems") is not actionable. A well-documented risk includes:

- **Scenario reference:** Which specific scenario does this risk threaten?
- **Architectural decision:** Which specific architectural decision creates or exacerbates this risk?
- **Evidence:** What specific evidence supports the risk assessment? (Measured latency under load, absence of a required tactic, analogous system failures)
- **Risk mechanism:** How specifically would this risk manifest? What is the failure mode?
- **Severity:** If this risk materializes, how severely does it impact the stakeholders?
- **Probability:** Under what conditions is this risk likely to manifest?
- **Mitigation options:** What architectural changes could reduce or eliminate this risk?

**Risk classification** organizes risks by quality attribute, by severity and probability, and by architectural area. Classification makes the risk register navigable and helps identify risk themes.

**Risk severity assessment** evaluates how damaging the risk's materialization would be to the organization. Severity maps to business impact: a risk that, if it materializes, would cause regulatory penalties or significant customer churn is more severe than one causing a temporary performance degradation. Severity is a business judgment, not a technical one.

**Risk probability assessment** evaluates how likely the risk is to materialize under the conditions specified in the scenario. Probability is informed by technical analysis: what fraction of the time does the system operate in conditions where this risk could activate? How mature are the mitigating tactics already in place?

## Non-Risks: The Positive Findings

Non-risks are the evaluation's positive findings — architectural decisions that have been analyzed and found to be adequate for their associated quality attribute scenarios. Non-risks are not faint praise; they are valuable evidence that the architecture is doing something right.

Non-risks serve three functions:

1. **Confidence calibration:** They tell the development team which areas of the architecture are sound and do not require additional investment
2. **Stakeholder reassurance:** They provide evidence to executive stakeholders that the system is not in crisis — specific concerns have been analyzed and found to be addressed
3. **Baseline for evolution:** When the system evolves, non-risks become the benchmark — if an architectural change touches an area previously classified as non-risk, the evaluation team should re-examine whether the change has altered the risk status

!!! mascot-thinking "Non-Risks Are Evidence, Not Absence"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Vista thinking">
    A common misunderstanding: a non-risk finding is not "we didn't find anything wrong here." It is "we examined this architectural decision against this specific quality attribute scenario and found that the tactics in place are adequate to achieve the response measure." The difference is significant. An area of the architecture the team didn't examine is not a non-risk — it's an uninspected area with unknown risk status. Non-risks require the same evidence base as risks: specific scenario, specific decision, specific evidence of adequacy. Document them with the same care you document risks.

## Risk Themes: Communicating at the Executive Level

Individual risks are tactical findings — they describe specific architectural decisions and their quality attribute effects. An evaluation of a complex system may identify thirty or forty individual risks. Presenting all forty to an executive stakeholder as a flat list produces one of two unhelpful responses: either the executive concludes the system is fundamentally broken, or they lose attention before reaching the most important findings.

**Risk themes** are the solution. A risk theme is a higher-level pattern that groups related individual risks under a single systemic concern. Themes reveal the architectural root causes that produce multiple related risks — and root causes are what executives can authorize action on.

For example, the following individual risks might all map to a single theme:

- Service A has no circuit breaker on its dependency on Service B
- Service C times out under 500ms SLA when Service D is slow
- Service E shares its database connection pool with Service F, creating a bulkhead failure
- The load balancer does not detect slow responses, routing requests to a degraded instance

The common root cause: **The architecture lacks a systematic resilience strategy for service-to-service dependencies.** The individual risks are manifestations of this systemic gap. The risk theme communicates this clearly: "The system lacks a consistent, systematic approach to dependency resilience, creating multiple availability risks that will manifest independently under load."

A risk theme is documented with:

- **Theme name:** A short, precise label for the systemic concern
- **Description:** One to three paragraphs explaining the root cause and its architectural implications
- **Supporting risks:** The list of individual risks that this theme encompasses
- **Business impact:** What business consequences would result if the theme's risks materialize
- **Recommended mitigation:** The systemic architectural change that would address the root cause

**Risk theme documentation** is the highest-value deliverable for executive communication. Three to five themes, each clearly connected to business impact, are far more actionable for organizational decision-making than forty individual risk items.

#### Diagram: Risk Register and Theme Aggregation

<iframe src="../../sims/risk-register-explorer/main.html" width="100%" height="580px" scrolling="no"></iframe>

<details markdown="1">
<summary>Risk Register and Theme Aggregation Explorer</summary>
Type: diagram
**sim-id:** risk-register-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive risk register visualization showing individual risks organized by quality attribute and severity, with theme aggregation — clicking a theme reveals the constituent risks, and clicking a risk shows its full documentation.

Bloom Level: Evaluate (L5) — Assess a risk register to prioritize mitigation efforts, identify high-severity risk themes, and determine which architectural improvements would have the greatest risk-reduction impact.
Bloom Verb: Assess

Learning Objective: Students will be able to interpret a populated risk register, identify the highest-priority risk themes, and recommend which architectural improvements would address the most severe risks most efficiently.

Canvas layout:
- Left panel: Risk theme cards (4-5 themes) with theme name, affected QAs, risk count, and business impact rating (H/M/L)
- Center: Expandable risk tree — clicking a theme expands its constituent individual risks; each risk card shows QA, severity (H/M/L), probability (H/M/L), and scenario reference
- Right panel: Full risk detail when a risk item is clicked — decision, evidence, mechanism, severity, probability, mitigation options
- Top bar: Filter controls — filter by QA, severity, probability, theme
- Bottom: Summary stats — total risks by type (Sensitivity Points, Tradeoffs, Risks, Non-Risks) and by theme

Example risk register (healthcare patient portal):
Theme 1: "No Systematic Resilience Strategy for External Dependencies"
- Risk: No circuit breaker on EHR integration [Availability, H, M]
- Risk: Synchronous payment call blocks checkout on payment timeout [Availability, H, H]
- Risk: Authentication service has no fallback for IdP unavailability [Availability, H, M]

Theme 2: "Insufficient Load Testing for Peak Season"
- Risk: Search service untested at 3× normal load [Performance, H, H]
- Risk: Database connection pool sized for average, not peak, concurrency [Performance, H, M]

Theme 3: "PHI Access Control Coverage Gaps"
- Risk: Bulk export API bypasses per-field access control [Security, H, H]
- Risk: Admin audit log not capturing indirect PHI access via joins [Security, M, H]

Non-Risks: 6 items (well-addressed availability and performance scenarios)

Interactive elements:
- Click any theme to expand/collapse its constituent risks
- Click any risk card to see full documentation in right panel
- "Sort by Severity × Probability" button reorders risks by combined priority score
- "Show Mitigation Plan" toggle shows recommended mitigations overlaid on risk cards
- "Generate Theme Summary" button produces a formatted theme summary paragraph for each theme

Color scheme: Red for High severity, Orange for Medium, Yellow for Low. Themes in dark gold headers. Non-risks in green.

Responsive: Tree layout reflows to a flat list on narrow screens.
</details>

## The Architecture Evaluation Report

The **architecture evaluation report** is the primary deliverable of an ATAM evaluation. It is the document that stakeholders, governance bodies, and future evaluation teams will reference. A well-structured evaluation report includes the following sections:

**Executive Summary (1-2 pages):** The key findings at the level of abstraction appropriate for executive audiences — risk themes, their business impacts, and the top three to five recommended actions. This section must be complete and actionable on its own; executives who read nothing else read this.

**Evaluation Context:** The system evaluated, the evaluation team, the scope and boundaries of the evaluation, the dates of Phase 1 and Phase 2 sessions, and the stakeholders who participated.

**Business Drivers and Architecture Summary:** A brief description of the system's business context, quality attribute priorities, and the architectural approaches evaluated. This section contextualizes all findings.

**Utility Tree:** The complete utility tree with importance and difficulty ratings, serving as the priority framework for all findings.

**Quality Attribute Scenario Analysis:** For each (H,H) scenario, a structured analysis: the scenario, the architectural approaches examined, the tactics present, the risk or non-risk finding, and the sensitivity points and tradeoff points identified.

**Risk Catalog:** All risks, non-risks, sensitivity points, and tradeoff points, organized by quality attribute and classified by severity and probability.

**Risk Themes:** The three to five systemic themes derived from the risk catalog, each with description, constituent risks, business impact, and recommended mitigation.

**Recommendations:** Specific, actionable architectural improvement recommendations, prioritized by risk severity and practical implementation feasibility.

**Architecture Roadmap:** A proposed sequencing of architectural improvements over time — which improvements should be made first (highest-risk/highest-feasibility), which in subsequent quarters, and which to monitor but not yet act on.

## The Architecture Improvement Plan and Roadmap

The **architecture improvement plan** translates risk findings into prioritized engineering work. It differs from the evaluation report in tone and audience: the evaluation report is analytical and stakeholder-facing; the improvement plan is prescriptive and engineering-team-facing.

A well-structured improvement plan organizes recommendations by:

- **Priority:** High-severity, high-probability risks first
- **Feasibility:** Quick wins (low effort, high impact) before high-effort structural changes
- **Dependencies:** Some improvements enable others; the plan orders them to respect those dependencies

The **architecture roadmap** extends the improvement plan into a time dimension, showing which improvements are planned for which quarter and how the architectural risk profile changes as improvements are implemented. Roadmaps are particularly effective for executive communication — they show not just what is wrong but how the organization is progressively addressing it.

**Architectural debt** is the accumulated set of risks and technical compromises that have been consciously or unconsciously accepted in exchange for faster delivery or lower cost. **Architecture debt management** is the practice of tracking this debt explicitly — in a risk register and an improvement plan — and progressively reducing it rather than allowing it to compound.

**Risk-driven architecture** takes a proactive stance: rather than waiting for an ATAM evaluation to identify risks, teams design their architecture around explicit risk identification and mitigation from the start. Risk-driven architecture uses the ATAM scenario and risk concepts as design inputs rather than evaluation criteria.

## ATAM Facilitation Techniques and Consensus Building

The analytical rigor of ATAM's findings is only as good as the quality of the facilitated sessions that produce them. **ATAM facilitation techniques** are the process tools that keep sessions productive, inclusive, and focused.

**Time-boxing:** Keep each session activity within its allocated time using a visible timer. Architecture teams are prone to deep technical dives; the facilitator's job is to capture the insight and move on without losing the finding.

**Parking lot:** Maintain a visible list of topics that are important but outside the current activity's scope. When a participant raises a relevant but off-topic concern, park it visibly — this acknowledges the concern without derailing the session.

**Round-robin input:** Ensure every stakeholder has an opportunity to contribute, not just the most vocal participants. Formal round-robin input (asking each person in sequence) is more equitable than open-ended discussion and surfaces perspectives that would otherwise be crowded out.

**Written before verbal:** For scenario generation and prioritization, have participants write their contributions before sharing them verbally. This prevents anchoring on the first contribution and ensures quieter participants' perspectives are captured.

**ATAM consensus building** is the process by which the diverse stakeholder group reaches sufficient agreement on priorities, findings, and recommendations to make the evaluation's outputs actionable. True consensus is often not achievable — the goal is transparent documented agreement on key decisions, with disagreements recorded and escalated appropriately.

!!! mascot-tip "The Evaluation Leader's Most Important Skill"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Vista giving a tip">
    Vista's most important facilitation tip: the best evaluation leaders are not the most technically expert people in the room. They are the most skillful listeners. When a stakeholder says something vague like "I'm worried about the system being fragile," the evaluation leader hears: "there is an availability or reliability scenario that needs to be articulated." They do not dismiss it, they do not assume they know what it means — they ask: "What would fragility look like specifically? What scenario would make you say 'the system is too fragile'?" That question turns anxiety into a scenario, and scenarios are what ATAM can analyze. Facilitation is the art of converting stakeholder concerns into analyzable inputs.

## Post-Evaluation Review and Risk Monitoring

The ATAM evaluation's value extends beyond the evaluation report. **Post-evaluation review** activities ensure that findings are acted upon and that the organization learns from the evaluation process itself.

**Architecture improvement tracking:** Each recommendation in the improvement plan should be tracked as a work item with an owner, a target date, and a definition of done. The evaluation team (or a designated architecture governance body) reviews progress periodically.

**Risk monitoring:** High-severity risks that are not immediately mitigated should be assigned monitoring criteria — observable signals that would indicate the risk is becoming more likely or that the risk has partially materialized. These monitoring criteria become the basis for observability requirements and operational alerting.

**Fitness function implementation:** As discussed in Chapter 6, high-priority scenarios become candidates for fitness functions. The post-evaluation period is when these fitness functions are designed, implemented, and integrated into CI/CD pipelines.

**Evaluation retrospective:** After the evaluation report is delivered, the evaluation team conducts a retrospective on the evaluation process itself: What went well? What took longer than expected? What scenarios generated the most valuable findings? These retrospective insights improve the next evaluation.

#### Diagram: ATAM Output to Action Pipeline

<iframe src="../../sims/atam-output-pipeline/main.html" width="100%" height="550px" scrolling="no"></iframe>

<details markdown="1">
<summary>ATAM Output to Organizational Action Pipeline</summary>
Type: workflow
**sim-id:** atam-output-pipeline<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Visualize the complete pipeline from ATAM evaluation outputs through risk register, improvement plan, architecture roadmap, and ongoing risk monitoring — showing how evaluation findings translate into organizational action.

Bloom Level: Understand (L2) — Explain how ATAM evaluation outputs are transformed into actionable organizational documents and ongoing monitoring practices.
Bloom Verb: Explain

Learning Objective: Students will be able to trace an ATAM risk finding from its identification in the evaluation session through its documentation in the risk register, its prioritization in the improvement plan, its scheduling in the architecture roadmap, and its verification through fitness function monitoring.

Canvas layout:
- Six pipeline stages connected by horizontal arrows
- Each stage: title, description, output artifact name, and participant role responsible
- An example risk finding "card" flows through the pipeline (clicking "Run Example" animates it)
- Info panel on right shows full content for clicked stage or artifact

Pipeline stages:
1. ATAM Evaluation Session
   Output: Raw finding (sensitivity point / tradeoff / risk / non-risk)
   Owner: Evaluation team + note-taker

2. Risk Classification
   Output: Classified risk with severity, probability, scenario reference
   Owner: Evaluation leader

3. Risk Theme Aggregation
   Output: Risk themes with constituent risks and business impact
   Owner: Evaluation leader + senior architect

4. Architecture Evaluation Report
   Output: Full report: executive summary, risk catalog, themes, recommendations
   Owner: Evaluation team

5. Architecture Improvement Plan
   Output: Prioritized work items with owners and target dates
   Owner: Architecture Review Board + project leads

6. Ongoing Monitoring
   Output: Fitness functions, observability alerts, periodic re-evaluation schedule
   Owner: DevOps / SRE + governance

Example risk finding animation:
"Ordering service calls inventory service synchronously; no circuit breaker present"
→ Classified: Availability risk, Severity H, Probability M
→ Grouped under theme: "No Systematic Resilience Strategy"
→ Appears in report: Section 4.2, Risk AV-003
→ Improvement plan: "Implement circuit breaker on inventory service calls, Sprint 14, Owner: Backend team lead"
→ Monitoring: Fitness function — "Circuit breaker trip rate < 1% per 1000 requests; alert on > 5% within 60s"

Interactive elements:
- Click each stage for full description
- "Run Example" button animates the example finding through all six stages
- Click any artifact name to see its template or sample content

Color scheme: Blue for evaluation stages, Teal for documentation stages, Green for action stages, Orange for monitoring.

Responsive: Stages stack vertically on narrow screens.
</details>

!!! mascot-celebration "You've Just Completed the Full ATAM Cycle!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Vista celebrating">
    Incredible milestone, fellow architects! You have now walked the complete ATAM path — from stakeholder identification through scenario construction, utility tree building, architectural approach analysis, risk classification, and all the way to the evaluation report and architecture roadmap. You can now identify sensitivity points with precision, name tradeoff points with confidence, document risks with evidence, confirm non-risks with rigor, and communicate all of it at the executive level with risk themes. That is the complete ATAM superpower toolkit. The remaining chapters take these skills into specialized domains — distributed systems, security, AI, and beyond. Onward!

## Key Takeaways

ATAM's four result types form a precise taxonomy that enables structured architectural communication at all levels:

- **Sensitivity points** are architectural decisions with disproportionately large quality attribute impacts — the levers of the architecture
- **Tradeoff points** are decisions that simultaneously improve one quality attribute and degrade another — requiring explicit stakeholder resolution, not optimization away
- **Risks** are decisions (or missing decisions) that may cause scenario failure — documented with scenario reference, decision, evidence, mechanism, severity, probability, and mitigation
- **Non-risks** are confirmed positive findings — analyzed decisions found adequate for their scenarios — not merely "nothing wrong found here"
- **Risk themes** aggregate individual risks into systemic root cause patterns — the executive-level findings that enable organizational decision-making
- The **architecture evaluation report** provides full analytical depth; its executive summary must stand alone as a self-contained action document
- The **architecture improvement plan** translates findings into prioritized engineering work; the **architecture roadmap** sequences it over time
- **Architectural debt** is the accumulated body of acknowledged risks; explicit management prevents compound interest on technical compromise
- **Post-evaluation activities** — improvement tracking, risk monitoring, fitness function implementation, evaluation retrospective — determine whether the evaluation produces lasting value or merely a report that collects dust

??? question "Self-Check: Risk Analysis and Reporting — Click to Reveal Answers"
    **Q1:** Distinguish between a sensitivity point and a risk for this architectural decision: "The payment service uses a Redis cache for session tokens with a 5-minute TTL. The (H,H) security scenario requires that a compromised token be invalidatable within 60 seconds."

    **Answer:** The architectural decision produces both a sensitivity point and a risk, in different directions. The **sensitivity point**: the TTL value directly controls the security scenario's achievability. If TTL = 60 seconds, the scenario is met; if TTL = 5 minutes, it is violated. The TTL is therefore a sensitivity point for the security scenario — small changes produce large scenario achievability changes. The **risk**: with the current TTL of 5 minutes, the scenario is NOT met (5 minutes >> 60 seconds). This is an architectural risk — the current decision (5-minute TTL) creates a credible probability of failing the (H,H) security scenario. The mitigation is to implement token revocation lists or reduce the TTL to 60 seconds (with an assessment of the Redis throughput implications of a 5× increase in token refresh operations).

    ---

    **Q2:** An evaluation produces twelve individual risks across three quality attributes: five availability risks, four security risks, and three performance risks. Four of the availability risks and two of the security risks all trace to the same root cause: the system has no systematic approach to external dependency resilience. How would you formulate a risk theme for this finding?

    **Answer:** Theme Name: "Absent Systematic Dependency Resilience Strategy." Description: "The architecture has no consistent approach to handling failures in external service dependencies. Six of the system's twelve identified risks — four availability risks and two security risks — arise from the same root cause: components that call external dependencies do so without circuit breakers, retry budgets, or fallback behaviors. Under normal load, external dependencies are generally available, masking this gap. Under the failure conditions described in our availability and security scenarios, this systemic absence will cause multiple components to fail simultaneously — creating a compound failure mode more severe than any individual risk item suggests." Constituent risks: AV-001, AV-002, AV-003, AV-004, SEC-003, SEC-006. Business impact: High — simultaneous component failures during peak load would affect all active user sessions. Recommended mitigation: Adopt an organization-wide resilience policy requiring circuit breakers, timeouts, and fallback behaviors on all external service dependencies, enforced through architecture fitness functions.

    ---

    **Q3:** An executive sponsor reviews your architecture evaluation report and says, "I count 34 risks in this document. Does that mean our architecture is terrible?" How would you respond?

    **Answer:** Context and framing matter more than raw count. You would respond: "Thirty-four findings is not a verdict on architecture quality — it is the result of thorough analysis. Let me give you the context: of the 34 items, 12 are non-risks — confirmed positive findings that specific concerns are well-addressed. Of the remaining 22, only 4 are (H,H) risks — the ones that require immediate attention. Those 4 cluster under two risk themes that we've identified, and we have specific, feasible mitigations for both. The other 18 are medium- or lower-priority findings that our improvement plan addresses over the next two quarters. An architecture with zero risk findings is either a very simple system or an under-evaluated one. What this document shows is that we have systematically identified what we need to address — which is exactly what a responsible architecture evaluation should produce."
