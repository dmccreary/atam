// ADR Evolution Timeline
// CANVAS_HEIGHT: 586
// Bloom L2 (Understand): students EXPLAIN how Architecture Decision Records document the
// evolution of decisions over time, and how ATAM evaluations generate new or superseding
// ADRs. A two-track timeline (ADR cards above the axis, system events below) with
// relationship arrows and a click-to-read detail panel makes the decision history concrete.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 540;
let controlHeight = 46;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;

const STATUS_COLOR = { Active: [46, 125, 50], Superseded: [239, 124, 0], Deprecated: [120, 120, 120] };

// t in [0,1] across the 3-year span; row 0/1 alternate to avoid horizontal overlap
const adrs = [
  { id: 'ADR-001', t: 0.07, row: 0, status: 'Superseded', title: 'Layered architecture',
    context: 'Small team, MVP scope; speed of delivery matters more than scale.',
    decision: 'Adopt a classic layered architecture (presentation, business, data).',
    consequences: 'Simple and easy to test, but a single deployable that limits independent scaling. Superseded for high-load services by ADR-003.' },
  { id: 'ADR-002', t: 0.17, row: 1, status: 'Active', title: 'REST for external APIs',
    context: 'External partners need broad, well-tooled interoperability.',
    decision: 'All external interfaces use REST/JSON over HTTPS.',
    consequences: 'Maximizes interoperability and tooling; not ideal for low-latency internal calls.' },
  { id: 'ADR-003', t: 0.40, row: 0, status: 'Active', title: 'Microservices migration',
    context: '10x growth requires independent scaling of high-load services.',
    decision: 'Extract high-load services into independently deployable microservices.',
    consequences: 'Independent scaling and deployment; adds network latency and operational complexity. Supersedes ADR-001 for those services.' },
  { id: 'ADR-004', t: 0.56, row: 1, status: 'Active', title: 'Redis cache for auth',
    context: 'ATAM Evaluation #1 flagged authentication latency as an (H,H) risk.',
    decision: 'Add a Redis caching layer in front of the authentication service.',
    consequences: 'Cuts p99 auth latency, but introduces cache invalidation and a new failure mode to monitor.' },
  { id: 'ADR-005', t: 0.74, row: 0, status: 'Active', title: 'WebSocket streaming',
    context: 'A new real-time dashboard feature needs server push.',
    decision: 'Use WebSocket for dashboard event streaming.',
    consequences: 'True real-time updates; stateful connections complicate load balancing (see ADR-006).' },
  { id: 'ADR-006', t: 0.90, row: 1, status: 'Active', title: 'Sticky, health-aware LB',
    context: 'ATAM Evaluation #2 flagged WebSocket connection management as (M,H).',
    decision: 'Sticky load balancing with health-check-aware session persistence.',
    consequences: 'Stable long-lived connections; reduces LB flexibility and needs careful connection draining on deploy.' }
];

const events = [
  { id: 'E1', t: 0.05, row: 0, kind: 'event', label: 'System design begins', triggers: ['ADR-001', 'ADR-002'],
    detail: 'Project kickoff. The first decisions establish the baseline architecture and external interface style.' },
  { id: 'E2', t: 0.33, row: 1, kind: 'event', label: 'Scale-out needed (10x)', triggers: ['ADR-003'],
    detail: 'Growth forecasts demand independent scaling of hot paths, triggering the microservices decision that supersedes part of ADR-001.' },
  { id: 'E3', t: 0.50, row: 0, kind: 'atam', label: 'ATAM Evaluation #1', triggers: ['ADR-004'],
    detail: 'Finding: the authentication service is an (H,H) latency risk. The evaluation directly produces ADR-004.' },
  { id: 'E4', t: 0.70, row: 1, kind: 'event', label: 'Real-time dashboard', triggers: ['ADR-005'],
    detail: 'A new feature requires server-pushed updates, triggering the WebSocket decision (ADR-005).' },
  { id: 'E5', t: 0.86, row: 0, kind: 'atam', label: 'ATAM Evaluation #2', triggers: ['ADR-006'],
    detail: 'Finding: WebSocket connection management is an (M,H) scenario. The evaluation produces ADR-006.' }
];

let selected = null;       // {type:'adr'|'event', obj}
let adrOnly = false;
let adrOnlyBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  adrOnlyBtn = createButton('Show ADR-Only');
  adrOnlyBtn.mousePressed(() => { adrOnly = !adrOnly; adrOnlyBtn.html(adrOnly ? 'Show Events' : 'Show ADR-Only'); });
  adrOnlyBtn.position(10, drawHeight + 10);
  describe('A horizontal timeline across three years with Architecture Decision Record cards ' +
    'above the axis (color-coded by status) and system events below (blue for changes, gold ' +
    'for ATAM evaluations). Arrows link events to the ADRs they triggered; clicking any item ' +
    'opens its full detail.', LABEL);
}

function plotX(t) { return margin + 30 + t * (canvasWidth - margin * 2 - 40); }
function axisY() { return 186; }

function draw() {
  updateCanvasSize();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black'); textAlign(LEFT, TOP); textSize(18);
  text('ADR Evolution Timeline', margin, 10);
  fill(90); textSize(11);
  text('How architectural decisions — and ATAM findings — accumulate as ADRs over three years.', margin, 34);

  drawYearBands();
  drawAxis();
  drawArrows();
  drawAdrCards();
  if (!adrOnly) drawEvents();
  drawDetail();
  drawControlHint();
}

function drawYearBands() {
  const x0 = plotX(0), x1 = plotX(1), w = x1 - x0;
  const top = 54, bot = adrOnly ? axisY() + 14 : 268;
  for (let i = 0; i < 3; i++) {
    noStroke(); fill(i % 2 === 0 ? color(236, 242, 250) : color(228, 236, 246));
    rect(x0 + (w * i) / 3, top, w / 3, bot - top);
    fill(120); textAlign(CENTER, TOP); textSize(11); textStyle(BOLD);
    text('Year ' + (i + 1), x0 + (w * i) / 3 + w / 6, top + 2); textStyle(NORMAL);
  }
}

function drawAxis() {
  stroke(150); strokeWeight(2);
  line(plotX(0), axisY(), plotX(1), axisY());
  noStroke();
}

function adrCardRect(a) {
  const w = 118, h = 40;
  const x = constrain(plotX(a.t) - w / 2, plotX(0), plotX(1) - w);
  const y = a.row === 0 ? 76 : 122;
  return { x, y, w, h };
}
function eventPos(e) {
  return { x: plotX(e.t), y: e.row === 0 ? axisY() + 26 : axisY() + 60 };
}

function drawAdrCards() {
  for (const a of adrs) {
    const r = adrCardRect(a);
    const c = STATUS_COLOR[a.status];
    // stem to axis
    stroke(200); strokeWeight(1);
    line(r.x + r.w / 2, r.y + r.h, r.x + r.w / 2, axisY());
    const isSel = selected && selected.type === 'adr' && selected.obj === a;
    stroke(c[0], c[1], c[2]); strokeWeight(isSel ? 3 : 1.5);
    fill(isSel ? color(c[0], c[1], c[2], 30) : 255);
    rect(r.x, r.y, r.w, r.h, 6);
    noStroke(); fill(c[0], c[1], c[2]); textAlign(LEFT, TOP); textSize(11); textStyle(BOLD);
    text(a.id, r.x + 7, r.y + 5); textStyle(NORMAL);
    fill(60); textSize(9.5);
    text(a.title, r.x + 7, r.y + 19, r.w - 12, 18);
    // status dot
    fill(c[0], c[1], c[2]); circle(r.x + r.w - 9, r.y + 9, 8);
  }
}

function drawEvents() {
  for (const e of events) {
    const p = eventPos(e);
    const c = e.kind === 'atam' ? [212, 160, 23] : [33, 118, 210];
    stroke(200); strokeWeight(1); line(p.x, axisY(), p.x, p.y);
    const isSel = selected && selected.type === 'event' && selected.obj === e;
    // marker
    stroke(255); strokeWeight(1); fill(c[0], c[1], c[2]);
    if (e.kind === 'atam') { // diamond
      push(); translate(p.x, p.y); rotate(QUARTER_PI); rectMode(CENTER); rect(0, 0, 14, 14, 2); rectMode(CORNER); pop();
    } else circle(p.x, p.y, 14);
    if (isSel) { noFill(); stroke(40); strokeWeight(2); circle(p.x, p.y, 22); }
    noStroke(); fill(50); textAlign(CENTER, TOP); textSize(9.5);
    text(e.label, p.x, p.y + 11, 130);
  }
}

function drawArrows() {
  // always-on supersede link: ADR-003 supersedes ADR-001
  const a3 = adrs.find(a => a.id === 'ADR-003'), a1 = adrs.find(a => a.id === 'ADR-001');
  drawArrow(adrCardCenter(a3), adrCardCenter(a1), [239, 124, 0], true);
  // selected-driven trigger arrows
  if (selected && selected.type === 'event' && !adrOnly) {
    const e = selected.obj;
    for (const id of e.triggers) {
      const a = adrs.find(x => x.id === id);
      drawArrow(eventPos(e), adrCardCenter(a), [33, 118, 210], false);
    }
  }
  if (selected && selected.type === 'adr' && !adrOnly) {
    const a = selected.obj;
    const e = events.find(ev => ev.triggers.includes(a.id));
    if (e) drawArrow(eventPos(e), adrCardCenter(a), [33, 118, 210], false);
  }
}
function adrCardCenter(a) { const r = adrCardRect(a); return { x: r.x + r.w / 2, y: r.y + r.h / 2 }; }

function drawArrow(from, to, c, dashed) {
  stroke(c[0], c[1], c[2]); strokeWeight(2);
  if (dashed) drawingContext.setLineDash([5, 4]);
  line(from.x, from.y, to.x, to.y);
  drawingContext.setLineDash([]);
  const ang = atan2(to.y - from.y, to.x - from.x);
  push(); translate(to.x, to.y); rotate(ang); noStroke(); fill(c[0], c[1], c[2]);
  triangle(-9, -4, -9, 4, -1, 0); pop();
}

function drawDetail() {
  const x = margin, y0 = 284, w = canvasWidth - margin * 2, h = drawHeight - y0 - 10;
  fill(255); stroke(200); strokeWeight(1); rect(x, y0, w, h, 8); noStroke();
  if (!selected) {
    fill(30, 60, 120); textAlign(LEFT, TOP); textSize(12.5); textStyle(BOLD);
    text('Click an ADR card or an event marker', x + 12, y0 + 10); textStyle(NORMAL);
    fill(70); textSize(12);
    text('ADR cards are color-coded by status: green = Active, orange = Superseded, gray = ' +
      'Deprecated. Blue markers are system changes; gold diamonds are ATAM evaluations. The ' +
      'dashed orange arrow shows ADR-003 superseding ADR-001. Select an event to see which ' +
      'ADRs it triggered.', x + 12, y0 + 32, w - 24);
    return;
  }
  if (selected.type === 'adr') {
    const a = selected.obj, c = STATUS_COLOR[a.status];
    fill(c[0], c[1], c[2]); textAlign(LEFT, TOP); textSize(13.5); textStyle(BOLD);
    text(a.id + ' — ' + a.title + '   [' + a.status + ']', x + 12, y0 + 10); textStyle(NORMAL);
    let yy = y0 + 32;
    yy = detailRow('Context', a.context, x + 12, yy, w - 24);
    yy = detailRow('Decision', a.decision, x + 12, yy, w - 24);
    yy = detailRow('Consequences', a.consequences, x + 12, yy, w - 24);
  } else {
    const e = selected.obj;
    fill(e.kind === 'atam' ? color(180, 130, 10) : color(25, 90, 170));
    textAlign(LEFT, TOP); textSize(13.5); textStyle(BOLD);
    text((e.kind === 'atam' ? '◆ ' : '● ') + e.label, x + 12, y0 + 10); textStyle(NORMAL);
    fill(60); textSize(12);
    text(e.detail, x + 12, y0 + 34, w - 24);
    fill(33, 118, 210); textSize(12); textStyle(BOLD);
    text('Triggered: ' + e.triggers.join(', '), x + 12, y0 + h - 26); textStyle(NORMAL);
  }
}

function detailRow(label, value, x, y, w) {
  noStroke(); fill(184, 134, 11); textAlign(LEFT, TOP); textSize(11.5); textStyle(BOLD);
  text(label, x, y); textStyle(NORMAL);
  fill(55); textSize(12);
  text(value, x + 96, y, w - 96);
  const lines = Math.ceil(textWidth(value) / (w - 96));
  return y + Math.max(20, lines * 15 + 5);
}

function drawControlHint() {
  if (canvasWidth < 560) return;
  noStroke(); fill(90); textAlign(LEFT, CENTER); textSize(11);
  text('Show ADR-Only collapses the events track to the decision history alone.',
    150, drawHeight + controlHeight / 2, canvasWidth - 160);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  for (const a of adrs) {
    const r = adrCardRect(a);
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
      selected = (selected && selected.obj === a) ? null : { type: 'adr', obj: a }; return;
    }
  }
  if (!adrOnly) for (const e of events) {
    const p = eventPos(e);
    if (dist(mouseX, mouseY, p.x, p.y) <= 12) {
      selected = (selected && selected.obj === e) ? null : { type: 'event', obj: e }; return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  adrOnlyBtn.position(10, drawHeight + 10);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
