---
title: Lambda vs. Kappa Architecture Comparison
description: Follow data from its sources to the queries it serves through lambda, kappa, and lakehouse architectures side by side, step through how each one reprocesses history, and compare their freshness, consistency, simplicity, and cost.
image: /sims/data-architecture-patterns/data-architecture-patterns.png
og:image: /sims/data-architecture-patterns/data-architecture-patterns.png
twitter:image: /sims/data-architecture-patterns/data-architecture-patterns.png
social:
   cards: false
quality_score: 0
---

# Lambda vs. Kappa Architecture Comparison

<iframe src="main.html" height="547" width="100%" scrolling="no"></iframe>

[Run the Lambda vs. Kappa Architecture Comparison MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

All three architectures answer the same question: how do you serve fresh results and still be able to recompute all of history when the logic changes or late data arrives?

- **Lambda** runs two paths side by side. The **batch layer** periodically recomputes accurate views from the complete master dataset; the **speed layer** processes only recent events for low latency; the **serving layer** merges the two views to answer queries. The cost is two implementations of the same logic.
- **Kappa** removes the batch layer. A single **stream processor** reads a **durable, replayable event log**; to recompute, a new version of the job replays the log from the beginning. The cost is that the log must retain all of history and a replay takes longer as history grows.
- **Lakehouse** stores data as files in object storage under an **open table format** that adds ACID transactions, schema evolution, and time travel. Query engines read the tables directly. It is aimed at analytics, where freshness of minutes is acceptable.

Click any component to see example technologies, what it is good at, and how it fails. **Simulate reprocessing** walks through the same three steps for all three architectures (change the logic, recompute history, switch over) and highlights the components involved in each one.

The radar chart rates each architecture on four quality attributes, where outward is better. The ratings are qualitative teaching judgments drawn from the chapter's discussion, not benchmark results, and the technology names are examples of each role, not recommendations. Lambda scores lowest on simplicity because of its two code paths; the lakehouse scores highest on consistency because one transactional table is the single source of truth, and lowest on freshness because it is not a low-latency serving path.

## How to Use

1. Read each column from top to bottom. The moving dots show the direction of data flow; lambda is the only one that splits into two paths.
2. **Click a component** to read its example technologies, strengths, and failure modes. Click it again to close the panel.
3. Press **Simulate reprocessing**, then **Next step** twice. Each step highlights the components involved in orange and explains what each architecture does.
4. **Click an architecture name** (Lambda, Kappa, or Lakehouse) to single out its shape on the radar chart. Click it again to show all three.
5. Press **Reset** to return to the starting view.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/data-architecture-patterns/main.html"
        height="547"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Graduate / Professional

### Duration
15-20 minutes

### Prerequisites
Batch and stream processing, event logs, and the data lake and data warehouse from earlier in the chapter.

### Bloom's Taxonomy Level
Analyze (L4)

### Learning Objective
Students will be able to compare lambda, kappa, and lakehouse architectures by tracing the path of data from ingestion to serving, explaining how each one recomputes historical results, and weighing their freshness, consistency, operational simplicity, and cost.

### Activities

1. **Trace** (4 min): Students follow one event through each architecture and count how many components process it before it can appear in a query result.
2. **Reprocess** (5 min): Students step through the reprocessing walk-through and write, for each architecture, the one precondition that must hold for reprocessing to work (two codebases in step, a log that retains all history, raw data kept in storage).
3. **Read the radar** (4 min): Students single out each architecture on the chart and state its weakest attribute and the design feature that causes it.
4. **Choose** (6 min): Given three workloads (fraud alerts within one second, a nightly financial report that must be exactly right, and a self-service analytics platform), students choose an architecture for each and defend the choice.

### Assessment
Give students a scenario such as "the usage dashboard shall reflect events within 5 seconds, and a corrected billing rule shall be applied to 3 years of history within 24 hours" and ask them to evaluate lambda and kappa against both response measures, name the sensitivity point for each, and state the tradeoff they would record.

## References

1. Marz, N., & Warren, J. (2015). *Big Data: Principles and Best Practices of Scalable Real-Time Data Systems*. Manning.
2. Kreps, J. (2014). [Questioning the Lambda Architecture](https://www.oreilly.com/radar/questioning-the-lambda-architecture/). O'Reilly Radar.
3. Armbrust, M., Ghodsi, A., Xin, R., & Zaharia, M. (2021). Lakehouse: A New Generation of Open Platforms that Unify Data Warehousing and Advanced Analytics. *Conference on Innovative Data Systems Research (CIDR)*.
4. Kleppmann, M. (2017). *Designing Data-Intensive Applications*. O'Reilly Media. Chapters 10 and 11.
