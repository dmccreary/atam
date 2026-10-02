// API Versioning and Contract-First Design Explorer
// CANVAS_HEIGHT: 540
// Bloom L5 (Evaluate): students ASSESS four API versioning strategies against a scenario
// they choose (system context, quality attribute priority, and whether the change breaks
// consumers), read the recommendation and the tradeoffs it accepts, and check the reasoning
// against each strategy's scores. A contract-first workflow strip shows how compatibility
// is enforced. Scores are qualitative 1-5 teaching ratings, not measurements.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 490;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const BLUE = [25, 103, 192];
const GOLD = [200, 150, 0];
const TEAL = [0, 121, 107];

// mod = modifiability (5 = best), cx = operational complexity (5 = most complex),
// ease = how easy migration is for consumers (5 = nothing to migrate).
// fit = qualitative fit for each system context: [public API, internal services, event streaming].
const STRATEGIES = [
  { id: 'url', name: 'URL versioning', example: 'GET /api/v2/orders/42',
    mod: 3, cx: 2, ease: 3, fit: [5, 3, 3],
    how: 'The version is part of the path: /api/v1/orders, /api/v2/orders. Each version is a separate API surface.',
    pros: 'Simple and explicit; visible in documentation and logs; easy to route and to cache.',
    cons: 'Every live version is a parallel implementation to maintain, and versioned paths pile up.',
    when: 'Public APIs whose consumers you cannot coordinate. For events, the equivalent is a new versioned topic.' },
  { id: 'header', name: 'Header versioning', example: 'X-API-Version: 2',
    mod: 4, cx: 3, ease: 2, fit: [3, 4, 4],
    how: 'The URL stays the same; a request header (or, for events, a message header) selects the version.',
    pros: 'Clean, stable URLs: a resource keeps one identity across versions.',
    cons: 'Routers and caches must inspect the header, and every client has to send it.',
    when: 'Internal services behind a gateway or mesh that can route on headers; event streams that carry a schema version.' },
  { id: 'content', name: 'Content negotiation', example: 'Accept: application/vnd.shop.v2+json',
    cardExample: 'Accept: …/vnd.shop.v2+json',
    mod: 4, cx: 4, ease: 2, fit: [3, 3, 1],
    how: 'The client asks for a versioned media type in the Accept header, and the server answers with that representation.',
    pros: 'The most RESTful option: it versions the representation, not the resource.',
    cons: 'The most complex routing and content-type handling; custom media types are unfamiliar to many clients.',
    when: 'Hypermedia-style HTTP APIs whose teams accept the tooling cost. It has no equivalent for published events.' },
  { id: 'additive', name: 'Additive-only evolution', example: '+ optional fields, nothing removed',
    cardExample: '+ optional fields only',
    mod: 5, cx: 1, ease: 5, fit: [3, 5, 5],
    how: 'Never remove or rename: only add optional fields and operations, and keep deprecated ones. In semantic-versioning terms every release is a minor version.',
    pros: 'No breaking changes, so no consumer has to migrate; one implementation to run.',
    cons: 'The schema accumulates deprecated fields, and a change that needs a rename or removal cannot be expressed.',
    when: 'Whenever the change can be made backward compatible. Explicit versions are for the changes this cannot express.' }
];

const CONTEXTS = ['public API', 'internal microservices', 'event streaming'];
const PRIORITIES = ['modifiability', 'simplicity', 'easy migration'];
const CHANGES = ['breaking (rename/remove)', 'additive (optional field)'];

const WORKFLOW = [
  { label: 'Define contract', short: 'Define contract',
    tools: 'OpenAPI for REST, Protocol Buffers (.proto) for gRPC, AsyncAPI for events. The contract is written and reviewed before any code exists.' },
  { label: 'Generate stubs and SDKs', short: 'Generate code',
    tools: 'Code generators such as OpenAPI Generator or protoc produce server stubs and client SDKs, so both sides start from the same definition.' },
  { label: 'Implement server', short: 'Implement server',
    tools: 'The server team fills in the generated stubs while client teams build against the contract, or a mock generated from it, in parallel.' },
  { label: 'Contract tests on every build', short: 'Contract tests',
    tools: 'Consumer-driven contract tests (for example with Pact): each consumer states the part of the contract it uses, and the provider build runs those tests.' },
  { label: 'Registry checks compatibility', short: 'Registry check',
    tools: 'A schema registry, or a contract diff in the CI pipeline, rejects a change that is not backward compatible before it can be deployed.' }
];

let contextSelect, prioritySelect, changeSelect;
let selectedCard = null;       // strategy id whose details are shown (null = show recommendation)
let pinnedStep = -1, hoverStep = -1;
let cardRects = [], stepRects = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const main = document.querySelector('main');
  canvas.parent(main);
  textSize(defaultTextSize);

  contextSelect = createSelect(); contextSelect.parent(main);
  for (const c of CONTEXTS) contextSelect.option('Context: ' + c);
  prioritySelect = createSelect(); prioritySelect.parent(main);
  for (const p of PRIORITIES) prioritySelect.option('Priority: ' + p);
  changeSelect = createSelect(); changeSelect.parent(main);
  for (const c of CHANGES) changeSelect.option('Change: ' + c);
  for (const s of [contextSelect, prioritySelect, changeSelect]) s.changed(() => { selectedCard = null; });

  layout();
  describe('An evaluation tool for API versioning. Four strategy cards (URL versioning, header ' +
    'versioning, content negotiation, additive-only evolution) show 1 to 5 ratings for modifiability, ' +
    'complexity, migration ease, and fit for the chosen context. Three menus set the system context, ' +
    'the quality attribute priority, and whether the change is breaking; the best-fit strategy is ' +
    'highlighted with its justification and accepted tradeoffs. A five-step contract-first workflow ' +
    'at the bottom explains each step on hover or click.', LABEL);
}

function layout() {
  const y = drawHeight + 13;
  const avail = canvasWidth - 20 - 16;
  const w1 = Math.min(232, Math.floor(avail * 0.34));
  const w2 = Math.min(200, Math.floor(avail * 0.29));
  const w3 = Math.min(250, avail - w1 - w2);
  contextSelect.position(10, y); contextSelect.size(w1);
  prioritySelect.position(10 + w1 + 8, y); prioritySelect.size(w2);
  changeSelect.position(10 + w1 + 8 + w2 + 8, y); changeSelect.size(w3);
}

// ---------- evaluation model ----------
function contextIndex() { return contextSelect.elt.selectedIndex; }
function priorityIndex() { return prioritySelect.elt.selectedIndex; }
function isBreaking() { return changeSelect.elt.selectedIndex === 0; }

// Score = 2 x context fit + modifiability + simplicity + migration ease,
// plus 2 x the dimension the student named as the priority.
function evaluate() {
  const ci = contextIndex(), pi = priorityIndex();
  const rows = STRATEGIES.map(s => {
    const simplicity = 6 - s.cx;
    const dims = [s.mod, simplicity, s.ease];
    const feasible = !(isBreaking() && s.id === 'additive');
    return { s: s, feasible: feasible, fit: s.fit[ci],
      score: 2 * s.fit[ci] + s.mod + simplicity + s.ease + 2 * dims[pi] };
  });
  const ranked = rows.filter(r => r.feasible).sort((a, b) => b.score - a.score);
  return { rows: rows, best: ranked[0], runnerUp: ranked[1] };
}

function justification(best) {
  const ci = contextIndex();
  if (!isBreaking()) {
    const extra = [
      'Document the new field and mark anything it supersedes as deprecated.',
      'Consumer-driven contract tests confirm that no consuming service breaks.',
      'A schema registry in backward-compatible mode enforces exactly this rule for event schemas.'][ci];
    return {
      why: 'This change only adds something optional, so existing consumers keep working. No new version is needed; creating one would cause migration work for no benefit. ' + extra,
      cost: 'The schema grows: deprecated fields must be kept and documented until every consumer has stopped using them.' };
  }
  if (best.s.id === 'url') {
    const why = [
      'You cannot upgrade external consumers on your schedule, so old and new versions must run side by side for a long time. A version in the URL is the most explicit signal: visible in documentation, logs, and every request.',
      'Of the strategies that can express a breaking change, URL versioning is the simplest to operate and the easiest for consuming teams to adopt: run v1 and v2 side by side and retire v1 when the last consumer has moved.',
      'The URL-style option for events is a new versioned topic (orders.v2) published alongside the old one until consumers move. It is the simplest to operate and to migrate to.'][ci];
    const cost = ci === 2
      ? 'Producers must publish to both topics during the migration, and versioned topics accumulate.'
      : 'Two implementations to maintain until v1 is retired, and a growing set of versioned paths.';
    return { why: why, cost: cost };
  }
  if (best.s.id === 'header') {
    const why = [
      'A version header keeps resource URLs stable while the representation changes.',
      'You control the consumers and already route through a gateway or mesh, so a version header lets services evolve independently while resource URLs stay stable.',
      'Events are published, not requested, so there is no URL to version and nothing to negotiate. Carrying the schema version in the message headers lets consumers handle both versions on one stream.'][ci];
    return { why: why,
      cost: 'More routing and client complexity: every producer or client must set the header, and every router, cache, and consumer must honor it.' };
  }
  return { why: 'Versioned media types let each representation evolve separately behind a stable URL.',
    cost: 'The highest routing and content-type complexity of the four strategies.' };
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

  const wide = canvasWidth >= 660;      // 4 cards across fits the usual chapter column (about 690px)
  const ev = evaluate();

  noStroke(); fill(25, 45, 90); textAlign(LEFT, TOP); textStyle(BOLD); textSize(canvasWidth < 480 ? 15 : 18);
  text(canvasWidth < 480 ? 'API Versioning Explorer' : 'API Versioning Strategy Explorer', margin, 9);
  textStyle(NORMAL);
  if (canvasWidth >= 620) {
    fill(95); textAlign(RIGHT, TOP); textSize(11.5);
    text('Ratings are qualitative, 1 to 5. Click a card for details.', canvasWidth - margin, 14);
  }

  // strategy cards: one row of four when wide, a 2 x 2 grid when narrow
  cardRects = [];
  const gap = 6, cardsTop = 38;
  const cols = wide ? 4 : 2;
  const cardW = (canvasWidth - margin * 2 - gap * (cols - 1)) / cols;
  const cardH = wide ? 152 : 96;
  for (let i = 0; i < 4; i++) {
    const cx = margin + (i % cols) * (cardW + gap);
    const cy = cardsTop + Math.floor(i / cols) * (cardH + gap);
    cardRects.push({ id: STRATEGIES[i].id, x: cx, y: cy, w: cardW, h: cardH });
    drawCard(ev.rows[i], cx, cy, cardW, cardH, ev.best && ev.best.s.id === STRATEGIES[i].id, wide);
  }
  const cardsBottom = cardsTop + (wide ? cardH : cardH * 2 + gap);

  // recommendation (gold) or strategy detail (blue)
  const panelTop = cardsBottom + 8;
  const workflowTop = drawHeight - (wide ? 100 : 74);
  const panelH = workflowTop - 8 - panelTop;
  const step = hoverStep >= 0 ? hoverStep : pinnedStep;
  if (!wide && step >= 0) drawStepPanel(step, panelTop, panelH);   // narrow: no room under the strip
  else if (selectedCard) drawDetailPanel(panelTop, panelH);
  else drawRecommendation(ev, panelTop, panelH);

  drawWorkflow(workflowTop, wide);

  let over = false;
  for (const r of cardRects.concat(stepRects)) {
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) over = true;
  }
  cursor(over ? HAND : ARROW);
}

function drawCard(row, x, y, w, h, isBest, wide) {
  const s = row.s;
  const sel = selectedCard === s.id;
  // card body
  fill(row.feasible ? color(255) : color(238, 240, 242));
  if (isBest) { stroke(GOLD[0], GOLD[1], GOLD[2]); strokeWeight(3); }
  else if (sel) { stroke(BLUE[0], BLUE[1], BLUE[2]); strokeWeight(2.5); }
  else { stroke(150, 180, 215); strokeWeight(1.2); }
  rect(x, y, w, h, 8); noStroke();
  // header band
  if (isBest) fill(255, 213, 79);
  else fill(row.feasible ? color(BLUE[0], BLUE[1], BLUE[2]) : color(140, 150, 160));
  rect(x + 1.5, y + 1.5, w - 3, 23, 6, 6, 0, 0);
  fill(isBest ? color(70, 45, 0) : color(255)); textAlign(LEFT, CENTER); textStyle(BOLD); textSize(w < 175 ? 11.5 : 12.5);
  if (wide) {
    text(fitText(s.name, w - 16), x + 8, y + 13.5);
  } else {
    let scoreLabel = row.feasible ? '' + row.score : 'n/a';
    if (isBest) scoreLabel = 'Best · ' + row.score;
    const sw = textWidth(scoreLabel);
    text(fitText(s.name, w - sw - 24), x + 8, y + 13.5);
    textAlign(RIGHT, CENTER); text(scoreLabel, x + w - 8, y + 13.5);
  }
  textStyle(NORMAL);

  let ty = y + 30;
  if (wide) {
    fill(row.feasible ? color(70) : color(130)); textAlign(LEFT, TOP); textSize(11);
    text(fitText(s.cardExample || s.example, w - 16), x + 8, ty);
    ty += 19;
  }
  const rowH = wide ? 17 : 15;
  drawMeter('Modifiability', s.mod, x, ty, w, [46, 125, 50], row.feasible); ty += rowH;
  drawMeter('Complexity (cost)', s.cx, x, ty, w, [230, 81, 0], row.feasible); ty += rowH;
  drawMeter('Migration ease', s.ease, x, ty, w, [46, 125, 50], row.feasible); ty += rowH;
  drawMeter('Context fit', row.fit, x, ty, w, [25, 103, 192], row.feasible); ty += rowH;

  if (wide) {
    // status line at the bottom of the card
    textAlign(CENTER, CENTER); textStyle(BOLD); textSize(11);
    if (isBest) {
      fill(255, 213, 79); rect(x + 8, y + h - 27, w - 16, 19, 5);
      fill(80, 55, 0); text('BEST FIT · score ' + row.score, x + w / 2, y + h - 17.5);
    } else if (!row.feasible) {
      fill(110); text(fitText('Not applicable here', w - 12), x + w / 2, y + h - 17.5);
    } else {
      fill(BLUE[0], BLUE[1], BLUE[2]); text('Score ' + row.score, x + w / 2, y + h - 17.5);
    }
    textStyle(NORMAL);
  }
}

// label on the left, five pips on the right
function drawMeter(label, value, x, y, w, c, enabled) {
  noStroke(); fill(enabled ? color(45) : color(130)); textAlign(LEFT, CENTER); textSize(11);
  text(label, x + 8, y + 6);
  const pw = w < 175 ? 8 : 9, pg = w < 175 ? 2 : 3;
  const px0 = x + w - 8 - (pw * 5 + pg * 4);
  for (let i = 0; i < 5; i++) {
    if (i < value) fill(enabled ? color(c[0], c[1], c[2]) : color(165));
    else fill(222, 228, 234);
    rect(px0 + i * (pw + pg), y + 1.5, pw, 9, 2);
  }
}

function drawRecommendation(ev, y, h) {
  const x = margin, w = canvasWidth - margin * 2;
  fill(255, 248, 225); stroke(GOLD[0], GOLD[1], GOLD[2]); strokeWeight(1.5); rect(x, y, w, h, 8); noStroke();
  const j = justification(ev.best);
  let ty = y + 9;
  fill(90, 60, 0); textAlign(LEFT, TOP); textStyle(BOLD); textSize(14.5);
  text(fitText('Best fit: ' + ev.best.s.name + ' (score ' + ev.best.score + ')', w - 24), x + 12, ty);
  textStyle(NORMAL); ty += 21;
  const limit = y + h - 5;
  if (ev.runnerUp) {
    const dropped = ev.rows.find(r => !r.feasible);
    const line = 'Runner-up: ' + ev.runnerUp.s.name + ' (' + ev.runnerUp.score + ').' +
      (dropped && w > 500 ? ' Additive-only evolution is ruled out: it cannot remove or rename anything.' : '');
    ty = drawWrapped(line, x + 12, ty, w - 24, 12, 15.5, color(95, 75, 30), limit) + 3;
  }
  ty = drawLabeled('Why: ', j.why, x + 12, ty, w - 24, limit) + 3;
  ty = drawLabeled('Tradeoff accepted: ', j.cost, x + 12, ty, w - 24, limit) + 3;
  drawWrapped('Score = 2 × context fit + modifiability + simplicity (6 − complexity) + migration ease + 2 × your priority.',
    x + 12, ty, w - 24, 11.5, 14.5, color(120, 100, 60), limit);
}

function drawDetailPanel(y, h) {
  const s = STRATEGIES.find(t => t.id === selectedCard);
  const x = margin, w = canvasWidth - margin * 2;
  fill(232, 242, 253); stroke(BLUE[0], BLUE[1], BLUE[2]); strokeWeight(1.5); rect(x, y, w, h, 8); noStroke();
  let ty = y + 9;
  const limit = y + h - 5;
  fill(20, 60, 120); textAlign(LEFT, TOP); textStyle(BOLD); textSize(14.5);
  text(fitText(s.name + ':  ' + s.example, w - 24), x + 12, ty);
  textStyle(NORMAL); ty += 22;
  ty = drawLabeled('How: ', s.how, x + 12, ty, w - 24, limit) + 2;
  ty = drawLabeled('Pro: ', s.pros, x + 12, ty, w - 24, limit) + 2;
  ty = drawLabeled('Con: ', s.cons, x + 12, ty, w - 24, limit) + 2;
  ty = drawLabeled('Use when: ', s.when, x + 12, ty, w - 24, limit) + 2;
  if (ty + 15 < limit) {
    fill(90); textSize(11.5); textAlign(LEFT, BOTTOM);
    text('Click the card again to return to the recommendation.', x + 12, limit - 1);
  }
}

// narrow layouts show the active workflow step in the main panel
function drawStepPanel(i, y, h) {
  const x = margin, w = canvasWidth - margin * 2;
  fill(224, 242, 241); stroke(TEAL[0], TEAL[1], TEAL[2]); strokeWeight(1.5); rect(x, y, w, h, 8); noStroke();
  fill(0, 77, 64); textAlign(LEFT, TOP); textStyle(BOLD); textSize(14.5);
  text(fitText('Step ' + (i + 1) + ': ' + WORKFLOW[i].label, w - 24), x + 12, y + 9);
  textStyle(NORMAL);
  drawWrapped(WORKFLOW[i].tools, x + 12, y + 32, w - 24, 12.5, 16, color(20), y + h - 5);
}

function drawWorkflow(y, wide) {
  const x = margin, w = canvasWidth - margin * 2;
  noStroke(); fill(TEAL[0], TEAL[1], TEAL[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(12.5);
  text(wide ? 'Contract-first workflow: the contract is the source of truth' : 'Contract-first workflow (tap a step)', x, y);
  textStyle(NORMAL);
  const by = y + 18, bh = wide ? 40 : 46, arrow = wide ? 14 : 10;
  const bw = (w - arrow * 4) / 5;
  const active = hoverStep >= 0 ? hoverStep : pinnedStep;
  stepRects = [];
  for (let i = 0; i < 5; i++) {
    const bx = x + i * (bw + arrow);
    stepRects.push({ x: bx, y: by, w: bw, h: bh });
    const on = i === active;
    fill(on ? color(TEAL[0], TEAL[1], TEAL[2]) : color(224, 242, 241));
    stroke(TEAL[0], TEAL[1], TEAL[2]); strokeWeight(on ? 2 : 1.2); rect(bx, by, bw, bh, 6); noStroke();
    fill(on ? color(255) : color(0, 77, 64)); textAlign(CENTER, CENTER); textSize(bw < 100 ? 10.5 : 11.5);
    textStyle(BOLD);
    text((i + 1) + '. ' + (bw < 110 ? WORKFLOW[i].short : WORKFLOW[i].label), bx + 3, by + 1, bw - 6, bh - 2);
    textStyle(NORMAL);
    if (i < 4) {
      const ax = bx + bw + 2, ay = by + bh / 2;
      stroke(TEAL[0], TEAL[1], TEAL[2]); strokeWeight(1.5); line(ax, ay, ax + arrow - 6, ay); noStroke();
      fill(TEAL[0], TEAL[1], TEAL[2]); triangle(ax + arrow - 3, ay, ax + arrow - 9, ay - 4, ax + arrow - 9, ay + 4);
    }
  }
  if (!wide) return;
  const msg = active >= 0 ? WORKFLOW[active].tools : 'Hover over or click a step to see the tools and practices behind it.';
  drawWrapped(msg, x, by + bh + 6, w, 12, 15, active >= 0 ? color(20) : color(95), drawHeight - 2);
}

// ---------- text helpers ----------
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

// Draw word-wrapped text and return the y just below it. Stops at yLimit.
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

// A bold run-in label followed by wrapped body text.
function drawLabeled(label, body, x, y, w, yLimit) {
  const size = w > 500 ? 12.5 : 12, lineH = w > 500 ? 16 : 15;
  textSize(size); textStyle(NORMAL);
  const lines = wrapLines(label + body, w);
  noStroke(); textAlign(LEFT, TOP);
  for (let i = 0; i < lines.length; i++) {
    if (y + lineH > yLimit) break;
    const lastFit = (y + 2 * lineH > yLimit) && i < lines.length - 1;
    let ln = lastFit ? fitText(lines[i] + ' …', w) : lines[i];
    if (i === 0) {
      textStyle(BOLD); fill(20); text(label, x, y);
      const lw = textWidth(label);
      textStyle(NORMAL); fill(30); text(ln.slice(label.length), x + lw, y);
    } else {
      fill(30); text(ln, x, y);
    }
    y += lineH;
  }
  return y;
}

// ---------- interaction ----------
function hitIndex(rects) {
  for (let i = 0; i < rects.length; i++) {
    const r = rects[i];
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) return i;
  }
  return -1;
}

function mouseMoved() { hoverStep = hitIndex(stepRects); }

function mousePressed() {
  if (mouseY > drawHeight || mouseX < 0 || mouseX > canvasWidth) return;
  const c = hitIndex(cardRects);
  if (c >= 0) { selectedCard = (selectedCard === cardRects[c].id) ? null : cardRects[c].id; return; }
  const s = hitIndex(stepRects);
  if (s >= 0) pinnedStep = (pinnedStep === s) ? -1 : s;
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
