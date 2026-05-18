# Selecting the Right Database

[![MkDocs](https://img.shields.io/badge/Made%20with-MkDocs-526CFE?logo=materialformkdocs)](https://www.mkdocs.org/)
[![Material for MkDocs](https://img.shields.io/badge/Material%20for%20MkDocs-526CFE?logo=materialformkdocs)](https://squidfunk.github.io/mkdocs-material/)
[![GitHub Pages](https://img.shields.io/badge/View%20on-GitHub%20Pages-blue?logo=github)](https://dmccreary.github.io/right-database/)
[![Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code-DA7857?logo=anthropic)](https://claude.ai/code)
[![Claude Skills](https://img.shields.io/badge/Uses-Claude%20Skills-DA7857?logo=anthropic)](https://github.com/dmccreary/claude-skills)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## View the Live Site

Visit the interactive textbook at: [https://dmccreary.github.io/right-database](https://dmccreary.github.io/right-database)

## Overview

**Selecting the Right Database** is an intelligent textbook for software architects, senior engineers, technical leads, and database administrators who need to make real-world database selection and design decisions. It teaches a disciplined, structured approach using the Carnegie Mellon University Software Engineering Institute's **Architecture Tradeoff Analysis Method (ATAM)** — the gold standard for evaluating architectural decisions against competing quality attribute requirements.

The course builds deep understanding of six major database paradigms — relational, analytical, key-value, column-family, graph, and document — and teaches you to reason about each in terms of the tradeoffs they make across consistency, availability, partition tolerance, scalability, query expressiveness, and operational complexity. Rather than seeking a "best" database, you learn to identify the *right* database for a given set of architectural drivers, constraints, and quality attribute scenarios.

The textbook also covers the distributed systems foundations that underpin modern database architectures: the CAP theorem, BASE vs. ACID semantics, consensus protocols, replication strategies, sharding, five-nines availability, vector search, and LLM-generated embeddings. Sixteen structured chapters culminate in a full ATAM-based database selection capstone exercise.

## Getting Started

### Prerequisites

- Python 3.7+
- MkDocs with Material theme

### Clone the Repository

```bash
git clone https://github.com/dmccreary/right-database.git
cd right-database
```

### Install Dependencies

```bash
pip install mkdocs mkdocs-material
```

### Serve Locally

```bash
mkdocs serve
```

Open your browser to `http://localhost:8000`

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
right-database/
├── docs/                          # MkDocs documentation source
│   ├── chapters/                  # 16 structured chapters
│   │   ├── 01-atam-method/
│   │   ├── 02-database-foundations/
│   │   ├── ...
│   │   └── 16-database-selection/
│   ├── concepts/                  # Foundational concept pages
│   │   ├── four-vs-of-nosql.md
│   │   ├── utility-tree.md
│   │   └── acid-vs-base.md
│   ├── db-types/                  # Database paradigm deep-dives
│   ├── case-studies/              # Real-world architecture examples
│   │   ├── amazon-shopping-cart.md
│   │   ├── facebook.md
│   │   ├── linkedin.md
│   │   └── cassandra.md
│   ├── learning-graph/            # Concept dependency graph
│   │   ├── learning-graph.csv
│   │   └── quality-metrics.md
│   ├── stories/                   # Historical narrative content
│   ├── glossary.md                # Term definitions
│   ├── course-description.md      # Full Bloom's Taxonomy outcomes
│   └── img/                       # Images and mascot assets
├── plugins/                       # MkDocs plugin hooks
├── slides/                        # Presentation materials
├── mkdocs.yml                     # Site configuration
└── README.md                      # This file
```

## Topics Covered

- **ATAM Methodology** — CMU SEI process, utility trees, scenario prioritization, sensitivity and tradeoff points
- **Database Paradigms** — Relational, analytical, key-value, column-family, graph, and document databases
- **Distributed Systems Foundations** — CAP theorem, PACELC model, BASE vs. ACID, consensus protocols (Paxos, Raft)
- **Transactions** — ACID guarantees, MVCC, distributed 2PC, sagas, NewSQL (Spanner, CockroachDB, YugabyteDB)
- **Scaling and High Availability** — Sharding strategies, replication topologies, five-nines availability, chaos engineering
- **Vector Search** — ANN indexes (HNSW, IVF), similarity metrics, pgvector, Atlas Vector Search, Redis Vector
- **LLM Embeddings** — Embedding model selection, dimensionality tradeoffs, batching strategies, production cost
- **Polyglot Persistence** — When and how to combine multiple database types in one architecture
- **Case Studies** — Amazon, Facebook, LinkedIn, Cassandra, TigerGraph, Google Knowledge Graph, and more

## Reporting Issues

Found a bug, typo, or have a suggestion? Please open an issue:

[https://github.com/dmccreary/right-database/issues](https://github.com/dmccreary/right-database/issues)

When reporting, please include a description of the problem, steps to reproduce, and any relevant screenshots.

## License

This work is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

**You are free to:**
- Share — copy and redistribute the material
- Adapt — remix, transform, and build upon the material

**Under the following terms:**
- **Attribution** — Give appropriate credit with a link to the original
- **NonCommercial** — No commercial use without permission
- **ShareAlike** — Distribute contributions under the same license

See [license.md](docs/license.md) for full details.

## Acknowledgements

This project is built on the shoulders of giants in the open source community:

- **[MkDocs](https://www.mkdocs.org/)** — Static site generator optimized for documentation
- **[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)** — Beautiful, responsive documentation theme
- **[Claude AI](https://claude.ai)** by Anthropic — AI-assisted content generation and skills
- **[GitHub Pages](https://pages.github.com/)** — Free hosting for open source projects
- **[CMU Software Engineering Institute](https://sei.cmu.edu/)** — Original ATAM methodology

## Related Resources

- [Making Sense of NoSQL](https://www.manning.com/books/making-sense-of-nosql) — Book by Dan McCreary and Ann Kelly (Manning Publications)
- [Carnegie Mellon ATAM](https://resources.sei.cmu.edu/library/asset-view.cfm?assetid=5177) — Original ATAM documentation from CMU SEI

## Contact

**Dan McCreary**

- LinkedIn: [linkedin.com/in/danmccreary](https://www.linkedin.com/in/danmccreary/)
- GitHub: [@dmccreary](https://github.com/dmccreary)

Questions, suggestions, or collaboration opportunities? Connect on LinkedIn or open an issue on GitHub.
