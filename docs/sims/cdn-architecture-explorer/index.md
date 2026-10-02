---
title: CDN Request Routing and Cache Flow
description: Send requests from five users on a schematic world map to the nearest CDN point of presence, and compare the latency of a cache hit, a cache miss, an uncacheable request, and a direct-to-origin request while TTLs expire and caches are purged.
image: /sims/cdn-architecture-explorer/cdn-architecture-explorer.png
og:image: /sims/cdn-architecture-explorer/cdn-architecture-explorer.png
twitter:image: /sims/cdn-architecture-explorer/cdn-architecture-explorer.png
social:
   cards: false
quality_score: 0
---

# CDN Request Routing and Cache Flow

<iframe src="main.html" height="537" width="100%" scrolling="no"></iframe>

[Run the CDN Request Routing and Cache Flow MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim places an origin server in Northern Virginia, eight CDN **points of presence (PoPs)**, and five users on a schematic world map. Clicking a user sends one request. With the CDN enabled the request goes to the nearest PoP, which answers from its cache when it holds a fresh copy (a **cache hit**) or fetches the object from the origin, stores it for its TTL, and returns it (a **cache miss**). The route is drawn on the map, and the panel below splits the response time into user-to-edge travel, edge-to-origin travel, origin processing, and edge processing, next to the time the same request would take going straight to the origin.

Three content types behave differently: a static asset with a 24-hour TTL, a shared API response with a 60-second TTL, and a personalized page that may not be cached at all. **Clock +30 s** ages the stored copies so the short TTL expires, and **Purge caches** invalidates every copy at once. The session panel keeps a running **cache hit ratio**. Notice that a miss is slower than going direct, because the request detours through the PoP: the CDN pays off only through the hits.

The latency figures come from a stated model, not from measurements of any CDN: 1 ms of round-trip time per 100 km of great-circle distance (light in optical fibre travels about 200,000 km/s), 40 ms of origin processing, and 5 ms of edge processing. Real routes are longer than the great circle, and a new connection adds handshake round trips.

## How to Use

1. **Click a user** (blue circle). Watch the request travel to the nearest PoP and, on a miss, on to the origin and back.
2. Click the **same user again**. The PoP now holds a copy, so the request is a hit and the origin is not contacted.
3. Click a **different user**. Each PoP has its own cache, so the first request through a new PoP is a miss even for an object another PoP already holds.
4. Change the **content type** to the API response, send a request, press **Clock +30 s** twice, and send it again to see the TTL expire. Hover over a PoP to read how much TTL each copy has left.
5. Choose the **personalized page** and watch every request pass through to the origin and pull the hit ratio down.
6. Press **Purge caches** to invalidate everything, and untick **CDN enabled** to send requests straight to the origin.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/atam/sims/cdn-architecture-explorer/main.html"
        height="537"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Graduate / Professional

### Duration
15-20 minutes

### Prerequisites
Latency and round-trip time, HTTP request and response, and the idea of a cache with a time to live (TTL).

### Bloom's Taxonomy Level
Analyze (L4)

### Learning Objective
Students will be able to compare the response time of a CDN cache hit, a cache miss, an uncacheable request, and a direct-to-origin request, and explain how TTL, invalidation, and content cacheability determine the cache hit ratio.

### Activities

1. **Predict** (3 min): Before clicking, students rank the five users by how much a CDN will help them and say why. They then send a static-asset request from each user twice and check the ranking against the hit and direct times.
2. **Miss versus direct** (4 min): For Nairobi and for Vancouver, students record the miss time and the direct time and explain why a miss is slower than going direct, and why the gap is so much larger for Nairobi.
3. **TTL and invalidation** (5 min): Students warm the Tokyo PoP with the API response, advance the clock until the copy expires, and then purge. They state the difference between expiry and invalidation and what each does to origin load.
4. **Hit ratio** (5 min): Students run a 10-request session that mixes the three content types, record the hit ratio and the mean response time, and identify which requests lowered the ratio.

### Assessment
Give students the scenario "95% of page loads worldwide shall complete the main asset request in under 100 ms" and ask them to name the two architectural parameters this response measure is most sensitive to (PoP placement and cache hit ratio), state one design change that raises the hit ratio, and explain the staleness risk a longer TTL introduces.

## References

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
2. Fielding, R., Nottingham, M., & Reschke, J. (2022). [RFC 9111: HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111). Internet Engineering Task Force.
3. Nygren, E., Sitaraman, R. K., & Sun, J. (2010). The Akamai Network: A Platform for High-Performance Internet Applications. *ACM SIGOPS Operating Systems Review*, 44(3), 2-19.
