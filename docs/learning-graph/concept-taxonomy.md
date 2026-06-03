# Concept Taxonomy

Twelve categories for the Architecture Tradeoff Analysis Method learning graph.
Each TaxonomyID is 3–5 uppercase letters used in `learning-graph.csv`.

---

## FOUND — Foundation Concepts
**TaxonomyID:** `FOUND`
**Count:** 33

Core vocabulary of software architecture: definitions, views, decisions, quality goals,
principles, and the lifecycle that frame every other topic in the course.
Also includes architectural fitness functions and evolutionary architecture,
which require foundational knowledge before they can be applied.

---

## PROC — ATAM Process and Facilitation
**TaxonomyID:** `PROC`
**Count:** 29

The mechanics of running an ATAM evaluation from end to end: phases, team roles,
scripted presentations, facilitation techniques, consensus building, planning documents,
briefing formats, and evaluation reports. Related methods (SAAM, ARID, mini-ATAM) appear
here for comparison.

---

## STKE — Stakeholder and Business Analysis
**TaxonomyID:** `STKE`
**Count:** 24

Identifying and engaging stakeholders, mapping business goals and drivers to
architectural decisions, organizational context, executive communication, architecture
vision documents, and roadmaps. The bridge between business strategy and technical
architecture.

---

## QUAL — Quality Attributes
**TaxonomyID:** `QUAL`
**Count:** 23

The eight canonical quality attributes (performance, availability, security,
modifiability, interoperability, scalability, reliability, usability) plus testability,
deployability, portability, safety, maintainability, and energy efficiency. Includes
quality model, taxonomy, conflicts, prioritization, and requirements.

---

## SCEN — Scenarios and Utility Trees
**TaxonomyID:** `SCEN`
**Count:** 31

The stimulus-response scenario model and all six of its components, general and concrete
scenarios, scenario brainstorming and prioritization, the five typed scenario families
(performance, availability, security, modifiability, scalability), utility tree
construction from root through leaf-level scenarios, importance/difficulty ratings,
and HH-priority negotiation workshops.

---

## TACT — Architectural Tactics and Patterns
**TaxonomyID:** `TACT`
**Count:** 45

Architectural patterns (layered, client-server, SOA, microservices, event-driven,
pipe-and-filter, CQRS, Saga, Strangler Fig, event sourcing, DDD, hexagonal, clean,
REST, gRPC, GraphQL, WebSocket) and quality attribute tactics (performance, availability,
security, modifiability, caching, load balancing, redundancy, replication, fault
tolerance, circuit breaker, retry, bulkhead). Also covers tactic interaction, ADRs,
component decomposition, interfaces, coupling, cohesion, information hiding,
encapsulation, dependency injection, and plugin architecture.

---

## RISK — Sensitivity, Tradeoffs, and Risk
**TaxonomyID:** `RISK`
**Count:** 22

Sensitivity points, tradeoff points, architectural risks and non-risks, risk themes,
identification, classification, severity, probability, risk register, communication,
risk-driven architecture, architectural debt, mitigation, monitoring, conflicting
quality attributes, design rationale, decision impact, sensitivity analysis, risk
theme documentation, debt management, and architecture improvement plan.

---

## DIST — Distributed Systems Architecture
**TaxonomyID:** `DIST`
**Count:** 28

Distributed system fundamentals through advanced patterns: service decomposition,
API gateway, service mesh, event-driven messaging, message queues, publish-subscribe,
service registry and discovery, distributed transactions, CAP theorem, eventual
consistency, two-phase commit, distributed tracing, service contracts, API versioning,
backward compatibility, integration patterns, sidecar, ambassador, database-per-service,
synchronous vs asynchronous communication, idempotency, schema registry, message
transformation, and contract-first design.

---

## CLOU — Cloud-Native Architecture
**TaxonomyID:** `CLOU`
**Count:** 25

Cloud-native patterns from containers and Kubernetes through serverless, FaaS,
infrastructure as code, immutable infrastructure, auto-scaling, cloud service models,
multi-cloud, hybrid cloud, resilience patterns, chaos engineering, deployment strategies
(blue-green, canary, zero-downtime), cost optimization, vendor lock-in, elasticity,
cloud security, managed services, GitOps, cost-vs-reliability tradeoffs, and cloud
observability.

---

## SECP — Security Architecture
**TaxonomyID:** `SECP`
**Count:** 25

Security architecture from threat modeling (STRIDE) through attack surface reduction,
defense in depth, zero trust, authentication, authorization, encryption at rest and in
transit, OAuth 2.0, API security, secret management, security monitoring, intrusion
detection, SIEM, least privilege, compliance, SDLC security, penetration testing,
security scenarios, tactic catalog, IAM, incident response, and privacy by design.

---

## PERF — Performance and Observability
**TaxonomyID:** `PERF`
**Count:** 30

Performance fundamentals (latency, throughput, response time, Amdahl's law),
profiling, load and stress testing, capacity planning, vertical and horizontal scaling,
sharding, connection pooling, CDN, observability (logging, metrics, health checks),
SLO/SLI/error budgets, SRE, MTTR, MTBF, availability calculation, disaster recovery,
RTO/RPO, geographic redundancy, and active-passive failover.

---

## AIEM — AI and Emerging Systems
**TaxonomyID:** `AIEM`
**Count:** 35

AI/ML system architecture from training pipelines through model serving, feature stores,
model registry, AI latency, non-deterministic behavior, drift detection, data pipelines,
batch and stream processing, LLM architecture, prompt engineering, RAG, GraphRAG,
vector databases, AI observability and explainability, responsible AI, data mesh,
data lakehouse, lambda/kappa/space-based architectures, AI security, model versioning,
A/B testing, online learning, data governance, multi-modal AI, federated learning,
edge AI, pipeline monitoring, and autonomous systems.

---

## Distribution Summary

| TaxonomyID | Category Name | Count | % |
|---|---|---:|---:|
| FOUND | Foundation Concepts | 33 | 9.4% |
| PROC | ATAM Process and Facilitation | 29 | 8.3% |
| STKE | Stakeholder and Business Analysis | 24 | 6.9% |
| QUAL | Quality Attributes | 23 | 6.6% |
| SCEN | Scenarios and Utility Trees | 31 | 8.9% |
| TACT | Architectural Tactics and Patterns | 45 | 12.9% |
| RISK | Sensitivity, Tradeoffs, and Risk | 22 | 6.3% |
| DIST | Distributed Systems Architecture | 28 | 8.0% |
| CLOU | Cloud-Native Architecture | 25 | 7.1% |
| SECP | Security Architecture | 25 | 7.1% |
| PERF | Performance and Observability | 30 | 8.6% |
| AIEM | AI and Emerging Systems | 35 | 10.0% |
| **Total** | | **350** | **100%** |

No category exceeds 30% of total concepts. The largest (TACT at 12.9%) reflects the
breadth of architectural patterns and tactics covered by the course.
