// Scenario Catalog to Fitness Function Pipeline
// CANVAS_HEIGHT: 550
// Bloom L4 (Analyze): students TRACE a quality attribute scenario through the five-stage
// pipeline from catalog entry to continuous monitoring, examining the artifact produced at
// each transformation. "Run Pipeline" advances the trace one discrete stage at a time
// (step-through, not continuous motion) so each transformation can be examined.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;

const stages = [
  { short: 'Catalog', name: 'Scenario Catalog Entry', color: [33, 150, 243],
    input: 'Stakeholder scenario as described in the workshop',
    transform: 'Formalize into the six-component scenario structure',
    output: 'Well-formed scenario with a quantitative response measure' },
  { short: 'Risk', name: 'Risk Assessment', color: [245, 184, 0],
    input: 'Formalized scenario',
    transform: 'Evaluate the current architecture against the response measure; identify the gap',
    output: 'Risk status: Meets / At Risk / Missing Capability' },
  { short: 'Fitness Spec', name: 'Fitness Function Specification', color: [255, 138, 0],
    input: 'An At-Risk or Missing-Capability scenario',
    transform: 'Define an executable test: tool, trigger, assertion, threshold',
    output: 'Fitness function specification document' },
  { short: 'Implement', name: 'Implementation', color: [76, 175, 80],
    input: 'Fitness function specification',
    transform: 'Implement as an automated test, load test, chaos test, or metric threshold',
    output: 'Executable test wired into the CI/CD pipeline' },
  { short: 'Monitor', name: 'Continuous Monitoring', color: [0, 150, 136],
    input: 'Deployed fitness function',
    transform: 'Execute on each build / deploy / scheduled interval',
    output: 'Pass/Fail result with evidence; a fail blocks deploy or raises an alert' }
];

const examples = [
  { key: 'Performance', title: 'P99 API latency < 200ms at 500 concurrent users',
    artifacts: [
      'Six-component scenario: 500 concurrent users submit API requests during peak load; the API gateway returns responses with P99 latency under 200ms.',
      'Current P99 = 340ms at 500 users — 70% over target.  Status: AT RISK.',
      'k6 load test · 500 virtual users · 10-minute duration · assert P99 < 200ms.',
      'k6 script committed to the repo; CI stage "perf-gate" runs it and fails the build if P99 ≥ 200ms.',
      'CI/CD dashboard, last 5 runs: 210ms, 198ms, 205ms, 192ms, 188ms — passing after a caching fix.' ] },
  { key: 'Availability', title: 'Payment service fails over in < 30s with zero data loss',
    artifacts: [
      'Six-component scenario: a monitor detects the primary payment node failing under normal load; the cluster fails over to a replica within 30s with zero committed data loss.',
      'Current failover measured at 95s with possible in-flight loss.  Status: AT RISK.',
      'Chaos test · kill the primary pod · assert failover < 30s AND committed-transaction loss = 0.',
      'Litmus chaos experiment in CI; gate "resilience-check" fails the deploy if failover > 30s.',
      'Dashboard, last 5 game-days: 41s, 33s, 28s, 26s, 24s — trending toward the 30s target.' ] },
  { key: 'Security', title: 'Credential-stuffing attack detected and blocked in < 60s',
    artifacts: [
      'Six-component scenario: an attacker runs credential stuffing against the public login; the auth service detects the pattern and blocks the source within 60s, logging the source IP.',
      'No automated detection today; the team relies on manual log review.  Status: MISSING CAPABILITY.',
      'Security test · replay 10k failed logins from one IP · assert block + alert within 60s.',
      'Automated abuse-detection test in CI plus a WAF rate-limit rule; gate "sec-check" is enforced.',
      'Dashboard, last 5 runs: blocked in 22s, 19s, 25s, 18s, 20s — 0 false positives on the baseline.' ] }
];

let currentEx = 0;
let activeStage = 0;
let running = false;
let stepTimer = 0;
let runBtn, resetBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  runBtn = createButton('Run Pipeline ▶');
  runBtn.mousePressed(() => { activeStage = 0; running = true; stepTimer = 0; });
  resetBtn = createButton('Reset');
  resetBtn.mousePressed(() => { activeStage = 0; running = false; });
  positionButtons();

  describe('A five-stage horizontal pipeline tracing a quality attribute scenario from a ' +
    'catalog entry through risk assessment, fitness-function specification, implementation, ' +
    'and continuous monitoring. Each stage can be clicked to inspect the concrete artifact it ' +
    'produces for the selected example scenario.', LABEL);
}

function positionButtons() {
  const y = drawHeight + 12;
  runBtn.position(10, y);
  resetBtn.position(132, y);
}

function tabRects() {
  const n = examples.length;
  const tw = Math.min(170, (canvasWidth - margin * 2) / n);
  const out = [];
  for (let i = 0; i < n; i++) out.push({ x: margin + i * (tw + 6), y: 52, w: tw, h: 28 });
  return out;
}

function stageRects() {
  const n = stages.length;
  const gap = 10;
  const totalW = canvasWidth - margin * 2;
  const w = (totalW - gap * (n - 1)) / n;
  const y = 92, h = 84;
  const out = [];
  for (let i = 0; i < n; i++) out.push({ x: margin + i * (w + gap), y, w, h });
  return out;
}

function draw() {
  updateCanvasSize();

  // step the trace forward one discrete stage at a time
  if (running) {
    stepTimer++;
    if (stepTimer > 36) {
      stepTimer = 0;
      if (activeStage < stages.length - 1) activeStage++;
      else running = false;
    }
  }

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(LEFT, TOP); textSize(18);
  text('Scenario → Fitness Function Pipeline', margin, 10);
  fill(90); textSize(11);
  text('Trace one scenario from catalog entry to a CI/CD gate. Click a stage or Run the pipeline.', margin, 34);

  drawScenarioTabs();
  drawStages();
  drawDetail();
  drawControlHint();
}

function drawScenarioTabs() {
  const tabs = tabRects();
  textAlign(CENTER, CENTER); textSize(11.5);
  for (let i = 0; i < tabs.length; i++) {
    const t = tabs[i];
    const active = i === currentEx;
    noStroke();
    fill(active ? color(55, 71, 79) : color(238));
    rect(t.x, t.y, t.w, t.h, 6);
    fill(active ? 255 : 70);
    text(examples[i].key, t.x + t.w / 2, t.y + t.h / 2);
  }
}

function drawStages() {
  const rects = stageRects();
  for (let i = 0; i < stages.length; i++) {
    const r = rects[i];
    const s = stages[i];
    const done = i < activeStage;
    const active = i === activeStage;
    // connector arrow into this stage
    if (i > 0) {
      const px = rects[i - 1].x + rects[i - 1].w, midY = r.y + r.h / 2;
      stroke(active || done ? color(120) : color(200)); strokeWeight(2);
      line(px + 1, midY, r.x - 1, midY);
      noStroke(); fill(active || done ? color(120) : color(200));
      triangle(r.x - 1, midY - 4, r.x - 1, midY + 4, r.x + 4, midY);
    }
    // box
    stroke(active ? color(s.color[0], s.color[1], s.color[2]) : color(215));
    strokeWeight(active ? 3 : 1);
    fill(active ? 255 : (done ? color(248) : color(252)));
    rect(r.x, r.y, r.w, r.h, 7);
    // colored header
    noStroke(); fill(s.color[0], s.color[1], s.color[2]);
    rect(r.x, r.y, r.w, 22, 7, 7, 0, 0);
    fill(255); textAlign(LEFT, CENTER); textSize(10.5); textStyle(BOLD);
    text((i + 1) + '. ' + s.short, r.x + 6, r.y + 11);
    // status glyph in the header (right) — no overlap with the body text
    textAlign(RIGHT, CENTER);
    if (done) text('✓', r.x + r.w - 6, r.y + 11);
    else if (active) text('▶', r.x + r.w - 6, r.y + 11);
    textStyle(NORMAL);
    // body: short output
    fill(70); textAlign(LEFT, TOP); textSize(9.5);
    text(s.output, r.x + 6, r.y + 27, r.w - 12, r.h - 30);
  }
}

function drawDetail() {
  const s = stages[activeStage];
  const ex = examples[currentEx];
  const x = margin, w = canvasWidth - margin * 2;
  const y0 = 192;
  // header
  noStroke(); fill(s.color[0], s.color[1], s.color[2]);
  textAlign(LEFT, TOP); textSize(15); textStyle(BOLD);
  text('Stage ' + (activeStage + 1) + ': ' + s.name, x, y0); textStyle(NORMAL);

  let y = y0 + 26;
  y = labeledRow('Input', s.input, x, y, w);
  y = labeledRow('Transform', s.transform, x, y, w);
  y = labeledRow('Output', s.output, x, y, w);

  // artifact card for the selected scenario
  y += 6;
  const ah = drawHeight - y - 12;
  fill(248, 252, 255); stroke(s.color[0], s.color[1], s.color[2]); strokeWeight(1.5);
  rect(x, y, w, ah, 8); noStroke();
  fill(s.color[0], s.color[1], s.color[2]); textSize(12); textStyle(BOLD); textAlign(LEFT, TOP);
  text('Artifact — ' + ex.key + ': ' + ex.title, x + 10, y + 8, w - 20); textStyle(NORMAL);
  fill(45); textSize(12.5);
  text(ex.artifacts[activeStage], x + 10, y + 42, w - 20, ah - 50);
}

function labeledRow(label, value, x, y, w) {
  noStroke(); fill(184, 134, 11); textAlign(LEFT, TOP); textSize(11.5); textStyle(BOLD);
  text(label, x, y); textStyle(NORMAL);
  fill(60); textSize(12);
  const vx = x + 78;
  text(value, vx, y, w - 78);
  const lines = Math.ceil(textWidth(value) / (w - 78));
  return y + Math.max(18, lines * 15 + 4);
}

function drawControlHint() {
  if (canvasWidth < 540) return;
  noStroke(); fill(90); textAlign(LEFT, CENTER); textSize(11);
  text('Switch the example scenario with the tabs; click any stage to inspect its artifact.',
    210, drawHeight + controlHeight / 2, canvasWidth - 220);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  // scenario tab hit-test
  const tabs = tabRects();
  for (let i = 0; i < tabs.length; i++) {
    const t = tabs[i];
    if (mouseX >= t.x && mouseX <= t.x + t.w && mouseY >= t.y && mouseY <= t.y + t.h) {
      currentEx = i; return;
    }
  }
  // stage box hit-test
  const rects = stageRects();
  for (let i = 0; i < rects.length; i++) {
    const r = rects[i];
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
      activeStage = i; running = false; return;
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
