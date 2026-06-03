---
title: Cloud-Native Architecture
description: Cloud-native patterns from containers and Kubernetes through serverless, auto-scaling, deployment strategies, chaos engineering, multi-cloud tradeoffs, and the cost-versus-reliability tensions that shape cloud architecture decisions.
generated_by: claude skill chapter-content-generator
date: 2026-06-03 02:30:00
version: 0.08
---

# Cloud-Native Architecture

## Summary

Cloud-native architectures fundamentally alter the quality attribute tradeoff space by introducing elasticity, managed services, and pay-as-you-go economics as first-class architectural forces. This chapter covers the cloud-native technology stack — containers, Docker, Kubernetes, serverless, and FaaS — and the infrastructure practices (infrastructure as code, immutable infrastructure, GitOps) that make cloud environments reproducible and auditable. Students analyze cloud-specific resilience patterns including chaos engineering, blue-green deployments, canary releases, and zero-downtime strategies, and examine the tradeoffs involving multi-cloud portability, vendor lock-in, cost optimization, and cloud security.

## Concepts Covered

This chapter covers the following 24 concepts from the learning graph:

1. Cloud-Native Architecture
2. Container Architecture
3. Docker Containerization
4. Kubernetes Orchestration
5. Serverless Architecture
6. Function as a Service
7. Infrastructure as Code
8. Immutable Infrastructure
9. Auto-Scaling Architecture
10. Cloud Service Models
11. Multi-Cloud Architecture
12. Hybrid Cloud Architecture
13. Cloud Resilience Patterns
14. Chaos Engineering
15. Blue-Green Deployment
16. Canary Release Strategy
17. Zero-Downtime Deployment
18. Cloud Cost Optimization
19. Cloud Vendor Lock-in
20. Elasticity in Cloud
21. Cloud Security Architecture
22. Managed Cloud Services
23. GitOps Architecture
24. Cost vs Reliability Tradeoff

## Prerequisites

This chapter builds on concepts from:

- [Chapter 5: Quality Attributes](../05-quality-attributes/index.md)
- [Chapter 9: Architectural Tactics and Design Principles](../09-architectural-tactics-principles/index.md)
- [Chapter 11: Distributed Systems Architecture Fundamentals](../11-distributed-systems-fundamentals/index.md)

---

!!! mascot-welcome "Cloud-Native: Where Infrastructure Becomes Architecture"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Vista waving welcome">
    Fellow architects, from this altitude, cloud-native architecture looks like a paradigm shift — and it is. The cloud doesn't just change where your code runs; it changes the entire quality attribute tradeoff calculation. Elasticity makes scalability a default rather than a hard problem. Managed services shift operational complexity to the cloud provider. Pay-as-you-go pricing makes cost a dynamic quality attribute that trades off against performance and reliability in ways traditional infrastructure never did. ATAM evaluation of cloud-native systems requires this cloud-native lens. Let's take the high-level view and equip you with it!

## What Is Cloud-Native Architecture?

**Cloud-native architecture** is a design approach that fully exploits the capabilities of cloud platforms — specifically, elasticity, managed services, pay-as-you-go economics, and global distribution — as first-class architectural forces rather than infrastructure details.

The Cloud Native Computing Foundation (CNCF) defines cloud-native as systems that are containerized, dynamically orchestrated, and microservices-oriented. But the more important distinction for ATAM analysis is the shift in how quality attributes are achieved:

- **Scalability** is no longer a capacity planning problem — it is a runtime elasticity design problem. The question shifts from "how many servers do we provision?" to "how does our application scale in and out automatically?"
- **Availability** is no longer primarily about redundant hardware — it is about workload distribution, auto-healing, and deployment strategy. The question shifts from "is our hardware redundant?" to "how does our orchestration detect and replace failed instances?"
- **Cost** becomes a dynamic quality attribute with architectural implications — the question shifts from "what does the infrastructure cost?" to "how does our architecture affect the cost curve under variable load?"

The **cloud service models** define the boundary between what the organization manages and what the cloud provider manages:

- **Infrastructure as a Service (IaaS):** Provider manages hardware; organization manages OS, runtime, and applications
- **Platform as a Service (PaaS):** Provider manages infrastructure and runtime; organization manages applications and data
- **Software as a Service (SaaS):** Provider manages everything; organization consumes the service
- **Function as a Service (FaaS/Serverless):** Provider manages infrastructure and runtime scaling; organization manages function code only

Each service model represents a different tradeoff between control and operational burden — which is itself an ATAM quality attribute tradeoff point.

## Containers and Docker: Packaging for Cloud

A **container** is a lightweight, standalone, executable package of software that includes everything needed to run an application: code, runtime, system tools, system libraries, and settings. Containers share the host operating system kernel but are isolated from each other through Linux namespaces and cgroups — providing the isolation of virtual machines at a fraction of the resource overhead.

**Docker** is the dominant container runtime and packaging format. A Docker image (built from a Dockerfile) specifies the application's dependencies, configuration, and startup behavior; a running image instance is a container. Docker provides two key quality attribute benefits:

- **Portability:** A Docker image runs identically on a developer's laptop, a CI/CD pipeline, and a production cloud — eliminating environment-specific bugs
- **Consistency:** Container builds are deterministic — the same Dockerfile produces the same image, making builds reproducible and auditable

**ATAM quality attribute implications:**

- **Deployability (strong):** Containers are the unit of deployment in modern systems; their immutability (containers are replaced, not modified) supports zero-downtime deployment strategies
- **Testability (strong):** Identical environments across development and production eliminate "it works on my machine" scenarios
- **Security (variable):** Container isolation is weaker than VM isolation; shared kernel vulnerabilities can affect all containers on a host

## Kubernetes: Orchestration at Scale

**Kubernetes** (K8s) is the industry-standard platform for automating deployment, scaling, and management of containerized applications. Kubernetes introduces several abstractions that directly affect quality attribute scenarios.

Before examining quality attribute implications, let us define the key Kubernetes abstractions:

- **Pod:** The smallest deployable unit, consisting of one or more containers that share a network namespace. Pods are ephemeral — they can be created, killed, and replaced at any time.
- **Deployment:** A declarative specification for running N replicas of a Pod. Kubernetes ensures the actual state matches the declared state — if a Pod dies, Kubernetes creates a replacement.
- **Service:** A stable network endpoint for a set of Pods, providing load balancing and service discovery even as individual Pods come and go.
- **ConfigMap and Secret:** Kubernetes mechanisms for externalizing configuration and secrets from container images.
- **HorizontalPodAutoscaler (HPA):** Automatically adjusts the number of Pod replicas based on observed metrics (CPU, memory, custom metrics).

**Quality attribute implications of Kubernetes:**

**Availability (strong):** Kubernetes provides auto-healing — it continuously reconciles actual state with declared state. A failed Pod is replaced automatically, without operator intervention. Liveness and readiness probes allow Kubernetes to detect unhealthy containers before routing traffic to them.

**Scalability (strong via HPA):** The HorizontalPodAutoscaler enables **auto-scaling** — automatically adding or removing Pod replicas based on load. This is the cloud-native answer to the scalability quality attribute: instead of manual capacity planning, the system scales dynamically.

**Deployability (strong):** Kubernetes supports rolling updates (gradually replacing old Pods with new ones), blue-green deployments, and canary releases — all enabling zero-downtime deployment strategies.

**Complexity (cost):** Kubernetes is operationally complex. The learning curve is steep; misconfigurations can cause outages. Managed Kubernetes services (AWS EKS, Google GKE, Azure AKS) reduce operational burden but do not eliminate it.

**ATAM sensitivity point:** Kubernetes liveness and readiness probe configuration is a sensitivity point for availability scenarios. Incorrectly configured probes (wrong endpoints, wrong thresholds, wrong timeouts) cause Kubernetes to kill healthy containers or route traffic to unhealthy ones — both of which degrade availability.

## Serverless and Function as a Service

**Serverless architecture** and its implementation pattern, **Function as a Service (FaaS)**, push the managed-service model to its extreme: the developer writes only the function code; the cloud provider manages all infrastructure, scaling, and availability.

In FaaS platforms (AWS Lambda, Google Cloud Functions, Azure Functions), functions are invoked in response to events (HTTP requests, message queue entries, scheduled timers) and scale automatically from zero to thousands of concurrent invocations. The billing model is pay-per-invocation — you pay only for the compute time consumed by actual function executions.

**Quality attribute profile of serverless:**

- **Scalability (excellent):** Serverless scales automatically to handle any load without configuration or capacity planning
- **Cost optimization (excellent for variable workloads):** Zero cost when idle; linear cost scaling with load — ideal for workloads with high variability
- **Deployability (excellent):** No infrastructure to manage; deployment is function-level
- **Performance (variable):** Cold starts — the latency of spinning up a new function instance for the first time — can violate latency SLAs. Cold starts range from 10ms (warm) to 2+ seconds (cold) depending on runtime and function size
- **Availability (managed):** The provider's platform availability is the constraint; the developer has limited control over the platform's failure modes

**ATAM tradeoff point:** Serverless is a strong tradeoff point between cost/scalability and performance. For (H,H) performance scenarios with strict p99 latency requirements, cold starts are an architectural risk that must be analyzed. Mitigations include provisioned concurrency (pre-warming function instances) and minimizing function package size — but both increase cost, reinstating the cost vs. performance tradeoff.

## Infrastructure as Code and Immutable Infrastructure

**Infrastructure as Code (IaC)** is the practice of managing and provisioning cloud infrastructure through machine-readable configuration files rather than manual processes. Tools like Terraform, AWS CloudFormation, and Pulumi enable teams to define, version-control, and reproduce infrastructure configurations.

**Immutable infrastructure** is the practice of never modifying deployed infrastructure in place — instead, creating new infrastructure from updated configuration and destroying the old. A server that needs a software update is not patched; it is replaced with a new server built from the updated configuration.

Together, these practices produce key quality attribute improvements:

- **Deployability:** Environments are reproducible and auditable; deployments are reversible (roll back to the previous Terraform state)
- **Reliability:** Configuration drift — the accumulation of manual changes that make environments different from their specification — is eliminated
- **Security:** An immutable server that has never been accessed interactively has no risk of interactive access credentials, no accumulated config changes, and no history of ad-hoc patches

**GitOps** extends IaC by using a Git repository as the single source of truth for infrastructure and application configuration. A GitOps controller (ArgoCD, Flux) continuously reconciles the deployed state with the Git repository state — if the cluster drifts from the repository, the controller corrects it. GitOps provides complete auditability (every infrastructure change is a Git commit) and automatic drift correction.

#### Diagram: Cloud-Native Architecture Quality Attribute Stack

<iframe src="../../sims/cloud-native-qa-explorer/main.html" width="100%" height="580px" scrolling="no"></iframe>

<details markdown="1">
<summary>Cloud-Native Architecture Quality Attribute Stack</summary>
Type: diagram
**sim-id:** cloud-native-qa-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive layer diagram showing the cloud-native technology stack (hardware → IaaS → containers → Kubernetes → services → applications) with quality attribute contributions and tradeoffs visible at each layer — click any layer to see its quality attribute profile.

Bloom Level: Analyze (L4) — Examine how each layer of the cloud-native stack contributes to specific quality attributes and introduces specific risks.
Bloom Verb: Examine

Learning Objective: Students will be able to identify at least three quality attribute contributions and one quality attribute risk at each layer of the cloud-native technology stack.

Canvas layout:
- Vertical stack of five technology layers, each as a horizontal band
- Each layer labeled with: technology name, a brief role description, 2-3 "supports QA" badges (green), and 1-2 "threatens QA" badges (red)
- Clicking any layer expands a detail panel on the right showing full quality attribute analysis
- Arrow annotations on the right side showing which quality attributes are managed at which layer (e.g., "Scalability managed by Kubernetes HPA")

Layers (bottom to top):
1. IaaS / Managed Services: "Virtual compute, storage, networking provided by cloud provider"
   Supports: Availability (physical redundancy), Scalability (elastic provisioning)
   Threatens: Vendor lock-in (proprietary services), Cost predictability

2. Containers / Docker: "Packaging and isolation layer"
   Supports: Portability, Consistency, Deployability
   Threatens: Security (shared kernel), Complexity (image management)

3. Kubernetes Orchestration: "Auto-healing, scaling, and service discovery"
   Supports: Availability (auto-healing), Scalability (HPA), Deployability (rolling updates)
   Threatens: Complexity (steep learning curve), Performance (network overhead)

4. Infrastructure as Code / GitOps: "Declarative, version-controlled infrastructure"
   Supports: Deployability (reproducible), Reliability (no drift), Auditability
   Threatens: Learning curve, Change velocity (reviews required)

5. Application / Service Mesh: "Business logic and cross-cutting concerns"
   Supports: Modifiability, Security (mTLS via mesh), Observability
   Threatens: Performance (sidecar overhead), Operational complexity

Interactive elements:
- Click any layer to expand full quality attribute analysis in right panel
- "Show QA" button for each quality attribute highlights which layers contribute to it
- Hover "supports" badges to see the specific mechanism

Color scheme: Five distinct layer colors from bottom (gray) to top (gold). Green badges for supports, red for threatens.

Responsive: Stack compresses proportionally; detail panel moves below on narrow screens.
</details>

## Deployment Strategies: Blue-Green, Canary, and Zero-Downtime

Cloud-native infrastructure enables deployment strategies that were impractical or impossible with traditional infrastructure. These strategies are directly relevant to deployability and availability scenarios.

**Blue-green deployment** maintains two identical production environments (blue and green). One environment serves live traffic; the other is idle. To deploy a new version: deploy to the idle environment, run validation tests, then switch the load balancer to route traffic to the new environment. If the new version has problems, switching back is instant.

- Quality attribute implications: **Deployability** and **availability** (zero-downtime, instant rollback), at the cost of **resource cost** (maintaining two environments doubles infrastructure cost)

**Canary release** gradually shifts a small percentage of traffic to the new version while the majority continues to run on the old version. If the canary metrics (error rate, latency) remain acceptable, traffic is gradually shifted further; if problems appear, traffic is shifted back.

- Quality attribute implications: **Deployability** (safe incremental deployment), **reliability** (problems detected before full rollout), at the cost of **complexity** (requires traffic splitting, canary monitoring, and automated rollback logic)

**Zero-downtime deployment** encompasses any deployment strategy that avoids service interruption during a release. In Kubernetes, rolling updates achieve zero-downtime by gradually replacing old Pods with new ones, maintaining overall capacity throughout the process.

These strategies are **ATAM non-risk candidates** when they are correctly implemented for high-priority deployability and availability scenarios. Their absence is an architectural risk for systems with (H,H) deployability or availability scenarios involving deployments.

## Chaos Engineering: Testing Resilience Proactively

**Chaos engineering** is the discipline of deliberately introducing failures into production (or production-equivalent) environments to test system resilience — before those failures happen naturally. The term was popularized by Netflix's Chaos Monkey, which randomly terminated production instances to ensure the system could survive instance failures.

The philosophy behind chaos engineering: if you don't know how your system behaves under failure, you will find out when a real failure happens — at the worst possible time, with customers watching. By deliberately engineering controlled failures, you discover resilience gaps in a controlled context where you can fix them.

**ATAM connection:** Chaos engineering is the empirical validation of availability and resilience scenarios. Every chaos experiment is essentially testing whether the system satisfies an availability scenario. An availability scenario that states "when Service B fails, Service A must continue serving within 30 seconds" can be directly tested with a chaos experiment that kills Service B and measures Service A's recovery time.

Chaos engineering findings that reveal scenario failures are architectural risks. Chaos experiments that confirm scenario achievement are non-risk validations — with empirical evidence, not just architectural analysis.

## Multi-Cloud, Hybrid Cloud, and Vendor Lock-in

**Multi-cloud architecture** uses services from multiple cloud providers simultaneously. **Hybrid cloud architecture** combines on-premises infrastructure with cloud resources. Both approaches address the **vendor lock-in** concern — the risk that dependence on a single cloud provider's proprietary services creates switching costs that effectively eliminate the option to change providers.

This is a genuine ATAM tradeoff point with two competing quality attributes:

**Against multi-cloud (for single cloud):**
- **Performance:** Using cloud provider's native services (managed databases, AI services, messaging) often provides better performance and lower latency than equivalent cross-cloud alternatives
- **Operational simplicity:** Managing one cloud environment is simpler than managing multiple
- **Cost optimization:** Native services often provide better cost/performance ratios than portable alternatives

**For multi-cloud:**
- **Vendor independence:** Risk of business relationship changes, pricing changes, or service discontinuation is distributed across providers
- **Regulatory compliance:** Some jurisdictions require data sovereignty that a single provider cannot satisfy globally
- **Resilience:** A cloud provider regional or global outage affecting both providers simultaneously is extremely rare

**ATAM evaluation:** Vendor lock-in is itself a modifiability risk — it's the risk that the architecture cannot be migrated to another cloud provider without prohibitive cost. In evaluations, the team should assess: which cloud-provider-specific services does the architecture use? What would migration to a different provider require? Is the lock-in explicitly acknowledged and accepted by stakeholders, or is it an unacknowledged risk?

#### Diagram: Deployment Strategy Decision Matrix

<iframe src="../../sims/deployment-strategy-selector/main.html" width="100%" height="540px" scrolling="no"></iframe>

<details markdown="1">
<summary>Deployment Strategy Decision Matrix</summary>
Type: microsim
**sim-id:** deployment-strategy-selector<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive decision tool showing how deployment strategy selection affects quality attribute scenarios for deployability, availability, cost, and complexity — allowing students to select quality attribute priorities and see the recommended strategy.

Bloom Level: Evaluate (L5) — Assess deployment strategies to select the approach that best fits a given set of quality attribute requirements and constraints.
Bloom Verb: Assess

Learning Objective: Students will be able to select the most appropriate deployment strategy for a given set of quality attribute priorities (rollback speed, zero-downtime requirement, cost tolerance, traffic validation need) and justify the selection with tradeoff analysis.

Canvas layout:
- Left: Quality attribute priority sliders (Zero-Downtime Requirement, Rollback Speed Priority, Cost Sensitivity, Canary Validation Need — each 1-5)
- Center: Deployment strategy comparison cards (Blue-Green, Canary, Rolling Update, Recreate) showing scores on each dimension
- Right: "Best Fit" recommendation with explanation and tradeoffs accepted
- Bottom: Timeline visualization showing the deployment sequence for the recommended strategy

Strategy scores:
Blue-Green: Zero-Downtime=5, Rollback=5, Cost=1, Validation=2
Canary: Zero-Downtime=4, Rollback=4, Cost=3, Validation=5
Rolling Update: Zero-Downtime=4, Rollback=3, Cost=5, Validation=2
Recreate (full stop): Zero-Downtime=1, Rollback=2, Cost=5, Validation=1

Behavior:
- Moving sliders updates the "gap" between student requirements and each strategy's scores
- Best-fit strategy highlighted with minimum total gap
- "Simulate Deployment" button animates the timeline for the selected strategy
- "Compare All" shows all four strategies side-by-side in a radar chart

Instructional Rationale: Slider-driven selection is appropriate for Evaluate because students must explicitly state their quality attribute priorities before seeing recommendations, preventing anchoring.

Color scheme: Blue for Blue-Green, Green for Canary, Orange for Rolling, Red for Recreate.

Responsive: Controls stack vertically on narrow screens.
</details>

## Cost vs. Reliability: The Cloud-Native Tradeoff

No discussion of cloud-native architecture is complete without an explicit treatment of **cost vs. reliability** — the tension that is unique to cloud economics and that does not appear in traditional on-premises architecture decisions.

In traditional infrastructure, reliability investment is a one-time capital cost (buying redundant hardware). In cloud architectures, reliability investment is a recurring operational cost (paying for additional replicas, cross-region replication, managed resilience services). This changes the tradeoff calculation:

- A system with two replicas instead of one is 2× the compute cost — a permanent cost increase, not a one-time investment
- Cross-region replication for a database doubles the database cost — and adds replication latency
- Provisioned concurrency for serverless functions eliminates cold starts but converts variable cost to fixed cost

**ATAM cost vs. reliability tradeoff analysis:**

When an ATAM evaluation identifies an availability gap and recommends adding redundancy, the recommendation carries a cost implication that must be part of the stakeholder conversation. "Add a second replica to the payment service" is not just an availability tactic — it is a cost decision. The evaluation team should quantify the cost of the recommended mitigation and present it alongside the risk of not mitigating.

The most powerful version of this analysis uses the **cost of downtime** as the comparison basis: "The recommended redundancy improvement costs $X per month in additional infrastructure. The estimated business impact of an availability failure that this mitigation would prevent is $Y per incident × the estimated incident rate. If Y × incident_rate > X × 12 months, the mitigation has positive expected value." This framing connects architecture to business finance — which is exactly the language that gets executive approval for architectural improvements.

!!! mascot-warning "Managed Services Are Not Zero Risk"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Vista warning">
    A common misconception in cloud-native evaluation: "we use AWS RDS (or GCP Cloud SQL, or Azure Database), so we don't need to evaluate database availability." Managed services shift operational burden to the cloud provider but do not eliminate availability scenarios from ATAM analysis. Managed services have their own failure modes, their own SLAs (which are often 99.9%, not 99.99%), and their own limitations under your specific workload. In ATAM evaluations, "it's a managed service" is not an answer to an availability scenario — it is the beginning of the analysis: what is the managed service's SLA? What are its failure modes? Does it have multi-AZ replication? Is there a multi-region failover strategy?

!!! mascot-celebration "Cloud-Native: A Whole New ATAM Landscape!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Vista celebrating">
    You have just acquired the cloud-native ATAM evaluation toolkit — the ability to analyze scalability as an elasticity design problem, availability as an orchestration design problem, deployability as a deployment strategy design problem, and cost as a dynamic quality attribute with direct tradeoffs against reliability and performance. Cloud-native architectures are the dominant evaluation context for most modern ATAM practitioners, and you now have the vocabulary to evaluate them with full rigor. Onward to security architecture!

## Key Takeaways

Cloud-native architecture introduces new quality attribute dynamics that reshape ATAM analysis:

- **Cloud service models** (IaaS, PaaS, FaaS) define the operational responsibility boundary — each shift toward managed services trades control for simplicity
- **Containers** provide portability and consistency; **Kubernetes** provides auto-healing, auto-scaling, and deployment strategy support
- **Serverless/FaaS** optimizes scalability and variable-load cost but introduces cold start latency risks for performance scenarios
- **IaC and immutable infrastructure** eliminate configuration drift and support reproducible, auditable deployments
- **GitOps** extends IaC with automatic drift correction and full change auditability through Git
- **Auto-scaling** is a scalability tactic that shifts capacity management from planning to runtime — requires application design that supports stateless scaling
- **Blue-green** provides instant rollback at double infrastructure cost; **canary** enables progressive traffic validation; both address deployability and availability scenarios
- **Chaos engineering** empirically validates resilience scenarios — findings confirm non-risks or identify architectural risks with empirical evidence
- **Multi-cloud/hybrid cloud** mitigates vendor lock-in but at the cost of operational complexity and potential performance degradation
- **Cost vs. reliability** is a cloud-specific tradeoff point — reliability improvements in cloud environments have direct, recurring cost implications that must be part of the ATAM stakeholder conversation

??? question "Self-Check: Cloud-Native Architecture — Click to Reveal Answers"
    **Q1:** A Kubernetes deployment has liveness probes configured with a timeout of 1 second and an initial delay of 5 seconds. The application's health check endpoint sometimes takes up to 3 seconds to respond during JVM garbage collection pauses. Classify this as an ATAM result type and explain the failure mode.

    **Answer:** This is an **architectural risk** for an availability scenario. The failure mode: during a JVM garbage collection pause, the health endpoint takes 3 seconds to respond — exceeding the 1-second probe timeout. Kubernetes interprets the timeout as a liveness failure and kills the Pod, triggering a replacement. The replacement Pod also experiences GC pauses during warmup, potentially causing the same issue. Under load, this can create a death spiral: GC pauses cause Kubernetes to kill and replace Pods faster than they can warm up, degrading availability significantly. The sensitivity point: the liveness probe timeout threshold relative to the application's expected GC pause duration. The mitigation: increase the liveness probe timeout to 5+ seconds, or address the GC pause duration by tuning JVM heap settings or switching to a GC algorithm with shorter pause times (e.g., ZGC in Java 15+).

    ---

    **Q2:** An ATAM evaluation of a financial services platform finds that the architecture uses AWS Lambda for all API handlers. The utility tree has a (H,H) performance scenario: "95% of API calls must complete in under 100ms." What cloud-native risk does this architecture create for this scenario?

    **Answer:** The risk is **Lambda cold starts**. When a Lambda function has not been invoked recently (or when load spikes require new instances), the first invocation of a new function instance experiences a cold start — the time to initialize the execution environment, load the function package, and initialize the runtime. Cold starts for Java or .NET Lambdas can exceed 2 seconds; even Node.js or Python cold starts can be 100-500ms. Under normal load, the p95 may be within 100ms. But during traffic spikes (which are common for financial APIs during market open/close), the burst of cold starts can push p95 far above 100ms. The evaluation should assess: what is the expected cold start rate under peak load? What is the measured cold start latency? The mitigations are provisioned concurrency (eliminates cold starts but adds fixed cost) and function package optimization (reduces cold start duration). This is a tradeoff point between cost (provisioned concurrency pricing) and performance (cold start elimination).

    ---

    **Q3:** A startup argues they should not spend time on multi-cloud strategy because "we're 100% on AWS and happy with it." An ATAM evaluator flags vendor lock-in as a potential risk. How would you characterize this risk in ATAM terms, and under what conditions would it be classified as a risk vs. a non-risk?

    **Answer:** Vendor lock-in is an **architectural risk for modifiability** — specifically, the risk that migrating to a different cloud provider would require prohibitive cost and effort. Whether it is a risk or non-risk depends entirely on the stakeholder-validated importance rating: if the evaluation's utility tree has a modifiability scenario ("the system must be portable to a different cloud provider within 12 months if required") with a high importance rating, then extensive use of AWS-specific services (DynamoDB, Lambda, SQS, Kinesis) creates a genuine architectural risk — the scenario cannot be achieved without significant redesign. If no such scenario exists in the utility tree, and stakeholders explicitly acknowledge and accept cloud dependence as a business decision, then vendor lock-in is a **non-risk** — an explicitly accepted tradeoff. The key principle: ATAM evaluates against stakeholder-prioritized scenarios. An architectural property that no stakeholder cares about is not an ATAM risk, even if an architect might personally find it concerning.
