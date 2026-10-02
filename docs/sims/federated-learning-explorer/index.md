---
title: Federated Learning Architecture
description: Step through the federated averaging loop across six hospitals and a coordinator, and see how the privacy budget, data heterogeneity, number of rounds, and participation rate change the accuracy of the global model in a live run on a small synthetic problem.
image: /sims/federated-learning-explorer/federated-learning-explorer.png
og:image: /sims/federated-learning-explorer/federated-learning-explorer.png
twitter:image: /sims/federated-learning-explorer/federated-learning-explorer.png
social:
   cards: false
quality_score: 0
---

# Federated Learning Architecture

<iframe src="main.html" height="547" width="100%" scrolling="no"></iframe>

[Run the Federated Learning Architecture MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

In federated learning the data stays where it is and the model travels. A **coordinator** holds the global model; six **hospitals** each hold records that may not be shared. One round has four phases, and the diagram steps through them:

1. **Distribute.** The coordinator sends the current global model to the hospitals selected for this round.
2. **Train locally.** Each selected hospital trains the model on its own records. The records never leave.
3. **Send updates.** Each hospital returns only its update (its new weights minus the weights it received), clipped to a maximum size.
4. **Aggregate.** The coordinator takes the average of the updates, weighted by each hospital's record count, adds noise, and applies the result. This is **federated averaging**.

**The charts are computed, not drawn.** Every time you move a slider, the page reruns real federated averaging on a small synthetic problem: two overlapping classes in two dimensions, a logistic regression model with three weights, 60 to 120 records per hospital, five local training passes per round, and accuracy measured on 600 held-out points. The global model starts from poor weights that do about as well as guessing. The upper chart shows accuracy after every round for the current settings, next to a dashed line for the same model trained on all records pooled in one place. The lower chart shows the accuracy reached at the end of training for nine values of the privacy budget, with your current setting marked.

The four sliders are the design parameters:

- **Privacy budget ε.** Smaller ε means more noise added to the average, a stronger privacy guarantee, and a less accurate model. The gauge reports the bound ε implies: one hospital's data can change the odds of any released update by at most about e^ε.
- **Non-IID skew.** At 0 every hospital has the same mix of cases. At 1 each has a lopsided class mix and a shifted patient population, so local models pull in different directions and even pooled training does worse.
- **Rounds.** How long training runs.
- **Hospitals per round.** How many of the six take part in each round.

Read the numbers as properties of this toy problem, not as predictions for a real system. Three simplifications matter. With only six participants, each one is a large share of the average, so hiding any one of them takes a lot of noise; systems that average thousands of updates per round can afford much smaller ε. The noise scale uses the classical Gaussian-mechanism formula across the whole slider range, although that formula is derived for ε below 1. And ε here is a per-round figure, while a real deployment tracks the cumulative privacy loss over all rounds with a privacy accountant. Update compression, which matters for large models, is not modeled.

## How to Use

1. Press **Next phase** four times to walk through one round. Watch what travels on the links in phases 1 and 3, and which hospitals are greyed out.
2. Press **Next round** to jump to the next round. The yellow marker on the upper chart moves with you, and a different set of hospitals may be selected.
3. Lower the **Privacy budget ε** and watch the accuracy curve become noisier and then collapse. Find the marker on the lower chart.
4. Raise the **Non-IID skew** and look at the bars inside the hospitals, the dashed pooled-data line, and the speed of convergence.
5. Change **Hospitals per round**. With a high skew and few hospitals per round the curve oscillates, because each round sees a different, unrepresentative subset.
6. Change **Rounds** to see whether more training helps. Press **Reset** to return to the starting values.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/federated-learning-explorer/main.html"
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
Model training by gradient descent, the idea of model weights and updates, and the privacy motivation for keeping data where it was collected.

### Bloom's Taxonomy Level
Analyze (L4)

### Learning Objective
Students will be able to trace one round of federated averaging, explain what does and does not leave each participant, and examine how the privacy budget, data heterogeneity, number of rounds, and participation rate affect the accuracy of the global model.

### Activities

1. **Trace a round** (4 min): Students step through one round and write down, for each phase, what crosses the network and what stays inside a hospital.
2. **Find the knee** (5 min): Using the lower chart, students find the smallest ε that keeps final accuracy within about two points of the pooled-data line, then check how that value changes when all six hospitals take part in every round, and explain why.
3. **Heterogeneity** (5 min): Students compare skew 0 and skew 1 at ε = 10 and record the rounds needed to level off, the final accuracy, and the pooled-data accuracy. They separate what federation costs from what heterogeneity costs.
4. **Tradeoff point** (4 min): Students write one ATAM tradeoff point for the privacy budget, naming the two quality attributes it pulls in opposite directions and the stakeholders on each side.

### Assessment
Give students the scenario "six hospitals train a shared diagnostic model; no patient record may leave a hospital, and the model must stay within three points of the accuracy of pooled training" and ask them to find settings that meet it, state which parameter the accuracy response is most sensitive to, and name one residual privacy risk that keeping the data local does not remove.

## References

1. McMahan, B., Moore, E., Ramage, D., Hampson, S., & Agüera y Arcas, B. (2017). Communication-Efficient Learning of Deep Networks from Decentralized Data. *Proceedings of the 20th International Conference on Artificial Intelligence and Statistics (AISTATS)*.
2. Dwork, C., & Roth, A. (2014). The Algorithmic Foundations of Differential Privacy. *Foundations and Trends in Theoretical Computer Science*, 9(3-4), 211-407.
3. Kairouz, P., McMahan, H. B., et al. (2021). Advances and Open Problems in Federated Learning. *Foundations and Trends in Machine Learning*, 14(1-2), 1-210.
4. Zhu, L., Liu, Z., & Han, S. (2019). Deep Leakage from Gradients. *Advances in Neural Information Processing Systems 32 (NeurIPS 2019)*.
