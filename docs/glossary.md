# Glossary of Terms

#### A/B Testing Architecture

The structural design of the components needed to simultaneously serve multiple variants of a feature or model to different user segments, collect behavioral measurements from each variant, and statistically analyze which variant better achieves the specified quality objective.

A/B testing architecture is an experimentation capability that enables evidence-based architectural and model improvement decisions. ATAM evaluations examine A/B testing architectures for the isolation of experiment variants (preventing contamination between groups) and the statistical validity of conclusions drawn from experiments.

**Example:** An A/B testing architecture assigns users to experiment groups at login using a deterministic hash of the user ID, serves different recommendation model versions to each group, and collects click-through rates for statistical comparison, ensuring each user consistently receives the same variant throughout the experiment.

#### Abstraction in Architecture

The mechanism by which architectural descriptions suppress implementation details and expose only the information relevant to a particular level of analysis or stakeholder concern, enabling reasoning about the system at an appropriate level of complexity.

Abstraction is fundamental to ATAM's analytical approach. Evaluation teams reason about architectural abstractions (components, connectors, layers) rather than code, which makes it feasible to evaluate large systems in compressed timeframes.

**Example:** Describing a data persistence layer as a "repository component" abstracts away whether the implementation uses a relational database, a document store, or a cloud-managed service, enabling architectural reasoning without implementation details.

#### Active-Passive Failover

An availability architecture pattern in which a primary (active) system handles all production workload while a secondary (passive) system is maintained in a ready state and activated only when the primary fails, providing recovery from primary failure with a brief interruption.

Active-passive failover is simpler than active-active but introduces a failover transition delay while the passive system activates. ATAM evaluations examine active-passive designs for the activation time against the RTO and the data synchronization state at the time of failover.

**Example:** An active-passive failover configuration for a database maintains a synchronously replicated replica; when the primary fails, the passive replica is promoted to primary within 30 seconds, meeting the availability scenario's 60-second recovery time requirement.

#### AI Explainability

The architectural capability of an AI system to provide human-understandable explanations of its predictions or recommendations, describing which input features contributed most to a specific output and why the model produced a particular result.

AI explainability is a quality attribute increasingly required by regulation (GDPR's "right to explanation"), industry standards, and stakeholder trust. ATAM evaluations examine explainability architectures for the computational overhead of generating explanations and the accuracy with which explanations reflect actual model behavior.

**Example:** An explainability architecture for a credit scoring model generates a per-application explanation listing the top five factors (payment history, credit utilization, account age, inquiry count, credit mix) and their directional contribution to the credit decision, enabling loan officers to communicate the basis for rejections.

#### AI Latency Considerations

The set of architectural factors that contribute to the end-to-end response time of AI-powered features, including feature retrieval time, model inference time, result post-processing time, and network transit, which together determine whether the system can satisfy real-time serving requirements.

AI inference latency requires specific architectural analysis in ATAM because ML model inference is often computationally intensive compared to traditional software logic. ATAM evaluations decompose AI latency into its contributing factors to identify which component is the bottleneck for performance scenarios.

**Example:** Decomposing a 200ms AI response time reveals 50ms for feature retrieval from the feature store, 100ms for model inference, and 50ms for result ranking and formatting; the inference component is the bottleneck and the target for model compression and hardware acceleration investment.

#### AI Model Versioning

The architectural practice of maintaining multiple versions of deployed machine learning models simultaneously, tracking which version produced each prediction, enabling rollback to previous versions, and supporting A/B testing of model improvements.

Model versioning is an architectural tactic for managing AI system reliability and governance. ATAM evaluations examine model versioning architectures for the ability to roll back a degraded model version rapidly (affecting MTTR for model quality incidents) and the completeness of prediction provenance tracking.

**Example:** A model versioning architecture maintains the current production model and the previous two model versions simultaneously; when A/B testing reveals that a new model produces worse recommendations for a segment of users, traffic is shifted back to the previous version within 5 minutes without service interruption.

#### AI Observability

The capability of an AI-powered software system to expose sufficient information about its AI components — including model inputs, outputs, confidence scores, feature values, and performance metrics — to enable operators to diagnose model quality issues, detect drift, and investigate incorrect predictions.

AI observability extends traditional software observability to cover the specific monitoring needs of machine learning systems. ATAM evaluations examine AI observability architectures for the logging of AI decision inputs and outputs needed to diagnose the failure scenarios in the utility tree's AI quality attribute branch.

**Example:** An AI observability architecture logs every model inference with the input features, predicted output, confidence score, and model version to a queryable data store, enabling investigation of reported incorrect predictions by reconstructing the exact model state at the time of the prediction.

#### AI Pipeline Monitoring

The architectural capability for continuously tracking the health, performance, and data quality of machine learning pipelines — from data ingestion through model training to deployment — detecting failures, anomalies, or quality degradation at each pipeline stage.

AI pipeline monitoring is an observability tactic specific to ML systems. ATAM evaluations examine pipeline monitoring architectures for the detection coverage of the failure scenarios that could affect model availability, training quality, or serving accuracy.

**Example:** An AI pipeline monitoring system tracks data ingestion completeness (alerting when less than 95% of expected events arrive), training job success rates, model evaluation metric trends, and serving latency, providing end-to-end visibility into the pipeline's health and model quality.

#### AI Security Architecture

The structural design of security controls specifically required for AI-powered systems, addressing AI-specific threats such as adversarial attacks, prompt injection, model extraction, data poisoning, and model inversion, in addition to traditional software security controls.

AI security architecture addresses a unique threat landscape that extends beyond traditional software security. ATAM evaluations of AI systems must include AI-specific security scenarios alongside traditional security scenarios to comprehensively assess the security architecture.

**Example:** An AI security architecture for a content moderation system defends against prompt injection (inputs crafted to override safety instructions), adversarial examples (images crafted to evade detection), and model extraction attacks (API queries designed to reconstruct the model), with specific architectural controls for each threat type.

#### AI System Architecture

The structural organization of software components — including data ingestion, model training, model serving, feature engineering, and monitoring — that collectively enable a software system to incorporate machine learning models as first-class operational components.

AI system architecture introduces quality attribute challenges not present in traditional software systems, including non-deterministic behavior, model drift, training data dependencies, and explainability requirements. ATAM evaluations of AI systems examine these unique architectural concerns through AI-specific scenarios.

**Example:** An AI system architecture for a fraud detection platform includes a feature store, online serving API, batch retraining pipeline, model registry, and performance monitoring dashboard, with each component designed to support the system's latency and availability requirements.

#### Ambassador Pattern

An architectural pattern in which a helper service or proxy is placed alongside a client component to handle network communication concerns such as retry logic, circuit breaking, authentication, and monitoring on behalf of the client, without modifying the client's code.

The ambassador pattern decouples network resilience concerns from business logic, enabling consistent communication policies across services. ATAM evaluations examine ambassador designs for the performance overhead of the additional proxy hop and the availability implications of the ambassador becoming a dependency.

**Example:** An ambassador proxy placed alongside a legacy client application handles automatic retries with exponential backoff and circuit breaking for calls to the new microservices backend, enabling the legacy client to benefit from resilience patterns without code modification.

#### Amdahl's Law

A theoretical model stating that the maximum speedup of a system from parallel execution of a task is limited by the fraction of the task that must be executed sequentially, expressed as S = 1 / (1 - P + P/N), where P is the parallel fraction and N is the number of processors.

Amdahl's Law provides a theoretical ceiling for horizontal scaling effectiveness that ATAM evaluations use to assess scalability scenarios. Systems with large sequential fractions cannot achieve linear scaling regardless of how many resources are added.

**Example:** If 20% of a computation must execute sequentially, Amdahl's Law limits the maximum speedup to 5x regardless of how many processors are added, setting an architectural constraint on the performance improvement achievable through parallelization alone.

#### API Gateway Pattern

An architectural pattern in which a single entry-point service accepts all client requests and routes them to the appropriate backend services, handling cross-cutting concerns such as authentication, rate limiting, request transformation, and response aggregation.

The API gateway pattern centralizes cross-cutting concerns, simplifying individual services but introducing a potential bottleneck and single point of failure. ATAM evaluations examine gateway designs for availability (gateway redundancy), performance (gateway throughput), and security (centralized enforcement).

**Example:** An API gateway for a mobile application handles OAuth 2.0 authentication, routes requests to eight backend microservices, aggregates responses for the home page into a single call, and enforces rate limits of 1,000 requests per client per minute.

#### API Security Design

The collection of architectural decisions that protect an API from unauthorized access, misuse, and abuse, including authentication enforcement, authorization checking, input validation, rate limiting, and API key management.

API security design is a security architecture concern that ATAM evaluations examine through threat scenarios. APIs are common attack entry points, and an API that lacks comprehensive security controls represents a high-severity architectural risk.

**Example:** An API security design applies OAuth 2.0 authentication, scope-based authorization, JSON schema validation for all inputs, rate limiting per client, and anomaly detection for unusual access patterns, protecting against the authentication bypass, injection, and abuse scenarios in the utility tree.

#### API Versioning

The architectural practice of maintaining multiple versions of an API simultaneously to allow existing consumers to continue functioning while new consumers adopt updated API capabilities, preventing forced simultaneous upgrades across all consumers.

API versioning is a key modifiability tactic for service-oriented and microservices architectures. ATAM evaluations examine versioning strategies for the effort required to maintain multiple versions and the migration path for consumers to adopt new versions.

**Example:** A REST API uses URL path versioning (/v1/orders and /v2/orders), maintaining the v1 endpoint for legacy consumers while providing v2 with improved pagination and filtering capabilities, allowing gradual consumer migration over six months.

#### Architectural Component

A principal computational or data-storage unit of a software system that performs a well-defined set of functions and interacts with other components only through explicitly defined interfaces.

Components are the primary building blocks examined during ATAM evaluations. Identifying components and their responsibilities is prerequisite to assessing how well an architecture achieves its quality attribute goals.

**Example:** In an e-commerce system, the Order Processing Service is a component responsible for validating orders, computing totals, and persisting order records to a database component.

#### Architectural Concern

A matter of interest to one or more stakeholders that must be addressed by the architecture, including quality attribute requirements, functional requirements, constraints, business goals, and principles.

ATAM is fundamentally a concern-driven evaluation method. The evaluation team elicits concerns from all stakeholder groups to ensure the evaluation covers the full scope of what matters to the system's success.

**Example:** Operations stakeholders may have the concern that the system must be upgradable with zero downtime, while security stakeholders may have the concern that all inter-service communication must be mutually authenticated.

#### Architectural Connector

A runtime mechanism that mediates communication, coordination, or cooperation among components, including protocols, shared data repositories, procedure calls, event distributors, and message queues.

Connectors determine how components interact, which directly affects quality attributes such as performance (latency introduced by message brokers), availability (connector failure modes), and modifiability (coupling between components). ATAM evaluations frequently surface connector design as a sensitivity point.

**Example:** A REST HTTP connector between a mobile client and a backend API introduces network latency but enables independent deployment of each side, a tradeoff ATAM would make explicit.

#### Architectural Constraint

A restriction on architectural decisions imposed by external factors such as regulatory requirements, organizational standards, legacy system compatibility, or physical infrastructure that limits the space of viable design choices.

Constraints are inputs to ATAM evaluations that the team must accept as fixed rather than as design choices subject to optimization. Misidentifying a constraint as a design choice — or a design choice as a constraint — leads to flawed evaluation conclusions.

**Example:** A healthcare system architecture is constrained by HIPAA regulations to encrypt all patient data at rest and in transit, which the ATAM team treats as a non-negotiable boundary condition rather than a tradeoff to be weighed.

#### Architectural Debt

Architectural decisions that were expedient at the time but that now impose ongoing costs in the form of reduced quality attribute achievement, increased modification difficulty, or accumulated workarounds, representing a future liability that must eventually be repaid through architectural improvement.

Architectural debt is a broader concept than technical debt, specifically referring to structural decisions at the architectural level. ATAM evaluations frequently surface architectural debt as risks or sensitivity points where accumulated expedient decisions now threaten quality attribute goals.

**Example:** A system originally designed for 100 concurrent users but now serving 10,000 has accumulated architectural debt in its single-threaded request processing model; the debt is being "paid" as increasing performance incidents and the growing cost of workarounds.

#### Architectural Decision

A design choice that selects a particular solution from among alternatives, resolves an architectural concern, and has observable consequences for one or more quality attributes or structural properties of the system.

ATAM explicitly surfaces and examines architectural decisions to determine whether they achieve the desired quality attribute goals. Decisions are documented alongside their rationale, alternatives considered, and tradeoffs accepted.

**Example:** The decision to use an in-memory cache (Redis) for session data reduces database load and improves response time but introduces a consistency risk when cache and database diverge.

#### Architectural Driver

A quality attribute requirement, constraint, or business goal of sufficient importance that it significantly influences the architecture, meaning that satisfying it requires specific architectural decisions rather than local design choices.

Identifying architectural drivers is the critical first step in ATAM because the evaluation focuses its deepest analysis on the architectural decisions made in response to drivers. Not all quality attribute requirements are drivers — only those that shape the architecture.

**Example:** A requirement for 99.99% availability is an architectural driver for a payment processing system because achieving it requires decisions about redundancy, failover mechanisms, and geographic distribution that permeate the entire architecture.

#### Architectural Pattern

A named, reusable solution to a recurring software design problem at the architectural level, describing the structural organization of components and connectors, the responsibilities assigned to each, and the quality attribute consequences of the arrangement.

Architectural patterns are a key vocabulary used in ATAM architectural briefings and analysis. Recognizing which patterns an architecture employs enables the evaluation team to reason about known tradeoffs without having to rediscover them for each system.

**Example:** The CQRS (Command Query Responsibility Segregation) pattern separates read and write data models, which improves read scalability and performance but introduces eventual consistency risks that ATAM evaluators examine through availability and reliability scenarios.

#### Architectural Risk

An architectural decision or missing decision that potentially compromises the system's ability to achieve one or more quality attribute goals, characterized by uncertainty about whether the architecture can perform as required under relevant conditions.

Architectural risks are the most important ATAM outputs. Identifying risks before implementation enables corrective architectural decisions at low cost; risks discovered during production represent failures of architecture evaluation.

**Example:** Using a single message broker for all event routing is an architectural risk for availability: if the broker fails, all event-driven processing halts, and the architecture provides no fallback mechanism for services to continue operating.

#### Architectural Stimulus Response

The relationship between an externally or internally generated event (stimulus) that arrives at a software system and the system's behavioral reaction (response), used as the analytical framework for quality attribute scenarios in ATAM.

The stimulus-response framework gives ATAM scenarios a consistent structure enabling systematic analysis. By specifying both the triggering condition and the required system behavior, scenarios create testable architectural requirements mappable to specific decisions.

**Example:** In an availability scenario, the stimulus is a primary database server failure during operating hours, and the response is automatic failover with less than 30 seconds of service degradation before full operation resumes.

#### Architectural Style

A named collection of architectural design decisions applicable to a recurring design problem that constrains the architectural decisions specific to any particular system within that style.

Styles provide a vocabulary for describing and evaluating architectures. In ATAM, knowing which style an architecture employs allows the evaluation team to reason about known tradeoffs associated with that style before examining system-specific decisions.

**Example:** Choosing the microservices architectural style constrains teams to independently deployable services communicating over network protocols, which promotes modifiability and scalability but introduces distributed-systems complexity.

#### Architectural Tactic

A design decision that influences the achievement of a specific quality attribute response by controlling some aspect of a system's structure or behavior, chosen from a catalog of known approaches for addressing a particular quality attribute concern.

Tactics are the analytical bridge between quality attribute scenarios and architectural decisions in ATAM. Evaluators examine which tactics an architecture employs for each quality attribute and whether the combination of tactics is sufficient to achieve the scenario response measures.

**Example:** For the availability quality attribute, the tactic "heartbeat monitoring" detects component failures within a specified interval, which the ATAM evaluation traces to the monitoring architecture to verify that the detection latency meets the availability scenario's response time requirement.

#### Architecture Briefing Format

The structured format used by the architecture owner to present the software architecture to ATAM evaluation participants, covering context, key design decisions, architectural approaches for each quality attribute, and known open issues.

A well-structured architecture briefing enables efficient evaluation by ensuring all participants have a common understanding of what is being evaluated before analysis begins. A poor briefing creates confusion that wastes evaluation time.

**Example:** The architecture briefing format for an ATAM session includes: system context (10 minutes), key architectural decisions and rationale (20 minutes), architectural approaches for each quality attribute (30 minutes), and known concerns and open questions (10 minutes).

#### Architecture Business Case

A structured justification for a proposed software architecture that articulates the business value of the architectural approach, the costs of implementation, the risks of alternatives, and the quality attribute outcomes stakeholders can expect.

Architecture business cases connect technical architectural decisions to organizational value creation, enabling informed investment decisions by non-technical decision-makers. ATAM findings often form part of an architecture business case for proposed changes.

**Example:** An architecture business case for migrating from a monolith to microservices quantifies the expected improvement in deployment frequency, the cost of migration, the operational complexity increase, and the projected reduction in time-to-market for new features.

#### Architecture Conformance

The degree to which an implemented system matches the intended software architecture as specified in architecture documentation, measured by comparing the as-built structure with the as-intended structure.

Conformance checking is relevant to ATAM because an architecture that performs well in evaluation only delivers its promised quality attributes if the implementation faithfully reflects the architectural decisions. Drift between intended and implemented architecture invalidates evaluation findings.

**Example:** A conformance check might use dependency analysis tools to verify that no module in the presentation layer directly calls the database layer, confirming that the layered architecture rule is honored in the actual codebase.

#### Architecture Debt Management

The systematic identification, tracking, prioritization, and planned remediation of architectural debt items — suboptimal architectural decisions that impose ongoing quality attribute costs — through a structured process that balances debt repayment with new feature development.

Architecture debt management transforms ATAM findings into a continuous improvement program. Without structured debt management, risks identified in ATAM evaluations accumulate unaddressed as the system evolves, compounding the architectural debt and increasing remediation cost.

**Example:** An architecture debt register tracks 12 items identified across three ATAM evaluations, with each item assigned a severity rating, estimated remediation cost, and a target resolution quarter, enabling the team to allocate 20% of each sprint to debt repayment alongside feature development.

#### Architecture Decision Impact

The set of consequences — both intended and unintended — that an architectural decision produces on the system's structure, quality attributes, and future evolution possibilities, including both the positive outcomes the decision achieves and the negative consequences it accepts.

Analyzing decision impact is central to ATAM scenario analysis. For each architectural approach, evaluators examine both the quality attributes it promotes and the quality attributes it compromises, building a complete picture of the tradeoffs embedded in the architecture.

**Example:** The decision to use a shared database for multiple services directly impacts modifiability (services cannot evolve their schema independently), testability (services cannot be tested without a live database), and scalability (the database becomes a shared bottleneck).

#### Architecture Decision Record

A structured document that captures an architectural decision, the context in which it was made, the options considered, the rationale for the choice made, and the consequences — both positive and negative — of the decision.

Architecture Decision Records (ADRs) provide the rationale documentation that ATAM evaluations rely on for understanding why the architecture is designed as it is. Without ADRs, evaluation teams must reconstruct rationale through interviews, which is time-consuming and often incomplete.

**Example:** An ADR documenting the decision to use event sourcing over direct state updates records the alternatives considered (CRUD with audit tables), the rationale (need for temporal queries and auditability), and the consequences (increased query complexity and storage requirements).

#### Architecture Description Lang

A formal language or notation used to specify software architectures with defined syntax and semantics, enabling unambiguous representation of architectural elements, their properties, and their relationships.

Architecture Description Languages (ADLs) support ATAM by providing precise specifications of the architecture being evaluated. Informal diagrams can be misinterpreted; ADLs reduce ambiguity in evaluation discussions.

**Example:** AADL (Architecture Analysis and Design Language) is used in safety-critical systems to specify component timing properties and resource budgets in a form that supports automated analysis of schedulability and performance.

#### Architecture Documentation

The collection of work products that describe a software architecture to its various stakeholders, including views, rationale, constraints, and design decisions organized to support multiple levels of architectural reasoning.

During ATAM preparation, the evaluation team studies architecture documentation to understand the system before the evaluation sessions begin. Incomplete or inconsistent documentation is itself a finding that ATAM may surface as an architectural risk.

**Example:** Architecture documentation for a banking system includes a module decomposition diagram, a sequence diagram for transaction processing, and a written rationale explaining why a two-phase commit protocol was chosen over eventual consistency.

#### Architecture Evaluation

A systematic process of examining a software architecture against a set of stated quality goals to identify risks, non-risks, sensitivity points, and tradeoffs before the architecture is fully implemented.

Architecture evaluation is the core activity that ATAM formalizes. Early evaluation is economically significant because the cost of correcting architectural flaws grows dramatically once a system is in production.

**Example:** An ATAM evaluation of a proposed real-time trading platform examines whether the chosen event-driven architecture can meet a 10-millisecond latency requirement under peak load, identifying message broker throughput as a sensitivity point.

#### Architecture Evaluation Report

The formal document produced at the conclusion of an ATAM evaluation that records all findings, including the prioritized utility tree, identified risks and non-risks, sensitivity points, tradeoff points, risk themes, and recommendations for addressing high-priority risks.

The evaluation report is the primary deliverable of the ATAM process and the basis for architectural decisions following the evaluation. Its quality and completeness determine whether the evaluation's findings are acted upon effectively.

**Example:** An architecture evaluation report for a healthcare information exchange system documents 15 risks, 22 non-risks, 6 sensitivity points, and 4 tradeoff points, with a risk theme around "data sovereignty" encompassing 4 high-priority risks requiring immediate architectural attention.

#### Architecture Fitness Function

An automated mechanism that continuously evaluates whether a software architecture maintains its specified structural properties, quality attribute characteristics, and design constraints over time, providing objective feedback on architectural health.

Architecture fitness functions implement evolutionary architecture principles by making architectural constraints automatically verifiable. ATAM findings can be codified as fitness functions that execute in CI/CD pipelines, converting one-time evaluation insights into continuous architectural governance.

**Example:** An architecture fitness function implemented as a dependency analysis tool runs in the CI/CD pipeline and fails the build when any module in the presentation layer creates a direct dependency on the data access layer, enforcing the layered architecture constraint identified in the ATAM evaluation.

#### Architecture Improvement Plan

A structured, prioritized action plan derived from an ATAM evaluation that specifies the architectural changes required to address identified risks, reduce sensitivity points, and resolve unacceptable tradeoffs, with estimated effort, assigned owners, and target completion timelines.

The architecture improvement plan is the operational output that connects ATAM findings to concrete engineering action. Without a structured improvement plan, ATAM risks remain documented but unaddressed as day-to-day development work consumes the team's capacity.

**Example:** An architecture improvement plan prioritizes three actions: adding circuit breakers to all external service calls (2 weeks, addresses availability risk), implementing a cache invalidation strategy (4 weeks, addresses consistency sensitivity point), and migrating to database-per-service (6 months, addresses modifiability architectural debt).

#### Architecture Lifecycle

The sequence of phases through which a software architecture passes from initial conception through design, evaluation, implementation, evolution, and eventual retirement, with distinct activities and artifacts associated with each phase.

ATAM is positioned in the early phases of the architecture lifecycle, before significant implementation investment is made. Understanding lifecycle position helps teams determine the appropriate depth and scope of evaluation effort.

**Example:** The architecture lifecycle for a new product begins with concept and requirements, proceeds through architecture design and ATAM evaluation, continues through implementation and conformance checking, and eventually reaches architecture evolution as requirements change.

#### Architecture Owner Role

The individual, typically the lead architect or chief architect, who is responsible for the architecture being evaluated and who presents the architecture to the ATAM evaluation team, answers questions about design decisions, and receives the evaluation findings.

The architecture owner's openness to criticism is essential to ATAM success. The method works best when architecture owners treat the evaluation as a learning exercise rather than a defense of their work, enabling honest identification of risks.

**Example:** The architecture owner presents the system's data partitioning strategy to the ATAM team, explains the rationale for choosing consistent hashing over range partitioning, and responds candidly when evaluators identify an unhandled rebalancing scenario.

#### Architecture Principles

A set of general rules and guidelines that inform and constrain the design and evolution of a software architecture, derived from business strategy, technical standards, and organizational values.

Architecture principles serve as axioms during ATAM evaluations — they represent constraints the evaluation team treats as given and examines architectural decisions against. Violations of stated principles may be identified as risks or findings.

**Example:** An organization's architecture principle "prefer stateless services" guides every service design decision, enabling ATAM evaluators to flag stateful session management in a proposed service as a potential violation requiring justification.

#### Architecture Quality Goals

The explicitly stated, measurable objectives for the non-functional properties a software architecture must achieve, derived from stakeholder concerns and business drivers and expressed in terms of specific quality attributes.

ATAM centers its evaluation on architecture quality goals. Without explicit, prioritized quality goals, an evaluation team cannot determine which architectural decisions are appropriate, which represent risks, and where tradeoffs exist.

**Example:** Quality goals for an emergency dispatch system might include: 99.999% availability, sub-second response time for unit assignments, and the ability to add new dispatch algorithms without modifying existing modules.

#### Architecture Review Board

A governing body composed of senior architects and technical leaders responsible for establishing architectural standards, reviewing proposed architectural decisions, and ensuring consistency across systems within an organization.

An Architecture Review Board (ARB) institutionalizes the architectural governance that ATAM evaluations support. ARBs may commission ATAM evaluations, act as part of the evaluation team, or enforce ATAM findings through their approval authority.

**Example:** An organization's ARB reviews all proposed microservice decompositions before implementation begins, using an ATAM-derived checklist to verify that each proposal addresses availability, security, and data consistency concerns.

#### Architecture Review Methods

The collection of systematic approaches for examining software architectures to assess quality, identify risks, and verify alignment with requirements, including formal methods such as ATAM and SAAM as well as informal practices such as peer review and expert walkthroughs.

Awareness of multiple architecture review methods enables organizations to select the approach most appropriate for their context, scale, and risk tolerance. ATAM is the most comprehensive and is appropriate for high-stakes systems; simpler methods suffice for lower-risk decisions.

**Example:** An organization's architecture governance policy specifies that major new systems require a full ATAM evaluation, significant changes to existing systems require a lightweight review, and minor changes require only a peer review by the architecture team.

#### Architecture Roadmap

A time-sequenced plan that describes the planned evolution of a software architecture from its current state to a desired future state, including intermediate architectural milestones, key decisions to be made, and dependencies between architectural changes.

Architecture roadmaps provide temporal context for ATAM evaluations. When evaluating an architecture in transition, evaluators must understand which architectural elements represent the future target state and which are transitional, to avoid evaluating the wrong target.

**Example:** An architecture roadmap for a legacy transformation project shows three two-year phases: Phase 1 extracts the authentication service, Phase 2 extracts the order management domain, and Phase 3 retires the legacy monolith, with ATAM evaluations planned at the start of each phase.

#### Architecture Standard

A documented specification that defines mandatory architectural decisions, patterns, interface conventions, or technology choices that all systems within a scope must adopt, reducing variation and enabling consistent evaluation, integration, and governance across a portfolio of systems.

Architecture standards are organizational constraints that ATAM evaluations must respect. Systems that deviate from standards must explicitly justify the deviation as an architectural decision with documented tradeoffs rather than an oversight.

**Example:** An architecture standard requiring all new services to implement a defined health check endpoint and expose metrics in Prometheus format enables uniform monitoring infrastructure across all services and reduces ATAM evaluation effort by making monitoring architecture a non-risk for standard-compliant systems.

#### Architecture View

A representation of one or more aspects of a software architecture that addresses the concerns of one or more stakeholders, expressed using a consistent set of architectural elements, relations, and rules for its construction and interpretation.

ATAM evaluations rely on multiple views because no single view captures all information needed to assess all quality attributes. A performance analysis requires component-and-connector views, while a modifiability analysis requires module views.

**Example:** A deployment view showing which services run on which cloud instances addresses the concerns of operations stakeholders regarding availability and geographic redundancy.

#### Architecture Viewpoint

A specification of the conventions used to construct and use a particular kind of architecture view, including the stakeholders whose concerns are addressed, the types of elements and relations in the view, and guidelines for analyzing the view.

Viewpoints standardize how views are created and interpreted, enabling consistent evaluation across different systems. ATAM teams use recognized viewpoints to ensure they examine all relevant structural perspectives.

**Example:** The "4+1" viewpoint model defines logical, process, development, physical, and scenarios viewpoints, each addressing different stakeholder concerns during an architecture review.

#### Architecture Vision Document

An artifact that describes the desired end-state of a software system's architecture, including its key structural decisions, quality attribute goals, and the architectural approaches that will realize those goals, serving as a guide for the architecture's development and evolution.

The architecture vision document is an important input to ATAM preparation. It communicates the architecture's intended direction to evaluation participants and provides a basis for assessing whether specific design decisions are consistent with the architectural vision.

**Example:** An architecture vision document for a digital banking platform describes the target microservices architecture, the event-driven communication backbone, the target quality attributes of 99.95% availability and sub-100ms transaction response, and the migration path from the current monolith.

#### Architecture vs Design Scope

The distinction between decisions that define the overall structure of a system and its quality attribute properties (architecture) versus decisions that specify the internal implementation of individual components (design).

This distinction matters in ATAM because the evaluation method focuses on architectural decisions — those that have broad impact on quality attributes — rather than implementation details. Conflating the two scopes wastes evaluation time on decisions that do not affect system-wide quality.

**Example:** Choosing to separate a system into independently deployable services is an architectural decision; choosing which sorting algorithm to use within a single service's internal processing is a design decision outside ATAM's primary scope.

#### Architecture-Centric Development

A software development approach in which architectural decisions are made explicitly and early, documented rigorously, and used to guide all downstream design, implementation, and testing activities.

ATAM is most effective within architecture-centric development because architectural decisions are visible and can be evaluated before implementation commits resources to them. Systems built without explicit architecture are difficult to evaluate because the architecture must be reverse-engineered before assessment can begin.

**Example:** In architecture-centric development, a team selects and documents a hexagonal architecture before writing any code, enabling stakeholders to review the separation of business logic from infrastructure concerns during an ATAM session.

#### ARID Method

The Active Reviews for Intermediate Designs method, a lightweight architecture evaluation technique that combines elements of ATAM with design review practices, used to evaluate partial or in-progress architectures rather than complete architectural descriptions.

ARID fills a gap that full ATAM does not address: evaluating architectural decisions as they are being made during active development, before a complete architecture description exists. It is less comprehensive than ATAM but more timely for iterative development contexts.

**Example:** An ARID session is conducted after an API design is proposed but before implementation begins, using a small group of potential API consumers to work through representative usage scenarios and identify interface design problems.

#### ATAM Consensus Building

The process by which ATAM evaluation participants with diverse perspectives and priorities reach shared understanding and agreement on the relative importance of quality attributes, the significance of identified risks, and the validity of evaluation findings.

Consensus building is as important as technical analysis in ATAM. When stakeholders with conflicting priorities agree on which risks matter most, the resulting evaluation findings have organizational legitimacy that drives action rather than debate.

**Example:** Business and technical stakeholders initially disagree on whether availability or cost is the higher priority; through structured ATAM utility tree prioritization, they reach consensus that 99.9% availability justifies a 30% infrastructure cost increase.

#### ATAM Definition

A method for evaluating software architectures relative to quality attribute goals by eliciting architectural decisions, analyzing their consequences using quality attribute scenarios, and identifying risks, non-risks, sensitivity points, and tradeoffs before full implementation.

ATAM (Architecture Tradeoff Analysis Method) was developed at the Carnegie Mellon Software Engineering Institute and is the most widely adopted formal method for architecture evaluation in practice. Its value lies in surfacing architectural risks early, when they are least expensive to address.

**Example:** An ATAM evaluation of a proposed logistics management system over two days with eight stakeholder groups identifies three high-priority risks related to database synchronization under network partition, enabling the architecture team to redesign before development begins.

#### ATAM Facilitation Techniques

The specific methods and practices used by the ATAM evaluation leader to manage group dynamics, elicit participation from all stakeholders, resolve conflicts, maintain focus on architectural analysis, and ensure productive use of limited evaluation time.

Effective facilitation separates successful ATAM evaluations from unproductive ones. Without skilled facilitation, evaluations devolve into debates about requirements, feature discussions, or technical arguments that do not advance the evaluation's analytical goals.

**Example:** The evaluation leader uses round-robin questioning during scenario brainstorming to ensure quiet stakeholders contribute scenarios, preventing the session from being dominated by the most vocal participants and missing important business-domain scenarios.

#### ATAM Goals and Principles

The foundational objectives and guiding values of the Architecture Tradeoff Analysis Method, including eliciting risks early, making tradeoffs explicit, engaging all relevant stakeholders, and producing actionable findings within a structured two-phase process.

The goals and principles of ATAM distinguish it from informal reviews. By explicitly seeking tradeoffs and risks rather than validating the architecture, ATAM creates a psychologically safe environment for surfacing problems before they become expensive.

**Example:** A key ATAM principle is that the evaluation team does not prescribe solutions — they identify risks and tradeoffs and leave architectural decisions to the architecture team, preserving design authority while improving decision quality.

#### ATAM Origins at CMU SEI

The historical development of the Architecture Tradeoff Analysis Method at the Carnegie Mellon University Software Engineering Institute during the 1990s, growing from earlier work on SAAM and published in definitive form by Bass, Clements, and Kazman.

Understanding ATAM's origins provides context for its design choices, which reflect lessons learned from SAAM evaluations and practical experience with large government and commercial software projects. The method's credibility derives partly from its research pedigree and documented case studies.

**Example:** ATAM was formalized and published by Kazman, Klein, and Clements in a 1998 CMU SEI technical report and later refined in the book "Software Architecture in Practice," now in its fourth edition.

#### ATAM Outputs Summary

The complete set of artifacts produced by an ATAM evaluation, including the prioritized utility tree, a documented set of risks and non-risks categorized into risk themes, identified sensitivity points and tradeoff points, and the final evaluation report with recommendations.

Understanding the full set of ATAM outputs helps teams plan evaluations effectively and communicate the value of the method to organizational sponsors. Each output type serves a different purpose in communicating evaluation findings.

**Example:** The ATAM outputs for a cloud migration project include a utility tree with 30 prioritized scenarios, 12 identified risks grouped into 3 risk themes (data consistency, network resilience, and security boundaries), 5 sensitivity points, 4 tradeoff points, and a 40-page evaluation report.

#### ATAM Phase 1

The first of two main evaluation phases in ATAM, conducted with the evaluation team and architecture team only, focused on presenting the architecture, eliciting quality attribute scenarios, and performing initial analysis of architectural approaches against those scenarios.

Phase 1 establishes the analytical foundation for the full evaluation. By working through architectural approaches and scenarios with a smaller group, the evaluation team develops sufficient understanding to facilitate effective stakeholder workshops in Phase 2.

**Example:** During ATAM Phase 1, the evaluation team works with the lead architect over two days to map the architecture's use of caching tactics against performance scenarios, identifying that the cache invalidation strategy is a sensitivity point for consistency.

#### ATAM Phase 1 Activities

The specific tasks performed during the first phase of an ATAM evaluation, including presenting ATAM to participants, presenting business drivers, presenting the architecture, identifying architectural approaches, and constructing the utility tree with initial scenario analysis.

Phase 1 activities are designed to move systematically from context (business drivers) through structure (architecture) to analysis (scenario mapping), building a shared understanding before the larger stakeholder community joins in Phase 2.

**Example:** ATAM Phase 1 activities for a healthcare data platform include: the evaluation leader presenting the ATAM method, the product manager presenting business drivers, the architect presenting the architecture, and the team jointly constructing a utility tree with 24 scenarios across five quality attributes.

#### ATAM Phase 2

The second main evaluation phase in ATAM, in which the broader stakeholder community participates in scenario brainstorming and prioritization, reviews Phase 1 findings, and collaborates on producing the final prioritized list of risks, non-risks, sensitivity points, and tradeoffs.

Phase 2 validates Phase 1 findings against the full stakeholder community's knowledge and ensures that business priorities are reflected in the evaluation conclusions. Stakeholder participation also builds organizational buy-in for addressing identified risks.

**Example:** In ATAM Phase 2, operations stakeholders add three availability scenarios not identified in Phase 1, two of which elevate a previously low-priority risk about database failover time to high priority given the business impact of downtime.

#### ATAM Phase 2 Activities

The specific tasks performed during the second phase of an ATAM evaluation, including presenting Phase 1 results to a broader audience, conducting stakeholder scenario brainstorming, prioritizing all scenarios, and producing the consolidated findings with risks, non-risks, sensitivity points, and tradeoffs.

Phase 2 activities validate and extend Phase 1 findings with the full stakeholder community's input. The scenario brainstorming session often surfaces concerns that the evaluation team and architecture team did not anticipate, improving the evaluation's completeness.

**Example:** ATAM Phase 2 activities for a logistics system include presenting the utility tree to 15 stakeholders, running a 90-minute brainstorming session that generates 18 additional scenarios, prioritizing all 42 scenarios by vote, and analyzing the top 10 against architectural approaches.

#### ATAM Preparation Phase

The set of activities conducted before the formal ATAM evaluation sessions begin, including planning the evaluation, assembling the team, gathering architecture documentation, preparing briefing materials, and scheduling participant availability.

Adequate preparation is essential to evaluation efficiency. ATAM sessions are expensive because they gather many busy stakeholders; thorough preparation ensures that session time is spent on analysis rather than orientation and logistics.

**Example:** ATAM preparation for a two-week evaluation includes three weeks of advance work: collecting architecture documents, conducting pre-briefings with the architecture team, preparing scenario templates, and confirming attendance of all required stakeholder groups.

#### ATAM Scripted Presentations

Structured, pre-planned presentations delivered by specific participants at defined points in the ATAM process, designed to ensure all necessary context is communicated consistently and efficiently before analysis activities begin.

Scripted presentations ensure that all evaluation participants share a common understanding of the system, its business context, and the ATAM method itself before analytical discussions begin. Unscripted or incomplete presentations often result in time-wasting clarification loops during analysis.

**Example:** The scripted presentations in an ATAM session follow a fixed order: ATAM overview (evaluation leader), business drivers (project manager), architecture overview (lead architect), and architectural approaches (architect), each with a defined time budget.

#### ATAM Team Formation

The process of identifying, selecting, and assembling the individuals who will comprise the ATAM evaluation team, ensuring that the team collectively possesses the domain knowledge, architectural expertise, facilitation skills, and stakeholder representation needed for an effective evaluation.

Team formation decisions directly determine what the evaluation can and cannot find. A team without operations expertise will likely miss operational risk; a team without business stakeholders will lack the business context needed to prioritize findings correctly.

**Example:** An ATAM team formed for a cloud migration evaluation includes the evaluation leader (architecture expert), two solution architects, a network security specialist, a DevOps engineer, a product owner, and a representative from the business operations group.

#### ATAM vs SAAM Comparison

The analytical comparison of the Architecture Tradeoff Analysis Method with its predecessor, the Software Architecture Analysis Method, highlighting ATAM's extension of SAAM with explicit tradeoff analysis, quality attribute scenarios, and a structured two-phase process.

Understanding the ATAM-SAAM relationship helps practitioners appreciate why ATAM was developed. SAAM established the foundation of scenario-based architecture evaluation; ATAM refined it by adding the utility tree, explicit tradeoff identification, and a more rigorous stakeholder engagement process.

**Example:** While SAAM uses scenarios primarily to test functional changeability, ATAM uses a broader range of quality attribute scenarios organized in a utility tree to evaluate multiple quality attributes simultaneously and identify tradeoffs among them.

#### Attack Surface Reduction

The security architecture practice of minimizing the set of software components, interfaces, and data paths that are accessible to potential attackers, reducing the number of potential attack vectors that the security architecture must defend.

Attack surface reduction is a security prevention tactic that ATAM evaluates through security scenarios. Reducing the attack surface by disabling unnecessary features, closing unused ports, and removing unnecessary components decreases the probability that any given attack succeeds.

**Example:** An attack surface reduction strategy for a backend service disables all HTTP methods except GET and POST, removes administrative endpoints from the public API surface, and restricts database access to only the specific tables and operations required by the service's business logic.

#### Authentication Architecture

The structural design of how a software system verifies the claimed identity of users, services, and devices attempting to access its resources, including the choice of authentication mechanisms, credential management, and multi-factor verification capabilities.

Authentication architecture is a critical security concern in ATAM because authentication failures represent the most common pathway to unauthorized access. ATAM evaluations examine authentication architectures for resistance to credential theft, brute force, and session hijacking scenarios.

**Example:** An authentication architecture for a financial application combines username/password with TOTP-based multi-factor authentication, implements account lockout after five failed attempts, and issues short-lived JWT access tokens with refresh token rotation to limit the impact of credential compromise.

#### Authorization Architecture

The structural design of how a software system determines whether an authenticated identity is permitted to perform a requested operation on a specific resource, including role-based access control, attribute-based access control, and policy enforcement mechanisms.

Authorization architecture determines what authenticated users and services can do, not just who they are. ATAM evaluations examine authorization architectures for the scenarios where privilege escalation, horizontal access across tenants, or excessive permissions create unacceptable security risks.

**Example:** An authorization architecture using attribute-based access control evaluates each API request against a policy that considers the caller's role, the resource's classification, the operation requested, and the calling context, enforcing fine-grained access control beyond simple role checks.

#### Auto-Scaling Architecture

An architectural capability in which the number of running service instances automatically increases during high-demand periods and decreases during low-demand periods, based on metrics such as CPU utilization, request queue depth, or custom business metrics.

Auto-scaling is a key scalability and cost optimization tactic in cloud architectures. ATAM evaluations examine auto-scaling designs for the latency between demand increase and capacity addition (scale-out lag), the risk of over-scaling (cost), and the stability of scaling decisions.

**Example:** An auto-scaling policy for an API service adds instances when average CPU exceeds 70% for three consecutive minutes and removes instances when CPU falls below 30% for ten minutes, with a minimum of three instances to ensure availability during scale-in.

#### Autonomous System Architecture

The structural design of a software system capable of perceiving its environment, reasoning about its state, making decisions, and taking actions without continuous human supervision, incorporating components for sensing, perception, planning, execution, and safety monitoring.

Autonomous system architecture introduces safety as an overriding quality attribute concern alongside performance (real-time decision-making) and reliability (failure-safe behavior). ATAM evaluations of autonomous systems treat safety scenarios as hard constraints that override all other quality attribute tradeoffs.

**Example:** An autonomous vehicle architecture separates perception (sensor fusion), planning (path computation), execution (actuator control), and safety monitoring (emergency stop) into isolated components with redundant communication paths, ensuring that a failure in the planning component triggers safe emergency stop behavior.

#### Availability Calculation

The computation of a software system's availability from its Mean Time Between Failures and Mean Time to Recovery, expressed as a percentage representing the proportion of time the system is operational, used to verify that the architecture meets availability quality attribute targets.

Availability calculations translate ATAM availability scenario response measures into verifiable system requirements. The formula A = MTBF / (MTBF + MTTR) enables architects to quantitatively assess whether their fault detection and recovery designs achieve the required availability percentage.

**Example:** A system with MTBF of 10,000 hours and MTTR of 1 hour has availability of 10,000 / (10,000 + 1) = 99.99%, exactly meeting the "four nines" availability requirement specified in the ATAM utility tree's availability scenario.

#### Availability Quality Attribute

The quality attribute characterizing a software system's ability to be operational and accessible when required, measured as the proportion of time the system is in a functioning state relative to total required operating time.

Achieving high availability requires architectural decisions about redundancy, failover, and fault detection that interact with and constrain decisions for other quality attributes. ATAM evaluations use failure scenarios to probe availability architecture depth.

**Example:** An availability scenario for a 911 dispatch system specifies that the system remains operational within 30 seconds of any single hardware failure, achieving 99.999% annual availability (approximately 5 minutes of downtime per year).

#### Availability Scenario

A quality attribute scenario that specifies the system's required response to a fault, failure, or disruption in terms of detection time, recovery time, and post-recovery behavior, used to evaluate whether availability mechanisms are adequate.

Availability scenarios expose gaps in fault detection, isolation, and recovery. The ATAM evaluation maps each scenario's required response measure against the architectural mechanisms responsible for detection and recovery, identifying where timing requirements cannot be met.

**Example:** An availability scenario specifies that when a cloud availability zone fails, the system automatically reroutes all traffic to the surviving zone and resumes full service within 120 seconds without manual intervention.

#### Availability Tactic

An architectural decision aimed at preventing, detecting, or recovering from faults in a software system to maintain the specified level of operational continuity, categorized into fault prevention, fault detection, and fault recovery sub-categories.

Availability tactics are organized into a hierarchy that ATAM evaluators use to systematically assess whether an architecture has adequate mechanisms at each stage of the fault lifecycle: preventing faults from occurring, detecting faults quickly, and recovering from faults automatically.

**Example:** A combination of availability tactics — heartbeat monitoring (detection), active redundancy (recovery), and removal from service (prevention) — provides layered fault handling that ATAM evaluates against specific availability scenario response time requirements.

#### Backward Compatibility

The property of an updated software component or API by which existing consumers continue to function correctly without modification when the component is upgraded, because the update adds capabilities without removing or changing existing interface behaviors.

Backward compatibility is a specific modifiability goal that constrains how services can evolve. ATAM evaluations examine the architecture's mechanisms for ensuring backward compatibility — such as versioning policies and consumer contract testing — against modifiability scenarios.

**Example:** An API maintains backward compatibility by adding new optional fields to JSON responses rather than replacing existing fields, ensuring that consumers that ignore unknown fields continue to work correctly after the API update.

#### Batch Processing Architecture

An architectural approach in which large volumes of data are accumulated and processed together as a single unit at scheduled intervals, optimizing throughput by processing data in bulk rather than responding to individual records as they arrive.

Batch processing provides high throughput at the cost of processing latency (data is not available until the batch completes). ATAM evaluations examine batch processing architectures for the scenarios where batch job failure delays time-sensitive downstream processes or creates data consistency gaps.

**Example:** A nightly batch processing job aggregates 24 hours of transaction data from thousands of accounts, computes account summaries, and updates the reporting database by 6 AM, enabling business analysts to start their day with complete previous-day data.

#### Blue-Green Deployment

A deployment strategy in which two identical production environments (blue and green) are maintained, with one serving live traffic while the other is updated; traffic is switched to the updated environment only after validation, enabling instant rollback by switching traffic back.

Blue-green deployment is a deployability tactic that achieves zero-downtime updates and rapid rollback. ATAM evaluations examine blue-green designs for the cost of maintaining duplicate production environments and the synchronization of database state between environments.

**Example:** A blue-green deployment switches 100% of user traffic from the current "blue" application version to the newly deployed "green" version in seconds by updating a load balancer rule; if errors increase after the switch, traffic reverts to blue by reverting the rule change.

#### Bounded Context

A DDD architectural boundary within which a specific domain model applies, with explicit interfaces for communicating with other bounded contexts, preventing the ambiguity and coupling that arises when a single model attempts to serve multiple distinct subdomains.

Bounded contexts are the DDD mechanism for managing model complexity and team autonomy. ATAM evaluations examine how bounded context boundaries are enforced architecturally — through separate databases, API contracts, or anti-corruption layers — and whether the boundaries align with expected change directions.

**Example:** In a healthcare platform, the "Patient Registration" and "Clinical Care" bounded contexts have separate patient data models; the Clinical Care context receives patient demographics through a published API rather than sharing the Registration database.

#### Broker Architecture Pattern

An architectural pattern in which a broker component mediates communication between clients and servers, handling service registration, lookup, routing, and load distribution, decoupling service consumers from service providers.

The broker pattern enables service discovery and load balancing but introduces the broker itself as a potential performance bottleneck and single point of failure. ATAM evaluations examine broker-based architectures for availability (broker failure) and performance (broker throughput) scenarios.

**Example:** A message broker in a financial system routes transaction requests from client applications to available processing services, enabling clients to remain unaware of which specific server handles each request while the broker manages load distribution.

#### Bulkhead Pattern

A fault isolation pattern in which computational resources (thread pools, connection pools, semaphores) are partitioned into separate groups for different types of work, so that excessive resource consumption in one area cannot exhaust resources needed for other areas.

The bulkhead pattern prevents a single overloaded or failing service from consuming all available resources and starving other services in the same process. ATAM evaluations examine bulkhead configurations against availability scenarios where one service category degrades but others must remain functional.

**Example:** An API gateway allocates separate thread pools for search requests (20 threads) and checkout requests (40 threads) using the bulkhead pattern, ensuring that a spike in search traffic cannot exhaust the threads needed to process payment requests.

#### Business Driver

A specific business condition, market pressure, regulatory requirement, competitive dynamic, or organizational imperative that motivates the development of a software system and shapes its architectural requirements.

Business drivers translate business goals into specific demands on the architecture. ATAM evaluators use business drivers to understand why particular quality attributes are prioritized and to assess whether architectural decisions appropriately respond to those drivers.

**Example:** The business driver "regulatory compliance with GDPR by Q3" drives architectural decisions about data residency, encryption, and user data deletion capabilities, which ATAM evaluates against specific security and compliance scenarios.

#### Business Goal

A high-level statement of a desired organizational outcome or strategic objective that the software system being evaluated is intended to support, expressed in business terms rather than technical requirements.

Business goals are the ultimate context for ATAM evaluations. Quality attribute priorities are only meaningful relative to the business goals they serve; an evaluation that does not anchor analysis to business goals may optimize for the wrong quality attributes.

**Example:** A business goal for a retail platform might be "increase online revenue by 40% within 12 months," which drives architectural decisions about scalability (to handle increased load), availability (to prevent lost sales), and performance (to reduce cart abandonment).

#### Business Stakeholder

An individual who represents the organizational, market, or customer interests in a software system, such as a product manager, business owner, customer representative, or executive sponsor, who participates in ATAM to articulate business goals and priorities.

Business stakeholders are essential to ATAM because they provide the business context that determines which quality attributes matter most and what risks are acceptable. Without business stakeholder participation, evaluations may produce technically correct but organizationally irrelevant findings.

**Example:** A business stakeholder representing the customer success team reveals that customers tolerate up to 30 seconds of processing time for report generation but expect sub-second response for transaction confirmation, providing critical data for scenario prioritization.

#### Business-Architecture Alignment

The condition in which a software system's architectural decisions, quality attribute priorities, and structural choices are consistent with and supportive of the organization's business goals, strategies, and operational requirements.

Business-architecture alignment is a fundamental outcome ATAM seeks to verify. Architectural decisions made without reference to business goals may optimize for technically interesting properties that do not serve the organization's actual needs.

**Example:** An ATAM evaluation verifies that the architecture's prioritization of modifiability aligns with the business goal of "launching new product features every two weeks," confirming that the CI/CD pipeline and microservice decomposition support rapid release cycles.

#### Caching Tactic

An architectural performance tactic in which computed results, fetched data, or rendered content are stored in a fast-access storage layer and reused for subsequent requests with the same input, reducing response time and backend system load.

Caching is one of the most commonly applied performance tactics, but it introduces consistency risks when cached data becomes stale. ATAM evaluations examine caching architectures for the tradeoff between performance (cache hit rate) and consistency (cache invalidation policy).

**Example:** An e-commerce product catalog caches item details in Redis for 60 seconds, reducing database queries by 80% during peak load, but requiring careful cache invalidation when prices change to avoid displaying stale prices to customers.

#### Canary Release Strategy

A deployment strategy in which a new version of a service is deployed to a small subset of users or servers initially, with traffic gradually shifted to the new version as confidence in its correctness grows, enabling early detection of problems with limited blast radius.

Canary releases reduce deployment risk by exposing new versions to a small fraction of users before full rollout. ATAM evaluations examine canary release designs for the metrics used to determine canary health and the automation of rollback when health metrics degrade.

**Example:** A canary release deploys a new recommendation algorithm to 5% of users; if click-through rates and error rates remain within baseline thresholds after 30 minutes, traffic is gradually increased to 25%, 50%, and 100% over the following hour.

#### CAP Theorem

The theoretical result stating that a distributed data system can simultaneously provide at most two of the three guarantees: Consistency (all nodes see the same data at the same time), Availability (every request receives a response), and Partition tolerance (the system operates despite network partitions).

CAP theorem is a fundamental analytical framework for evaluating distributed system architectures in ATAM. The theorem forces explicit decisions about which guarantees to sacrifice during network partitions, and ATAM evaluations examine whether the architecture's choices align with stakeholder quality attribute priorities.

**Example:** An ATAM evaluation uses CAP theorem to examine a distributed database's behavior during a network partition scenario: a CP system maintains consistency but becomes unavailable; an AP system remains available but may return stale data — both are explicit quality attribute tradeoffs.

#### Capacity Planning

The architectural and operational process of determining what resources — computing, memory, storage, network — are required to satisfy the system's current and projected workload while maintaining the performance and availability quality attribute goals.

Capacity planning translates ATAM performance and scalability scenarios into resource requirements. Without capacity planning grounded in quality attribute scenarios, systems are either under-provisioned (failing performance scenarios) or over-provisioned (failing cost efficiency).

**Example:** Capacity planning for a video streaming service calculates that serving 500,000 concurrent streams at 4K bitrate requires 450 Gbps of network bandwidth, 2,000 CPU cores for transcoding, and 500 TB of hot storage, translating performance scenarios into specific infrastructure investments.

#### CDN Architecture

A Content Delivery Network architecture in which static and dynamic content is cached and served from geographically distributed edge servers close to end users, reducing latency by minimizing the physical distance data must travel between server and client.

CDN architecture is a performance tactic that dramatically improves response time and availability for geographically distributed users by reducing network transit time. ATAM evaluations examine CDN designs for cache invalidation strategies and behavior when the CDN is unavailable.

**Example:** A CDN caches product images and static web assets at 150 edge locations worldwide, reducing the response time for image requests from international users from 400ms (origin server) to under 30ms (nearest edge), directly satisfying the mobile user performance scenario.

#### Chaos Engineering

A practice of deliberately introducing controlled failures into production or production-like systems to identify resilience weaknesses, verify that failure recovery mechanisms operate correctly, and build confidence in the system's availability architecture.

Chaos engineering is a testing tactic that validates availability architecture after ATAM evaluations have identified the required resilience properties. It provides empirical evidence that identified non-risks are genuinely sound by observing actual system behavior under failure conditions.

**Example:** A chaos engineering experiment terminates a random application server instance every hour in production; if the health check and auto-scaling mechanisms work as expected, the system recovers within the 60-second SLO, validating the availability architecture.

#### Circuit Breaker Pattern

A fault tolerance pattern in which a software component monitors calls to a dependency and, when the failure rate exceeds a threshold, opens the circuit to stop forwarding calls temporarily, preventing cascading failure propagation through a distributed system.

The circuit breaker pattern is essential in microservices architectures where a slow or failing dependency can exhaust connection pools and thread resources in calling services. ATAM evaluations examine circuit breaker designs for the tradeoff between resilience (fast fail) and availability (partial degradation behavior).

**Example:** An API gateway implements circuit breakers for each downstream service; when the inventory service fails, the circuit opens and returns cached inventory data for 30 seconds, preventing the failure from cascading to affect order placement.

#### Clean Architecture Pattern

An architectural style that organizes software into concentric dependency layers — entities, use cases, interface adapters, and frameworks — with a strict inward dependency rule ensuring that inner layers are unaware of outer layers.

Clean architecture promotes independence from frameworks, databases, and UI, improving testability and flexibility. ATAM evaluations examine clean architecture implementations for modifiability (the ability to swap outer-layer implementations) and performance (the overhead of multiple transformation layers).

**Example:** In a clean architecture implementation, the "Process Payment" use case is expressed in terms of payment abstractions; a Stripe adapter and a PayPal adapter both implement the payment port interface, enabling provider switching without modifying use case logic.

#### Client-Server Architecture

An architectural style in which client components request services from server components through defined interfaces, with the server providing shared resources or capabilities to multiple clients without knowing clients' identity or state.

Client-server architecture is one of the most widely deployed architectural styles. ATAM evaluations examine client-server designs for performance (server bottlenecks), availability (single server as a point of failure), and security (authentication and authorization mechanisms).

**Example:** A three-tier client-server architecture for a hospital information system places a web client, application server, and database server in distinct tiers, enabling separate scaling of each tier as an availability and performance tactic.

#### Cloud Cost Optimization

The architectural practice of designing cloud-based systems to minimize unnecessary resource consumption and spending through right-sizing, auto-scaling, spot instance usage, storage tiering, and elimination of idle resources, without compromising required quality attributes.

Cloud cost is an architectural quality attribute that ATAM evaluations increasingly include as a constraint or driver. Cost optimization tactics frequently create tradeoffs with performance (smaller instances), availability (spot instance interruptions), and operational simplicity (tiered storage management).

**Example:** Replacing always-on application servers with auto-scaled instances reduces cloud costs by 60% during off-peak hours but introduces auto-scaling latency as a sensitivity point for the performance scenario of handling sudden traffic spikes.

#### Cloud Observability

The capability of a cloud-based software system to expose sufficient internal state information — through metrics, logs, and distributed traces — that operators can understand the system's behavior, diagnose problems, and predict issues before they become outages.

Cloud observability is an operational quality attribute that enables effective reliability management. ATAM evaluations examine observability architectures for the completeness of metrics coverage, the cost of storing telemetry data, and the ability to diagnose failure scenarios identified in the utility tree.

**Example:** A cloud observability architecture emits application metrics to a managed metrics service, structured logs to a log aggregation service, and distributed traces to a tracing backend, providing three correlated data sources for diagnosing any of the failure scenarios in the utility tree.

#### Cloud Resilience Patterns

A collection of architectural patterns for achieving high availability and fault tolerance specifically in cloud environments, including multi-region active-active deployment, managed load balancing, health check-based failover, and infrastructure auto-healing.

Cloud resilience patterns are the implementation-level realization of availability tactics in cloud contexts. ATAM evaluations examine whether cloud resilience patterns are correctly configured and whether they cover the failure scenarios defined in the utility tree's availability branch.

**Example:** A cloud resilience pattern deploys identical application stacks in three availability zones behind a managed load balancer; if health checks detect a zone failure, traffic is automatically redistributed to the remaining healthy zones within 30 seconds.

#### Cloud Security Architecture

The collection of architectural decisions, patterns, and controls that protect cloud-based systems from unauthorized access, data breaches, and service disruptions, including identity management, network segmentation, encryption, secret management, and compliance controls.

Cloud security architecture is a specialized domain that ATAM evaluations examine through security scenarios. Cloud environments introduce specific security concerns — shared responsibility models, IAM configuration, and internet-exposed APIs — that differ from on-premises security architectures.

**Example:** A cloud security architecture implements VPC isolation between environments, IAM roles with least-privilege permissions for each service, KMS-encrypted secrets stored in a managed vault, and CloudTrail logging of all API calls for security audit purposes.

#### Cloud Service Models

The classification of cloud computing services into Infrastructure as a Service (IaaS, providing raw compute/storage/network), Platform as a Service (PaaS, providing managed runtime environments), and Software as a Service (SaaS, providing complete applications), each representing different levels of management responsibility.

The choice of cloud service model is an architectural decision that trades operational control for management convenience. ATAM evaluations examine cloud service model selections for vendor lock-in risk, performance customization capability, and operational complexity.

**Example:** Choosing a managed PostgreSQL service (PaaS) over self-managed PostgreSQL on VMs (IaaS) shifts patching, backup, and replication management to the cloud provider, trading customization flexibility for reduced operational burden.

#### Cloud Vendor Lock-in

The architectural risk that a system's dependence on proprietary cloud provider services, APIs, or data formats makes it technically or economically impractical to migrate to a different cloud provider or on-premises environment.

Vendor lock-in is an architectural risk that ATAM evaluations explicitly surface when systems use proprietary cloud services. The risk must be weighed against the productivity and capability benefits those services provide, making it a classic ATAM tradeoff point.

**Example:** Using a cloud provider's proprietary event streaming service instead of open-source Kafka creates vendor lock-in risk; migrating to a different provider would require replacing the event streaming infrastructure, potentially requiring significant application code changes.

#### Cloud-Native Architecture

An architectural approach optimized for cloud computing environments, characterized by containerization, microservices decomposition, dynamic orchestration, declarative infrastructure, and design for resilience, scalability, and operational automation at scale.

Cloud-native architecture is increasingly the default context for ATAM evaluations of new systems. The cloud-native approach shifts architectural decisions toward infrastructure-as-code, auto-scaling, and managed services, which changes the sensitivity and tradeoff landscape compared to on-premises architectures.

**Example:** A cloud-native architecture for a media streaming service uses containerized microservices orchestrated by Kubernetes, with auto-scaling based on viewer concurrency metrics, enabling the system to scale from 1,000 to 1,000,000 viewers without manual intervention.

#### Competing Stakeholder Priorities

The condition in which different stakeholder groups assign conflicting importance to different quality attributes or have mutually exclusive requirements, requiring explicit negotiation and tradeoff decisions rather than satisfying all parties simultaneously.

ATAM is specifically designed to surface and resolve competing priorities through structured dialogue and scenario prioritization. Making competing priorities explicit enables rational tradeoff decisions rather than allowing hidden conflicts to undermine the architecture.

**Example:** Competing priorities between the development team (favoring rapid modifiability) and the operations team (favoring stability and predictability) are surfaced in ATAM scenario prioritization, leading to an explicit architectural decision to use feature flags rather than frequent deployments.

#### Component Decomposition

The process of dividing a software system or subsystem into smaller, more manageable components with defined responsibilities and interfaces, guided by principles such as separation of concerns, high cohesion, and loose coupling.

Component decomposition is the fundamental structural decision evaluated in ATAM. The evaluation team examines whether the decomposition aligns with quality attribute goals — particularly modifiability (change isolation), testability (test isolation), and scalability (independent scaling).

**Example:** Decomposing a monolithic application into User Management, Product Catalog, Order Processing, and Notification components allows each to be scaled independently during load peaks and modified without affecting other components' behavior.

#### Concrete Scenario

A quality attribute scenario that specifies stimulus source, stimulus, environment, artifact, response, and response measure in terms specific to the particular software system being evaluated, derived by instantiating a general scenario with system-specific details.

Concrete scenarios are the analytical instruments used in ATAM utility tree construction. They are specific enough to be mapped to particular architectural decisions and evaluated against measurable acceptance criteria.

**Example:** Derived from a general availability scenario, a concrete scenario: "A network switch failure during daytime hours causes the lab results service to become unreachable; the system reroutes requests through the backup network path within 15 seconds."

#### Conflicting Quality Attributes

The condition in which two or more quality attributes cannot both be fully satisfied simultaneously by the same architectural decision, requiring the architecture to explicitly favor one attribute over another in specific design choices.

Conflicting quality attributes define the tradeoff landscape of software architecture. ATAM's primary analytical contribution is making these conflicts explicit and documented, enabling stakeholders to make informed tradeoff decisions rather than discovering conflicts after implementation.

**Example:** High availability (achieved through replication) conflicts with strong consistency (which requires synchronization across replicas) in a distributed database; the CAP theorem formalizes this conflict, and ATAM makes explicit which side the architecture favors.

#### Connection Pooling

A performance optimization technique in which a set of pre-established database or service connections is maintained and reused for multiple successive requests, eliminating the overhead of establishing new connections for each request.

Connection pooling is a resource management performance tactic that dramatically reduces database connection overhead. ATAM performance evaluations examine connection pool sizing as a sensitivity point — pools that are too small create queuing bottlenecks; pools that are too large exceed database connection limits.

**Example:** A connection pool of 20 database connections serves a service handling 500 concurrent requests; the pool limits simultaneous database connections while queuing excess requests, preventing the database from being overwhelmed by 500 simultaneous connection establishment attempts.

#### Container Architecture

An architectural approach in which application components and their dependencies are packaged as portable, isolated container images that run consistently across different execution environments, from developer laptops to production cloud infrastructure.

Containerization enables environment consistency and deployment portability but introduces container orchestration complexity. ATAM evaluations examine container architectures for the operational complexity of managing container lifecycle, networking, and storage in production environments.

**Example:** An application packaged as a container image with its dependencies includes the application binary, configuration templates, and health check scripts, running identically on a developer's laptop and a production Kubernetes cluster, eliminating environment-specific deployment failures.

#### Contract-First Design

An architectural API and integration design approach in which the interface contract — including operation signatures, data schemas, and quality attribute properties — is defined and agreed upon before any implementation begins, ensuring that implementations conform to the agreed contract.

Contract-first design is a modifiability and interoperability tactic that prevents the common problem of API contracts being defined post-hoc by reverse-engineering the implementation, leading to contracts that cannot support required evolution. ATAM evaluations examine contract-first practices for their alignment with modifiability scenarios.

**Example:** A contract-first design process defines an OpenAPI specification for a new payment API before any code is written; client teams develop against mock servers generated from the contract, and the implementation is validated against the contract using automated contract testing before deployment.

#### Cost of Architectural Mistakes

The cumulative economic and schedule impact of discovering and correcting a flawed architectural decision after implementation has begun, which increases exponentially as the system progresses through development and deployment stages.

This cost asymmetry is the primary economic justification for investing in methods like ATAM. A defect found during architecture review may cost hours to fix; the same defect found in production may require months of rearchitecting and data migration.

**Example:** A financial institution that chose a monolithic architecture for a high-transaction system discovered during stress testing that horizontal scaling was impossible, requiring a full rewrite estimated at 18 months of engineering effort.

#### Cost vs Reliability Tradeoff

The architectural tradeoff between the infrastructure cost of implementing high-reliability mechanisms — such as redundant components, multi-region deployment, and automated failover — and the business cost of accepting lower reliability and the associated risk of service outages.

This tradeoff is a recurring ATAM finding because reliability architecture is expensive. ATAM evaluations make the cost-reliability tradeoff explicit by quantifying the cost of achieving each reliability scenario and the business impact of accepting reduced reliability.

**Example:** Adding a third availability zone for a database cluster increases infrastructure cost by 50% but reduces the probability of a complete regional outage from 0.01% to 0.001% annually; ATAM surfaces this as a tradeoff for stakeholders to decide whether the additional cost is justified by the reduced risk.

#### CQRS Pattern

The Command Query Responsibility Segregation pattern, an architectural approach that separates read operations (queries) from write operations (commands) into distinct models with separate data stores, optimized independently for their respective access patterns.

CQRS improves read scalability and allows independent optimization of read and write sides but introduces complexity and eventual consistency challenges. ATAM evaluations examine CQRS designs for consistency scenarios and the operational complexity of maintaining two data models.

**Example:** In a CQRS implementation for a logistics system, write commands update a normalized operational database while read queries access a denormalized read replica optimized for the dashboard's complex reporting queries.

#### Data Governance Architecture

The structural design of components, processes, and policies that manage the availability, integrity, security, and appropriate use of data assets within an organization, including data cataloging, lineage tracking, access control, quality management, and compliance enforcement.

Data governance architecture ensures that data consumed by AI systems and analytics is trustworthy, correctly understood, and appropriately protected. ATAM evaluations examine data governance architectures for the scenarios where ungoverned data use creates regulatory compliance or data quality risks.

**Example:** A data governance architecture requires that every dataset used for ML training be registered in a data catalog with documented provenance, quality metrics, and privacy classification before it can be used in model training, preventing models from being trained on improperly classified or low-quality data.

#### Data Lakehouse Architecture

An architectural data storage and processing approach that combines the cost efficiency and scalability of a data lake (raw storage of all data) with the data management and query performance features of a data warehouse (schema enforcement, ACID transactions, query optimization).

The data lakehouse pattern addresses the limitations of having separate data lakes and data warehouses by unifying them in a single architecture. ATAM evaluations examine lakehouse architectures for the performance scenarios where query response times meet analytical workload requirements.

**Example:** A data lakehouse stores raw event data in a cloud object store and applies a table format (Delta Lake or Iceberg) that adds ACID transactions, schema evolution, and time-travel queries, enabling both raw data exploration and governed analytical queries from the same data layer.

#### Data Mesh Architecture

A decentralized data architecture approach in which data ownership and data product creation are distributed to domain teams rather than centralized in a data platform team, with each domain treating its data as a product with a defined interface, quality standards, and SLO.

Data mesh addresses the scalability limitations of centralized data architectures by applying domain-driven decomposition principles to data. ATAM evaluations of data mesh architectures examine the interoperability scenarios where data consumers need to integrate data from multiple domains.

**Example:** In a data mesh architecture, the Orders domain team publishes a "customer order history" data product with a defined schema, freshness SLO (updated within 1 hour), and access API; the Recommendations domain consumes it without needing to know how it is produced.

#### Data Pipeline Architecture

The structural design of components that ingest raw data from multiple sources, transform it through cleaning, validation, and enrichment stages, and deliver processed data to downstream consumers such as databases, data warehouses, ML training systems, and analytics platforms.

Data pipeline architecture determines the reliability and freshness of data available to all downstream systems. ATAM evaluations examine data pipeline architectures for the scenarios where pipeline failure delays or corrupts data, affecting the quality attributes of all systems that depend on pipeline output.

**Example:** A data pipeline architecture ingests clickstream events from web and mobile applications, validates event schema and completeness, joins with user profile data, and delivers enriched events to both a real-time analytics store and a daily batch training dataset.

#### Database per Service Pattern

A microservices data architecture pattern in which each service owns and manages its own independent database, with no other service having direct access to that database, ensuring that services can independently evolve their data schemas.

The database-per-service pattern enforces data encapsulation at the service level, improving modifiability (schema changes are local) but complicating cross-service queries and requiring explicit mechanisms for maintaining consistency across service boundaries.

**Example:** In a database-per-service architecture, the Order Service manages an order database and the Inventory Service manages an inventory database; the Order Service cannot directly query the inventory table and must call the Inventory Service API to check stock levels.

#### Database Sharding

A horizontal scaling technique in which a database is partitioned into multiple shards, each holding a subset of the data defined by a sharding key, with each shard managed independently on separate database instances to distribute query load and data storage.

Database sharding enables databases to scale beyond single-instance limits but introduces complexity in cross-shard queries, shard rebalancing, and transaction management. ATAM scalability evaluations examine sharding designs for the scenarios where data access patterns require cross-shard operations.

**Example:** A user database sharded by geographic region distributes user records across five regional shards; queries for users in each region hit only the relevant shard, reducing per-shard load, but cross-region analytics queries must aggregate from all five shards, introducing query complexity.

#### Decision-Making Authority

The formal or informal power held by specific individuals or groups to make binding architectural decisions, including the authority to accept identified risks, allocate resources for risk mitigation, and override technical recommendations.

Understanding decision-making authority is essential for ATAM to be effective. Evaluation findings must be directed to individuals with the authority to act on them. Presenting architectural risks only to technical teams that lack authority to address them limits the evaluation's impact.

**Example:** An ATAM evaluation identifies a critical security risk requiring an architectural change that will delay the launch by three months; the decision-making authority to accept this risk and the delay belongs to the executive sponsor, not the engineering team.

#### Defense in Depth

A security architecture strategy in which multiple independent layers of security controls are applied so that an attacker who bypasses one layer still faces additional barriers, preventing any single security control failure from resulting in a complete security breach.

Defense in depth is the architectural strategy underlying most sound security architectures. ATAM evaluations examine whether security scenarios that involve a single control failure still result in acceptable outcomes because additional defense layers remain.

**Example:** A defense-in-depth architecture for customer data protection applies network firewall rules (perimeter), TLS encryption (transport), authentication (identity), authorization (access control), and encryption at rest (data protection) so that defeating any single control does not expose customer data.

#### Dependency Injection Pattern

An architectural and design pattern in which a component's dependencies are supplied by an external injector rather than instantiated internally, enabling the component to be tested or deployed with different dependency implementations without modification.

Dependency injection is a key enabling tactic for testability and portability architectures. ATAM evaluations examine whether the architecture's approach to dependency management supports the testability scenarios in the utility tree, particularly the ability to substitute mock implementations.

**Example:** A service class receives its database repository through constructor injection rather than creating it internally; test code injects a mock repository that returns controlled data, enabling unit testing without a live database connection.

#### Deployability Quality Attribute

The quality attribute characterizing the ease, speed, safety, and reliability with which a software system or component can be moved from development to production, including rollback capabilities.

Deployability has become an architectural driver as organizations adopt continuous delivery. ATAM evaluations examine deployability by analyzing whether decisions about service boundaries, data schemas, and configuration management support frequent safe deployments.

**Example:** A deployability scenario specifies that a new version of any microservice is deployable to production within 15 minutes of a successful build, with automatic rollback if health checks fail within 5 minutes of deployment.

#### Design Rationale

The documented explanation of why a specific architectural decision was made, including the alternatives considered, the criteria used to evaluate them, the quality attribute tradeoffs accepted, and the assumptions underlying the choice.

Design rationale provides essential context for ATAM evaluations and post-evaluation architectural reasoning. Without rationale documentation, architects cannot distinguish intentional tradeoffs from oversights, making it difficult to evaluate whether a decision is appropriate or a risk.

**Example:** Design rationale for choosing synchronous REST communication over asynchronous messaging explains that the system requires immediate consistency feedback to the user, accepts higher coupling as a consequence, and notes the assumption that response times will remain under 500ms.

#### Difficulty Rating

An assessment of how challenging it is for the architecture to satisfy a quality attribute scenario, reflecting the complexity of required mechanisms, degree of conflict with other quality attributes, and the team's confidence in the proposed solution.

The difficulty rating, combined with importance, drives ATAM analysis depth. Scenarios rated High importance and High difficulty (HH) represent the evaluation's primary focus because they are critical to success and uncertain in their architectural achievability.

**Example:** A scenario requiring sub-10ms database query response for complex multi-table joins under heavy load is rated High difficulty because achieving it requires careful schema design, indexing, and caching decisions that interact with the modifiability architecture.

#### Disaster Recovery

The capability of a software system to restore normal operation after a catastrophic failure event — such as a datacenter loss, ransomware attack, or major hardware failure — within defined time objectives and with acceptable data loss.

Disaster recovery architecture is an extreme availability scenario examined in ATAM evaluations for mission-critical systems. The architecture must provide not only the technical mechanisms for recovery but also the operational procedures and regular testing to ensure recovery capabilities work when needed.

**Example:** A disaster recovery architecture for a banking core system maintains a hot standby datacenter with synchronous database replication; annual disaster recovery exercises validate that the complete failover procedure, including DNS switching and application reconfiguration, completes within the 4-hour RTO.

#### Distributed System Architecture

An architectural style in which components of a software system are deployed on separate networked computers that coordinate through message passing to appear to users as a single coherent system.

Distributed systems introduce a class of architectural challenges — network failure, partial failure, consistency, ordering — that do not exist in single-machine systems. ATAM evaluations of distributed architectures specifically probe for risks related to these distributed systems properties.

**Example:** A distributed order management system deploys inventory, pricing, and order services on separate servers; ATAM evaluates whether the architecture correctly handles the scenario where the inventory service becomes temporarily unreachable during order submission.

#### Distributed Tracing

An observability capability in which a unique trace identifier is propagated through all components involved in processing a single request across a distributed system, enabling end-to-end request flow visualization, latency attribution, and error root cause identification.

Distributed tracing is essential for diagnosing performance and reliability issues in microservices architectures. ATAM evaluations examine whether the architecture has distributed tracing as a testability and maintainability tactic, particularly for diagnosing complex failure modes.

**Example:** A distributed trace for a checkout request shows that 380ms of the 500ms total response time is spent in the Payment Service's credit card validation call, enabling targeted performance optimization of the correct architectural component.

#### Distributed Transaction

A transaction that spans multiple separate databases or services, requiring coordination to ensure that either all participants commit the transaction successfully or all roll it back to maintain data consistency across distributed components.

Distributed transactions are among the most challenging reliability problems in distributed architectures. ATAM evaluations examine distributed transaction scenarios to determine whether the architecture provides adequate consistency guarantees and how it handles partial failure.

**Example:** An e-commerce checkout process involves a distributed transaction across the Order, Payment, and Inventory services; if Payment succeeds but Inventory reservation fails, the architecture must provide a mechanism to reverse the payment without leaving the order in an inconsistent state.

#### Docker Containerization

A specific container technology that packages applications into lightweight, portable containers using a layered filesystem, sharing the host OS kernel while providing process isolation, enabling consistent deployment across development, testing, and production environments.

Docker established container technology as a mainstream architectural tool. ATAM evaluations of Docker-based architectures examine image build reproducibility, container runtime security isolation, and the operational practices for managing container image supply chain security.

**Example:** A Docker image for a web service is built in CI/CD from a pinned base image and deterministic dependency installation, ensuring that the image deployed to production has identical binaries to the image tested in staging, addressing a deployability quality attribute scenario.

#### Domain-Driven Design

An approach to software architecture and design in which the structure, language, and logic of the software model reflect the business domain's concepts and rules, with architecture boundaries aligned to domain boundaries rather than technical concerns.

Domain-driven design provides principles for decomposing complex systems into bounded contexts that map to team and organizational structures. ATAM evaluations examine DDD-based architectures for the alignment of service boundaries with domain concepts and the management of cross-context dependencies.

**Example:** A DDD-based e-commerce platform defines separate bounded contexts for Catalog, Ordering, Payment, and Fulfillment, each with its own domain model and database, preventing cross-context dependencies that would undermine modifiability.

#### Edge AI Architecture

A deployment architecture in which machine learning model inference runs on computing devices at or near the data source — such as IoT devices, mobile phones, or edge servers — rather than in centralized cloud data centers, reducing inference latency and network bandwidth requirements.

Edge AI architecture addresses the performance and connectivity requirements of applications where cloud inference latency is unacceptable or where network connectivity is unreliable. ATAM evaluations examine edge AI architectures for the constraints imposed by edge device compute and memory limitations on model complexity.

**Example:** An edge AI architecture for quality inspection in a manufacturing plant runs a visual defect detection model on an embedded GPU at the production line, detecting defects within 10ms of image capture without network dependency, enabling real-time production line control.

#### Elasticity in Cloud

The capability of a cloud-based software system to automatically provision and release computing resources in real time in response to changing workload demands, maintaining performance targets without manual intervention or pre-provisioned excess capacity.

Elasticity is a core architectural benefit of cloud computing that differentiates cloud architectures from fixed-capacity on-premises designs. ATAM evaluations examine elasticity designs for the speed of scale-out response, the accuracy of scaling triggers, and the cost of rapid elasticity.

**Example:** A cloud-based video transcoding service elastically scales from 10 to 500 workers within 5 minutes when a large batch of uploads arrives, processes the batch at high throughput, and scales back to 10 workers within 15 minutes of completion, minimizing idle compute cost.

#### Encapsulation in Architecture

The architectural practice of bundling related data and operations within a component and restricting access to the component's internal state through well-defined interfaces, preventing external components from depending on implementation details.

Encapsulation at the architectural level — not just the object level — enables component-level modifiability and substitutability. ATAM evaluations check whether architectural encapsulation is enforced through runtime mechanisms (not just documentation) when modifiability is a driver.

**Example:** A data access component encapsulates all SQL queries and database connection management within itself; business logic components receive data objects through the component's interface and have no knowledge of the underlying database schema.

#### Encryption at Rest

The security practice of storing data in encrypted form on persistent storage media so that physical access to storage devices does not expose plaintext data, using encryption keys managed separately from the encrypted data.

Encryption at rest is a security tactic that protects against physical media theft and unauthorized storage access. ATAM evaluations examine encryption-at-rest implementations for key management practices, the performance overhead of encryption operations, and compliance with regulatory requirements.

**Example:** A database encryption-at-rest implementation uses AES-256 encryption managed by a cloud KMS, encrypting all data before writing to disk; the KMS keys are customer-managed with rotation policies, satisfying a regulatory compliance requirement for data protection.

#### Encryption in Transit

The security practice of encrypting data as it travels across network connections between components, preventing interception and modification of data in transit through protocols such as TLS, so that network eavesdropping does not expose plaintext data.

Encryption in transit is a security tactic protecting against network-level interception. ATAM evaluations examine encryption-in-transit implementations for certificate management practices, the overhead of TLS handshakes in high-frequency service communication, and the coverage of all communication paths.

**Example:** A healthcare application enforces TLS 1.3 for all client-server communication and mutual TLS for all inter-service API calls, ensuring that patient data is encrypted on every network segment, including internal datacenter communication where internal attackers represent a threat.

#### Energy Efficiency Quality Attr

The quality attribute characterizing a software system's ability to achieve its functional objectives while minimizing consumption of computational resources such as CPU cycles, memory, network bandwidth, and electrical power.

Energy efficiency has grown from a specialty concern in embedded systems to a mainstream architectural driver in cloud computing, where infrastructure costs correlate directly with energy consumption. ATAM evaluations increasingly include energy scenarios for large-scale systems.

**Example:** An energy efficiency scenario for a mobile health monitoring application specifies that background data synchronization consumes less than 5% of battery per hour during continuous monitoring, requiring decisions about sync frequency and payload compression.

#### Error Budget

The allowable amount of service degradation — measured as the complement of an SLO — that a service may consume within a measurement period before reliability-improving changes take priority over feature development.

The error budget concept creates an economic framework for making architectural tradeoff decisions about reliability investment. ATAM evaluations help teams understand what reliability level their architecture can credibly achieve and what error budget is realistic given the architectural decisions made.

**Example:** A service with a 99.9% availability SLO has an error budget of 0.1% per month (approximately 43 minutes); if the service consumes 80% of its budget by mid-month, the team pauses feature releases to focus on reliability improvements, protecting the SLO.

#### Evaluation Leader Role

The individual responsible for facilitating all ATAM evaluation activities, managing the evaluation process, ensuring all voices are heard, maintaining the schedule, and producing the final evaluation report with the team's findings.

The evaluation leader's facilitation skill is as important as their technical knowledge. An effective evaluation leader keeps discussions productive, prevents any single stakeholder from dominating, and maintains focus on architectural decisions rather than implementation details.

**Example:** During a heated debate between developers and operations staff about deployment strategy, the evaluation leader redirects the discussion to the specific quality attribute scenario at hand, preventing the meeting from derailing into a general policy argument.

#### Evaluation Planning Document

A planning artifact produced during ATAM preparation that specifies the evaluation's scope, schedule, participant roles, logistics, information needs, and expected outputs, serving as the project plan for the evaluation effort.

The evaluation planning document aligns all participants' expectations before the evaluation begins. Scope disputes and logistical problems that arise during evaluation sessions could have been resolved in advance with a clear planning document.

**Example:** The evaluation planning document for a defense system ATAM specifies that the evaluation will focus on availability, security, and performance, will be conducted over four days with 20 participants, and will produce findings for review by the program's architecture control board.

#### Evaluation Team Composition

The specific roles, expertise areas, and organizational affiliations required for the team conducting an ATAM evaluation, including an evaluation leader, architects, domain experts, note-takers, and stakeholder representatives with appropriate technical and business knowledge.

Team composition directly affects evaluation quality. An evaluation team without sufficient domain expertise may miss critical risks; a team without architectural expertise cannot analyze architectural approaches against scenarios effectively.

**Example:** A well-composed ATAM evaluation team for a financial trading system includes an evaluation leader experienced in distributed systems, two architects familiar with high-frequency trading patterns, a security expert, and a business stakeholder representing trading desk operations.

#### Event Sourcing Pattern

An architectural data management pattern in which the current state of an entity is derived by replaying an immutable, append-only log of events that represent all state changes that have occurred to that entity over time.

Event sourcing provides a complete audit trail and enables temporal queries and state reconstruction but introduces complexity in query patterns and schema evolution. ATAM evaluations examine event sourcing designs for performance (event replay cost) and modifiability (event schema versioning) scenarios.

**Example:** A financial trading system using event sourcing stores every order state change as an immutable event, enabling compliance auditors to reconstruct the complete state of any portfolio at any point in time by replaying relevant events.

#### Event-Driven Architecture

An architectural style in which components communicate by producing and consuming events through an event broker, with producers unaware of consumers, enabling loose coupling and enabling components to react to state changes asynchronously.

Event-driven architecture improves modifiability and scalability through decoupling but introduces challenges for debugging, tracing, and maintaining data consistency. ATAM evaluations examine event-driven designs for eventual consistency risks and event ordering guarantees.

**Example:** An event-driven architecture for an order management system publishes an "OrderPlaced" event; independent services for inventory reservation, payment processing, and shipment scheduling each consume it asynchronously without coupling to each other.

#### Event-Driven Messaging

A communication paradigm in which components interact by publishing events to a shared message broker and subscribing to events relevant to their function, with publishers and subscribers temporally and structurally decoupled from each other.

Event-driven messaging improves modifiability and scalability through decoupling but introduces complexity in error handling, event ordering, and debugging. ATAM evaluations examine event-driven messaging designs for the scenarios where eventual consistency or message loss is unacceptable.

**Example:** An inventory service publishes "StockDepleted" events to a message broker; multiple downstream services (notification, procurement, reporting) independently subscribe to the event and react without requiring the inventory service to know they exist.

#### Eventual Consistency

A data consistency model for distributed systems in which replicas or components are guaranteed to converge to the same state given sufficient time without new updates, accepting temporary divergence between replicas in exchange for improved availability and partition tolerance.

Eventual consistency is a key architectural tradeoff that ATAM evaluations examine in distributed systems. Stakeholders must explicitly understand and accept that different users may see different versions of data during the convergence window.

**Example:** A shopping cart service using eventual consistency may show different cart contents to the same user when queried from different geographic regions within milliseconds of an update, which is acceptable for cart viewing but unacceptable for checkout confirmation.

#### Evolutionary Architecture

An approach to software architecture design that explicitly supports and enables continuous architectural change through fitness functions, loose coupling, and incremental improvements, rather than treating the architecture as a fixed design to be maintained unchanged.

Evolutionary architecture operationalizes the modifiability quality attribute at the architectural level. ATAM evaluations of systems intended to evolve continuously examine whether the architecture's decomposition, coupling, and fitness function automation support planned evolution patterns.

**Example:** An evolutionary architecture for a product catalog migrates gradually from a monolith to microservices by extracting one service per quarter, with architectural fitness functions verifying that each extraction reduces coupling metrics and that no new cross-service database dependencies are introduced.

#### Executive Briefing Techniques

Methods for communicating architecture evaluation findings to senior organizational leaders in a form that is appropriate for their level of abstraction, time constraints, and decision-making needs, emphasizing business impact rather than technical detail.

ATAM findings that remain within technical teams never achieve organizational impact. Presenting findings to executives in business terms — risk exposure, cost of inaction, strategic implications — is what converts evaluation outputs into organizational decisions.

**Example:** The executive briefing technique for ATAM findings translates "the cache invalidation strategy is a sensitivity point for consistency" into "if data freshness is compromised during peak trading periods, the firm faces potential regulatory reporting failures with associated fines."

#### Executive Sponsor Role

The senior organizational leader who authorizes and supports the ATAM evaluation, ensures that necessary resources and participant availability are provided, and champions implementation of evaluation findings within the organization.

Executive sponsorship is essential for ATAM to have organizational impact. Without executive support, evaluation findings may be acknowledged but not funded or prioritized, negating the evaluation's value.

**Example:** The CTO acting as executive sponsor for an ATAM evaluation commits the engineering team's time, ensures that all identified high-priority risks are assigned owners in the post-evaluation planning session, and allocates budget to address the top three architectural risks.

#### Fault Tolerance Tactic

An architectural approach that enables a software system to continue providing correct or degraded service in the presence of component failures, hardware faults, or environmental disruptions, without requiring external intervention for recovery.

Fault tolerance is achieved through combinations of detection, isolation, and recovery tactics. ATAM evaluations examine fault tolerance architecture by mapping failure scenarios to the mechanisms present and verifying that recovery time objectives are architecturally achievable.

**Example:** A fault-tolerant message processing pipeline automatically detects processing failures, moves failed messages to a dead-letter queue, continues processing subsequent messages, and alerts operators, avoiding complete pipeline stoppage from a single processing error.

#### Feature Store Architecture

An architectural component that provides a centralized repository for computing, storing, and serving machine learning features — derived from raw data — in a consistent form for both model training (offline features) and online inference (low-latency feature retrieval).

Feature stores solve the training-serving skew problem by ensuring that models are trained and served using identically computed features. ATAM evaluations examine feature store architectures for the latency of online feature retrieval and the consistency of features between training and serving.

**Example:** A feature store pre-computes user preference features hourly and serves them from a low-latency cache during online inference, ensuring that the recommendation model sees the same feature representations during serving that it saw during training, preventing prediction quality degradation.

#### Federated Learning

A distributed machine learning architecture in which model training occurs on decentralized data sources — such as user devices or regional data centers — without transferring raw data to a central location, with only model parameter updates (gradients) shared for aggregation.

Federated learning enables machine learning on privacy-sensitive data that cannot be centralized due to regulatory requirements or data residency constraints. ATAM evaluations examine federated learning architectures for the communication overhead of gradient exchange and the model quality impact of heterogeneous data distributions across participants.

**Example:** A federated learning architecture for keyboard autocorrect trains on text typed by millions of users without sending the typed text to a central server; each device trains locally and sends only model gradient updates, preserving user privacy while enabling a globally improved shared model.

#### Function as a Service

A serverless execution model in which discrete units of business logic are implemented as independent functions that are invoked on demand by events, with each function executing in an isolated managed environment and scaling independently based on invocation volume.

Function as a Service (FaaS) enables fine-grained scalability and eliminates idle resource costs but fragments business logic across many small units. ATAM evaluations examine FaaS architectures for the cold start latency risk in latency-sensitive scenarios and the observability challenges of distributed function invocations.

**Example:** A FaaS implementation of order notification logic invokes a separate function for each notification channel (email, SMS, push), enabling each channel to scale independently based on delivery volume and be updated without affecting other notification channels.

#### Functional vs Quality Req

The distinction between requirements that specify what a software system shall do (functional) and requirements that specify how well or under what conditions it shall do it (quality attribute requirements), with ATAM focusing primarily on the latter.

This distinction prevents ATAM evaluations from devolving into requirements reviews. Understanding the boundary between functional and quality requirements keeps analysis focused on architectural decisions rather than feature completeness.

**Example:** "The system shall calculate the shortest delivery route" is functional; "The system shall calculate the shortest route for 500 stops within 2 seconds on standard server hardware" is a quality attribute requirement that ATAM evaluates architecturally.

#### General Scenario

A quality attribute scenario that describes a class of situations applicable to any software system within a domain, expressed without reference to a specific system's components or implementation, used as a template for generating concrete scenarios.

General scenarios serve as a starting point for scenario elicitation in ATAM. The SEI has published catalogs of general scenarios for each major quality attribute, which teams use as prompts to generate system-specific concrete scenarios.

**Example:** A general availability scenario: "A software fault occurs during normal operation; the system detects the fault, notifies the appropriate operator, and recovers to full operation within a specified time" is applicable to any high-availability system.

#### Geographic Redundancy

The architectural deployment of software system components across physically separate geographic locations — such as different data centers, cities, or countries — to protect against regional failure events such as power outages, natural disasters, or network partitions.

Geographic redundancy is an availability tactic for the highest-severity failure scenarios — complete site loss. ATAM evaluations examine geographic redundancy designs for the latency implications of cross-site synchronization, the complexity of inter-site traffic routing, and the cost of maintaining duplicate infrastructure.

**Example:** A financial trading platform deploys active processing nodes in three geographic regions with synchronous database replication; if a complete regional outage occurs, trading automatically continues from the remaining regions within 30 seconds, satisfying the disaster recovery RTO.

#### GitOps Architecture

An operational architecture model in which all infrastructure and application configuration is stored in a version-controlled Git repository as the single source of truth, with automated processes continuously reconciling the actual running state of the system to match the declared state in Git.

GitOps is an operational quality attribute tactic that improves deployability, auditability, and recoverability. ATAM evaluations examine GitOps implementations for the security of the reconciliation pipeline and the handling of out-of-band configuration changes that contradict the Git state.

**Example:** A GitOps implementation uses a Kubernetes operator that continuously monitors a Git repository; when a configuration file is updated in Git through a pull request, the operator automatically applies the change to the cluster, providing a complete audit trail of every configuration change.

#### GraphQL Architecture

An API query language and runtime in which clients specify exactly what data they need in a single request, and the server returns only that data, eliminating over-fetching and under-fetching problems common in REST API designs.

GraphQL improves API flexibility for diverse clients but introduces complexity in server-side resolution, N+1 query risks, and security considerations around query depth and complexity. ATAM evaluations examine GraphQL designs for performance (query cost) and security (query abuse) scenarios.

**Example:** A GraphQL API for a social platform allows a mobile client to request user name, avatar, and recent posts in a single query rather than three separate REST calls, reducing mobile network overhead and improving perceived performance.

#### GraphRAG Architecture

An extension of RAG architecture that represents the knowledge base as a graph structure — with entities as nodes and relationships as edges — enabling retrieval of interconnected information through graph traversal, capturing multi-hop relationships that vector similarity search cannot find.

GraphRAG improves retrieval quality for questions requiring reasoning across multiple related concepts by traversing relationship chains in the knowledge graph. ATAM evaluations examine GraphRAG architectures for the complexity of graph maintenance and the query latency of graph traversal compared to vector search.

**Example:** A GraphRAG architecture for medical diagnosis support traverses a clinical knowledge graph from a patient's symptoms through related conditions, contraindications, and recommended tests, retrieving a coherent set of related clinical guidelines rather than isolated similar documents.

#### gRPC Communication Pattern

A high-performance, contract-first remote procedure call framework using Protocol Buffers for interface definition and HTTP/2 for transport, enabling efficient binary serialization, bidirectional streaming, and strong typing between services.

gRPC provides lower latency and higher throughput than REST for inter-service communication but requires more tooling and is less human-readable. ATAM evaluations examine gRPC designs for performance (serialization efficiency), interoperability (language support), and modifiability (schema evolution) scenarios.

**Example:** A gRPC interface for an order service defines request and response message types in a .proto file; generated client stubs ensure that all consumers use the same strongly typed contract, preventing integration errors at runtime.

#### gRPC vs REST Comparison

The architectural tradeoff analysis between using gRPC (Protocol Buffers over HTTP/2, binary serialization, strong typing, streaming support) versus REST (JSON over HTTP/1.1, human-readable, broad tooling support) for service-to-service communication.

This comparison is a common ATAM tradeoff point. gRPC provides better performance and type safety for internal service communication; REST provides better interoperability for external-facing APIs. ATAM evaluations examine which choice best serves the system's specific scenario priorities.

**Example:** For internal service communication under strict latency requirements, gRPC's binary serialization reduces payload size by 60% compared to JSON, improving throughput — a significant advantage for the performance scenario but requiring all services to adopt Protocol Buffer tooling.

#### Health Check Pattern

An architectural pattern in which each service component exposes a dedicated endpoint that returns a structured status indicating whether the component is healthy and capable of handling requests, used by load balancers, orchestrators, and monitoring systems to route traffic to healthy instances.

Health checks are a fault detection tactic that enables automatic removal of failed instances from service and triggers recovery actions. ATAM evaluations examine health check designs for the completeness of what they verify — a health check that reports "healthy" when the database is unreachable is insufficient.

**Example:** A deep health check endpoint verifies not only that the service process is running but also that it can successfully connect to its database, reach its dependent services, and read from its configuration store, returning a detailed status for each dependency.

#### Hexagonal Architecture

An architectural style, also called ports and adapters, that separates core application logic from external concerns (user interfaces, databases, messaging systems) through defined ports (interfaces) and adapters (implementations), enabling the core to be developed and tested independently.

Hexagonal architecture improves testability and portability by inverting external dependencies so that the core domain depends on abstractions rather than concrete infrastructure. ATAM evaluations assess hexagonal architectures for testability and portability scenarios.

**Example:** A hexagonal architecture for an inventory system allows the inventory domain core to be tested with an in-memory repository adapter, and deployed with either a PostgreSQL or DynamoDB adapter without changes to the domain logic.

#### HH Scenario Priority

The designation of a quality attribute scenario in the ATAM utility tree as having both High importance and High difficulty, indicating that it represents the highest priority for deep architectural analysis because it is both critical and uncertain in its achievability.

HH scenarios are the focus of ATAM's deepest analytical effort. They represent decisions where the evaluation is most likely to identify risks, sensitivity points, or tradeoffs because they combine high business criticality with architectural uncertainty.

**Example:** In an ATAM evaluation of an autonomous vehicle coordination system, the scenario "200ms end-to-end response for collision avoidance under 5G network degradation" is rated HH because vehicle safety depends on it and the communication architecture makes it uncertain.

#### Horizontal Scaling

A scaling approach in which performance capacity is increased by adding more identical nodes to a pool of computing resources and distributing workload across them, enabling theoretically unbounded capacity addition without changes to individual node hardware.

Horizontal scaling enables virtually unlimited capacity growth but requires the architecture to support distributed state management, load balancing, and data distribution. ATAM scalability scenarios examine whether the architecture's use of session state and shared data is compatible with horizontal scaling.

**Example:** A horizontally scaled web application runs 10 stateless API server instances behind a load balancer; during traffic spikes, auto-scaling adds additional instances within 2 minutes, demonstrating that the stateless architecture enables horizontal scaling without architectural limitations.

#### Hybrid Cloud Architecture

An architectural model in which a software system's workloads and data are distributed across a combination of on-premises infrastructure and one or more cloud provider environments, connected by secure network links and managed through unified operations tooling.

Hybrid cloud architectures address requirements for data sovereignty, latency to on-premises systems, or regulatory constraints on data location. ATAM evaluations examine hybrid architectures for the network dependency risk between on-premises and cloud components and the security of the interconnection.

**Example:** A financial institution runs transaction processing in its on-premises datacenter for latency and regulatory reasons while using cloud infrastructure for analytics, reporting, and batch processing, connected through dedicated network links with encrypted traffic.

#### Idempotency in Services

The property of a service operation by which executing the operation multiple times with the same input produces the same result as executing it once, enabling safe retry behavior and simplifying error recovery in distributed systems.

Idempotency is a critical architectural property for reliability in distributed systems where retries are necessary. ATAM evaluations examine whether service operations that are invoked with retry patterns are designed to be idempotent, preventing duplicate effects from retry storms.

**Example:** A payment processing service implements idempotency by accepting a client-supplied idempotency key; duplicate requests with the same key return the original response rather than processing the payment twice, preventing double-charging during retry scenarios.

#### Identity and Access Management

The architectural capability for creating, managing, and enforcing identities and access policies for users, services, and devices in a software system, including user provisioning, authentication, authorization, and access lifecycle management.

IAM is the foundational security architecture capability on which all other access controls depend. ATAM evaluations examine IAM architectures for the scenarios where privileged identity compromise, excessive permissions, or orphaned accounts create security risks.

**Example:** An IAM architecture for a cloud platform uses federated identity from a corporate directory for employee access, service accounts with time-limited credentials for automated processes, and customer-managed identity providers for end-user access to the SaaS product.

#### Immutable Infrastructure

An architectural practice in which deployed infrastructure components — such as server images or container instances — are never modified after deployment; updates are achieved by replacing existing instances with new instances built from updated specifications.

Immutable infrastructure eliminates configuration drift between instances and enables reliable rollback by preserving previous instance images. ATAM evaluations examine immutable infrastructure practices for the deployment time impact of image rebuilds and the storage cost of maintaining multiple image versions.

**Example:** An immutable server infrastructure bakes application binaries and configuration into an AMI at build time; deploying an update creates new instances from the updated AMI and terminates old instances, ensuring all running instances are identical.

#### Importance Rating

An assessment of how critical a quality attribute scenario is to the success of the software system and stakeholder satisfaction, typically expressed on a two-point scale (High/Low) or three-point scale in the ATAM utility tree.

The importance rating drives evaluation prioritization. High-importance scenarios receive the deepest architectural analysis, while low-importance scenarios may be noted but not analyzed in detail, enabling efficient use of evaluation time.

**Example:** A scenario specifying response to a complete datacenter loss is rated High importance for an emergency services application but Low importance for an internal inventory management tool where degraded operation is acceptable for hours.

#### Information Hiding Principle

The architectural and design principle that each module should conceal its internal implementation details from other modules, exposing only a minimal, stable interface, so that internal changes do not propagate to dependent modules.

Information hiding is the foundational principle underlying modifiability architecture. ATAM evaluations trace change scenarios through module interfaces to verify that the architecture enforces information hiding at the boundaries where change is expected.

**Example:** A module that hides its use of a specific third-party mapping library behind a LocationService interface allows the mapping provider to be switched without requiring changes to any module that uses location services.

#### Infrastructure as Code

The practice of defining, provisioning, and managing computing infrastructure — including servers, networks, databases, and load balancers — through machine-readable configuration files that are version-controlled and applied through automated deployment pipelines.

Infrastructure as Code is a key tactic for achieving deployability, reproducibility, and operational consistency quality attributes. ATAM evaluations examine IaC practices for environment drift risk (differences between declared and actual infrastructure) and the auditability of infrastructure changes.

**Example:** A Terraform configuration declares all cloud infrastructure for a system, including VPC configuration, database instances, and load balancers; applying the configuration to a new region creates an identical infrastructure environment in minutes, enabling geographic redundancy deployment.

#### Integration Patterns

A collection of established architectural approaches for connecting software components and systems that were not designed to work together, addressing challenges of data format conversion, communication protocol bridging, and interaction flow coordination.

Integration patterns — such as adapters, anti-corruption layers, and message translators — are commonly used in systems integrating with legacy systems or external partners. ATAM evaluations examine integration architectures for the risk of excessive coupling to external system details.

**Example:** An anti-corruption layer pattern wraps an external legacy inventory system, translating its proprietary data formats into the internal domain model, preventing the legacy system's data model from polluting the modern architecture's design.

#### Interface Definition

The explicit specification of the contract between a software component and its clients, including the operations provided, their parameters and return types, preconditions, postconditions, error conditions, and quality attribute properties.

Interface definitions are critical to ATAM modifiability analysis. A component's interface defines what must remain stable for clients to be unaffected by internal changes. Poorly defined interfaces become sources of coupling that make modification expensive.

**Example:** An interface definition for a payment service specifies the authorize, capture, and refund operations with their input parameters, response schemas, error codes, and SLA commitments, enabling client developers to code against the contract without knowledge of the implementation.

#### Interoperability Quality Attribute

The quality attribute characterizing a software system's ability to exchange information and operate cooperatively with other systems using agreed-upon interfaces, data formats, and communication protocols.

Interoperability is a primary driver in systems that must integrate with external partners, legacy systems, or regulatory infrastructure. ATAM evaluations examine whether interface decisions enable required interoperability without compromising other attributes.

**Example:** An interoperability scenario specifies that the system exchanges inventory updates with 50 different supplier systems using their native formats within 30 minutes of a format mapping being configured, without code changes.

#### Interoperability Tactic

An architectural decision that enables a software system to exchange information and operate cooperatively with other systems, including decisions about interface standardization, data format conversion, protocol translation, and semantic mapping between systems.

Interoperability tactics are the primary mechanisms for achieving interoperability quality attribute scenarios. ATAM evaluations examine interoperability architectures for the cost of supporting multiple partner formats and protocols and the maintenance burden of keeping translations current as partner systems evolve.

**Example:** An interoperability tactic of publishing a canonical data model with transformation adapters for each partner system's format enables new partner integrations by adding only a new adapter, rather than requiring changes to the core system for each new partner's data format.

#### Intrusion Detection System

A security architectural component that monitors network traffic or system behavior for patterns indicating unauthorized access attempts, policy violations, or malicious activity, generating alerts when suspicious patterns are detected.

Intrusion detection is a security detection tactic that complements perimeter defenses by monitoring for attacks that succeed in bypassing outer controls. ATAM evaluations examine IDS coverage of the attack scenarios identified in security threat modeling.

**Example:** A network intrusion detection system monitors API traffic patterns and alerts when a single IP address generates more than 1,000 failed authentication attempts within 60 seconds, detecting credential stuffing attacks before they succeed in compromising accounts.

#### Kappa Architecture

A simplified big data processing architecture that uses a single stream processing layer for all data processing — both real-time and historical — by replaying historical data through the same stream processing pipeline, eliminating the operational complexity of maintaining separate batch and streaming systems.

Kappa architecture reduces operational complexity compared to Lambda by using a single processing system but requires that the stream processing framework support efficient historical data replay. ATAM evaluations compare Kappa and Lambda for systems where the operational simplicity benefit of Kappa outweighs any processing efficiency differences.

**Example:** A Kappa architecture for financial metrics processes all transactions through a single Apache Flink pipeline, replaying three months of historical data to recompute corrected metrics when a calculation bug is fixed, using the same code that processes new real-time transactions.

#### Kubernetes Orchestration

A container orchestration platform that automates the deployment, scaling, networking, and lifecycle management of containerized applications across clusters of machines, providing declarative configuration, self-healing, and service discovery capabilities.

Kubernetes has become the standard platform for managing containerized microservices at scale. ATAM evaluations of Kubernetes-based architectures examine cluster availability, pod scheduling reliability, and the operational complexity of managing Kubernetes configuration.

**Example:** A Kubernetes deployment specification declares that the payment service requires three healthy replicas; Kubernetes monitors replica health and automatically starts replacement pods on healthy nodes when replicas fail, implementing the availability tactic of active redundancy.

#### Lambda Architecture

A big data processing architecture that combines a batch processing layer (processing all historical data with high accuracy) and a speed layer (processing recent data with low latency), with a serving layer that merges results from both layers to answer queries.

Lambda architecture provides both latency and accuracy for analytics workloads but introduces operational complexity from maintaining two separate processing systems producing equivalent results. ATAM evaluations examine lambda architectures for the consistency challenges when batch and speed layer results diverge.

**Example:** A lambda architecture for website analytics runs hourly MapReduce batch jobs for accurate historical metrics and a streaming processor for real-time dashboards; the serving layer combines both, showing accurate historical data and near-real-time current data in the same query interface.

#### Latency

The elapsed time between the initiation of a request or operation and the receipt of the corresponding response, measured from the client's perspective, encompassing network transit time, queuing time, and processing time at each component in the request path.

Latency is the most directly user-perceptible performance metric and a common quality attribute driver in ATAM evaluations. Latency scenarios specify maximum acceptable elapsed time under defined conditions and are analyzed by decomposing the request path into its component latency contributors.

**Example:** An ATAM latency scenario specifies that the 99th percentile end-to-end response time for product search queries from mobile clients shall not exceed 500ms under normal operating conditions, requiring analysis of client network, API gateway, search service, and database latency contributions.

#### Layered Architecture Pattern

An architectural pattern that organizes a system into a set of horizontal layers, each providing services to the layer above it and consuming services from the layer below, with strictly controlled dependencies that flow only downward between layers.

The layered pattern promotes modifiability by isolating changes to a single layer, but it introduces performance overhead at each inter-layer boundary. ATAM evaluations examine whether the layering aligns with expected change scenarios and whether the overhead is acceptable to performance scenarios.

**Example:** A three-layer architecture separating presentation, business logic, and data access means that changing the database technology requires modifications only to the data access layer, which an ATAM modifiability scenario verifies is feasible within the stated cost constraint.

#### Leaf-Level Scenario

A concrete quality attribute scenario appearing as a terminal node in the ATAM utility tree, representing a specific, testable, prioritized instance of a quality attribute requirement analyzed against the architectural decisions responsible for satisfying it.

Leaf-level scenarios are the actual analytical units of ATAM. The evaluation team examines each high-priority scenario against the architecture and records whether the architecture has a credible approach — if not, the gap is classified as a risk.

**Example:** A leaf-level scenario rated H/H: "during peak holiday load of 50,000 concurrent users, product search returns results within 300ms for 99% of queries" is analyzed against search indexing, caching, and query routing decisions.

#### Least Privilege Principle

The security architecture principle that every component, service, and user identity should be granted only the minimum permissions necessary to perform its required function, and no additional permissions, reducing the potential impact of a compromised identity.

Least privilege is a foundational security architecture principle that ATAM evaluations examine through privilege escalation and unauthorized access scenarios. Systems that grant excessive permissions create higher severity risks than systems with precisely scoped permissions.

**Example:** A microservice that reads from two specific database tables is granted a database role with read-only access to only those two tables, not write access or access to other tables, so that a SQL injection vulnerability in the service cannot be used to modify or exfiltrate other data.

#### Lightweight Architecture Eval

An abbreviated architecture evaluation approach that applies selected ATAM principles and techniques within shorter timeframes and with fewer participants, suitable for evaluating smaller systems, incremental changes, or low-stakes architectural decisions.

Lightweight evaluations enable organizations to apply architecture evaluation discipline without the full overhead of a two-phase ATAM, making evaluation accessible to teams that cannot justify the investment of a complete evaluation for every architectural decision.

**Example:** A lightweight evaluation of a proposed caching layer change involves three architects spending half a day mapping the change against five key performance and consistency scenarios, producing a brief risk memo rather than a full ATAM report.

#### LLM Architecture

The structural design of a software system that incorporates large language model capabilities — including prompt construction, LLM API invocation, response parsing, context management, and output validation — to deliver natural language processing features within application workflows.

LLM architecture introduces unique quality attribute challenges including inference cost (per-token pricing), non-determinism (variable outputs), latency (multi-second inference times), and safety (harmful content generation). ATAM evaluations examine LLM architectures for these AI-specific quality attribute scenarios alongside traditional software architecture concerns.

**Example:** An LLM architecture for a customer support chatbot manages a sliding context window, caches common prompt-response pairs, implements content safety filtering on outputs, and falls back to a rule-based response when the LLM response exceeds a 3-second latency budget.

#### Load Balancing Tactic

An architectural availability and performance tactic in which incoming requests are distributed across multiple instances of a component to prevent any single instance from becoming a bottleneck or single point of failure.

Load balancing is a fundamental tactic for achieving scalability and availability. ATAM evaluations examine load balancing designs for session affinity requirements (which constrain distribution strategies), health checking accuracy, and behavior when instances fail.

**Example:** An application load balancer distributes incoming HTTP requests across five application server instances using round-robin scheduling, with health checks every 30 seconds to remove unhealthy instances from rotation and trigger automatic replacement.

#### Load Testing

The practice of subjecting a software system to simulated workloads at or above its designed capacity to measure its performance characteristics, identify bottlenecks, and verify that it meets the performance quality attribute scenarios defined in the utility tree.

Load testing is the empirical validation mechanism for ATAM performance scenarios. Performance scenarios classified as non-risks in ATAM should be validated through load testing before system deployment to confirm that the architectural analysis was correct.

**Example:** A load test simulating 10,000 concurrent users performing product searches and checkouts identifies that the payment service fails at 3,000 concurrent users due to database connection pool exhaustion, contradicting the ATAM non-risk classification and requiring architectural correction.

#### Logging Architecture

The structural design of how a software system generates, formats, collects, aggregates, stores, and queries log records from all components, providing the event history needed for debugging, auditing, and security analysis.

Logging architecture is an observability tactic that ATAM evaluations examine for completeness (are all relevant events logged?) and usability (can logs be efficiently queried to diagnose the failure scenarios defined in the utility tree?). High log volume can also create performance and storage cost concerns.

**Example:** A logging architecture uses structured JSON logging from all services, collected by a log aggregation agent on each host and forwarded to a centralized log management platform, enabling cross-service log correlation by trace ID for diagnosing multi-service failures.

#### Machine Learning Pipeline

An end-to-end automated workflow that transforms raw data into deployed, operational machine learning models through stages of data ingestion, preprocessing, feature engineering, model training, evaluation, and deployment.

ML pipelines are architectural components that require evaluation of both quality attributes specific to ML (model quality, training time, data freshness) and traditional software quality attributes (reliability, scalability, and modifiability of the pipeline itself). ATAM evaluations examine pipelines for the scenarios where data quality issues or pipeline failures affect model availability.

**Example:** An ML pipeline for a recommendation engine runs nightly, ingesting 24 hours of user behavior events, computing user and item features, retraining collaborative filtering models, evaluating against holdout data, and deploying passing models to the serving API within a 4-hour window.

#### Maintainability Quality Attr

The quality attribute characterizing the ease with which a software system can be modified to correct faults, improve performance, adapt to environmental changes, or add capabilities, encompassing both structural modifiability and operational maintainability.

Maintainability is broader than modifiability, encompassing the operational maintenance activities of system administrators alongside structural change activities of developers. ATAM evaluations may address both dimensions through separate scenario categories.

**Example:** A maintainability scenario specifies that a database schema migration is executable by a database administrator without developer assistance within two hours, using provided migration scripts and rollback procedures.

#### Managed Cloud Services

Cloud provider-operated services — such as managed databases, message queues, identity providers, and AI APIs — in which the provider handles infrastructure provisioning, patching, scaling, backup, and high availability, reducing the operational burden on the application team.

Managed services represent an architectural decision to trade customization and portability for operational simplicity. ATAM evaluations examine managed service choices for vendor lock-in risk, the acceptability of the managed service's SLO, and the cost implications relative to self-managed alternatives.

**Example:** Using a managed database service eliminates the operational burden of database patching, backup configuration, and failover management but creates dependence on the provider's maintenance window schedule and SLA, which must be evaluated against the system's availability requirements.

#### Mean Time Between Failures

The average time elapsed between consecutive service failures of the same type, used as a quantitative measure of a system's reliability and the effectiveness of its fault prevention architecture.

Mean Time Between Failures (MTBF) quantifies how often failures occur, complementing MTTR (which measures how quickly they are resolved). Together, MTBF and MTTR determine the system's availability percentage. ATAM availability evaluations examine both the frequency of failures (MTBF) and the recovery speed (MTTR).

**Example:** A database cluster with automated patching and hardware monitoring achieves a MTBF of 2,000 hours; combined with a 45-second MTTR, the resulting availability is 99.999%, satisfying the ATAM availability scenario's 99.99% minimum requirement.

#### Mean Time to Recovery

The average time elapsed from the detection of a service failure to the restoration of full service capability, used as a quantitative measure of a system's fault recovery effectiveness and a key metric for evaluating availability architecture.

Mean Time to Recovery (MTTR) directly corresponds to the response time specified in ATAM availability scenario response measures. Architectural decisions about fault detection speed, automated failover, and rollback automation all contribute to MTTR, making it a measurable outcome of the availability architecture.

**Example:** An availability architecture with automated failover achieves an MTTR of 45 seconds for primary database failures, satisfying the ATAM availability scenario's response measure of "recovery within 60 seconds without operator intervention."

#### Message Queue Architecture

An architectural component that stores messages produced by one component and delivers them to another component asynchronously, providing buffering, temporal decoupling, and guaranteed delivery semantics to improve system resilience and workload leveling.

Message queues are a fundamental availability and performance tactic in asynchronous architectures. ATAM evaluations examine message queue architectures for durability guarantees (message loss risk), throughput capacity (performance bottleneck), and failure handling (dead-letter processing).

**Example:** An order processing system places new orders on a durable message queue; the processing service consumes orders at its own pace, enabling the system to absorb traffic spikes without losing orders and to survive processing service restarts without data loss.

#### Message Transformation

The architectural process of converting messages from one data format, schema, or semantic representation to another as they pass through integration components, enabling systems with different data representations to exchange information without requiring either system to adopt the other's format.

Message transformation is a key interoperability tactic for enterprise integration. ATAM evaluations examine transformation architectures for the performance overhead of complex transformations on high-volume message flows and the maintainability of transformation logic as source and target schemas evolve.

**Example:** A message transformation component converts orders arriving in a legacy EDI format from trading partners into the internal canonical JSON order format, enabling the order processing system to handle orders from 30 different partners without partner-specific code in the core system.

#### Metrics Collection

The systematic gathering and storage of quantitative measurements of a software system's behavior — such as request rates, error rates, response latencies, and resource utilization — at regular intervals, enabling trend analysis, alerting, and capacity planning.

Metrics collection is an observability and availability tactic that enables proactive identification of performance and availability problems before they escalate to outages. ATAM evaluations examine metrics architectures for the coverage of the performance and availability scenarios in the utility tree.

**Example:** A metrics collection architecture instruments every service to emit request count, error count, and latency histograms every 15 seconds to a time-series database, enabling dashboards that visualize service health and alerts that fire when any service's error rate exceeds 1%.

#### Microservices Architecture

An architectural style in which a software system is decomposed into a collection of small, independently deployable services, each implementing a bounded domain capability, communicating through lightweight protocols, and managed independently.

Microservices architecture promotes deployment independence and scalability but introduces distributed systems complexity. ATAM evaluations probe microservices designs for data consistency (across service boundaries), availability (cascading failures), and operational complexity (service discovery, distributed tracing).

**Example:** A microservices architecture for a retail platform deploys Order, Inventory, Payment, and Notification services independently, enabling the Payment service to be scaled separately during checkout peaks without affecting the Inventory service.

#### Mini-ATAM

A compressed, lightweight variant of the full ATAM process designed for smaller systems, time-constrained evaluations, or situations where the full two-phase ATAM is impractical, typically conducted in a single session with a reduced stakeholder set.

Mini-ATAM provides a way to apply ATAM thinking and structure to contexts where a full evaluation is not feasible. While less comprehensive than full ATAM, it preserves the core analytical activities of scenario elicitation and architectural analysis.

**Example:** A startup conducting a mini-ATAM over four hours with five participants identifies the top three architectural risks in their proposed SaaS platform before committing to a cloud provider and infrastructure design.

#### Mission Statement

A concise declaration of the fundamental purpose of a software system or organization that defines what the system does, for whom it does it, and why, providing the foundational context for all architectural decisions.

The mission statement orients ATAM evaluation participants who may be unfamiliar with the system's purpose. Understanding the mission helps evaluators determine whether identified risks would actually jeopardize the system's fundamental purpose.

**Example:** The mission statement "provide real-time financial risk assessment to institutional traders to enable compliance with regulatory position limits" tells ATAM evaluators that latency and correctness are mission-critical, while cosmetic UI quality is not.

#### ML Model Registry

A centralized versioned repository that stores trained machine learning models along with their metadata — including training data version, hyperparameters, evaluation metrics, and deployment history — enabling reproducible model deployment and rollback.

A model registry provides governance and auditability for ML model deployments. ATAM evaluations examine model registry architectures for the completeness of provenance metadata and the ability to roll back a deployed model to a previous version when performance degrades.

**Example:** A model registry stores every trained model version with its training dataset fingerprint, evaluation metrics, and approval status; when a deployed model's performance degrades, the team rolls back to the previous approved version within minutes using the registry's deployment history.

#### Model Drift Detection

The architectural capability for monitoring the statistical properties of model inputs, outputs, and prediction quality over time, detecting when a deployed model's performance has degraded due to changes in the real-world data distribution that the model was not trained on.

Model drift is an availability concern for AI systems — a model that produces poor predictions is functionally unavailable even if it is technically operational. ATAM evaluations examine drift detection architectures for the monitoring coverage and the automated response to detected drift.

**Example:** A model drift detection system monitors the distribution of input features and output prediction scores daily, alerting the ML team when statistical tests detect significant distribution shift from the training baseline, triggering model retraining before customer-facing prediction quality degrades noticeably.

#### Model Serving Architecture

The structural design of the components that load trained machine learning models into memory, receive inference requests, execute model predictions, and return results to callers, designed to meet the latency and throughput requirements of online serving.

Model serving architecture must balance prediction latency (model complexity affects inference time), throughput (simultaneous inference requests), and cost (GPU versus CPU serving). ATAM evaluations examine serving architectures for the latency scenarios where model inference time dominates end-to-end response time.

**Example:** A model serving architecture deploys a compressed neural network on CPU-optimized inference servers, achieving 15ms inference latency for product recommendations, meeting the performance scenario's 50ms end-to-end response budget after accounting for API overhead.

#### Model Training Architecture

The structural organization of computing resources, data storage, coordination frameworks, and orchestration tooling that enables efficient training of machine learning models on large datasets, including distributed training, GPU resource management, and experiment tracking.

Model training architecture determines how quickly the ML team can iterate on model improvements and how reliably the training process produces reproducible results. ATAM evaluations examine training architectures for reproducibility scenarios (same data and code produce same model) and training duration (blocking the deployment pipeline).

**Example:** A distributed model training architecture trains large language models across 128 GPU nodes using data parallelism, completing in 6 hours what sequential training would require 512 hours for, enabling the ML team to experiment with weekly model updates rather than quarterly.

#### Modifiability Quality Attribute

The quality attribute characterizing a software system's ease of change, measured by the cost, effort, and risk of making specified types of modifications to the system's structure, behavior, or deployment configuration.

ATAM evaluations use change scenarios to assess whether an architecture's decomposition aligns with expected directions and frequencies of system evolution. Poor separation often results in HH-rated scenarios becoming high-risk findings.

**Example:** A modifiability scenario specifies that adding support for a new payment gateway requires changes to no more than two modules, completable by one developer within five days without modifying the core order processing logic.

#### Modifiability Scenario

A quality attribute scenario that specifies the type of change to be made, the effort required, and the scope of impact, used to evaluate whether the architecture's decomposition and coupling decisions support the expected system evolution.

Modifiability scenarios test whether module boundaries are aligned with expected change directions. A change that should be local but requires modifications across many modules indicates a decomposition mismatch that ATAM identifies as a risk.

**Example:** A modifiability scenario specifies that replacing the current payment processor integration with a new provider requires changes only to the payment gateway adapter module, completable within two developer-days without affecting order processing.

#### Modifiability Tactic

An architectural decision that reduces the cost, risk, or effort of making changes to a software system by controlling coupling, cohesion, encapsulation, and the scope of impact when a specified class of changes is introduced.

Modifiability tactics are the primary architectural mechanisms for achieving change scenarios. ATAM evaluators examine which modifiability tactics the architecture employs — parameterization, encapsulation, intermediaries — and whether they adequately isolate the change scenarios defined in the utility tree.

**Example:** The modifiability tactic "use interfaces" creates a stable boundary between the payment module and its callers, ensuring that switching payment processors requires changes only within the payment module, as verified by the modifiability scenario.

#### Modular Decomposition

The process of dividing a software system into discrete modules with well-defined interfaces and responsibilities such that each module can be developed, tested, and modified with minimal impact on other modules.

Modular decomposition is the primary structural mechanism for achieving modifiability and team scalability. ATAM evaluations examine decomposition decisions to assess whether the module boundaries align with expected change scenarios.

**Example:** Decomposing a retail system into Inventory, Pricing, Order, and Customer modules allows the pricing algorithm to be replaced without modifying the order processing logic, provided the module interfaces remain stable.

#### Module Cohesion

The degree to which the elements within a software module belong together and serve a single, well-defined purpose, with high cohesion indicating that all functions, data, and logic within a module contribute to one coherent responsibility.

High cohesion is a structural property that supports modifiability, testability, and understandability. ATAM evaluations examine modules with low cohesion — those that mix unrelated responsibilities — as potential risks for modifiability because changes to unrelated functionality spread across the same module.

**Example:** A module that handles user authentication, email formatting, and database connection pooling has low cohesion; separating these into Authentication, Email, and DataAccess modules improves cohesion and reduces the risk that changes to one concern affect the others.

#### Module Coupling

The degree of interdependence between software modules, measured by how many connections exist between them, how complex those connections are, and how much knowledge each module has of the other's internal structure.

Low coupling is essential for modifiability because highly coupled modules cannot be changed independently. ATAM modifiability analysis examines coupling through change scenarios — if changing module A requires changing modules B and C, those modules are too tightly coupled.

**Example:** Two modules are tightly coupled when one directly accesses the other's internal data structures; the coupling is reduced by introducing an interface so that each module knows only the interface, not the internal implementation.

#### Multi-Cloud Architecture

An architectural approach in which a software system is designed to operate across multiple cloud providers simultaneously, avoiding dependence on any single provider's proprietary services, APIs, or geographic availability.

Multi-cloud architecture reduces vendor lock-in risk and improves geographic diversity for availability but significantly increases operational complexity. ATAM evaluations examine multi-cloud designs for the operational overhead of managing divergent tooling across providers and the standardization required to remain provider-agnostic.

**Example:** A multi-cloud architecture uses cloud-agnostic abstractions (Kubernetes for compute, Terraform for infrastructure, S3-compatible APIs for storage) to run workloads on both AWS and Azure, enabling workload migration if a provider's pricing or availability degrades.

#### Multi-Modal AI Architecture

The structural design of an AI system that processes and generates content across multiple modalities — such as text, images, audio, and video — integrating separate modality-specific components through a unified representation and routing architecture.

Multi-modal AI architecture introduces complexity in coordinating components with different latency profiles, resource requirements, and output formats. ATAM evaluations examine multi-modal architectures for the performance scenarios where latency from multiple modality-specific models must be managed within a single response budget.

**Example:** A multi-modal AI architecture for a product listing system processes both product images (vision model) and descriptions (language model), merging their outputs into a unified product representation that improves search relevance compared to text-only or image-only indexing.

#### MVC Architecture Pattern

A user interface architectural pattern that separates a software system into three components — Model (data and business rules), View (presentation), and Controller (input handling and coordination) — to improve modifiability and testability of user-facing applications.

MVC promotes separation of presentation from business logic, making each independently modifiable and testable. ATAM evaluations assess MVC implementations for modifiability scenarios involving UI changes and for performance scenarios examining controller overhead.

**Example:** An MVC architecture for a web application allows the development team to replace the HTML rendering view with a mobile-friendly view template without modifying the business logic model or controller routing logic.

#### Non-Deterministic Behavior

The characteristic of AI system components — particularly machine learning models and generative AI systems — by which the same input may produce different outputs across invocations due to randomness in inference (such as temperature sampling) or model updates.

Non-determinism in AI systems creates unique quality attribute challenges for testability (tests cannot compare exact outputs), reliability (users may receive inconsistent experiences), and debugging (reproducing reported failures requires capturing exact system state). ATAM evaluations examine AI architectures for their strategies to manage non-determinism.

**Example:** A generative AI system that produces different product descriptions for the same product each time it is called requires the architecture to capture the exact model version, random seed, and prompt used for each generation to enable reproducibility for audit or debugging purposes.

#### Non-Risk

An architectural decision that has been analyzed against relevant quality attribute scenarios and found to be sound, providing positive evidence that the architecture can achieve the stated quality goal under the specified conditions.

Non-risks are often overlooked ATAM outputs, but they are important because they provide documented evidence that specific architectural decisions are appropriate. This evidence defends architectural decisions against future challenges and prevents well-reasoned decisions from being second-guessed without cause.

**Example:** The use of a proven consensus algorithm (Raft) for leader election in the distributed coordination service is documented as a non-risk for availability, supported by analysis showing that the algorithm maintains progress with up to N/2-1 node failures.

#### Note-Taker Role

The designated ATAM team member responsible for accurately recording all scenarios, risks, non-risks, sensitivity points, tradeoffs, and decisions made during evaluation sessions in a form that supports the production of the final evaluation report.

Note-taking is undervalued but critical. ATAM sessions move quickly and produce large volumes of information. Without accurate real-time documentation, key findings may be lost or misremembered when producing the final report.

**Example:** The note-taker uses a structured template to log each scenario as it is identified, recording its stimulus, environment, response, and response measure, along with whether it was classified as a sensitivity point, tradeoff, or risk.

#### OAuth 2.0 Architecture

An authorization framework architecture that enables third-party applications to obtain limited access to a service on behalf of a user without exposing the user's credentials, using access tokens issued by an authorization server after user consent.

OAuth 2.0 is a standard authorization delegation mechanism used in modern API architectures. ATAM evaluations examine OAuth implementations for the security of the token exchange flow, the appropriate scope of granted permissions, and the security of token storage in clients.

**Example:** An OAuth 2.0 architecture for a fitness application allows users to grant a third-party nutrition app read-only access to their workout data without sharing their platform credentials, with the granted access limited to the specific data types the user approves.

#### Observability

The capability of a software system to allow operators to understand its internal state and behavior from its external outputs — metrics, logs, and distributed traces — without requiring changes to the system's code or deployment configuration.

Observability is a testability and maintainability quality attribute that ATAM evaluations examine through operational scenarios. A system with poor observability cannot be effectively diagnosed when problems occur, converting what might be a minor incident into an extended outage.

**Example:** An observable system automatically emits a metric for every API endpoint's response time and error rate, a structured log entry for every business event processed, and a distributed trace for every cross-service request, enabling operators to diagnose any of the failure scenarios in the utility tree without code changes.

#### Online Learning Architecture

An architectural design in which machine learning models are continuously updated with new training data as it arrives — rather than through periodic batch retraining — enabling the model to adapt to changing data distributions in near-real-time.

Online learning architecture addresses model drift proactively but introduces risks of rapid model degradation if low-quality or adversarial data enters the training stream. ATAM evaluations examine online learning architectures for data validation controls and the ability to roll back model updates when performance degrades.

**Example:** An online learning architecture for a click-through rate prediction model updates model parameters with each observed click or non-click event in real time, keeping the model adapted to evolving user preferences without waiting for nightly batch retraining.

#### Organizational Context

The set of environmental factors surrounding a software system, including the organization's structure, culture, processes, governance, existing technology portfolio, and strategic direction, that constrain and shape architectural decisions.

ATAM evaluators examine organizational context to assess whether identified architectural risks are real risks in the actual organizational environment. A risk that would be critical in one organizational context may be acceptable in another.

**Example:** An organization with a small, highly skilled operations team may find that a complex Kubernetes-based architecture represents a higher operational risk than the same architecture would for an organization with dedicated platform engineering resources.

#### Penetration Testing in Arch

The planned, authorized simulation of attacks against a software system by security professionals to identify exploitable vulnerabilities in the security architecture, providing empirical evidence of security control effectiveness or gaps.

Penetration testing validates the security architecture by attempting to exploit the scenarios identified in ATAM security analysis. A penetration test that successfully exploits a scenario classified as a non-risk indicates an error in the architectural analysis that must be corrected.

**Example:** A penetration test of an API gateway finds that the authorization middleware can be bypassed by manipulating JWT token fields that are not validated, confirming a security risk missed in the ATAM evaluation and requiring an architectural fix before production deployment.

#### Performance Bottleneck

A component, resource, or architectural decision that limits the overall performance of a software system by operating at or near its capacity while other components have remaining capacity, causing requests to queue or be throttled at that point.

Performance bottlenecks are what ATAM performance scenarios expose in the architecture. Identifying bottlenecks is the prerequisite to applying effective performance tactics; applying tactics to non-bottleneck components has no measurable effect on overall performance.

**Example:** An ATAM evaluation identifies the single-threaded order processing queue consumer as a performance bottleneck: at peak load, orders queue faster than the consumer can process them, increasing average processing latency even though the API gateway and database have spare capacity.

#### Performance Profiling

The systematic measurement of a software system's resource consumption and time expenditure across its components during execution, used to identify performance bottlenecks and validate that architectural decisions produce the expected performance improvements.

Performance profiling validates ATAM performance analysis by providing empirical data about actual system behavior. When profiling results contradict the architectural analysis, the discrepancy reveals either a gap in the analysis or an implementation that does not conform to the architecture.

**Example:** A performance profile of a checkout API reveals that 70% of response time is consumed by three sequential database queries that could be parallelized or replaced with a single join query, enabling a targeted architectural optimization rather than general infrastructure scaling.

#### Performance Quality Attribute

The quality attribute characterizing a software system's ability to meet timing requirements, including response time, throughput, and resource utilization, under specified workload conditions.

Performance is frequently in tension with security (encryption overhead), modifiability (abstraction layers), and availability (consistency in replicated systems). ATAM evaluations surface these tradeoffs explicitly through performance scenarios.

**Example:** A performance quality attribute scenario for a stock trading system specifies that the order matching engine processes 50,000 orders per second with worst-case latency of 5 milliseconds during normal market conditions.

#### Performance Scenario

A quality attribute scenario that specifies the system's required response to a defined workload event in terms of timing, throughput, or resource utilization, used to evaluate whether the architecture's performance-related decisions can achieve stated goals.

Performance scenarios are analytically rich because they require examination of the entire request processing path, identifying bottlenecks at each architectural boundary from input receipt to response delivery.

**Example:** A performance scenario specifies that when a batch of 100,000 product price updates arrives, the pricing service updates all records and publishes change events to subscribers within 60 seconds under normal production load.

#### Performance Tactic

An architectural decision that influences the achievement of performance quality attribute requirements by controlling resource demand, managing resource allocation, or improving resource arbitration within a software system.

Performance tactics are the analytical building blocks ATAM uses to evaluate performance architecture. Evaluators examine which tactics the architecture employs — caching, load balancing, concurrency — and whether their combination is sufficient to satisfy performance scenario response measures.

**Example:** Applying the "increase resources" performance tactic by adding CPU cores to the transaction processing server directly addresses a throughput scenario requirement, while the "scheduling policy" tactic (priority queuing) addresses latency scenarios for high-priority transactions.

#### Pipe-and-Filter Architecture

An architectural style in which data is transformed by a sequence of processing components (filters) connected by communication channels (pipes), each filter consuming input data, transforming it, and producing output data for the next filter.

Pipe-and-filter architecture promotes modifiability (filters can be reordered, replaced, or added) and enables parallel processing but may introduce performance overhead from data copying between filters. ATAM evaluations examine throughput and latency scenarios for data-intensive pipeline systems.

**Example:** A data analytics pipeline uses pipe-and-filter architecture with filters for data ingestion, cleansing, transformation, enrichment, and output, allowing individual filters to be replaced with improved implementations without affecting the pipeline structure.

#### Plugin Architecture Pattern

An architectural pattern in which a core system defines extension points — standardized interfaces for adding functionality — and external plugin components are developed to implement those interfaces, enabling capability extension without modifying the core system.

Plugin architectures achieve modifiability for anticipated extension scenarios without the risks of modifying core logic. ATAM evaluations examine plugin architectures for the stability of the plugin interface contract and the performance overhead of the extension mechanism.

**Example:** A data processing platform defines a plugin interface for data source connectors; new database types can be integrated by implementing the connector interface and registering the plugin, without modifying the processing engine.

#### Portability Quality Attribute

The quality attribute characterizing the ease with which a software system or component can be transferred from one hardware, software, or organizational environment to another, free from environment-specific dependencies.

Portability is particularly relevant in cloud migration contexts and in product software sold to customers with diverse technical environments. ATAM evaluations assess portability by examining architectural dependencies on specific platforms or vendor services.

**Example:** A portability scenario specifies that the analytics module runs without modification on any cloud provider's managed Kubernetes service, using only CNCF-standard APIs and avoiding vendor-specific extensions.

#### Post-Evaluation Review

A structured retrospective conducted after an ATAM evaluation is complete, in which the evaluation team assesses the quality of the evaluation process, the completeness of findings, and lessons learned for improving future evaluations.

Post-evaluation reviews enable organizations to improve their architecture evaluation capability over time. Without systematic reflection, the same process weaknesses and facilitation challenges recur across evaluations.

**Example:** A post-evaluation review identifies that the architecture briefing was too detailed and consumed too much of the available time, leading to a decision to shorten future briefings and distribute architecture documentation for pre-reading before the evaluation begins.

#### Priority Negotiation

The structured process by which ATAM participants with different perspectives reach agreement on the relative priority of quality attribute scenarios in the utility tree, surfacing and resolving conflicts between competing stakeholder priorities.

Priority negotiation transforms the utility tree from a technical artifact into an organizational agreement. When stakeholders from different groups jointly negotiate priorities, the result reflects genuine organizational consensus rather than any single group's preferences.

**Example:** During negotiation, developers advocate for modifiability scenarios to support rapid feature development while operations argues for availability; negotiation results in availability rated highest with a documented rationale about revenue impact of downtime.

#### Privacy by Design

An architectural approach in which privacy protections — including data minimization, purpose limitation, user consent management, and data subject rights — are integrated into the system's structure from the beginning rather than added as compliance measures after design is complete.

Privacy by design is a regulatory expectation under GDPR and similar frameworks. ATAM evaluations examine privacy-by-design implementations for the architectural mechanisms that enforce data minimization, consent tracking, and the right to erasure across the system's data stores.

**Example:** A privacy-by-design architecture collects only the specific user attributes required for each feature, stores consent records in a dedicated consent management service, and implements a cascading data deletion capability that removes personal data from all databases, caches, and logs within 30 days of an erasure request.

#### Prompt Engineering

The practice of designing, structuring, and optimizing the input text provided to a large language model to reliably produce outputs that meet specified quality, accuracy, format, and safety requirements for a given application.

Prompt engineering is an architectural concern because prompt design affects LLM system quality attributes including output consistency, latency (prompt length affects inference time), and cost (token count directly affects API cost). ATAM evaluations may examine prompt design as a sensitivity point for LLM system quality attributes.

**Example:** A structured prompt template for a legal document summarization system includes explicit instructions for output format, examples of acceptable summaries, and constraints on output length, improving output consistency from 60% to 90% adherence to the required format.

#### Publish-Subscribe Pattern

An architectural messaging pattern in which message producers (publishers) broadcast events or messages to a topic without knowledge of which consumers will receive them, and consumers (subscribers) register interest in specific topics and receive only matching messages.

The publish-subscribe pattern enables the addition of new consumers without modifying publishers, making it a powerful modifiability tactic. ATAM evaluations examine pub-sub designs for the ordering and delivery guarantees provided by the messaging infrastructure.

**Example:** A stock price update service publishes price events to a "prices" topic; trading algorithm services, reporting services, and alert services each subscribe independently, allowing new consumers to be added without modifying the price publishing service.

#### Quality Attribute Branch

A first-level branch of the ATAM utility tree representing a single major quality attribute — such as performance, availability, security, or modifiability — as a primary dimension of system utility against which scenarios are organized and evaluated.

Quality attribute branches provide the organizing framework for ATAM scenario analysis. Each branch is analyzed using attribute-specific analytical techniques, with scenarios mapped to the architectural decisions relevant to that attribute.

**Example:** The "Security" branch of a utility tree for a banking API contains sub-attributes for authentication, authorization, and data privacy, with specific scenarios under each mapped to corresponding security architecture mechanisms.

#### Quality Attribute Conflict

The condition in which improving a system's architecture with respect to one quality attribute necessarily degrades it with respect to another, creating a tradeoff requiring an explicit decision rather than resolution by better design.

Quality attribute conflicts are what ATAM calls "tradeoff points" — architectural decisions that unavoidably sacrifice one attribute for another. Making conflicts explicit is essential because unacknowledged conflicts lead to designs that satisfy neither attribute adequately.

**Example:** Adding TLS encryption to all inter-service communication improves security but increases CPU utilization by approximately 15%, creating an explicit security-versus-performance conflict requiring an architectural decision.

#### Quality Attribute Definition

A named, measurable property of a software system that characterizes its behavior or structure under specified conditions, distinct from functional requirements, and used to evaluate how well the system satisfies non-functional stakeholder concerns.

Quality attributes are the central analytical unit of ATAM. The entire ATAM process is organized around eliciting, prioritizing, and analyzing quality attributes through scenarios, making a precise understanding of what constitutes a quality attribute essential.

**Example:** "The system shall process 10,000 payment transactions per second with a 95th-percentile response time below 50 milliseconds under peak holiday load" is a quality attribute statement specifying performance with measurable parameters.

#### Quality Attribute Prioritization

The process of rank-ordering quality attributes by their relative importance to the system's stakeholders and business goals, producing a ranked list that guides ATAM analysis toward the decisions most critical to system success.

Prioritization is necessary because evaluating all quality attributes with equal depth is impractical. ATAM's utility tree provides a structured mechanism for stakeholders to express and negotiate priorities before analytical effort is allocated.

**Example:** Quality attribute prioritization for a payment processing system ranks security first (regulatory requirement), availability second (revenue impact), performance third (user experience), and modifiability fourth, focusing evaluation depth accordingly.

#### Quality Attribute Requirement

A statement that specifies a measurable, testable quality property that a software system must possess under defined conditions, expressed in terms of stimulus, environment, response, and response measure.

Quality attribute requirements are the primary inputs to ATAM scenario analysis. Unlike functional requirements, quality attribute requirements constrain the set of viable architectural approaches and make certain decisions sensitive or risky.

**Example:** "When 10,000 concurrent users submit search queries during peak load, 99% of queries shall return results within 500 milliseconds, as measured at the load balancer" is a complete quality attribute requirement.

#### Quality Attribute Scenario

A short, structured narrative that describes a specific quality attribute requirement in terms of stimulus source, stimulus, system environment, artifact affected, required system response, and measurable response measure.

Quality attribute scenarios are the primary analytical instrument of ATAM, transforming vague quality goals into specific testable statements mappable to architectural decisions and enabling systematic evaluation of whether an architecture can achieve its goals.

**Example:** Source: malicious external actor; Stimulus: SQL injection through login form; Environment: normal operation; Artifact: authentication service; Response: request rejected and logged; Response measure: zero successful injections in penetration testing.

#### Quality Attribute Tactic Catalog

A structured reference collection of named architectural tactics organized by quality attribute, documenting how each tactic addresses a specific quality concern, what it trades off, and examples of application.

The tactic catalog provides ATAM evaluation teams with a systematic means of examining whether an architecture uses appropriate tactics for its quality attribute goals and identifying gaps where relevant tactics are missing or misapplied.

**Example:** The availability tactic catalog includes heartbeat monitoring (fault detection), active redundancy (fault recovery), and removal from service (fault prevention), each with documented effects on availability, performance, and cost.

#### Quality Attribute Taxonomy

A hierarchical classification system that organizes software quality attributes into categories and sub-categories, providing a comprehensive, structured framework for identifying all relevant quality concerns during architecture evaluation.

Quality attribute taxonomies such as ISO 25010 provide ATAM teams with a checklist to ensure no important quality dimension is overlooked during scenario elicitation. Taxonomies help structure the utility tree and guide brainstorming sessions.

**Example:** The SEI quality attribute taxonomy organizes attributes into runtime (availability, performance, security, usability) and development-time (modifiability, portability, reusability, testability) categories, helping ATAM teams ensure both dimensions are evaluated.

#### Quality Attribute Workshop

A facilitated collaborative session in which stakeholders and evaluation team members work together to elicit, refine, and prioritize quality attribute scenarios using brainstorming and the utility tree framework.

The Quality Attribute Workshop (QAW) is used both as a component of ATAM Phase 2 and as a standalone technique during architecture design. It ensures scenarios reflect the full range of stakeholder concerns rather than only the evaluation team's perspective.

**Example:** A QAW for a smart grid system runs four hours with utility engineers, IT architects, and regulators, producing 35 prioritized scenarios spanning availability, security, and real-time performance quality attributes.

#### Quality Model

A structured classification of software quality characteristics organized into a hierarchy of quality attributes, sub-attributes, and measurable metrics that provides a common framework for specifying and evaluating software quality.

Quality models such as ISO 25010 provide ATAM teams with a systematic vocabulary for identifying all relevant quality concerns. Without a structured model, evaluations risk overlooking important quality dimensions that stakeholders care about.

**Example:** The ISO 25010 quality model organizes quality into eight top-level characteristics (functional suitability, performance efficiency, compatibility, usability, reliability, security, maintainability, and portability), each decomposed into measurable sub-characteristics.

#### RAG Architecture

Retrieval-Augmented Generation architecture, a design pattern in which a large language model's responses are augmented by dynamically retrieving relevant documents or data from an external knowledge base and including that information in the model's input context.

RAG architecture improves LLM response accuracy and currency without the cost of model fine-tuning or retraining. ATAM evaluations examine RAG designs for the retrieval quality (incorrect retrievals produce hallucinations), retrieval latency (contributing to overall response time), and knowledge base freshness.

**Example:** A RAG architecture for a customer support system retrieves the three most relevant product manual sections from a vector database when a customer asks a technical question, providing the LLM with accurate product-specific context rather than relying on the model's training knowledge.

#### Recovery Point Objective (RPO)

The maximum acceptable amount of data loss — measured as a time duration — that a software system may experience following a failure event, defining how recently data must have been backed up or replicated to meet business continuity requirements.

RPO is a data availability quality attribute that directly constrains backup frequency, replication lag, and data persistence architecture. ATAM evaluations examine whether the data persistence architecture can achieve the RPO under the failure scenarios relevant to the system.

**Example:** An RPO of 5 minutes for an e-commerce order system means that after a complete database failure, at most 5 minutes of order data may be lost; this requires continuous replication with sub-5-minute synchronization lag rather than hourly backups.

#### Recovery Time Objective (RTO)

The maximum acceptable time duration within which a software system must be restored to operational status following a failure or disaster event, defining the allowable downtime from the perspective of business operations.

RTO is the response measure for ATAM availability and disaster recovery scenarios. The architectural mechanisms for fault detection, automated failover, and manual recovery procedures are evaluated against the RTO to determine whether the architecture can achieve recovery within the business-defined time constraint.

**Example:** An RTO of 15 minutes for a payment processing system means that after a complete system failure, all transaction processing must resume within 15 minutes; this requirement drives architectural decisions about automated failover, database replication lag, and DNS propagation time.

#### Redundancy Tactic

An architectural availability tactic in which duplicate components, data copies, or communication paths are maintained so that the failure of a primary element can be compensated by activating a standby, preventing service interruption.

Redundancy is the most direct mechanism for achieving high availability, but it increases infrastructure cost and introduces synchronization complexity. ATAM evaluations examine redundancy architectures for the tradeoff between availability (redundancy depth) and cost (resource multiplication).

**Example:** A primary-secondary database redundancy configuration maintains a continuously synchronized replica; when the primary fails, the load balancer routes all traffic to the replica within 15 seconds, meeting the availability scenario's recovery time requirement.

#### Reference Architecture

A predefined architectural template for a class of systems within a specific domain that captures proven architectural decisions, common components, and their relationships to guide the development of concrete architectures in that domain.

Reference architectures accelerate ATAM evaluations because the evaluation team can leverage documented knowledge of the reference architecture's known strengths and weaknesses rather than reasoning from first principles about every design decision.

**Example:** The AUTOSAR reference architecture for automotive software systems defines a standard layered structure separating application software from the runtime environment and microcontroller abstraction layer, enabling safety-critical evaluation using well-understood patterns.

#### Reliability Quality Attribute

The quality attribute characterizing a software system's ability to perform its required functions correctly and consistently over a specified period under specified operating conditions, including resistance to failure and behavior when failures occur.

Reliability encompasses both failure frequency (related to availability) and failure consequences (related to correctness and safety). ATAM evaluations examine reliability by mapping failure mode scenarios to the architectural mechanisms that detect, contain, or recover from failures.

**Example:** A reliability scenario specifies that the order processing system correctly completes or rolls back any transaction interrupted by a network failure, ensuring no order is lost and no payment is charged without a corresponding order record.

#### Replication Tactic

An architectural tactic in which copies of a component's data or state are maintained in multiple locations to improve availability (surviving node failures), performance (local reads), and scalability (distributed read capacity).

Replication introduces consistency challenges because replicas may temporarily diverge. ATAM evaluations examine replication designs for the tradeoff between consistency (strong vs. eventual) and availability, particularly for systems that must decide how to handle requests when replicas are out of sync.

**Example:** A globally distributed database uses multi-region replication to serve read requests from the geographically closest replica, reducing latency for international users, but requires careful configuration of conflict resolution for concurrent writes to the same record.

#### Response Time

The total elapsed time from when a user or system initiates a request until the system delivers the complete response, including network latency, server processing time, database query time, and any intermediate service call durations.

Response time is the user-visible measure of system performance and is typically the metric specified in ATAM performance scenarios. Response time is decomposed into its constituent parts during architectural analysis to identify which component contributes most to the total and where optimization would be most effective.

**Example:** Decomposing a 450ms API response time reveals 50ms network latency, 100ms authentication overhead, 200ms database query, and 100ms JSON serialization; the database query is the dominant contributor and the primary target for performance optimization.

#### Responsible AI Architecture

The structural design of architectural components, processes, and governance mechanisms that ensure an AI system operates in alignment with ethical principles, regulatory requirements, and organizational values, including fairness, transparency, privacy, and human oversight.

Responsible AI architecture translates ethical AI principles into concrete architectural decisions about bias detection, human-in-the-loop controls, model auditing, and governance processes. ATAM evaluations increasingly include responsible AI scenarios as AI systems are deployed in high-stakes domains.

**Example:** A responsible AI architecture for a hiring recommendation system includes demographic fairness monitoring (alerting when recommendation rates differ significantly across protected groups), human review requirements for all recommendations, and a bias audit trail capturing model inputs and outputs for regulatory review.

#### REST Architecture Style

The Representational State Transfer architectural style for distributed hypermedia systems, characterized by uniform interfaces (HTTP verbs), resource-based addressing (URIs), stateless interactions, and layered system organization enabling scalability and caching.

REST has become the dominant API style for web services. ATAM evaluations examine REST implementations for performance (HTTP overhead, payload size), security (authentication, authorization), and interoperability (API versioning, content negotiation) scenarios.

**Example:** A REST API for a product catalog uses HTTP GET /products/{id} for retrieval, HTTP PUT for updates, and HTTP DELETE for removal, with responses in JSON format, enabling any HTTP-capable client to integrate without client-specific libraries.

#### Retry Pattern

A fault tolerance pattern in which a component automatically re-attempts a failed operation a limited number of times with configurable delay intervals, recovering from transient failures such as network timeouts without requiring external intervention.

The retry pattern improves resilience to transient failures but can amplify load on an already-struggling dependency if not combined with exponential backoff and jitter. ATAM evaluations examine retry designs for the interaction between the retry pattern and circuit breaker patterns.

**Example:** A payment service client implements exponential backoff retries: on failure, it waits 100ms, then 200ms, then 400ms before each retry, avoiding a thundering herd of retries that would overwhelm a recovering payment processor.

#### Risk Classification

The categorization of identified architectural risks by severity, probability, and the quality attribute they affect, enabling prioritization of risk communication and remediation planning based on business impact.

Risk classification helps evaluation consumers focus remediation resources on the most critical risks. Without classification, all risks appear equally important, making it difficult to determine which require immediate architectural changes versus which can be accepted or monitored.

**Example:** Risk classification categorizes the absence of a message broker failover mechanism as High severity (complete service outage), High probability (broker is a single point of failure), affecting Availability — classifying it as the highest-priority risk in the evaluation.

#### Risk Communication

The process of conveying identified architectural risks from the ATAM evaluation team to relevant stakeholders, including technical teams, management, and executive sponsors, in forms appropriate to each audience's level of technical knowledge and decision-making authority.

Effective risk communication determines whether ATAM findings are acted upon or archived. Technical risks must be translated into business terms for executive sponsors, while implementation teams need sufficient technical detail to understand the required remediation.

**Example:** Risk communication for a security risk identified in ATAM involves presenting a technical memo to the security architecture team detailing the missing authentication mechanism and a one-page executive summary quantifying the regulatory exposure the risk represents.

#### Risk Identification

The process of examining architectural decisions against quality attribute scenarios to discover decisions that may prevent the system from achieving its quality goals, through systematic analysis of architectural approaches, gaps in coverage, and interactions between decisions.

Risk identification is the core analytical activity of ATAM, conducted by mapping each high-priority scenario from the utility tree against the architectural approaches and examining whether the architecture has a credible mechanism to achieve the scenario's response measure.

**Example:** Risk identification for a distributed caching scenario reveals that the architecture has no documented cache invalidation strategy for the case where a product price update arrives while thousands of cached catalog pages reference the old price.

#### Risk Mitigation Strategy

A planned set of architectural changes, operational procedures, or monitoring mechanisms designed to reduce the probability or severity of an identified architectural risk, documented with an implementation plan and success criteria.

Risk mitigation strategies are the actionable outputs of ATAM that drive post-evaluation architectural improvement. Each high-priority risk should have a corresponding mitigation strategy that the architecture team can implement, enabling the evaluation to produce concrete architectural improvement.

**Example:** The risk mitigation strategy for a single-broker availability risk includes: implementing broker clustering (reduces probability), adding circuit breakers in all broker clients (reduces severity), and defining a manual fallback procedure (limits impact duration).

#### Risk Monitoring

The ongoing process of tracking whether identified architectural risks are being mitigated, whether new risks emerge, and whether the current risk profile remains acceptable as the system evolves after an ATAM evaluation.

Risk monitoring extends the value of ATAM beyond the evaluation event. Without ongoing monitoring, risks identified during evaluation may be temporarily addressed but re-emerge as the system evolves, or new risks may develop without the organization's awareness.

**Example:** A team implements automated architectural conformance checks that flag any new direct database dependency created in a service that should route through the data access layer, monitoring for architectural drift that would reintroduce a previously mitigated coupling risk.

#### Risk Probability Assessment

The evaluation of how likely an architectural risk is to materialize under normal operating conditions, considering the frequency of the triggering stimulus, the fragility of the relevant architectural mechanism, and any existing mitigations.

Probability assessment distinguishes theoretical risks from likely operational problems. A risk with high impact but very low probability may be accepted; a risk with moderate impact but high probability may require immediate architectural change.

**Example:** The risk that a primary database server fails during normal operation is assessed as Low probability for a system running on enterprise hardware with vendor SLAs but High probability for a system running on commodity hardware without monitoring.

#### Risk Register

A structured artifact that documents all identified architectural risks from an ATAM evaluation, recording each risk's description, classification, severity, probability, risk theme, affected quality attribute, and recommended mitigation actions.

The risk register is the primary operational output of an ATAM evaluation, serving as the basis for post-evaluation architectural improvement planning. Organizations that maintain living risk registers use them to track risk mitigation progress after the evaluation concludes.

**Example:** A risk register for a cloud migration evaluation contains 15 entries, each with a risk description, severity (H/M/L), probability (H/M/L), affected quality attribute, risk theme, and a recommended mitigation strategy with an estimated implementation effort.

#### Risk Severity Assessment

The evaluation of the potential impact of an architectural risk on the system's quality attribute goals and business outcomes, assessing how significantly the quality attribute would be degraded if the risk materializes.

Severity assessment contextualizes individual risks relative to business impact. A technical risk that is architecturally complex may have low business severity; a simpler risk that would cause regulatory non-compliance may have very high business severity.

**Example:** A risk that cache inconsistency may show users outdated prices for up to 60 seconds is assessed as Low severity for a general product catalog but High severity for a real-time trading platform where stale prices could cause financial losses.

#### Risk Theme

A higher-level pattern or category that groups related architectural risks identified during an ATAM evaluation, enabling the evaluation team to communicate the significance of multiple related risks as a coherent concern rather than an undifferentiated list.

Risk themes help evaluation consumers understand the structure of identified risks. An executive reading a report with 12 individual risks may not see their significance; grouping them into three risk themes (data consistency, security boundary, operational complexity) communicates the architectural situation more effectively.

**Example:** Four individual risks about cache invalidation timing, database replica lag, eventual consistency windows, and distributed transaction rollback are grouped into a risk theme labeled "Data Consistency," communicating a systemic architectural concern rather than four unrelated issues.

#### Risk Theme Documentation

The written record that groups related architectural risks under a common theme name, provides a narrative explanation of the systemic architectural concern the theme represents, and lists the individual risks that contribute to the theme.

Risk theme documentation helps evaluation stakeholders understand the significance and scope of identified risks as architectural patterns rather than isolated defects, enabling more effective communication and prioritization of remediation investment.

**Example:** Risk theme documentation for "Distributed State Management" covers three individual risks about session state replication, cache consistency, and distributed lock contention, explaining that the architecture lacks a coherent strategy for managing shared state across distributed components.

#### Risk-Driven Architecture

An architectural approach in which design decisions are explicitly motivated by identified risks to quality attribute goals, with the most significant architectural investments made where risk analysis indicates the greatest uncertainty or potential for quality attribute failure.

Risk-driven architecture aligns architectural effort with business impact. ATAM is the mechanism for identifying which risks justify architectural investment; without systematic risk identification, teams may spend effort on low-risk areas while high-risk structural weaknesses go unaddressed.

**Example:** A risk-driven architecture for a real-time payment system invests heavily in the transaction processing and fault detection components — where risk analysis identifies the highest quality attribute risk — while using simpler approaches for reporting and administration, which pose lower risk.

#### ROI of Architecture Evaluation

The return on investment calculation for conducting a formal architecture evaluation such as ATAM, comparing the cost of the evaluation against the expected value of risks identified and avoided before implementation.

ROI calculations for architecture evaluation are important for securing organizational investment in methods like ATAM. Studies at the CMU SEI document that every dollar spent on architecture evaluation has prevented multiple dollars of rework cost.

**Example:** An ATAM evaluation costing $50,000 in team time identifies two architectural risks that, if addressed in production, would each have required approximately $500,000 in rework, yielding a 20:1 return on evaluation investment.

#### SAAM Method

The Software Architecture Analysis Method, a predecessor to ATAM developed at the CMU SEI, which evaluates software architectures by mapping change scenarios to architectural components to identify components that must be modified to accommodate each scenario, surfacing indirectly supported scenarios as risks.

SAAM established the principle that architecture evaluation should be driven by scenarios and involve stakeholders in their creation. Its limitation — focusing primarily on modifiability — motivated the development of ATAM's broader quality attribute coverage.

**Example:** A SAAM evaluation of a desktop application identifies that 60% of proposed change scenarios require modifications to a single monolithic component, indicating that component is a risk because any change creates a large, high-impact modification.

#### Safety Quality Attribute

The quality attribute characterizing a software system's ability to avoid reaching states in which it causes unacceptable harm to human life, property, or the environment, even in the presence of hardware failures, software faults, or operator errors.

Safety requirements typically override other quality attribute tradeoffs and impose specific architectural constraints such as fail-safe defaults and defense-in-depth. ATAM evaluations treat safety scenarios as absolute constraints rather than negotiable priorities.

**Example:** A safety scenario for a radiation therapy control system specifies that any single software fault shall not result in delivery of more than 10% of the prescribed dose, requiring redundant monitoring circuits with independent shutdown authority.

#### Saga Transaction Pattern

A distributed transaction management pattern in which a long-lived transaction is decomposed into a sequence of local transactions, each publishing events that trigger the next step, with compensating transactions defined to undo completed steps on failure.

Sagas address the distributed transaction problem in microservices without requiring two-phase commit, but they introduce complexity in failure handling and may leave systems in temporarily inconsistent states. ATAM evaluations probe saga designs for reliability and consistency scenarios.

**Example:** An order fulfillment saga coordinates local transactions across Order, Payment, and Inventory services; if the Inventory step fails, compensating transactions reverse the Payment deduction and cancel the Order, restoring consistency without a distributed lock.

#### Scalability Quality Attribute

The quality attribute characterizing a software system's ability to handle increasing workload by adding resources, measured by the degree to which performance characteristics are maintained as load increases proportionally with added resources.

Scalability is distinct from raw performance — a system may perform well at low load but scale poorly. ATAM evaluations examine scalability by analyzing decisions about statelessness, data partitioning, and resource allocation against growth scenarios.

**Example:** A scalability scenario specifies that the user-facing API maintains sub-200ms response times when load doubles from 1,000 to 2,000 concurrent users by adding two application server instances without architectural changes.

#### Scalability Scenario

A quality attribute scenario that specifies required system behavior as load or data volume increases, measured by resource additions needed to maintain performance targets, used to evaluate whether the architecture supports required growth.

Scalability scenarios test architectural decisions about statelessness, data partitioning, and service decomposition. Systems with stateful components, shared databases, or tightly coupled services often fail scalability scenarios despite performing well at baseline.

**Example:** A scalability scenario specifies that as registered users grow from 100,000 to 1,000,000, the system maintains sub-500ms search response times by adding application server capacity proportionally, with no architectural changes required.

#### Scenario Artifact

The specific part of the software system — such as a component, connector, interface, data store, or the entire system — that is affected by the stimulus and must generate the required response.

Identifying the artifact focuses architectural analysis on relevant structural elements. When the artifact is a specific component, ATAM evaluators examine that component's design, connections, and resource requirements against the scenario's response measure.

**Example:** In a security scenario where the stimulus is an unauthorized access attempt, the artifact is the API gateway authentication module, directing evaluators to examine authentication logic, session management, and access control mechanisms.

#### Scenario Brainstorming

The group ideation process used in ATAM workshops to generate a broad and diverse set of quality attribute scenarios, in which participants from multiple stakeholder groups contribute scenarios without premature evaluation or filtering.

Brainstorming's effectiveness depends on participant diversity. Each stakeholder group contributes scenarios reflecting unique operational experience and concerns, producing a more comprehensive scenario set than any single group could generate.

**Example:** A brainstorming session for an e-commerce platform generates 45 scenarios in 90 minutes, including performance scenarios from developers, availability scenarios from operations, security scenarios from security team, and usability scenarios from customer service.

#### Scenario Catalog

A curated, organized collection of quality attribute scenarios — including both general and concrete scenarios — that serves as a reference resource for ATAM evaluation teams and as institutional memory for future evaluations of similar systems.

Scenario catalogs reduce the effort required to generate comprehensive scenario sets by providing tested starting points. Organizations conducting multiple ATAM evaluations build catalogs from accumulated experience that accelerate subsequent evaluations.

**Example:** A financial services firm maintains a catalog of 150 scenarios across security, availability, and performance derived from ten years of ATAM evaluations, which teams use as a starting point for new system evaluations.

#### Scenario Coverage Assessment

The evaluation of how completely a set of quality attribute scenarios represents the full range of stakeholder concerns, quality attributes, and operational conditions relevant to the system, identifying gaps where important dimensions are underrepresented.

Coverage assessment ensures ATAM evaluations do not miss important risk categories. A scenario set covering performance extensively but including few security scenarios provides false confidence about security architecture quality.

**Example:** A coverage assessment reveals that all 30 generated scenarios address normal operating conditions but none address behavior during partial infrastructure failure, prompting a brainstorming round focused on degraded-mode scenarios.

#### Scenario Environment

The operational state of the software system at the time the stimulus arrives, including whether the system is in normal operation, peak load, degraded mode, or maintenance, affecting how the system responds.

The environment dimension is critical because many architectural risks are environment-specific. A system handling normal operation well may fail catastrophically under stress; ATAM evaluations specifically probe degraded-mode scenarios.

**Example:** A scenario environment of "during primary database maintenance with the replica serving all read traffic" establishes a degraded context that may expose availability risks not present during normal operation.

#### Scenario Importance vs Effort

The analytical comparison of how important a scenario is to system success against how much architectural effort is required to satisfy it, used to identify scenarios where the investment is disproportionate to the business value.

This comparison identifies architectural inefficiencies and misaligned priorities. Scenarios that are low importance but require high architectural effort may represent over-engineering; high-importance scenarios receiving low investment represent risks.

**Example:** If 99.999% availability for a non-critical reporting feature requires expensive multi-region active-active infrastructure, ATAM identifies this as a mismatch and recommends relaxing the availability requirement for that specific feature.

#### Scenario Prioritization

The process of rank-ordering the full set of generated scenarios by their relative importance to the system's success, typically using stakeholder voting weighted by business importance, to focus evaluation analysis on the most critical scenarios.

Scenario prioritization is necessary because evaluating every generated scenario with equal depth is impractical. By focusing deep analysis on the highest-priority scenarios, ATAM maximizes the value of limited evaluation time.

**Example:** After generating 45 scenarios, stakeholders vote with five votes each, producing a prioritized list where the top 10 scenarios receive the majority of votes and are analyzed in depth while remaining scenarios are noted as lower-priority.

#### Scenario Response

The behavioral or structural change that the software system must exhibit in reaction to the scenario's stimulus, describing what the system does — or avoids doing — in terms observable to relevant stakeholders.

The response must be architecturally significant — it should require specific architectural mechanisms. A response achievable by any implementation provides no basis for architectural analysis; one requiring a circuit breaker enables meaningful evaluation.

**Example:** In an availability scenario, the response is "the system continues accepting and processing payment transactions without interruption and without operator intervention," specifying autonomous recovery requiring specific architectural mechanisms.

#### Scenario Response Measure

The quantitative or qualitative criterion by which the adequacy of a system's response to a stimulus is assessed, making acceptance criteria specific, observable, and testable rather than subjective.

Response measures transform scenarios from qualitative goals into architectural requirements. Without a response measure, "the system shall be available" cannot be evaluated architecturally; with "99.99% uptime over any 30-day period," the requirement drives specific redundancy decisions.

**Example:** "95th percentile response time under 200ms, 99th percentile under 500ms, zero requests exceeding 2 seconds during the described load condition" makes a performance scenario precisely testable through load testing.

#### Scenario Stimulus

The specific condition or event generated by the stimulus source that arrives at or within the software system and triggers a response, defining precisely what the system must react to in a quality attribute scenario.

The stimulus must be specific enough to drive architectural analysis. A vague stimulus such as "high load" cannot be mapped to architectural decisions; a precise stimulus such as "5,000 concurrent write transactions per second" enables concrete analysis.

**Example:** In a modifiability scenario, the stimulus is "a new regulatory requirement mandates that all transaction logs include a customer consent identifier," specifying exactly what change must be accommodated to enable analysis of modification scope.

#### Scenario Stimulus Source

The entity — such as a user, system, attacker, operator, or environmental condition — that generates the stimulus in a quality attribute scenario, providing context for understanding the scenario's realism and the required architectural response.

The stimulus source helps ATAM evaluators determine whether an architectural response is realistic. A response requiring human intervention may be appropriate for an administrative event but insufficient for a real-time transaction stimulus.

**Example:** In a performance scenario, the stimulus source is "10,000 simultaneous mobile application users initiating session login," specifying that load originates externally from end-user devices rather than from an internal batch process.

#### Schema Registry

An architectural component that manages the version history of data structure definitions (schemas) for messages, APIs, or data formats, enabling producers and consumers to agree on data structure definitions and detect compatibility changes before they cause integration failures.

Schema registries are an interoperability tactic that prevents the distributed systems problem of message format incompatibility between producers and consumers. ATAM evaluations examine schema registry architectures for the enforcement of compatibility rules (backward, forward, or full) and the process for managing schema evolution.

**Example:** A schema registry validates that every new Avro schema version for an event topic is backward compatible with all existing consumer schema versions before allowing producers to publish the new format, preventing consumers from failing when producers add new fields.

#### Scripted Architecture Briefing

A carefully prepared presentation by the architecture owner that follows a defined structure and scope, covers all information the evaluation team requires for analysis, and is rehearsed to fit within the allocated time without improvisation.

Scripted briefings contrast with ad-hoc architectural presentations. The discipline of scripting forces the architecture owner to organize their thinking, identify gaps in documentation, and prioritize the information most relevant to the evaluation's quality attribute goals.

**Example:** The architecture owner prepares and rehearses a 60-minute scripted briefing covering the three primary architectural approaches (event-driven pipeline, synchronous API, and batch processing), demonstrating how each approach addresses the system's performance and reliability drivers.

#### Secret Management

The architectural capability for securely storing, distributing, rotating, and auditing sensitive configuration values — such as database credentials, API keys, and cryptographic keys — so that secrets are never embedded in code, configurations, or container images.

Secret management is a security architecture tactic that addresses one of the most common sources of security breaches: exposed credentials. ATAM evaluations examine secret management architectures for the automation of secret rotation and the auditing of secret access.

**Example:** A secret management architecture stores all service credentials in a managed vault, injects secrets as environment variables at container startup time using a sidecar, and automatically rotates database passwords every 30 days, auditing every secret access to a centralized log.

#### Secure Dev Lifecycle (SDLC)

A software development process in which security activities — including threat modeling, security requirements definition, code review, static analysis, penetration testing, and incident response planning — are integrated into each phase of the development lifecycle.

Secure SDLC practices ensure that security architecture decisions are implemented correctly and that security testing validates architectural security claims. ATAM evaluations examine whether the development process includes the security validation activities needed to verify that security scenarios are satisfied.

**Example:** A secure SDLC for a financial platform includes threat modeling during architecture design (inputs to ATAM), mandatory security code review for all changes, automated SAST scanning in CI/CD, quarterly penetration testing, and annual external security assessments.

#### Security Architecture Definition

The structured collection of security-related architectural decisions, mechanisms, patterns, and controls that collectively define how a software system protects its confidentiality, integrity, and availability objectives against identified threats.

Security architecture is evaluated holistically in ATAM rather than examined as isolated controls. A coherent security architecture provides layered defense against the threat scenarios in the utility tree, with each layer providing defense against the failure of the next.

**Example:** A security architecture for a healthcare platform combines network segmentation (perimeter), mutual TLS (transport), OAuth 2.0 with scoped tokens (API access), row-level security in the database (data access), and field-level encryption (data protection) as defense-in-depth layers.

#### Security Compliance

The condition in which a software system's security architecture meets the requirements of applicable regulatory frameworks, industry standards, and organizational policies, such as GDPR, PCI-DSS, HIPAA, or SOC 2, as verified through audits and assessments.

Security compliance is an architectural constraint in regulated industries. ATAM evaluations treat compliance requirements as hard constraints rather than quality attribute tradeoffs — architectural decisions that violate compliance requirements are classified as mandatory risks regardless of their functional impact.

**Example:** A payment processing system's security architecture is verified against PCI-DSS requirements, with ATAM identifying that inter-service communication in a proposed design violates PCI-DSS network segmentation requirements, classifying the deviation as a mandatory architectural risk.

#### Security Incident Response

The architectural capability for detecting security incidents, containing their impact, investigating their cause, remediating vulnerabilities, and recovering affected systems, as defined by a documented incident response plan with clear roles and automated support tooling.

Security incident response is an architectural recover-from-attacks tactic. ATAM evaluations examine incident response architectures for the automation of detection and containment and for the completeness of the response process against the security scenarios in the utility tree.

**Example:** A security incident response architecture automatically isolates a compromised service by removing it from the load balancer within 60 seconds of anomaly detection, preserving forensic evidence by taking a memory snapshot before termination, and triggering the incident response runbook in the on-call system.

#### Security Monitoring

The continuous collection and analysis of security-relevant events from software system components to detect potential attacks, unauthorized access, or anomalous behavior in real time, enabling rapid response to security incidents.

Security monitoring is a security detection tactic that ATAM evaluations examine for coverage of the threat scenarios in the utility tree. Monitoring that cannot detect the attack scenarios the architecture considers relevant represents a gap in the security architecture.

**Example:** A security monitoring architecture collects authentication failure events, privilege escalation attempts, and unusual API access patterns, correlating them in a SIEM to detect credential stuffing attacks within minutes of their initiation rather than days after the breach.

#### Security Quality Attribute

The quality attribute characterizing a software system's ability to protect its assets from unauthorized access, use, disclosure, modification, or destruction while permitting authorized access and operations.

Security is increasingly an architectural driver rather than an add-on. ATAM evaluations examine security architecture by mapping threat scenarios to architectural mechanisms and identifying where the architecture's security posture is insufficient.

**Example:** A security scenario for a healthcare portal specifies that an attacker attempting to access another patient's records through parameter manipulation is detected and denied within one request, with the attempt logged for audit.

#### Security Scenario

A quality attribute scenario that specifies the system's required response to a security-relevant event — such as an attack or unauthorized access attempt — in terms of detection, containment, and recovery.

Security scenarios use threat modeling to identify credible attacks and evaluate whether the architecture provides appropriate defenses. Scenarios the architecture cannot handle are identified as high-severity risks requiring architectural changes.

**Example:** A security scenario specifies that when a service account credential is compromised, the secrets management component automatically rotates the affected credential within 5 minutes and revokes all active sessions using that credential.

#### Security Scenario Development

The process of creating specific, realistic quality attribute scenarios for security evaluation in ATAM, describing threat actors, attack vectors, targeted assets, and required system responses, derived from threat modeling and security requirements analysis.

Security scenario development produces the analytical inputs needed to evaluate security architecture in ATAM. Well-developed security scenarios are grounded in realistic threat models and specify response measures that are testable through penetration testing or security reviews.

**Example:** A security scenario developed from threat modeling: Source: external attacker; Stimulus: automated SQL injection attempt against the product search API; Environment: normal operation; Artifact: API input validation layer; Response: attack blocked and logged; Response measure: zero successful injections in penetration testing.

#### Security Tactic

An architectural decision that protects a software system's assets from unauthorized access, modification, or denial, categorized into detecting attacks, resisting attacks, reacting to attacks, and recovering from attacks.

Security tactics provide the analytical vocabulary ATAM uses to evaluate security architecture. Evaluators map threat scenarios to the architectural mechanisms present and identify gaps where the system lacks appropriate detection, resistance, reaction, or recovery capabilities.

**Example:** The security tactics "authenticate actors" (resisting), "limit access" (resisting), "detect intrusion" (detecting), and "restore" (recovering) form a defense-in-depth strategy that ATAM evaluates against a scenario of credential compromise and data exfiltration.

#### Security Tactic Catalog

A structured reference collection of named security architectural tactics organized by security goal (detect attacks, resist attacks, react to attacks, recover from attacks), documenting how each tactic addresses specific security threats and its interactions with other quality attributes.

The security tactic catalog provides ATAM evaluation teams with a systematic means of assessing whether an architecture employs appropriate security mechanisms for each identified threat and identifying gaps in the security architecture's coverage.

**Example:** The security tactic catalog's "resist attacks" section includes tactics for authenticating actors, authorizing actors, limiting access, limiting exposure, encrypting data, and separating entities, each with documented effects on security, performance, and modifiability.

#### Sensitivity Analysis

In the ATAM context, the process of examining how the system's quality attribute outcomes change as specific architectural parameters — such as cache size, thread pool depth, or replication factor — are varied, identifying which parameters have the most influence on quality attribute achievement.

Sensitivity analysis helps ATAM evaluators identify sensitivity points by determining which architectural parameters, if changed, would most significantly affect quality attribute outcomes. Parameters with high sensitivity require careful configuration and monitoring.

**Example:** Sensitivity analysis of a caching architecture reveals that reducing cache TTL from 60 to 30 seconds doubles database load while only marginally improving data freshness, identifying the cache TTL as a high-sensitivity parameter for performance.

#### Sensitivity Point

An architectural decision that has a significant effect on one or more quality attribute responses, such that small changes to that decision produce large changes in the quality attribute outcome, making it a critical leverage point in the architecture.

Sensitivity points are primary ATAM outputs. Identifying them tells architects where the architecture is fragile with respect to quality attribute goals and where additional investment in design rigor or testing is warranted.

**Example:** In an event-driven system, the message broker's throughput configuration is a sensitivity point for performance: small changes in queue depth limits or consumer concurrency settings produce large changes in end-to-end transaction latency.

#### Separation of Concerns

An architectural principle in which a software system is organized so that each component addresses a distinct, well-bounded set of responsibilities, minimizing the overlap of concerns across components and thereby reducing coupling.

Separation of concerns is a key tactic for achieving modifiability and testability. ATAM evaluations examine whether an architecture properly separates concerns when modifiability is an architectural driver, because poor separation makes change expensive.

**Example:** A layered architecture separates presentation logic, business rules, and data access into distinct layers, so that changes to the user interface do not require modifications to business logic components.

#### Serverless Architecture

An architectural model in which application business logic is implemented as short-lived functions deployed to a cloud provider's managed execution environment, with the provider managing all infrastructure provisioning, scaling, and availability transparently.

Serverless architecture shifts operational responsibility to the cloud provider but introduces cold start latency, execution duration limits, and vendor lock-in risks. ATAM evaluations examine serverless designs for performance (cold start impact), cost (per-invocation pricing), and portability (vendor-specific API dependencies).

**Example:** A serverless architecture for an image processing pipeline executes thumbnail generation as a Lambda function triggered by S3 uploads, scaling automatically from zero to thousands of concurrent invocations without pre-provisioned servers.

#### Service Contract

A formal agreement between a service provider and its consumers that specifies the service's interface, including operation signatures, data formats, quality attribute properties (such as SLOs), and versioning commitments.

Service contracts are the architectural mechanism that enables independent evolution of service providers and consumers. ATAM evaluations examine service contract practices for the modifiability scenario of evolving a service interface without forcing simultaneous updates to all consumers.

**Example:** A service contract for the User Service specifies that the v2 API will remain available for at least 12 months after v3 is released, with both versions returning identically named fields for core user attributes, enabling consumers to migrate at their own pace.

#### Service Decomposition

The process of dividing a software system's business capabilities into distinct services with well-defined boundaries, independent data stores, and explicit interfaces, guided by domain boundaries, team structure, and quality attribute goals.

Service decomposition decisions are among the most consequential architectural decisions in microservices systems. ATAM evaluations examine whether decomposition boundaries align with expected change directions, data ownership principles, and team ownership for modifiability and operational quality attributes.

**Example:** Decomposing a monolithic ERP system into Finance, HR, Inventory, and Sales services based on business domain boundaries allows each service to evolve independently and be owned by a single team, supporting the modifiability goal of independent feature deployment.

#### Service Discovery

The mechanism by which a component in a distributed system dynamically determines the network location of a service it needs to communicate with, either through a central service registry (server-side discovery) or through each client querying the registry directly (client-side discovery).

Service discovery enables dynamic architectures that can scale instances in and out without requiring client reconfiguration. ATAM evaluations examine service discovery mechanisms for their behavior during registry unavailability and the staleness of cached endpoint information.

**Example:** In client-side service discovery, the Order Service queries the service registry for available Payment Service instances at startup and periodically refreshes the list, routing requests directly to the chosen instance without routing through a central gateway.

#### Service Level Indicator (SLI)

A quantitative measurement that captures a specific aspect of a service's behavior — such as the fraction of requests completing within a latency threshold or the fraction of successful requests — used to calculate whether a Service Level Objective is being met.

SLIs are the measurable signals that determine whether SLOs are satisfied in production. ATAM quality attribute scenario response measures are designed to be operationalizable as SLIs, providing a direct connection between architectural evaluation and production monitoring.

**Example:** An SLI for API latency measures the fraction of requests completing within 200ms, computed every minute from request logs; if the SLI falls below 99.9% over a 30-day window, the SLO is violated and an architectural investigation is triggered.

#### Service Level Objective (SLO)

A specific, measurable target for a service quality attribute — such as availability, latency, or error rate — expressed as a threshold that the service aims to meet over a defined time window, used to define the acceptable level of service quality for users.

SLOs translate ATAM quality attribute scenarios into operational commitments. The response measures in quality attribute scenarios often directly correspond to SLO targets, connecting the evaluation's findings to the operational metrics used to monitor quality attribute achievement in production.

**Example:** An SLO for an API service specifies 99.9% of requests must complete within 200ms, measured over any rolling 30-day window; this directly corresponds to the performance scenario in the utility tree and is monitored continuously to detect architectural drift from the design's performance target.

#### Service Mesh Architecture

An infrastructure layer in a microservices architecture that manages service-to-service communication through a dedicated proxy (sidecar) alongside each service instance, handling load balancing, service discovery, circuit breaking, mutual TLS, and observability without application code changes.

Service meshes operationalize many of the availability and security tactics that ATAM evaluations recommend for microservices architectures. ATAM evaluations examine whether the service mesh configuration correctly implements required circuit breaker, retry, and security policies.

**Example:** A service mesh (Istio) automatically applies mutual TLS to all inter-service communication, provides distributed tracing for every request, and enforces circuit breaker policies defined in configuration files, removing these concerns from individual service implementations.

#### Service Registry

A centralized directory in a microservices or distributed system architecture that maintains a list of available service instances with their network addresses, health status, and metadata, enabling dynamic service discovery without hard-coded endpoint configurations.

Service registries enable dynamic routing and automatic adaptation to instance failures and additions, supporting availability and scalability tactics. ATAM evaluations examine service registry designs for what happens when the registry itself fails, as it is a critical dependency.

**Example:** A service registry (Consul or Eureka) maintains a real-time list of healthy Order Service instances; the API gateway queries the registry before routing each request, automatically routing around failed instances without manual configuration changes.

#### Service-Oriented Architecture

An architectural style in which system functionality is decomposed into discrete, interoperable services with published interfaces, enabling services developed on different platforms to communicate through standards-based protocols.

SOA addresses enterprise integration challenges but introduces governance complexity. ATAM evaluations examine SOA designs for interoperability (standards compliance), performance (message transformation overhead), and modifiability (service versioning and backward compatibility).

**Example:** A service-oriented architecture for a government benefits system enables independent agencies to expose and consume benefits eligibility services through standardized SOAP or REST interfaces, enabling integration without sharing source code or databases.

#### Shared Database Pattern

A data architecture pattern in which multiple services or components access and modify the same database, enabling simple cross-service queries and transactions but coupling services to the shared schema, preventing independent evolution.

The shared database pattern is the opposite of the database-per-service pattern and is generally considered an anti-pattern in microservices architectures due to the coupling it creates. ATAM evaluations identify shared database usage as a modifiability risk when independent service evolution is an architectural driver.

**Example:** A shared database pattern in a logistics system allows the Order, Inventory, and Shipping services to execute cross-table SQL joins efficiently but prevents any service from changing its tables without coordinating with all other service teams.

#### Sidecar Pattern

An architectural container pattern in which auxiliary functionality — such as logging, monitoring, configuration management, or network proxy — is deployed alongside a primary service container in the same host or pod, sharing its network and storage resources.

The sidecar pattern separates cross-cutting operational concerns from service business logic, improving modifiability (sidecars can be updated without service changes) and consistency (all services use the same sidecar configuration). ATAM evaluations examine sidecar designs for the coupling between sidecar and service lifecycle.

**Example:** Every service in a Kubernetes-based architecture runs a logging sidecar that collects stdout logs and forwards them to a centralized log aggregator, enabling the logging infrastructure to be upgraded (by updating the sidecar) without modifying any service code.

#### SIEM Architecture

A Security Information and Event Management architecture that centralizes security event collection from multiple sources, correlates events across sources to identify patterns indicating security incidents, and provides dashboards and alerting for security operations teams.

SIEM is a security monitoring architecture that enables detection of complex, multi-step attacks that span multiple systems. ATAM evaluations examine SIEM architectures for the completeness of event source coverage and the accuracy of correlation rules against the threat scenarios in the utility tree.

**Example:** A SIEM architecture collects authentication logs from the identity provider, access logs from the API gateway, and system logs from application servers, correlating events to detect lateral movement attacks where a compromised service account accesses resources outside its normal scope.

#### Site Reliability Engineering

A discipline that applies software engineering practices — including automation, measurement, and systematic analysis — to the operations of software systems, with the goal of creating scalable and reliable software systems through explicit reliability targets and error budget management.

SRE practices operationalize the availability and reliability quality attributes that ATAM evaluations assess architecturally. SRE teams use the findings of ATAM evaluations to guide the design of monitoring, alerting, and automation that maintains the specified quality attribute levels in production.

**Example:** An SRE team implements automated runbooks for every high-probability failure scenario identified in the ATAM evaluation, reducing mean time to recovery by enabling automated response to common failures before human operators are engaged.

#### Software Architecture Definition

A set of structures needed to reason about a software system, comprising software elements, the relations among them, and properties of both elements and relations, as described by Bass, Clements, and Kazman in the foundational SEI literature.

Software architecture serves as the primary vehicle for realizing quality attributes and satisfying stakeholder concerns. Without a clear definition, teams risk confusing implementation details with architectural decisions, undermining evaluation efforts like ATAM.

**Example:** A system's architecture might be described by three structures: a module decomposition showing code organization, a component-and-connector view showing runtime processes, and a deployment view showing physical allocation to servers.

#### Software Quality Definition

A measure of the degree to which a software artifact conforms to its specified requirements and satisfies the needs of its users, encompassing both functional correctness and non-functional characteristics such as performance, reliability, and maintainability.

Quality is the central concern of ATAM. The method exists specifically to evaluate whether an architecture can achieve the quality goals stakeholders require, making a precise understanding of quality essential to conducting a meaningful evaluation.

**Example:** Quality for a cloud storage service encompasses not only whether files are stored and retrieved correctly (functional) but also whether retrieval latency is under 200ms (performance) and whether data is durable across datacenter failures (reliability).

#### Space-Based Architecture

An architectural pattern for highly scalable systems in which application logic and in-memory data are distributed across a grid of processing nodes (spaces) that communicate through tuple spaces, eliminating the central database bottleneck by keeping all data in distributed memory.

Space-based architecture achieves extreme scalability by removing the central database from the critical path, but it introduces complexity in data persistence, consistency, and failure recovery. ATAM evaluations examine space-based designs for the consistency scenarios where in-memory data must survive node failures.

**Example:** A space-based architecture for a real-time bidding system distributes bidder profiles and campaign data across 50 in-memory grid nodes, enabling each bid request to be evaluated in under 5 milliseconds without a database query by finding the relevant data in the local memory space.

#### Stakeholder Analysis

The systematic examination of identified stakeholders to understand their interests, priorities, influence over architectural decisions, and potential conflicts with other stakeholders, used to plan effective engagement during ATAM evaluations.

Stakeholder analysis informs how the evaluation leader structures ATAM sessions. Knowing which stakeholders have conflicting priorities enables proactive facilitation; knowing which stakeholders have high influence ensures their concerns receive appropriate attention.

**Example:** Stakeholder analysis reveals that the security team and the performance team have historically conflicting views on encryption overhead, prompting the evaluation leader to structure the session to surface this conflict explicitly through scenario prioritization.

#### Stakeholder Buy-In Strategies

Techniques for gaining the commitment and active support of stakeholders for the architecture evaluation process, for acting on its findings, and for the architectural decisions that the evaluation recommends or validates.

Without stakeholder buy-in, ATAM findings become reports that are acknowledged and archived rather than acted upon. Strategies for building buy-in include involving stakeholders as active participants rather than passive audiences.

**Example:** Stakeholder buy-in is built by ensuring that stakeholder scenarios are explicitly addressed in the evaluation analysis and that each stakeholder group's top priority risk is visibly included in the evaluation report's recommendations.

#### Stakeholder Communication

The planned and structured information exchange between the ATAM evaluation team and stakeholder groups before, during, and after the evaluation, designed to ensure stakeholders understand the process, contribute effectively, and receive actionable findings.

Effective stakeholder communication is as important as the technical analysis in ATAM. Poorly communicated findings, even if analytically sound, will not be understood or acted upon by the stakeholders who must make architectural decisions.

**Example:** The evaluation leader provides stakeholders with a one-page briefing document before the evaluation explaining what ATAM is, what their role will be, and what kind of information they should bring to the session, improving the quality of stakeholder contributions.

#### Stakeholder Concerns

The specific interests, requirements, and problems that individual stakeholders or stakeholder groups have regarding a software system, encompassing functional needs, quality attribute requirements, operational constraints, and business expectations.

ATAM's value comes partly from making stakeholder concerns visible and shared. When stakeholders understand each other's concerns, they can negotiate tradeoffs more effectively and accept architectural decisions that balance competing needs.

**Example:** Operations stakeholders express concern that deployment of updates must not interrupt service, while security stakeholders express concern that security patches must be deployable within 24 hours of release — concerns that together drive the zero-downtime deployment architectural requirement.

#### Stakeholder Engagement

The ongoing process of involving relevant stakeholders in architecture evaluation activities, communicating findings, addressing concerns, and building commitment to acting on evaluation recommendations.

Stakeholder engagement extends beyond the ATAM sessions themselves. Evaluations that engage stakeholders only during formal sessions but fail to communicate findings effectively produce reports that are read but not acted upon.

**Example:** Stakeholder engagement for an ATAM evaluation includes pre-briefings to explain the method and what is expected of participants, active participation in evaluation sessions, and post-evaluation presentations to executives summarizing findings and recommended next steps.

#### Stakeholder Identification

The systematic process of determining which individuals, groups, and organizations have a legitimate interest in the outcomes of a software system and should therefore be represented during an ATAM evaluation.

Comprehensive stakeholder identification prevents evaluation blind spots. Quality attribute concerns that only certain stakeholder groups hold — such as operational concerns held by system administrators — will be missed if those stakeholders are not identified and included.

**Example:** Stakeholder identification for a public transit scheduling system reveals seven distinct groups: transit planners, dispatchers, drivers, passengers, maintenance staff, IT operations, and city transportation regulators — each with distinct architectural concerns.

#### Stakeholder Influence Analysis

The systematic assessment of the relative power, authority, and interest of different stakeholders in shaping architectural decisions, used to plan engagement strategies and understand whose priorities most strongly constrain the architecture.

Influence analysis prevents ATAM evaluations from being dominated by the loudest voices rather than the most authoritative perspectives. Understanding influence helps the evaluation leader ensure that high-influence stakeholders' concerns receive appropriate weight.

**Example:** Influence analysis reveals that regulatory compliance stakeholders have veto authority over any architectural decision involving personal data handling, making their security and privacy scenarios the highest-priority constraints regardless of their relative number of votes in the utility tree prioritization.

#### Stakeholder Role in ATAM

The position held by individuals who have a legitimate interest in the architecture being evaluated, including developers, operators, end users, managers, and customers, who contribute domain knowledge and quality attribute priorities during the evaluation.

Stakeholder participation is what distinguishes ATAM from purely technical architecture reviews. Stakeholders bring knowledge about business context, operational realities, and user needs that the architecture team may not fully appreciate, enriching the evaluation.

**Example:** An end-user representative stakeholder reveals during ATAM Phase 2 that users frequently access the system on mobile networks with high latency, introducing a performance scenario that was not in the original utility tree and revealing a new architectural risk.

#### Stakeholder Workshop

A structured group session conducted during ATAM Phase 2 in which stakeholders from multiple groups collaborate to brainstorm quality attribute scenarios, prioritize them against business goals, and review evaluation findings.

The stakeholder workshop is the primary mechanism by which ATAM achieves cross-organizational consensus on architectural priorities. Its value depends on effective facilitation and sufficient diversity of stakeholder representation.

**Example:** A four-hour stakeholder workshop for an insurance claims processing system involves 12 participants from claims operations, IT, compliance, and customer service, producing 28 scenarios and a prioritized utility tree reflecting the organization's actual business priorities.

#### Strangler Fig Pattern

An architectural migration pattern in which new functionality is implemented in a new system while the legacy system continues operating, with a routing facade gradually redirecting traffic to the new system until the legacy system can be decommissioned.

The strangler fig pattern enables incremental migration from legacy to modern architectures without a high-risk big-bang replacement. ATAM evaluations examine strangler fig designs for the risks in the routing facade and the consistency of behavior between old and new implementations.

**Example:** A bank migrates its monolithic loan processing system to microservices using the strangler fig pattern, routing loan application requests to the new system while routing complex legacy loan types through the monolith until new implementations are complete.

#### Strategy Alignment

The degree to which a software architecture's design decisions, quality attribute priorities, and structural choices are consistent with and supportive of the organization's broader strategic objectives and long-term technology direction.

Strategy alignment is examined in ATAM through the business driver presentation. Architecture decisions that contradict organizational strategy represent risks even if they are technically sound, because the organization may reverse them as strategic priorities shift.

**Example:** A team proposes a vendor-specific cloud architecture that contradicts the organization's documented multi-cloud strategy; ATAM identifies this misalignment as a risk because the organization may be forced to rearchitect when the vendor strategy is enforced.

#### Stream Processing Architecture

An architectural approach in which data is processed continuously as individual records or micro-batches arrive, enabling near-real-time responses to events without accumulating data in batch windows, at the cost of higher architectural complexity.

Stream processing enables real-time analytics, monitoring, and event-driven reactions but introduces complexity in managing stateful processing, exactly-once delivery semantics, and distributed coordination. ATAM evaluations examine stream processing designs for the correctness scenarios where event ordering or exactly-once processing is required.

**Example:** A stream processing architecture for fraud detection processes each payment transaction within 50 milliseconds of arrival, applying ML model scoring and rule-based checks to decide whether to approve or flag the transaction, meeting the latency requirement for real-time fraud prevention.

#### Stress Testing

The practice of subjecting a software system to extreme or unexpected workloads beyond its designed capacity to determine its failure modes, breaking points, and recovery behavior, providing insight into how the system degrades when it cannot meet all requests.

Stress testing evaluates the availability and reliability architecture by forcing the system into failure conditions. ATAM availability scenarios can be validated by stress testing to verify that the failure recovery mechanisms operate correctly when the system is overloaded.

**Example:** A stress test that doubles the designed maximum load reveals that the API gateway returns 503 errors and the circuit breaker correctly prevents the overloaded database from receiving additional queries, validating the circuit breaker availability tactic but revealing that error messages lack useful retry guidance for clients.

#### STRIDE Threat Model

A threat classification framework that categorizes software security threats into six types: Spoofing identity, Tampering with data, Repudiation of actions, Information disclosure, Denial of service, and Elevation of privilege, used to systematically identify threats during security architecture evaluation.

STRIDE provides a systematic vocabulary for threat identification that complements ATAM's quality attribute scenario approach. ATAM evaluators use STRIDE to ensure that security scenarios cover all relevant threat categories rather than only the most obvious threats.

**Example:** Applying STRIDE to an API gateway identifies: Spoofing (stolen API tokens), Tampering (manipulated request payloads), Repudiation (missing audit logging), Information disclosure (verbose error messages), Denial of service (unbounded rate limits), and Elevation (insufficient authorization checks).

#### Sub-Attribute Node

A second-level node in the ATAM utility tree representing a specific dimension within a quality attribute, decomposing broad quality attributes into more analytically tractable sub-categories for scenario organization and evaluation.

Sub-attribute nodes help evaluators focus analysis on specific architectural mechanisms. Decomposing "availability" into "fault detection," "fault recovery," and "fault prevention" enables targeted analysis of monitoring, redundancy, and maintenance architectures respectively.

**Example:** Under the "Performance" branch, sub-attribute nodes for "transaction throughput," "search latency," and "batch processing time" organize scenarios requiring analysis of different architectural components.

#### Synchronous vs Async Comm

The architectural choice between communication patterns in which the caller waits for a response before continuing (synchronous) versus patterns in which the caller sends a message and proceeds without waiting, with the response arriving later if at all (asynchronous).

This choice affects multiple quality attributes simultaneously: synchronous communication provides immediate feedback and simpler error handling but creates temporal coupling and availability dependencies; asynchronous communication improves resilience and scalability but complicates error handling and consistency. ATAM evaluations make this tradeoff explicit.

**Example:** An ATAM evaluation identifies that using synchronous REST calls between all microservices creates a chain of dependencies where a slow downstream service degrades the entire user-facing response time, recommending event-driven messaging for non-critical downstream processing.

#### System Context Diagram

A visual representation that places a software system within its operational environment, showing the system as a single entity and depicting all external actors, systems, and data flows that cross the system boundary.

The system context diagram is typically presented during the architecture briefing phase of ATAM, orienting the evaluation team to the system's scope and external dependencies before examining internal structure.

**Example:** A system context diagram for an airline reservation system shows the system interacting with passengers (UI), travel agencies (partner APIs), payment processors (external services), and airline operations systems (internal legacy systems).

#### Tactic Interaction

The phenomenon in which two or more architectural tactics applied to satisfy different quality attributes affect each other's effectiveness, sometimes reinforcing each other and sometimes undermining each other, creating architectural tradeoffs.

Tactic interactions are what ATAM identifies as tradeoff points. Understanding how the performance tactic of caching interacts with the security tactic of data access control, for example, requires explicit architectural decisions about cache scope and access validation.

**Example:** The performance tactic "increase concurrency" and the security tactic "limit access" interact in a multi-tenant system: aggressive concurrency improves throughput but creates race conditions in access control checks, requiring careful synchronization that reduces the performance benefit.

#### Technical Debt

The implied cost of rework caused by choosing a limited or expedient architectural or design solution now instead of a more robust approach that would take longer, where the "debt" accrues interest in the form of increased maintenance effort over time.

ATAM identifies technical debt as an output of the evaluation — decisions that are expedient but architecturally unsound represent debt that stakeholders must consciously accept or plan to repay. Unacknowledged technical debt is an architectural risk.

**Example:** Skipping a proper API versioning strategy to meet a launch deadline accumulates technical debt: every future breaking API change requires coordinating all client teams simultaneously, increasing the cost of modification over time.

#### Technical Stakeholder

An individual with specialized technical knowledge of a software system or its operational context, such as a developer, architect, database administrator, network engineer, or security specialist, who participates in ATAM to contribute technical expertise.

Technical stakeholders provide the detailed knowledge of implementation and infrastructure that allows evaluation teams to assess whether architectural approaches can actually achieve their claimed quality attribute properties.

**Example:** A database administrator participating as a technical stakeholder identifies that the proposed sharding strategy will create uneven data distribution under the expected query patterns, surfacing a performance risk that architectural diagrams alone would not reveal.

#### Technology Radar

A visual representation of technology choices — organized into categories (techniques, tools, platforms, languages/frameworks) and maturity rings (adopt, trial, assess, hold) — that guides organizational technology selection decisions and architectural choices.

The technology radar provides architectural constraints and guidance that ATAM evaluators use to assess whether an architecture's technology choices align with organizational standards. Technologies in the "hold" ring represent architectural risks that require justification.

**Example:** An organization's technology radar classifies GraphQL as "adopt" for API design and a specific proprietary database as "hold" due to vendor lock-in concerns; an ATAM evaluation flags use of the "hold" database as a risk requiring explicit architectural justification and an exit strategy.

#### Testability Quality Attribute

The quality attribute characterizing the ease with which a software system or component can be made to demonstrate its faults through execution-based testing, including the ability to control state, observe outputs, and isolate components.

Testability is shaped by architectural decisions about coupling, interface design, and observability. Architectures with high coupling and implicit dependencies are difficult to test; ATAM evaluations assess testability through isolation scenarios.

**Example:** A testability scenario specifies that any individual service is unit-testable in isolation from its dependencies using mock interfaces, requiring that all external dependencies be injected rather than hard-coded.

#### Threat Modeling

A structured analytical process for identifying potential threats to a software system's assets, understanding the attack vectors and threat agents involved, and determining which threats require architectural controls and which are acceptable risks.

Threat modeling is the security equivalent of scenario brainstorming in ATAM. It produces the security scenarios that drive security architecture evaluation, ensuring that the architecture is assessed against realistic threats rather than theoretical worst cases.

**Example:** A threat modeling session for a payment API identifies the threat of credential stuffing attacks against the authentication endpoint, leading to an architectural requirement for rate limiting, account lockout, and multi-factor authentication on sensitive operations.

#### Throughput

The number of operations, transactions, or units of work that a software system can process per unit of time under sustained load, measured in requests per second, transactions per minute, or data volume per hour.

Throughput is a performance quality attribute that determines whether a system can handle its expected workload volume. ATAM throughput scenarios specify the required processing rate under defined load conditions and are analyzed by identifying the bottleneck components in the processing pipeline.

**Example:** A throughput scenario specifies that the order processing service must handle 50,000 order submissions per hour during peak holiday shopping without queuing delays exceeding 5 seconds, requiring analysis of database write capacity and message queue consumer throughput.

#### Tradeoff Point

An architectural decision that affects multiple quality attributes simultaneously, improving one quality attribute while degrading another, requiring an explicit organizational decision about which quality attribute to prioritize.

Tradeoff points are a central ATAM output distinguishing it from purely technical architecture reviews. By making tradeoffs explicit, ATAM enables organizational decision-makers — not just architects — to accept or reject the quality attribute compromises embedded in the architecture.

**Example:** The decision to add mutual TLS authentication to all inter-service communications is a tradeoff point: it improves security but adds 5-10 milliseconds of latency per call, degrading performance — a tradeoff that requires explicit business acceptance.

#### Two-Phase Commit

A distributed transaction coordination protocol in which a coordinator queries all participating services (phase 1: prepare) before instructing them all to commit or roll back (phase 2: commit), ensuring atomicity across distributed components at the cost of synchronous blocking.

Two-phase commit achieves strong consistency but introduces significant availability risk (blocking on coordinator or participant failure) and performance overhead (synchronous two-round-trip coordination). ATAM evaluations examine 2PC architectures for their blocking behavior under failure scenarios.

**Example:** A two-phase commit across three database shards blocks all participating shards during the commit phase; if the coordinator fails after sending prepare but before sending commit, all participants remain blocked until the coordinator recovers or an administrator intervenes.

#### Usability Quality Attribute

The quality attribute characterizing how effectively, efficiently, and satisfactorily specified users can achieve specified goals in a specified context, including learnability, efficiency of use, error tolerance, and satisfaction.

Usability is an architectural concern because certain decisions constrain the user experience. Synchronous blocking calls create perceptible delays; architectural decisions about caching and asynchronous processing significantly affect perceived responsiveness.

**Example:** A usability scenario specifies that a first-time user completes account registration without external assistance within three minutes, with all error messages providing actionable recovery instructions.

#### Utility Tree

A hierarchical artifact used in ATAM to organize and prioritize quality attribute scenarios, with "utility" at the root, major quality attributes as first-level branches, sub-attributes as second-level nodes, and specific prioritized scenarios as leaves.

The utility tree is ATAM's primary organizational tool for managing quality attribute evaluation. It makes relationships between business goals, quality attributes, and specific scenarios explicit and provides a systematic basis for allocating analysis effort.

**Example:** A utility tree root labeled "Utility" branches into "Performance" and "Availability"; Performance branches into "Response Time" and "Throughput"; each sub-attribute has two to four concrete scenarios as leaves with importance and difficulty ratings.

#### Utility Tree Construction

The collaborative process by which ATAM participants develop the utility tree by identifying quality attributes, decomposing them into sub-attributes, eliciting concrete scenarios, and assigning importance and difficulty ratings through structured discussion and consensus.

Utility tree construction is one of ATAM's most valuable activities because it forces explicit negotiation of quality attribute priorities. The process itself builds shared understanding and organizational alignment, not just the resulting artifact.

**Example:** Utility tree construction for a telemedicine platform takes four hours across two facilitated sessions, producing 28 concrete scenarios under five quality attributes with stakeholders from clinical operations, IT, and regulatory affairs jointly negotiating ratings.

#### Utility Tree Root

The top-level node of the utility tree in ATAM that represents the overarching concept of system utility, from which all quality attribute branches descend, symbolizing that the evaluation assesses the architecture's overall fitness for purpose.

The root represents the agreement that the system must be useful overall — that all quality attributes must be satisfied to an acceptable degree for the system to achieve its mission, preventing evaluation from over-optimizing a single attribute.

#### Utility Tree Validation

The process of reviewing the completed ATAM utility tree to ensure it is comprehensive, internally consistent, accurately represents stakeholder priorities, and contains scenarios specific enough to support meaningful architectural analysis.

Validation prevents the utility tree from being treated as final when it contains gaps or ambiguities that would undermine the analysis phase. Vague scenarios or missing quality attribute categories produce evaluations with blind spots.

**Example:** Utility tree validation reveals that three scenarios lack measurable response measures ("the system shall respond quickly"), prompting the team to refine them with stakeholder input before proceeding to architectural analysis.

#### Utility Tree Workshop

A facilitated session dedicated to constructing or validating the ATAM utility tree, in which evaluation team members and key stakeholders collaborate to decompose quality attributes, generate scenarios, and assign ratings.

The utility tree workshop requires careful facilitation to balance completeness — ensuring all relevant quality attributes are represented — with practicality, keeping the tree to a manageable number of scenarios for deep analysis.

**Example:** A utility tree workshop for a digital identity platform runs half a day with eight participants, producing a tree with four quality attribute branches and 22 leaf-level scenarios with negotiated importance and difficulty ratings.

#### Vector Database Architecture

The structural design of a database optimized for storing high-dimensional vector embeddings — numerical representations of text, images, or other data — and performing efficient similarity search to find the most semantically similar vectors to a query vector.

Vector databases are the retrieval infrastructure for RAG architectures and semantic search systems. ATAM evaluations examine vector database designs for retrieval latency (affecting end-to-end response time), index freshness (affecting retrieval quality as the knowledge base changes), and scalability as the vector collection grows.

**Example:** A vector database stores 10 million document embeddings indexed using an approximate nearest-neighbor algorithm; queries return the 10 most semantically similar documents within 20 milliseconds, meeting the latency budget for the RAG system's retrieval stage.

#### Vertical Scaling

A scaling approach in which performance capacity is increased by adding more resources (CPU, memory, storage) to existing computing nodes rather than adding more nodes, limited by the maximum hardware specifications available for a single machine.

Vertical scaling is simpler to implement than horizontal scaling but has a hard ceiling at the maximum available machine size. ATAM scalability scenarios that require growth beyond the maximum vertical scale require architectural changes to enable horizontal distribution.

**Example:** Upgrading a database server from 16 to 64 cores addresses current throughput requirements but represents the practical vertical scaling limit; the ATAM scalability scenario requiring 10x further growth cannot be satisfied vertically and requires a sharding architecture.

#### WebSocket Architecture

A communication protocol that provides full-duplex, bidirectional, persistent communication channels over a single TCP connection, enabling real-time data push from server to client without the overhead of repeated HTTP request-response cycles.

WebSockets enable real-time features such as live dashboards, collaborative editing, and notifications but require stateful server connections, complicating horizontal scaling. ATAM evaluations examine WebSocket designs for availability (connection loss handling) and scalability (connection state management) scenarios.

**Example:** A real-time trading dashboard uses WebSockets to push live price updates to 10,000 concurrent browser clients, reducing latency compared to polling while requiring the architecture to manage connection state across load-balanced server instances.

#### Zero Trust Architecture

A security architecture model in which no component, user, or network connection is trusted by default regardless of its location relative to the network perimeter, requiring explicit verification of identity, authorization, and device health for every access request to every resource.

Zero trust replaces the network-perimeter-based security model with continuous verification, improving security in environments where services communicate across shared networks, cloud environments, and mobile clients. ATAM evaluations examine zero trust implementations for the performance overhead of continuous verification.

**Example:** A zero trust architecture requires every inter-service API call to present a short-lived mTLS certificate verifying the calling service's identity, with the receiving service authorizing the specific operation through a policy engine regardless of whether both services are in the same network segment.

#### Zero-Downtime Deployment

A deployment capability in which a software system remains continuously available to users during the deployment of a new version, achieved through strategies such as blue-green switching, canary releases, rolling updates, or feature flags.

Zero-downtime deployment is a deployability quality attribute that requires specific architectural support. ATAM evaluations examine whether the system's deployment architecture supports rolling updates without breaking in-flight requests and whether database migrations are backward compatible with the previous version.

**Example:** A rolling update strategy replaces instances of the old version with new instances one at a time, with the load balancer draining connections from each instance before replacement, ensuring that at least two healthy instances serve traffic throughout the update.

