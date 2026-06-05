// Scenario Construction Workbench
// CANVAS_HEIGHT: 590
// Bloom L3 (Apply): students transform a general scenario template into a concrete,
// system-specific quality attribute scenario with a quantitative response measure.
// Five typed scenario families (Performance, Availability, Security, Modifiability,
// Scalability) are selectable as tabs; a live completeness meter scores the six
// components, Evaluate gives per-component feedback, and Save adds to a catalog.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 540;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;

const fields = [
  { key: 'source',   label: 'Source of Stimulus', prompt: 'who or what triggers it' },
  { key: 'stimulus', label: 'Stimulus',           prompt: 'the event that arrives' },
  { key: 'env',      label: 'Environment',         prompt: 'the operating conditions' },
  { key: 'artifact', label: 'Artifact',            prompt: 'the element that responds' },
  { key: 'response', label: 'Response',            prompt: 'what the system does' },
  { key: 'measure',  label: 'Response Measure',    prompt: 'the quantitative success bar' }
];

// One typed scenario family per ATAM quality attribute, with a general template,
// a measure-field hint, and a partially-complete worked example (measure left blank
// so the student must supply the quantitative bar themselves).
const QAS = [
  { key: 'Performance', color: [33, 150, 243],
    template: 'N requests of type X arrive at rate Y; the system must respond within Z ms at the Pnn percentile.',
    hint: '< X ms at p99, X req/s sustained',
    ex: { source: '500 concurrent shoppers', stimulus: 'submit product searches', env: 'during a flash-sale peak', artifact: 'the search service', response: 'return ranked results', measure: '' } },
  { key: 'Availability', color: [76, 175, 80],
    template: 'Component X fails; the system must recover or degrade within T seconds with at most M data loss.',
    hint: 'within X s, 99.9% uptime, 0 data loss',
    ex: { source: 'A health monitor', stimulus: 'detects the primary DB node failing', env: 'during normal operation', artifact: 'the order cluster', response: 'fails over to a standby replica', measure: '' } },
  { key: 'Security', color: [229, 57, 53],
    template: 'An adversarial actor attempts attack type X; the system must detect and respond with Y within Z seconds.',
    hint: 'detect < X s, block, log source IP',
    ex: { source: 'An unauthenticated attacker', stimulus: 'makes repeated failed logins', env: 'against the public API', artifact: 'the auth service', response: 'locks the account and alerts', measure: '' } },
  { key: 'Modifiability', color: [156, 39, 176],
    template: 'A new requirement X must be implemented; the change must be confined to Y modules within Z effort.',
    hint: '<= X modules, <= X person-days',
    ex: { source: 'A product manager', stimulus: 'requests a new payment provider', env: 'at design time', artifact: 'the checkout module', response: 'is added behind the existing interface', measure: '' } },
  { key: 'Scalability', color: [255, 152, 0],
    template: 'Workload increases by N times; the system must scale to handle it within T minutes with P% cost rise.',
    hint: 'handle Nx load, scale < X min, < P% cost',
    ex: { source: 'A marketing campaign', stimulus: 'increases request volume 10x', env: 'over a 5-minute window', artifact: 'the API tier', response: 'auto-scales horizontally', measure: '' } }
];

const genericWords = ['fast', 'slow', 'good', 'bad', 'high', 'low', 'secure', 'quick',
  'reliable', 'scalable', 'better', 'nice', 'robust', 'efficient', 'easy', 'simple', 'fine', 'soon'];

let inputs = {};
let currentQA = 0;
let evaluated = false;
let catalog = [];
let displayedScore = 0;
let loadBtn, evalBtn, saveBtn, clearBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  for (const f of fields) {
    const inp = createInput('');
    inp.attribute('placeholder', f.prompt);
    inp.parent(document.querySelector('main'));
    inp.style('position', 'absolute');
    inp.style('font-size', '13px');
    inp.input(() => { evaluated = false; });
    inputs[f.key] = inp;
  }
  positionInputs();

  loadBtn = createButton('Load Template');
  loadBtn.mousePressed(loadTemplate);
  evalBtn = createButton('Evaluate Scenario');
  evalBtn.mousePressed(() => { evaluated = true; });
  saveBtn = createButton('Save to Catalog');
  saveBtn.mousePressed(saveToCatalog);
  clearBtn = createButton('Clear');
  clearBtn.mousePressed(clearFields);
  positionButtons();

  describe('A workbench for constructing quality attribute scenarios. Five tabs select a ' +
    'scenario family; six fields capture the scenario components; a completeness meter and ' +
    'per-component feedback show whether the scenario is ATAM-ready; scenarios can be saved ' +
    'to a catalog.', LABEL);
}

function leftW() { return Math.max(232, canvasWidth * 0.48); }
function fieldTop() { return 92; }

function positionInputs() {
  const lw = leftW();
  const iw = lw - margin * 2;
  for (let i = 0; i < fields.length; i++) {
    const y = fieldTop() + i * 66;
    inputs[fields[i].key].position(margin, y + 18);
    inputs[fields[i].key].size(iw - 6, 22);
  }
}

function positionButtons() {
  const y = drawHeight + 12;
  loadBtn.position(10, y);
  evalBtn.position(118, y);
  saveBtn.position(248, y);
  clearBtn.position(372, y);
}

function loadTemplate() {
  const ex = QAS[currentQA].ex;
  for (const f of fields) inputs[f.key].value(ex[f.key] || '');
  evaluated = false;
}

function clearFields() {
  for (const f of fields) inputs[f.key].value('');
  evaluated = false;
}

function saveToCatalog() {
  if (totalScore() === 0) return;
  catalog.push({ qa: QAS[currentQA].key, score: Math.round(totalScore() / 90 * 100) });
}

function fieldScore(text) {
  const t = (text || '').trim().toLowerCase();
  if (t.length === 0) return 0;
  if (/\d/.test(t) || /(ms|sec|second|minute|hour|%|p9\d|p5\d|users|requests|req\/s|uptime|x\b)/.test(t)) return 15;
  for (const g of genericWords) if (t.split(/\s+/).indexOf(g) >= 0) return 5;
  return t.length > 4 ? 10 : 5;
}

function totalScore() {
  let s = 0;
  for (const f of fields) s += fieldScore(inputs[f.key].value());
  return s;  // max 90
}

function feedbackFor(f) {
  const sc = fieldScore(inputs[f.key].value());
  if (sc === 0) return { msg: '✗ Empty', c: color(198, 40, 40) };
  if (sc === 5) return { msg: '✗ Too vague', c: color(198, 40, 40) };
  if (f.key === 'measure' && sc < 15) return { msg: '⚠ Add a quantitative measure', c: color(200, 140, 0) };
  if (sc === 10) return { msg: '⚠ Add specifics', c: color(200, 140, 0) };
  return { msg: '✓ Specific', c: color(46, 125, 50) };
}

function draw() {
  updateCanvasSize();
  positionInputs();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(LEFT, TOP); textSize(18);
  text('Scenario Construction Workbench', margin, 10);
  fill(90); textSize(11);
  text('Pick a scenario family, fill the six components, and make the measure quantitative.', margin, 34);

  drawTabs();
  drawFields();
  drawTemplateAndMeter();
  drawControlHint();
}

function drawTabs() {
  const n = QAS.length;
  const tw = (canvasWidth - margin * 2) / n;
  const ty = 54, th = 26;
  textAlign(CENTER, CENTER); textSize(11.5);
  for (let i = 0; i < n; i++) {
    const x = margin + i * tw;
    const active = i === currentQA;
    const c = QAS[i].color;
    noStroke();
    fill(active ? color(c[0], c[1], c[2]) : color(236));
    rect(x + 2, ty, tw - 4, th, 6);
    fill(active ? 255 : 70);
    text(QAS[i].key, x + tw / 2, ty + th / 2);
  }
}

function drawFields() {
  const c = QAS[currentQA].color;
  for (let i = 0; i < fields.length; i++) {
    const f = fields[i];
    const y = fieldTop() + i * 66;
    const sc = fieldScore(inputs[f.key].value());
    noStroke();
    // gold component header (per project convention)
    fill(184, 134, 11); textAlign(LEFT, TOP); textSize(12.5); textStyle(BOLD);
    const labelExtra = (f.key === 'measure') ? '  (e.g. ' + QAS[currentQA].hint + ')' : '';
    text(f.label, margin, y);
    textStyle(NORMAL); fill(150); textSize(10.5);
    if (labelExtra) text(labelExtra, margin + textWidth(f.label) * 0.92 + 6, y + 1);
    // per-field specificity dot
    const dotC = sc >= 15 ? color(76, 175, 80) : (sc >= 10 ? color(249, 168, 37) : (sc > 0 ? color(229, 57, 53) : color(205)));
    noStroke(); fill(dotC); circle(leftW() - margin - 4, y + 6, 11);
    // evaluation feedback under the input
    if (evaluated) {
      const fb = feedbackFor(f);
      noStroke(); fill(fb.c); textAlign(LEFT, TOP); textSize(11);
      text(fb.msg, margin, y + 44);
    }
  }
}

function drawTemplateAndMeter() {
  const x = leftW() + 12;
  const w = canvasWidth - x - margin;
  if (w < 130) return;
  const qa = QAS[currentQA];

  // general template card
  let yy = fieldTop();
  noStroke(); fill(qa.color[0], qa.color[1], qa.color[2]); textAlign(LEFT, TOP); textSize(13);
  text(qa.key + ' — general template', x, yy);
  fill(255); stroke(220); strokeWeight(1);
  rect(x, yy + 20, w, 76, 8); noStroke();
  fill(60); textSize(12);
  text(qa.template, x + 10, yy + 30, w - 20, 64);

  // completeness meter
  yy += 118;
  const target = totalScore();
  displayedScore = lerp(displayedScore, target, 0.15);
  const pct = displayedScore / 90 * 100;
  noStroke(); fill(30, 60, 120); textAlign(LEFT, TOP); textSize(13);
  text('Completeness', x, yy);
  const barY = yy + 20, barH = 24;
  fill(255, 224, 224); rect(x, barY, w * 0.4, barH, 6, 0, 0, 6);
  fill(255, 245, 210); rect(x + w * 0.4, barY, w * 0.3, barH);
  fill(224, 245, 224); rect(x + w * 0.7, barY, w * 0.3, barH, 0, 6, 6, 0);
  const fillC = pct < 40 ? color(229, 57, 53) : (pct < 70 ? color(249, 168, 37) : color(76, 175, 80));
  fill(fillC); rect(x, barY, w * (pct / 100), barH, 6);
  fill(30); textAlign(CENTER, CENTER); textSize(13);
  text(Math.round(pct) + '%', x + w / 2, barY + barH / 2);

  // ATAM-ready indicator
  yy = barY + barH + 12;
  let ready = target >= 90;
  let almost = target >= 60;
  const badgeC = ready ? color(46, 125, 50) : (almost ? color(200, 140, 0) : color(198, 40, 40));
  const badge = ready ? 'ATAM-Ready ✓' : (almost ? 'Almost — add specifics' : 'Not ready — too vague');
  noStroke(); fill(badgeC); rect(x, yy, w, 26, 6);
  fill(255); textAlign(CENTER, CENTER); textSize(13);
  text(badge, x + w / 2, yy + 13);

  // catalog
  yy += 38;
  noStroke(); fill(30, 60, 120); textAlign(LEFT, TOP); textSize(13);
  text('Scenario Catalog (' + catalog.length + ')', x, yy);
  fill(70); textSize(11.5);
  if (catalog.length === 0) {
    text('Save well-formed scenarios here to build a coverage set across quality attributes.', x, yy + 18, w);
  } else {
    let ly = yy + 18;
    const maxShow = Math.min(catalog.length, 6);
    for (let i = catalog.length - maxShow; i < catalog.length; i++) {
      const e = catalog[i];
      text('• ' + e.qa + ' — ' + e.score + '%', x, ly, w);
      ly += 16;
    }
  }
}

function drawControlHint() {
  if (canvasWidth < 560) return;
  noStroke(); fill(90); textAlign(LEFT, CENTER); textSize(11);
  text('Load a template, fill it in, Evaluate, then Save to your catalog.',
    438, drawHeight + controlHeight / 2, canvasWidth - 448);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  // tab hit-testing
  const n = QAS.length;
  const tw = (canvasWidth - margin * 2) / n;
  const ty = 54, th = 26;
  if (mouseY >= ty && mouseY <= ty + th) {
    for (let i = 0; i < n; i++) {
      const x = margin + i * tw;
      if (mouseX >= x + 2 && mouseX <= x + tw - 2) {
        currentQA = i;
        evaluated = false;
        inputs.measure.attribute('placeholder', QAS[i].hint);
        return;
      }
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionInputs();
  positionButtons();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
