// ML Pipeline Architecture Flow
// CANVAS_HEIGHT: 470
// Bloom L4 (Analyze): students EXAMINE the stages of a machine learning pipeline, from data
// sources to monitoring, and relate each stage to the quality attribute risks, failure modes,
// and ATAM sensitivity points it introduces. They compare how batch, online, and streaming
// serving change the architecture, and step through a drift alert and the retraining loop.
// A clickable diagram with a detail panel; nothing moves unless the student changes a state.
//
// The risk overlay is a qualitative teaching judgment (lower / elevated / high) for the selected
// serving mode. It is NOT survey data about how often ATAM evaluations flag a stage.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const BLUE = [25, 118, 210], PURPLE = [123, 31, 162], TEAL = [0, 137, 123], NAVY = [25, 45, 90];
const GREEN = [46, 125, 50], RED = [198, 40, 40], AMBER = [230, 145, 0];
const GROUP = { data: [BLUE, [227, 240, 252]], model: [PURPLE, [243, 229, 245]], ops: [TEAL, [224, 242, 241]] };
const HEAT = [null, [GREEN, [232, 245, 233], 'lower'], [AMBER, [255, 243, 205], 'elevated'], [RED, [255, 224, 218], 'high']];
const MODES = ['batch', 'online', 'streaming'];
const MODE_LABEL = { batch: 'Batch inference', online: 'Online inference', streaming: 'Streaming inference' };
const MODE_NOTE = {
  batch: 'Batch inference: the model scores a whole dataset on a schedule and writes the predictions to a table that ' +
    'consumers read later. Nothing is on a request path, so latency is measured in hours and the cost per prediction is low. ' +
    'The price is freshness.',
  online: 'Online inference: a model server answers each request in real time. The feature lookup and the model call ' +
    'are on the request path, so latency, availability, and training-serving skew become first-class concerns.',
  streaming: 'Streaming inference: the model runs inside a stream processor and scores events as they arrive. Features are ' +
    'computed from the stream itself, so ordering, state, and replay after failure join latency as concerns.'
};

// col/row place a stage on a 5 x 2 grid; the flow runs left to right on the top row and
// right to left on the bottom row, then loops back up from Monitoring (continuous training).
// sub, risks, fails, sens may be a plain value or a {batch, online, streaming} object.
const NODES = [
  { id: 'src', name: 'Data Sources', short: 'Sources', group: 'data', col: 0, row: 0, heat: { batch: 2, online: 2, streaming: 2 },
    sub: { batch: 'databases, logs, files', online: 'databases, logs, files', streaming: 'event streams, logs' },
    risks: ['Model quality: a model can be no better than the data it learns from.',
      'Privacy and compliance: personal data enters the pipeline here.'],
    fails: ['An upstream schema change breaks features, or silently corrupts them.',
      'The sample does not represent the population the model will serve.'],
    sens: ['Data contracts and schema ownership agreed with the source teams.', 'Sampling and labelling strategy.'] },
  { id: 'ing', name: 'Data Ingestion', short: 'Ingestion', group: 'data', col: 1, row: 0, heat: { batch: 3, online: 3, streaming: 3 },
    sub: { batch: 'scheduled loads', online: 'scheduled loads', streaming: 'continuous intake' },
    risks: ['Reliability: late, missing, or duplicated data.',
      'Reproducibility: without versioned datasets a model cannot be rebuilt or rolled back.'],
    fails: ['A load reports success while delivering only part of the data.',
      'Late-arriving records change a dataset after it was used for training.'],
    sens: ['Data versioning: immutable, versioned snapshots.', 'Validation at the boundary: schema, ranges, and volumes.'] },
  { id: 'fe', name: 'Feature Engineering', short: 'Features', group: 'data', col: 2, row: 0, heat: { batch: 2, online: 3, streaming: 3 },
    sub: { batch: 'batch transforms', online: 'batch transforms', streaming: 'computed on events' },
    risks: { batch: ['Modifiability: feature logic is scattered across jobs and hard to change safely.',
      'Performance: heavy transformations dominate the pipeline run time.'],
    online: ['Modifiability: the same feature is coded once for training and again for serving.',
      'Performance: transformations needed at request time add to latency.'],
    streaming: ['Performance: every feature must be computed within the per-event latency budget.',
      'Modifiability: stream logic and historical backfill logic must stay identical.'] },
    fails: ['Data leakage: a feature uses information that is not available at prediction time.',
      'Training and serving compute the same feature in slightly different ways.'],
    sens: ['One shared definition of each feature.', 'Point-in-time correctness of joins and aggregations.'] },
  { id: 'fs', name: 'Feature Store', short: 'Feat. Store', group: 'data', col: 3, row: 0, heat: { batch: 1, online: 3, streaming: 3 },
    sub: { batch: 'offline store', online: 'offline + online', streaming: 'online, stream-fed' },
    risks: { batch: ['Consistency: every model should read the same definition of a feature.',
      'Cost: storing full feature history for point-in-time training sets.'],
    online: ['Consistency: training-serving skew when offline and online values diverge.',
      'Performance: online lookups sit on the request path and need low-latency reads.'],
    streaming: ['Consistency: stream-computed features must match the values used in training.',
      'Performance: the online store is written and read continuously under load.'] },
    fails: { batch: ['Teams bypass the store and recompute the same feature with different logic.',
      'A feature is changed in place and silently alters every model that uses it.'],
    online: ['The online store lags the offline store, so serving reads stale features.',
      'A feature is changed in place and silently alters every model that uses it.'],
    streaming: ['The stream falls behind, so the online store serves stale features.',
      'Backfilled history and live values are computed by different code.'] },
    sens: { batch: ['Point-in-time retrieval of feature values for training sets.', 'Feature versioning and ownership.'],
      online: ['Synchronization between the offline and online stores.', 'Feature versioning and ownership.'],
      streaming: ['Freshness target of the stream-fed online store.', 'One feature definition for stream and backfill.'] } },
  { id: 'train', name: 'Model Training', short: 'Training', group: 'model', col: 4, row: 0, heat: { batch: 2, online: 2, streaming: 2 },
    sub: { batch: 'batch job on GPUs', online: 'batch job on GPUs', streaming: 'periodic retraining' },
    risks: ['Cost and time: long, expensive compute runs.',
      'Reproducibility: the same data and code should yield the same model.'],
    fails: ['Overfitting: the model memorizes the training set.',
      'Unpinned seeds and library versions make a run impossible to repeat.'],
    sens: ['Retraining frequency against compute cost.', 'Pinned data, code, and environment versions.'] },
  { id: 'eval', name: 'Model Evaluation', short: 'Evaluation', group: 'model', col: 4, row: 1, heat: { batch: 2, online: 2, streaming: 2 },
    sub: 'held-out test gate',
    risks: ['Model quality: this gate decides what reaches production.',
      'Fairness: an aggregate metric hides poor results for subgroups.'],
    fails: ['The metric does not match the business objective, such as accuracy on imbalanced classes.',
      'The test set leaks into training, or no longer resembles production.'],
    sens: ['Choice of metric and pass threshold.', 'Sliced evaluation across user groups.'] },
  { id: 'reg', name: 'Model Registry', short: 'Registry', group: 'model', col: 3, row: 1, heat: { batch: 1, online: 1, streaming: 1 },
    sub: 'versions, approval',
    risks: ['Accountability: who approved which model, trained on what data.',
      'Recoverability: a rollback needs the previous version ready to serve.'],
    fails: ['A production model cannot be traced back to its training data.', 'A promotion skips the approval gate.'],
    sens: ['Staged promotion: experimental, staging, production.', 'Lineage metadata captured automatically.'] },
  { id: 'dep', name: 'Deployment', short: 'Deploy', group: 'ops', col: 2, row: 1, heat: { batch: 2, online: 3, streaming: 3 },
    sub: { batch: 'scheduled scoring', online: 'model server (API)', streaming: 'stream processor' },
    risks: { batch: ['Timeliness: predictions are as stale as the last run.',
      'Throughput: the job must finish inside its window.'],
    online: ['Performance: a latency budget per request, including the feature lookup.',
      'Availability: the model server is on the critical path of the product.'],
    streaming: ['Performance: per-event latency under sustained load.',
      'Reliability: ordering, replay, and state recovery after a failure.'] },
    fails: { batch: ['The job overruns its window, or fails overnight unnoticed.',
      'Consumers read a half-written predictions table.'],
    online: ['A traffic spike exhausts the model servers.',
      'A new model version goes to all traffic at once with no way back.'],
    streaming: ['Backpressure builds when scoring is slower than the event rate.',
      'Duplicate or out-of-order events produce wrong features.'] },
    sens: { batch: ['Run frequency against the freshness the business needs.', 'Atomic publication of results.'],
      online: ['Autoscaling and model size: latency against accuracy.', 'Canary or shadow rollout of new versions.'],
      streaming: ['Windowing and state management.', 'Delivery guarantee: at-least-once or exactly-once.'] } },
  { id: 'mon', name: 'Monitoring', short: 'Monitoring', group: 'ops', col: 1, row: 1, heat: { batch: 3, online: 3, streaming: 3 },
    sub: { batch: 'per-run reports', online: 'live drift, latency', streaming: 'windowed drift' },
    risks: ['Model quality over time: drift degrades results and raises no error.',
      'Observability: ground-truth labels may arrive days or weeks late.'],
    fails: ['Only infrastructure is monitored, so a degrading model looks healthy.',
      'Thresholds are too loose (missed drift) or too tight (alert fatigue).'],
    sens: ['Drift tests and thresholds on inputs and outputs.', 'Automated retraining trigger and rollback path.'] }
];
const EDGES = [['src', 'ing'], ['ing', 'fe'], ['fe', 'fs'], ['fs', 'train'], ['train', 'eval'], ['eval', 'reg'],
  ['reg', 'dep'], ['dep', 'mon'], ['fs', 'dep'], ['mon', 'ing']];
const RETRAIN_PATH = ['mon>ing', 'ing>fe', 'fe>fs', 'fs>train', 'train>eval', 'eval>reg', 'reg>dep'];

let modeSelect, heatCheckbox, driftBtn, resetBtn;
let selectedId = null;
let drift = 0;                    // 0 none, 1 drift detected, 2 retraining loop has run
let boxes = {};                   // node id -> {x, y, w, h} rebuilt every frame

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const main = document.querySelector('main');
  canvas.parent(main);
  textSize(defaultTextSize);

  modeSelect = createSelect(); modeSelect.parent(main);
  for (const m of MODES) modeSelect.option(MODE_LABEL[m]);
  modeSelect.selected(MODE_LABEL.online);
  heatCheckbox = createCheckbox(' Risk overlay', false); heatCheckbox.parent(main);
  heatCheckbox.style('font-size', '13px');
  driftBtn = createButton('Simulate drift'); driftBtn.parent(main);
  driftBtn.mousePressed(() => { drift = (drift + 1) % 3; selectedId = null; });
  resetBtn = createButton('Reset'); resetBtn.parent(main);
  resetBtn.mousePressed(() => { drift = 0; selectedId = null; heatCheckbox.checked(false); modeSelect.selected(MODE_LABEL.online); });

  layout();
  describe('A machine learning pipeline drawn as nine connected stages: data sources, data ingestion, ' +
    'feature engineering, feature store, model training, model evaluation, model registry, deployment, ' +
    'and monitoring, with a loop from monitoring back to ingestion for retraining. Selecting a stage ' +
    'lists its quality attribute risks, common failure modes, and ATAM sensitivity points. A menu ' +
    'switches between batch, online, and streaming inference, a checkbox colors the stages by risk ' +
    'level, and a button steps through a drift alert and the retraining loop.', LABEL);
}

function layout() {
  const y = drawHeight + 13;
  const narrow = canvasWidth < 660;
  modeSelect.position(10, y); modeSelect.size(narrow ? 118 : 170);
  const span = heatCheckbox.elt.querySelector('span');
  if (span) span.textContent = narrow ? ' Risk' : ' Risk overlay';
  heatCheckbox.position(10 + (narrow ? 118 : 170) + 10, y + 1);
  resetBtn.position(canvasWidth - 10 - 56, y);
  driftBtn.position(canvasWidth - 10 - 56 - 8 - (narrow ? 66 : 132), y);
}

function mode() { return MODES[modeSelect.elt.selectedIndex]; }
function pick(v, m) { return (v && !Array.isArray(v) && typeof v === 'object') ? v[m] : v; }
function node(id) { return NODES.find(n => n.id === id); }

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

  const m = mode(), narrow = canvasWidth < 660;
  const want = (narrow ? ['Drift', 'Retrain', 'Clear'] : ['Simulate drift', 'Trigger retraining', 'Clear alert'])[drift];
  if (driftBtn.html() !== want) driftBtn.html(want);

  fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(narrow ? 14.5 : 18);
  text(narrow ? 'ML Pipeline Architecture' : 'ML Pipeline Architecture Flow', margin, 10);
  textAlign(RIGHT, TOP); textSize(narrow ? 12 : 13.5); fill(TEAL[0], TEAL[1], TEAL[2]);
  text(MODE_LABEL[m], canvasWidth - margin, narrow ? 12 : 13);
  textStyle(NORMAL);

  drawPipeline(m, narrow);
  const py = 216, ph = drawHeight - 8 - py;
  drawPanel(m, margin, py, canvasWidth - margin * 2, ph, narrow);

  let over = false;
  for (const id in boxes) { const b = boxes[id]; if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) over = true; }
  cursor(over ? HAND : ARROW);
}

function drawPipeline(m, narrow) {
  const top = 40, rowGap = 92, boxH = narrow ? 40 : 50;
  const colW = (canvasWidth - margin * 2) / 5;
  const boxW = colW - (narrow ? 8 : 12);
  boxes = {};
  for (const n of NODES) {
    boxes[n.id] = { x: margin + n.col * colW + (colW - boxW) / 2, y: top + n.row * rowGap, w: boxW, h: boxH };
  }

  // edges first, so the boxes sit on top of them
  for (const e of EDGES) {
    const a = boxes[e[0]], b = boxes[e[1]], key = e[0] + '>' + e[1];
    let col = [120, 130, 140], wgt = 1.6, dash = null;
    if (key === 'mon>ing') { dash = [5, 4]; col = drift === 1 ? RED : (drift === 2 ? GREEN : [120, 130, 140]); wgt = drift ? 2.6 : 1.6; }
    else if (drift === 2 && RETRAIN_PATH.includes(key)) { col = GREEN; wgt = 2.8; }
    else if (key === 'fs>dep') { col = TEAL; }
    stroke(col[0], col[1], col[2]); strokeWeight(wgt);
    if (dash) drawingContext.setLineDash(dash);
    let x0, y0, x1, y1;
    if (a.y === b.y) {                               // same row: side to side
      const right = b.x > a.x;
      x0 = right ? a.x + a.w : a.x; x1 = right ? b.x : b.x + b.w; y0 = y1 = a.y + a.h / 2;
    } else if (Math.abs(a.x - b.x) < 2) {            // same column: bottom to top or top to bottom
      const down = b.y > a.y;
      x0 = x1 = a.x + a.w / 2; y0 = down ? a.y + a.h : a.y; y1 = down ? b.y : b.y + b.h;
    } else {                                         // diagonal: feature store down to deployment
      x0 = a.x + a.w * 0.3; y0 = a.y + a.h; x1 = b.x + b.w * 0.7; y1 = b.y;
    }
    arrow(x0, y0, x1, y1);
    drawingContext.setLineDash([]);
    noStroke();
    // labels on the two edges that carry the story
    textSize(narrow ? 9.5 : 10.5); textStyle(NORMAL);
    if (key === 'fs>dep' && !narrow) {
      const lbl = { batch: 'bulk read', online: 'key lookup', streaming: 'live features' }[m];
      fill(240, 248, 255); const w = textWidth(lbl) + 6; rect((x0 + x1) / 2 - w / 2 + 6, (y0 + y1) / 2 - 7, w, 14, 3);
      fill(0, 105, 92); textAlign(CENTER, CENTER); text(lbl, (x0 + x1) / 2 + 6, (y0 + y1) / 2);
    }
    if (key === 'mon>ing') {
      fill(col[0], col[1], col[2]); textAlign(LEFT, CENTER); textStyle(drift ? BOLD : NORMAL);
      text(narrow ? 'retrain' : (drift === 1 ? 'retrain trigger!' : 'retrain trigger'), x0 + 5, (y0 + y1) / 2);
      textStyle(NORMAL);
    }
  }

  const heatOn = heatCheckbox.checked();
  for (const n of NODES) {
    const b = boxes[n.id];
    const sel = n.id === selectedId;
    const hover = mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h;
    let sc = GROUP[n.group][0], fc = GROUP[n.group][1];
    const lvl = n.heat[m];
    if (heatOn) { sc = HEAT[lvl][0]; fc = HEAT[lvl][1]; }
    let badge = '';
    if (drift === 1) {
      if (n.id === 'src') { sc = AMBER; fc = [255, 243, 205]; badge = 'inputs shifted'; }
      if (n.id === 'dep') { sc = AMBER; fc = [255, 243, 205]; badge = 'model is stale'; }
      if (n.id === 'mon') { sc = RED; fc = [255, 224, 218]; badge = 'DRIFT ALERT'; }
    } else if (drift === 2) {
      if (n.id === 'reg') { sc = GREEN; fc = [232, 245, 233]; badge = 'v2 approved'; }
      if (n.id === 'dep') { sc = GREEN; fc = [232, 245, 233]; badge = 'v2 rolled out'; }
      if (n.id === 'mon') { sc = GREEN; fc = [232, 245, 233]; badge = 'new baseline'; }
    }
    stroke(sel ? color(20) : color(sc[0], sc[1], sc[2])); strokeWeight(sel ? 2.6 : (hover ? 2.2 : 1.5));
    fill(fc[0], fc[1], fc[2]); rect(b.x, b.y, b.w, b.h, 7); noStroke();
    fill(25); textAlign(CENTER, CENTER); textStyle(BOLD); textSize(narrow ? 10 : (canvasWidth < 760 ? 11.5 : 12.5));
    const title = narrow || textWidth(n.name) > b.w - 4 ? n.short : n.name;
    text(fitText(title, b.w - 4), b.x + b.w / 2, b.y + (narrow ? b.h / 2 : 16));
    textStyle(NORMAL);
    if (!narrow) {
      textSize(10.5);
      if (badge) { fill(sc[0] * 0.8, sc[1] * 0.8, sc[2] * 0.8); textStyle(BOLD); }
      else fill(85);
      text(fitText(badge || pick(n.sub, m), b.w - 6), b.x + b.w / 2, b.y + 34);
      textStyle(NORMAL);
    }
    if (heatOn) {
      // three pips on the top border, so the level does not depend on color alone
      noStroke(); fill(255); rect(b.x + b.w - 34, b.y - 5, 28, 10, 5);
      for (let k = 0; k < 3; k++) {
        stroke(sc[0], sc[1], sc[2]); strokeWeight(1);
        fill(k < lvl ? color(sc[0], sc[1], sc[2]) : color(255));
        circle(b.x + b.w - 12 - k * 8, b.y, 6);
      }
      noStroke();
    }
  }

  // legend in the free cell (bottom-left of the grid)
  const lx = margin + 2, ly = top + rowGap + 2, lw = colW - 8;
  textAlign(LEFT, CENTER); textSize(narrow ? 9.5 : 10.5); noStroke();
  const items = heatOn
    ? [[HEAT[3], narrow ? 'high' : 'high risk'], [HEAT[2], 'elevated'], [HEAT[1], 'lower']].map(v => [v[0][0], v[0][1], v[1]])
    : [[GROUP.data[0], GROUP.data[1], 'data'], [GROUP.model[0], GROUP.model[1], 'model'], [GROUP.ops[0], GROUP.ops[1], narrow ? 'serve' : 'serving, ops']];
  for (let i = 0; i < items.length; i++) {
    const it = items[i], y = ly + 8 + i * 15;
    stroke(it[0][0], it[0][1], it[0][2]); strokeWeight(1.3); fill(it[1][0], it[1][1], it[1][2]); rect(lx, y - 5, 12, 10, 3); noStroke();
    fill(70); text(fitText(it[2], lw - 18), lx + 17, y);
  }
}

function arrow(x0, y0, x1, y1) {
  line(x0, y0, x1, y1);
  const a = Math.atan2(y1 - y0, x1 - x0), s = 7;
  drawingContext.setLineDash([]);
  line(x1, y1, x1 - s * Math.cos(a - 0.45), y1 - s * Math.sin(a - 0.45));
  line(x1, y1, x1 - s * Math.cos(a + 0.45), y1 - s * Math.sin(a + 0.45));
}

function drawPanel(m, x, y, w, h, narrow) {
  fill(255); stroke(200); strokeWeight(1); rect(x, y, w, h, 8); noStroke();
  const tx = x + 12, tw = w - 24, limit = y + h - 4;
  let ty = y + 9;
  const n = selectedId ? node(selectedId) : null;
  const head = (s, col) => { fill(col[0], col[1], col[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(14); text(fitText(s, tw), tx, ty); textStyle(NORMAL); ty += 22; };

  if (!n && drift === 1) {
    head('Drift detected: the model is degrading without any error', RED);
    ty = drawWrapped('1. The real world changes, so the inputs arriving from the data sources no longer look like the data the ' +
      'model was trained on (data drift), or the relationship between inputs and outcomes itself changes (concept drift).',
      tx, ty, tw, 12.5, 16, color(30), limit) + 3;
    ty = drawWrapped('2. Monitoring compares the live feature distribution with the training baseline, using a statistical test ' +
      'such as the population stability index or a Kolmogorov-Smirnov test, and raises an alert when it crosses a threshold.',
      tx, ty, tw, 12.5, 16, color(30), limit) + 3;
    drawWrapped('3. Nothing else looks wrong: latency, error rate, and traffic are normal. Without this monitor the loss of ' +
      'quality stays invisible. Press Trigger retraining to run the loop.', tx, ty, tw, 12.5, 16, color(30), limit);
    return;
  }
  if (!n && drift === 2) {
    head('Continuous training: the loop closes', GREEN);
    ty = drawWrapped('The alert triggers the pipeline again on fresh data (green path): ingestion, feature engineering, feature ' +
      'store, training, and evaluation. The new model must pass the evaluation gate before the registry records it as v2 with ' +
      'its lineage and approval.', tx, ty, tw, 12.5, 16, color(30), limit) + 3;
    drawWrapped('Deployment rolls v2 out in stages and keeps v1 for rollback, and monitoring adopts the new training data as its ' +
      'baseline. The architectural question for an ATAM evaluation: what detects drift, and what triggers retraining? ' +
      '"We check quarterly" is a risk.', tx, ty, tw, 12.5, 16, color(30), limit);
    return;
  }
  if (!n) {
    head('Click a stage to inspect it', NAVY);
    ty = drawWrapped('Each stage adds its own quality attribute risks. Selecting a stage lists those risks, its common failure ' +
      'modes, and the design decisions an ATAM evaluation would record as sensitivity points.', tx, ty, tw, 12.5, 16, color(30), limit) + 4;
    ty = drawWrapped(MODE_NOTE[m], tx, ty, tw, 12.5, 16, color(0, 90, 80), limit) + 4;
    drawWrapped('Turn on Risk overlay to color the stages by how much risk they carry in this serving mode. The levels are a ' +
      'teaching judgment, not survey data.', tx, ty, tw, 11.5, 15, color(100), limit);
    return;
  }

  // selected stage: three lists
  const lvl = HEAT[n.heat[m]];
  head(n.name + ' · ' + MODE_LABEL[m].toLowerCase() + ' · risk ' + lvl[2], GROUP[n.group][0]);
  const cols = [['Quality attribute risks', pick(n.risks, m), RED], ['Common failure modes', pick(n.fails, m), AMBER],
    ['ATAM sensitivity points', pick(n.sens, m), BLUE]];
  if (!narrow) {
    const gap = 14, cw = (tw - gap * 2) / 3;
    for (let i = 0; i < 3; i++) drawList(cols[i], tx + i * (cw + gap), ty, cw, limit, false);
  } else {
    ty -= 4;
    for (let i = 0; i < 3; i++) ty = drawList(cols[i], tx, ty, tw, limit, true) + 1;
  }
}

function drawList(c, x, y, w, limit, compact) {
  if (y + 16 > limit) return y;
  fill(c[2][0] * 0.85, c[2][1] * 0.85, c[2][2] * 0.85); textAlign(LEFT, TOP); textStyle(BOLD); textSize(compact ? 12 : 12.5);
  text(fitText(c[0], w), x, y); textStyle(NORMAL);
  y += compact ? 15 : 18;
  for (const item of c[1]) {
    if (y + 14 > limit) break;
    fill(c[2][0], c[2][1], c[2][2]); circle(x + 4, y + 7, 5);
    y = drawWrapped(item, x + 12, y, w - 12, compact ? 11.5 : 12, compact ? 14 : 15, color(30), limit) + (compact ? 1 : 3);
  }
  return y;
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
  for (const id in boxes) {
    const b = boxes[id];
    if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) {
      selectedId = selectedId === id ? null : id;
      return;
    }
  }
  if (mouseY < 216) selectedId = null;
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
