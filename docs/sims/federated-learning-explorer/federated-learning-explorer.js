// Federated Learning Architecture
// CANVAS_HEIGHT: 545
// Bloom L4 (Analyze): students EXAMINE the federated averaging loop one phase at a time and
// relate four design parameters (privacy budget, data heterogeneity, rounds, participation) to
// the accuracy the global model reaches. The loop is a step-through (Next phase / Next round);
// dots move only while a phase that sends something over the network is on screen.
//
// THE CURVES ARE COMPUTED, NOT DRAWN: every change of a slider reruns real federated averaging
// on a small synthetic problem in the browser.
//   Task      two overlapping Gaussian classes in 2-D; the model is logistic regression
//             (3 weights). Six hospitals hold 60 to 120 records each; none are shared.
//   Round     the coordinator picks the participants; each trains 5 local passes of gradient
//             descent from the global weights and returns its update (new minus old weights);
//             updates are clipped to norm 0.3; the coordinator takes their record-weighted
//             average, adds Gaussian noise, and applies the result (McMahan et al., FedAvg).
//   Privacy   noise std = sensitivity * sqrt(2 ln(1.25/delta)) / epsilon, delta = 1e-5
//             (the classical Gaussian mechanism, derived for epsilon below 1 and used here over
//             the whole slider range as a teaching calibration), sensitivity = clip norm *
//             largest participant weight. This is a per-round figure; a real system tracks the
//             cumulative privacy loss over all rounds with a privacy accountant.
//   Start     the global model starts from fixed poor weights, about as accurate as guessing.
//   Non-IID   skew 0 gives every hospital the same mix; skew 1 gives each a lopsided class mix
//             and a shifted patient population.
// Accuracy is measured on 600 held-out points. The numbers describe this toy problem only.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const BLUE = [25, 118, 210], ORANGE = [230, 110, 0], PURPLE = [123, 31, 162], TEAL = [0, 137, 123];
const GREEN = [46, 125, 50], RED = [198, 40, 40], NAVY = [25, 45, 90], GRAY = [120, 130, 140];

// ---------- the toy federated learning problem ----------
const CLIENT_N = [120, 90, 60, 60, 90, 120];
const NAMES = ['A', 'B', 'C', 'D', 'E', 'F'];
const TEST_N = 100;                       // held-out points per hospital
const MU = [[-1.1, -0.7], [1.1, 0.7]];    // class means
const SKEW = 0.42, SHIFT = 1.3;           // class-mix skew and population shift at skew = 1
const LOCAL_EPOCHS = 5, LOCAL_LR = 0.5, CLIP = 0.3, DELTA = 1e-5;
const INIT_W = [0.6, -1.2, 0.5];          // a poor starting model, about as good as guessing
const DP_C = Math.sqrt(2 * Math.log(1.25 / DELTA));
const EPS_GRID = [0.1, 0.18, 0.32, 0.56, 1, 1.8, 3.2, 5.6, 10];

function rng(seed) {                      // mulberry32
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function gauss(r) { return Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r()); }

// fixed random draws, reused for every setting so that results change smoothly with the sliders
let base = null;
function makeBase() {
  const r = rng(424242);
  base = { train: [], test: [] };
  for (let k = 0; k < 6; k++) {
    for (const [key, n] of [['train', CLIENT_N[k]], ['test', TEST_N]]) {
      const pts = [];
      for (let i = 0; i < n; i++) pts.push([r(), gauss(r), gauss(r)]);
      base[key].push(pts);
    }
  }
}

// class share of class 1 at hospital k, and its data set, for a given skew h
function classShare(k, h) { return 0.5 + (k < 3 ? -1 : 1) * SKEW * h; }
function makeData(h) {
  const d = { train: [], test: [] };
  for (let k = 0; k < 6; k++) {
    const p1 = classShare(k, h), a = (k * 60 + 30) * Math.PI / 180;
    const sx = h * SHIFT * Math.cos(a), sy = h * SHIFT * Math.sin(a);
    for (const key of ['train', 'test']) {
      const X = [], Y = [];
      for (const p of base[key][k]) {
        const y = p[0] < p1 ? 1 : 0;
        X.push([MU[y][0] + p[1] + sx, MU[y][1] + p[2] + sy]); Y.push(y);
      }
      d[key].push({ X: X, Y: Y });
    }
  }
  return d;
}

function sigmoid(z) { return 1 / (1 + Math.exp(-z)); }
// full-batch gradient descent on logistic loss, in place
function trainLocal(w, set, epochs, lr) {
  const n = set.X.length;
  for (let e = 0; e < epochs; e++) {
    let g0 = 0, g1 = 0, g2 = 0;
    for (let i = 0; i < n; i++) {
      const x = set.X[i], err = sigmoid(w[0] * x[0] + w[1] * x[1] + w[2]) - set.Y[i];
      g0 += err * x[0]; g1 += err * x[1]; g2 += err;
    }
    w[0] -= lr * g0 / n; w[1] -= lr * g1 / n; w[2] -= lr * g2 / n;
  }
}
function accuracy(w, tests) {
  let ok = 0, n = 0;
  for (const t of tests) {
    for (let i = 0; i < t.X.length; i++) {
      const pred = w[0] * t.X[i][0] + w[1] * t.X[i][1] + w[2] > 0 ? 1 : 0;
      if (pred === t.Y[i]) ok++; n++;
    }
  }
  return ok / n;
}

// One complete run of federated averaging. Returns accuracy after every round and who took part.
function fedRun(data, eps, frac, rounds, noiseSeed, wantCurve, sign) {
  sign = sign || 1;                       // -1 mirrors the noise (antithetic pair), used to steady the tradeoff curve
  const pickR = rng(777), noiseR = rng(noiseSeed);
  const m = Math.max(1, Math.round(frac * 6));
  const w = INIT_W.slice();
  const acc = wantCurve ? [accuracy(w, data.test)] : null, picks = [];
  let tail = 0, tailN = 0;
  for (let r = 0; r < rounds; r++) {
    // sample m participants without replacement
    const ids = [0, 1, 2, 3, 4, 5];
    for (let i = 5; i > 0; i--) { const j = Math.floor(pickR() * (i + 1)); const t = ids[i]; ids[i] = ids[j]; ids[j] = t; }
    const part = ids.slice(0, m).sort();
    picks.push(part);
    let total = 0, maxN = 0;
    for (const k of part) { total += CLIENT_N[k]; maxN = Math.max(maxN, CLIENT_N[k]); }
    const sum = [0, 0, 0];
    for (const k of part) {
      const wl = w.slice();
      trainLocal(wl, data.train[k], LOCAL_EPOCHS, LOCAL_LR);
      const d = [wl[0] - w[0], wl[1] - w[1], wl[2] - w[2]];
      const norm = Math.hypot(d[0], d[1], d[2]);
      const s = norm > CLIP ? CLIP / norm : 1;                      // clip the update
      for (let j = 0; j < 3; j++) sum[j] += CLIENT_N[k] / total * d[j] * s;
    }
    const sigma = (maxN / total) * CLIP * DP_C / eps;               // Gaussian mechanism on the average
    for (let j = 0; j < 3; j++) w[j] += sum[j] + sign * sigma * gauss(noiseR);
    const needAcc = wantCurve || r >= rounds - 5;
    if (needAcc) {
      const a = accuracy(w, data.test);
      if (wantCurve) acc.push(a);
      if (r >= rounds - 5) { tail += a; tailN++; }
    }
  }
  return { acc: acc, picks: picks, final: tail / tailN, m: m };
}

// accuracy of the same model trained on all records pooled in one place
function centralBaseline(data) {
  const pooled = { X: [], Y: [] };
  for (const c of data.train) { pooled.X = pooled.X.concat(c.X); pooled.Y = pooled.Y.concat(c.Y); }
  const w = [0, 0, 0];
  trainLocal(w, pooled, 300, LOCAL_LR);
  return accuracy(w, data.test);
}

// ---------- state ----------
let epsSlider, hetSlider, roundSlider, fracSlider, phaseBtn, roundBtn, resetBtn;
let model = null, modelKey = '', curve = null, curveKey = '';
let pendingKey = '', pendingSince = 0;   // the tradeoff curve is recomputed once a slider settles
let viewRound = 1, phase = 1;      // the round and phase shown in the diagram

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const main = document.querySelector('main');
  canvas.parent(main);
  textSize(defaultTextSize);
  makeBase();

  epsSlider = createSlider(-1, 1, 0.5, 0.05); epsSlider.parent(main);          // log10 of epsilon
  hetSlider = createSlider(0, 1, 0.3, 0.05); hetSlider.parent(main);
  roundSlider = createSlider(1, 100, 30, 1); roundSlider.parent(main);
  fracSlider = createSlider(0.2, 1, 0.5, 0.1); fracSlider.parent(main);
  phaseBtn = createButton('Next phase'); phaseBtn.parent(main);
  phaseBtn.mousePressed(() => { if (phase < 4) phase++; else nextRound(); });
  roundBtn = createButton('Next round'); roundBtn.parent(main); roundBtn.mousePressed(nextRound);
  resetBtn = createButton('Reset'); resetBtn.parent(main);
  resetBtn.mousePressed(() => {
    epsSlider.value(0.5); hetSlider.value(0.3); roundSlider.value(30); fracSlider.value(0.5); viewRound = 1; phase = 1;
  });

  layout();
  describe('A federated learning system with a central coordinator and six hospitals. Stepping ' +
    'through a round shows the coordinator sending the global model to the selected hospitals, the ' +
    'hospitals training on their own records, the hospitals returning clipped model updates, and ' +
    'the coordinator averaging them with added noise. A chart plots global model accuracy against ' +
    'rounds for the chosen settings and a second chart plots final accuracy against the privacy ' +
    'budget epsilon. Sliders set the privacy budget, how different the hospitals\' data are, the ' +
    'number of rounds, and the share of hospitals taking part in each round.', LABEL);
}

function nextRound() { viewRound = viewRound >= roundSlider.value() ? 1 : viewRound + 1; phase = 1; }
function eps() { return Math.pow(10, epsSlider.value()); }
function fmtEps(e) { return e >= 10 ? '10' : (e >= 1 ? e.toFixed(1) : e.toFixed(2)); }
function ctlLabelW() { return canvasWidth >= 660 ? 188 : 108; }

function layout() {
  const colW = (canvasWidth - 20) / 2, lw = ctlLabelW(), sw = Math.max(50, colW - lw - 14);
  epsSlider.position(10 + lw, drawHeight + 9); epsSlider.size(sw);
  hetSlider.position(10 + colW + lw, drawHeight + 9); hetSlider.size(sw);
  roundSlider.position(10 + lw, drawHeight + 42); roundSlider.size(sw);
  fracSlider.position(10 + colW + lw, drawHeight + 42); fracSlider.size(sw);
  const y = drawHeight + 80;
  phaseBtn.position(10, y); roundBtn.position(10 + 96, y); resetBtn.position(10 + 96 + 98, y);
}

// rerun the simulation only when a parameter changed
function refresh() {
  const e = eps(), h = hetSlider.value(), R = roundSlider.value(), f = fracSlider.value();
  const key = [e, h, R, f].join('|');
  if (key !== modelKey) {
    const data = makeData(h);
    model = fedRun(data, e, f, R, 99, true);
    model.eps = e; model.h = h; model.R = R; model.f = f; model.central = centralBaseline(data);
    modelKey = key;
    viewRound = Math.min(viewRound, R);
  }
  // final accuracy against epsilon costs 54 runs, so wait until the slider has settled
  const ck = [h, R, f].join('|');
  if (ck !== curveKey) {
    if (ck !== pendingKey) { pendingKey = ck; pendingSince = millis(); }
    if (curve === null || !mouseIsPressed || millis() - pendingSince > 400) {
      const data = makeData(h);
      curve = EPS_GRID.map(ev => {
        let sum = 0;
        for (const seed of [11, 22, 33]) for (const sg of [1, -1]) sum += fedRun(data, ev, f, R, seed, false, sg).final;
        return sum / 6;
      });
      curveKey = ck;
    }
  }
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

  refresh();
  const narrow = canvasWidth < 660;
  fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(narrow ? 14.5 : 18);
  text(narrow ? 'Federated Learning' : 'Federated Learning Architecture', margin, 10);
  textAlign(RIGHT, TOP); textSize(narrow ? 12 : 13.5); fill(60);
  text('Round ' + viewRound + ' of ' + model.R + ' · phase ' + phase + ' of 4', canvasWidth - margin, narrow ? 12 : 13);
  textStyle(NORMAL);

  const full = canvasWidth - margin * 2, top = 38;
  if (!narrow) {
    const dw = Math.round(full * 0.44), dh = 250, cx = margin + dw + 8, cw = full - dw - 8;
    drawDiagram(margin, top, dw, dh, false);
    drawConvergence(cx, top, cw, 122);
    drawTradeoff(cx, top + 128, cw, 122);
    drawStatus(margin, top + dh + 6, full, drawHeight - 8 - (top + dh + 6), false);
  } else {
    drawDiagram(margin, top, full, 196, true);
    drawConvergence(margin, top + 202, full, 96);
    drawStatus(margin, top + 304, full, drawHeight - 8 - (top + 304), true);
  }
  drawControlLabels();
}

function panel(x, y, w, h) { fill(255); stroke(200); strokeWeight(1); rect(x, y, w, h, 8); noStroke(); }

function drawDiagram(x, y, w, h, narrow) {
  panel(x, y, w, h);
  const cx = x + w / 2, cy = y + h / 2 - (narrow ? 0 : 6);
  const rx = Math.min(w / 2 - (narrow ? 44 : 50), 150), ry = h / 2 - (narrow ? 30 : 42);
  const nw = narrow ? 78 : 84, nh = narrow ? 32 : 38;
  const part = model.picks[viewRound - 1];
  const t = millis() / 1000;
  const pos = k => { const a = (-90 + k * 60) * Math.PI / 180; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; };

  // links and whatever is travelling on them in this phase
  for (let k = 0; k < 6; k++) {
    const p = pos(k), on = part.includes(k);
    const moving = on && (phase === 1 || phase === 3);
    const col = !on ? [205, 210, 216] : (phase === 3 ? ORANGE : (phase === 1 ? BLUE : GRAY));
    stroke(col[0], col[1], col[2]); strokeWeight(on ? 2 : 1.2);
    if (!on) drawingContext.setLineDash([3, 4]);
    line(cx, cy, p[0], p[1]); drawingContext.setLineDash([]); noStroke();
    if (moving) {
      for (let j = 0; j < 2; j++) {
        const f = (t * 0.8 + j * 0.5 + k * 0.13) % 1, g = phase === 1 ? f : 1 - f;
        fill(col[0], col[1], col[2]); circle(lerp(cx, p[0], g), lerp(cy, p[1], g), 7);
      }
    }
  }
  // coordinator
  const hubR = narrow ? 30 : 36;
  stroke(phase === 4 ? color(ORANGE[0], ORANGE[1], ORANGE[2]) : color(NAVY[0], NAVY[1], NAVY[2])); strokeWeight(phase === 4 ? 3 : 2);
  fill(phase === 4 ? color(255, 236, 205) : color(227, 236, 250)); circle(cx, cy, hubR * 2); noStroke();
  fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(CENTER, CENTER); textStyle(BOLD); textSize(narrow ? 9.5 : 11);
  text('Coordinator', cx, cy - 7); textStyle(NORMAL); textSize(narrow ? 9 : 10);
  text(phase === 4 ? 'averages' : 'global model', cx, cy + 6);

  // hospitals: name, record count, and class mix of the local data
  for (let k = 0; k < 6; k++) {
    const p = pos(k), on = part.includes(k);
    const training = on && phase === 2;
    const bx = p[0] - nw / 2, by = p[1] - nh / 2;
    stroke(training ? color(GREEN[0], GREEN[1], GREEN[2]) : (on ? color(TEAL[0], TEAL[1], TEAL[2]) : color(185)));
    strokeWeight(training ? 2.2 + Math.sin(t * 6) * 0.8 : (on ? 1.8 : 1.2));
    fill(training ? color(232, 245, 233) : (on ? color(224, 242, 241) : color(246)));
    rect(bx, by, nw, nh, 6); noStroke();
    fill(on ? 20 : 130); textAlign(LEFT, TOP); textStyle(BOLD); textSize(narrow ? 9.5 : 10.5);
    text('Hospital ' + NAMES[k], bx + 5, by + 4); textStyle(NORMAL);
    textAlign(RIGHT, TOP); textSize(9.5); fill(on ? 80 : 150); text(CLIENT_N[k], bx + nw - 5, by + 5);
    // class-mix bar: purple share is class 1
    const share = classShare(k, model.h), mx = bx + 5, mw = nw - 10, my = by + nh - 11;
    fill(BLUE[0], BLUE[1], BLUE[2], on ? 255 : 110); rect(mx, my, mw, 6, 2);
    fill(PURPLE[0], PURPLE[1], PURPLE[2], on ? 255 : 110); rect(mx + mw * (1 - share), my, mw * share, 6, 2);
  }
  if (!narrow) {
    fill(95); textSize(10); textAlign(CENTER, BOTTOM);
    text(fitText('number = records, bar = class mix; records never leave', w - 12), cx, y + h - 5);
  }
}

// accuracy of the global model after each round
function drawConvergence(x, y, w, h) {
  panel(x, y, w, h);
  const px = x + 38, pw = w - 38 - 12, py = y + 24, ph = h - 24 - 20;
  const R = model.R, lo = 0, hi = 1.0;
  const sx = r => px + pw * r / Math.max(1, R), sy = a => py + ph - ph * (constrain(a, lo, hi) - lo) / (hi - lo);
  const last = model.acc[R];
  fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(12);
  text(fitText('Global model accuracy by round', w - 110), x + 9, y + 7);
  textAlign(RIGHT, TOP); fill(BLUE[0], BLUE[1], BLUE[2]);
  text('final ' + (last * 100).toFixed(1) + '%', x + w - 10, y + 7); textStyle(NORMAL);
  // axes
  textSize(10); fill(95);
  for (const a of [0, 0.5, 1.0]) {
    stroke(a === 0.5 ? color(190) : color(225)); strokeWeight(1);
    if (a === 0.5) drawingContext.setLineDash([2, 3]);
    line(px, sy(a), px + pw, sy(a)); drawingContext.setLineDash([]); noStroke();
    textAlign(RIGHT, CENTER); text(Math.round(a * 100) + '%', px - 4, sy(a));
  }
  textAlign(LEFT, BOTTOM); fill(150); text('guessing', px + 3, sy(0.5) - 1); fill(95);
  stroke(140); line(px, py, px, py + ph); line(px, py + ph, px + pw, py + ph); noStroke();
  textAlign(CENTER, TOP); text('0', sx(0), py + ph + 3); text(R, sx(R), py + ph + 3);
  text('round', px + pw / 2, py + ph + 3);
  // reference: same model trained on pooled data
  stroke(GREEN[0], GREEN[1], GREEN[2]); strokeWeight(1.3); drawingContext.setLineDash([5, 4]);
  line(px, sy(model.central), px + pw, sy(model.central)); drawingContext.setLineDash([]); noStroke();
  fill(GREEN[0], GREEN[1], GREEN[2]); textSize(10); textAlign(RIGHT, BOTTOM);
  text(fitText('dashed: one model trained on pooled records, ' + (model.central * 100).toFixed(1) + '%', pw - 6), px + pw - 2, py + ph - 2);
  // the run
  stroke(BLUE[0], BLUE[1], BLUE[2]); strokeWeight(2); noFill();
  beginShape(); for (let r = 0; r <= R; r++) vertex(sx(r), sy(model.acc[r])); endShape(); noStroke();
  // marker at the round on show (after aggregation the round's result exists)
  const shownR = phase === 4 ? viewRound : viewRound - 1;
  fill(255, 193, 7); stroke(60); strokeWeight(1.5); circle(sx(shownR), sy(model.acc[shownR]), 9); noStroke();
}

// final accuracy against the privacy budget, with the other settings held fixed
function drawTradeoff(x, y, w, h) {
  panel(x, y, w, h);
  const px = x + 38, pw = w - 38 - 12, py = y + 24, ph = h - 24 - 20;
  const lo = 0, hi = 1.0;
  const stale = [model.h, model.R, model.f].join('|') !== curveKey;      // waiting for the slider to settle
  const sx = e => px + pw * (Math.log10(e) + 1) / 2, sy = a => py + ph - ph * (constrain(a, lo, hi) - lo) / (hi - lo);
  fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(12);
  text(fitText('Privacy against utility: final accuracy by ε', w - 18), x + 9, y + 7); textStyle(NORMAL);
  textSize(10); fill(95);
  for (const a of [0, 0.5, 1.0]) {
    stroke(a === 0.5 ? color(190) : color(225)); strokeWeight(1);
    if (a === 0.5) drawingContext.setLineDash([2, 3]);
    line(px, sy(a), px + pw, sy(a)); drawingContext.setLineDash([]); noStroke();
    textAlign(RIGHT, CENTER); text(Math.round(a * 100) + '%', px - 4, sy(a));
  }
  stroke(140); line(px, py, px, py + ph); line(px, py + ph, px + pw, py + ph); noStroke();
  textAlign(CENTER, TOP);
  for (const e of [0.1, 1, 10]) text('ε = ' + e, constrain(sx(e), px + 14, px + pw - 16), py + ph + 3);
  fill(120); textAlign(LEFT, TOP); text('more private', px + 48, py + ph + 3);
  textAlign(RIGHT, TOP); text('less noise', px + pw - 46, py + ph + 3);
  stroke(PURPLE[0], PURPLE[1], PURPLE[2], stale ? 80 : 255); strokeWeight(2); noFill();
  beginShape(); for (let i = 0; i < EPS_GRID.length; i++) vertex(sx(EPS_GRID[i]), sy(curve[i])); endShape(); noStroke();
  fill(PURPLE[0], PURPLE[1], PURPLE[2], stale ? 80 : 255);
  for (let i = 0; i < EPS_GRID.length; i++) circle(sx(EPS_GRID[i]), sy(curve[i]), 4.5);
  // the current setting
  const e = model.eps;
  stroke(60); strokeWeight(1.2); drawingContext.setLineDash([3, 3]); line(sx(e), py, sx(e), py + ph); drawingContext.setLineDash([]);
  noStroke();
  // interpolate the curve at the current epsilon for the marker
  let i = 0; while (i < EPS_GRID.length - 2 && EPS_GRID[i + 1] < e) i++;
  const f = constrain((Math.log10(e) - Math.log10(EPS_GRID[i])) / (Math.log10(EPS_GRID[i + 1]) - Math.log10(EPS_GRID[i])), 0, 1);
  fill(255, 193, 7); stroke(60); strokeWeight(1.5); circle(sx(e), sy(lerp(curve[i], curve[i + 1], f)), 9); noStroke();
}

function listNames(ids) {
  const n = ids.map(k => NAMES[k]);
  if (n.length === 1) return 'Hospital ' + n[0];
  return 'Hospitals ' + n.slice(0, -1).join(', ') + (n.length > 2 ? ',' : '') + ' and ' + n[n.length - 1];
}

function drawStatus(x, y, w, h, narrow) {
  panel(x, y, w, h);
  const part = model.picks[viewRound - 1];
  const gw = narrow ? 0 : 236;                     // room for the leakage gauge on the right
  const tx = x + 12, tw = w - 24 - gw, limit = y + h - 4;
  const titles = ['', 'Phase 1: distribute the model', 'Phase 2: train locally', 'Phase 3: send updates', 'Phase 4: aggregate'];
  const e = model.eps;
  const total = part.reduce((a, k) => a + CLIENT_N[k], 0), maxN = Math.max(...part.map(k => CLIENT_N[k]));
  const sigma = (maxN / total) * CLIP * DP_C / e;
  let body;
  if (phase === 1) body = 'The coordinator sends the current global model, just three numbers here, to the ' + part.length +
    ' of 6 hospitals selected for round ' + viewRound + ': ' + listNames(part).replace('Hospitals ', '').replace('Hospital ', '') + '. The others sit this round out.';
  else if (phase === 2) body = listNames(part) + (part.length === 1 ? ' trains the model on its own records for ' : ' each train the model on their own records for ') +
    LOCAL_EPOCHS + ' passes. The records never leave the hospital. The more the hospitals\' data differ, the further their local models drift apart.';
  else if (phase === 3) body = 'Each hospital returns only its update: its new weights minus the ones it received. Every update is clipped to ' +
    'a maximum size of ' + CLIP + ', which bounds how much any one hospital can move the global model.';
  else body = 'The coordinator averages the updates, weighted by record count, adds Gaussian noise (standard deviation ' +
    (sigma >= 10 ? sigma.toFixed(0) : sigma.toFixed(2)) + ' at ε = ' + fmtEps(e) + '), and applies the result. Accuracy after round ' + viewRound + ': ' +
    (model.acc[viewRound] * 100).toFixed(1) + '%.';
  fill(phase === 3 || phase === 4 ? color(190, 90, 0) : (phase === 2 ? color(GREEN[0], GREEN[1], GREEN[2]) : color(BLUE[0], BLUE[1], BLUE[2])));
  textAlign(LEFT, TOP); textStyle(BOLD); textSize(13.5);
  text(fitText(titles[phase], tw), tx, y + 8); textStyle(NORMAL);
  drawWrapped(body, tx, y + 28, tw, 12.5, 16, color(30), limit);
  if (!gw) return;

  // leakage gauge: epsilon bounds how much one participant can change what is released
  const gx = x + w - gw + 4, gwid = gw - 18;
  let gy = y + 8;
  fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(12);
  text('Model leakage risk', gx, gy); textStyle(NORMAL); gy += 19;
  for (let i = 0; i < gwid; i++) {                 // green to red gradient bar
    const f = i / gwid;
    stroke(lerp(GREEN[0], RED[0], f), lerp(GREEN[1], RED[1], f), lerp(GREEN[2], RED[2], f)); line(gx + i, gy, gx + i, gy + 8);
  }
  noStroke();
  const mx = gx + gwid * (Math.log10(e) + 1) / 2;
  fill(30); triangle(mx, gy + 9, mx - 6, gy + 19, mx + 6, gy + 19);
  textSize(10); fill(95); textAlign(LEFT, TOP); text('lower', gx, gy + 20); textAlign(RIGHT, TOP); text('higher', gx + gwid, gy + 20);
  gy += 34;
  const level = (e <= 1 ? 'strong' : (e <= 5 ? 'moderate' : 'weak')) + ' (rule of thumb)';
  const factor = Math.exp(e);
  drawWrapped('ε = ' + fmtEps(e) + ': ' + level + '. One hospital\'s data can change the odds of any released update by at most about e^ε ≈ ' +
    (factor >= 1000 ? Math.round(factor).toLocaleString('en-US') : (factor >= 10 ? factor.toFixed(0) : factor.toFixed(2))) + ' times, per round.',
  gx, gy, gwid, 11.5, 14.5, color(40), limit);
}

function drawControlLabels() {
  const big = canvasWidth >= 660;
  const colW = (canvasWidth - 20) / 2;
  noStroke(); fill(30); textAlign(LEFT, CENTER); textSize(big ? 13 : 11.5); textStyle(NORMAL);
  text((big ? 'Privacy budget ε: ' : 'Privacy ε: ') + fmtEps(eps()), 10, drawHeight + 19);
  text((big ? 'Non-IID skew: ' : 'Skew: ') + hetSlider.value().toFixed(2), 10 + colW, drawHeight + 19);
  text('Rounds: ' + roundSlider.value(), 10, drawHeight + 52);
  text((big ? 'Hospitals per round: ' : 'Per round: ') + model.m + ' of 6', 10 + colW, drawHeight + 52);
  if (canvasWidth >= 600) {
    fill(100); textSize(11.5); textAlign(RIGHT, CENTER);
    text('Curves are a live run of federated averaging on a toy problem.', canvasWidth - 12, drawHeight + 92);
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
