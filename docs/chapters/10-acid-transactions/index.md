# Chapter 10: ACID Transactions

## Summary

This chapter covers the ACID transaction model in depth — the gold standard for data integrity in relational and NewSQL systems. Students learn all four isolation levels, the concurrency anomalies each prevents (dirty reads, phantom reads, non-repeatable reads), and how both pessimistic (two-phase locking) and optimistic (MVCC) concurrency control mechanisms achieve those guarantees. The chapter closes with distributed sagas as the primary alternative to ACID for microservices systems that cannot afford the latency of distributed locking.

## Concepts Covered

This chapter covers the following 18 concepts from the learning graph:

1. Atomicity
2. Consistency (ACID)
3. Isolation
4. Durability
5. Transaction Isolation Level
6. Read Uncommitted
7. Read Committed
8. Repeatable Read
9. Serializable Isolation
10. Dirty Read
11. Phantom Read
12. Non-Repeatable Read
13. Two-Phase Locking
14. Optimistic Concurrency Control
15. Savepoint
16. Rollback
17. Commit Protocol
18. Distributed Saga

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: Relational Databases](../03-relational-databases/index.md)
- [Chapter 9: CAP Theorem and Consensus Protocols](../09-cap-theorem-consensus/index.md)

---

TODO: Generate Chapter Content
