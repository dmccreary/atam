# References: Distributed Systems Patterns

Curated sources for deeper study of Saga transactions, API versioning, contract-first design, sidecar and ambassador patterns, database-per-service, and synchronous vs. asynchronous communication.

## Books

- **Richardson, Chris. (2018). *Microservices Patterns*. Manning Publications.** Provides the most detailed treatment of the Saga pattern (both choreography and orchestration), database-per-service vs. shared database, and API versioning strategy — the core patterns examined in this chapter.

- **Newman, Sam. (2019). *Monolith to Microservices*. O'Reilly Media.** Covers service contract design, API versioning, and the migration from shared databases to database-per-service patterns, with quality attribute tradeoffs directly applicable to ATAM evaluation.

- **Burns, Brendan. (2018). *Designing Distributed Systems: Patterns and Paradigms for Scalable, Reliable Services*. O'Reilly Media.** Covers the sidecar, ambassador, and adapter patterns in detail as infrastructure-level extension mechanisms, with modifiability and availability quality attribute analysis matching this chapter's ATAM perspective.

## Articles and Papers

- **Garcia-Molina, Hector, and Kenneth Salem. (1987). "Sagas." *Proceedings of the 1987 ACM SIGMOD International Conference on Management of Data*.** The foundational paper introducing the Saga concept for long-running transactions, providing the theoretical basis for the compensating transaction pattern analyzed in this chapter.

- **Fowler, Martin, and James Lewis. (2014). "Microservices." *martinfowler.com*.** The influential article that established the microservices pattern including the database-per-service principle and the service contract concept, available at martinfowler.com and directly relevant to this chapter's ATAM findings on shared database risks.

## Online Resources

- **"Saga Pattern." Microservices.io. Chris Richardson. https://microservices.io/patterns/data/saga.html** The canonical reference for Saga pattern implementation including choreography vs. orchestration comparison and compensating transaction design — the primary resource for this chapter's Saga analysis.

- **"Schema Registry." Confluent Documentation. https://docs.confluent.io/platform/current/schema-registry/** Official documentation for schema registry concepts, compatibility modes, and event schema versioning that prevent the silent consumer breakage risk analyzed in this chapter.

- **"API Design Guide." Google Cloud. https://cloud.google.com/apis/design** Google's comprehensive API design guide covering backward compatibility, versioning strategies, and contract-first principles — directly applicable to the API versioning tradeoff analysis in this chapter.

- **"OpenAPI Specification." OpenAPI Initiative. https://spec.openapis.org/oas/v3.1.0** The official OpenAPI specification supporting contract-first design as described in this chapter, enabling server stub and client SDK generation from API contract definitions.

## Videos

- **"SAGA Pattern for Microservices Distributed Transactions." Tech with Nana. YouTube.** Clear visual walkthrough of Saga choreography and orchestration, including compensation flow, that helps students understand the step-by-step transaction and rollback behavior simulated in this chapter.
