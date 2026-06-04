# Quiz: AI and Machine Learning System Architecture

Test your understanding of ML pipelines, feature stores, model serving, LLM architecture, RAG, vector databases, model drift, AI observability, explainability, and responsible AI design. Each question is followed by a collapsed answer block.

## Questions

### Question 1

What are the five major stages of a canonical machine learning pipeline? Briefly describe the quality attribute risk most commonly associated with each stage.

??? note "Answer"
    (1) **Data ingestion**: collects raw data from operational systems or data lakes. Primary risk: **data quality** — incomplete, inaccurate, or unrepresentative training data is the most determinative factor in model quality failure. (2) **Feature engineering**: transforms raw data into numeric vectors. Primary risk: **training-serving skew** — different feature computation code in training vs. serving pipelines produces feature distribution mismatches that silently degrade model performance. (3) **Model training**: applies learning algorithms to produce model parameters. Primary risk: **resource cost and time** — GPU cluster failures or misconfigured distributed training frameworks can waste compute resources and delay model availability. (4) **Model evaluation**: measures trained model against held-out test data. Primary risk: **metric selection** — choosing accuracy for imbalanced datasets (e.g., fraud detection) produces misleadingly high scores while the model catches zero actual events. (5) **Model deployment**: publishes the model for serving. Primary risk: **latency and throughput** — batch, online, and streaming inference each have fundamentally different latency, cost, and freshness profiles that must match the scenario requirements.

---

### Question 2

What is **training-serving skew**, and how does a feature store prevent it?

??? note "Answer"
    Training-serving skew occurs when the feature values a model is trained on have different statistical properties from the features it receives during serving — typically because the training pipeline and the serving pipeline compute the same features using slightly different code, different data time windows, or different data sources. Example: "average transaction amount in the last 30 days" computed by a training SQL query (using 30-day windows exactly) vs. a serving-side implementation with a subtle bug that uses 29-day windows. The model learns on 30-day averages but serves on 29-day averages, silently degrading accuracy without any technical error being raised. A **feature store** prevents this by making both training and serving use the same feature computation code and the same data store: the offline store (optimized for training batch retrieval) and online store (optimized for low-latency serving retrieval) are synchronized from identical feature definitions, so the training-serving distribution gap is eliminated by construction.

---

### Question 3

Which of the following best describes **non-deterministic behavior** in LLMs and its ATAM implication?

A. LLMs produce random outputs that cannot be relied upon for production use  
B. LLM temperature sampling produces different outputs for identical prompts; output quality must be specified as a quality attribute scenario with measurable targets  
C. Non-determinism in LLMs is a security vulnerability that must be patched  
D. LLMs become deterministic when temperature is set to 1.0  

??? note "Answer"
    The correct answer is **B**. **Temperature sampling** is a stochastic process that samples from the probability distribution over next tokens rather than always selecting the most probable one. This is not a bug — it is a design feature that enables creativity and diversity in outputs. From an ATAM perspective, the key implication is that LLM output quality must be specified as a measurable quality attribute scenario, not assumed. A well-formed scenario: "The LLM customer service assistant shall produce responses rated acceptable by human evaluators in ≥ 95% of cases on a 500-query benchmark." Temperature 0 produces approximately deterministic (but repetitive) outputs; temperature 1 produces creative but less predictable outputs. The appropriate temperature depends on the quality attribute scenario requirements — lower for tasks requiring consistency (code generation), higher for tasks benefiting from creativity (content generation).

---

### Question 4

A customer service LLM uses a temperature of 0.9 "for more natural conversations." What ATAM concerns would you raise?

??? note "Answer"
    Two concerns: (1) **Output quality risk**: High temperature increases output variability, making quality guarantees harder to achieve. For customer service, some fraction of responses may be inaccurate, inconsistent with company policy, or off-brand. If the system has a quality scenario ("≥ 95% of responses rated acceptable"), this must be empirically tested at temperature=0.9 against the benchmark — not assumed. High temperature may make this target unachievable. (2) **Security risk (prompt injection)**: High temperature increases susceptibility to adversarial inputs. A carefully crafted user message designed to override system prompt instructions ("ignore previous instructions and...") is more likely to produce unexpected, potentially harmful outputs at high temperature, because the model is more likely to follow unusual sampling paths. The team should A/B test temperature values (e.g., 0.2, 0.5, 0.9) against both quality metrics and adversarial robustness benchmarks, not select based on subjective "naturalness."

---

### Question 5

Describe the architectural components of a RAG (Retrieval-Augmented Generation) system. What quality attribute tradeoffs does RAG introduce compared to a standalone LLM?

??? note "Answer"
    **RAG components**: (1) **Document ingestion pipeline** — processes source documents, chunks them into appropriate segments (256-1,024 tokens), and converts them to embedding vectors using an embedding model. (2) **Vector database** — stores embedding vectors and supports efficient nearest-neighbor search; when a user query arrives, it is embedded and the vector database retrieves the most semantically similar document chunks. (3) **LLM generation** — receives the user query combined with retrieved documents as context, and generates a grounded, context-specific response. **Quality attribute tradeoffs**: RAG *improves* **accuracy/reliability** (LLM has relevant context, reducing hallucinations) and **freshness** (knowledge base can be updated without retraining). RAG *threatens* **latency** — end-to-end latency includes vector search time (50-200ms) plus LLM generation time (500ms-5s), making RAG systems significantly slower than standalone LLM calls. RAG also introduces **retrieval quality** as a new failure mode: poor retrieval (wrong documents returned) produces poor generation quality even with a high-quality LLM.

---

### Question 6

Which of the following HNSW (Hierarchical Navigable Small World) index parameters is a sensitivity point for the recall-vs-latency tradeoff in a vector database?

A. The database replication factor  
B. The `ef_construction` parameter and `M` (connections per node) — higher values improve recall at the cost of memory and query time  
C. The number of embedding dimensions (fixed by the embedding model)  
D. The vector database vendor selection  

??? note "Answer"
    The correct answer is **B**. The HNSW parameters `ef_construction` and `M` are the primary sensitivity levers for the recall-vs-latency tradeoff. Higher `ef_construction` values produce better recall at index build time (the search explores more candidate neighbors), but require more memory and time to build the index. Higher `M` values (connections per node in the proximity graph) improve query recall but increase memory consumption per vector. These are the parameters that ATAM vector database analysis should examine: a configuration that maximizes recall may violate latency SLOs; a configuration that minimizes latency may provide insufficient recall accuracy for the quality attribute scenario. The embedding dimension (C) is fixed by the model; vendor selection (D) affects the parameter options available but is not itself the sensitivity mechanism.

---

### Question 7

Define **data drift** and **concept drift**. Which is more severe from an ATAM risk perspective, and why?

??? note "Answer"
    **Data drift** (covariate drift) occurs when the distribution of input features changes relative to the training distribution — the user population shifts, seasonal patterns alter transaction timing, or market events change behavior. The model's learned associations remain valid in principle but are applied to inputs from a different distribution than expected, typically causing gradual performance degradation. **Concept drift** is more severe: the underlying relationship between inputs and outputs changes. A credit scoring model trained before an economic recession learns that a certain income level predicts low default probability; after a recession, that association may reverse entirely. Concept drift **invalidates the model's learned associations themselves**, not just their applicability — the model is now fundamentally wrong, not just operating out of distribution. From an ATAM risk perspective, concept drift is more severe because: (1) performance degradation is typically faster and larger-magnitude; (2) the model is actively providing wrong guidance rather than just less accurate guidance; (3) retraining on the new distribution requires the team to identify that the relationship has changed, not just collect more data of the same type.

---

### Question 8

A team proposes a model drift monitoring strategy of "quarterly retraining." What specific architectural risks would you document in an ATAM evaluation?

A. No risks — quarterly retraining is a standard industry practice  
B. High-severity risks including silent degradation window, lack of triggered detection, and no rollback mechanism  
C. Low-severity risk — drift monitoring is an operational concern, not architectural  
D. Medium-severity risk only if the model is used in a regulated industry  

??? note "Answer"
    The correct answer is **B**. Quarterly retraining is a *schedule*, not a drift response system. Risks to document: (1) **Silent degradation window** (High severity): if drift occurs the day after retraining, the model can degrade silently for up to 89 days before the next retraining. For fraud detection, this means 89 days of increasing losses; for healthcare, it means degraded diagnostic accuracy during that window. (2) **No automated detection**: quarterly retraining is triggered by calendar, not by measured drift. True drift monitoring requires continuous comparison of input/output distributions against training baselines. (3) **No rollback mechanism**: if a retraining produces a worse model (possible when the new training data itself contains anomalies), the quarterly cadence provides no rapid path to roll back to the previous version. The mitigation requires continuous drift monitoring with automated alerts, triggered retraining on drift detection, and blue-green model deployment with automated rollback on performance regression.

---

### Question 9

What is **AI explainability**, and why has it become an architectural (not just research) requirement for many production AI systems?

??? note "Answer"
    AI explainability (or interpretability) is the property of an AI system that enables its decisions to be understood and explained to affected parties — customers, regulators, internal auditors, and legal counsel. It has become an architectural requirement because: (1) **Legal requirements**: the EU AI Act, the US Equal Credit Opportunity Act, GDPR's right to explanation, and sectoral regulations (healthcare, financial services) impose explainability obligations on automated decision systems. Non-compliance is a legal and financial risk. (2) **Scenario requirements**: ATAM scenarios may specify "all credit decision recommendations shall be explainable to the applicant in plain language within 30 seconds of request" — this is a performance + explainability composite requirement that must be built into the serving architecture (not computed on request as an afterthought). (3) **Operational requirements**: when a model produces a harmful or anomalous output, explainability enables rapid root-cause analysis — was it a training data issue, a feature issue, or a model architecture issue?

---

### Question 10

Which of the following is an architecturally incompatible combination according to the responsible AI fairness framework?

A. Fairness audits and model registry governance  
B. Demographic parity, equalized odds, and individual fairness — these three formal fairness definitions are mathematically incompatible and cannot all be simultaneously satisfied  
C. Privacy by design and differential privacy  
D. Safety guardrails and model versioning  

??? note "Answer"
    The correct answer is **B**. Different formal fairness definitions are mathematically incompatible — a model cannot simultaneously satisfy demographic parity (equal selection rates across demographic groups), equalized odds (equal true positive and false positive rates across groups), and individual fairness (similar individuals receive similar predictions). This incompatibility is itself an **ATAM tradeoff point** that must be explicitly surfaced and resolved with stakeholders: which fairness definition is legally required or most aligned with the system's values? Making this choice implicitly — by selecting whatever the algorithm minimizes — leaves the organization vulnerable to challenges under whichever fairness definition was not optimized. The choice must be documented as a stakeholder decision with explicit reasoning.

---

### Question 11

Scenario: A financial services firm deploys an AI system for loan application processing. The (H,H) explainability scenario states: "All loan denial decisions made by the AI must be explainable to the applicant in plain language within 30 seconds of request, in compliance with the Equal Credit Opportunity Act." The system uses a neural network with 50 million parameters. What architectural approach is required, and what performance considerations apply?

??? note "Answer"
    A 50M-parameter neural network is opaque by nature — its internal computation cannot be directly summarized in plain language. The architecture requires **instance-level explainability** using SHAP (SHapley Additive exPlanations) or LIME (Local Interpretable Model-agnostic Explanations). Architectural approach: pre-compute SHAP values for each prediction at serving time (not on request), store them with the prediction record, and serve them from a fast lookup when the applicant requests an explanation. **Performance considerations**: SHAP value computation for a 50M-parameter model can take 10-30 seconds per prediction if computed naively — far too slow for the 30-second requirement with on-demand computation. The architectural solution is **parallel pre-computation**: compute SHAP values immediately after each prediction (in the background, asynchronously), store them indexed by loan application ID, and return them from this index when the explanation is requested. If SHAP computation itself takes > 30 seconds even in background, model simplification, surrogate model approaches, or switching to a more interpretable model architecture (gradient boosted trees with native feature importance) should be evaluated. This is an accuracy-vs-explainability tradeoff point: simpler, more interpretable models may have lower accuracy but meet regulatory requirements that opaque neural networks cannot.

---

### Question 12 (Analyze)

A RAG system for enterprise knowledge management has a vector database with 10 million documents. The p99 retrieval latency is 250ms, and LLM generation is 1,800ms at p99. The SLO requires p95 end-to-end latency ≤ 2,000ms. Analyze the current architecture against this SLO, identify the architectural risks, and evaluate three distinct options for meeting the target with their tradeoffs.

??? note "Answer"
    **Current state analysis**: Pipeline p99 = at least 250ms + 1,800ms = 2,050ms. The p99 already exceeds the p95 target of 2,000ms, meaning the SLO is likely violated even under normal conditions (p95 would be somewhat below p99, but the gap of only 50ms provides essentially no headroom). **Architectural risks**: (1) Any latency variance (network jitter, query complexity variance, GC pauses) pushes p95 above target. (2) Under load, retrieval p99 typically increases as the vector index contends for compute resources. **Three options**: **Option 1 — Optimize vector retrieval** (target: < 100ms p99): shard the index across multiple query nodes to reduce per-node index size; use approximate ANN search with lower recall parameters; implement query result caching for repeated similar queries. Tradeoff: lower recall accuracy means occasionally retrieving less relevant documents, potentially reducing answer quality. **Option 2 — Optimize LLM generation** (target: < 1,800ms at p99): use a smaller/faster model with comparable quality; reduce context window by returning fewer retrieved documents; enable streaming response delivery so the user sees partial responses while generation continues (this changes the UX but may reduce perceived latency); implement speculative decoding. Tradeoff: smaller models may sacrifice answer quality; fewer context documents may increase hallucination rate. **Option 3 — Caching and pre-computation**: cache embedding vectors for frequently repeated queries (eliminate retrieval for common questions); cache full responses for identical queries (eliminates both retrieval and generation). Tradeoff: cache freshness — stale cached responses may not reflect knowledge base updates. The optimal solution likely combines elements of all three options, with the choice of which to prioritize driven by which quality attribute scenario is highest priority: retrieval accuracy, answer quality, or latency.

---

*End of Quiz — Chapter 17*
