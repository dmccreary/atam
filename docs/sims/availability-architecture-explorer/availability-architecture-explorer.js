// Availability Architecture Analyzer
// CANVAS_HEIGHT: 535
// Bloom L3 (Apply): students CALCULATE the availability of a system built from stages in
// series, each stage holding one or more replicas in parallel, then find the weakest link and
// check the design against an SLO. Every change updates the numbers at once; no animation.
//
// MODEL (standard reliability block diagram algebra, independent failures assumed):
//   stage unavailability     U_stage = u^n          (u = 1 - A of one replica, n replicas)
//   system availability      A = product of (1 - U_stage) over the stages in series
//   replica MTBF             = MTTR * A / (1 - A)   (from A = MTBF / (MTBF + MTTR))
//   stage outage frequency   f = n * u^n / MTTR     (all n replicas down; first repair ends it)
//   system outage frequency  = sum of f_i * product of the other stages' availability
// The default component availabilities and repair times are illustrative, not vendor figures.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 455;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const MIN_PER_YEAR = 525600;      // 365 days
const AVAIL_OPTIONS = ['99%', '99.5%', '99.9%', '99.95%', '99.99%', '99.999%'];
const SLO_OPTIONS = ['99%', '99.9%', '99.95%', '99.99%', '99.999%'];
const EXTRA_NAMES = ['Cache', 'Message queue', 'Auth service', 'Payment API', 'Search service', 'CDN'];
const MAX_STAGES = 6;

const BLUE = [25, 118, 210], RED = [198, 40, 40], GREEN = [46, 125, 50], NAVY = [25, 45, 90];

let stages = [];
let selected = 3;
let availSelect, replicaSlider, mttrSlider, addBtn, removeBtn, sloSelect, resetBtn;
let colHits = [];                 // [{i, x0, x1}] for click hit-testing

function defaultStages() {
  return [
    { name: 'Load balancer', avail: '99.99%', n: 1, mttr: 15 },
    { name: 'Web tier', avail: '99.9%', n: 2, mttr: 30 },
    { name: 'App tier', avail: '99.9%', n: 2, mttr: 30 },
    { name: 'Database', avail: '99.95%', n: 1, mttr: 60 }
  ];
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const main = document.querySelector('main');
  canvas.parent(main);
  textSize(defaultTextSize);

  availSelect = createSelect(); availSelect.parent(main);
  for (const a of AVAIL_OPTIONS) availSelect.option(a);
  availSelect.changed(() => { stages[selected].avail = availSelect.value(); });
  replicaSlider = createSlider(1, 4, 1, 1); replicaSlider.parent(main);
  replicaSlider.input(() => { stages[selected].n = replicaSlider.value(); });
  mttrSlider = createSlider(1, 240, 60, 1); mttrSlider.parent(main);
  mttrSlider.input(() => { stages[selected].mttr = mttrSlider.value(); });

  addBtn = createButton('Add stage'); addBtn.parent(main); addBtn.mousePressed(addStage);
  removeBtn = createButton('Remove stage'); removeBtn.parent(main); removeBtn.mousePressed(removeStage);
  sloSelect = createSelect(); sloSelect.parent(main);
  for (const a of SLO_OPTIONS) sloSelect.option(a);
  sloSelect.selected('99.95%');
  resetBtn = createButton('Reset'); resetBtn.parent(main); resetBtn.mousePressed(resetAll);

  resetAll();
  layout();
  describe('An availability calculator drawn as a reliability block diagram. Stages are connected ' +
    'in series and each stage holds one to four replicas in parallel. Selecting a stage lets you ' +
    'change its replica availability, replica count, and repair time, and stages can be added or ' +
    'removed. Panels show the system availability, a scale of nines with the SLO target, the ' +
    'downtime per year and per month, the expected outages, the downtime contributed by each ' +
    'stage, and the weakest link.', LABEL);
}

function resetAll() {
  stages = defaultStages(); selected = 3; sloSelect.selected('99.95%'); syncControls();
}

function addStage() {
  if (stages.length >= MAX_STAGES) return;
  const used = stages.map(s => s.name);
  const name = EXTRA_NAMES.find(n => !used.includes(n)) || 'Service';
  stages.push({ name: name, avail: '99.9%', n: 1, mttr: 60 });
  selected = stages.length - 1; syncControls();
}

function removeStage() {
  if (stages.length <= 1) return;
  stages.splice(selected, 1);
  selected = Math.min(selected, stages.length - 1); syncControls();
}

// copy the selected stage's values into the controls
function syncControls() {
  const s = stages[selected];
  availSelect.selected(s.avail); replicaSlider.value(s.n); mttrSlider.value(s.mttr);
}

function layout() {
  const big = canvasWidth >= 660;
  const y1 = drawHeight + 10, y2 = drawHeight + 46;
  // row 1: availability select, replicas slider, MTTR slider (labels are drawn on the canvas)
  const lab1 = big ? 128 : 0, lab2 = big ? 82 : 26, lab3 = big ? 104 : 52;
  let x = 10 + lab1;
  availSelect.position(x, y1); availSelect.size(big ? 82 : 76); x += (big ? 82 : 76) + 10 + lab2;
  const rw = big ? 76 : 56;
  replicaSlider.position(x, y1 + 1); replicaSlider.size(rw); x += rw + 12 + lab3;
  mttrSlider.position(x, y1 + 1); mttrSlider.size(Math.max(50, canvasWidth - x - 14));
  // row 2: add, remove, SLO target, reset
  addBtn.html(big ? 'Add stage' : 'Add'); removeBtn.html(big ? 'Remove stage' : 'Remove');
  addBtn.position(10, y2);
  removeBtn.position(10 + addBtn.elt.offsetWidth + 6, y2);
  resetBtn.position(canvasWidth - 10 - resetBtn.elt.offsetWidth, y2);
  sloSelect.size(82);
  sloSelect.position(canvasWidth - 10 - resetBtn.elt.offsetWidth - 12 - 82, y2);
}

// ---------- model ----------
function unavail(pct) { return 1 - parseFloat(pct) / 100; }

function analyze() {
  const m = { stages: [], logA: 0 };
  for (const s of stages) {
    const u = unavail(s.avail);                    // one replica
    const U = Math.pow(u, s.n);                    // the whole stage (all replicas down)
    const f = s.n * U / s.mttr;                    // stage outages per minute
    m.stages.push({ s: s, u: u, U: U, f: f, mtbf: s.mttr * (1 - u) / u });
    m.logA += Math.log1p(-U);
  }
  m.U = -Math.expm1(m.logA);                       // system unavailability, kept accurate when tiny
  m.A = 1 - m.U;
  // outage frequency of the series system: a stage outage counts when all other stages are up
  m.f = 0;
  for (const st of m.stages) m.f += st.f * Math.exp(m.logA - Math.log1p(-st.U));
  m.outagesPerYear = m.f * MIN_PER_YEAR;
  m.meanOutageMin = m.f > 0 ? m.U / m.f : 0;
  m.downMinYear = m.U * MIN_PER_YEAR;
  m.sumU = m.stages.reduce((a, st) => a + st.U, 0);
  m.weakest = 0;
  for (let i = 1; i < m.stages.length; i++) if (m.stages[i].U > m.stages[m.weakest].U * (1 + 1e-9)) m.weakest = i;
  m.sloU = unavail(sloSelect.value());
  m.meets = m.U <= m.sloU * (1 + 1e-9);
  return m;
}

// availability as a percentage with as many decimals as its unavailability needs
function fmtAvail(U) {
  if (U <= 0) return '100%';
  const pctU = U * 100;
  if (pctU < 1e-7) return Math.round(-Math.log10(U)) + ' nines';      // too many digits to print
  const d = Math.min(12, Math.max(0, Math.ceil(-Math.log10(pctU) - 1e-9)) + 2);
  let s = (100 - pctU).toFixed(d);
  if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s + '%';
}

function fmtDuration(min) {
  if (min >= 60 * 48) return (min / 1440).toFixed(1) + ' days';
  if (min >= 120) return (min / 60).toFixed(min >= 600 ? 1 : 2) + ' h';
  if (min >= 1) return (min >= 10 ? min.toFixed(1) : min.toFixed(2)) + ' min';
  const sec = min * 60;
  if (sec >= 1) return sec.toFixed(1) + ' s';
  if (sec >= 0.001) return (sec * 1000).toFixed(0) + ' ms';
  return 'under 1 ms';
}

function fmtMtbf(min) {
  const days = min / 1440;
  if (days >= 730) return (days / 365).toFixed(1) + ' years';
  if (days >= 2) return days.toFixed(days >= 100 ? 0 : 1) + ' days';
  return (min / 60).toFixed(1) + ' h';
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

  const m = analyze();
  const narrow = canvasWidth < 660;
  fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(narrow ? 14.5 : 18);
  text(narrow ? 'Availability Analyzer' : 'Availability Architecture Analyzer', margin, 10);
  textAlign(RIGHT, TOP); textSize(narrow ? 13 : 16);
  fill(m.meets ? color(GREEN[0], GREEN[1], GREEN[2]) : color(RED[0], RED[1], RED[2]));
  text('System: ' + fmtAvail(m.U), canvasWidth - margin, 11);
  textStyle(NORMAL);

  drawDiagram(m, 38, 176);
  const py = 222, ph = drawHeight - 8 - py, full = canvasWidth - margin * 2;
  if (!narrow) {
    const lw = Math.round(full * 0.54);
    drawSystemPanel(m, margin, py, lw, ph);
    drawStagePanel(m, margin + lw + 8, py, full - lw - 8, ph);
  } else {
    drawSystemPanel(m, margin, py, full, ph);
  }
  drawControlLabels(m);
}

// reliability block diagram: stages in series, replicas of a stage in parallel
function drawDiagram(m, top, h) {
  const n = stages.length;
  const x0 = margin + 40, x1 = canvasWidth - margin - 46;
  const colW = (x1 - x0) / n;
  const yMid = top + h / 2 + 2;
  const boxH = 24, gap = 5;
  const boxW = Math.min(104, colW - 24);
  colHits = [];

  // the request path through the chain
  stroke(110); strokeWeight(1.6);
  line(margin + 4, yMid, x0 + 8, yMid); line(x1 - 8, yMid, canvasWidth - margin - 4, yMid);
  noStroke(); fill(90); textSize(10.5); textAlign(LEFT, BOTTOM); text('request', margin + 2, yMid - 4);
  textAlign(RIGHT, BOTTOM); text('response', canvasWidth - margin - 1, yMid - 4);

  for (let i = 0; i < n; i++) {
    const st = m.stages[i], s = st.s;
    const cx0 = x0 + i * colW, cx = cx0 + colW / 2;
    colHits.push({ i: i, x0: cx0, x1: cx0 + colW });
    const isSel = i === selected, weak = i === m.weakest && n > 1;
    const hover = mouseY > top && mouseY < top + h && mouseX >= cx0 && mouseX < cx0 + colW;
    if (isSel || hover) {
      noStroke(); fill(isSel ? color(255, 243, 205) : color(226, 236, 248)); rect(cx0 + 6, top, colW - 12, h, 8);
    }
    // bus lines and replica boxes
    const jl = cx0 + 8, jr = cx0 + colW - 8, bx = cx - boxW / 2;
    const total = s.n * boxH + (s.n - 1) * gap, yTop = yMid - total / 2;
    stroke(110); strokeWeight(1.6);
    if (i > 0) line(cx0 - 8, yMid, jl, yMid);
    for (let k = 0; k < s.n; k++) {
      const by = yTop + k * (boxH + gap) + boxH / 2;
      line(jl, by, bx, by); line(bx + boxW, by, jr, by);
    }
    if (s.n > 1) { line(jl, yTop + boxH / 2, jl, yTop + total - boxH / 2); line(jr, yTop + boxH / 2, jr, yTop + total - boxH / 2); }
    for (let k = 0; k < s.n; k++) {
      const by = yTop + k * (boxH + gap);
      stroke(weak ? color(RED[0], RED[1], RED[2]) : (isSel ? color(BLUE[0], BLUE[1], BLUE[2]) : color(120, 144, 156)));
      strokeWeight(weak || isSel ? 2 : 1.3);
      fill(weak ? color(255, 235, 238) : color(232, 240, 250));
      rect(bx, by, boxW, boxH, 5);
      noStroke(); fill(30); textAlign(CENTER, CENTER); textSize(boxW < 70 ? 10.5 : 12);
      text(s.avail, cx, by + boxH / 2);
    }
    // stage name above, stage result below
    noStroke(); textAlign(CENTER, TOP); textStyle(BOLD); textSize(colW < 100 ? 10.5 : 12);
    fill(weak ? color(RED[0], RED[1], RED[2]) : color(30));
    text(fitText(s.name, colW - 6), cx, top + 5);
    textStyle(NORMAL); textSize(colW < 100 ? 10 : 11); textAlign(CENTER, BOTTOM);
    fill(70);
    const res = s.n > 1 ? s.n + ' in parallel = ' + fmtAvail(st.U) : 'single, no redundancy';
    const res2 = s.n > 1 ? '×' + s.n + ' = ' + fmtAvail(st.U) : 'no redundancy';
    text(textWidth(res) <= colW - 6 ? res : fitText(res2, colW - 4), cx, top + h - (weak ? 16 : 6));
    if (weak) {
      fill(RED[0], RED[1], RED[2]); textStyle(BOLD);
      text(fitText('weakest link', colW - 4), cx, top + h - 3); textStyle(NORMAL);
    }
  }
}

function panel(x, y, w, h) { fill(255); stroke(200); strokeWeight(1); rect(x, y, w, h, 8); noStroke(); }

function drawSystemPanel(m, x, y, w, h) {
  panel(x, y, w, h);
  const tx = x + 10, tw = w - 20, limit = y + h - 4;
  let ty = y + 8;
  fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(13.5);
  text(fitText('System availability (stages in series multiply)', tw), tx, ty); textStyle(NORMAL);
  ty += 21;

  // the scale of nines, from two to six, with the system and the SLO target marked
  const sx0 = tx + 6, sx1 = tx + tw - 6, sy = ty + 20;
  const nx = nines => sx0 + (constrain(nines, 2, 6) - 2) / 4 * (sx1 - sx0);
  const sysNines = m.U > 0 ? -Math.log10(m.U) : 99, sloNines = -Math.log10(m.sloU);
  noStroke(); fill(RED[0], RED[1], RED[2], 60); rect(sx0, sy - 4, nx(sloNines) - sx0, 8, 3);
  fill(GREEN[0], GREEN[1], GREEN[2], 70); rect(nx(sloNines), sy - 4, sx1 - nx(sloNines), 8, 3);
  textSize(10.5); textAlign(CENTER, TOP);
  const names = { 2: '99%', 3: '99.9%', 4: '99.99%', 5: '99.999%', 6: '99.9999%' };
  for (let k = 2; k <= 6; k++) {
    stroke(120); strokeWeight(1); line(nx(k), sy - 6, nx(k), sy + 6); noStroke();
    fill(90); textAlign(k === 2 ? LEFT : (k === 6 ? RIGHT : CENTER), TOP);
    text(tw > 300 ? k + ' nines' : k + '', k === 2 ? nx(k) - 4 : (k === 6 ? nx(k) + 4 : nx(k)), sy + 9);
  }
  // SLO tick and system marker
  stroke(30); strokeWeight(2); line(nx(sloNines), sy - 9, nx(sloNines), sy + 9); noStroke();
  fill(30); textSize(10.5); textAlign(CENTER, BOTTOM); textStyle(BOLD);
  const sloLbl = 'SLO ' + sloSelect.value();
  text(sloLbl, constrain(nx(sloNines), sx0 + textWidth(sloLbl) / 2 - 4, sx1 - textWidth(sloLbl) / 2 + 4), sy - 10);
  const c = m.meets ? GREEN : RED;
  fill(c[0], c[1], c[2]); stroke(255); strokeWeight(1.5);
  const mx0 = nx(sysNines);
  triangle(mx0, sy - 2, mx0 - 7, sy + 11, mx0 + 7, sy + 11); noStroke();
  textStyle(NORMAL);
  ty = sy + 30;

  const line1 = 'Downtime: ' + fmtDuration(m.downMinYear) + ' per year, ' + fmtDuration(m.downMinYear / 12) + ' per month';
  ty = drawWrapped(line1, tx, ty, tw, 12.5, 16, color(20), limit, true);
  let line2;
  if (m.outagesPerYear >= 1) line2 = 'Expected outages: about ' + (m.outagesPerYear >= 10 ? m.outagesPerYear.toFixed(0) : m.outagesPerYear.toFixed(1)) +
    ' per year, lasting ' + fmtDuration(m.meanOutageMin) + ' on average.';
  else line2 = 'Expected outages: about one every ' + (1 / m.outagesPerYear >= 100 ? 'century or more' : (1 / m.outagesPerYear).toFixed(1) + ' years') +
    ', lasting ' + fmtDuration(m.meanOutageMin) + ' on average.';
  ty = drawWrapped(line2, tx, ty, tw, 12.5, 16, color(40), limit) + 4;

  // SLO verdict
  textSize(11); textStyle(BOLD);
  const badge = m.meets ? 'MEETS SLO' : 'MISSES SLO', bw = textWidth(badge) + 14;
  fill(c[0], c[1], c[2]); rect(tx, ty, bw, 17, 4);
  fill(255); textAlign(CENTER, CENTER); text(badge, tx + bw / 2, ty + 8.5); textStyle(NORMAL);
  const budget = m.sloU * MIN_PER_YEAR;
  const verdict = 'The ' + sloSelect.value() + ' target allows ' + fmtDuration(budget) + ' of downtime per year; this design ' +
    (m.meets ? 'uses ' + fmtDuration(m.downMinYear) + '.' : 'needs ' + fmtDuration(m.downMinYear) + ', ' + fmtDuration(m.downMinYear - budget) + ' too much.');
  ty = drawWrapped(verdict, tx + bw + 8, ty + 1, tw - bw - 8, 12.5, 16, color(30), limit) + 5;
  drawWrapped('Assumes replicas fail independently; shared causes (one bug, one zone, one deployment) reduce the ' +
    'gain. Illustrative inputs.', tx, ty, tw, 11.5, 14.5, color(100), limit);
}

function drawStagePanel(m, x, y, w, h) {
  panel(x, y, w, h);
  const tx = x + 10, tw = w - 20, limit = y + h - 4;
  let ty = y + 8;
  fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(13.5);
  text(fitText('Downtime per year, by stage', tw), tx, ty); textStyle(NORMAL);
  ty += 22;
  const nameW = Math.min(96, tw * 0.36), valW = 62, barX = tx + nameW, barW = tw - nameW - valW;
  const maxU = Math.max(...m.stages.map(st => st.U));
  for (let i = 0; i < m.stages.length; i++) {
    const st = m.stages[i], weak = i === m.weakest && m.stages.length > 1;
    textSize(12); textAlign(LEFT, CENTER); textStyle(i === selected ? BOLD : NORMAL);
    fill(weak ? color(RED[0], RED[1], RED[2]) : color(30));
    text(fitText(st.s.name, nameW - 4), tx, ty + 6);
    fill(236, 239, 242); rect(barX, ty, barW, 12, 3);
    fill(weak ? color(RED[0], RED[1], RED[2]) : color(BLUE[0], BLUE[1], BLUE[2]));
    rect(barX, ty, Math.max(1.5, barW * st.U / maxU), 12, 3);
    fill(30); textStyle(NORMAL); textAlign(RIGHT, CENTER); textSize(11.5);
    text(fmtDuration(st.U * MIN_PER_YEAR), tx + tw, ty + 6);
    ty += 17;
  }
  ty += 4;
  stroke(225); strokeWeight(1); line(tx, ty, tx + tw, ty); noStroke();
  ty += 6;
  const st = m.stages[selected], s = st.s;
  const pct = m.sumU > 0 ? st.U / m.sumU * 100 : 0;
  const share = pct > 0 && pct < 1 ? 'under 1' : '' + Math.round(pct);
  ty = drawWrapped('Selected: ' + s.name, tx, ty, tw, 12.5, 16, color(NAVY[0], NAVY[1], NAVY[2]), limit, true);
  const rep = s.n === 1 ? 'One replica' : s.n + ' replicas';
  const msg = rep + ' at ' + s.avail + ', each with MTBF ' + fmtMtbf(st.mtbf) + ' and MTTR ' + s.mttr + ' min. ' +
    (s.n > 1 ? 'Stage: 1 − (1 − A)^' + s.n + ' = ' + fmtAvail(st.U) + '. ' : '') +
    'It causes ' + share + '% of the downtime.';
  drawWrapped(msg, tx, ty, tw, 12, 15.5, color(40), limit);
}

function drawControlLabels(m) {
  const big = canvasWidth >= 660;
  const s = stages[selected];
  noStroke(); fill(30); textAlign(LEFT, CENTER); textSize(big ? 13 : 11.5); textStyle(NORMAL);
  const y1 = drawHeight + 21, y2 = drawHeight + 57;
  if (big) text('Replica availability:', 10, y1);
  const ax = availSelect.elt.offsetLeft + availSelect.elt.offsetWidth + 10;
  text(big ? 'Replicas: ' + s.n : '×' + s.n, ax, y1);
  const rx = replicaSlider.elt.offsetLeft + replicaSlider.elt.offsetWidth + 12;
  text(big ? 'MTTR: ' + s.mttr + ' min' : s.mttr + ' min', rx, y1);
  // row 2: which stage the controls edit, and the SLO label
  const bx = removeBtn.elt.offsetLeft + removeBtn.elt.offsetWidth + 12;
  const sx = sloSelect.elt.offsetLeft;
  textAlign(RIGHT, CENTER); text(big ? 'SLO target:' : 'SLO:', sx - 6, y2);
  const room = sx - 6 - textWidth(big ? 'SLO target:' : 'SLO:') - 10 - bx;
  if (room > 80) {
    textAlign(LEFT, CENTER); fill(BLUE[0], BLUE[1], BLUE[2]); textStyle(BOLD); textSize(big ? 12.5 : 11);
    text(fitText('Editing: ' + s.name + (big ? ' (click a stage)' : ''), room), bx, y2); textStyle(NORMAL);
  }
}

// ---------- text helpers ----------
function fitText(str, maxW) {
  if (textWidth(str) <= maxW) return str;
  let s = str;
  while (s.length > 1 && textWidth(s + '…') > maxW) s = s.slice(0, -1);
  return s + '…';
}

// Draw word-wrapped text and return the y just below it. Stops at yLimit.
function drawWrapped(str, x, y, w, size, lineH, col, yLimit, bold) {
  textSize(size); textAlign(LEFT, TOP); textStyle(bold ? BOLD : NORMAL); noStroke(); fill(col);
  const lines = [];
  let ln = '';
  for (const wd of str.split(' ')) {
    const t = ln ? ln + ' ' + wd : wd;
    if (textWidth(t) > w && ln) { lines.push(ln); ln = wd; } else ln = t;
  }
  if (ln) lines.push(ln);
  for (let i = 0; i < lines.length; i++) {
    if (y + lineH > yLimit) break;
    const lastFit = (y + 2 * lineH > yLimit) && i < lines.length - 1;
    text(lastFit ? fitText(lines[i] + ' …', w) : lines[i], x, y);
    y += lineH;
  }
  textStyle(NORMAL);
  return y;
}

// ---------- interaction ----------
function mousePressed() {
  if (mouseY < 38 || mouseY > 214) return;
  for (const c of colHits) {
    if (mouseX >= c.x0 && mouseX < c.x1) { selected = c.i; syncControls(); return; }
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
