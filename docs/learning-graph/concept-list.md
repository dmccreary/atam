# Concept List: The Right Database

**Total Concepts:** 220
**Generated:** 2026-05-14

## ATAM Methodology

1. Architecture Tradeoff Analysis
2. Quality Attribute Workshop
3. Utility Tree
4. Quality Attribute Scenario
5. Architectural Driver
6. Sensitivity Point
7. Tradeoff Point
8. Architectural Risk
9. Non-Risk
10. Risk Theme
11. Utility Tree Prioritization
12. ATAM Stakeholder Roles
13. Business Driver
14. Architectural Approach
15. ATAM Evaluation Team
16. ATAM Nine-Step Process
17. Architectural Decision Record
18. Quality Attribute Refinement
19. Scenario Stimulus
20. Scenario Response Measure
21. ATAM Output Artifacts
22. Software Architecture View

## Foundation Concepts

23. Database Management System
24. Data Model
25. Schema
26. Query Language
27. Database Index
28. Query Optimizer
29. Storage Engine
30. Data Serialization
31. Workload Characterization
32. Read/Write Ratio
33. Latency vs Throughput
34. OLTP Workload
35. OLAP Workload
36. HTAP Workload
37. Data Volume Scaling
38. Impedance Mismatch
39. Query Expressiveness
40. Operational Complexity

## Relational Databases

41. Relational Data Model
42. SQL
43. Primary Key
44. Foreign Key
45. Normalization
46. First Normal Form
47. Third Normal Form
48. Join Operation
49. B-Tree Index
50. Query Execution Plan
51. Stored Procedure
52. Database View
53. Transaction Log
54. Write-Ahead Log
55. Multi-Version Concurrency
56. Lock-Based Concurrency
57. Deadlock Detection
58. Connection Pooling
59. PostgreSQL
60. MySQL

## Analytical Databases

61. Columnar Storage
62. Massively Parallel Processing
63. Data Warehouse
64. Star Schema
65. Snowflake Schema
66. OLAP Cube
67. ETL Pipeline
68. Inmon Architecture
69. Kimball Architecture
70. Bitmap Index
71. Materialized View
72. Query Pushdown
73. Snowflake Database
74. BigQuery
75. Apache Parquet Format

## Key-Value Stores

76. Key-Value Data Model
77. Hash Table Storage
78. Time-to-Live
79. Cache Eviction Policy
80. Redis
81. DynamoDB
82. Read-Through Cache
83. Write-Through Cache
84. Write-Behind Cache
85. Cache Stampede
86. Hot Key Problem
87. Key Expiration

## Column-Family Databases

88. Column-Family Data Model
89. Wide Row
90. LSM Tree
91. Compaction Strategy
92. Bloom Filter
93. Apache Cassandra
94. Apache HBase
95. Partition Key
96. Clustering Column
97. Write-Optimized Storage
98. Read Amplification
99. Write Amplification

## Graph Databases

100. Property Graph Model
101. RDF Graph Model
102. SPARQL
103. Cypher Query Language
104. Graph Traversal Algorithm
105. Depth-First Search
106. Breadth-First Search
107. Shortest Path Algorithm
108. Neo4j
109. TigerGraph
110. Amazon Neptune
111. Distributed Graph Database
112. Graph Partitioning
113. GSQL
114. Knowledge Graph

## Document Databases

115. Document Data Model
116. JSON Document Storage
117. BSON Format
118. Embedded Document
119. Document Reference
120. Aggregation Pipeline
121. Schema Flexibility
122. MongoDB
123. Couchbase
124. Compound Index
125. Full-Text Search Index
126. Change Stream

## CAP Theorem and Consistency Models

127. CAP Theorem
128. Consistency (CAP)
129. Availability (CAP)
130. Partition Tolerance
131. CP Database System
132. AP Database System
133. PACELC Model
134. Latency-Consistency Tradeoff
135. Eventual Consistency
136. Strong Consistency
137. Read-Your-Writes Consistency
138. Monotonic Read Consistency
139. Causal Consistency
140. Session Consistency
141. Linearizability
142. Serializability
143. BASE Semantics
144. Conflict Resolution
145. Vector Clock
146. Gossip Protocol

## ACID and Transactions

147. Atomicity
148. Consistency (ACID)
149. Isolation
150. Durability
151. Transaction Isolation Level
152. Read Uncommitted
153. Read Committed
154. Repeatable Read
155. Serializable Isolation
156. Dirty Read
157. Phantom Read
158. Non-Repeatable Read
159. Two-Phase Locking
160. Optimistic Concurrency Control
161. Savepoint
162. Rollback
163. Commit Protocol
164. Distributed Saga

## Distributed ACID and NewSQL

165. Two-Phase Commit
166. Three-Phase Commit
167. Distributed Transaction Coordinator
168. Saga Orchestration
169. Saga Choreography
170. Compensating Transaction
171. NewSQL Database
172. Google Spanner
173. CockroachDB
174. YugabyteDB
175. TrueTime API
176. Global Transaction ID
177. Cross-Shard Transaction
178. Paxos Protocol
179. Raft Consensus Protocol
180. ZAB Protocol

## Distributed Systems and Scaling

181. Horizontal Scaling
182. Vertical Scaling
183. Data Sharding
184. Range-Based Sharding
185. Hash-Based Sharding
186. Directory-Based Sharding
187. Geographic Sharding
188. Database Replication
189. Single-Leader Replication
190. Multi-Leader Replication
191. Leaderless Replication
192. Quorum Read/Write
193. Read Replica
194. Replication Lag
195. Split-Brain Problem
196. Leader Election
197. ZooKeeper Coordination
198. etcd

## High Availability

199. High Availability
200. Five-Nines Availability
201. SLA Decomposition
202. Failure Domain
203. Single Point of Failure
204. Active-Active Clustering
205. Active-Passive Clustering
206. Failover
207. Heartbeat Monitoring
208. Chaos Engineering
209. Mean Time Between Failures
210. Mean Time to Recovery
211. Geographic Redundancy
212. Multi-Region Deployment
213. Circuit Breaker Pattern

## Vector Search and Embeddings

214. Vector Embedding
215. Embedding Dimensionality
216. Cosine Similarity
217. Dot Product Similarity
218. Euclidean Distance
219. Approximate Nearest Neighbor
220. HNSW Index
221. IVF Index
222. Flat Vector Index
223. pgvector Extension
224. Semantic Search
225. Hybrid Search
226. Native Vector Search Feature
227. ANN Recall vs Speed

## LLM Embeddings

228. Large Language Model
229. Transformer Architecture
230. Tokenization
231. Attention Mechanism
232. CLS Token Pooling
233. Mean Pooling
234. Embedding Model Selection
235. OpenAI Embeddings API
236. Sentence Transformers
237. Self-Hosted Embedding Model
238. Embedding Cost at Scale
239. Re-Embedding Migration
240. Multimodal Embedding
241. Embedding Pipeline Architecture
242. Embedding Model Versioning

## Database Selection and Polyglot Persistence

243. Polyglot Persistence
244. Database Selection Framework
245. Scoring Matrix
246. Total Cost of Ownership
247. Vendor Lock-In Risk
248. Database Migration Plan
249. Schema Migration
250. Multi-Model Database
251. Operational Runbook
252. Team Expertise Factor
253. Database Deprecation Risk
254. Data Access Pattern Analysis
