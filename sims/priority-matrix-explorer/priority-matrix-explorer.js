// Priority Matrix Explorer (Importance vs Difficulty)
// CANVAS_HEIGHT: 570
// Bloom L5 (Evaluate): students ASSESS the priority distribution of a utility tree's
// scenarios across a 2x2 Importance-by-Difficulty matrix, judge whether the (H,H)
// "analyze first" set is appropriate, and reclassify scenarios by dragging to see how
// the analytical focus shifts.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 520;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;

// Chapter-7 QA palette (per spec): Performance red, Availability blue, Security green,
// Modifiability purple, Scalability teal.
const QA = {
  Performance:   [229, 57, 53],
  Availability:  [33, 150, 243],
  Security:      [76, 175, 80],
  Modifiability: [156, 39, 176],
  Scalability:   [0, 150, 136]
};
// M sits below the Importance midline so medium-importance scenarios fall in the lower
// half (Watch), keeping the (H,H) "analyze first" count faithful to the 5 specced even
// after the golden-angle spread offset is applied.
const lvl = { H: 0.80, M: 0.42, L: 0.18 };
const SPREAD = 0.065;  // golden-angle offset radius keeps co-located dots distinct
function spread(i) { const a = i * 2.399963; return { di: SPREAD * sin(a), dd: SPREAD * cos(a) }; }

// importance (imp) increases upward, difficulty (diff) increases rightward
let scenarios = [
  { t: 'Patient appointment search < 800ms at p99 under peak load', qa: 'Performance',   imp: lvl.H, diff: lvl.H },
  { t: 'EHR integration failure does not prevent scheduling',        qa: 'Availability',  imp: lvl.H, diff: lvl.H },
  { t: 'PHI access only for authenticated, authorized users',        qa: 'Security',      imp: lvl.H, diff: lvl.H },
  { t: 'Admin account compromise detected within 60 seconds',        qa: 'Security',      imp: lvl.H, diff: lvl.H },
  { t: 'New insurance provider integration, no patient-facing change',qa: 'Modifiability', imp: lvl.H, diff: lvl.H },
  { t: 'Patient record retrieval < 2s for large records',            qa: 'Performance',   imp: lvl.H, diff: lvl.L },
  { t: 'Maintenance window < 30 min per week, off-peak',             qa: 'Availability',  imp: lvl.H, diff: lvl.L },
  { t: 'All PHI encrypted at rest and in transit',                   qa: 'Security',      imp: lvl.H, diff: lvl.L },
  { t: 'HIPAA regulation change implementable in one sprint',        qa: 'Modifiability', imp: lvl.M, diff: lvl.H },
  { t: 'Authentication failover to backup IdP within 10 seconds',    qa: 'Availability',  imp: lvl.M, diff: lvl.H },
  { t: 'Nightly claim reconciliation within a 4-hour window',        qa: 'Performance',   imp: lvl.L, diff: lvl.L }
];

let selectedIdx = -1;
let dragIdx = -1;
let showPath = false;
let filterQA = 'All';
let pathBtn, filterBtn, resetBtn;
const filterCycle = ['All', 'Performance', 'Availability', 'Security', 'Modifiability'];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  // spread dots that share a cell so they don't stack exactly
  for (let i = 0; i < scenarios.length; i++) {
    const o = spread(i);
    scenarios[i].imp += o.di;
    scenarios[i].diff += o.dd;
  }

  pathBtn = createButton('Show Critical Path');
  pathBtn.mousePressed(() => {
    showPath = !showPath;
    pathBtn.html(showPath ? 'Hide Critical Path' : 'Show Critical Path');
  });
  filterBtn = createButton('Filter: All');
  filterBtn.mousePressed(() => {
    const i = (filterCycle.indexOf(filterQA) + 1) % filterCycle.length;
    filterQA = filterCycle[i];
    filterBtn.html('Filter: ' + filterQA);
  });
  resetBtn = createButton('Reset');
  resetBtn.mousePressed(resetPositions);
  positionButtons();

  describe('A 2x2 priority matrix with Importance on the vertical axis and Difficulty on the ' +
    'horizontal axis. Scenario dots are colored by quality attribute and can be dragged ' +
    'between quadrants; the top-right quadrant is the critical "analyze first" set.', LABEL);
}

function positionButtons() {
  const y = drawHeight + 12;
  pathBtn.position(10, y);
  filterBtn.position(150, y);
  resetBtn.position(250, y);
}

function resetPositions() {
  const base = [
    ['H','H'],['H','H'],['H','H'],['H','H'],['H','H'],
    ['H','L'],['H','L'],['H','L'],['M','H'],['M','H'],['L','L']
  ];
  for (let i = 0; i < scenarios.length; i++) {
    const o = spread(i);
    scenarios[i].imp = lvl[base[i][0]] + o.di;
    scenarios[i].diff = lvl[base[i][1]] + o.dd;
  }
  selectedIdx = -1;
}

function matrix() {
  const lw = Math.max(300, canvasWidth * 0.60);
  const side = Math.min(lw - 44, drawHeight - 96);
  return { x0: margin + 30, y0: 60, side };
}

function dotXY(s, m) {
  return { x: m.x0 + constrain(s.diff, 0, 1) * m.side, y: m.y0 + (1 - constrain(s.imp, 0, 1)) * m.side };
}

function hhCount() {
  let c = 0;
  for (const s of scenarios) if (s.imp >= 0.5 && s.diff >= 0.5) c++;
  return c;
}

function draw() {
  updateCanvasSize();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(LEFT, TOP); textSize(18);
  text('Priority Matrix — Importance vs Difficulty', margin, 10);
  fill(90); textSize(11);
  text('Drag a scenario to reclassify it. The top-right (H,H) set is analyzed first.', margin, 34);

  const m = matrix();
  drawQuadrants(m);
  drawAxes(m);
  if (showPath) drawCriticalPath(m);
  drawDots(m);
  drawSidePanel(m);
  drawControlHint();
}

function drawQuadrants(m) {
  const h = m.side / 2;
  noStroke();
  fill(255, 228, 228); rect(m.x0 + h, m.y0, h, h);          // top-right  critical
  fill(226, 245, 229); rect(m.x0, m.y0, h, h);              // top-left   confirm
  fill(255, 243, 224); rect(m.x0 + h, m.y0 + h, h, h);      // bot-right  watch
  fill(238, 238, 238); rect(m.x0, m.y0 + h, h, h);          // bot-left   monitor
  stroke(180); strokeWeight(1);
  rect(m.x0, m.y0, m.side, m.side);
  line(m.x0 + h, m.y0, m.x0 + h, m.y0 + m.side);
  line(m.x0, m.y0 + h, m.x0 + m.side, m.y0 + h);
  // quadrant captions
  noStroke(); textSize(10.5); textStyle(BOLD);
  fill(180, 40, 40);  textAlign(RIGHT, TOP); text('Critical — Analyze First (H,H)', m.x0 + m.side - 6, m.y0 + 5);
  fill(46, 110, 60);  textAlign(LEFT, TOP);  text('Confirm — Verify & Document (H,L)', m.x0 + 6, m.y0 + 5);
  fill(180, 110, 0);  textAlign(RIGHT, TOP); text('Watch — If Resources Permit (L,H)', m.x0 + m.side - 6, m.y0 + m.side - 18);
  fill(110);          textAlign(LEFT, TOP);  text('Monitor (L,L)', m.x0 + 6, m.y0 + m.side - 18);
  textStyle(NORMAL);
}

function drawAxes(m) {
  noStroke(); fill(40); textSize(11.5); textStyle(BOLD);
  // y axis: Importance (rotated)
  push();
  translate(margin + 6, m.y0 + m.side / 2); rotate(-HALF_PI);
  textAlign(CENTER, CENTER); text('Importance →', 0, 0);
  pop();
  // x axis: Difficulty
  textAlign(CENTER, TOP); text('Difficulty →', m.x0 + m.side / 2, m.y0 + m.side + 6);
  textStyle(NORMAL); fill(120); textSize(9.5);
  textAlign(CENTER, TOP);
  text('Low', m.x0 + m.side * 0.25, m.y0 + m.side + 22);
  text('High', m.x0 + m.side * 0.75, m.y0 + m.side + 22);
}

function drawCriticalPath(m) {
  const hh = scenarios.filter(s => s.imp >= 0.5 && s.diff >= 0.5)
    .sort((a, b) => (b.imp + b.diff) - (a.imp + a.diff));
  stroke(120, 40, 40); strokeWeight(2);
  for (let i = 0; i < hh.length - 1; i++) {
    const a = dotXY(hh[i], m), b = dotXY(hh[i + 1], m);
    line(a.x, a.y, b.x, b.y);
    const ang = atan2(b.y - a.y, b.x - a.x);
    push(); translate(b.x, b.y); rotate(ang);
    fill(120, 40, 40); noStroke(); triangle(-8, -4, -8, 4, -1, 0); pop();
    stroke(120, 40, 40); strokeWeight(2);
  }
  noStroke();
}

function drawDots(m) {
  for (let i = 0; i < scenarios.length; i++) {
    const s = scenarios[i];
    const p = dotXY(s, m);
    const c = QA[s.qa];
    const dim = filterQA !== 'All' && s.qa !== filterQA;
    const a = dim ? 55 : 255;
    stroke(255, a); strokeWeight(2);
    fill(c[0], c[1], c[2], a);
    const r = (i === selectedIdx) ? 18 : 14;
    circle(p.x, p.y, r);
    if (i === selectedIdx) { noFill(); stroke(40, a); strokeWeight(2); circle(p.x, p.y, r + 7); }
    noStroke(); fill(255, a); textAlign(CENTER, CENTER); textSize(9); textStyle(BOLD);
    text(i + 1, p.x, p.y); textStyle(NORMAL);
  }
}

function drawSidePanel(m) {
  const x = m.x0 + m.side + 18;
  const w = canvasWidth - x - margin;
  if (w < 120) return;

  // (H,H) count badge
  noStroke(); fill(180, 40, 40); rect(x, 60, w, 30, 6);
  fill(255); textAlign(CENTER, CENTER); textSize(14); textStyle(BOLD);
  text('(H,H) Analyze-First: ' + hhCount(), x + w / 2, 75); textStyle(NORMAL);

  // legend
  let y = 102;
  fill(40); textAlign(LEFT, TOP); textSize(12); textStyle(BOLD);
  text('Quality attribute', x, y); textStyle(NORMAL);
  y += 20;
  for (const k of Object.keys(QA)) {
    const c = QA[k];
    fill(c[0], c[1], c[2]); circle(x + 7, y + 6, 12);
    fill(60); textAlign(LEFT, CENTER); textSize(11);
    text(k, x + 20, y + 6);
    y += 20;
  }

  // detail panel
  y += 8;
  const ph = drawHeight - y - 12;
  fill(255); stroke(200); strokeWeight(1); rect(x, y, w, ph, 8); noStroke();
  fill(30, 60, 120); textAlign(LEFT, TOP); textSize(12.5); textStyle(BOLD);
  text('Scenario detail', x + 10, y + 8); textStyle(NORMAL);
  if (selectedIdx >= 0) {
    const s = scenarios[selectedIdx];
    const c = QA[s.qa];
    fill(c[0], c[1], c[2]); textSize(11.5); textStyle(BOLD);
    text('#' + (selectedIdx + 1) + '  ' + s.qa, x + 10, y + 28); textStyle(NORMAL);
    fill(50); textSize(12);
    text(s.t, x + 10, y + 46, w - 20, ph - 80);
    const impL = s.imp >= 0.66 ? 'High' : (s.imp >= 0.4 ? 'Medium' : 'Low');
    const difL = s.diff >= 0.66 ? 'High' : (s.diff >= 0.4 ? 'Medium' : 'Low');
    fill(90); textSize(11.5);
    text('Importance: ' + impL + '   ·   Difficulty: ' + difL, x + 10, y + ph - 26, w - 20);
  } else {
    fill(120); textSize(11.5);
    text('Click a dot to read its scenario; drag a dot to reclassify it.', x + 10, y + 30, w - 20);
  }
}

function drawControlHint() {
  if (canvasWidth < 560) return;
  noStroke(); fill(90); textAlign(LEFT, CENTER); textSize(11);
  text('Show Critical Path links the (H,H) set in evaluation order.',
    330, drawHeight + controlHeight / 2, canvasWidth - 340);
}

function pickDot() {
  const m = matrix();
  for (let i = scenarios.length - 1; i >= 0; i--) {
    if (filterQA !== 'All' && scenarios[i].qa !== filterQA) continue;
    const p = dotXY(scenarios[i], m);
    if (dist(mouseX, mouseY, p.x, p.y) <= 12) return i;
  }
  return -1;
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const i = pickDot();
  if (i >= 0) { dragIdx = i; selectedIdx = i; }
}

function mouseDragged() {
  if (dragIdx < 0) return;
  const m = matrix();
  scenarios[dragIdx].diff = constrain((mouseX - m.x0) / m.side, 0.04, 0.96);
  scenarios[dragIdx].imp = constrain(1 - (mouseY - m.y0) / m.side, 0.04, 0.96);
}

function mouseReleased() { dragIdx = -1; }

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
