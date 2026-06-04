# References: Performance Engineering and Scaling

Curated sources for deeper study of latency, throughput, Amdahl's law, profiling, load testing, capacity planning, vertical and horizontal scaling, database sharding, CDN architecture, and observability.

## Books

- **Gregg, Brendan. (2020). *Systems Performance: Enterprise and the Cloud* (2nd ed.). Addison-Wesley.** The definitive systems performance engineering reference, covering the USE method (Utilization, Saturation, Errors), profiling techniques, and capacity analysis — all central to this chapter's evidence-based performance engineering approach.

- **Kleppmann, Martin. (2017). *Designing Data-Intensive Applications*. O'Reilly Media.** Covers database sharding, connection pooling, the latency-throughput relationship, and distributed system performance bottlenecks with the depth required for ATAM performance scenario analysis in this chapter.

- **Beyer, Betsy, Chris Jones, Jennifer Petoff, and Niall Murphy, eds. (2016). *Site Reliability Engineering: How Google Runs Production Systems*. O'Reilly Media.** Google's SRE book covers the RED method, capacity planning, load testing methodology, and the performance-cost tradeoffs that map directly to this chapter's ATAM performance evaluation framework.

## Articles and Papers

- **Amdahl, Gene. (1967). "Validity of the Single Processor Approach to Achieving Large Scale Computing Capabilities." *Proceedings of the AFIPS Spring Joint Computer Conference*.** The original paper establishing Amdahl's Law — the mathematical foundation for this chapter's analysis of horizontal scaling limits and the non-parallelizable fraction sensitivity point.

- **Little, John. (1961). "A Proof for the Queuing Formula L = λW." *Operations Research*, 9(3).** The foundational paper proving Little's Law, which this chapter uses as the primary analytical tool for relating throughput, response time, and concurrency in ATAM performance scenarios.

## Online Resources

- **"Performance Under Load." Adrian Cockcroft. https://medium.com/@adriancockcroft** Cockcroft's influential writing on performance engineering, capacity planning, and cloud-native performance patterns directly relevant to this chapter's treatment of scaling tactics and observability.

- **"USE Method." Brendan Gregg. https://brendangregg.com/usemethod.html** Gregg's official USE Method resource, defining the Utilization-Saturation-Errors framework for systematic resource-level performance analysis described in this chapter.

- **"HikariCP Connection Pool Sizing." Brett Wooldridge. GitHub. https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing** The definitive guide to database connection pool sizing formula referenced in this chapter, explaining why over-sized pools degrade database performance through context-switching overhead.

- **"Load Testing with k6." Grafana Labs. https://grafana.com/docs/k6/latest/** Documentation for k6, one of the load testing tools referenced in this chapter, covering workload modeling, scenario scripting, and the distributed load testing required for valid ATAM performance scenario validation.

## Videos

- **"Mastering Chaos: A Netflix Guide to Microservices." Josh Evans. QCon. YouTube.** Netflix's engineering experience with performance bottlenecks, capacity planning, and resilience in a large-scale distributed system — the real-world counterpart to this chapter's theoretical performance engineering framework.
