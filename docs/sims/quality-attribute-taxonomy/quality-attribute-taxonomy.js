// Quality Attribute Taxonomy and Conflict Map
// CANVAS_HEIGHT: 540
// Bloom L4 (Analyze): students classify quality attributes into runtime vs.
// development-time categories, identify common conflict pairs, and explain the
// architectural tradeoff each conflict represents. Click a circle for its
// definition, click a red conflict line for the tradeoff, or use Quiz Me mode.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 490;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

let rtBtn, dtBtn, quizBtn;
let filter = 'both';     // 'both' | 'rt' | 'dt'
let quizMode = false;
let selectedAttr = null;
let selectedConflict = null;
let quizPick = [];
let quizMsg = '';

const attrs = {
  // runtime
  perf:   { band: 'rt', name: 'Performance', def: 'How quickly the system responds under load.', measure: 'p99 latency < 200ms at 500 concurrent users' },
  avail:  { band: 'rt', name: 'Availability', def: 'Proportion of time the system is operational.', measure: '99.9% uptime excluding planned maintenance' },
  sec:    { band: 'rt', name: 'Security', def: 'Resistance to unauthorized access and misuse.', measure: '100% of PHI access authenticated and logged' },
  usab:   { band: 'rt', name: 'Usability', def: 'Ease with which users accomplish their goals.', measure: 'New user completes core task in < 3 minutes' },
  rel:    { band: 'rt', name: 'Reliability', def: 'Correct operation over time without failure.', measure: 'MTBF > 30 days; < 0.1% transaction error rate' },
  inter:  { band: 'rt', name: 'Interoperability', def: 'Ability to exchange data with other systems.', measure: '100% of partner APIs conform to the v2 contract' },
  scale:  { band: 'rt', name: 'Scalability', def: 'Ability to handle growing load.', measure: 'Handles 10× load via autoscaling, no manual steps' },
  cons:   { band: 'rt', name: 'Consistency', def: 'Agreement of data across replicas/nodes.', measure: 'Reads reflect writes within 1s (or strong)' },
  // development-time
  mod:    { band: 'dt', name: 'Modifiability', def: 'Ease of making changes to the system.', measure: 'New payment method added in < 2 sprints' },
  test:   { band: 'dt', name: 'Testability', def: 'Ease of demonstrating faults via testing.', measure: '> 80% automated coverage; deterministic tests' },
  deploy: { band: 'dt', name: 'Deployability', def: 'Ease and safety of releasing changes.', measure: 'Deploy any service in < 15 min, zero downtime' },
  port:   { band: 'dt', name: 'Portability', def: 'Ease of moving to another environment.', measure: 'Runs on 2 clouds with no code change' },
  safety: { band: 'dt', name: 'Safety', def: 'Avoidance of states that cause harm.', measure: 'No unsafe state reachable in hazard analysis' },
  maint:  { band: 'dt', name: 'Maintainability', def: 'Ease of keeping the system working over time.', measure: 'Mean time to repair a defect < 1 day' },
  energy: { band: 'dt', name: 'Energy Efficiency', def: 'Useful work per unit of energy consumed.', measure: '< X watt-hours per 1000 requests' }
};

const conflicts = [
  { a: 'perf', b: 'sec', label: 'crypto overhead', tradeoff: 'Encryption/decryption and authentication checks add latency to every request.', example: 'TLS + field-level encryption can add tens of ms per call.', mitigation: 'Hardware crypto, session reuse, caching authorized results.' },
  { a: 'perf', b: 'avail', label: 'redundancy cost', tradeoff: 'Redundancy for availability adds routing, replication, and coordination overhead.', example: 'Multi-AZ writes wait on replica acknowledgement.', mitigation: 'Async replication, read replicas, tunable consistency.' },
  { a: 'sec', b: 'usab', label: 'auth friction', tradeoff: 'Stronger authentication adds friction that reduces ease of use.', example: 'MFA on every action frustrates users.', mitigation: 'Risk-based step-up auth; remember trusted devices.' },
  { a: 'scale', b: 'cons', label: 'CAP tradeoff', tradeoff: 'Horizontal scale across nodes often forces eventual consistency.', example: 'A sharded store cannot offer global strong consistency cheaply.', mitigation: 'Bounded staleness; consistency only where required.' },
  { a: 'mod', b: 'perf', label: 'indirection', tradeoff: 'Abstraction layers that aid modifiability add indirection overhead.', example: 'Deep plugin/interface chains add call overhead.', mitigation: 'Flatten hot paths; measure before abstracting.' },
  { a: 'deploy', b: 'rel', label: 'change risk', tradeoff: 'Frequent deployments increase transient reliability risk.', example: 'Every deploy is a chance to introduce a regression.', mitigation: 'Canary/blue-green releases, automated rollback.' },
  { a: 'test', b: 'perf', label: 'instrumentation', tradeoff: 'Observability and test hooks add runtime overhead.', example: 'Verbose tracing on every call costs CPU and I/O.', mitigation: 'Sampling, conditional instrumentation.' },
  { a: 'inter', b: 'sec', label: 'attack surface', tradeoff: 'Open, interoperable APIs increase the attack surface.', example: 'A public partner API is a new entry point for attackers.', mitigation: 'Gateways, rate limiting, strict schemas, authz.' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  rtBtn = createButton('Runtime Only');
  rtBtn.position(10, drawHeight + 12);
  rtBtn.mousePressed(() => filter = (filter === 'rt' ? 'both' : 'rt'));

  dtBtn = createButton('Dev-Time Only');
  dtBtn.position(120, drawHeight + 12);
  dtBtn.mousePressed(() => filter = (filter === 'dt' ? 'both' : 'dt'));

  quizBtn = createButton('Quiz Me');
  quizBtn.position(235, drawHeight + 12);
  quizBtn.mousePressed(() => {
    quizMode = !quizMode; quizPick = []; quizMsg = ''; selectedAttr = null; selectedConflict = null;
    quizBtn.html(quizMode ? 'Exit Quiz' : 'Quiz Me');
  });

  describe('A quality attribute taxonomy with runtime attributes on the left and ' +
    'development-time attributes on the right, connected by red dashed conflict lines. ' +
    'Click attributes or conflict lines to explore tradeoffs.', LABEL);
}

function layout() {
  const top = 50;
  const detailH = 116;
  const bandTop = top, bandBottom = drawHeight - detailH - 8;
  const bandH = bandBottom - bandTop;
  const rtX = canvasWidth * 0.26, dtX = canvasWidth * 0.74;
  const colDX = Math.min(70, canvasWidth * 0.1);

  const place = (band, x) => {
    const ids = Object.keys(attrs).filter(id => attrs[id].band === band);
    const n = ids.length;
    const rows = Math.ceil(n / 2);
    const topY = bandTop + 34;
    const botY = bandTop + bandH - 30;   // leave room for the label below the last circle
    for (let i = 0; i < n; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      attrs[ids[i]].x = x + (col === 0 ? -colDX : colDX);
      attrs[ids[i]].y = rows <= 1 ? bandTop + bandH / 2 : topY + row * ((botY - topY) / (rows - 1));
    }
  };
  place('rt', rtX);
  place('dt', dtX);
  return { top, detailH, bandTop, bandBottom, bandH, rtX, dtX };
}

function visibleBand(b) { return filter === 'both' || filter === b; }

function draw() {
  updateCanvasSize();
  const L = layout();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  // bands
  if (visibleBand('rt')) { noStroke(); fill(187, 222, 251, 90); rect(margin, L.bandTop, canvasWidth / 2 - margin - 4, L.bandH, 10); }
  if (visibleBand('dt')) { noStroke(); fill(255, 224, 178, 110); rect(canvasWidth / 2 + 4, L.bandTop, canvasWidth / 2 - margin - 4, L.bandH, 10); }

  fill('black'); textAlign(CENTER, TOP); textSize(18);
  text('Quality Attribute Taxonomy & Conflicts', canvasWidth / 2, 12);
  textSize(12); fill(21, 101, 192);
  if (visibleBand('rt')) text('Runtime', canvasWidth * 0.26, 34);
  fill(239, 108, 0);
  if (visibleBand('dt')) text('Development-Time', canvasWidth * 0.74, 34);

  // conflict lines (hidden in quiz mode)
  if (!quizMode) {
    for (const cf of conflicts) {
      const a = attrs[cf.a], b = attrs[cf.b];
      if (!visibleBand(a.band) || !visibleBand(b.band)) continue;
      const sel = selectedConflict === cf;
      stroke(sel ? color(255, 179, 0) : color(220, 60, 60));
      strokeWeight(sel ? 3.5 : 1.6);
      drawingContext.setLineDash([6, 5]);
      line(a.x, a.y, b.x, b.y);
      drawingContext.setLineDash([]);
      noStroke(); fill(sel ? color(200, 130, 0) : color(180, 50, 50));
      textAlign(CENTER, CENTER); textSize(9);
      text(cf.label, (a.x + b.x) / 2, (a.y + b.y) / 2 - 6);
    }
  }

  // attribute circles
  for (const id of Object.keys(attrs)) {
    const a = attrs[id];
    if (!visibleBand(a.band)) continue;
    const base = a.band === 'rt' ? [33, 150, 243] : [239, 108, 0];
    const isSel = selectedAttr === id;
    const inQuiz = quizPick.indexOf(id) >= 0;
    stroke(isSel || inQuiz ? color(255, 179, 0) : color(base[0], base[1], base[2]));
    strokeWeight(isSel || inQuiz ? 3.5 : 1.5);
    fill(base[0], base[1], base[2], 150);
    circle(a.x, a.y, 26);
    noStroke(); fill(20); textAlign(CENTER, TOP); textSize(9.5);
    text(a.name, a.x, a.y + 15, 96);
  }

  drawDetail(L);
  drawControlHint();
}

function drawDetail(L) {
  const y = drawHeight - L.detailH;
  const h = L.detailH - 8;
  fill(255, 255, 255, 240); stroke(200); strokeWeight(1);
  rect(margin, y, canvasWidth - margin * 2, h, 8);
  noStroke();
  fill(30, 60, 120); textAlign(LEFT, TOP); textSize(14);
  let head = 'Click an attribute or a conflict line', body;
  if (quizMode) {
    head = 'Quiz Mode';
    body = quizMsg || 'Conflict lines are hidden. Click two attributes you think commonly conflict. ' +
      'A correct pair turns gold; an incorrect pair is explained.';
  } else if (selectedConflict) {
    const cf = selectedConflict;
    head = attrs[cf.a].name + ' ↔ ' + attrs[cf.b].name + ' (conflict)';
    body = 'Tradeoff: ' + cf.tradeoff + '\nExample: ' + cf.example + '\nMitigation: ' + cf.mitigation;
  } else if (selectedAttr) {
    const a = attrs[selectedAttr];
    head = a.name + '  (' + (a.band === 'rt' ? 'Runtime' : 'Development-Time') + ')';
    body = a.def + '\nExample measure: ' + a.measure;
  } else {
    body = 'Runtime attributes (blue) are observable while the system runs; development-time ' +
      'attributes (orange) are about changing and maintaining it. Red dashed lines mark common conflicts.';
  }
  text(head, margin + 12, y + 8);
  fill(55); textSize(12.5);
  text(body, margin + 12, y + 30, canvasWidth - margin * 2 - 24, h - 36);
}

function drawControlHint() {
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(12);
  text(quizMode ? 'Quiz: click two conflicting attributes.' : 'Click circles and red lines to explore.',
    320, drawHeight + 25);
}

function pointSegDist(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  let t = len2 ? ((px - x1) * dx + (py - y1) * dy) / len2 : 0;
  t = constrain(t, 0, 1);
  return dist(px, py, x1 + t * dx, y1 + t * dy);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  // attributes first
  for (const id of Object.keys(attrs)) {
    const a = attrs[id];
    if (!visibleBand(a.band)) continue;
    if (dist(mouseX, mouseY, a.x, a.y) < 15) {
      if (quizMode) return handleQuizPick(id);
      selectedAttr = id; selectedConflict = null; return;
    }
  }
  if (quizMode) return;
  // conflict lines
  for (const cf of conflicts) {
    const a = attrs[cf.a], b = attrs[cf.b];
    if (!visibleBand(a.band) || !visibleBand(b.band)) continue;
    if (pointSegDist(mouseX, mouseY, a.x, a.y, b.x, b.y) < 6) {
      selectedConflict = cf; selectedAttr = null; return;
    }
  }
}

function handleQuizPick(id) {
  if (quizPick.indexOf(id) >= 0) return;
  quizPick.push(id);
  if (quizPick.length === 2) {
    const [x, y] = quizPick;
    const match = conflicts.find(c => (c.a === x && c.b === y) || (c.a === y && c.b === x));
    if (match) quizMsg = 'Correct! ' + attrs[x].name + ' ↔ ' + attrs[y].name + ': ' + match.tradeoff;
    else quizMsg = attrs[x].name + ' and ' + attrs[y].name + ' are not a commonly cited conflict pair. Try again.';
    quizPick = match ? [x, y] : [];
    if (!match) quizPick = [];
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
