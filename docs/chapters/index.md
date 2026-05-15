# Chapters

This textbook is organized into 16 chapters covering 254 concepts across six database paradigms, distributed systems fundamentals, ACID and NewSQL transactions, high-availability architecture, vector search, LLM embeddings, and the ATAM-based database selection framework.

## Chapter Overview

1. [The ATAM Method](01-atam-method/index.md) — Introduces the CMU SEI Architecture Tradeoff Analysis Method, utility trees, quality attribute scenarios, and the structured process for making and documenting architectural decisions.
2. [Database Foundations](02-database-foundations/index.md) — Covers the core concepts underlying all database systems: data models, schemas, query languages, indexes, storage engines, and workload characterization (OLTP, OLAP, HTAP).
3. [Relational Databases](03-relational-databases/index.md) — Explores the relational model, SQL, normalization, indexing, concurrency control (locking and MVCC), write-ahead logging, and canonical products PostgreSQL and MySQL.
4. [Analytical Databases](04-analytical-databases/index.md) — Covers columnar storage, MPP architectures, data warehousing (Inmon vs. Kimball), OLAP cubes, ETL pipelines, and analytical products including Snowflake and BigQuery.
5. [Key-Value Stores](05-key-value-stores/index.md) — Examines the key-value data model, hash-based storage, TTL, cache eviction policies, caching patterns, and products Redis and DynamoDB.
6. [Column-Family Databases](06-column-family-databases/index.md) — Covers wide-column data models, LSM trees, compaction, Bloom filters, partition and clustering keys, and products Apache Cassandra and HBase.
7. [Document Databases](07-document-databases/index.md) — Explores document and JSON storage models, embedded documents, aggregation pipelines, schema flexibility, and products MongoDB and Couchbase.
8. [Graph Databases](08-graph-databases/index.md) — Introduces property graph and RDF models, Cypher and SPARQL, traversal algorithms, distributed graph databases including TigerGraph, and knowledge graphs.
9. [CAP Theorem and Consensus Protocols](09-cap-theorem-consensus/index.md) — Covers the CAP theorem, PACELC model, the full spectrum of consistency models from eventual to linearizable, and foundational consensus protocols Paxos and Raft.
10. [ACID Transactions](10-acid-transactions/index.md) — Examines ACID properties, all four transaction isolation levels, concurrency anomalies, two-phase locking, optimistic concurrency control, and distributed sagas.
11. [Distributed Scaling and Replication](11-distributed-scaling/index.md) — Covers horizontal scaling, sharding strategies, replication topologies (single-leader, multi-leader, leaderless), quorum reads/writes, leader election, and coordination tools ZooKeeper and etcd.
12. [Distributed ACID and NewSQL](12-distributed-acid-newsql/index.md) — Explores two-phase commit, distributed sagas, compensating transactions, and NewSQL databases including Google Spanner, CockroachDB, and YugabyteDB.
13. [High Availability Architecture](13-high-availability/index.md) — Covers five-nines SLA targets, failure domains, active-active and active-passive clustering, failover, chaos engineering, MTBF/MTTR, and geographic redundancy.
14. [Vector Search as a Database Feature](14-vector-search/index.md) — Introduces vector embeddings, similarity metrics, ANN indexes (HNSW, IVF), pgvector, semantic search, and hybrid search across database paradigms.
15. [LLM-Generated Embeddings](15-llm-embeddings/index.md) — Covers transformer architecture, tokenization, pooling strategies, embedding model selection, production embedding pipelines, cost at scale, and re-embedding migration.
16. [Database Selection and Polyglot Persistence](16-database-selection/index.md) — Brings all prior chapters together through ATAM-based database selection frameworks, scoring matrices, polyglot persistence patterns, migration planning, and capstone decision-making exercises.

## How to Use This Textbook

Each chapter builds on the concepts introduced in prior chapters. Chapters 1–2 establish the decision framework and database fundamentals. Chapters 3–8 survey the six major database paradigms. Chapters 9–13 cover distributed systems theory and practice. Chapters 14–15 address vector search and AI-generated embeddings. Chapter 16 integrates everything into a structured selection process.

Readers with strong distributed systems backgrounds may skim Chapters 9–12; practitioners already familiar with a specific database paradigm may read that chapter as a review before focusing on the ATAM-based selection content.

---

**Note:** Each chapter includes a list of concepts covered and links to prerequisite chapters. All concept dependencies are respected — concepts always appear after their prerequisites.
