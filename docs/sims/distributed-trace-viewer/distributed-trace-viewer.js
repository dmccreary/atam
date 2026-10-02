// Distributed Trace Viewer
// CANVAS_HEIGHT: 550
// Bloom L4 (Analyze): students EXAMINE a distributed trace waterfall for a slow checkout
// request, find the spans that contribute most to end-to-end latency, and diagnose the
// root cause. The sim is a static, clickable waterfall (no animation): analysis needs
// concrete data to inspect, compare, and reason about, not motion.
//
// All timings are illustrative teaching data, not measurements of any real system.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const TRACE_MS = 850;        // time-axis extent (the slow trace's total duration)
const BASELINE_MS = 430;     // total duration of the fast baseline trace

// One distinct color per service
const SERVICE_COLORS = {
  'checkout-service': [57, 73, 171],
  'auth-service': [0, 137, 123],
  'inventory-service': [124, 179, 66],
  'database': [121, 85, 72],
  'pricing-service': [142, 36, 170],
  'cache-service': [0, 151, 167],
  'payment-service': [245, 124, 0],
  'external-gateway': [84, 110, 122],
  'order-service': [30, 136, 229]
};
const SERVICE_NAMES = Object.keys(SERVICE_COLORS);

// The slow trace (start/end in ms). `base` is the same span in the fast baseline trace
// (null = the span does not occur in the baseline). `flag` is the anomaly marker.
const SPANS = [
  { id: 'root', svc: 'checkout-service', op: 'checkout.process', depth: 0, parent: null,
    start: 0, end: 850, base: [0, 430],
    tags: ['http.method = POST', 'http.route = /checkout', 'http.status_code = 200'],
    note: 'Root span: the whole request. Only 35 ms is its own work; the rest is time spent ' +
      'waiting on child spans. A slow root tells you that something is slow, not what.',
    fastNote: 'Baseline request: 430 ms end to end, with every downstream call behaving normally.' },
  { id: 'auth', svc: 'auth-service', op: 'token.validate', depth: 1, parent: 'root',
    start: 5, end: 45, base: [5, 45],
    tags: ['token.type = JWT', 'auth.result = valid', 'http.status_code = 200'],
    note: 'Healthy: 40 ms, the same as the baseline. It is not part of the regression.' },
  { id: 'inv', svc: 'inventory-service', op: 'inventory.check', depth: 1, parent: 'root',
    start: 50, end: 180, base: [50, 180],
    tags: ['rpc.method = inventory.check', 'items.checked = 3', 'http.status_code = 200'],
    note: 'Healthy: 130 ms matches the baseline. 110 ms of that is its child database query; ' +
      'only 20 ms is this service\'s own work (self time).' },
  { id: 'invdb', svc: 'database', op: 'SELECT inventory', depth: 2, parent: 'inv',
    start: 60, end: 170, base: [60, 170],
    tags: ['db.operation = SELECT', 'db.statement = SELECT qty FROM inventory WHERE product_id = ?',
      'db.rows_returned = 3'],
    note: 'Takes 110 ms in both traces. It is the third-largest contributor, but it did not ' +
      'change, so it does not explain why this request is slower than the baseline.' },
  { id: 'price', svc: 'pricing-service', op: 'price.calculate', depth: 1, parent: 'root',
    start: 185, end: 395, base: [185, 205], flag: 'SLOW',
    tags: ['rpc.method = price.calculate', 'http.status_code = 200'],
    note: 'Slow: 210 ms against a 20 ms baseline, yet only 5 ms is self time. The latency is ' +
      'in its children, so follow the trace one level down to find the cause.',
    fastNote: 'Baseline: 20 ms, because the price is served straight from the cache.' },
  { id: 'cache', svc: 'cache-service', op: 'cache.get', depth: 2, parent: 'price',
    start: 185, end: 200, base: [185, 200], flag: 'MISS',
    tags: ['cache.key = price:cart:8841', 'cache.hit = false'],
    fastTags: ['cache.key = price:cart:8841', 'cache.hit = true'],
    note: 'Cache MISS. The lookup itself is fast (15 ms), but the miss forces pricing-service ' +
      'to fall back to the database. A cheap span can trigger an expensive one.',
    fastNote: 'Cache HIT: the price comes back in 15 ms and no database query is needed.' },
  { id: 'pricedb', svc: 'database', op: 'complex pricing query', depth: 2, parent: 'price',
    start: 200, end: 390, base: null, flag: 'SLOW QUERY',
    tags: ['db.operation = SELECT', 'db.statement = SELECT ... FROM prices JOIN promotions JOIN tax_rules ...',
      'db.index_used = false'],
    note: 'Root cause inside the system: after the cache miss, a multi-join pricing query runs ' +
      'for 190 ms. In the baseline the price is cached and this span does not exist at all.' },
  { id: 'pay', svc: 'payment-service', op: 'payment.authorize', depth: 1, parent: 'root',
    start: 400, end: 780, base: [210, 360], flag: 'SLOW',
    tags: ['rpc.method = payment.authorize', 'retry.count = 0', 'http.status_code = 200'],
    note: 'Slow: 380 ms against a 150 ms baseline, but only 20 ms is self time. Nearly all of ' +
      'it is the downstream call to the external card gateway.',
    fastNote: 'Baseline: 150 ms, of which 130 ms is the call to the external card gateway.' },
  { id: 'gateway', svc: 'external-gateway', op: 'authorize.card', depth: 2, parent: 'pay',
    start: 410, end: 770, base: [220, 350], flag: 'EXTERNAL',
    tags: ['peer.service = external card gateway', 'http.method = POST', 'http.status_code = 200'],
    note: 'External latency: 360 ms waiting on a third party (130 ms in the baseline). It is the ' +
      'largest contributor but outside the team\'s control; mitigate with timeouts, a circuit ' +
      'breaker, or asynchronous authorization.',
    fastNote: 'Baseline external call: 130 ms. Even when healthy, this third-party call is the ' +
      'largest single contributor to the request.' },
  { id: 'order', svc: 'order-service', op: 'order.create', depth: 1, parent: 'root',
    start: 785, end: 840, base: [365, 420],
    tags: ['db.operation = INSERT', 'http.status_code = 201'],
    note: 'Healthy: 55 ms in both traces. It starts later here only because the spans before it ran long.' }
];

let viewSelect, serviceSelect, pathCheckbox;
let selectedId = null;
let rowTop = 62, rowH = 27;
let labelW = 250, timeX0 = 262, timeX1 = 780;
let rowHits = [];             // [{id, y}] rebuilt every frame for click hit-testing

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const main = document.querySelector('main');
  canvas.parent(main);
  textSize(defaultTextSize);

  viewSelect = createSelect();
  viewSelect.parent(main);
  viewSelect.option('Slow trace (850 ms)');
  viewSelect.option('Fast baseline (430 ms)');
  viewSelect.option('Compare: slow vs. baseline');
  viewSelect.changed(() => { selectedId = null; });

  serviceSelect = createSelect();
  serviceSelect.parent(main);
  serviceSelect.option('All services');
  for (const s of SERVICE_NAMES) serviceSelect.option(s);

  pathCheckbox = createCheckbox(' Critical path', false);
  pathCheckbox.parent(main);
  pathCheckbox.style('font-size', '13px');

  layout();
  describe('A distributed trace waterfall for a checkout request. Ten spans are drawn as ' +
    'horizontal bars on a shared time axis, indented to show parent and child calls. Select a ' +
    'span to read its timing, tags, and diagnosis; switch to the fast baseline or the comparison ' +
    'view; filter by service; and highlight the critical path in gold.', LABEL);
}

function layout() {
  const y = drawHeight + 13;
  const checkboxW = 118;
  const avail = canvasWidth - 20 - 16 - checkboxW;
  const w1 = Math.min(215, Math.floor(avail * 0.56));
  const w2 = Math.min(170, Math.floor(avail * 0.44));
  viewSelect.position(10, y); viewSelect.size(w1);
  serviceSelect.position(10 + w1 + 8, y); serviceSelect.size(w2);
  pathCheckbox.position(10 + w1 + 8 + w2 + 8, y + 1);

  rowH = canvasWidth < 520 ? 22 : 27;
  labelW = constrain(canvasWidth * 0.385, 120, 270);
  timeX0 = labelW + margin;
  timeX1 = canvasWidth - margin - 4;
}

// ---------- trace model ----------
function viewMode() {
  const v = viewSelect.value();
  if (v.startsWith('Fast')) return 'fast';
  if (v.startsWith('Compare')) return 'compare';
  return 'slow';
}

// The spans of the trace being displayed, with start/end taken from the right trace.
function activeSpans() {
  if (viewMode() !== 'fast') return SPANS.map(s => Object.assign({}, s));
  return SPANS.filter(s => s.base).map(s => Object.assign({}, s, { start: s.base[0], end: s.base[1] }));
}

function childrenOf(spans, id) { return spans.filter(s => s.parent === id); }

// Self time = a span's duration minus the time covered by its direct children.
function selfTime(spans, s) {
  let covered = 0;
  for (const c of childrenOf(spans, s.id)) covered += c.end - c.start;
  return (s.end - s.start) - covered;
}

// Critical path: walk backward from the end of a span, always following the child that
// finished last before the cursor. The gaps between children are the parent's own
// (self-time) segments. Returns {spanId: [[from, to], ...]} for every span on the path.
function criticalPath(spans) {
  const segs = {};
  const add = (id, a, b) => { if (b > a) (segs[id] = segs[id] || []).push([a, b]); };
  const walk = (s) => {
    let cursor = s.end;
    const kids = childrenOf(spans, s.id).sort((a, b) => b.end - a.end);
    for (const c of kids) {
      if (c.end > cursor) continue;         // overlaps a child already on the path
      add(s.id, c.end, cursor);
      walk(c);
      cursor = c.start;
    }
    add(s.id, s.start, cursor);
  };
  walk(spans.find(s => s.parent === null));
  return segs;
}

function exceedsBaseline(s) {
  if (!s.base) return true;
  return (s.end - s.start) > 1.5 * (s.base[1] - s.base[0]);
}

function tx(t) { return timeX0 + (t / TRACE_MS) * (timeX1 - timeX0); }

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

  const mode = viewMode();
  const spans = activeSpans();
  const total = mode === 'fast' ? BASELINE_MS : TRACE_MS;
  const segs = pathCheckbox.checked() ? criticalPath(spans) : null;

  drawTitle(mode, total);
  drawAxis(spans.length);
  drawRows(spans, mode, segs);
  drawPanel(spans, mode, total, segs);

  let over = false;
  for (const r of rowHits) if (mouseY >= r.y && mouseY < r.y + rowH && mouseX > 0 && mouseX < canvasWidth) over = true;
  cursor(over ? HAND : ARROW);
}

function drawTitle(mode, total) {
  const narrow = canvasWidth < 560;
  noStroke(); fill(25, 45, 90); textAlign(LEFT, TOP); textStyle(BOLD); textSize(narrow ? 14 : 18);
  text(narrow ? 'Trace: POST /checkout' : 'Distributed Trace: POST /checkout', margin, narrow ? 12 : 9);
  textAlign(RIGHT, TOP); textSize(narrow ? 12.5 : 15);
  if (mode === 'compare') {
    fill(198, 40, 40);
    text(narrow ? '850 vs. 430 ms' : 'Total: 850 ms vs. 430 ms baseline', canvasWidth - margin, narrow ? 13 : 11);
  } else {
    fill(mode === 'slow' ? color(198, 40, 40) : color(46, 125, 50));
    text('Total: ' + total + ' ms', canvasWidth - margin, narrow ? 13 : 11);
  }
  textStyle(NORMAL);
}

function drawAxis(rowCount) {
  const yTop = rowTop - 6, yBot = rowTop + rowCount * rowH;
  const step = (timeX1 - timeX0) > 420 ? 100 : 200;
  textSize(11); textAlign(CENTER, BOTTOM);
  for (let t = 0; t <= TRACE_MS; t += step) {
    const x = tx(t);
    stroke(214, 222, 232); strokeWeight(1); line(x, yTop, x, yBot);
    noStroke(); fill(95);
    text(t === 0 ? '0 ms' : t, x, yTop - 2);
  }
  noStroke();
}

function drawRows(spans, mode, segs) {
  rowHits = [];
  const filter = serviceSelect.value();
  const barH = rowH >= 27 ? 14 : 11;
  const showService = allLabelsFit(SPANS);
  for (let i = 0; i < spans.length; i++) {
    const s = spans[i];
    const y = rowTop + i * rowH;
    rowHits.push({ id: s.id, y: y });
    const dim = filter !== 'All services' && s.svc !== filter;
    const alpha = dim ? 50 : 255;
    const c = SERVICE_COLORS[s.svc];
    const isSel = s.id === selectedId;
    const hover = mouseY >= y && mouseY < y + rowH && mouseX > 0 && mouseX < canvasWidth;

    if (isSel || hover) {
      noStroke(); fill(isSel ? color(255, 236, 179) : color(225, 235, 248));
      rect(2, y, canvasWidth - 4, rowH, 4);
    }
    drawRowLabel(s, y, alpha, showService);

    // the span bar
    const x0 = tx(s.start), x1 = tx(s.end), bw = Math.max(2, x1 - x0), by = y + 3;
    noStroke(); fill(c[0], c[1], c[2], alpha); rect(x0, by, bw, barH, 3);

    // baseline ghost bar (compare view) drawn in the lane under the main bar
    if (mode === 'compare' && s.base) {
      fill(120, 130, 140, dim ? 60 : 200);
      rect(tx(s.base[0]), by + barH + 2, Math.max(2, tx(s.base[1]) - tx(s.base[0])), 4, 2);
    }
    // red outline: this span ran well past its expected baseline
    const anomaly = mode !== 'fast' && exceedsBaseline(s);
    if (anomaly && !dim) {
      noFill(); stroke(211, 47, 47); strokeWeight(2); rect(x0, by, bw, barH, 3); noStroke();
    }
    // gold critical-path segments: the stretch of time this span itself is responsible for
    if (segs && segs[s.id]) {
      for (const g of segs[s.id]) {
        const gx0 = tx(g[0]), gw = Math.max(2, tx(g[1]) - gx0);
        fill(255, 213, 79, dim ? 80 : 235); stroke(150, 105, 0, dim ? 80 : 255); strokeWeight(1.5);
        rect(gx0, by - 1, gw, barH + 2, 2);
      }
      noStroke();
    }
    if (isSel) { noFill(); stroke(30); strokeWeight(2); rect(x0 - 2, by - 2, bw + 4, barH + 4, 4); noStroke(); }

    drawBarLabel(s, mode, x0, x1, by, barH, alpha);
  }
}

// Row labels read "service operation" when every row has room for both, otherwise the
// operation alone (the color swatch still identifies the service).
function allLabelsFit(spans) {
  textSize(12);
  for (const s of spans) {
    textStyle(BOLD); const svcW = textWidth(s.svc + ' ');
    textStyle(NORMAL); const opW = textWidth(s.op);
    if (svcW + opW > labelW - (margin + s.depth * 12) - 14) return false;
  }
  return true;
}

function drawRowLabel(s, y, alpha, showService) {
  const c = SERVICE_COLORS[s.svc];
  const x = margin + s.depth * 12;
  const maxW = labelW - x - 2;
  const cy = y + rowH / 2 - 1;
  noStroke(); fill(c[0], c[1], c[2], alpha); rect(x, cy - 4, 8, 8, 2);
  textAlign(LEFT, CENTER); textSize(12);
  if (showService) {
    textStyle(BOLD);
    const svcW = textWidth(s.svc + ' ');
    fill(c[0] * 0.75, c[1] * 0.75, c[2] * 0.75, alpha); text(s.svc, x + 12, cy);
    textStyle(NORMAL); fill(35, 35, 35, alpha); text(s.op, x + 12 + svcW, cy);
  } else {
    textStyle(NORMAL); fill(35, 35, 35, alpha); text(fitText(s.op, maxW - 12), x + 12, cy);
  }
}

// duration label (+ delta and anomaly marker) placed right of, left of, or inside the bar
function drawBarLabel(s, mode, x0, x1, by, barH, alpha) {
  const dur = s.end - s.start;
  const label = dur + ' ms';
  let extra = '';
  if (mode === 'compare') {
    if (!s.base) extra = 'not in baseline';
    else { const d = dur - (s.base[1] - s.base[0]); if (d !== 0) extra = (d > 0 ? '+' : '') + d + ' ms'; }
  } else if (mode === 'slow' && s.flag) {
    extra = s.flag;
  }
  if (mode === 'fast' && s.id === 'cache') extra = 'HIT';
  textSize(11.5); textStyle(BOLD);
  const wLabel = textWidth(label);
  let wExtra = extra ? textWidth(extra) + 14 : 0;
  const cy = by + barH / 2;
  // try: label + badge beside the bar, then label alone beside it, then inside the bar
  let lx = null;
  let inside = false;
  for (let attempt = 0; attempt < 2 && lx === null; attempt++) {
    const need = wLabel + wExtra + 8;
    if (timeX1 - x1 >= need) lx = x1 + 5;
    else if (x0 - timeX0 >= need) lx = x0 - need + 3;
    else if (attempt === 0 && x1 - x0 >= need + 4) { lx = x1 - need; inside = true; }
    else if (attempt === 0) { extra = ''; wExtra = 0; }
  }
  if (lx === null) { lx = Math.max(x0 + 3, x1 - wLabel - 6); inside = true; }
  noStroke(); textAlign(LEFT, CENTER);
  fill(inside ? color(255, 255, 255, alpha) : color(40, 40, 40, alpha));
  text(label, lx, cy);
  if (extra) {
    const good = extra === 'HIT';
    const ex = lx + wLabel + 6;
    fill(good ? color(46, 125, 50, alpha) : color(198, 40, 40, alpha));
    rect(ex, cy - 7.5, wExtra - 4, 15, 4);
    fill(255, 255, 255, alpha); textSize(10.5);
    text(extra, ex + 5, cy);
  }
  textStyle(NORMAL);
}

function drawPanel(spans, mode, total, segs) {
  const px = margin, py = rowTop + 10 * rowH + 8, pw = canvasWidth - margin * 2, ph = drawHeight - py - 8;
  fill(255); stroke(200); strokeWeight(1); rect(px, py, pw, ph, 8); noStroke();
  const x = px + 12, w = pw - 24;
  let y = py + 10;
  const sel = spans.find(s => s.id === selectedId);

  if (sel) {
    const c = SERVICE_COLORS[sel.svc];
    fill(c[0], c[1], c[2]); rect(x, y + 3, 10, 10, 2);
    fill(25, 45, 90); textAlign(LEFT, TOP); textStyle(BOLD); textSize(14);
    text(fitText(sel.svc + '  ·  ' + sel.op, w - 16), x + 16, y);
    textStyle(NORMAL); y += 22;
    const dur = sel.end - sel.start, self = selfTime(spans, sel);
    const timing = 'Start ' + sel.start + ' ms   ·   Duration ' + dur + ' ms   ·   Self time ' + self +
      ' ms   ·   ' + Math.round(dur / total * 100) + '% of the trace';
    y = drawWrapped(timing, x, y, w, 12.5, 16, color(30), py + ph - 6, true);
    const tags = (mode === 'fast' && sel.fastTags) ? sel.fastTags : sel.tags;
    if (canvasWidth >= 560) {
      // room to spare: one tag per line
      for (const t of tags) y = drawWrapped(fitText('\u2022  ' + t, w), x, y + (t === tags[0] ? 2 : 0), w, 12, 15.5, color(85), py + ph - 6, false);
    } else {
      y = drawWrapped('Tags:  ' + tags.join('   |   '), x, y + 2, w, 12, 15.5, color(85), py + ph - 6, false);
    }
    const note = (mode === 'fast' && sel.fastNote) ? sel.fastNote : sel.note;
    drawWrapped(note, x, y + 5, w, 12.5, 16, color(20), py + ph - 6, false);
    return;
  }

  if (segs) {
    // ranked latency contribution along the critical path
    const rows = spans.map(s => ({ s: s, ms: (segs[s.id] || []).reduce((a, g) => a + g[1] - g[0], 0) }))
      .filter(r => r.ms > 0).sort((a, b) => b.ms - a.ms);
    fill(25, 45, 90); textAlign(LEFT, TOP); textStyle(BOLD); textSize(14);
    text(fitText('Critical path: where the ' + total + ' ms went', w), x, y); textStyle(NORMAL);
    y += 23;
    const barX = x + Math.min(250, w * 0.5), barMax = px + pw - 12 - barX - 96;
    for (let i = 0; i < Math.min(4, rows.length); i++) {
      const r = rows[i], c = SERVICE_COLORS[r.s.svc];
      fill(c[0], c[1], c[2]); rect(x, y + 3, 9, 9, 2);
      fill(30); textSize(12.5); textAlign(LEFT, TOP);
      text(fitText(r.s.svc + ': ' + r.s.op, barX - x - 20), x + 14, y);
      fill(255, 213, 79); stroke(150, 105, 0); strokeWeight(1);
      const bw = Math.max(3, barMax * r.ms / rows[0].ms);
      rect(barX, y + 1, bw, 12, 2); noStroke();
      fill(30); textStyle(BOLD);
      text(r.ms + ' ms (' + Math.round(r.ms / total * 100) + '%)', barX + bw + 6, y); textStyle(NORMAL);
      y += 19;
    }
    drawWrapped('Gold marks the span that owns each moment of the request. This trace is fully ' +
      'sequential, so the gold segments add up to the total.', x, y + 3, w, 12, 15.5, color(85), py + ph - 6, false);
    return;
  }

  fill(25, 45, 90); textAlign(LEFT, TOP); textStyle(BOLD); textSize(14);
  text(fitText(mode === 'fast' ? 'Fast baseline: what "normal" looks like' :
    (mode === 'compare' ? 'Comparing the slow trace with its baseline' : 'Why did this checkout take 850 ms?'), w), x, y);
  textStyle(NORMAL); y += 23;
  const intro = mode === 'fast'
    ? 'This is the same request on a good day. Click any span to see its timing and tags, then switch ' +
      'back to the slow trace and look for what changed.'
    : (mode === 'compare'
      ? 'Gray bars show where each span ran in the fast baseline; red badges show how much longer it took ' +
        'here. Which span is new, and which spans merely inherited the delay from a child?'
      : 'Each bar is a span: one operation in one service. Indented bars are calls made by the span above. ' +
        'Red outlines mark spans running well past their baseline. Click a span to inspect it, then turn on ' +
        'Critical path to see which spans own the time.');
  y = drawWrapped(intro, x, y, w, 12.5, 16.5, color(30), py + ph - 6, false);
  y = drawWrapped('Illustrative trace data for teaching.', x, y + 5, w, 11.5, 15, color(110), py + ph - 6, false);
  if (y + 30 < py + ph) drawLegend(x, py + ph - 24, mode);
}

// key to the bar decorations, shown when the panel has room
function drawLegend(x, y, mode) {
  textSize(11.5); textAlign(LEFT, CENTER); noStroke();
  const items = [];
  if (mode !== 'fast') items.push(['outline', 'exceeds baseline']);
  if (mode === 'compare') items.push(['ghost', 'baseline timing']);
  items.push(['gold', 'critical path (when switched on)']);
  for (const it of items) {
    if (it[0] === 'outline') { fill(225); stroke(211, 47, 47); strokeWeight(2); rect(x, y - 5, 22, 10, 3); }
    else if (it[0] === 'ghost') { noStroke(); fill(120, 130, 140); rect(x, y - 2, 22, 4, 2); }
    else { fill(255, 213, 79); stroke(150, 105, 0); strokeWeight(1.5); rect(x, y - 5, 22, 10, 2); }
    noStroke(); fill(70);
    text(it[1], x + 28, y);
    x += 28 + textWidth(it[1]) + 18;
    if (x > canvasWidth - 150) break;
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
  const words = str.split(' ');
  let ln = '';
  const lines = [];
  for (const wd of words) {
    const t = ln ? ln + ' ' + wd : wd;
    if (textWidth(t) > w && ln) { lines.push(ln); ln = wd; } else ln = t;
  }
  if (ln) lines.push(ln);
  for (let i = 0; i < lines.length; i++) {
    if (y + lineH > yLimit) break;
    const last = (y + 2 * lineH > yLimit) && i < lines.length - 1;
    text(last ? fitText(lines[i] + ' …', w) : lines[i], x, y);
    y += lineH;
  }
  textStyle(NORMAL);
  return y;
}

// ---------- interaction ----------
function mousePressed() {
  if (mouseY > drawHeight || mouseX < 0 || mouseX > canvasWidth) return;
  for (const r of rowHits) {
    if (mouseY >= r.y && mouseY < r.y + rowH) {
      selectedId = (selectedId === r.id) ? null : r.id;
      return;
    }
  }
  if (mouseY > rowTop) selectedId = null;
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
