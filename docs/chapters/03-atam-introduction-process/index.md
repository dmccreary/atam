---
title: ATAM Introduction and Process Phases
description: ATAM's definition, origins at CMU SEI, Phase 1 and Phase 2 activities, team roles, scripted presentations, evaluation outputs, and related methods — the complete procedural framework for running an architecture evaluation.
generated_by: claude skill chapter-content-generator
date: 2026-06-02 23:50:00
version: 0.08
---

# ATAM Introduction and Process Phases

## Summary

This chapter introduces the Architecture Tradeoff Analysis Method from the ground up, tracing its origins at the CMU Software Engineering Institute and explaining its place among architecture evaluation methods. Students learn the full two-phase process structure, the roles each team member plays, and the scripted presentation techniques that give ATAM evaluations their structured, repeatable character. The chapter also surveys related methods — SAAM, ARID, mini-ATAM, and lightweight evaluation — so students can select the right tool for a given situation.

## Concepts Covered

This chapter covers the following 25 concepts from the learning graph:

1. ATAM Definition
2. ATAM Origins at CMU SEI
3. ATAM Goals and Principles
4. ATAM Phase 1
5. ATAM Phase 2
6. Evaluation Team Composition
7. Evaluation Leader Role
8. Architecture Owner Role
9. Note-Taker Role
10. Stakeholder Role in ATAM
11. ATAM Phase 1 Activities
12. ATAM Phase 2 Activities
13. ATAM Scripted Presentations
14. ATAM Outputs Summary
15. Mini-ATAM
16. ATAM vs SAAM Comparison
17. SAAM Method
18. ARID Method
19. Lightweight Architecture Eval
20. Architecture Review Methods
21. ATAM Preparation Phase
22. Evaluation Planning Document
23. ATAM Team Formation
24. Architecture Briefing Format
25. Scripted Architecture Briefing

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Software Architecture Foundations](../01-software-architecture-foundations/index.md)

---

!!! mascot-welcome "Your ATAM Superpower Starts Here!"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Vista waving welcome">
    Fellow architects, this is it — the chapter where your hidden superpower takes shape! ATAM is not a bureaucratic audit. It's a structured conversation that transforms vague stakeholder anxieties into explicit, actionable architectural intelligence. By the end of this chapter, you will know exactly how ATAM works, who plays what role, and how the whole two-phase process produces findings that organizations trust enough to make multimillion-dollar decisions with. Let's take the high-level view!

## What Is ATAM? A Definition Worth Memorizing

The **Architecture Tradeoff Analysis Method (ATAM)** is a structured, facilitated process for evaluating software architecture decisions against explicitly stated quality attribute requirements and business goals. The key word in that definition is *tradeoff*. ATAM does not ask "is this a good architecture?" in the abstract — it asks "given these specific quality attribute priorities, how well does this architecture serve them, and where does serving one quality attribute compromise another?"

This framing matters for a fundamental reason: every non-trivial architectural decision involves tradeoffs. A decision to use event-driven messaging between services improves availability and scalability but increases complexity and makes debugging harder. A decision to cache aggressively improves performance but may compromise consistency. A decision to enforce strict security at every service boundary improves security but adds latency. ATAM makes these tradeoffs explicit, names them, and communicates them to stakeholders before implementation locks them in.

ATAM produces four categories of output:

- **Risks:** Architectural decisions that could lead to quality attribute failures under realistic conditions
- **Non-risks:** Architectural decisions that are well-reasoned and defensible, given the stated quality attribute priorities
- **Sensitivity points:** Individual architectural decisions that have a strong, acute effect on a single quality attribute
- **Tradeoff points:** Architectural decisions that simultaneously pull two or more quality attributes in opposing directions

These outputs are not opinions. They are structured, evidence-backed findings produced by a team of evaluators working through a documented process. That is ATAM's superpower — not finding problems (any experienced architect can find problems), but producing a defensible, shared, stakeholder-validated record of what the architectural risks and tradeoffs actually are.

## Origins at CMU SEI: Where ATAM Was Born

ATAM was developed at the **Software Engineering Institute (SEI)** at Carnegie Mellon University in the mid-1990s. The lead researchers were **Mark Klein** and **Rick Kazman**, working in the context of SEI's broader research program on software architecture and quality attributes.

ATAM did not emerge in a vacuum. Its intellectual lineage runs through several predecessor methods:

- **SAAM (Software Architecture Analysis Method),** developed by Kazman, Bass, Abowd, and Webb in 1994, was the first structured method for evaluating software architectures. SAAM focused on change scenarios — analyzing how well an architecture supported anticipated changes. ATAM evolved from SAAM by extending the analysis beyond modifiability to encompass the full range of quality attributes, and by introducing the utility tree structure for prioritizing scenarios.
- **The Quality Attribute Workshop (QAW),** a facilitation technique for eliciting quality attribute scenarios from stakeholders, was developed in parallel with ATAM and is now commonly used in the preparation phase.
- **The Active Reviews for Intermediate Designs (ARID)** method, developed later, addresses a different problem: reviewing designs that are not yet fully specified. ARID uses peer review techniques to evaluate early-stage designs against a specific set of concerns.

The SEI published the canonical ATAM technical report in 2000 (CMU/SEI-2000-TR-004), and the method has been applied to hundreds of systems across defense, financial services, healthcare, transportation, and enterprise software domains. That publication remains the authoritative source and is freely available from the SEI website.

!!! mascot-thinking "Why the SEI Pedigree Matters"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Vista thinking">
    ATAM's CMU SEI origins are not mere academic pedigree — they give the method something most architecture review processes lack: a rigorous empirical foundation. The SEI validated ATAM on real projects, measured inter-rater reliability of findings, and refined the process through hundreds of evaluations. When you use ATAM, you are not using someone's blog-post opinion about architecture review. You are using a method whose efficacy has been studied and whose outputs have been shown to correlate with actual project outcomes. That's the kind of authority that gets executive attention.

## The Two-Phase Structure: An Overview

ATAM is organized into two distinct phases, separated by a period of consolidation by the evaluation team. Before either phase begins, there is a **preparation phase** where the team forms, the evaluation is planned, and logistical groundwork is laid.

**Phase 1** (typically one to two days) involves the core evaluation team and the architecture owner's team. The focus is on understanding the architecture and producing a preliminary analysis: risk and sensitivity point identification, an initial utility tree, and early scenario brainstorming.

**Phase 2** (typically one to two days, with a gap of days or weeks after Phase 1) brings in the broader stakeholder community. Stakeholders validate and extend the utility tree, contribute their own scenarios, and review the Phase 1 findings. The evaluation team refines and expands its analysis based on this broader input.

The two-phase structure is one of ATAM's most important design decisions. By conducting a preliminary analysis before the stakeholder session, the evaluation team arrives at Phase 2 with enough background knowledge to facilitate productively. Stakeholders do not have to teach the team how the system works — they can immediately engage on the architecture's alignment with their priorities.

The following table summarizes the key characteristics of each phase:

| Dimension | Preparation | Phase 1 | Phase 2 |
|-----------|------------|---------|---------|
| Participants | Evaluation team only | Eval team + architecture team | All stakeholders |
| Duration | Days to weeks | 1–2 days | 1–2 days |
| Primary output | Evaluation plan | Initial utility tree, preliminary risks | Validated utility tree, complete risk catalog |
| Stakeholder involvement | Minimal (logistics) | Architecture team only | Full stakeholder community |
| Facilitation intensity | Low (planning) | High (structured presentation) | Very high (workshop facilitation) |

## The Preparation Phase

Before the first evaluation session begins, the evaluation team and the organization must complete a **preparation phase** that transforms a request for evaluation into a workable plan.

The central artifact of the preparation phase is the **evaluation planning document**, which specifies:

- The system under evaluation and its scope (defined partly by the system context diagram discussed in Chapter 2)
- The evaluation team composition, roles, and responsibilities
- The stakeholders who will be invited to Phase 2 and their interests
- The logistics: schedule, location, tooling, documentation format
- The known business drivers and quality attribute priorities (gathered through pre-evaluation interviews)
- The existing architectural documentation to be reviewed before Phase 1

The preparation phase also establishes the **ATAM team formation** — the specific individuals who will conduct the evaluation. Team formation follows a principle of independence: at least some evaluation team members should have no prior involvement in the system being evaluated, so that they bring fresh eyes and no defensive investment in the existing design.

#### Diagram: ATAM Two-Phase Process Flow

<iframe src="../../sims/atam-process-flow/main.html" width="100%" height="612px" scrolling="no"></iframe>

<details markdown="1">
<summary>ATAM Two-Phase Process Flow</summary>
Type: workflow
**sim-id:** atam-process-flow<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Visualize the complete ATAM process from preparation through final report, showing the sequence of activities, who participates in each, and what artifacts are produced at each step.

Bloom Level: Remember (L1) — Recall the sequence of ATAM phases and their key activities.
Bloom Verb: Recall

Learning Objective: Students will be able to recall the correct sequence of ATAM activities, identify which phase each activity belongs to, and name the artifact produced at each step.

Canvas layout:
- Three horizontal swim lanes labeled: "Preparation," "Phase 1," and "Phase 2"
- Within each lane, a horizontal flow of activity boxes connected by arrows
- Above each activity box: participant icon (team-only, architecture team, all stakeholders)
- Below each activity box: artifact name in italics
- A vertical divider between each phase
- Info panel on the right that appears when an activity box is clicked, showing a detailed description

Activities in Preparation lane:
- Form Evaluation Team → Team roster
- Gather Business Drivers → Interview notes
- Collect Architecture Docs → Document package
- Create Evaluation Plan → Evaluation planning document
- Schedule and Invite → Logistics memo

Activities in Phase 1 lane:
- Present Business Drivers → Business drivers document
- Present Architecture → Architecture briefing (scripted)
- Identify Architectural Approaches → Approaches list
- Build Utility Tree → Draft utility tree
- Analyze Architectural Approaches → Preliminary risk catalog

Activities in Phase 2 lane:
- Stakeholder Presentations → Updated briefing notes
- Brainstorm Scenarios → Extended scenario catalog
- Prioritize Scenarios → Prioritized utility tree
- Analyze Additional Risks → Final risk catalog
- Present Results → Preliminary findings report

Final step (post-Phase 2):
- Produce Final Report → Architecture evaluation report

Interactive elements:
- Click each activity box to see: what happens, who participates, how long it typically takes, common pitfalls
- Hover phase dividers to see the typical gap between phases (days to weeks for consolidation)
- "Show Artifacts Only" button to highlight just the artifact flow
- "Show Participants Only" button to highlight participant involvement patterns

Color scheme: Blue for Preparation, Teal for Phase 1, Gold for Phase 2, Gray for post-evaluation. Participant icons in distinct colors by role.

Responsive: Swim lanes reflow to vertical stacking on narrow screens.
</details>

## Phase 1 Activities in Detail

Phase 1 follows a scripted sequence of activities. The scripted nature is not accidental — it ensures that every ATAM evaluation covers the same ground in the same order, which makes the process repeatable and the outputs comparable across evaluations.

**Activity 1: Present the ATAM Process.** The evaluation leader opens Phase 1 by walking the architecture team through what ATAM is, how the evaluation will proceed, and what outputs will be produced. This presentation is essential even for teams that have been through ATAM before — it establishes shared vocabulary and sets expectations.

**Activity 2: Present Business Drivers.** The architecture owner or a senior project manager presents the system's business context: what the system is supposed to do, who its stakeholders are, what constraints exist, and what the top business drivers are. Business drivers are the organizational goals — revenue growth, cost reduction, regulatory compliance, time-to-market — that architectural decisions must serve.

**Activity 3: Present the Architecture.** This is the **architecture briefing** — a structured presentation of the architectural decisions made for the system. The **architecture briefing format** follows a specific template: the briefer presents the system's context (using the system context diagram), the key technical constraints, the architectural approaches used for each major area of the system, and the rationale for those approaches. The scripted nature of the architecture briefing is crucial: it forces the architecture owner to articulate decisions explicitly, which is often the first time they have been documented in this form.

**Activity 4: Identify Architectural Approaches.** The evaluation team, working with the architecture team, identifies the set of architectural patterns, styles, and tactics that the architecture employs. This is a catalogue step — the goal is to have a complete list of "what architectural approaches has this system used?" before beginning analysis.

**Activity 5: Generate the Utility Tree.** The evaluation team and architecture team collaboratively construct an initial utility tree — the hierarchical structure that organizes quality attribute scenarios from most critical to least critical. The utility tree structure is covered in depth in Chapter 7; here it is sufficient to note that this activity is the pivot point of Phase 1, transforming qualitative business drivers into concrete, analyzable scenarios.

**Activity 6: Analyze Architectural Approaches.** With the utility tree in hand, the evaluation team probes each high-priority scenario: which architectural approaches address this scenario? What are the sensitivity points? Where are the tradeoff points? Where are the risks? This analysis produces the preliminary findings that will be validated in Phase 2.

## Phase 2 Activities and Stakeholder Engagement

Phase 2 opens with the same scripted presentations that began Phase 1 — ATAM overview, business drivers, architecture briefing — but this time delivered to the full stakeholder community. This repetition serves a critical function: it ensures that the larger group has the same foundational understanding as the evaluation team before the workshops begin.

**Stakeholder Scenario Brainstorming** is the distinctive contribution of Phase 2. Stakeholders are invited to generate quality attribute scenarios from their own perspectives and priorities. A performance engineer might generate latency scenarios the evaluation team had not considered. A security officer might generate threat scenarios. An operations team member might generate availability scenarios based on their experience with production incidents.

The evaluation team facilitates scenario collection using structured brainstorming techniques — typically sticky notes, grouped by quality attribute, then voted on by stakeholders to prioritize. This process surfaces scenarios that the architecture team might not have anticipated, which is precisely why the broader stakeholder community is included.

After scenario collection, the evaluation team and stakeholders collaboratively **prioritize scenarios** against the utility tree and conduct a second round of architectural approach analysis. By the end of Phase 2, the risk catalog is complete, the utility tree is fully populated with stakeholder-validated priorities, and the preliminary findings are ready for presentation.

!!! mascot-tip "The Secret Power of Stakeholder Sessions"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Vista giving a tip">
    Vista's favorite Phase 2 moment is when a stakeholder raises a scenario that makes the architecture team go very quiet. That silence means the evaluation just found a risk the team hadn't considered — and found it before any code was written. That silence, multiplied across a dozen evaluations, represents millions of dollars in avoided rework. Pro tip: the stakeholders who contribute the most valuable scenarios are usually NOT the most technical people in the room. Business owners, operations staff, and end-user representatives often see risks that engineers optimize away.

## Evaluation Team Roles

An ATAM evaluation team has four defined roles. Understanding these roles is important because the effectiveness of an evaluation depends heavily on how well each role is executed.

**The Evaluation Leader** is the process owner. They facilitate all evaluation sessions, enforce the scripted agenda, manage time, mediate disagreements between stakeholders, and are ultimately responsible for the quality of the evaluation outputs. The evaluation leader must understand both ATAM's mechanics and group facilitation techniques — it is a genuinely demanding role that benefits from experience. In organizations new to ATAM, bringing in an experienced external evaluation leader for the first several evaluations is a common and effective approach.

**The Architecture Owner** is the individual most responsible for the architectural decisions under evaluation — typically the lead architect or principal engineer for the system. The architecture owner is both a participant in and subject of the evaluation. They present the architecture briefing, answer questions about architectural decisions, and engage with the scenario analysis. A skilled architecture owner treats the evaluation as a structured design review — an opportunity to surface issues before implementation rather than a defense of completed work.

**The Note-Taker** captures all findings — identified approaches, preliminary risks, scenario details, analysis conclusions — during evaluation sessions. The note-taker role is often underestimated. Accurate, complete notes are the raw material from which the final evaluation report is assembled. An evaluation with poor note-taking produces vague, unactionable findings. A good note-taker is fast, accurate, and understands enough architecture to distinguish a risk from a non-risk in the moment of discussion.

**Stakeholders** are everyone else with a stake in the system's success: business owners, end users, operations staff, security officers, compliance specialists, dependent system owners. In Phase 2, stakeholders are not passive observers — they are active contributors who validate the evaluation team's understanding of priorities and inject scenarios the evaluation team might not have considered.

#### Diagram: ATAM Team Roles and Interactions

<iframe src="../../sims/atam-team-roles/main.html" width="100%" height="542px" scrolling="no"></iframe>

<details markdown="1">
<summary>ATAM Team Roles and Interactions</summary>
Type: diagram
**sim-id:** atam-team-roles<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Visualize the four ATAM team roles, their responsibilities, and how they interact during evaluation sessions, making the role structure concrete and memorable.

Bloom Level: Remember (L1) — Recall the four ATAM team roles and their primary responsibilities.
Bloom Verb: Identify

Learning Objective: Students will be able to identify each ATAM team role, state its primary responsibility, and explain how it interacts with the other roles during an evaluation.

Canvas layout:
- Central evaluation session space represented as a rounded rectangle
- Four role cards arranged around the central session space (one at each compass point)
- Each role card contains: role title, icon, and 3-bullet responsibility list
- Arrows between roles showing interaction directions
- Clicking a role card expands a detail panel showing: who fills this role, key skills needed, common pitfalls, and Phase 1 vs Phase 2 involvement

Role cards:
1. Evaluation Leader (top center) — Facilitates, enforces process, manages time
2. Architecture Owner (right) — Presents architecture briefing, answers design questions
3. Note-Taker (bottom center) — Captures findings, produces raw material for report
4. Stakeholders (left, multiple icons) — Validate priorities, contribute scenarios

Interaction arrows:
- Evaluation Leader ↔ Architecture Owner: "Structured questioning"
- Evaluation Leader → Stakeholders: "Facilitates scenario brainstorming"
- Stakeholders → Note-Taker: "Generates scenarios (Phase 2)"
- Note-Taker → Evaluation Leader: "Provides real-time record"
- Architecture Owner → All: "Architecture briefing"

Interactive elements:
- Click any role card to see full description panel
- Hover interaction arrows to see what specifically happens at that interface
- Toggle "Phase 1 Only" and "Phase 2 Only" buttons to highlight which roles are active in each phase
- "Common Failure Modes" button to overlay warning indicators on roles with common pitfalls

Color scheme: Gold for Evaluation Leader, Blue for Architecture Owner, Teal for Note-Taker, Green for Stakeholders. Neutral gray for central session space.

Responsive: Role cards reflow to a 2x2 grid on narrow screens.
</details>

## ATAM Outputs: What You Walk Away With

At the end of a complete ATAM evaluation, the team produces a final report that documents the following:

- **The utility tree:** The complete hierarchy of quality attribute scenarios with stakeholder-assigned priorities
- **The risk catalog:** All identified architectural risks, described in terms of scenario, architectural decision, evidence, and recommended mitigation
- **Non-risks:** Architectural decisions that were analyzed and found to be well-supported
- **Sensitivity points:** Specific architectural decisions that have a strong effect on a single quality attribute
- **Tradeoff points:** Architectural decisions that simultaneously push two or more quality attributes in opposing directions
- **Risk themes:** Higher-level patterns that group related risks into systemic architectural concerns — the most important findings for executive audiences

The risk themes are particularly valuable for communication. Rather than presenting executives with a catalog of 47 individual risks, the evaluation team identifies four or five risk themes — systemic patterns underlying the individual findings — that frame the architectural concerns at the level of strategic decision-making. "The system has no graceful degradation strategy for its external dependencies" is a more actionable theme for an executive than a list of 12 specific integration risk items.

## The Architecture Methods Landscape: ATAM in Context

ATAM is the most comprehensive and widely deployed architecture evaluation method, but it is not the only tool available. Understanding when to use ATAM versus related methods is part of the practicing architect's judgment repertoire.

**SAAM (Software Architecture Analysis Method)** is ATAM's predecessor, developed by Kazman et al. in 1994. SAAM focuses specifically on change scenarios — how well an architecture supports anticipated modifications. It does not address the full quality attribute space and does not include the utility tree prioritization mechanism. SAAM is appropriate for focused modifiability analysis in early-stage designs where stakeholder breadth is limited and time is short.

**ARID (Active Reviews for Intermediate Designs)** is a peer-review technique designed for designs that are too incomplete for a full ATAM evaluation. ARID convenes a small group of technical peers to review a specific design decision using active review — reviewers are asked to design against the proposed interface rather than simply read and comment. ARID is fast (one half-day session) and scoped (one design decision or module), making it ideal for early-stage architectural choices where formal evaluation would be premature.

**Mini-ATAM** is an informal, abbreviated version of the full ATAM process conducted within a single organization's team without external evaluators. Mini-ATAMs trade rigor and stakeholder breadth for speed and low overhead. They are appropriate when the full two-phase process is impractical — small projects, constrained timelines, or preliminary evaluation before committing to a full ATAM. The key limitation is that without an independent external evaluation leader, the process is susceptible to confirmation bias.

**Lightweight architecture evaluation** encompasses a range of informal practices — architecture spikes, decision records, focused design reviews — that provide some architectural analysis without the structure of a formal method. These approaches are valuable for continuous, low-overhead governance but are not substitutes for formal evaluation when architectural decisions are high-stakes.

The following table compares the four methods across key dimensions:

| Method | Duration | Team Size | Breadth | Best For |
|--------|----------|-----------|---------|----------|
| Full ATAM | 4–8 days total | 8–20 | Full QA space + stakeholders | High-stakes, complex systems |
| SAAM | 1–2 days | 4–8 | Modifiability focus | Change-intensive designs |
| ARID | 0.5 day | 3–6 | Single design decision | Early-stage, incomplete designs |
| Mini-ATAM | 1 day | 4–8 | Reduced QA space, no external evaluators | Small projects, tight timelines |
| Lightweight eval | Variable | Variable | Ad hoc | Continuous governance |

!!! mascot-warning "The Mini-ATAM Trap"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Vista warning">
    Mini-ATAMs are genuinely useful — but watch out for "ATAM in name only." Vista has seen many organizations claim they "did ATAM" when what they actually did was a two-hour design review with no utility tree, no scenario prioritization, and no formal risk catalog. That's not a mini-ATAM; that's a design meeting with ATAM branding. The minimum viable ATAM produces a utility tree, a prioritized scenario set, and a documented risk catalog. If your evaluation produced none of those, adjust your methodology label accordingly.

#### Diagram: Architecture Evaluation Methods Comparison

<iframe src="../../sims/evaluation-methods-comparison/main.html" width="100%" height="557px" scrolling="no"></iframe>

<details markdown="1">
<summary>Architecture Evaluation Methods Comparison</summary>
Type: chart
**sim-id:** evaluation-methods-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive multi-axis comparison of architecture evaluation methods (ATAM, SAAM, ARID, Mini-ATAM, Lightweight) across five dimensions, allowing students to explore which method fits a given situation.

Bloom Level: Analyze (L4) — Compare and contrast architecture evaluation methods across multiple dimensions to select the appropriate method for a given context.
Bloom Verb: Compare

Learning Objective: Students will be able to compare architecture evaluation methods across dimensions of duration, stakeholder breadth, output rigor, and applicability, and select the appropriate method for a given architectural evaluation scenario.

Canvas layout:
- Radar/spider chart with five axes: Duration Efficiency, Stakeholder Breadth, Output Rigor, Applicability Breadth, Independence
- Each method plotted as a colored polygon on the radar
- Legend panel listing each method with its color
- Detail panel below showing method description when a polygon or legend item is selected
- Toggle checkboxes for showing/hiding individual methods

Axes (all scored 1-5):
- Duration Efficiency (1=very long, 5=very fast)
- Stakeholder Breadth (1=team only, 5=full stakeholder community)
- Output Rigor (1=informal, 5=full formal report)
- Applicability Breadth (1=narrow focus, 5=full QA space)
- Independence (1=no external evaluators, 5=fully independent team)

Method scores:
- Full ATAM: Duration=2, Stakeholder=5, Rigor=5, Breadth=5, Independence=5
- SAAM: Duration=3, Stakeholder=3, Rigor=4, Breadth=2, Independence=4
- ARID: Duration=5, Stakeholder=2, Rigor=2, Breadth=1, Independence=3
- Mini-ATAM: Duration=4, Stakeholder=3, Rigor=3, Breadth=3, Independence=2
- Lightweight: Duration=5, Stakeholder=1, Rigor=1, Breadth=2, Independence=1

Interactive elements:
- Click each polygon to highlight it and show a description panel
- Hover axis labels to see the scoring explanation
- Toggle individual methods on/off with checkboxes
- "Recommend Method" button: student selects three contextual factors from dropdowns and the chart highlights the best-fit method

Color scheme: Gold for Full ATAM, Blue for SAAM, Green for ARID, Teal for Mini-ATAM, Gray for Lightweight.

Responsive: Radar chart scales to container width.
</details>

## Running Your First ATAM Evaluation: Practical Orientation

For graduate students approaching ATAM for the first time, the method can feel simultaneously rigorous and intimidating. The following orientation reframes each component in terms of what you are actually trying to accomplish.

**The architecture briefing** is not a slide deck — it is a structured conversation. The architecture owner is not presenting to be judged; they are collaborating with the evaluation team to build a shared model of what the system does architecturally. The scripted format (context, constraints, approaches, rationale) exists to ensure completeness, not to limit conversation.

**The utility tree** is not a bureaucratic deliverable — it is the negotiation artifact that surfaces stakeholder disagreements about priorities before implementation makes them expensive. When two stakeholders assign different priorities to the same scenario, that disagreement is a finding. The utility tree is the only document in most organizations that forces stakeholders to make their priority tradeoffs explicit and on record.

**Risk identification** is not fault-finding — it is service to the architecture. Every risk the evaluation team identifies is a risk the development team can now address consciously. An unidentified risk is a surprise; an identified risk is a design consideration. ATAM transforms surprises into considerations. That transformation is the entire value proposition.

The scrip of a full ATAM evaluation is well-documented in the SEI's technical reports and in Len Bass, Paul Clements, and Rick Kazman's *Software Architecture in Practice* (the "SEI trilogy" for architecture students). The course capstone exercise will walk you through a complete evaluation on a realistic system — but first, you need the tools that fill the utility tree and drive the analysis. Those tools begin in the next chapter.

!!! mascot-celebration "You Now Speak ATAM!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Vista celebrating">
    From up here, Vista can see you've just cleared a huge milestone. You know what ATAM is, where it comes from, how its two phases work, who plays what role, and how it fits in the landscape of architecture evaluation methods. More importantly, you understand *why* each element exists — the scripted presentations, the two-phase structure, the four output types. That understanding is what separates someone who can follow the ATAM script from someone who can *lead* an ATAM evaluation and adapt it when the unexpected happens. That's your ATAM superpower growing stronger. Onward!

## Key Takeaways

ATAM is a structured, two-phase evaluation process that transforms architectural decisions into explicit, stakeholder-validated risk and tradeoff findings:

- **ATAM** stands for Architecture Tradeoff Analysis Method; its defining insight is that every architectural decision involves tradeoffs among quality attributes
- **Four output types**: risks, non-risks, sensitivity points, and tradeoff points — each serving a distinct analytical and communication function
- **CMU SEI origins** give ATAM an empirical foundation that differentiates it from informal architecture review practices
- **The preparation phase** produces an evaluation planning document that sets scope, team, logistics, and known priorities before any evaluation session begins
- **Phase 1** involves the core evaluation team and architecture team; **Phase 2** brings in the broader stakeholder community
- **Scripted presentations** (ATAM overview, business drivers, architecture briefing) ensure every evaluation covers the same ground in the same order, making findings repeatable and comparable
- **Four team roles**: evaluation leader, architecture owner, note-taker, and stakeholders — each with distinct responsibilities and distinct contributions to evaluation quality
- **Risk themes** aggregate individual risks into systemic patterns that communicate architectural concerns to executive audiences
- **Related methods** (SAAM, ARID, Mini-ATAM, lightweight) provide alternatives for situations where full ATAM is impractical; selecting the right method is itself an architectural judgment

??? question "Self-Check: ATAM Process Knowledge — Click to Reveal Answers"
    **Q1:** What is the primary difference between ATAM Phase 1 and Phase 2?

    **Answer:** Phase 1 involves the evaluation team and architecture team only; it produces a preliminary utility tree and initial risk catalog. Phase 2 brings in the broader stakeholder community to validate priorities, contribute scenarios from their own perspectives, and review Phase 1 findings. Phase 2 expands and validates Phase 1's output rather than replacing it.

    ---

    **Q2:** A project team tells you they "did ATAM" but when you ask to see the artifacts, they show you meeting notes from a two-hour design review with no utility tree. How would you characterize what they actually did?

    **Answer:** They conducted an informal architecture review or lightweight evaluation, not ATAM. ATAM requires at minimum a utility tree, a prioritized scenario set, and a documented risk catalog with risks categorized as risks, non-risks, sensitivity points, or tradeoff points. A two-hour design review without these artifacts is valuable but not an ATAM evaluation.

    ---

    **Q3:** What is the role of the architecture briefing format in ATAM, and why is the scripted nature of the briefing important?

    **Answer:** The architecture briefing is a structured presentation of architectural decisions following a specific template (system context, technical constraints, architectural approaches, rationale). The scripted nature ensures completeness — it forces the architecture owner to articulate decisions explicitly, often for the first time in this structured form — and makes the presentation comparable across evaluations. The script also gives the evaluation team a predictable framework for developing their questions before the session begins.
