---
title: Chapter Design Decisions — ATAM Textbook
date: 2026-06-02
generator: book-chapter-generator skill
concepts: 350
chapters: 18
---

# Chapter Design Decisions

## Overview

18 chapters covering 350 concepts from the ATAM learning graph. Average 19.4 concepts per chapter (range 13–27). All dependency constraints satisfied; zero violations in topological sort validation.

## Chapter Map

| # | Directory | Title | Concepts | Taxonomy Groups |
|---|-----------|-------|----------|-----------------|
| 1 | 01-software-architecture-foundations | Software Architecture Foundations | 17 | FOUND |
| 2 | 02-architecture-principles-governance | Architecture Principles and Governance | 15 | FOUND |
| 3 | 03-atam-introduction-process | ATAM Introduction and Process Phases | 25 | PROC |
| 4 | 04-stakeholder-business-analysis | Stakeholder and Business Analysis | 24 | STKE + FOUND(22) |
| 5 | 05-quality-attributes | Quality Attributes | 22 | QUAL |
| 6 | 06-quality-attribute-scenarios | Quality Attribute Scenarios | 18 | SCEN |
| 7 | 07-utility-trees-prioritization | Utility Trees and Scenario Prioritization | 13 | SCEN |
| 8 | 08-architectural-patterns-styles | Architectural Patterns and Styles | 22 | TACT |
| 9 | 09-architectural-tactics-principles | Architectural Tactics and Design Principles | 23 | TACT + QUAL(103) |
| 10 | 10-risk-analysis-atam-reporting | Sensitivity, Tradeoffs, Risk Analysis, and ATAM Reporting | 27 | RISK + PROC(51-53,56) + STKE(82) |
| 11 | 11-distributed-systems-fundamentals | Distributed Systems Architecture Fundamentals | 14 | DIST |
| 12 | 12-distributed-systems-patterns | Distributed Systems Patterns | 15 | DIST + TACT(148) |
| 13 | 13-cloud-native-architecture | Cloud-Native Architecture | 24 | CLOU |
| 14 | 14-security-architecture | Security Architecture | 25 | SECP |
| 15 | 15-performance-engineering-scaling | Performance Engineering and Scaling | 15 | PERF |
| 16 | 16-observability-reliability | Observability, Reliability, and Cloud Operations | 16 | PERF + CLOU(250) |
| 17 | 17-ai-ml-system-architecture | AI and Machine Learning System Architecture | 20 | AIEM |
| 18 | 18-advanced-data-emerging-ai | Advanced Data, Emerging AI, and Autonomous Architectures | 15 | AIEM |

## Concept Assignments Requiring Cross-Category Moves

These concepts were relocated from their taxonomy group to satisfy dependency constraints or improve pedagogical fit.

### Concept 22 — Architectural Driver (FOUND → Ch 4)

Depends on concept 59 (Business Goal) and 60 (Business Driver), both STKE. Moved to Ch 4 alongside the stakeholder group, where it connects business goals to architectural decisions naturally.

### Concept 103 — Quality Attribute Tactic Catalog (QUAL → Ch 9)

Depends on concept 138 (Architectural Tactic, TACT). Moving to Ch 9 anchors the catalog discussion immediately after students learn what tactics are in Ch 8.

### Concept 148 — Saga Transaction Pattern (TACT → Ch 12)

Depends on concept 210 (Distributed Transaction, DIST Ch 11). Must follow DIST fundamentals. Placed in Ch 12 (Distributed Patterns) where it fits thematically with other distributed data patterns.

### Concepts 51, 52, 53, 56 — Late PROC (PROC → Ch 10)

These four PROC concepts have cross-category dependencies:
- 51 (Architecture Evaluation Report) depends on 190 (Risk Register, RISK)
- 52 (ATAM Consensus Building) depends on 75 (Stakeholder Communication, STKE)
- 53 (ATAM Facilitation Techniques) depends on 52
- 56 (Post-Evaluation Review) depends on 191 (Risk Communication, RISK)

Bundled into Ch 10 as the "ATAM Reporting" capstone after all risk analysis concepts.

### Concept 82 — Architecture Roadmap (STKE → Ch 10)

Depends on concept 194 (Risk Mitigation Strategy, RISK). Could not be placed in Ch 4 (STKE) without violating its dependency on Ch 10 RISK content. Placed at the end of Ch 10 where it synthesizes risk findings into a forward-looking roadmap.

### Concept 250 — Cloud Observability (CLOU → Ch 16)

Depends on concept 290 (Observability, PERF). Since PERF follows CLOU in the planned ordering, 250 was moved to Ch 16 (Observability/Reliability) where it enriches the observability section and its PERF dependency is already satisfied.

## PROC Split Rationale

PROC has 29 concepts total. 25 "early" PROC concepts (30–50, 54–55, 57–58) have no dependencies outside FOUND. The 4 "late" PROC concepts (51–53, 56) depend on STKE and RISK, which appear in Ch 4 and Ch 10 respectively. Splitting PROC across Ch 3 and Ch 10 satisfies all constraints.

## TACT Split Rationale

TACT has 45 concepts — too large for a single chapter (max ~25). Split by conceptual theme:
- **Ch 8** (architectural patterns/styles): the 22 "what does the architecture look like" concepts — patterns, styles, communication protocols, DDD, ADRs.
- **Ch 9** (tactics/principles): the 23 "how do you achieve quality attributes" concepts — quality tactics, resilience patterns, design principles (coupling, cohesion, encapsulation).

## SCEN Split Rationale

SCEN has 31 concepts. Natural split at the scenario/utility-tree boundary:
- **Ch 6**: stimulus-response model components, scenario types, prioritization basics, typed scenario families (18 concepts)
- **Ch 7**: utility tree structure and workshop facilitation in depth (13 concepts)

## DIST Split Rationale

DIST has 28 concepts. Split at the service-contract boundary:
- **Ch 11**: foundational distributed concepts — decomposition, gateways, messaging, transactions, CAP, consistency (14 concepts)
- **Ch 12**: advanced patterns — contracts, versioning, integration, sidecar/ambassador, database patterns, Saga (15 concepts)

## PERF Split Rationale

PERF has 30 concepts. Split at the observability boundary:
- **Ch 15**: performance fundamentals through scaling and CDN, ending with the foundational Observability concept (15 concepts)
- **Ch 16**: detailed observability tools (logging, metrics, health checks), SRE/SLO/SLI, reliability engineering, disaster recovery (16 concepts)

## AIEM Split Rationale

AIEM has 35 concepts. Split at the data/advanced-AI boundary:
- **Ch 17**: AI/ML system architecture, pipelines, model lifecycle, LLM/RAG/GraphRAG, AI observability and explainability (20 concepts)
- **Ch 18**: data mesh, lakehouse, lambda/kappa/space-based architectures, AI security, emerging patterns, autonomous systems (15 concepts)

## Dependency Validation Summary

The following cross-chapter dependencies were the trickiest to satisfy:

| Concept | Chapter | Depends on | Chapter of Dependency |
|---------|---------|------------|-----------------------|
| 22 (Architectural Driver) | 4 | 59, 60 (Business Goal/Driver) | 4 (same chapter) |
| 82 (Architecture Roadmap) | 10 | 194 (Risk Mitigation Strategy) | 10 (same chapter, ordered after) |
| 103 (QA Tactic Catalog) | 9 | 138 (Architectural Tactic) | 8 ✓ |
| 148 (Saga Transaction) | 12 | 210 (Distributed Transaction) | 11 ✓ |
| 250 (Cloud Observability) | 16 | 290 (Observability) | 15 ✓ |
| 312 (AI Latency) | 17 | 276 (Latency) | 15 ✓ |
| 323 (AI Observability) | 17 | 290 (Observability) | 15 ✓ |
| 331 (AI Security) | 18 | 251 (Security Arch) | 14 ✓ |
| 51 (Evaluation Report) | 10 | 190 (Risk Register) | 10 (same chapter, ordered after) |
| 52 (Consensus Building) | 10 | 75 (Stakeholder Comm) | 4 ✓ |
