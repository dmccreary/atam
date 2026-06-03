// Stakeholder Priority Conflict Resolution Matrix
// CANVAS_HEIGHT: 560
// Bloom L3 (Apply): students simulate a stakeholder priority workshop by allocating
// each stakeholder's 5 dot-votes across six quality-attribute scenarios and watch
// the aggregate ranking emerge. Select a stakeholder, then use the +/- steppers on
// each scenario card. "Show Conflicts" flags where stakeholders diverge.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 470;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const VOTES_EACH = 5;

const scenarios = [
  { id: 'perf', name: 'Performance', desc: 'API response <200ms for 500 concurrent users' },
  { id: 'avail', name: 'Availability', desc: '99.9% uptime excluding planned maintenance' },
  { id: 'sec', name: 'Security', desc: 'Tamper-evident audit trail for all transactions' },
  { id: 'mod', name: 'Modifiability', desc: 'New payment method in under 2 sprints' },
  { id: 'scale', name: 'Scalability', desc: 'Handles 10× peak load without manual steps' },
  { id: 'comp', name: 'Compliance', desc: 'GDPR right-to-erasure within 72 hours' }
];

const stakeholders = {
  bo: { name: 'Business Owner', color: [33, 150, 243] },
  so: { name: 'Security Officer', color: [198, 40, 40] },
  ol: { name: 'Operations Lead', color: [239, 108, 0] },
  pm: { name: 'Product Manager', color: [76, 175, 80] }
};
const stkKeys = ['bo', 'so', 'ol', 'pm'];

let votes = {};
function defaultVotes() {
  votes = {
    bo: { perf: 3, avail: 0, sec: 0, mod: 0, scale: 2, comp: 0 },
    so: { perf: 0, avail: 0, sec: 4, mod: 0, scale: 0, comp: 1 },
    ol: { perf: 0, avail: 3, sec: 0, mod: 0, scale: 2, comp: 0 },
    pm: { perf: 1, avail: 1, sec: 0, mod: 3, scale: 0, comp: 0 }
  };
}

let active = 'bo';
let showConflicts = false;
let showRankings = false;
let stkButtons = {};
let conflictBtn, rankBtn, resetBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  defaultVotes();

  let bx = 10;
  for (const k of stkKeys) {
    const b = createButton(stakeholders[k].name);
    b.position(bx, drawHeight + 10);
    b.mousePressed(() => { active = k; });
    stkButtons[k] = b;
    bx += stakeholders[k].name.length * 7 + 26;
  }

  conflictBtn = createButton('Show Conflicts');
  conflictBtn.position(10, drawHeight + 50);
  conflictBtn.mousePressed(() => { showConflicts = !showConflicts; conflictBtn.html(showConflicts ? 'Hide Conflicts' : 'Show Conflicts'); });

  rankBtn = createButton('Final Rankings');
  rankBtn.position(140, drawHeight + 50);
  rankBtn.mousePressed(() => { showRankings = !showRankings; rankBtn.html(showRankings ? 'Hide Rankings' : 'Final Rankings'); });

  resetBtn = createButton('Reset Votes');
  resetBtn.position(265, drawHeight + 50);
  resetBtn.mousePressed(() => { defaultVotes(); showRankings = false; });

  describe('A stakeholder priority workshop: four stakeholders each allocate five votes ' +
    'across six quality-attribute scenarios, and a live aggregate bar chart shows the ' +
    'emerging priority ranking.', LABEL);
}

function remaining(k) {
  let used = 0;
  for (const s of scenarios) used += votes[k][s.id];
  return VOTES_EACH - used;
}

function aggregate(id) {
  let t = 0;
  for (const k of stkKeys) t += votes[k][id];
  return t;
}

function conflictSpan(id) {
  let mx = 0, mn = 99;
  for (const k of stkKeys) { mx = Math.max(mx, votes[k][id]); mn = Math.min(mn, votes[k][id]); }
  return mx - mn;
}

function cardRects() {
  const leftW = canvasWidth * 0.56;
  const top = 64;
  const n = scenarios.length;
  const gap = 7;
  const ch = (drawHeight - top - 10 - gap * (n - 1)) / n;
  const rects = [];
  for (let i = 0; i < n; i++) {
    rects.push({ x: margin, y: top + i * (ch + gap), w: leftW - margin - 6, h: ch });
  }
  return { rects, leftW, top };
}

function draw() {
  updateCanvasSize();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  // highlight active stakeholder button
  for (const k of stkKeys) {
    const c = stakeholders[k].color;
    stkButtons[k].style('background-color', active === k ? `rgb(${c[0]},${c[1]},${c[2]})` : '#e0e0e0');
    stkButtons[k].style('color', active === k ? '#ffffff' : '#000000');
  }

  fill('black'); textAlign(LEFT, TOP); textSize(18);
  text('Stakeholder Priority Workshop', margin, 10);

  // active stakeholder + remaining votes
  const ac = stakeholders[active].color;
  noStroke(); fill(ac[0], ac[1], ac[2]); textSize(14); textAlign(LEFT, TOP);
  text('Active: ' + stakeholders[active].name + '   —   votes left: ' + remaining(active) + ' / ' + VOTES_EACH,
    margin, 38);

  drawCards();
  drawAggregate();
  if (showRankings) drawRankings();
  drawControlHint();
}

function drawCards() {
  const { rects } = cardRects();
  for (let i = 0; i < scenarios.length; i++) {
    const s = scenarios[i];
    const r = rects[i];
    const conflict = showConflicts && conflictSpan(s.id) >= 3;
    stroke(conflict ? color(220, 40, 40) : color(200));
    strokeWeight(conflict ? 3 : 1);
    fill(conflict ? color(255, 240, 240) : 'white');
    rect(r.x, r.y, r.w, r.h, 7);

    noStroke(); fill(30); textAlign(LEFT, TOP); textSize(13); textStyle(BOLD);
    text(s.name, r.x + 10, r.y + 6); textStyle(NORMAL);
    fill(90); textSize(10.5);
    text(s.desc, r.x + 10, r.y + 24, r.w - 110, r.h - 26);

    // stepper on the right: [-] n [+]
    const ac = stakeholders[active].color;
    const cy = r.y + r.h / 2;
    const minusX = r.x + r.w - 78, plusX = r.x + r.w - 22;
    drawStepBtn(minusX, cy, '–');
    drawStepBtn(plusX, cy, '+');
    noStroke(); fill(ac[0], ac[1], ac[2]); textAlign(CENTER, CENTER); textSize(18);
    text(votes[active][s.id], (minusX + plusX) / 2 + 5, cy);

    if (conflict) {
      noStroke(); fill(198, 40, 40); textAlign(RIGHT, TOP); textSize(9.5);
      text('conflict', r.x + r.w - 6, r.y + 4);
    }
  }
}

function drawStepBtn(x, y, label) {
  stroke(150); strokeWeight(1); fill(245);
  circle(x, y, 22);
  noStroke(); fill(60); textAlign(CENTER, CENTER); textSize(16);
  text(label, x, y - 1);
}

function drawAggregate() {
  const { leftW } = cardRects();
  const ax = leftW + 6;
  const aw = canvasWidth - ax - margin;
  const top = 64;
  noStroke(); fill(30, 60, 120); textAlign(LEFT, TOP); textSize(13);
  text('Aggregate Priority (all votes)', ax, 44);

  const maxTotal = Math.max(5, ...scenarios.map(s => aggregate(s.id)));
  const n = scenarios.length;
  const gap = 7;
  const bh = (drawHeight - top - 10 - gap * (n - 1)) / n;
  for (let i = 0; i < n; i++) {
    const s = scenarios[i];
    const y = top + i * (bh + gap);
    const total = aggregate(s.id);
    // label
    noStroke(); fill(60); textAlign(LEFT, TOP); textSize(10.5);
    text(s.name, ax, y);
    // bar track
    const barY = y + 16, barH = bh - 22;
    fill(235); rect(ax, barY, aw, barH, 4);
    // stacked by stakeholder
    let xoff = ax;
    for (const k of stkKeys) {
      const v = votes[k][s.id];
      if (v <= 0) continue;
      const segW = (v / maxTotal) * aw;
      const c = stakeholders[k].color;
      fill(c[0], c[1], c[2]); noStroke();
      rect(xoff, barY, segW, barH, 3);
      xoff += segW;
    }
    noStroke(); fill(40); textAlign(LEFT, CENTER); textSize(11);
    text(total, xoff + 4, barY + barH / 2);
  }
}

function drawRankings() {
  const w = canvasWidth * 0.7, h = drawHeight * 0.7;
  const x = (canvasWidth - w) / 2, y = (drawHeight - h) / 2;
  fill(255, 255, 255, 250); stroke(30, 60, 120); strokeWeight(2);
  rect(x, y, w, h, 12); noStroke();
  fill(30, 60, 120); textAlign(CENTER, TOP); textSize(16);
  text('Final Prioritized Rankings', x + w / 2, y + 12);

  const ranked = scenarios.slice().sort((a, b) => aggregate(b.id) - aggregate(a.id));
  textAlign(LEFT, TOP); textSize(12.5);
  for (let i = 0; i < ranked.length; i++) {
    const s = ranked[i];
    const ry = y + 44 + i * ((h - 56) / ranked.length);
    fill(30); textStyle(BOLD);
    text((i + 1) + '. ' + s.name + '  (' + aggregate(s.id) + ' votes)', x + 16, ry); textStyle(NORMAL);
    // breakdown
    let bx = x + 16;
    for (const k of stkKeys) {
      const v = votes[k][s.id];
      if (v > 0) {
        const c = stakeholders[k].color;
        fill(c[0], c[1], c[2]); textSize(10.5);
        text(stakeholders[k].name.split(' ')[0] + ' ' + v, bx, ry + 16); bx += 84;
      }
    }
    textSize(12.5);
  }
}

function drawControlHint() {
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(12);
  text('Use + / – on each scenario card to allocate the active stakeholder’s 5 votes.',
    375, drawHeight + 64, canvasWidth - 385);
}

function mousePressed() {
  if (mouseY > drawHeight || showRankings) return;
  const { rects } = cardRects();
  for (let i = 0; i < scenarios.length; i++) {
    const r = rects[i], s = scenarios[i], cy = r.y + r.h / 2;
    const minusX = r.x + r.w - 78, plusX = r.x + r.w - 22;
    if (dist(mouseX, mouseY, minusX, cy) < 12) {
      if (votes[active][s.id] > 0) votes[active][s.id]--;
      return;
    }
    if (dist(mouseX, mouseY, plusX, cy) < 12) {
      if (remaining(active) > 0) votes[active][s.id]++;
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
