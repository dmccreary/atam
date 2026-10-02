// Saga Pattern Flow Simulator (choreography-based saga)
// CANVAS_HEIGHT: 500
// Bloom L3 (Apply): students TRACE an order-placement saga one local transaction at a time,
// inject a failure at any step, and work out which compensating transactions must run and
// what state each service is left in. Step-through (Next Step / Inject Failure / Reset)
// with every service state and event payload visible; no continuous animation.
//
// Notation: T1..T5 are the forward local transactions, C1..C3 their compensating
// transactions. Order numbers, amounts, and IDs are illustrative.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const SVC = ['order', 'inventory', 'payment', 'shipping'];
const NAMES = { order: 'Order Service', inventory: 'Inventory Service', payment: 'Payment Service', shipping: 'Shipping Service' };
const SHORT = { order: 'Order', inventory: 'Inventory', payment: 'Payment', shipping: 'Shipping' };

const STATUS_COLORS = {
  'Pending': [120, 144, 156],
  'Processing': [25, 118, 210],
  'Committed': [46, 125, 50],
  'Failed': [198, 40, 40],
  'Compensating': [239, 108, 0],
  'Compensated': [97, 97, 97]
};
const SAGA_COLORS = {
  'Not started': [120, 144, 156],
  'In progress': [25, 118, 210],
  'Succeeded': [46, 125, 50],
  'Compensating': [239, 108, 0],
  'Failed (compensated)': [198, 40, 40]
};
const FORWARD = [25, 118, 210];
const COMP = [211, 47, 47];

const INITIAL = {
  order: { status: 'Pending', txn: 'T1: create order', data: 'No order yet' },
  inventory: { status: 'Pending', txn: 'T2: reserve stock', data: 'No reservation' },
  payment: { status: 'Pending', txn: 'T3: charge card', data: 'No charge' },
  shipping: { status: 'Pending', txn: 'T4: create shipment', data: 'No shipment' }
};

// Happy path. Each step is one local transaction; `set` is the resulting service state.
const HAPPY = [
  { label: '1', mark: 'T1', actor: 'order', saga: 'In progress',
    text: 'Order Service runs local transaction T1: it creates Order 1042 in state PENDING, commits, and publishes OrderCreated.',
    set: { order: { status: 'Committed', data: 'Order 1042: PENDING' }, inventory: { status: 'Processing' } },
    event: { name: 'OrderCreated', from: 0, to: 1, kind: 'forward',
      payload: ['orderId: 1042', 'customerId: "C-318"', 'items: [{sku: "SKU-7", qty: 2}]', 'total: 59.98'] } },
  { label: '2', mark: 'T2', actor: 'inventory', saga: 'In progress',
    text: 'Inventory Service receives OrderCreated, runs T2 (reserve 2 units), commits, and publishes InventoryReserved.',
    set: { inventory: { status: 'Committed', data: '2 units reserved' }, payment: { status: 'Processing' } },
    event: { name: 'InventoryReserved', from: 1, to: 2, kind: 'forward',
      payload: ['orderId: 1042', 'reservationId: "RSV-381"', 'items: [{sku: "SKU-7", qty: 2}]'] } },
  { label: '3', mark: 'T3', actor: 'payment', saga: 'In progress',
    text: 'Payment Service receives InventoryReserved, runs T3 (charge the card $59.98), commits, and publishes PaymentProcessed.',
    set: { payment: { status: 'Committed', data: 'Charged $59.98' }, shipping: { status: 'Processing' } },
    event: { name: 'PaymentProcessed', from: 2, to: 3, kind: 'forward',
      payload: ['orderId: 1042', 'paymentId: "PAY-905"', 'amount: 59.98'] } },
  { label: '4', mark: 'T4', actor: 'shipping', saga: 'In progress',
    text: 'Shipping Service receives PaymentProcessed, runs T4 (create the shipment), commits, and publishes ShipmentCreated.',
    set: { shipping: { status: 'Committed', data: 'Shipment SHP-77' }, order: { status: 'Processing', txn: 'T5: approve order' } },
    event: { name: 'ShipmentCreated', from: 3, to: 0, kind: 'forward',
      payload: ['orderId: 1042', 'shipmentId: "SHP-77"', 'carrier: "ground"'] } },
  { label: '5', mark: 'T5', actor: 'order', saga: 'Succeeded',
    text: 'Order Service receives ShipmentCreated and runs T5: Order 1042 becomes CONFIRMED. Every local transaction committed, so the saga succeeded with no compensation.',
    set: { order: { status: 'Committed', data: 'Order 1042: CONFIRMED' } } }
];

// Compensation paths, keyed by the service whose local transaction fails.
const FAILURES = {
  inventory: [
    { label: '2a', mark: 'T2 failed', actor: 'inventory', saga: 'Compensating',
      text: 'T2 fails: the item is unavailable. Inventory\'s local transaction aborts, so it has nothing of its own to undo. It publishes InventoryRejected.',
      set: { inventory: { status: 'Failed', data: 'No reservation' }, order: { status: 'Compensating', txn: 'C1: reject order' } },
      event: { name: 'InventoryRejected', from: 1, to: 0, kind: 'comp',
        payload: ['orderId: 1042', 'reason: "ITEM_UNAVAILABLE"'] } },
    { label: '3a', mark: 'C1', actor: 'order', saga: 'Failed (compensated)',
      text: 'Order Service receives InventoryRejected and runs compensating transaction C1: Order 1042 becomes CANCELLED. Only T1 had committed, so only C1 was needed.',
      set: { order: { status: 'Compensated', data: 'Order 1042: CANCELLED' } } }
  ],
  payment: [
    { label: '3a', mark: 'T3 failed', actor: 'payment', saga: 'Compensating',
      text: 'T3 fails: the card is declined. Payment\'s local transaction aborts, so there is nothing to undo in Payment itself. It publishes PaymentFailed.',
      set: { payment: { status: 'Failed', data: 'No charge' }, inventory: { status: 'Compensating', txn: 'C2: release stock' } },
      event: { name: 'PaymentFailed', from: 2, to: 1, kind: 'comp',
        payload: ['orderId: 1042', 'reason: "CARD_DECLINED"'] } },
    { label: '4a', mark: 'C2', actor: 'inventory', saga: 'Compensating',
      text: 'Inventory Service receives PaymentFailed and runs compensating transaction C2: it releases the 2 reserved units and publishes InventoryReleased.',
      set: { inventory: { status: 'Compensated', data: 'Reservation released' }, order: { status: 'Compensating', txn: 'C1: reject order' } },
      event: { name: 'InventoryReleased', from: 1, to: 0, kind: 'comp',
        payload: ['orderId: 1042', 'reservationId: "RSV-381"'] } },
    { label: '5a', mark: 'C1', actor: 'order', saga: 'Failed (compensated)',
      text: 'Order Service receives InventoryReleased and runs C1: Order 1042 becomes CANCELLED. T1 and T2 had committed, so C2 and C1 ran, in reverse order.',
      set: { order: { status: 'Compensated', data: 'Order 1042: CANCELLED' } } }
  ],
  shipping: [
    { label: '4a', mark: 'T4 failed', actor: 'shipping', saga: 'Compensating',
      text: 'T4 fails: no carrier can deliver to the address. Shipping\'s local transaction aborts and it publishes ShipmentFailed.',
      set: { shipping: { status: 'Failed', data: 'No shipment' }, payment: { status: 'Compensating', txn: 'C3: refund charge' } },
      event: { name: 'ShipmentFailed', from: 3, to: 2, kind: 'comp',
        payload: ['orderId: 1042', 'reason: "ADDRESS_UNDELIVERABLE"'] } },
    { label: '5a', mark: 'C3', actor: 'payment', saga: 'Compensating',
      text: 'Payment Service receives ShipmentFailed and runs C3: it refunds $59.98 and publishes PaymentRefunded. A refund is a new transaction, not a rollback; the original charge stays in the history.',
      set: { payment: { status: 'Compensated', data: 'Refunded $59.98' }, inventory: { status: 'Compensating', txn: 'C2: release stock' } },
      event: { name: 'PaymentRefunded', from: 2, to: 1, kind: 'comp',
        payload: ['orderId: 1042', 'paymentId: "PAY-905"', 'refundId: "REF-112"', 'amount: 59.98'] } },
    { label: '6a', mark: 'C2', actor: 'inventory', saga: 'Compensating',
      text: 'Inventory Service receives PaymentRefunded and runs C2: it releases the 2 reserved units and publishes InventoryReleased.',
      set: { inventory: { status: 'Compensated', data: 'Reservation released' }, order: { status: 'Compensating', txn: 'C1: reject order' } },
      event: { name: 'InventoryReleased', from: 1, to: 0, kind: 'comp',
        payload: ['orderId: 1042', 'reservationId: "RSV-381"'] } },
    { label: '7a', mark: 'C1', actor: 'order', saga: 'Failed (compensated)',
      text: 'Order Service receives InventoryReleased and runs C1: Order 1042 becomes CANCELLED. T1, T2, and T3 had committed, so C3, C2, and C1 ran, in reverse order.',
      set: { order: { status: 'Compensated', data: 'Order 1042: CANCELLED' } } }
  ]
};
const FAIL_ORDER = ['inventory', 'payment', 'shipping'];   // which service is "Processing" after happy step 1, 2, 3

let happyDone = 0;      // number of happy-path steps executed
let failSvc = null;     // service whose transaction was made to fail (null = none)
let failDone = 0;       // number of compensation-path steps executed
let nextBtn, failBtn, resetBtn;

// layout (recomputed in layout())
let boxW = 180, boxTop = 76, boxH = 110;
let centers = [0, 0, 0, 0];
const compLaneY = 60, fwdLaneY = 214, retLaneY = 244, panelTop = 258;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const main = document.querySelector('main');
  canvas.parent(main);
  textSize(defaultTextSize);

  nextBtn = createButton('Next Step'); nextBtn.parent(main); nextBtn.mousePressed(nextStep);
  failBtn = createButton('Inject Failure'); failBtn.parent(main); failBtn.mousePressed(injectFailure);
  resetBtn = createButton('Reset'); resetBtn.parent(main); resetBtn.mousePressed(resetSaga);

  layout();
  syncButtons();
  describe('A step-through simulation of a choreography-based saga for placing an order. Four ' +
    'services (Order, Inventory, Payment, Shipping) each run a local transaction and publish an ' +
    'event that triggers the next service. Next Step advances one transaction, Inject Failure makes ' +
    'the service that is currently processing fail, and the compensating transactions then run in ' +
    'reverse order. Each service shows its status and data, and the active event shows its payload.', LABEL);
}

function layout() {
  const gap = canvasWidth < 520 ? 6 : 12;
  boxW = (canvasWidth - margin * 2 - gap * 3) / 4;
  for (let i = 0; i < 4; i++) centers[i] = margin + boxW / 2 + i * (boxW + gap);
  nextBtn.position(10, drawHeight + 13);
  failBtn.position(98, drawHeight + 13);
  resetBtn.position(205, drawHeight + 13);
}

// ---------- saga model ----------
function executedSteps() {
  return HAPPY.slice(0, happyDone).concat(failSvc ? FAILURES[failSvc].slice(0, failDone) : []);
}

function currentState() {
  const st = {};
  for (const k of SVC) st[k] = Object.assign({}, INITIAL[k]);
  for (const step of executedSteps()) {
    for (const k in step.set) Object.assign(st[k], step.set[k]);
  }
  return st;
}

function sagaFinished() {
  return failSvc ? failDone >= FAILURES[failSvc].length : happyDone >= HAPPY.length;
}

// The service whose forward transaction is about to run and may be made to fail.
function failableService() {
  if (failSvc || happyDone < 1 || happyDone > 3) return null;
  return FAIL_ORDER[happyDone - 1];
}

function nextStep() {
  if (sagaFinished()) return;
  if (failSvc) failDone++; else happyDone++;
  syncButtons();
}

function injectFailure() {
  const svc = failableService();
  if (!svc) return;
  failSvc = svc;
  failDone = 1;
  syncButtons();
}

function resetSaga() {
  happyDone = 0; failSvc = null; failDone = 0;
  syncButtons();
}

function syncButtons() {
  if (sagaFinished()) nextBtn.attribute('disabled', ''); else nextBtn.removeAttribute('disabled');
  if (failableService()) failBtn.removeAttribute('disabled'); else failBtn.attribute('disabled', '');
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

  const steps = executedSteps();
  const last = steps.length ? steps[steps.length - 1] : null;
  const state = currentState();
  const saga = last ? last.saga : 'Not started';

  drawHeader(saga);
  drawEvents(steps, last);
  drawServices(state, last);
  drawStepPanel(steps, last, saga);
  drawEventPanel(last);
  drawControlHint(steps);
}

function drawHeader(saga) {
  const narrow = canvasWidth < 600;
  noStroke(); fill(25, 45, 90); textAlign(LEFT, TOP); textStyle(BOLD); textSize(narrow ? 14 : 18);
  text(narrow ? 'Saga Flow (Choreography)' : 'Saga Pattern Flow: Choreography', margin, narrow ? 11 : 8);
  // saga state badge
  const c = SAGA_COLORS[saga];
  const label = 'Saga: ' + saga.toUpperCase();
  textSize(narrow ? 11 : 13);
  const w = textWidth(label) + 20;
  fill(c[0], c[1], c[2]); rect(canvasWidth - margin - w, 7, w, 24, 12);
  fill(255); textAlign(CENTER, CENTER); text(label, canvasWidth - margin - w / 2, 19);
  textStyle(NORMAL);
}

function drawServices(state, last) {
  const narrow = boxW < 130;
  for (let i = 0; i < 4; i++) {
    const k = SVC[i], s = state[k];
    const x = centers[i] - boxW / 2;
    const c = STATUS_COLORS[s.status];
    const active = last && last.actor === k;
    fill(active ? color(255, 248, 225) : color(255));
    stroke(c[0], c[1], c[2]); strokeWeight(active ? 3 : 1.5);
    rect(x, boxTop, boxW, boxH, 8);
    noStroke();
    // name
    fill(25, 45, 90); textAlign(CENTER, TOP); textStyle(BOLD); textSize(narrow ? 12 : 14);
    text(narrow ? SHORT[k] : NAMES[k], centers[i], boxTop + 8);
    // status pill
    textSize(narrow ? 9.5 : 11);
    const label = s.status.toUpperCase();
    const pw = Math.min(boxW - 8, textWidth(label) + 16);
    fill(c[0], c[1], c[2]); rect(centers[i] - pw / 2, boxTop + 29, pw, 19, 9);
    fill(255); textAlign(CENTER, CENTER); text(label, centers[i], boxTop + 38.5);
    textStyle(NORMAL);
    // local transaction and data
    fill(70); textAlign(CENTER, TOP); textSize(narrow ? 10.5 : 12);
    text(s.txn, x + 4, boxTop + 55, boxW - 8);
    fill(20); textStyle(BOLD);
    text(s.data, x + 4, boxTop + (narrow ? 81 : 78), boxW - 8);
    textStyle(NORMAL);
  }
}

// Events: forward events run in lanes below the services, failure and compensation
// events in a lane above them, so the two directions never overlap.
function drawEvents(steps, last) {
  // happy-path events that have not happened are drawn as faint dashed placeholders
  for (let i = happyDone; i < HAPPY.length; i++) {
    if (HAPPY[i].event) drawEvent(HAPPY[i], 'future');
  }
  for (const s of steps) {
    if (s.event) drawEvent(s, s === last ? 'active' : 'past');
  }
  // legend for the two arrow colors
  const ly = drawHeight - 13;
  textSize(11.5); textAlign(LEFT, CENTER); noStroke();
  let x = margin + 2;
  arrowLine(x, ly, x + 24, ly, FORWARD, 2); noStroke(); fill(60);
  text('forward event', x + 30, ly); x += 30 + textWidth('forward event') + 16;
  arrowLine(x, ly, x + 24, ly, COMP, 2); noStroke(); fill(60);
  text('failure or compensation event', x + 30, ly);
}

function drawEvent(step, mode) {
  const ev = step.event;
  const base = ev.kind === 'comp' ? COMP : FORWARD;
  const col = mode === 'future' ? [176, 190, 197] : base;
  const sw = mode === 'active' ? 3 : 1.5;
  const boxBottom = boxTop + boxH;
  let xa, xb, laneY, edgeY;
  if (ev.kind === 'comp') {              // leftward, in the lane above the boxes
    xa = centers[ev.from] - 9; xb = centers[ev.to] + 9; laneY = compLaneY; edgeY = boxTop;
  } else if (ev.to > ev.from) {          // rightward, first lane below the boxes
    xa = centers[ev.from] + 14; xb = centers[ev.to] - 14; laneY = fwdLaneY; edgeY = boxBottom;
  } else {                               // ShipmentCreated: back to Order, second lane below
    xa = centers[ev.from] + 14; xb = centers[ev.to] - 14; laneY = retLaneY; edgeY = boxBottom;
  }
  stroke(col[0], col[1], col[2]); strokeWeight(sw); noFill();
  if (mode === 'future') drawingContext.setLineDash([5, 4]);
  line(xa, edgeY, xa, laneY); line(xa, laneY, xb, laneY); line(xb, laneY, xb, edgeY);
  drawingContext.setLineDash([]);
  // arrowhead pointing into the receiving service
  const dir = edgeY < laneY ? -1 : 1;    // -1 = pointing up, 1 = pointing down
  noStroke(); fill(col[0], col[1], col[2]);
  triangle(xb, edgeY, xb - 5, edgeY - dir * 9, xb + 5, edgeY - dir * 9);
  // label: step number plus the event name when it fits
  const span = Math.abs(xb - xa);
  textSize(mode === 'active' ? 12 : 11.5); textStyle(mode === 'active' ? BOLD : NORMAL);
  let label = step.label + '  ' + ev.name;
  if (textWidth(label) > span - 10) label = step.label;
  const mid = (xa + xb) / 2;
  const tw = textWidth(label) + 10;
  fill(240, 248, 255); rect(mid - tw / 2, laneY - 17, tw, 14);
  fill(mode === 'future' ? color(96, 112, 122) : color(col[0] * 0.8, col[1] * 0.8, col[2] * 0.8));
  textAlign(CENTER, BOTTOM); text(label, mid, laneY - 3);
  textStyle(NORMAL);
}

function arrowLine(x1, y1, x2, y2, c, w) {
  stroke(c[0], c[1], c[2]); strokeWeight(w); line(x1, y1, x2 - 4, y2);
  noStroke(); fill(c[0], c[1], c[2]); triangle(x2, y2, x2 - 8, y2 - 4, x2 - 8, y2 + 4);
}

function drawStepPanel(steps, last, saga) {
  const full = canvasWidth - margin * 2;
  const x = margin, y = panelTop, w = Math.round(full * 0.6) - 5, h = drawHeight - panelTop - 28;
  fill(255); stroke(200); strokeWeight(1); rect(x, y, w, h, 8); noStroke();
  let ty = y + 9;
  fill(25, 45, 90); textAlign(LEFT, TOP); textStyle(BOLD); textSize(13.5);
  let head = 'Ready to start';
  if (last) head = failSvc ? 'Step ' + last.label + ' (compensation path)' : 'Step ' + last.label + ' of 5 (happy path)';
  text(fitText(head, w - 20), x + 10, ty); textStyle(NORMAL); ty += 21;
  const body = last ? last.text
    : 'A customer places an order for 2 units. No service holds a lock on another: each one will run its own local transaction and announce the result as an event. Press Next Step.';
  ty = drawWrapped(body, x + 10, ty, w - 20, 12.5, 16, color(25), y + h - 4, false);
  // what comes next
  let hint = '';
  const failable = failableService();
  if (saga === 'Succeeded') hint = 'Reset and try Inject Failure while a service is PROCESSING.';
  else if (saga === 'Failed (compensated)') hint = 'Reset and fail a different step. How many compensations run each time?';
  else if (failable) hint = 'Next: ' + NAMES[failable] + ' runs ' + INITIAL[failable].txn.slice(0, 2) + '. Inject Failure makes it fail instead.';
  else if (failSvc) hint = 'Next Step runs the next compensating transaction.';
  if (hint) ty = drawWrapped(hint, x + 10, ty + 5, w - 20, 12, 15.5, color(120, 70, 0), y + h - 4, false);
  // transaction log: the order in which local and compensating transactions ran
  if (steps.length && ty + 26 < y + h) {
    const log = 'Log:  ' + steps.map(s => s.mark).join('  →  ');
    textSize(12); textStyle(BOLD); noStroke(); fill(25, 45, 90); textAlign(LEFT, BOTTOM);
    text(fitText(log, w - 20), x + 10, y + h - 8);
    textStyle(NORMAL);
  }
}

function drawEventPanel(last) {
  const full = canvasWidth - margin * 2;
  const x = margin + Math.round(full * 0.6) + 5, y = panelTop, w = full - Math.round(full * 0.6) - 5, h = drawHeight - panelTop - 28;
  fill(255); stroke(200); strokeWeight(1); rect(x, y, w, h, 8); noStroke();
  let ty = y + 9;
  fill(25, 45, 90); textAlign(LEFT, TOP); textStyle(BOLD); textSize(13.5);
  text(w < 190 ? 'Event published' : 'Event just published', x + 10, ty); textStyle(NORMAL); ty += 22;
  if (!last || !last.event) {
    const msg = last ? 'None. This step only changes the Order Service\'s own data; the saga ends here.'
      : 'None yet. Each arrow carries an event; its payload appears here.';
    drawWrapped(msg, x + 10, ty, w - 20, 12, 15.5, color(90), y + h - 4, false);
    return;
  }
  const ev = last.event;
  const c = ev.kind === 'comp' ? COMP : FORWARD;
  textSize(12); textStyle(BOLD);
  const name = fitText(ev.name, w - 34);
  const cw = textWidth(name) + 14;
  fill(c[0], c[1], c[2]); rect(x + 10, ty - 2, cw, 20, 5);
  fill(255); textAlign(LEFT, CENTER); text(name, x + 17, ty + 8); textStyle(NORMAL);
  ty += 23;
  fill(90); textAlign(LEFT, TOP); textSize(11.5);
  text(SHORT[SVC[ev.from]] + ' → ' + SHORT[SVC[ev.to]] + (w < 190 ? '' : '  (payload)'), x + 10, ty);
  ty += 17;
  fill(20); textSize(12);
  for (const ln of ev.payload) {
    if (ty + 15 > y + h - 2) break;
    text(fitText(ln, w - 26), x + 16, ty);
    ty += 15.5;
  }
}

function drawControlHint(steps) {
  if (canvasWidth < 640) return;
  const committed = happyDone;
  noStroke(); fill(90); textAlign(LEFT, CENTER); textSize(12);
  const msg = failSvc
    ? 'Failure injected after ' + (committed) + ' committed transaction' + (committed === 1 ? '' : 's') + '.'
    : 'Inject Failure is available while Inventory, Payment, or Shipping is PROCESSING.';
  text(fitText(msg, canvasWidth - 285), 272, drawHeight + controlHeight / 2);
}

// ---------- text helpers ----------
function fitText(str, maxW) {
  if (textWidth(str) <= maxW) return str;
  let s = str;
  while (s.length > 1 && textWidth(s + '…') > maxW) s = s.slice(0, -1);
  return s + '…';
}

// Draw word-wrapped text and return the y just below it. Stops at yLimit.
function drawWrapped(str, x, y, w, size, lineH, col, yLimit, bold) {
  textSize(size); textAlign(LEFT, TOP); textStyle(bold ? BOLD : NORMAL); noStroke(); fill(col);
  const words = str.split(' ');
  let ln = '';
  const lines = [];
  for (const wd of words) {
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
  textStyle(NORMAL);
  return y;
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
