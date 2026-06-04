# References: Architecture Principles and Governance

Curated sources for deeper study of architecture governance — principles, review boards, conformance, fitness functions, evolutionary architecture, and technology radars.

## Books

- **Ford, Neal, Rebecca Parsons, and Patrick Kua. (2017). *Building Evolutionary Architectures*. O'Reilly Media.** The source of the fitness function concept introduced in this chapter; provides the complete theoretical and practical framework for building architectures that can evolve while preserving structural integrity.

- **Bass, Len, Paul Clements, and Rick Kazman. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.** Covers architecture governance, conformance, and the architecture lifecycle that this chapter uses as its organizing framework; directly authoritative for the SEI perspective on governance.

- **Vernon, Vaughn. (2016). *Domain-Driven Design Distilled*. Addison-Wesley.** Covers separation of concerns, bounded contexts, and modular decomposition — the structural properties that this chapter's governance mechanisms are designed to protect.

- **Rozanski, Nick, and Eóin Woods. (2011). *Software Systems Architecture: Working with Stakeholders Using Viewpoints and Perspectives* (2nd ed.). Addison-Wesley.** Provides the viewpoint-based approach to architecture documentation referenced in this chapter, including the system context diagram as the scope-establishing artifact.

## Articles and Papers

- **Parnas, David L. (1972). "On the Criteria to Be Used in Decomposing Systems into Modules." *Communications of the ACM* 15(12), 1053–1058.** The foundational paper on separation of concerns and information hiding that underlies the governance mechanisms this chapter describes; every architecture principle is ultimately protecting one of Parnas's insights.

- **Kua, Patrick, Rebecca Parsons, and Neal Ford. (2016). "Fitness Functions as Architectural Guardrails." *IEEE Software* 33(6).** Introduces and elaborates the fitness function concept that is central to this chapter's treatment of evolutionary architecture and automated conformance checking.

## Online Resources

- **[ThoughtWorks Technology Radar](https://www.thoughtworks.com/radar) — ThoughtWorks.** The original and most widely referenced technology radar, directly illustrating the governance tool this chapter introduces; updated biannually with current Adopt/Trial/Assess/Hold placements.

- **[AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) — Amazon Web Services.** One of the reference architectures cited in this chapter; provides a concrete example of how a major cloud provider encodes architectural principles and governance expectations into a reusable framework.

- **[ArchUnit User Guide](https://www.archunit.org/userguide/html/000_Index.html) — ArchUnit Project.** Documentation for the Java structural conformance testing library referenced in this chapter as an example of automated architecture conformance checking.

- **[Architecture Decision Records (ADRs)](https://adr.github.io/) — adr.github.io.** Collection of resources on Architecture Decision Records, the documentation mechanism that preserves governance decisions and principle rationale — essential for the governance lifecycle described in this chapter.

## Videos

- **"Evolutionary Architecture." Neal Ford and Rebecca Parsons. O'Reilly Software Architecture Conference. [https://www.oreilly.com](https://www.oreilly.com).** Conference talk by the authors of *Building Evolutionary Architectures* introducing fitness functions and the evolutionary approach to governance; an accessible complement to the book chapter on this topic.
