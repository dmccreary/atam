// CAP Theorem Explorer
// CANVAS_HEIGHT: 566
// Bloom L3 (Apply): students USE CAP-theorem knowledge by driving a two-replica system
// through a network partition in CP vs AP mode, observing the concrete consequences (failed
// reads vs stale reads) and selecting the right consistency model for a given scenario.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 520;
let controlHeight = 46;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;

let mode = 'CP';            // CP | AP
let partitioned = false;
let aVer = 0, bVer = 0;     // version counters; B < A means stale
let log = [];               // {text, kind}
let converge = 0;           // convergence animation timer (AP heal)
let scenarioNote = '';
let writeBtn, readBtn, partBtn, explainBtn, s1, s2, s3;
let showFullExplain = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  const main = document.querySelector('main');
  writeBtn = createButton('Send Write → A'); writeBtn.parent(main); writeBtn.mousePressed(sendWrite);
  readBtn = createButton('Read ← B'); readBtn.parent(main); readBtn.mousePressed(sendRead);
  partBtn = createButton('Create Partition'); partBtn.parent(main); partBtn.mousePressed(togglePartition);
  explainBtn = createButton('Explain'); explainBtn.parent(main); explainBtn.mousePressed(() => showFullExplain = !showFullExplain);
  s1 = createButton('Financial ledger'); s1.parent(main); s1.mousePressed(() => preset('CP', 'Financial ledger: CP is required — customers must never see an incorrect balance.'));
  s2 = createButton('Shopping cart'); s2.parent(main); s2.mousePressed(() => preset('AP', 'Shopping cart: AP is acceptable — a slightly stale cart beats an error.'));
  s3 = createButton('Profile update'); s3.parent(main); s3.mousePressed(() => preset('AP', 'Profile update: AP with read-your-writes is acceptable for non-critical data.'));
  positionButtons();
  addLog('Both replicas start at v0, network healthy.', 'ok');
  describe('A CAP-theorem simulation with two database replicas (Node A and Node B) joined by ' +
    'a network link, a CP/AP mode switch, and buttons to write, read, and partition. Under a ' +
    'partition, CP fails reads from B while AP returns a stale value, illustrating the tradeoff.', LABEL);
}

function positionButtons() {
  const y = drawHeight + 11;
  writeBtn.position(10, y); readBtn.position(132, y); partBtn.position(214, y); explainBtn.position(348, y);
  // scenario buttons inside the right panel
  const rx = leftW() + 18;
  s1.position(rx, 250); s2.position(rx, 280); s3.position(rx, 310);
}

function leftW() { return Math.max(330, canvasWidth * 0.62); }

function addLog(text, kind) { log.unshift({ text, kind }); if (log.length > 6) log.pop(); }

function preset(m, note) { mode = m; scenarioNote = note; addLog('Loaded scenario → recommended mode ' + m + '.', 'ok'); }

function sendWrite() {
  aVer++;
  if (!partitioned) { bVer = aVer; addLog('Write v' + aVer + ' → A; replicated to B. Both consistent.', 'ok'); }
  else addLog('Write v' + aVer + ' → A succeeds (coordinator reaches A). B not updated.', 'warn');
}

function sendRead() {
  if (!partitioned) { addLog('Read ← B returns v' + bVer + ' (consistent).', 'ok'); return; }
  if (mode === 'CP') addLog('Read ← B REJECTED: cannot guarantee up-to-date data during a partition.', 'err');
  else { const stale = bVer < aVer; addLog('Read ← B returns v' + bVer + (stale ? ' (stale — may be out of date)' : ''), stale ? 'warn' : 'ok'); }
}

function togglePartition() {
  partitioned = !partitioned;
  if (partitioned) { partBtn.html('Heal Partition'); addLog('Network PARTITIONED — A and B cannot sync.', 'err'); }
  else {
    partBtn.html('Create Partition');
    if (mode === 'AP' && bVer < aVer) { converge = 45; addLog('Partition healed — B is converging to A (eventual consistency).', 'warn'); }
    else { bVer = aVer; addLog('Partition healed — replicas back in sync.', 'ok'); }
  }
}

function draw() {
  updateCanvasSize();
  positionButtons();
  if (converge > 0) { converge--; if (converge === 0) { bVer = aVer; addLog('B converged to v' + aVer + '. Eventually consistent.', 'ok'); } }

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(LEFT, TOP); textSize(18);
  text('CAP Theorem Explorer', margin, 10);
  fill(90); textSize(11);
  text('Drive two replicas through a partition. CP fails reads to stay consistent; AP serves stale to stay available.', margin, 34);

  drawModeToggle();
  drawNodes();
  drawLog();
  drawRightPanel();
  drawControlHint();
}

function drawModeToggle() {
  const w = 90, y = 54, h = 26;
  const opts = [['CP', [33, 118, 210]], ['AP', [239, 124, 0]]];
  textAlign(CENTER, CENTER); textSize(12); textStyle(BOLD);
  for (let i = 0; i < 2; i++) {
    const x = margin + i * (w + 6), active = mode === opts[i][0], c = opts[i][1];
    noStroke(); fill(active ? color(c[0], c[1], c[2]) : color(236)); rect(x, y, w, h, 6);
    fill(active ? 255 : 70); text(opts[i][0] + (opts[i][0] === 'CP' ? ' (consistent)' : ' (available)'), x + w / 2, y + h / 2);
  }
  textStyle(NORMAL);
}

function nodeBox(which) {
  const lw = leftW();
  const bw = 150, bh = 110, y = 96;
  const cx = which === 'A' ? margin + 30 : lw - bw - 30;
  return { x: cx, y, w: bw, h: bh };
}

function drawNodes() {
  const a = nodeBox('A'), b = nodeBox('B');
  // network link
  const midY = a.y + a.h / 2;
  stroke(partitioned ? color(211, 47, 47) : color(46, 125, 50)); strokeWeight(4);
  if (partitioned) { line(a.x + a.w, midY, (a.x + a.w + b.x) / 2 - 14, midY); line((a.x + a.w + b.x) / 2 + 14, midY, b.x, midY);
    fill(211, 47, 47); noStroke(); textAlign(CENTER, CENTER); textSize(18); text('✕', (a.x + a.w + b.x) / 2, midY); }
  else line(a.x + a.w, midY, b.x, midY);
  noStroke(); fill(partitioned ? color(211, 47, 47) : color(46, 125, 50)); textAlign(CENTER, BOTTOM); textSize(10.5); textStyle(BOLD);
  text(partitioned ? 'PARTITIONED' : 'network healthy', (a.x + a.w + b.x) / 2, midY - 8); textStyle(NORMAL);

  drawNode(a, 'Node A', aVer, false);
  drawNode(b, 'Node B', bVer, partitioned && mode === 'AP' && bVer < aVer);
}

function drawNode(r, label, ver, stale) {
  stroke(120); strokeWeight(1.5); fill(255); rect(r.x, r.y, r.w, r.h, 10);
  noStroke(); fill(30, 60, 120); textAlign(CENTER, TOP); textSize(13); textStyle(BOLD); text(label, r.x + r.w / 2, r.y + 8); textStyle(NORMAL);
  fill(stale ? color(255, 152, 0) : color(33, 118, 210)); textSize(30); textStyle(BOLD); text('v' + ver, r.x + r.w / 2, r.y + 34); textStyle(NORMAL);
  if (stale) { fill(255, 152, 0); textSize(10); text('⚠ may be stale', r.x + r.w / 2, r.y + 74); }
  else { fill(120); textSize(10); text('stored value', r.x + r.w / 2, r.y + 74); }
  if (converge > 0 && label === 'Node B') { fill(255, 152, 0); textSize(10); text('syncing…', r.x + r.w / 2, r.y + 90); }
}

function drawLog() {
  const x = margin, y = 220, w = leftW() - margin, h = drawHeight - y - 12;
  fill(255); stroke(210); strokeWeight(1); rect(x, y, w, h, 8); noStroke();
  fill(30, 60, 120); textAlign(LEFT, TOP); textSize(12); textStyle(BOLD); text('Simulation log', x + 10, y + 7); textStyle(NORMAL);
  let yy = y + 28;
  for (const e of log) {
    const c = e.kind === 'ok' ? [46, 125, 50] : (e.kind === 'warn' ? [200, 120, 0] : [198, 40, 40]);
    fill(c[0], c[1], c[2]); textAlign(LEFT, TOP); textSize(11); text('• ' + e.text, x + 10, yy, w - 20); yy += 17;
    if (yy > y + h - 14) break;
  }
}

function drawRightPanel() {
  const x = leftW() + 8, y = 54, w = canvasWidth - x - margin, h = 158;
  fill(255); stroke(200); strokeWeight(1); rect(x, y, w, h, 8); noStroke();
  fill(30, 60, 120); textAlign(LEFT, TOP); textSize(12.5); textStyle(BOLD); text('Current behavior', x + 10, y + 8); textStyle(NORMAL);
  fill(50); textSize(11.5);
  text(behaviorText(), x + 10, y + 28, w - 20, h - 36);
  // scenario presets label (buttons positioned in setup/layout)
  fill(120); textAlign(LEFT, TOP); textSize(11); textStyle(BOLD); text('Load a scenario:', x + 10, 228); textStyle(NORMAL);
  if (scenarioNote) { fill(80); textSize(10.5); text(scenarioNote, x + 10, 342, w - 20); }
}

function behaviorText() {
  let t;
  if (!partitioned) t = mode + ' mode, network healthy: reads and writes both succeed and stay consistent. The CAP tradeoff only appears during a partition.';
  else if (mode === 'CP') t = 'CP under partition: writes to A succeed, but reads from B are REJECTED to avoid returning stale data. Availability is sacrificed to keep consistency.';
  else t = 'AP under partition: reads from B still succeed but may be STALE. Consistency is sacrificed to keep availability; B converges once the partition heals.';
  if (showFullExplain) t += (mode === 'CP'
    ? ' Choose CP when wrong data is worse than no data (e.g., a financial ledger).'
    : ' Choose AP when an answer — even a slightly old one — beats an error (e.g., a shopping cart).');
  return t;
}

function drawControlHint() {
  if (canvasWidth < 600) return;
  noStroke(); fill(90); textAlign(LEFT, CENTER); textSize(10.5);
  text('Partition the network, then read from B in each mode.', 410, drawHeight + controlHeight / 2, canvasWidth - 420);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const w = 90, y = 54, h = 26;
  for (let i = 0; i < 2; i++) { const x = margin + i * (w + 6); if (mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h) { mode = i === 0 ? 'CP' : 'AP'; return; } }
}

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); positionButtons(); redraw(); }
function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width); canvasWidth = containerWidth;
}
