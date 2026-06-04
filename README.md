# Architecture Tradeoff Analysis Method (ATAM)

An interactive intelligent textbook on the CMU SEI Architecture Tradeoff Analysis Method.

[![Live Site](https://img.shields.io/badge/Live%20Site-dmccreary.github.io%2Fatam-blue)](https://dmccreary.github.io/atam/)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![MkDocs Material](https://img.shields.io/badge/Built%20with-MkDocs%20Material-brightgreen)](https://squidfunk.github.io/mkdocs-material/)

![Cover Image](docs/img/cover.png)

## About This Book

**Architecture Tradeoff Analysis Method (ATAM)** is a graduate-level intelligent textbook covering the structured technique developed by the Software Engineering Institute (SEI) at Carnegie Mellon University for evaluating software architectures against explicit quality attribute requirements and business goals.

Architectural decisions made early in a project's lifecycle are disproportionately difficult and expensive to change later. ATAM enables architects, technical leads, and stakeholders to surface risks, sensitivity points, and tradeoffs *before* costly implementation begins.

**Target audience:** Graduate students in Computer Science or Software Engineering, and experienced software practitioners pursuing professional development.

## Content Summary

| Resource | Count |
|----------|-------|
| Chapters | 18 |
| Concepts (Learning Graph) | 350 |
| Glossary Terms | 350 |
| FAQ Questions | 56 |
| Interactive MicroSims (embedded) | 43 |
| Diagrams | 52 |
| Estimated Pages | ~606 |
| Total Words | ~148,000 |

## Topics Covered

- Software architecture evaluation fundamentals and ATAM process
- Quality attributes: performance, availability, security, modifiability, scalability, reliability
- Quality attribute scenarios and utility tree construction
- Architectural patterns and styles (microservices, event-driven, layered, etc.)
- Architectural tactics and tactic interactions
- Sensitivity points, tradeoff points, risks, and risk themes
- Distributed systems and cloud-native architecture evaluation
- Security, performance, and observability engineering
- AI/ML system architecture evaluation including LLMs and RAG systems

## Live Site

**[https://dmccreary.github.io/atam/](https://dmccreary.github.io/atam/)**

## Running Locally

### Prerequisites

- Python 3.9+
- [Conda](https://docs.conda.io/en/latest/) (recommended) or pip

### Quick Start

```bash
# Clone the repository
git clone https://github.com/dmccreary/atam.git
cd atam

# Install MkDocs Material
pip install mkdocs-material

# Serve locally
mkdocs serve
```

Then open [http://127.0.0.1:8000/atam/](http://127.0.0.1:8000/atam/) in your browser.

### Build for Production

```bash
mkdocs build
```

### Deploy to GitHub Pages

```bash
mkdocs gh-deploy
```

## Repository Structure

```
atam/
├── docs/
│   ├── index.md                    # Landing page
│   ├── about.md                    # Author bio, citations, license
│   ├── course-description.md       # Source course description
│   ├── glossary.md                 # 350-term ISO 11179-compliant glossary
│   ├── faq.md                      # 56-question FAQ
│   ├── chapters/
│   │   ├── 01-software-architecture-foundations/
│   │   │   ├── index.md            # Chapter content
│   │   │   ├── quiz.md             # 12-question chapter quiz
│   │   │   └── references.md      # Annotated references
│   │   └── [02-18 …]              # 17 more chapters
│   ├── learning-graph/             # 350-concept learning graph + reports
│   ├── sims/                       # Interactive MicroSims
│   └── img/                        # Images, mascot poses, cover
├── mkdocs.yml                      # MkDocs configuration
└── plugins/                        # MkDocs hooks (social preview, etc.)
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-improvement`
3. Make your changes and commit: `git commit -m "Add: your improvement"`
4. Push to your fork and open a Pull Request

For content corrections, open an issue describing the error and the correct information.

## Learning Mascot

This textbook features **Vista the Giraffe** — a cheerful, big-picture-thinking pedagogical agent who guides students through complex architectural concepts. Vista's catchphrase: *"Let's weigh the tradeoffs!"*

## License

This work is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/).

You are free to share and adapt this material for non-commercial purposes with attribution. See [license.md](docs/license.md) for details.

## Author

**Dan McCreary** — AI researcher, solution architect, and educator. Co-author of *Making Sense of NoSQL* (Manning Publications). Creator of 87+ intelligent textbooks at [dmccreary.github.io/intelligent-textbooks](https://dmccreary.github.io/intelligent-textbooks/).

---

*Built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) · Part of the [Intelligent Textbooks](https://dmccreary.github.io/intelligent-textbooks/) ecosystem*
