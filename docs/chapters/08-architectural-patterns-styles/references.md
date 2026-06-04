# References: Architectural Patterns and Styles

Curated sources for deeper study of architectural patterns — layered, microservices, event-driven, CQRS, Strangler Fig, DDD, REST, gRPC, GraphQL, and Architecture Decision Records.

## Books

- **Bass, Len, Paul Clements, and Rick Kazman. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.** The SEI reference for architectural styles and their quality attribute tradeoffs — directly informing this chapter's ATAM-lens analysis of layered, client-server, SOA, and event-driven patterns.

- **Newman, Sam. (2021). *Building Microservices* (2nd ed.). O'Reilly Media.** The most comprehensive practical reference on microservices architecture, covering the modifiability, availability, and performance tradeoffs analyzed in this chapter, including synchronous call chain availability math and the Strangler Fig migration pattern.

- **Evans, Eric. (2003). *Domain-Driven Design: Tackling Complexity in the Heart of Software*. Addison-Wesley.** The foundational text introducing Domain-Driven Design, bounded contexts, and the modular decomposition principles that this chapter uses to analyze DDD's quality attribute implications for ATAM evaluations.

- **Richardson, Chris. (2018). *Microservices Patterns*. Manning Publications.** Covers CQRS, event sourcing, event-driven architecture, and the Saga pattern with explicit quality attribute analysis — directly supporting this chapter's treatment of these modern distributed patterns and their ATAM tradeoff profiles.

## Articles and Papers

- **Fielding, Roy T. (2000). "Architectural Styles and the Design of Network-Based Software Architectures." Doctoral dissertation, University of California, Irvine.** The original dissertation defining REST as an architectural style — the primary source for understanding REST's quality attribute properties (interoperability, cacheability, statelessness) discussed in this chapter.

- **Nygard, Michael. (2007). "Architecture Decision Records." *Blog post, thinkrelevance.com*.** The original description of the Architecture Decision Record format used in this chapter, including the title/status/context/decision/consequences structure that has become the standard for documenting architectural decisions.

## Online Resources

- **[Microservices.io Pattern Catalog](https://microservices.io/patterns/index.html) — Chris Richardson.** Comprehensive catalog of microservices patterns including CQRS, event sourcing, and the Strangler Fig, with explicit quality attribute analysis — directly supportive of this chapter's pattern analysis framework.

- **[Architecture Decision Records — GitHub Awesome List](https://adr.github.io/) — adr.github.io.** Collection of ADR tools, templates, and examples implementing the ADR format described in this chapter, including links to published ADR repositories from real open-source projects.

- **[gRPC Documentation](https://grpc.io/docs/) — gRPC Project.** Official documentation for the gRPC framework, including performance benchmarks and comparison with REST — directly supporting this chapter's communication style comparison and quality attribute analysis.

- **[Martin Fowler's Catalog of Patterns of Enterprise Architecture](https://martinfowler.com/eaaCatalog/) — Martin Fowler.** The online companion to *Patterns of Enterprise Application Architecture*, providing concise descriptions of many patterns referenced in this chapter including MVC, CQRS, and event sourcing.

- **[The Strangler Fig Application](https://martinfowler.com/bliki/StranglerFigApplication.html) — Martin Fowler.** The canonical description of the Strangler Fig migration pattern, explaining the vine metaphor and the quality attribute implications that this chapter uses as its foundation for the pattern's ATAM analysis.

## Videos

- **"CQRS and Event Sourcing." Greg Young. GOTO Conference. YouTube. [https://www.youtube.com/watch?v=8JKjvY4etTY](https://www.youtube.com/watch?v=8JKjvY4etTY).** The definitive conference talk by the originator of CQRS, explaining the pattern's quality attribute motivation, consistency implications, and the relationship to event sourcing — directly relevant to this chapter's analysis of both patterns.
