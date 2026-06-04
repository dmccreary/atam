# Quiz: Sensitivity, Tradeoffs, Risk Analysis, and ATAM Reporting

Test your understanding of ATAM's four result types, risk analysis, risk themes, and architecture evaluation reporting. Each question is followed by a collapsed answer block.

## Questions

### Question 1

What are ATAM's four result types? Provide a one-sentence definition for each.

??? note "Answer"
    The four result types are: (1) **Sensitivity Point** — an architectural decision that has a strong, acute effect on a single quality attribute, where small changes produce large quality attribute changes. (2) **Tradeoff Point** — an architectural decision that simultaneously affects two or more quality attributes in opposing directions. (3) **Architectural Risk** — an architectural decision (or absence of a decision) that may lead to failure in a quality attribute scenario under realistic conditions. (4) **Non-Risk** — an architectural decision that has been analyzed and found to be well-reasoned and adequate for the associated quality attribute scenarios.

---

### Question 2

Which of the following best describes a **non-risk** in ATAM?

A. A low-severity risk that does not require immediate mitigation  
B. An area of the architecture that the evaluation team did not have time to examine  
C. An architectural decision analyzed and confirmed to be adequate for its associated quality attribute scenarios  
D. A risk that has already been mitigated before the evaluation  

??? note "Answer"
    The correct answer is **C**. A non-risk is a confirmed positive finding — the evaluation team specifically examined the decision against a quality attribute scenario and found the tactics in place to be adequate. It is not a "low risk" (A), not an uninspected area (B), and not a previously mitigated risk (D). An uninspected area has *unknown* risk status, not non-risk status. Non-risks require the same evidence base as risks: specific scenario, specific decision, specific evidence of adequacy.

---

### Question 3

A system's Redis cache uses a TTL of 5 minutes for session tokens. The (H,H) security scenario requires that a compromised token be invalidatable within 60 seconds. What is the correct ATAM classification for the TTL setting, and what risk does it create?

??? note "Answer"
    The TTL value is both a **sensitivity point** and the source of an **architectural risk**. As a sensitivity point: small changes in TTL dramatically affect the security scenario — a 60-second TTL meets the scenario; a 5-minute TTL violates it. The TTL is a lever with disproportionate impact on scenario achievability. As a risk: the current 5-minute TTL creates a credible probability that the (H,H) security scenario will fail — a compromised token remains valid for up to 5 minutes, far exceeding the 60-second revocation requirement. The sensitivity point and the risk are distinct analytical findings from the same architectural decision.

---

### Question 4

Which of the following is a **tradeoff point** (not just a risk)?

A. A service has no circuit breaker on its dependency, and the availability scenario requires graceful degradation  
B. Synchronous gRPC calls provide sub-50ms latency but cause order service failures when the inventory service is slow  
C. A backup restore process has never been tested and the recovery scenario requires 30-minute RTO  
D. An authentication service has no fallback when the identity provider is unavailable  

??? note "Answer"
    The correct answer is **B**. A tradeoff point requires one decision that simultaneously supports one quality attribute and threatens another. Synchronous gRPC calls *improve* performance (sub-50ms) while *threatening* availability (failures cascade when the inventory service is slow). Options A, C, and D are architectural risks — decisions (or missing decisions) that threaten a quality attribute scenario without a compensating benefit to another attribute. The key distinguishing question is: "Does this decision improve anything while degrading something else?" If yes, it's a tradeoff. If it only threatens, it's a risk.

---

### Question 5

Define a **risk theme** and explain why it is more valuable for executive communication than a list of individual risks.

??? note "Answer"
    A risk theme is a higher-level pattern that groups related individual risks under a single systemic root cause. Risk themes reveal the architectural root causes that produce multiple related risks. Executive communication benefits because: (1) a flat list of 30–40 individual risks either alarms executives that the system is broken or loses their attention before reaching the most important findings; (2) three to five themes, each connected to a clear business impact, are actionable at the organizational level — executives can authorize action on root causes; (3) themes expose systemic gaps (e.g., "no systematic resilience strategy for external dependencies") rather than scattered symptoms, allowing a single architectural decision to address multiple individual risks simultaneously.

---

### Question 6

An evaluation of a healthcare portal identifies five individual risks: no circuit breaker on EHR integration, synchronous payment call blocks checkout when the payment service is slow, no fallback for identity provider unavailability, no circuit breaker on the lab results service, and a shared thread pool between two high-priority workflows. What risk theme name and description would you write for these findings?

??? note "Answer"
    **Theme name:** "Absent Systematic Dependency Resilience Strategy" (or similar). **Description:** The architecture has no consistent approach to handling failures in external or internal service dependencies. Five identified availability risks share a common root cause: components that call dependencies do so without circuit breakers, timeout limits, or fallback behaviors. Under normal load, dependencies are generally available, masking this gap. Under the failure conditions in the availability scenarios, this systemic absence will cause multiple components to fail simultaneously — creating a compound failure mode more severe than any individual risk suggests. The recommended mitigation is a resilience policy requiring circuit breakers, timeouts, and fallback behaviors on all service dependencies, enforced through architecture fitness functions.

---

### Question 7

A risk register entry for a financial platform reads: "The ordering service may have availability problems." Is this a well-documented ATAM risk? What is missing?

A. Yes — it correctly identifies a component and quality attribute  
B. No — it lacks scenario reference, specific decision, evidence, failure mechanism, severity, probability, and mitigation  
C. No — it should specify a sensitivity point instead  
D. Yes — ATAM risk documentation only requires a component name and quality attribute  

??? note "Answer"
    The correct answer is **B**. A well-documented ATAM risk must include: (1) the specific quality attribute scenario it threatens, (2) the specific architectural decision that creates or exacerbates the risk, (3) evidence supporting the risk assessment (measurements, analogous failures, analysis), (4) the failure mechanism explaining how the risk would manifest, (5) severity (business impact if the risk materializes), (6) probability (likelihood of materialization), and (7) mitigation options. "May have availability problems" provides none of these and is not actionable — no engineer can act on it and no stakeholder can make a decision from it.

---

### Question 8

Scenario: An ATAM evaluation of a logistics platform finds that the route-planning API uses a caching strategy where results are cached for 30 minutes. The (H,H) performance scenario requires route queries to complete in under 500ms at p95. The (M,H) data freshness scenario requires routes to reflect real-time traffic within 10 minutes. Classify this architectural decision using ATAM result types.

??? note "Answer"
    This is a **tradeoff point**. The 30-minute cache TTL *supports* the performance scenario by serving most requests from cache in under 10ms, well within the 500ms p95 target. However, it *threatens* the freshness scenario — cached routes may reflect traffic conditions up to 30 minutes old, violating the 10-minute maximum staleness requirement. The decision improves one quality attribute while degrading another. The evaluation team should present this to stakeholders: "We can maintain 30-minute TTL (performance preserved, freshness scenario violated) or reduce TTL to 10 minutes (freshness preserved, cache hit rate drops, performance impact must be measured). Which is more important given the business context?" Additionally, the TTL value itself is a **sensitivity point** for the freshness scenario: crossing the 10-minute threshold changes scenario achievability from met to violated.

---

### Question 9

What are the three functions of non-risk findings in an ATAM evaluation report?

??? note "Answer"
    Non-risks serve three functions: (1) **Confidence calibration** — they tell the development team which areas of the architecture are sound and do not require additional investment, allowing engineering effort to be directed at actual risks. (2) **Stakeholder reassurance** — they provide evidence to executive stakeholders that the system is not entirely in crisis; specific concerns have been analyzed and found to be adequately addressed. (3) **Baseline for evolution** — when the system evolves in the future, non-risks serve as a benchmark; if an architectural change touches an area previously classified as non-risk, the team should re-examine whether the change has altered the risk status of that area.

---

### Question 10

Which of the following best describes **architectural debt** in ATAM terms?

A. The technical complexity introduced by overly sophisticated architecture patterns  
B. The accumulated set of risks and technical compromises consciously or unconsciously accepted in exchange for faster delivery or lower cost  
C. The backlog of features that were not included in the initial architecture  
D. The difference between the target and actual quality attribute measurement values  

??? note "Answer"
    The correct answer is **B**. Architectural debt is the accumulated body of risks and technical compromises — decisions made to meet schedule or cost constraints that the team knows create risk or quality attribute shortfalls. Architecture debt management is the practice of tracking this debt explicitly in a risk register and improvement plan, and progressively reducing it rather than allowing it to compound over time. Options A, C, and D describe other concepts (over-engineering, feature backlog, and quality attribute gaps, respectively) but not architectural debt as defined in ATAM.

---

### Question 11

Scenario: An executive sponsor reviews your evaluation report and counts 28 risks. They say: "This system is clearly broken — how do we even release it?" Using ATAM communication principles, how do you respond?

??? note "Answer"
    The response should reframe 28 findings with context: "Twenty-eight findings is not a verdict on the system's quality — it is the result of thorough analysis. Let me give you the full picture: of the 28 items, 9 are non-risks — confirmed positive findings that specific concerns are well-addressed. Of the 19 remaining, only 3 are high-severity, high-probability risks requiring immediate attention before release. Those 3 cluster under one risk theme we've identified, and we have specific, feasible mitigations. The other 16 are medium- or lower-priority findings that the improvement plan addresses over the next two quarters. An architecture with zero findings is either a trivial system or an under-evaluated one. This report shows we know what to address — which is exactly what a responsible evaluation should produce."

---

### Question 12 (Analyze)

An ATAM evaluation team classifies an architectural decision as a tradeoff point. The lead developer objects: "If it's a tradeoff, then there's no single right answer — so why include it in the report?" Analyze the developer's reasoning and explain why tradeoff points are among the most valuable findings in an ATAM evaluation.

??? note "Answer"
    The developer's reasoning contains a logical error: the absence of a single "right answer" does not make a finding unimportant — it makes it *more* important, not less. Tradeoff points are valuable precisely *because* they cannot be optimized away by technical means alone. They require explicit stakeholder resolution: someone with authority must decide which quality attribute takes priority in the context of the business. Without the ATAM finding surfacing the tradeoff, the resolution happens implicitly — an individual developer makes the choice without stakeholder authorization, stakeholders may later be surprised by the quality attribute they implicitly lost, and the architectural decision lacks documented rationale. Tradeoff points in the evaluation report serve as the structured basis for a stakeholder conversation that produces documented design rationale — a decision with explicit authorization, recorded reasoning, and business accountability. In complex systems, undocumented tradeoff resolutions are a leading cause of architectural surprise during production incidents.

---

*End of Quiz — Chapter 10*
