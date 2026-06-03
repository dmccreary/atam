---
title: RAG vs. GraphRAG Architecture Comparison
description: RAG vs. GraphRAG Architecture Comparison
status: scaffold
library: vis-network
bloom_level: TBD
---

# RAG vs. GraphRAG Architecture Comparison

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

TBD

- **Bloom Level:** TBD
- **Bloom Verb:** TBD
- **Library:** vis-network

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 17: AI and Machine Learning System Architecture](../../chapters/17-ai-ml-system-architecture/index.md).

```text
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
```

## Related Resources

- [Chapter 17: AI and Machine Learning System Architecture](../../chapters/17-ai-ml-system-architecture/index.md)
