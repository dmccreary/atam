// Distributed Trace Latency What-If Explorer
// CANVAS_HEIGHT: 570
// Bloom L4 (Analyze): students PREDICT and then test how a change in one service's latency
// changes the end-to-end duration of a trace. Sliders set each service's own work; the
// waterfall, the critical path, the slack of the parallel branch, and a simulated p50/p95
// update at once. No animation: the bars are the data. (Chapter 11's Distributed Tracing
// Visualization reads one fixed trace; this sim varies the trace to find sensitivity points.)
//
// ILLUSTRATIVE MODEL, not measurements of any system:
//   API Gateway does its own work, calls Auth, then calls Product and Recommendation in
//   parallel; Product does its own work and then queries the Inventory DB.
//   total = gateway + auth + max(product + inventory, recommendation)
//   p50/p95: 2,000 simulated requests in which every span varies log-normally around its
//   slider value with its own p95 equal to twice its median.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 425;
let controlHeight = 145;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const INJECT_MS = 150;          // slowness added by clicking a span
const SLOW_QUERY_FACTOR = 5;    // "slow database query" multiplies the query time
const SIGMA = Math.log(2) / 1.645;   // log-normal spread giving p95 = 2 x median
const N_SIM = 2000;

const GREEN = [46, 125, 50], AMBER = [230, 145, 0], RED = [198, 40, 40], NAVY = [25, 45, 90], GOLD = [150, 105, 0];
const SLATE = [84, 110, 122];   // the root span: the whole request, judged against the budget instead

const SPANS = [
  { id: 'gw', name: 'API Gateway', short: 'Gateway', op: 'GET /product/42', depth: 0, def: 10 },
  { id: 'auth', name: 'Auth Service', short: 'Auth', op: 'validate token', depth: 1, def: 25 },
  { id: 'prod', name: 'Product Service', short: 'Product', op: 'get product', depth: 1, def: 30 },
  { id: 'db', name: 'Inventory DB', short: 'Inventory DB', op: 'SELECT stock', depth: 2, def: 45 },
  { id: 'rec', name: 'Recommendation Service', short: 'Recommend.', op: 'related', depth: 1, def: 60 }
];

let sliders = {}, budgetSlider, slowCheckbox, resetBtn;
let injected = {};              // span id -> true when slowness is injected
let zs = [];                    // fixed standard-normal draws, reused so results change smoothly
let simKey = '', simResult = { p50: 0, p95: 0 };
let rowHits = [];
let rowTop = 86, rowH = 30, labelW = 215, timeX0 = 227, timeX1 = 676;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const main = document.querySelector('main');
  canvas.parent(main);
  textSize(defaultTextSize);

  for (const s of SPANS) { sliders[s.id] = createSlider(1, 200, s.def, 1); sliders[s.id].parent(main); }
  budgetSlider = createSlider(100, 600, 250, 10); budgetSlider.parent(main);
  slowCheckbox = createCheckbox(' Slow database query (×5)', false); slowCheckbox.parent(main);
  slowCheckbox.style('font-size', '13px');
  resetBtn = createButton('Reset'); resetBtn.parent(main); resetBtn.mousePressed(resetAll);

  // fixed pseudo-random normal draws (mulberry32 + Box-Muller) so every run is repeatable
  let seed = 20261002;
  const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  for (let i = 0; i < N_SIM; i++) {
    const row = [];
    for (let j = 0; j < SPANS.length; j++) row.push(Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd()));
    zs.push(row);
  }

  layout();
  describe('A what-if distributed trace for a product page request. Five spans are drawn as a ' +
    'waterfall: API Gateway, Auth Service, Product Service with its Inventory database query, and ' +
    'a Recommendation Service that runs in parallel with the Product Service. Sliders set each ' +
    'service\'s own latency and the p95 budget; a checkbox slows the database query and clicking a ' +
    'span injects 150 milliseconds. The display shows the trace total, a simulated p50 and p95, ' +
    'the critical path, the slack of the parallel branch, and a banner naming the sensitivity ' +
    'point when the budget is exceeded.', LABEL);
}

function resetAll() {
  for (const s of SPANS) sliders[s.id].value(s.def);
  budgetSlider.value(250); slowCheckbox.checked(false); injected = {};
}

function ctlLabelW() { return canvasWidth >= 660 ? 190 : 110; }

function layout() {
  const colW = (canvasWidth - 20) / 2, lw = ctlLabelW();
  const sw = Math.max(50, colW - lw - 14);
  const order = ['gw', 'auth', 'prod', 'db', 'rec'];
  for (let i = 0; i < order.length; i++) {
    const col = i % 2, row = Math.floor(i / 2);
    sliders[order[i]].position(10 + col * colW + lw, drawHeight + 9 + row * 33);
    sliders[order[i]].size(sw);
  }
  budgetSlider.position(10 + colW + lw, drawHeight + 9 + 2 * 33); budgetSlider.size(sw);
  slowCheckbox.position(10, drawHeight + 112);
  resetBtn.position(canvasWidth - 10 - 58, drawHeight + 110);

  rowH = 30;
  labelW = constrain(canvasWidth * 0.315, 118, 240);
  timeX0 = labelW + margin;
  timeX1 = canvasWidth - margin - 6;
}

// ---------- trace model ----------
// effective self time of each span in ms (slider value, slow query, injected slowness)
function selfTimes() {
  const t = {};
  for (const s of SPANS) {
    let v = sliders[s.id].value();
    if (s.id === 'db' && slowCheckbox.checked()) v *= SLOW_QUERY_FACTOR;
    if (injected[s.id]) v += INJECT_MS;
    t[s.id] = v;
  }
  return t;
}

function traceTotal(t) { return t.gw + t.auth + Math.max(t.prod + t.db, t.rec); }

// start/end of every span, the critical path, and the slack of the off-path branch
function buildTrace() {
  const t = selfTimes();
  const m = { self: t, span: {}, total: traceTotal(t) };
  const fan = t.gw + t.auth;                       // moment the gateway fans out
  m.span.gw = [0, m.total];
  m.span.auth = [t.gw, fan];
  m.span.prod = [fan, fan + t.prod + t.db];
  m.span.db = [fan + t.prod, fan + t.prod + t.db];
  m.span.rec = [fan, fan + t.rec];
  const a = t.prod + t.db, b = t.rec;
  m.critical = { gw: true, auth: true, prod: a >= b, db: a >= b, rec: b >= a };
  m.slack = Math.abs(a - b);
  m.slackBranch = a === b ? null : (a > b ? 'rec' : 'prod');
  // largest self-time contributor on the critical path
  m.top = SPANS.filter(s => m.critical[s.id]).sort((x, y) => t[y.id] - t[x.id])[0];
  return m;
}

// p50 and p95 of the total over simulated requests; recomputed only when an input changes
function simulate(t) {
  const key = SPANS.map(s => t[s.id]).join(',');
  if (key === simKey) return simResult;
  const totals = new Array(N_SIM);
  for (let i = 0; i < N_SIM; i++) {
    const z = zs[i], v = {};
    for (let j = 0; j < SPANS.length; j++) v[SPANS[j].id] = t[SPANS[j].id] * Math.exp(SIGMA * z[j]);
    totals[i] = traceTotal(v);
  }
  totals.sort((x, y) => x - y);
  simKey = key;
  simResult = { p50: totals[Math.floor(N_SIM * 0.5)], p95: totals[Math.floor(N_SIM * 0.95)] };
  return simResult;
}

function spanColor(ms) { return ms > 150 ? RED : (ms >= 50 ? AMBER : GREEN); }

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

  const m = buildTrace();
  const sim = simulate(m.self);
  const budget = budgetSlider.value();
  const over = sim.p95 > budget;
  const narrow = canvasWidth < 660;

  // header: title, the trace total, and the simulated percentiles
  fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(narrow ? 14.5 : 18);
  text(narrow ? 'Trace Latency What-If' : 'Distributed Trace: Latency What-If', margin, 10);
  textAlign(RIGHT, TOP); textSize(narrow ? 13 : 16); fill(20);
  text('This trace: ' + Math.round(m.total) + ' ms', canvasWidth - margin, narrow ? 11 : 11);
  textStyle(NORMAL); textSize(12); textAlign(LEFT, TOP); fill(70);
  text(fitText(narrow ? 'Scenario: p95 ≤ ' + budget + ' ms' : 'Scenario response measure: p95 response time ≤ ' + budget + ' ms',
    canvasWidth * 0.52), margin, 35);
  textAlign(RIGHT, TOP); textStyle(BOLD);
  fill(over ? color(RED[0], RED[1], RED[2]) : color(GREEN[0], GREEN[1], GREEN[2]));
  text((narrow ? 'p50 ' : 'Estimated p50 ') + Math.round(sim.p50) + ' ms · p95 ' + Math.round(sim.p95) + ' ms', canvasWidth - margin, 35);
  textStyle(NORMAL);

  // time axis sized to hold the trace, the p95 estimate, and the budget
  const need = Math.max(m.total, sim.p95, budget) * 1.06;
  const step = need > 1200 ? 400 : (need > 600 ? 200 : (need > 300 ? 100 : 50));
  const axisMax = Math.ceil(need / step) * step;
  const tx = v => timeX0 + (v / axisMax) * (timeX1 - timeX0);

  drawAxis(axisMax, step, tx);
  drawRows(m, tx);
  drawMarkers(m, sim, budget, over, tx);
  const by = rowTop + SPANS.length * rowH + 22;
  drawBanner(m, sim, budget, over, by);
  drawReading(m, sim, by + 38);
  drawControlLabels(m, budget);

  let hot = false;
  for (const r of rowHits) if (mouseY >= r.y && mouseY < r.y + rowH && mouseX > 0 && mouseX < canvasWidth) hot = true;
  cursor(hot ? HAND : ARROW);
}

function drawAxis(axisMax, step, tx) {
  const yTop = rowTop - 6, yBot = rowTop + SPANS.length * rowH;
  textSize(11); textAlign(CENTER, BOTTOM);
  const minGap = 34;
  let lastX = -1e9;
  for (let v = 0; v <= axisMax; v += step) {
    const x = tx(v);
    stroke(214, 222, 232); strokeWeight(1); line(x, yTop, x, yBot);
    noStroke(); fill(95);
    if (x - lastX >= minGap) { text(v === 0 ? '0 ms' : v, x, yTop - 2); lastX = x; }
  }
  noStroke();
}

function drawRows(m, tx) {
  rowHits = [];
  const barH = 15;
  const showOp = canvasWidth >= 660;
  for (let i = 0; i < SPANS.length; i++) {
    const s = SPANS[i], y = rowTop + i * rowH;
    rowHits.push({ id: s.id, y: y });
    const hover = mouseY >= y && mouseY < y + rowH && mouseX > 0 && mouseX < canvasWidth && mouseY < drawHeight;
    if (hover) { noStroke(); fill(225, 235, 248); rect(2, y, canvasWidth - 4, rowH, 4); }
    const st = m.span[s.id][0], en = m.span[s.id][1], dur = en - st;
    const crit = m.critical[s.id];

    // row label: service name and operation, indented by call depth
    const lx = margin + s.depth * 12, cy = y + rowH / 2 - 1;
    noStroke(); textAlign(LEFT, CENTER); textSize(12); textStyle(BOLD); fill(30);
    const nm = showOp ? s.name : s.short;
    text(fitText(nm, labelW - lx - 2), lx, cy);
    if (showOp) {
      const nw = textWidth(nm + ' ');
      textStyle(NORMAL); fill(95); text(fitText(s.op, labelW - lx - nw - 2), lx + nw, cy);
    }
    textStyle(NORMAL);

    // the span bar: children are colored by the duration thresholds, the root is neutral
    const c = s.id === 'gw' ? SLATE : spanColor(dur);
    const x0 = tx(st), x1 = tx(en), bw = Math.max(2, x1 - x0), by = y + 5;
    noStroke(); fill(c[0], c[1], c[2], s.id === 'gw' || s.id === 'prod' ? 110 : 255); rect(x0, by, bw, barH, 3);
    // spans with children: the solid part is the service's own work (self time)
    if (s.id === 'gw' || s.id === 'prod') {
      fill(c[0], c[1], c[2]); rect(x0, by, Math.max(2, tx(st + m.self[s.id]) - x0), barH, 3);
    }
    if (crit) { noFill(); stroke(GOLD[0], GOLD[1], GOLD[2]); strokeWeight(2); rect(x0 - 1, by - 1, bw + 2, barH + 2, 3); noStroke(); }
    if (injected[s.id]) {
      // hatch marks on a span carrying injected slowness
      stroke(255, 255, 255, 200); strokeWeight(1.5);
      const hx1 = Math.min(x1, x0 + Math.max(2, tx(st + m.self[s.id]) - x0));
      for (let hx = x0 + 4; hx < hx1 - 2; hx += 7) line(hx, by + barH - 2, hx + 4, by + 2);
      noStroke();
    }

    // duration (and self time, slack, or injection) beside the bar
    let lbl = Math.round(dur) + ' ms';
    if (s.id === 'gw' || s.id === 'prod') lbl += ' (own ' + Math.round(m.self[s.id]) + ')';
    let extra = '';
    if (injected[s.id]) extra = '+' + INJECT_MS + ' injected';
    else if (s.id === 'db' && slowCheckbox.checked()) extra = 'slow query';
    textSize(11.5); textStyle(BOLD);
    const wL = textWidth(lbl), wE = extra ? textWidth(extra) + 14 : 0;
    let px = null, inside = false;
    if (timeX1 - x1 >= wL + wE + 8) px = x1 + 5;
    else if (x0 - timeX0 >= wL + wE + 8) px = x0 - wL - wE - 6;
    else if (timeX1 - x1 >= wL + 8) { px = x1 + 5; extra = ''; }
    else { px = Math.max(x0 + 4, x1 - wL - wE - 6); inside = true; }
    fill(inside ? 255 : 30); textAlign(LEFT, CENTER); text(lbl, px, by + barH / 2);
    if (extra) {
      const ex = px + wL + 6;
      fill(RED[0], RED[1], RED[2]); rect(ex, by, wE - 4, 15, 4);
      fill(255); textSize(10.5); text(extra, ex + 5, by + barH / 2);
    }
    textStyle(NORMAL);
  }
}

// budget line and the simulated p95, drawn across the rows
function drawMarkers(m, sim, budget, over, tx) {
  const yTop = rowTop - 6, yBot = rowTop + SPANS.length * rowH + 2;
  const bx = tx(budget), px = tx(sim.p95);
  const bc = over ? RED : GREEN;
  stroke(bc[0], bc[1], bc[2]); strokeWeight(1.6); drawingContext.setLineDash([5, 4]);
  line(bx, yTop, bx, yBot); drawingContext.setLineDash([]);
  stroke(60); strokeWeight(1.3); drawingContext.setLineDash([2, 3]);
  line(px, yTop, px, yBot); drawingContext.setLineDash([]); noStroke();
  // labels under the rows, kept apart and inside the plot
  textSize(11); textStyle(BOLD);
  const bl = 'budget ' + budget, pl = 'p95 ' + Math.round(sim.p95);
  const bw = textWidth(bl), pw = textWidth(pl);
  let bxl = constrain(bx - bw / 2, timeX0, timeX1 - bw), pxl = constrain(px - pw / 2, timeX0, timeX1 - pw);
  if (Math.abs((bxl + bw / 2) - (pxl + pw / 2)) < (bw + pw) / 2 + 8) {
    // too close: put one on each side of the pair
    if (bx <= px) { bxl = constrain(Math.min(bx, px) - bw - 3, timeX0, timeX1 - bw - pw - 10); pxl = bxl + bw + 10; }
    else { pxl = constrain(Math.min(bx, px) - pw - 3, timeX0, timeX1 - bw - pw - 10); bxl = pxl + pw + 10; }
  }
  textAlign(LEFT, TOP);
  fill(bc[0], bc[1], bc[2]); text(bl, bxl, yBot + 2);
  fill(60); text(pl, pxl, yBot + 2);
  textStyle(NORMAL);
}

function drawBanner(m, sim, budget, over, y) {
  const x = margin, w = canvasWidth - margin * 2, h = 30;
  const c = over ? RED : GREEN;
  noStroke(); fill(c[0], c[1], c[2], over ? 255 : 30); rect(x, y, w, h, 6);
  if (!over) { noFill(); stroke(c[0], c[1], c[2]); strokeWeight(1); rect(x, y, w, h, 6); noStroke(); }
  textAlign(LEFT, CENTER); textStyle(BOLD); textSize(canvasWidth < 660 ? 11.5 : 13);
  const topMs = Math.round(m.self[m.top.id]);
  let msg;
  if (over) {
    msg = canvasWidth < 660
      ? 'Sensitivity point: ' + m.top.short.replace('Recommend.', 'Recommendation') + ' (' + topMs + ' ms); p95 +' + Math.round(sim.p95 - budget) + ' ms'
      : 'ATAM sensitivity point detected: ' + m.top.name + ' (' + topMs + ' ms of the critical path). ' +
        'p95 is ' + Math.round(sim.p95 - budget) + ' ms over budget.';
    fill(255);
  } else {
    msg = (canvasWidth < 660 ? 'Within budget: p95 ' : 'Within budget: estimated p95 ') + Math.round(sim.p95) + ' ms leaves ' +
      Math.round(budget - sim.p95) + ' ms of headroom.';
    fill(27, 94, 32);
  }
  text(fitText(msg, w - 20), x + 10, y + h / 2);
  textStyle(NORMAL);
}

// plain-language reading of the critical path and the slack
function drawReading(m, sim, y) {
  const x = margin, w = canvasWidth - margin * 2, h = drawHeight - 8 - y;
  fill(255); stroke(200); strokeWeight(1); rect(x, y, w, h, 8); noStroke();
  const tx0 = x + 10, tw = w - 20, limit = y + h - 4;
  let ty = y + 7;
  const path = SPANS.filter(s => m.critical[s.id]).map(s => s.short.replace('Recommend.', 'Recommendation'));
  textSize(12.5); textStyle(BOLD); fill(GOLD[0], GOLD[1], GOLD[2]); textAlign(LEFT, TOP);
  text(fitText('Critical path: ' + path.join(' → '), tw), tx0, ty); textStyle(NORMAL);
  ty += 19;
  let msg;
  if (!m.slackBranch) {
    msg = 'Both parallel branches finish together, so every span is on the critical path: slowing any of them slows the request.';
  } else if (m.slackBranch === 'rec') {
    msg = 'Recommendation runs in parallel with Product + Inventory DB and finishes ' + Math.round(m.slack) +
      ' ms earlier. That is its slack: it can slow down by ' + Math.round(m.slack) + ' ms before the request gets slower. ' +
      'Every millisecond added on the critical path is a millisecond added to the response.';
  } else {
    msg = 'Recommendation is now the slower parallel branch, so it is on the critical path. Product + Inventory DB have ' +
      Math.round(m.slack) + ' ms of slack: speeding them up no longer shortens the request.';
  }
  ty = drawWrapped(msg, tx0, ty, tw, 12.5, 16, color(30), limit) + 3;
  drawWrapped('Click a span to inject ' + INJECT_MS + ' ms. Span colors: green under 50 ms, amber 50 to 150, red over 150 (the root ' +
    'span is gray). Pale = waiting on a child; gold outline = critical path. The p50 and p95 are simulated: each span varies ' +
    'around its slider value, with its own p95 twice its median. Illustrative.', tx0, ty, tw, 11.5, 14.5, color(95), limit);
}

function drawControlLabels(m, budget) {
  const big = canvasWidth >= 660;
  const colW = (canvasWidth - 20) / 2;
  noStroke(); fill(30); textAlign(LEFT, CENTER); textSize(big ? 13 : 11.5); textStyle(NORMAL);
  const order = ['gw', 'auth', 'prod', 'db', 'rec'];
  for (let i = 0; i < order.length; i++) {
    const s = SPANS.find(v => v.id === order[i]);
    const col = i % 2, row = Math.floor(i / 2);
    const nm = big ? (s.id === 'rec' ? 'Recommendation' : s.name) : s.short.replace('Inventory DB', 'Inv. DB').replace('Recommend.', 'Recomm.');
    text(nm + ': ' + sliders[s.id].value() + ' ms', 10 + col * colW, drawHeight + 19 + row * 33);
  }
  text((big ? 'p95 budget: ' : 'Budget: ') + budget + ' ms', 10 + colW, drawHeight + 19 + 2 * 33);
  if (canvasWidth >= 520) {
    fill(100); textSize(11.5); textAlign(RIGHT, CENTER);
    text('Sliders set each service\'s own work (self time).', canvasWidth - 80, drawHeight + 122);
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

// ---------- interaction ----------
function mousePressed() {
  if (mouseY > drawHeight || mouseX < 0 || mouseX > canvasWidth) return;
  for (const r of rowHits) {
    if (mouseY >= r.y && mouseY < r.y + rowH) { injected[r.id] = !injected[r.id]; return; }
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
