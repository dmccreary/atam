// Utility Tree Builder
// CANVAS_HEIGHT: 586
// Bloom L6 (Create): students DESIGN a utility tree — add quality attribute branches,
// sub-attribute nodes, and rated leaf scenarios — with a live tree visualization, an (H,H)
// counter, and a structural validator. A guided four-step editor scaffolds the complex task
// while requiring students to supply all system-specific content.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 540;
let controlHeight = 46;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;

const LEVEL_COLORS = { branch: [33, 150, 243], sub: [0, 150, 136] };
function ratingColor(I, D) {
  if (I === 'H' && D === 'H') return [211, 47, 47];
  if ((I === 'H' && D === 'M') || (I === 'M' && D === 'H')) return [245, 124, 0];
  if (I === 'H' && D === 'L') return [245, 184, 0];
  if (I === 'M' && D === 'M') return [25, 118, 210];
  return [128, 128, 128];
}

let userTree = { branches: [] };
let sel = { b: -1, s: -1, l: -1 };  // selection path; kind inferred from which are >= 0
let rows = [];
let feedback = [];
let feedbackOK = false;

let branchSel, addBranchBtn, subInput, addSubBtn, leafInput, addLeafBtn, impSel, difSel;
let loadBtn, validateBtn, clearBtn;
let editorW = 300;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  const main = document.querySelector('main');

  branchSel = createSelect(); branchSel.parent(main);
  for (const q of ['Performance', 'Availability', 'Security', 'Modifiability', 'Interoperability', 'Scalability', 'Usability', 'Testability'])
    branchSel.option(q);
  branchSel.style('font-size', '13px');
  addBranchBtn = createButton('Add Branch'); addBranchBtn.parent(main); addBranchBtn.mousePressed(addBranch);

  subInput = createInput(''); subInput.parent(main); subInput.attribute('placeholder', 'sub-attribute name'); subInput.style('font-size', '13px');
  addSubBtn = createButton('Add Sub'); addSubBtn.parent(main); addSubBtn.mousePressed(addSub);

  leafInput = createInput(''); leafInput.parent(main); leafInput.attribute('placeholder', 'leaf scenario statement'); leafInput.style('font-size', '13px');
  addLeafBtn = createButton('Add Scenario'); addLeafBtn.parent(main); addLeafBtn.mousePressed(addLeaf);

  impSel = createSelect(); impSel.parent(main); for (const v of ['H', 'M', 'L']) impSel.option(v); impSel.changed(applyRating);
  difSel = createSelect(); difSel.parent(main); for (const v of ['H', 'M', 'L']) difSel.option(v); difSel.changed(applyRating);

  loadBtn = createButton('Load Example'); loadBtn.parent(main); loadBtn.mousePressed(loadExample);
  validateBtn = createButton('Validate Tree'); validateBtn.parent(main); validateBtn.mousePressed(validateTree);
  clearBtn = createButton('Clear'); clearBtn.parent(main); clearBtn.mousePressed(() => { userTree = { branches: [] }; sel = { b: -1, s: -1, l: -1 }; feedback = []; });

  loadExample();
  updateLayout();
  describe('A utility-tree builder with a four-step editor (add branch, add sub-attribute, ' +
    'add leaf scenario, rate the leaf), a live indented tree visualization with rating ' +
    'badges, an (H,H) counter, and a structural validator.', LABEL);
}

function updateLayout() {
  editorW = Math.max(300, canvasWidth * 0.43);
  const inW = editorW - 104;
  branchSel.position(margin, 78); branchSel.size(Math.min(150, editorW * 0.46));
  addBranchBtn.position(margin + Math.min(150, editorW * 0.46) + 8, 78);
  subInput.position(margin, 130); subInput.size(inW);
  addSubBtn.position(margin + inW + 8, 130);
  leafInput.position(margin, 182); leafInput.size(inW);
  addLeafBtn.position(margin + inW + 8, 182);
  impSel.position(margin + 64, 232); difSel.position(margin + editorW * 0.5 + 56, 232);
  const y = drawHeight + 10;
  loadBtn.position(10, y); validateBtn.position(124, y); clearBtn.position(232, y);
}

function selectedLeaf() {
  if (sel.b >= 0 && sel.s >= 0 && sel.l >= 0) return userTree.branches[sel.b].subs[sel.s].leaves[sel.l];
  return null;
}

function addBranch() {
  const name = branchSel.value();
  if (userTree.branches.some(b => b.name === name)) {
    sel = { b: userTree.branches.findIndex(b => b.name === name), s: -1, l: -1 };
    return;
  }
  userTree.branches.push({ name, subs: [] });
  sel = { b: userTree.branches.length - 1, s: -1, l: -1 };
}

function addSub() {
  if (sel.b < 0) { feedback = ['Select a branch first (click one in the tree).']; feedbackOK = false; return; }
  const name = subInput.value().trim();
  if (!name) return;
  userTree.branches[sel.b].subs.push({ name, leaves: [] });
  sel = { b: sel.b, s: userTree.branches[sel.b].subs.length - 1, l: -1 };
  subInput.value('');
}

function addLeaf() {
  if (sel.b < 0 || sel.s < 0) { feedback = ['Select a sub-attribute first (click one in the tree).']; feedbackOK = false; return; }
  const t = leafInput.value().trim();
  if (!t) return;
  const leaves = userTree.branches[sel.b].subs[sel.s].leaves;
  leaves.push({ t, I: impSel.value(), D: difSel.value() });
  sel = { b: sel.b, s: sel.s, l: leaves.length - 1 };
  leafInput.value('');
}

function applyRating() {
  const lf = selectedLeaf();
  if (lf) { lf.I = impSel.value(); lf.D = difSel.value(); }
}

function loadExample() {
  userTree = { branches: [
    { name: 'Performance', subs: [
      { name: 'Response Latency', leaves: [ { t: 'Search returns in < 800ms at p99 under peak load', I: 'H', D: 'H' } ] },
      { name: 'Throughput', leaves: [ { t: 'Sustain 1000 req/s with < 1% errors', I: 'M', D: 'M' } ] } ] },
    { name: 'Availability', subs: [
      { name: 'Fault Tolerance', leaves: [ { t: 'Service survives a single-node failure with no lost requests', I: 'H', D: 'H' } ] },
      { name: 'Recovery', leaves: [ { t: 'Recover from a region outage within 15 minutes', I: 'H', D: 'M' } ] } ] },
    { name: 'Security', subs: [
      { name: 'Access Control', leaves: [ { t: 'Only authorized roles can read sensitive records; all access logged', I: 'H', D: 'H' } ] },
      { name: 'Data Protection', leaves: [ { t: 'All sensitive data encrypted at rest and in transit', I: 'H', D: 'L' } ] } ] }
  ] };
  sel = { b: 0, s: 0, l: 0 };
  feedback = [];
}

function hhCount() {
  let c = 0;
  for (const b of userTree.branches) for (const s of b.subs) for (const lf of s.leaves) if (lf.I === 'H' && lf.D === 'H') c++;
  return c;
}

function validateTree() {
  const msgs = [];
  if (userTree.branches.length < 3) msgs.push('Add at least 3 quality-attribute branches (have ' + userTree.branches.length + ').');
  for (const b of userTree.branches) {
    if (b.subs.length < 2) msgs.push('Branch "' + b.name + '" needs at least 2 sub-attributes.');
    for (const s of b.subs) if (s.leaves.length < 1) msgs.push('Sub-attribute "' + s.name + '" needs at least 1 scenario.');
  }
  if (hhCount() < 2) msgs.push('Add at least 2 (H,H) scenarios (have ' + hhCount() + ').');
  feedbackOK = msgs.length === 0;
  feedback = feedbackOK ? ['Tree structure complete — a well-formed utility tree.'] : msgs;
}

function draw() {
  updateCanvasSize();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(LEFT, TOP); textSize(18);
  text('Utility Tree Builder', margin, 10);
  fill(90); textSize(11);
  text('Design a tree: add branches, sub-attributes, and rated leaf scenarios.', margin, 34);

  drawEditorLabels();
  drawTree();
  drawStatusBar();
  drawControlHint();
}

function drawEditorLabels() {
  noStroke(); fill(40); textAlign(LEFT, TOP); textSize(12); textStyle(BOLD);
  text('1. Add a quality-attribute branch', margin, 60);
  text('2. Add a sub-attribute  (to the selected branch)', margin, 112);
  text('3. Add a leaf scenario  (to the selected sub-attribute)', margin, 164);
  text('4. Rate the selected leaf', margin, 214);
  textStyle(NORMAL);
  fill(90); textAlign(LEFT, CENTER); textSize(12);
  text('Imp', margin, 243); text('Diff', margin + editorW * 0.5 + 24, 243);
  // selected path
  fill(120); textAlign(LEFT, TOP); textSize(11.5);
  let path = 'nothing selected — click a node in the tree';
  if (sel.b >= 0) {
    path = userTree.branches[sel.b].name;
    if (sel.s >= 0) { path += ' ▸ ' + userTree.branches[sel.b].subs[sel.s].name;
      if (sel.l >= 0) path += ' ▸ leaf'; }
  }
  fill(80); textStyle(BOLD); text('Selected: ', margin, 272); textStyle(NORMAL);
  fill(110); text(path, margin + 56, 272, editorW - 60);
}

const ROW_H = 18;
function treeTop() { return 60; }
function treeBottom() { return drawHeight - 70; }

function drawTree() {
  const x0 = editorW + 12;
  const w = canvasWidth - x0 - margin;
  if (w < 120) return;
  // panel
  fill(252); stroke(210); strokeWeight(1); rect(x0, treeTop(), w, treeBottom() - treeTop(), 8); noStroke();
  fill(30, 60, 120); textAlign(LEFT, TOP); textSize(12.5); textStyle(BOLD);
  text('Your utility tree', x0 + 10, treeTop() + 8); textStyle(NORMAL);

  rows = [];
  rows.push({ kind: 'root' });
  for (let bi = 0; bi < userTree.branches.length; bi++) {
    const b = userTree.branches[bi];
    rows.push({ kind: 'branch', b: bi, label: b.name });
    for (let si = 0; si < b.subs.length; si++) {
      const s = b.subs[si];
      rows.push({ kind: 'sub', b: bi, s: si, label: s.name });
      for (let li = 0; li < s.leaves.length; li++)
        rows.push({ kind: 'leaf', b: bi, s: si, l: li, node: s.leaves[li] });
    }
  }
  const top = treeTop() + 30;
  const badgeX = x0 + w - 50;
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const y = top + i * ROW_H;
    if (y > treeBottom() - ROW_H) break;
    if (r.kind === 'root') {
      fill(184, 134, 11); textAlign(LEFT, CENTER); textSize(12.5); textStyle(BOLD);
      text('◆ Utility', x0 + 10, y + ROW_H / 2); textStyle(NORMAL); continue;
    }
    const isSel = (r.kind === 'branch' && sel.b === r.b && sel.s < 0) ||
      (r.kind === 'sub' && sel.b === r.b && sel.s === r.s && sel.l < 0) ||
      (r.kind === 'leaf' && sel.b === r.b && sel.s === r.s && sel.l === r.l);
    if (isSel) { noStroke(); fill(232, 240, 254); rect(x0 + 4, y - 1, w - 8, ROW_H, 4); }
    const indent = r.kind === 'branch' ? 16 : (r.kind === 'sub' ? 34 : 52);
    const tx = x0 + indent;
    if (r.kind === 'leaf') {
      const c = ratingColor(r.node.I, r.node.D);
      noStroke(); fill(55); textAlign(LEFT, CENTER); textSize(10.5);
      text(truncate('• ' + r.node.t, badgeX - tx - 8), tx, y + ROW_H / 2);
      fill(c[0], c[1], c[2]); rect(badgeX, y + 2, 42, ROW_H - 4, 4);
      fill(255); textAlign(CENTER, CENTER); textSize(9.5); textStyle(BOLD);
      text(r.node.I + ',' + r.node.D, badgeX + 21, y + ROW_H / 2); textStyle(NORMAL);
    } else {
      const c = LEVEL_COLORS[r.kind];
      fill(c[0], c[1], c[2]); textAlign(LEFT, CENTER); textSize(r.kind === 'branch' ? 12 : 11.5); textStyle(BOLD);
      text((r.kind === 'branch' ? '■ ' : '▫ ') + r.label, tx, y + ROW_H / 2); textStyle(NORMAL);
    }
  }
}

function truncate(s, w) {
  if (textWidth(s) <= w) return s;
  let lo = 0, hi = s.length;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (textWidth(s.slice(0, mid) + '…') <= w) lo = mid + 1; else hi = mid; }
  return s.slice(0, Math.max(0, lo - 1)) + '…';
}

function drawStatusBar() {
  const y = drawHeight - 64, h = 56;
  noStroke(); fill(245, 248, 252); stroke(215); strokeWeight(1);
  rect(margin, y, canvasWidth - margin * 2, h, 8); noStroke();
  // (H,H) badge
  const c = hhCount() >= 2 ? color(46, 125, 50) : color(180, 40, 40);
  fill(c); rect(margin + 8, y + 8, 132, 24, 6);
  fill(255); textAlign(CENTER, CENTER); textSize(12.5); textStyle(BOLD);
  text('(H,H) scenarios: ' + hhCount(), margin + 74, y + 20); textStyle(NORMAL);
  // feedback
  textAlign(LEFT, TOP); textSize(11.5);
  if (feedback.length === 0) {
    fill(110); text('Build the tree, then click Validate Tree for structural feedback.', margin + 150, y + 9, canvasWidth - margin * 2 - 160);
  } else {
    fill(feedbackOK ? color(46, 125, 50) : color(180, 40, 40));
    const shown = feedback.slice(0, 2).join('   •   ') + (feedback.length > 2 ? '   •   (+' + (feedback.length - 2) + ' more)' : '');
    text((feedbackOK ? '✓ ' : '⚠ ') + shown, margin + 150, y + 9, canvasWidth - margin * 2 - 160, h - 16);
  }
}

function drawControlHint() {
  if (canvasWidth < 560) return;
  noStroke(); fill(90); textAlign(LEFT, CENTER); textSize(11);
  text('Click a tree node to select it; the editor steps act on the selection.',
    320, drawHeight + controlHeight / 2, canvasWidth - 330);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const x0 = editorW + 12;
  if (mouseX < x0) return;
  const top = treeTop() + 30;
  if (mouseY < top || mouseY > treeBottom()) return;
  const i = Math.floor((mouseY - top) / ROW_H);
  if (i < 0 || i >= rows.length) return;
  const r = rows[i];
  if (r.kind === 'root') { sel = { b: -1, s: -1, l: -1 }; return; }
  if (r.kind === 'branch') sel = { b: r.b, s: -1, l: -1 };
  else if (r.kind === 'sub') sel = { b: r.b, s: r.s, l: -1 };
  else if (r.kind === 'leaf') {
    sel = { b: r.b, s: r.s, l: r.l };
    impSel.selected(r.node.I); difSel.selected(r.node.D);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  updateLayout();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
