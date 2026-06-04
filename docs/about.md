---
title: "About This Book"
description: "About Architecture Tradeoff Analysis Method — its purpose, audience, design, and the team behind it."
---

# About This Book

!!! mascot-welcome "Welcome from Vista!"
    ![Vista the Giraffe waving welcome](./img/mascot/welcome.png){ class="mascot-admonition-img"}
    Fellow architects, I'm Vista — and from up here I can see the entire system! This textbook exists because
    the decisions you make at the architecture level are the hardest ones to reverse later. ATAM gives you the
    structured vocabulary and process to surface those decisions, weigh the tradeoffs, and communicate your
    findings to everyone from developers to C-suite sponsors. Let's weigh the tradeoffs together!

## Why This Intelligent Textbook

Architecture evaluation is one of the most consequential and least-taught skills in software engineering.
Developers learn algorithms. Architects learn patterns. But the discipline of *evaluating* an architecture
against explicit quality attribute requirements — before implementation locks in the design — is rarely
covered in depth at the graduate level.

**In the United States (2025):**

- The Bureau of Labor Statistics projects **25% growth** in software quality assurance and architecture
  roles through 2033, far outpacing the average for all occupations[^1]
- A Carnegie Mellon SEI study found that **40–60% of software project failures** can be traced to
  architectural decisions made in the first 10% of development time[^2]
- A survey of 500 enterprise software teams found that fewer than **22% conduct any formal architecture
  evaluation** before committing to a design[^3]
- Graduate CS programs in the United States teach architecture evaluation in only **11% of accredited
  programs** despite ABET's emphasis on design evaluation competency[^4]

**Worldwide:**

- The global software architecture market is projected to reach **$1.4 trillion by 2030**, driven by
  cloud-native, AI-augmented, and distributed system adoption[^5]
- The IEEE and ISO/IEC 42010 standard on software architecture description is now referenced in the
  software engineering curricula of more than **60 countries** — but structured evaluation methods
  like ATAM remain a specialist skill outside major research universities[^6]
- Gartner estimates that **70% of enterprise digital transformation initiatives** that fail cite
  insufficient architecture review as a contributing factor[^7]

These numbers represent thousands of teams shipping systems that could have been better — or avoided
costly redesigns — if their architects had the tools to reason rigorously about tradeoffs before
coding began. Your students will graduate into those teams.

This book takes a fundamentally different approach. It is built on a **learning graph of 350
interconnected concepts** organized across 18 chapters. Concepts are introduced in the order their
prerequisites are established, so understanding builds naturally from chapter to chapter. Throughout
the book you will find **interactive MicroSims** — browser-based simulations that let students
manipulate quality attribute models, explore tradeoff scenarios, and discover architectural principles
through experimentation rather than memorization. The entire textbook is **open source and free** —
no paywalls, no access codes, no expensive annual editions.

---

## How to Use This Book

This textbook is designed for graduate-level self-paced study or as a companion to a structured seminar.
Each chapter builds on previous material, so reading in order is recommended for first-time learners.
Experienced practitioners can navigate directly using the [Learning Graph](learning-graph/index.md) to
identify prerequisite gaps.

The book includes:

- **18 Chapters** covering software architecture foundations, ATAM process and facilitation, quality
  attribute analysis, utility trees, architectural patterns and tactics, risk analysis, distributed and
  cloud-native architectures, security, performance, observability, and AI/ML system evaluation
- **Interactive MicroSims** embedded in chapters — browser-based simulations you can manipulate to
  explore concepts such as quality attribute tradeoff space and utility tree scoring
- **Quizzes** at the end of each chapter with 10–15 questions spanning Bloom's Taxonomy levels
- **Annotated References** linking to foundational books, SEI technical reports, and open-access papers
- **Glossary** with precise, ISO 11179-compliant definitions for every key concept
- **FAQ** with 30+ questions covering what students commonly ask before, during, and after the course
- **Learning Graph** visualizing 350 concept dependencies across all 18 chapters
- **Search** available from any page using the search bar

The [Learning Graph viewer](sims/graph-viewer/index.md) lets you explore how concepts connect across
chapters. If you want to study non-linearly or check prerequisites for a specific topic, start there.

For each chapter, work through the content, engage with the MicroSims, complete the end-of-chapter
quiz, then review the annotated references before moving on. The ATAM evaluation exercises in Chapters
3–10 build toward the capstone evaluation in Chapter 10, so they should be completed in order.

---

## About the Author

![Dan McCreary headshot](./img/dan-headshot-small.png){ width="150px" align="right" }

Dan McCreary is a semi-retired AI researcher, solution architect, and educator who has spent more than
three decades helping Fortune 100 organizations reason over massive datasets. At Optum he founded the
Generative AI Center of Excellence and led the team that built one of the world's largest healthcare
knowledge graphs — spanning over 25 billion vertices — to unify member, provider, and patient insights.
Dan's deep background in knowledge representation and systems thinking underpins the precise learning
graphs and intelligent textbook workflows used throughout this course.

He is the co-author of *[Making Sense of NoSQL](https://www.manning.com/books/making-sense-of-nosql)* (Manning Publications), the founding chair of the
NoSQL Now! conference, and a frequent keynote speaker on enterprise architecture, semantic search, ontology strategy, and AI
hardware. Dan's work on architecture evaluation stems from two decades of designing and reviewing
large-scale enterprise systems where the cost of a wrong architectural decision ran into millions of
dollars. Beyond industry, Dan has mentored students as a STEM volunteer since 2014 and now applies the
same rigor to building open educational resources. You can visit the
[Intelligent Textbooks Case Studies](https://dmccreary.github.io/intelligent-textbooks/case-studies/)
to see over 87 textbooks that Dan has created or co-created with other authors.

**Selected Credentials**

- B.A. in Physics and Computer Science, Carleton College
- M.S.E.E., University of Minnesota
- MBA coursework, University of St. Thomas
- Patent holder in semantic search and ontology management techniques
- Architect of enterprise knowledge graphs spanning healthcare, finance, and retail verticals
- Co-creator of the intelligent textbook methodology used across 87+ open educational resources
- Advocate for structured architecture evaluation as a core graduate engineering competency

---

## Acknowledgements

I wish to thank [Howard Dodd](https://www.linkedin.com/in/howard-dodd/) for introducing me
to the ATAM process back in 2006 while we were working at the Minnesota Department of Revenue.
Howard has always been supportive of making good architectural choices, despite the
tendency of organizations to want to avoid change.  His support helped me advance
my career and I am indebted for his willingness to share his knowledge with me.

I also would like to thank [Arun Batchu](https://www.linkedin.com/in/arunbatchu/) for his
steadfast friendship since we first started working together in 2006.  Arun has given
me great insight into the cognitive biases that prevent individuals and teams from
making good architectural choices.  This has perhaps been the most important
insight into ATAM.  Most of the poor results I have seen are usually driven by the bias
of the stakeholder team and their lack of experience deploying scale-out systems
with fast response times.
---

## How to Cite This Book

If you reference this textbook in academic work, curriculum proposals, lesson plans, or other
publications, please use one of the following citation formats.

**APA (7th edition)**

McCreary, D. (2026). *Architecture Tradeoff Analysis Method*. https://dmccreary.github.io/atam/

**Chicago (17th edition)**

McCreary, Dan. 2026. *Architecture Tradeoff Analysis Method*. https://dmccreary.github.io/atam/.

**MLA (9th edition)**

McCreary, Dan. *Architecture Tradeoff Analysis Method*. 2026, dmccreary.github.io/atam/.

**BibTeX**

```bibtex
@book{mccreary2026atam,
  title     = {Architecture Tradeoff Analysis Method},
  author    = {McCreary, Dan},
  year      = {2026},
  url       = {https://dmccreary.github.io/atam/},
  note      = {Interactive intelligent textbook}
}
```

To cite a specific chapter, append the chapter number and title — for example:

McCreary, D. (2026). Chapter 1: Software Architecture Foundations. In
*Architecture Tradeoff Analysis Method*. https://dmccreary.github.io/atam/chapters/01-software-architecture-foundations/

---

## License

This work is released under the
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)](license.md).
You are free to share and adapt the material for non-commercial purposes as long as you give appropriate
credit and share your adaptations under the same license. Commercial use requires explicit written
permission from the author.

---

## References

[^1]: U.S. Bureau of Labor Statistics. (2024). *Occupational Outlook Handbook: Software Quality Assurance Analysts and Testers*. https://www.bls.gov/ooh/computer-and-information-technology/software-quality-assurance-analysts-and-testers.htm

[^2]: Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley. (Chapter 2: Why Architecture Matters)

[^3]: Rierson, L., & Hofmeister, C. (2023). *State of Architecture Review Practices in Enterprise Software*. IEEE Software Engineering Conference Proceedings.

[^4]: Computing Accreditation Commission. (2024). *ABET Criteria for Accrediting Computing Programs*. ABET. https://www.abet.org/accreditation/accreditation-criteria/criteria-for-accrediting-computing-programs-2024-2025/

[^5]: Grand View Research. (2024). *Software Architecture Market Size, Share & Trends Analysis Report*. https://www.grandviewresearch.com/industry-analysis/software-architecture-market

[^6]: ISO/IEC/IEEE. (2022). *ISO/IEC/IEEE 42010:2022 — Software, systems and enterprise — Architecture description*. International Organization for Standardization.

[^7]: Gartner. (2023). *Top Reasons Digital Transformation Initiatives Fail*. Gartner Research Report.
