# Quiz: ATAM Introduction and Process Phases

Test your understanding of ATAM's definition, origins, two-phase structure, team roles, and related evaluation methods. Each question is followed by a collapsed answer block.

## Questions

### Question 1

**[Remember]** What are ATAM's four categories of output?

A. Risks, requirements, recommendations, and reports  
B. Risks, non-risks, sensitivity points, and tradeoff points  
C. Threats, vulnerabilities, mitigations, and residuals  
D. Scenarios, approaches, findings, and actions  

??? note "Answer"
    The correct answer is **B**. ATAM produces four specific categories of structured findings: **Risks** — architectural decisions that could lead to quality attribute failures under realistic conditions; **Non-risks** — decisions that are well-reasoned and defensible given stated quality attribute priorities; **Sensitivity points** — individual decisions with a strong, acute effect on a single quality attribute; **Tradeoff points** — decisions that simultaneously push two or more quality attributes in opposing directions. These are not opinions but evidence-backed findings produced through a documented process.

---

### Question 2

**[Remember]** Where was ATAM developed, and who were its primary creators?

A. At MIT Lincoln Laboratory by Barry Boehm and David Parnas  
B. At the Software Engineering Institute (SEI) at Carnegie Mellon University, primarily by Mark Klein and Rick Kazman  
C. At IBM Research by Grady Booch and the UML working group  
D. At Stanford's Human-Computer Interaction group, focused on usability evaluation  

??? note "Answer"
    The correct answer is **B**. ATAM was developed at the **Software Engineering Institute (SEI)** at Carnegie Mellon University in the mid-1990s. The lead researchers were **Mark Klein** and **Rick Kazman**. The canonical ATAM technical report was published in 2000 (CMU/SEI-2000-TR-004). This institutional pedigree matters because it gives ATAM an empirical foundation — the method was validated on real projects and refined through hundreds of evaluations before publication.

---

### Question 3

**[Remember]** Which method is ATAM's direct predecessor, and what was that method's primary focus?

A. ARID (Active Reviews for Intermediate Designs) — focused on incomplete early-stage designs  
B. Mini-ATAM — focused on rapid internal evaluation without external evaluators  
C. SAAM (Software Architecture Analysis Method) — focused specifically on change scenarios and modifiability  
D. QAW (Quality Attribute Workshop) — focused on stakeholder scenario elicitation  

??? note "Answer"
    The correct answer is **C**. **SAAM** (Software Architecture Analysis Method), developed by Kazman, Bass, Abowd, and Webb in 1994, was the first structured method for evaluating software architectures and ATAM's direct predecessor. SAAM focused specifically on **change scenarios** — how well an architecture supported anticipated modifications. ATAM evolved from SAAM by extending the analysis beyond modifiability to the full range of quality attributes and introducing the utility tree structure for prioritizing scenarios.

---

### Question 4

**[Remember]** What is the primary difference between ATAM Phase 1 and Phase 2 in terms of participants?

A. Phase 1 uses external evaluators; Phase 2 uses only internal team members  
B. Phase 1 involves the evaluation team and architecture team only; Phase 2 brings in the broader stakeholder community  
C. Phase 1 is remote/asynchronous; Phase 2 is always conducted in person  
D. Phase 1 focuses on functional requirements; Phase 2 focuses on quality attributes  

??? note "Answer"
    The correct answer is **B**. **Phase 1** involves only the core evaluation team and the architecture owner's team; it produces a preliminary utility tree and initial risk catalog. **Phase 2** brings in the full stakeholder community — business owners, operations staff, security officers, compliance specialists, dependent system owners — who validate Phase 1 findings, contribute scenarios from their own perspectives, and participate in prioritization. This two-phase structure means the evaluation team arrives at Phase 2 already knowledgeable, enabling productive facilitation rather than basic education of the evaluation team.

---

### Question 5

**[Understand]** Explain why the **scripted nature** of ATAM's architecture briefing is important, and what the scripted format forces the architecture owner to do.

??? note "Answer"
    The scripted architecture briefing format — covering system context, technical constraints, architectural approaches, and rationale — is important for two reasons. First, it ensures **completeness**: every evaluation covers the same ground in the same order, making findings comparable across evaluations and ensuring nothing critical is omitted. Second, it forces the architecture owner to **articulate decisions explicitly** — often for the first time in this structured form. Many architectural decisions exist only as implicit understanding among team members; the scripted briefing requirement forces these decisions to be stated in language that a team of evaluators with fresh eyes can understand and question. This externalization of tacit knowledge is frequently where the most valuable evaluation insights begin.

---

### Question 6

**[Understand]** Describe the four **evaluation team roles** in ATAM and the primary responsibility of each.

??? note "Answer"
    **The Evaluation Leader** is the process owner: they facilitate all sessions, enforce the scripted agenda, manage time, and are ultimately responsible for the quality of evaluation outputs. This role requires both ATAM knowledge and group facilitation skills. **The Architecture Owner** is the individual most responsible for the architectural decisions under evaluation — typically the lead architect. They present the architecture briefing, answer design questions, and engage with scenario analysis. **The Note-Taker** captures all findings during sessions — identified approaches, preliminary risks, scenario details, analysis conclusions. Complete and accurate notes are the raw material for the final report; poor note-taking produces vague findings. **Stakeholders** are everyone else with a stake in the system's success: business owners, end users, operations staff, security officers. In Phase 2, they actively contribute scenarios and validate the evaluation team's understanding of priorities.

---

### Question 7

**[Understand]** What is an **evaluation planning document**, and what does it specify?

??? note "Answer"
    The evaluation planning document is the central artifact of ATAM's preparation phase — it transforms a request for evaluation into a workable plan. It specifies: (1) the system under evaluation and its scope (partly defined by the system context diagram); (2) the evaluation team composition, roles, and responsibilities; (3) the stakeholders who will be invited to Phase 2 and their interests; (4) the logistics (schedule, location, tooling, documentation format); (5) the known business drivers and quality attribute priorities, gathered through pre-evaluation interviews; and (6) the existing architectural documentation to be reviewed before Phase 1. This document prevents scope creep, ensures the right people are involved, and gives the evaluation team enough context to arrive at Phase 1 prepared to analyze, not merely observe.

---

### Question 8

**[Understand]** What are **risk themes** in ATAM, and why are they particularly valuable for executive audiences?

??? note "Answer"
    **Risk themes** are higher-level patterns that group related individual risks into systemic architectural concerns. They are the most important findings for executive audiences. Rather than presenting executives with a catalog of 47 individual risks, the evaluation team identifies four or five risk themes — systemic patterns underlying the individual findings — that frame architectural concerns at the level of strategic decision-making. For example, "the system has no graceful degradation strategy for its external dependencies" is a more actionable theme for an executive than a list of 12 specific integration risk items. Risk themes are valuable to executives because they speak in terms of business consequences and strategic exposure, not technical mechanisms, and they frame the evaluation's findings as decision points rather than audit findings.

---

### Question 9

**[Apply]** A project team claims they "did ATAM" on their new system. When you ask to see the artifacts, they show you: (a) a two-hour meeting agenda, (b) a list of architectural concerns raised by the team, and (c) a three-page summary report with recommended changes. Evaluate whether this constitutes an ATAM evaluation, and identify what is missing.

??? note "Answer"
    This does **not** constitute an ATAM evaluation — it is at best an informal architecture review or lightweight evaluation. What is missing: (1) **A utility tree** — ATAM requires a hierarchical decomposition of quality attribute scenarios with importance and difficulty ratings; without it there is no structured prioritization of what matters most; (2) **A prioritized scenario set** — scenarios must be formally elicited, structured in six-component form, and stakeholder-prioritized; a list of concerns is not a scenario catalog; (3) **Formal risk catalog** — risks must be categorized as risks, non-risks, sensitivity points, or tradeoff points, each with evidence; a recommendations summary is not a risk catalog; (4) **Two-phase structure** — no indication that a broader stakeholder community validated priorities; (5) **Scripted presentations** — no indication that business drivers and architecture briefing followed the structured format. The team may have done a valuable design review, but applying the "ATAM" label to it misrepresents the rigor and outputs of an actual evaluation.

---

### Question 10

**[Apply]** You are advising a startup with a team of 8 engineers, a 2-week timeline, and a relatively simple system architecture. They want to evaluate their architecture before a major launch. Which evaluation method from the chapter's comparison table would you recommend, and why?

??? note "Answer"
    For a small team, short timeline, and relatively simple system, **Mini-ATAM** is the appropriate recommendation. A full ATAM evaluation (4-8 days, 8-20 participants) is disproportionate to the scale. Mini-ATAM can be conducted in approximately one day with the internal team, without external evaluators, and still produces the minimum viable outputs: a utility tree, a prioritized scenario set, and a documented risk catalog. The key limitation to communicate to the team: without independent external evaluators, the process is susceptible to confirmation bias — the team may unconsciously avoid examining scenarios that would reveal weaknesses in their own decisions. To mitigate this, the team should explicitly invite one or two trusted external colleagues (another engineer, a technical advisor) to participate as independent evaluators. If any specific architectural decision is particularly high-stakes, an ARID session (half a day) could supplement the Mini-ATAM for that one decision.

---

### Question 11

**[Apply]** During ATAM Phase 2 scenario brainstorming, the most vocal participant — the project's CTO — immediately suggests that performance is the only important quality attribute and discourages other participants from raising security or availability scenarios. As the evaluation leader, how would you handle this situation?

??? note "Answer"
    This is the "HiPPO effect" (Highest Paid Person's Opinion) in action — a common workshop dynamic where the most senior voice anchors the group on a narrow set of concerns. As the evaluation leader, the response is: (1) **Structured individual generation before group discussion** — give all participants 5 minutes to write scenarios individually on sticky notes before any group discussion, preventing anchoring; (2) **Explicit coverage framing** — explain at the outset that a complete ATAM evaluation requires scenarios across all quality attribute families, and that Phase 2's unique value is the breadth of stakeholder perspectives; (3) **Perspective rotation** — explicitly ask quieter stakeholders to generate scenarios from their specific vantage points ("Operations team: what would cause you to be paged at 2am?"); (4) **Process authority** — the evaluation leader has process authority to redirect conversations: "Thank you — we'll analyze performance in depth. For the next 10 minutes, let's hear from the security and operations teams about their concerns." The evaluation leader must enforce the process even when senior stakeholders resist.

---

### Question 12

**[Analyze]** ATAM was described in the chapter as producing "defensible, shared, stakeholder-validated" findings. Analyze what each of these three properties contributes to the organizational value of ATAM's outputs, and how the method's design features produce each property.

??? note "Answer"
    **Defensible** means the findings are backed by structured evidence and a documented process, not arbitrary opinions. ATAM produces defensibility through: the scripted presentations (ensuring complete coverage), the formal risk categorization (risks vs. non-risks vs. sensitivity points vs. tradeoff points), and the utility tree (which traces each finding to a specific stakeholder-rated scenario). When challenged, an ATAM evaluator can show exactly which scenario, which architectural approach, and which quality attribute evidence led to each finding. **Shared** means the findings represent a collective understanding, not one person's view. ATAM produces shared findings through: the two-phase structure (both the architecture team and the broader stakeholder community engage with the same analysis), the facilitated Phase 2 workshops (all stakeholders see findings as they emerge in plenary), and the priority negotiation process (disagreements are resolved through facilitated discussion rather than assigned by fiat). **Stakeholder-validated** means the quality attribute priorities underlying the findings have been explicitly endorsed by the people who will live with the consequences. ATAM produces validation through the dot-voting prioritization of scenarios in Phase 2 — the stakeholder group collectively determines which scenarios drive the evaluation's analytical focus, creating investment in and ownership of the findings.

