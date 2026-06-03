// Business Goals to Architecture Driver Mapping
// CANVAS_HEIGHT: 590
// Bloom L4 (Analyze): students trace an architectural driver backward to its
// originating business goal and driver, showing that architectural decisions are
// grounded in organizational context. Example: a healthcare patient portal.
// Click any item to highlight its full traceability chain (up and down) in gold.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 540;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

let clearBtn;
let selected = null;
let chain = {};        // ids highlighted as part of the selected chain
let hoverEdge = null;

// five levels, each a colored band
const levels = [
  { name: 'Mission', color: [156, 39, 176] },
  { name: 'Business Goals', color: [33, 150, 243] },
  { name: 'Business Drivers', color: [0, 137, 123] },
  { name: 'Architectural Drivers', color: [255, 179, 0] },
  { name: 'QA Scenarios', color: [239, 108, 0] }
];

const nodes = {
  M:  { lvl: 0, t: 'Deliver high-quality patient care through technology-enabled services' },
  G1: { lvl: 1, t: 'Increase patient portal adoption to 70%' },
  G2: { lvl: 1, t: 'Maintain HIPAA compliance' },
  G3: { lvl: 1, t: 'Reduce operational costs by 15%' },
  D1: { lvl: 2, t: 'Patients prefer mobile-first interactions' },
  D2: { lvl: 2, t: 'HIPAA Omnibus enforcement intensified' },
  D3: { lvl: 2, t: 'IT budget constrained post-expansion' },
  D4: { lvl: 2, t: 'Competitor launched faster scheduling' },
  A1: { lvl: 3, t: 'Sub-2s response for patient-facing actions' },
  A2: { lvl: 3, t: 'End-to-end audit trail for PHI access' },
  A3: { lvl: 3, t: 'Independent deployability of portal modules' },
  A4: { lvl: 3, t: 'Graceful degradation when EHR is unavailable' },
  Q1: { lvl: 4, t: 'Perf: confirm appointment <2s @ 500 users' },
  Q2: { lvl: 4, t: 'Security: log PHI access <50ms (user, time, action)' },
  Q3: { lvl: 4, t: 'Modifiability: deploy new module w/o redeploying core' },
  Q4: { lvl: 4, t: 'Availability: serve scheduling on cached data when EHR down' }
};

const edges = [
  { f: 'M', t: 'G1', r: 'The mission of better care depends on patients actually using the portal.' },
  { f: 'M', t: 'G2', r: 'Care delivery must remain lawful — HIPAA compliance is non-negotiable.' },
  { f: 'M', t: 'G3', r: 'Sustainable care requires controlling operational cost.' },
  { f: 'G1', t: 'D1', r: 'Adoption is driven by meeting patients where they are: mobile.' },
  { f: 'G1', t: 'D4', r: 'A faster competitor threatens adoption, pressuring responsiveness.' },
  { f: 'G2', t: 'D2', r: 'Stricter enforcement makes compliance an active driver.' },
  { f: 'G3', t: 'D3', r: 'Cost reduction is forced by a constrained IT budget.' },
  { f: 'D1', t: 'A1', r: 'Mobile users abandon slow apps — therefore sub-2s response.' },
  { f: 'D4', t: 'A1', r: 'To beat a faster competitor, responsiveness becomes architectural.' },
  { f: 'D2', t: 'A2', r: 'Enforcement requires provable PHI access logging — an audit trail.' },
  { f: 'D3', t: 'A3', r: 'Independent deployability enables cost-effective, targeted scaling.' },
  { f: 'D4', t: 'A4', r: 'Scheduling must keep working even when EHR integration fails.' },
  { f: 'A1', t: 'Q1', r: 'The driver becomes a measurable performance scenario.' },
  { f: 'A2', t: 'Q2', r: 'The driver becomes a measurable security scenario.' },
  { f: 'A3', t: 'Q3', r: 'The driver becomes a measurable modifiability scenario.' },
  { f: 'A4', t: 'Q4', r: 'The driver becomes a measurable availability scenario.' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  clearBtn = createButton('Clear Highlight');
  clearBtn.position(10, drawHeight + 12);
  clearBtn.mousePressed(() => { selected = null; chain = {}; });

  describe('A five-level traceability hierarchy for a healthcare patient portal: ' +
    'Mission, Business Goals, Business Drivers, Architectural Drivers, and QA Scenarios, ' +
    'with arrows showing derivation. Click an item to highlight its full chain.', LABEL);
}

function layout() {
  const top = 58;
  const lvlGutter = 96;
  const areaH = drawHeight - top - 8;
  const lh = areaH / levels.length;
  // assign each node a box rect
  for (let lv = 0; lv < levels.length; lv++) {
    const ids = Object.keys(nodes).filter(id => nodes[id].lvl === lv);
    const n = ids.length;
    const usableW = canvasWidth - lvlGutter - margin;
    const bw = Math.min((usableW - (n - 1) * 12) / n, 230);
    const totalW = bw * n + 12 * (n - 1);
    const startX = lvlGutter + (usableW - totalW) / 2;
    const by = top + lv * lh + 6;
    const bh = lh - 22;
    for (let i = 0; i < n; i++) {
      nodes[ids[i]].x = startX + i * (bw + 12);
      nodes[ids[i]].y = by;
      nodes[ids[i]].w = bw;
      nodes[ids[i]].h = bh;
    }
  }
  return { top, lvlGutter, lh };
}

function computeChain(id) {
  chain = {}; chain[id] = true;
  // walk down
  let frontier = [id];
  while (frontier.length) {
    const cur = frontier.pop();
    for (const e of edges) if (e.f === cur && !chain[e.t]) { chain[e.t] = true; frontier.push(e.t); }
  }
  // walk up
  frontier = [id];
  while (frontier.length) {
    const cur = frontier.pop();
    for (const e of edges) if (e.t === cur && !chain[e.f]) { chain[e.f] = true; frontier.push(e.f); }
  }
}

function draw() {
  updateCanvasSize();
  const L = layout();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(CENTER, TOP); textSize(18);
  text('Business Goals → Architecture Traceability', canvasWidth / 2, 10);
  fill(90); textSize(11);
  text('Example: Healthcare Patient Portal', canvasWidth / 2, 32);

  // level gutter labels
  for (let lv = 0; lv < levels.length; lv++) {
    const cy = L.top + lv * L.lh + L.lh / 2;
    const c = levels[lv].color;
    noStroke(); fill(c[0], c[1], c[2], 60);
    rect(margin, L.top + lv * L.lh + 4, L.lvlGutter - margin - 6, L.lh - 12, 6);
    fill(c[0] * 0.7, c[1] * 0.7, c[2] * 0.7);
    textAlign(CENTER, CENTER); textSize(11); textStyle(BOLD);
    push(); translate(margin + (L.lvlGutter - margin) / 2 - 3, cy);
    text(levels[lv].name, 0, 0, L.lvlGutter - margin); pop();
    textStyle(NORMAL);
  }

  // edges first (under boxes)
  hoverEdge = null;
  for (const e of edges) {
    const a = nodes[e.f], b = nodes[e.t];
    const x1 = a.x + a.w / 2, y1 = a.y + a.h, x2 = b.x + b.w / 2, y2 = b.y;
    const inChain = chain[e.f] && chain[e.t];
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const hov = dist(mouseX, mouseY, mx, my) < 12 && mouseY < drawHeight;
    if (hov) hoverEdge = e;
    stroke(inChain ? color(255, 179, 0) : (hov ? color(80) : color(205)));
    strokeWeight(inChain ? 3 : (hov ? 2.5 : 1.2));
    line(x1, y1, x2, y2);
    noStroke(); fill(inChain ? color(230, 150, 0) : color(190));
    triangle(x2, y2, x2 - 4, y2 - 6, x2 + 4, y2 - 6);
  }

  // boxes
  for (const id of Object.keys(nodes)) {
    const nd = nodes[id];
    const c = levels[nd.lvl].color;
    const inChain = chain[id];
    const isSel = selected === id;
    stroke(isSel ? color(230, 150, 0) : (inChain ? color(255, 179, 0) : color(c[0], c[1], c[2])));
    strokeWeight(isSel ? 3.5 : (inChain ? 2.5 : 1.2));
    fill(inChain ? color(255, 248, 220) : color(c[0], c[1], c[2], 45));
    rect(nd.x, nd.y, nd.w, nd.h, 7);
    noStroke(); fill(30); textAlign(CENTER, CENTER); textSize(10.5);
    text(nd.t, nd.x + 4, nd.y + 2, nd.w - 8, nd.h - 4);
  }

  // hover reason tooltip
  if (hoverEdge) {
    const a = nodes[hoverEdge.f], b = nodes[hoverEdge.t];
    const mx = (a.x + a.w / 2 + b.x + b.w / 2) / 2, my = (a.y + a.h + b.y) / 2;
    textSize(11); textAlign(LEFT, TOP);
    const tw = Math.min(260, textWidth(hoverEdge.r) + 16);
    const tx = constrain(mx - tw / 2, 4, canvasWidth - tw - 4);
    fill(20, 40, 120, 245); noStroke(); rect(tx, my - 4, tw, 48, 6);
    fill('white'); text(hoverEdge.r, tx + 8, my + 2, tw - 16, 42);
  }

  drawControlLabel();
}

function drawControlLabel() {
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(12);
  let m = 'Click an item to trace its chain; hover an arrow for the “because… therefore…” link.';
  if (selected) m = 'Highlighting the full chain through: ' + nodes[selected].t.slice(0, 40) + '…';
  text(m, 140, drawHeight + 25, canvasWidth - 150);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  for (const id of Object.keys(nodes)) {
    const nd = nodes[id];
    if (mouseX >= nd.x && mouseX <= nd.x + nd.w && mouseY >= nd.y && mouseY <= nd.y + nd.h) {
      selected = id; computeChain(id); return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
