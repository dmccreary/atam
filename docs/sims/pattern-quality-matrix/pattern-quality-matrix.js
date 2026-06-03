// Pattern–Quality Attribute Matrix
// CANVAS_HEIGHT: 576
// Bloom L4 (Analyze): students COMPARE eight architectural patterns across eight quality
// attributes. Each cell shows whether a pattern primarily supports (green), threatens (red),
// is complex/depends (yellow), or is neutral (gray) on that attribute. Clicking a cell reveals
// the tradeoff mechanism; column headers sort patterns; a compare mode shows two side by side.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 530;
let controlHeight = 46;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;

const QAS = ['Perf', 'Avail', 'Sec', 'Modif', 'Scal', 'Test', 'Deploy', 'Interop'];
const QAS_FULL = ['Performance', 'Availability', 'Security', 'Modifiability', 'Scalability', 'Testability', 'Deployability', 'Interoperability'];

// rating: S supports, T threatens, Y complex/depends, N neutral
const RC = { S: [76, 175, 80], T: [229, 83, 80], Y: [245, 196, 80], N: [205, 205, 205] };
const RWORD = { S: 'Primarily supports', T: 'Primarily threatens', Y: 'Complex / depends', N: 'Neutral' };
const RANK = { S: 3, Y: 2, N: 1, T: 0 };

const patterns = [
  { name: 'Layered', summary: 'Horizontal layers (presentation, business, data) with downward dependencies.',
    cells: [['Y', 'Layer traversal adds overhead; fine for moderate load, weak at high throughput.'],
      ['N', 'No inherent availability mechanism.'],
      ['S', 'Layer boundaries create natural access-control checkpoints.'],
      ['S', 'Changes tend to stay within one layer behind a stable interface.'],
      ['T', 'Deploys as one unit; hot paths cannot scale independently.'],
      ['S', 'Each layer is testable by stubbing the layers below it.'],
      ['T', 'A single deployable means the whole app redeploys for any change.'],
      ['N', 'No special interoperability support.']] },
  { name: 'Microservices', summary: 'Independently deployable services owning their data, talking over the network.',
    cells: [['T', 'Service-to-service network calls add latency; sync chains compound it.'],
      ['Y', 'Failure isolation helps, but there are many more network failure modes.'],
      ['T', 'Many endpoints and east-west traffic enlarge the attack surface.'],
      ['S', 'Independent deployment boundary limits the blast radius of a change.'],
      ['S', 'Each service scales independently to its own load.'],
      ['Y', 'Unit tests are easy; integration and end-to-end tests get harder.'],
      ['S', 'Services deploy independently on their own cadence.'],
      ['S', 'Explicit API contracts enable polyglot integration.']] },
  { name: 'Event-Driven', summary: 'Components communicate through asynchronous events via a broker.',
    cells: [['S', 'Async decoupling and buffering absorb load spikes.'],
      ['S', 'Decoupling means a down consumer does not block producers.'],
      ['Y', 'The broker is a trust boundary; message provenance must be enforced.'],
      ['S', 'Add new consumers without touching producers.'],
      ['S', 'Partitioned topics let consumers scale horizontally.'],
      ['T', 'Async, ordering-sensitive flows are hard to test deterministically.'],
      ['Y', 'Independent deploys, but schema/ordering contracts add release risk.'],
      ['S', 'Event schemas decouple producers from consumers.']] },
  { name: 'CQRS', summary: 'Separates the read model from the write model for independent optimization.',
    cells: [['S', 'Read and write models are each optimized for their workload.'],
      ['Y', 'The read side can serve during write trouble (eventual consistency).'],
      ['N', 'No inherent security effect.'],
      ['Y', 'Two models add complexity but isolate read vs write change.'],
      ['S', 'Scale the read side independently of writes.'],
      ['T', 'Dual models plus sync logic increase the test burden.'],
      ['N', 'No inherent deployability effect.'],
      ['N', 'No special interoperability support.']] },
  { name: 'Strangler Fig', summary: 'Incrementally replaces a legacy system behind a routing facade.',
    cells: [['N', 'No inherent performance effect.'],
      ['Y', 'Incremental cutover lowers risk, but the routing facade is a new dependency.'],
      ['Y', 'Old and new systems coexist; auth must be bridged across both.'],
      ['S', 'Replace legacy incrementally instead of a risky big-bang rewrite.'],
      ['N', 'No inherent scalability effect.'],
      ['Y', 'Parallel-run enables comparison testing of old vs new.'],
      ['S', 'Migrate piece by piece with small, low-risk releases.'],
      ['Y', 'A facade bridges old and new interfaces during migration.']] },
  { name: 'Hexagonal', summary: 'Isolates domain logic behind ports, with adapters for all external concerns.',
    cells: [['N', 'No inherent performance effect.'],
      ['N', 'No inherent availability effect.'],
      ['Y', 'Ports isolate external adapters, narrowing trust boundaries.'],
      ['S', 'Domain is isolated from infrastructure; swap adapters freely.'],
      ['N', 'No inherent scalability effect.'],
      ['S', 'The domain is testable without infrastructure through its ports.'],
      ['N', 'No inherent deployability effect.'],
      ['S', 'Adapters let the core speak to many external protocols.']] },
  { name: 'Pipe-and-Filter', summary: 'Processes a data stream through a chain of independent, composable filters.',
    cells: [['Y', 'Stage parallelism helps, but serialization between stages costs.'],
      ['N', 'No inherent availability effect.'],
      ['N', 'No inherent security effect.'],
      ['S', 'Filters can be reordered or inserted without rewriting others.'],
      ['S', 'Stages scale independently; supports data parallelism.'],
      ['S', 'Each filter is testable in isolation with known input/output.'],
      ['Y', 'Filters deploy separately, but the pipeline contract couples them.'],
      ['Y', 'A standard pipe format lets heterogeneous filters compose.']] },
  { name: 'SOA', summary: 'Coarse-grained reusable services integrated through a central bus (ESB).',
    cells: [['T', 'ESB mediation and SOAP overhead add latency.'],
      ['Y', 'Service redundancy helps, but a central ESB is a single point of failure.'],
      ['S', 'The ESB centralizes policy and security enforcement.'],
      ['Y', 'Service reuse aids change, but ESB coupling can spread it.'],
      ['Y', 'Services scale, yet the ESB can become a throughput bottleneck.'],
      ['Y', 'Contract services test well; ESB orchestration complicates it.'],
      ['T', 'Central ESB coordination complicates independent deployment.'],
      ['S', 'Canonical contracts make broad integration a core strength.']] }
];

let order = patterns.map((_, i) => i);
let sortCol = -1;
let selected = null;     // {kind:'cell',p,q} | {kind:'row',p}
let compareMode = false;
let compareSel = [];
let compareBtn, resetBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  compareBtn = createButton('Compare Two Patterns');
  compareBtn.mousePressed(() => {
    compareMode = !compareMode; compareSel = [];
    compareBtn.html(compareMode ? 'Exit Compare' : 'Compare Two Patterns');
  });
  resetBtn = createButton('Reset Sort');
  resetBtn.mousePressed(() => { sortCol = -1; order = patterns.map((_, i) => i); });
  positionButtons();
  describe('An 8x8 matrix of architectural patterns (rows) versus quality attributes (columns). ' +
    'Each cell is colored green (supports), red (threatens), yellow (complex/depends), or gray ' +
    '(neutral). Clicking a cell explains the tradeoff mechanism; clicking a column header sorts ' +
    'the patterns by that attribute.', LABEL);
}

function positionButtons() {
  const y = drawHeight + 10;
  compareBtn.position(10, y);
  resetBtn.position(190, y);
}

function rowHeaderW() { return 142; }
function gridTop() { return 76; }
function headerH() { return 22; }
function colW() { return (canvasWidth - margin * 2 - rowHeaderW()) / 8; }
function rowH() { return 26; }
function cellsTop() { return gridTop() + headerH() + 2; }

function applySort() {
  if (sortCol < 0) { order = patterns.map((_, i) => i); return; }
  order = patterns.map((_, i) => i).sort((a, b) => RANK[patterns[b].cells[sortCol][0]] - RANK[patterns[a].cells[sortCol][0]]);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(LEFT, TOP); textSize(18);
  text('Pattern × Quality Attribute Matrix', margin, 10);
  fill(90); textSize(11);
  text('Compare how each pattern supports or threatens each quality attribute. Click a cell or sort by a column.', margin, 33);

  drawLegend();
  drawMatrix();
  drawDetail();
  drawControlHint();
}

function drawLegend() {
  const items = [['S', 'supports'], ['T', 'threatens'], ['Y', 'complex/depends'], ['N', 'neutral']];
  let x = margin;
  const y = 52;
  for (const it of items) {
    const c = RC[it[0]];
    noStroke(); fill(c[0], c[1], c[2]); rect(x, y, 14, 12, 2);
    fill(70); textAlign(LEFT, CENTER); textSize(10.5); text(it[1], x + 19, y + 6);
    x += 19 + textWidth(it[1]) + 18;
  }
}

function drawMatrix() {
  const x0 = margin + rowHeaderW();
  const cw = colW(), rh = rowH();
  // column headers
  for (let q = 0; q < 8; q++) {
    const cx = x0 + q * cw;
    const active = q === sortCol;
    noStroke(); fill(active ? color(212, 175, 55) : color(245, 240, 225));
    rect(cx + 1, gridTop(), cw - 2, headerH(), 4, 4, 0, 0);
    fill(active ? 255 : 90); textAlign(CENTER, CENTER); textSize(10); textStyle(BOLD);
    text(QAS[q] + (active ? ' ↓' : ''), cx + cw / 2, gridTop() + headerH() / 2); textStyle(NORMAL);
  }
  // rows
  for (let r = 0; r < order.length; r++) {
    const p = order[r];
    const y = cellsTop() + r * rh;
    const inCompare = compareSel.includes(p);
    // row header
    noStroke(); fill(inCompare ? color(232, 240, 254) : color(247, 244, 235));
    rect(margin, y, rowHeaderW() - 2, rh - 2, 4);
    fill(40); textAlign(LEFT, CENTER); textSize(10.5); textStyle(BOLD);
    text(patterns[p].name, margin + 8, y + rh / 2); textStyle(NORMAL);
    // cells
    for (let q = 0; q < 8; q++) {
      const cx = x0 + q * cw;
      const cell = patterns[p].cells[q];
      const c = RC[cell[0]];
      const isSel = selected && selected.kind === 'cell' && selected.p === p && selected.q === q;
      stroke(isSel ? color(20) : color(255)); strokeWeight(isSel ? 2.5 : 1);
      fill(c[0], c[1], c[2]); rect(cx + 1, y, cw - 2, rh - 2, 3);
      noStroke(); fill(cell[0] === 'Y' || cell[0] === 'N' ? color(60) : color(255));
      textAlign(CENTER, CENTER); textSize(11); textStyle(BOLD);
      text(cell[0], cx + cw / 2, y + rh / 2 - 1); textStyle(NORMAL);
    }
  }
}

function drawDetail() {
  const x = margin, w = canvasWidth - margin * 2;
  const y0 = cellsTop() + 8 * rowH() + 8;
  const h = drawHeight - y0 - 8;
  fill(255); stroke(200); strokeWeight(1); rect(x, y0, w, h, 8); noStroke();

  if (compareMode) { drawCompare(x, y0, w, h); return; }

  if (!selected) {
    fill(30, 60, 120); textAlign(LEFT, TOP); textSize(12.5); textStyle(BOLD);
    text('Click a cell, a pattern name, or a column header', x + 12, y0 + 10); textStyle(NORMAL);
    fill(70); textSize(12);
    text('Each cell rates how a pattern affects a quality attribute. Click a cell for the ' +
      'tradeoff mechanism and what to probe in ATAM. Click a column header to sort patterns by ' +
      'that attribute (best-supporting first). Use Compare Two Patterns for a side-by-side.', x + 12, y0 + 32, w - 24);
    return;
  }
  if (selected.kind === 'cell') {
    const cell = patterns[selected.p].cells[selected.q]; const c = RC[cell[0]];
    fill(c[0] === 'N' ? color(120) : color(c[0], c[1], c[2])); textAlign(LEFT, TOP); textSize(13.5); textStyle(BOLD);
    text(patterns[selected.p].name + '  ×  ' + QAS_FULL[selected.q] + '   —   ' + RWORD[cell[0]], x + 12, y0 + 10); textStyle(NORMAL);
    fill(184, 134, 11); textSize(11.5); textStyle(BOLD); text('Mechanism', x + 12, y0 + 34); textStyle(NORMAL);
    fill(50); textSize(12.5); text(cell[1], x + 92, y0 + 34, w - 104);
    fill(184, 134, 11); textSize(11.5); textStyle(BOLD); text('In ATAM', x + 12, y0 + 74); textStyle(NORMAL);
    fill(50); textSize(12.5); text(atamWatch(cell[0], QAS_FULL[selected.q]), x + 92, y0 + 74, w - 104);
  } else {
    const p = patterns[selected.p];
    fill(40); textAlign(LEFT, TOP); textSize(13.5); textStyle(BOLD); text(p.name, x + 12, y0 + 10); textStyle(NORMAL);
    fill(70); textSize(12); text(p.summary, x + 12, y0 + 30, w - 24);
    // profile chips
    let cx = x + 12; const cy = y0 + 64;
    for (let q = 0; q < 8; q++) {
      const cell = p.cells[q], c = RC[cell[0]];
      fill(c[0], c[1], c[2]); rect(cx, cy, 78, 20, 4);
      fill(cell[0] === 'Y' || cell[0] === 'N' ? color(60) : color(255)); textAlign(CENTER, CENTER); textSize(9.5); textStyle(BOLD);
      text(QAS[q] + ' ' + cell[0], cx + 39, cy + 10); textStyle(NORMAL);
      cx += 84; if (cx + 78 > x + w - 12) { cx = x + 12; }
    }
  }
}

function atamWatch(r, attr) {
  if (r === 'T') return 'Write probing scenarios that stress ' + attr + '; this is a likely risk or sensitivity point.';
  if (r === 'S') return attr + ' is likely a non-risk here, but confirm the mechanism holds under real load.';
  if (r === 'Y') return 'A tradeoff point — the outcome depends on configuration; probe scenarios in both directions.';
  return 'No strong inherent effect on ' + attr + '; not a priority probe for this pattern.';
}

function drawCompare(x, y0, w, h) {
  fill(30, 60, 120); textAlign(LEFT, TOP); textSize(12.5); textStyle(BOLD);
  text('Compare mode — click two pattern names', x + 12, y0 + 8); textStyle(NORMAL);
  if (compareSel.length === 0) { fill(110); textSize(12); text('Select the first pattern.', x + 12, y0 + 30); return; }
  const colA = x + 150, colB = x + 150 + (w - 160) / 2;
  fill(40); textAlign(LEFT, TOP); textSize(11.5); textStyle(BOLD);
  text(patterns[compareSel[0]].name, colA, y0 + 8);
  if (compareSel[1] !== undefined) text(patterns[compareSel[1]].name, colB, y0 + 8);
  textStyle(NORMAL);
  for (let q = 0; q < 8; q++) {
    const yy = y0 + 30 + q * ((h - 36) / 8);
    fill(80); textAlign(LEFT, CENTER); textSize(10.5); text(QAS_FULL[q], x + 12, yy + 8);
    chip(colA, yy, patterns[compareSel[0]].cells[q]);
    if (compareSel[1] !== undefined) chip(colB, yy, patterns[compareSel[1]].cells[q]);
  }
}
function chip(cx, y, cell) {
  const c = RC[cell[0]];
  noStroke(); fill(c[0], c[1], c[2]); rect(cx, y, 16, 16, 3);
  fill(cell[0] === 'Y' || cell[0] === 'N' ? color(60) : color(255)); textAlign(CENTER, CENTER); textSize(10); textStyle(BOLD);
  text(cell[0], cx + 8, y + 8); textStyle(NORMAL);
}

function drawControlHint() {
  if (canvasWidth < 560) return;
  noStroke(); fill(90); textAlign(LEFT, CENTER); textSize(10.5);
  text('Sort by a column to rank patterns by that attribute.', 300, drawHeight + controlHeight / 2, canvasWidth - 310);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const x0 = margin + rowHeaderW(), cw = colW(), rh = rowH();
  // column header → sort
  if (mouseY >= gridTop() && mouseY <= gridTop() + headerH() && mouseX >= x0) {
    const q = Math.floor((mouseX - x0) / cw);
    if (q >= 0 && q < 8) { sortCol = (sortCol === q) ? -1 : q; applySort(); }
    return;
  }
  // rows
  const r = Math.floor((mouseY - cellsTop()) / rh);
  if (r >= 0 && r < order.length) {
    const p = order[r];
    if (mouseX < margin + rowHeaderW()) {
      if (compareMode) { if (!compareSel.includes(p)) { compareSel.push(p); if (compareSel.length > 2) compareSel.shift(); } }
      else selected = (selected && selected.kind === 'row' && selected.p === p) ? null : { kind: 'row', p };
      return;
    }
    if (mouseX >= x0) {
      const q = Math.floor((mouseX - x0) / cw);
      if (q >= 0 && q < 8 && !compareMode) selected = { kind: 'cell', p, q };
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionButtons();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
