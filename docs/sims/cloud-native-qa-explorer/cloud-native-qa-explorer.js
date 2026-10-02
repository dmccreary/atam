// Cloud-Native Architecture Quality Attribute Stack
// CANVAS_HEIGHT: 540
// Bloom L4 (Analyze): students EXAMINE each layer of the cloud-native stack to find the
// quality attributes it supports and the ones it puts at risk, then pick one quality
// attribute and trace it across the layers. Static, clickable layer diagram: analysis
// needs the structure to hold still while the learner compares layers.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 490;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const GREEN = [46, 125, 50];
const RED = [198, 40, 40];

// Listed bottom (1) to top (5). `qa` is the attribute name used by the highlight menu;
// `label` is what the badge says; `how` is the mechanism or the reason for the risk.
const LAYERS = [
  { n: 1, name: 'IaaS / Managed Services', short: 'IaaS', color: [144, 164, 174],
    role: 'Compute, storage, and networking from the cloud provider',
    supports: [
      { qa: 'Availability', label: 'Availability', how: 'Redundant hardware across availability zones; the provider replaces a failed host.' },
      { qa: 'Scalability', label: 'Scalability', how: 'Elastic provisioning: capacity is added or removed on demand through an API.' },
      { qa: 'Cost', label: 'Cost efficiency', how: 'Pay-as-you-go: no capital is tied up in idle peak capacity.' }],
    threatens: [
      { qa: 'Portability', label: 'Portability (lock-in)', how: 'Proprietary managed services are costly to migrate away from.' },
      { qa: 'Cost', label: 'Cost predictability', how: 'Usage-based billing follows load, so a spike or a misconfiguration becomes a surprise bill.' }],
    atam: 'ATAM lens: which provider-specific services does the design depend on, and have stakeholders explicitly accepted that lock-in?' },
  { n: 2, name: 'Containers / Docker', short: 'Containers', color: [100, 181, 246],
    role: 'Packaging and isolation layer',
    supports: [
      { qa: 'Portability', label: 'Portability', how: 'The same image runs on a laptop, in the CI pipeline, and in production.' },
      { qa: 'Testability', label: 'Testability', how: 'Deterministic builds give identical environments, which removes "works on my machine" defects.' },
      { qa: 'Deployability', label: 'Deployability', how: 'Immutable images are replaced, not patched, which makes releases and rollbacks repeatable.' }],
    threatens: [
      { qa: 'Security', label: 'Security', how: 'Containers share the host kernel, so isolation is weaker than between virtual machines.' },
      { qa: 'Simplicity', label: 'Simplicity', how: 'Images, registries, base-image patching, and vulnerability scans must all be managed.' }],
    atam: 'ATAM lens: shared-kernel isolation is a sensitivity point for security scenarios on hosts that run workloads of different trust levels.' },
  { n: 3, name: 'Kubernetes Orchestration', short: 'Kubernetes', color: [77, 182, 172],
    role: 'Auto-healing, scaling, and service discovery',
    supports: [
      { qa: 'Availability', label: 'Availability', how: 'Auto-healing: a control loop replaces failed Pods, and readiness probes keep traffic off unhealthy ones.' },
      { qa: 'Scalability', label: 'Scalability', how: 'The HorizontalPodAutoscaler adds or removes replicas as observed load changes.' },
      { qa: 'Deployability', label: 'Deployability', how: 'Rolling updates replace Pods gradually; blue-green and canary releases build on the same primitives.' }],
    threatens: [
      { qa: 'Simplicity', label: 'Simplicity', how: 'Steep learning curve; a misconfigured probe or resource limit can cause an outage.' },
      { qa: 'Performance', label: 'Performance', how: 'Service proxying and overlay networking add network hops to every call.' }],
    atam: 'ATAM sensitivity point: liveness and readiness probe configuration. Wrong probes kill healthy Pods or send traffic to unhealthy ones.' },
  { n: 4, name: 'Infrastructure as Code / GitOps', short: 'IaC / GitOps', color: [174, 213, 129],
    role: 'Declarative, version-controlled infrastructure',
    supports: [
      { qa: 'Deployability', label: 'Deployability', how: 'Environments are reproducible from code, and a rollback is a revert.' },
      { qa: 'Reliability', label: 'Reliability', how: 'No configuration drift: a controller reconciles what is running with what is in Git.' },
      { qa: 'Auditability', label: 'Auditability', how: 'Every infrastructure change is a reviewed commit with an author and a timestamp.' }],
    threatens: [
      { qa: 'Simplicity', label: 'Simplicity', how: 'Teams must learn declarative tooling and manage state, modules, and pipelines.' },
      { qa: 'Change velocity', label: 'Change velocity', how: 'Even an urgent fix goes through review and the pipeline instead of a quick manual change.' }],
    atam: 'ATAM lens: reviewed, reproducible infrastructure is a non-risk for deployability scenarios; the review path is a tradeoff against emergency change speed.' },
  { n: 5, name: 'Application / Service Mesh', short: 'App / mesh', color: [255, 213, 79],
    role: 'Business logic and cross-cutting concerns',
    supports: [
      { qa: 'Modifiability', label: 'Modifiability', how: 'Cross-cutting concerns live in sidecars, so services change without touching security or telemetry code.' },
      { qa: 'Security', label: 'Security', how: 'The mesh encrypts and authenticates service-to-service calls with mutual TLS.' },
      { qa: 'Observability', label: 'Observability', how: 'Sidecars emit uniform metrics, logs, and traces for every call.' }],
    threatens: [
      { qa: 'Performance', label: 'Performance', how: 'Each call passes through two sidecar proxies, adding latency and resource use.' },
      { qa: 'Simplicity', label: 'Simplicity', how: 'The mesh is one more control plane to run, upgrade, and debug.' }],
    atam: 'ATAM tradeoff point: mutual TLS and telemetry are bought with per-hop latency. Check the mesh against the p99 latency scenario.' }
];

const QA_LIST = ['Availability', 'Scalability', 'Deployability', 'Security', 'Performance', 'Simplicity',
  'Portability', 'Cost', 'Testability', 'Reliability', 'Auditability', 'Modifiability', 'Observability', 'Change velocity'];

const QA_INSIGHT = {
  'Availability': 'Availability is layered: the provider supplies redundant hardware and Kubernetes supplies automatic recovery. Neither is enough alone.',
  'Scalability': 'Two mechanisms at two levels: IaaS scales the pool of machines, Kubernetes scales the replicas on them. Each autoscaler needs headroom from the other.',
  'Deployability': 'Three layers cooperate: an immutable image, an orchestrator that swaps Pods gradually, and infrastructure defined in code.',
  'Security': 'A tradeoff inside the stack: the mesh adds encryption and identity at the top, while shared-kernel isolation stays a weak point below it.',
  'Performance': 'No layer makes a single request faster. Orchestration and the mesh each add network hops, so check them against latency scenarios.',
  'Simplicity': 'Threatened at four of five layers. Operational complexity is the price of the attributes the stack supports.',
  'Portability': 'Containers make the workload portable, while proprietary managed services underneath tie it to one provider.',
  'Cost': 'One layer both helps and hurts: pay-as-you-go removes idle capacity but makes the bill depend on load.'
};

let qaSelect;
let selectedLayer = 0;       // layer number 1-5, 0 = none
let bandRects = [], badgeRects = [];
let stackX, stackW, bandH, panelX, panelW, wide;
const stackTop = 40, bandGap = 5;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const main = document.querySelector('main');
  canvas.parent(main);
  textSize(defaultTextSize);

  qaSelect = createSelect(); qaSelect.parent(main);
  qaSelect.option('(none)');
  for (const q of QA_LIST) qaSelect.option(q);

  layout();
  describe('A layer diagram of the cloud-native stack with five bands from bottom to top: IaaS and ' +
    'managed services, containers, Kubernetes orchestration, infrastructure as code and GitOps, and ' +
    'the application with its service mesh. Each band lists the quality attributes it supports in ' +
    'green badges and the ones it threatens in red badges. Clicking a band opens its full analysis; ' +
    'a menu highlights one quality attribute across all layers.', LABEL);
}

function layout() {
  wide = canvasWidth >= 660;        // side-by-side fits the usual chapter column (about 690px)
  stackX = margin;
  stackW = wide ? Math.floor((canvasWidth - margin * 2) * 0.56) : canvasWidth - margin * 2;
  bandH = Math.floor((drawHeight - stackTop - 8 - bandGap * 4) / 5);
  panelX = wide ? stackX + stackW + 10 : margin;
  panelW = wide ? canvasWidth - margin - panelX : canvasWidth - margin * 2;
  const labelW = canvasWidth < 520 ? 72 : 210;
  qaSelect.position(10 + labelW, drawHeight + 13);
  qaSelect.size(Math.min(190, canvasWidth - labelW - 24));
}

function highlightedQA() {
  const v = qaSelect.value();
  return v === '(none)' ? null : v;
}

function layerInvolves(layer, qa) {
  return layer.supports.some(b => b.qa === qa) || layer.threatens.some(b => b.qa === qa);
}

// ---------- drawing ----------
function draw() {
  updateCanvasSize();
  background(255);
  noStroke(); fill(240, 248, 255); rect(0, 0, canvasWidth, drawHeight);
  fill(255); rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(192); strokeWeight(1); noFill();
  rect(0.5, 0.5, canvasWidth - 1, drawHeight - 0.5);
  rect(0.5, drawHeight, canvasWidth - 1, controlHeight - 0.5);
  noStroke();

  const qa = highlightedQA();
  noStroke(); fill(25, 45, 90); textAlign(LEFT, TOP); textStyle(BOLD); textSize(canvasWidth < 560 ? 14.5 : 18);
  text(canvasWidth < 560 ? 'Cloud-Native Quality Attribute Stack' : 'Cloud-Native Stack: Quality Attributes by Layer', margin, 10);
  textStyle(NORMAL);

  const overlay = !wide && selectedLayer > 0;     // narrow screens: detail covers the stack
  bandRects = []; badgeRects = [];
  if (!overlay) {
    for (let i = 0; i < 5; i++) {
      const layer = LAYERS[4 - i];                 // top band is layer 5
      drawBand(layer, stackX, stackTop + i * (bandH + bandGap), stackW, bandH, qa);
    }
  }
  if (wide || overlay) drawPanel(qa, overlay);
  if (!overlay) drawTooltip();

  // control label
  noStroke(); fill(40); textAlign(LEFT, CENTER); textSize(13);
  text(canvasWidth < 520 ? 'Highlight:' : 'Highlight a quality attribute:', 12, drawHeight + controlHeight / 2);
  if (canvasWidth >= 640) {
    fill(100); textSize(12);
    text(fitText(canvasWidth < 780 ? 'Click a layer; hover over a badge.' : 'Click a layer for its analysis; hover over a badge for the mechanism.', canvasWidth - 432), 420, drawHeight + controlHeight / 2);
  }

  let over = overlay && mouseY < drawHeight;
  for (const r of bandRects) if (inRect(r)) over = true;
  cursor(over ? HAND : ARROW);
}

function drawBand(layer, x, y, w, h, qa) {
  const involved = !qa || layerInvolves(layer, qa);
  const alpha = involved ? 255 : 70;
  const sel = selectedLayer === layer.n;
  const c = layer.color;
  bandRects.push({ n: layer.n, x: x, y: y, w: w, h: h });
  // body
  fill(255, 255, 255, alpha);
  stroke(sel ? color(25, 45, 90) : color(c[0] * 0.75, c[1] * 0.75, c[2] * 0.75, alpha));
  strokeWeight(sel ? 2.5 : 1.2);
  rect(x, y, w, h, 7); noStroke();
  // colored tab with the layer number
  fill(c[0], c[1], c[2], alpha); rect(x + 1.5, y + 1.5, 34, h - 3, 6, 0, 0, 6);
  fill(30, 30, 30, alpha); textAlign(CENTER, CENTER); textStyle(BOLD); textSize(18);
  text(layer.n, x + 18.5, y + h / 2);
  // name and role
  const tx = x + 44, tw = w - 52;
  textAlign(LEFT, TOP); textSize(13.5); fill(25, 45, 90, alpha);
  text(fitText(layer.name, tw), tx, y + 6);
  textStyle(NORMAL); textSize(11.5); fill(80, 80, 80, alpha);
  text(fitText(layer.role, tw), tx, y + 23);
  // badges, flowing onto a second row when needed
  let bx = tx, by = y + 41;
  const all = layer.supports.map(b => ({ b: b, good: true })).concat(layer.threatens.map(b => ({ b: b, good: false })));
  textSize(11); textStyle(BOLD);
  for (const it of all) {
    const label = (it.good ? '+ ' : '− ') + it.b.label;
    const bw = textWidth(label) + 14;
    const firstThreat = !it.good && it.b === layer.threatens[0];
    if ((firstThreat || bx + bw > tx + tw) && bx > tx) { bx = tx; by += 21; }   // threats start a new row
    const hit = qa && it.b.qa === qa;
    const a = qa ? (hit ? 255 : 70) : alpha;
    const col = it.good ? GREEN : RED;
    fill(col[0], col[1], col[2], a); rect(bx, by, bw, 18, 9);
    if (hit) { noFill(); stroke(20); strokeWeight(2); rect(bx - 1.5, by - 1.5, bw + 3, 21, 10); noStroke(); }
    fill(255, 255, 255, a < 255 ? 200 : 255); textAlign(LEFT, CENTER); text(label, bx + 7, by + 9);
    badgeRects.push({ x: bx, y: by, w: bw, h: 18, layer: layer, b: it.b, good: it.good });
    bx += bw + 5;
  }
  textStyle(NORMAL);
}

function drawPanel(qa, overlay) {
  const x = panelX, y = stackTop, w = panelW, h = drawHeight - stackTop - 8;
  fill(255); stroke(overlay ? color(25, 45, 90) : color(200)); strokeWeight(overlay ? 2 : 1); rect(x, y, w, h, 8); noStroke();
  const tx = x + 12, tw = w - 24, limit = y + h - 6;
  let ty = y + 10;

  if (selectedLayer > 0) {
    const layer = LAYERS[selectedLayer - 1];
    const c = layer.color;
    fill(c[0], c[1], c[2]); rect(tx, ty, 22, 22, 5);
    fill(30); textAlign(CENTER, CENTER); textStyle(BOLD); textSize(14); text(layer.n, tx + 11, ty + 11);
    fill(25, 45, 90); textAlign(LEFT, TOP); textSize(14);
    text(fitText(layer.name, tw - 30), tx + 30, ty + 3);
    textStyle(NORMAL); ty += 28;
    ty = drawWrapped(layer.role + '.', tx, ty, tw, 12, 15, color(85), limit) + 5;
    ty = drawHeading('Supports', GREEN, tx, ty);
    for (const b of layer.supports) ty = drawEntry('+ ' + b.label + ': ', b.how, GREEN, tx, ty, tw, limit, qa === b.qa) + 2;
    ty += 3;
    ty = drawHeading('Threatens', RED, tx, ty);
    for (const b of layer.threatens) ty = drawEntry('− ' + b.label + ': ', b.how, RED, tx, ty, tw, limit, qa === b.qa) + 2;
    ty += 4;
    drawWrapped(layer.atam, tx, ty, tw, 12, 15, color(90, 60, 0), overlay ? limit - 18 : limit);
    if (overlay) {
      fill(100); textSize(11.5); textAlign(LEFT, BOTTOM); text('Tap anywhere to return to the stack.', tx, limit);
    }
    return;
  }

  if (qa) {
    fill(25, 45, 90); textAlign(LEFT, TOP); textStyle(BOLD); textSize(14);
    text(fitText(qa + ' across the stack', tw), tx, ty); textStyle(NORMAL); ty += 23;
    let plus = 0, minus = 0;
    for (let i = 4; i >= 0; i--) {
      const layer = LAYERS[i];
      for (const b of layer.supports) if (b.qa === qa) { plus++; ty = drawEntry('+ ' + layer.n + ' ' + layer.short + ': ', b.how, GREEN, tx, ty, tw, limit, false) + 3; }
      for (const b of layer.threatens) if (b.qa === qa) { minus++; ty = drawEntry('− ' + layer.n + ' ' + layer.short + ': ', b.how, RED, tx, ty, tw, limit, false) + 3; }
    }
    ty += 4;
    const summary = 'Supported at ' + plus + ' layer' + (plus === 1 ? '' : 's') + ', threatened at ' + minus + '.';
    ty = drawWrapped(summary, tx, ty, tw, 12.5, 16, color(20), limit) + 3;
    const insight = QA_INSIGHT[qa] || 'Only one layer addresses this attribute, so there is no second line of defense elsewhere in the stack.';
    drawWrapped(insight, tx, ty, tw, 12.5, 16, color(90, 60, 0), limit);
    return;
  }

  fill(25, 45, 90); textAlign(LEFT, TOP); textStyle(BOLD); textSize(14);
  text(fitText('Which layer buys which quality?', tw), tx, ty); textStyle(NORMAL); ty += 23;
  ty = drawWrapped('Each layer of the stack supports some quality attributes and puts others at risk. ' +
    'No layer is free.', tx, ty, tw, 12.5, 16, color(30), limit) + 8;
  ty = drawWrapped('1. Click a layer to read how it supports each attribute and why it threatens others.', tx, ty, tw, 12.5, 16, color(30), limit) + 4;
  ty = drawWrapped('2. Pick a quality attribute below to see every layer that touches it.', tx, ty, tw, 12.5, 16, color(30), limit) + 4;
  ty = drawWrapped('3. Hover over any badge to see the specific mechanism.', tx, ty, tw, 12.5, 16, color(30), limit) + 12;
  // legend
  textSize(11); textStyle(BOLD);
  fill(GREEN[0], GREEN[1], GREEN[2]); rect(tx, ty, 78, 18, 9);
  fill(255); textAlign(LEFT, CENTER); text('+ supports', tx + 8, ty + 9);
  fill(RED[0], RED[1], RED[2]); rect(tx + 86, ty, 82, 18, 9);
  fill(255); text('− threatens', tx + 94, ty + 9);
  textStyle(NORMAL); ty += 30;
  drawWrapped('Question to carry through: which attribute is put at risk by the most layers?',
    tx, ty, tw, 12.5, 16, color(90, 60, 0), limit);
}

function drawHeading(label, col, x, y) {
  noStroke(); fill(col[0], col[1], col[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(12.5);
  text(label, x, y); textStyle(NORMAL);
  return y + 18;
}

// A colored bold lead-in followed by wrapped body text; returns the y below it.
function drawEntry(lead, body, col, x, y, w, yLimit, emphasize) {
  const size = 12, lineH = 15;
  textSize(size); textStyle(NORMAL); textAlign(LEFT, TOP); noStroke();
  const lines = wrapLines(lead + body, w);
  if (emphasize) {
    fill(255, 243, 205); rect(x - 4, y - 2, w + 8, Math.min(lines.length * lineH + 3, yLimit - y), 4);
  }
  for (let i = 0; i < lines.length; i++) {
    if (y + lineH > yLimit) break;
    if (i === 0) {
      textStyle(BOLD); fill(col[0], col[1], col[2]); text(lead, x, y);
      const lw = textWidth(lead);
      textStyle(NORMAL); fill(30); text(lines[i].slice(lead.length), x + lw, y);
    } else {
      fill(30); text(lines[i], x, y);
    }
    y += lineH;
  }
  return y;
}

function drawTooltip() {
  const hit = badgeRects.find(r => inRect(r));
  if (!hit) return;
  const tw = Math.min(280, canvasWidth - 24);
  textSize(12); textStyle(NORMAL);
  const lines = wrapLines(hit.b.how, tw - 16);
  const th = lines.length * 15 + 12;
  let tx = constrain(mouseX + 12, 6, canvasWidth - tw - 6);
  let ty = hit.y + hit.h + 6;
  if (ty + th > drawHeight - 4) ty = hit.y - th - 6;
  fill(40, 40, 40, 240); noStroke(); rect(tx, ty, tw, th, 6);
  fill(255); textAlign(LEFT, TOP);
  for (let i = 0; i < lines.length; i++) text(lines[i], tx + 8, ty + 6 + i * 15);
}

// ---------- helpers ----------
function inRect(r) {
  return mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h;
}

function fitText(str, maxW) {
  if (textWidth(str) <= maxW) return str;
  let s = str;
  while (s.length > 1 && textWidth(s + '…') > maxW) s = s.slice(0, -1);
  return s + '…';
}

function wrapLines(str, w) {
  const lines = [];
  let ln = '';
  for (const wd of str.split(' ')) {
    const t = ln ? ln + ' ' + wd : wd;
    if (textWidth(t) > w && ln) { lines.push(ln); ln = wd; } else ln = t;
  }
  if (ln) lines.push(ln);
  return lines;
}

function drawWrapped(str, x, y, w, size, lineH, col, yLimit) {
  textSize(size); textAlign(LEFT, TOP); textStyle(NORMAL); noStroke(); fill(col);
  const lines = wrapLines(str, w);
  for (let i = 0; i < lines.length; i++) {
    if (y + lineH > yLimit) break;
    const lastFit = (y + 2 * lineH > yLimit) && i < lines.length - 1;
    text(lastFit ? fitText(lines[i] + ' …', w) : lines[i], x, y);
    y += lineH;
  }
  return y;
}

// ---------- interaction ----------
function mousePressed() {
  if (mouseY > drawHeight || mouseY < 0 || mouseX < 0 || mouseX > canvasWidth) return;
  if (!wide && selectedLayer > 0) { selectedLayer = 0; return; }   // close the narrow-screen overlay
  for (const r of bandRects) {
    if (inRect(r)) { selectedLayer = (selectedLayer === r.n) ? 0 : r.n; return; }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  layout();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
