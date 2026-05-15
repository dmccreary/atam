# Concept Taxonomy: The Right Database

**Total Categories:** 14
**Total Concepts:** 254

## Categories

### 1. ATAM — Architecture Tradeoff Analysis Method
**TaxonomyID:** ATAM
**Concepts:** 22 (8.7%)

Concepts related to the CMU SEI ATAM process: utility trees, quality attribute scenarios, sensitivity and tradeoff points, architectural risks, stakeholder roles, and ATAM output artifacts.

### 2. FOUND — Foundation Concepts
**TaxonomyID:** FOUND
**Concepts:** 18 (7.1%)

Core database and systems concepts that underpin all paradigms: DBMS, data models, schemas, query languages, indexes, storage engines, workload characterization, OLTP/OLAP/HTAP, impedance mismatch, and operational complexity.

### 3. REL — Relational Databases
**TaxonomyID:** REL
**Concepts:** 20 (7.9%)

Relational model, SQL, normalization, joins, B-tree indexes, MVCC, locking, write-ahead logging, stored procedures, and canonical products (PostgreSQL, MySQL).

### 4. ANAL — Analytical Databases
**TaxonomyID:** ANAL
**Concepts:** 15 (5.9%)

Columnar storage, MPP, data warehousing, star/snowflake schemas, OLAP cubes, ETL pipelines, Inmon vs. Kimball architectures, and analytical database products (Snowflake, BigQuery, Parquet).

### 5. KV — Key-Value Stores
**TaxonomyID:** KV
**Concepts:** 12 (4.7%)

Key-value data model, hash table storage, TTL, cache eviction policies, caching patterns (read-through, write-through, write-behind), hot key problem, and products (Redis, DynamoDB).

### 6. COL — Column-Family Databases
**TaxonomyID:** COL
**Concepts:** 12 (4.7%)

Column-family and wide-row data models, LSM trees, compaction, Bloom filters, partition/clustering keys, write-optimized storage, read/write amplification, and products (Cassandra, HBase).

### 7. GRAPH — Graph Databases
**TaxonomyID:** GRAPH
**Concepts:** 15 (5.9%)

Property graph and RDF models, Cypher and SPARQL query languages, traversal algorithms, distributed graph databases, graph partitioning, knowledge graphs, and products (Neo4j, TigerGraph, Amazon Neptune).

### 8. DOC — Document Databases
**TaxonomyID:** DOC
**Concepts:** 12 (4.7%)

Document and JSON storage models, BSON, embedded vs. referenced documents, aggregation pipelines, schema flexibility, text search, change streams, and products (MongoDB, Couchbase).

### 9. DIST — Distributed Consistency
**TaxonomyID:** DIST
**Concepts:** 20 (7.9%)

CAP theorem, PACELC model, consistency models (eventual, strong, causal, linearizable, serializable), BASE semantics, conflict resolution, vector clocks, and gossip protocols.

### 10. ACID — ACID Transactions
**TaxonomyID:** ACID
**Concepts:** 18 (7.1%)

ACID properties, transaction isolation levels (read uncommitted through serializable), dirty/phantom/non-repeatable reads, two-phase locking, MVCC, optimistic concurrency, sagas, rollback, and commit protocols.

### 11. NACID — Distributed ACID and NewSQL
**TaxonomyID:** NACID
**Concepts:** 16 (6.3%)

Two-phase commit, three-phase commit, distributed sagas (orchestration and choreography), compensating transactions, NewSQL databases, consensus protocols (Paxos, Raft, ZAB), and products (Spanner, CockroachDB, YugabyteDB).

### 12. SCALE — Distributed Scaling
**TaxonomyID:** SCALE
**Concepts:** 18 (7.1%)

Horizontal and vertical scaling, sharding strategies (range, hash, directory, geographic), replication topologies (single-leader, multi-leader, leaderless), quorum reads/writes, replication lag, split-brain, leader election, and coordination (ZooKeeper, etcd).

### 13. HA — High Availability
**TaxonomyID:** HA
**Concepts:** 15 (5.9%)

Five-nines SLA, SLA decomposition, failure domains, single points of failure, active-active vs. active-passive clustering, failover, chaos engineering, MTBF/MTTR, geographic redundancy, multi-region deployment, and circuit breaker pattern.

### 14. VEC — Vector Search and Embeddings
**TaxonomyID:** VEC
**Concepts:** 14 (5.5%)

Vector embeddings, similarity metrics (cosine, dot product, Euclidean), ANN indexes (HNSW, IVF, flat), pgvector, semantic and hybrid search, ANN recall vs. speed tradeoffs, native vector search as a database feature.

### 15. LLM — LLM Embeddings
**TaxonomyID:** LLM
**Concepts:** 15 (5.9%)

Large language models, transformer architecture, tokenization, attention mechanism, pooling strategies (CLS, mean), embedding model selection, OpenAI Embeddings API, Sentence Transformers, self-hosted models, embedding pipelines, cost at scale, re-embedding migration, multimodal embeddings, and model versioning.

### 16. SEL — Database Selection Framework
**TaxonomyID:** SEL
**Concepts:** 12 (4.7%)

Polyglot persistence, database selection frameworks, scoring matrices, total cost of ownership, vendor lock-in risk, migration planning, schema migration, multi-model databases, operational runbooks, team expertise, deprecation risk, and data access pattern analysis.
