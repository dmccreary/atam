# Session Log — tactic-interaction-web

**Date:** 2026-06-03
**Chapter:** 9 — Architectural Tactics and Principles
**Library:** vis-network (first vis-network sim of the 6–18 batch)
**Bloom level:** Analyze (L4) — *Examine*
**Final validation:** 98/100 (Grade A) · Playwright control-visibility: PASS

## What it does

A network graph of architectural tactics and the quality attributes they affect.
Blue ellipses are quality attributes (Performance, Availability, Security,
Modifiability, Consistency); gold boxes are tactics (9 of them); orange boxes
are compensating tactics. Green arrows = improves, red dashed = degrades, orange
= the compensating tactic a tradeoff requires. Clicking a tactic/QA highlights
its edges and explains the relationships; clicking an edge gives the mechanism +
example; a Show Interaction Chains mode traces Caching/Redundancy/Encryption to
their compensating tactic.

## Instructional design check

- **Bloom verb:** Examine (Analyze, L4) — exploring an interaction network is a
  textbook Analyze pattern (vis-network explorer).
- Three full compensation chains are authored (the spec's three): Caching →
  −Consistency → Cache Invalidation; Redundancy → −Performance → Async
  Replication; Encryption → −Performance → HSM Offload.

## Implementation notes (vis-network conventions, per part-1 handoff)

- **Overwrote the p5 scaffold** main.html with a custom vis-network main.html +
  style.css. Loads `vis-network.min.js` AND `vis-network.min.css`.
- Flex-column `.container` (100vh): topbar (title + legend + chain button) and
  infobox are fixed-height flex items; `#network { flex:1 1 auto; min-height:0 }`
  — no absolute overlays over the canvas.
- `physics:{enabled:false}` with **fixed node positions**; `network.fit()` on
  `afterDrawing`. `navigationButtons:true`; mouse zoom/pan only when not in an
  iframe (`isInIframe()`). `selectConnectedEdges:true` so a node click
  auto-highlights its edges.
- `// CANVAS_HEIGHT: 560` → iframe 562.

## Screenshot

- Captured with **Playwright at the real iframe size** (800×562), not
  bk-capture — per part-1 gotcha #3 (bk-capture misrenders 100vh vis-network
  sims). Reusable helper saved at `/tmp/shoot-vis.py`.

## Layout review

- **Cycle 1:** PASS. Nodes well-spread and labeled, all three edge types
  visible, the three compensation chains clear, legend + nav buttons + infobox
  all render. No clipping or off-canvas panels.

## Files

- `docs/sims/tactic-interaction-web/main.html` (rewritten for vis-network)
- `docs/sims/tactic-interaction-web/style.css` (new)
- `docs/sims/tactic-interaction-web/tactic-interaction-web.js` (new, ~190 lines)
- `docs/sims/tactic-interaction-web/index.md`
- `docs/sims/tactic-interaction-web/tactic-interaction-web.png`
- `docs/chapters/09-architectural-tactics-principles/index.md` (iframe height 540→562)
