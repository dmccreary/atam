# References: Architectural Tactics and Design Principles

Curated sources for deeper study of quality attribute tactics — performance (caching, load balancing), availability (redundancy, replication, circuit breaker, retry, bulkhead), modifiability (dependency injection, plugin architecture), and foundational design principles.

## Books

- **Bass, Len, Paul Clements, and Rick Kazman. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.** The primary source for the SEI Quality Attribute Tactic Catalog used throughout this chapter — provides the organized taxonomy of performance, availability, security, and modifiability tactics that ATAM evaluators apply during architectural approach analysis.

- **Nygard, Michael T. (2018). *Release It!: Design and Deploy Production-Ready Software* (2nd ed.). Pragmatic Bookshelf.** The definitive practical treatment of resilience patterns including circuit breaker, retry, bulkhead, and timeout, with production case studies illustrating exactly the cascade failure scenarios this chapter uses as examples.

- **Parnas, David L. (1972). *On the Criteria to Be Used in Decomposing Systems into Modules.* Communications of the ACM.** The seminal paper establishing the information hiding principle and module coupling/cohesion concepts that this chapter's treatment of modifiability tactics is built upon — one of the most cited papers in software engineering.

- **Fowler, Martin, et al. (2002). *Patterns of Enterprise Application Architecture*. Addison-Wesley.** Covers caching, connection pooling, lazy loading, and other performance tactics described in this chapter with concrete implementation guidance, complementing the theoretical tactic catalog with practical patterns.

## Articles and Papers

- **Parnas, David L. (1972). "On the Criteria to Be Used in Decomposing Systems into Modules." *Communications of the ACM* 15(12), 1053–1058.** The foundational paper on information hiding and module decomposition — the design principles governing how effectively tactics can be applied, directly referenced in this chapter.

- **Fowler, Martin. (2014). "Circuit Breaker." *martinfowler.com*.** The canonical description of the circuit breaker pattern, explaining the three-state model (closed/open/half-open) and the cascade failure prevention mechanism that this chapter analyzes as a critical availability tactic.

- **Netflix Technology Blog. (2012). "Fault Tolerance in a High Volume, Distributed System." *Netflix Tech Blog*.** The production case study from Netflix describing the bulkhead and circuit breaker tactics at scale — the empirical basis for the cascade failure examples and resilience pattern analysis in this chapter.

## Online Resources

- **[SEI Quality Attribute Tactic Catalog](https://resources.sei.cmu.edu/library/asset-view.cfm?assetid=5177) — Carnegie Mellon Software Engineering Institute.** The SEI's organized collection of tactics for each quality attribute, extracted from *Software Architecture in Practice* — the primary reference catalog for the performance, availability, and modifiability tactics described in this chapter.

- **[Martin Fowler's Circuit Breaker](https://martinfowler.com/bliki/CircuitBreaker.html) — Martin Fowler.** The widely cited description of the circuit breaker pattern, including state diagrams and the relationship to retry — directly supporting this chapter's treatment of circuit breaker as a critical availability tactic.

- **[Google SRE Book — Chapter on Handling Overload](https://sre.google/sre-book/handling-overload/) — Google.** Google's Site Reliability Engineering book's chapter on load shedding, throttling, and graceful degradation — free online resource complementing this chapter's treatment of demand-side performance tactics.

- **[Netflix Hystrix Wiki](https://github.com/Netflix/Hystrix/wiki) — Netflix Open Source.** The documentation for Netflix's circuit breaker and bulkhead library, providing concrete implementation examples for the resilience patterns described in this chapter and illustrating the tactic interaction between circuit breaker, retry, and bulkhead.

- **[Dependency Injection — Martin Fowler](https://martinfowler.com/articles/injection.html) — Martin Fowler.** The canonical description of dependency injection as an architectural pattern — directly supporting this chapter's treatment of DI as the primary modifiability tactic enabling hexagonal architecture and low coupling.

## Videos

- **"Patterns of Resilience." Uwe Friedrichsen. JavaZone. YouTube. [https://www.youtube.com/watch?v=T9MPDmw6MNI](https://www.youtube.com/watch?v=T9MPDmw6MNI).** A comprehensive conference talk covering circuit breaker, retry, bulkhead, and their interactions under failure conditions — an excellent visual complement to this chapter's resilience pattern analysis and tactic interaction discussion.
