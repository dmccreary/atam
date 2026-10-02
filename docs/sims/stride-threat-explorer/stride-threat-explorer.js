// STRIDE Threat Model Explorer
// CANVAS_HEIGHT: 570
// Bloom L3 (Apply): students USE the STRIDE framework on a data flow diagram of a healthcare
// patient portal. They select a component or data flow, read the threat in each STRIDE
// category that applies to that kind of element, and record a mitigation for it. A coverage
// tracker shows which of the six categories they have addressed across the whole system.
//
// Which categories apply to which element type follows the STRIDE-per-element convention:
// external entities S,R; processes all six; data stores T,R,I,D; data flows T,I,D.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 520;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const RED = [198, 40, 40], ORANGE = [239, 108, 0], AMBER = [251, 192, 45];
const STRIDE = [
  { k: 'S', name: 'Spoofing', color: RED, dark: false },
  { k: 'T', name: 'Tampering', color: RED, dark: false },
  { k: 'R', name: 'Repudiation', color: AMBER, dark: true },
  { k: 'I', name: 'Information Disclosure', color: ORANGE, dark: false },
  { k: 'D', name: 'Denial of Service', color: AMBER, dark: true },
  { k: 'E', name: 'Elevation of Privilege', color: RED, dark: false }
];

const TYPE_NOTE = {
  external: 'External entity: outside your control. Analyze it for spoofing and repudiation.',
  process: 'Process: code that acts on data. All six STRIDE categories apply.',
  store: 'Data store: data at rest. Analyze tampering, repudiation (audit data), information disclosure, and denial of service.',
  flow: 'Data flow: data in motion. Analyze tampering, information disclosure, and denial of service.'
};
const NOT_APPLICABLE = {
  external: 'Not analyzed for an external entity: you cannot harden what runs outside the system.',
  store: 'Not analyzed for a data store: it does not act, so look at the processes that use it.',
  flow: 'Not analyzed for a data flow: it has no identity or privileges, so look at its endpoints.'
};

// fx, fy: position as a fraction of the diagram area. threats: {letter: [threat, mitigation]}
const NODES = [
  { id: 'client', label: 'Browser / Mobile Client', short: 'Client', type: 'external', fx: 0.075, fy: 0.5,
    threats: {
      S: ['An attacker signs in as a patient with phished or reused credentials.', 'Multi-factor authentication and detection of unusual sign-ins.'],
      R: ['A patient denies having requested a refill or changed a consent setting.', 'Time-stamped audit records of each action, tied to the session.'] } },
  { id: 'gateway', label: 'API Gateway', short: 'API Gateway', type: 'process', fx: 0.31, fy: 0.5,
    threats: {
      S: ['An attacker uses a stolen JWT to call the API as a legitimate user.', 'Short token lifetime, token binding, and a revocation list.'],
      T: ['An attacker modifies the request payload in transit.', 'HTTPS for every request; certificate pinning in the mobile app.'],
      R: ['API calls are not logged in enough detail to prove who did what.', 'Structured request logs: user ID, timestamp, operation, and outcome.'],
      I: ['Verbose error messages expose the internal architecture.', 'Sanitize error responses; keep the details in internal logs only.'],
      D: ['Synthetic traffic overwhelms the gateway.', 'Rate limiting, a web application firewall, and a DDoS mitigation service.'],
      E: ['Forged claims in a JWT grant a role the user does not have.', 'Verify the signature, validate the claims, and restrict the audience.'] } },
  { id: 'auth', label: 'Authentication Service', short: 'Auth Service', type: 'process', fx: 0.53, fy: 0.16,
    threats: {
      S: ['A rogue service impersonates the authentication service and issues tokens.', 'Mutual TLS between services; tokens signed with a protected private key.'],
      T: ['The token signing key or the login configuration is altered.', 'Keys in a hardware-backed key store; reviewed configuration changes.'],
      R: ['A user denies a login or a password reset.', 'Immutable authentication event log with source address and device.'],
      I: ['Different errors for unknown users and wrong passwords reveal valid accounts.', 'Uniform error messages and timing; salted, slow password hashing.'],
      D: ['Credential stuffing floods the login endpoint and locks out real patients.', 'Per-account and per-address throttling with progressive delays.'],
      E: ['A flaw in the token endpoint gives a patient a clinician-scoped token.', 'Assign scopes from the identity record, never from the request.'] } },
  { id: 'portal', label: 'Patient Portal Service', short: 'Patient Portal', type: 'process', fx: 0.53, fy: 0.84,
    threats: {
      S: ['A request that bypasses the gateway claims to come from it.', 'Accept only mutual-TLS calls from the gateway; verify the token again.'],
      T: ['Injected input, such as SQL injection, alters patient records.', 'Parameterized queries, input validation, least-privilege credentials.'],
      R: ['A clinician denies having viewed a patient\'s chart.', 'Record every read and write of patient data in a tamper-evident audit trail.'],
      I: ['Changing the patient ID in a request returns another patient\'s record.', 'Object-level authorization: check ownership on every request.'],
      D: ['Expensive report queries exhaust the service\'s worker threads.', 'Timeouts, pagination, and bulkheads that isolate heavy operations.'],
      E: ['A patient calls an endpoint meant for clinicians or administrators.', 'Server-side role checks on every operation; deny by default.'] } },
  { id: 'ehr', label: 'EHR Integration', short: 'EHR Integration', type: 'process', fx: 0.76, fy: 0.16,
    threats: {
      S: ['A fake endpoint poses as the hospital\'s EHR system.', 'Mutual TLS with pinned certificates on the EHR connection.'],
      T: ['A prescription message is altered between the portal and the EHR.', 'Signed messages and schema validation at both ends.'],
      R: ['The EHR and the portal disagree about whether an order was sent.', 'Correlation IDs and acknowledged delivery, logged on both sides.'],
      I: ['The integration returns more of the chart than the portal needs.', 'Request the minimum necessary fields and filter responses.'],
      D: ['A slow EHR ties up portal requests until they all time out.', 'Timeouts, a circuit breaker, and a queue for non-urgent messages.'],
      E: ['The integration\'s service account can read every patient in the EHR.', 'Least-privilege service account scoped to portal patients and operations.'] } },
  { id: 'db', label: 'Database', short: 'Database', type: 'store', fx: 0.925, fy: 0.84,
    threats: {
      T: ['Someone with database access edits records directly, bypassing the application.', 'Restrict direct access; keep row-level change history and integrity checks.'],
      R: ['Audit rows are edited or deleted to hide an action.', 'Append-only audit storage, copied to a system administrators cannot alter.'],
      I: ['A stolen backup or disk snapshot exposes patient records.', 'Encryption at rest, with keys held in a separate key management service.'],
      D: ['Storage fills up, or a runaway query blocks every other transaction.', 'Quotas, query limits, replicas, and tested backups.'] } }
];

const FLOWS = [
  { id: 'f1', n: 1, from: 'client', to: 'gateway', label: 'requests', title: 'Client to API Gateway: HTTPS requests', type: 'flow', crosses: true,
    threats: {
      T: ['An attacker on public Wi-Fi alters a request in transit.', 'TLS 1.2 or later with HSTS; certificate pinning in the mobile app.'],
      I: ['Patient data is read off the network or from a logged URL.', 'TLS everywhere; never put identifiers or tokens in query strings.'],
      D: ['Connections are flooded or held open to exhaust the gateway.', 'Connection limits, timeouts, and upstream DDoS protection.'] } },
  { id: 'f2', n: 2, from: 'gateway', to: 'auth', label: 'auth token', title: 'API Gateway to Authentication Service: credentials and token checks', type: 'flow', crosses: false,
    threats: {
      T: ['A token validation response is changed from invalid to valid.', 'Mutual TLS between the two services; verify token signatures locally.'],
      I: ['Credentials are captured on the internal network.', 'Encrypt internal traffic too; never log passwords or full tokens.'],
      D: ['Every request waits on a slow authentication call.', 'Validate signed tokens locally, cache keys, and time out the remote check.'] } },
  { id: 'f3', n: 3, from: 'gateway', to: 'portal', label: 'patient data', title: 'API Gateway to Patient Portal Service: authorized requests', type: 'flow', crosses: false,
    threats: {
      T: ['Identity headers added by the gateway are forged by another internal caller.', 'Pass the signed token instead of plain headers, over mutual TLS.'],
      I: ['Request bodies with health data are written to shared logs or traces.', 'Redact sensitive fields in logs and traces.'],
      D: ['A retry storm from the gateway multiplies load on the service.', 'Retry budgets with backoff, and load shedding.'] } },
  { id: 'f4', n: 4, from: 'portal', to: 'ehr', label: 'prescriptions', title: 'Patient Portal Service to EHR Integration: prescriptions', type: 'flow', crosses: false,
    threats: {
      T: ['A refill request is modified or replayed.', 'Sign each message and give it a unique ID so replays are rejected.'],
      I: ['Prescription details leak from a message queue or dead-letter store.', 'Encrypt message payloads and restrict who can read the queues.'],
      D: ['A backlog of messages delays urgent prescriptions.', 'Priority queues, backpressure, and alerts on queue depth.'] } },
  { id: 'f5', n: 5, from: 'portal', to: 'db', label: 'records', title: 'Patient Portal Service to Database: patient records', type: 'flow', crosses: true,
    threats: {
      T: ['A database connection is hijacked and queries are altered.', 'TLS to the database and short-lived, per-service credentials.'],
      I: ['An unencrypted database connection exposes records on the wire.', 'Require TLS on every database connection; reject plaintext clients.'],
      D: ['The service exhausts the connection pool and blocks all database work.', 'Bounded connection pools, statement timeouts, and read replicas.'] } }
];
const ELEMENTS = NODES.concat(FLOWS);
const TOTAL_THREATS = ELEMENTS.reduce((a, e) => a + Object.keys(e.threats).length, 0);

let boundaryCheckbox, resetBtn;
let selectedId = 'gateway';
let activeTab = 0;                 // narrow layout: which STRIDE category is shown
let mitigated = {};                // "elementId:letter" -> true
let hitRects = [];                 // [{kind, id, x, y, w, h}] rebuilt every frame
const diagTop = 40, diagH = 196, panelTop = 242;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const main = document.querySelector('main');
  canvas.parent(main);
  textSize(defaultTextSize);

  boundaryCheckbox = createCheckbox(' Show trust boundaries', true);
  boundaryCheckbox.parent(main);
  boundaryCheckbox.style('font-size', '13px');
  resetBtn = createButton('Reset mitigations');
  resetBtn.parent(main);
  resetBtn.mousePressed(() => { mitigated = {}; });

  layout();
  describe('A data flow diagram of a healthcare patient portal with six components (client, API ' +
    'gateway, authentication service, patient portal service, EHR integration, database) and five ' +
    'numbered data flows across three trust zones. Selecting a component or flow lists the threat in ' +
    'each applicable STRIDE category: spoofing, tampering, repudiation, information disclosure, denial ' +
    'of service, and elevation of privilege. Each threat has an Add mitigation control, and a tracker ' +
    'shows which categories have at least one recorded mitigation.', LABEL);
}

function layout() {
  boundaryCheckbox.position(10, drawHeight + 14);
  resetBtn.position(190, drawHeight + 13);
}

// ---------- model helpers ----------
function element(id) { return ELEMENTS.find(e => e.id === id); }
function mitigatedCount(e) { return Object.keys(e.threats).filter(k => mitigated[e.id + ':' + k]).length; }
function totalMitigated() { return ELEMENTS.reduce((a, e) => a + mitigatedCount(e), 0); }
function categoryCovered(k) { return ELEMENTS.some(e => mitigated[e.id + ':' + k]); }

function nodeGeometry() {
  const w = canvasWidth - margin * 2;
  const nw = constrain(w * 0.13, 50, 112), nh = 40;
  const g = {};
  for (const n of NODES) {
    g[n.id] = { x: margin + n.fx * w, y: diagTop + 26 + n.fy * (diagH - 52), w: nw, h: nh };
  }
  return g;
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

  hitRects = [];
  drawHeader();
  const g = nodeGeometry();
  if (boundaryCheckbox.checked()) drawZones();
  for (const f of FLOWS) drawFlow(f, g);
  for (const n of NODES) drawNode(n, g[n.id]);
  if (canvasWidth >= 640) drawPanelRows(); else drawPanelTabs();

  if (canvasWidth >= 700) {
    noStroke(); fill(100); textAlign(LEFT, CENTER); textSize(12);
    text(fitText('Click a component or a numbered data flow, then record a mitigation for each threat.', canvasWidth - 345),
      332, drawHeight + controlHeight / 2);
  }
  let over = false;
  for (const r of hitRects) if (inRect(r)) over = true;
  cursor(over ? HAND : ARROW);
}

function drawHeader() {
  const narrow = canvasWidth < 560;
  noStroke(); fill(25, 45, 90); textAlign(LEFT, TOP); textStyle(BOLD); textSize(narrow ? 14.5 : 18);
  text(narrow ? 'STRIDE Threat Explorer' : 'STRIDE Threat Model Explorer: Patient Portal', margin, narrow ? 11 : 9);
  // coverage tracker: one circle per category, filled once any mitigation is recorded in it
  const d = 20, gap = 4;
  let x = canvasWidth - margin - (d * 6 + gap * 5);
  if (!narrow) {
    fill(70); textAlign(RIGHT, CENTER); textSize(12); textStyle(NORMAL);
    text('Categories mitigated:', x - 8, 19);
  }
  textAlign(CENTER, CENTER); textStyle(BOLD); textSize(11.5);
  for (const s of STRIDE) {
    const on = categoryCovered(s.k);
    if (on) { fill(s.color[0], s.color[1], s.color[2]); noStroke(); }
    else { fill(255); stroke(150); strokeWeight(1.2); }
    circle(x + d / 2, 19, d); noStroke();
    fill(on ? (s.dark ? color(40) : color(255)) : color(120));
    text(s.k, x + d / 2, 19.5);
    x += d + gap;
  }
  textStyle(NORMAL);
}

function drawZones() {
  const w = canvasWidth - margin * 2, x0 = margin;
  const b1 = x0 + w * 0.185, b2 = x0 + w * 0.845;
  noStroke();
  fill(226, 229, 233); rect(x0, diagTop, b1 - x0, diagH, 6, 0, 0, 6);
  fill(214, 232, 250); rect(b1, diagTop, b2 - b1, diagH);
  fill(182, 210, 242); rect(b2, diagTop, x0 + w - b2, diagH, 0, 6, 6, 0);
  stroke(150, 50, 50); strokeWeight(1.5); drawingContext.setLineDash([6, 5]);
  line(b1, diagTop, b1, diagTop + diagH); line(b2, diagTop, b2, diagTop + diagH);
  drawingContext.setLineDash([]); noStroke();
  fill(70); textSize(canvasWidth < 560 ? 9.5 : 11.5); textStyle(BOLD); textAlign(CENTER, TOP);
  const narrow = canvasWidth < 560;
  text(narrow ? 'Untrusted' : 'Untrusted (internet)', (x0 + b1) / 2, diagTop + 4);
  text(narrow ? 'Trusted' : 'Trusted (internal services)', (b1 + b2) / 2, diagTop + 4);
  text(narrow ? 'High trust' : 'Highly trusted', (b2 + x0 + w) / 2, diagTop + 4);
  textStyle(NORMAL);
}

// point where the segment from a rect's center toward (tx, ty) leaves the rect
function edgePoint(r, tx, ty) {
  const dx = tx - r.x, dy = ty - r.y;
  if (dx === 0 && dy === 0) return { x: r.x, y: r.y };
  const sx = dx !== 0 ? (r.w / 2) / Math.abs(dx) : Infinity;
  const sy = dy !== 0 ? (r.h / 2) / Math.abs(dy) : Infinity;
  const s = Math.min(sx, sy);
  return { x: r.x + dx * s, y: r.y + dy * s };
}

function drawFlow(f, g) {
  const a = g[f.from], b = g[f.to];
  const p1 = edgePoint(a, b.x, b.y), p2 = edgePoint(b, a.x, a.y);
  const sel = selectedId === f.id;
  const done = mitigatedCount(f) === 3;
  stroke(sel ? color(25, 45, 90) : color(84, 110, 122)); strokeWeight(sel ? 3 : 1.8);
  line(p1.x, p1.y, p2.x, p2.y);
  const ang = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  noStroke(); fill(sel ? color(25, 45, 90) : color(84, 110, 122));
  push(); translate(p2.x, p2.y); rotate(ang); triangle(0, 0, -10, -5, -10, 5); pop();
  // clickable chip at the midpoint
  const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
  const showLabel = canvasWidth >= 640;
  textSize(11); textStyle(BOLD);
  const label = showLabel ? f.n + '  ' + f.label : '' + f.n;
  const cw = showLabel ? textWidth(label) + 14 : 20, ch = showLabel ? 19 : 20;
  fill(sel ? color(25, 45, 90) : (done ? color(46, 125, 50) : color(255)));
  stroke(sel ? color(25, 45, 90) : (done ? color(46, 125, 50) : color(84, 110, 122))); strokeWeight(1.3);
  rect(mx - cw / 2, my - ch / 2, cw, ch, 9); noStroke();
  fill(sel || done ? color(255) : color(40)); textAlign(CENTER, CENTER);
  text(label, mx, my + 0.5); textStyle(NORMAL);
  hitRects.push({ kind: 'element', id: f.id, x: mx - cw / 2 - 3, y: my - ch / 2 - 3, w: cw + 6, h: ch + 6 });
}

function drawNode(n, r) {
  const sel = selectedId === n.id;
  const x = r.x - r.w / 2, y = r.y - r.h / 2;
  const count = mitigatedCount(n), total = Object.keys(n.threats).length;
  const done = count === total;
  fill(sel ? color(255, 248, 225) : color(255));
  stroke(sel ? color(25, 45, 90) : (done ? color(46, 125, 50) : color(70, 90, 110)));
  strokeWeight(sel ? 3 : 1.6);
  if (n.type === 'process') rect(x, y, r.w, r.h, 12);                 // process: rounded rectangle
  else if (n.type === 'external') rect(x, y, r.w, r.h);               // external entity: plain rectangle
  else {                                                              // data store: double horizontal lines
    noStroke(); rect(x, y, r.w, r.h);
    stroke(sel ? color(25, 45, 90) : (done ? color(46, 125, 50) : color(70, 90, 110))); strokeWeight(sel ? 3 : 1.6);
    line(x, y, x + r.w, y); line(x, y + r.h, x + r.w, y + r.h);
    strokeWeight(1); line(x, y + 4, x + r.w, y + 4); line(x, y + r.h - 4, x + r.w, y + r.h - 4);
  }
  noStroke(); fill(25, 35, 60); textAlign(CENTER, CENTER); textStyle(BOLD);
  textSize(r.w < 70 ? 9.5 : (r.w < 100 ? 11 : 12));
  text(n.short, x + 3, y + 1, r.w - 6, r.h - 10);
  // progress: mitigations recorded for this element
  textStyle(NORMAL); textSize(9.5); fill(done ? color(46, 125, 50) : color(110));
  textAlign(CENTER, BOTTOM); text(count + '/' + total, r.x, y + r.h - (n.type === 'store' ? 5 : 1));
  hitRects.push({ kind: 'element', id: n.id, x: x, y: y, w: r.w, h: r.h });
}

function panelHeader(e) {
  const x = margin, y = panelTop, w = canvasWidth - margin * 2, h = drawHeight - panelTop - 8;
  fill(255); stroke(200); strokeWeight(1); rect(x, y, w, h, 8); noStroke();
  const name = e.type === 'flow' ? 'Flow ' + e.n + ': ' + e.title : e.label;
  const status = mitigatedCount(e) + ' of ' + Object.keys(e.threats).length + ' mitigated';
  fill(25, 45, 90); textAlign(LEFT, TOP); textStyle(BOLD); textSize(14);
  textAlign(RIGHT, TOP); textSize(12);
  const sw = textWidth(status);
  fill(46, 125, 50); text(status, x + w - 12, y + 10);
  fill(25, 45, 90); textAlign(LEFT, TOP); textSize(14);
  text(fitText(name, w - 36 - sw), x + 12, y + 8); textStyle(NORMAL);
  let note = TYPE_NOTE[e.type];
  if (e.crosses) note += ' Crosses a trust boundary.';
  fill(85); textSize(12);
  text(fitText(note, w - 24), x + 12, y + 28);
  return { x: x, y: y, w: w, h: h, bodyTop: y + 48 };
}

// Wide layout: all six categories as rows.
function drawPanelRows() {
  const e = element(selectedId);
  const p = panelHeader(e);
  const rowH = (p.y + p.h - 4 - p.bodyTop) / 6;
  const colA = 170;                                   // badge + category name + mitigation control
  for (let i = 0; i < 6; i++) {
    const s = STRIDE[i], t = e.threats[s.k];
    const ry = p.bodyTop + i * rowH;
    if (i % 2 === 0) { noStroke(); fill(246, 249, 252); rect(p.x + 4, ry, p.w - 8, rowH, 4); }
    drawBadge(s, p.x + 24, ry + rowH / 2, 22, !!t);
    const tx = p.x + 42, bx = p.x + colA + 12, bw = p.w - colA - 24;
    noStroke(); textAlign(LEFT, TOP); textStyle(BOLD); textSize(12);
    fill(t ? color(30) : color(140)); text(s.name, tx, ry + 2);
    textStyle(NORMAL); textSize(12);
    if (!t) {
      fill(130); text(fitText(NOT_APPLICABLE[e.type], bw), bx, ry + 3);
      continue;
    }
    fill(25); text(fitText(t[0], bw), bx, ry + 3);
    const key = e.id + ':' + s.k, on = !!mitigated[key];
    drawChip(key, tx, ry + 18, on);
    if (on) { fill(27, 94, 32); text(fitText('Mitigation: ' + t[1], bw), bx, ry + 19); }
    else { fill(120); text('No mitigation recorded yet.', bx, ry + 19); }
  }
}

// Narrow layout: one category at a time, chosen with six tabs.
function drawPanelTabs() {
  const e = element(selectedId);
  const p = panelHeader(e);
  const tabW = (p.w - 24) / 6, tabY = p.bodyTop, tabH = 30;
  for (let i = 0; i < 6; i++) {
    const s = STRIDE[i], t = e.threats[s.k];
    const tx = p.x + 12 + i * tabW;
    const on = i === activeTab;
    fill(on ? color(232, 240, 250) : color(255)); stroke(on ? color(25, 45, 90) : color(210)); strokeWeight(on ? 2 : 1);
    rect(tx + 2, tabY, tabW - 4, tabH, 6); noStroke();
    drawBadge(s, tx + tabW / 2, tabY + tabH / 2, 20, !!t);
    if (t && mitigated[e.id + ':' + s.k]) { fill(46, 125, 50); circle(tx + tabW - 9, tabY + 6, 8); }
    hitRects.push({ kind: 'tab', i: i, x: tx + 2, y: tabY, w: tabW - 4, h: tabH });
  }
  const s = STRIDE[activeTab], t = e.threats[s.k];
  const x = p.x + 12, w = p.w - 24, limit = p.y + p.h - 6;
  let y = tabY + tabH + 8;
  noStroke(); fill(25, 45, 90); textAlign(LEFT, TOP); textStyle(BOLD); textSize(13.5);
  text(s.name, x, y); textStyle(NORMAL); y += 20;
  if (!t) { drawWrapped(NOT_APPLICABLE[e.type], x, y, w, 12.5, 16, color(110), limit); return; }
  y = drawWrapped('Threat: ' + t[0], x, y, w, 12.5, 16, color(25), limit) + 6;
  const key = e.id + ':' + s.k, on = !!mitigated[key];
  drawChip(key, x, y, on); y += 24;
  if (on) drawWrapped('Mitigation: ' + t[1], x, y, w, 12.5, 16, color(27, 94, 32), limit);
}

function drawBadge(s, cx, cy, d, applies) {
  noStroke();
  if (applies) fill(s.color[0], s.color[1], s.color[2]); else fill(214, 219, 224);
  circle(cx, cy, d);
  fill(applies ? (s.dark ? color(40) : color(255)) : color(140));
  textAlign(CENTER, CENTER); textStyle(BOLD); textSize(d * 0.56); text(s.k, cx, cy + 0.5); textStyle(NORMAL);
  textAlign(LEFT, TOP);
}

// The "Add mitigation" control for one threat (drawn on the canvas, hit-tested in mousePressed).
function drawChip(key, x, y, on) {
  const label = on ? '✓ Mitigated (undo)' : '+ Add mitigation';
  textSize(11); textStyle(BOLD);
  const w = textWidth(label) + 14;
  if (on) { fill(232, 245, 233); stroke(46, 125, 50); }
  else { fill(232, 240, 250); stroke(25, 103, 192); }
  strokeWeight(1.2); rect(x, y, w, 16, 8); noStroke();
  fill(on ? color(27, 94, 32) : color(21, 80, 160)); textAlign(LEFT, CENTER); text(label, x + 7, y + 8.5);
  textStyle(NORMAL); textAlign(LEFT, TOP); textSize(12);
  hitRects.push({ kind: 'chip', key: key, x: x - 2, y: y - 2, w: w + 4, h: 20 });
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

function drawWrapped(str, x, y, w, size, lineH, col, yLimit) {
  textSize(size); textAlign(LEFT, TOP); textStyle(NORMAL); noStroke(); fill(col);
  const lines = [];
  let ln = '';
  for (const wd of str.split(' ')) {
    const t = ln ? ln + ' ' + wd : wd;
    if (textWidth(t) > w && ln) { lines.push(ln); ln = wd; } else ln = t;
  }
  if (ln) lines.push(ln);
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
  // chips and tabs are drawn last, so test them first; flow chips sit on top of nodes
  const order = ['chip', 'tab', 'element'];
  for (const kind of order) {
    for (let i = hitRects.length - 1; i >= 0; i--) {
      const r = hitRects[i];
      if (r.kind !== kind || !inRect(r)) continue;
      if (kind === 'chip') { if (mitigated[r.key]) delete mitigated[r.key]; else mitigated[r.key] = true; }
      else if (kind === 'tab') activeTab = r.i;
      else selectedId = r.id;
      return;
    }
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
