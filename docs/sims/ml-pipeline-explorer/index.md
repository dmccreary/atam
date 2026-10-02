---
title: ML Pipeline Architecture Flow
description: Click through the nine stages of a machine learning pipeline to see the quality attribute risks, failure modes, and ATAM sensitivity points of each, compare batch, online, and streaming inference, and step through a drift alert and the retraining loop.
image: /sims/ml-pipeline-explorer/ml-pipeline-explorer.png
og:image: /sims/ml-pipeline-explorer/ml-pipeline-explorer.png
twitter:image: /sims/ml-pipeline-explorer/ml-pipeline-explorer.png
social:
   cards: false
quality_score: 0
---

# ML Pipeline Architecture Flow

<iframe src="main.html" height="472" width="100%" scrolling="no"></iframe>

[Run the ML Pipeline Architecture Flow MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The diagram shows the end-to-end pipeline that turns raw data into a deployed, monitored model: **Data Sources → Data Ingestion → Feature Engineering → Feature Store → Model Training → Model Evaluation → Model Registry → Deployment → Monitoring**, with a dashed loop from Monitoring back to Ingestion. That loop is **continuous training**: the path a retraining run follows when monitoring detects drift. A second arrow runs from the Feature Store straight to Deployment, because the model needs the same features at prediction time that it saw during training. When the two disagree, the result is training-serving skew.

Click any stage to list three things about it: the **quality attribute risks** it introduces, its **common failure modes**, and the design decisions an ATAM evaluation would record as **sensitivity points**.

The menu switches the **serving mode**, and the stage subtitles, the feature arrow, and several detail panels change with it:

- **Batch inference** scores a whole dataset on a schedule. Nothing is on a request path; the risk is stale predictions.
- **Online inference** answers each request in real time. The feature lookup and the model call are on the request path, so latency, availability, and skew matter most.
- **Streaming inference** scores events as they arrive, adding ordering, state, and replay to the list.

**Risk overlay** colors each stage lower, elevated, or high for the selected mode, with one to three pips. These levels are a teaching judgment based on the chapter's discussion. They are not survey data about how often ATAM evaluations flag each stage. **Simulate drift** walks through a drift alert and then the retraining loop.

## How to Use

1. **Click a stage** to see its risks, failure modes, and sensitivity points. Click it again, or click the background, to clear the selection.
2. Change the **serving mode** and watch the subtitles of Data Ingestion, Feature Engineering, Feature Store, Deployment, and Monitoring change.
3. Select **Deployment** or **Feature Store** and switch modes with the stage still selected to compare the three lists directly.
4. Tick **Risk overlay** and note which stages change level when the mode changes.
5. Press **Simulate drift**, read the alert, then press **Trigger retraining** and follow the green path around the loop.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/ml-pipeline-explorer/main.html"
        height="472"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Graduate / Professional

### Duration
15-20 minutes

### Prerequisites
The stages of an ML pipeline, the feature store and model registry, quality attribute scenarios, and ATAM sensitivity points.

### Bloom's Taxonomy Level
Analyze (L4)

### Learning Objective
Students will be able to examine a machine learning pipeline stage by stage, relate each stage to the quality attribute risks and sensitivity points it introduces, and compare how batch, online, and streaming inference change where those risks fall.

### Activities

1. **Walk the pipeline** (5 min): Students click each stage in flow order and write one sentence per stage naming the quality attribute most at risk there.
2. **Compare modes** (5 min): With Risk overlay on, students record which stages change level between batch and online inference and explain why the Feature Store moves from lower to high.
3. **Trace a failure** (4 min): Students pick one failure mode from the Feature Engineering or Feature Store panel and describe how it would show up in production and which monitor would catch it.
4. **Close the loop** (4 min): Students step through the drift sequence and list the gates a retrained model passes before it serves traffic.

### Assessment
Give students a short description of an ML system (for example, an online fraud scoring service retrained monthly) and ask them to write two quality attribute scenarios for it, name the pipeline stage each scenario is most sensitive to, and state what would detect model drift and what would trigger retraining.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Sculley, D., et al. (2015). Hidden Technical Debt in Machine Learning Systems. *Advances in Neural Information Processing Systems 28 (NIPS 2015)*.
3. Breck, E., Cai, S., Nielsen, E., Salib, M., & Sculley, D. (2017). The ML Test Score: A Rubric for ML Production Readiness and Technical Debt Reduction. *IEEE International Conference on Big Data*.
4. Huyen, C. (2022). *Designing Machine Learning Systems*. O'Reilly Media.
