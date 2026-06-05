// Utility Tree Explorer (healthcare patient portal)
// CANVAS_HEIGHT: 600
// Bloom L2 (Understand): students EXPLAIN the four levels of a utility tree (root,
// quality attribute branch, sub-attribute, leaf scenario) and INTERPRET the (Importance,
// Difficulty) ratings. Rendered as an indented, collapsible outline so all four levels and
// the leaf rating badges stay readable at any width; a detail panel explains each rating.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 560;
let controlHeight = 40;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;

const LEVEL_COLORS = {
  root:   [184, 134, 11],   // gold
  branch: [33, 150, 243],   // blue
  sub:    [0, 150, 136]     // teal
};

// Rating color coding (per spec): (H,H)=red, (H,M|M,H)=orange, (H,L)=gold, (M,M)=blue, (L,*)/(M,L)=gray
function ratingColor(I, D) {
  if (I === 'H' && D === 'H') return [211, 47, 47];
  if ((I === 'H' && D === 'M') || (I === 'M' && D === 'H')) return [245, 124, 0];
  if (I === 'H' && D === 'L') return [245, 184, 0];
  if (I === 'M' && D === 'M') return [25, 118, 210];
  return [128, 128, 128];
}

const tree = {
  name: 'Utility', open: true, branches: [
    { name: 'Performance', open: true, subs: [
      { name: 'Response Latency', open: true, leaves: [
        { t: 'Patient appointment search returns results in < 800ms at p99 under peak load', I: 'H', D: 'H',
          why: 'High importance — slow search drives patients away; high difficulty — needs caching and index tuning that hold up at peak load.' },
        { t: 'Patient record retrieval completes in < 2s for records with > 500 attachments', I: 'H', D: 'M',
          why: 'High importance for clinical use; moderate difficulty — large-object streaming is a known pattern.' } ] },
      { name: 'Batch Processing', open: true, leaves: [
        { t: 'Nightly claim reconciliation completes within a 4-hour window', I: 'M', D: 'M',
          why: 'Medium importance — overnight job with slack; medium difficulty — straightforward batch tuning.' } ] } ] },
    { name: 'Availability', open: true, subs: [
      { name: 'Fault Tolerance', open: true, leaves: [
        { t: 'EHR integration failure does not prevent appointment scheduling', I: 'H', D: 'H',
          why: 'High importance — scheduling must survive a third-party outage; high difficulty — needs graceful degradation and a queue/retry design.' },
        { t: 'Authentication service failure redirects to a backup IdP within 10 seconds', I: 'H', D: 'M',
          why: 'High importance — no login means no access; moderate difficulty — standby IdP with health checks.' } ] },
      { name: 'Planned Maintenance', open: true, leaves: [
        { t: 'Maintenance window limited to 30 minutes per week, off-peak', I: 'H', D: 'L',
          why: 'High importance to operations, but low difficulty — a process/policy constraint more than an architectural one.' } ] } ] },
    { name: 'Security', open: true, subs: [
      { name: 'Access Control', open: true, leaves: [
        { t: 'PHI access limited to authenticated, authorized users; all access logged', I: 'H', D: 'H',
          why: 'High importance — HIPAA core requirement; high difficulty — fine-grained authz plus tamper-evident audit logging across services.' },
        { t: 'Admin account compromise detected and locked within 60 seconds', I: 'H', D: 'H',
          why: 'High importance — an admin breach is catastrophic; high difficulty — real-time anomaly detection and automated response.' } ] },
      { name: 'Data Protection', open: true, leaves: [
        { t: 'All PHI encrypted at rest and in transit', I: 'H', D: 'L',
          why: 'High importance and compliance-mandated, but low difficulty — standard TLS plus storage encryption.' } ] } ] },
    { name: 'Modifiability', open: true, subs: [
      { name: 'Feature Evolution', open: true, leaves: [
        { t: 'New insurance provider integration added without changing patient-facing features', I: 'H', D: 'H',
          why: 'High importance — providers change often; high difficulty — demands a stable integration abstraction and anti-corruption layer.' },
        { t: 'HIPAA regulation change implementable within one sprint cycle', I: 'M', D: 'H',
          why: 'Medium importance — infrequent; high difficulty — compliance changes ripple across many modules.' } ] } ] }
  ]
};

let rows = [];
let selected = null;
let focusHH = false;
let focusBtn, expandBtn, collapseBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  focusBtn = createButton('Focus (H,H)');
  focusBtn.mousePressed(() => {
    focusHH = !focusHH;
    focusBtn.html(focusHH ? 'Show All' : 'Focus (H,H)');
    if (focusHH) setAllOpen(true);
  });
  expandBtn = createButton('Expand All');
  expandBtn.mousePressed(() => setAllOpen(true));
  collapseBtn = createButton('Collapse All');
  collapseBtn.mousePressed(() => { for (const b of tree.branches) { b.open = false; for (const s of b.subs) s.open = false; } });
  positionButtons();

  describe('An indented, expandable utility tree for a healthcare patient portal: a gold root, ' +
    'blue quality attribute branches, teal sub-attributes, and leaf scenarios with color-coded ' +
    'Importance/Difficulty rating badges. Clicking a leaf explains its rating.', LABEL);
}

function positionButtons() {
  const y = drawHeight + 8;
  focusBtn.position(10, y);
  expandBtn.position(118, y);
  collapseBtn.position(210, y);
}

function setAllOpen(v) {
  tree.open = true;
  for (const b of tree.branches) { b.open = v; for (const s of b.subs) s.open = v; }
}

function leftW() { return Math.max(320, canvasWidth * 0.58); }

function buildRows() {
  rows = [];
  rows.push({ level: 0, kind: 'root', label: tree.name, node: tree, hasKids: true });
  if (!tree.open) return;
  for (const b of tree.branches) {
    rows.push({ level: 1, kind: 'branch', label: b.name, node: b, hasKids: b.subs.length > 0 });
    if (!b.open) continue;
    for (const s of b.subs) {
      rows.push({ level: 2, kind: 'sub', label: s.name, node: s, hasKids: s.leaves.length > 0 });
      if (!s.open) continue;
      for (const lf of s.leaves) {
        if (focusHH && !(lf.I === 'H' && lf.D === 'H')) continue;
        rows.push({ level: 3, kind: 'leaf', label: lf.t, node: lf, hasKids: false, branch: b.name, sub: s.name });
      }
    }
  }
}

function draw() {
  updateCanvasSize();
  buildRows();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(LEFT, TOP); textSize(18);
  text('Utility Tree — Healthcare Patient Portal', margin, 10);
  fill(90); textSize(11);
  text('Click a node to expand or collapse; click a leaf scenario to interpret its rating.', margin, 34);

  drawTree();
  drawDetail();
  drawControlHint();
}

const ROW_H = 19;
function treeTop() { return 56; }

function drawTree() {
  const lw = leftW();
  const badgeX = lw - 52;
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const y = treeTop() + i * ROW_H;
    if (y > drawHeight - ROW_H) break;
    const x = margin + r.level * 18;
    // selection highlight
    if (r.kind === 'leaf' && selected === r.node) {
      noStroke(); fill(232, 240, 254); rect(margin - 2, y - 1, lw - margin, ROW_H, 4);
    }
    // expand/collapse triangle
    if (r.hasKids) {
      noStroke(); fill(90); textAlign(LEFT, CENTER); textSize(10);
      text(r.node.open ? '▾' : '▸', x, y + ROW_H / 2);
    }
    const tx = x + 14;
    if (r.kind === 'leaf') {
      const c = ratingColor(r.node.I, r.node.D);
      const hh = r.node.I === 'H' && r.node.D === 'H';
      noStroke(); fill(50); textAlign(LEFT, CENTER); textSize(11);
      const tw = badgeX - tx - 8;
      text(truncate(r.label, tw), tx, y + ROW_H / 2);
      // rating badge
      fill(c[0], c[1], c[2]);
      if (focusHH && hh) { stroke(40); strokeWeight(1.5); } else noStroke();
      rect(badgeX, y + 2, 44, ROW_H - 4, 4);
      noStroke(); fill(255); textAlign(CENTER, CENTER); textSize(10); textStyle(BOLD);
      text(r.node.I + ',' + r.node.D, badgeX + 22, y + ROW_H / 2); textStyle(NORMAL);
    } else {
      const c = LEVEL_COLORS[r.kind];
      noStroke(); fill(c[0], c[1], c[2]); textAlign(LEFT, CENTER);
      textSize(r.kind === 'root' ? 13.5 : 12.5); textStyle(BOLD);
      text(r.label, tx, y + ROW_H / 2); textStyle(NORMAL);
    }
  }
}

function truncate(s, w) {
  if (textWidth(s) <= w) return s;
  let lo = 0, hi = s.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (textWidth(s.slice(0, mid) + '…') <= w) lo = mid + 1; else hi = mid;
  }
  return s.slice(0, Math.max(0, lo - 1)) + '…';
}

function drawDetail() {
  const x = leftW() + 12;
  const w = canvasWidth - x - margin;
  if (w < 120) return;
  const y0 = 56;
  fill(255); stroke(200); strokeWeight(1); rect(x, y0, w, drawHeight - y0 - 12, 8); noStroke();

  if (selected) {
    const c = ratingColor(selected.I, selected.D);
    fill(33, 150, 243); textAlign(LEFT, TOP); textSize(11.5);
    const pathRow = rows.find(r => r.node === selected);
    text((pathRow ? pathRow.branch + '  ▸  ' + pathRow.sub : ''), x + 10, y0 + 10, w - 20);
    fill(40); textSize(12.5); textStyle(BOLD);
    text(selected.t, x + 10, y0 + 30, w - 20); textStyle(NORMAL);
    // rating badge + label
    let yy = y0 + 30 + Math.ceil(textWidth(selected.t) / (w - 20)) * 16 + 16;
    fill(c[0], c[1], c[2]); rect(x + 10, yy, 58, 22, 5);
    fill(255); textAlign(CENTER, CENTER); textSize(12); textStyle(BOLD);
    text(selected.I + ',' + selected.D, x + 39, yy + 11); textStyle(NORMAL);
    fill(70); textAlign(LEFT, CENTER); textSize(11);
    text(ratingLabel(selected.I, selected.D), x + 76, yy + 11, w - 86);
    // rationale
    yy += 34;
    fill(184, 134, 11); textAlign(LEFT, TOP); textSize(11.5); textStyle(BOLD);
    text('Why this rating', x + 10, yy); textStyle(NORMAL);
    fill(55); textSize(12);
    text(selected.why, x + 10, yy + 18, w - 20);
  } else {
    fill(30, 60, 120); textAlign(LEFT, TOP); textSize(12.5); textStyle(BOLD);
    text('Reading the tree', x + 10, y0 + 10); textStyle(NORMAL);
    fill(60); textSize(11.5);
    text('Four levels: the gold root (overall Utility), blue quality attribute branches, ' +
      'teal sub-attributes, and leaf scenarios. Each leaf carries an (Importance, Difficulty) ' +
      'badge. Click a leaf to read why it earned its rating.', x + 10, y0 + 32, w - 20);
  }
  // rating legend (always shown at panel bottom)
  const legends = [['H,H', 'Critical', [211, 47, 47]], ['H,M / M,H', 'High value', [245, 124, 0]],
    ['H,L', 'Quick win', [245, 184, 0]], ['M,M', 'Secondary', [25, 118, 210]], ['L,*', 'Monitor', [128, 128, 128]]];
  let ly = drawHeight - 12 - legends.length * 18 - 6;
  fill(120); textAlign(LEFT, BOTTOM); textSize(10); textStyle(BOLD);
  text('Rating colors', x + 10, ly - 2); textStyle(NORMAL);
  for (let i = 0; i < legends.length; i++) {
    const L = legends[i], yy = ly + i * 18;
    fill(L[2][0], L[2][1], L[2][2]); rect(x + 10, yy, 16, 13, 3);
    fill(70); textAlign(LEFT, CENTER); textSize(10.5);
    text(L[0] + ' — ' + L[1], x + 32, yy + 7);
  }
}

function ratingLabel(I, D) {
  if (I === 'H' && D === 'H') return 'Analyze first — high stakes, hard to get right';
  if ((I === 'H' && D === 'M') || (I === 'M' && D === 'H')) return 'High value, real effort';
  if (I === 'H' && D === 'L') return 'Confirm — important but a quick win';
  if (I === 'M' && D === 'M') return 'Secondary priority';
  return 'Monitor only';
}

function drawControlHint() {
  if (canvasWidth < 560) return;
  noStroke(); fill(90); textAlign(LEFT, CENTER); textSize(11);
  text('Focus (H,H) hides the lower-priority leaves to spotlight the critical set.',
    320, drawHeight + controlHeight / 2, canvasWidth - 330);
}

function mousePressed() {
  if (mouseY > drawHeight || mouseY < treeTop()) return;
  if (mouseX > leftW()) return;
  const i = Math.floor((mouseY - treeTop()) / ROW_H);
  if (i < 0 || i >= rows.length) return;
  const r = rows[i];
  if (r.kind === 'leaf') {
    selected = (selected === r.node) ? null : r.node;
  } else if (r.hasKids) {
    r.node.open = !r.node.open;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionButtons();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
