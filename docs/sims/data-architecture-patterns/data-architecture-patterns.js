// Lambda vs. Kappa Architecture Comparison (with the Data Lakehouse)
// CANVAS_HEIGHT: 545
// Bloom L4 (Analyze): students COMPARE three data architectures by following data from its
// sources to the queries it serves, stepping through how each one recomputes history after a
// logic change, and weighing the result on four quality attributes. Components are clickable;
// reprocessing is a three-step walk-through. Small moving dots only show the direction of flow.
//
// Lambda = batch layer + speed layer + serving layer. Kappa = one stream-processing path that
// reprocesses by replaying a durable log. Lakehouse = open table format over object storage.
// Technology names are examples of each role. The radar ratings (1 to 5, outward is better) are
// qualitative teaching judgments based on the chapter, not benchmark results.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 495;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const NAVY = [25, 45, 90], ORANGE = [230, 110, 0], GRAY = [120, 130, 140];

const SRC = { name: 'Data sources', sub: 'apps, devices, databases',
  tech: 'Application events, change data capture from operational databases, device telemetry.',
  good: 'The same events feed all three architectures. What differs is what happens to them next.',
  bad: 'Late, duplicated, or out-of-order events; an upstream schema change.' };

const ARCH = [
  { id: 'lambda', name: 'Lambda', tag: 'batch + speed + serving', col: [25, 118, 210],
    rating: [5, 3, 1, 2],
    rows: [['src'], ['log'], ['batch', 'speed'], ['serve'], ['query']],
    comps: {
      src: SRC,
      log: { name: 'Event log', sub: 'Kafka',
        tech: 'Apache Kafka, Apache Pulsar, or a managed event streaming service.',
        good: 'Decouples producers from consumers and buffers bursts. Both layers read the same events.',
        bad: 'Consumer lag grows under load; a broker fails; the feed to the batch layer\'s master dataset falls behind.' },
      batch: { name: 'Batch layer', sub: 'HDFS + Spark', short: 'Batch',
        tech: 'An immutable master dataset in HDFS or object storage, recomputed by Spark or MapReduce jobs.',
        good: 'Recomputes its views from the complete dataset on every run, so it corrects errors and absorbs late data. High throughput.',
        bad: 'Results are hours old. A long job fails near the end. Its logic drifts away from the speed layer\'s copy.' },
      speed: { name: 'Speed layer', sub: 'Flink', short: 'Speed',
        tech: 'A stream processor such as Flink, Spark Structured Streaming, or Storm.',
        good: 'Gives low-latency views of the events the batch layer has not processed yet.',
        bad: 'Results may be approximate. It is a second implementation of the same logic that must be kept in step with the batch job.' },
      serve: { name: 'Serving layer', sub: 'merges both views',
        tech: 'A low-latency store for the batch views (for example Druid, Cassandra, or HBase) queried together with the real-time view.',
        good: 'Answers a query over all of history plus the last few seconds.',
        bad: 'The two views disagree at the seam, the merge logic is wrong, or events are counted twice during the handover.' },
      query: { name: 'Queries', sub: 'dashboards, APIs',
        tech: 'Dashboards, reporting, and application programming interfaces.',
        good: 'Consumers see one merged answer and do not know there are two pipelines behind it.',
        bad: 'A recent figure changes after the next batch run, which surprises users who took it as final.' }
    },
    steps: [
      { hot: ['batch', 'speed'], text: 'The fix is written twice: once in the batch job and once in the streaming job. Keeping the two in step is the standing cost of this design.' },
      { hot: ['batch'], text: 'The batch layer reruns over its complete master dataset, as it does on every cycle anyway. Reprocessing is routine here.' },
      { hot: ['serve'], text: 'The new batch view replaces the old one in the serving layer; the speed layer covers the events that arrived during the run.' }
    ] },
  { id: 'kappa', name: 'Kappa', tag: 'one streaming path + replay', col: [123, 31, 162],
    rating: [5, 4, 4, 3],
    rows: [['src'], ['log'], ['proc'], ['store'], ['query']],
    comps: {
      src: SRC,
      log: { name: 'Durable event log', sub: 'Kafka, long retention',
        tech: 'Apache Kafka or a similar log configured to retain events for as long as they may need to be replayed.',
        good: 'The log is the system of record. Every result can be rebuilt by replaying it.',
        bad: 'Retention or compaction deletes history that a replay needs. Keeping everything costs storage.' },
      proc: { name: 'Stream processor', sub: 'Flink',
        tech: 'Flink, Kafka Streams, or Spark Structured Streaming.',
        good: 'One codebase handles both live processing and reprocessing, so there is one result and one place to fix a bug.',
        bad: 'State grows large. Replaying years of history is slow and competes with live traffic. Exactly-once processing is hard to get right.' },
      store: { name: 'Serving store', sub: 'materialized views',
        tech: 'A key-value or analytical store holding the output tables of the streaming job.',
        good: 'One view per query. Nothing has to be merged.',
        bad: 'During a replay two versions of the output exist, and switching to the new one too early serves incomplete data.' },
      query: { name: 'Queries', sub: 'dashboards, APIs',
        tech: 'Dashboards, reporting, and application programming interfaces.',
        good: 'Consumers read one table that the single pipeline keeps current.',
        bad: 'Queries that need all of history depend on the replay having finished.' }
    },
    steps: [
      { hot: ['proc'], text: 'A new version of the one streaming job is deployed beside the old one. There is a single codebase to change.' },
      { hot: ['log', 'proc'], text: 'The new job replays the log from the first event. This works only if the log still holds all of history, and it takes longer as history grows.' },
      { hot: ['store'], text: 'When the new job has caught up with the live stream, queries switch to its output and the old job and its table are retired.' }
    ] },
  { id: 'lake', name: 'Lakehouse', tag: 'open table format', col: [0, 121, 107],
    rating: [3, 5, 3, 4],
    rows: [['src'], ['ingest'], ['storage'], ['engine'], ['analytics']],
    comps: {
      src: SRC,
      ingest: { name: 'Ingestion', sub: 'batch + streaming',
        tech: 'Scheduled loads, change data capture, and streaming writers.',
        good: 'Lands the raw data unchanged, so it can be reprocessed later.',
        bad: 'Many small files, duplicate loads, and schema drift.' },
      storage: { name: 'Object storage', sub: 'Delta / Iceberg tables',
        tech: 'Parquet files in cloud object storage with a Delta Lake, Apache Iceberg, or Apache Hudi metadata layer.',
        good: 'ACID transactions, schema evolution, and time travel at the cost of object storage.',
        bad: 'Small files pile up without compaction, old versions are never vacuumed, and concurrent writers conflict.' },
      engine: { name: 'Query engine', sub: 'Spark, Trino',
        tech: 'Spark SQL, Trino, and other engines that read the open table format. The same engines run the transformation jobs.',
        good: 'Compute is separate from storage, and several engines can read the same tables.',
        bad: 'Scans are slow when statistics and partitioning are poor; compute that starts on demand adds latency.' },
      analytics: { name: 'Analytics', sub: 'BI, ML training',
        tech: 'Business intelligence dashboards, ad hoc SQL, and machine learning training sets.',
        good: 'Warehouse-style queries and data science work on one copy of the data.',
        bad: 'Freshness is typically minutes, not milliseconds. On its own this is not a low-latency serving path.' }
    },
    steps: [
      { hot: ['engine'], text: 'The transformation job is changed. The raw data it reads is still in object storage, untouched.' },
      { hot: ['storage', 'engine'], text: 'The job reruns over the stored raw data and writes a new version of the table. Readers keep seeing the old version until the commit.' },
      { hot: ['storage', 'analytics'], text: 'The new version is committed in one ACID transaction. Time travel keeps the old version for audit or rollback.' }
    ] }
];
const AXES = ['Freshness', 'Consistency', 'Simplicity', 'Low cost'];
const STEP_TITLES = ['', 'Step 1 of 3: change the logic', 'Step 2 of 3: recompute history', 'Step 3 of 3: switch over'];

let stepBtn, resetBtn;
let step = 0;                      // 0 = normal flow, 1..3 = reprocessing walk-through
let selected = null;               // {a: architecture index, id: component id}
let focus = -1;                    // architecture emphasized on the radar (-1 = all)
let hits = [], headHits = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const main = document.querySelector('main');
  canvas.parent(main);
  textSize(defaultTextSize);

  stepBtn = createButton('Simulate reprocessing'); stepBtn.parent(main);
  stepBtn.mousePressed(() => { step = (step + 1) % 4; selected = null; });
  resetBtn = createButton('Reset'); resetBtn.parent(main);
  resetBtn.mousePressed(() => { step = 0; selected = null; focus = -1; });

  layout();
  describe('Three data architectures side by side. Lambda sends events from a log to a batch ' +
    'layer and a speed layer in parallel and merges their views in a serving layer. Kappa sends ' +
    'events from a durable log through one stream processor to a serving store. The lakehouse ' +
    'ingests data into object storage managed by an open table format and serves analytics through ' +
    'a query engine. Clicking a component shows example technologies, strengths, and failure ' +
    'modes. A button steps through how each architecture reprocesses history, and a radar chart ' +
    'compares freshness, consistency, simplicity, and cost.', LABEL);
}

function layout() {
  const y = drawHeight + 13;
  stepBtn.position(10, y);
  resetBtn.position(10 + 168, y);
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

  const narrow = canvasWidth < 660;
  const want = ['Simulate reprocessing', 'Next step', 'Next step', 'Finish'][step];
  if (stepBtn.html() !== want) stepBtn.html(want);

  fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(narrow ? 14 : 18);
  text(narrow ? 'Lambda vs. Kappa vs. Lakehouse' : 'Lambda vs. Kappa Architecture Comparison', margin, 10);
  if (step > 0) {
    textAlign(RIGHT, TOP); textSize(narrow ? 11 : 13); fill(ORANGE[0], ORANGE[1], ORANGE[2]);
    text(narrow ? 'Reprocessing ' + step + '/3' : 'Reprocessing: step ' + step + ' of 3', canvasWidth - margin, narrow ? 12 : 14);
  }
  textStyle(NORMAL);

  hits = []; headHits = [];
  const top = 38, gap = 8, colW = (canvasWidth - margin * 2 - gap * 2) / 3, colH = 232;
  for (let i = 0; i < 3; i++) drawArch(i, margin + i * (colW + gap), top, colW, colH, narrow);

  const py = top + colH + 6, ph = drawHeight - 8 - py, full = canvasWidth - margin * 2;
  if (!narrow) {
    const rw = 240;
    drawInfo(margin, py, full - rw - 8, ph);
    drawRadar(margin + full - rw, py, rw, ph);
  } else {
    drawInfo(margin, py, full, ph);
  }
  drawControlNote();

  let over = false;
  for (const h of hits.concat(headHits)) if (mouseX >= h.x && mouseX <= h.x + h.w && mouseY >= h.y && mouseY <= h.y + h.h) over = true;
  cursor(over ? HAND : ARROW);
}

function drawArch(ai, x, y, w, h, narrow) {
  const A = ARCH[ai], c = A.col;
  const dimmed = focus >= 0 && focus !== ai && !selected;
  fill(255); stroke(focus === ai ? color(c[0], c[1], c[2]) : color(200)); strokeWeight(focus === ai ? 2 : 1);
  rect(x, y, w, h, 8); noStroke();
  headHits.push({ a: ai, x: x, y: y, w: w, h: 24 });
  fill(c[0], c[1], c[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(narrow ? 12 : 14);
  text(A.name, x + 9, y + 6);
  if (!narrow) {
    const nw = textWidth(A.name);
    textStyle(NORMAL); textSize(10.5); fill(100);
    text(fitText(A.tag, w - nw - 26), x + 15 + nw, y + 9);
  }
  textStyle(NORMAL);

  const bx = x + 9, bw = w - 18, pitch = 41, bh = narrow ? 30 : 33, y0 = y + 27;
  const hot = step > 0 ? A.steps[step - 1].hot : [];
  const t = millis() / 1000;
  for (let r = 0; r < A.rows.length; r++) {
    const ids = A.rows[r], ry = y0 + r * pitch;
    const cw = (bw - (ids.length - 1) * 6) / ids.length;
    // connectors from the row above, with a dot showing the direction of flow
    if (r > 0) {
      const prev = A.rows[r - 1];
      const pcw = (bw - (prev.length - 1) * 6) / prev.length;
      for (let k = 0; k < ids.length; k++) {
        for (let j = 0; j < prev.length; j++) {
          const x1 = bx + k * (cw + 6) + cw / 2, x0 = bx + j * (pcw + 6) + pcw / 2;
          const yy0 = ry - (pitch - bh), yy1 = ry;
          const live = step > 0 && hot.includes(ids[k]) && hot.includes(prev[j]);
          stroke(live ? color(ORANGE[0], ORANGE[1], ORANGE[2]) : color(150)); strokeWeight(live ? 2.4 : 1.4);
          line(x0, yy0, x1, yy1); noStroke();
          const f = (t * (live ? 1.6 : 0.8) + ai * 0.3 + r * 0.17) % 1;
          fill(live ? color(ORANGE[0], ORANGE[1], ORANGE[2]) : color(c[0], c[1], c[2]));
          circle(lerp(x0, x1, f), lerp(yy0, yy1, f), live ? 6 : 4.5);
        }
      }
    }
    for (let k = 0; k < ids.length; k++) {
      const id = ids[k], comp = A.comps[id], cx = bx + k * (cw + 6);
      hits.push({ a: ai, id: id, x: cx, y: ry, w: cw, h: bh });
      const isSel = selected && selected.a === ai && selected.id === id;
      const hover = mouseX >= cx && mouseX <= cx + cw && mouseY >= ry && mouseY <= ry + bh;
      const isHot = hot.includes(id);
      stroke(isSel ? color(20) : (isHot ? color(ORANGE[0], ORANGE[1], ORANGE[2]) : color(c[0], c[1], c[2])));
      strokeWeight(isSel ? 2.6 : (isHot ? 2.6 : (hover ? 2.2 : 1.3)));
      fill(isHot ? color(255, 236, 205) : color(lerp(c[0], 255, 0.88), lerp(c[1], 255, 0.88), lerp(c[2], 255, 0.88)));
      rect(cx, ry, cw, bh, 6); noStroke();
      fill(20); textAlign(CENTER, CENTER); textStyle(BOLD); textSize(narrow ? 10 : 12);
      const nm = textWidth(comp.name) <= cw - 6 ? comp.name : (comp.short || comp.name);
      text(fitText(nm, cw - 4), cx + cw / 2, ry + (narrow ? 9 : 10)); textStyle(NORMAL);
      fill(85); textSize(narrow ? 9 : 10.5);
      text(fitText(comp.sub, cw - 4), cx + cw / 2, ry + (narrow ? 21 : 23.5));
    }
  }
  if (dimmed) { noStroke(); fill(255, 255, 255, 120); rect(x, y, w, h, 8); }
}

// bottom-left: component details, the reprocessing walk-through, or the introduction
function drawInfo(x, y, w, h) {
  const tx = x + 12, tw = w - 24, limit = y + h - 4;
  let ty = y + 9;
  if (selected) {
    const A = ARCH[selected.a], c = A.col, comp = A.comps[selected.id];
    fill(255); stroke(c[0], c[1], c[2]); strokeWeight(1.5); rect(x, y, w, h, 8); noStroke();
    fill(c[0], c[1], c[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(13.5);
    text(fitText(comp.name + '  ·  ' + A.name, tw), tx, ty); textStyle(NORMAL); ty += 21;
    for (const r of [['Examples', comp.tech, NAVY], ['Strengths', comp.good, [46, 125, 50]], ['Failure modes', comp.bad, [198, 40, 40]]]) {
      if (ty + 15 > limit) break;
      fill(r[2][0], r[2][1], r[2][2]); textStyle(BOLD); textSize(12); textAlign(LEFT, TOP); text(r[0], tx, ty); textStyle(NORMAL);
      ty = drawWrapped(r[1], tx, ty + 15, tw, 12, 15, color(30), limit) + 4;
    }
    return;
  }
  fill(255); stroke(step > 0 ? color(ORANGE[0], ORANGE[1], ORANGE[2]) : color(200)); strokeWeight(step > 0 ? 1.5 : 1);
  rect(x, y, w, h, 8); noStroke();
  if (step > 0) {
    fill(190, 90, 0); textAlign(LEFT, TOP); textStyle(BOLD); textSize(13.5);
    text(fitText(STEP_TITLES[step], tw), tx, ty); textStyle(NORMAL); ty += 21;
    for (const A of ARCH) {
      if (ty + 15 > limit) break;
      fill(A.col[0], A.col[1], A.col[2]); textStyle(BOLD); textSize(12); textAlign(LEFT, TOP); text(A.name, tx, ty); textStyle(NORMAL);
      ty = drawWrapped(A.steps[step - 1].text, tx + 68, ty, tw - 68, 12, 15, color(30), limit) + 5;
    }
    return;
  }
  fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(13.5);
  text(fitText('Three answers to one question', tw), tx, ty); textStyle(NORMAL); ty += 21;
  ty = drawWrapped('How do you serve fresh results and still be able to recompute all of history?', tx, ty, tw, 12.5, 16, color(30), limit) + 4;
  const lines = [['Lambda', 'runs a batch path and a streaming path side by side and merges their views.'],
    ['Kappa', 'keeps one streaming path and recomputes by replaying a durable log.'],
    ['Lakehouse', 'keeps versioned tables on cheap object storage and recomputes with batch jobs.']];
  for (let i = 0; i < 3; i++) {
    if (ty + 15 > limit) break;
    const c = ARCH[i].col;
    fill(c[0], c[1], c[2]); textStyle(BOLD); textSize(12.5); textAlign(LEFT, TOP); text(lines[i][0], tx, ty); textStyle(NORMAL);
    ty = drawWrapped(lines[i][1], tx + 72, ty, tw - 72, 12.5, 16, color(30), limit) + 3;
  }
  drawWrapped('Click a component for examples, strengths, and failure modes. Click an architecture name to single it out on the chart.',
    tx, ty + 2, tw, 11.5, 15, color(100), limit);
}

function drawRadar(x, y, w, h) {
  fill(255); stroke(200); strokeWeight(1); rect(x, y, w, h, 8); noStroke();
  fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(12.5);
  text('Quality attribute profile', x + 10, y + 8); textStyle(NORMAL);
  const cx = x + w / 2, cy = y + 28 + (h - 76) / 2 + 8, R = Math.min(46, (h - 96) / 2);
  const ang = i => -HALF_PI + i * HALF_PI;
  noFill();
  for (let k = 1; k <= 5; k++) {
    stroke(k === 5 ? color(150) : color(222)); strokeWeight(1);
    beginShape(); for (let i = 0; i < 4; i++) vertex(cx + R * k / 5 * Math.cos(ang(i)), cy + R * k / 5 * Math.sin(ang(i))); endShape(CLOSE);
  }
  stroke(222); line(cx - R, cy, cx + R, cy); line(cx, cy - R, cx, cy + R); noStroke();
  const sel = selected ? selected.a : focus;
  for (let a = 0; a < 3; a++) {
    const A = ARCH[a], c = A.col, on = sel < 0 || sel === a;
    fill(c[0], c[1], c[2], on ? 45 : 8); stroke(c[0], c[1], c[2], on ? 255 : 70); strokeWeight(on ? 2 : 1);
    beginShape(); for (let i = 0; i < 4; i++) vertex(cx + R * A.rating[i] / 5 * Math.cos(ang(i)), cy + R * A.rating[i] / 5 * Math.sin(ang(i))); endShape(CLOSE);
    if (on) { noStroke(); fill(c[0], c[1], c[2]); for (let i = 0; i < 4; i++) circle(cx + R * A.rating[i] / 5 * Math.cos(ang(i)), cy + R * A.rating[i] / 5 * Math.sin(ang(i)), 5); }
  }
  noStroke(); fill(40); textSize(11); textStyle(BOLD);
  textAlign(CENTER, BOTTOM); text(AXES[0], cx, cy - R - 3);
  textAlign(LEFT, CENTER); text(AXES[1], cx + R + 4, cy);
  textAlign(CENTER, TOP); text(AXES[2], cx, cy + R + 3);
  textAlign(RIGHT, CENTER); text(AXES[3], cx - R - 4, cy);
  textStyle(NORMAL);
  // legend with the ratings of the emphasized architecture
  const ly = y + h - 30;
  let lx = x + 10; textSize(11); textAlign(LEFT, CENTER);
  for (let a = 0; a < 3; a++) {
    const c = ARCH[a].col;
    fill(c[0], c[1], c[2]); rect(lx, ly - 4, 9, 9, 2);
    fill(50); text(ARCH[a].name, lx + 12, ly + 1);
    lx += 12 + textWidth(ARCH[a].name) + 9;
  }
  fill(110); textSize(10);
  text(fitText('Qualitative, 1 to 5; outward is better.', w - 18), x + 10, ly + 16);
}

function drawControlNote() {
  if (canvasWidth < 560) return;
  noStroke(); fill(100); textSize(11.5); textAlign(RIGHT, CENTER);
  const x0 = resetBtn.elt.offsetLeft + resetBtn.elt.offsetWidth + 10;
  const msg = 'Technology names are examples of each role, not recommendations.';
  if (textWidth(msg) < canvasWidth - 12 - x0) text(msg, canvasWidth - 12, drawHeight + 25);
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
  const inR = h => mouseX >= h.x && mouseX <= h.x + h.w && mouseY >= h.y && mouseY <= h.y + h.h;
  for (const h of hits) {
    if (inR(h)) {
      selected = (selected && selected.a === h.a && selected.id === h.id) ? null : { a: h.a, id: h.id };
      return;
    }
  }
  for (const h of headHits) {
    if (inR(h)) { focus = focus === h.a ? -1 : h.a; selected = null; return; }
  }
  if (mouseY < 276) selected = null;
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
