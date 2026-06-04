# Quiz: Advanced Data, Emerging AI, and Autonomous Architectures

Test your understanding of data mesh, data lakehouse, lambda and kappa architectures, AI security, federated learning, edge AI, online learning, A/B testing, data governance, and autonomous system architecture. Each question is followed by a collapsed answer block.

## Questions

### Question 1

What are the four principles of data mesh architecture? For each, briefly state its primary quality attribute benefit.

??? note "Answer"
    (1) **Domain ownership** — responsibility for data products is assigned to domain teams that generate and understand the data. Quality attribute benefit: **modifiability** — domain teams can evolve their data products without coordinating with a central team. (2) **Data as a product** — domain teams treat their data outputs as products with defined consumers, documented APIs (data contracts), quality SLAs, and product management ownership. Quality attribute benefit: **reliability and interoperability** — data products have explicit quality commitments and stable interfaces for consumers. (3) **Self-service data infrastructure** — platform capabilities (storage, processing, quality monitoring, access control) are provided through standardized tooling that domain teams use autonomously. Quality attribute benefit: **scalability** — removes the central data engineering team as a bottleneck as data volume and team count grow. (4) **Federated computational governance** — organization-wide standards (quality definitions, security classifications, compliance requirements) are enforced across all domain data products while preserving team autonomy. Quality attribute benefit: **compliance and governance consistency** across distributed ownership.

---

### Question 2

What problem does the **data lakehouse** solve, and what open table formats enable it?

??? note "Answer"
    The data lakehouse solves the forced choice between two inadequate paradigms: **data warehouses** provide excellent query performance, strong governance, and transactional guarantees, but are expensive at scale and impose rigid schema requirements; **data lakes** store data cheaply at petabyte scale in any format, but lack transactional guarantees (simultaneous writers can corrupt data), have poor query performance on unstructured data, and provide no native data governance. The lakehouse pattern adds a metadata layer on top of cloud object storage that provides ACID transactions, schema evolution (adding columns without rewriting data), time travel (querying table state at any past point), and efficient query pruning — achieving near-warehouse query performance at near-lake storage costs. Enabling open table formats: **Delta Lake** (Databricks), **Apache Iceberg**, and **Apache Hudi** — all add this metadata layer on top of Parquet/ORC files in cloud object storage.

---

### Question 3

Compare **lambda** and **kappa** architectures. In what scenario is lambda architecture the better choice?

??? note "Answer"
    **Lambda architecture** runs two parallel pipelines — a batch layer (processes complete historical data periodically, produces accurate results) and a speed layer (processes only recent data in real time, provides low-latency but potentially approximate results) — with a serving layer that merges both. **Kappa architecture** eliminates the batch layer entirely, relying on a single streaming pipeline with a durable, replayable event log (Kafka) — historical reprocessing is done by replaying the log from the beginning. **Lambda is the better choice when**: (1) The batch layer uses computation that cannot be expressed in streaming semantics (global sorts, iterative graph algorithms, certain ML training jobs that require multiple passes over the data). (2) The organization has strict historical reprocessing requirements demanding exact-once semantics over the full history. (3) The team has strong batch processing expertise and the streaming system is new or uncertain. **Kappa's advantage**: lower operational complexity (one codebase, one cluster, one processing model) — Martin Kleppmann's key critique of lambda is that maintaining two implementations of the same computation is expensive and error-prone.

---

### Question 4

Which of the following is classified as a **model poisoning** attack (not an adversarial example attack)?

A. A stop sign is photographed with a small sticker that causes an autonomous vehicle's classifier to identify it as a speed limit sign  
B. An attacker injects malicious training examples into a model's training dataset to cause the model to learn incorrect associations, including backdoor triggers  
C. An attacker submits many queries to a production model to train a surrogate model that approximates the target  
D. A user crafts a prompt with specific phrasing that causes an LLM to ignore its system prompt instructions  

??? note "Answer"
    The correct answer is **B**. Model poisoning attacks target the **training pipeline** rather than the inference pipeline. By injecting malicious examples into the training dataset, an attacker can cause the model to learn incorrect associations or embed **backdoor triggers** — specific patterns that cause the model to produce attacker-chosen outputs whenever the trigger appears in a production input, while behaving normally on all other inputs. Option A is an **adversarial example** attack (manipulating inference-time inputs). Option C is **model extraction** (using inference outputs to train a surrogate model). Option D is a **prompt injection** attack (manipulation of LLM inputs to override system instructions). Each attack targets a different stage of the AI system lifecycle and requires different defenses.

---

### Question 5

What are the three primary quality attribute tradeoffs of **federated learning** compared to centralized training?

??? note "Answer"
    (1) **Privacy vs. Model accuracy**: Federated learning *improves* privacy — data never leaves participant nodes. However, model accuracy *degrades* relative to centralized training, especially with high data heterogeneity (non-IID distributions across participants), because federated averaging converges less accurately than centralized training on a unified dataset. (2) **Regulatory compliance vs. Operational complexity**: Federated learning *strongly improves* compliance for HIPAA, GDPR, and financial data regulations that prohibit data sharing across institutional boundaries. But it *dramatically increases* operational complexity: coordinating training across hundreds or thousands of nodes, handling node failures mid-round, managing differential privacy budgets, and validating gradient updates for poisoning attacks. (3) **Gradient privacy vs. Communication efficiency**: Adding differential privacy (noise to gradient updates) further protects privacy from gradient inversion attacks but requires gradient compression techniques (reducing update size) that can further degrade model accuracy and add implementation complexity.

---

### Question 6

What is the **edge-cloud continuum** in edge AI architecture, and what routing principle governs tiered inference?

??? note "Answer"
    The edge-cloud continuum is the architectural pattern that distributes AI computation across a hierarchy of three tiers: **Device** (most latency-sensitive — milliseconds — most privacy-constrained, least capable: mobile phones, IoT sensors, wearables), **Edge servers** (intermediate latency — tens to hundreds of milliseconds — shared resource, moderate capability: CDN edge nodes, local compute clusters, 5G MEC), and **Cloud** (highest latency — hundreds of milliseconds to seconds — no privacy constraints, maximum capability: GPU clusters, large model inference APIs). **Tiered inference routing principle**: requests are routed to the appropriate tier based on three factors simultaneously — the **latency requirement** of the specific request (safety-critical autonomous driving decisions → device; casual search → cloud), the **privacy constraint** (biometric data → device; anonymized data → cloud), and the **computational complexity** of the model needed (small on-device model for simple classification → device; large foundation model for complex reasoning → cloud). A sophisticated edge AI architecture dynamically routes individual inference requests across tiers rather than committing all inference to a single tier.

---

### Question 7

An autonomous AI system manages cloud infrastructure — it can provision, configure, and delete resources. An ATAM evaluator is developing safety architecture requirements as quality attribute scenarios. Write one scenario for each of the following safety principles: reversibility, scope restriction, and kill switch.

??? note "Answer"
    **Reversibility scenario**: "Before executing any resource deletion, network policy change, or permission revocation affecting production resources, the system shall verify that a recovery path exists, shall log the proposed action with its reasoning chain, and shall require explicit human confirmation for any action affecting more than 5% of production resources or classified as destructive." This prevents catastrophic irreversible errors. **Scope restriction scenario**: "The system's action space shall be limited to a whitelist of approved resource types and operations maintained in the governance registry; adding new capabilities to the whitelist shall require security review, architecture approval, and a staged rollout with monitoring period before general enablement." This limits blast radius through capability boundaries. **Kill switch scenario**: "A human operator shall be able to halt all autonomous actions within 30 seconds via an authenticated emergency API call or console command, with the halt state persisting until explicitly cleared by an authorized operator; the kill switch mechanism shall be tested monthly."

---

### Question 8

Which of the following best describes why **online learning** (continuous model updates) introduces unique stability risks?

A. Online learning requires more training data than batch learning, which is expensive  
B. Online learning causes catastrophic forgetting and can create feedback loop instabilities where model predictions influence future training data in ways that amplify biases or degenerate equilibria  
C. Online learning makes models non-deterministic and therefore unsuitable for production  
D. Online learning requires real-time GPU clusters, which are not cost-effective  

??? note "Answer"
    The correct answer is **B**. Online learning introduces two distinct stability risks: (1) **Catastrophic forgetting** — when neural networks are updated on new data, they tend to overwrite previously learned knowledge. A model updated frequently on recent patterns can lose its ability to handle older patterns it previously handled well. (2) **Feedback loop instability** — if a model's predictions influence future data (a recommendation model shapes what users click on, which becomes the next training data; a fraud model shapes how fraudsters behave, which becomes the next training distribution), the system becomes a closed-loop dynamical system. This can develop instabilities (model amplifies existing biases), convergence to degenerate states (model recommends only a narrow set of items, users only see those items, model continues to recommend only those items), or runaway feedback where errors compound. ATAM evaluations of online learning systems must probe: "How do you prevent catastrophic forgetting? How do you detect and manage feedback loops? What is your rollback mechanism?"

---

### Question 9

What are the four core components of a **data governance architecture** for AI systems, and why is each necessary?

??? note "Answer"
    (1) **Data catalog** — an inventory of available datasets with schemas, lineage, quality metrics, and ownership. Necessary for: knowing what data exists, who owns it, and whether it is appropriate for training a given model. (2) **Data lineage system** — tracks how data flows and transforms from source to consumption. Necessary for: impact analysis when a source schema changes (which models depend on this data?), compliance audits requiring proof of where personal data was used, and debugging model quality issues by tracing back to data sources. (3) **Data quality framework** — automated checks for completeness, accuracy, consistency, and freshness with SLA enforcement. Necessary for: preventing model training on corrupted, stale, or biased data, and enforcing data quality SLAs across domain teams in a data mesh. (4) **Access control governance** — policy-based data access management integrated with the data catalog. Necessary for: enforcing data minimization (AI teams access only the data their models need), data subject rights (GDPR right to erasure requires knowing which training datasets contain a specific individual's data), and regulatory requirements (HIPAA, GDPR, EU AI Act documentation of training data characteristics).

---

### Question 10

Which of the following is a minimum statistical requirement for a valid A/B test result?

A. The test must run for exactly 7 days to account for weekly seasonality  
B. The test must achieve sufficient sample size for statistical power (typically 80-95% power at 5% significance), and must not be stopped early when results look favorable (no peeking)  
C. Both test variants must receive equal traffic at all times  
D. A/B tests are only valid when the measured metric is revenue per user  

??? note "Answer"
    The correct answer is **B**. Two requirements are foundational to A/B test validity: (1) **Minimum sample size**: the test must collect enough observations that the difference between variants can be detected with sufficient statistical power (typically 80-95% power) at the chosen significance level (typically 5%). Stopping too early when results look good ("peeking") is a form of p-hacking — the observed p-value is not valid at the sample size where you stopped, even if it appears statistically significant. (2) **No peeking**: running a test and stopping it as soon as it looks favorable is a severe statistical error that produces false positives at far higher rates than the stated significance level. Tests must run to their pre-calculated minimum sample size. Option A (7-day requirement) is a heuristic, not a statistical requirement. Option C (equal traffic) is one randomization approach but not required. Option D is false — A/B tests apply to any measurable metric.

---

### Question 11

Scenario: A large financial services organization proposes adopting a data mesh architecture. Currently, a centralized data warehouse serves 15 business units, 200 data consumers, and processes 5TB of data daily. The ATAM utility tree has a (H,H) compliance scenario: "All data access and lineage must be fully documented and auditable within 24 hours for regulatory review." What are the top three quality attribute risks the evaluation team should document?

??? note "Answer"
    (1) **Governance consistency risk** (High severity): With 15 domain teams each owning data products, inconsistent implementation of data quality standards, access controls, and audit logging across teams creates a high probability that at least some domain data products will fail the compliance scenario. Centralized governance provided uniformity; federated governance requires significant platform investment, tooling standards, and cultural change to achieve equivalent compliance consistency. Document as risk: severity H (regulatory audit failure is a business-critical event), probability M-H (based on organizational change management maturity). (2) **Data lineage coverage risk** (High severity): The compliance scenario requires complete lineage documentation. In a mesh architecture, data flows across domain boundaries through data products — if the inter-domain lineage (how data from Domain A's product is used in Domain B's model) is not automatically captured by the self-service platform, the 24-hour audit requirement may not be achievable. This is a technical gap in the proposed platform tooling that must be closed before migration. (3) **Organizational readiness risk / Conway's Law alignment** (High severity): Data mesh is fundamentally an organizational architecture — the four principles require domain teams to accept data product ownership responsibilities they currently delegate to the central team. If domain teams lack data engineering skills, are not incentivized by organizational performance metrics to invest in data product quality, or do not have product management support for data product work, the mesh degrades into a distributed data swamp. ATAM should assess: does the organizational structure, incentive system, and hiring plan support the proposed architecture?

---

### Question 12 (Analyze)

An organization proposes deploying a multi-agent autonomous AI system for medical diagnosis support. Multiple specialized AI agents collaborate: an imaging agent (analyzes radiology scans), a lab agent (interprets lab results), and a clinical notes agent (summarizes patient history). A coordinator agent synthesizes their outputs and proposes a diagnosis. The proposed system has no human review step for routine cases. Analyze the safety quality attribute tradeoffs, identify ATAM risk findings, and recommend the minimum safety architecture requirements as quality attribute scenarios.

??? note "Answer"
    **Safety tradeoff analysis**: The system trades **autonomy value** (faster diagnosis, no physician bottleneck for routine cases, 24/7 availability) against **safety** (guaranteed accuracy, accountability, regulatory compliance, ability to catch AI errors before they reach patients). In medicine, errors can cause irreversible patient harm — this is the highest consequence category for autonomous system decisions. **ATAM risk findings**: (1) **Compound non-determinism risk**: each agent introduces individual non-determinism; the coordinator synthesizing three non-deterministic inputs creates multiplicative uncertainty. There is no established quality attribute scenario specification for the system's combined accuracy — a critical gap before deployment. (2) **No human-in-the-loop risk**: medical diagnosis is a regulated activity with legal accountability. An autonomous diagnosis system without human oversight may violate medical practice laws in most jurisdictions, and creates liability exposure that is an architectural, not just operational, risk. (3) **Multi-agent prompt injection risk**: agent-to-agent communication creates a new attack surface — a malicious actor who can inject content into radiology scan metadata, lab result comments, or clinical note fields can potentially craft inputs that cause one agent to produce misleading outputs that cascade through the coordinator. (4) **Unexplained decisions risk**: if any patient or regulator requests an explanation for a diagnosis recommendation, the multi-agent system may not be able to provide a traceable, explainable reasoning chain — creating ATAM risk for explainability compliance scenarios. **Minimum safety architecture scenarios**: (A) "All diagnosis recommendations by the AI system shall require review and confirmation by a licensed physician before being communicated to patients or entered into the medical record." (B) "All agent-to-agent communications and the coordinator's synthesis reasoning shall be logged in full, with the complete chain queryable within 5 minutes of request." (C) "The system shall refuse to produce a diagnosis recommendation with confidence below 85% on any individual agent, and shall escalate all such cases to a physician for review, with escalation completing within 15 minutes." (D) "An authorized physician or administrator shall be able to halt all AI diagnosis activities within 60 seconds via authenticated emergency stop; the halt persists until cleared by the Chief Medical Officer."

---

*End of Quiz — Chapter 18*
