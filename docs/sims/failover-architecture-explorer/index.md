---
title: Active-Passive vs. Active-Active Failover
description: Step through the loss of a cloud region under active-passive and active-active designs, and see how replication lag sets the recovery point (RPO) and how detection, promotion, and DNS TTL add up to the recovery time (RTO).
image: /sims/failover-architecture-explorer/failover-architecture-explorer.png
og:image: /sims/failover-architecture-explorer/failover-architecture-explorer.png
twitter:image: /sims/failover-architecture-explorer/failover-architecture-explorer.png
social:
   cards: false
quality_score: 0
---

# Active-Passive vs. Active-Active Failover

<iframe src="main.html" height="562" width="100%" scrolling="no"></iframe>

[Run the Active-Passive vs. Active-Active Failover MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Two regions, each with a load balancer, an application tier, and a database, sit under a global DNS layer that routes five clients. The MicroSim shows the same failure, the complete loss of Region A, under two designs:

- **Active-passive.** Region A serves all traffic. Region B is a standby: its application tier is idle and its database is a replica that applies changes from A. After a failure the standby must be **promoted** before clients can be sent to it.
- **Active-active.** Both regions serve traffic (clients 1 to 3 use A, clients 4 and 5 use B) and both databases accept writes and replicate to each other. After a failure there is nothing to promote; the affected clients are simply rerouted to the region that is already serving.

Press **Simulate failure** and then **Next step** to walk through the sequence. The timelines in the middle panel put both designs on one time scale:

- **RPO** is the data that can be lost. It equals the **replication lag**: writes the failed region accepted but had not yet shipped. This is true of both designs. Setting the lag to 0 models synchronous replication, which loses nothing but makes every write wait for the other region.
- **RTO** is the time until service is restored. Active-passive pays for detection, promotion, and DNS cutover; active-active pays only for detection and DNS cutover, and only for the clients that were using the failed region.

Active-active is not free: it needs a way to resolve conflicting writes made in two regions at once, and each region must have enough spare capacity to absorb the other region's load. The sim models active-active with two writable databases; routing all writes to one region is a common alternative that avoids conflicts at the cost of a promotion step for writes. Detection is fixed at 30 seconds (three failed health checks, 10 seconds apart), and all timings are illustrative rather than measurements of any cloud provider.

## How to Use

1. With **Active-passive** selected, read the normal state: 5 clients into Region A, none into the standby, replication flowing from A to B.
2. Press **Simulate failure**, then **Next step** repeatedly. Each step updates the diagram, fills in one segment of the timeline, and explains what is happening.
3. Move **Replication lag**, **Promotion time**, and **DNS TTL** and watch the RPO and RTO on both timelines change.
4. Press **Reset**, switch to **Active-active**, and step through the same failure. Note which clients are affected and which step is missing.
5. Set **Replication lag** to 0 to model synchronous replication and read what it does to the RPO and to normal-operation write latency.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/failover-architecture-explorer/main.html"
        height="562"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Graduate / Professional

### Duration
15-20 minutes

### Prerequisites
Recovery time objective (RTO) and recovery point objective (RPO), database replication, DNS and time to live (TTL), and health checks.

### Bloom's Taxonomy Level
Analyze (L4)

### Learning Objective
Students will be able to compare active-passive and active-active multi-region architectures by tracing what happens to traffic and data when a region fails, and relate replication lag, detection time, promotion time, and DNS TTL to the RPO and RTO each design achieves.

### Activities

1. **Predict** (3 min): Before pressing anything, students write down which design will restore service sooner and which will lose less data, with a reason for each.
2. **Trace** (6 min): Students step through both failovers and fill in a table of RTO, RPO, clients affected, and steps required. They explain why the RPO is identical in the two designs.
3. **Meet the objective** (5 min): Given a business requirement of RTO 2 minutes and RPO 10 seconds, students find slider settings that satisfy it under each design and state what each setting would cost in practice.
4. **Name the tradeoff** (4 min): Students write one ATAM tradeoff point for the choice between the two designs, naming the quality attributes on each side.

### Assessment
Give students the scenario "after the loss of a region, order processing shall resume within 5 minutes with no more than 30 seconds of lost orders" and ask them to say which design meets it with which parameter values, identify the sensitivity points (replication lag for RPO; promotion time and DNS TTL for RTO), and state the main risk each design introduces.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley. Chapter 4, Availability.
2. Kleppmann, M. (2017). *Designing Data-Intensive Applications*. O'Reilly Media. Chapter 5, Replication.
3. Beyer, B., Jones, C., Petoff, J., & Murphy, N. R. (Eds.). (2016). [Site Reliability Engineering: How Google Runs Production Systems](https://sre.google/sre-book/table-of-contents/). O'Reilly Media.
