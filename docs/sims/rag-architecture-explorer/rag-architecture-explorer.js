// RAG vs. GraphRAG Architecture Comparison
// CANVAS_HEIGHT: 575
// Bloom L4 (Analyze): students COMPARE flat RAG with GraphRAG on one worked example: the same
// question is traced through both pipelines, and the context each one retrieves and the answer
// it can support are shown side by side. Step-through (Trace request / Next step) with the
// retrieved data visible; no continuous animation.
//
// Product A, Component B, Component C, and Customer X are the chapter's own example. The
// knowledge base and answers are a constructed teaching example, and every latency figure is
// illustrative (vector search and generation sit inside the typical ranges the chapter gives:
// 50 to 200 ms and 0.5 to 5 s). No figure describes a named product.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 525;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const BLUE = [25, 118, 210], PURPLE = [123, 31, 162], TEAL = [0, 137, 123], NAVY = [25, 45, 90];
const GREEN = [46, 125, 50], RED = [198, 40, 40], AMBER = [230, 145, 0], GOLD = [150, 105, 0];
const BAR_SCALE = 1600;            // ms at full width of the latency bars

// Each pipeline is seven rows; a row that is an array holds steps that run in parallel.
const PIPES = {
  rag: { name: 'RAG: vector retrieval', col: BLUE,
    rows: ['q', 'embed', 'vsearch', 'topk', 'prompt', 'llm', 'resp'] },
  graph: { name: 'GraphRAG: graph + vector retrieval', col: PURPLE,
    rows: ['q', 'extract', ['traverse', 'gvsearch'], 'combine', 'prompt', 'llm', 'resp'] }
};

const COMP = {
  q: { name: 'User query', short: 'Query',
    purpose: 'The question as the user typed it. Everything downstream depends on how much of the user\'s intent it carries.',
    latency: 'None: it is the input.',
    risks: 'An ambiguous or underspecified question retrieves the wrong context, and the model answers the wrong question well.' },
  embed: { name: 'Embedding model', short: 'Embedding',
    purpose: 'Turns the query into a vector in the same space as the indexed document chunks, so that closeness of vectors stands in for closeness of meaning.',
    latency: 'Small: one call to a small model.',
    risks: 'The query and the documents must be embedded by the same model version. Changing the model means re-embedding and re-indexing every document.' },
  vsearch: { name: 'Vector DB: similarity search', short: 'Vector search',
    purpose: 'Approximate nearest-neighbor search returns the chunks whose vectors lie closest to the query vector.',
    latency: 'Tens to a few hundred milliseconds; grows with index size and with the recall setting.',
    risks: 'The search is approximate, so recall is traded against latency. Similar is not the same as relevant: a fact phrased unlike the question is not found. A stale index returns outdated chunks.' },
  topk: { name: 'Top-K chunks', short: 'Top-K chunks',
    purpose: 'Keeps the K best-scoring chunks, optionally re-ranked, as the context for the model.',
    latency: 'Small, unless a re-ranking model is added.',
    risks: 'K too small leaves out needed facts; K too large adds tokens, cost, latency, and distraction. Chunking can split one fact across two chunks.' },
  prompt: { name: 'Prompt assembly', short: 'Prompt assembly',
    purpose: 'Combines the instructions, the retrieved context, and the user\'s question into one prompt.',
    latency: 'Negligible: string handling.',
    risks: 'The context can overflow the model\'s context window, and retrieved text can carry injected instructions (prompt injection).' },
  llm: { name: 'LLM generation', short: 'LLM generation',
    purpose: 'Generates an answer grounded in the supplied context instead of relying only on what the model memorized in training.',
    latency: 'Dominant: typically 0.5 to 5 s, growing with the length of the answer and of the prompt.',
    risks: 'When the context is missing or wrong the model may hallucinate a fluent answer. Output is non-deterministic, and cost scales with tokens.' },
  resp: { name: 'Response', short: 'Response',
    purpose: 'The answer returned to the user, ideally with citations to the sources it was built from.',
    latency: 'None beyond delivery.',
    risks: 'Without citations a user cannot tell a grounded answer from a hallucinated one. Quality has to be evaluated end to end, not per component.' },
  extract: { name: 'Entity extraction', short: 'Entity extraction',
    purpose: 'Finds the entities named in the query and links them to nodes in the knowledge graph, giving the traversal its starting points.',
    latency: 'Small with a compact model; larger if an LLM call is used for it.',
    risks: 'A missed or wrongly linked entity starts the traversal in the wrong place, and everything retrieved after it is beside the point.' },
  traverse: { name: 'Knowledge graph: traversal', short: 'Graph traversal', tiny: 'Graph',
    purpose: 'Follows explicit relationships outward from the linked entities for a bounded number of hops, collecting connected facts.',
    latency: 'Grows with the number of hops and with how many edges each node has.',
    risks: 'The graph has to be built and kept current: construction is costly and a missing or stale edge is a missing fact. An unbounded traversal returns far too much.' },
  gvsearch: { name: 'Vector DB: semantic search', short: 'Vector search', tiny: 'Vector',
    purpose: 'Runs alongside the traversal to fetch unstructured text that supports or explains the graph facts.',
    latency: 'Tens to a few hundred milliseconds; it runs in parallel, so only the slower of the two retrievals counts.',
    risks: 'The same recall and staleness risks as in flat RAG, plus a second store to keep consistent with the graph.' },
  combine: { name: 'Combined context', short: 'Combined context',
    purpose: 'Merges graph facts and text chunks, removes duplicates, and fits the result to the context window.',
    latency: 'Small, but the larger context makes the generation step slower and more expensive.',
    risks: 'More context means more tokens. Graph facts and text can disagree, and something must decide which wins.' }
};

// illustrative per-step latency in ms
const MS = {
  simple: { rag: { embed: 20, vsearch: 80, topk: 10, prompt: 5, llm: 1000 },
    graph: { extract: 60, traverse: 30, gvsearch: 80, combine: 15, prompt: 5, llm: 1050 } },
  complex: { rag: { embed: 20, vsearch: 80, topk: 10, prompt: 5, llm: 1200 },
    graph: { extract: 60, traverse: 110, gvsearch: 80, combine: 15, prompt: 5, llm: 1350 } }
};

// the worked example: [text, needed for a complete answer?]
const EXAMPLE = {
  simple: {
    query: 'What is the warranty period for Product A?',
    rag: { how: 'Three chunks most similar to the question:',
      ctx: [['Chunk: Product A warranty terms (24 months)', true], ['Chunk: Product A overview', false],
        ['Chunk: Product A setup guide', false]],
      missing: [], ok: true,
      answer: 'Product A has a 24-month warranty.',
      verdict: 'The fact sits in one chunk that reads like the question, so similarity search finds it.' },
    graph: { how: 'From Product A, one hop, plus the vector search:',
      ctx: [['(Product A, requires, Component B)', false], ['Chunk: Product A warranty terms (24 months)', true],
        ['Chunk: Product A overview', false]],
      missing: [], ok: true,
      answer: 'Product A has a 24-month warranty.',
      verdict: 'The same answer. The graph added a step, latency, and tokens, but no information.' }
  },
  complex: {
    query: 'Customer X bought Product A. What else do they need, and will it work with what they already own?',
    rag: { how: 'Three chunks most similar to the question:',
      ctx: [['Chunk: Product A setup guide (requires Component B)', true], ['Chunk: Product A overview', false],
        ['Chunk: Customer X order record (bought Product A)', true]],
      missing: ['Component B is incompatible with Component C', 'Customer X already owns Component C'], ok: false,
      answer: 'Customer X also needs Component B.',
      verdict: 'The compatibility note names neither Product A nor Customer X, so similarity search never finds it.' },
    graph: { how: 'From Customer X and Product A, three hops of triples:',
      ctx: [['(Customer X, purchased, Product A)', true], ['(Product A, requires, Component B)', true],
        ['(Component B, incompatible_with, Component C)', true], ['(Customer X, owns, Component C)', true],
        ['Chunk: Compatibility note for Component B', true]],
      missing: [], ok: true,
      answer: 'Customer X needs Component B, but it is incompatible with the Component C they already own.',
      verdict: 'Relationships reach a fact several hops away from anything named in the question.' }
  }
};

let querySelect, stepBtn, resetBtn;
let step = 7;                      // rows completed (7 = whole request shown)
let selected = null;               // {pipe, id} of the clicked component
let hits = [];                     // [{pipe, id, x, y, w, h}] rebuilt every frame

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const main = document.querySelector('main');
  canvas.parent(main);
  textSize(defaultTextSize);

  querySelect = createSelect(); querySelect.parent(main);
  querySelect.option('Complex multi-hop query'); querySelect.option('Simple factual query');
  querySelect.changed(() => { selected = null; });
  stepBtn = createButton('Trace request'); stepBtn.parent(main);
  stepBtn.mousePressed(() => { step = step >= 7 ? 1 : step + 1; selected = null; });
  resetBtn = createButton('Show all'); resetBtn.parent(main);
  resetBtn.mousePressed(() => { step = 7; selected = null; });

  layout();
  describe('Two retrieval pipelines side by side. On the left, flat RAG: user query, embedding ' +
    'model, vector database similarity search, top-K chunks, prompt assembly, LLM generation, and ' +
    'response. On the right, GraphRAG: user query, entity extraction, knowledge graph traversal in ' +
    'parallel with a vector search, combined context, prompt assembly, LLM generation, and response. ' +
    'Each step shows an illustrative latency. Panels below list the context each pipeline retrieved ' +
    'for the chosen question and the answer it supports. A menu switches between a simple factual ' +
    'query and a complex multi-hop query, and a button traces the request step by step.', LABEL);
}

function layout() {
  const y = drawHeight + 13;
  querySelect.position(10, y); querySelect.size(canvasWidth >= 660 ? 210 : 150);
  const bx = 10 + (canvasWidth >= 660 ? 210 : 150) + 10;
  stepBtn.position(bx, y);
  resetBtn.position(bx + 112, y);
}

function qtype() { return querySelect.elt.selectedIndex === 0 ? 'complex' : 'simple'; }

// latency of one row (parallel steps count as the slower one), and totals
function rowMs(pipe, row, qt) {
  const t = MS[qt][pipe];
  if (Array.isArray(row)) return Math.max(...row.map(id => t[id] || 0));
  return t[row] || 0;
}
function elapsed(pipe, qt, upTo) {
  let s = 0;
  PIPES[pipe].rows.forEach((row, i) => { if (i < upTo) s += rowMs(pipe, row, qt); });
  return s;
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

  const qt = qtype(), narrow = canvasWidth < 660;
  const want = step >= 7 ? 'Trace request' : 'Next step';
  if (stepBtn.html() !== want) stepBtn.html(want);

  fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(narrow ? 14.5 : 18);
  text(narrow ? 'RAG vs. GraphRAG' : 'RAG vs. GraphRAG Architecture Comparison', margin, 10);
  if (step < 7) {
    textAlign(RIGHT, TOP); textSize(narrow ? 11.5 : 13); fill(GOLD[0], GOLD[1], GOLD[2]);
    text('Step ' + step + ' of 7', canvasWidth - margin, narrow ? 12 : 14);
  }
  textStyle(NORMAL);
  // the question both pipelines receive
  const qy = drawWrapped('Question: “' + EXAMPLE[qt].query + '”', margin, 34, canvasWidth - margin * 2, 12.5, 16, color(40), 68);

  hits = [];
  const top = Math.max(58, qy + 5);
  const gap = 8, colW = (canvasWidth - margin * 2 - gap) / 2;
  const pipeH = 240;
  drawPipe('rag', margin, top, colW, pipeH, qt, narrow);
  drawPipe('graph', margin + colW + gap, top, colW, pipeH, qt, narrow);

  const py = top + pipeH + 6, ph = drawHeight - 8 - py;
  if (selected) drawDetail(margin, py, canvasWidth - margin * 2, ph, qt);
  else {
    drawContext('rag', margin, py, colW, ph, qt);
    drawContext('graph', margin + colW + gap, py, colW, ph, qt);
  }
  drawControlNote();

  let over = false;
  for (const h of hits) if (mouseX >= h.x && mouseX <= h.x + h.w && mouseY >= h.y && mouseY <= h.y + h.h) over = true;
  cursor(over ? HAND : ARROW);
}

function drawPipe(pipe, x, y, w, h, qt, narrow) {
  const P = PIPES[pipe], c = P.col;
  fill(255); stroke(200); strokeWeight(1); rect(x, y, w, h, 8); noStroke();
  fill(c[0], c[1], c[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(narrow ? 11.5 : 13);
  text(fitText(narrow ? (pipe === 'rag' ? 'RAG' : 'GraphRAG') : P.name, w - 16), x + 9, y + 7); textStyle(NORMAL);

  const bx = x + 9, bw = w - 18, pitch = 25, bh = 20, y0 = y + 27;
  for (let i = 0; i < P.rows.length; i++) {
    const row = P.rows[i], ry = y0 + i * pitch;
    const state = i < step - 1 ? 'done' : (i === step - 1 ? (step >= 7 ? 'done' : 'now') : 'todo');
    if (i > 0) {
      stroke(state === 'todo' ? color(205) : color(120)); strokeWeight(1.4);
      line(x + w / 2, ry - (pitch - bh), x + w / 2, ry); noStroke();
    }
    const ids = Array.isArray(row) ? row : [row];
    const cw = (bw - (ids.length - 1) * 5) / ids.length;
    for (let k = 0; k < ids.length; k++) {
      const id = ids[k], cx = bx + k * (cw + 5);
      hits.push({ pipe: pipe, id: id, x: cx, y: ry, w: cw, h: bh });
      const isSel = selected && selected.pipe === pipe && selected.id === id;
      const hover = mouseX >= cx && mouseX <= cx + cw && mouseY >= ry && mouseY <= ry + bh;
      const a = state === 'todo' ? 70 : 255;
      stroke(isSel ? color(20) : (state === 'now' ? color(GOLD[0], GOLD[1], GOLD[2]) : color(c[0], c[1], c[2], a)));
      strokeWeight(isSel ? 2.4 : (state === 'now' ? 2.4 : (hover ? 2 : 1.2)));
      fill(state === 'now' ? color(255, 243, 205) : (state === 'todo' ? color(248) : color(lerp(c[0], 255, 0.88), lerp(c[1], 255, 0.88), lerp(c[2], 255, 0.88))));
      rect(cx, ry, cw, bh, 5); noStroke();
      const ms = MS[qt][pipe][id];
      const msTxt = ms ? ms.toLocaleString('en-US') + ' ms' : '';
      textSize(narrow ? 10 : 12);
      const mw = msTxt ? textWidth(msTxt) + 8 : 0;
      fill(25, 25, 25, a); textAlign(LEFT, CENTER); textStyle(BOLD);
      const full = ids.length > 1 || narrow ? COMP[id].short : COMP[id].name;
      let lbl = textWidth(full) <= cw - 12 - mw ? full : COMP[id].short;
      if (textWidth(lbl) > cw - 10 - mw && COMP[id].tiny) lbl = COMP[id].tiny;
      text(fitText(lbl, cw - 10 - mw), cx + 6, ry + bh / 2);
      textStyle(NORMAL);
      if (msTxt) { fill(70, 70, 70, a); textAlign(RIGHT, CENTER); text(msTxt, cx + cw - 6, ry + bh / 2); }
    }
    if (ids.length > 1 && !narrow) {
      // mark the parallel pair
      fill(240, 248, 255); const pw = 12; rect(bx + cw - 3.5, ry + 4, pw, bh - 8, 3);
      fill(110); textAlign(CENTER, CENTER); textSize(11); textStyle(BOLD); text('∥', bx + cw + 2.5, ry + bh / 2); textStyle(NORMAL);
    }
  }
  // latency bar: everything before the LLM, then generation, on a scale shared by both pipelines
  const ty = y0 + 7 * pitch, barX = bx, barW = bw;
  const done = elapsed(pipe, qt, step >= 7 ? 7 : step), total = elapsed(pipe, qt, 7), retr = elapsed(pipe, qt, 5);
  fill(236, 239, 242); rect(barX, ty, barW, 10, 3);
  const sx = v => barW * Math.min(v, BAR_SCALE) / BAR_SCALE;
  fill(TEAL[0], TEAL[1], TEAL[2]); rect(barX, ty, sx(Math.min(done, retr)), 10, 3);
  if (done > retr) { fill(AMBER[0], AMBER[1], AMBER[2]); rect(barX + sx(retr), ty, sx(done) - sx(retr), 10, 3); }
  // one line under the bar: the two parts and the total
  const ly = ty + 19;
  textSize(narrow ? 10 : 11.5); textAlign(LEFT, CENTER);
  const fmt = v => v.toLocaleString('en-US');
  const parts = narrow
    ? [[TEAL, fmt(Math.min(done, retr))], [AMBER, fmt(Math.max(0, done - retr))]]
    : (w < 380
      ? [[TEAL, 'before LLM ' + fmt(Math.min(done, retr)) + ' ms'], [AMBER, 'LLM ' + fmt(Math.max(0, done - retr)) + ' ms']]
      : [[TEAL, 'retrieval + prompt ' + fmt(Math.min(done, retr)) + ' ms'], [AMBER, 'generation ' + fmt(Math.max(0, done - retr)) + ' ms']]);
  let kx = bx;
  for (const pt of parts) {
    fill(pt[0][0], pt[0][1], pt[0][2]); rect(kx, ly - 4, 8, 8, 2);
    fill(70); text(pt[1], kx + 11, ly + 0.5);
    kx += 11 + textWidth(pt[1]) + 10;
  }
  fill(20); textStyle(BOLD); textAlign(RIGHT, CENTER);
  text((step >= 7 ? (narrow ? '= ' : 'Total ') : (narrow ? '' : 'Elapsed ')) + fmt(done) + ' ms', bx + bw, ly + 0.5);
  textStyle(NORMAL);
}

// what the pipeline retrieved for this question, and the answer it supports
function drawContext(pipe, x, y, w, h, qt) {
  const ex = EXAMPLE[qt][pipe], c = PIPES[pipe].col;
  fill(255); stroke(200); strokeWeight(1); rect(x, y, w, h, 8); noStroke();
  const tx = x + 9, tw = w - 18, limit = y + h - 4;
  let ty = y + 7;
  fill(c[0], c[1], c[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(12.5);
  text(fitText('Context sent to the LLM', tw), tx, ty); textStyle(NORMAL);
  ty += 18;
  if (step < 4) {
    drawWrapped('Retrieval has not finished yet. Press Next step.', tx, ty, tw, 12, 15, color(110), limit);
    return;
  }
  ty = drawWrapped(ex.how, tx, ty, tw, 11.5, 14.5, color(90), limit);
  const wide = canvasWidth >= 660;       // wide: wrap long items; narrow: one line each
  const put = (mark, markCol, str, strCol) => {
    textSize(11.5); fill(markCol); textAlign(LEFT, TOP); textStyle(BOLD); text(mark, tx + 1, ty); textStyle(NORMAL);
    if (wide) ty = drawWrapped(str, tx + 13, ty, tw - 14, 11.5, 14.5, strCol, limit);
    else { fill(strCol); text(fitText(str, tw - 14), tx + 13, ty); ty += 14.5; }
  };
  for (const item of ex.ctx) {
    if (ty + 14 > limit) return;
    put(item[1] ? '✓' : '·', item[1] ? color(GREEN[0], GREEN[1], GREEN[2]) : color(150), item[0], item[1] ? color(25) : color(110));
  }
  for (const miss of ex.missing) {
    if (ty + 14 > limit) return;
    put('✕', color(RED[0], RED[1], RED[2]), 'Not retrieved: ' + miss, color(RED[0], RED[1], RED[2]));
  }
  if (step < 7) return;
  ty += 4;
  // answer and verdict
  const col = ex.ok ? GREEN : RED, badge = ex.ok ? 'COMPLETE' : 'INCOMPLETE';
  textSize(10.5); textStyle(BOLD);
  const bw = textWidth(badge) + 12;
  if (ty + 16 > limit) return;
  fill(col[0], col[1], col[2]); rect(tx, ty, bw, 16, 4);
  fill(255); textAlign(CENTER, CENTER); text(badge, tx + bw / 2, ty + 8); textStyle(NORMAL);
  fill(c[0], c[1], c[2]); textAlign(LEFT, CENTER); textStyle(BOLD); textSize(12); text('Answer', tx + bw + 7, ty + 8); textStyle(NORMAL);
  ty += 20;
  ty = drawWrapped('“' + ex.answer + '”', tx, ty, tw, 12, 15, color(20), limit) + 2;
  drawWrapped(ex.verdict, tx, ty, tw, 11.5, 14.5, color(95), limit);
}

function drawDetail(x, y, w, h, qt) {
  const d = COMP[selected.id], c = PIPES[selected.pipe].col;
  fill(255); stroke(c[0], c[1], c[2]); strokeWeight(1.5); rect(x, y, w, h, 8); noStroke();
  const tx = x + 12, tw = w - 24, limit = y + h - 4;
  let ty = y + 9;
  fill(c[0], c[1], c[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(14);
  const ms = MS[qt][selected.pipe][selected.id];
  text(fitText(d.name + '  ·  ' + (selected.pipe === 'rag' ? 'RAG' : 'GraphRAG') + (ms ? '  ·  ' + ms.toLocaleString('en-US') + ' ms in this example' : ''), tw), tx, ty);
  textStyle(NORMAL); ty += 23;
  const rows = [['Purpose', d.purpose, NAVY], ['Latency', d.latency, TEAL], ['Quality risks', d.risks, RED]];
  const labW = canvasWidth >= 660 ? 96 : 0;
  for (const r of rows) {
    if (ty + 15 > limit) break;
    fill(r[2][0], r[2][1], r[2][2]); textStyle(BOLD); textSize(12.5); textAlign(LEFT, TOP);
    text(r[0], tx, ty); textStyle(NORMAL);
    if (!labW) ty += 16;
    ty = drawWrapped(r[1], tx + labW, ty, tw - labW, 12.5, 16, color(30), limit) + 6;
  }
  if (ty + 14 < limit) drawWrapped('Click the component again, or another one, to change the selection.', tx, limit - 16, tw, 11, 14, color(120), limit + 2);
}

function drawControlNote() {
  if (canvasWidth < 640) return;
  noStroke(); fill(100); textSize(11.5); textAlign(RIGHT, CENTER);
  const x0 = resetBtn.elt.offsetLeft + resetBtn.elt.offsetWidth + 10;
  const msg = 'Click a component for details. Illustrative timings.';
  if (textWidth(msg) < canvasWidth - 12 - x0) text(msg, canvasWidth - 12, drawHeight + 25);
  else text('Illustrative timings.', canvasWidth - 12, drawHeight + 25);
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
  for (const h of hits) {
    if (mouseX >= h.x && mouseX <= h.x + h.w && mouseY >= h.y && mouseY <= h.y + h.h) {
      selected = (selected && selected.pipe === h.pipe && selected.id === h.id) ? null : { pipe: h.pipe, id: h.id };
      return;
    }
  }
  selected = null;
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
