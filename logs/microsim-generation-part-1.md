# MicroSim Generation — Part 1 Session Log

**Date:** 2026-06-03
**Scope completed:** All 16 MicroSims for **chapters 1–5** of the ATAM textbook.
**Commits:** `006f435` (microsims started) + `10a2623` (docs, screenshots, layout fixes).
**Remaining:** 35 MicroSims across **chapters 6–18** (see list at bottom).

---

## What was done (chapters 1–5)

Generated 16 MicroSims from the specs in `docs/sims/TODO/*.json` using the
`microsim-generator` skill workflow. All 16:

- validate at **grade A (98/100)** via `validate-sims.py`
- **PASS** the Playwright control-visibility test (`microsim-iframe-tester`)
- are embedded in their chapter `index.md` with iframe height = `CANVAS_HEIGHT + 2`
- have real `index.md` documentation, a preview `.png`, and an mkdocs nav entry

Sims: technical-debt-simulator, architecture-building-blocks-explorer*, architecture-views-explorer*,
separation-of-concerns-explorer, architecture-lifecycle-governance, fitness-function-dashboard,
technology-radar-explorer, atam-process-flow, atam-team-roles, evaluation-methods-comparison,
stakeholder-universe-map, business-to-architecture-mapping, stakeholder-priority-matrix,
quality-attribute-taxonomy, qa-requirement-workbench, qa-coverage-dashboard.
(* = vis-network; all others p5.js)

---

## The workflow to repeat for chapters 6–18

Paths:
```
UTILS=$HOME/Documents/ws/claude-skills/src/microsim-utils
PROJECT=/Users/danmccreary/Documents/ws/atam
TESTER=$HOME/.claude/skills/microsim-iframe-tester/scripts
```

Per chapter (`<dir>` e.g. `06-quality-attribute-scenarios`):

1. **Extract specs** (re-reads the chapter `#### Diagram:` blocks; equivalent to the TODO JSON):
   `python3 $UTILS/extract-sim-specs.py --project-dir $PROJECT --chapter <dir> --output /tmp/<dir>-specs.json`
2. **Scaffold with `--force`** (the earlier `scaffold-microsims-from-todo.py` left placeholder stubs in a different
   format — `--force` regenerates proper `main.html`/`index.md`/`metadata.json`; it never clobbers a real `.js`):
   `python3 $UTILS/generate-sim-scaffold.py --spec-file /tmp/<dir>-specs.json --project-dir $PROJECT --force`
3. **Write the `.js`** for each sim (the creative work). Read the full spec from `docs/sims/TODO/<sim>.json`.
4. After all `.js` written, run the batch tools (can do once for all chapters at the end, or per chapter):
   - `python3 $UTILS/fix-iframe-heights.py --project-dir $PROJECT --verbose`
   - `python3 $UTILS/add-iframes-to-chapter.py --all --project-dir $PROJECT --fix-heights --fix-paths` (see gotcha #2)
   - `python3 $UTILS/validate-sims.py --project-dir $PROJECT --format table`
   - per sim: `python3 $TESTER/test-iframe-heights.py --sims-dir $PROJECT/docs/sims --sim <sim>`
   - `python3 $UTILS/update-mkdocs-nav.py --project-dir $PROJECT`
   - screenshots: `~/.local/bin/bk-capture-screenshot docs/sims/<sim> 3 <CANVAS_HEIGHT+2>` (see gotcha #3)
   - layout review: read each `.png` with vision; fix clipping/overlap; re-capture.

**Use `python3`, never `python`** — `python` is Python 2 here and the scripts fail silently (gotcha #1).
**Run sequentially** (the skill mandates this unless the user says "execute in parallel").

---

## Conventions established (match these for consistency)

**p5.js sims** — standard layout: top `drawHeight` drawing region (`aliceblue` bg, `silver` border) + bottom
`controlHeight` control region (`white` bg). Native p5 controls (createButton/Slider/Select/Checkbox/Input)
in the control region. Responsive width via `updateCanvasSize()` (reads `<main>` width) + `windowResized()`.
`// CANVAS_HEIGHT: <int>` comment in the first ~10 lines = `drawHeight + controlHeight`. Default state PAUSED
for any animation. `noStroke()` before every `text()`. Named colors. Detail/info panels drawn inside the canvas
(right side or bottom strip). Click-to-explore via `mousePressed()` with hit-testing; `if (mouseY > drawHeight) return;`
to ignore clicks in the control area.

**vis-network sims** — do NOT use the minimal `<main>` scaffold; write a custom `main.html` + `style.css`:
- Load `vis-network.min.js` AND `vis-network.min.css` (the CSS is needed for nav-button icons).
- **Use a flex-column `.container`** (`height:100vh; display:flex; flex-direction:column`) with `#network { flex:1 1 auto; min-height:0 }`
  and info/footer panels as **fixed-height flex items** (NOT absolute overlays over a 100vh canvas — that hides them
  and can cover/clip nodes). A top header bar (flex item) is a good place for title+legend+selector so the legend
  never covers a corner node.
- `interaction: { zoomView:false, dragView:false, navigationButtons:true }` when in an iframe (use `isInIframe()` to
  enable mouse pan/zoom only in fullscreen). `physics:{enabled:false}`, fixed node positions, `network.fit()` on `afterDrawing`.
- Set `// CANVAS_HEIGHT:` in the `.js` so `fix-iframe-heights.py` can size the iframe.

**index.md content** — the scaffold defaults to a wrong "9-12 (High School Geometry)" lesson plan; replace with
Grade Level "Undergraduate / Professional", a real About/How-to/Learning-Objective/Assessment, and references
(Bass et al. *Software Architecture in Practice* 4th ed.; Kazman et al. ATAM TR). See any chapter 1–5 sim `index.md`
for the template.

---

## Gotchas / known issues

1. **`python` vs `python3`**: always use `python3`. (Also fixed the microsim-utils SKILL.md examples in the claude-skills repo this session.)
2. **`add-iframes-to-chapter.py` `<br/>` bug**: the extractor can capture a sim-id with a trailing `<br/>`
   (from `**sim-id:** foo<br/>` in the chapter), producing broken iframe paths like `sims/foo<br//main.html`
   and a duplicate `[Run ... Fullscreen]` link. After running it, grep each touched chapter for `<br/>/main.html`
   and for stray fullscreen-link lines, and repair (strip `<br/>`, set height, drop the extra link). This bit
   chapter 1 this session.
3. **`bk-capture-screenshot` misrenders vis-network (100vh) sims** — it loads `main.html` in a tall standalone
   window, so panels end up off-screen and nodes look clipped even when the embedded iframe is correct. For
   vis-network sims, capture with Playwright at the real iframe size instead (viewport 800×`CANVAS_HEIGHT+2`,
   `page.goto('file://.../main.html')`, wait ~1800ms, `page.screenshot(...)`). p5.js screenshots from
   bk-capture are fine.
4. **`quality-attribute-taxonomy` sim-id collision**: chapter 1 specs it as a vis-network "Taxonomy Explorer";
   chapter 5 (built) specs the same sim-id as the p5.js "Conflict Map". Built the chapter-5 version per the TODO.
   If both are wanted, split into two sim-ids. (Already handled for ch1–5; just don't be surprised.)
5. **Radar charts**: keep the center offset right and radius reduced enough that the **leftmost axis label** isn't
   clipped (e.g., `cx = leftW/2 + 28`, `R = min(leftW/2 - 66, ...)`).
6. Some chapter-1–5 spec "extras" were intentionally simplified in v1 (drag-to-add on the tech radar, multi-domain
   toggle on business-to-architecture, edit-scores drag on qa-coverage). Apply the same judgment for 6–18: implement
   the core learning interaction well; defer heavy extras and note them.

---

## Remaining work — 35 sims, chapters 6–18

(6 are vis-network, 29 are p5.js)

- **Ch6**: scenario-construction-workbench, scenario-to-fitness-pipeline, scenario-workshop-simulator
- **Ch7**: priority-matrix-explorer, utility-tree-builder, utility-tree-explorer
- **Ch8**: adr-evolution-timeline, communication-style-explorer, pattern-quality-matrix
- **Ch9**: caching-tactic-explorer, resilience-pattern-simulator, **tactic-interaction-web [vis-network]**
- **Ch10**: atam-output-pipeline, atam-result-type-explorer, risk-register-explorer
- **Ch11**: cap-theorem-explorer, distributed-system-explorer, distributed-trace-viewer
- **Ch12**: api-versioning-explorer, saga-flow-simulator
- **Ch13**: cloud-native-qa-explorer, deployment-strategy-selector
- **Ch14**: security-architecture-layers, stride-threat-explorer
- **Ch15**: **cdn-architecture-explorer [vis-network]**, performance-metrics-explorer, scaling-tradeoff-explorer
- **Ch16**: availability-architecture-explorer, distributed-trace-explorer, **failover-architecture-explorer [vis-network]**
- **Ch17**: **ml-pipeline-explorer [vis-network]**, **rag-architecture-explorer [vis-network]**, responsible-ai-explorer
- **Ch18**: **data-architecture-patterns [vis-network]**, federated-learning-explorer

The `docs/sims/TODO/<sim>.json` for each contains the full spec. Directories already exist as placeholder stubs
(from the earlier `scaffold-microsims-from-todo.py`) — regenerate them with `generate-sim-scaffold.py --force`
before writing the `.js`.

### Resume prompt for the next (post-`/clear`) session
> Continue the MicroSim generation per `logs/microsim-generation-part-1.md`. Use the `microsim-generator`
> skill to implement the remaining chapters (start with chapter 6), following the conventions and gotchas in
> that log. Commit per chapter or per few chapters.
