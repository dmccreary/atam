# Quiz: Cloud-Native Architecture

Test your understanding of cloud-native concepts including containers, Kubernetes, serverless, IaC, deployment strategies, chaos engineering, multi-cloud tradeoffs, and cost versus reliability. Each question is followed by a collapsed answer block.

## Questions

### Question 1

How does cloud-native architecture change the way scalability, availability, and cost are understood as quality attributes?

??? note "Answer"
    **Scalability** shifts from a capacity planning problem to a runtime elasticity design problem. The question changes from "how many servers do we provision?" to "how does our application scale in and out automatically?" **Availability** shifts from primarily being about redundant hardware to being about workload distribution, auto-healing, and deployment strategy. The question changes from "is our hardware redundant?" to "how does our orchestration detect and replace failed instances?" **Cost** becomes a dynamic quality attribute with architectural implications — it changes from "what does the infrastructure cost?" to "how does our architecture affect the cost curve under variable load?" Cloud economics make cost a recurring operational variable that trades off directly against reliability and performance in ways traditional on-premises infrastructure never did.

---

### Question 2

Which of the following best describes the quality attribute tradeoff of **Docker containers** compared to virtual machines?

A. Containers provide stronger isolation than VMs but with higher resource overhead  
B. Containers provide weaker isolation than VMs (shared kernel) but with lower resource overhead and higher portability  
C. Containers and VMs have identical security properties since both provide namespace isolation  
D. Containers eliminate all environment-specific bugs through their isolated runtime environments  

??? note "Answer"
    The correct answer is **B**. Containers share the host operating system kernel but are isolated from each other through Linux namespaces and cgroups — providing the isolation of virtual machines at a fraction of the resource overhead. This means container isolation is *weaker* than VM isolation (shared kernel vulnerabilities can affect all containers on a host), making A incorrect. The shared kernel is a security concern that ATAM evaluations must explicitly address. The portability benefit is real but does not eliminate all environment-specific bugs — only those related to runtime and library versions, not those related to cloud provider-specific configurations or external service behavior.

---

### Question 3

Explain why the **Kubernetes liveness probe configuration** is described as a sensitivity point for availability scenarios.

??? note "Answer"
    The liveness probe configuration is a sensitivity point because small changes in its settings produce disproportionately large effects on availability scenario achievability. If the liveness probe timeout is set too low (e.g., 1 second) for an application whose health endpoint occasionally takes 2–3 seconds during garbage collection or startup, Kubernetes will incorrectly kill healthy containers — degrading availability. Conversely, if the timeout is too high or the failure threshold is too lenient, Kubernetes will continue routing traffic to genuinely unhealthy containers. The specific values of timeout, initialDelaySeconds, periodSeconds, and failureThreshold all have nonlinear effects: crossing the wrong threshold converts a healthy container into one that Kubernetes restarts in a loop. This is the hallmark of a sensitivity point — small parameter changes producing large quality attribute changes.

---

### Question 4

A financial services API uses AWS Lambda for all handlers. The (H,H) performance scenario requires 95% of API calls to complete under 100ms. Which cloud-native risk does this architecture create?

A. Lambda functions cannot be scaled horizontally  
B. Lambda cold starts can significantly exceed the 100ms target during traffic spikes  
C. Lambda does not support HTTPS, creating a security vulnerability  
D. Lambda's billing model makes it too expensive for financial services  

??? note "Answer"
    The correct answer is **B**. **Lambda cold starts** are the risk. When a Lambda function has not been invoked recently, or when load spikes require new instances, the first invocation of a new function instance experiences a cold start — initializing the execution environment, loading the function package, and starting the runtime. Cold starts for Java or .NET Lambdas can exceed 2 seconds; even Node.js or Python cold starts can be 100–500ms. During normal load, p95 may be within 100ms. But during traffic spikes (common for financial APIs during market open/close), the burst of cold starts pushes p95 far above the target. Mitigations include provisioned concurrency (eliminates cold starts but adds fixed cost) and function package optimization — both of which create a cost-vs-performance tradeoff point.

---

### Question 5

What are the key quality attribute implications of **blue-green deployment** compared to **canary release**?

??? note "Answer"
    **Blue-green deployment**: maintains two identical environments; switches traffic instantly from old to new. Supports: zero-downtime deployment, instant rollback (flip the load balancer back). Threatens: resource cost (maintaining two full environments doubles infrastructure cost), and lacks traffic validation before full cutover. Best for: teams that need instant rollback above all, with sufficient budget for dual environments. **Canary release**: gradually shifts a small percentage of traffic to the new version, monitoring error rates and latency before increasing the percentage. Supports: progressive validation (problems detected before full rollout), safety (small blast radius on failure). Threatens: complexity (requires traffic splitting, canary monitoring, and automated rollback logic), and longer deployment duration. Best for: teams that prioritize catching regressions before they affect all users, especially for systems with complex or hard-to-detect failure modes.

---

### Question 6

Which of the following best describes the relationship between **chaos engineering** and ATAM availability scenarios?

A. Chaos engineering is a post-deployment activity unrelated to ATAM's pre-deployment analysis  
B. Chaos engineering provides empirical validation or refutation of availability scenarios — findings are either non-risk confirmations or architectural risks with evidence  
C. Chaos engineering replaces ATAM evaluation for cloud-native systems  
D. Chaos engineering only validates performance scenarios, not availability scenarios  

??? note "Answer"
    The correct answer is **B**. Chaos engineering is the empirical complement to ATAM's analytical evaluation. Every chaos experiment directly tests whether the system satisfies an availability scenario under failure conditions. For example: "when Service B fails, Service A must continue serving within 30 seconds" can be directly tested by killing Service B and measuring Service A's recovery time. A chaos experiment that confirms the scenario is a **non-risk validation** with empirical evidence — stronger than analytical assessment alone. A chaos experiment that reveals a scenario failure is an **architectural risk** with empirical evidence. Chaos engineering and ATAM are complementary, not substitutes.

---

### Question 7

A startup is 100% on AWS and uses DynamoDB, Lambda, SQS, and Kinesis throughout their architecture. During an ATAM evaluation, the evaluator flags **vendor lock-in** as a potential modifiability risk. Under what conditions is this a risk versus a non-risk?

??? note "Answer"
    Whether vendor lock-in is a risk or non-risk depends entirely on whether the utility tree contains a modifiability scenario related to cloud portability, and its importance rating. **It is a risk** if the utility tree has a modifiability scenario such as "the system must be portable to a different cloud provider within 12 months if required" with a high importance rating. Extensive use of AWS-specific services (DynamoDB, Lambda, SQS, Kinesis) creates genuine architectural risk — migrating to a different provider would require significant redesign. **It is a non-risk** if no such scenario exists in the utility tree, and stakeholders explicitly acknowledge and accept cloud dependence as a business decision. ATAM evaluates against stakeholder-prioritized scenarios. An architectural property that no stakeholder has prioritized as important is not an ATAM risk, even if an architect finds it personally concerning. The key principle: lock-in must be an *explicitly accepted* tradeoff, not an *unacknowledged* risk.

---

### Question 8

Describe the **cost vs. reliability tradeoff** that is unique to cloud-native architectures. How does this differ from traditional on-premises infrastructure?

??? note "Answer"
    In cloud architectures, reliability investment is a **recurring operational cost**: running a second replica of a service is a permanent 2× compute cost increase; cross-region database replication doubles the database cost and adds replication latency; provisioned concurrency for serverless eliminates cold starts but converts variable cost to fixed cost. In traditional on-premises infrastructure, reliability investment is primarily a **one-time capital cost** (buying redundant hardware). This difference changes the tradeoff calculation significantly: cloud reliability improvements are not amortized one-time investments but ongoing monthly expenses that compound over the system's lifetime. ATAM evaluations of cloud systems should quantify mitigation costs and compare them against the estimated business cost of the availability failure the mitigation would prevent — using expected value analysis (cost of downtime × incident rate vs. mitigation cost) to justify or deprioritize reliability investments.

---

### Question 9

What four key Kubernetes abstractions are most directly relevant to availability and scalability quality attribute scenarios?

??? note "Answer"
    (1) **Deployment** — declares the desired number of replicas of a Pod; Kubernetes continuously reconciles actual state with declared state, automatically replacing failed Pods. This is the primary auto-healing mechanism for availability. (2) **HorizontalPodAutoscaler (HPA)** — automatically adjusts the number of Pod replicas based on observed metrics (CPU, memory, custom metrics). This is the cloud-native auto-scaling mechanism for scalability scenarios. (3) **Liveness probe** — checks whether a container is alive and responsive; failure triggers container restart. Directly enables auto-healing availability. (4) **Readiness probe** — checks whether a container is ready to accept traffic; failure removes the instance from load balancer rotation without killing it. Enables zero-downtime deployments and prevents traffic routing to unready instances.

---

### Question 10

Which of the following is the primary quality attribute benefit of **Infrastructure as Code (IaC)** and **immutable infrastructure** together?

A. Eliminating all cloud vendor lock-in through portable configuration  
B. Reducing runtime latency through pre-configured infrastructure  
C. Enabling reproducible, auditable, drift-free environments that support reliable and reversible deployments  
D. Eliminating the need for a CI/CD pipeline  

??? note "Answer"
    The correct answer is **C**. IaC and immutable infrastructure together produce: **Deployability** (environments are reproducible — the same configuration produces the same environment; deployments are reversible by rolling back to the previous state). **Reliability** (configuration drift — the accumulation of manual changes that make environments different from their specification — is eliminated because servers are never patched in place, only replaced). **Security** (an immutable server that has never been accessed interactively has no history of ad-hoc changes and no accumulated interactive access credentials). **Auditability** (every infrastructure change is a code change in version control with an author, timestamp, and review). None of the other options accurately describes the primary joint benefit of these two practices.

---

### Question 11

Scenario: A development team proposes using serverless (AWS Lambda) for a new healthcare data API. The utility tree has three (H,H) scenarios: p99 API latency ≤ 100ms, 99.99% availability, and HIPAA compliance requiring audit logs within 50ms of each data access. What cloud-native analysis would you conduct, and what tradeoff points would you document?

??? note "Answer"
    Analysis to conduct: (1) **Cold start analysis** — measure Lambda cold start latency for the chosen runtime; Java/Kotlin cold starts commonly exceed 1–2 seconds, which violates the p99 ≤ 100ms scenario. Document as an architectural risk requiring mitigation (provisioned concurrency) or runtime selection change. (2) **Availability analysis** — Lambda's platform SLA is typically 99.95% per region. Achieving 99.99% may require multi-region deployment with active-active Lambda routing — document as an availability risk if single-region. (3) **Audit logging latency** — Lambda cold starts can delay execution by seconds, potentially causing audit log writes to miss the 50ms window. Must measure whether the logging path (Lambda → CloudWatch Logs or external SIEM) consistently achieves 50ms synchronously. Tradeoff points to document: **Cost vs. cold-start elimination** (provisioned concurrency eliminates cold starts but converts variable Lambda cost to fixed cost — potentially more expensive than always-on EC2 instances for constant traffic). **Platform availability vs. control** (Lambda's 99.95% SLA may be insufficient for 99.99% target, requiring multi-region complexity).

---

### Question 12 (Analyze)

A Kubernetes deployment has liveness probes configured with `timeoutSeconds: 1` and `initialDelaySeconds: 5`. The Java application's health check endpoint sometimes takes 3 seconds during JVM garbage collection pauses. Classify this as an ATAM result type, identify the failure mode, identify the sensitivity point, and recommend a mitigation strategy.

??? note "Answer"
    **ATAM result type**: **Architectural risk** for an availability scenario. **Failure mode**: During a JVM garbage collection pause, the health endpoint takes 3 seconds to respond — exceeding the 1-second liveness probe timeout. Kubernetes interprets this as a liveness failure and kills the Pod, triggering a replacement. The replacement Pod also experiences GC pauses during JVM warmup, potentially failing liveness before it completes startup. Under sustained load, this can create a death spiral: GC pauses cause Kubernetes to kill Pods faster than replacements can stabilize, progressively degrading the available replica count and availability. **Sensitivity point**: The liveness probe `timeoutSeconds` threshold relative to the application's maximum GC pause duration. Increasing `timeoutSeconds` from 1 to 5 eliminates the false-positive kills; reducing it below the actual GC pause duration creates them. **Mitigation options**: (1) Increase `timeoutSeconds` to at least 2× the maximum observed GC pause duration. (2) Address the GC pause root cause by tuning JVM heap size, using a lower-pause GC algorithm (ZGC, Shenandoah), or reducing object allocation pressure. (3) Use a separate, GC-independent liveness check endpoint (e.g., checking a pre-computed static variable rather than a database call that triggers allocation).

---

*End of Quiz — Chapter 13*
