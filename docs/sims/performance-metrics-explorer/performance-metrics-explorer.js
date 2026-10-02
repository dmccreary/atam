// Performance Metric Relationships (Little's Law explorer)
// CANVAS_HEIGHT: 545
// Bloom L3 (Apply): students USE Little's Law (L = lambda x W) to relate arrival rate,
// service time, concurrency, throughput, and response time. Three sliders change the
// workload and every number, the latency distribution, and the queue update at once, so
// students can predict a result, move a slider, and check it.
//
// Model: an M/M/c queue (random arrivals, exponentially distributed service times, c
// parallel workers, first come first served). Little's Law itself holds for any stable
// system; the shape of the latency distribution is specific to this model. Nothing here is
// a measurement of a real product.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;
let sliderLeftMargin = 230;

const GREEN = [46, 125, 50], AMBER = [239, 108, 0], RED = [198, 40, 40], BLUE = [25, 118, 210];

let rateSlider, serviceSlider, limitSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const main = document.querySelector('main');
  canvas.parent(main);
  textSize(defaultTextSize);

  rateSlider = createSlider(10, 1000, 200, 10); rateSlider.parent(main);
  serviceSlider = createSlider(1, 500, 50, 1); serviceSlider.parent(main);
  limitSlider = createSlider(1, 100, 12, 1); limitSlider.parent(main);

  layout();
  describe('A queueing model with three sliders: arrival rate in requests per second, service time ' +
    'in milliseconds, and a concurrency limit. Four panels update together: a diagram of the queue ' +
    'and the busy workers, a worked Little\'s Law calculation of the number of requests in the system, ' +
    'a histogram of response time with 50th, 95th, and 99th percentile markers, and a throughput ' +
    'gauge. When arrival rate times service time exceeds the concurrency limit, the queue grows ' +
    'without bound and the panels turn red.', LABEL);
}

function layout() {
  sliderLeftMargin = canvasWidth >= 560 ? 230 : 178;
  const w = canvasWidth - sliderLeftMargin - 20;
  rateSlider.position(sliderLeftMargin, drawHeight + 10); rateSlider.size(w);
  serviceSlider.position(sliderLeftMargin, drawHeight + 45); serviceSlider.size(w);
  limitSlider.position(sliderLeftMargin, drawHeight + 80); limitSlider.size(w);
}

// ---------- queueing model ----------
// Erlang C: probability that an arriving request has to wait, for c workers and offered load a.
function erlangC(c, a) {
  let b = 1;                                   // Erlang B by the stable recurrence
  for (let k = 1; k <= c; k++) b = a * b / (k + a * b);
  return c * b / (c - a * (1 - b));
}

function queueModel() {
  const lambda = rateSlider.value();           // requests per second
  const S = serviceSlider.value();             // service time in ms
  const c = limitSlider.value();               // concurrency limit (parallel workers)
  const a = lambda * S / 1000;                 // offered load: workers needed on average
  const capacity = c * 1000 / S;               // requests per second the workers can finish
  const m = { lambda: lambda, S: S, c: c, a: a, capacity: capacity, rho: a / c, stable: a < c * 0.999 };
  if (!m.stable) {
    m.throughput = capacity;
    m.growth = lambda - capacity;              // queue growth, requests per second
    return m;
  }
  const mu = 1 / S, lam = lambda / 1000;       // per millisecond
  const theta = c * mu - lam;                  // rate at which a waiting queue drains
  const C = erlangC(c, a);
  m.pWait = C;
  m.Wq = C / theta;                            // mean wait in queue, ms
  m.W = m.Wq + S;                              // mean response time, ms
  m.Lq = lam * m.Wq;                           // Little's Law applied to the queue
  m.L = lam * m.W;                             // Little's Law applied to the whole system
  m.throughput = lambda;
  // P(response time > t): no wait with probability 1 - C, otherwise an exponential wait
  // (rate theta) followed by an exponential service time (rate mu).
  m.survival = (t) => {
    const noWait = Math.exp(-mu * t);
    const both = Math.abs(theta - mu) < 1e-9 * mu
      ? Math.exp(-mu * t) * (1 + mu * t)
      : (mu * Math.exp(-theta * t) - theta * Math.exp(-mu * t)) / (mu - theta);
    return (1 - C) * noWait + C * both;
  };
  m.percentile = (p) => {
    let hi = S;
    while (m.survival(hi) > 1 - p && hi < 1e9) hi *= 2;
    let lo = 0;
    for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (m.survival(mid) > 1 - p) lo = mid; else hi = mid; }
    return hi;
  };
  m.p50 = m.percentile(0.50); m.p95 = m.percentile(0.95); m.p99 = m.percentile(0.99);
  return m;
}

function fmtMs(ms) {
  if (ms >= 10000) return (ms / 1000).toFixed(1) + ' s';
  if (ms >= 1000) return (ms / 1000).toFixed(2) + ' s';
  if (ms >= 100) return Math.round(ms) + ' ms';
  if (ms >= 10) return ms.toFixed(1) + ' ms';
  return ms.toFixed(2) + ' ms';
}
function fmtN(v) {
  if (v >= 1000) return Math.round(v).toLocaleString('en-US');
  if (v >= 100) return v.toFixed(0);
  if (v >= 10) return v.toFixed(1);
  return v.toFixed(2);
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

  const m = queueModel();
  const narrow = canvasWidth < 640;
  noStroke(); fill(25, 45, 90); textAlign(LEFT, TOP); textStyle(BOLD); textSize(narrow ? 14.5 : 18);
  text(narrow ? 'Performance Metrics: Little\'s Law' : 'Performance Metric Relationships: Little\'s Law', margin, 10);
  // state badge
  const badge = m.stable ? 'STABLE  ·  ' + Math.round(m.rho * 100) + '% utilized' : 'SATURATED: queue growing';
  textSize(narrow ? 11 : 12.5);
  const bw = textWidth(badge) + 18;
  const bc = m.stable ? (m.rho > 0.9 ? AMBER : GREEN) : RED;
  if (canvasWidth - margin - bw > (narrow ? 235 : 420)) {
    fill(bc[0], bc[1], bc[2]); rect(canvasWidth - margin - bw, 8, bw, 22, 11);
    fill(255); textAlign(CENTER, CENTER); text(badge, canvasWidth - margin - bw / 2, 19.5);
  }
  textStyle(NORMAL);

  const x0 = margin, full = canvasWidth - margin * 2, gap = 8, top = 38;
  const bottom = drawHeight - 8;
  if (!narrow) {
    const h1 = 170, h2 = bottom - top - h1 - gap;
    const wA = Math.round(full * 0.56), wC = Math.round(full * 0.62);
    drawSystem(m, x0, top, wA, h1);
    drawLittle(m, x0 + wA + gap, top, full - wA - gap, h1);
    drawHistogram(m, x0, top + h1 + gap, wC, h2);
    drawGauge(m, x0 + wC + gap, top + h1 + gap, full - wC - gap, h2);
  } else {
    const hA = 104, hB = 104, hC = bottom - top - hA - hB - gap * 2;
    const wC = Math.round(full * 0.58);
    drawSystem(m, x0, top, full, hA);
    drawLittle(m, x0, top + hA + gap, full, hB);
    drawHistogram(m, x0, top + hA + hB + gap * 2, wC, hC);
    drawGauge(m, x0 + wC + gap, top + hA + hB + gap * 2, full - wC - gap, hC);
  }
  drawControlLabels(m);
}

function panel(x, y, w, h, title, alarm) {
  fill(alarm ? color(255, 235, 238) : color(255));
  stroke(alarm ? color(RED[0], RED[1], RED[2]) : color(200)); strokeWeight(alarm ? 1.8 : 1);
  rect(x, y, w, h, 8); noStroke();
  fill(25, 45, 90); textAlign(LEFT, TOP); textStyle(BOLD); textSize(12.5);
  text(fitText(title, w - 16), x + 9, y + 7); textStyle(NORMAL);
}

// Panel A: arrivals -> queue -> workers -> throughput
function drawSystem(m, x, y, w, h) {
  panel(x, y, w, h, 'The system: queue and workers', !m.stable);
  const tall = h > 130;
  const cy = y + (tall ? 84 : 60);
  const inX = x + 10, qx = x + w * 0.20, qw = w * 0.27, wx = x + w * 0.54, ww = w * 0.27;
  const boxH = tall ? 66 : 44, by = cy - boxH / 2;
  // arrivals
  noStroke(); fill(40); textAlign(LEFT, BOTTOM); textSize(11.5);
  text('λ = ' + m.lambda, inX, cy - 6);
  textAlign(LEFT, TOP); text('req/s in', inX, cy + 5);
  arrow(inX, cy, qx - 4, cy, BLUE);
  // queue box
  const qCol = m.stable ? [84, 110, 122] : RED;
  fill(255); stroke(qCol[0], qCol[1], qCol[2]); strokeWeight(1.5); rect(qx, by, qw, boxH, 5); noStroke();
  const waiting = m.stable ? m.Lq : Infinity;
  const dotR = 7, perRow = Math.max(1, Math.floor((qw - 8) / (dotR + 2)));
  const rows = Math.max(1, Math.floor((boxH - 8) / (dotR + 2)));
  const shown = m.stable ? Math.min(Math.round(waiting), perRow * rows) : perRow * rows;
  fill(qCol[0], qCol[1], qCol[2]);
  for (let i = 0; i < shown; i++) {                 // fill from the right, next to the workers
    const col = i % perRow, row = Math.floor(i / perRow);
    circle(qx + qw - 7 - col * (dotR + 2), by + 7 + row * (dotR + 2), dotR);
  }
  fill(m.stable ? color(40) : color(RED[0], RED[1], RED[2])); textAlign(CENTER, TOP); textSize(11.5); textStyle(BOLD);
  text(m.stable ? fmtN(m.Lq) + ' waiting' : '+' + fmtN(m.growth) + ' per second', qx + qw / 2, by + boxH + 3);
  textStyle(NORMAL); fill(90); textAlign(CENTER, BOTTOM);
  text('Queue', qx + qw / 2, by - 2);
  arrow(qx + qw + 2, cy, wx - 4, cy, BLUE);
  // workers: one square per unit of concurrency, filled when busy
  fill(255); stroke(84, 110, 122); strokeWeight(1.5); rect(wx, by, ww, boxH, 5); noStroke();
  const cols = Math.ceil(Math.sqrt(m.c * (ww - 8) / (boxH - 8)));
  const rws = Math.ceil(m.c / cols);
  const sq = Math.min((ww - 8) / cols, (boxH - 8) / rws);
  const busy = m.stable ? m.a : m.c;
  const gx = wx + (ww - cols * sq) / 2, gy = by + (boxH - rws * sq) / 2;
  for (let i = 0; i < m.c; i++) {
    const fillFrac = constrain(busy - i, 0, 1);
    const sx = gx + (i % cols) * sq, sy = gy + Math.floor(i / cols) * sq;
    fill(226, 232, 238); rect(sx + 0.5, sy + 0.5, sq - 1, sq - 1, 1.5);
    if (fillFrac > 0) {
      const c = m.stable ? BLUE : RED;
      fill(c[0], c[1], c[2], 80 + 175 * fillFrac); rect(sx + 0.5, sy + 0.5, sq - 1, sq - 1, 1.5);
    }
  }
  fill(40); textAlign(CENTER, TOP); textSize(11.5); textStyle(BOLD);
  text(fmtN(Math.min(busy, m.c)) + ' of ' + m.c + ' busy', wx + ww / 2, by + boxH + 3);
  textStyle(NORMAL); fill(90); textAlign(CENTER, BOTTOM);
  text('Workers (limit ' + m.c + ')', wx + ww / 2, by - 2);
  // throughput out
  const ox = wx + ww + 2;
  arrow(ox, cy, x + w - 46, cy, m.stable ? GREEN : RED);
  fill(40); textAlign(RIGHT, BOTTOM); textSize(11.5);
  text(fmtN(m.throughput), x + w - 8, cy - 6);
  textAlign(RIGHT, TOP); text('req/s out', x + w - 8, cy + 5);
}

function arrow(x1, y, x2, y2, c) {
  stroke(c[0], c[1], c[2]); strokeWeight(2); line(x1, y, x2 - 5, y2); noStroke();
  fill(c[0], c[1], c[2]); triangle(x2, y2, x2 - 8, y2 - 4.5, x2 - 8, y2 + 4.5);
}

// Panel B: the Little's Law calculation with the current numbers
function drawLittle(m, x, y, w, h) {
  panel(x, y, w, h, 'Little\'s Law:  L = λ × W', !m.stable);
  const tx = x + 10, tw = w - 20, limit = y + h - 4;
  let ty = y + 28;
  const lh = h > 130 ? 17 : 15.5;
  if (!m.stable) {
    ty = line2('λ × S = ' + m.lambda + ' × ' + (m.S / 1000) + ' s = ' + fmtN(m.a) + ' workers needed', tx, ty, tw, true, RED, lh);
    ty = drawWrapped('The limit is ' + m.c + ', so work arrives faster than it can be finished.', tx, ty, tw, 12.5, lh, color(30), limit);
    ty = drawWrapped('No steady state: L and W grow without bound. After 10 s a new request waits about ' +
      fmtMs(10000 * (m.lambda / m.capacity - 1)) + '; after 60 s about ' + fmtMs(60000 * (m.lambda / m.capacity - 1)) + '.',
      tx, ty + 2, tw, 12, lh, color(120, 20, 20), limit);
    return;
  }
  ty = line2('λ = ' + m.lambda + ' req/s  (arrival rate = throughput)', tx, ty, tw, false, null, lh);
  ty = line2('W = ' + fmtMs(m.W) + '  (' + fmtMs(m.Wq) + ' waiting + ' + m.S + ' ms service)', tx, ty, tw, false, null, lh);
  ty = line2('L = ' + m.lambda + ' × ' + (m.W / 1000).toFixed(4) + ' s = ' + fmtN(m.L) + ' requests', tx, ty + 2, tw, true, BLUE, lh);
  ty = line2('= ' + fmtN(m.a) + ' in service + ' + fmtN(m.Lq) + ' waiting', tx, ty, tw, false, null, lh);
  if (ty + lh * 2 < limit) {
    drawWrapped('Offered load λ × S = ' + fmtN(m.a) + ' workers needed on average; ' +
      Math.round(m.pWait * 100) + '% of requests have to wait.', tx, ty + 3, tw, 12, lh, color(90), limit);
  }
}

function line2(str, x, y, w, bold, col, lh) {
  noStroke(); textAlign(LEFT, TOP); textSize(bold ? 13 : 12.5); textStyle(bold ? BOLD : NORMAL);
  fill(col ? color(col[0], col[1], col[2]) : color(30));
  text(fitText(str, w), x, y); textStyle(NORMAL);
  return y + lh;
}

// Panel C: response-time distribution with percentile markers
function drawHistogram(m, x, y, w, h) {
  panel(x, y, w, h, 'Response time distribution', !m.stable);
  const px = x + 14, pw = w - 28, py = y + 58, ph = h - 58 - 26;
  if (!m.stable) {
    noStroke(); fill(120, 20, 20); textAlign(CENTER, CENTER); textSize(13); textStyle(BOLD);
    text('No stable distribution', x + w / 2, y + h / 2 - 12); textStyle(NORMAL);
    drawWrapped('Each request waits longer than the one before it, so p50, p95, and p99 all keep rising.',
      x + 14, y + h / 2 + 2, w - 28, 12, 15.5, color(120, 20, 20), y + h - 4);
    return;
  }
  const tMax = Math.max(m.p99 * 1.3, m.S * 2);
  const bins = Math.max(12, Math.min(40, Math.floor(pw / 9)));
  const mass = [];
  let peak = 0;
  for (let i = 0; i < bins; i++) {
    const v = m.survival(tMax * i / bins) - m.survival(tMax * (i + 1) / bins);
    mass.push(v); if (v > peak) peak = v;
  }
  stroke(160); strokeWeight(1); line(px, py + ph, px + pw, py + ph); noStroke();
  const bwid = pw / bins;
  for (let i = 0; i < bins; i++) {
    const bh = ph * mass[i] / peak;
    fill(100, 160, 220); rect(px + i * bwid + 0.5, py + ph - bh, bwid - 1, bh);
  }
  // percentile markers
  const marks = [['p50', m.p50, GREEN], ['p95', m.p95, AMBER], ['p99', m.p99, RED]];
  textSize(11.5); textStyle(BOLD);
  let lastLabelRight = -1e9, row = 0;
  for (const mk of marks) {
    const mx = px + pw * mk[1] / tMax, c = mk[2];
    stroke(c[0], c[1], c[2]); strokeWeight(2); line(mx, py - 4, mx, py + ph); noStroke();
    const label = mk[0] + ' ' + fmtMs(mk[1]);
    const lw = textWidth(label);
    let lx = constrain(mx - lw / 2, x + 6, x + w - 6 - lw);
    row = lx < lastLabelRight + 6 ? row + 1 : 0;
    fill(c[0], c[1], c[2]); textAlign(LEFT, BOTTOM);
    text(label, lx, py - 5 - (row % 2) * 13);
    if (row === 0) lastLabelRight = lx + lw; else lastLabelRight = Math.max(lastLabelRight, lx + lw);
  }
  textStyle(NORMAL);
  // axis
  fill(90); textSize(11); textAlign(LEFT, TOP); text('0', px, py + ph + 4);
  textAlign(RIGHT, TOP); text(fmtMs(tMax), px + pw, py + ph + 4);
  textAlign(CENTER, TOP); text('response time', px + pw / 2, py + ph + 4);
}

// Panel D: throughput against capacity
function drawGauge(m, x, y, w, h) {
  panel(x, y, w, h, 'Throughput', !m.stable);
  const cx = x + w / 2;
  const R = Math.max(26, Math.min(w / 2 - 18, h - 96));
  const cy = y + 34 + R;
  // arc from 180 deg (zero) to 360 deg (capacity), colored by how close to the limit
  strokeWeight(R > 40 ? 12 : 9); noFill(); strokeCap(SQUARE);
  stroke(129, 199, 132); arc(cx, cy, R * 2, R * 2, PI, PI + PI * 0.7);
  stroke(255, 183, 77); arc(cx, cy, R * 2, R * 2, PI + PI * 0.7, PI + PI * 0.9);
  stroke(229, 115, 115); arc(cx, cy, R * 2, R * 2, PI + PI * 0.9, TWO_PI);
  strokeCap(ROUND);
  const frac = constrain(m.throughput / m.capacity, 0, 1);
  const ang = PI + PI * frac;
  stroke(30); strokeWeight(3); line(cx, cy, cx + cos(ang) * (R - 4), cy + sin(ang) * (R - 4)); noStroke();
  fill(30); circle(cx, cy, 9);
  fill(90); textSize(10.5); textAlign(LEFT, TOP); text('0', cx - R - 4, cy + 4);
  textAlign(RIGHT, TOP); text('capacity', cx + R + 6, cy + 4);
  // readout
  let ty = cy + 20;
  const tx = x + 9, tw = w - 18;
  fill(m.stable ? color(30) : color(120, 20, 20)); textAlign(CENTER, TOP); textStyle(BOLD); textSize(13);
  text(fitText(fmtN(m.throughput) + ' req/s', tw), cx, ty); textStyle(NORMAL); ty += 17;
  fill(70); textSize(11.5);
  text(fitText('capacity ' + fmtN(m.capacity) + ' req/s', tw), cx, ty); ty += 15;
  if (ty + 14 < y + h) {
    text(fitText(m.stable ? '(limit ÷ service time)' : fmtN(m.growth) + ' req/s turned into backlog', tw), cx, ty);
  }
}

function drawControlLabels(m) {
  const big = canvasWidth >= 560;
  noStroke(); fill(30); textAlign(LEFT, CENTER); textSize(big ? 13 : 11.5);
  text((big ? 'Arrival rate λ: ' : 'Arrivals λ: ') + m.lambda + ' req/s', 10, drawHeight + 20);
  text((big ? 'Service time S: ' : 'Service S: ') + m.S + ' ms', 10, drawHeight + 55);
  text((big ? 'Concurrency limit c: ' : 'Limit c: ') + m.c + (big ? ' workers' : ''), 10, drawHeight + 90);
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
