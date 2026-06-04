# Quiz: Utility Trees and Scenario Prioritization

Test your understanding of utility tree structure, importance and difficulty ratings, HH scenarios, construction workshops, and priority negotiation. Each question is followed by a collapsed answer block.

## Questions

### Question 1

**[Remember]** What are the four structural levels of a utility tree, from top to bottom?

A. Business goals → quality attributes → scenarios → risks  
B. Utility root → quality attribute branches → sub-attribute nodes → leaf-level scenarios  
C. Stakeholders → concerns → scenarios → tactics  
D. System → components → quality attributes → test cases  

??? note "Answer"
    The correct answer is **B**. A utility tree has four levels: (1) **Utility root** — always labeled "Utility," representing the overarching goal of a system that serves its stakeholders well; (2) **Quality attribute branches** — one branch per quality attribute being evaluated (typically 4-8 branches: Performance, Availability, Security, Modifiability, etc.); (3) **Sub-attribute nodes** — more granular decompositions of each quality attribute (e.g., Performance → Latency, Throughput); (4) **Leaf-level scenarios** — concrete, six-component quality attribute scenarios, each rated with importance and difficulty scores.

---

### Question 2

**[Remember]** In the utility tree rating system, what does an **(H, H)** designation on a leaf-level scenario mean?

A. The scenario has high complexity and high risk  
B. The scenario addresses two different quality attributes simultaneously  
C. The scenario has high importance to stakeholders AND high difficulty for the architecture to achieve  
D. The scenario requires a heavyweight process and a heavyweight architectural change  

??? note "Answer"
    The correct answer is **C**. The two-letter code represents (**Importance**, **Difficulty**): **H** importance means failure to achieve this scenario would constitute a serious business failure; **H** difficulty means the current architectural decisions make this scenario very challenging or impossible to achieve without significant rework. **(H, H)** scenarios are the analytical heart of an ATAM evaluation — they represent the highest-risk, highest-value territory where the evaluation team should focus deepest analysis.

---

### Question 3

**[Remember]** What question should stakeholders be asked to determine a scenario's **importance rating**?

A. "How technically complex is this scenario to implement?"  
B. "How many lines of code will be required to address this scenario?"  
C. "If this scenario is NOT achieved, how bad is that for the organization?"  
D. "How long will it take the architecture team to satisfy this scenario?"  

??? note "Answer"
    The correct answer is **C**. Importance is a **business and operational judgment**, not a technical one. The facilitator asks: "If this scenario is not achieved, how bad is that for the organization?" A High (H) importance rating means failure would constitute a serious business failure — lost revenue, regulatory penalty, safety incident, or fundamental loss of customer trust. Difficulty (the other dimension) is where the technical judgment lives. The distinction is critical: engineers often conflate importance with technical interest, which can inflate the importance of technically interesting scenarios and deflate the importance of business-critical but technically straightforward ones.

---

### Question 4

**[Remember]** How many (H,H) scenarios does the chapter recommend as appropriate for a complete ATAM evaluation of a complex enterprise system, and why is having too many or too few a warning sign?

A. Exactly 3 — more than 3 indicates the evaluation team is being too aggressive  
B. Typically 5 to 12 — too few suggests incomplete elicitation or conservative difficulty ratings; too many suggests importance ratings haven't been sufficiently differentiated  
C. As many as possible — the goal is to find every risk  
D. Only 1 — the utility tree should identify the single most critical scenario for deep analysis  

??? note "Answer"
    The correct answer is **B**. For a complete evaluation of a complex enterprise system, **5 to 12 (H,H) scenarios** is appropriate. Fewer than 5 usually indicates either incomplete scenario elicitation (the brainstorming missed important concerns) or overly conservative difficulty ratings (the evaluation team underestimated how hard the architecture makes certain scenarios). More than 12-15 (H,H) scenarios suggests the importance ratings have not been sufficiently differentiated — if everything is "H" importance, the evaluation team cannot focus its analytical effort where it matters most. The (H,H) list becomes the evaluation team's analytical agenda; a list of 30 items is unmanageable in the available evaluation time.

---

### Question 5

**[Understand]** Explain why the utility tree serves as both a **prioritization tool** and a **communication artifact**, and describe a different audience for each function.

??? note "Answer"
    As a **prioritization tool**, the utility tree serves the evaluation team and architecture team: it organizes the analytical agenda by exposing which scenarios are most important AND most difficult, directing the evaluation's deepest analysis at (H,H) scenarios. The audience is technical — evaluators who use the tree to select which architectural approaches to probe in depth. As a **communication artifact**, the utility tree serves executive and stakeholder audiences: it presents the complete analytical agenda in a visual, intuitive format that shows stakeholders "we know exactly what we evaluated, why, and how important each dimension was to your own team." For executives, the tree demonstrates that the evaluation is structured and stakeholder-grounded, not a vague "architecture audit." It builds organizational credibility and makes findings actionable by showing the priority context behind each risk. The same artifact serves both purposes, which is why the tree must be both analytically rigorous (for prioritization) and visually clear (for communication).

---

### Question 6

**[Understand]** The chapter describes **(M, H) scenarios** as "architectural time bombs." Explain this warning and describe the documentation practice the chapter recommends for them.

??? note "Answer"
    A **(M, H) scenario** is rated medium importance and high difficulty — the architecture makes it very hard to achieve, but it is not currently considered critical. The "time bomb" warning is that business context changes: if the M-importance scenario becomes H-importance (due to business expansion, regulatory change, or competitive pressure) while the difficulty remains H, the scenario instantly becomes a critical (H,H) finding. But by then, the architecture may have accumulated even more complexity making the difficult scenario even harder to address. The recommended documentation practice: record every (M,H) scenario explicitly in the risk catalog with a note about what conditions would escalate it to (H,H). This note serves as a trigger for future re-evaluation — "if we expand into the EU market, the GDPR compliance scenario escalates from (M,H) to (H,H)" creates a decision tripwire that ensures the scenario is revisited when the business context changes.

---

### Question 7

**[Understand]** Describe the six steps of a **utility tree construction workshop** in sequence, noting who performs each step.

??? note "Answer"
    (1) **Identify quality attribute branches** — the evaluation team and architecture team collaboratively list the quality attributes relevant to this system, drawing on business driver analysis and the quality attribute taxonomy. (2) **Populate sub-attribute nodes** — for each branch, identify 2-4 sub-attributes that best decompose the quality attribute for this specific system (e.g., Security → Access Control, Data Protection, Audit and Compliance). (3) **Write leaf-level scenarios** — for each sub-attribute, write 1-3 concrete scenarios using the six-component model; start with scenarios the architecture team considers most important. (4) **Assign importance ratings (stakeholder activity)** — the architecture team (and in Phase 2, the broader stakeholder group) assigns H/M/L importance ratings through facilitated discussion; the facilitator focuses on business consequences of failure. (5) **Assign difficulty ratings (technical activity)** — the evaluation team and architecture team collaboratively assign H/M/L difficulty ratings based on analysis of the current architectural decisions. (6) **Identify priority matrix quadrants** — once all scenarios are rated, organize them into four quadrants: (H,H) critical, (H,L/M) confirmation, (M/L,H) risk, (L,L) monitor.

---

### Question 8

**[Understand]** What is **utility tree validation**, and what does a properly validated tree guarantee about its fitness for driving the evaluation's analytical phase?

??? note "Answer"
    Utility tree validation is the quality check performed after initial tree construction, before the tree drives the evaluation's analytical phase. It checks four properties: (1) **Structural completeness** — all branches have sub-attributes, all sub-attributes have scenarios, all scenarios are in six-component form with both importance and difficulty ratings; (2) **Coverage balance** — no single quality attribute dominates more than 40% of scenarios, all stakeholder groups' primary concerns appear in at least one (H,H) scenario, cross-cutting concerns (security, observability) are represented; (3) **Rating consistency** — importance ratings align with business driver analysis (high-priority business drivers should produce H-importance scenarios), difficulty ratings align with the evaluation team's architectural assessment; (4) **Analytical tractability** — the (H,H) count is manageable (5-12) and spans multiple quality attributes. A validated tree guarantees that the analytical phase will be focused on the most consequential scenarios, that all major stakeholder concerns have been represented, and that the priority ordering is defensible against stakeholder scrutiny.

---

### Question 9

**[Apply]** You are building a utility tree for a fintech payment processing system. Populate the Security branch with two sub-attribute nodes and write one concrete, six-component leaf-level scenario for each sub-attribute. Rate each scenario for importance and difficulty, and justify your ratings.

??? note "Answer"
    **Security branch — Payment Processing System:**

    **Sub-attribute 1: Transaction Integrity**
    - Leaf scenario: *Stimulus source:* External attacker; *Stimulus:* Attacker attempts to modify transaction amounts via API parameter tampering (e.g., changing payment amount from $1,000 to $1 in the request payload); *Environment:* Normal operation; *Artifact:* Payment API validation layer and transaction processing service; *Response:* Request validation detects parameter tampering, rejects the transaction, logs the attempt with source IP and account, and triggers a security alert; *Response measure:* Zero successful tampered transactions reach the database; all tampering attempts logged within 500ms; transaction processing for legitimate requests is unaffected.
    - **Rating: (H, M)** — H importance because a single successful transaction tampering attack causes direct financial loss and immediate regulatory consequence; M difficulty because input validation is a well-understood pattern but implementing it correctly across all API parameters requires thorough security review.

    **Sub-attribute 2: Fraud Detection**
    - Leaf scenario: *Stimulus source:* External fraudulent actor; *Stimulus:* Account processes 12 transactions in 3 minutes each under $50 (structuring pattern to avoid fraud detection thresholds); *Environment:* Normal business hours; *Artifact:* Real-time fraud detection service; *Response:* Pattern is detected, account is flagged for review, transactions above the detection threshold are held for manual review, legitimate transactions below threshold continue processing; *Response measure:* Pattern detected within 60 seconds of the 5th suspicious transaction; false positive rate below 0.5% of legitimate users; flagged accounts reviewed within 4 business hours.
    - **Rating: (H, H)** — H importance because structuring fraud causes direct financial loss and regulatory penalties (BSA/AML compliance); H difficulty because real-time pattern detection across high transaction volumes without excessive false positives requires sophisticated ML infrastructure that the current batch-processing architecture cannot support.

---

### Question 10

**[Apply]** During a utility tree workshop, the security officer rates an encryption-at-rest scenario as **(H, H)** but the CTO rates it as **(H, L)**, arguing that "we use AES-256 everywhere, this is solved." How would you facilitate this disagreement, and what is the significance of the outcome?

??? note "Answer"
    This is a difficulty rating disagreement — both stakeholders agree the scenario is H importance, but the CTO believes the architecture makes it easy to achieve (L difficulty) while the security officer implies it may be harder. The facilitator's response: apply the **stakes escalation technique for difficulty**, asking the evaluation team to investigate: "Is AES-256 encryption-at-rest actually uniformly implemented across all data stores, including S3 buckets, database snapshots, and log archives? Are the encryption keys managed and rotated according to a documented policy? Are there any data stores not covered by the current implementation?" If the technical investigation reveals gaps (e.g., log archives are not encrypted, key rotation is manual), the CTO's (H,L) rating is incorrect — the scenario is not fully addressed by the existing implementation. The security officer's concern reflects real gaps. In that case, the difficulty rating moves toward M or H. The significance of the outcome: if the CTO's (H,L) rating stands, the scenario is treated as a non-risk confirmation and receives no deep analysis. If the security officer's concern is validated, the scenario becomes (H,H) or (H,M) and receives architectural approach analysis — potentially surfacing specific gaps in encryption coverage as risks. The difference between these outcomes directly determines whether a real security gap is documented in the evaluation report.

---

### Question 11

**[Apply]** A healthcare system's utility tree has been populated, and you observe the following distribution: 8 scenarios under Performance, 6 under Availability, 2 under Security, 0 under Modifiability, 0 under Interoperability. The system must meet HIPAA compliance and integrates with three external EHR systems. Identify the coverage problem and describe the targeted prompts you would use to address the gaps.

??? note "Answer"
    **Coverage problem:** For a HIPAA-regulated healthcare system with three EHR integrations, 2 security scenarios and 0 interoperability scenarios is severely underrepresented. HIPAA imposes specific audit logging, access control, and breach notification requirements that should generate at least 4-6 security scenarios. Three EHR integrations create significant interoperability risk — what happens when one EHR is unavailable? When the EHR API changes versions? When data formats are inconsistent? **Targeted prompts for Security:**
    - "What PHI data is stored or transmitted by this system, and who can access each category?"
    - "What does HIPAA require for audit trail completeness, and who reviews those logs?"
    - "What would constitute a HIPAA breach for this system, and how quickly must it be reported?"
    
    **Targeted prompts for Interoperability:**
    - "What happens to the patient portal when one of the three EHR systems is unavailable for 2 hours?"
    - "When EHR vendor X releases a new API version, how long does the system have to update, and what happens in the interim?"
    - "If patient demographic data from EHR A and EHR B contradict each other, which version does the portal display?"

    **Targeted prompts for Modifiability:**
    - "What regulatory changes have affected similar healthcare systems in the last 2 years?"
    - "What new clinical workflows do you anticipate needing to support in the next 18 months?"

---

### Question 12

**[Analyze]** The chapter states that the utility tree is the "negotiation artifact that surfaces stakeholder disagreements about priorities before implementation makes them expensive." Analyze the organizational conditions under which this negotiation function is most valuable, and evaluate when the utility tree construction process might fail to surface disagreements even when they exist.

??? note "Answer"
    The utility tree's negotiation value is highest under three organizational conditions: (1) **Organizational complexity** — when multiple distinct stakeholder groups with genuinely different priorities must build one system (e.g., a system serving both operational and compliance stakeholders, or both business-velocity-focused product teams and stability-focused operations teams). The tree forces these groups to see each other's priorities explicitly and resolve conflicts before architectural decisions lock them in. (2) **High stakes decisions** — when the architectural choices are expensive to reverse and the cost of getting priorities wrong is significant (large-scale systems, long-lived systems, safety-critical systems). (3) **Priority ambiguity** — when no authoritative priority ordering exists in advance and it must be constructed through deliberation. The utility tree construction process may **fail to surface disagreements** even when they exist under several conditions: (a) **Power dynamics** — if a senior stakeholder's presence inhibits junior stakeholders from disagreeing, the ratings may reflect hierarchy rather than genuine organizational priorities (mitigated by structured individual generation before group discussion); (b) **Shallow engagement** — if stakeholders rush through importance ratings without genuinely reflecting on business consequences, ratings converge on "everything is H" without real differentiation; (c) **Missing stakeholders** — if the key stakeholder group whose priorities conflict with the dominant group is not present in the workshop, their concerns never enter the negotiation; (d) **Vague scenarios** — if leaf-level scenarios are too vague to represent concrete tradeoffs, stakeholders cannot meaningfully disagree about importance because they are rating different mental models of the same scenario.

