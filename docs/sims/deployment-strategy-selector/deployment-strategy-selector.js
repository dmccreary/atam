// Deployment Strategy Decision Matrix
// CANVAS_HEIGHT: 595
// Bloom L5 (Evaluate): students ASSESS four deployment strategies against quality attribute
// needs they state first with sliders (so they commit before seeing a recommendation), read
// the gap between each strategy and their needs, and justify the best fit and the tradeoffs
// it accepts. "Simulate Deployment" steps once through the release sequence; it is a finite,
// user-started walk-through, and every phase can also be clicked.
//
// Strategy scores are qualitative 1-5 teaching ratings from the chapter specification.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const V1 = [96, 125, 139];         // color of the old version everywhere

// Dimensions, in slider order. A strategy's score is how well it delivers the dimension
// (for cost: 5 = cheapest to run). The student's need is 1-5 on the same scale.
const DIMS = [
  { key: 'zd', card: 'Zero downtime', wide: 'Zero-downtime need', narrow: 'Zero-downtime', unmet: 'zero downtime' },
  { key: 'rb', card: 'Rollback speed', wide: 'Rollback speed', narrow: 'Rollback', unmet: 'rollback speed' },
  { key: 'cost', card: 'Low cost', wide: 'Cost sensitivity', narrow: 'Cost sens.', unmet: 'low cost' },
  { key: 'val', card: 'Live validation', wide: 'Canary validation', narrow: 'Validation', unmet: 'validation with live traffic' }
];

// Instance states in a phase: '1' = v1 serving, '2' = v2 serving, 'i1'/'i2' = running but
// taking no traffic, 'x' = stopped, 's' = starting, '-' = not provisioned.
const STRATEGIES = [
  { id: 'bluegreen', name: 'Blue-Green', color: [25, 118, 210], complexity: 3,
    scores: [5, 5, 1, 2],
    v1Color: [25, 118, 210], v2Color: [46, 125, 50], rowLabels: ['blue', 'green'],
    legend: 'Top row is the blue environment (v1), bottom row the green environment (v2). Outlined squares are running but take no traffic.',
    tradeoff: 'A second full production environment for the length of the release, and every user switches at once, so there is no gradual validation with live traffic.',
    rollback: 'Point the load balancer back at blue. It takes seconds because blue is still running.',
    phases: [
      { rows: [['1', '1', '1', '1'], ['-', '-', '-', '-']], v2: 0, text: 'Blue (v1) serves all traffic. The green environment does not exist yet.' },
      { rows: [['1', '1', '1', '1'], ['i2', 'i2', 'i2', 'i2']], v2: 0, text: 'v2 is deployed to green and tested there. Users are still on blue, and capacity is doubled.' },
      { rows: [['i1', 'i1', 'i1', 'i1'], ['2', '2', '2', '2']], v2: 100, text: 'The load balancer switches: all traffic now goes to green (v2). Blue stays up as the rollback target.' },
      { rows: [['-', '-', '-', '-'], ['2', '2', '2', '2']], v2: 100, text: 'Once v2 is trusted, blue is decommissioned (or kept as the next release\'s idle environment).' }] },
  { id: 'canary', name: 'Canary', color: [46, 125, 50], complexity: 4,
    scores: [4, 4, 3, 5],
    tradeoff: 'The most moving parts: traffic splitting, canary metrics, and automated rollback logic. Two versions serve users at the same time.',
    rollback: 'Route the canary\'s share of traffic back to v1. Only the small canary group ever saw the problem.',
    phases: [
      { rows: [['1', '1', '1', '1']], v2: 0, text: 'v1 serves all traffic.' },
      { rows: [['1', '1', '1', '1', '2']], v2: 5, text: 'A canary instance of v2 is added and receives a small share of real traffic (for example 5%). Error rate and latency are compared with v1.' },
      { rows: [['1', '1', '2', '2']], v2: 50, text: 'Canary metrics are healthy, so the traffic share is raised in steps (for example 25%, then 50%).' },
      { rows: [['2', '2', '2', '2']], v2: 100, text: 'All traffic is on v2 and the v1 instances are retired.' }] },
  { id: 'rolling', name: 'Rolling Update', color: [239, 108, 0], complexity: 2,
    scores: [4, 3, 5, 2],
    tradeoff: 'Rollback is a second rollout in reverse, old and new versions run side by side, and the traffic share follows the instance count instead of being chosen.',
    rollback: 'Roll the instances back one batch at a time. It takes about as long as the rollout did.',
    phases: [
      { rows: [['1', '1', '1', '1']], v2: 0, text: 'All four instances run v1.' },
      { rows: [['2', '1', '1', '1']], v2: 25, text: 'One instance is replaced with v2 and passes its readiness check. Capacity stays roughly constant.' },
      { rows: [['2', '2', '1', '1']], v2: 50, text: 'The next instance is replaced. Half of all requests now reach v2, whether or not anyone chose that share.' },
      { rows: [['2', '2', '2', '1']], v2: 75, text: 'The rollout continues one batch at a time.' },
      { rows: [['2', '2', '2', '2']], v2: 100, text: 'All instances run v2. No extra environment was needed.' }] },
  { id: 'recreate', name: 'Recreate', color: [198, 40, 40], complexity: 1,
    scores: [1, 2, 5, 1],
    tradeoff: 'Downtime during every release and a slow rollback. Acceptable only where a maintenance window is.',
    rollback: 'Stop v2 and redeploy v1, which means a second outage.',
    phases: [
      { rows: [['1', '1', '1', '1']], v2: 0, text: 'All instances run v1.' },
      { rows: [['x', 'x', 'x', 'x']], v2: -1, text: 'Every v1 instance is stopped. The service is down.' },
      { rows: [['s', 's', 's', 's']], v2: -1, text: 'v2 instances start. The service is still down until they are ready.' },
      { rows: [['2', '2', '2', '2']], v2: 100, text: 'v2 serves all traffic. The two versions never ran together, which keeps the release simple.' }] }
];

let sliders = [];
let simulateBtn, compareBtn;
let compareAll = false;
let pickedId = null;         // strategy whose timeline is shown when the student clicks a card
let phaseIndex = -1;         // highlighted timeline phase (-1 = none)
let simulating = false, lastStepMs = 0;
let cardRects = [], phaseRects = [];
let wide = true;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const main = document.querySelector('main');
  canvas.parent(main);
  textSize(defaultTextSize);

  const defaults = [4, 4, 3, 2];
  for (let i = 0; i < 4; i++) {
    const s = createSlider(1, 5, defaults[i], 1);
    s.parent(main);
    s.input(() => { phaseIndex = -1; simulating = false; });
    sliders.push(s);
  }
  simulateBtn = createButton('Simulate Deployment'); simulateBtn.parent(main);
  simulateBtn.mousePressed(startSimulation);
  compareBtn = createButton('Compare All'); compareBtn.parent(main);
  compareBtn.mousePressed(() => {
    compareAll = !compareAll;
    compareBtn.html(compareAll ? 'Show Timeline' : 'Compare All');
    simulating = false;
  });

  layout();
  describe('A decision tool for deployment strategies. Four sliders set how much the learner needs ' +
    'zero downtime, fast rollback, low cost, and validation with live traffic. Four cards (blue-green, ' +
    'canary, rolling update, recreate) show each strategy\'s 1 to 5 score on those dimensions and its ' +
    'gap from the stated needs. The strategy with the smallest gap is recommended with the tradeoffs ' +
    'it accepts, and a timeline shows its release sequence phase by phase. A radar chart compares all four.', LABEL);
}

function layout() {
  wide = canvasWidth >= 660;          // 4 cards across fits the usual chapter column (about 690px)
  const colW = (canvasWidth - 20) / 2;
  const labelW = sliderLabelWidth();
  for (let i = 0; i < 4; i++) {
    const col = i % 2, row = Math.floor(i / 2);
    sliders[i].position(10 + col * colW + labelW, drawHeight + 10 + row * 35);
    sliders[i].size(Math.max(50, colW - labelW - 16));
  }
  simulateBtn.position(10, drawHeight + 82);
  compareBtn.position(165, drawHeight + 82);
}

function sliderLabelWidth() { return canvasWidth >= 640 ? 168 : 112; }

// ---------- evaluation model ----------
function needs() { return sliders.map(s => s.value()); }

// Gap = total shortfall: how far a strategy falls below each stated need. Exceeding a need
// costs nothing. Ties go to the operationally simpler strategy.
function evaluate() {
  const n = needs();
  const rows = STRATEGIES.map(s => {
    const short = s.scores.map((v, i) => Math.max(0, n[i] - v));
    return { s: s, short: short, gap: short.reduce((a, b) => a + b, 0) };
  });
  const ranked = rows.slice().sort((a, b) => a.gap - b.gap || a.s.complexity - b.s.complexity);
  return { rows: rows, best: ranked[0], runnerUp: ranked[1] };
}

function startSimulation() {
  if (compareAll) { compareAll = false; compareBtn.html('Compare All'); }
  phaseIndex = 0; simulating = true; lastStepMs = millis();
}

// ---------- drawing ----------
function draw() {
  updateCanvasSize();
  background(255);
  noStroke(); fill(240, 248, 255); rect(0, 0, canvasWidth, drawHeight);
  fill(255); rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(192); strokeWeight(1); noFill();
  rect(0.5, 0.5, canvasWidth - 1, drawHeight - 0.5);
  rect(0.5, drawHeight, canvasWidth - 1, controlHeight - 0.5);
  noStroke();

  const ev = evaluate();
  const shown = STRATEGIES.find(s => s.id === pickedId) || ev.best.s;

  // advance the walk-through
  if (simulating && millis() - lastStepMs > 1500) {
    lastStepMs = millis();
    if (phaseIndex < shown.phases.length - 1) phaseIndex++; else simulating = false;
  }
  if (phaseIndex >= shown.phases.length) phaseIndex = shown.phases.length - 1;

  noStroke(); fill(25, 45, 90); textAlign(LEFT, TOP); textStyle(BOLD); textSize(canvasWidth < 520 ? 15 : 18);
  text(canvasWidth < 520 ? 'Deployment Strategy Selector' : 'Deployment Strategy Decision Matrix', margin, 9);
  textStyle(NORMAL);
  if (canvasWidth >= 780) {
    fill(95); textAlign(RIGHT, TOP); textSize(11.5);
    text('Set your needs below. Pips show what each strategy delivers (1 to 5).', canvasWidth - margin, 14);
  }

  // strategy cards
  cardRects = [];
  const gap = 6, cardsTop = 38;
  const cols = wide ? 4 : 2;
  const cardW = (canvasWidth - margin * 2 - gap * (cols - 1)) / cols;
  const cardH = wide ? 140 : 100;
  for (let i = 0; i < 4; i++) {
    const cx = margin + (i % cols) * (cardW + gap);
    const cy = cardsTop + Math.floor(i / cols) * (cardH + gap);
    cardRects.push({ id: STRATEGIES[i].id, x: cx, y: cy, w: cardW, h: cardH });
    drawCard(ev.rows[i], cx, cy, cardW, cardH, ev.best.s.id === STRATEGIES[i].id, shown.id === STRATEGIES[i].id);
  }
  const cardsBottom = cardsTop + (wide ? cardH : cardH * 2 + gap);

  const lowerTop = cardsBottom + 8;
  if (compareAll) {
    drawRadar(ev, lowerTop, drawHeight - lowerTop - 8);
    phaseRects = [];
  } else {
    const timelineH = wide ? 138 : 102;
    const panelH = drawHeight - lowerTop - timelineH - 14;
    drawRecommendation(ev, lowerTop, panelH);
    drawTimeline(shown, shown.id === ev.best.s.id, lowerTop + panelH + 8, timelineH);
  }
  drawControlLabels();

  let over = false;
  for (const r of cardRects.concat(phaseRects)) if (inRect(r)) over = true;
  cursor(over ? HAND : ARROW);
}

function drawCard(row, x, y, w, h, isBest, isShown) {
  const s = row.s, c = s.color, n = needs();
  fill(255);
  if (isBest) { stroke(30); strokeWeight(3); }
  else { stroke(c[0], c[1], c[2], 160); strokeWeight(isShown ? 2.5 : 1.2); }
  rect(x, y, w, h, 8); noStroke();
  fill(c[0], c[1], c[2]); rect(x + 1.5, y + 1.5, w - 3, 23, 6, 6, 0, 0);
  fill(255); textAlign(LEFT, CENTER); textStyle(BOLD); textSize(12.5);
  // wide cards put the BEST FIT banner at the bottom; the 2 x 2 cards put it in the header
  const gapLabel = (isBest && !wide ? 'Best · ' : '') + 'gap ' + row.gap;
  const gw = textWidth(gapLabel);
  text(fitText(s.name, w - gw - 24), x + 8, y + 13.5);
  textAlign(RIGHT, CENTER); text(gapLabel, x + w - 8, y + 13.5);
  textStyle(NORMAL);
  if (isBest && wide) {
    fill(30); rect(x + 8, y + h - 22, w - 16, 16, 4);
    fill(255); textAlign(CENTER, CENTER); textStyle(BOLD); textSize(11);
    text('BEST FIT', x + w / 2, y + h - 13.5); textStyle(NORMAL);
  }

  const compact = w < 175;
  const rowH = wide ? 21 : 17.5;
  let ty = y + (wide ? 33 : 30);
  const pw = compact ? 8 : (wide ? 11 : 10), pg = compact ? 2 : 3;
  const px0 = x + w - 30 - (pw * 5 + pg * 4);
  for (let i = 0; i < 4; i++) {
    noStroke(); fill(45); textAlign(LEFT, CENTER); textSize(compact ? 10.5 : 11.5);
    text(DIMS[i].card, x + 8, ty + 6);
    for (let k = 0; k < 5; k++) {
      const bx = px0 + k * (pw + pg);
      const filled = k < s.scores[i];
      const unmet = !filled && k < n[i];            // needed but not delivered
      if (filled) { fill(c[0], c[1], c[2]); noStroke(); }
      else if (unmet) { fill(255, 235, 238); stroke(198, 40, 40); strokeWeight(1.5); }
      else { fill(224, 230, 236); noStroke(); }
      rect(bx, ty + 1, pw, 10, 2);
    }
    // marker under the pip that equals the stated need
    noStroke(); fill(30);
    const mx = px0 + (n[i] - 1) * (pw + pg) + pw / 2;
    triangle(mx, ty + 12, mx - 3.5, ty + 16.5, mx + 3.5, ty + 16.5);
    // shortfall
    textAlign(RIGHT, CENTER); textSize(11.5); textStyle(BOLD);
    if (row.short[i] > 0) { fill(198, 40, 40); text('−' + row.short[i], x + w - 7, ty + 6); }
    else { fill(46, 125, 50); text('ok', x + w - 7, ty + 6); }
    textStyle(NORMAL);
    ty += rowH;
  }
}

function drawRecommendation(ev, y, h) {
  const x = margin, w = canvasWidth - margin * 2;
  const best = ev.best, c = best.s.color;
  fill(255); stroke(c[0], c[1], c[2]); strokeWeight(2); rect(x, y, w, h, 8); noStroke();
  const limit = y + h - 4;
  let ty = y + 8;
  fill(25, 45, 90); textAlign(LEFT, TOP); textStyle(BOLD); textSize(14);
  text(fitText('Best fit: ' + best.s.name + ' (total gap ' + best.gap + ')', w - 24), x + 12, ty);
  textStyle(NORMAL); ty += 20;
  const unmet = [];
  for (let i = 0; i < 4; i++) if (best.short[i] > 0) unmet.push(DIMS[i].unmet + ' short by ' + best.short[i]);
  let why = unmet.length ? 'Closest match, but not a full one: ' + unmet.join(', ') + '.' : 'It meets every need you stated.';
  if (ev.runnerUp.gap === best.gap) why += ' ' + ev.runnerUp.s.name + ' ties on gap; the simpler strategy wins a tie.';
  else why += ' Runner-up: ' + ev.runnerUp.s.name + ' (gap ' + ev.runnerUp.gap + ').';
  ty = drawWrapped(why, x + 12, ty, w - 24, 12.5, 16, color(30), limit) + 3;
  ty = drawLabeled('Tradeoff accepted: ', best.s.tradeoff, x + 12, ty, w - 24, limit) + 3;
  drawLabeled('Rollback: ', best.s.rollback, x + 12, ty, w - 24, limit);
}

function drawTimeline(s, isBest, y, h) {
  const x = margin, w = canvasWidth - margin * 2;
  const c = s.v2Color || s.color, c1 = s.v1Color || V1;
  noStroke(); fill(25, 45, 90); textAlign(LEFT, TOP); textStyle(BOLD); textSize(12.5);
  text(fitText('Release sequence: ' + s.name + (isBest ? ' (best fit)' : ' (selected card)'), w), x, y);
  textStyle(NORMAL);
  const n = s.phases.length, gapX = wide ? 16 : 8;
  const colW = (w - gapX * (n - 1)) / n;
  const boxY = y + 18, boxH = wide ? 66 : 46;
  phaseRects = [];
  for (let i = 0; i < n; i++) {
    const p = s.phases[i];
    const bx = x + i * (colW + gapX);
    phaseRects.push({ i: i, x: bx, y: boxY, w: colW, h: boxH });
    const on = i === phaseIndex;
    fill(on ? color(255, 248, 225) : color(255));
    stroke(on ? color(30) : color(190)); strokeWeight(on ? 2.2 : 1); rect(bx, boxY, colW, boxH, 6); noStroke();
    // phase number
    fill(110); textAlign(LEFT, TOP); textSize(10.5); textStyle(BOLD); text(i + 1, bx + 5, boxY + 3); textStyle(NORMAL);
    // instances
    const sq = p.rows.length > 1 ? (wide ? 15 : 9) : (wide ? 20 : 12);
    const sg = 3;
    const rowsH = p.rows.length * sq + (p.rows.length - 1) * 3;
    let ry = boxY + (boxH - (wide ? 18 : 14) - rowsH) / 2 + 1;
    for (let r = 0; r < p.rows.length; r++) {
      const row = p.rows[r];
      const rw = row.length * sq + (row.length - 1) * sg;
      let sx = bx + (colW - rw) / 2;
      if (s.rowLabels && colW > 130) {
        noStroke(); fill(100); textAlign(RIGHT, CENTER); textSize(10); text(s.rowLabels[r], sx - 5, ry + sq / 2);
      }
      for (const st of row) { drawInstance(st, sx, ry, sq, c, c1); sx += sq + sg; }
      ry += sq + 3;
    }
    // traffic bar
    const tbh = wide ? 12 : 9;
    const tbx = bx + 6, tbw = colW - 12, tby = boxY + boxH - tbh - 4;
    if (p.v2 < 0) {
      fill(198, 40, 40); rect(tbx, tby, tbw, tbh, 3);
      fill(255); textAlign(CENTER, CENTER); textSize(wide ? 10 : 8.5); textStyle(BOLD);
      text(wide ? 'NO SERVICE' : 'DOWN', tbx + tbw / 2, tby + tbh / 2 + 0.5); textStyle(NORMAL);
    } else {
      fill(c1[0], c1[1], c1[2]); rect(tbx, tby, tbw, tbh, 3);
      if (p.v2 > 0) { fill(c[0], c[1], c[2]); rect(tbx + tbw * (1 - p.v2 / 100), tby, tbw * p.v2 / 100, tbh, 3); }
    }
    // arrow to the next phase
    if (i < n - 1) {
      const ax = bx + colW + 2, ay = boxY + boxH / 2;
      stroke(120); strokeWeight(1.5); line(ax, ay, ax + gapX - 6, ay); noStroke();
      fill(120); triangle(ax + gapX - 3, ay, ax + gapX - 8, ay - 3.5, ax + gapX - 8, ay + 3.5);
    }
  }
  // caption
  const capY = boxY + boxH + 5, limit = y + h + 2;
  if (phaseIndex >= 0) {
    const p = s.phases[phaseIndex];
    const share = p.v2 < 0 ? 'No traffic is served.' : 'Traffic: ' + (100 - p.v2) + '% v1, ' + p.v2 + '% v2.';
    let msg = (phaseIndex + 1) + '. ' + p.text + ' ' + share;
    if (phaseIndex === s.phases.length - 1 && !isBest) msg += ' Rollback: ' + s.rollback;
    drawWrapped(msg, x, capY, w, 12, 15, color(20), limit);
  } else if (wide) {
    drawWrapped((s.legend || 'Gray squares run v1, colored squares run v2, outlined squares take no traffic.') +
      ' The bar under each phase is the traffic split. Press Simulate Deployment or click a phase; click a card to see another strategy.',
      x, capY, w, 12, 15, color(85), limit);
  } else {
    drawWrapped('Press Simulate Deployment or tap a phase. Tap a card to see another strategy.',
      x, capY, w, 12, 15, color(85), limit);
  }
}

function drawInstance(st, x, y, sq, c, c1) {
  if (st === '-') { noFill(); stroke(205); strokeWeight(1); drawingContext.setLineDash([2, 2]); rect(x, y, sq, sq, 2); drawingContext.setLineDash([]); noStroke(); return; }
  if (st === '1') { noStroke(); fill(c1[0], c1[1], c1[2]); rect(x, y, sq, sq, 2); return; }
  if (st === '2') { noStroke(); fill(c[0], c[1], c[2]); rect(x, y, sq, sq, 2); return; }
  if (st === 'i1') { fill(255); stroke(c1[0], c1[1], c1[2]); strokeWeight(2); rect(x + 1, y + 1, sq - 2, sq - 2, 2); noStroke(); return; }
  if (st === 'i2' || st === 's') { fill(255); stroke(c[0], c[1], c[2]); strokeWeight(2); rect(x + 1, y + 1, sq - 2, sq - 2, 2); noStroke(); return; }
  // stopped
  fill(245); stroke(150); strokeWeight(1); rect(x, y, sq, sq, 2);
  stroke(198, 40, 40); strokeWeight(1.5); line(x + 3, y + 3, x + sq - 3, y + sq - 3); line(x + sq - 3, y + 3, x + 3, y + sq - 3);
  noStroke();
}

// Radar chart of all four strategies plus the stated needs (dashed outline).
function drawRadar(ev, y, h) {
  const x = margin, w = canvasWidth - margin * 2;
  fill(255); stroke(200); strokeWeight(1); rect(x, y, w, h, 8); noStroke();
  const side = wide;                               // legend beside the chart when there is room
  const chartW = side ? Math.min(w * 0.5, 370) : w;
  const legendH = side ? 0 : 64;
  const cx = x + chartW / 2, cy = y + (h - legendH) / 2 + 2;
  const R = Math.min(chartW / 2 - 96, (h - legendH) / 2 - 24);
  const ang = i => -HALF_PI + i * HALF_PI;         // four axes: up, right, down, left
  // grid rings and axes
  stroke(215); strokeWeight(1); noFill();
  for (let k = 1; k <= 5; k++) {
    beginShape();
    for (let i = 0; i < 4; i++) vertex(cx + cos(ang(i)) * R * k / 5, cy + sin(ang(i)) * R * k / 5);
    endShape(CLOSE);
  }
  for (let i = 0; i < 4; i++) line(cx, cy, cx + cos(ang(i)) * R, cy + sin(ang(i)) * R);
  noStroke(); fill(60); textSize(11.5);
  const labels = DIMS.map(d => d.card);
  textAlign(CENTER, BOTTOM); text(labels[0], cx, cy - R - 4);
  textAlign(LEFT, CENTER); text(labels[1], cx + R + 6, cy);
  textAlign(CENTER, TOP); text(labels[2], cx, cy + R + 4);
  textAlign(RIGHT, CENTER); text(labels[3], cx - R - 6, cy);
  // strategy polygons
  for (const row of ev.rows) {
    const c = row.s.color, isBest = row === ev.best;
    fill(c[0], c[1], c[2], isBest ? 70 : 22); stroke(c[0], c[1], c[2]); strokeWeight(isBest ? 3 : 1.5);
    beginShape();
    for (let i = 0; i < 4; i++) vertex(cx + cos(ang(i)) * R * row.s.scores[i] / 5, cy + sin(ang(i)) * R * row.s.scores[i] / 5);
    endShape(CLOSE);
  }
  // stated needs
  const n = needs();
  noFill(); stroke(20); strokeWeight(2); drawingContext.setLineDash([6, 4]);
  beginShape();
  for (let i = 0; i < 4; i++) vertex(cx + cos(ang(i)) * R * n[i] / 5, cy + sin(ang(i)) * R * n[i] / 5);
  endShape(CLOSE);
  drawingContext.setLineDash([]); noStroke();

  // legend
  let lx = side ? x + chartW + 16 : x + 12;
  let ly = side ? y + 14 : y + h - legendH + 2;
  const lw = side ? w - chartW - 28 : w - 24;
  if (side) {
    fill(25, 45, 90); textAlign(LEFT, TOP); textStyle(BOLD); textSize(14);
    text('All four strategies against your needs', lx, ly); textStyle(NORMAL); ly += 24;
  }
  const perRow = side ? 1 : 2;
  const itemW = lw / perRow;
  const ranked = ev.rows.slice().sort((a, b) => a.gap - b.gap || a.s.complexity - b.s.complexity);
  for (let i = 0; i < ranked.length; i++) {
    const row = ranked[i], c = row.s.color;
    const ix = lx + (i % perRow) * itemW, iy = ly + Math.floor(i / perRow) * (side ? 21 : 18);
    fill(c[0], c[1], c[2]); rect(ix, iy + 2, 14, 10, 2);
    fill(30); textAlign(LEFT, TOP); textSize(12.5);
    textStyle(row === ev.best ? BOLD : NORMAL);
    text(row.s.name + ': gap ' + row.gap + (row === ev.best ? ' (best fit)' : ''), ix + 20, iy);
    textStyle(NORMAL);
  }
  ly += Math.ceil(ranked.length / perRow) * (side ? 21 : 18) + 2;
  stroke(20); strokeWeight(2); drawingContext.setLineDash([5, 3]); line(lx, ly + 8, lx + 14, ly + 8);
  drawingContext.setLineDash([]); noStroke();
  fill(30); textAlign(LEFT, TOP); textSize(12.5); text('Your stated needs (dashed)', lx + 20, ly);
  if (side) {
    drawWrapped('A strategy fits where its shape covers the dashed outline. Wherever the dashed line pokes out, ' +
      'that need is unmet, and the distance is the gap.', lx, ly + 26, lw, 12.5, 16, color(85), y + h - 6);
  }
}

function drawControlLabels() {
  const n = needs();
  const colW = (canvasWidth - 20) / 2;
  const big = canvasWidth >= 640;
  noStroke(); fill(30); textAlign(LEFT, CENTER); textSize(big ? 13 : 11.5);
  for (let i = 0; i < 4; i++) {
    const col = i % 2, row = Math.floor(i / 2);
    text((big ? DIMS[i].wide : DIMS[i].narrow) + ': ' + n[i], 10 + col * colW, drawHeight + 20 + row * 35);
  }
  if (canvasWidth >= 620) {
    fill(100); textSize(12);
    text(fitText(canvasWidth < 820 ? '1 = does not matter, 5 = essential.' : '1 = does not matter, 5 = essential. Set these before you read the recommendation.', canvasWidth - 285), 272, drawHeight + 93);
  }
}

// ---------- helpers ----------
function inRect(r) {
  return mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h;
}

function fitText(str, maxW) {
  if (textWidth(str) <= maxW) return str;
  let s = str;
  while (s.length > 1 && textWidth(s + '…') > maxW) s = s.slice(0, -1);
  return s + '…';
}

function wrapLines(str, w) {
  const lines = [];
  let ln = '';
  for (const wd of str.split(' ')) {
    const t = ln ? ln + ' ' + wd : wd;
    if (textWidth(t) > w && ln) { lines.push(ln); ln = wd; } else ln = t;
  }
  if (ln) lines.push(ln);
  return lines;
}

function drawWrapped(str, x, y, w, size, lineH, col, yLimit) {
  textSize(size); textAlign(LEFT, TOP); textStyle(NORMAL); noStroke(); fill(col);
  const lines = wrapLines(str, w);
  for (let i = 0; i < lines.length; i++) {
    if (y + lineH > yLimit) break;
    const lastFit = (y + 2 * lineH > yLimit) && i < lines.length - 1;
    text(lastFit ? fitText(lines[i] + ' …', w) : lines[i], x, y);
    y += lineH;
  }
  return y;
}

function drawLabeled(label, body, x, y, w, yLimit) {
  const size = 12.5, lineH = 16;
  textSize(size); textStyle(NORMAL); noStroke(); textAlign(LEFT, TOP);
  const lines = wrapLines(label + body, w);
  for (let i = 0; i < lines.length; i++) {
    if (y + lineH > yLimit) break;
    const lastFit = (y + 2 * lineH > yLimit) && i < lines.length - 1;
    const ln = lastFit ? fitText(lines[i] + ' …', w) : lines[i];
    if (i === 0) {
      textStyle(BOLD); fill(20); text(label, x, y);
      const lw = textWidth(label);
      textStyle(NORMAL); fill(30); text(ln.slice(label.length), x + lw, y);
    } else { fill(30); text(ln, x, y); }
    y += lineH;
  }
  return y;
}

// ---------- interaction ----------
function mousePressed() {
  if (mouseY > drawHeight || mouseY < 0 || mouseX < 0 || mouseX > canvasWidth) return;
  for (const r of cardRects) {
    if (inRect(r)) {
      pickedId = (pickedId === r.id) ? null : r.id;
      phaseIndex = -1; simulating = false;
      return;
    }
  }
  for (const r of phaseRects) {
    if (inRect(r)) { phaseIndex = (phaseIndex === r.i && !simulating) ? -1 : r.i; simulating = false; return; }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  layout();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
