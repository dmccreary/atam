// Distributed System Explorer
// CANVAS_HEIGHT: 526
// Bloom L2 (Understand): students EXPLAIN the role of each distributed-system component and
// its quality attribute implications. A labeled topology (ingress, services + sidecars, mesh
// control plane, broker, registry, databases) is click-to-explore; a mesh toggle and a
// failure mode show how design choices change security, observability, and health propagation.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 46;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;

const CAT = {
  ingress: [212, 160, 23], service: [33, 118, 210], mesh: [0, 150, 136],
  messaging: [239, 124, 0], discovery: [156, 39, 176], data: [46, 125, 50], client: [120, 120, 120]
};
const SVC_X = [0.13, 0.38, 0.63, 0.88];
const ABCD = ['A', 'B', 'C', 'D'];

const INFO = {
  clients: { title: 'External Clients', cat: 'client',
    def: 'Browsers, mobile apps, and partner systems that originate requests.',
    sup: 'Define the real workload and the user-facing latency budget.', thr: 'Unpredictable load and untrusted input — the system edge.',
    atam: 'What is the peak request rate and the geographic distribution of clients?' },
  lb: { title: 'Load Balancer', cat: 'ingress',
    def: 'Distributes incoming traffic across healthy instances.',
    sup: 'Availability and scalability — spreads load, routes around failures.', thr: 'A poorly chosen algorithm can hurt tail latency; it is on the critical path.',
    atam: 'Which balancing algorithm, and how fast does it detect an unhealthy instance?' },
  apigw: { title: 'API Gateway', cat: 'ingress',
    def: 'Single entry point handling auth, rate limiting, and routing.',
    sup: 'Security (central auth) and modifiability (clients decoupled from services).', thr: 'A single point of failure and a latency hop if not made redundant.',
    atam: 'Is the gateway redundant, and what is its added latency at p99?' },
  service: { title: 'Service (microservice)', cat: 'service',
    def: 'An independently deployable unit owning one business capability and its data.',
    sup: 'Modifiability and scalability — deploy and scale each service independently.', thr: 'Performance (network hops) and added operational complexity.',
    atam: 'What are this service\'s dependencies, and what happens when each is slow?' },
  sidecar: { title: 'Sidecar Proxy', cat: 'mesh',
    def: 'A per-service proxy that handles mTLS, retries, and telemetry transparently.',
    sup: 'Security and observability — uniform policy without changing service code.', thr: 'Adds a small latency hop and per-pod resource overhead.',
    atam: 'What latency does the sidecar add, and are mTLS and tracing actually enforced?' },
  controlplane: { title: 'Mesh Control Plane', cat: 'mesh',
    def: 'Configures and coordinates all sidecars (policy, certs, routing rules).',
    sup: 'Modifiability — change traffic policy centrally, no redeploys.', thr: 'A control-plane outage can stop config propagation; complexity.',
    atam: 'Can the data plane keep serving if the control plane is briefly down?' },
  broker: { title: 'Message Broker (Kafka)', cat: 'messaging',
    def: 'Durable, ordered event streams decoupling producers from consumers.',
    sup: 'Availability and scalability — async decoupling, buffering, replay.', thr: 'Eventual consistency and a new component to operate and secure.',
    atam: 'What is the acceptable end-to-end event lag, and how is ordering guaranteed?' },
  registry: { title: 'Service Registry', cat: 'discovery',
    def: 'Tracks healthy instances so callers can discover where to send requests.',
    sup: 'Availability — enables dynamic discovery and health-aware routing.', thr: 'A stale or unavailable registry can misroute traffic.',
    atam: 'How quickly does the registry reflect an instance going unhealthy?' },
  database: { title: 'Database per Service', cat: 'data',
    def: 'Each service owns its own datastore (no shared database).',
    sup: 'Modifiability — schema changes stay inside one service boundary.', thr: 'Consistency — cross-service data needs sagas or events, not joins.',
    atam: 'How is data kept consistent across services that need the same facts?' }
};

let comps = [];
let selected = 'apigw';
let meshOn = true, failMode = false;
let meshBtn, failBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  meshBtn = createButton('Service Mesh: ON'); meshBtn.mousePressed(() => { meshOn = !meshOn; meshBtn.html('Service Mesh: ' + (meshOn ? 'ON' : 'OFF')); });
  failBtn = createButton('Failure Mode: OFF'); failBtn.mousePressed(() => { failMode = !failMode; failBtn.html('Failure Mode: ' + (failMode ? 'ON' : 'OFF')); if (!failMode) comps.forEach(c => c.down = false); });
  positionButtons();
  describe('A distributed-system architecture diagram: clients, load balancer and API gateway ' +
    '(ingress), four services with sidecar proxies inside a service-mesh envelope, a mesh ' +
    'control plane, a message broker, a service registry, and a database per service. Clicking ' +
    'a component explains its role and quality attribute implications.', LABEL);
}

function positionButtons() {
  const y = drawHeight + 11;
  meshBtn.position(10, y); failBtn.position(150, y);
}

function leftW() { return Math.max(360, canvasWidth * 0.64); }
function px(fx) { return margin + fx * (leftW() - margin * 2); }

function buildComps() {
  comps = [];
  comps.push({ id: 'clients', kind: 'clients', label: 'External Clients', x: px(0.5), y: 68, w: 120, h: 26 });
  comps.push({ id: 'lb', kind: 'lb', label: 'Load Balancer', x: px(0.28), y: 108, w: 100, h: 26 });
  comps.push({ id: 'apigw', kind: 'apigw', label: 'API Gateway', x: px(0.70), y: 108, w: 108, h: 26 });
  for (let i = 0; i < 4; i++) comps.push({ id: 'svc' + i, kind: 'service', label: 'Service ' + ABCD[i], x: px(SVC_X[i]), y: 206, w: 90, h: 40 });
  if (meshOn) {
    for (let i = 0; i < 4; i++) comps.push({ id: 'side' + i, kind: 'sidecar', label: '◧', x: px(SVC_X[i]) + 38, y: 192, w: 18, h: 18, small: true });
    comps.push({ id: 'cp', kind: 'controlplane', label: 'Mesh Control Plane', x: px(0.5), y: 268, w: 150, h: 24 });
  }
  for (let i = 0; i < 4; i++) comps.push({ id: 'db' + i, kind: 'database', label: 'DB ' + ABCD[i], x: px(SVC_X[i]), y: 322, w: 78, h: 32 });
  comps.push({ id: 'broker', kind: 'broker', label: 'Message Broker', x: px(0.27), y: 386, w: 120, h: 28 });
  comps.push({ id: 'registry', kind: 'registry', label: 'Service Registry', x: px(0.73), y: 386, w: 120, h: 28 });
}

function comp(id) { return comps.find(c => c.id === id); }

function draw() {
  updateCanvasSize();
  buildComps();
  positionButtons();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(LEFT, TOP); textSize(18);
  text('Distributed System Explorer', margin, 10);
  fill(90); textSize(11);
  text('Click a component to learn its role and quality attribute implications.', margin, 34);

  if (meshOn) drawMeshEnvelope();
  drawConnections();
  drawComps();
  drawDetail();
  drawControlHint();
}

function drawMeshEnvelope() {
  const x0 = px(SVC_X[0]) - 60, x1 = px(SVC_X[3]) + 60, y0 = 182, y1 = 256;
  noFill(); stroke(0, 150, 136, 160); strokeWeight(1.5); drawingContext.setLineDash([6, 4]);
  rect(x0, y0, x1 - x0, y1 - y0, 10); drawingContext.setLineDash([]);
  noStroke(); fill(0, 150, 136); textAlign(LEFT, TOP); textSize(9.5); textStyle(BOLD); text('Service Mesh', x0 + 6, y0 + 3); textStyle(NORMAL);
}

function link(a, b, strong) {
  if (!a || !b) return;
  const down = a.down || b.down;
  stroke(down ? color(211, 47, 47, 150) : (strong ? color(150) : color(205))); strokeWeight(strong ? 1.6 : 1);
  line(a.x, a.y, b.x, b.y); noStroke();
}

function drawConnections() {
  link(comp('clients'), comp('lb'), true);
  link(comp('clients'), comp('apigw'), true);
  link(comp('lb'), comp('apigw'), false);
  for (let i = 0; i < 4; i++) { link(comp('apigw'), comp('svc' + i), true); link(comp('svc' + i), comp('db' + i), true); }
  link(comp('svc1'), comp('broker'), false); link(comp('svc2'), comp('broker'), false);
  for (let i = 0; i < 4; i++) link(comp('svc' + i), comp('registry'), false);
  link(comp('lb'), comp('registry'), false);
}

function drawComps() {
  for (const c of comps) {
    const col = CAT[INFO[c.kind] ? INFO[c.kind].cat : 'service'];
    const sel = c.id === selected;
    if (c.small) { noStroke(); fill(col[0], col[1], col[2]); rect(c.x - c.w / 2, c.y - c.h / 2, c.w, c.h, 3); continue; }
    stroke(c.down ? color(211, 47, 47) : (sel ? color(20) : color(col[0], col[1], col[2]))); strokeWeight(sel || c.down ? 2.5 : 1.5);
    fill(c.down ? color(255, 235, 235) : color(col[0], col[1], col[2], 36));
    rect(c.x - c.w / 2, c.y - c.h / 2, c.w, c.h, 7);
    noStroke(); fill(c.down ? color(211, 47, 47) : color(col[0] * 0.6, col[1] * 0.6, col[2] * 0.6));
    textAlign(CENTER, CENTER); textSize(c.h > 34 ? 11.5 : 10.5); textStyle(BOLD);
    text(c.label, c.x, c.y - (c.down ? 5 : 0)); textStyle(NORMAL);
    if (c.down) { fill(211, 47, 47); textSize(8.5); text('DOWN', c.x, c.y + 11); }
  }
}

function drawDetail() {
  const x = leftW() + 8, y0 = 56, w = canvasWidth - x - margin, h = drawHeight - y0 - 12;
  fill(255); stroke(200); strokeWeight(1); rect(x, y0, w, h, 8); noStroke();
  const c = comp(selected); const info = INFO[c ? c.kind : 'apigw'];
  const col = CAT[info.cat];
  fill(col[0], col[1], col[2]); rect(x + 12, y0 + 12, 14, 14, 3);
  fill(40); textAlign(LEFT, TOP); textSize(13.5); textStyle(BOLD); text(info.title, x + 32, y0 + 12); textStyle(NORMAL);
  let yy = y0 + 38;
  fill(55); textSize(12); text(info.def, x + 12, yy, w - 24); yy += Math.ceil(textWidth(info.def) / (w - 24)) * 15 + 12;
  yy = drow('Supports', info.sup, [46, 125, 50], x + 12, yy, w - 24);
  yy = drow('Threatens', info.thr, [198, 40, 40], x + 12, yy, w - 24);
  yy = drow('ATAM question', info.atam, [184, 134, 11], x + 12, yy, w - 24);
  if (failMode && c && c.kind === 'service' && c.down) {
    fill(198, 40, 40); textSize(11.5); textStyle(BOLD); text('Failure impact', x + 12, yy); textStyle(NORMAL);
    fill(60); textSize(11.5); text('With ' + c.label + ' down, requests routed to it fail; its database is unreachable. The registry should mark it unhealthy so the load balancer stops routing to it.', x + 12, yy + 16, w - 24);
  }
}

function drow(label, value, c, x, y, w) {
  fill(c[0], c[1], c[2]); textAlign(LEFT, TOP); textSize(11); textStyle(BOLD); text(label, x, y); textStyle(NORMAL);
  fill(55); textSize(11.5); text(value, x, y + 14, w);
  return y + 14 + Math.ceil(textWidth(value) / w) * 14 + 9;
}

function drawControlHint() {
  if (canvasWidth < 600) return;
  noStroke(); fill(90); textAlign(LEFT, CENTER); textSize(10.5);
  text('Failure Mode: click a service to take it down and see health propagate.', 300, drawHeight + controlHeight / 2, canvasWidth - 310);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  for (const c of comps) {
    if (mouseX >= c.x - c.w / 2 && mouseX <= c.x + c.w / 2 && mouseY >= c.y - c.h / 2 && mouseY <= c.y + c.h / 2) {
      selected = c.id;
      if (failMode && c.kind === 'service') c.down = !c.down;
      return;
    }
  }
}

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); positionButtons(); redraw(); }
function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width); canvasWidth = containerWidth;
}
