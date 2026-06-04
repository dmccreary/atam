# References: Advanced Data, Emerging AI, and Autonomous Architectures

Curated sources for deeper study of data mesh, data lakehouse, lambda and kappa architectures, AI security, federated learning, edge AI, online learning, A/B testing architecture, and autonomous system design.

## Books

- **Dehghani, Zhamak. (2022). *Data Mesh: Delivering Data-Driven Value at Scale*. O'Reilly Media.** The definitive reference for data mesh architecture, covering the four principles of domain ownership, data-as-product, self-serve infrastructure, and federated governance that this chapter analyzes for modifiability and interoperability quality attribute tradeoffs.

- **Kleppmann, Martin. (2017). *Designing Data-Intensive Applications*. O'Reilly Media.** Provides the foundational analysis of lambda and kappa architectures, event sourcing, and stream processing tradeoffs that this chapter examines through the ATAM lens of latency-consistency and operational complexity tradeoffs.

- **McMahan, H. Brendan, and Daniel Ramage. (2017). "Federated Learning: Collaborative Machine Learning without Centralized Training Data." *Google AI Blog*.** While a blog post, this Google research communication introduced federated learning to the ML architecture community and provides the conceptual foundation for the federated learning quality attribute analysis in this chapter.

## Articles and Papers

- **Armbrust, Michael, et al. (2021). "Lakehouse: A New Generation of Open Platforms that Unify Data Warehousing and Advanced Analytics." *Proceedings of CIDR 2021*. https://www.cidrdb.org/cidr2021/papers/cidr2021_paper17.pdf** The foundational paper introducing the data lakehouse concept, open table format architecture (Delta Lake, Iceberg, Hudi), and the quality attribute improvements over traditional data warehouse and data lake architectures.

- **Biggio, Battista, and Fabio Roli. (2018). "Wild Patterns: Ten Years After the Rise of Adversarial Machine Learning." *Pattern Recognition*, 84.** Peer-reviewed survey of adversarial machine learning attacks (adversarial examples, model poisoning, model extraction) and defenses, providing the academic foundation for this chapter's AI security architecture analysis.

## Online Resources

- **"Data Mesh Architecture." Thoughtworks. https://www.thoughtworks.com/en-us/radar/techniques/data-mesh** Thoughtworks Technology Radar's coverage of data mesh as an organizational and technical approach, including real-world adoption experiences and the organizational readiness factors that this chapter identifies as ATAM risks.

- **"Apache Kafka Documentation: Streams." Apache Software Foundation. https://kafka.apache.org/documentation/streams/** Official documentation for Kafka Streams, the core technology behind kappa architecture's single-pipeline approach, providing the technical basis for the lambda vs. kappa operational complexity tradeoff analyzed in this chapter.

- **"Federated Learning." Google AI. https://ai.googleblog.com/2017/04/federated-learning-collaborative.html** Google AI's original federated learning blog post and subsequent research links, covering the privacy-accuracy-communication tradeoffs that this chapter examines as ATAM quality attribute tensions in privacy-constrained training scenarios.

- **"Edge Impulse Documentation." Edge Impulse. https://docs.edgeimpulse.com** Documentation for edge AI model optimization techniques (quantization, pruning, distillation) and deployment to constrained devices, supporting this chapter's analysis of the edge-cloud compute tiering pattern and quality attribute tradeoffs.

## Videos

- **"Autonomous Agents and the Future of Software Architecture." Simon Wardley. GOTO Conference. YouTube.** Analysis of emerging autonomous system architecture patterns, safety tradeoffs, and the architectural discipline required for systems that take consequential real-world actions — the ATAM frontier examined in this chapter's autonomous system architecture section.
