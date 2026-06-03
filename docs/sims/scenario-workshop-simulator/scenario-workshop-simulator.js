// Scenario Brainstorming and Prioritization Workshop Simulator
// CANVAS_HEIGHT: 610
// Bloom L3 (Apply): students simulate an ATAM Phase-2 scenario workshop — select a
// stakeholder, cast dot votes across a catalog of 12 scenarios, and watch the priority
// ordering emerge. A coverage view reveals which quality attributes are under-represented.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 560;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;

// QA palette (shared across Chapter 5/6 sims)
const QA_COLORS = {
  Performance:   [33, 150, 243],
  Availability:  [76, 175, 80],
  Security:      [229, 57, 53],
  Modifiability: [156, 39, 176],
  Scalability:   [255, 152, 0]
};

const scenarios = [
  { n: 1,  qa: 'Performance',   desc: 'API responds < 200ms at 500 concurrent users' },
  { n: 2,  qa: 'Availability',  desc: 'Payment service failover under 30 seconds' },
  { n: 3,  qa: 'Security',      desc: 'Credential-stuffing attack detected & blocked' },
  { n: 4,  qa: 'Modifiability', desc: 'New payment method in under 5 dev-days' },
  { n: 5,  qa: 'Scalability',   desc: 'Handle 10x normal load on Black Friday' },
  { n: 6,  qa: 'Availability',  desc: 'DB failover with zero committed data loss' },
  { n: 7,  qa: 'Security',      desc: 'GDPR right-to-erasure within 72 hours' },
  { n: 8,  qa: 'Performance',   desc: 'Batch report generation within 2-hour SLA' },
  { n: 9,  qa: 'Modifiability', desc: 'New product category, no rec-service change' },
  { n: 10, qa: 'Scalability',   desc: 'Auto-scale without operator intervention' },
  { n: 11, qa: 'Security',      desc: 'Admin compromise detected within 60 seconds' },
  { n: 12, qa: 'Availability',  desc: 'Graceful degradation when search is down' }
];

const stakeholders = [
  { name: 'Business Owner',   accent: [0, 150, 136],  votes: 5, defaults: { 1: 2, 5: 2, 4: 1 } },
  { name: 'Security Officer', accent: [63, 81, 181],  votes: 5, defaults: { 3: 3, 11: 2 } },
  { name: 'Operations Lead',  accent: [121, 85, 72],  votes: 5, defaults: { 2: 2, 6: 2, 10: 1 } },
  { name: 'Product Manager',  accent: [233, 30, 99],  votes: 5, defaults: { 9: 3, 4: 2 } }
];

let votes = new Array(13).fill(0);   // votes[scenario.n]
let selected = 0;
let showCoverage = false;
let loadBtn, resetBtn, coverBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  loadBtn = createButton('Load Default Votes');
  loadBtn.mousePressed(loadDefaults);
  resetBtn = createButton('Reset');
  resetBtn.mousePressed(resetVotes);
  coverBtn = createButton('Show Coverage');
  coverBtn.mousePressed(() => {
    showCoverage = !showCoverage;
    coverBtn.html(showCoverage ? 'Show Priority' : 'Show Coverage');
  });
  positionButtons();

  describe('A scenario workshop simulator: four stakeholder chips, a 3x4 grid of scenario ' +
    'sticky notes colored by quality attribute, and a live priority bar chart that reorders ' +
    'as dot votes are cast. A coverage view shows which quality attributes are under-represented.',
    LABEL);
}

function positionButtons() {
  const y = drawHeight + 12;
  loadBtn.position(10, y);
  resetBtn.position(150, y);
  coverBtn.position(212, y);
}

function loadDefaults() {
  resetVotes();
  for (const s of stakeholders) {
    for (const k in s.defaults) {
      votes[+k] += s.defaults[k];
      s.votes -= s.defaults[k];
    }
  }
}

function resetVotes() {
  votes = new Array(13).fill(0);
  for (const s of stakeholders) s.votes = 5;
}

function leftW() { return Math.max(300, canvasWidth * 0.56); }
function gridTop() { return 90; }

function maxVotes() {
  let m = 0;
  for (let i = 1; i <= 12; i++) m = Math.max(m, votes[i]);
  return m;
}

function draw() {
  updateCanvasSize();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(LEFT, TOP); textSize(18);
  text('Scenario Brainstorming & Prioritization Workshop', margin, 10);
  fill(90); textSize(11);
  text('Pick a stakeholder, then click scenarios to cast their dot votes.', margin, 34);

  drawStakeholderChips();
  drawScenarioGrid();
  if (showCoverage) drawCoveragePanel(); else drawPriorityChart();
  drawControlHint();
}

function drawStakeholderChips() {
  const n = stakeholders.length;
  const cw = (canvasWidth - margin * 2) / n;
  const cy = 52, ch = 30;
  textAlign(CENTER, CENTER); textSize(11);
  for (let i = 0; i < n; i++) {
    const x = margin + i * cw;
    const s = stakeholders[i];
    const active = i === selected;
    noStroke();
    fill(active ? color(s.accent[0], s.accent[1], s.accent[2]) : color(238));
    rect(x + 2, cy, cw - 4, ch, 6);
    fill(active ? 255 : 70);
    text(s.name + '  (' + s.votes + ')', x + cw / 2, cy + ch / 2);
  }
}

function noteRect(i) {
  const cols = 3, rows = 4;
  const lw = leftW();
  const gw = lw - margin * 2;
  const gTop = gridTop(), gBottom = drawHeight - 12;
  const cw = gw / cols, ch = (gBottom - gTop) / rows;
  const col = i % cols, row = Math.floor(i / cols);
  return { x: margin + col * cw + 3, y: gTop + row * ch + 3, w: cw - 6, h: ch - 6 };
}

function drawScenarioGrid() {
  const mv = maxVotes();
  textAlign(LEFT, TOP);
  for (let i = 0; i < 12; i++) {
    const sc = scenarios[i];
    const r = noteRect(i);
    const c = QA_COLORS[sc.qa];
    // note body
    stroke(220); strokeWeight(1); fill(255, 255, 250);
    rect(r.x, r.y, r.w, r.h, 6);
    // QA color strip
    noStroke(); fill(c[0], c[1], c[2]);
    rect(r.x, r.y, r.w, 16, 6, 6, 0, 0);
    fill(255); textSize(9.5); textStyle(BOLD);
    text(sc.qa, r.x + 6, r.y + 3); textStyle(NORMAL);
    // description
    fill(50); textSize(10.5);
    text('#' + sc.n + '  ' + sc.desc, r.x + 6, r.y + 22, r.w - 12, r.h - 44);
    // vote badge
    const v = votes[sc.n];
    const isTop = v > 0 && v === mv;
    fill(isTop ? color(255, 193, 7) : color(120));
    circle(r.x + r.w - 16, r.y + r.h - 15, 22);
    fill(isTop ? 40 : 255); textAlign(CENTER, CENTER); textSize(11); textStyle(BOLD);
    text(v, r.x + r.w - 16, r.y + r.h - 15); textStyle(NORMAL);
    textAlign(LEFT, TOP);
  }
}

function drawPriorityChart() {
  const x = leftW() + 10;
  const w = canvasWidth - x - margin;
  if (w < 130) return;
  const top = gridTop();
  noStroke(); fill(30, 60, 120); textAlign(LEFT, TOP); textSize(13);
  text('Priority (dot votes)', x, top);

  const order = scenarios.map(s => s.n).sort((a, b) => votes[b] - votes[a]);
  const mv = Math.max(1, maxVotes());
  const rowH = (drawHeight - 12 - (top + 24)) / 12;
  const barMax = w - 64;
  for (let i = 0; i < 12; i++) {
    const nnum = order[i];
    const sc = scenarios[nnum - 1];
    const c = QA_COLORS[sc.qa];
    const yy = top + 24 + i * rowH;
    noStroke(); fill(70); textAlign(LEFT, CENTER); textSize(10);
    text('#' + nnum, x, yy + rowH / 2);
    const bw = barMax * (votes[nnum] / mv);
    fill(c[0], c[1], c[2]); rect(x + 26, yy + 2, Math.max(2, bw), rowH - 4, 3);
    fill(40); textAlign(LEFT, CENTER); textSize(10);
    text(votes[nnum], x + 26 + Math.max(2, bw) + 5, yy + rowH / 2);
  }
}

function drawCoveragePanel() {
  const x = leftW() + 10;
  const w = canvasWidth - x - margin;
  if (w < 130) return;
  const top = gridTop();
  noStroke(); fill(30, 60, 120); textAlign(LEFT, TOP); textSize(13);
  text('Quality Attribute Coverage', x, top);

  const qas = Object.keys(QA_COLORS);
  const counts = {}; const voteSum = {};
  for (const q of qas) { counts[q] = 0; voteSum[q] = 0; }
  for (const s of scenarios) { counts[s.qa]++; voteSum[s.qa] += votes[s.n]; }
  let minCount = Math.min(...qas.map(q => counts[q]));

  const rowH = 40, startY = top + 26;
  for (let i = 0; i < qas.length; i++) {
    const q = qas[i];
    const c = QA_COLORS[q];
    const yy = startY + i * rowH;
    noStroke(); fill(c[0], c[1], c[2]); rect(x, yy, 12, 28, 3);
    fill(40); textAlign(LEFT, TOP); textSize(12); textStyle(BOLD);
    text(q, x + 20, yy);
    textStyle(NORMAL); fill(90); textSize(11);
    text(counts[q] + ' scenario' + (counts[q] === 1 ? '' : 's') + ' · ' + voteSum[q] + ' votes',
      x + 20, yy + 16);
    if (counts[q] === 0) {
      fill(198, 40, 40); textSize(11); textAlign(RIGHT, TOP); textStyle(BOLD);
      text('⚠ GAP', x + w, yy + 4); textStyle(NORMAL);
    } else if (counts[q] === minCount) {
      fill(200, 140, 0); textSize(10); textAlign(RIGHT, TOP);
      text('under-represented', x + w, yy + 6);
    }
  }
  // note
  const ny = startY + qas.length * rowH + 4;
  fill(70); textAlign(LEFT, TOP); textSize(10.5);
  text('Coverage asks whether every quality attribute the business cares about has at ' +
    'least one well-formed scenario — and flags the thinly-covered ones.', x, ny, w);
}

function drawControlHint() {
  if (canvasWidth < 540) return;
  noStroke(); fill(90); textAlign(LEFT, CENTER); textSize(11);
  text('Each stakeholder has 5 dot votes. Click a scenario to spend one.',
    330, drawHeight + controlHeight / 2, canvasWidth - 340);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  // stakeholder chip hit-test
  const n = stakeholders.length;
  const cw = (canvasWidth - margin * 2) / n;
  const cy = 52, ch = 30;
  if (mouseY >= cy && mouseY <= cy + ch) {
    for (let i = 0; i < n; i++) {
      const x = margin + i * cw;
      if (mouseX >= x + 2 && mouseX <= x + cw - 2) { selected = i; return; }
    }
  }
  // scenario note hit-test → cast a vote
  for (let i = 0; i < 12; i++) {
    const r = noteRect(i);
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
      const s = stakeholders[selected];
      if (s.votes > 0) { votes[scenarios[i].n]++; s.votes--; }
      return;
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
