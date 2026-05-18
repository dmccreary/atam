# Content Generation Guidelines

Welcome to the content generation playbook for **The Right Database**!
If you're generating chapters, MicroSims, or sidebars for this textbook,
this document is your best friend. Dex would say: "Let's analyze the
tradeoffs — *of every content decision too!*"

---

## General Tone and Voice

This textbook is for working engineers making real architectural decisions —
people who have survived at least one "wrong database" incident and came back
wiser. Write like a brilliant colleague who happens to know everything about
distributed systems: precise, technically honest, and *not boring*.

- **Be confident.** Good database decisions exist. Students can learn to make them.
- **Be direct.** Bury no lede. State the insight, then support it.
- **Be optimistic.** Distributed systems are genuinely fascinating. Let that show.
- **Be occasionally funny.** A well-placed quip about eventual consistency makes
  the next five paragraphs easier to absorb. (Do not force it — awkward humor is
  worse than none.)
- **Never be condescending.** Distributed systems are hard. Normalize the difficulty.
- **Use active voice.** "ATAM surfaces tradeoffs" beats "tradeoffs are surfaced by ATAM."

---

## The Mascot: Dex the Robot

Dex is a compact, steel-blue robot (`#4682B4`) with orange accents (`#E65100`),
friendly LED eyes, and a tiny database cylinder on their antenna. Dex is
methodical, curious, helpful, and precise — the spirit animal of everyone who
has ever drawn a utility tree on a whiteboard.

> **The golden rule:** Dex appears to *add emotional signal*, not to decorate.
> If Dex's presence doesn't change how a student feels about the content —
> reassured, warned, delighted — cut the admonition.

### Admonition Syntax

```markdown
!!! mascot-<pose> "Title"
    <img src="../../img/mascot/<pose>.png" class="mascot-admonition-img" alt="Dex <description>">
    Content goes here.
```

Adjust the relative `../../` path depth to match the chapter's location in the
`docs/` tree.

### Pose Reference and Placement Rules

| Pose | File | When to Use |
|------|------|-------------|
| `welcome` | `welcome.png` | **Chapter opening only** — one per chapter, first thing after the summary. Sets the stage. |
| `thinking` | `thinking.png` | **Key concept moments** — when a single idea will recur throughout the rest of the book. Use sparingly (1–2 per chapter). |
| `tip` | `tip.png` | **Practical shortcuts** — a smarter path, a gotcha avoided, a tool recommendation. Up to 3 per chapter. |
| `warning` | `warning.png` | **Common mistakes and pitfalls** — the decisions teams regret in production. Use when the risk is real and specific. Up to 2 per chapter. |
| `encouraging` | `encouraging.png` | **Hard sections** — consensus protocols, CAP theorem nuance, distributed transactions. One per genuinely difficult section. |
| `neutral` | `neutral.png` | **General sidebars** — context, historical notes, "by the way" observations that don't fit another tone. |
| `celebration` | `celebration.png` | **Chapter ending only** — one per chapter, after the summary. Celebrate the student's progress. |

### Placement Density Rules

- **Maximum 7 Dex admonitions per chapter.** More than that and Dex becomes wallpaper.
- **Never two Dex admonitions back-to-back.** At least one full prose section between them.
- **The `welcome` and `celebration` poses are reserved** for chapter open and close
  respectively — do not use them mid-chapter for other purposes.
- **Do not place Dex inside a MicroSim section.** The interactive element carries
  its own engagement weight.

### Example — Chapter Opening

```markdown
!!! mascot-welcome "Welcome to Chapter 3!"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Dex waving welcome">
    I'm Dex — your guide through the wonderful world of database tradeoffs.
    In this chapter we tackle the CAP theorem. Spoiler: you *can't* have it all,
    but you can choose wisely. Let's analyze the tradeoffs!
```

### Example — Encouraging Callout for Hard Content

```markdown
!!! mascot-encourage "This Part Is Hard — That's Okay"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Dex encouraging">
    Distributed consensus is genuinely difficult. Every senior architect you
    admire spent time confused by Paxos. Take it slow, draw the diagrams,
    and remember: the goal is *working intuition*, not memorizing proofs.
```

### Example — Chapter Close

```markdown
!!! mascot-celebration "Chapter Complete!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Dex celebrating">
    You made it through the utility tree, the quality attribute scenarios, and
    the tradeoff analysis. Your ATAM toolkit just got a serious upgrade.
    Choose wisely — and document why!
```

---

## MicroSims

MicroSims are small, self-contained interactive visualizations embedded as
iframes. They live in subdirectories of the chapter folder and consist of
`main.html` (the simulation) and `index.md` (the embedding page).

### When to Use a MicroSim

- A concept has a *spatial or relational structure* that prose cannot convey
  efficiently (graph topology, query execution paths, replication state machines).
- A student needs to *manipulate parameters* to build intuition (node counts,
  replication factor, consistency level).
- A diagram would be static but the concept is inherently dynamic.

Do **not** create a MicroSim just to have one. A great table beats a mediocre
interactive.

---

## vis-network MicroSims for Graph Database Models

When a MicroSim needs to illustrate graph database concepts — nodes, edges,
labels, properties, traversal paths — use **vis-network**. It renders
force-directed graphs beautifully in the browser with zero server requirements.

### Library Import

Always load vis-network from the CDN (no local copy needed):

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/vis-network/9.1.9/vis-network.min.js"></script>
<link  href="https://cdnjs.cloudflare.com/ajax/libs/vis-network/9.1.9/vis-network.min.css" rel="stylesheet">
```

### Canonical File Structure

```
docs/chapters/NN-chapter-name/microsims/graph-model-name/
├── main.html      ← the vis-network simulation
└── index.md       ← iframe embed + description
```

### Standard HTML Template for a vis-network MicroSim

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Graph Model: [Concept Name]</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vis-network/9.1.9/vis-network.min.js"></script>
  <link  href="https://cdnjs.cloudflare.com/ajax/libs/vis-network/9.1.9/vis-network.min.css" rel="stylesheet">
  <style>
    body        { margin: 0; font-family: sans-serif; background: #f8f9fa; }
    #controls   { padding: 8px 12px; background: #fff; border-bottom: 1px solid #dee2e6;
                  display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
    #graph      { width: 100%; height: 460px; border: 1px solid #dee2e6; background: #fff; }
    label       { font-size: 0.85rem; color: #495057; }
    button      { padding: 4px 12px; border: 1px solid #adb5bd; border-radius: 4px;
                  background: #4682B4; color: #fff; cursor: pointer; font-size: 0.85rem; }
    button:hover { background: #E65100; }
  </style>
</head>
<body>

<div id="controls">
  <!-- Add sliders, buttons, or dropdowns here -->
  <button onclick="resetGraph()">Reset</button>
</div>
<div id="graph"></div>

<script>
  // ── Data ──────────────────────────────────────────────────────────────────
  const nodes = new vis.DataSet([
    { id: 1, label: 'Node A', group: 'entity' },
    { id: 2, label: 'Node B', group: 'entity' },
    { id: 3, label: 'Node C', group: 'property' },
  ]);

  const edges = new vis.DataSet([
    { from: 1, to: 2, label: 'RELATES_TO', arrows: 'to' },
    { from: 2, to: 3, label: 'HAS_PROPERTY', arrows: 'to', dashes: true },
  ]);

  // ── Options ───────────────────────────────────────────────────────────────
  const options = {
    nodes: {
      shape: 'dot',
      size: 18,
      font: { size: 13, face: 'sans-serif' },
      borderWidth: 2,
    },
    edges: {
      font: { size: 11, align: 'middle' },
      color: { color: '#848484', highlight: '#E65100' },
      smooth: { type: 'curvedCW', roundness: 0.15 },
    },
    groups: {
      entity:   { color: { background: '#4682B4', border: '#2c5f8a' }, font: { color: '#fff' } },
      property: { color: { background: '#E65100', border: '#b33d00' }, font: { color: '#fff' }, shape: 'box' },
    },
    physics: {
      solver: 'forceAtlas2Based',
      forceAtlas2Based: { gravitationalConstant: -50, springLength: 120 },
      stabilization: { iterations: 150 },
    },
    interaction: { hover: true, tooltipDelay: 100 },
  };

  // ── Init ──────────────────────────────────────────────────────────────────
  const container = document.getElementById('graph');
  const network   = new vis.Network(container, { nodes, edges }, options);

  function resetGraph() {
    network.fit({ animation: { duration: 600, easingFunction: 'easeInOutQuad' } });
  }
</script>
</body>
</html>
```

### Node Groups: Consistent Color Coding

Always use these color conventions so students build a visual vocabulary
across chapters. Consistency here is non-negotiable — it's the whole point.

| Group | Background | Border | Shape | Represents |
|-------|-----------|--------|-------|------------|
| `entity` | `#4682B4` (steel blue) | `#2c5f8a` | `dot` | Primary nodes / entity types |
| `property` | `#E65100` (dark orange) | `#b33d00` | `box` | Property nodes / value nodes |
| `index` | `#28a745` (green) | `#1e7e34` | `diamond` | Index structures |
| `aggregate` | `#6f42c1` (purple) | `#533291` | `ellipse` | Aggregates / partitions |
| `external` | `#6c757d` (gray) | `#495057` | `dot` | External systems / references |

### Edge Conventions

| Edge Style | Meaning |
|-----------|---------|
| Solid arrow (`arrows: 'to'`) | Directed relationship |
| Dashed arrow (`dashes: true, arrows: 'to'`) | Weak / optional relationship |
| No arrow (`arrows: ''`) | Undirected relationship |
| Thick (`width: 3`) | High-cardinality or primary path |

### Physics Settings by Model Size

| Nodes | Recommended Solver | `springLength` | `gravitationalConstant` |
|-------|-------------------|----------------|------------------------|
| ≤ 10  | `repulsion`       | 150            | -200 |
| 11–30 | `forceAtlas2Based`| 120            | -50  |
| 31–60 | `forceAtlas2Based`| 100            | -30  |
| > 60  | `barnesHut`       | 95             | -2000 |

For small illustrative models (≤ 10 nodes), consider **disabling physics
entirely** (`physics: false`) and using `x`/`y` coordinates for precise layout.
This is especially useful when you want to show a specific topology cleanly
rather than letting the force-directed algorithm surprise you.

### Tooltips and Node Details

Add `title` properties to nodes for hover tooltips — great for showing
property values without cluttering the label:

```js
{ id: 1, label: 'User:Alice', title: 'id: u001<br>email: alice@example.com', group: 'entity' }
```

### Controls Checklist for vis-network MicroSims

Every vis-network MicroSim should include at least two of the following:

- [ ] **Reset / Fit button** — `network.fit()` with animation
- [ ] **Node count slider** — lets student scale the model up/down
- [ ] **Show/Hide labels toggle** — reduces clutter on larger graphs
- [ ] **Highlight traversal button** — animates a path through the graph
- [ ] **Physics on/off toggle** — useful for frozen-layout exploration

### index.md Embedding

```markdown
## Graph Model: [Concept Name]

<iframe src="microsims/graph-model-name/main.html"
        width="100%"
        height="560"
        frameborder="0"
        scrolling="no"
        title="[Concept Name] Graph Model">
</iframe>

*Figure X: [One-sentence description of what the model shows.]*
```

The iframe height should be the `#graph` div height (460 px) plus controls
(~60 px) plus figure caption clearance (~40 px) = **560 px default**.
Adjust up if your controls panel is taller.

---

## Chapter Structure Checklist

Use this as a final pass before committing a chapter:

- [ ] `welcome` admonition at the very top (after the summary block)
- [ ] No more than 5 Dex admonitions total
- [ ] No two Dex admonitions adjacent to each other
- [ ] Each vis-network MicroSim follows the color conventions table
- [ ] Every MicroSim has a Reset/Fit button
- [ ] `celebration` admonition as the very last element
- [ ] All image paths are correct relative to chapter depth
- [ ] Tone is precise, warm, and occasionally delightful

---

*"Choose wisely — and document why!"* — Dex
