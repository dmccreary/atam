// Architecture Fitness Function Dashboard
// CANVAS_HEIGHT: 590
// Bloom L3 (Apply): students identify which category of fitness function
// (structural, performance, security, compliance, quality) an architectural
// constraint maps to, and recognize what a violation looks like in a monitoring
// context. Introduce violations from the dropdown and watch the alert cascade.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 540;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 15;
let defaultTextSize = 16;

let violationSelect, fixButton, runButton;
let selectedCard = -1;
let runIndex = -1;          // index being checked during "Run All Checks"
let runTimer = 0;
let eventLog = [];

const catColor = {
  Structural: [21, 101, 192],
  Performance: [239, 108, 0],
  Security: [198, 40, 40],
  Compliance: [106, 27, 154],
  Quality: [0, 137, 123]
};

// each card: lower=true means lower values are better
const cards = [
  { name: 'Circular Dependencies', cat: 'Structural', lower: true, pass: 0, fail: 3, thr: 0, unit: '',
    detail: 'Counts cycles in the module dependency graph. Cycles make code impossible to layer, test, or reason about in isolation. A structural fitness function fails the build when any cycle appears.' },
  { name: 'Layer Violations', cat: 'Structural', lower: true, pass: 0, fail: 2, thr: 0, unit: '',
    detail: 'Counts calls that skip or invert allowed layer dependencies (e.g., UI calling the database directly). Structural fitness functions guard the intended layering.' },
  { name: 'API Latency p99', cat: 'Performance', lower: true, pass: 145, fail: 240, thr: 200, unit: 'ms',
    detail: 'The 99th-percentile API response time. A performance fitness function asserts the system stays within its latency budget; a regression that pushes p99 past 200ms fails the check.' },
  { name: 'Database Query Time', cat: 'Performance', lower: true, pass: 82, fail: 130, thr: 100, unit: 'ms',
    detail: 'Average query execution time. Performance fitness function: rising query time signals missing indexes or N+1 query patterns creeping in.' },
  { name: 'Known CVEs (High+)', cat: 'Security', lower: true, pass: 0, fail: 1, thr: 0, unit: '',
    detail: 'Count of high-or-critical published vulnerabilities in dependencies. A security fitness function fails the pipeline the moment a high-severity CVE is detected.' },
  { name: 'PII Encryption Coverage', cat: 'Compliance', lower: false, pass: 100, fail: 100, thr: 100, unit: '%',
    detail: 'Percentage of personally-identifiable fields encrypted at rest. A compliance fitness function requires 100% coverage; anything less is a regulatory risk.' },
  { name: 'Test Coverage', cat: 'Quality', lower: false, pass: 87, fail: 87, thr: 80, unit: '%',
    detail: 'Percentage of code exercised by automated tests. A quality fitness function enforces a minimum coverage floor so confidence does not erode over time.' },
  { name: 'Service Coupling Score', cat: 'Structural', lower: true, pass: 2.1, fail: 2.1, thr: 3.0, unit: '',
    detail: 'Average number of other services each service depends on. A structural fitness function caps coupling so the system stays decomposable.' }
];

function resetCards() {
  for (const c of cards) c.cur = c.pass;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  resetCards();
  logEvent('Dashboard initialized — all fitness functions passing.');

  violationSelect = createSelect();
  violationSelect.position(10, drawHeight + 12);
  violationSelect.option('Introduce Violation…');
  violationSelect.option('Add circular dependency');
  violationSelect.option('Add layer violation');
  violationSelect.option('Degrade API latency');
  violationSelect.option('Add CVE');
  violationSelect.changed(introduceViolation);

  fixButton = createButton('Fix Violations');
  fixButton.position(210, drawHeight + 12);
  fixButton.mousePressed(fixViolations);

  runButton = createButton('Run All Checks');
  runButton.position(310, drawHeight + 12);
  runButton.mousePressed(() => { runIndex = 0; runTimer = millis(); });

  describe('A fitness function dashboard with eight cards across structural, performance, ' +
    'security, compliance, and quality categories. Students introduce violations and ' +
    'watch cards fail and alerts appear in the event log.', LABEL);
}

function statusOf(c) {
  if (c.lower) {
    if (c.cur > c.thr) return 'fail';
    if (c.thr > 0 && c.cur > c.thr * 0.9) return 'warn';
    return 'pass';
  }
  if (c.cur < c.thr) return 'fail';
  return 'pass';
}

function overallHealth() {
  let warn = false;
  for (const c of cards) {
    const s = statusOf(c);
    if (s === 'fail') return 'fail';
    if (s === 'warn') warn = true;
  }
  return warn ? 'warn' : 'pass';
}

const statusColor = { pass: [46, 125, 50], warn: [249, 168, 37], fail: [198, 40, 40] };

function draw() {
  updateCanvasSize();

  // advance Run All Checks animation
  if (runIndex >= 0 && millis() - runTimer > 180) {
    runTimer = millis();
    runIndex++;
    if (runIndex >= cards.length) {
      runIndex = -1;
      logEvent('Ran all checks — ' + cards.filter(c => statusOf(c) !== 'pass').length + ' issue(s) found.');
    }
  }

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  drawHeader();
  drawCards();
  drawBottom();
  drawControlLabel();
}

function drawHeader() {
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(20);
  text('Architecture Fitness Dashboard', margin, 24);
  const h = overallHealth();
  const sc = statusColor[h];
  fill(sc[0], sc[1], sc[2]);
  const label = h === 'pass' ? 'HEALTHY' : (h === 'warn' ? 'WARNING' : 'FAILING');
  textAlign(RIGHT, CENTER); textSize(13);
  const pillW = textWidth(label) + 26;
  rect(canvasWidth - margin - pillW, 12, pillW, 24, 12);
  fill('white'); textAlign(CENTER, CENTER);
  text(label, canvasWidth - margin - pillW / 2, 24);
}

function cardRects() {
  const top = 46;
  const bottomAreaH = 132;
  const cols = 2, rows = 4;
  const gx = 10, gy = 8;
  const gridH = drawHeight - top - bottomAreaH;
  const cw = (canvasWidth - margin * 2 - gx) / cols;
  const ch = (gridH - gy * (rows - 1)) / rows;
  const rects = [];
  for (let i = 0; i < cards.length; i++) {
    const col = i % cols, row = Math.floor(i / cols);
    rects.push({ x: margin + col * (cw + gx), y: top + row * (ch + gy), w: cw, h: ch });
  }
  return { rects, top, bottomAreaH };
}

function drawCards() {
  const { rects } = cardRects();
  textAlign(LEFT, TOP);
  for (let i = 0; i < cards.length; i++) {
    const c = cards[i];
    const r = rects[i];
    const s = statusOf(c);
    const sc = statusColor[s];
    const cc = catColor[c.cat];

    const highlight = (i === runIndex) || (i === selectedCard);
    stroke(highlight ? color(30, 60, 160) : color(210));
    strokeWeight(highlight ? 3 : 1);
    fill(s === 'pass' ? color(245, 250, 245) : (s === 'warn' ? color(255, 250, 235) : color(255, 238, 238)));
    rect(r.x, r.y, r.w, r.h, 8);

    // category tab
    noStroke(); fill(cc[0], cc[1], cc[2]);
    rect(r.x, r.y, 6, r.h, 8, 0, 0, 8);

    noStroke(); fill(30); textSize(13);
    text(c.name, r.x + 14, r.y + 8, r.w - 20);
    fill(cc[0], cc[1], cc[2]); textSize(11);
    text(c.cat, r.x + 14, r.y + 26);

    // value vs threshold
    fill(60); textSize(12); textAlign(LEFT, TOP);
    text('Current: ' + fmt(c.cur) + c.unit, r.x + 14, r.y + 44);
    text('Threshold: ' + fmt(c.thr) + c.unit, r.x + 14, r.y + 60);

    // status pill
    fill(sc[0], sc[1], sc[2]);
    const lbl = s.toUpperCase();
    textSize(11); textAlign(CENTER, CENTER);
    const pw = textWidth(lbl) + 16;
    rect(r.x + r.w - pw - 8, r.y + 8, pw, 18, 9);
    fill('white'); text(lbl, r.x + r.w - pw / 2 - 8, r.y + 17);
    textAlign(LEFT, TOP);
  }
}

function drawBottom() {
  const { top, bottomAreaH } = cardRects();
  const y = drawHeight - bottomAreaH + 4;
  const h = bottomAreaH - 12;
  const logW = (canvasWidth - margin * 2) * 0.56;

  // event log
  fill('white'); stroke(200); strokeWeight(1);
  rect(margin, y, logW, h, 8);
  noStroke(); fill(30, 60, 120); textAlign(LEFT, TOP); textSize(13);
  text('Event Log', margin + 10, y + 6);
  fill(70); textSize(11);
  const shown = eventLog.slice(0, 5);
  for (let i = 0; i < shown.length; i++) {
    text(shown[i], margin + 10, y + 26 + i * 16, logW - 20);
  }

  // detail panel
  const dx = margin + logW + 10;
  const dw = canvasWidth - margin - dx;
  fill('white'); stroke(200); strokeWeight(1);
  rect(dx, y, dw, h, 8);
  noStroke(); fill(30, 60, 120); textSize(13);
  text('Violation Detail', dx + 10, y + 6);
  fill(70); textSize(11.5);
  if (selectedCard >= 0) {
    const c = cards[selectedCard];
    text(c.name + ' (' + c.cat + ')\n' + c.detail, dx + 10, y + 26, dw - 20, h - 30);
  } else {
    text('Click any card to read what that fitness function measures and why it matters.',
      dx + 10, y + 26, dw - 20, h - 30);
  }
}

function drawControlLabel() {
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(12);
  text('Introduce a violation, then map it to its category.', 415, drawHeight + 25);
}

function introduceViolation() {
  const v = violationSelect.value();
  const map = {
    'Add circular dependency': 0,
    'Add layer violation': 1,
    'Degrade API latency': 2,
    'Add CVE': 4
  };
  if (v in map) {
    const i = map[v];
    cards[i].cur = cards[i].fail;
    selectedCard = i;
    logEvent('ALERT: ' + cards[i].name + ' = ' + fmt(cards[i].cur) + cards[i].unit +
      ' exceeds threshold ' + fmt(cards[i].thr) + cards[i].unit + ' [' + cards[i].cat + ']');
  }
  violationSelect.selected('Introduce Violation…');
}

function fixViolations() {
  resetCards();
  logEvent('Violations remediated — all fitness functions passing again.');
}

function logEvent(msg) {
  const t = nf(hour(), 2) + ':' + nf(minute(), 2) + ':' + nf(second(), 2);
  eventLog.unshift(t + '  ' + msg);
  if (eventLog.length > 30) eventLog.pop();
}

function fmt(v) { return Number.isInteger(v) ? v : nf(v, 0, 1); }

function mousePressed() {
  if (mouseY > drawHeight) return;
  const { rects } = cardRects();
  for (let i = 0; i < cards.length; i++) {
    const r = rects[i];
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
      selectedCard = i;
      return;
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
