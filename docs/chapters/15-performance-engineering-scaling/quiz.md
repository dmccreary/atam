# Quiz: Performance Engineering and Scaling

Test your understanding of performance fundamentals including latency, throughput, Amdahl's Law, profiling, load testing, capacity planning, scaling strategies, database sharding, connection pooling, CDN, and observability. Each question is followed by a collapsed answer block.

## Questions

### Question 1

Define and distinguish **latency**, **response time**, and **throughput**. Why must ATAM quality attribute scenarios always specify a percentile rather than an average?

??? note "Answer"
    **Latency** is the time required for a single unit of work to pass through a specific component or network segment — a one-way measurement of transit time through a wire or processing unit. **Response time** (end-to-end latency) is what users actually experience: the total elapsed time from when they initiated a request to when they received a complete, usable response. It is composite, including all latency sources across the entire request path. **Throughput** is the rate at which a system processes work over a time window (requests per second, transactions per second) — a capacity measure, not a duration measure. **Percentiles are essential** because averages mask tail behavior. A system with average response time of 50ms but p99 of 5 seconds produces thousands of terrible user experiences per minute at scale. ATAM scenarios must specify a percentile (e.g., "p95 ≤ 200ms") because averages can be technically met while a significant fraction of users experience unacceptable latency.

---

### Question 2

A web service has an average of 500 concurrent in-flight requests and an average response time of 100ms. According to Little's Law, what is its throughput?

A. 500 requests per second  
B. 5,000 requests per second  
C. 50,000 requests per second  
D. 50 requests per second  

??? note "Answer"
    The correct answer is **B**. Little's Law states: L = λ × W, where L is average in-flight requests, λ is throughput (arrival rate), and W is average response time. Solving for λ: λ = L / W = 500 / 0.100s = 5,000 requests per second. This illustrates the power of Little's Law: you can compute throughput from concurrency and response time measurements alone, without directly counting requests — making it useful for inferring system capacity from observable metrics.

---

### Question 3

A system's workload is 80% parallelizable (p = 0.80). What is the maximum theoretical speedup achievable with unlimited parallel processors, and what speedup do you get with 8 processors?

??? note "Answer"
    **Maximum speedup** (n → ∞): S = 1 / (1 - p) = 1 / (1 - 0.80) = 1 / 0.20 = **5×**. No matter how many processors are added, the 20% serial fraction caps speedup at 5×. **With 8 processors**: S(8) = 1 / ((1 - 0.80) + (0.80 / 8)) = 1 / (0.20 + 0.10) = 1 / 0.30 ≈ **3.3×**. Even with 8 processors, the speedup is only 3.3× of the theoretical 5× maximum. Amdahl's Law reveals that the serial fraction (any shared resource, global lock, single-writer database, or synchronous external call) fundamentally caps the benefit of horizontal scaling — making identification of the serial fraction one of the most important questions in performance ATAM analysis.

---

### Question 4

In an ATAM evaluation, a team proposes horizontal scaling as their tactic to achieve a 10× throughput improvement. What is the most important follow-up question to ask, and why?

??? note "Answer"
    The most important question is: **"What is your non-parallelizable fraction?"** (or equivalently, "What serialized shared resources exist in the request path?"). Per Amdahl's Law, if any component in the request path cannot be parallelized — a single-writer database, a global lock, a distributed lock manager, a synchronous external API call, a centralized session store — that component caps the achievable horizontal scaling benefit. If a serialized component accounts for even 10% of request processing time (p = 0.90), the maximum speedup with horizontal scaling is 1/(1-0.90) = 10×, but only if that component's throughput also scales. If the shared database does not scale, horizontal application scaling provides zero benefit beyond what the database can serve. This question is the ATAM evaluator's "early warning system" for horizontal scaling proposals.

---

### Question 5

Which of the following best describes the relationship between **performance bottleneck identification** and the principle "measure before you optimize"?

A. Profiling should only be done after the architecture is finalized and deployed to production  
B. Performance bottlenecks are always in the database, so profiling should focus there first  
C. Without measurement data, developers optimize the code they understand best, which is rarely the actual bottleneck — profiling reveals the true 10-20% of code determining 80-90% of latency  
D. Profiling and optimization should run concurrently to save time  

??? note "Answer"
    The correct answer is **C**. The industry observation is that 80-90% of a system's performance is determined by 10-20% of its code, and the specific 10-20% is rarely intuitive without measurement data. Without profiling, developers optimize the code they know best or the code they expect to be slow — which is frequently not the actual bottleneck. Profiling tools (sampling profilers, instrumentation profilers, distributed traces) reveal the actual hot path: the specific call chain where the system spends time. This data-driven approach prevents wasted optimization effort and ensures architectural changes target actual rather than hypothetical bottlenecks.

---

### Question 6

Compare **sampling profilers** and **instrumentation profilers**. In what deployment context is each appropriate?

??? note "Answer"
    **Sampling profilers** periodically interrupt execution (thousands of times per second) and record the current call stack, using statistical analysis to produce a "hot path." They have low overhead (1-5%), making them suitable for **production use** without significant performance impact. The tradeoff: they miss short-duration calls that don't happen to be active during a sample. **Instrumentation profilers** insert measurement code at every function entry and exit, capturing exact call counts and elapsed times. They provide complete coverage with no missed calls. The cost: substantial overhead (often 2-10× slowdown), limiting them to **development and staging environments** where exact call counts and durations are needed for detailed analysis. For distributed systems, distributed tracing systems complement both by providing end-to-end request decomposition across service boundaries.

---

### Question 7

What is a **shard key** in database sharding, and why is shard key selection described as "one of the most consequential and irreversible architectural decisions" in a sharded system?

??? note "Answer"
    A shard key is the attribute used to determine which shard (horizontal partition) owns a given piece of data — all rows with the same shard key value reside on the same shard, and routing logic directs queries to the appropriate shard based on this key. It is consequential and irreversible because: (1) **Uneven distribution** (hot shards): a poorly chosen key where most traffic targets a small set of key values creates hot shards that receive disproportionate load, negating sharding's benefit. (2) **Cross-shard joins**: if the shard key doesn't co-locate related data, frequent queries require scatter-gather across all shards — expensive or impossible. (3) **Re-sharding cost**: changing the shard key requires migrating the entire dataset to a new sharding scheme, which is an extremely expensive, high-risk operation on a production system. Getting the shard key right before data is loaded is far cheaper than correcting it after.

---

### Question 8

An application runs on a server with 8 CPU cores. A developer proposes a database connection pool size of 200 connections. What concern would you raise, and what is the recommended pool sizing approach?

??? note "Answer"
    A pool of 200 connections is significantly **over-sized** and likely to *degrade* rather than improve performance. With 200 active connections on 8 CPU cores, the database server must context-switch between 200 sessions, creating overhead that outweighs the benefit of additional concurrency. The counter-intuitive result is that reducing the pool size typically *improves* throughput by reducing context-switching. The recommended sizing formula (from HikariCP research by Brett Wooldridge): `pool_size = (core_count × 2) + effective_spindle_count`. For 8 cores with typical SSD storage: approximately 16-20 connections. This formula reflects that database operations involve both CPU processing and I/O waits — the factor of 2 accounts for some threads being blocked on I/O while others execute. Raising above this formula's result creates diminishing returns that turn into negative returns at high over-provisioning levels.

---

### Question 9

What is a CDN **cache hit ratio**, and what does a hit ratio below 80% suggest about the CDN configuration?

??? note "Answer"
    The CDN cache hit ratio is the fraction of requests served from the CDN cache (Points of Presence) without reaching the origin server. A hit ratio above 80% means the CDN is providing significant latency reduction and origin load offloading. **A hit ratio below 80% suggests several possible configuration problems**: (1) **TTL misconfiguration** — content is expiring and being refetched from origin too frequently, either because TTLs are too short or cache headers are set incorrectly. (2) **Cache key design issues** — unnecessary query parameters are being included in the cache key, causing equivalent requests to be treated as cache misses (e.g., `?sessionid=` or tracking parameters that shouldn't vary cache content). (3) **Content characteristics** — highly personalized or user-specific content is being routed through the CDN even though it cannot be shared across users. (4) **Geographic distribution mismatch** — the CDN PoP locations don't match the user geographic distribution, causing more origin fetches due to cold caches at underserved PoPs.

---

### Question 10

Which observability framework provides a systematic approach to **resource-level** performance analysis, and which provides a **service-level** perspective?

A. RED Method for resources; USE Method for services  
B. USE Method for resources (Utilization, Saturation, Errors); RED Method for services (Rate, Errors, Duration)  
C. Both USE and RED apply to resources; neither applies to services  
D. MTTR for resources; MTBF for services  

??? note "Answer"
    The correct answer is **B**. The **USE Method** (Brendan Gregg) applies to each resource (CPU, memory, disk, network interface, database connection pool): Utilization (what fraction of capacity is used?), Saturation (is there a queue forming?), Errors (error conditions associated with the resource?). A resource with high utilization, non-zero saturation, and increasing errors is a performance bottleneck. The **RED Method** applies to each service or endpoint: Rate (requests per second), Errors (fraction resulting in errors), Duration (p50/p95/p99 latency). Together, USE and RED provide the dual instrumentation model that maps ATAM performance scenarios to observable system behavior — USE finds the constrained resource causing the problem; RED shows the user-visible impact.

---

### Question 11

Scenario: A high-frequency trading platform has a (H,H) performance scenario: "p99 order-to-confirmation latency ≤ 10ms; zero order loss; queue depth returns to zero within 500ms during a burst of 5,000 concurrent order submissions." The architecture uses a central matching engine that serializes all access to the order book through a mutex. What ATAM analysis would you conduct?

??? note "Answer"
    This scenario triggers Amdahl's Law analysis on the matching engine mutex. If the matching engine serializes all order book access: (1) **Identify the serial fraction**: estimate what fraction of total order processing time is spent in serialized mutex-protected sections. If locking, order book updates, and conflict detection account for 30% of processing time, the maximum parallel speedup is 1/(0.30) ≈ 3.3×, capping throughput regardless of how many threads or cores are added. (2) **Classify the mutex as a sensitivity point**: lock granularity (per-order-book-price-level vs. global) dramatically affects throughput under concurrency — small changes in granularity produce large throughput changes. (3) **Classify the mutex-vs-lock-free choice as a tradeoff point**: lock-free data structures (CAS operations, optimistic concurrency) improve throughput under contention but are significantly harder to implement correctly (complexity cost). (4) **Document the 10ms p99 budget**: profile the complete request path (network → validation → matching engine → persistence → confirmation) to determine how much time each stage consumes. If serialized matching engine access alone takes > 10ms at P99 under 5,000 concurrent orders, the scenario is architecturally at risk even with optimization.

---

### Question 12 (Analyze)

A capacity planning analysis reveals that the application's CPU utilization grows at 3% per 100 RPS, the database connection pool is at 70% utilization at current load (1,500 RPS), and the database has 20 available connection slots remaining. Traffic is growing at 25% per month. An architect proposes horizontal scaling of the application tier as the solution. Analyze the proposal using Amdahl's Law and capacity planning principles, and identify what the actual bottleneck is.

??? note "Answer"
    The horizontal scaling proposal addresses the wrong constraint. **Actual bottleneck analysis**: The database connection pool is the constraint, not the application tier. At 70% utilization with 20 slots remaining, the database connection pool saturates at approximately 1,500 × (100/70) ≈ 2,143 RPS. At 25% monthly growth, this saturation point is reached in approximately 2 months. Adding more application tier instances *increases demand* on the database connection pool without increasing its capacity — more application instances competing for 20 remaining connections will accelerate saturation, not relieve it. **Amdahl's Law view**: The database connection pool is a serialized resource (only one operation occupies one connection at a time). If the connection pool accounts for 20% of request time under saturation, the maximum application-tier scaling benefit is 1/(0.20) = 5× — but only if the database can serve the increased queries, which it cannot with a saturated pool. **Correct recommendations**: (1) Immediately: audit connection pool sizing — with the application's server core count, the formula suggests the pool may already be over-sized for the database, causing contention; (2) Short-term: add read replicas to offload read queries and increase effective connection capacity; (3) Medium-term: evaluate query optimization and caching to reduce queries-per-request before scaling either tier; (4) Long-term if needed: database sharding.

---

*End of Quiz — Chapter 15*
