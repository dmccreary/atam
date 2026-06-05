// Risk Register Explorer
// CANVAS_HEIGHT: 586
// Bloom L5 (Evaluate): students ASSESS a populated risk register — identify the highest-
// priority risk themes and judge which architectural improvements reduce the most severe risk
// most efficiently. Risks are grouped into themes (expandable), badged by severity and
// probability, sortable by combined priority, with full per-risk documentation on click.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 540;
let controlHeight = 46;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;

const SEVC = { H: [211, 47, 47], M: [245, 124, 0], L: [245, 196, 80] };
function lvl(v) { return v === 'H' ? 3 : (v === 'M' ? 2 : 1); }

const themes = [
  { name: 'No Systematic Resilience Strategy', qa: 'Availability', impact: 'H', open: true, risks: [
    { t: 'No circuit breaker on EHR integration', qa: 'Availability', sev: 'H', prob: 'M', ref: 'AV-001',
      evidence: 'EHR calls are direct and synchronous with no breaker or timeout budget.',
      mech: 'A slow or failing EHR stalls scheduling threads, cascading into a wider outage.',
      mit: 'Add a circuit breaker + timeout and a degraded-mode fallback for scheduling.' },
    { t: 'Synchronous payment call blocks checkout on timeout', qa: 'Availability', sev: 'H', prob: 'H', ref: 'AV-002',
      evidence: 'Checkout awaits the payment gateway with no async path or breaker.',
      mech: 'A payment-gateway slowdown holds checkout threads, failing all checkouts at once.',
      mit: 'Make payment async with a breaker; hold orders pending and confirm out of band.' },
    { t: 'Auth service has no fallback for IdP unavailability', qa: 'Availability', sev: 'H', prob: 'M', ref: 'AV-003',
      evidence: 'A single IdP with no standby; an IdP outage blocks all logins.',
      mech: 'IdP downtime means no authentication, so the whole portal is unusable.',
      mit: 'Add a backup IdP with health-check-based failover (see ADR-006 pattern).' } ] },
  { name: 'Insufficient Load Testing for Peak Season', qa: 'Performance', impact: 'H', open: false, risks: [
    { t: 'Search service untested at 3x normal load', qa: 'Performance', sev: 'H', prob: 'H', ref: 'PE-001',
      evidence: 'Load tests only cover average traffic; peak season is 3x.',
      mech: 'Untested peak behavior risks latency blowups or collapse during the busiest period.',
      mit: 'Run a 3x peak load test and a fitness function gating the 100ms scenario.' },
    { t: 'DB connection pool sized for average, not peak', qa: 'Performance', sev: 'H', prob: 'M', ref: 'PE-002',
      evidence: 'Pool sized to mean concurrency, not the peak-season concurrency.',
      mech: 'At peak, requests queue on pool exhaustion, spiking tail latency.',
      mit: 'Resize the pool for peak concurrency and add saturation alerts.' } ] },
  { name: 'PHI Access Control Coverage Gaps', qa: 'Security', impact: 'H', open: false, risks: [
    { t: 'Bulk export API bypasses per-field access control', qa: 'Security', sev: 'H', prob: 'H', ref: 'SE-001',
      evidence: 'The bulk export path applies row-level but not field-level authorization.',
      mech: 'A user can export PHI fields they could not read individually — a compliance breach.',
      mit: 'Enforce field-level authorization on the export path; add an audited review.' },
    { t: 'Admin audit log misses indirect PHI access via joins', qa: 'Security', sev: 'M', prob: 'H', ref: 'SE-002',
      evidence: 'Audit logging captures direct reads but not PHI surfaced through joins.',
      mech: 'Indirect PHI access is invisible to audit, undermining breach investigations.',
      mit: 'Extend audit capture to query results that surface PHI via joins.' } ] }
];
const nonRisks = [
  'Multi-AZ PostgreSQL failover, drilled quarterly [Availability]',
  'TLS 1.3 + AES-256 for all PHI in transit and at rest [Security]',
  'CDN caching for static assets, 95% hit rate [Performance]',
  'API gateway rate limiting at 1000 req/s per client [Security]',
  'Health-check-based autoscaling on the API tier [Availability]',
  'Read-replica offload for reporting queries [Performance]'
];

let nonOpen = false;
let selected = null;
let sortPriority = false, showMit = false, sevFilter = 'All';
let sortBtn, mitBtn, filterBtn;
const sevCycle = ['All', 'H', 'M', 'L'];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  sortBtn = createButton('Sort by Severity × Probability');
  sortBtn.mousePressed(() => { sortPriority = !sortPriority; sortBtn.html(sortPriority ? 'Original Order' : 'Sort by Severity × Probability'); });
  mitBtn = createButton('Show Mitigation');
  mitBtn.mousePressed(() => { showMit = !showMit; mitBtn.html(showMit ? 'Hide Mitigation' : 'Show Mitigation'); });
  filterBtn = createButton('Severity: All');
  filterBtn.mousePressed(() => { sevFilter = sevCycle[(sevCycle.indexOf(sevFilter) + 1) % sevCycle.length]; filterBtn.html('Severity: ' + sevFilter); });
  positionButtons();
  describe('A risk register grouped into themes. Each theme expands into its constituent ' +
    'risks, badged by severity and probability; clicking a risk shows full documentation. ' +
    'Risks can be sorted by combined priority and filtered by severity, and mitigations toggled.', LABEL);
}

function positionButtons() {
  const y = drawHeight + 11;
  sortBtn.position(10, y); mitBtn.position(232, y); filterBtn.position(360, y);
}

function leftW() { return Math.max(330, canvasWidth * 0.56); }
const ROW_H = 22;
function treeTop() { return 60; }
function treeBottom() { return drawHeight - 52; }

let rows = [];
function buildRows() {
  rows = [];
  for (let ti = 0; ti < themes.length; ti++) {
    const th = themes[ti];
    rows.push({ kind: 'theme', ti, th });
    if (!th.open) continue;
    let rs = th.risks.map((r, ri) => ({ r, ri }));
    if (sortPriority) rs = rs.slice().sort((a, b) => (lvl(b.r.sev) * lvl(b.r.prob)) - (lvl(a.r.sev) * lvl(a.r.prob)));
    for (const x of rs) {
      if (sevFilter !== 'All' && x.r.sev !== sevFilter) continue;
      rows.push({ kind: 'risk', ti, ri: x.ri, r: x.r });
    }
  }
  rows.push({ kind: 'nonhdr' });
  if (nonOpen) for (let i = 0; i < nonRisks.length; i++) rows.push({ kind: 'non', text: nonRisks[i] });
}

function draw() {
  updateCanvasSize();
  buildRows();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(LEFT, TOP); textSize(18);
  text('Risk Register Explorer', margin, 10);
  fill(90); textSize(11);
  text('Assess the register: expand themes, weigh severity × probability, find the biggest wins.', margin, 34);

  drawTree();
  drawDetail();
  drawSummary();
}

function drawTree() {
  const x0 = margin, w = leftW() - margin;
  const top = treeTop();
  const badgeX = x0 + w - 92;
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const y = top + i * ROW_H;
    if (y > treeBottom() - ROW_H) break;
    if (r.kind === 'theme') {
      const imp = r.th.impact, ic = SEVC[imp];
      noStroke(); fill(184, 134, 11); rect(x0, y, w, ROW_H - 2, 4);
      fill(255); textAlign(LEFT, CENTER); textSize(11); textStyle(BOLD);
      text((r.th.open ? '▾ ' : '▸ ') + r.th.name, x0 + 8, y + ROW_H / 2 - 1);
      textStyle(NORMAL); textAlign(RIGHT, CENTER); textSize(9.5);
      text(r.th.qa + ' · ' + r.th.risks.length + ' risks', badgeX - 6, y + ROW_H / 2 - 1);
      fill(ic[0], ic[1], ic[2]); rect(badgeX, y + 3, 70, ROW_H - 8, 3);
      fill(imp === 'L' ? 60 : 255); textAlign(CENTER, CENTER); textSize(9); text('impact ' + imp, badgeX + 35, y + ROW_H / 2 - 1);
    } else if (r.kind === 'risk') {
      const sel = selected && selected.kind === 'risk' && selected.r === r.r;
      if (sel) { noStroke(); fill(232, 240, 254); rect(x0 + 2, y - 1, w - 4, ROW_H, 4); }
      noStroke(); fill(60); textAlign(LEFT, CENTER); textSize(10.5);
      text(truncate('• ' + r.r.t, badgeX - x0 - 30), x0 + 18, y + ROW_H / 2 - 1);
      sevDot(badgeX, y, r.r.sev); sevDot(badgeX + 34, y, r.r.prob);
      fill(120); textAlign(LEFT, CENTER); textSize(7.5); text('S', badgeX + 12, y + ROW_H / 2 - 1); text('P', badgeX + 46, y + ROW_H / 2 - 1);
    } else if (r.kind === 'nonhdr') {
      noStroke(); fill(46, 125, 50); rect(x0, y, w, ROW_H - 2, 4);
      fill(255); textAlign(LEFT, CENTER); textSize(11); textStyle(BOLD);
      text((nonOpen ? '▾ ' : '▸ ') + 'Non-Risks (well-addressed)', x0 + 8, y + ROW_H / 2 - 1);
      textStyle(NORMAL); textAlign(RIGHT, CENTER); textSize(9.5); text(nonRisks.length + ' items', x0 + w - 8, y + ROW_H / 2 - 1);
    } else if (r.kind === 'non') {
      noStroke(); fill(46, 125, 50); circle(x0 + 22, y + ROW_H / 2, 7);
      fill(70); textAlign(LEFT, CENTER); textSize(10); text(truncate(r.text, w - 40), x0 + 32, y + ROW_H / 2 - 1);
    }
  }
}

function sevDot(x, y, v) {
  const c = SEVC[v]; noStroke(); fill(c[0], c[1], c[2]); rect(x, y + 4, 20, ROW_H - 9, 3);
  fill(v === 'L' ? 60 : 255); textAlign(CENTER, CENTER); textSize(9.5); textStyle(BOLD);
  text(v, x + 10, y + ROW_H / 2 - 1); textStyle(NORMAL);
}

function truncate(s, w) {
  if (textWidth(s) <= w) return s;
  let lo = 0, hi = s.length;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (textWidth(s.slice(0, mid) + '…') <= w) lo = mid + 1; else hi = mid; }
  return s.slice(0, Math.max(0, lo - 1)) + '…';
}

function drawDetail() {
  const x = leftW() + 8, y0 = treeTop(), w = canvasWidth - x - margin, h = treeBottom() - y0 + 18;
  fill(255); stroke(200); strokeWeight(1); rect(x, y0, w, h, 8); noStroke();
  if (!selected) {
    fill(30, 60, 120); textAlign(LEFT, TOP); textSize(12.5); textStyle(BOLD); text('Click a risk for full documentation', x + 12, y0 + 10); textStyle(NORMAL);
    fill(70); textSize(12);
    text('Each risk carries a Severity (S) and Probability (P) badge — red H, orange M, yellow L. ' +
      'Sort by Severity × Probability to surface the highest-priority risks, and toggle Show ' +
      'Mitigation to compare recommended fixes. Themes with several high-priority risks are the ' +
      'best targets for an architectural improvement.', x + 12, y0 + 32, w - 24);
    return;
  }
  const r = selected.r, sc = SEVC[r.sev];
  fill(sc[0], sc[1], sc[2]); textAlign(LEFT, TOP); textSize(13.5); textStyle(BOLD);
  text(r.ref + ': ' + r.t, x + 12, y0 + 10, w - 24); textStyle(NORMAL);
  let yy = y0 + 10 + Math.ceil(textWidth(r.ref + ': ' + r.t) / (w - 24)) * 16 + 8;
  fill(60); textSize(11.5);
  text(r.qa + '   ·   Severity ' + r.sev + '   ·   Probability ' + r.prob + '   ·   priority ' + (lvl(r.sev) * lvl(r.prob)), x + 12, yy); yy += 22;
  yy = drow('Evidence', r.evidence, x + 12, yy, w - 24);
  yy = drow('Mechanism', r.mech, x + 12, yy, w - 24);
  if (showMit) {
    fill(46, 125, 50); textSize(11); textStyle(BOLD); text('Recommended mitigation', x + 12, yy); textStyle(NORMAL);
    fill(40); textSize(12); text(r.mit, x + 12, yy + 16, w - 24);
  } else {
    fill(150); textSize(11); textStyle(ITALIC); text('Turn on Show Mitigation to see the recommended fix.', x + 12, yy, w - 24); textStyle(NORMAL);
  }
}

function drow(label, value, x, y, w) {
  fill(184, 134, 11); textAlign(LEFT, TOP); textSize(11); textStyle(BOLD); text(label, x, y); textStyle(NORMAL);
  fill(50); textSize(12); text(value, x, y + 15, w);
  return y + 15 + Math.ceil(textWidth(value) / w) * 15 + 10;
}

function drawSummary() {
  const y = drawHeight - 44;
  noStroke(); fill(245, 248, 252); stroke(215); strokeWeight(1); rect(margin, y, canvasWidth - margin * 2, 34, 8); noStroke();
  let total = 0, byQA = { Availability: 0, Performance: 0, Security: 0 };
  for (const th of themes) for (const r of th.risks) { total++; byQA[r.qa] = (byQA[r.qa] || 0) + 1; }
  fill(40); textAlign(LEFT, CENTER); textSize(11.5); textStyle(BOLD);
  text('Risks: ' + total, margin + 12, y + 17); textStyle(NORMAL);
  fill(70); textSize(11);
  text('(Availability ' + byQA.Availability + ' · Performance ' + byQA.Performance + ' · Security ' + byQA.Security + ')   ·   Non-Risks: ' + nonRisks.length + '   ·   Themes: ' + themes.length,
    margin + 70, y + 17);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  if (mouseX > leftW()) return;
  const i = Math.floor((mouseY - treeTop()) / ROW_H);
  if (i < 0 || i >= rows.length) return;
  const r = rows[i];
  if (r.kind === 'theme') themes[r.ti].open = !themes[r.ti].open;
  else if (r.kind === 'nonhdr') nonOpen = !nonOpen;
  else if (r.kind === 'risk') selected = (selected && selected.r === r.r) ? null : { kind: 'risk', r: r.r };
}

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); positionButtons(); redraw(); }
function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width); canvasWidth = containerWidth;
}
