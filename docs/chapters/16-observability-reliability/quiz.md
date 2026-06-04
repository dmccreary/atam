# Quiz: Observability, Reliability, and Cloud Operations

Test your understanding of observability pillars, SLIs, SLOs, error budgets, SRE practices, MTTR, MTBF, availability calculation, disaster recovery, and geographic redundancy. Each question is followed by a collapsed answer block.

## Questions

### Question 1

What are the three pillars of observability, and what distinct type of question does each answer?

??? note "Answer"
    (1) **Logs** answer "what happened?" — timestamped records of discrete events (database queries, authentication events, exceptions). Logs provide the detailed narrative of specific incidents and are essential for debugging specific failures. (2) **Metrics** answer "how much and how fast?" — time-series numeric measurements of system and business behavior (request rate, error rate, latency percentiles, CPU utilization). Metrics enable trend analysis, alerting, and SLO tracking. (3) **Distributed Traces** answer "what did this specific request touch and how long did each piece take?" — causal chains connecting spans from multiple services involved in a single request. Traces enable root-cause diagnosis of latency issues in complex distributed systems. Each pillar has distinct strengths; effective observability requires all three, with trace IDs providing the correlation mechanism linking events across all three signal types.

---

### Question 2

A service has an availability SLO of 99.95% over a 30-day window. The service has experienced 18 minutes of downtime this month. How many minutes of error budget remain?

A. 3.6 minutes  
B. 21.6 minutes  
C. 18 minutes  
D. 43.8 minutes  

??? note "Answer"
    The correct answer is **A**. Error budget calculation: 0.0005 (the non-compliant fraction = 1 - 0.9995) × 30 days × 24 hours × 60 minutes = 0.0005 × 43,200 = **21.6 minutes** total error budget. After 18 minutes of downtime: 21.6 - 18 = **3.6 minutes remaining**. At this point, 83.3% of the error budget has been consumed with the rest of the month remaining. This should trigger a halt on risky deployments and a shift in engineering focus toward reliability investment — exactly the kind of quantitative, actionable conversation the SLO/error-budget framework is designed to produce.

---

### Question 3

Define **SLI** and **SLO** and explain why an SLI must be expressed as a ratio of events rather than a raw count.

??? note "Answer"
    A **Service Level Indicator (SLI)** is a carefully defined quantitative measure of service behavior that maps directly to user experience, expressed as: (number of good events) / (total events). A **Service Level Objective (SLO)** is the target for an SLI over a specified time window: "the availability SLI shall be ≥ 99.9% measured over any rolling 28-day period." SLIs must be ratios rather than raw counts because raw counts don't normalize for traffic volume. If a service processes 1 million requests on Monday and 10 million on Friday, having the same absolute number of errors on both days represents very different reliability — 0.1% error rate vs. 0.01% error rate. Ratios are scale-invariant and can be compared across time periods with different traffic levels, making SLOs stable and meaningful even as traffic grows.

---

### Question 4

Explain the **error budget** concept and why it creates a productive organizational dynamic between product velocity and reliability.

??? note "Answer"
    An error budget is the allowed non-compliance with an SLO: the fraction of events that can be "bad" before the SLO is violated. For a 99.9% availability SLO over 28 days, the error budget is 0.1% × 28 days × 24 hours × 60 minutes = 40.3 minutes. This budget is *shared* between unplanned incidents (which consume it involuntarily) and intentional risks such as deployments, experiments, and migrations (which consume it deliberately). **The organizational dynamic**: when the error budget is healthy, the team can deploy frequently and take risks (velocity favored). When nearly exhausted, deployments should pause and reliability investment takes priority (stability favored). This replaces the traditional adversarial "dev wants to ship, ops wants stability" conflict with a shared accounting framework — both product management and site reliability engineering are now speaking the same currency (minutes of budget), making trade-off conversations quantitative and collaborative rather than political.

---

### Question 5

A system has MTBF of 400 hours and MTTR of 4 hours. What is its availability? If automated runbook tooling reduces MTTR to 1 hour, how does availability change?

??? note "Answer"
    **Original availability**: MTBF / (MTBF + MTTR) = 400 / (400 + 4) = 400 / 404 ≈ **99.01%**. **With 1-hour MTTR**: 400 / (400 + 1) = 400 / 401 ≈ **99.75%**. Reducing MTTR from 4 hours to 1 hour improved availability from 99.01% to 99.75% — without changing the underlying failure rate at all. This demonstrates that investing in recovery speed (runbook automation, on-call training, fast rollback mechanisms, better alerting) is often more cost-effective than investing in failure prevention (expensive hardware, exhaustive testing), because the same availability improvement can be achieved by reducing MTTR rather than increasing MTBF.

---

### Question 6

Which of the following correctly describes how components in **series** vs. **parallel** affect system availability?

A. Series components multiply their availability values; parallel components require all replicas to fail simultaneously, dramatically improving availability  
B. Series components improve availability through redundancy; parallel components degrade it through complexity  
C. Both series and parallel arrangements have no effect on system-level availability  
D. Parallel components multiply their availability; series components require all nodes to be available  

??? note "Answer"
    The correct answer is **A**. **Series**: each component must be available for the system to be available. Availability is the product of all components: three components at 99.9% each yields 0.999 × 0.999 × 0.999 ≈ 99.7%. Each additional series component degrades overall availability. **Parallel**: any one component being available is sufficient; the system fails only when *all* replicas fail simultaneously. Two independent components at 99.9% each: 1 - (1 - 0.999)² = 1 - 0.000001 = 99.9999% — a 100× improvement for modest duplication cost. This algebra explains why highly available systems use redundancy at every layer and why the weakest link (the unreplicated component with no redundancy) is often the primary availability bottleneck.

---

### Question 7

Three components are arranged in series with individual availabilities of 99.9%, 99.95%, and 99.99%. What is the system availability? Which component should receive reliability investment first?

??? note "Answer"
    **System availability** = 0.999 × 0.9995 × 0.9999 ≈ **99.84%**. **Priority for investment**: the 99.9% component, because it contributes the most to unavailability (0.1% downtime vs. 0.05% and 0.01% for the others). Improving it from 99.9% to 99.99% would yield system availability of approximately 0.9999 × 0.9995 × 0.9999 ≈ 99.93% — a 0.09% improvement from that single change. This illustrates the **weakest-link principle**: reliability investment should target the component with the lowest availability first, because that component constrains the entire system's availability ceiling, regardless of how good the other components are.

---

### Question 8

What are **RTO** and **RPO**, and why must they be explicitly negotiated with stakeholders rather than assumed by architects?

??? note "Answer"
    **Recovery Time Objective (RTO)** is the maximum acceptable elapsed time from a disaster event to full service restoration — the business's tolerance for being unavailable. **Recovery Point Objective (RPO)** is the maximum acceptable data loss measured in time — if a disaster occurs now, how old can the most recent recovered data be? These must be explicitly negotiated with stakeholders because: (1) They are **business decisions**, not technical decisions — different stakeholders (finance, legal, product, operations) have different tolerances and constraints. (2) Each order-of-magnitude reduction in RTO or RPO roughly doubles infrastructure cost — without stakeholder alignment, architects may either over-engineer (spending on sub-minute RTO the business doesn't need) or under-engineer (designing for hours of RTO when the business requires minutes). (3) Conflicting implicit assumptions cause architectural surprises — a team that designs for 4-hour RTO when executives expect 15-minute RTO has a critical gap that ATAM should surface before, not after, a real disaster.

---

### Question 9

Which disaster recovery tier provides the lowest RTO and RPO, and what is its key tradeoff?

A. Backup and Restore — lowest RTO/RPO, simplest to operate  
B. Warm Standby — moderate RTO/RPO, moderate cost  
C. Multi-Site Active/Active — lowest RTO/RPO (<1 minute / near-zero), at 8-10× baseline infrastructure cost and significant data consistency complexity  
D. Pilot Light — lowest RTO/RPO, minimal cost  

??? note "Answer"
    The correct answer is **C**. **Multi-Site Active/Active** provides RTO of < 1 minute and near-zero RPO because both (or all) regions handle live traffic simultaneously — there is no "standby promotion" delay and data is replicated continuously across regions. Its key tradeoff is cost (8-10× baseline infrastructure cost for full redundant deployments in multiple regions) and significantly increased **data consistency complexity**: writes happening in multiple regions simultaneously require either a global coordination layer (expensive latency), careful read-write routing, or an eventually consistent data model. The ATAM analysis point is that the RTO/RPO targets must be *explicitly established with stakeholders* before selecting a DR tier, because the cost difference between tiers is 2-10×.

---

### Question 10

The five-nines (99.999%) availability target allows approximately 5.26 minutes of downtime per year. What architectural implication does this have for deployment practices?

??? note "Answer"
    At 99.999% availability, a single 10-minute deployment outage **consumes the entire annual downtime budget** almost twice over. This makes zero-downtime deployment practices (blue-green deployment, canary releases, rolling updates) a **prerequisite**, not an optional enhancement. With traditional "stop the service, deploy, restart" deployments, it is mathematically impossible to meet five-nines availability while doing regular releases. Additionally: planned maintenance windows (even monthly ones) must be eliminated, because any single maintenance window of more than 5 minutes violates the annual budget. Teams pursuing five-nines targets must instrument every deployment to measure downtime impact and automate rollback to occur within seconds of detecting a degradation.

---

### Question 11

Scenario: An ATAM evaluation finds a system with a documented availability requirement of 99.99% and a disaster recovery strategy that consists of "weekly full backups exported to S3." What risks would you document in the risk register?

??? note "Answer"
    Multiple critical risks: (1) **RPO misalignment**: weekly backups imply RPO of up to 7 days — 99.99% availability typically implies near-zero RPO or RPO measured in seconds. A 7-day RPO is incompatible with the stated availability target. (2) **RTO misalignment**: restoring a full backup from S3 requires hours to days depending on data volume. 99.99% availability implies RTO of minutes (annual downtime budget = ~52 minutes). A restore-from-backup DR strategy cannot achieve this RTO. (3) **Untested DR**: a DR architecture that has never been tested in production conditions is a DR hypothesis, not a DR capability. Document severity as Critical; the gap between stated RTO/RPO and actual DR capability is multiple orders of magnitude. Recommended mitigation: conduct explicit RTO/RPO stakeholder negotiation, then redesign DR tier to match — likely Warm Standby or Active/Active, with quarterly DR drills.

---

### Question 12 (Analyze)

A cloud-native system is designed with active-passive failover between two AWS regions. Region A is active (serving all traffic); Region B is passive (standby with data replication). The replication lag is typically 30 seconds. RTO is estimated at 8 minutes (time to detect failure, trigger DNS cutover, and warm up Region B services). RPO is 30 seconds (replication lag). A new business requirement states: "The system must recover from a full regional outage within 2 minutes with zero data loss." Analyze the gap between the current architecture and the new requirement, and evaluate the tradeoffs of the options available to meet it.

??? note "Answer"
    **Gap analysis**: The requirement specifies RTO ≤ 2 minutes and RPO = 0. The current architecture provides RTO of 8 minutes (4× above target) and RPO of 30 seconds (non-zero data loss risk). **Option 1 — Improve Active-Passive**: Reduce RTO to < 2 minutes by pre-warming Region B services at all times (eliminating warm-up time), automating failover detection and DNS cutover within 30 seconds, and switching from asynchronous to synchronous database replication (eliminating the 30-second RPO). Tradeoffs: synchronous replication adds latency to every write operation (the primary must wait for Region B acknowledgment before confirming the write to the application) — this impacts write latency performance scenarios. Pre-warming Region B increases steady-state cost (running services in standby, not just data replication). **Option 2 — Switch to Active-Active**: both regions serve live traffic simultaneously, eliminating the promotion delay entirely (RTO approaches 0 for traffic routing). Near-zero RPO is achievable with synchronous writes confirmed by both regions. Tradeoffs: significantly higher cost (8-10× baseline), and complex data consistency design — writes in both regions simultaneously require either a global coordination layer or an eventually consistent model, potentially affecting the consistency quality attribute. **Recommendation for stakeholder conversation**: quantify the cost of each option vs. the business cost of a regional outage exceeding 2 minutes. If the business cost of the gap (lost revenue, SLA penalties, regulatory exposure) exceeds the cost of the improvement, the investment is justified. The ATAM evaluation should document this as a tradeoff point between cost and RTO/RPO, not as a simple "must fix" finding.

---

*End of Quiz — Chapter 16*
