// Resilience Pattern Simulator
// CANVAS_HEIGHT: 586
// Bloom L4 (Analyze): students EXAMINE how circuit breaker, retry, and bulkhead patterns
// interact under injected failure, and judge which combination best holds up a given
// availability scenario. Live failure injection + real-time metrics make the
// availability/latency tradeoff observable (per the spec's Analyze rationale).

let containerWidth;
let canvasWidth = 400;
let drawHeight = 540;
let controlHeight = 46;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;

const modes = ['Healthy', 'Slow', 'Complete Fail', 'Intermittent'];
let failMode = 0;
let running = true;

let cbOn, retryOn, bulkOn;            // checkboxes
let cbThreshSlider, maxRetrySlider, poolSlider, pauseBtn;

let requests = [];                    // in-flight + resolving dots
let inFlight = 0;
let cbState = 'closed';               // closed | open | half-open
let cbFailCount = 0, cbOpenTimer = 0;
let totalResolved = 0, successCount = 0, latSum = 0, latCount = 0;
let recentWindow = [];                // last N outcomes (1 success / 0 fail) for rolling rate
let timeline = [];                    // rolling success-rate samples
let spawnTimer = 0, sampleTimer = 0, rejectedRecently = '';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  const main = document.querySelector('main');
  cbOn = createCheckbox(' Circuit Breaker', true); cbOn.parent(main); cbOn.style('font-size', '12px');
  retryOn = createCheckbox(' Retry', true); retryOn.parent(main); retryOn.style('font-size', '12px');
  bulkOn = createCheckbox(' Bulkhead', false); bulkOn.parent(main); bulkOn.style('font-size', '12px');
  cbThreshSlider = createSlider(1, 10, 4, 1); cbThreshSlider.parent(main); cbThreshSlider.style('width', '110px');
  maxRetrySlider = createSlider(0, 5, 2, 1); maxRetrySlider.parent(main); maxRetrySlider.style('width', '110px');
  poolSlider = createSlider(1, 20, 8, 1); poolSlider.parent(main); poolSlider.style('width', '110px');
  pauseBtn = createButton('Pause'); pauseBtn.parent(main);
  pauseBtn.mousePressed(() => { running = !running; pauseBtn.html(running ? 'Pause' : 'Resume'); });
  // warm start so the first frame already has metrics + a timeline
  for (let i = 0; i < 40; i++) { resolveSynthetic(); }
  for (let i = 0; i < 30; i++) timeline.push(rollingRate());
  layout();
  describe('A resilience simulation: Service A sends requests to Service B; toggles enable ' +
    'circuit breaker, retry, and bulkhead. Request dots flow across the channel and turn green ' +
    '(success), red (failure), orange (retry), or gray (circuit-breaker / bulkhead rejected). ' +
    'Metrics, the circuit-breaker state, and a success-rate timeline update live.', LABEL);
}

function layout() {
  cbOn.position(margin, 54); retryOn.position(margin + 150, 54); bulkOn.position(margin + 250, 54);
  cbThreshSlider.position(margin + 110, drawHeight - 64);
  maxRetrySlider.position(margin + 110, drawHeight - 42);
  poolSlider.position(margin + 110, drawHeight - 20);
  pauseBtn.position(10, drawHeight + 11);
}

// --- simulation ---
function bResolves() {
  // returns {ok, ms}
  if (failMode === 0) return { ok: true, ms: 50 };
  if (failMode === 1) return { ok: true, ms: 5000 };       // slow but succeeds
  if (failMode === 2) return { ok: false, ms: 20 };        // complete fail
  return { ok: random() > 0.3, ms: 50 };                   // intermittent 30% fail
}

function onSuccess(ms) {
  successCount++; totalResolved++; latSum += ms; latCount++;
  pushWindow(1);
  if (cbState === 'half-open') { cbState = 'closed'; cbFailCount = 0; }
  else cbFailCount = Math.max(0, cbFailCount - 1);
}
function onFail() {
  totalResolved++; pushWindow(0);
  cbFailCount++;
  if (cbOn.checked() && cbFailCount >= cbThreshSlider.value()) { cbState = 'open'; cbOpenTimer = 240; }
  if (cbState === 'half-open') { cbState = 'open'; cbOpenTimer = 240; }
}
function onReject(kind) { totalResolved++; pushWindow(0); rejectedRecently = kind; }

function pushWindow(v) { recentWindow.push(v); if (recentWindow.length > 40) recentWindow.shift(); }
function rollingRate() {
  if (recentWindow.length === 0) return 100;
  return Math.round(recentWindow.reduce((a, b) => a + b, 0) / recentWindow.length * 100);
}

// for warm start (no animation): resolve a synthetic request through the gates
function resolveSynthetic() {
  if (cbOn.checked() && cbState === 'open') { onReject('cb'); return; }
  const res = bResolves();
  if (res.ok) onSuccess(res.ms); else onFail();
}

function spawn() {
  // gate: circuit breaker
  if (cbOn.checked() && cbState === 'open') {
    requests.push({ pos: 0.18, y: chY(), state: 'rejected', kind: 'cb', alpha: 255 });
    onReject('cb'); return;
  }
  // gate: bulkhead
  if (bulkOn.checked() && inFlight >= poolSlider.value()) {
    requests.push({ pos: 0.18, y: chY(), state: 'rejected', kind: 'bulk', alpha: 255 });
    onReject('bulk'); return;
  }
  inFlight++;
  requests.push({ pos: 0, y: chY(), state: 'flight', retries: 0, alpha: 255 });
}
function chY() { return 150 + random(-22, 22); }

function stepSim() {
  spawnTimer++;
  if (spawnTimer >= 9) { spawnTimer = 0; spawn(); }
  // circuit breaker open timer
  if (cbState === 'open') { cbOpenTimer--; if (cbOpenTimer <= 0) cbState = 'half-open'; }

  for (const r of requests) {
    if (r.state === 'flight') {
      r.pos += 0.035;
      if (r.pos >= 1) {
        const res = bResolves();
        if (res.ok) { r.state = 'success'; inFlight = Math.max(0, inFlight - 1); onSuccess(res.ms); }
        else {
          if (retryOn.checked() && r.retries < maxRetrySlider.value()) {
            r.retries++; r.state = 'flight'; r.pos = 0.25; r.retry = true;
          } else { r.state = 'fail'; inFlight = Math.max(0, inFlight - 1); onFail(); }
        }
      }
    } else if (r.state === 'success' || r.state === 'fail') {
      r.pos += 0.05; r.alpha -= 7;
    } else if (r.state === 'rejected') { r.alpha -= 6; }
  }
  requests = requests.filter(r => r.alpha > 0 && r.pos < 1.4);

  sampleTimer++;
  if (sampleTimer >= 16) { sampleTimer = 0; timeline.push(rollingRate()); if (timeline.length > 60) timeline.shift(); }
}

function draw() {
  updateCanvasSize();
  layout();
  if (running) stepSim();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(LEFT, TOP); textSize(18);
  text('Resilience Pattern Simulator', margin, 10);
  fill(90); textSize(11);
  text('Toggle patterns, inject a failure, and watch availability and latency respond.', margin, 34);

  drawChannel();
  drawMetrics();
  drawModeTabs();
  drawTimeline();
  drawConfigLabels();
  drawControlHint();
}

function drawChannel() {
  const ax = margin + 36, bx = canvasWidth - margin - 70;
  // channel
  stroke(225); strokeWeight(2); line(ax + 40, 150, bx, 150); noStroke();
  // service boxes
  drawService(ax, 'A', [33, 118, 210]);
  const bColor = failMode === 0 ? [76, 175, 80] : (failMode === 1 ? [245, 196, 80] : [229, 83, 80]);
  drawService(bx, 'B', bColor);
  // dots
  for (const r of requests) {
    const x = lerp(ax + 44, bx, constrain(r.pos, 0, 1));
    let c = [33, 118, 210];
    if (r.state === 'success') c = [76, 175, 80];
    else if (r.state === 'fail') c = [229, 83, 80];
    else if (r.state === 'rejected') c = r.kind === 'cb' ? [150, 150, 150] : [90, 130, 200];
    else if (r.retry) c = [255, 152, 0];
    fill(c[0], c[1], c[2], r.alpha); circle(x, r.y, 9);
    if (r.state === 'flight' && r.retries > 0) { fill(255, 152, 0, r.alpha); textAlign(CENTER, CENTER); textSize(8); text('r' + r.retries, x, r.y - 9); }
  }
  // CB state badge
  const cbc = cbState === 'closed' ? [46, 125, 50] : (cbState === 'half-open' ? [245, 196, 80] : [229, 83, 80]);
  noStroke(); fill(cbc[0], cbc[1], cbc[2]); rect(canvasWidth / 2 - 70, 96, 140, 22, 6);
  fill(cbState === 'half-open' ? 50 : 255); textAlign(CENTER, CENTER); textSize(11.5); textStyle(BOLD);
  text('Circuit: ' + cbState.toUpperCase() + (cbState === 'open' ? ' (' + Math.ceil(cbOpenTimer / 60) + 's)' : ''), canvasWidth / 2, 107); textStyle(NORMAL);
}

function drawService(x, label, c) {
  noStroke(); fill(c[0], c[1], c[2]); rect(x, 132, 40, 36, 7);
  fill(255); textAlign(CENTER, CENTER); textSize(16); textStyle(BOLD); text(label, x + 20, 150); textStyle(NORMAL);
}

function drawMetrics() {
  const y = 196;
  const sr = rollingRate();
  const avg = latCount > 0 ? Math.round(latSum / latCount) : 0;
  // success rate big
  const src = sr >= 90 ? color(46, 125, 50) : (sr >= 60 ? color(245, 150, 0) : color(229, 83, 80));
  noStroke(); fill(60); textAlign(LEFT, TOP); textSize(11); text('Success rate (recent)', margin, y);
  fill(src); textSize(34); textStyle(BOLD); text(sr + '%', margin, y + 14); textStyle(NORMAL);
  // latency + pool
  fill(40); textSize(11); text('Avg latency', margin + 150, y);
  fill(25, 118, 210); textSize(20); textStyle(BOLD); text(avg + ' ms', margin + 150, y + 14); textStyle(NORMAL);
  fill(40); textSize(11); text('Bulkhead pool', margin + 290, y);
  const cap = poolSlider.value();
  fill(bulkOn.checked() ? color(33, 118, 210) : color(150)); textSize(20); textStyle(BOLD);
  text(bulkOn.checked() ? inFlight + ' / ' + cap : 'off', margin + 290, y + 14); textStyle(NORMAL);
  fill(40); textSize(11); text('Retry max', margin + 420, y);
  fill(retryOn.checked() ? color(255, 152, 0) : color(150)); textSize(20); textStyle(BOLD);
  text(retryOn.checked() ? maxRetrySlider.value() + '' : 'off', margin + 420, y + 14); textStyle(NORMAL);
}

function drawModeTabs() {
  const y = 254;
  noStroke(); fill(40); textAlign(LEFT, TOP); textSize(11.5); textStyle(BOLD);
  text('Inject failure into Service B:', margin, y + 6); textStyle(NORMAL);
  const x0 = margin + 180;
  const tw = Math.min(120, (canvasWidth - x0 - margin) / 4);
  textAlign(CENTER, CENTER); textSize(10.5);
  for (let i = 0; i < 4; i++) {
    const x = x0 + i * (tw + 4);
    const active = i === failMode;
    const c = i === 0 ? [46, 125, 50] : [200, 80, 60];
    fill(active ? color(c[0], c[1], c[2]) : color(236)); rect(x, y, tw, 24, 5);
    fill(active ? 255 : 70); text(modes[i], x + tw / 2, y + 12);
  }
}

function drawTimeline() {
  const x = margin, y = 292, w = canvasWidth - margin * 2, h = drawHeight - y - 78;
  fill(255); stroke(210); strokeWeight(1); rect(x, y, w, h, 8); noStroke();
  fill(30, 60, 120); textAlign(LEFT, TOP); textSize(11.5); textStyle(BOLD); text('Success rate — last 60 samples', x + 8, y + 6); textStyle(NORMAL);
  const gx = x + 30, gy = y + 26, gw = w - 40, gh = h - 38;
  stroke(235); strokeWeight(1);
  for (let p = 0; p <= 100; p += 25) { const yy = gy + gh * (1 - p / 100); line(gx, yy, gx + gw, yy);
    noStroke(); fill(150); textAlign(RIGHT, CENTER); textSize(8.5); text(p, gx - 4, yy); stroke(235); }
  noStroke();
  if (timeline.length > 1) {
    stroke(25, 118, 210); strokeWeight(2); noFill(); beginShape();
    for (let i = 0; i < timeline.length; i++) vertex(gx + gw * i / 59, gy + gh * (1 - timeline[i] / 100));
    endShape();
    const last = timeline[timeline.length - 1];
    noStroke(); fill(25, 118, 210); circle(gx + gw * (timeline.length - 1) / 59, gy + gh * (1 - last / 100), 5);
  }
  noStroke();
}

function drawConfigLabels() {
  const y = drawHeight - 70;
  noStroke(); fill(40); textAlign(LEFT, TOP); textSize(10.5);
  text('CB threshold', margin, y + 4); text(cbThreshSlider.value() + '', margin + 228, y + 4);
  text('Max retries', margin, y + 26); text(maxRetrySlider.value() + '', margin + 228, y + 26);
  text('Pool size', margin, y + 48); text(poolSlider.value() + '', margin + 228, y + 48);
}

function drawControlHint() {
  if (canvasWidth < 600) return;
  noStroke(); fill(90); textAlign(LEFT, CENTER); textSize(10.5);
  text('Try Complete Fail with the circuit breaker on, then off, and compare.', 260, drawHeight + controlHeight / 2, canvasWidth - 270);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const y = 254, x0 = margin + 180;
  const tw = Math.min(120, (canvasWidth - x0 - margin) / 4);
  if (mouseY >= y && mouseY <= y + 24) {
    for (let i = 0; i < 4; i++) {
      const x = x0 + i * (tw + 4);
      if (mouseX >= x && mouseX <= x + tw) { failMode = i; return; }
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
