// ATAM Team Roles and Interactions
// CANVAS_HEIGHT: 540
// Bloom L1 (Recall): students identify each ATAM team role, state its primary
// responsibility, and explain how it interacts with the others. Four role cards
// surround the central evaluation session; click a card for full details.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 490;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

let p1Btn, p2Btn, failBtn;
let phaseFilter = 0;     // 0 = all, 1 = Phase 1 only, 2 = Phase 2 only
let showFailures = false;
let selected = null;

const roles = {
  leader: {
    title: 'Evaluation Leader', pos: 'top', color: [255, 196, 0], icon: 'L',
    bullets: ['Facilitates sessions', 'Enforces the process', 'Manages time'],
    phases: [1, 2],
    detail: 'Filled by an experienced, independent facilitator. Key skills: facilitation, ATAM mastery, neutrality. Pitfall: letting discussion drift or favoring the architect. Active in Phase 1 and Phase 2.',
    failure: 'Loss of neutrality / poor time management.'
  },
  architect: {
    title: 'Architecture Owner', pos: 'right', color: [33, 150, 243], icon: 'A',
    bullets: ['Presents the architecture', 'Answers design questions', 'Explains tradeoffs'],
    phases: [1, 2],
    detail: 'Filled by the lead architect or design authority. Key skills: deep system knowledge, openness to scrutiny. Pitfall: defensiveness — treating questions as attacks rather than analysis. Active in both phases.',
    failure: 'Defensiveness; hiding known risks.'
  },
  notetaker: {
    title: 'Note-Taker', pos: 'bottom', color: [0, 137, 123], icon: 'N',
    bullets: ['Captures findings', 'Records scenarios & risks', 'Feeds the report'],
    phases: [1, 2],
    detail: 'Filled by a detail-oriented team member (the scribe). Key skills: fast structured note-taking, synthesis. Pitfall: capturing discussion verbatim instead of structured findings. Produces the raw material for the final report.',
    failure: 'Unstructured notes that are hard to report.'
  },
  stakeholders: {
    title: 'Stakeholders', pos: 'left', color: [76, 175, 80], icon: 'S',
    bullets: ['Validate priorities', 'Contribute scenarios', 'Represent concerns'],
    phases: [2],
    detail: 'The broad stakeholder community: users, operators, security, business owners. Key contribution: scenarios and priorities. Pitfall: a few dominant voices skewing the priority vote. Most active in Phase 2 brainstorming.',
    failure: 'Dominant voices skew prioritization.'
  }
};

// interaction arrows: from -> to, label
const interactions = [
  { from: 'leader', to: 'architect', label: 'Structured questioning' },
  { from: 'leader', to: 'stakeholders', label: 'Facilitates brainstorming' },
  { from: 'stakeholders', to: 'notetaker', label: 'Generates scenarios (P2)' },
  { from: 'notetaker', to: 'leader', label: 'Real-time record' },
  { from: 'architect', to: 'notetaker', label: 'Architecture briefing' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  p1Btn = createButton('Phase 1 Only');
  p1Btn.position(10, drawHeight + 12);
  p1Btn.mousePressed(() => phaseFilter = (phaseFilter === 1 ? 0 : 1));

  p2Btn = createButton('Phase 2 Only');
  p2Btn.position(115, drawHeight + 12);
  p2Btn.mousePressed(() => phaseFilter = (phaseFilter === 2 ? 0 : 2));

  failBtn = createButton('Common Failure Modes');
  failBtn.position(220, drawHeight + 12);
  failBtn.mousePressed(() => showFailures = !showFailures);

  describe('Four ATAM team roles — Evaluation Leader, Architecture Owner, Note-Taker, ' +
    'and Stakeholders — arranged around a central evaluation session, with labeled ' +
    'interaction arrows between them. Click a role for its full description.', LABEL);
}

function geom() {
  const top = 44;
  const detailH = 120;
  const areaH = drawHeight - top - detailH - 8;
  const cx = canvasWidth / 2;
  const cy = top + areaH / 2;
  const cardW = Math.min(168, canvasWidth * 0.27);
  const cardH = 86;
  const dx = Math.min(canvasWidth * 0.32, 230);
  const dy = areaH / 2 - cardH / 2 + 6;
  const centers = {
    leader: { x: cx, y: cy - dy },
    bottom: 0,
    notetaker: { x: cx, y: cy + dy },
    architect: { x: cx + dx, y: cy },
    stakeholders: { x: cx - dx, y: cy }
  };
  return { top, detailH, cx, cy, cardW, cardH, centers };
}

function activeRole(key) {
  if (phaseFilter === 0) return true;
  return roles[key].phases.indexOf(phaseFilter) >= 0;
}

function draw() {
  updateCanvasSize();
  const G = geom();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(CENTER, TOP); textSize(19);
  text('ATAM Team Roles & Interactions', canvasWidth / 2, 12);

  // central session space
  noStroke(); fill(225); stroke(150); strokeWeight(1.5);
  rectMode(CENTER);
  rect(G.cx, G.cy, G.cardW * 0.95, G.cardH * 0.8, 10);
  rectMode(CORNER);
  noStroke(); fill(90); textAlign(CENTER, CENTER); textSize(13);
  text('Evaluation\nSession', G.cx, G.cy);

  drawInteractions(G);

  for (const key of ['leader', 'architect', 'notetaker', 'stakeholders']) {
    drawRoleCard(key, G);
  }

  drawDetail(G);
  drawControlLabel();
}

function drawInteractions(G) {
  for (const it of interactions) {
    const a = G.centers[it.from], b = G.centers[it.to];
    const hovered = dist(mouseX, mouseY, (a.x + b.x) / 2, (a.y + b.y) / 2) < 26 && mouseY < drawHeight;
    stroke(hovered ? color(30, 60, 160) : color(170));
    strokeWeight(hovered ? 3 : 1.5);
    // offset endpoints toward card edges
    line(a.x, a.y, b.x, b.y);
    // arrowhead at b
    const ang = atan2(b.y - a.y, b.x - a.x);
    push(); translate(lerp(a.x, b.x, 0.62), lerp(a.y, b.y, 0.62)); rotate(ang);
    noStroke(); fill(hovered ? color(30, 60, 160) : color(170));
    triangle(0, 0, -9, -4, -9, 4); pop();
    if (hovered) {
      noStroke(); fill(20, 40, 120); textAlign(CENTER, CENTER); textSize(12);
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const tw = textWidth(it.label) + 12;
      fill(255, 255, 255, 235); rect(mx - tw / 2, my - 10, tw, 20, 5);
      fill(20, 40, 120); text(it.label, mx, my);
    }
  }
}

function drawRoleCard(key, G) {
  const r = roles[key];
  const c = G.centers[key];
  const w = G.cardW, h = G.cardH;
  const x = c.x - w / 2, y = c.y - h / 2;
  const active = activeRole(key);

  stroke(selected === key ? color(30, 60, 160) : color(r.color[0], r.color[1], r.color[2]));
  strokeWeight(selected === key ? 3 : 2);
  fill(active ? color(r.color[0], r.color[1], r.color[2], 60) : color(238));
  rect(x, y, w, h, 8);

  // icon badge
  noStroke(); fill(active ? color(r.color[0], r.color[1], r.color[2]) : color(180));
  circle(x + 16, y + 16, 22);
  fill('white'); textAlign(CENTER, CENTER); textSize(13); textStyle(BOLD);
  text(r.icon, x + 16, y + 15); textStyle(NORMAL);

  fill(active ? color(30) : color(150)); textAlign(LEFT, CENTER); textSize(12.5); textStyle(BOLD);
  text(r.title, x + 32, y + 15, w - 36); textStyle(NORMAL);

  textSize(10.5); textAlign(LEFT, TOP); fill(active ? color(60) : color(170));
  for (let i = 0; i < r.bullets.length; i++) {
    text('• ' + r.bullets[i], x + 8, y + 32 + i * 14, w - 12);
  }

  if (showFailures) {
    noStroke(); fill(220, 40, 40);
    circle(x + w - 12, y + 12, 16);
    fill('white'); textAlign(CENTER, CENTER); textSize(12); text('!', x + w - 12, y + 11);
  }
}

function drawDetail(G) {
  const y = drawHeight - G.detailH;
  const h = G.detailH - 8;
  fill(255, 255, 255, 240); stroke(200); strokeWeight(1);
  rect(margin, y, canvasWidth - margin * 2, h, 8);
  noStroke();
  const r = selected ? roles[selected] : null;
  fill(30, 60, 120); textAlign(LEFT, TOP); textSize(14);
  text(r ? r.title : 'Click any role card', margin + 12, y + 8);
  fill(55); textSize(12.5);
  let body;
  if (r) {
    body = r.detail;
    if (showFailures) body += '   Common failure mode: ' + r.failure;
  } else {
    body = 'Four roles surround the evaluation session. Arrows show how they interact — ' +
      'hover an arrow to see what happens at that interface. Use the phase buttons to see ' +
      'who is active in Phase 1 vs Phase 2.';
  }
  text(body, margin + 12, y + 30, canvasWidth - margin * 2 - 24, h - 36);
}

function drawControlLabel() {
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(12);
  let m = 'Click a role for details; hover an arrow for the interaction.';
  if (phaseFilter === 1) m = 'Phase 1: Leader, Architect, and Note-Taker are active.';
  if (phaseFilter === 2) m = 'Phase 2: all four roles are active (broad stakeholder group).';
  text(m, 390, drawHeight + 25);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const G = geom();
  selected = null;
  for (const key of ['leader', 'architect', 'notetaker', 'stakeholders']) {
    const c = G.centers[key];
    const x = c.x - G.cardW / 2, y = c.y - G.cardH / 2;
    if (mouseX >= x && mouseX <= x + G.cardW && mouseY >= y && mouseY <= y + G.cardH) {
      selected = key;
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
