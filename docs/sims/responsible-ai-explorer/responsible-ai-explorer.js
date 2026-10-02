// Responsible AI Architecture Components
// CANVAS_HEIGHT: 550
// Bloom L5 (Evaluate): students ASSESS an AI architecture against fifteen responsible AI
// requirements in five dimensions. They add or remove architectural components, watch the
// coverage radar change, and use the gap analysis to judge which unaddressed requirements
// matter most. Static, clickable map: nothing moves unless the student changes the design.
//
// Scenario: a credit-scoring model used in the EU and the US. Creditworthiness evaluation is a
// high-risk use under the EU AI Act, GDPR covers the personal data and automated decisions,
// and the US Equal Credit Opportunity Act (ECOA, Regulation B) covers discrimination and
// adverse action notices. The regulation tags name the law a requirement helps satisfy; they
// are a study aid, not legal advice. Likelihood and impact ratings are illustrative judgments
// for this scenario, not survey data.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const GREEN = [46, 125, 50], RED = [198, 40, 40], NAVY = [25, 45, 90], AMBER = [230, 145, 0];
const DIMS = [
  { id: 'F', name: 'Fairness', col: [123, 31, 162] },
  { id: 'S', name: 'Safety', col: [216, 67, 21] },
  { id: 'T', name: 'Transparency', col: [25, 118, 210] },
  { id: 'A', name: 'Accountability', col: [0, 121, 107] },
  { id: 'P', name: 'Privacy', col: [173, 20, 87] }
];
const REG_NAMES = { G: 'GDPR', E: 'EU AI Act', C: 'ECOA' };

// like = likelihood, imp = impact of leaving the requirement unaddressed (1 low .. 3 high)
const REQS = [
  { id: 'F1', text: 'Training data audited for bias', regs: 'EC', like: 3, imp: 3,
    why: 'EU AI Act Art. 10 requires data governance, including examination for bias; ECOA forbids discrimination in credit.' },
  { id: 'F2', text: 'Fairness metrics gate each release', regs: 'EC', like: 3, imp: 3,
    why: 'Without a gate, a model that disadvantages a protected group ships unnoticed.' },
  { id: 'F3', text: 'Disparate impact monitored in production', regs: 'EC', like: 2, imp: 3,
    why: 'A model that was fair at release can drift into disparate impact as the population changes.' },
  { id: 'S1', text: 'Inputs and outputs screened', regs: 'E', like: 2, imp: 2,
    why: 'EU AI Act Art. 15 asks for accuracy, robustness, and cybersecurity appropriate to the risk.' },
  { id: 'S2', text: 'Adversarial testing before release', regs: 'E', like: 2, imp: 2,
    why: 'EU AI Act Art. 9 requires a risk management system that includes testing.' },
  { id: 'S3', text: 'Human fallback when the model is unsure', regs: 'GE', like: 2, imp: 3,
    why: 'EU AI Act Art. 14 requires human oversight; GDPR Art. 22 gives a right to human intervention in automated decisions.' },
  { id: 'T1', text: 'Each decision can be explained', regs: 'GEC', like: 3, imp: 3,
    why: 'ECOA requires specific reasons in an adverse action notice; GDPR and the EU AI Act give rights to an explanation of automated decisions.' },
  { id: 'T2', text: 'Model purpose and limits documented', regs: 'E', like: 2, imp: 2,
    why: 'EU AI Act Art. 11 and 13 require technical documentation and instructions for use.' },
  { id: 'T3', text: 'People told an AI system is used', regs: 'GE', like: 2, imp: 2,
    why: 'GDPR requires telling people about automated decision-making; the EU AI Act requires informing people subject to a high-risk system.' },
  { id: 'A1', text: 'Lineage: data, code, evaluation recorded', regs: 'E', like: 2, imp: 3,
    why: 'EU AI Act Art. 11 technical documentation depends on knowing what each model was built from.' },
  { id: 'A2', text: 'Every prediction logged for audit', regs: 'E', like: 2, imp: 3,
    why: 'EU AI Act Art. 12 requires automatic record-keeping over the system\'s lifetime.' },
  { id: 'A3', text: 'A named person approves each release', regs: 'E', like: 2, imp: 2,
    why: 'Accountability needs a person, not a pipeline, to answer for putting a model into production.' },
  { id: 'P1', text: 'Personal data minimized', regs: 'G', like: 2, imp: 2,
    why: 'GDPR Art. 5 (data minimisation) and Art. 25 (data protection by design and by default).' },
  { id: 'P2', text: 'Erasure reaches training data', regs: 'G', like: 3, imp: 2,
    why: 'GDPR Art. 17 gives a right to erasure; honoring it means finding the person\'s data in every dataset.' },
  { id: 'P3', text: 'Training resists data leakage', regs: 'G', like: 1, imp: 3,
    why: 'GDPR Art. 25 and 32: a model can memorize and reveal personal data from its training set.' }
];

const COMPS = [
  { id: 'bias', name: ['Bias and fairness', 'testing'], covers: ['F1', 'F2'], on: true,
    purpose: 'Audits training data for representation gaps and evaluates fairness metrics before a model is released.',
    examples: 'Per-group representation reports; demographic parity and equalized odds checks in the evaluation stage.',
    atam: 'Fairness scenarios. A tradeoff point: fairness definitions conflict with each other and with accuracy.' },
  { id: 'fmon', name: ['Fairness', 'monitor'], covers: ['F3'], on: false,
    purpose: 'Tracks outcomes by group in production and raises an alert on disparate impact.',
    examples: 'Approval-rate ratios per group on a dashboard, with alert thresholds.',
    atam: 'Fairness and monitorability. Needs protected attributes, which pulls against data minimization.' },
  { id: 'guard', name: ['Guardrails'], covers: ['S1'], on: true,
    purpose: 'Screens inputs before the model sees them and outputs before anyone acts on them.',
    examples: 'Schema and range validation, content classifiers, rule-based output filters.',
    atam: 'Safety and security. Sits on the request path, so it costs latency on every call.' },
  { id: 'red', name: ['Red-team', 'testing'], covers: ['S2'], on: false,
    purpose: 'Attacks the system on purpose before release to find unsafe behavior.',
    examples: 'Adversarial test suites, perturbation and stress tests run in the release pipeline.',
    atam: 'Safety, robustness, and testability. Slows the release cycle.' },
  { id: 'human', name: ['Human review', 'and fallback'], covers: ['S3'], on: false,
    purpose: 'Routes low-confidence or contested cases to a person and keeps a path that does not depend on the model.',
    examples: 'Confidence thresholds, a review queue, an appeal workflow.',
    atam: 'Safety and availability (a degraded mode). Costs throughput and staff time.' },
  { id: 'xai', name: ['Explainability', 'service'], covers: ['T1'], on: false,
    purpose: 'Produces the reasons behind an individual decision in a form a person can be given.',
    examples: 'SHAP or LIME attributions turned into reason codes for adverse action notices.',
    atam: 'Transparency. Adds compute and latency per decision; may constrain the choice of model.' },
  { id: 'cards', name: ['Model cards and', 'AI disclosure'], covers: ['T2', 'T3'], on: false,
    purpose: 'Documents what the model is for, how it was evaluated, and where it should not be used, and tells people when an AI system is involved.',
    examples: 'A model card per version; a notice in the user interface and in decision letters.',
    atam: 'Transparency and usability. Cheap to build, easy to let go stale.' },
  { id: 'reg', name: ['Model', 'registry'], covers: ['A1', 'A3'], on: true,
    purpose: 'Versions every model together with its data, code, metrics, and the person who approved it.',
    examples: 'A registry with lineage metadata and staged promotion gates.',
    atam: 'Accountability, reproducibility, and modifiability (rollback).' },
  { id: 'audit', name: ['Audit log'], covers: ['A2'], on: true,
    purpose: 'Records every prediction with its inputs, model version, and outcome.',
    examples: 'An append-only decision log with a retention policy.',
    atam: 'Accountability and non-repudiation. Costs storage, and the log itself holds personal data.' },
  { id: 'min', name: ['Data', 'minimization'], covers: ['P1'], on: true,
    purpose: 'Keeps personal data out of the pipeline unless a feature really needs it.',
    examples: 'Field allow-lists, pseudonymization, PII filters at ingestion.',
    atam: 'Privacy. A tradeoff point: fewer features can mean lower accuracy and harder fairness checks.' },
  { id: 'erase', name: ['Lineage and', 'erasure'], covers: ['P2'], on: false,
    purpose: 'Traces where each person\'s data went, so a deletion request reaches every dataset and triggers retraining when needed.',
    examples: 'A data lineage catalog, a deletion pipeline, a retraining trigger.',
    atam: 'Privacy and modifiability. Retraining on demand costs compute.' },
  { id: 'priv', name: ['Private', 'training'], covers: ['P3'], on: false,
    purpose: 'Limits what a trained model can reveal about any one person in its training data.',
    examples: 'Differential privacy noise during training; federated learning that keeps raw data where it was collected.',
    atam: 'Privacy against accuracy and training cost: a tradeoff point.' }
];

let regSelect, gapCheckbox, toggleBtn, resetBtn;
let selected = null;               // selected component id
let reqHits = [], dimHits = [], compHits = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const main = document.querySelector('main');
  canvas.parent(main);
  textSize(defaultTextSize);

  regSelect = createSelect(); regSelect.parent(main);
  for (const o of ['All regulations', 'GDPR', 'EU AI Act', 'ECOA']) regSelect.option(o);
  gapCheckbox = createCheckbox(' Gap analysis', false); gapCheckbox.parent(main);
  gapCheckbox.style('font-size', '13px');
  gapCheckbox.changed(() => { if (gapCheckbox.checked()) selected = null; });
  toggleBtn = createButton('Add to architecture'); toggleBtn.parent(main);
  toggleBtn.mousePressed(() => { const c = comp(selected); if (c) c.on = !c.on; });
  resetBtn = createButton('Reset'); resetBtn.parent(main);
  resetBtn.mousePressed(() => {
    for (const c of COMPS) c.on = DEFAULT_ON.includes(c.id);
    selected = null; gapCheckbox.checked(false); regSelect.selected('All regulations');
  });

  layout();
  describe('A map of responsible AI for a credit-scoring model. On the left, fifteen requirements ' +
    'are grouped under fairness, safety, transparency, accountability, and privacy, each marked as ' +
    'addressed or not. In the middle, twelve architectural components can be selected and added to ' +
    'or removed from the architecture. On the right, a radar chart shows coverage of the five ' +
    'dimensions and bars show coverage per regulation. A gap analysis lists unaddressed ' +
    'requirements by risk and places them on a likelihood by impact matrix.', LABEL);
}
const DEFAULT_ON = COMPS.filter(c => c.on).map(c => c.id);

function layout() {
  const y = drawHeight + 13, narrow = canvasWidth < 660;
  regSelect.position(10, y); regSelect.size(narrow ? 104 : 140);
  const span = gapCheckbox.elt.querySelector('span');
  if (span) span.textContent = narrow ? ' Gaps' : ' Gap analysis';
  gapCheckbox.position(10 + (narrow ? 104 : 140) + 10, y + 1);
  resetBtn.position(canvasWidth - 10 - 56, y);
  toggleBtn.position(canvasWidth - 10 - 56 - 8 - (narrow ? 76 : 172), y);
}

function comp(id) { return COMPS.find(c => c.id === id); }
function addressed(req) { return COMPS.some(c => c.on && c.covers.includes(req.id)); }
function dimOf(req) { return DIMS.find(d => d.id === req.id[0]); }
function regFilter() { return { 'All regulations': '', 'GDPR': 'G', 'EU AI Act': 'E', 'ECOA': 'C' }[regSelect.value()]; }
function closers(req) { return COMPS.filter(c => c.covers.includes(req.id)); }

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

  const narrow = canvasWidth < 660;
  const sel = comp(selected);
  const want = narrow ? (sel && sel.on ? 'Remove' : 'Add') : (sel ? (sel.on ? 'Remove from architecture' : 'Add to architecture') : 'Select a component');
  if (toggleBtn.html() !== want) toggleBtn.html(want);
  if (sel) toggleBtn.removeAttribute('disabled'); else toggleBtn.attribute('disabled', '');

  const done = REQS.filter(addressed).length;
  fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(narrow ? 14 : 18);
  text(narrow ? 'Responsible AI Components' : 'Responsible AI Architecture Components', margin, 10);
  textAlign(RIGHT, TOP); textSize(narrow ? 11.5 : 13.5);
  fill(done === REQS.length ? color(GREEN[0], GREEN[1], GREEN[2]) : color(60));
  text(done + ' of ' + REQS.length + (narrow ? ' met' : ' requirements addressed'), canvasWidth - margin, narrow ? 12 : 13);
  textStyle(NORMAL);

  // which things are lit by the pointer or the selection
  const top = 38, zoneH = 310;
  const full = canvasWidth - margin * 2;
  const aW = narrow ? full * 0.56 : full * 0.41, bW = narrow ? full * 0.44 - 6 : full * 0.29, cW = full - aW - bW - 16;
  const ax = margin, bx = margin + aW + 8, cx = bx + bW + 8;
  const hot = hotSets();

  drawRequirements(ax, top, aW, zoneH, hot, narrow);
  drawComponents(bx, top, bW, zoneH, hot, narrow);
  if (!narrow) drawCoverage(cx, top, cW, zoneH);

  const py = top + zoneH + 6, ph = drawHeight - 8 - py;
  if (sel) drawDetail(sel, margin, py, full, ph);
  else if (gapCheckbox.checked()) drawGaps(margin, py, full, ph, narrow);
  else drawIntro(margin, py, full, ph, hot);

  cursor(hot.any ? HAND : ARROW);
}

// sets of requirement ids and component ids to highlight
function hotSets() {
  const h = { reqs: new Set(), comps: new Set(), col: null, any: false, req: null };
  const inR = r => mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h;
  for (const d of dimHits) if (inR(d)) {
    h.col = d.dim.col; h.any = true;
    for (const r of REQS) if (r.id[0] === d.dim.id) { h.reqs.add(r.id); for (const c of closers(r)) h.comps.add(c.id); }
  }
  for (const q of reqHits) if (inR(q)) {
    h.col = dimOf(q.req).col; h.any = true; h.req = q.req; h.reqs.add(q.req.id);
    for (const c of closers(q.req)) h.comps.add(c.id);
  }
  for (const k of compHits) if (inR(k)) {
    h.any = true; h.comps.add(k.c.id); h.col = DIMS.find(d => d.id === k.c.covers[0][0]).col;
    for (const id of k.c.covers) h.reqs.add(id);
  }
  if (!h.any && selected) { const c = comp(selected); h.comps.add(c.id); for (const id of c.covers) h.reqs.add(id); }
  return h;
}

function drawRequirements(x, y, w, h, hot, narrow) {
  fill(255); stroke(200); strokeWeight(1); rect(x, y, w, h, 8); noStroke();
  reqHits = []; dimHits = [];
  const gap = gapCheckbox.checked(), rf = regFilter();
  const headH = 17, rowH = 14.4, groupGap = 2;
  let ry = y + 7;
  for (const d of DIMS) {
    const reqs = REQS.filter(r => r.id[0] === d.id);
    const n = reqs.filter(addressed).length;
    dimHits.push({ dim: d, x: x + 4, y: ry, w: w - 8, h: headH });
    fill(d.col[0], d.col[1], d.col[2]); rect(x + 6, ry, w - 12, headH - 2, 4);
    fill(255); textAlign(LEFT, CENTER); textStyle(BOLD); textSize(12);
    text(d.name, x + 12, ry + (headH - 2) / 2);
    textAlign(RIGHT, CENTER); textSize(11); text(n + ' of 3', x + w - 12, ry + (headH - 2) / 2); textStyle(NORMAL);
    ry += headH;
    for (const r of reqs) {
      const ok = addressed(r);
      const dimmed = rf && !r.regs.includes(rf);
      const lit = hot.reqs.has(r.id);
      reqHits.push({ req: r, x: x + 4, y: ry, w: w - 8, h: rowH });
      if (lit) { fill(255, 243, 205); rect(x + 5, ry, w - 10, rowH, 3); }
      else if (gap && !ok && !dimmed) { fill(255, 235, 238); rect(x + 5, ry, w - 10, rowH, 3); }
      const a = dimmed ? 70 : 255;
      textSize(narrow ? 10 : 11); textAlign(LEFT, CENTER);
      // status mark
      textStyle(BOLD);
      if (ok) { fill(GREEN[0], GREEN[1], GREEN[2], a); text('✓', x + 9, ry + rowH / 2); }
      else { fill(gap ? color(RED[0], RED[1], RED[2], a) : color(150, 150, 150, a)); text(gap ? '✕' : '○', x + 9, ry + rowH / 2); }
      fill(d.col[0], d.col[1], d.col[2], a); text(r.id, x + 22, ry + rowH / 2); textStyle(NORMAL);
      fill(30, 30, 30, a);
      // regulation tags sit at the right of the row when there is room
      const tags = narrow ? '' : r.regs.split('').map(k => k).join(' ');
      const tagW = tags ? textWidth(tags) + 8 : 0;
      text(fitText(r.text, w - 46 - tagW), x + 40, ry + rowH / 2);
      if (tags) { fill(110, 110, 110, a); textAlign(RIGHT, CENTER); textSize(9.5); text(tags, x + w - 9, ry + rowH / 2 + 0.5); }
      ry += rowH;
    }
    ry += groupGap;
  }
}

function drawComponents(x, y, w, h, hot, narrow) {
  fill(255); stroke(200); strokeWeight(1); rect(x, y, w, h, 8); noStroke();
  compHits = [];
  fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(12);
  text(fitText('Components (click one)', w - 14), x + 8, y + 7); textStyle(NORMAL);
  const cols = 2, rows = 6, gx = 5, gy = 5;
  const tw = (w - 14 - gx) / cols, th = (h - 30 - gy * (rows - 1)) / rows;
  for (let i = 0; i < COMPS.length; i++) {
    const c = COMPS[i], d = DIMS.find(v => v.id === c.covers[0][0]);
    const tx = x + 7 + (i % cols) * (tw + gx), ty = y + 25 + Math.floor(i / cols) * (th + gy);
    compHits.push({ c: c, x: tx, y: ty, w: tw, h: th });
    const lit = hot.comps.has(c.id), isSel = c.id === selected;
    const quiet = hot.comps.size > 0 && !lit;
    const a = quiet ? 80 : 255;
    stroke(isSel ? color(20) : (lit ? color(d.col[0], d.col[1], d.col[2]) : color(d.col[0], d.col[1], d.col[2], c.on ? a : a * 0.6)));
    strokeWeight(isSel ? 2.6 : (lit ? 2.4 : 1.3));
    if (!c.on) drawingContext.setLineDash([4, 3]);
    fill(c.on ? color(lerp(d.col[0], 255, 0.86), lerp(d.col[1], 255, 0.86), lerp(d.col[2], 255, 0.86), a) : color(250, 250, 250, a));
    rect(tx, ty, tw, th, 6); drawingContext.setLineDash([]);
    noStroke();
    fill(c.on ? color(20, 20, 20, a) : color(120, 120, 120, a));
    textAlign(CENTER, CENTER); textSize(narrow ? 9.5 : 10.5); textStyle(c.on ? BOLD : NORMAL);
    const lines = c.name;
    for (let k = 0; k < lines.length; k++) text(fitText(lines[k], tw - 4), tx + tw / 2, ty + th / 2 - 5 + (k - (lines.length - 1) / 2) * 12);
    textStyle(NORMAL);
    // in or out of the architecture
    textSize(9); fill(c.on ? color(GREEN[0], GREEN[1], GREEN[2], a) : color(150, 150, 150, a)); textStyle(BOLD);
    text(c.on ? 'IN' : 'not built', tx + tw / 2, ty + th - 8); textStyle(NORMAL);
  }
}

// radar of coverage per dimension and bars per regulation
function drawCoverage(x, y, w, h) {
  fill(255); stroke(200); strokeWeight(1); rect(x, y, w, h, 8); noStroke();
  fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(12);
  text(fitText('Coverage by dimension', w - 14), x + 8, y + 7); textStyle(NORMAL);
  const cx = x + w / 2, cy = y + 98, R = Math.min(54, w / 2 - 46);
  const ang = i => -HALF_PI + i * TWO_PI / 5;
  // rings at 1, 2, and 3 requirements
  noFill();
  for (let k = 1; k <= 3; k++) {
    stroke(k === 3 ? color(150) : color(215)); strokeWeight(1);
    beginShape(); for (let i = 0; i < 5; i++) vertex(cx + R * k / 3 * Math.cos(ang(i)), cy + R * k / 3 * Math.sin(ang(i))); endShape(CLOSE);
  }
  for (let i = 0; i < 5; i++) { stroke(215); line(cx, cy, cx + R * Math.cos(ang(i)), cy + R * Math.sin(ang(i))); }
  // the covered polygon
  const val = DIMS.map(d => REQS.filter(r => r.id[0] === d.id && addressed(r)).length / 3);
  fill(25, 118, 210, 70); stroke(25, 118, 210); strokeWeight(2);
  beginShape(); for (let i = 0; i < 5; i++) vertex(cx + R * val[i] * Math.cos(ang(i)), cy + R * val[i] * Math.sin(ang(i))); endShape(CLOSE);
  noStroke();
  for (let i = 0; i < 5; i++) {
    const d = DIMS[i];
    fill(d.col[0], d.col[1], d.col[2]); stroke(255); strokeWeight(1);
    circle(cx + R * val[i] * Math.cos(ang(i)), cy + R * val[i] * Math.sin(ang(i)), 7); noStroke();
    // axis labels: top, right, bottom-right, bottom-left, left
    textSize(10.5); textStyle(BOLD);
    const lx = cx + (R + 5) * Math.cos(ang(i)), ly = cy + (R + 5) * Math.sin(ang(i));
    const lbl = d.name + ' ' + Math.round(val[i] * 3) + '/3';
    if (i === 0) { textAlign(CENTER, BOTTOM); text(lbl, cx, ly - 1); }
    else if (i === 1) { textAlign(LEFT, CENTER); text(d.name, lx, ly - 6); text(Math.round(val[i] * 3) + '/3', lx, ly + 6); }
    else if (i === 4) { textAlign(RIGHT, CENTER); text(d.name, lx, ly - 6); text(Math.round(val[i] * 3) + '/3', lx, ly + 6); }
    else if (i === 2) { textAlign(CENTER, TOP); text(lbl, constrain(lx + 4, x + 6 + textWidth(lbl) / 2, x + w - 6 - textWidth(lbl) / 2), ly + 15); }
    else { textAlign(CENTER, TOP); text(lbl, constrain(lx - 4, x + 6 + textWidth(lbl) / 2, x + w - 6 - textWidth(lbl) / 2), ly + 2); }
    textStyle(NORMAL);
  }
  // coverage per regulation
  let by = y + 208;
  fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(12);
  text(fitText('Coverage by regulation', w - 14), x + 8, by); textStyle(NORMAL);
  by += 19;
  const rf = regFilter();
  for (const k of ['G', 'E', 'C']) {
    const reqs = REQS.filter(r => r.regs.includes(k)), n = reqs.filter(addressed).length;
    const a = rf && rf !== k ? 80 : 255;
    fill(30, 30, 30, a); textSize(11); textAlign(LEFT, CENTER); textStyle(rf === k ? BOLD : NORMAL);
    text(k + '  ' + REG_NAMES[k], x + 8, by + 6); textStyle(NORMAL);
    textAlign(RIGHT, CENTER); text(n + ' of ' + reqs.length, x + w - 8, by + 6);
    fill(236, 239, 242, a); rect(x + 8, by + 14, w - 16, 7, 3);
    fill(n === reqs.length ? color(GREEN[0], GREEN[1], GREEN[2], a) : color(25, 118, 210, a));
    rect(x + 8, by + 14, (w - 16) * n / reqs.length, 7, 3);
    by += 27;
  }
}

function drawIntro(x, y, w, h, hot) {
  fill(255); stroke(200); strokeWeight(1); rect(x, y, w, h, 8); noStroke();
  const tx = x + 12, tw = w - 24, limit = y + h - 4;
  let ty = y + 9;
  fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(13.5);
  if (hot.req) {
    const r = hot.req, d = dimOf(r);
    fill(d.col[0], d.col[1], d.col[2]);
    text(fitText(r.id + '  ' + r.text + (addressed(r) ? '  (addressed)' : '  (not addressed)'), tw), tx, ty); textStyle(NORMAL);
    ty += 22;
    ty = drawWrapped(r.why, tx, ty, tw, 12.5, 16, color(30), limit) + 3;
    ty = drawWrapped('Addressed by: ' + closers(r).map(c => c.name.join(' ')).join(', ') + '.   Regulations: ' +
      r.regs.split('').map(k => REG_NAMES[k]).join(', ') + '.', tx, ty, tw, 12.5, 16, color(60), limit);
    return;
  }
  text(fitText('Scenario: a credit-scoring model used in the EU and the US', tw), tx, ty); textStyle(NORMAL);
  ty += 22;
  ty = drawWrapped('Left: fifteen requirements in five dimensions. Middle: the components that address them; solid tiles are ' +
    'in the current architecture, dashed tiles are not built. Point at a dimension, a requirement, or a component to see ' +
    'what maps to what. Click a component to read about it, then add or remove it and watch the coverage change.',
    tx, ty, tw, 12.5, 16, color(30), limit) + 4;
  drawWrapped('G = GDPR, E = EU AI Act, C = ECOA mark the regulation each requirement helps satisfy. A study aid, not legal advice.',
    tx, ty, tw, 11.5, 15, color(100), limit);
}

function drawDetail(c, x, y, w, h) {
  const d = DIMS.find(v => v.id === c.covers[0][0]);
  fill(255); stroke(d.col[0], d.col[1], d.col[2]); strokeWeight(1.5); rect(x, y, w, h, 8); noStroke();
  const tx = x + 12, tw = w - 24, limit = y + h - 4;
  let ty = y + 8;
  fill(d.col[0], d.col[1], d.col[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(13.5);
  text(fitText(c.name.join(' ') + '  ·  ' + (c.on ? 'in the architecture' : 'not built') + '  ·  addresses ' + c.covers.join(', '), tw), tx, ty);
  textStyle(NORMAL); ty += 21;
  const rows = [['Purpose', c.purpose], ['Examples', c.examples], ['ATAM view', c.atam]];
  const labW = canvasWidth >= 660 ? 76 : 0;
  for (const r of rows) {
    if (ty + 15 > limit) break;
    fill(NAVY[0], NAVY[1], NAVY[2]); textStyle(BOLD); textSize(12.5); textAlign(LEFT, TOP); text(r[0], tx, ty); textStyle(NORMAL);
    if (!labW) ty += 15;
    ty = drawWrapped(r[1], tx + labW, ty, tw - labW, 12.5, 15.5, color(30), limit) + 3;
  }
}

// unaddressed requirements ranked by likelihood x impact, and the risk matrix
function drawGaps(x, y, w, h, narrow) {
  fill(255); stroke(RED[0], RED[1], RED[2]); strokeWeight(1.5); rect(x, y, w, h, 8); noStroke();
  const rf = regFilter();
  const gaps = REQS.filter(r => !addressed(r) && (!rf || r.regs.includes(rf))).sort((a, b) => b.like * b.imp - a.like * a.imp);
  const mW = narrow ? 0 : 172;                   // room for the matrix on the right
  const tx = x + 12, tw = w - 24 - mW, limit = y + h - 4;
  let ty = y + 8;
  fill(RED[0], RED[1], RED[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(13.5);
  text(fitText(gaps.length ? 'Gap analysis: ' + gaps.length + ' unaddressed' + (rf ? ' under ' + regSelect.value() : '') + ', highest risk first'
    : 'Gap analysis: no unaddressed requirements' + (rf ? ' under ' + regSelect.value() : ''), tw), tx, ty);
  textStyle(NORMAL); ty += 21;
  const lv = ['', 'low', 'medium', 'high'];
  for (const r of gaps) {
    if (ty + 15 > limit) { break; }
    const d = dimOf(r);
    textSize(12); textAlign(LEFT, TOP); textStyle(BOLD); fill(d.col[0], d.col[1], d.col[2]); text(r.id, tx, ty); textStyle(NORMAL);
    fill(30);
    const tail = '  →  ' + closers(r).map(c => c.name.join(' ')).join(', ');
    const risk = narrow ? '' : '   (' + lv[r.like] + ' likelihood, ' + lv[r.imp] + ' impact)';
    text(fitText(r.text + tail + risk, tw - 24), tx + 24, ty);
    ty += 15.5;
  }
  if (!gaps.length) drawWrapped('Every requirement in view has a component behind it. Coverage is not the same as quality: ' +
    'an ATAM evaluation would still ask how well each component works and what it costs.', tx, ty, tw, 12.5, 16, color(30), limit);
  if (!mW) return;

  // 3 x 3 matrix: likelihood up, impact across
  const mx = x + w - mW + 22, my = y + 10, cell = Math.min(44, (h - 44) / 3), cw = (mW - 36) / 3;
  textSize(10); fill(90); textAlign(CENTER, BOTTOM);
  push(); translate(mx - 10, my + cell * 1.5); rotate(-HALF_PI); text('likelihood', 0, 0); pop();
  textAlign(CENTER, TOP); text('impact', mx + cw * 1.5, my + cell * 3 + 3);
  for (let li = 3; li >= 1; li--) {
    for (let im = 1; im <= 3; im++) {
      const cx = mx + (im - 1) * cw, cy = my + (3 - li) * cell, score = li * im;
      fill(score >= 6 ? color(255, 205, 198) : (score >= 3 ? color(255, 236, 179) : color(220, 240, 222)));
      stroke(255); strokeWeight(1.5); rect(cx, cy, cw, cell, 3); noStroke();
      const ids = gaps.filter(r => r.like === li && r.imp === im).map(r => r.id);
      fill(40); textAlign(CENTER, CENTER); textSize(10.5); textStyle(BOLD);
      // up to two rows of ids per cell
      const perRow = Math.max(1, Math.floor((cw - 4) / 18));
      for (let k = 0; k < Math.min(ids.length, perRow * 2); k += perRow) {
        text(ids.slice(k, k + perRow).join(' '), cx + cw / 2, cy + cell / 2 + (ids.length > perRow ? (k === 0 ? -6 : 6) : 0));
      }
      textStyle(NORMAL);
    }
  }
}

// ---------- text helpers ----------
function fitText(str, maxW) {
  if (textWidth(str) <= maxW) return str;
  let s = str;
  while (s.length > 1 && textWidth(s + '…') > maxW) s = s.slice(0, -1);
  return s + '…';
}

// Draw word-wrapped text and return the y just below it. Stops at yLimit.
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
  if (mouseY > drawHeight || mouseX < 0 || mouseX > canvasWidth) return;
  for (const k of compHits) {
    if (mouseX >= k.x && mouseX <= k.x + k.w && mouseY >= k.y && mouseY <= k.y + k.h) {
      selected = selected === k.c.id ? null : k.c.id;
      return;
    }
  }
  if (mouseY < 354) selected = null;
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
