// Architecture Evaluation Methods Comparison
// CANVAS_HEIGHT: 555
// Bloom L4 (Analyze): students compare architecture evaluation methods (Full ATAM,
// SAAM, ARID, Mini-ATAM, Lightweight) across five dimensions on a radar chart and
// select the appropriate method for a given scenario. Toggle methods, click a
// legend item to highlight, hover an axis for its scale, or pick a scenario.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 505;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const axes = [
  { key: 'dur', label: 'Duration\nEfficiency', explain: '1 = very long, 5 = very fast' },
  { key: 'stake', label: 'Stakeholder\nBreadth', explain: '1 = team only, 5 = full stakeholder community' },
  { key: 'rigor', label: 'Output\nRigor', explain: '1 = informal, 5 = full formal report' },
  { key: 'breadth', label: 'Applicability\nBreadth', explain: '1 = narrow focus, 5 = full QA space' },
  { key: 'indep', label: 'Independence', explain: '1 = no external evaluators, 5 = fully independent team' }
];

const methods = {
  atam:  { name: 'Full ATAM', color: [255, 196, 0],  s: { dur: 2, stake: 5, rigor: 5, breadth: 5, indep: 5 },
    desc: 'The full two-phase method. Most rigorous and broad, engages the whole stakeholder community, and needs an independent team — but it is the most time-consuming. Best for high-stakes systems.' },
  saam:  { name: 'SAAM', color: [33, 150, 243], s: { dur: 3, stake: 3, rigor: 4, breadth: 2, indep: 4 },
    desc: 'Software Architecture Analysis Method — ATAM’s predecessor, focused on modifiability scenarios. Good rigor and independence with a narrower quality-attribute focus.' },
  arid:  { name: 'ARID', color: [76, 175, 80], s: { dur: 5, stake: 2, rigor: 2, breadth: 1, indep: 3 },
    desc: 'Active Reviews for Intermediate Designs. Fast, narrow, and informal — reviews a partial design for fitness-of-purpose with a small group. Best for in-progress designs.' },
  mini:  { name: 'Mini-ATAM', color: [0, 137, 123], s: { dur: 4, stake: 3, rigor: 3, breadth: 3, indep: 2 },
    desc: 'A condensed ATAM that trades some breadth and independence for speed. A balanced middle option when time is limited but structure still matters.' },
  light: { name: 'Lightweight', color: [120, 120, 120], s: { dur: 5, stake: 1, rigor: 1, breadth: 2, indep: 1 },
    desc: 'A quick internal sanity check by the team itself. Fastest and cheapest, but informal, narrow, and not independent. Best for low-risk, early, or internal-only reviews.' }
};
const methodKeys = ['atam', 'saam', 'arid', 'mini', 'light'];

const scenarios = {
  'Pick a scenario…': null,
  'High-stakes system, full eval': { key: 'atam', why: 'High stakes justify the most rigorous, independent, broad evaluation: Full ATAM.' },
  'Limited time, still structured': { key: 'mini', why: 'When time is tight but you still need structure, Mini-ATAM balances speed against rigor.' },
  'Review an in-progress design': { key: 'arid', why: 'For an intermediate, incomplete design, ARID gives fast fitness-of-purpose feedback.' },
  'Compare modifiability options': { key: 'saam', why: 'SAAM is purpose-built for comparing designs against modifiability scenarios.' },
  'Quick internal sanity check': { key: 'light', why: 'A low-risk internal check needs only a Lightweight review — fast and cheap.' }
};

let checkboxes = {};
let visible = { atam: true, saam: true, arid: true, mini: true, light: true };
let highlighted = null;
let scenarioSelect;
let scenarioWhy = '';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  let bx = 10;
  for (const k of methodKeys) {
    const cb = createCheckbox(' ' + methods[k].name, true);
    cb.position(bx, drawHeight + 14);
    cb.style('font-size', '13px');
    cb.changed(() => { visible[k] = cb.checked(); });
    checkboxes[k] = cb;
    bx += methods[k].name.length * 7 + 40;
  }

  scenarioSelect = createSelect();
  for (const name of Object.keys(scenarios)) scenarioSelect.option(name);
  scenarioSelect.changed(() => {
    const sc = scenarios[scenarioSelect.value()];
    if (sc) { highlighted = sc.key; scenarioWhy = sc.why; }
    else { scenarioWhy = ''; }
  });
  positionSelect();

  describe('A radar chart comparing five architecture evaluation methods across ' +
    'Duration Efficiency, Stakeholder Breadth, Output Rigor, Applicability Breadth, ' +
    'and Independence. Toggle methods, highlight one, or pick a scenario for a recommendation.', LABEL);
}

function positionSelect() {
  const px = canvasWidth * 0.6 + 8;
  scenarioSelect.position(px + 6, 60);
  scenarioSelect.style('font-size', '13px');
}

function radarGeom() {
  const leftW = canvasWidth * 0.6;
  const cx = leftW / 2 + 30;
  const cy = 60 + (drawHeight - 90) / 2;
  const R = Math.min(leftW / 2 - 70, (drawHeight - 130) / 2);
  return { leftW, cx, cy, R };
}

function axisPoint(g, axisIndex, value) {
  const ang = -HALF_PI + axisIndex * TWO_PI / axes.length;
  const r = map(value, 0, 5, 0, g.R);
  return { x: g.cx + cos(ang) * r, y: g.cy + sin(ang) * r, ang };
}

function draw() {
  updateCanvasSize();
  const g = radarGeom();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(CENTER, TOP); textSize(19);
  text('Evaluation Methods Comparison', g.leftW / 2, 12);

  // concentric grid rings (1..5)
  let hoverAxis = -1;
  for (let ring = 1; ring <= 5; ring++) {
    noFill(); stroke(220); strokeWeight(1);
    beginShape();
    for (let i = 0; i < axes.length; i++) {
      const p = axisPoint(g, i, ring);
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
  }

  // axis spokes + labels
  for (let i = 0; i < axes.length; i++) {
    const tip = axisPoint(g, i, 5);
    stroke(190); strokeWeight(1);
    line(g.cx, g.cy, tip.x, tip.y);
    const lp = axisPoint(g, i, 5.9);
    noStroke();
    const isHover = dist(mouseX, mouseY, tip.x, tip.y) < 28 && mouseY < drawHeight;
    if (isHover) hoverAxis = i;
    fill(isHover ? color(30, 60, 160) : color(70));
    textAlign(CENTER, CENTER); textSize(11);
    text(axes[i].label, lp.x, lp.y);
  }

  // method polygons
  for (const k of methodKeys) {
    if (!visible[k]) continue;
    const m = methods[k];
    const isHi = highlighted === k;
    noStroke();
    fill(m.color[0], m.color[1], m.color[2], isHi ? 90 : 28);
    beginShape();
    for (let i = 0; i < axes.length; i++) {
      const p = axisPoint(g, i, m.s[axes[i].key]);
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
    stroke(m.color[0], m.color[1], m.color[2]); strokeWeight(isHi ? 3.5 : 1.8);
    noFill();
    beginShape();
    for (let i = 0; i < axes.length; i++) {
      const p = axisPoint(g, i, m.s[axes[i].key]);
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
  }

  drawPanel(g, hoverAxis);
  drawControlLabel();
}

function drawPanel(g, hoverAxis) {
  const px = g.leftW + 8;
  const pw = canvasWidth - px - margin;
  if (pw < 90) return;

  // legend (below the scenario select)
  let ly = 96;
  noStroke(); fill(30, 60, 120); textAlign(LEFT, TOP); textSize(13);
  text('Methods (click to highlight):', px + 6, ly);
  ly += 20;
  for (const k of methodKeys) {
    const m = methods[k];
    const on = visible[k];
    stroke(m.color[0], m.color[1], m.color[2]); strokeWeight(highlighted === k ? 3 : 1.5);
    fill(on ? color(m.color[0], m.color[1], m.color[2], 120) : color(235));
    rect(px + 6, ly, 16, 12, 2);
    noStroke(); fill(on ? color(40) : color(170)); textAlign(LEFT, CENTER); textSize(12.5);
    text(m.name, px + 28, ly + 6);
    ly += 20;
  }

  // detail / explanation box
  const by = ly + 6;
  const bh = drawHeight - by - 12;
  fill(255, 255, 255, 240); stroke(200); strokeWeight(1);
  rect(px + 2, by, pw - 2, bh, 8);
  noStroke(); fill(55); textAlign(LEFT, TOP); textSize(12);
  let body;
  if (hoverAxis >= 0) {
    fill(30, 60, 120); textSize(13); text(axes[hoverAxis].label.replace('\n', ' '), px + 12, by + 8);
    fill(55); textSize(12.5); body = axes[hoverAxis].explain;
    text(body, px + 12, by + 30, pw - 24, bh - 36);
  } else if (highlighted) {
    fill(30, 60, 120); textSize(13); text(methods[highlighted].name, px + 12, by + 8);
    fill(55); textSize(12.5);
    body = methods[highlighted].desc + (scenarioWhy ? '   ➜ ' + scenarioWhy : '');
    text(body, px + 12, by + 30, pw - 24, bh - 36);
  } else {
    text('Each colored polygon is one method scored 1–5 on every axis. A bigger polygon ' +
      'is not “better” — it is a different tradeoff. Pick a scenario above to see which ' +
      'method fits, or click a method to highlight it.', px + 12, by + 8, pw - 24, bh - 16);
  }
}

function drawControlLabel() {
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(12);
  text('Toggle methods on/off ▲', 10, drawHeight + 38);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const g = radarGeom();
  // legend hit-test
  let ly = 116;
  for (const k of methodKeys) {
    if (mouseX >= g.leftW + 8 && mouseX <= canvasWidth - margin && mouseY >= ly && mouseY <= ly + 16) {
      highlighted = (highlighted === k ? null : k);
      if (highlighted !== k) scenarioWhy = '';
      return;
    }
    ly += 20;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionSelect();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
