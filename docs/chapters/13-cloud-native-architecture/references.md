# References: Cloud-Native Architecture

Curated sources for deeper study of containers, Kubernetes, serverless, infrastructure as code, chaos engineering, deployment strategies, multi-cloud tradeoffs, and the cost-vs-reliability tensions in cloud architectures.

## Books

- **Burns, Brendan, Joe Beda, Kelsey Hightower, and Lachlan Evenson. (2022). *Kubernetes: Up and Running* (3rd ed.). O'Reilly Media.** The definitive guide to Kubernetes orchestration covering Deployments, HPA auto-scaling, liveness/readiness probes, and rolling update deployment strategies analyzed as ATAM quality attribute mechanisms in this chapter.

- **Morris, Kief. (2020). *Infrastructure as Code: Dynamic Systems for the Cloud Age* (2nd ed.). O'Reilly Media.** Comprehensive coverage of IaC principles, immutable infrastructure, and GitOps — the practices that eliminate configuration drift and support reproducible, auditable cloud environments as described in this chapter.

- **Nygard, Michael T. (2018). *Release It!: Design and Deploy Production-Ready Software* (2nd ed.). Pragmatic Bookshelf.** Covers cloud resilience patterns including circuit breakers, bulkheads, and timeouts, and the deployment strategy principles (blue-green, canary) that are ATAM availability and deployability tactics in this chapter.

## Articles and Papers

- **Rosenthal, Casey, Nora Jones, et al. (2020). "Chaos Engineering: System Resiliency in Practice." *IEEE Software*, 37(5).** Peer-reviewed analysis of chaos engineering as empirical resilience validation, establishing the direct connection to ATAM availability scenario verification described in this chapter.

- **Fehling, Christoph, et al. (2014). "Cloud Computing Patterns." *IEEE Internet Computing*, 18(2).** IEEE treatment of cloud service model patterns (IaaS, PaaS, FaaS) and their quality attribute implications, providing the academic foundation for the service model tradeoff analysis in this chapter.

## Online Resources

- **"Cloud Native Computing Foundation." CNCF. https://cncf.io** The authoritative resource for cloud-native ecosystem projects including Kubernetes, service mesh (Istio, Linkerd), GitOps (ArgoCD, Flux), and observability tools that implement the cloud-native architecture patterns analyzed in this chapter.

- **"Serverless Architectures." Martin Fowler. https://martinfowler.com/articles/serverless.html** Fowler's detailed analysis of serverless quality attribute tradeoffs including cold start latency risks, cost implications, and the performance-cost tension examined in this chapter's ATAM tradeoff analysis.

- **"GitOps." Weaveworks. https://www.weave.works/technologies/gitops/** The original GitOps resource from Weaveworks covering the Git-as-source-of-truth model, drift correction, and auditability properties analyzed in this chapter.

- **"Principles of Chaos Engineering." Chaos Engineering Community. https://principlesofchaos.org** The canonical reference defining chaos engineering methodology, experiment design, and the relationship between chaos experiments and production resilience validation described in this chapter.

## Videos

- **"Kubernetes: The Documentary." Honeypot. YouTube.** The history and design philosophy of Kubernetes, providing essential context for understanding why its abstractions (Deployments, Services, HPA) were designed to address the availability and scalability quality attributes central to this chapter.
