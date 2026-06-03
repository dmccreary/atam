// Quality Attribute Coverage Dashboard
// CANVAS_HEIGHT: 550
// Bloom L5 (Evaluate): students interpret a quality-attribute radar for a system,
// identify which attributes are well-addressed vs. at risk, and connect scores to
// the architectural decisions that produce them. Current (blue) vs. Target (orange
// dashed); gaps where target exceeds current are drawn in red. Click an axis label
// for detail; switch example systems with the dropdown.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const axesData = [
  { key: 'perf', name: 'Performance', def: 'Responsiveness under load.',
    decisions: ['Caching strategy', 'Sync vs. async connectors', 'Data access patterns'],
    tactics: 'Add caching, reduce indirection on hot paths, introduce read replicas.' },
  { key: 'avail', name: 'Availability', def: 'Uptime and fault tolerance.',
    decisions: ['Redundancy / failover', 'Health checks', 'Bulkheads & circuit breakers'],
    tactics: 'Multi-AZ redundancy, automated failover, graceful degradation.' },
  { key: 'sec', name: 'Security', def: 'Resistance to misuse and breach.',
    decisions: ['AuthN/AuthZ model', 'Encryption in transit/at rest', 'Trust boundaries'],
    tactics: 'Zero-trust boundaries, field-level encryption, audit logging.' },
  { key: 'mod', name: 'Modifiability', def: 'Ease of change.',
    decisions: ['Module boundaries', 'Dependency direction', 'Deployment units'],
    tactics: 'Strengthen layering, decouple via events, independent deployability.' },
  { key: 'inter', name: 'Interoperability', def: 'Exchanging data with others.',
    decisions: ['API contracts & versioning', 'Data formats', 'Integration style'],
    tactics: 'Versioned contract-first APIs, schema validation, adapters.' },
  { key: 'scale', name: 'Scalability', def: 'Handling growing load.',
    decisions: ['Stateless services', 'Sharding/partitioning', 'Autoscaling policy'],
    tactics: 'Make services stateless, partition data, autoscale on demand.' },
  { key: 'rel', name: 'Reliability', def: 'Correct operation over time.',
    decisions: ['Retry/idempotency', 'Data integrity controls', 'Observability'],
    tactics: 'Idempotent operations, transactional integrity, monitoring + alerts.' },
  { key: 'usab', name: 'Usability', def: 'Ease of accomplishing goals.',
    decisions: ['Response-time budget', 'Error handling', 'Progressive disclosure'],
    tactics: 'Tighten latency budget, clear error messages, simplify core flows.' }
];

const systems = {
  'E-Commerce': {
    cur: { perf: 8, avail: 9, sec: 6, mod: 5, inter: 7, scale: 8, rel: 8, usab: 7 },
    tgt: { perf: 9, avail: 9, sec: 8, mod: 7, inter: 7, scale: 9, rel: 8, usab: 7 }
  },
  'Healthcare Records': {
    cur: { perf: 6, avail: 8, sec: 7, mod: 5, inter: 6, scale: 5, rel: 8, usab: 7 },
    tgt: { perf: 7, avail: 9, sec: 10, mod: 6, inter: 8, scale: 6, rel: 9, usab: 8 }
  },
  'IoT Platform': {
    cur: { perf: 7, avail: 7, sec: 5, mod: 6, inter: 8, scale: 6, rel: 6, usab: 5 },
    tgt: { perf: 9, avail: 9, sec: 8, mod: 7, inter: 9, scale: 10, rel: 8, usab: 6 }
  }
};

let systemSelect;
let selectedAxis = -1;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  systemSelect = createSelect();
  for (const name of Object.keys(systems)) systemSelect.option(name);
  systemSelect.position(10, drawHeight + 12);
  systemSelect.style('font-size', '14px');

  describe('A radar chart with eight quality-attribute axes showing a current ' +
    'architecture (blue) versus target requirements (orange dashed). Gaps where the ' +
    'target exceeds current are highlighted in red. Click an axis for the decisions ' +
    'that drive its score.', LABEL);
}

function geom() {
  const leftW = canvasWidth * 0.58;
  const cx = leftW / 2 + 28;
  const cy = 58 + (drawHeight - 80) / 2;
  const R = Math.min(leftW / 2 - 66, (drawHeight - 110) / 2);
  return { leftW, cx, cy, R };
}

function axisPoint(g, i, value) {
  const ang = -HALF_PI + i * TWO_PI / axesData.length;
  const r = map(value, 0, 10, 0, g.R);
  return { x: g.cx + cos(ang) * r, y: g.cy + sin(ang) * r, ang };
}

function draw() {
  updateCanvasSize();
  const g = geom();
  const sys = systems[systemSelect.value()];

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(CENTER, TOP); textSize(18);
  text('Quality Attribute Coverage', g.leftW / 2, 12);

  // grid rings
  for (let ring = 2; ring <= 10; ring += 2) {
    noFill(); stroke(225); strokeWeight(1);
    beginShape();
    for (let i = 0; i < axesData.length; i++) { const p = axisPoint(g, i, ring); vertex(p.x, p.y); }
    endShape(CLOSE);
  }

  // spokes + axis labels
  for (let i = 0; i < axesData.length; i++) {
    const tip = axisPoint(g, i, 10);
    stroke(195); strokeWeight(1); line(g.cx, g.cy, tip.x, tip.y);
    const lp = axisPoint(g, i, 11.4);
    const hov = dist(mouseX, mouseY, tip.x, tip.y) < 26 && mouseY < drawHeight;
    noStroke(); fill(i === selectedAxis ? color(200, 140, 0) : (hov ? color(30, 60, 160) : color(70)));
    textAlign(CENTER, CENTER); textSize(10.5);
    text(axesData[i].name, lp.x, lp.y);
  }

  // gap segments (red) where target > current
  for (let i = 0; i < axesData.length; i++) {
    const k = axesData[i].key;
    if (sys.tgt[k] > sys.cur[k]) {
      const pc = axisPoint(g, i, sys.cur[k]);
      const pt = axisPoint(g, i, sys.tgt[k]);
      stroke(220, 40, 40); strokeWeight(4);
      line(pc.x, pc.y, pt.x, pt.y);
    }
  }

  // target polygon (orange dashed)
  noFill(); stroke(239, 108, 0); strokeWeight(1.6);
  drawingContext.setLineDash([6, 5]);
  beginShape();
  for (let i = 0; i < axesData.length; i++) { const p = axisPoint(g, i, sys.tgt[axesData[i].key]); vertex(p.x, p.y); }
  endShape(CLOSE);
  drawingContext.setLineDash([]);

  // current polygon (blue)
  fill(33, 150, 243, 60); stroke(33, 150, 243); strokeWeight(2.2);
  beginShape();
  for (let i = 0; i < axesData.length; i++) { const p = axisPoint(g, i, sys.cur[axesData[i].key]); vertex(p.x, p.y); }
  endShape(CLOSE);
  // current vertices
  noStroke(); fill(33, 150, 243);
  for (let i = 0; i < axesData.length; i++) { const p = axisPoint(g, i, sys.cur[axesData[i].key]); circle(p.x, p.y, 6); }

  drawPanel(g, sys);
  drawControlHint();
}

function drawPanel(g, sys) {
  const px = g.leftW + 8;
  const pw = canvasWidth - px - margin;
  if (pw < 110) return;

  // legend
  let y = 56;
  noStroke();
  fill(33, 150, 243); rect(px + 6, y, 18, 10, 2);
  fill(50); textAlign(LEFT, CENTER); textSize(12); text('Current architecture', px + 30, y + 5);
  y += 18;
  stroke(239, 108, 0); strokeWeight(2); drawingContext.setLineDash([5, 4]);
  line(px + 6, y + 5, px + 24, y + 5); drawingContext.setLineDash([]);
  noStroke(); fill(50); text('Target requirements', px + 30, y + 5);
  y += 18;
  stroke(220, 40, 40); strokeWeight(4); line(px + 6, y + 5, px + 24, y + 5);
  noStroke(); fill(50); text('Gap (target > current)', px + 30, y + 5);

  // detail box
  const by = y + 22;
  const bh = drawHeight - by - 12;
  fill(255, 255, 255, 240); stroke(200); strokeWeight(1);
  rect(px + 2, by, pw - 2, bh, 8); noStroke();

  if (selectedAxis >= 0) {
    const a = axesData[selectedAxis], k = a.key;
    fill(30, 60, 120); textAlign(LEFT, TOP); textSize(14);
    text(a.name, px + 12, by + 8);
    fill(55); textSize(12);
    const gap = sys.tgt[k] - sys.cur[k];
    const body = a.def + '\n\nCurrent: ' + sys.cur[k] + '/10   Target: ' + sys.tgt[k] + '/10' +
      (gap > 0 ? '   (gap of ' + gap + ' — a risk to close)' : '   (meets target)') +
      '\n\nKey architectural decisions:\n• ' + a.decisions.join('\n• ') +
      '\n\nImprovement tactics: ' + a.tactics;
    text(body, px + 12, by + 28, pw - 24, bh - 34);
  } else {
    fill(30, 60, 120); textAlign(LEFT, TOP); textSize(14);
    text('Assess the profile', px + 12, by + 8);
    fill(60); textSize(12);
    text('Blue is what the architecture delivers today; orange-dashed is what the ' +
      'requirements demand. Red spokes are gaps — the biggest risks. Click an axis ' +
      'label to see which architectural decisions drive that attribute and how to ' +
      'close the gap. Switch systems with the dropdown to compare profiles.',
      px + 12, by + 28, pw - 24, bh - 36);
  }
}

function drawControlHint() {
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(12);
  text('◀ choose an example system; click an axis label for details', 150, drawHeight + 25, canvasWidth - 155);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const g = geom();
  for (let i = 0; i < axesData.length; i++) {
    const tip = axisPoint(g, i, 11.4);
    if (dist(mouseX, mouseY, tip.x, tip.y) < 30) { selectedAxis = (selectedAxis === i ? -1 : i); return; }
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
