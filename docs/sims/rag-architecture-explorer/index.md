---
title: RAG vs. GraphRAG Architecture Comparison
description: Trace one question through a flat RAG pipeline and a GraphRAG pipeline side by side, compare the context each one retrieves and the answer it can support, and inspect the purpose, latency, and quality risks of every component.
image: /sims/rag-architecture-explorer/rag-architecture-explorer.png
og:image: /sims/rag-architecture-explorer/rag-architecture-explorer.png
twitter:image: /sims/rag-architecture-explorer/rag-architecture-explorer.png
social:
   cards: false
quality_score: 0
---

# RAG vs. GraphRAG Architecture Comparison

<iframe src="main.html" height="577" width="100%" scrolling="no"></iframe>

[Run the RAG vs. GraphRAG Comparison MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Both pipelines answer a question by retrieving context and handing it to a large language model. They differ in how they retrieve.

- **RAG** (left) embeds the question, runs a similarity search in a vector database, keeps the top-K chunks, assembles a prompt, and generates.
- **GraphRAG** (right) extracts the entities in the question, **traverses a knowledge graph** from those entities while a vector search runs in parallel, merges the two results, and then assembles the prompt and generates.

The lower panels show what each pipeline actually retrieved for the selected question, with a check mark on every item the answer needs, and the answer that context can support.

With the **complex multi-hop query** ("Customer X bought Product A. What else do they need, and will it work with what they already own?") the two pipelines part ways. Flat RAG retrieves chunks that read like the question, so it finds that Product A requires Component B. It does not find the note that Component B is incompatible with Component C, because that note mentions neither Product A nor Customer X. GraphRAG follows the relationships `(Customer X, purchased, Product A)`, `(Product A, requires, Component B)`, `(Component B, incompatible_with, Component C)`, and `(Customer X, owns, Component C)` and reaches the conflict. With the **simple factual query** both pipelines return the same correct answer, and the graph adds a step, latency, and tokens without adding information.

Each component shows an illustrative latency, and the bar under each pipeline splits the total into the part before the LLM and the generation itself. Generation dominates in both. The knowledge base, the answers, and every timing are a constructed teaching example. They are not measurements of any product, and one worked example is not a benchmark of answer quality.

## How to Use

1. Read the default view: the complex query, both pipelines complete, and the context and answer of each.
2. Compare the two **Context sent to the LLM** panels. Find the fact that flat RAG did not retrieve.
3. Switch to the **Simple factual query** and compare again.
4. Press **Trace request**, then **Next step**, to walk the request through both pipelines one row at a time. The retrieved context appears at step 4 and the answer at step 7. **Show all** returns to the complete view.
5. **Click any component** to read its purpose, its latency contribution, and its quality risks. Click it again to return to the context panels.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/rag-architecture-explorer/main.html"
        height="577"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Graduate / Professional

### Duration
15-20 minutes

### Prerequisites
Embeddings and vector similarity search, knowledge graphs as triples, and how an LLM uses retrieved context in its prompt.

### Bloom's Taxonomy Level
Analyze (L4)

### Learning Objective
Students will be able to compare flat RAG and GraphRAG by tracing a query through each pipeline, explain why vector similarity alone misses multi-hop facts, and identify the latency and quality risks each added component introduces.

### Activities

1. **Predict** (3 min): Students read the complex question and the four triples in the About text and predict which facts a similarity search will and will not retrieve, before looking at the panels.
2. **Explain the miss** (5 min): Students explain in two sentences why flat RAG did not retrieve the compatibility note, and propose a change to the question or to the chunking that might have retrieved it.
3. **Cost of the graph** (5 min): Students click Entity extraction, Knowledge graph traversal, and Combined context and list what GraphRAG adds in latency, in build and maintenance work, and in new ways to fail.
4. **Write the tradeoff** (4 min): Students write one ATAM tradeoff point for choosing GraphRAG over flat RAG, naming the quality attributes on each side.

### Assessment
Give students three questions about a product catalog (a single-fact lookup, a comparison of two items, and a question that needs a chain of three relationships) and ask them to say for each one whether flat RAG is likely to be sufficient, justify the answer in terms of what similarity search can retrieve, and name the component whose failure would most damage the answer.

## References

1. Lewis, P., et al. (2020). Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. *Advances in Neural Information Processing Systems 33 (NeurIPS 2020)*.
2. Edge, D., et al. (2024). [From Local to Global: A Graph RAG Approach to Query-Focused Summarization](https://arxiv.org/abs/2404.16130). arXiv:2404.16130.
3. Malkov, Y. A., & Yashunin, D. A. (2020). Efficient and Robust Approximate Nearest Neighbor Search Using Hierarchical Navigable Small World Graphs. *IEEE Transactions on Pattern Analysis and Machine Intelligence*, 42(4), 824-836.
4. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
