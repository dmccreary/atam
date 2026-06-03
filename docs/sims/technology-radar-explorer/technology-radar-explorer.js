// Interactive Technology Radar
// CANVAS_HEIGHT: 540
// Bloom L4 (Analyze): students classify a technology into the correct radar ring
// based on maturity and adoption posture, and explain the architectural-risk
// implications of relying on Hold-ring technologies. Click any dot for details.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 490;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 15;
let defaultTextSize = 16;

// rings: index 0 = innermost (Adopt) .. 3 = outermost (Hold)
const rings = [
  { name: 'Adopt', color: [76, 175, 80],  meaning: 'Proven; use by default. Low architectural risk.' },
  { name: 'Trial', color: [33, 150, 243], meaning: 'Worth pursuing on real projects that can absorb risk.' },
  { name: 'Assess', color: [251, 192, 45], meaning: 'Promising; explore with experiments before committing.' },
  { name: 'Hold', color: [229, 57, 53],   meaning: 'Proceed with caution; avoid new dependencies on these.' }
];
const ringFrac = [0.30, 0.55, 0.78, 1.0]; // outer radius of each ring as fraction of R

// quadrants: direction unit vectors (screen coords, y down)
const quads = {
  lf:    { name: 'Languages & Frameworks', dir: [0.707, -0.707] }, // upper right
  tools: { name: 'Tools',                  dir: [0.707,  0.707] }, // lower right
  plat:  { name: 'Platforms',              dir: [-0.707, -0.707] }, // upper left
  tech:  { name: 'Techniques',             dir: [-0.707,  0.707] }  // lower left
};

const techs = [
  // Adopt (ring 0)
  { name: 'TypeScript', ring: 0, quad: 'lf', detail: 'Adopt: typed JavaScript with broad tooling and team familiarity. Architectural implication: type safety reduces interface defects across module boundaries. ATAM: low risk — a safe default for modifiability.' },
  { name: 'Terraform', ring: 0, quad: 'tools', detail: 'Adopt: declarative infrastructure-as-code. Implication: reproducible environments support deployability and disaster recovery. ATAM: low risk; strengthens an availability story.' },
  { name: 'Kubernetes', ring: 0, quad: 'plat', detail: 'Adopt: mature container orchestration. Implication: standard substrate for horizontal scaling and self-healing. ATAM: low risk, but operational complexity is a sensitivity point.' },
  { name: 'REST / HTTP APIs', ring: 0, quad: 'tech', detail: 'Adopt: ubiquitous synchronous integration style. Implication: simple and interoperable, but synchronous coupling affects availability. ATAM: low risk; a well-understood tradeoff.' },
  // Trial (ring 1)
  { name: 'WebAssembly', ring: 1, quad: 'lf', detail: 'Trial: near-native performance in the browser and beyond. Implication: enables compute-heavy clients and portable plugins. ATAM: moderate risk; tooling and debugging still maturing.' },
  { name: 'OpenTelemetry', ring: 1, quad: 'tools', detail: 'Trial: vendor-neutral observability signals. Implication: consistent tracing/metrics improves the observability quality attribute. ATAM: moderate risk; spec still evolving in places.' },
  { name: 'eBPF', ring: 1, quad: 'plat', detail: 'Trial: programmable kernel-level observability and networking. Implication: deep runtime insight without app changes. ATAM: moderate risk; requires specialized expertise (a sensitivity point).' },
  { name: 'Architecture Fitness Functions', ring: 1, quad: 'tech', detail: 'Trial: automated checks that guard quality attributes. Implication: makes architectural constraints continuously verifiable. ATAM: directly operationalizes ATAM findings as executable guards.' },
  // Assess (ring 2)
  { name: 'Rust for backend', ring: 2, quad: 'lf', detail: 'Assess: memory-safe systems language. Implication: strong performance and safety, steeper learning curve. ATAM: assess — a hiring/skills risk that can become a sensitivity point.' },
  { name: 'AI-assisted code review', ring: 2, quad: 'tools', detail: 'Assess: LLM tooling that flags defects and style issues. Implication: can raise quality throughput but needs human oversight. ATAM: assess; false confidence is a risk to manage.' },
  { name: 'WASM-based edge compute', ring: 2, quad: 'plat', detail: 'Assess: run sandboxed code at CDN edge nodes. Implication: very low latency for global users. ATAM: assess — strong performance upside, immature operational model.' },
  { name: 'GraphRAG', ring: 2, quad: 'tech', detail: 'Assess: retrieval-augmented generation over knowledge graphs. Implication: richer grounding for AI features. ATAM: assess; data-pipeline complexity is a risk.' },
  // Hold (ring 3)
  { name: 'Monolithic J2EE', ring: 3, quad: 'lf', detail: 'Hold: heavyweight legacy application stack. Implication: poor modifiability and slow deployability. ATAM: HIGH RISK — new dependencies here entrench technical debt and constrain evolution.' },
  { name: 'Manual deployment scripts', ring: 3, quad: 'tools', detail: 'Hold: hand-run, undocumented deploy steps. Implication: irreproducible, error-prone releases. ATAM: HIGH RISK — a direct threat to availability and recoverability.' },
  { name: 'Bare-metal on-prem', ring: 3, quad: 'plat', detail: 'Hold: fixed-capacity self-managed servers. Implication: weak elasticity and high ops burden. ATAM: HIGH RISK for scalability scenarios; capacity is a hard ceiling.' },
  { name: 'SOAP / XML Web Services', ring: 3, quad: 'tech', detail: 'Hold: verbose legacy integration style. Implication: heavy contracts, poor developer ergonomics. ATAM: HIGH RISK — new integrations should not depend on it.' }
];

let toggleButtons = {};
let quadVisible = { lf: true, tools: true, plat: true, tech: true };
let selectedTech = null;
let hoverRing = -1;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  let bx = 10;
  for (const key of ['lf', 'tools', 'plat', 'tech']) {
    const b = createButton(quads[key].name);
    b.position(bx, drawHeight + 12);
    b.mousePressed(() => {
      quadVisible[key] = !quadVisible[key];
      b.style('opacity', quadVisible[key] ? '1' : '0.45');
    });
    toggleButtons[key] = b;
    bx += quads[key].name.length * 7 + 24;
  }

  describe('A technology radar with four concentric rings (Adopt, Trial, Assess, Hold) ' +
    'and four quadrants. Each dot is a technology; clicking it explains its ring ' +
    'rationale and architectural-risk implications.', LABEL);
}

function radarGeom() {
  const leftW = canvasWidth * 0.6;
  const cx = leftW / 2;
  const cy = 60 + (drawHeight - 90) / 2;
  const R = Math.min(leftW / 2 - 18, (drawHeight - 110) / 2);
  return { leftW, cx, cy, R };
}

function dotPos(t, g) {
  const innerFrac = t.ring === 0 ? 0 : ringFrac[t.ring - 1];
  const midFrac = (innerFrac + ringFrac[t.ring]) / 2;
  const rr = midFrac * g.R;
  const d = quads[t.quad].dir;
  return { x: g.cx + d[0] * rr, y: g.cy + d[1] * rr };
}

function draw() {
  updateCanvasSize();
  const g = radarGeom();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(CENTER, TOP); textSize(20);
  text('Technology Radar', g.leftW / 2, 12);

  // rings from outer to inner so inner rings paint on top
  hoverRing = -1;
  for (let i = rings.length - 1; i >= 0; i--) {
    const ro = ringFrac[i] * g.R;
    noStroke();
    fill(rings[i].color[0], rings[i].color[1], rings[i].color[2], 38);
    circle(g.cx, g.cy, ro * 2);
  }
  // ring outlines + labels
  for (let i = 0; i < rings.length; i++) {
    const ro = ringFrac[i] * g.R;
    noFill(); stroke(rings[i].color[0], rings[i].color[1], rings[i].color[2]); strokeWeight(1.5);
    circle(g.cx, g.cy, ro * 2);
    // ring label along the top vertical
    const innerFrac = i === 0 ? 0 : ringFrac[i - 1];
    const labelR = ((innerFrac + ringFrac[i]) / 2) * g.R;
    noStroke(); fill(rings[i].color[0] * 0.6, rings[i].color[1] * 0.6, rings[i].color[2] * 0.6);
    textAlign(CENTER, CENTER); textSize(11);
    text(rings[i].name, g.cx, g.cy - labelR);
    // hover detection on the top label zone
    if (dist(mouseX, mouseY, g.cx, g.cy - labelR) < 18) hoverRing = i;
  }

  // quadrant divider lines
  stroke(150); strokeWeight(1);
  line(g.cx - g.R, g.cy, g.cx + g.R, g.cy);
  line(g.cx, g.cy - g.R, g.cx, g.cy + g.R);

  // quadrant labels at the corners
  noStroke(); fill(90); textSize(11);
  textAlign(RIGHT, BOTTOM); text(quads.lf.name, g.cx + g.R, g.cy - g.R - 2);
  textAlign(RIGHT, TOP); text(quads.tools.name, g.cx + g.R, g.cy + g.R + 2);
  textAlign(LEFT, BOTTOM); text(quads.plat.name, g.cx - g.R, g.cy - g.R - 2);
  textAlign(LEFT, TOP); text(quads.tech.name, g.cx - g.R, g.cy + g.R + 2);

  // tech dots
  for (const t of techs) {
    if (!quadVisible[t.quad]) continue;
    const p = dotPos(t, g);
    const rc = rings[t.ring].color;
    const isSel = selectedTech === t;
    stroke(isSel ? color(20, 40, 120) : color(60));
    strokeWeight(isSel ? 3 : 1.5);
    fill(rc[0], rc[1], rc[2]);
    circle(p.x, p.y, isSel ? 16 : 12);
    if (isSel) {
      noStroke(); fill(20, 40, 120); textAlign(CENTER, BOTTOM); textSize(11);
      text(t.name, p.x, p.y - 10);
    }
  }

  drawDetailPanel(g);
}

function drawDetailPanel(g) {
  const px = g.leftW + 8;
  const pw = canvasWidth - px - margin;
  if (pw < 90) return;
  const py = 50;
  const ph = drawHeight - py - 16;
  fill(255, 255, 255, 240); stroke(200); strokeWeight(1);
  rect(px, py, pw, ph, 10);
  noStroke();

  if (hoverRing >= 0) {
    fill(rings[hoverRing].color[0], rings[hoverRing].color[1], rings[hoverRing].color[2]);
    textAlign(LEFT, TOP); textSize(15);
    text(rings[hoverRing].name + ' ring', px + 12, py + 10);
    fill(60); textSize(13);
    text(rings[hoverRing].meaning, px + 12, py + 34, pw - 24, ph - 44);
    return;
  }

  if (selectedTech) {
    fill(30, 60, 120); textAlign(LEFT, TOP); textSize(15);
    text(selectedTech.name, px + 12, py + 10, pw - 24);
    fill(rings[selectedTech.ring].color[0] * 0.7, rings[selectedTech.ring].color[1] * 0.7, rings[selectedTech.ring].color[2] * 0.7);
    textSize(12);
    text(rings[selectedTech.ring].name + ' · ' + quads[selectedTech.quad].name, px + 12, py + 34);
    fill(55); textSize(12.5);
    text(selectedTech.detail, px + 12, py + 56, pw - 24, ph - 64);
  } else {
    fill(30, 60, 120); textAlign(LEFT, TOP); textSize(15);
    text('How to read this radar', px + 12, py + 10);
    fill(60); textSize(12.5);
    text('Rings (center → edge): Adopt, Trial, Assess, Hold show how ready a technology ' +
      'is for production use. Quadrants group by kind. Click any dot to see its rationale ' +
      'and the architectural risk it carries. Hover a ring name for its meaning. Use the ' +
      'buttons below to show or hide quadrants.', px + 12, py + 34, pw - 24, ph - 44);
  }
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const g = radarGeom();
  selectedTech = null;
  for (const t of techs) {
    if (!quadVisible[t.quad]) continue;
    const p = dotPos(t, g);
    if (dist(mouseX, mouseY, p.x, p.y) < 11) selectedTech = t;
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
