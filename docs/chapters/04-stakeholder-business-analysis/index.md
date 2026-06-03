---
title: Stakeholder and Business Analysis
description: Identifying and engaging stakeholders, mapping business goals and drivers to architectural decisions, managing competing priorities, and communicating findings to executive audiences.
generated_by: claude skill chapter-content-generator
date: 2026-06-02 23:55:00
version: 0.08
---

# Stakeholder and Business Analysis

## Summary

Architecture exists to serve business goals, and this chapter teaches students how to discover, analyze, and engage the humans whose concerns shape an architecture. Students learn to identify the full spectrum of stakeholders — technical leads, operations staff, business owners, and executive sponsors — and to map their competing concerns to architectural drivers. The chapter covers stakeholder workshops, influence analysis, executive communication techniques, and the architecture vision and business case documents that align organizational strategy with technical decisions.

## Concepts Covered

This chapter covers the following 24 concepts from the learning graph:

1. Architectural Driver
2. Business Goal
3. Business Driver
4. Mission Statement
5. Strategy Alignment
6. Stakeholder Identification
7. Stakeholder Analysis
8. Stakeholder Concerns
9. Stakeholder Workshop
10. Stakeholder Engagement
11. Technical Stakeholder
12. Business Stakeholder
13. Executive Sponsor Role
14. Business-Architecture Alignment
15. Organizational Context
16. Competing Stakeholder Priorities
17. Stakeholder Influence Analysis
18. Stakeholder Communication
19. Executive Briefing Techniques
20. Decision-Making Authority
21. Architecture Business Case
22. ROI of Architecture Evaluation
23. Stakeholder Buy-In Strategies
24. Architecture Vision Document

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Software Architecture Foundations](../01-software-architecture-foundations/index.md)
- [Chapter 3: ATAM Introduction and Process Phases](../03-atam-introduction-process/index.md)

---

!!! mascot-welcome "The Human Side of Architecture Is Your Superpower"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Vista waving welcome">
    Here is something they do not teach in most software engineering programs: the greatest architectural risks are almost never purely technical. They are human. They live in the gap between what the CFO thinks the system needs to do and what the lead architect designed it to do. ATAM's secret weapon is not its technical analysis — it is its *structured human conversation*. This chapter gives you the tools to have that conversation and win it. Let's take the high-level view!

## Why Stakeholders Are the Architecture

There is a seductive but dangerous mental model that architects sometimes carry: that architecture is a technical artifact and stakeholders are the people who, inconveniently, have opinions about it. This model is wrong in both directions.

Architecture is not a technical artifact — it is a set of decisions that allocate quality attribute tradeoffs among stakeholders. Every architectural decision privileges some stakeholder's concern over another's. When you choose eventual consistency over strong consistency, you are prioritizing the availability and scalability that your operations team needs over the data precision your financial reporting team demands. When you choose a monolithic deployment over microservices, you are prioritizing the operational simplicity your small-scale operations team needs over the independent deployability your large product team wants.

Once you accept this framing, stakeholder analysis is no longer a soft skill you do to keep people happy. It is a prerequisite for even formulating the right architectural tradeoffs. You cannot prioritize quality attribute scenarios without knowing whose scenarios matter most. You cannot communicate architectural risk without knowing which risks will register as threats in the listener's mental model. You cannot obtain organizational commitment to architectural decisions without understanding who has the authority to make them.

The concepts in this chapter are the toolkit for navigating the human terrain of architecture — from identifying the right people to talk to, through facilitating productive workshops, through communicating findings in language that moves decision-makers to action.

## Identifying Stakeholders: The Hidden Network

**Stakeholder identification** is the process of discovering everyone whose concerns should inform an architectural evaluation. In theory, this sounds simple — ask the project manager for the project roster. In practice, the people who matter most to architectural decisions are often invisible in project documentation.

Before we examine the identification techniques, let us define the key terms precisely:

- **A stakeholder** is anyone who has an interest in — or can affect or be affected by — the architectural decisions of the system under evaluation. This definition is deliberately broad.
- **A stakeholder concern** is a specific quality attribute requirement, constraint, or worry that a stakeholder has about the system. One stakeholder can have multiple concerns; one concern can be shared by multiple stakeholders.
- **An architectural driver** is a stakeholder concern that is significant enough to influence architectural decisions — that is, a concern that constrains the solution space or elevates one quality attribute above others.

Stakeholder identification typically begins with the obvious: the sponsoring executive, the project manager, the lead architect. But effective ATAM evaluations require a broader net. Consider the following stakeholder categories that are frequently under-represented in initial identification:

- **Operations and site reliability engineering (SRE) staff:** They live with the consequences of availability and performance decisions around the clock. Their scenarios typically represent the most severe production failure modes.
- **Security and compliance officers:** Their constraints often override engineering preferences. Identifying them early prevents surprises when a proposed architecture runs into regulatory barriers.
- **Business analysts and product owners:** They understand the business use cases that the system must enable and can articulate modifiability requirements in terms of anticipated feature evolution.
- **End users (or user representatives):** Their usability and performance scenarios reflect the actual usage patterns the architecture must support.
- **Dependent system owners:** Systems that consume or integrate with the system under evaluation have their own quality attribute requirements for the interfaces the architecture provides.
- **Auditors and regulatory bodies:** For systems in regulated domains (healthcare, financial services, defense), regulatory requirements are effectively stakeholder constraints with legal force.

#### Diagram: Stakeholder Universe Map

<iframe src="../../sims/stakeholder-universe-map/main.html" width="100%" height="532px" scrolling="no"></iframe>

<details markdown="1">
<summary>Stakeholder Universe Map</summary>
Type: diagram
**sim-id:** stakeholder-universe-map<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Visualize the complete stakeholder universe for a typical enterprise system, organized by category, with click-to-explore capability showing each stakeholder type's primary concerns and influence on architectural decisions.

Bloom Level: Understand (L2) — Explain the different categories of stakeholders and the types of architectural concerns each brings.
Bloom Verb: Explain

Learning Objective: Students will be able to identify stakeholder categories beyond the obvious technical roles, and explain what architectural concerns are most characteristic of each category.

Canvas layout:
- Central oval labeled "System Under Evaluation"
- Concentric ring structure: inner ring = direct users and operators, middle ring = organizational stakeholders, outer ring = external/regulatory stakeholders
- Each stakeholder represented as a labeled icon placed in the appropriate ring and sector
- Color-coded sectors: Technical (blue), Business (green), Operational (orange), External (gray)
- Detail panel on the right that shows stakeholder description, primary concerns, and typical ATAM scenarios when clicked

Stakeholder icons to include:
Inner ring: End Users, Architects, Developers, Operations/SRE
Middle ring: Product Owner, Business Analyst, CFO/Executive Sponsor, Security Officer, Compliance Officer, QA/Test Lead, Data Owner
Outer ring: Regulatory Body, External System Owners, Auditors, Partner Organizations

Interactive elements:
- Click any stakeholder icon to see: role description, primary quality attribute concerns, example ATAM scenarios they might contribute, and influence level
- Hover a sector label to see its definition
- "Show Concerns" button overlays the primary concern type (performance, availability, security, modifiability, etc.) on each icon as a colored badge
- Toggle button to show/hide outer ring for different analysis scopes

Color scheme: Blue for Technical sector, Green for Business sector, Orange for Operational sector, Gray for External/Regulatory sector. Ring boundaries in neutral gray.

Responsive: Diagram scales proportionally to container width.
</details>

## Stakeholder Analysis: Beyond Identification

Identifying stakeholders is necessary but not sufficient. **Stakeholder analysis** transforms a list of names into an understanding of influence, interest, and conflict that guides evaluation planning and communication strategy.

The two dimensions most important for architecture stakeholder analysis are **interest** (how much does this stakeholder care about the outcome?) and **influence** (how much power does this stakeholder have to affect architectural decisions?). Before we apply these dimensions in a tool, let us define each:

- **Interest** reflects the degree to which a stakeholder's quality attribute concerns are at stake in the architectural decisions being evaluated. A security officer evaluating a public-facing financial system has very high interest; a procurement officer might have lower interest in the same evaluation.
- **Influence** reflects the stakeholder's organizational power to approve, reject, or alter architectural decisions. An executive sponsor has very high influence; an individual developer has lower formal influence (though their tacit knowledge may carry its own kind of influence in technical discussions).

The combination of interest and influence yields a classic two-by-two framework for engagement strategy:

| | High Influence | Low Influence |
|---|---|---|
| **High Interest** | Manage closely — engage deeply, keep informed, incorporate their scenarios prominently | Keep informed — they care about the outcome and will become advocates if well-engaged |
| **Low Interest** | Keep satisfied — they have power but may not exercise it if they feel respected | Monitor — minimal effort unless status changes |

In ATAM practice, **stakeholder influence analysis** informs which stakeholders must be included in Phase 2 workshops versus which can be represented through pre-evaluation interviews. It also informs the **executive briefing** — the high-influence, high-interest stakeholders are the audience for the ATAM risk theme presentation, and the briefing must be crafted to their decision-making style.

!!! mascot-thinking "The Underestimated Stakeholder"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Vista thinking">
    Vista has observed a pattern across dozens of architecture evaluations: the stakeholder whose concern ultimately determines the evaluation's most important finding is rarely the one whose name appears at the top of the project org chart. Often it is the operations lead who has been quietly absorbing the consequences of availability problems for two years. Or the compliance officer who has been warning about a regulatory gap nobody wanted to hear about. The ATAM process, by explicitly inviting stakeholders who are often excluded from design reviews, creates a structured opportunity for these voices to be heard — before the architecture is implemented and their warnings become expensive post-production fixes.

## From Business Goals to Architectural Drivers

The chain from organizational strategy to architectural decision runs through several conceptual levels, each of which must be made explicit in an ATAM evaluation. Understanding this chain prevents the common error of evaluating architecture against quality attribute scenarios that don't actually matter to the organization.

At the top of the chain is the **mission statement** — the organization's declaration of purpose. Below it, **business goals** articulate what the organization must accomplish to fulfill that mission: grow revenue, retain customers, comply with regulations, reduce operational costs. Business goals are stated in business terms; they do not mention technology directly.

**Business drivers** are the specific forces — market pressures, competitive dynamics, regulatory requirements, technological shifts — that make certain business goals urgent. A business driver might be "competitor X launched a mobile-first product and is capturing our market segment" or "new EU AI regulation requires audit trails for all automated decisions." Business drivers give urgency and priority to business goals.

**Architectural drivers** are the subset of business goals and business drivers that directly constrain or prioritize architectural decisions. Not every business goal is an architectural driver — "improve employee satisfaction" is a business goal, but it does not directly drive architectural choices (unless the "employees" in question are developers and the goal is about development velocity). An architectural driver is one that, when traced to its architectural implications, produces specific quality attribute scenarios that influence the solution space.

The mapping from business goal to architectural driver to quality attribute scenario is the heart of ATAM's Phase 1 business driver presentation. Making this chain explicit serves two purposes: it shows stakeholders that the architecture is grounded in organizational reality, and it gives the evaluation team the evidence they need to adjudicate between competing quality attribute priorities.

## Strategy Alignment and Organizational Context

**Strategy alignment** is the property of an architecture that reflects and advances the organization's strategic direction. An architecture that is technically elegant but strategically misaligned is — by ATAM's lights — an architecture with a systemic risk: the risk that it will be abandoned or re-platformed when the business strategy changes.

Establishing strategic alignment requires understanding the **organizational context**: the structure of the organization, its decision-making culture, its technology history (including the legacy systems and commitments that constrain the solution space), and its risk tolerance. An organization with a strong regulatory compliance culture will weight security and auditability scenarios differently than a fast-moving startup where time-to-market dominates. An organization with a significant legacy estate will weight integration and migration scenarios that a greenfield project can ignore.

The **architecture vision document** is the artifact that captures the alignment between organizational strategy and architectural intent. A well-crafted architecture vision document:

- Connects the system's purpose to the organization's mission and strategic goals
- States the principal quality attribute priorities and explains why they are ordered as they are
- Describes the architectural approach at a level of abstraction that business stakeholders can evaluate
- Identifies the major constraints — technical, organizational, regulatory — that bound the solution space
- Defines what "done" means for the architecture evaluation: what questions must be answered, what risks must be assessed

The architecture vision document is not a detailed design document — it is the shared frame of reference that allows technical and business stakeholders to discuss architectural decisions using a common vocabulary.

#### Diagram: Business Goals to Architecture Driver Mapping

<iframe src="../../sims/business-to-architecture-mapping/main.html" width="100%" height="592px" scrolling="no"></iframe>

<details markdown="1">
<summary>Business Goals to Architecture Driver Mapping</summary>
Type: diagram
**sim-id:** business-to-architecture-mapping<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Visualize the traceability chain from mission statement through business goals, business drivers, architectural drivers, and quality attribute scenarios, using a realistic example system.

Bloom Level: Analyze (L4) — Trace the connection between business goals and specific architectural decisions to explain why an architectural priority exists.
Bloom Verb: Trace (Analyze)

Learning Objective: Students will be able to trace an architectural driver backward to its originating business goal and business driver, demonstrating that architectural decisions are grounded in organizational context.

Canvas layout:
- Vertical hierarchy with five levels: Mission → Business Goals → Business Drivers → Architectural Drivers → QA Scenarios
- Each level shown as a horizontal band with items in rounded boxes
- Connecting arrows between items at adjacent levels showing derivation relationships
- Example system: a healthcare patient portal
- A selected item highlights all items it connects to (upward and downward) with golden lines

Content for example:
Mission: "Deliver high-quality patient care through technology-enabled services"

Business Goals (3):
- Increase patient portal adoption to 70%
- Maintain HIPAA compliance
- Reduce operational costs by 15%

Business Drivers (4):
- Patients increasingly prefer mobile-first interactions
- HIPAA Omnibus Rule enforcement intensified
- IT budget constrained by COVID-era expansion
- Competing hospital network launched faster patient scheduling

Architectural Drivers (4):
- Sub-2-second response time for all patient-facing interactions
- End-to-end audit trail for all PHI access
- Independent deployability of portal modules for cost-effective scaling
- Graceful degradation when EHR integration is unavailable

QA Scenarios (4, one per driver):
- Performance: Patient submits appointment request; system responds with confirmation in <2s under 500 concurrent users
- Security: All PHI field access logged with user ID, timestamp, and action within 50ms of access event
- Modifiability: A new portal module can be deployed without redeploying the core portal application
- Availability: When EHR integration is down, portal continues serving scheduling features with cached provider availability data

Interactive elements:
- Click any item to highlight its complete traceability chain (up and down)
- Hover any connecting arrow to see the reasoning link ("because... therefore...")
- Toggle button to show a different example domain (e-commerce, defense, financial services)
- "Add Item" mode allows students to add a new business goal and trace its implications downward

Color scheme: Purple for Mission, Blue for Business Goals, Teal for Business Drivers, Gold for Architectural Drivers, Orange for QA Scenarios.

Responsive: Hierarchy adjusts column width based on container; items wrap to multiple lines on narrow screens.
</details>

## Managing Competing Stakeholder Priorities

In any system of meaningful complexity, stakeholders will have conflicting priorities. The operations team wants maximum stability — the fewer deployments the better. The product team wants maximum velocity — deploy as often as possible. The security team wants end-to-end encryption at every boundary — at the cost of performance and complexity. The performance team wants minimal latency — sometimes achievable only by relaxing security boundaries.

These conflicts are not failures of stakeholder cooperation. They are the natural expression of the tradeoffs inherent in complex systems. **Competing stakeholder priorities** are information, not problems. The question is not "how do we eliminate the conflict?" but "how do we acknowledge, document, and adjudicate the conflict in a way that produces a defensible architectural decision?"

ATAM's utility tree is the primary mechanism for making these conflicts visible and resolvable. When two stakeholders assign different importance scores to the same scenario, the difference is a conversation starter — not about who is right, but about which organizational goal takes precedence in this system, at this time, given these constraints. Facilitated well, this conversation produces consensus. Even when consensus is not achievable, it produces a documented record of the disagreement that the architecture owner can use to escalate to a **decision-making authority** — the individual or body with the organizational power to break the tie.

Understanding decision-making authority is as important as understanding stakeholder concerns. An evaluation team that produces a technically perfect risk catalog but delivers it to the wrong audience — one that lacks the authority to act on the findings — has done half the job. Mapping decision-making authority to architectural decisions ensures that every finding reaches someone who can do something about it.

!!! mascot-warning "The Priority Conflict Trap"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Vista warning">
    A common and expensive architectural failure mode: the evaluation team discovers a genuine conflict between two stakeholders' priorities, notes it as a tradeoff point, and moves on. Nobody documents what was decided about the tradeoff, and nobody with authority signs off on the resolution. Six months later, both stakeholders implement their preferred solution independently, and you have an architecture that satisfies neither. Vista's field observation: every ATAM tradeoff point needs an explicit *decision* recorded — not just "here is the tradeoff" but "here is how we resolved it, who authorized the resolution, and what monitoring we will use to detect if the resolution proves incorrect."

## Stakeholder Workshops: Facilitation in Practice

The **stakeholder workshop** is the operational heart of ATAM Phase 2. Its success depends on facilitation quality more than any other single factor. A room full of the right people with the right information will produce poor findings if the facilitator cannot manage the group dynamics effectively.

Several facilitation techniques are particularly valuable in ATAM workshops:

**Structured scenario generation:** Give stakeholders individual time to write scenarios before discussing them as a group. This prevents the "HiPPO effect" (Highest Paid Person's Opinion dominates) and surfaces scenarios from quieter participants who have valuable perspectives.

**Affinity grouping:** After collecting scenarios from all stakeholders individually, group them by quality attribute using sticky notes or a digital equivalent. This makes the quantity of scenarios in each quality attribute area visible, which itself is information — a cluster of thirty security scenarios from four different stakeholders signals a different organizational priority than two security scenarios from one voice.

**Dot voting:** Give each stakeholder a fixed number of votes to allocate across the scenario groups. This produces a stakeholder-weighted priority ordering in minutes, without lengthy negotiation. The distribution of votes often reveals priority conflicts immediately — if the business owners vote heavily for performance scenarios and the security team votes heavily for security scenarios, you have a visible, quantified priority conflict to facilitate.

**Plenary analysis:** After scenario prioritization, conduct the architectural approach analysis in plenary (everyone watching) rather than in subgroups. This keeps all stakeholders informed about findings as they emerge and gives the evaluation team access to the entire stakeholder community's reactions in real-time.

**Stakeholder engagement** does not end when the evaluation sessions conclude. Effective evaluation leaders maintain stakeholder communication throughout the consolidation period between phases and during report preparation, providing status updates that keep stakeholders invested in the process and its outcomes.

## Communicating Findings to Executive Audiences

The most technically sophisticated architecture evaluation produces zero value if its findings sit in a report that no one in authority reads or understands. Executive communication is not a soft skill add-on to ATAM — it is a core competency.

Executive audiences have four characteristics that shape communication strategy:

1. **Time scarcity:** Executives have minutes, not hours, to absorb findings. Every additional word competes with every other demand on their attention.
2. **Business framing:** Executives think in terms of business outcomes (risk, cost, revenue, compliance), not technical mechanisms. "Synchronous call chains create latency" is not executive language. "The current architecture creates a single point of failure that will cause customer-facing downtime during our peak season" is executive language.
3. **Decision authority:** Executives are present to make decisions, not to be educated. Findings should be structured as decision points: "here is the risk, here is the mitigation, here is the cost of the mitigation, here is the cost of not mitigating, and here is the decision you need to make."
4. **Trust in credibility:** Executive audiences will engage more deeply if they can see that the findings are backed by stakeholder input — not just the evaluation team's opinions. Statements like "seventeen of your twenty stakeholders rated this scenario as high importance" carry more weight than "we assessed this as high priority."

**Executive briefing techniques** include leading with risk themes (not individual risks), quantifying business impact wherever possible, structuring each finding as a recommendation with options, and ending with a clear call to action (who needs to decide what by when).

The **architecture business case** and **ROI of architecture evaluation** documents provide the quantitative underpinning for executive engagement. The architecture business case argues for a specific architectural investment (or change) in business terms — cost of current approach, cost of proposed change, expected quality attribute improvement, expected business outcome improvement. The ROI of architecture evaluation frames the cost of the ATAM evaluation itself against the expected value of the risks identified — in practice, a single identified and mitigated risk often represents more value than the entire evaluation cost.

**Stakeholder buy-in strategies** for architectural changes draw on organizational change management principles. Effective strategies include:

- Early involvement: stakeholders who participate in the evaluation process are more likely to accept its findings
- Transparent rationale: showing the evidence trail from scenario to risk to recommendation reduces the perception that findings are arbitrary
- Incremental commitment: seeking approval for small, reversible steps before large irreversible ones reduces organizational risk tolerance barriers
- Pilot validation: demonstrating a proposed architectural approach in a low-stakes context before requiring organization-wide adoption

#### Diagram: Stakeholder Priority Conflict Resolution

<iframe src="../../sims/stakeholder-priority-matrix/main.html" width="100%" height="562px" scrolling="no"></iframe>

<details markdown="1">
<summary>Stakeholder Priority Conflict Resolution Matrix</summary>
Type: microsim
**sim-id:** stakeholder-priority-matrix<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive simulation of a stakeholder priority workshop using dot voting, showing how competing stakeholder priorities produce a negotiated architectural driver ranking.

Bloom Level: Apply (L3) — Use the stakeholder priority workshop process to produce a defensible quality attribute scenario ranking from conflicting stakeholder inputs.
Bloom Verb: Use

Learning Objective: Students will be able to simulate a stakeholder priority workshop by assigning votes to scenarios from multiple stakeholder perspectives and observing how the aggregate priority ranking emerges from individual votes.

Canvas layout:
- Left panel: Six quality attribute scenario cards, each showing scenario title and brief description
- Top bar: Four stakeholder role buttons (Business Owner, Security Officer, Operations Lead, Product Manager) — clicking selects active stakeholder
- Center: Voting panel showing current stakeholder's remaining votes (5 per stakeholder) and allocated votes per scenario
- Right panel: Live aggregate bar chart showing total votes per scenario, updating as votes are added
- Bottom: "Final Rankings" button that locks in all votes and shows the prioritized list with stakeholder breakdown

Scenarios (six):
1. Performance: API response under 200ms for 500 concurrent users
2. Availability: 99.9% uptime excluding planned maintenance
3. Security: All transactions logged with tamper-evident audit trail
4. Modifiability: New payment method integrated in under 2 sprint cycles
5. Scalability: System handles 10× load during peak season without manual intervention
6. Compliance: GDPR right-to-erasure fulfilled within 72 hours of request

Default stakeholder vote distributions (pre-set but editable):
- Business Owner: 3 votes Performance, 2 votes Scalability
- Security Officer: 4 votes Security, 1 vote Compliance
- Operations Lead: 3 votes Availability, 2 votes Scalability
- Product Manager: 3 votes Modifiability, 1 vote Performance, 1 vote Availability

Behavior:
- Student selects a stakeholder and drags or clicks to allocate votes
- Aggregate bar chart updates in real-time
- Conflicts (e.g., Security Officer and Business Owner weighting different scenarios) are highlighted when the "Show Conflicts" button is pressed
- "Final Rankings" locks the vote and shows the prioritized list and a "conflict analysis" panel

Data Visibility Requirements:
- Always show remaining votes per active stakeholder
- Always show current aggregate totals
- When conflict is shown, highlight the specific scenarios where stakeholders diverge by 3+ votes

Instructional Rationale: Active voting simulation is appropriate because the Apply objective requires students to practice the workshop process with concrete values, not just read about it. The real-time aggregate chart makes the emergence of priority order visible.

Color scheme: Blue for Business Owner votes, Red for Security Officer, Orange for Operations Lead, Green for Product Manager. Gold for the aggregate bar chart.

Responsive: Layout reflows to vertical stacking on narrow screens.
</details>

## The Architecture Vision Document in Practice

The **architecture vision document** deserves a closer look as a practical communication artifact. Unlike the full architecture evaluation report — which is a detailed technical document — the architecture vision document is a one-to-three-page artifact designed for cross-audience readability.

A well-structured architecture vision document contains:

1. **System purpose:** One paragraph connecting the system to the organization's mission and business goals
2. **Stakeholder summary:** A table listing each stakeholder group, their primary concerns, and how the architecture addresses those concerns
3. **Architectural approach summary:** A half-page description of the principal architectural decisions and their rationale, written for a technically literate but non-specialist audience
4. **Quality attribute priorities:** A ranked list of the top three to five quality attributes the architecture is designed to optimize, with brief rationale for the ranking
5. **Key constraints:** The non-negotiable boundaries (regulatory, technical, contractual) that define the solution space
6. **Open questions:** Architectural decisions that have not yet been made and that require stakeholder input or further analysis

The architecture vision document is produced during the preparation phase and updated after the Phase 1 and Phase 2 evaluations. It serves as the living record of architectural intent that governance mechanisms (fitness functions, ARB reviews, conformance checks from Chapter 2) can test against.

!!! mascot-celebration "You Can Now Map the Human Terrain!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Vista celebrating">
    This was a big chapter, fellow architects! You have just acquired the stakeholder analysis toolkit that separates architects who evaluate architectures from architects who *change organizations*. You know how to find the hidden stakeholders, analyze their influence and interests, map business goals to architectural drivers, manage priority conflicts, and communicate findings in language that moves decision-makers to action. That is the full human-terrain superpower. Next chapter: quality attributes — the technical vocabulary you need to make the stakeholder conversations precise and actionable.

## Key Takeaways

Stakeholder and business analysis is the foundation on which all ATAM technical analysis rests:

- **Stakeholders** are anyone affected by or able to affect architectural decisions — the full set extends far beyond the obvious project team
- **Stakeholder concerns** are specific quality attribute requirements or worries; **architectural drivers** are the subset that directly influence the solution space
- **Business goals** → **business drivers** → **architectural drivers** → **quality attribute scenarios** is the traceability chain that grounds architecture in organizational reality
- **Stakeholder analysis** requires examining both interest and influence; the combination determines engagement strategy
- **Strategy alignment** ensures architecture reflects organizational direction; the **architecture vision document** captures this alignment
- **Competing stakeholder priorities** are information about organizational tradeoffs — the utility tree is the mechanism for making them explicit and resolvable
- **Decision-making authority** must be mapped to architectural decisions so that every finding reaches someone with the power to act on it
- **Executive communication** requires business framing, decision-point structure, and stakeholder-validated evidence — not technical detail
- **Stakeholder buy-in** is achieved through early involvement, transparent rationale, incremental commitment, and pilot validation

??? question "Self-Check: Stakeholder Analysis — Click to Reveal Answers"
    **Q1:** You are preparing for an ATAM evaluation of an online payment processing system. You have identified the engineering team, the product manager, and the CTO as stakeholders. Which important stakeholder categories are you likely missing?

    **Answer:** You are likely missing: Security and compliance officers (PCI-DSS compliance is central to payment processing), Operations/SRE staff (they manage production reliability), fraud analysts (they have specific quality attribute requirements for detection latency and accuracy), dependent system owners (merchants and financial institutions that integrate with the payment system), legal/regulatory representatives, and potentially end users (merchants who interact with the payment API). Each of these groups will bring scenarios that the engineering team cannot represent.

    ---

    **Q2:** An executive sponsor says, "I don't need to attend the ATAM workshop — just send me the report." How would you respond, and what is the risk of accepting this arrangement?

    **Answer:** You would respectfully explain that the executive sponsor's participation in Phase 2 is valuable not just to receive findings but to contribute business driver context and participate in scenario prioritization — their influence on organizational priorities affects which risks get rated as high-severity. The risk of the "send me the report" arrangement is twofold: first, the evaluation may underweight scenarios that align with the executive sponsor's actual priorities because their voice was absent; second, the executive sponsor has less investment in the findings and may be less likely to authorize recommended mitigations.

    ---

    **Q3:** Two stakeholders have directly conflicting quality attribute priorities for the same scenario: the performance engineer rates it (H, H) and the security officer wants the same scenario ranked (H, H) for a competing security scenario, and both argue that their scenario must be addressed first. The available capacity allows fully implementing only one. How does ATAM handle this conflict?

    **Answer:** ATAM surfaces this conflict as a **tradeoff point** — an architectural decision (or resource allocation decision) that simultaneously serves one quality attribute at the expense of another. The resolution is not the evaluation team's job. The evaluation team documents the tradeoff: "Implementing the performance scenario at its current design point will degrade the security scenario's achievability by X; implementing the security scenario will degrade the performance scenario's achievability by Y." This structured documentation then goes to the **decision-making authority** — the person or body with organizational power to choose — along with the business goal analysis that explains which stakeholder's concern has higher strategic priority.
