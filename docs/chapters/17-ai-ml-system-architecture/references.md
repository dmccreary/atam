# References: AI and Machine Learning System Architecture

Curated sources for deeper study of ML pipelines, model serving, feature stores, model registries, LLM architecture, RAG, GraphRAG, vector databases, model drift, AI observability, and responsible AI design.

## Books

- **Huyen, Chip. (2022). *Designing Machine Learning Systems: An Iterative Process for Production-Ready Applications*. O'Reilly Media.** The most comprehensive guide to production ML system architecture, covering training pipelines, feature stores, model serving patterns, data distribution shifts (drift), and the monitoring infrastructure required for ATAM quality attribute scenario analysis.

- **Kleppmann, Martin. (2017). *Designing Data-Intensive Applications*. O'Reilly Media.** Covers the batch and stream processing architectures underlying ML training pipelines and online inference, with the data pipeline reliability analysis directly applicable to ATAM evaluation of ML systems.

- **Sculley, D., et al. (2015). "Hidden Technical Debt in Machine Learning Systems." *Advances in Neural Information Processing Systems*.** While a paper, this influential work is book-length in impact — the canonical reference for training-serving skew, feature store requirements, and the technical debt model for ML systems described in this chapter.

## Articles and Papers

- **Lewis, Mike, et al. (2020). "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks." *Advances in Neural Information Processing Systems (NeurIPS 2020)*. https://arxiv.org/abs/2005.11401** The original RAG paper from Meta AI Research, establishing the retrieval-augmented generation architecture that this chapter covers including the vector retrieval and LLM generation pipeline components.

- **Edge, Jonathan, et al. (2024). "From Local to Global: A Graph RAG Approach to Query-Focused Summarization." *Microsoft Research*. https://arxiv.org/abs/2404.16130** Microsoft Research's GraphRAG paper introducing graph-traversal-augmented retrieval for multi-hop reasoning, directly corresponding to this chapter's GraphRAG architecture analysis.

## Online Resources

- **"MLOps: Continuous Delivery for Machine Learning." Google Cloud. https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning** Google's canonical MLOps reference covering ML pipeline stages, model registry, continuous training, and monitoring — the architecture framework used throughout this chapter's pipeline analysis.

- **"LLM-powered Autonomous Agents." Lilian Weng. https://lilianweng.github.io/posts/2023-06-23-agent/** Comprehensive technical survey of LLM architecture, prompt engineering patterns, RAG integration, and agent design — directly supporting this chapter's LLM architecture and prompt engineering sections.

- **"Responsible AI Practices." Google AI. https://ai.google/responsibility/responsible-ai-practices/** Google's responsible AI framework covering fairness, safety, explainability, and accountability — the responsible AI dimensions analyzed in this chapter's ATAM quality attribute mapping.

- **"AI Fairness 360." IBM Research. https://aif360.mybluemix.net** Open-source toolkit for detecting and mitigating bias in ML models, providing the fairness metric implementations (demographic parity, equalized odds) referenced in this chapter's responsible AI architecture analysis.

## Videos

- **"Building Production-Ready ML Systems." Chip Huyen. MLOps Community. YouTube.** Huyen's practical walkthrough of ML system architecture decisions — feature stores, model registries, serving patterns, and drift detection — that maps directly to this chapter's ATAM evaluation framework for AI components.
