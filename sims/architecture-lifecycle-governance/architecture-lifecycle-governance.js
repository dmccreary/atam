// Architecture Lifecycle with Governance Checkpoints
// CANVAS_HEIGHT: 470
// Bloom L2 (Understand): students identify the phases of the architecture lifecycle
// and explain the governance activity at each phase — and see where ATAM evaluation
// is most valuable (highlighted in gold). Click a phase for details; "Show Risks"
// overlays where architectural debt is typically introduced.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 15;
let defaultTextSize = 16;

let riskButton;
let showRisks = false;
let selectedPhase = 0;

const phases = [
  { name: 'Inception', gov: 'Stakeholder analysis;\nbusiness drivers doc',
    detail: 'Inception establishes the business case and elicits the quality attributes that matter. Governance: stakeholder analysis and a business-drivers document anchor everything that follows.',
    risk: false },
  { name: 'Architecture\nDesign', gov: 'ARB review;\nprinciple compliance',
    detail: 'Initial architectural decisions and pattern selection happen here. Governance: a preliminary Architecture Review Board (ARB) review and a check against architecture principles. Debt often enters when decisions are made without evaluation.',
    risk: true },
  { name: 'ATAM\nEvaluation', gov: 'Utility tree; risk &\ntradeoff analysis',
    detail: 'A structured quality-attribute evaluation. Governance: build the utility tree, identify risks, non-risks, sensitivity points and tradeoffs. This is where your evaluation superpower activates — catching risks before they become expensive.',
    risk: false, atam: true },
  { name: 'Implementation', gov: 'Conformance checks;\nfitness functions',
    detail: 'Code, configuration, and integration. Governance: automated conformance checks and architecture fitness functions keep the implementation aligned with the intended architecture. Drift (debt) accumulates if checks are missing.',
    risk: true },
  { name: 'Deployment', gov: 'Runtime monitoring;\nSLA verification',
    detail: 'Release, monitoring, and operations. Governance: runtime conformance monitoring and SLA verification confirm the running system meets its quality-attribute scenarios.',
    risk: false },
  { name: 'Evolution', gov: 'Evolutionary fitness;\ntech radar update',
    detail: 'Feature addition, re-platforming, and eventual retirement. Governance: evolutionary architecture fitness functions and technology-radar updates manage change over time. Long-lived systems accrue debt here without active governance.',
    risk: true }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  riskButton = createButton('Show Risks');
  riskButton.position(10, drawHeight + 10);
  riskButton.mousePressed(() => {
    showRisks = !showRisks;
    riskButton.html(showRisks ? 'Hide Risks' : 'Show Risks');
  });

  describe('A horizontal architecture lifecycle of six phases with governance activities ' +
    'below each, the ATAM evaluation phase highlighted in gold, and clickable phases ' +
    'that reveal governance details.', LABEL);
}

function phaseLayout() {
  const gap = 8;
  const w = (canvasWidth - margin * 2 - gap * (phases.length - 1)) / phases.length;
  const phaseY = 52, phaseH = 72;
  for (let i = 0; i < phases.length; i++) {
    phases[i].x = margin + i * (w + gap);
    phases[i].w = w;
    phases[i].y = phaseY;
    phases[i].h = phaseH;
  }
  return { w, phaseY, phaseH, govY: phaseY + phaseH + 34, govH: 60 };
}

function draw() {
  updateCanvasSize();
  const L = phaseLayout();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(CENTER, TOP); textSize(22);
  text('Architecture Lifecycle & Governance', canvasWidth / 2, 12);

  // timeline baseline through the phase row
  stroke(160); strokeWeight(2);
  const baseY = L.phaseY + L.phaseH / 2;
  line(margin, baseY, canvasWidth - margin, baseY);

  for (let i = 0; i < phases.length; i++) {
    const p = phases[i];

    // phase box
    const isSel = i === selectedPhase;
    stroke(isSel ? color(30, 60, 160) : color(120));
    strokeWeight(isSel ? 3 : 1.5);
    if (p.atam) fill(255, 214, 90);
    else fill(187, 222, 251);
    rect(p.x, p.y, p.w, p.h, 8);

    // header strip
    noStroke();
    fill(p.atam ? color(230, 170, 0) : color(21, 101, 192));
    rect(p.x, p.y, p.w, 8, 8, 8, 0, 0);

    noStroke();
    fill(p.atam ? color(80, 50, 0) : color(13, 44, 84));
    textAlign(CENTER, CENTER);
    textSize(12);
    text((i + 1) + '. ' + p.name, p.x + p.w / 2, p.y + p.h / 2 + 2);

    // governance box below, connected by a downward arrow
    stroke(160); strokeWeight(2);
    line(p.x + p.w / 2, p.y + p.h, p.x + p.w / 2, L.govY);
    fill(200, 230, 201); stroke(46, 125, 50); strokeWeight(1.5);
    rect(p.x, L.govY, p.w, L.govH, 6);
    noStroke(); fill(27, 70, 32);
    textAlign(CENTER, CENTER); textSize(10.5);
    text(p.gov, p.x + p.w / 2, L.govY + L.govH / 2);

    // risk badge
    if (showRisks && p.risk) {
      fill(220, 40, 40); noStroke();
      circle(p.x + p.w - 10, p.y + 14, 16);
      fill('white'); textAlign(CENTER, CENTER); textSize(12);
      text('!', p.x + p.w - 10, p.y + 13);
    }
  }

  // ATAM callout
  noStroke(); fill(160, 110, 0); textAlign(CENTER, TOP); textSize(11);
  text('Most valuable evaluation point', phases[2].x + phases[2].w / 2, L.govY + L.govH + 6);

  drawDetailStrip(L);
  drawControlLabel();
}

function drawDetailStrip(L) {
  const y = L.govY + L.govH + 28;
  const h = drawHeight - y - 12;
  fill(255, 255, 255, 235); stroke(200); strokeWeight(1);
  rect(margin, y, canvasWidth - margin * 2, h, 8);
  const p = phases[selectedPhase];
  noStroke(); fill(30, 60, 120); textAlign(LEFT, TOP); textSize(15);
  text('Phase ' + (selectedPhase + 1) + ': ' + p.name.replace('\n', ' '), margin + 12, y + 8);
  fill(50); textSize(13);
  text(p.detail, margin + 12, y + 30, canvasWidth - margin * 2 - 24, h - 36);
}

function drawControlLabel() {
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(13);
  text(showRisks ? 'Red badges mark phases where architectural debt is typically introduced.'
                 : 'Click a phase to read its governance activities.',
    120, drawHeight + 25);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  for (let i = 0; i < phases.length; i++) {
    const p = phases[i];
    if (mouseX >= p.x && mouseX <= p.x + p.w && mouseY >= p.y && mouseY <= p.y + p.h) {
      selectedPhase = i;
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
