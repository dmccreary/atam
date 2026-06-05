// Communication Style Explorer
// CANVAS_HEIGHT: 552
// Bloom L5 (Evaluate): students ASSESS which communication style (REST, gRPC, GraphQL,
// WebSocket) best fits a set of quality attribute priorities. Five sliders set a requirement
// polygon over a radar of the four styles; a recommendation panel names the best fit and the
// unmet gaps, forcing students to externalize priorities before seeing a recommendation.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 52;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;

const axes = ['Perf', 'Interop', 'Real-Time', 'Schema', 'Simplicity'];
const axesFull = ['Performance', 'Interoperability', 'Real-Time', 'Schema Enforcement', 'Operational Simplicity'];
const styles = [
  { name: 'REST',      color: [212, 160, 23], scores: [3, 5, 1, 2, 5] },
  { name: 'gRPC',      color: [33, 118, 210], scores: [5, 2, 4, 5, 3] },
  { name: 'GraphQL',   color: [46, 125, 50], scores: [3, 4, 2, 4, 2] },
  { name: 'WebSocket', color: [239, 124, 0], scores: [4, 2, 5, 1, 2] }
];
const scenarios = [
  { name: 'Public e-commerce API', req: [3, 5, 1, 2, 5] },
  { name: 'Financial microservices', req: [5, 2, 1, 5, 3] },
  { name: 'Live collaborative editor', req: [4, 2, 5, 1, 2] }
];

let sliders = [];
let explain = false;
let scenBtns = [], explainBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  const main = document.querySelector('main');

  for (let i = 0; i < 5; i++) {
    const s = createSlider(1, 5, 3, 1); s.parent(main); s.style('width', '150px');
    sliders.push(s);
  }
  for (let i = 0; i < scenarios.length; i++) {
    const b = createButton('Scenario ' + (i + 1)); b.parent(main);
    b.mousePressed(() => loadScenario(i)); scenBtns.push(b);
  }
  explainBtn = createButton('Explain Choice'); explainBtn.parent(main);
  explainBtn.mousePressed(() => { explain = !explain; explainBtn.html(explain ? 'Hide Explanation' : 'Explain Choice'); });
  layout();
  describe('A radar chart comparing four communication styles (REST, gRPC, GraphQL, WebSocket) ' +
    'across five dimensions, with a student-controlled requirement polygon set by five sliders ' +
    'and a recommendation panel naming the best-fit style and unmet requirement gaps.', LABEL);
}

function leftW() { return 196; }
function rightW() { return Math.max(170, canvasWidth * 0.24); }

function layout() {
  for (let i = 0; i < 5; i++) sliders[i].position(margin, 86 + i * 78);
  const y = drawHeight + 12;
  for (let i = 0; i < scenBtns.length; i++) scenBtns[i].position(10 + i * 108, y);
  explainBtn.position(10 + scenBtns.length * 108 + 12, y);
}

function reqVals() { return sliders.map(s => s.value()); }

function loadScenario(i) {
  for (let k = 0; k < 5; k++) sliders[k].value(scenarios[i].req[k]);
}

function bestFit() {
  const req = reqVals();
  let best = 0, bestUnmet = Infinity, bestDist = Infinity;
  for (let s = 0; s < styles.length; s++) {
    let unmet = 0, dists = 0;
    for (let i = 0; i < 5; i++) {
      unmet += Math.max(0, req[i] - styles[s].scores[i]);
      dists += Math.abs(req[i] - styles[s].scores[i]);
    }
    if (unmet < bestUnmet || (unmet === bestUnmet && dists < bestDist)) { best = s; bestUnmet = unmet; bestDist = dists; }
  }
  return best;
}

function draw() {
  updateCanvasSize();
  layout();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(LEFT, TOP); textSize(18);
  text('Communication Style Explorer', margin, 10);
  fill(90); textSize(11);
  text('Set your quality priorities; the radar shows which style best covers them.', margin, 34);

  drawSliderLabels();
  drawRadar();
  drawRecommendation();
  drawControlHint();
}

function drawSliderLabels() {
  const names = ['Performance Priority', 'Interoperability Priority', 'Real-Time Requirement', 'Schema Enforcement', 'Simplicity Priority'];
  const req = reqVals();
  for (let i = 0; i < 5; i++) {
    const y = 66 + i * 78;
    noStroke(); fill(40); textAlign(LEFT, TOP); textSize(11.5); textStyle(BOLD);
    text(names[i], margin, y); textStyle(NORMAL);
    fill(33, 118, 210); textAlign(LEFT, TOP); textSize(12);
    text(req[i] + ' / 5', margin + 158, y + 22);
  }
}

function radarGeom() {
  const lx = leftW() + 6, rx = canvasWidth - rightW() - 8;
  const top = 64, bot = drawHeight - 14;
  const cx = (lx + rx) / 2, cy = (top + bot) / 2;
  const R = Math.min((rx - lx) / 2, (bot - top) / 2) - 30;
  return { cx, cy, R };
}

function axisAngle(i) { return -HALF_PI + i * TWO_PI / 5; }

function drawRadar() {
  const g = radarGeom();
  // grid rings
  stroke(220); strokeWeight(1); noFill();
  for (let r = 1; r <= 5; r++) {
    beginShape();
    for (let i = 0; i < 5; i++) {
      const a = axisAngle(i), rr = g.R * r / 5;
      vertex(g.cx + rr * cos(a), g.cy + rr * sin(a));
    }
    endShape(CLOSE);
  }
  // spokes + labels
  for (let i = 0; i < 5; i++) {
    const a = axisAngle(i);
    stroke(210); line(g.cx, g.cy, g.cx + g.R * cos(a), g.cy + g.R * sin(a));
    const lx = g.cx + (g.R + 12) * cos(a), ly = g.cy + (g.R + 12) * sin(a);
    noStroke(); fill(70); textSize(10.5); textStyle(BOLD);
    const c = cos(a);
    textAlign(c > 0.3 ? LEFT : (c < -0.3 ? RIGHT : CENTER), CENTER);
    text(axes[i], lx, ly); textStyle(NORMAL);
  }
  // style polygons
  const best = bestFit();
  for (let s = 0; s < styles.length; s++) {
    const st = styles[s], isBest = s === best;
    stroke(st.color[0], st.color[1], st.color[2], isBest ? 255 : 110);
    strokeWeight(isBest ? 3 : 1.5);
    fill(st.color[0], st.color[1], st.color[2], isBest ? 40 : 14);
    polygon(g, st.scores);
  }
  // requirement polygon (red dashed)
  stroke(211, 47, 47); strokeWeight(2.5); noFill();
  drawingContext.setLineDash([6, 4]);
  polygon(g, reqVals());
  drawingContext.setLineDash([]);
  for (let i = 0; i < 5; i++) {
    const a = axisAngle(i), rr = g.R * reqVals()[i] / 5;
    noStroke(); fill(211, 47, 47); circle(g.cx + rr * cos(a), g.cy + rr * sin(a), 6);
  }
}

function polygon(g, vals) {
  beginShape();
  for (let i = 0; i < 5; i++) {
    const a = axisAngle(i), rr = g.R * vals[i] / 5;
    vertex(g.cx + rr * cos(a), g.cy + rr * sin(a));
  }
  endShape(CLOSE);
}

function drawRecommendation() {
  const x = canvasWidth - rightW() + 2, w = rightW() - margin - 2, y0 = 64;
  fill(255); stroke(200); strokeWeight(1); rect(x, y0, w, drawHeight - y0 - 14, 8); noStroke();
  // legend
  let y = y0 + 8;
  fill(40); textAlign(LEFT, TOP); textSize(11.5); textStyle(BOLD); text('Styles', x + 8, y); textStyle(NORMAL);
  y += 18;
  for (const st of styles) {
    fill(st.color[0], st.color[1], st.color[2]); rect(x + 8, y, 14, 10, 2);
    fill(60); textAlign(LEFT, CENTER); textSize(10.5); text(st.name, x + 28, y + 5);
    y += 17;
  }
  fill(211, 47, 47); textAlign(LEFT, CENTER); textSize(10.5);
  text('— — your requirement', x + 8, y + 5); y += 22;

  const best = bestFit(); const st = styles[best]; const req = reqVals();
  fill(46, 125, 50); textAlign(LEFT, TOP); textSize(12.5); textStyle(BOLD);
  text('Best fit', x + 8, y); textStyle(NORMAL);
  fill(st.color[0], st.color[1], st.color[2]); textSize(18); textStyle(BOLD);
  text(st.name, x + 8, y + 16); textStyle(NORMAL);
  y += 44;

  // gaps
  fill(180, 40, 40); textSize(11.5); textStyle(BOLD); text('Unmet gaps', x + 8, y); textStyle(NORMAL);
  y += 16; fill(90); textSize(10.5); textAlign(LEFT, TOP);
  let any = false;
  for (let i = 0; i < 5; i++) if (req[i] > st.scores[i]) {
    text('• ' + axes[i] + ': need ' + req[i] + ', has ' + st.scores[i], x + 8, y, w - 14); y += 15; any = true;
  }
  if (!any) { fill(46, 125, 50); text('• none — fully covers your priorities', x + 8, y, w - 14); y += 15; }

  if (explain) {
    y += 6; fill(40); textSize(10.8);
    text(explainText(best), x + 8, y, w - 14, drawHeight - y - 18);
  }
}

function explainText(s) {
  const st = styles[s];
  const idx = [0, 1, 2, 3, 4].sort((a, b) => st.scores[b] - st.scores[a]);
  const strong = axesFull[idx[0]] + ' and ' + axesFull[idx[1]];
  const weak = axesFull[idx[3]] + ' and ' + axesFull[idx[4]];
  return st.name + ' is strongest on ' + strong + ', and accepts tradeoffs on ' + weak +
    '. It is recommended because it leaves the fewest of your high-priority requirements unmet.';
}

function drawControlHint() {
  if (canvasWidth < 600) return;
  noStroke(); fill(90); textAlign(LEFT, CENTER); textSize(10.5);
  text('Load a scenario, then read the best-fit recommendation and any unmet gaps.',
    10 + scenBtns.length * 108 + 130, drawHeight + controlHeight / 2, canvasWidth - (10 + scenBtns.length * 108 + 140));
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  layout();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
