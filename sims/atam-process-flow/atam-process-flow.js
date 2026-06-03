// ATAM Two-Phase Process Flow
// CANVAS_HEIGHT: 610
// Bloom L1 (Recall): students recall the correct sequence of ATAM activities,
// identify which phase each belongs to, and name the artifact produced at each
// step. Three swim lanes (Preparation, Phase 1, Phase 2) flow left to right;
// click any activity for who-participates / how-long / pitfalls detail.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 560;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

let artifactsBtn, participantsBtn;
let mode = 'normal';   // 'normal' | 'artifacts' | 'participants'
let selected = null;   // {lane, idx}

// participant roles -> color + short label
const roles = {
  team: { c: [123, 97, 199], label: 'Eval Team' },
  arch: { c: [21, 101, 192], label: 'Arch Team' },
  all:  { c: [46, 125, 50], label: 'All Stakeholders' }
};

const lanes = [
  { name: 'Preparation', color: [187, 222, 251], acts: [
    { a: 'Form Evaluation Team', p: 'team', art: 'Team roster', d: 'The evaluation team is assembled (leader, questioner, note-taker). Participants: evaluation team only. Typically 1 day. Pitfall: choosing evaluators who lack independence from the project.' },
    { a: 'Gather Business Drivers', p: 'team', art: 'Interview notes', d: 'The team interviews the customer to understand goals and the business context. Pitfall: accepting vague goals instead of measurable quality attributes.' },
    { a: 'Collect Architecture Docs', p: 'arch', art: 'Document package', d: 'Existing architecture documentation is collected and reviewed. Pitfall: documentation that is out of date relative to the running system.' },
    { a: 'Create Evaluation Plan', p: 'team', art: 'Evaluation plan', d: 'The team plans the agenda, scope, and logistics of both phases. Pitfall: under-scoping the time required.' },
    { a: 'Schedule and Invite', p: 'team', art: 'Logistics memo', d: 'Sessions are scheduled and stakeholders invited. Pitfall: missing key stakeholders whose scenarios matter most.' }
  ] },
  { name: 'Phase 1', color: [128, 203, 196], acts: [
    { a: 'Present Business Drivers', p: 'arch', art: 'Business drivers doc', d: 'The customer presents business goals and quality-attribute priorities. ~1 hour. Pitfall: drivers that are not prioritized.' },
    { a: 'Present Architecture', p: 'arch', art: 'Architecture briefing', d: 'The architect presents the architecture in a scripted briefing. Pitfall: marketing-style overview without decisions or tradeoffs.' },
    { a: 'Identify Approaches', p: 'arch', art: 'Approaches list', d: 'Architectural approaches/patterns used are catalogued. Pitfall: missing implicit approaches that carry hidden risk.' },
    { a: 'Build Utility Tree', p: 'team', art: 'Draft utility tree', d: 'Quality attributes are decomposed into prioritized, measurable scenarios. ~2 hours. Pitfall: scenarios that are not measurable.' },
    { a: 'Analyze Approaches', p: 'arch', art: 'Preliminary risk catalog', d: 'High-priority scenarios are analyzed against approaches to surface risks, sensitivity points, and tradeoffs.' }
  ] },
  { name: 'Phase 2', color: [255, 213, 79], acts: [
    { a: 'Stakeholder Presentations', p: 'all', art: 'Updated briefing notes', d: 'A broader stakeholder group reconvenes; prior results are recapped. Pitfall: not re-grounding new stakeholders.' },
    { a: 'Brainstorm Scenarios', p: 'all', art: 'Extended scenario catalog', d: 'All stakeholders brainstorm scenarios broadly. Pitfall: stopping too early and missing edge cases.' },
    { a: 'Prioritize Scenarios', p: 'all', art: 'Prioritized utility tree', d: 'Stakeholders vote to prioritize the scenario set. Pitfall: dominant voices skewing priorities.' },
    { a: 'Analyze Additional Risks', p: 'arch', art: 'Final risk catalog', d: 'Top new scenarios are analyzed; risks are consolidated into themes.' },
    { a: 'Present Results', p: 'team', art: 'Preliminary findings', d: 'Findings are presented back to stakeholders for validation. Pitfall: surprises — results should be telegraphed throughout.' }
  ] }
];

const finalStep = { a: 'Produce Final Report', art: 'Architecture evaluation report',
  d: 'After Phase 2, the team consolidates everything into the final architecture evaluation report: risks, risk themes, sensitivity points, tradeoffs, and recommendations. This is the durable artifact of the whole method.' };

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  artifactsBtn = createButton('Show Artifacts Only');
  artifactsBtn.position(10, drawHeight + 12);
  artifactsBtn.mousePressed(() => mode = (mode === 'artifacts' ? 'normal' : 'artifacts'));

  participantsBtn = createButton('Show Participants Only');
  participantsBtn.position(160, drawHeight + 12);
  participantsBtn.mousePressed(() => mode = (mode === 'participants' ? 'normal' : 'participants'));

  describe('A three-swimlane ATAM process flow (Preparation, Phase 1, Phase 2) with ' +
    'fifteen activity boxes, the participant role above each and the artifact produced ' +
    'below each, plus a final report step. Click an activity for details.', LABEL);
}

function laneLayout() {
  const top = 42;
  const detailH = 116;
  const finalH = 30;
  const laneAreaH = drawHeight - top - detailH - finalH - 10;
  const laneH = laneAreaH / 3;
  const lx = 84;             // left label gutter
  const aw = (canvasWidth - lx - margin - 4 * 8) / 5; // box width, 5 across, 8px gaps
  return { top, laneH, lx, aw, detailH, finalH };
}

function draw() {
  updateCanvasSize();
  const L = laneLayout();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(CENTER, TOP); textSize(19);
  text('ATAM Two-Phase Process Flow', canvasWidth / 2, 10);

  for (let li = 0; li < lanes.length; li++) {
    drawLane(li, L);
  }

  // final report bar
  const fy = L.top + L.laneH * 3 + 6;
  const sel = selected && selected.lane === 3;
  stroke(sel ? color(30, 60, 160) : color(150)); strokeWeight(sel ? 3 : 1.5);
  fill(225);
  rect(margin, fy, canvasWidth - margin * 2, L.finalH, 6);
  noStroke(); fill(60); textAlign(CENTER, CENTER); textSize(12);
  text('Post-Evaluation:  ' + finalStep.a + '  →  ' + finalStep.art, canvasWidth / 2, fy + L.finalH / 2);

  drawDetail(L, fy);
  drawControlLabel();
}

function drawLane(li, L) {
  const lane = lanes[li];
  const y = L.top + li * L.laneH;

  // lane label gutter
  noStroke(); fill(lane.color[0], lane.color[1], lane.color[2], 90);
  rect(margin, y + 2, L.lx - margin - 4, L.laneH - 6, 6);
  fill(40); textAlign(CENTER, CENTER); textSize(12); textStyle(BOLD);
  push(); translate(margin + (L.lx - margin) / 2 - 2, y + L.laneH / 2); text(lane.name, 0, 0); pop();
  textStyle(NORMAL);

  for (let i = 0; i < lane.acts.length; i++) {
    const act = lane.acts[i];
    const x = L.lx + i * (L.aw + 8);
    const boxY = y + 24;
    const boxH = L.laneH - 56;

    // participant dot/label above
    const role = roles[act.p];
    const dim = mode === 'artifacts';
    noStroke();
    fill(role.c[0], role.c[1], role.c[2], dim ? 60 : 255);
    circle(x + 8, y + 12, 11);
    fill(dim ? color(180) : color(80)); textAlign(LEFT, CENTER); textSize(9.5);
    text(role.label, x + 17, y + 12);

    // activity box
    const isSel = selected && selected.lane === li && selected.idx === i;
    const boxDim = mode === 'participants' || mode === 'artifacts';
    stroke(isSel ? color(30, 60, 160) : color(120));
    strokeWeight(isSel ? 3 : 1.2);
    fill(boxDim ? color(245) : color(lane.color[0], lane.color[1], lane.color[2]));
    rect(x, boxY, L.aw, boxH, 6);
    noStroke(); fill(boxDim ? color(150) : color(20));
    textAlign(CENTER, CENTER); textSize(10.5);
    text((li === 0 ? '' : (li === 1 ? '' : '')) + act.a, x + 4, boxY + 2, L.aw - 8, boxH - 4);

    // arrow to next box
    if (i < lane.acts.length - 1) {
      stroke(140); strokeWeight(1.5);
      const ax = x + L.aw, ay = boxY + boxH / 2;
      line(ax, ay, ax + 8, ay);
      noStroke(); fill(140); triangle(ax + 8, ay - 3, ax + 8, ay + 3, ax + 8 + 4, ay);
    }

    // artifact below (italic)
    const artDim = mode === 'participants';
    noStroke(); fill(artDim ? color(190) : color(90));
    textAlign(CENTER, TOP); textSize(9.5); textStyle(ITALIC);
    text(act.art, x, boxY + boxH + 3, L.aw);
    textStyle(NORMAL);
  }
}

function drawDetail(L, fy) {
  const y = fy + L.finalH + 8;
  const h = drawHeight - y - 8;
  fill(255, 255, 255, 240); stroke(200); strokeWeight(1);
  rect(margin, y, canvasWidth - margin * 2, h, 8);
  noStroke();
  let act = null, head = '';
  if (selected) {
    if (selected.lane === 3) { act = finalStep; head = 'Final Report'; }
    else { act = lanes[selected.lane].acts[selected.idx]; head = lanes[selected.lane].name + ' — ' + act.a; }
  }
  fill(30, 60, 120); textAlign(LEFT, TOP); textSize(14);
  text(act ? head : 'Click any activity box', margin + 12, y + 8);
  fill(55); textSize(12.5);
  text(act ? (act.d + '   Artifact: ' + act.art)
           : 'The flow runs left to right through Preparation, Phase 1, and Phase 2, then produces the final report. Each box shows its participant role (dot above) and the artifact it produces (italic below).',
    margin + 12, y + 30, canvasWidth - margin * 2 - 24, h - 36);
}

function drawControlLabel() {
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(12);
  let m = 'Click an activity for details.';
  if (mode === 'artifacts') m = 'Highlighting artifact flow (italic labels).';
  if (mode === 'participants') m = 'Highlighting participant roles (colored dots).';
  text(m, 330, drawHeight + 25);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const L = laneLayout();
  // final bar
  const fy = L.top + L.laneH * 3 + 6;
  if (mouseY >= fy && mouseY <= fy + L.finalH) { selected = { lane: 3 }; return; }
  for (let li = 0; li < lanes.length; li++) {
    const y = L.top + li * L.laneH;
    const boxY = y + 24, boxH = L.laneH - 56;
    for (let i = 0; i < lanes[li].acts.length; i++) {
      const x = L.lx + i * (L.aw + 8);
      if (mouseX >= x && mouseX <= x + L.aw && mouseY >= boxY && mouseY <= boxY + boxH) {
        selected = { lane: li, idx: i }; return;
      }
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
