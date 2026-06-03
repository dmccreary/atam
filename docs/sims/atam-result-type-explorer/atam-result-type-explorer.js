// ATAM Result Type Explorer
// CANVAS_HEIGHT: 556
// Bloom L4 (Analyze): students DIFFERENTIATE architectural decisions into the four ATAM
// result types — sensitivity point, tradeoff point, risk, non-risk — by classifying concrete
// examples and getting immediate feedback with the reasoning behind each correct answer.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 510;
let controlHeight = 46;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;

const TYPES = [
  { key: 'Sensitivity Point', color: [33, 118, 210] },
  { key: 'Tradeoff Point', color: [239, 124, 0] },
  { key: 'Risk', color: [211, 47, 47] },
  { key: 'Non-Risk', color: [46, 125, 50] }
];

const decisions = [
  { text: 'The authentication service uses JWT tokens with a 15-minute expiration, cached in Redis.',
    ctx: 'Scenarios: (H,H) performance and (M,H) security.', answer: 'Tradeoff Point', qas: 'Performance, Security',
    why: 'Caching tokens in Redis improves performance but weakens security if Redis is compromised — one decision that helps one quality attribute and hurts another.',
    doc: 'Document as a tradeoff point; probe both the performance and the security scenario.' },
  { text: 'The search service has no index on product_name, and the (H,H) performance scenario requires a 100ms search response.',
    ctx: 'Scenario: (H,H) performance.', answer: 'Risk', qas: 'Performance',
    why: 'The architecture lacks the tactic (an index) needed to meet the response measure, so the scenario is likely unsatisfied.',
    doc: 'Document as a risk; recommend adding an index and re-testing the 100ms scenario.' },
  { text: 'The checkout service uses a connection pool of 200 connections to the payment database, sized for 3x peak traffic.',
    ctx: 'Provisioning was analyzed against peak load.', answer: 'Non-Risk', qas: 'Performance, Availability',
    why: 'The decision is well-analyzed and adequately provisioned for the scenario — it does not threaten a quality attribute.',
    doc: 'Document as a non-risk; record the sizing rationale so it can be revisited if load grows.' },
  { text: 'The load balancer routes round-robin; switching to least-connections improves average response time by 40%.',
    ctx: 'A single decision with outsized effect.', answer: 'Sensitivity Point', qas: 'Performance',
    why: 'One decision — the load-balancing algorithm — has a disproportionate effect on a single quality attribute (performance).',
    doc: 'Document as a sensitivity point; performance is highly sensitive to this choice.' },
  { text: 'Microservices communicate synchronously: this achieves 50ms P99 latency but the ordering service fails when the inventory service is slow.',
    ctx: 'Scenarios: performance and availability.', answer: 'Tradeoff Point', qas: 'Performance, Availability',
    why: 'Synchronous calls buy low latency (performance) at the cost of availability (coupled failure) — a tradeoff between two attributes.',
    doc: 'Document as a tradeoff point; probe the downstream-slowness failure scenario.' },
  { text: 'The backup restore process has never been tested, and the (H,H) availability scenario requires recovery within 30 minutes.',
    ctx: 'Scenario: (H,H) availability.', answer: 'Risk', qas: 'Availability',
    why: 'Untested recovery is an unknown that very likely fails the 30-minute scenario — a risk until verified.',
    doc: 'Document as a risk; recommend a restore drill to measure actual recovery time.' },
  { text: 'An event-driven architecture provides availability via decoupling but introduces eventual consistency in the order-status view.',
    ctx: 'Scenarios: availability and consistency.', answer: 'Tradeoff Point', qas: 'Availability, Consistency',
    why: 'Decoupling improves availability but degrades consistency — a tradeoff between two quality attributes.',
    doc: 'Document as a tradeoff point; define the acceptable staleness window for order status.' },
  { text: 'The API gateway enforces rate limiting at 1000 req/s per client, and the (H,H) security scenario requires DDoS protection.',
    ctx: 'Scenario: (H,H) security.', answer: 'Non-Risk', qas: 'Security, Availability',
    why: 'The needed tactic (rate limiting) is present and appropriately configured for the scenario — a non-risk.',
    doc: 'Document as a non-risk; note the threshold rationale and monitor for tuning.' }
];

let cur = 0;
let chosen = new Array(decisions.length).fill(-1);
let nextBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  nextBtn = createButton('Next Decision ▶');
  nextBtn.mousePressed(() => { cur = (cur + 1) % decisions.length; });
  nextBtn.position(10, drawHeight + 11);
  describe('A classification activity: an architectural decision card on the left, four ' +
    'classification buttons (Sensitivity Point, Tradeoff Point, Risk, Non-Risk), and a feedback ' +
    'panel that appears after answering with the correct type, the reasoning, and the affected ' +
    'quality attributes. A score tracks correct answers.', LABEL);
}

function leftW() { return Math.max(330, canvasWidth * 0.55); }

function btnRects() {
  const lw = leftW();
  const bw = (lw - margin * 2 - 10) / 2, bh = 40;
  const y0 = 236;
  const out = [];
  for (let i = 0; i < 4; i++) {
    const col = i % 2, row = Math.floor(i / 2);
    out.push({ x: margin + col * (bw + 10), y: y0 + row * (bh + 10), w: bw, h: bh });
  }
  return out;
}

function score() {
  let c = 0, a = 0;
  for (let i = 0; i < decisions.length; i++) if (chosen[i] >= 0) { a++; if (TYPES[chosen[i]].key === decisions[i].answer) c++; }
  return { c, a };
}

function draw() {
  updateCanvasSize();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(LEFT, TOP); textSize(18);
  text('ATAM Result Type Explorer', margin, 10);
  fill(90); textSize(11);
  text('Classify each architectural decision, then check the reasoning.', margin, 34);

  drawCard();
  drawButtons();
  drawFeedback();
  drawProgress();
}

function drawCard() {
  const lw = leftW(), x = margin, y = 56, w = lw - margin, h = 168;
  const d = decisions[cur];
  fill(255); stroke(200); strokeWeight(1); rect(x, y, w, h, 8); noStroke();
  fill(120); textAlign(LEFT, TOP); textSize(11); textStyle(BOLD);
  text('Decision ' + (cur + 1) + ' of ' + decisions.length, x + 12, y + 10); textStyle(NORMAL);
  fill(30, 60, 120); textSize(10.5); text(d.ctx, x + 12, y + 28, w - 24);
  fill(35); textSize(13.5);
  text(d.text, x + 12, y + 52, w - 24, h - 60);
}

function drawButtons() {
  const rects = btnRects();
  const d = decisions[cur];
  const answered = chosen[cur] >= 0;
  for (let i = 0; i < 4; i++) {
    const r = rects[i], t = TYPES[i];
    const isChosen = chosen[cur] === i;
    const isCorrect = t.key === d.answer;
    let bg = color(245), txt = color(t.color[0], t.color[1], t.color[2]), bord = color(t.color[0], t.color[1], t.color[2]);
    if (answered) {
      if (isCorrect) { bg = color(t.color[0], t.color[1], t.color[2]); txt = color(255); }
      else if (isChosen) { bg = color(238); txt = color(150); bord = color(200); }
      else { bg = color(247); txt = color(160); bord = color(215); }
    }
    stroke(bord); strokeWeight(isChosen ? 2.5 : 1.5); fill(bg); rect(r.x, r.y, r.w, r.h, 7);
    noStroke(); fill(txt); textAlign(CENTER, CENTER); textSize(13); textStyle(BOLD);
    text(t.key, r.x + r.w / 2, r.y + r.h / 2); textStyle(NORMAL);
    if (answered && isCorrect) { fill(255); textAlign(RIGHT, TOP); textSize(11); text('✓', r.x + r.w - 7, r.y + 5); }
  }
}

function drawFeedback() {
  const x = leftW() + 8, y = 56, w = canvasWidth - x - margin, h = drawHeight - y - 12;
  fill(255); stroke(200); strokeWeight(1); rect(x, y, w, h, 8); noStroke();
  const d = decisions[cur];
  if (chosen[cur] < 0) {
    fill(30, 60, 120); textAlign(LEFT, TOP); textSize(12.5); textStyle(BOLD);
    text('Make a classification', x + 12, y + 12); textStyle(NORMAL);
    fill(70); textSize(12);
    text('Read the decision and pick the ATAM result type. The reasoning appears here after you answer.', x + 12, y + 34, w - 24);
    // quick reference
    let yy = y + 96;
    fill(120); textSize(10.5); textStyle(BOLD); text('Quick reference', x + 12, yy); textStyle(NORMAL); yy += 18;
    const ref = [['Sensitivity Point', 'one decision strongly affects one QA'],
      ['Tradeoff Point', 'one decision helps one QA, hurts another'],
      ['Risk', 'a decision likely fails a scenario'],
      ['Non-Risk', 'analyzed and adequate for the scenario']];
    for (const r of ref) {
      const t = TYPES.find(tt => tt.key === r[0]);
      fill(t.color[0], t.color[1], t.color[2]); textSize(11); textStyle(BOLD); text(r[0], x + 12, yy); textStyle(NORMAL);
      fill(80); textSize(10.5); text(r[1], x + 12, yy + 14, w - 24); yy += 36;
    }
    return;
  }
  const correct = TYPES[chosen[cur]].key === d.answer;
  const ac = TYPES.find(t => t.key === d.answer).color;
  fill(correct ? color(46, 125, 50) : color(211, 47, 47)); textAlign(LEFT, TOP); textSize(14); textStyle(BOLD);
  text(correct ? '✓ Correct' : '✗ Not quite', x + 12, y + 12); textStyle(NORMAL);
  fill(ac[0], ac[1], ac[2]); textSize(12.5); textStyle(BOLD);
  text('Answer: ' + d.answer, x + 12, y + 34); textStyle(NORMAL);
  fill(184, 134, 11); textSize(11); textStyle(BOLD); text('Why', x + 12, y + 58); textStyle(NORMAL);
  fill(50); textSize(12); let yy = y + 74; text(d.why, x + 12, yy, w - 24); yy += Math.ceil(textWidth(d.why) / (w - 24)) * 15 + 12;
  fill(184, 134, 11); textSize(11); textStyle(BOLD); text('Quality attributes', x + 12, yy); textStyle(NORMAL);
  fill(50); textSize(12); text(d.qas, x + 130, yy); yy += 22;
  fill(184, 134, 11); textSize(11); textStyle(BOLD); text('ATAM documents', x + 12, yy); textStyle(NORMAL);
  fill(50); textSize(12); text(d.doc, x + 12, yy + 16, w - 24);
}

function drawProgress() {
  const s = score();
  noStroke(); fill(40); textAlign(LEFT, CENTER); textSize(12); textStyle(BOLD);
  text('Score: ' + s.c + ' / ' + s.a + ' answered  (' + decisions.length + ' total)', 150, drawHeight + controlHeight / 2); textStyle(NORMAL);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  if (chosen[cur] >= 0) return;   // already answered this card
  const rects = btnRects();
  for (let i = 0; i < 4; i++) {
    const r = rects[i];
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) { chosen[cur] = i; return; }
  }
}

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); nextBtn.position(10, drawHeight + 11); redraw(); }
function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width); canvasWidth = containerWidth;
}
