// Active-Passive vs. Active-Active Failover
// CANVAS_HEIGHT: 560
// Bloom L4 (Analyze): students COMPARE two multi-region designs by stepping through the loss of
// Region A and relating replication lag and failover time to RPO and RTO. The failover is a
// step-through (Simulate failure / Next step) so each stage can be read; small moving dots
// only show which way traffic and replication are flowing at the current step.
//
// MODEL (illustrative timings, not measurements of any cloud provider):
//   RPO = replication lag (0 with synchronous replication)
//   RTO, active-passive = detection + promotion of the standby + DNS TTL
//   RTO, active-active  = detection + DNS TTL, and only for clients that were using Region A
//   detection = 30 s (three failed health checks, 10 s apart)

let containerWidth;
let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const DETECT_S = 30;
const BLUE = [25, 118, 210], PURPLE = [123, 31, 162], ORANGE = [239, 108, 0], TEAL = [0, 137, 123];
const GREEN = [46, 125, 50], RED = [198, 40, 40], GRAY = [120, 130, 140], NAVY = [25, 45, 90];

// which region each client is nearest to (used by geographic routing in active-active)
const CLIENT_HOME = ['A', 'A', 'A', 'B', 'B'];

const STEPS = {
  ap: ['normal', 'fail', 'detect', 'promote', 'dns', 'restored'],
  aa: ['normal', 'fail', 'detect', 'dns', 'restored']
};

let modeSelect, stepBtn, resetBtn, lagSlider, promoSlider, ttlSlider;
let step = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const main = document.querySelector('main');
  canvas.parent(main);
  textSize(defaultTextSize);

  modeSelect = createSelect(); modeSelect.parent(main);
  modeSelect.option('Active-passive'); modeSelect.option('Active-active');
  modeSelect.changed(() => { step = 0; });
  stepBtn = createButton('Simulate failure'); stepBtn.parent(main); stepBtn.mousePressed(nextStep);
  resetBtn = createButton('Reset'); resetBtn.parent(main); resetBtn.mousePressed(() => { step = 0; });
  lagSlider = createSlider(0, 60, 5, 1); lagSlider.parent(main);
  promoSlider = createSlider(10, 600, 120, 10); promoSlider.parent(main);
  ttlSlider = createSlider(5, 300, 60, 5); ttlSlider.parent(main);

  layout();
  describe('Two cloud regions, each with a load balancer, an application tier, and a database, sit ' +
    'under a global DNS layer and five clients. In active-passive mode all traffic goes to Region A ' +
    'and Region B is a standby replica; in active-active mode both regions serve traffic and ' +
    'replicate to each other. Stepping through a failure of Region A shows detection, promotion of ' +
    'the standby, and DNS cutover. Timelines for both modes show the recovery point objective set ' +
    'by replication lag and the recovery time objective set by detection, promotion, and DNS TTL.', LABEL);
}

function mode() { return modeSelect.value() === 'Active-passive' ? 'ap' : 'aa'; }
function stage() { return STEPS[mode()][step]; }
function nextStep() { if (step < STEPS[mode()].length - 1) step++; }

function ctlLabelW() { return canvasWidth >= 660 ? 132 : 72; }

function layout() {
  const y1 = drawHeight + 12, y2 = drawHeight + 47;
  modeSelect.position(10, y1); modeSelect.size(canvasWidth >= 660 ? 150 : 124);
  const bx = 10 + (canvasWidth >= 660 ? 150 : 124) + 8;
  stepBtn.position(bx, y1);
  resetBtn.position(bx + 124, y1);
  const colW = (canvasWidth - 20) / 3, lw = ctlLabelW();
  const sw = Math.max(40, colW - lw - 10);
  lagSlider.position(10 + lw, y2); lagSlider.size(sw);
  promoSlider.position(10 + colW + lw, y2); promoSlider.size(sw);
  ttlSlider.position(10 + 2 * colW + lw, y2); ttlSlider.size(sw);
}

// ---------- model ----------
function rtoFor(m) { return DETECT_S + (m === 'ap' ? promoSlider.value() : 0) + ttlSlider.value(); }

function fmtTime(s) {
  if (s === 0) return '0 s';
  if (s < 60) return s + ' s';
  const m = Math.floor(s / 60), r = s % 60;
  return m + ' min' + (r ? ' ' + r + ' s' : '');
}

// what the diagram shows at the current step
function sceneState() {
  const m = mode(), st = stage();
  const failed = st !== 'normal';
  const promoted = m === 'aa' || st === 'promote' || st === 'dns' || st === 'restored';
  const cutover = st === 'dns' || st === 'restored';
  const routes = CLIENT_HOME.map(home => {
    if (cutover) return 'B';
    if (m === 'ap') return failed ? 'X' : 'A';
    return home === 'A' ? (failed ? 'X' : 'A') : 'B';
  });
  return { m: m, st: st, failed: failed, promoted: promoted, cutover: cutover, routes: routes };
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

  const sc = sceneState();
  const narrow = canvasWidth < 660;
  const last = step >= STEPS[sc.m].length - 1;
  const want = step === 0 ? 'Simulate failure' : (last ? 'Recovered' : 'Next step');
  if (stepBtn.html() !== want) stepBtn.html(want);
  if (last) stepBtn.attribute('disabled', ''); else stepBtn.removeAttribute('disabled');
  promoSlider.elt.disabled = sc.m === 'aa';

  fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(narrow ? 14 : 18);
  text(narrow ? 'Active-Passive vs. Active-Active' : 'Active-Passive vs. Active-Active Failover', margin, 10);
  textAlign(RIGHT, TOP); textSize(narrow ? 11.5 : 13); fill(70);
  text('Step ' + (step + 1) + ' of ' + STEPS[sc.m].length, canvasWidth - margin, narrow ? 12 : 14);
  textStyle(NORMAL);

  drawScene(sc, narrow);
  drawTimelines(sc, 292, 76, narrow);
  drawStepText(sc, 374, drawHeight - 8 - 374);
  drawControlLabels(sc);
}

function drawScene(sc, narrow) {
  const W = canvasWidth;
  const cy = 50, dnsY = 72, dnsH = 22, regY = 114, regH = 170;
  const gapW = narrow ? 56 : 96;
  const regW = (W - margin * 2 - gapW) / 2;
  const ax = margin, bx = margin + regW + gapW;
  const lbY = regY + 32, appY = regY + 76, dbY = regY + 120, boxH = 32;
  const boxW = Math.min(190, regW - 28);
  const acx = ax + regW / 2, bcx = bx + regW / 2;
  const t = millis() / 1000;

  // DNS layer
  const dx0 = W * 0.16, dx1 = W * 0.84;
  fill(255); stroke(TEAL[0], TEAL[1], TEAL[2]); strokeWeight(1.5); rect(dx0, dnsY, dx1 - dx0, dnsH, 6); noStroke();
  fill(0, 105, 92); textAlign(CENTER, CENTER); textStyle(BOLD); textSize(narrow ? 11 : 12.5);
  let dnsTxt;
  if (sc.cutover) dnsTxt = 'Global DNS: all clients → Region B';
  else if (sc.failed) dnsTxt = narrow ? 'Global DNS: still answering Region A' : 'Global DNS: cached answers still point at Region A';
  else dnsTxt = sc.m === 'ap' ? 'Global DNS: all clients → Region A' : 'Global DNS: nearest healthy region';
  text(fitText(dnsTxt, dx1 - dx0 - 12), (dx0 + dx1) / 2, dnsY + dnsH / 2); textStyle(NORMAL);

  // clients: blue while they are being served, red while their requests fail
  for (let i = 0; i < 5; i++) {
    const x = lerp(dx0 + 20, dx1 - 20, i / 4);
    const bad = sc.routes[i] === 'X';
    const col = bad ? RED : BLUE;
    stroke(col[0], col[1], col[2]); strokeWeight(1.5);
    if (bad) drawingContext.setLineDash([3, 3]);
    line(x, cy + 9, x, dnsY); drawingContext.setLineDash([]);
    fill(col[0], col[1], col[2]); stroke(255); strokeWeight(1.5); circle(x, cy, 18); noStroke();
    fill(255); textAlign(CENTER, CENTER); textStyle(BOLD); textSize(11); text(i + 1, x, cy); textStyle(NORMAL);
  }
  fill(70); textSize(11); textAlign(LEFT, CENTER);
  if (!narrow) text('Clients', margin + 2, cy);

  // regions
  const aFailed = sc.failed;
  const bStatus = sc.m === 'aa' ? 'ACTIVE' : (sc.promoted ? 'ACTIVE (promoted)' : 'STANDBY');
  drawRegion('Region A', ax, regY, regW, regH, aFailed ? 'FAILED' : 'ACTIVE', aFailed, boxW, [lbY, appY, dbY], boxH,
    ['Load balancer', aFailed ? 'App tier' : 'App tier (serving)', sc.m === 'aa' ? 'Database (primary)' : 'Database (primary)'], narrow);
  const bApp = sc.m === 'aa' || sc.promoted ? 'App tier (serving)' : 'App tier (idle)';
  const bDb = sc.m === 'aa' || sc.promoted ? 'Database (primary)' : 'Database (replica)';
  drawRegion('Region B', bx, regY, regW, regH, bStatus, false, boxW, [lbY, appY, dbY], boxH,
    ['Load balancer', bApp, bDb], narrow, sc.st === 'promote');

  // traffic from DNS into each region: one arrow per region, as wide as the clients it carries
  const nA = sc.routes.filter(r => r === 'A').length, nB = sc.routes.filter(r => r === 'B').length;
  const nX = sc.routes.filter(r => r === 'X').length;
  drawTraffic(acx, dnsY + dnsH, lbY, nA, nX, t, narrow);
  drawTraffic(bcx, dnsY + dnsH, lbY, nB, 0, t, narrow);

  // replication between the two databases
  const rx0 = acx + boxW / 2, rx1 = bcx - boxW / 2, ry = dbY + boxH / 2;
  const lag = lagSlider.value();
  if (!sc.failed) {
    stroke(PURPLE[0], PURPLE[1], PURPLE[2]); strokeWeight(2);
    if (sc.m === 'ap') { arrow(rx0 + 2, ry, rx1 - 2, ry); }
    else { arrow(rx0 + 2, ry - 5, rx1 - 2, ry - 5); arrow(rx1 - 2, ry + 5, rx0 + 2, ry + 5); }
    noStroke(); fill(PURPLE[0], PURPLE[1], PURPLE[2]);
    const f = (t * 0.5) % 1;
    circle(lerp(rx0, rx1, f), sc.m === 'ap' ? ry : ry - 5, 6);
    if (sc.m === 'aa') circle(lerp(rx1, rx0, f), ry + 5, 6);
  } else {
    stroke(RED[0], RED[1], RED[2]); strokeWeight(2); drawingContext.setLineDash([4, 4]);
    line(rx0 + 2, ry, rx1 - 2, ry); drawingContext.setLineDash([]); noStroke();
  }
  noStroke(); textAlign(CENTER, BOTTOM); textSize(narrow ? 10 : 11); textStyle(BOLD);
  fill(sc.failed ? color(RED[0], RED[1], RED[2]) : color(PURPLE[0], PURPLE[1], PURPLE[2]));
  const gx = (rx0 + rx1) / 2;
  if (sc.failed) {
    text(lag === 0 ? 'no loss' : 'lost', gx, ry - 18);
    text(lag === 0 ? '(sync)' : fmtTime(lag), gx, ry - 6);
  } else {
    text(narrow ? 'repl.' : 'replication', gx, ry - 20);
    text(lag === 0 ? 'synchronous' : 'lag ' + fmtTime(lag), gx, ry - 8);
  }
  textStyle(NORMAL);
}

function drawTraffic(x, y0, y1, served, failing, t, narrow) {
  const n = served + failing;
  const col = failing ? RED : (served ? BLUE : GRAY);
  stroke(col[0], col[1], col[2]); strokeWeight(n ? 1.5 + n * 0.8 : 1.2);
  if (failing || !n) drawingContext.setLineDash([4, 4]);
  line(x, y0, x, y1 - (n ? 5 : 0)); drawingContext.setLineDash([]);
  if (served) { strokeWeight(2); line(x, y1, x - 6, y1 - 8); line(x, y1, x + 6, y1 - 8); }
  noStroke();
  if (served) {
    fill(255); stroke(col[0], col[1], col[2]); strokeWeight(1.5);
    circle(x, lerp(y0, y1 - 8, (t * 0.9) % 1), 7); noStroke();
  }
  textAlign(LEFT, CENTER); textSize(narrow ? 10.5 : 11.5); textStyle(BOLD);
  fill(col[0], col[1], col[2]);
  const lbl = failing ? failing + ' failing' : (served ? served + (served === 1 ? ' client' : ' clients') : 'no traffic');
  text(lbl, x + 10, y0 + 9);
  if (failing) { textAlign(CENTER, CENTER); textSize(14); text('✕', x, (y0 + y1) / 2 + 6); }
  textStyle(NORMAL);
}

function arrow(x0, y0, x1, y1) {
  line(x0, y0, x1, y1);
  const a = Math.atan2(y1 - y0, x1 - x0), s = 6;
  line(x1, y1, x1 - s * Math.cos(a - 0.5), y1 - s * Math.sin(a - 0.5));
  line(x1, y1, x1 - s * Math.cos(a + 0.5), y1 - s * Math.sin(a + 0.5));
}

function drawRegion(name, x, y, w, h, status, failed, boxW, ys, boxH, labels, narrow, pulsing) {
  const c = failed ? RED : (status === 'STANDBY' ? GRAY : GREEN);
  stroke(c[0], c[1], c[2]); strokeWeight(failed ? 2 : 1.5);
  fill(failed ? color(253, 236, 234) : color(255)); rect(x, y, w, h, 10); noStroke();
  fill(30); textAlign(LEFT, TOP); textStyle(BOLD); textSize(13); text(name, x + 10, y + 8);
  // status badge
  textSize(10.5);
  const st = narrow && status.startsWith('ACTIVE (') ? 'PROMOTED' : status;
  const bw = textWidth(st) + 12;
  fill(c[0], c[1], c[2]); rect(x + w - bw - 8, y + 7, bw, 16, 4);
  fill(255); textAlign(CENTER, CENTER); text(st, x + w - bw / 2 - 8, y + 15);
  textStyle(NORMAL);
  const cx = x + w / 2;
  for (let i = 0; i < 3; i++) {
    const idle = labels[i].includes('(idle)') || labels[i].includes('(replica)');
    if (i > 0) { stroke(failed ? color(210, 170, 170) : color(150)); strokeWeight(1.5); line(cx, ys[i - 1] + boxH, cx, ys[i]); }
    stroke(failed ? color(210, 150, 150) : (idle ? color(160) : color(BLUE[0], BLUE[1], BLUE[2])));
    strokeWeight(pulsing && i > 0 ? 2.5 : 1.3);
    if (idle) drawingContext.setLineDash([4, 3]);
    fill(failed ? color(245, 225, 225) : (idle ? color(244) : color(227, 240, 252)));
    rect(cx - boxW / 2, ys[i], boxW, boxH, 6); drawingContext.setLineDash([]);
    noStroke(); fill(failed ? color(150, 90, 90) : (idle ? color(110) : color(25)));
    textAlign(CENTER, CENTER); textSize(boxW < 150 ? 11 : 12.5);
    text(fitText(labels[i], boxW - 8), cx, ys[i] + boxH / 2);
  }
  if (failed) {
    stroke(RED[0], RED[1], RED[2], 120); strokeWeight(3);
    line(x + 14, y + 30, x + w - 14, y + h - 10); line(x + w - 14, y + 30, x + 14, y + h - 10); noStroke();
  }
}

function panel(x, y, w, h) { fill(255); stroke(200); strokeWeight(1); rect(x, y, w, h, 8); noStroke(); }

// one recovery timeline per mode on a shared time scale; the current mode fills in step by step
function drawTimelines(sc, y, h, narrow) {
  const x = margin, w = canvasWidth - margin * 2;
  panel(x, y, w, h);
  const lag = lagSlider.value();
  const labW = narrow ? 92 : 112, valW = narrow ? 96 : 176;
  const bx0 = x + 10 + labW, bx1 = x + w - 10 - valW;
  const rtoMax = Math.max(rtoFor('ap'), rtoFor('aa'));
  const span = lag + rtoMax;                       // seconds shown: lag before the failure, RTO after
  const px = s => bx0 + (s + lag) / span * (bx1 - bx0);
  const rows = [['ap', 'Active-passive'], ['aa', 'Active-active']];
  noStroke(); fill(90); textSize(10.5); textAlign(CENTER, TOP);
  text('failure', px(0), y + 4);
  for (let r = 0; r < 2; r++) {
    const m = rows[r][0], cur = m === sc.m;
    const ry = y + 20 + r * 26, bh = 14;
    const alpha = cur ? 255 : 90;
    fill(30, 30, 30, alpha); textAlign(LEFT, CENTER); textSize(narrow ? 11.5 : 12.5); textStyle(cur ? BOLD : NORMAL);
    text(rows[r][1], x + 10, ry + bh / 2); textStyle(NORMAL);
    fill(236, 239, 242); rect(bx0, ry, bx1 - bx0, bh, 3);
    // RPO window: writes made in the lag before the failure
    if (lag > 0) { const rw = Math.max(6, px(0) - px(-lag)); fill(RED[0], RED[1], RED[2], alpha); rect(px(0) - rw, ry, rw, bh, 2); }
    // RTO segments
    const segs = [['detect', DETECT_S, ORANGE]];
    if (m === 'ap') segs.push(['promote', promoSlider.value(), PURPLE]);
    segs.push(['dns', ttlSlider.value(), BLUE]);
    const order = STEPS[m];
    let s0 = 0;
    for (const sg of segs) {
      // in the current mode a segment is solid once its step has been reached
      const reached = !cur || step >= order.indexOf(sg[0]);
      fill(sg[2][0], sg[2][1], sg[2][2], reached ? alpha : 60);
      rect(px(s0), ry, Math.max(2, px(s0 + sg[1]) - px(s0)), bh, 2);
      s0 += sg[1];
    }
    stroke(20, 20, 20, alpha); strokeWeight(1.5); line(px(0), ry - 3, px(0), ry + bh + 3); noStroke();
    fill(20, 20, 20, alpha); textAlign(LEFT, CENTER); textStyle(BOLD); textSize(narrow ? 11 : 12);
    text(fitText('RTO ' + fmtTime(rtoFor(m)) + (narrow ? '' : ' · RPO ' + fmtTime(lag)), valW - 4), bx1 + 8, ry + bh / 2);
    textStyle(NORMAL);
  }
  // key
  let kx = bx0; const ky = y + h - 9;
  textSize(10.5); textAlign(LEFT, CENTER);
  const keys = [['lost writes (RPO)', RED], ['detect ' + DETECT_S + ' s', ORANGE], ['promote standby', PURPLE], ['DNS TTL', BLUE]];
  for (const k of keys) {
    if (kx + 12 + textWidth(k[0]) > x + w - 8) break;
    fill(k[1][0], k[1][1], k[1][2]); rect(kx, ky - 4, 8, 8, 2);
    fill(80); text(k[0], kx + 11, ky + 0.5);
    kx += 11 + textWidth(k[0]) + 12;
  }
}

function drawStepText(sc, y, h) {
  const x = margin, w = canvasWidth - margin * 2;
  panel(x, y, w, h);
  const tx = x + 10, tw = w - 20, limit = y + h - 4;
  const lag = lagSlider.value(), promo = promoSlider.value(), ttl = ttlSlider.value();
  const lagTxt = lag === 0 ? 'no writes (replication is synchronous)' : 'the last ' + fmtTime(lag) + ' of writes';
  let head, body;
  if (sc.m === 'ap') {
    if (sc.st === 'normal') {
      head = 'Normal operation: one region serves, one waits';
      body = 'Every client is routed to Region A. Region B is a standby: its application tier is idle and its replica applies ' +
        'changes from A ' + (lag === 0 ? 'synchronously, so every write waits for B to confirm it.' : 'about ' + fmtTime(lag) + ' behind.') +
        ' The standby costs money and does no work until the day it is needed.';
    } else if (sc.st === 'fail') {
      head = 'Region A fails';
      body = 'Clients still resolve to Region A, so every request fails. Region B holds everything except ' + lagTxt +
        '. That gap is the recovery point: RPO = replication lag = ' + fmtTime(lag) + '.';
    } else if (sc.st === 'detect') {
      head = 'Failure detected after ' + DETECT_S + ' s';
      body = 'Three health checks in a row fail, 10 s apart, before automation (or an operator) declares the region down. ' +
        'Detecting faster shortens the outage but raises the risk of failing over on a brief network glitch.';
    } else if (sc.st === 'promote') {
      head = 'Standby promoted: ' + fmtTime(promo);
      body = 'The replica in Region B is promoted to primary and the idle application tier is started and connected. ' +
        'A warm standby keeps this short; a cold one has to boot first. Until it finishes there is nothing for clients to reach.';
    } else if (sc.st === 'dns') {
      head = 'DNS cutover: up to ' + fmtTime(ttl);
      body = 'DNS now answers with Region B, but clients and resolvers keep the old answer until its TTL expires. ' +
        'A short TTL speeds the cutover at the price of more DNS lookups in normal operation.';
    } else {
      head = 'Service restored: RTO ' + fmtTime(rtoFor('ap')) + ', RPO ' + fmtTime(lag);
      body = 'RTO = ' + DETECT_S + ' s detection + ' + fmtTime(promo) + ' promotion + ' + fmtTime(ttl) + ' DNS TTL. ' +
        'Region A must later be rebuilt as the new standby and its unreplicated writes reconciled or discarded. ' +
        'An untested failover is a hypothesis: rehearse it.';
    }
  } else {
    if (sc.st === 'normal') {
      head = 'Normal operation: both regions serve';
      body = 'Clients 1 to 3 are routed to Region A and clients 4 and 5 to Region B. Both databases accept writes and replicate to ' +
        'each other' + (lag === 0 ? ' synchronously, which adds cross-region latency to every write.' : ' about ' + fmtTime(lag) +
        ' behind, so conflicting writes to the same record must be detected and resolved.') + ' No capacity sits idle.';
    } else if (sc.st === 'fail') {
      head = 'Region A fails';
      body = 'Clients 4 and 5 notice nothing. Clients 1 to 3 fail until they are rerouted. Region B is missing ' + lagTxt +
        ' accepted by Region A: RPO = replication lag = ' + fmtTime(lag) + ', the same rule as active-passive.';
    } else if (sc.st === 'detect') {
      head = 'Failure detected after ' + DETECT_S + ' s';
      body = 'Health checks mark Region A unhealthy and DNS stops handing it out. There is nothing to promote: Region B is ' +
        'already serving and its database is already a primary.';
    } else if (sc.st === 'dns') {
      head = 'DNS cutover: up to ' + fmtTime(ttl);
      body = 'Clients 1 to 3 move to Region B as their cached DNS answers expire. Skipping the promotion step is what makes ' +
        'the active-active recovery time shorter.';
    } else {
      head = 'Service restored: RTO ' + fmtTime(rtoFor('aa')) + ' for 3 of 5 clients, RPO ' + fmtTime(lag);
      body = 'RTO = ' + DETECT_S + ' s detection + ' + fmtTime(ttl) + ' DNS TTL. Region B now carries all of the load, so each ' +
        'region must be sized with headroom for the other\'s traffic. The price of this design is paid every day in conflict handling.';
    }
  }
  fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(13.5);
  text(fitText(head, tw), tx, y + 8); textStyle(NORMAL);
  drawWrapped(body, tx, y + 28, tw, 12.5, 16, color(30), limit);
}

function drawControlLabels(sc) {
  const big = canvasWidth >= 660;
  const colW = (canvasWidth - 20) / 3;
  const y = drawHeight + 57;
  noStroke(); textAlign(LEFT, CENTER); textSize(big ? 12.5 : 11); textStyle(NORMAL);
  const lag = lagSlider.value();
  fill(30); text(big ? 'Replication lag: ' + (lag === 0 ? 'sync' : lag + ' s') : (lag === 0 ? 'Lag: sync' : 'Lag: ' + lag + ' s'), 10, y);
  fill(sc.m === 'aa' ? 160 : 30);
  text((big ? 'Promotion time: ' : 'Promo: ') + promoSlider.value() + ' s', 10 + colW, y);
  fill(30); text((big ? 'DNS TTL: ' : 'TTL: ') + ttlSlider.value() + ' s', 10 + 2 * colW, y);
  if (canvasWidth >= 600) {
    fill(100); textSize(11.5); textAlign(RIGHT, CENTER);
    text('Illustrative timings.', canvasWidth - 12, drawHeight + 23);
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
