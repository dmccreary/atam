# References: Distributed Systems Architecture Fundamentals

Curated sources for deeper study of distributed systems concepts including CAP theorem, service decomposition, API gateways, service meshes, event-driven messaging, and distributed tracing.

## Books

- **Newman, Sam. (2021). *Building Microservices: Designing Fine-Grained Systems* (2nd ed.). O'Reilly Media.** The authoritative guide to service decomposition, API gateway patterns, service discovery, and the availability-consistency tensions at the heart of this chapter's distributed systems analysis.

- **Kleppmann, Martin. (2017). *Designing Data-Intensive Applications*. O'Reilly Media.** Provides the definitive treatment of the CAP theorem, eventual consistency, distributed transactions, and two-phase commit — all core concepts in this chapter's ATAM tradeoff analysis.

- **Richardson, Chris. (2018). *Microservices Patterns*. Manning Publications.** Covers service decomposition patterns, API gateway design, and service discovery, with explicit quality attribute analysis that maps directly to ATAM scenario evaluation of distributed systems.

## Articles and Papers

- **Brewer, Eric. (2000). "Towards Robust Distributed Systems." *Proceedings of the 19th Annual ACM Symposium on Principles of Distributed Computing (PODC)*.** The original keynote address formulating the CAP theorem; required reading for understanding the formal basis of the consistency-availability tradeoff examined in this chapter.

- **Gilbert, Seth, and Nancy Lynch. (2002). "Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services." *ACM SIGACT News*, 33(2).** The formal proof of the CAP theorem that establishes the theoretical basis for the CP vs. AP architectural tradeoff analysis central to this chapter's ATAM evaluation framework.

## Online Resources

- **"Distributed Systems." Martin Kleppmann. https://martin.kleppmann.com/2020/11/18/distributed-systems-and-elliptic-curves.html** Kleppmann's lecture notes and distributed systems resources, providing deep coverage of the CAP theorem, eventual consistency, and distributed transaction challenges covered in this chapter.

- **"Service Mesh." Cloud Native Computing Foundation. https://cncf.io/reports/cncf-annual-survey/** CNCF's official documentation on service mesh architecture, covering the quality attribute implications (mTLS, circuit breakers, distributed tracing) analyzed in the service mesh section of this chapter.

- **"Microservices." Chris Richardson. https://microservices.io** Chris Richardson's comprehensive microservices patterns site, including the service registry, API gateway pattern, and pub/sub patterns with quality attribute tradeoff analysis aligned with this chapter's ATAM focus.

- **"Distributed Tracing." OpenTelemetry Project. https://opentelemetry.io/docs/concepts/observability-primer/** The official OpenTelemetry guide to distributed tracing concepts, spans, and trace ID propagation — the observability foundation that makes distributed call chains analyzable as described in this chapter.

## Videos

- **"Distributed Systems in One Lesson." Tim Berglund. O'Reilly. YouTube.** Concise introduction to the core challenges of distributed systems — partial failure, consistency, availability — that underpin every ATAM quality attribute scenario in this chapter.
