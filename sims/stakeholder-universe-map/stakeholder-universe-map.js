// Stakeholder Universe Map
// CANVAS_HEIGHT: 530
// Bloom L2 (Understand): students identify stakeholder categories beyond the
// obvious technical roles and explain the architectural concerns characteristic
// of each. Concentric rings (users/operators → organizational → external) and
// color-coded sectors; click any stakeholder for concerns and ATAM scenarios.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

let concernsBtn, outerBtn;
let showConcerns = false;
let hideOuter = false;
let selected = null;
let hoverSector = null;

// sectors as quadrants (angle in degrees, math convention, y-up)
const sectors = {
  tech: { name: 'Technical', color: [33, 150, 243], center: 135, def: 'Roles that build and run the system: their concerns are interfaces, structure, and operability.' },
  biz:  { name: 'Business', color: [76, 175, 80], center: 45, def: 'Roles that own outcomes and budget: their concerns are value, cost, and time-to-market.' },
  ops:  { name: 'Operational', color: [239, 108, 0], center: -45, def: 'Roles that keep the system healthy in production: availability, performance, recoverability.' },
  ext:  { name: 'External', color: [120, 120, 120], center: -135, def: 'Parties outside the organization: regulators, partners, and auditors who impose constraints.' }
};

const concernColor = {
  performance: [239, 108, 0], availability: [0, 137, 123], security: [198, 40, 40],
  modifiability: [33, 150, 243], cost: [76, 175, 80], compliance: [106, 27, 154], usability: [255, 152, 0]
};

const people = [
  // inner ring (0): direct users & operators
  { id: 'users', label: 'End Users', ring: 0, sector: 'biz', concern: 'usability', influence: 'Medium',
    desc: 'People who use the system to get work done.', qa: 'Usability, performance, availability',
    scen: 'A returning user completes a core task in under 3 clicks and 2 seconds.' },
  { id: 'architects', label: 'Architects', ring: 0, sector: 'tech', concern: 'modifiability', influence: 'High',
    desc: 'Owners of the architecture and its tradeoffs.', qa: 'Modifiability, all quality attributes',
    scen: 'A new feature is added without violating layering or exceeding the latency budget.' },
  { id: 'developers', label: 'Developers', ring: 0, sector: 'tech', concern: 'modifiability', influence: 'Medium',
    desc: 'Engineers who implement and maintain the system.', qa: 'Modifiability, testability',
    scen: 'A bug fix in one module ships without redeploying unrelated modules.' },
  { id: 'sre', label: 'Operations / SRE', ring: 0, sector: 'ops', concern: 'availability', influence: 'High',
    desc: 'Keep the running system healthy and recoverable.', qa: 'Availability, performance, recoverability',
    scen: 'When a node fails, traffic reroutes automatically with no user-visible outage.' },
  // middle ring (1): organizational
  { id: 'po', label: 'Product Owner', ring: 1, sector: 'biz', concern: 'modifiability', influence: 'High',
    desc: 'Prioritizes features and represents user value.', qa: 'Modifiability, time-to-market',
    scen: 'A new payment method is integrated within two sprints.' },
  { id: 'ba', label: 'Business Analyst', ring: 1, sector: 'biz', concern: 'usability', influence: 'Medium',
    desc: 'Translates business needs into requirements.', qa: 'Usability, correctness',
    scen: 'A workflow change is captured as a measurable scenario.' },
  { id: 'cfo', label: 'CFO / Sponsor', ring: 1, sector: 'biz', concern: 'cost', influence: 'High',
    desc: 'Funds the system; cares about ROI and cost.', qa: 'Cost efficiency, scalability',
    scen: 'Peak-season load is handled by autoscaling rather than over-provisioned hardware.' },
  { id: 'sec', label: 'Security Officer', ring: 1, sector: 'tech', concern: 'security', influence: 'High',
    desc: 'Owns the security posture and threat model.', qa: 'Security, auditability',
    scen: 'All access to sensitive data is authenticated, authorized, and logged.' },
  { id: 'comp', label: 'Compliance Officer', ring: 1, sector: 'biz', concern: 'compliance', influence: 'High',
    desc: 'Ensures regulatory and policy adherence.', qa: 'Compliance, privacy',
    scen: 'A data-erasure request is fulfilled within the mandated window.' },
  { id: 'qa', label: 'QA / Test Lead', ring: 1, sector: 'tech', concern: 'modifiability', influence: 'Medium',
    desc: 'Owns quality gates and test strategy.', qa: 'Testability, reliability',
    scen: 'Every release passes automated fitness functions before deploy.' },
  { id: 'data', label: 'Data Owner', ring: 1, sector: 'ops', concern: 'compliance', influence: 'Medium',
    desc: 'Accountable for data governance and quality.', qa: 'Integrity, compliance',
    scen: 'PII fields are encrypted and access is traceable to a user.' },
  // outer ring (2): external / regulatory
  { id: 'reg', label: 'Regulatory Body', ring: 2, sector: 'ext', concern: 'compliance', influence: 'High',
    desc: 'External authority imposing legal requirements.', qa: 'Compliance, security',
    scen: 'The system demonstrably meets a mandated control within audit scope.' },
  { id: 'ext', label: 'External Systems', ring: 2, sector: 'ext', concern: 'availability', influence: 'Medium',
    desc: 'Owners of systems you integrate with.', qa: 'Interoperability, availability',
    scen: 'When a partner API is down, the system degrades gracefully.' },
  { id: 'aud', label: 'Auditors', ring: 2, sector: 'ext', concern: 'security', influence: 'Medium',
    desc: 'Verify controls and evidence after the fact.', qa: 'Auditability, traceability',
    scen: 'A complete tamper-evident audit trail can be produced on request.' },
  { id: 'partner', label: 'Partners', ring: 2, sector: 'ext', concern: 'modifiability', influence: 'Low',
    desc: 'Organizations that build on or resell the system.', qa: 'Interoperability, modifiability',
    scen: 'A partner integrates via a stable, versioned public API.' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  concernsBtn = createButton('Show Concerns');
  concernsBtn.position(10, drawHeight + 12);
  concernsBtn.mousePressed(() => { showConcerns = !showConcerns; concernsBtn.html(showConcerns ? 'Hide Concerns' : 'Show Concerns'); });

  outerBtn = createButton('Hide Outer Ring');
  outerBtn.position(140, drawHeight + 12);
  outerBtn.mousePressed(() => { hideOuter = !hideOuter; outerBtn.html(hideOuter ? 'Show Outer Ring' : 'Hide Outer Ring'); });

  describe('A stakeholder universe map with the system at the center, surrounded by ' +
    'concentric rings of users/operators, organizational, and external stakeholders, ' +
    'organized into Technical, Business, Operational, and External sectors.', LABEL);
}

function geom() {
  const leftW = canvasWidth * 0.6;
  const cx = leftW / 2;
  const cy = 55 + (drawHeight - 70) / 2;
  const R = Math.min(leftW / 2 - 30, (drawHeight - 90) / 2);
  return { leftW, cx, cy, R, r0: R * 0.18, ringR: [R * 0.42, R * 0.66, R * 0.92] };
}

function personPos(p, g) {
  const group = people.filter(q => q.ring === p.ring && q.sector === p.sector);
  const idx = group.indexOf(p);
  const n = group.length;
  const spread = 60; // degrees across the sector
  const a = sectors[p.sector].center + (n === 1 ? 0 : (idx - (n - 1) / 2) * (spread / (n)));
  const rr = g.ringR[p.ring];
  const rad = radians(a);
  return { x: g.cx + cos(rad) * rr, y: g.cy - sin(rad) * rr };
}

function draw() {
  updateCanvasSize();
  const g = geom();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(CENTER, TOP); textSize(19);
  text('Stakeholder Universe Map', g.leftW / 2, 12);

  // sector wedges (light tints)
  hoverSector = null;
  for (const key of Object.keys(sectors)) {
    const s = sectors[key];
    const a0 = radians(s.center - 45), a1 = radians(s.center + 45);
    noStroke(); fill(s.color[0], s.color[1], s.color[2], 22);
    beginShape();
    vertex(g.cx, g.cy);
    for (let a = a0; a <= a1 + 0.001; a += 0.05) vertex(g.cx + cos(a) * g.R, g.cy - sin(a) * g.R);
    endShape(CLOSE);
    // sector label
    const la = radians(s.center);
    const lx = g.cx + cos(la) * (g.R + 4), ly = g.cy - sin(la) * (g.R + 4);
    const hov = dist(mouseX, mouseY, lx, ly) < 40 && mouseY < drawHeight;
    if (hov) hoverSector = key;
    fill(s.color[0] * 0.7, s.color[1] * 0.7, s.color[2] * 0.7);
    textAlign(CENTER, CENTER); textSize(12);
    text(s.name, lx, ly);
  }

  // ring boundaries
  for (const rr of g.ringR) { noFill(); stroke(180); strokeWeight(1); circle(g.cx, g.cy, rr * 2); }

  // central system oval
  noStroke(); fill(225); stroke(120); strokeWeight(1.5);
  ellipse(g.cx, g.cy, g.r0 * 2.2, g.r0 * 1.6);
  noStroke(); fill(70); textAlign(CENTER, CENTER); textSize(11);
  text('System Under\nEvaluation', g.cx, g.cy);

  // stakeholders
  for (const p of people) {
    if (hideOuter && p.ring === 2) continue;
    const pos = personPos(p, g);
    const s = sectors[p.sector];
    const isSel = selected === p;
    stroke(isSel ? color(20, 40, 120) : color(s.color[0], s.color[1], s.color[2]));
    strokeWeight(isSel ? 3 : 1.5);
    fill(s.color[0], s.color[1], s.color[2], 150);
    circle(pos.x, pos.y, isSel ? 17 : 13);

    if (showConcerns) {
      const cc = concernColor[p.concern];
      noStroke(); fill(cc[0], cc[1], cc[2]);
      circle(pos.x + 8, pos.y - 8, 8);
    }
    noStroke(); fill(40); textAlign(CENTER, TOP); textSize(10);
    text(p.label, pos.x, pos.y + 9, 92);
  }

  drawPanel(g);
  drawControlLabel();
}

function drawPanel(g) {
  const px = g.leftW + 8;
  const pw = canvasWidth - px - margin;
  if (pw < 90) return;
  const py = 50, ph = drawHeight - py - 12;
  fill(255, 255, 255, 240); stroke(200); strokeWeight(1);
  rect(px, py, pw, ph, 10); noStroke();

  if (hoverSector) {
    const s = sectors[hoverSector];
    fill(s.color[0] * 0.7, s.color[1] * 0.7, s.color[2] * 0.7); textAlign(LEFT, TOP); textSize(15);
    text(s.name + ' sector', px + 12, py + 10);
    fill(55); textSize(13); text(s.def, px + 12, py + 34, pw - 24, ph - 44);
    return;
  }
  if (selected) {
    const p = selected;
    fill(30, 60, 120); textAlign(LEFT, TOP); textSize(15);
    text(p.label, px + 12, py + 10, pw - 24);
    fill(55); textSize(12.5);
    const body = p.desc + '\n\nPrimary concerns: ' + p.qa +
      '\n\nExample ATAM scenario: ' + p.scen +
      '\n\nInfluence on architecture: ' + p.influence;
    text(body, px + 12, py + 36, pw - 24, ph - 44);
  } else {
    fill(30, 60, 120); textAlign(LEFT, TOP); textSize(15);
    text('Explore the stakeholders', px + 12, py + 10);
    fill(60); textSize(12.5);
    text('Rings show distance from the system: inner = direct users and operators, ' +
      'middle = organizational roles, outer = external/regulatory parties. Click any ' +
      'stakeholder for their concerns and a sample ATAM scenario. Use "Show Concerns" ' +
      'to badge each with its primary quality-attribute concern.', px + 12, py + 36, pw - 24, ph - 46);
  }
}

function drawControlLabel() {
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(12);
  text('Click a stakeholder; hover a sector label for its definition.', 280, drawHeight + 25);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const g = geom();
  selected = null;
  for (const p of people) {
    if (hideOuter && p.ring === 2) continue;
    const pos = personPos(p, g);
    if (dist(mouseX, mouseY, pos.x, pos.y) < 13) selected = p;
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
