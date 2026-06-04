# References: Quality Attribute Scenarios

Curated sources for deeper study of quality attribute scenario construction, the six-component stimulus-response model, typed scenario families, brainstorming techniques, and scenario catalogs.

## Books

- **Bass, Len, Paul Clements, and Rick Kazman. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.** Provides the definitive SEI treatment of quality attribute scenarios, including the six-component model, general versus concrete scenarios, and the typed scenario templates for all eight canonical quality attributes.

- **Clements, Paul, Rick Kazman, and Mark Klein. (2001). *Evaluating Software Architectures: Methods and Case Studies*. Addison-Wesley.** Illustrates scenario construction and scenario catalog development through real ATAM case studies, showing how scenario workshops produce the analytical raw material for architectural approach analysis.

- **Barbacci, Mario, et al. (1995). *Quality Attributes*. CMU/SEI-95-TR-021. Software Engineering Institute.** Establishes the stimulus-response model for quality attribute specification that this chapter develops into the six-component scenario form — the foundational theoretical source for the scenario structure.

## Articles and Papers

- **Barbacci, Mario, et al. (2003). "Quality Attribute Workshops (QAWs)." CMU/SEI-2003-TR-016. Software Engineering Institute.** The primary SEI reference for the facilitation techniques — structured brainstorming, perspective rotation, silent generation, dot voting — described in this chapter's scenario brainstorming section.

- **Kazman, Rick, et al. (2000). "ATAM: Method for Architecture Evaluation." CMU/SEI-2000-TR-004. Software Engineering Institute.** The canonical ATAM technical report, covering how scenarios are collected, prioritized, and used as the primary analytical input for architectural approach analysis in both Phase 1 and Phase 2.

## Online Resources

- **[Quality Attribute Workshop Facilitator's Guide](https://resources.sei.cmu.edu/library/asset-view.cfm?assetid=5269) — Carnegie Mellon Software Engineering Institute.** The SEI's facilitation guide for QAW workshops, providing step-by-step guidance for the scenario brainstorming and prioritization techniques described in this chapter.

- **[Scenario-Based Architecture Evaluation](https://resources.sei.cmu.edu/library/asset-view.cfm?assetid=5177) — Carnegie Mellon Software Engineering Institute.** SEI resources on using scenarios as the unit of analysis in architecture evaluation, supporting this chapter's treatment of scenarios as the bridge between abstract quality requirements and concrete architectural analysis.

- **[k6 Load Testing Documentation](https://k6.io/docs/) — Grafana Labs.** Documentation for the open-source load testing tool used to implement performance scenario fitness functions — directly relevant to this chapter's treatment of the scenario-to-fitness-function pipeline.

- **[Chaos Engineering Principles](https://principlesofchaos.org/) — Principles of Chaos.** The foundational principles document for chaos engineering — the discipline for implementing and verifying availability scenarios as continuous fitness functions, completing the scenario catalog to CI/CD pipeline described at the end of this chapter.

- **[OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) — OWASP Foundation.** The industry-standard guide for security testing scenarios, providing detailed templates for the security scenario family described in this chapter, including credential-stuffing and injection attack scenarios.

## Videos

- **"Breaking Your API Badly: Failure Scenarios in Practice." GOTO Conference. YouTube. [https://www.youtube.com](https://www.youtube.com).** Conference talk demonstrating how concrete failure scenarios (availability and performance) are constructed from production incident post-mortems — an applied illustration of the "2am call" scenario generation technique described in this chapter.
