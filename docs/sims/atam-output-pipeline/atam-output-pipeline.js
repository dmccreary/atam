// ATAM Output Pipeline
// CANVAS_HEIGHT: 548
// Bloom L2 (Understand): students EXPLAIN how an ATAM evaluation finding becomes
// organizational action — traced through six stages from the evaluation session to ongoing
// monitoring. "Run Example" advances one discrete stage at a time (step-through, not
// continuous motion) so each transformation and its owner can be examined.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 46;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;

// category colors: blue=evaluation, teal=documentation, green=action, orange=monitoring
const stages = [
  { short: 'Eval Session', name: 'ATAM Evaluation Session', color: [33, 118, 210],
    owner: 'Evaluation team + note-taker',
    output: 'Raw finding (sensitivity point / tradeoff / risk / non-risk)',
    artifact: 'Ordering service calls the inventory service synchronously; no circuit breaker is present.' },
  { short: 'Classify', name: 'Risk Classification', color: [33, 118, 210],
    owner: 'Evaluation leader',
    output: 'Classified risk with severity, probability, and scenario reference',
    artifact: 'Classified as an Availability risk — Severity H, Probability M — against the failover scenario.' },
  { short: 'Aggregate', name: 'Risk Theme Aggregation', color: [0, 150, 136],
    owner: 'Evaluation leader + senior architect',
    output: 'Risk themes with constituent risks and business impact',
    artifact: 'Grouped under the theme "No Systematic Resilience Strategy" alongside related dependency risks.' },
  { short: 'Report', name: 'Architecture Evaluation Report', color: [0, 150, 136],
    owner: 'Evaluation team',
    output: 'Full report: executive summary, risk catalog, themes, recommendations',
    artifact: 'Documented in Section 4.2 as Risk AV-003 with a recommendation to add a circuit breaker.' },
  { short: 'Improve Plan', name: 'Architecture Improvement Plan', color: [76, 175, 80],
    owner: 'Architecture Review Board + project leads',
    output: 'Prioritized work items with owners and target dates',
    artifact: 'Work item: implement a circuit breaker on inventory calls — Sprint 14 — Owner: Backend team lead.' },
  { short: 'Monitor', name: 'Ongoing Monitoring', color: [239, 124, 0],
    owner: 'DevOps / SRE + governance',
    output: 'Fitness functions, observability alerts, periodic re-evaluation schedule',
    artifact: 'Fitness function: circuit-breaker trip rate < 1% per 1000 requests; alert if > 5% within 60s.' }
];

let activeStage = 0;
let running = false;
let stepTimer = 0;
let runBtn, resetBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  runBtn = createButton('Run Example ▶');
  runBtn.mousePressed(() => { activeStage = 0; running = true; stepTimer = 0; });
  resetBtn = createButton('Reset');
  resetBtn.mousePressed(() => { activeStage = 0; running = false; });
  positionButtons();
  describe('A six-stage pipeline showing how an ATAM finding flows from the evaluation session ' +
    'through classification, theme aggregation, the evaluation report, the improvement plan, and ' +
    'ongoing monitoring. Each stage names its output artifact and the role responsible.', LABEL);
}

function positionButtons() {
  const y = drawHeight + 11;
  runBtn.position(10, y);
  resetBtn.position(126, y);
}

function stageRects() {
  const n = stages.length, gap = 8;
  const totalW = canvasWidth - margin * 2;
  const w = (totalW - gap * (n - 1)) / n;
  const y = 86, h = 88;
  const out = [];
  for (let i = 0; i < n; i++) out.push({ x: margin + i * (w + gap), y, w, h });
  return out;
}

function draw() {
  updateCanvasSize();
  if (running) { stepTimer++; if (stepTimer > 38) { stepTimer = 0; if (activeStage < stages.length - 1) activeStage++; else running = false; } }

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(LEFT, TOP); textSize(18);
  text('ATAM Output Pipeline', margin, 10);
  fill(90); textSize(11);
  text('How one evaluation finding becomes organizational action. Click a stage or Run the example.', margin, 34);

  drawStages();
  drawDetail();
  drawControlHint();
}

function drawStages() {
  const rects = stageRects();
  for (let i = 0; i < stages.length; i++) {
    const r = rects[i], s = stages[i];
    const done = i < activeStage, active = i === activeStage;
    if (i > 0) {
      const px = rects[i - 1].x + rects[i - 1].w, midY = r.y + r.h / 2;
      stroke(active || done ? color(120) : color(205)); strokeWeight(2);
      line(px + 1, midY, r.x - 1, midY);
      noStroke(); fill(active || done ? color(120) : color(205));
      triangle(r.x - 1, midY - 4, r.x - 1, midY + 4, r.x + 4, midY);
    }
    stroke(active ? color(s.color[0], s.color[1], s.color[2]) : color(215)); strokeWeight(active ? 3 : 1);
    fill(active ? 255 : (done ? color(248) : color(252)));
    rect(r.x, r.y, r.w, r.h, 7);
    noStroke(); fill(s.color[0], s.color[1], s.color[2]); rect(r.x, r.y, r.w, 22, 7, 7, 0, 0);
    fill(255); textAlign(LEFT, CENTER); textSize(9.5); textStyle(BOLD);
    text((i + 1) + '. ' + s.short, r.x + 5, r.y + 11);
    textAlign(RIGHT, CENTER);
    if (done) text('✓', r.x + r.w - 5, r.y + 11); else if (active) text('▶', r.x + r.w - 5, r.y + 11);
    textStyle(NORMAL);
    fill(70); textAlign(LEFT, TOP); textSize(8.5);
    text(s.output, r.x + 5, r.y + 26, r.w - 10, r.h - 44);
    fill(120); textSize(7.8); textStyle(ITALIC);
    text(s.owner, r.x + 5, r.y + r.h - 22, r.w - 10, 20); textStyle(NORMAL);
  }
}

function drawDetail() {
  const s = stages[activeStage];
  const x = margin, w = canvasWidth - margin * 2, y0 = 192;
  noStroke(); fill(s.color[0], s.color[1], s.color[2]); textAlign(LEFT, TOP); textSize(15); textStyle(BOLD);
  text('Stage ' + (activeStage + 1) + ': ' + s.name, x, y0); textStyle(NORMAL);
  let y = y0 + 26;
  y = labeledRow('Owner', s.owner, x, y, w);
  y = labeledRow('Output', s.output, x, y, w);
  y += 6;
  const ah = drawHeight - y - 12;
  fill(248, 252, 255); stroke(s.color[0], s.color[1], s.color[2]); strokeWeight(1.5); rect(x, y, w, ah, 8); noStroke();
  fill(s.color[0], s.color[1], s.color[2]); textSize(12); textStyle(BOLD); textAlign(LEFT, TOP);
  text('Example artifact at this stage', x + 10, y + 8); textStyle(NORMAL);
  fill(45); textSize(13);
  text(s.artifact, x + 10, y + 30, w - 20, ah - 38);
}

function labeledRow(label, value, x, y, w) {
  noStroke(); fill(184, 134, 11); textAlign(LEFT, TOP); textSize(11.5); textStyle(BOLD);
  text(label, x, y); textStyle(NORMAL);
  fill(60); textSize(12);
  text(value, x + 70, y, w - 70);
  const lines = Math.ceil(textWidth(value) / (w - 70));
  return y + Math.max(20, lines * 15 + 4);
}

function drawControlHint() {
  if (canvasWidth < 560) return;
  noStroke(); fill(90); textAlign(LEFT, CENTER); textSize(11);
  text('Each stage names the artifact it produces and the role responsible for it.', 200, drawHeight + controlHeight / 2, canvasWidth - 210);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const rects = stageRects();
  for (let i = 0; i < rects.length; i++) {
    const r = rects[i];
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) { activeStage = i; running = false; return; }
  }
}

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); positionButtons(); redraw(); }
function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width); canvasWidth = containerWidth;
}
