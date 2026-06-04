# Quiz: Stakeholder and Business Analysis

Test your understanding of stakeholder identification, business goal mapping, competing priorities, and executive communication in ATAM. Each question is followed by a collapsed answer block.

## Questions

### Question 1

**[Remember]** Which of the following best defines an **architectural driver**?

A. A business stakeholder who has the authority to approve architectural decisions  
B. A stakeholder concern significant enough to influence architectural decisions — constraining the solution space or elevating one quality attribute above others  
C. The software tool used to generate architecture diagrams  
D. A performance requirement expressed in milliseconds  

??? note "Answer"
    The correct answer is **B**. An **architectural driver** is a stakeholder concern that is significant enough to influence architectural decisions — it constrains the solution space or elevates one quality attribute's priority above others. Not every business concern is an architectural driver; only those that, when traced to their architectural implications, produce specific quality attribute scenarios that influence what can be built and how. Options A and C are distractors; Option D describes a specific quality attribute requirement, which may be an architectural driver but is not the definition of one.

---

### Question 2

**[Remember]** The chapter describes the traceability chain from organizational strategy to architectural decision. Place these terms in the correct order from most abstract to most concrete:

A. Architectural drivers → Business goals → Mission statement → Quality attribute scenarios → Business drivers  
B. Mission statement → Business goals → Business drivers → Architectural drivers → Quality attribute scenarios  
C. Quality attribute scenarios → Architectural drivers → Business drivers → Business goals → Mission statement  
D. Business drivers → Mission statement → Business goals → Quality attribute scenarios → Architectural drivers  

??? note "Answer"
    The correct answer is **B**. The chain runs from most abstract to most concrete: **Mission statement** (the organization's declaration of purpose) → **Business goals** (what the organization must accomplish, stated in business terms) → **Business drivers** (the specific forces that make certain goals urgent) → **Architectural drivers** (the subset of business goals/drivers that directly constrain architectural decisions) → **Quality attribute scenarios** (concrete, measurable, six-component specifications that can be evaluated architecturally). This chain is how ATAM grounds architectural analysis in organizational reality.

---

### Question 3

**[Remember]** In the interest/influence stakeholder analysis framework, which quadrant describes stakeholders who should be "managed closely"?

A. High influence, low interest  
B. Low influence, high interest  
C. High influence, high interest  
D. Low influence, low interest  

??? note "Answer"
    The correct answer is **C**. Stakeholders with **high influence AND high interest** must be managed closely — they care deeply about the outcome AND have the organizational power to approve, reject, or alter architectural decisions. They should be engaged deeply, kept fully informed, and their scenarios should be prominently incorporated in the utility tree. These are the stakeholders whose absence from Phase 2 most severely undermines an evaluation's value, and whose presence most strengthens the authority of the findings.

---

### Question 4

**[Remember]** According to the chapter, which stakeholder category is most frequently under-represented in initial stakeholder identification?

A. Senior executives and project sponsors  
B. Lead architects and principal engineers  
C. Operations/SRE staff, security officers, compliance specialists, and dependent system owners  
D. Product managers and business analysts  

??? note "Answer"
    The correct answer is **C**. The chapter specifically calls out operations and SRE staff, security and compliance officers, dependent system owners, and end-user representatives as frequently missing from initial identification. The chapter notes that these stakeholders often contribute the most severe scenarios because they have direct experience with production failure modes (operations), regulatory constraints (compliance), and actual system behavior under stress (SRE). The other options represent the "obvious" stakeholders typically identified from the project org chart.

---

### Question 5

**[Understand]** The chapter says "stakeholder analysis is not a soft skill you do to keep people happy — it is a prerequisite for even formulating the right architectural tradeoffs." Explain this statement in your own words.

??? note "Answer"
    The statement challenges the common misconception that stakeholder management is political or social work, separate from the "real" technical work of architecture. In ATAM, the architectural tradeoffs you are evaluating are fundamentally about *whose concerns take priority* when they conflict. Every architectural decision privileges some stakeholder's quality attribute over another's. If you don't know whose concerns matter most — and in what priority order — you cannot correctly prioritize quality attribute scenarios in the utility tree, cannot correctly assess which risks are critical versus acceptable, and cannot communicate findings to the people who can act on them. Stakeholder analysis is the prerequisite because it determines the priority ordering that makes all subsequent ATAM analysis meaningful. Without it, you are evaluating an architecture against the wrong targets.

---

### Question 6

**[Understand]** Describe the **HiPPO effect** in the context of stakeholder workshops, and explain two facilitation techniques from the chapter that mitigate it.

??? note "Answer"
    The **HiPPO effect** (Highest Paid Person's Opinion) occurs when the most senior person in the room anchors the group's thinking on their own priorities, discouraging other participants from raising different concerns. In a stakeholder workshop, this can cause the scenario catalog to reflect only the executive's concerns while overlooking critical operational, security, or compliance scenarios that other stakeholders would have raised. Two mitigation techniques from the chapter: (1) **Structured individual generation** — give all participants time to write scenarios individually on sticky notes *before* any group discussion; this prevents the HiPPO from anchoring others before they form their own views. (2) **Affinity grouping with quantity-visible display** — after collecting individual scenarios, group them by quality attribute visibly on a wall or shared board; the sheer quantity of scenarios in each quality attribute area becomes visible, making it immediately apparent if one stakeholder dominated while others were silenced.

---

### Question 7

**[Understand]** What is an **architecture vision document**, and how does it differ from a full architecture evaluation report?

??? note "Answer"
    An **architecture vision document** is a concise (one-to-three page) cross-audience communication artifact that connects organizational strategy to architectural intent. It contains: system purpose linked to mission and business goals, a stakeholder summary table, an architectural approach summary written for technically literate non-specialists, ranked quality attribute priorities with rationale, key constraints, and open questions. It is designed for broad readability across technical and business audiences. By contrast, the full **architecture evaluation report** is a detailed technical document produced after the complete ATAM process — containing the utility tree, risk catalog, sensitivity and tradeoff points, non-risks, and risk themes. The architecture vision document is produced during preparation and updated iteratively; the evaluation report is the final output. The vision document frames *intent*; the evaluation report documents *findings*.

---

### Question 8

**[Understand]** Why does the chapter argue that every ATAM **tradeoff point** needs an explicit *decision* recorded — not just documentation that a tradeoff exists?

??? note "Answer"
    Documenting a tradeoff without recording how it was resolved creates an architectural time bomb. If two stakeholders' priorities conflict and the tradeoff is documented as "here is the tension" but no resolution is recorded, both stakeholders may independently implement their preferred solution — producing an architecture that inconsistently applies both approaches and satisfies neither. Additionally, without a recorded resolution, future team members have no guidance when they encounter the same tension, and the same debate recurs in every new feature. The chapter's field observation: every ATAM tradeoff point needs an explicit decision — "here is how we resolved it, who authorized the resolution, and what monitoring we will use to detect if the resolution proves incorrect." This converts a tension into a traceable architectural decision with clear accountability.

---

### Question 9

**[Apply]** You are beginning an ATAM evaluation of a healthcare patient portal. The initial stakeholder list from the project manager includes: the lead architect, two senior engineers, and the product manager. Identify at least four additional stakeholder categories you should include and explain what unique scenarios each would contribute.

??? note "Answer"
    Four additional stakeholder categories and their unique scenario contributions: (1) **Security and compliance officers** — HIPAA compliance requires specific data protection, access control, and audit logging; they will contribute security and compliance scenarios (PHI access controls, audit trail completeness, breach notification windows) that engineers may not think to specify. (2) **Operations/SRE staff** — they manage the system around the clock and know which failure modes occur most frequently and most severely in production; they will contribute the highest-severity availability scenarios based on real experience, not theory. (3) **Clinical staff / end users (or their representatives)** — the patients and clinicians using the portal have usability and performance scenarios grounded in actual workflow needs (e.g., response time thresholds that match clinical workflow pacing, mobile accessibility requirements). (4) **Dependent system owners** — the EHR vendors, insurance systems, and laboratory systems that integrate with the portal have their own requirements for the interfaces the portal exposes; they will contribute interoperability and availability scenarios from the integration perspective that internal teams may not represent.

---

### Question 10

**[Apply]** An executive sponsor has just received the ATAM evaluation report. Rewrite the following technical finding into **executive briefing language**: "The system has synchronous coupling between the checkout service and the payment processing service via a blocking REST call, creating a sensitivity point where payment service latency degrades end-to-end checkout performance, and payment service outages cascade directly to checkout failures."

??? note "Answer"
    **Executive version:** "The current architecture creates a single point of failure in our most critical revenue-generating flow. When our payment partner experiences any slowdown or outage — even briefly — every customer attempting to complete a purchase receives an error or a slow experience. During our peak season, this architectural risk translates directly to lost orders and customer abandonment. The recommended change isolates checkout from payment failures so customers can complete the first steps of checkout even during payment disruptions, and payment processing continues in the background. Estimated impact: reducing checkout failure rate during payment provider incidents from 100% to under 5%. Investment required: [X] sprint cycles to implement asynchronous payment processing with graceful fallback. The decision you need to make: authorize the development investment now, before peak season, or accept the revenue risk."

---

### Question 11

**[Apply]** Using the **dot voting** technique described in the chapter, describe how you would run a 15-minute scenario prioritization session with 20 stakeholders and 40 candidate scenarios. What does the resulting vote distribution tell you?

??? note "Answer"
    Setup: Print or display all 40 scenarios on a shared surface (physical wall with sticky notes, or shared digital board). Give each stakeholder 5 votes — represented by stickers, dots, or clicks in a digital tool. Instructions: "Allocate your five votes to the scenarios you believe are most critical to the system's success. You may place all five votes on one scenario or distribute them." Run time: 5-8 minutes for voting, leaving 7-10 minutes for initial review. The resulting vote distribution tells you: (1) **Priority ordering** — scenarios with the most votes become the primary analytical focus; (2) **Stakeholder alignment or conflict** — if one scenario receives votes from across all stakeholder groups, it is a consensus priority; if votes cluster by stakeholder group (business votes one way, security another), that distribution is a visible, quantified priority conflict that must be facilitated; (3) **Coverage gaps** — quality attributes with zero or very few votes across all 40 scenarios suggest those concerns are either unrepresented (missing stakeholders) or genuinely low priority (acceptable given the system's context). The vote distribution is itself an ATAM finding.

---

### Question 12

**[Analyze]** The chapter describes architecture as "not a technical artifact — it is a set of decisions that allocate quality attribute tradeoffs among stakeholders." Analyze this framing by examining a concrete architectural choice — the decision to use eventual consistency rather than strong consistency in a distributed system — and trace how this decision allocates tradeoffs among different stakeholder groups.

??? note "Answer"
    The choice of eventual consistency is an architectural decision that allocates tradeoffs among at least four stakeholder groups with different interests. **Operations and infrastructure teams** benefit: eventual consistency enables horizontal scaling and high availability (the CAP theorem favors availability over consistency during network partitions), reducing the operational complexity of managing distributed locking and coordination. **Financial reporting and audit stakeholders** are burdened: eventual consistency means financial balances, inventory counts, and compliance-sensitive records may temporarily show different values to different parts of the system. A transaction that appears committed from one service's view may appear pending from another's — creating reconciliation complexity and potential compliance risks. **End users** experience mixed effects: they get faster response times (no blocking for consensus) but may see stale data (a payment shown as processing when it has already been approved, a product shown as in-stock when it was just sold). **Development teams** face higher modifiability costs: handling eventual consistency requires explicit conflict resolution logic, idempotency for retried operations, and compensation transactions — making each new feature more complex to implement correctly. Mapping this allocation explicitly is what ATAM's stakeholder analysis enables — making the tradeoff not a technical default but a deliberate organizational choice with known consequences for each affected group.

