---
title: AI and Machine Learning System Architecture
description: AI/ML system architecture from training pipelines and model serving through LLM, RAG, and GraphRAG architectures, AI observability, non-deterministic behavior, model drift, and responsible AI design.
generated_by: claude skill chapter-content-generator
date: 2026-06-03 10:00:00
version: 0.08
---

# AI and Machine Learning System Architecture

!!! mascot-welcome "Vista Enters the Age of Intelligence"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Vista waving welcome">
    "Fellow architects, welcome to the chapter where the stakes just got extraordinary! AI systems are appearing in every ATAM evaluation, and they bring quality attribute challenges that classical architecture frameworks were simply never designed to handle. Non-determinism! Model drift! Latency variance! Explainability mandates! From up here I can see that the architects who understand AI system design will be the hidden superpowers of their organizations for the next decade. Let's weigh ALL the tradeoffs — there are more of them than ever!"

## Summary

AI and machine learning components are increasingly present in architectures submitted for ATAM evaluation, and they introduce quality attribute challenges that classical architecture frameworks were not designed to address — non-determinism, model drift, latency variance, and explainability requirements. This chapter introduces the AI system architecture stack: ML pipelines, training and serving architectures, feature stores, and model registries. It then covers the LLM-era additions — LLM architecture, prompt engineering, RAG, GraphRAG, and vector databases — and examines AI-specific quality concerns including AI observability, explainability, and the responsible AI design principles that govern safety and fairness.

## AI Systems and the ATAM Challenge

Traditional software systems are, at their core, deterministic: given identical inputs, they produce identical outputs, and their behavior can be fully described by their code. This property makes architectural analysis tractable — you can trace a request through the system, identify which components process it, and predict how changes to those components will affect quality attributes.

AI and machine learning systems break this assumption in fundamental ways. A neural network trained on historical data may perform differently on new data distributions even when the code is unchanged. An LLM produces different outputs for identical prompts due to temperature sampling. A fraud detection model that performed excellently at deployment may silently degrade as transaction patterns evolve — a phenomenon called model drift. These behaviors are not bugs; they are intrinsic properties of learned systems.

For ATAM practitioners, this creates a new category of architectural risk: **epistemic risk** — uncertainty not about whether the system will execute correctly, but about whether its learned behavior will remain aligned with quality attribute requirements as the world changes. Understanding the architecture of AI systems — how they are trained, how they serve predictions, how they are monitored, and how they are constrained to behave responsibly — is now a prerequisite for meaningful ATAM evaluation of any modern production system.

## The Machine Learning Pipeline Architecture

A **machine learning pipeline** is the end-to-end automated sequence of steps that transforms raw data into a deployed, serving model. Understanding the pipeline architecture is essential because each stage introduces quality attribute risks that must be evaluated.

The canonical ML pipeline has five major stages. **Data ingestion** collects raw data from operational systems, data lakes, or external providers. Data quality at this stage — completeness, accuracy, timeliness, and representativeness of the target population — is the most determinative factor in model quality, yet it is frequently underinvested. The architectural pattern of **data versioning** (treating datasets as versioned, immutable artifacts, analogous to source code commits) is a best practice that enables reproducibility and rollback.

**Feature engineering** transforms raw data into the numeric vector representations (features) that machine learning algorithms consume. Feature engineering is often the most labor-intensive stage of the pipeline, requiring domain expertise to determine which transformations produce predictive signal. Features may include aggregations (mean transaction amount over the past 30 days), encodings (one-hot encoding of categorical variables), and learned representations (embeddings from a pre-trained model).

**Model training** applies a learning algorithm to the feature-engineered dataset to produce model parameters. Training at production scale is computationally intensive, often requiring GPU clusters, distributed training frameworks (Horovod, PyTorch Distributed), and hours to days of computation. Model training is a **batch processing** workload: it operates on a fixed dataset with a known end-time, as opposed to stream processing which operates on continuously arriving data.

**Model evaluation** measures the trained model against a held-out test set (data that was not used during training) to estimate performance on unseen data. Evaluation metrics must be chosen to reflect the actual business objective: accuracy is often misleading for imbalanced classification problems (a model that always predicts "no fraud" achieves 99.9% accuracy if fraud is 0.1% of transactions, but catches zero fraud). Precision, recall, F1, AUC-ROC, and calibration are all commonly relevant.

**Model deployment** publishes the trained, evaluated model artifact for serving. This stage requires deciding between batch inference (the model runs periodically on a batch of inputs and stores results), online inference (the model responds to individual requests in real-time), and streaming inference (the model processes a continuous event stream). The choice has direct implications for latency, throughput, and infrastructure cost.

#### Diagram: ML Pipeline Architecture Flow

<iframe src="../../sims/ml-pipeline-explorer/main.html" width="100%" height="520px" scrolling="no"></iframe>

<details markdown="1">
<summary>Machine Learning Pipeline Architecture Explorer
</summary>

Type: Interactive workflow diagram
**sim-id:** ml-pipeline-explorer<br/>
**Library:** vis-network<br/>
**Status:** Specified

**Purpose:** Interactive visualization of the complete ML pipeline from data ingestion through deployment, with quality attribute risk indicators at each stage and ATAM evaluation hooks.

**Nodes:** Data Sources, Data Ingestion, Feature Engineering, Feature Store, Model Training, Model Registry, Model Evaluation, Deployment (Batch/Online/Streaming), Monitoring

**Interactions:**
- Click each node to see: quality attribute risks, common failure modes, ATAM sensitivity points
- Toggle pipeline type (batch, online, streaming) to see architecture variations
- "Simulate Drift" button shows monitoring alerts activating

**Display:** Risk heat map overlay showing which pipeline stages are most commonly flagged in ATAM evaluations.

</details>

## Feature Store and Model Registry

Two architectural components deserve focused attention because they address cross-cutting concerns that span the entire ML pipeline lifecycle: the feature store and the model registry.

A **feature store** is a centralized system for storing, managing, and serving the feature transformations that ML models require. Without a feature store, feature engineering code tends to be duplicated — the same "30-day transaction average" feature is computed slightly differently in the training pipeline, the online serving path, and the monitoring system — leading to **training-serving skew**, where the feature distributions the model was trained on differ from the features it receives in production. Training-serving skew is a notoriously difficult bug to detect because it produces subtle degradation rather than hard errors.

A mature feature store provides two interfaces: an **offline store** (a data warehouse or columnar storage optimized for training, which retrieves feature values as they existed at a specific point in time — critical for preventing data leakage in model training) and an **online store** (a low-latency key-value store optimized for feature retrieval during real-time inference, with typical p99 latency targets of < 5ms). The feature store manages the synchronization between these two stores, ensuring that the features used during training and inference are computed by identical logic.

An **ML model registry** is the version control system for trained model artifacts. Analogous to a software artifact repository (Maven, npm, Artifactory), the model registry stores trained model binaries along with their metadata: training dataset version, hyperparameters, evaluation metrics, training infrastructure configuration, and approval status. The registry enables reproducibility (training the same model version again from the same dataset produces identical results), lineage tracking (tracing a production model back to its training data), and staged promotion workflows (models progress from "experimental" to "staging" to "production" with gated approval at each stage).

!!! mascot-thinking "The Model Registry Is Your ATAM Audit Trail"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Vista thinking">
    From the high-level view, the model registry is where AI systems gain the traceability property that ATAM requires for risk analysis. When an evaluator asks "what happens if this model produces a biased prediction that harms a user?" the answer depends critically on whether the team can trace the production model back to its training data, identify what bias audits were performed, and verify that the approval workflow was followed. Without a model registry with governance integration, these questions cannot be answered — and that absence is itself an ATAM risk.

## Model Serving Architecture

**Model serving architecture** defines how trained model artifacts are deployed to serve predictions in production. Three serving patterns are common, each with distinct quality attribute tradeoffs.

**Batch inference** runs the model periodically on a large dataset and stores predictions in a database or object store for downstream consumption. A recommendation engine that precomputes "top 10 products for each user" nightly uses batch inference. Batch serving has excellent throughput (predictions can be computed in parallel at scale) and low serving infrastructure cost, but it cannot respond to real-time events — the recommendations reflect yesterday's model, not the user's current session behavior.

**Online inference** (also called real-time inference or synchronous serving) deploys the model as a web service that responds to individual prediction requests with low latency. A fraud detection system that evaluates each transaction as it occurs requires online inference. Online serving architectures must address model loading overhead (large models take seconds to load into memory — this is solved by pre-loading at service startup), instance scaling (prediction volume may vary significantly — this requires auto-scaling), and model versioning (routing a percentage of traffic to a new model version for A/B testing or canary deployment).

**AI latency considerations** are unique compared to application service latency. Neural network inference involves dense matrix multiplication, which benefits enormously from GPU acceleration. A large language model inference on CPU may take 10–30 seconds; on a GPU, the same inference takes < 1 second. The architectural choice of inference hardware (CPU, GPU, TPU, FPGA, specialized AI accelerators) is a major cost-performance tradeoff that must be evaluated in the context of the latency requirements from ATAM quality attribute scenarios.

**Stream processing architecture** deploys models within a continuous data processing pipeline (Apache Kafka Streams, Apache Flink, Spark Streaming) to apply predictions to events as they arrive. A real-time anomaly detection system that analyzes network traffic patterns uses stream inference. Stream serving provides both low latency and high throughput but requires the model to be integrated into the streaming framework, which adds operational complexity.

## LLM Architecture and Prompt Engineering

Large language models represent a qualitatively different category of AI system from traditional ML models, and they require architectural patterns specifically designed for their properties.

An **LLM (Large Language Model)** is a neural network trained on vast quantities of text using a self-supervised objective (predicting the next token in a sequence). Models with billions of parameters, trained on internet-scale text corpora, develop remarkable capabilities: generating coherent text, answering questions, summarizing documents, translating languages, writing and debugging code, and reasoning about complex problems. The commercial LLM landscape includes OpenAI's GPT series, Anthropic's Claude, Google's Gemini, and Meta's Llama (open-source), among many others.

**Non-deterministic behavior** is an intrinsic property of LLMs that creates unique quality attribute challenges. The same prompt submitted to the same model twice will produce different outputs due to **temperature sampling** — a stochastic process that samples from the probability distribution over possible next tokens rather than always selecting the most probable one. Temperature is a configurable parameter: temperature 0 produces approximately deterministic (but repetitive) outputs; temperature 1 produces creative but less predictable outputs. For production applications, understanding and specifying acceptable output variability is a new type of quality attribute scenario that ATAM teams must learn to elicit.

**Prompt engineering** is the discipline of designing the text inputs (prompts) that guide LLM behavior toward desired outputs. Unlike traditional software where behavior is determined by code, LLM behavior is heavily influenced by prompt structure. A prompt that includes clear instructions, relevant context, worked examples (few-shot prompting), and explicit output format specifications typically produces higher-quality, more consistent outputs than an unstructured prompt. System prompts (instructions that define the assistant's role and constraints, provided separately from user input) are the primary mechanism for customizing LLM behavior for specific applications.

From an ATAM perspective, prompt engineering is a **sensitivity point**: small changes to prompt structure can dramatically affect the quality, format, consistency, and safety of LLM outputs. A prompt that works well for 95% of inputs may produce harmful or embarrassing outputs for specific adversarial inputs (**prompt injection attacks** — inputs crafted to override system prompt instructions). This makes prompt engineering not just a user experience concern but a security architecture concern.

!!! mascot-tip "LLM Output Quality Is an ATAM Quality Attribute"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Vista with a tip">
    Here is something most ATAM teams have not yet figured out: LLM output quality must be specified as a quality attribute scenario, not assumed. "The response shall be factually accurate 95% of the time for domain-specific questions, as measured by human evaluation against a test set of 500 representative queries" is a measurable availability scenario. Without explicit quality scenarios for AI components, the ATAM evaluation cannot assess risk — and the risk is real.

## RAG Architecture: Retrieval-Augmented Generation

A fundamental limitation of LLMs is that their knowledge is frozen at their training cutoff date and does not include proprietary organizational information. A customer service LLM that was trained on general text has no knowledge of your product catalog, your pricing, your policies, or your customers' account histories.

**Retrieval-Augmented Generation (RAG)** solves this by combining two systems: a **retrieval system** that searches a curated knowledge base for documents relevant to a user query, and a **generation system** (the LLM) that synthesizes an answer using both the user query and the retrieved documents as context. The LLM receives a prompt that says, in effect, "here is the user's question and here are the relevant documents from our knowledge base — please answer the question based on these documents."

The architectural components of a RAG system are:

**Document ingestion pipeline**: Source documents (product manuals, knowledge base articles, internal wikis, support tickets) are processed, chunked into segments of appropriate size (typically 256–1,024 tokens), and converted to **embedding vectors** — dense numeric representations of semantic meaning — using an embedding model.

**Vector database**: The embedding vectors are stored in a specialized database that supports efficient nearest-neighbor search. When a user submits a query, the query is also embedded, and the vector database retrieves the documents whose embeddings are most similar (cosine similarity or dot product distance) to the query embedding. This semantic search finds relevant documents even when they don't contain the exact keywords from the query.

**LLM generation**: The retrieved documents and the user query are combined into a prompt sent to the LLM, which generates a grounded, context-specific response.

RAG quality attribute tradeoffs are complex. Retrieval quality (are the right documents being retrieved?) determines response accuracy — poor retrieval produces hallucinated answers because the LLM has no relevant context to ground its response. Chunking strategy affects both retrieval precision and context coherence. End-to-end latency includes both vector search time (typically 50–200ms for well-optimized vector databases) and LLM generation time (500ms–5s depending on response length and model). The RAG pipeline must be evaluated as a complete system in ATAM scenarios, not as individual components.

## Vector Database Architecture

**Vector databases** are specialized data stores optimized for the storage and retrieval of high-dimensional embedding vectors through approximate nearest-neighbor (ANN) search. Unlike relational databases that excel at exact-match queries on structured data, vector databases are designed to answer the question "what are the K most semantically similar items to this query vector?"

Popular vector database implementations include Pinecone, Weaviate, Qdrant, Milvus, and pgvector (a PostgreSQL extension). They vary along several quality attribute dimensions: query latency (p99 ANN search time, typically 10–200ms depending on index size and configuration), recall accuracy (what fraction of the true nearest neighbors are returned — higher recall requires more computation), indexing throughput (how quickly new vectors can be added to the index), and scale (maximum index size that can be served from a single node or cluster).

The **HNSW (Hierarchical Navigable Small World)** algorithm is the most widely used ANN index structure, offering an excellent recall-vs-latency tradeoff by organizing vectors in a hierarchical proximity graph. The key tradeoff parameters are `ef_construction` (higher values produce better recall at index build time with more memory and time cost) and `M` (the number of connections per node — higher values improve recall but increase memory consumption). These are the sensitivity parameters that ATAM vector database scenario analysis should examine.

## GraphRAG Architecture

**GraphRAG** extends the RAG paradigm by replacing or augmenting the vector similarity search with graph traversal over a **knowledge graph** — a structured representation of entities and their relationships. Where flat document RAG retrieves semantically similar text chunks, GraphRAG can follow explicit relationship paths: "find all products related to this customer's purchase history, and retrieve their compatibility notes and common failure modes."

Knowledge graphs represent information as triples: (subject, predicate, object) — for example, (Product A, requires, Component B), (Customer X, purchased, Product A), (Component B, incompatible_with, Component C). Graph traversal can efficiently answer multi-hop reasoning questions that are difficult for vector search alone: "what components does this customer need, given what they have purchased, and are any of them incompatible with each other?"

GraphRAG architectures combine a knowledge graph (Neo4j, Amazon Neptune, property graph databases) with a vector index for semantic retrieval of unstructured text. The graph provides structural reasoning capability; the vector index provides semantic similarity retrieval. This hybrid approach is particularly powerful for enterprise knowledge management applications, pharmaceutical research (protein interaction graphs), and supply chain analysis.

#### Diagram: RAG vs. GraphRAG Architecture Comparison

<iframe src="../../sims/rag-architecture-explorer/main.html" width="100%" height="520px" scrolling="no"></iframe>

<details markdown="1">
<summary>RAG vs. GraphRAG Architecture Explorer
</summary>

Type: Interactive architecture comparison
**sim-id:** rag-architecture-explorer<br/>
**Library:** vis-network<br/>
**Status:** Specified

**Purpose:** Side-by-side animated comparison of flat RAG and GraphRAG architectures showing the complete request flow from user query through retrieval to LLM generation.

**Left panel (RAG):** User query → Embedding model → Vector DB (similarity search) → Top-K documents → LLM prompt assembly → LLM → Response

**Right panel (GraphRAG):** User query → Entity extraction → Knowledge Graph (graph traversal) → Related entities + Vector DB (semantic search) → Combined context → LLM prompt → LLM → Response

**Interactions:**
- Click each component to see: purpose, latency contribution, quality risks
- "Show Latency Budget" mode: animate request flow with per-step timing
- Toggle "Complex reasoning query" vs. "Simple factual query" to see when GraphRAG advantage is most pronounced

</details>

## Model Drift Detection

**Model drift** is the gradual degradation of model performance in production caused by changes in the statistical properties of the data the model receives, relative to the data it was trained on. Because ML models learn statistical associations from their training data, any meaningful change in real-world patterns can cause performance to degrade — even if the model code, infrastructure, and deployment configuration remain unchanged.

Two forms of drift are architecturally important. **Data drift** (also called **covariate drift**) occurs when the distribution of input features changes: the user population shifts to include age groups underrepresented in training data, seasonal patterns alter transaction timing, or a market event changes purchase behavior. The model's learned associations remain valid in principle but are applied to inputs from a different distribution than expected.

**Concept drift** is more severe: the underlying relationship between inputs and outputs changes. A credit scoring model trained before an economic recession may learn that a certain income level predicts low default probability; after a recession, that association may reverse entirely. Concept drift invalidates the model's learned associations themselves, not just their applicability.

Model drift detection requires continuous monitoring of two signal types: **input distribution monitoring** (statistical tests comparing the current input feature distribution against the training distribution — PSI, KS test, Wasserstein distance) and **output monitoring** (tracking model prediction distributions and, when labels become available, actual performance metrics against held-out ground truth). When drift is detected, the automated response should trigger model retraining on fresh data, followed by evaluation and staged deployment — completing the **continuous training** (CT) cycle that extends the CI/CD pipeline into the model lifecycle.

!!! mascot-warning "Silently Degrading AI Systems Are the Sneakiest ATAM Risk"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Vista warning">
    Here is a horror story for ATAM practitioners: a fraud detection model is deployed, performs excellently for months, and then gradually begins missing more and more fraud cases. No alert fires. No error rate increases. Traffic looks normal. Losses climb silently for six months before a compliance review reveals that model accuracy has dropped from 95% to 67%. This is model drift in its most dangerous form — invisible until catastrophic. ATAM evaluations of AI systems must explicitly ask: "what monitors your model's quality, and what triggers retraining?" If the answer is "we check quarterly," document it as a critical risk.

## AI Observability

Traditional observability (from Chapter 16) covers infrastructure and application behavior. AI systems require an additional layer of **AI observability** that monitors the behavior of learned components specifically.

AI observability encompasses four monitoring dimensions. **Input monitoring** tracks the statistical properties of inputs to the AI component (feature distributions, text length distributions for LLMs, query embedding similarity distributions) and compares them against baseline distributions from training. **Output monitoring** tracks the statistical properties of model outputs (prediction class distributions, confidence score distributions, LLM response length and sentiment distributions) to detect shifts that indicate model behavior changes. **Performance monitoring** tracks ground-truth-relative metrics (accuracy, precision, recall, F1, BLEU score for text generation) when labels are available — either immediately (for synchronous classification tasks) or with delay (for outcomes like fraud that are confirmed days or weeks later). **Data quality monitoring** tracks upstream data quality issues that can silently corrupt features before they reach the model.

For LLM applications specifically, AI observability includes **LLM tracing** — capturing input prompts, output responses, token counts, latency, and cost for every LLM call — and **response quality evaluation** — either automated (using another LLM as an evaluator, or rule-based quality checks) or human-in-the-loop (sampling responses for human quality review). LLM tracing platforms (LangSmith, Arize, Weights & Biases Prompts) provide specialized tooling for this purpose.

The ATAM implication is that AI observability must be treated as a first-class architectural requirement, not an afterthought. Quality attribute scenarios for AI components should specify observable metrics (not just business outcomes), monitoring infrastructure should be designed in parallel with model development, and evaluation frameworks should be agreed upon before deployment.

## AI Explainability

**AI explainability** (also called interpretability) is the property of an AI system that enables its decisions to be understood and explained to affected parties — customers, regulators, internal auditors, and legal counsel. Explainability is increasingly a legal requirement, not just a good practice: the EU AI Act, the US Equal Credit Opportunity Act, the General Data Protection Regulation's right to explanation, and various sectoral regulations (healthcare, financial services) impose explainability requirements on automated decision systems.

Explainability techniques operate at two levels. **Global explainability** describes the model's behavior across its entire input space: which features are most important overall (feature importance via permutation importance or SHAP values), what decision boundaries the model has learned, how the model behaves across demographic groups. **Local explainability** (also called **instance-level explainability**) describes why the model made a specific prediction for a specific input: SHAP values for a single prediction, LIME (Local Interpretable Model-agnostic Explanations) for a specific instance, attention maps for neural networks.

For LLMs, explainability is particularly challenging because the learned representations are high-dimensional and opaque. Chain-of-thought prompting (asking the model to "think step by step" before giving its answer) provides a form of process transparency, but the chain-of-thought may not accurately reflect the model's internal computation. This is an active research area with significant implications for high-stakes LLM deployments.

## Responsible AI Architecture

**Responsible AI** is the design discipline concerned with ensuring that AI systems are safe, fair, transparent, accountable, and privacy-preserving. As AI systems are used for increasingly consequential decisions — credit scoring, hiring, medical diagnosis, criminal justice risk assessment, content moderation — the architectural decisions that determine their behavior become questions of social and ethical consequence, not just technical preference.

The responsible AI framework has several dimensions that have direct architectural implications:

**Fairness** requires that model predictions not systematically disadvantage groups based on protected characteristics (race, gender, age, disability). Fairness-aware architecture includes training data bias audits, demographic parity and equalized odds evaluations, and monitoring for disparate impact in deployed predictions. The architectural challenge is that different formal fairness definitions are mathematically incompatible (a model cannot simultaneously satisfy demographic parity, equalized odds, and individual fairness) — this incompatibility is itself an ATAM tradeoff point that must be explicitly surfaced and resolved with stakeholders.

**Safety** requires that AI systems do not produce outputs that are harmful, dangerous, or offensive, and that they degrade gracefully rather than catastrophically when they encounter novel inputs. LLM safety architecture includes **guardrails** — classifiers or rule systems that screen both inputs (detecting harmful requests) and outputs (filtering harmful responses) — as well as red-teaming (systematic adversarial testing of safety boundaries).

**Accountability** requires that there are traceable records of who built the model, what data it was trained on, what evaluations were performed, and who approved its deployment. This is precisely what the model registry and data versioning systems from earlier in this chapter provide — they are not just engineering best practices but responsible AI infrastructure.

**Privacy by design** requires that AI systems minimize collection and use of personal data, provide mechanisms for data subjects to request deletion of their data from training datasets, and protect the privacy of individuals through techniques like differential privacy and federated learning.

#### Diagram: Responsible AI Architecture Components

<iframe src="../../sims/responsible-ai-explorer/main.html" width="100%" height="520px" scrolling="no"></iframe>

<details markdown="1">
<summary>Responsible AI Architecture Components Explorer
</summary>

Type: Interactive framework diagram
**sim-id:** responsible-ai-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Purpose:** Interactive map of responsible AI architectural requirements across the five dimensions (fairness, safety, transparency, accountability, privacy), showing which architectural components address which requirements.

**Controls:**
- Hover over each dimension → highlights which architectural components address it
- Click each architectural component → shows: purpose, implementation examples, ATAM quality attribute mapping
- "Compliance Gap Analysis" mode: highlights requirements that the current architecture does not address

**Display:**
- Radar chart showing coverage across five responsible AI dimensions
- Risk matrix: unaddressed requirements plotted by likelihood × impact
- Regulatory requirement mapper (GDPR, EU AI Act, ECOA)

</details>

!!! mascot-encourage "AI Architecture Is the New Frontier of ATAM"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Vista encouraging">
    This is genuinely new territory, and the uncertainty is part of the excitement. The architects who are developing ATAM evaluation practices for AI systems right now are writing the playbook that the field will use for the next decade. You are not behind — you are early. The concepts from this chapter give you the vocabulary to ask the right questions in any AI system ATAM evaluation: "How do you detect drift?" "What are your explainability obligations?" "What does your model registry governance look like?" These questions will mark you as someone who truly understands AI system architecture.

## AI System Architecture in ATAM Evaluations

An ATAM evaluation of a system containing AI components must address a new category of quality attribute scenarios that do not exist in traditional systems. These scenarios typically span several quality attributes simultaneously:

**Performance + Non-determinism**: "The LLM-based customer service assistant shall respond within 3 seconds at p95 under 500 concurrent users, and responses must pass content safety evaluation in 95% of cases." This scenario combines a performance target (p95 latency) with an output quality target (safety pass rate) — requiring both infrastructure scaling analysis and guardrail architecture evaluation.

**Reliability + Model drift**: "The fraud detection model's precision shall not drop below 90% between retraining cycles, measured on a held-out test set evaluated weekly." This scenario makes model quality a reliability concern — the system is not "available" in a meaningful sense if the model has drifted below its quality threshold. This requires continuous monitoring infrastructure and automated retraining pipelines.

**Explainability + Compliance**: "All credit decision recommendations by the AI system shall be explainable to the applicant in plain language within 30 seconds of request, in compliance with Regulation B requirements." This scenario requires that explainability not just exist as a capability but be low-latency enough to serve interactively.

ATAM findings in AI system evaluations typically include sensitivity points around model selection (different model architectures have fundamentally different latency, accuracy, and explainability tradeoffs), tradeoff points around inference infrastructure (GPU cost vs. latency vs. reliability), and architectural risks around model drift monitoring (most teams underinvest in this).

!!! mascot-celebration "You Are Now an AI System Architect"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Vista celebrating">
    From up here the view keeps getting better! You have just navigated the complete AI system architecture landscape — ML pipelines to LLMs, RAG to GraphRAG, observability to responsible AI — and you can connect every concept to ATAM quality attribute analysis. The teams deploying AI systems without this analytical framework are flying blind. You are not. Let's weigh those tradeoffs — all twenty of them — and build AI systems that are performant, reliable, explainable, fair, and safe. You have earned your wings, fellow architect!

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

1. **AI System Architecture** — the structural organization of AI components within production software systems
2. **Machine Learning Pipeline** — end-to-end automated sequence from data ingestion through model deployment
3. **Model Training Architecture** — infrastructure for running learning algorithms at scale with distributed GPU training
4. **Model Serving Architecture** — patterns for deploying models: batch, online, and stream inference
5. **Feature Store Architecture** — centralized system for consistent feature computation across training and serving
6. **ML Model Registry** — version control for model artifacts with metadata, lineage, and governance workflows
7. **AI Latency Considerations** — hardware acceleration choices (CPU/GPU/TPU) and their latency-cost tradeoffs
8. **Non-Deterministic Behavior** — LLM temperature sampling and its implications for output quality guarantees
9. **Model Drift Detection** — data drift and concept drift monitoring with PSI, KS tests, and continuous training
10. **Data Pipeline Architecture** — ingestion, transformation, and versioning of training data at scale
11. **Batch Processing Architecture** — periodic large-dataset processing for training and batch inference
12. **Stream Processing Architecture** — continuous event stream processing for real-time inference
13. **LLM Architecture** — large language models, their properties, and architectural integration patterns
14. **Prompt Engineering** — designing prompts for consistent, high-quality LLM outputs and safety
15. **RAG Architecture** — retrieval-augmented generation combining vector search with LLM generation
16. **GraphRAG Architecture** — graph-traversal-augmented retrieval for multi-hop reasoning over knowledge graphs
17. **Vector Database Architecture** — approximate nearest-neighbor search systems with HNSW indexing
18. **AI Observability** — monitoring for input/output distributions, model performance, and LLM tracing
19. **AI Explainability** — SHAP, LIME, and chain-of-thought techniques for decision transparency
20. **Responsible AI Architecture** — fairness, safety, accountability, and privacy design principles

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Software Architecture Foundations](../01-software-architecture-foundations/index.md)
- [Chapter 15: Performance Engineering and Scaling](../15-performance-engineering-scaling/index.md)

## Self-Check Questions

??? question "Self-Check: AI System Architecture — Click to Reveal Answers"
    **Q1:** A team is building a customer service chatbot using an LLM and proposes using temperature=0.9 for "more natural conversations." What ATAM quality attribute concern would you raise?

    **Answer:** High temperature values increase output variability (non-determinism), which makes output quality harder to guarantee. For customer service, this means some fraction of responses may be inaccurate, inconsistent, or off-brand. An ATAM scenario might specify "95% of responses shall be rated acceptable by human evaluators on a 500-query test set." At temperature=0.9, this target may be harder to meet than at temperature=0.2–0.4. Additionally, high temperature increases susceptibility to prompt injection (adversarial inputs are more likely to produce unexpected outputs). The team should A/B test temperature values against quality metrics rather than selecting based on subjective "naturalness."

    **Q2:** Explain training-serving skew and why a feature store prevents it.

    **Answer:** Training-serving skew occurs when the feature values a model is trained on have different statistical properties from the features it receives during serving — typically because the training pipeline and the serving pipeline compute the same features using slightly different code, different data windows, or different data sources. For example, "average transaction amount in the last 30 days" might be computed using a training dataset's offline SQL query, but served using a different real-time aggregation implementation with a bug that uses 29-day windows. The model learns on 30-day averages but serves on 29-day averages, silently degrading accuracy. A feature store prevents this by making both training and serving use the same feature computation code and the same data store — the offline store and online store are synchronized from identical feature definitions, so the training-serving distribution gap is eliminated by construction.

    **Q3:** A RAG system has a vector database with 10 million documents. The p99 retrieval latency is 250ms and LLM generation is 1,800ms. The SLO requires p95 end-to-end latency ≤ 2,000ms. What architectural options exist for meeting this target?

    **Answer:** The total pipeline p99 is at least 250ms + 1,800ms = 2,050ms, which already exceeds the p95 target of 2,000ms. Options: (1) Optimize vector DB — reduce index size through chunking strategy tuning, use approximate (lower recall) ANN search, or shard the index across multiple query nodes to reduce per-node index size and improve p99. Target: < 100ms p99. (2) Reduce LLM generation latency — use a smaller/faster model, reduce context window size (fewer retrieved documents), enable streaming response (p95 time-to-first-token may be acceptable while full response exceeds target), or use speculative decoding. (3) Streaming delivery — report p95 time to first meaningful token (< 500ms) rather than full response, which changes the user experience model. (4) Caching — cache embeddings for frequently repeated queries and cache full responses for identical queries. The tradeoff is freshness vs. latency.

    **Q4:** In an ATAM evaluation, a team proposes a model drift monitoring strategy of "we retrain quarterly." What risks would you document?

    **Answer:** This is a significant availability and reliability risk for any high-consequence AI system. Risks to document: (1) Severity: 3-month silent degradation window — if concept drift occurs the day after retraining, the model degrades silently for up to 89 days before the next retraining. For fraud detection, this means 89 days of increasing fraud losses. (2) No automated detection — quarterly retraining is a schedule, not a triggered response to drift. True drift monitoring requires continuous input/output distribution comparison against baseline. (3) No rollback mechanism — if retraining produces a worse model, quarterly cadence provides no rapid remediation path. Mitigation: implement continuous drift monitoring with automated alerts, triggered retraining on drift detection, and blue-green model deployment with automated rollback on performance regression.
