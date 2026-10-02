// Vertical vs. Horizontal Scaling Tradeoffs
// CANVAS_HEIGHT: 500
// Bloom L4 (Analyze): students COMPARE scaling up with scaling out for one workload. The left
// chart shows the cost curve and hard ceiling of vertical scaling; the right chart shows the
// throughput curve of horizontal scaling flattening against Amdahl's limit. Sliders for load,
// growth, and the parallelizable fraction update both charts, the time each strategy lasts,
// and a plain-language reading of the result. No animation: the curves are the content.
//
// ILLUSTRATIVE MODEL, not vendor data:
//   one baseline node handles 1,000 requests per second;
//   vertical: sizes 1x to 16x, capacity proportional to size, cost triples with each doubling
//             (the chapter's "doubling CPU often triples cost");
//   horizontal: n baseline nodes, speedup S(n) = 1 / ((1 - p) + p / n)   (Amdahl's Law),
//               cost proportional to n.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const NODE_RPS = 1000;                    // capacity of one baseline node (illustrative)
const SIZES = [1, 2, 4, 8, 16];           // vertical instance sizes, in baseline units
const MAX_SIZE = 16;
const BLUE = [25, 118, 210], RED = [198, 40, 40], GREEN = [46, 125, 50], PURPLE = [123, 31, 162];

// Workload presets set the parallelizable fraction p (illustrative values the student can change).
const WORKLOADS = [
  { name: 'Stateless service', p: 0.95,
    note: 'Stateless requests share almost nothing, so p is high and scaling out is the natural fit. It also adds fault isolation.' },
  { name: 'Stateful service', p: 0.80,
    note: 'State held on each node must be externalized or kept sticky. The coordination that remains is the serial fraction.' },
  { name: 'Database, write-heavy', p: 0.60,
    note: 'A single writer serializes the work, and read replicas do not help writes. Raise p by sharding or partitioning before adding nodes.' }
];

let workloadSelect, loadSlider, growthSlider, pSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const main = document.querySelector('main');
  canvas.parent(main);
  textSize(defaultTextSize);

  workloadSelect = createSelect(); workloadSelect.parent(main);
  for (const w of WORKLOADS) workloadSelect.option(w.name);
  workloadSelect.changed(() => { pSlider.value(WORKLOADS[workloadSelect.elt.selectedIndex].p); });
  loadSlider = createSlider(500, 10000, 2000, 100); loadSlider.parent(main);
  growthSlider = createSlider(5, 50, 15, 1); growthSlider.parent(main);
  pSlider = createSlider(0.5, 1, WORKLOADS[0].p, 0.01); pSlider.parent(main);

  layout();
  describe('Two charts compare scaling strategies. The left chart plots the relative cost of a single ' +
    'larger instance against its size, up to a hard ceiling at the largest size. The right chart plots ' +
    'throughput against the number of nodes, bending toward the limit set by Amdahl\'s Law. A workload ' +
    'menu and sliders for current load, monthly growth, and the parallelizable fraction update the ' +
    'charts, the months until each strategy saturates, and a written interpretation.', LABEL);
}

function labelWidth() { return canvasWidth >= 640 ? 196 : 112; }

function layout() {
  const colW = (canvasWidth - 20) / 2, lw = labelWidth();
  const sw = Math.max(50, colW - lw - 16);
  workloadSelect.position(10 + (canvasWidth >= 640 ? 76 : 0), drawHeight + (canvasWidth >= 640 ? 11 : 18));
  workloadSelect.size(canvasWidth >= 640 ? Math.min(210, colW - 90) : colW - 12);
  loadSlider.position(10 + colW + lw, drawHeight + 10); loadSlider.size(sw);
  growthSlider.position(10 + lw, drawHeight + 45); growthSlider.size(sw);
  pSlider.position(10 + colW + lw, drawHeight + 45); pSlider.size(sw);
}

// ---------- model ----------
function speedup(n, p) { return 1 / ((1 - p) + p / n); }

function scalingModel() {
  const load = loadSlider.value();
  const g = growthSlider.value() / 100;
  const p = pSlider.value();
  const s = load / NODE_RPS;                               // load in baseline-node units
  const m = { load: load, g: g, p: p, s: s, workload: WORKLOADS[workloadSelect.elt.selectedIndex] };

  // vertical: smallest instance size that carries the load
  m.vCeiling = MAX_SIZE * NODE_RPS;
  m.vSize = SIZES.find(z => z >= s) || null;               // null = even the largest is too small
  m.vCost = m.vSize ? Math.pow(3, Math.log2(m.vSize)) : null;
  m.vMonths = load >= m.vCeiling ? 0 : Math.log(m.vCeiling / load) / Math.log(1 + g);

  // horizontal: Amdahl's Law
  m.limit = p >= 0.9999 ? Infinity : 1 / (1 - p);          // maximum speedup with unlimited nodes
  m.hLimitRps = m.limit * NODE_RPS;
  m.wallNodes = isFinite(m.limit) ? Math.ceil(9 * p / (1 - p) - 1e-9) : Infinity;   // nodes for 90% of the limit
  m.hCeiling = isFinite(m.limit) ? 0.9 * m.hLimitRps : Infinity;
  if (s <= 1) m.hNodes = 1;
  else if (s >= m.limit) m.hNodes = null;                  // unreachable at any node count
  else m.hNodes = Math.ceil(p / (1 / s - (1 - p)) - 1e-9);
  m.hMonths = !isFinite(m.hCeiling) ? Infinity : (load >= m.hCeiling ? 0 : Math.log(m.hCeiling / load) / Math.log(1 + g));
  return m;
}

function fmt(v) { return Math.round(v).toLocaleString('en-US'); }
function fmtMonths(t) {
  if (!isFinite(t)) return 'no limit';
  if (t <= 0) return 'saturated now';
  return t >= 100 ? Math.round(t) + ' months' : t.toFixed(1) + ' months';
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

  const m = scalingModel();
  const narrow = canvasWidth < 640;
  noStroke(); fill(25, 45, 90); textAlign(LEFT, TOP); textStyle(BOLD); textSize(narrow ? 14.5 : 18);
  text(narrow ? 'Vertical vs. Horizontal Scaling' : 'Vertical vs. Horizontal Scaling Tradeoffs', margin, 10);
  textStyle(NORMAL);
  if (canvasWidth >= 700) {
    fill(95); textAlign(RIGHT, TOP); textSize(11.5);
    text('Illustrative model: one baseline node handles 1,000 req/s.', canvasWidth - margin, 14);
  }

  const x0 = margin, full = canvasWidth - margin * 2, gap = 8, top = 38;
  const half = (full - gap) / 2;
  if (!narrow) {
    const chartH = 196, lowerTop = top + chartH + gap, lowerH = drawHeight - 8 - lowerTop;
    drawVertical(m, x0, top, half, chartH);
    drawHorizontal(m, x0 + half + gap, top, half, chartH);
    drawTimes(m, x0, lowerTop, Math.round(full * 0.42), lowerH);
    drawReading(m, x0 + Math.round(full * 0.42) + gap, lowerTop, full - Math.round(full * 0.42) - gap, lowerH);
  } else {
    const chartH = 150, timesH = 78;
    drawVertical(m, x0, top, half, chartH);
    drawHorizontal(m, x0 + half + gap, top, half, chartH);
    drawTimes(m, x0, top + chartH + gap, full, timesH);
    const ry = top + chartH + timesH + gap * 2;
    drawReading(m, x0, ry, full, drawHeight - 8 - ry);
  }
  drawControlLabels(m);
}

function panel(x, y, w, h, title, col) {
  fill(255); stroke(200); strokeWeight(1); rect(x, y, w, h, 8); noStroke();
  fill(col[0], col[1], col[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(12.5);
  text(fitText(title, w - 16), x + 9, y + 7); textStyle(NORMAL);
}

// Left chart: one bigger machine. Cost against instance size, with the hard ceiling.
function drawVertical(m, x, y, w, h) {
  const small = w < 260;
  panel(x, y, w, h, small ? 'Vertical: scale up' : 'Vertical: one bigger machine', PURPLE);
  const px = x + (small ? 30 : 42), pw = w - (small ? 30 : 42) - 14, py = y + 48, ph = h - 48 - (small ? 22 : 32);
  // status line under the title: what the current load needs
  noStroke(); textAlign(LEFT, TOP); textSize(12); textStyle(BOLD);
  if (m.vSize) { fill(30); text(fitText('Needs a ' + m.vSize + '× instance, cost ' + fmt(m.vCost), w - 18), x + 9, y + 24); }
  else { fill(RED[0], RED[1], RED[2]); text(fitText('Load exceeds the largest instance', w - 18), x + 9, y + 24); }
  textStyle(NORMAL);
  const maxCost = 81;
  const xs = z => px + pw * Math.log2(z) / 4;               // sizes 1..16 evenly spaced (log scale)
  const ys = c => py + ph - ph * c / maxCost;
  // axes and grid
  stroke(225); strokeWeight(1);
  for (const c of [27, 54, 81]) line(px, ys(c), px + pw, ys(c));
  stroke(140); line(px, py, px, py + ph); line(px, py + ph, px + pw, py + ph); noStroke();
  fill(90); textSize(10.5); textAlign(RIGHT, CENTER);
  for (const c of [0, 27, 54, 81]) text(c, px - 4, ys(c));
  textAlign(CENTER, TOP);
  for (const z of SIZES) text(z + '×', xs(z), py + ph + 3);
  if (!small) text('instance size (baseline = 1×)', px + pw / 2, py + ph + 16);
  push(); translate(x + 10, py + ph / 2); rotate(-HALF_PI); textAlign(CENTER, CENTER); text('relative cost', 0, 0); pop();
  // reference: the same capacity bought as baseline nodes (cost proportional to size)
  stroke(150); strokeWeight(1.3); drawingContext.setLineDash([4, 4]); noFill();
  beginShape(); for (const z of SIZES) vertex(xs(z), ys(z)); endShape();
  drawingContext.setLineDash([]);
  // cost curve
  stroke(PURPLE[0], PURPLE[1], PURPLE[2]); strokeWeight(2.5); noFill();
  beginShape();
  for (let i = 0; i <= 40; i++) { const z = Math.pow(2, i / 10); vertex(xs(z), ys(Math.pow(z, Math.log2(3)))); }
  endShape();
  noStroke();
  for (const z of SIZES) {
    const on = z === m.vSize;
    fill(on ? color(255, 193, 7) : color(PURPLE[0], PURPLE[1], PURPLE[2]));
    stroke(on ? color(60) : color(255)); strokeWeight(on ? 2 : 1);
    circle(xs(z), ys(Math.pow(3, Math.log2(z))), on ? 13 : 7); noStroke();
  }
  // ceiling
  stroke(RED[0], RED[1], RED[2]); strokeWeight(1.5); drawingContext.setLineDash([5, 4]);
  line(xs(16), py - 2, xs(16), py + ph); drawingContext.setLineDash([]); noStroke();
  fill(RED[0], RED[1], RED[2]); textSize(11); textStyle(BOLD); textAlign(RIGHT, TOP);
  text(pw < 300 ? 'ceiling' : 'ceiling: largest size', xs(16) - 5, py - 1); textStyle(NORMAL);
  if (!small) { fill(110); textAlign(LEFT, TOP); textSize(11); text('dashed: cost if it scaled linearly', px + 6, py + 2); }
}

// Right chart: more machines. Throughput against node count, flattening at Amdahl's limit.
function drawHorizontal(m, x, y, w, h) {
  const small = w < 260;
  panel(x, y, w, h, small ? 'Horizontal: scale out' : 'Horizontal: more machines', BLUE);
  const px = x + (small ? 36 : 48), pw = w - (small ? 36 : 48) - 14, py = y + 48, ph = h - 48 - (small ? 22 : 32);
  noStroke(); textAlign(LEFT, TOP); textSize(12); textStyle(BOLD);
  if (m.hNodes) { fill(30); text(fitText('Needs ' + m.hNodes + (m.hNodes === 1 ? ' node' : ' nodes') + ', cost ' + m.hNodes, w - 18), x + 9, y + 24); }
  else { fill(RED[0], RED[1], RED[2]); text(fitText('Load is above the limit: unreachable', w - 18), x + 9, y + 24); }
  textStyle(NORMAL);
  const finite = isFinite(m.limit);
  const xMax = finite ? constrain(Math.ceil(m.wallNodes * 1.25 / 8) * 8, 16, 256) : 32;
  const yMax = finite ? Math.max(m.hLimitRps * 1.15, m.load * 1.15) : xMax * NODE_RPS;
  const xs = n => px + pw * (n - 1) / (xMax - 1);
  const ys = v => py + ph - ph * Math.min(v, yMax) / yMax;
  // axes
  stroke(140); strokeWeight(1); line(px, py, px, py + ph); line(px, py + ph, px + pw, py + ph); noStroke();
  fill(90); textSize(10.5); textAlign(RIGHT, CENTER);
  text('0', px - 4, ys(0));
  text(fmtK(yMax), px - 4, py + 4);
  textAlign(CENTER, TOP);
  text('1', xs(1), py + ph + 3); text(xMax, xs(xMax), py + ph + 3);
  text(Math.round(xMax / 2), xs(xMax / 2), py + ph + 3);
  if (!small) text('number of nodes', px + pw / 2, py + ph + 16);
  if (!small) { push(); translate(x + 10, py + ph / 2); rotate(-HALF_PI); textAlign(CENTER, CENTER); text('throughput (req/s)', 0, 0); pop(); }
  // ideal linear scaling (dashed), clipped to the plot
  const nTop = Math.min(xMax, yMax / NODE_RPS);
  stroke(150); strokeWeight(1.3); drawingContext.setLineDash([4, 4]);
  line(xs(1), ys(NODE_RPS), xs(nTop), ys(nTop * NODE_RPS)); drawingContext.setLineDash([]);
  // Amdahl limit
  if (finite) {
    stroke(RED[0], RED[1], RED[2]); strokeWeight(1.5); drawingContext.setLineDash([5, 4]);
    line(px, ys(m.hLimitRps), px + pw, ys(m.hLimitRps)); drawingContext.setLineDash([]); noStroke();
    fill(RED[0], RED[1], RED[2]); textSize(11); textStyle(BOLD); textAlign(RIGHT, BOTTOM);
    text(fitText((small ? 'limit ' : 'Amdahl limit ') + fmt(m.hLimitRps) + ' req/s', pw - 4), px + pw - 2, ys(m.hLimitRps) - 2);
    textStyle(NORMAL);
  }
  // throughput curve
  stroke(BLUE[0], BLUE[1], BLUE[2]); strokeWeight(2.5); noFill();
  beginShape();
  for (let i = 0; i <= 80; i++) { const n = 1 + (xMax - 1) * i / 80; vertex(xs(n), ys(speedup(n, m.p) * NODE_RPS)); }
  endShape(); noStroke();
  // the wall: where 90% of the limit is reached
  if (finite && m.wallNodes <= xMax) {
    stroke(60); strokeWeight(1.3); drawingContext.setLineDash([3, 3]);
    line(xs(m.wallNodes), py + ph, xs(m.wallNodes), ys(m.hCeiling)); drawingContext.setLineDash([]); noStroke();
    fill(40); textSize(11); textStyle(BOLD);
    const lbl = small ? m.wallNodes + ' nodes' : 'wall: ' + m.wallNodes + ' nodes';
    const lx = xs(m.wallNodes) - 5;
    let ly = ys(m.hCeiling) + (small ? 16 : 22);
    if (ys(m.load) > ly - 4 && ys(m.load) < ly + 15) ly = py + ph - 17;     // keep clear of the load line
    textAlign(RIGHT, TOP); text(lbl, lx, ly); textStyle(NORMAL);
    fill(60); circle(xs(m.wallNodes), ys(m.hCeiling), 7);
  }
  // current load and the nodes it needs
  stroke(GREEN[0], GREEN[1], GREEN[2]); strokeWeight(1.5);
  if (m.load < yMax) line(px, ys(m.load), px + pw, ys(m.load));
  noStroke();
  if (m.hNodes && m.hNodes <= xMax) {
    fill(255, 193, 7); stroke(60); strokeWeight(2); circle(xs(m.hNodes), ys(m.load), 13); noStroke();
  }
  // label the load line at its right end unless it would sit on the limit label
  const clearOfLimit = !finite || Math.abs(ys(m.load) - ys(m.hLimitRps)) > 30;
  if (!small && clearOfLimit && m.load < yMax * 0.95) {
    fill(GREEN[0], GREEN[1], GREEN[2]); textSize(11); textStyle(BOLD); textAlign(RIGHT, BOTTOM);
    text('current load', px + pw - 3, ys(m.load) - 2); textStyle(NORMAL);
  }
}

function fmtK(v) { return v >= 10000 ? Math.round(v / 1000) + 'k' : (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : '' + Math.round(v)); }

// Months until each strategy saturates at the chosen growth rate.
function drawTimes(m, x, y, w, h) {
  panel(x, y, w, h, 'Time to saturation at +' + Math.round(m.g * 100) + '% per month', [25, 45, 90]);
  const tall = h > 120;
  const rows = [
    { name: 'Vertical', sub: 'ceiling ' + fmt(m.vCeiling) + ' req/s', t: m.vMonths, col: PURPLE },
    { name: 'Horizontal', sub: isFinite(m.hCeiling) ? '90% of limit, ' + fmt(m.hCeiling) + ' req/s' : 'p = 1: no Amdahl limit', t: m.hMonths, col: BLUE }
  ];
  const scale = 36;                                          // months shown at full bar width
  const bx = x + 84, bw = w - 84 - 96;
  let ry = y + (tall ? 32 : 27);
  const rowH = tall ? 42 : 23;
  for (const r of rows) {
    noStroke(); fill(30); textAlign(LEFT, TOP); textSize(12.5); textStyle(BOLD); text(r.name, x + 10, ry); textStyle(NORMAL);
    fill(232, 236, 240); rect(bx, ry + 1, bw, 13, 3);
    const frac = !isFinite(r.t) ? 1 : constrain(r.t / scale, 0, 1);
    fill(r.t <= 0 ? color(RED[0], RED[1], RED[2]) : color(r.col[0], r.col[1], r.col[2]));
    rect(bx, ry + 1, Math.max(r.t <= 0 ? 0 : 3, bw * frac), 13, 3);
    fill(r.t <= 0 ? color(RED[0], RED[1], RED[2]) : color(30)); textStyle(BOLD); textSize(12);
    text(fmtMonths(r.t), bx + bw + 6, ry);
    textStyle(NORMAL);
    if (tall) { fill(100); textSize(11); text(fitText(r.sub, w - 20), x + 10, ry + 18); }
    ry += rowH;
  }
  if (tall) {
    // fault isolation: what one machine failure removes
    const n = m.hNodes || 0;
    const msg = 'One machine fails: vertical loses 100% of capacity' +
      (n > 1 ? '; horizontal (' + n + ' nodes) loses about ' + Math.round(100 / n) + '%.'
        : (n === 1 ? '; horizontal with 1 node loses 100% too.' : '; horizontal cannot carry this load at any size.'));
    drawWrapped(msg, x + 10, ry + 2, w - 20, 11.5, 15, color(90, 60, 0), y + h - 4);
  }
}

// Plain-language interpretation of the current settings.
function drawReading(m, x, y, w, h) {
  panel(x, y, w, h, 'Reading the result', [25, 45, 90]);
  const tx = x + 10, tw = w - 20, limit = y + h - 4;
  let ty = y + 27;
  const size = w > 420 ? 12.5 : 12, lh = w > 420 ? 16 : 15;
  let wall;
  if (!isFinite(m.limit)) wall = 'With p = 1 nothing is serial, so throughput grows linearly with nodes and there is no Amdahl limit.';
  else wall = 'Given these parameters, horizontal scaling hits Amdahl\'s wall at ' + m.wallNodes + ' nodes: that is 90% of the ' +
    m.limit.toFixed(1) + '× limit (1 ÷ (1 − p)), and further nodes add almost nothing.';
  ty = drawWrapped(wall, tx, ty, tw, size, lh, color(25), limit) + 3;
  let verdict;
  if (!m.hNodes && !m.vSize) verdict = 'Neither strategy can carry this load. The architecture has to change: reduce the serial fraction.';
  else if (!m.hNodes) verdict = 'Adding nodes cannot reach this load at all. Scale up for now and reduce the serial fraction.';
  else if (!m.vSize) verdict = 'No single instance is large enough; only scaling out can carry this load.';
  else if (m.hMonths < m.vMonths) verdict = 'Scaling out saturates first (' + fmtMonths(m.hMonths) + ' vs. ' + fmtMonths(m.vMonths) +
    '). More nodes will not buy time; a higher p will.';
  else verdict = 'Scaling out lasts longer (' + fmtMonths(m.hMonths) + ' vs. ' + fmtMonths(m.vMonths) + ') and survives the loss of a node.';
  ty = drawWrapped(verdict, tx, ty, tw, size, lh, color(120, 20, 20), limit) + 3;
  drawWrapped(m.workload.name + ': ' + m.workload.note, tx, ty, tw, size, lh, color(70), limit);
}

function drawControlLabels(m) {
  const big = canvasWidth >= 640;
  const colW = (canvasWidth - 20) / 2;
  noStroke(); fill(30); textAlign(LEFT, CENTER); textSize(big ? 13 : 11.5);
  if (big) text('Workload:', 10, drawHeight + 21);
  else { textSize(10.5); fill(90); text('Workload', 10, drawHeight + 9); fill(30); textSize(11.5); }
  text((big ? 'Current load: ' : 'Load: ') + fmt(m.load) + (big ? ' req/s' : ''), 10 + colW, drawHeight + 20);
  text((big ? 'Growth: ' : 'Growth: ') + Math.round(m.g * 100) + (big ? '% per month' : '%/mo'), 10, drawHeight + 55);
  text((big ? 'Parallelizable fraction p: ' : 'Parallel p: ') + m.p.toFixed(2), 10 + colW, drawHeight + 55);
}

// ---------- text helpers ----------
function fitText(str, maxW) {
  if (textWidth(str) <= maxW) return str;
  let s = str;
  while (s.length > 1 && textWidth(s + '…') > maxW) s = s.slice(0, -1);
  return s + '…';
}

function drawWrapped(str, x, y, w, size, lineH, col, yLimit) {
  textSize(size); textAlign(LEFT, TOP); textStyle(NORMAL); noStroke(); fill(col);
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
  return y;
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
