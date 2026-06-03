// Quality Attribute Requirement Construction Workbench
// CANVAS_HEIGHT: 560
// Bloom L3 (Apply): students transform a vague quality statement ("the system must
// be fast") into a well-formed six-component stimulus-response requirement. A live
// Quality Meter scores specificity; the assessment panel detects the quality
// attribute and gives an "ATAM-Ready?" verdict.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 510;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;

const fields = [
  { key: 'source', label: 'Stimulus Source', prompt: 'user, external system, internal timer…' },
  { key: 'stimulus', label: 'Stimulus', prompt: 'submits a request, component fails…' },
  { key: 'env', label: 'Environment', prompt: 'normal load, peak load, degraded mode…' },
  { key: 'artifact', label: 'Artifact', prompt: 'login service, database, API gateway…' },
  { key: 'response', label: 'Response', prompt: 'return results, failover to replica…' },
  { key: 'measure', label: 'Response Measure', prompt: '< Xms at p99, < X% errors, within Xs…' }
];

const examples = {
  Performance: {
    source: 'A patient user', stimulus: 'submits an appointment request',
    env: 'at peak load of 500 concurrent users', artifact: 'the scheduling API',
    response: 'returns a confirmation', measure: 'in under 2s at the p99 latency'
  },
  Availability: {
    source: 'A monitoring system', stimulus: 'detects a primary node failure',
    env: 'during normal operation', artifact: 'the order service cluster',
    response: 'fails over to a replica', measure: 'and resumes within 30 seconds, 99.9% uptime'
  },
  Security: {
    source: 'An unauthenticated attacker', stimulus: 'makes 5 failed login attempts',
    env: 'within 60 seconds', artifact: 'the authentication service',
    response: 'locks the account and logs the event', measure: 'with timestamp and source IP, < 50ms'
  }
};

const genericWords = ['fast', 'slow', 'good', 'bad', 'high', 'low', 'secure', 'quick',
  'reliable', 'scalable', 'better', 'nice', 'robust', 'efficient', 'easy', 'simple', 'fine'];

let inputs = {};
let loadPerf, loadAvail, loadSec, clearBtn;
let displayedScore = 0;

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
    inputs[f.key] = inp;
  }
  positionInputs();

  loadPerf = createButton('Load: Performance');
  loadPerf.position(10, drawHeight + 12);
  loadPerf.mousePressed(() => loadExample('Performance'));
  loadAvail = createButton('Load: Availability');
  loadAvail.position(150, drawHeight + 12);
  loadAvail.mousePressed(() => loadExample('Availability'));
  loadSec = createButton('Load: Security');
  loadSec.position(290, drawHeight + 12);
  loadSec.mousePressed(() => loadExample('Security'));
  clearBtn = createButton('Clear');
  clearBtn.position(410, drawHeight + 12);
  clearBtn.mousePressed(() => { for (const f of fields) inputs[f.key].value(''); });

  describe('A workbench with six input fields for the stimulus-response components of a ' +
    'quality attribute requirement, a live Quality Meter scoring specificity, and an ' +
    'assessment panel detecting the quality attribute and ATAM-readiness.', LABEL);
}

function leftW() { return Math.max(220, canvasWidth * 0.46); }

function positionInputs() {
  const lw = leftW();
  const iw = lw - margin * 2;
  for (let i = 0; i < fields.length; i++) {
    const y = 64 + i * 66;
    inputs[fields[i].key].position(margin, y + 18);
    inputs[fields[i].key].size(iw - 6, 22);
  }
}

function loadExample(name) {
  const ex = examples[name];
  for (const f of fields) inputs[f.key].value(ex[f.key]);
}

function fieldScore(text) {
  const t = (text || '').trim().toLowerCase();
  if (t.length === 0) return 0;
  if (/\d/.test(t) || /(ms|sec|second|minute|hour|%|p9\d|p5\d|users|requests|uptime)/.test(t)) return 15;
  for (const g of genericWords) if (t.split(/\s+/).indexOf(g) >= 0) return 5;
  return t.length > 4 ? 10 : 5;
}

function totalScore() {
  let s = 0;
  for (const f of fields) s += fieldScore(inputs[f.key].value());
  return s;  // max 90
}

function detectQA() {
  const all = fields.map(f => (inputs[f.key].value() || '')).join(' ').toLowerCase();
  if (/(latency|ms|response|p99|throughput|concurrent)/.test(all)) return 'Performance';
  if (/(fail|uptime|recover|failover|availab)/.test(all)) return 'Availability';
  if (/(unauth|attack|login|encrypt|access|audit|secur)/.test(all)) return 'Security';
  if (/(deploy|module|change|modif)/.test(all)) return 'Modifiability';
  if (/(scale|load|10x|autoscal)/.test(all)) return 'Scalability';
  return '—';
}

function draw() {
  updateCanvasSize();
  positionInputs();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(LEFT, TOP); textSize(18);
  text('Quality Attribute Requirement Workbench', margin, 12);
  fill(90); textSize(11);
  text('Turn a vague statement into a measurable stimulus-response scenario.', margin, 36);

  // field labels (inputs are DOM elements drawn on top)
  for (let i = 0; i < fields.length; i++) {
    const y = 64 + i * 66;
    const sc = fieldScore(inputs[fields[i].key].value());
    noStroke();
    fill(200, 160, 0); textAlign(LEFT, TOP); textSize(12.5); textStyle(BOLD);
    text(fields[i].label, margin, y); textStyle(NORMAL);
    // per-field specificity dot
    const dotC = sc >= 15 ? color(76, 175, 80) : (sc >= 10 ? color(249, 168, 37) : (sc > 0 ? color(229, 57, 53) : color(200)));
    fill(dotC); circle(leftW() - margin - 4, y + 6, 11);
  }

  drawMeterAndAssessment();
  drawControlHint();
}

function drawMeterAndAssessment() {
  const x = leftW() + 12;
  const w = canvasWidth - x - margin;
  if (w < 120) return;

  const target = totalScore();
  displayedScore = lerp(displayedScore, target, 0.15);
  const pct = displayedScore / 90 * 100;

  // meter
  noStroke(); fill(30, 60, 120); textAlign(LEFT, TOP); textSize(14);
  text('Quality Meter', x, 64);
  const barX = x, barY = 90, barW = w, barH = 26;
  // zones
  fill(255, 224, 224); rect(barX, barY, barW * 0.4, barH, 6, 0, 0, 6);
  fill(255, 245, 210); rect(barX + barW * 0.4, barY, barW * 0.3, barH);
  fill(224, 245, 224); rect(barX + barW * 0.7, barY, barW * 0.3, barH, 0, 6, 6, 0);
  // fill
  const fillC = pct < 40 ? color(229, 57, 53) : (pct < 70 ? color(249, 168, 37) : color(76, 175, 80));
  fill(fillC); rect(barX, barY, barW * (pct / 100), barH, 6);
  noStroke(); fill(30); textAlign(CENTER, CENTER); textSize(14);
  text(Math.round(pct) + '%', barX + barW / 2, barY + barH / 2);

  // verdict
  let verdict, vc;
  if (target >= 90) { verdict = 'ATAM-Ready — a well-formed scenario'; vc = color(46, 125, 50); }
  else if (target >= 60) { verdict = 'Getting there — add specificity (measures, environment)'; vc = color(200, 140, 0); }
  else { verdict = 'Too vague — stakeholders and architects cannot use this'; vc = color(198, 40, 40); }
  noStroke(); fill(vc); textAlign(LEFT, TOP); textSize(12.5);
  text(verdict, x, barY + barH + 8, w);

  // assessment box
  const ay = barY + barH + 48;
  const ah = drawHeight - ay - 12;
  fill(255, 255, 255, 240); stroke(200); strokeWeight(1);
  rect(x, ay, w, ah, 8); noStroke();
  fill(30, 60, 120); textSize(13); textAlign(LEFT, TOP);
  text('Assessment', x + 10, ay + 8);
  fill(55); textSize(12.5);
  const qa = detectQA();
  const body = 'Detected quality attribute: ' + qa + '\n\n' +
    'A complete requirement names all six parts: who triggers it (source), what happens ' +
    '(stimulus), under what conditions (environment), which element responds (artifact), ' +
    'what it does (response), and how success is measured (response measure). The measure ' +
    'is what makes a scenario testable in ATAM — green dots mark fields with specific, ' +
    'measurable content.';
  text(body, x + 10, ay + 28, w - 20, ah - 34);
}

function drawControlHint() {
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(12);
  text('Load a vague-to-specific example, or type your own and watch the meter.', 470, drawHeight + 25, canvasWidth - 475);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionInputs();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
