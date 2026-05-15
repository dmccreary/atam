---
title: The Right Database
description: A detailed course description for The Right Database — Architecture Tradeoff Analysis for Distributed and High-Availability Systems, including overview, topics covered, and learning objectives in the format of the 2001 Bloom Taxonomy
quality_score: 94
---

# The Right Database

**Title:** The Right Database: Architecture Tradeoff Analysis for Distributed and High-Availability Systems

**Target Audience:** Professional development — software architects, senior engineers, technical leads, and database administrators making real-world database selection and design decisions

**Prerequisites:** General programming experience in at least one language; basic familiarity with software systems and application development

## Course Overview

Choosing the wrong database is one of the most expensive architectural mistakes an engineering team can make. Once data is in production, migration is painful, risky, and slow — yet most teams select a database based on familiarity, marketing, or habit rather than on rigorous analysis of their system's quality attributes. This course teaches a disciplined, structured approach to database selection using the Carnegie Mellon University Software Engineering Institute's **Architecture Tradeoff Analysis Method (ATAM)**, the gold standard for evaluating architectural decisions against competing quality attribute requirements.

Students will build a deep understanding of six major database paradigms — relational, analytical, key-value, column-family, graph, and document — and learn to reason about each in terms of the tradeoffs they make across consistency, availability, partition tolerance, scalability, query expressiveness, and operational complexity. Rather than seeking a "best" database, this course teaches students to identify the *right* database for a given set of architectural drivers, constraints, and quality attribute scenarios.

The course also covers the distributed systems foundations that underpin modern database architectures: the CAP theorem, BASE vs. ACID semantics, consensus protocols, replication strategies, sharding, and the engineering challenges of achieving five-nines (99.999%) availability in production systems. Students complete the course by conducting a full ATAM-based database selection exercise for a realistic architecture scenario, producing a documented decision artifact that reflects professional-grade architectural reasoning.

## Main Topics Covered

- The CMU SEI Architecture Tradeoff Analysis Method (ATAM): process, artifacts, and stakeholder utility tree construction
- Utility trees: structure, quality attribute hierarchy, scenario elicitation, (H,H)/(H,M)/(M,H) prioritization, and reading utility trees as visual decision artifacts
- Quality Attribute Workshop (QAW) techniques for eliciting database-relevant requirements
- Relational databases: ACID guarantees, normalization, SQL, indexing strategies, and scalability limits
- Analytical (OLAP) databases: columnar storage, MPP architectures, data warehousing, and BI workloads
- Key-value stores: extreme read/write throughput, eventual consistency, TTL patterns, and caching use cases
- Column-family (wide-column) databases: sparse data models, write-optimized LSM trees, and time-series workloads
- Graph databases: property graph and RDF models, traversal algorithms, and relationship-heavy query patterns; distributed graph databases (e.g., TigerGraph) that scale graph storage and traversal horizontally across a cluster
- Document databases: schema flexibility, embedded documents, aggregation pipelines, and developer ergonomics
- CAP theorem, PACELC model, and their implications for database selection under network partition
- ACID transactions: atomicity, consistency, isolation, durability, lock-based and MVCC implementations
- Distributed ACID: two-phase commit (2PC), distributed sagas, and NewSQL (Google Spanner, CockroachDB, YugabyteDB)
- Scale-out distributed computing: horizontal sharding, consistent hashing, replication topologies, and read/write splitting
- High availability architecture: active-active vs. active-passive clustering, failover, leader election, and quorum protocols
- Five-nines (99.999%) availability: failure mode analysis, SLA decomposition, chaos engineering, and operational runbooks
- Workload characterization: OLTP vs. OLAP vs. HTAP, read/write ratios, data volume, and latency/throughput budgets
- Vector search as a database feature: embedding generation, approximate nearest-neighbor (ANN) indexes (HNSW, IVF), similarity metrics (cosine, dot product, Euclidean), and how vector search is added to relational, document, key-value, and graph databases to enable similarity retrieval across any item or property
- LLM-generated embeddings: how large language models encode semantic meaning into dense floating-point vectors, embedding model selection (OpenAI text-embedding-3, Sentence Transformers, Cohere Embed), dimensionality tradeoffs, batching strategies, cost and latency at scale, and storing embeddings alongside structured data in a database
- Multi-model and polyglot persistence architectures: when and how to combine multiple database types
- Database selection decision frameworks: scoring matrices, architectural risk analysis, and sensitivity/tradeoff point identification

## Topics Not Covered

- Internal database engine implementation (query planners, buffer pool management, storage engine internals beyond conceptual overview)
- Database administration operations (backup procedures, index tuning playbooks, query optimization deep dives)
- SQL or NoSQL query language tutorials beyond what is needed to understand capability tradeoffs
- Standalone vector databases as a separate paradigm (covered instead as a cross-cutting feature that any database type may expose)
- ML model training pipelines and feature stores as primary content
- Specific cloud provider managed database services beyond illustrative examples
- Data modeling for specific business domains (e-commerce, healthcare, finance) as primary content
- Full ATAM facilitator certification training (this course teaches application, not facilitation)

## Learning Outcomes

After completing this course, students will be able to:

### Remember
*Retrieving, recognizing, and recalling relevant knowledge from long-term memory.*

- Recall the six major database paradigms (relational, analytical, key-value, column-family, graph, document) and their primary use cases
- State the four ACID properties (Atomicity, Consistency, Isolation, Durability) and what each guarantees
- Identify the three properties of the CAP theorem and state that only two can be simultaneously guaranteed under network partition
- List the key steps of the CMU SEI ATAM process: present ATAM, present business drivers, present architecture, identify architectural approaches, generate utility tree, analyze architectural approaches, brainstorm and prioritize scenarios, analyze architectural approaches (continued), present results
- Identify the three levels of a utility tree: quality attribute (root), attribute refinement (branches), and quality attribute scenario (leaves)
- Recall the two-axis prioritization scheme for utility tree scenarios: importance to stakeholders (H/M/L) and difficulty to achieve (H/M/L)
- Recall common availability SLA targets and their allowable downtime equivalents (99.9% = 8.7 hrs/yr, 99.99% = 52 min/yr, 99.999% = 5.26 min/yr)
- Name consensus protocols used in distributed databases (Paxos, Raft, ZAB)
- Identify BASE semantics (Basically Available, Soft state, Eventually consistent) and contrast with ACID
- List common sharding strategies: range-based, hash-based, directory-based, and geographic sharding
- Define vector embeddings and identify the similarity metrics used in vector search (cosine similarity, dot product, Euclidean distance)
- Name canonical database products by paradigm, including distributed graph databases such as TigerGraph and Amazon Neptune alongside single-server graph databases such as Neo4j
- Name the approximate nearest-neighbor index types commonly used for vector search (HNSW, IVF, flat) and identify which databases natively expose vector search as a feature (e.g., pgvector for PostgreSQL, Atlas Vector Search for MongoDB, Redis Vector, Cassandra with SAI)
- Recall that LLMs produce embeddings by encoding input text (or other modalities) into dense high-dimensional vectors, and name representative embedding models (OpenAI text-embedding-3-small/large, Sentence-BERT, Cohere Embed) along with their typical output dimensionalities (256–3072 dimensions)

### Understand
*Constructing meaning from instructional messages, including oral, written, and graphic communication.*

- Explain why no single database type is universally optimal and how workload characteristics drive the tradeoff space
- Describe the ATAM utility tree structure and how quality attribute scenarios capture architectural requirements
- Explain how a utility tree makes implicit architectural priorities explicit and visible to all stakeholders
- Describe how competing quality attributes (e.g., consistency vs. availability, performance vs. durability) appear as tension between branches of the same utility tree
- Explain the difference between OLTP and OLAP workloads and why they favor fundamentally different database architectures
- Summarize the tradeoffs between strong consistency (CP systems) and high availability (AP systems) in real-world operational terms
- Explain how LSM-tree storage engines optimize for write throughput at the cost of read amplification, and why this matters for column-family databases
- Describe how distributed ACID transactions (2PC, Paxos-based commit) achieve global consistency and what latency costs they introduce
- Explain the concept of a "sensitivity point" and a "tradeoff point" in ATAM and how they appear in database architecture analysis
- Summarize the failure modes that prevent five-nines availability and how redundancy, failover, and chaos engineering address them
- Describe the property graph model and contrast it with the relational model for relationship-heavy queries
- Explain eventual consistency, read-your-writes, monotonic reads, and causal consistency as a spectrum of consistency models
- Explain vector search as a database feature rather than a separate paradigm: how embedding indexes sit alongside traditional indexes, how they enable "find items similar to this one" queries across text, images, products, or any property that can be embedded, and what latency and storage tradeoffs the ANN index introduces
- Explain how LLMs generate embeddings: tokenization, transformer encoder pass, pooling strategies (CLS token vs. mean pooling), and why semantically similar inputs produce geometrically close vectors in embedding space
- Describe the embedding pipeline architecture — input data → embedding model API call → vector stored in DB alongside source record — and explain how model versioning and re-embedding requirements affect database design and operational cost

### Apply
*Carrying out or using a procedure in a given situation.*

- Conduct a Quality Attribute Workshop (QAW) to elicit database-relevant quality attribute scenarios from stakeholders
- Construct an ATAM utility tree with quality attributes, attribute refinements, and prioritized scenarios for a given system
- Apply the (importance, difficulty) prioritization matrix to rank utility tree leaf scenarios and identify which drive the most significant architectural decisions
- Use a utility tree as a communication artifact to align engineering teams and business stakeholders on database selection criteria
- Select an appropriate database type for a specified workload description by mapping workload characteristics to database strengths
- Apply the PACELC model to characterize a specific database system's behavior under both normal operation and partition
- Calculate allowable downtime budgets for a system given an SLA target and decompose that budget across dependent services
- Design a replication topology (single-leader, multi-leader, leaderless) appropriate for a given availability and consistency requirement
- Apply consistent hashing to design a sharding scheme for a specified data distribution and scaling requirement
- Use a scoring matrix to compare three or more database candidates against a weighted set of quality attribute requirements
- Add a vector search feature to a database selection decision: identify whether the candidate database exposes native ANN indexing, estimate the throughput and memory overhead, and incorporate those tradeoffs into the ATAM utility tree under a "semantic similarity" quality attribute scenario
- Select an appropriate LLM embedding model for a given use case by comparing dimensionality, token limits, multilingual support, cost per token, and latency, then design the batching and caching strategy to manage embedding generation at production scale

### Analyze
*Breaking material into constituent parts and determining how the parts relate to one another and to an overall structure or purpose.*

- Analyze a system's read/write ratio, latency requirements, data volume, and consistency needs to identify which database paradigms are viable candidates
- Identify architectural risks, sensitivity points, and tradeoff points in a proposed database architecture using ATAM vocabulary
- Analyze a completed utility tree to locate scenarios where two high-priority quality attributes are in direct tension, revealing the core architectural tradeoff of the system
- Deconstruct a poorly formed utility tree (vague scenarios, missing prioritization, unbalanced branches) and identify what information is lost as a result
- Break down a high-availability architecture into its failure domains and analyze single points of failure that threaten five-nines targets
- Compare the consistency guarantees of two-phase commit vs. distributed sagas and analyze the failure scenarios each handles poorly
- Distinguish between accidental and essential complexity in a polyglot persistence architecture and assess whether added databases are justified
- Analyze the impedance mismatch between an application's data access patterns and a proposed database's data model
- Analyze the tradeoffs of adding vector search to an existing database (e.g., pgvector on PostgreSQL) versus routing similarity queries to a specialized ANN layer, considering index build time, memory footprint, query latency, and operational complexity
- Analyze the downstream database implications of LLM embedding model choice: how dimensionality affects storage cost per row, index build time, and ANN recall accuracy; and how switching embedding models invalidates stored vectors and forces a full re-embedding migration
- Decompose a transaction workload to determine whether distributed ACID is necessary or whether eventual consistency with compensation suffices
- Evaluate the operational implications of a database selection decision: deployment complexity, backup/restore, monitoring, and team expertise

### Evaluate
*Making judgments based on criteria and standards through checking and critiquing.*

- Evaluate competing database candidates for a given architecture scenario using a structured ATAM-based decision process
- Judge whether a proposed polyglot persistence architecture introduces more complexity than the problem warrants
- Evaluate a utility tree produced by a team for completeness, scenario specificity, and prioritization accuracy — including whether the tree faithfully represents stakeholder intent or reflects only engineering bias
- Critique a database selection decision made without ATAM by identifying unstated assumptions, missing quality attribute scenarios, and unexamined tradeoffs
- Assess the risk level of a distributed database architecture's consistency model against the business consequences of stale or lost data
- Evaluate the achievability of a five-nines SLA for a proposed database architecture given its replication strategy and known failure modes
- Judge the adequacy of a utility tree by testing it against adversarial scenarios that stress the proposed architecture
- Assess the total cost of ownership of a database selection decision including licensing, operational overhead, and migration risk
- Validate that a NewSQL database's consistency guarantees meet the isolation level requirements of a given OLTP workload
- Evaluate whether a system requirement for similarity search ("find products like this one", "retrieve documents semantically related to this query") is best served by native vector search in the primary database or by a dedicated embedding index, based on scale, recall requirements, and operational constraints
- Evaluate the architectural risk of coupling a system's semantic retrieval quality to a third-party LLM embedding API: assess model deprecation risk, vendor lock-in, latency sensitivity, data privacy constraints, and the cost-benefit of self-hosted open-source embedding models versus managed API services

### Create
*Putting elements together to form a coherent or functional whole; reorganizing elements into a new pattern or structure.*

- Design a complete ATAM-based database selection analysis for a realistic multi-service architecture, including utility tree, candidate evaluation, risk register, and documented decision rationale
- Construct a database-specific utility tree template reusable across projects, with pre-populated quality attribute branches (performance, availability, consistency, scalability, operability, security) and annotated example scenarios for each database paradigm
- Architect a polyglot persistence solution that assigns each data domain to the most appropriate database type, with documented tradeoff justification
- Construct a high-availability database topology targeting 99.999% uptime, including replication, failover, geographic redundancy, and chaos engineering test plan
- Develop a database migration plan that transitions a system from a mismatched database to the selected optimal type with minimal downtime
- Create a database selection decision template (utility tree, scoring rubric, risk register) reusable across future projects in an organization
- Design a distributed transaction strategy for a microservices system that achieves adequate consistency guarantees without requiring global 2PC
- Synthesize a "database selection playbook" for a specific industry vertical (e.g., fintech, e-commerce, IoT) based on recurring quality attribute patterns
- Design a hybrid retrieval architecture that combines traditional structured queries with vector similarity search, mapping each query type to the appropriate index, specifying embedding model choices, and documenting the tradeoffs in an architectural decision record
- Design an end-to-end LLM embedding pipeline for a production system: choose an embedding model, define the ingestion strategy (batch vs. real-time), specify how embeddings are stored and co-located with source records in the chosen database, plan for model version upgrades, and estimate the total storage and API cost at target data volume
- **Capstone:** Conduct a full ATAM database selection analysis for a provided real-world architecture case study, produce a written architectural decision record (ADR), and present findings and recommendations to a stakeholder panel
