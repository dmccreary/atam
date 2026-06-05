// Caching Tactic Explorer
// CANVAS_HEIGHT: 556
// Bloom L3 (Apply): students CONFIGURE a cache (strategy, TTL, size) and observe the
// performance-vs-consistency consequences on a live request stream. Animation is the point
// here — the latency/consistency tradeoff has to be *felt*, not just read (per the spec's
// rationale and the Apply-with-real-time-feedback pattern).

let containerWidth;
let canvasWidth = 400;
let drawHeight = 510;
let controlHeight = 46;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;

const strategies = ['Write-Through', 'Write-Behind', 'Cache-Aside'];
const stratBlurb = {
  'Write-Through': 'Writes hit cache AND database synchronously — always consistent, slower writes.',
  'Write-Behind': 'Writes hit cache now, database updated asynchronously — fast writes, risk of lag/loss.',
  'Cache-Aside': 'App reads DB on a miss and populates the cache; writes invalidate the entry.'
};
let strategy = 0;

const HIT_MS = 5, MISS_MS = 50;
const KEYS = 10;
let cache = new Map();          // key -> {age, ttl, stale, staleMs}
let stream = [];                // recent ops
let reads = 0, hits = 0, latSum = 0, latCount = 0;
let pendingSync = 0;            // write-behind un-synced writes
let consistencyLag = 0;
let running = true;
let genTimer = 0;

let ttlSlider, sizeSlider, staleChk, pauseBtn, staleBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  const main = document.querySelector('main');
  ttlSlider = createSlider(5, 600, 120, 5); ttlSlider.parent(main); ttlSlider.style('width', '130px');
  sizeSlider = createSlider(4, 12, 6, 1); sizeSlider.parent(main); sizeSlider.style('width', '110px');
  staleChk = createCheckbox('', false); staleChk.parent(main);
  pauseBtn = createButton('Pause'); pauseBtn.parent(main);
  pauseBtn.mousePressed(() => { running = !running; pauseBtn.html(running ? 'Pause' : 'Resume'); });
  staleBtn = createButton('Introduce Stale Read'); staleBtn.parent(main);
  staleBtn.mousePressed(introduceStale);
  // warm start so the first rendered frame already shows a populated stream/cache/metrics
  for (let i = 0; i < 30; i++) { genRequest(); for (const [, e] of cache) e.age++; }
  layout();
  describe('A cache simulation: a strategy selector, a live request stream colored by hit/miss/write, ' +
    'a cache-state panel with TTL freshness bars, and a metrics panel showing hit rate, average ' +
    'latency, and consistency lag, with TTL and cache-size sliders.', LABEL);
}

function layout() {
  ttlSlider.position(margin + 36, drawHeight - 34);
  sizeSlider.position(margin + 240, drawHeight - 34);
  staleChk.position(margin + 420, drawHeight - 32);
  const y = drawHeight + 11;
  pauseBtn.position(10, y);
  staleBtn.position(78, y);
}

function hotKey() {
  // skewed popularity so some keys are hot (cache benefits)
  const r = random();
  return 'K' + (r < 0.6 ? floor(random(3)) : floor(random(KEYS)));
}

function genRequest() {
  const isWrite = random() < 0.2;
  const key = hotKey();
  const cap = sizeSlider.value();
  const ttl = ttlSlider.value();
  let op;
  if (!isWrite) {
    reads++;
    const e = cache.get(key);
    const hit = e && !isExpired(e);
    if (hit) { hits++; touch(key); op = { key, type: 'hit', ms: HIT_MS }; latSum += HIT_MS; }
    else {
      insert(key, ttl, cap);
      op = { key, type: 'miss', ms: MISS_MS }; latSum += MISS_MS;
    }
    latCount++;
  } else {
    if (strategy === 0) { // write-through
      insert(key, ttl, cap); op = { key, type: 'write', ms: HIT_MS + MISS_MS };
      latSum += HIT_MS + MISS_MS; latCount++;
    } else if (strategy === 1) { // write-behind
      insert(key, ttl, cap); pendingSync++; op = { key, type: 'write', ms: HIT_MS };
      latSum += HIT_MS; latCount++;
    } else { // cache-aside: write DB, invalidate
      cache.delete(key); op = { key, type: 'write', ms: MISS_MS };
      latSum += MISS_MS; latCount++;
    }
  }
  stream.unshift(op); if (stream.length > 9) stream.pop();
}

function isExpired(e) { return e.age > e.ttl * 10; }   // ttl seconds → frames (0.1s/frame)
function touch(key) { const e = cache.get(key); if (e) e.last = frameCount; }
function insert(key, ttl, cap) {
  if (!cache.has(key) && cache.size >= cap) {
    // LRU eviction
    let oldest = null, ot = Infinity;
    for (const [k, v] of cache) if (v.last < ot) { ot = v.last; oldest = k; }
    if (oldest) cache.delete(oldest);
  }
  cache.set(key, { age: 0, ttl, stale: false, staleMs: 0, last: frameCount });
}

function introduceStale() {
  const keys = [...cache.keys()];
  if (!keys.length) return;
  const k = random(keys);
  const e = cache.get(k); e.stale = true; e.staleMs = floor(random(200, 1500));
}

function draw() {
  updateCanvasSize();
  layout();
  if (running) {
    for (const [, e] of cache) e.age++;
    genTimer++;
    if (genTimer >= 14) { genTimer = 0; genRequest(); }
    if (strategy === 1) { // write-behind drains async
      consistencyLag = pendingSync * 0.8;
      if (frameCount % 30 === 0 && pendingSync > 0) pendingSync--;
    } else { consistencyLag = 0; pendingSync = 0; }
  }

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(LEFT, TOP); textSize(18);
  text('Caching Tactic Explorer', margin, 10);
  fill(90); textSize(11);
  text(stratBlurb[strategies[strategy]], margin, 34);

  drawTabs();
  const colW = (canvasWidth - margin * 2 - 20) / 3;
  drawStream(margin, 90, colW);
  drawCacheState(margin + colW + 10, 90, colW);
  drawMetrics(margin + 2 * (colW + 10), 90, colW);
  drawConfig();
  drawControlHint();
}

function drawTabs() {
  const tw = Math.min(150, (canvasWidth - margin * 2) / 3);
  textAlign(CENTER, CENTER); textSize(11.5);
  for (let i = 0; i < 3; i++) {
    const x = margin + i * (tw + 6);
    const active = i === strategy;
    noStroke(); fill(active ? color(25, 118, 210) : color(236)); rect(x, 54, tw, 26, 6);
    fill(active ? 255 : 70); text(strategies[i], x + tw / 2, 67);
  }
}

function panel(x, y, w, h, title) {
  fill(255); stroke(210); strokeWeight(1); rect(x, y, w, h, 8); noStroke();
  fill(30, 60, 120); textAlign(LEFT, TOP); textSize(12); textStyle(BOLD); text(title, x + 8, y + 7); textStyle(NORMAL);
}

function drawStream(x, y, w) {
  const h = drawHeight - y - 78;
  panel(x, y, w, h, 'Request stream');
  let yy = y + 28;
  for (const op of stream) {
    const c = op.type === 'hit' ? [76, 175, 80] : (op.type === 'miss' ? [245, 196, 80] : [229, 83, 80]);
    fill(c[0], c[1], c[2]); rect(x + 8, yy, w - 16, 20, 4);
    fill(op.type === 'miss' ? 60 : 255); textAlign(LEFT, CENTER); textSize(10.5);
    const label = op.type === 'hit' ? 'READ hit' : (op.type === 'miss' ? 'READ miss→DB' : 'WRITE');
    text(label + '  ' + op.key, x + 14, yy + 10);
    textAlign(RIGHT, CENTER); text(op.ms + 'ms', x + w - 14, yy + 10);
    yy += 24;
  }
}

function drawCacheState(x, y, w) {
  const h = drawHeight - y - 78;
  panel(x, y, w, h, 'Cache (' + cache.size + '/' + sizeSlider.value() + ')');
  let yy = y + 28;
  for (const [k, e] of cache) {
    if (yy > y + h - 22) break;
    const expired = isExpired(e);
    const cc = e.stale ? [255, 152, 0] : (expired ? [180, 180, 180] : [33, 118, 210]);
    fill(cc[0], cc[1], cc[2]); circle(x + 16, yy + 9, 12);
    fill(50); textAlign(LEFT, CENTER); textSize(10.5); text(k, x + 28, yy + 9);
    // freshness bar
    const fx = x + 60, fw = w - 70;
    const frac = constrain(1 - e.age / (e.ttl * 10), 0, 1);
    fill(235); rect(fx, yy + 4, fw, 9, 3);
    fill(e.stale ? color(255, 152, 0) : color(76, 175, 80)); rect(fx, yy + 4, fw * frac, 9, 3);
    if (e.stale) { fill(255, 152, 0); textAlign(RIGHT, CENTER); textSize(8.5); text(e.staleMs + 'ms old', x + w - 6, yy + 16); }
    yy += 24;
  }
  if (cache.size === 0) { fill(150); textAlign(LEFT, TOP); textSize(10.5); text('empty — warming up…', x + 10, y + 30); }
}

function drawMetrics(x, y, w) {
  const h = drawHeight - y - 78;
  panel(x, y, w, h, 'Metrics');
  const hr = reads > 0 ? Math.round(hits / reads * 100) : 0;
  const avg = latCount > 0 ? (latSum / latCount).toFixed(1) : '0';
  // big hit rate
  fill(46, 125, 50); textAlign(LEFT, TOP); textSize(11); text('Hit rate', x + 10, y + 30);
  textSize(30); textStyle(BOLD); text(hr + '%', x + 10, y + 44); textStyle(NORMAL);
  // latency
  fill(40); textSize(11); text('Avg latency', x + 10, y + 88);
  fill(25, 118, 210); textSize(18); textStyle(BOLD); text(avg + ' ms', x + 10, y + 102); textStyle(NORMAL);
  fill(120); textSize(9.5); text('hit ' + HIT_MS + 'ms  vs  miss+DB ' + MISS_MS + 'ms', x + 10, y + 124);
  // consistency lag
  fill(40); textSize(11); text('Consistency lag', x + 10, y + 146);
  const lagC = consistencyLag > 0 ? color(229, 83, 80) : color(46, 125, 50);
  fill(lagC); textSize(18); textStyle(BOLD); text(consistencyLag.toFixed(1) + ' s', x + 10, y + 160); textStyle(NORMAL);
  fill(120); textSize(9.5);
  text(strategy === 1 ? pendingSync + ' writes not yet in DB' : 'cache stays in sync with DB', x + 10, y + 182, w - 18);
}

function drawConfig() {
  const y = drawHeight - 44;
  noStroke(); fill(40); textAlign(LEFT, TOP); textSize(11);
  text('TTL', margin, y + 2); text(ttlSlider.value() + 's', margin + 172, y + 2);
  text('Size', margin + 204, y + 2); text(sizeSlider.value() + '', margin + 356, y + 2);
  text('Staleness warning', margin + 442, y + 2);
}

function drawControlHint() {
  if (canvasWidth < 560) return;
  noStroke(); fill(90); textAlign(LEFT, CENTER); textSize(10.5);
  text('Switch strategy and watch the latency vs consistency-lag tradeoff.', 230, drawHeight + controlHeight / 2, canvasWidth - 240);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const tw = Math.min(150, (canvasWidth - margin * 2) / 3);
  if (mouseY >= 54 && mouseY <= 80) {
    for (let i = 0; i < 3; i++) {
      const x = margin + i * (tw + 6);
      if (mouseX >= x && mouseX <= x + tw) { strategy = i; pendingSync = 0; return; }
    }
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
