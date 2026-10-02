// Security Architecture Layers (defense in depth)
// CANVAS_HEIGHT: 575
// Bloom L4 (Analyze): students EXAMINE six defense-in-depth layers drawn as concentric rings
// around the protected data, see which layer stops each of six attacks, remove layers to find
// out which attacks then get further, and use the STRIDE gap finder to see which threat
// categories are covered by several layers and which depend on a single one.
// Static diagram: attack arrows simply end where the first active layer stops them.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const STRIDE_NAMES = { S: 'Spoofing', T: 'Tampering', R: 'Repudiation', I: 'Information disclosure',
  D: 'Denial of service', E: 'Elevation of privilege' };

// Outermost first. `stride` maps a STRIDE letter to how this layer addresses it.
const LAYERS = [
  { id: 'perimeter', name: 'Perimeter', color: [239, 154, 154],
    mech: ['WAF', 'DDoS mitigation', 'IP allowlisting', 'Rate limiting'],
    stride: { D: 'DDoS mitigation and rate limiting keep floods away from the services.',
      T: 'The WAF rejects malicious payloads such as injection strings.' },
    note: 'Filters threats before they reach internal services.' },
  { id: 'transport', name: 'Transport', color: [255, 204, 128],
    mech: ['TLS 1.3', 'mTLS between services', 'Certificate management'],
    stride: { S: 'Certificates prove the identity of servers and, with mTLS, of services.',
      T: 'Integrity protection reveals traffic that was altered in transit.',
      I: 'Encryption in transit hides data from eavesdroppers.' },
    note: 'Protects data while it moves between components.' },
  { id: 'authn', name: 'Authentication', color: [255, 241, 157],
    mech: ['MFA', 'OAuth 2.0 / OIDC', 'mTLS client certificates', 'Session management'],
    stride: { S: 'Verified identity: a stolen password or a claimed identity is not enough.' },
    note: 'Verifies who is calling at every service boundary.' },
  { id: 'authz', name: 'Authorization', color: [128, 203, 196],
    mech: ['RBAC', 'ABAC', 'Permission validation', 'Resource-level access control'],
    stride: { E: 'Every operation is checked against the caller\'s permissions.',
      I: 'Resource-level checks stop one user from reading another\'s data.' },
    note: 'Decides what an authenticated caller may do.' },
  { id: 'data', name: 'Data', color: [144, 202, 249],
    mech: ['Encryption at rest', 'Field-level encryption', 'Tokenization', 'Data masking'],
    stride: { I: 'Stored data stays unreadable even if files or backups are copied.' },
    note: 'Protects the data itself if every outer layer is bypassed.' },
  { id: 'monitoring', name: 'Monitoring', color: [165, 214, 167],
    mech: ['SIEM', 'IDS / IPS', 'Anomaly detection', 'Security event logging', 'Incident response'],
    stride: { R: 'Security event logs tie actions to identities, so they cannot be denied later.' },
    note: 'Detects and responds; it does not block. It is the only layer that tells you the others failed.' }
];
const BLOCKING_ORDER = ['perimeter', 'transport', 'authn', 'authz', 'data'];

// `blocks`: layers that stop the attack and how. `partial` marks a layer that only limits it.
const ATTACKS = [
  { n: 1, name: 'Volumetric DDoS', stride: 'D', angle: 200,
    how: 'A botnet floods the site with traffic to exhaust it.',
    blocks: { perimeter: 'DDoS mitigation and rate limiting absorb or drop the flood before it reaches the services.' },
    pass: 'No inner layer can absorb raw traffic volume, so the attack would succeed.',
    success: 'The flood exhausts the service and patients cannot sign in. No inner layer can absorb raw volume.',
    detect: 'Monitoring raises an alert as traffic and error rates spike, but it cannot absorb the load.' },
  { n: 2, name: 'SQL injection via the API', stride: 'T', angle: 160,
    how: 'Crafted input in an API request makes the database run the attacker\'s SQL.',
    blocks: { perimeter: 'WAF rules reject requests that match injection patterns.',
      data: 'Field-level encryption and tokenization: the injected query returns ciphertext for the most sensitive fields. Other fields are still exposed.' },
    partial: { data: true },
    pass: 'TLS protects the channel, not the payload, so the attack arrives encrypted. The attacker uses an ordinary account, and the injected SQL runs beneath the application\'s permission checks. (The primary fix, parameterized queries in application code, is not one of these rings.)',
    success: 'The injected query reads or changes patient records.',
    detect: 'Anomaly detection flags the unusual query pattern.' },
  { n: 3, name: 'Credential stuffing', stride: 'S', angle: 110,
    how: 'Bots replay username and password pairs leaked from other sites.',
    blocks: { authn: 'Multi-factor authentication: a correct password alone does not open a session.' },
    pass: 'The attempts look like ordinary HTTPS logins spread across many addresses, so rate limits and TLS let them through.',
    success: 'The attacker signs in as a real patient, and every inner layer now treats the attacker as that patient.',
    detect: 'Anomaly detection flags sign-ins from new devices and locations.' },
  { n: 4, name: 'Stolen token, privilege escalation', stride: 'E', angle: 70,
    how: 'An attacker holding a stolen patient token calls an administrator operation.',
    blocks: { authz: 'Permission validation: the token\'s role does not include the operation, so the request is denied.' },
    pass: 'The token is genuine, so the request passes the perimeter, travels over TLS, and authenticates successfully.',
    success: 'An administrative operation runs on behalf of a patient-level token.',
    detect: 'Security event logs show a patient identity performing administrative actions.' },
  { n: 5, name: 'Database exfiltration after server compromise', short: 'Database exfiltration', stride: 'I', angle: 20,
    how: 'An attacker who already controls a server copies the database files or a backup.',
    blocks: { data: 'Encryption at rest with keys held outside the server: the copied files are unreadable.' },
    pass: 'The attacker is already inside and works below the application, so the perimeter, login, and permission checks are never consulted.',
    success: 'Readable patient records leave the organization.',
    detect: 'The SIEM flags a large, unusual outbound transfer.' },
  { n: 6, name: 'Eavesdropping on the network', stride: 'I', angle: 340,
    how: 'An attacker on the network path listens to, or alters, traffic between a patient and the portal.',
    blocks: { transport: 'TLS 1.3 encrypts and authenticates the channel, so intercepted traffic is unreadable and cannot be changed unnoticed.' },
    pass: 'The attacker never sends a request to the perimeter; the attack happens on the wire.',
    success: 'Passwords, tokens, and records are read in transit.',
    detect: null }
];

let layerBoxes = [], gapSelect, restoreBtn;
let selected = null;            // {kind: 'layer' | 'attack', i}
let hitRects = [];
let ring = { cx: 0, cy: 0, R: 0, w: 0 };
let wide = true;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const main = document.querySelector('main');
  canvas.parent(main);
  textSize(defaultTextSize);

  for (const l of LAYERS) {
    const cb = createCheckbox(' ' + l.name, true);
    cb.parent(main); cb.style('font-size', '13px');
    layerBoxes.push(cb);
  }
  gapSelect = createSelect(); gapSelect.parent(main);
  gapSelect.option('Gap finder: off');
  for (const k of 'STRIDE') gapSelect.option(k + ': ' + STRIDE_NAMES[k]);
  gapSelect.changed(() => { selected = null; });
  restoreBtn = createButton('Restore all layers'); restoreBtn.parent(main);
  restoreBtn.mousePressed(() => { for (const cb of layerBoxes) cb.checked(true); });

  layout();
  describe('Six concentric rings around the protected patient data show defense in depth. From ' +
    'outside to inside: perimeter, transport, authentication, authorization, data, and monitoring. ' +
    'Six numbered attack arrows come from outside and end at the first ring that stops them. ' +
    'Checkboxes remove individual layers so the arrows travel further, a list reports each attack\'s ' +
    'outcome, and a gap finder menu highlights which layers address a chosen STRIDE category.', LABEL);
}

function layout() {
  wide = canvasWidth >= 660;          // side-by-side fits the usual chapter column (about 690px)
  const colW = Math.min(170, (canvasWidth - 20) / 3);
  const x0 = wide ? 150 : 10;
  for (let i = 0; i < 6; i++) {
    layerBoxes[i].position(x0 + (i % 3) * colW, drawHeight + 9 + Math.floor(i / 3) * 33);
  }
  gapSelect.position(10, drawHeight + 80);
  gapSelect.size(Math.min(215, canvasWidth - 170));
  restoreBtn.position(10 + Math.min(215, canvasWidth - 170) + 10, drawHeight + 80);

  // ring geometry
  const top = 40, availH = drawHeight - top - 6;
  if (wide) {
    ring.R = Math.min(canvasWidth < 760 ? 150 : 178, availH / 2 - 30);
    ring.cx = margin + ring.R + 34; ring.cy = top + availH / 2;
  } else {
    ring.R = Math.min((canvasWidth - 24) / 2 - 30, 138);
    ring.cx = canvasWidth / 2; ring.cy = top + ring.R + 30;
  }
  ring.w = ring.R / 7.5;         // six rings plus a core 1.5 rings wide
}

// ---------- model ----------
function layerOn(id) { return layerBoxes[LAYERS.findIndex(l => l.id === id)].checked(); }
function gapLetter() { const v = gapSelect.value(); return v.startsWith('Gap') ? null : v[0]; }

// Where an attack ends: the first active layer that stops it, or the protected data.
function outcome(a) {
  for (const id of BLOCKING_ORDER) {
    if (a.blocks[id] && layerOn(id)) {
      return { stopped: true, layer: id, partial: !!(a.partial && a.partial[id]), detected: false };
    }
  }
  return { stopped: false, layer: null, partial: false, detected: layerOn('monitoring') && !!a.detect };
}

function layerIndex(id) { return LAYERS.findIndex(l => l.id === id); }
function outerRadius(i) { return ring.R - i * ring.w; }

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
  noStroke(); fill(25, 45, 90); textAlign(LEFT, TOP); textStyle(BOLD); textSize(canvasWidth < 560 ? 14.5 : 18);
  text(canvasWidth < 560 ? 'Defense in Depth: Security Layers' : 'Security Architecture Layers: Defense in Depth', margin, 10);
  textStyle(NORMAL);

  const overlay = !wide && selected !== null;
  if (!overlay) {
    drawRings();
    for (const a of ATTACKS) drawAttack(a);
  }
  if (wide) drawPanel(ring.cx + ring.R + 42, 40, canvasWidth - margin - (ring.cx + ring.R + 42), drawHeight - 48);
  else if (overlay) drawPanel(margin, 40, canvasWidth - margin * 2, drawHeight - 48);
  else drawCompactList();

  // control labels
  noStroke(); fill(40); textAlign(LEFT, CENTER); textSize(13);
  if (wide) { textStyle(BOLD); text('Active layers:', 12, drawHeight + 19); textStyle(NORMAL);
    fill(100); textSize(11.5); text('(uncheck to remove)', 12, drawHeight + 52); }
  if (canvasWidth >= 640) {
    fill(100); textSize(12);
    text(fitText('Click a ring or an attack number for details.', canvasWidth - 400), 390, drawHeight + 91);
  }
  let over = !wide && selected !== null && mouseY < drawHeight && mouseY > 0;
  for (const r of hitRects) if (inRect(r)) over = true;
  if (!overlay && ringAt(mouseX, mouseY) >= 0) over = true;
  cursor(over ? HAND : ARROW);
}

function drawRings() {
  const gap = gapLetter();
  for (let i = 0; i < 6; i++) {
    const l = LAYERS[i], on = layerBoxes[i].checked();
    const r = outerRadius(i);
    const sel = selected && selected.kind === 'layer' && selected.i === i;
    const addresses = gap && l.stride[gap];
    let c = on ? l.color : [240, 240, 240];
    if (gap && on && !addresses) c = [232, 234, 237];           // gap finder dims layers that do not address it
    fill(c[0], c[1], c[2]);
    if (on) { stroke(sel ? color(25, 45, 90) : color(90, 100, 110)); strokeWeight(sel ? 3 : 1); }
    else { stroke(160); strokeWeight(1); drawingContext.setLineDash([4, 4]); }
    circle(ring.cx, ring.cy, r * 2);
    drawingContext.setLineDash([]);
    if (gap && on && addresses) { noFill(); stroke(25, 45, 90); strokeWeight(3); circle(ring.cx, ring.cy, r * 2 - 3); }
  }
  // core: the protected asset
  const breached = ATTACKS.some(a => !outcome(a).stopped);
  const rc = outerRadius(6);
  fill(breached ? color(198, 40, 40) : color(255)); stroke(60); strokeWeight(1.5);
  circle(ring.cx, ring.cy, rc * 2); noStroke();
  fill(breached ? color(255) : color(25, 45, 90)); textAlign(CENTER, CENTER); textStyle(BOLD);
  textSize(ring.w < 20 ? 9.5 : 12);
  text(breached ? 'BREACH' : 'Patient\ndata', ring.cx, ring.cy);
  // ring labels along the top of each band
  textSize(ring.w < 20 ? 9.5 : 11.5);
  for (let i = 0; i < 6; i++) {
    const on = layerBoxes[i].checked();
    const y = ring.cy - outerRadius(i) + ring.w / 2;
    noStroke(); fill(on ? color(30) : color(150)); textAlign(CENTER, CENTER);
    text(LAYERS[i].name, ring.cx, y);
    if (!on) {
      const tw = textWidth(LAYERS[i].name);
      stroke(150); strokeWeight(1); line(ring.cx - tw / 2 - 2, y, ring.cx + tw / 2 + 2, y); noStroke();
    }
  }
  textStyle(NORMAL);
}

function drawAttack(a) {
  const o = outcome(a);
  const th = radians(a.angle);
  const sel = selected && selected.kind === 'attack' && selected.i === a.n - 1;
  const rStart = ring.R + 20;
  const rEnd = o.stopped ? outerRadius(layerIndex(o.layer)) + 1 : outerRadius(6) + 1;
  const x1 = ring.cx + cos(th) * rStart, y1 = ring.cy + sin(th) * rStart;
  const x2 = ring.cx + cos(th) * rEnd, y2 = ring.cy + sin(th) * rEnd;
  const col = o.stopped ? [230, 81, 0] : [183, 28, 28];
  stroke(col[0], col[1], col[2]); strokeWeight(sel ? 4.5 : 3);
  line(x1, y1, x2 + cos(th) * 8, y2 + sin(th) * 8);
  noStroke(); fill(col[0], col[1], col[2]);
  push(); translate(x2, y2); rotate(th + PI); triangle(0, 0, -11, -6, -11, 6); pop();
  if (o.stopped) {                       // a bar across the arrow where the layer stops it
    stroke(20); strokeWeight(3);
    const px = -sin(th) * 9, py = cos(th) * 9;
    line(x2 + px, y2 + py, x2 - px, y2 - py); noStroke();
  }
  // numbered marker at the outside end
  const d = sel ? 26 : 22;
  fill(col[0], col[1], col[2]); stroke(255); strokeWeight(2); circle(x1, y1, d); noStroke();
  fill(255); textAlign(CENTER, CENTER); textStyle(BOLD); textSize(12.5); text(a.n, x1, y1 + 0.5); textStyle(NORMAL);
  hitRects.push({ kind: 'attack', i: a.n - 1, x: x1 - 14, y: y1 - 14, w: 28, h: 28 });
}

function statusText(a) {
  const o = outcome(a);
  if (o.stopped) return { label: (o.partial ? 'Limited at ' : 'Stopped at ') + LAYERS[layerIndex(o.layer)].name,
    col: o.partial ? [239, 108, 0] : [46, 125, 50] };
  return { label: 'SUCCEEDS' + (o.detected ? ' (detected)' : ' (unseen)'), col: [183, 28, 28] };
}

function drawPanel(x, y, w, h) {
  fill(255); stroke(200); strokeWeight(1); rect(x, y, w, h, 8); noStroke();
  const tx = x + 12, tw = w - 24, limit = y + h - 6;
  let ty = y + 10;
  const gap = gapLetter();
  const closeHint = !wide;

  if (selected && selected.kind === 'attack') {
    const a = ATTACKS[selected.i], o = outcome(a), st = statusText(a);
    textStyle(BOLD); textSize(14);
    ty = drawTitle(a.n + '. ' + (textWidth(a.n + '. ' + a.name) > tw && a.short ? a.short : a.name), tx, ty, tw);
    fill(st.col[0], st.col[1], st.col[2]); textStyle(BOLD); textSize(12.5); textAlign(LEFT, TOP);
    text(st.label, tx, ty); textStyle(NORMAL); ty += 17;
    fill(90); textSize(12); text('STRIDE category: ' + STRIDE_NAMES[a.stride], tx, ty); ty += 19;
    ty = drawLabeled('Attack: ', a.how, tx, ty, tw, limit) + 3;
    if (o.stopped) {
      ty = drawLabeled(LAYERS[layerIndex(o.layer)].name + ': ', a.blocks[o.layer], tx, ty, tw, limit) + 3;
      const outermost = layerIndex(o.layer) === 0;
      ty = drawLabeled(outermost ? 'If this layer were removed: ' : 'Why outer layers let it through: ', a.pass, tx, ty, tw, limit) + 3;
      const first = BLOCKING_ORDER.find(id => a.blocks[id]);
      if (first !== o.layer) ty = drawWrapped('A removed outer layer would have stopped it earlier.', tx, ty, tw, 12.5, 16, color(150, 70, 0), limit) + 3;
      drawWrapped('Try it: uncheck ' + LAYERS[layerIndex(o.layer)].name + ' and watch the arrow.', tx, ty, tw, 12.5, 16, color(90), limit - (closeHint ? 16 : 0));
    } else {
      ty = drawLabeled('Result: ', a.success, tx, ty, tw, limit) + 3;
      const mon = !layerOn('monitoring') ? 'Monitoring is removed, so nobody would know it happened.'
        : (a.detect ? a.detect : 'Passive listening produces no events, so monitoring cannot see it.');
      ty = drawLabeled('Detection: ', mon, tx, ty, tw, limit) + 3;
      drawWrapped('Every layer that could stop this attack has been removed.', tx, ty, tw, 12.5, 16, color(150, 70, 0), limit - (closeHint ? 16 : 0));
    }
  } else if (selected && selected.kind === 'layer') {
    const l = LAYERS[selected.i], on = layerBoxes[selected.i].checked();
    ty = drawTitle(l.name + ' layer' + (on ? '' : ' (removed)'), tx, ty, tw);
    ty = drawWrapped(l.note, tx, ty, tw, 12.5, 16, color(60), limit) + 4;
    ty = drawLabeled('Mechanisms: ', l.mech.join(', ') + '.', tx, ty, tw, limit) + 5;
    fill(25, 45, 90); textStyle(BOLD); textSize(12.5); textAlign(LEFT, TOP);
    text('STRIDE categories it addresses', tx, ty); textStyle(NORMAL); ty += 18;
    for (const k of 'STRIDE') if (l.stride[k]) ty = drawLabeled(STRIDE_NAMES[k] + ': ', l.stride[k], tx, ty, tw, limit) + 2;
    const stops = ATTACKS.filter(a => { const o = outcome(a); return o.stopped && o.layer === l.id; }).map(a => a.n);
    ty += 3;
    const msg = l.id === 'monitoring' ? 'It stops no attack by itself: its job is detection.'
      : (stops.length ? 'Attacks ending here now: ' + stops.join(', ') + '.' : 'No attack ends at this layer right now.');
    drawWrapped(msg, tx, ty, tw, 12.5, 16, color(150, 70, 0), limit - (closeHint ? 16 : 0));
  } else if (gap) {
    ty = drawTitle('Gap finder: ' + STRIDE_NAMES[gap], tx, ty, tw);
    const all = LAYERS.filter(l => l.stride[gap]);
    const active = all.filter(l => layerOn(l.id));
    for (const l of all) {
      const on = layerOn(l.id);
      ty = drawLabeled(l.name + (on ? ': ' : ' (removed): '), l.stride[gap], tx, ty, tw, limit) + 3;
    }
    ty += 4;
    let verdict;
    if (active.length === 0) verdict = 'GAP: no active layer addresses ' + STRIDE_NAMES[gap].toLowerCase() + '.';
    else if (active.length === 1) verdict = 'Only one active layer (' + active[0].name + ') addresses this category. There is no depth: if that layer fails, nothing else covers it.';
    else verdict = active.length + ' active layers address this category, so one can fail without leaving it uncovered.';
    ty = drawWrapped(verdict, tx, ty, tw, 12.5, 16, active.length < 2 ? color(183, 28, 28) : color(27, 94, 32), limit) + 6;
    drawWrapped('Highlighted rings address the category; gray rings do not.', tx, ty, tw, 12, 15.5, color(95), limit);
  } else {
    const stoppedCount = ATTACKS.filter(a => outcome(a).stopped).length;
    ty = drawTitle(stoppedCount + ' of 6 attacks stopped', tx, ty, tw);
    for (const a of ATTACKS) {
      const st = statusText(a);
      const rowH = 34;
      hitRects.push({ kind: 'attack', i: a.n - 1, x: x + 4, y: ty - 2, w: w - 8, h: rowH });
      if (inRect({ x: x + 4, y: ty - 2, w: w - 8, h: rowH })) { fill(236, 242, 250); rect(x + 4, ty - 2, w - 8, rowH, 4); }
      fill(st.col[0], st.col[1], st.col[2]); circle(tx + 9, ty + 9, 18);
      fill(255); textAlign(CENTER, CENTER); textStyle(BOLD); textSize(11); text(a.n, tx + 9, ty + 9.5);
      fill(25); textAlign(LEFT, TOP); textSize(12.5);
      text(textWidth(a.name) > tw - 26 && a.short ? a.short : fitText(a.name, tw - 26), tx + 24, ty);
      fill(st.col[0], st.col[1], st.col[2]); textSize(12); text(st.label, tx + 24, ty + 15);
      textStyle(NORMAL);
      ty += rowH + 2;
    }
    ty += 4;
    drawWrapped('Uncheck a layer below to remove it and see which attacks get further. Then try the gap finder: ' +
      'which STRIDE categories depend on a single layer?', tx, ty, tw, 12.5, 16, color(60), limit);
  }
  if (closeHint) {
    fill(100); textSize(11.5); textAlign(LEFT, BOTTOM); text('Tap anywhere to return to the diagram.', tx, limit);
  }
}

// Narrow layout: outcomes as two compact columns under the rings.
function drawCompactList() {
  const top = ring.cy + ring.R + 38;
  const colW = (canvasWidth - margin * 2) / 2;
  for (let i = 0; i < 6; i++) {
    const a = ATTACKS[i], st = statusText(a);
    const x = margin + (i % 2) * colW, y = top + Math.floor(i / 2) * 20;
    hitRects.push({ kind: 'attack', i: i, x: x, y: y - 2, w: colW - 4, h: 19 });
    noStroke(); fill(st.col[0], st.col[1], st.col[2]); circle(x + 8, y + 8, 16);
    fill(255); textAlign(CENTER, CENTER); textStyle(BOLD); textSize(10.5); text(a.n, x + 8, y + 8.5);
    fill(st.col[0], st.col[1], st.col[2]); textAlign(LEFT, CENTER); textSize(11.5);
    text(fitText(st.label, colW - 26), x + 20, y + 8.5); textStyle(NORMAL);
  }
}

function drawTitle(str, x, y, w) {
  noStroke(); fill(25, 45, 90); textAlign(LEFT, TOP); textStyle(BOLD); textSize(14);
  text(fitText(str, w), x, y); textStyle(NORMAL);
  return y + 23;
}

// ---------- helpers ----------
function ringAt(px, py) {
  if (py > drawHeight) return -1;
  const d = dist(px, py, ring.cx, ring.cy);
  if (d > ring.R || d < outerRadius(6)) return -1;
  return Math.min(5, Math.floor((ring.R - d) / ring.w));
}

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

function drawLabeled(label, body, x, y, w, yLimit) {
  const size = 12.5, lineH = 16;
  textSize(size); textStyle(NORMAL); noStroke(); textAlign(LEFT, TOP);
  const lines = wrapLines(label + body, w);
  for (let i = 0; i < lines.length; i++) {
    if (y + lineH > yLimit) break;
    const lastFit = (y + 2 * lineH > yLimit) && i < lines.length - 1;
    const ln = lastFit ? fitText(lines[i] + ' …', w) : lines[i];
    if (i === 0 && ln.length >= label.length) {
      textStyle(BOLD); fill(20); text(label, x, y);
      const lw = textWidth(label);
      textStyle(NORMAL); fill(30); text(ln.slice(label.length), x + lw, y);
    } else { fill(30); text(ln, x, y); }
    y += lineH;
  }
  return y;
}

// ---------- interaction ----------
function mousePressed() {
  if (mouseY > drawHeight || mouseY < 0 || mouseX < 0 || mouseX > canvasWidth) return;
  if (!wide && selected !== null) { selected = null; return; }      // close the narrow-screen overlay
  for (let i = hitRects.length - 1; i >= 0; i--) {
    const r = hitRects[i];
    if (inRect(r)) {
      selected = (selected && selected.kind === 'attack' && selected.i === r.i) ? null : { kind: 'attack', i: r.i };
      return;
    }
  }
  const ri = ringAt(mouseX, mouseY);
  if (ri >= 0) {
    selected = (selected && selected.kind === 'layer' && selected.i === ri) ? null : { kind: 'layer', i: ri };
    return;
  }
  if (wide) selected = null;
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
