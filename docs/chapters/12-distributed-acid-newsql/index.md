# Chapter 12: Distributed ACID and NewSQL

## Summary

This chapter examines how modern NewSQL databases achieve full ACID compliance across distributed clusters — solving the problem that traditional relational databases could not scale and traditional NoSQL databases sacrificed transactions. Students learn two-phase commit and its failure modes, the saga pattern for long-running distributed transactions, and how NewSQL products such as Google Spanner, CockroachDB, and YugabyteDB use Paxos/Raft consensus to deliver global transactions with horizontal scalability. The ZAB protocol (used by Apache ZooKeeper) is also covered as a practical consensus variant.

## Concepts Covered

This chapter covers the following 14 concepts from the learning graph:

1. Two-Phase Commit
2. Three-Phase Commit
3. Distributed Transaction Coordinator
4. Saga Orchestration
5. Saga Choreography
6. Compensating Transaction
7. NewSQL Database
8. Google Spanner
9. CockroachDB
10. YugabyteDB
11. TrueTime API
12. Global Transaction ID
13. Cross-Shard Transaction
14. ZAB Protocol

## Prerequisites

This chapter builds on concepts from:

- [Chapter 9: CAP Theorem and Consensus Protocols](../09-cap-theorem-consensus/index.md)
- [Chapter 10: ACID Transactions](../10-acid-transactions/index.md)
- [Chapter 11: Distributed Scaling and Replication](../11-distributed-scaling/index.md)

---

TODO: Generate Chapter Content
