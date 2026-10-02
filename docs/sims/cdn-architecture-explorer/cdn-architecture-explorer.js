// CDN Request Routing and Cache Flow
// CANVAS_HEIGHT: 535
// Bloom L4 (Analyze): students COMPARE the response time of a cache hit, a cache miss, an
// uncacheable request, and a direct-to-origin request, and relate the cache hit ratio to TTL,
// invalidation, and content cacheability. Clicking a user sends one request: a short one-shot
// animation shows the direction and order of the hops, then the path and the latency
// breakdown stay on screen as concrete data to compare.
//
// ILLUSTRATIVE MODEL, not measurements of any CDN:
//   round-trip time = 1 ms per 100 km of great-circle distance (light in optical fibre travels
//   about 200,000 km/s); origin processing 40 ms; edge processing 5 ms. Real routes are longer
//   than the great circle and a new connection adds handshake round trips.
//   Cities are placed at their real coordinates on a coarse schematic map.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 485;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 16;

const KM_PER_MS_RTT = 100;      // 1 ms of round-trip time per 100 km
const ORIGIN_MS = 40;           // origin processing (illustrative)
const EDGE_MS = 5;              // edge processing (illustrative)
const BAR_SCALE_MS = 240;       // fixed scale of the latency bars
const CLOCK_STEP = 30;          // seconds added by the clock button

const BLUE = [25, 118, 210], PURPLE = [123, 31, 162], ORANGE = [239, 108, 0], TEAL = [0, 137, 123];
const GREEN = [46, 125, 50], RED = [198, 40, 40], AMBER = [245, 160, 0], NAVY = [25, 45, 90];

const ORIGIN = { id: 'origin', kind: 'origin', name: 'Origin: N. Virginia', short: 'Origin', lat: 39.04, lon: -77.49, lab: 'R' };
const POPS = [
  { id: 'lax', name: 'Los Angeles', lat: 34.05, lon: -118.24, lab: 'T' },
  { id: 'mia', name: 'Miami', lat: 25.76, lon: -80.19, lab: 'R' },
  { id: 'gru', name: 'São Paulo', lat: -23.55, lon: -46.63, lab: 'R' },
  { id: 'lhr', name: 'London', lat: 51.51, lon: -0.13, lab: 'L' },
  { id: 'fra', name: 'Frankfurt', lat: 50.11, lon: 8.68, lab: 'R' },
  { id: 'bom', name: 'Mumbai', lat: 19.08, lon: 72.88, lab: 'L' },
  { id: 'nrt', name: 'Tokyo', lat: 35.68, lon: 139.69, lab: 'R' },
  { id: 'syd', name: 'Sydney', lat: -33.87, lon: 151.21, lab: 'L' }
];
const USERS = [
  { id: 'u1', name: 'Vancouver', lat: 49.28, lon: -123.12, lab: 'R' },
  { id: 'u2', name: 'Buenos Aires', lat: -34.60, lon: -58.38, lab: 'R' },
  { id: 'u3', name: 'Madrid', lat: 40.42, lon: -3.70, lab: 'B' },
  { id: 'u4', name: 'Nairobi', lat: -1.29, lon: 36.82, lab: 'R' },
  { id: 'u5', name: 'Seoul', lat: 37.57, lon: 126.98, lab: 'T' }
];

const CONTENT = [
  { key: 'static', label: 'Static asset (image, CSS, JS): TTL 24 h', short: 'Static asset, 24 h TTL', cacheable: true, ttl: 86400 },
  { key: 'api', label: 'Shared API response: TTL 60 s', short: 'API response, 60 s TTL', cacheable: true, ttl: 60 },
  { key: 'private', label: 'Personalized page: not cacheable', short: 'Personalized, no cache', cacheable: false, ttl: 0 }
];

// Coarse land outlines as [lon, lat] rings: a schematic backdrop, not a survey.
const LAND = [
  [[-168, 66], [-156, 71], [-125, 70], [-95, 70], [-82, 67], [-78, 62], [-65, 60], [-56, 52], [-60, 47], [-66, 44], [-70, 42],
    [-74, 40], [-76, 35], [-81, 31], [-80, 25], [-82, 28], [-84, 30], [-90, 29], [-97, 27], [-97, 22], [-95, 18], [-91, 18],
    [-87, 21], [-87, 16], [-83, 15], [-83, 10], [-79, 9], [-77, 8], [-80, 7], [-85, 10], [-87, 13], [-92, 14], [-96, 16],
    [-105, 20], [-109, 26], [-113, 31], [-117, 32], [-120, 34], [-124, 40], [-124, 48], [-128, 51], [-134, 57], [-141, 60],
    [-150, 60], [-158, 58], [-162, 60], [-166, 62]],
  [[-77, 8], [-72, 12], [-62, 10], [-52, 5], [-50, 0], [-44, -2], [-35, -6], [-37, -12], [-39, -18], [-41, -22], [-48, -26],
    [-49, -29], [-53, -34], [-57, -36], [-58, -38], [-62, -39], [-65, -42], [-66, -47], [-69, -51], [-74, -52], [-75, -47],
    [-73, -40], [-73, -37], [-71, -30], [-70, -18], [-76, -14], [-81, -6], [-80, -2], [-80, 1], [-77, 4]],
  [[-17, 15], [-17, 21], [-13, 27], [-10, 30], [-6, 35], [-2, 35], [10, 37], [11, 34], [15, 32], [20, 31], [25, 32], [32, 31],
    [34, 28], [35, 24], [37, 19], [39, 15], [43, 12], [51, 12], [49, 8], [44, 1], [40, -4], [39, -10], [40, -15], [35, -20],
    [35, -24], [32, -28], [27, -34], [20, -35], [18, -33], [15, -27], [12, -18], [13, -9], [12, -5], [9, 0], [9, 4], [5, 5],
    [1, 6], [-4, 5], [-8, 4], [-13, 8], [-17, 12]],
  [[-9, 37], [-9, 43], [-2, 43.5], [-1, 46], [-4, 48], [2, 51], [4, 52], [8, 54], [8, 57], [5, 59], [5, 62], [12, 66], [20, 70],
    [30, 71], [41, 67], [45, 68], [60, 69], [70, 72], [100, 76], [140, 73], [170, 70], [180, 66], [178, 63], [165, 60], [163, 57],
    [157, 51], [156, 57], [143, 59], [136, 55], [141, 52], [140, 47], [135, 43], [130, 42], [128, 39], [129, 36], [127, 34.5],
    [126, 37], [125, 39], [122, 40], [118, 39], [122, 37], [119, 35], [121, 32], [122, 29], [119, 25], [114, 22], [110, 21],
    [108, 21], [106, 19], [108, 15], [109, 12], [106, 9], [104, 9], [100, 13], [99, 9], [102, 5], [104, 1.5], [101, 3], [98, 8],
    [98, 14], [97, 17], [94, 17], [92, 21], [90, 22], [87, 21], [85, 19], [80, 15], [80, 11], [78, 8], [76, 10], [74, 15], [73, 19],
    [72, 21], [70, 21], [67, 24], [62, 25], [57, 26], [56, 27], [52, 28], [50, 30], [48, 30], [50, 27], [51, 25], [54, 24], [56, 26],
    [59, 23], [58, 20], [55, 17], [52, 16], [45, 13], [43, 13], [42, 17], [39, 21], [36, 26], [35, 28], [34.5, 31], [36, 36],
    [32, 36.5], [28, 36.5], [26, 39], [26, 40], [23, 40], [24, 38], [22, 37], [20, 40], [19, 42], [16, 43], [13, 45.5], [12, 44],
    [16, 41.5], [18, 40], [16, 38], [15.5, 40], [12, 42], [10, 44], [7, 44], [3, 43], [3, 42], [0, 40], [0, 38.5], [-2, 37], [-5, 36]],
  [[-5, 50], [1, 51], [1.5, 53], [-1, 55], [-2, 57.5], [-4, 58.5], [-6, 57], [-5, 55], [-3, 54], [-4.5, 53], [-5, 52], [-3, 51.5]],
  [[130, 31], [131, 34], [135, 34], [137, 35], [140, 35], [141, 37], [142, 40], [141, 41.5], [140, 40], [139, 38], [137, 37],
    [136, 36], [133, 35.5], [131, 34.5], [129.5, 33]],
  [[140, 42], [141, 45], [145, 44], [144, 43], [141, 42]],
  [[114, -22], [113, -26], [115, -34], [118, -35], [124, -33], [129, -32], [134, -33], [136, -35], [140, -38], [144, -38.5],
    [147, -38], [150, -37], [151, -33], [153, -28], [153, -25], [149, -21], [146, -19], [145, -15], [142, -11], [141, -17],
    [139, -17], [136, -12], [131, -12], [129, -15], [125, -14], [122, -18], [117, -20]],
  [[95, 5], [98, 4], [104, -3], [106, -6], [102, -4], [98, 1]],
  [[106, -6], [114, -7], [114, -8.5], [106, -7.5]],
  [[109, 1], [112, 3], [117, 7], [119, 5], [118, 1], [116, -4], [112, -3], [110, -1]],
  [[131, -1], [138, -2], [145, -5], [150, -10], [144, -8], [140, -9], [138, -7], [133, -4]],
  [[120, 18], [122, 18], [124, 13], [126, 7], [122, 7], [120, 14]],
  [[44, -16], [49, -12], [50, -16], [47, -25], [44, -23]],
  [[-45, 60], [-52, 65], [-54, 70], [-20, 70], [-40, 65]],
  [[-22, 64], [-14, 65.5], [-14, 64], [-22, 63.5]]
];

const LON0 = -140, LON1 = 165, LAT0 = -50, LAT1 = 66;
let mapX = 12, mapY = 36, mapW = 664, mapH = 250;

let typeSelect, cdnCheckbox, clockBtn, purgeBtn, resetBtn;
let clock = 0;                 // simulated seconds
let cache = {};                // cache[popId][contentKey] = time the copy was stored
let stats;                     // session totals
let last = null;               // the last request and its latency breakdown
let notice = '';               // message after a clock or purge action
let anim = null;               // {legs: [[fromNode, toNode, color]], start}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const main = document.querySelector('main');
  canvas.parent(main);
  textSize(defaultTextSize);

  typeSelect = createSelect(); typeSelect.parent(main);
  for (const c of CONTENT) typeSelect.option(c.label);
  cdnCheckbox = createCheckbox(' CDN enabled', true); cdnCheckbox.parent(main);
  cdnCheckbox.style('font-size', '13px');
  clockBtn = createButton('Clock +30 s'); clockBtn.parent(main); clockBtn.mousePressed(advanceClock);
  purgeBtn = createButton('Purge caches'); purgeBtn.parent(main); purgeBtn.mousePressed(purgeCaches);
  resetBtn = createButton('Reset'); resetBtn.parent(main); resetBtn.mousePressed(resetSim);

  for (const p of POPS) p.kind = 'pop';
  for (const u of USERS) u.kind = 'user';
  resetSim();
  layout();
  describe('A schematic world map with an origin server in Northern Virginia, eight CDN points of ' +
    'presence, and five users. Clicking a user sends a request to the nearest point of presence, ' +
    'which answers from its cache or fetches from the origin. Panels below compare the latency of ' +
    'the request with going directly to the origin and keep a running cache hit ratio. Controls ' +
    'choose the content type, switch the CDN off, advance the clock so short TTLs expire, and purge ' +
    'the caches.', LABEL);
}

function layout() {
  const narrow = canvasWidth < 660;
  cdnCheckbox.elt.querySelector('span') && (cdnCheckbox.elt.querySelector('span').textContent = narrow ? ' CDN' : ' CDN enabled');
  clockBtn.html(narrow ? '+30 s' : 'Clock +30 s');
  purgeBtn.html(narrow ? 'Purge' : 'Purge caches');
  const y = drawHeight + 13;
  // place the fixed-width controls from the right, the select takes what is left
  let x = canvasWidth - 10;
  const place = (el) => { x -= el.elt.offsetWidth; el.position(x, y); x -= 6; };
  place(resetBtn); place(purgeBtn); place(clockBtn);
  x -= (narrow ? 62 : 112); cdnCheckbox.position(x, y + 1); x -= 6;   // a checkbox div has no intrinsic width
  typeSelect.position(10, y);
  typeSelect.size(Math.max(90, Math.min(270, x - 14)));

  mapX = margin; mapW = canvasWidth - margin * 2;
  mapH = narrow ? 215 : 250;                         // leave the single narrow panel more room
}

// ---------- model ----------
function resetSim() {
  clock = 0; cache = {}; last = null; notice = ''; anim = null;
  for (const p of POPS) cache[p.id] = {};
  stats = { cdn: 0, hits: 0, misses: 0, bypass: 0, direct: 0, sumMs: 0, sumDirectMs: 0, n: 0 };
}

function advanceClock() {
  clock += CLOCK_STEP;
  notice = 'Clock advanced to ' + fmtClock(clock) + '. A copy is served only while its age is under its TTL: ' +
    'API copies stored 60 s ago or earlier are now expired; static copies stay fresh for 24 h.';
  last = null; anim = null;
}

function purgeCaches() {
  for (const p of POPS) cache[p.id] = {};
  notice = 'Invalidation: every PoP dropped its copies before their TTL ran out. The next request for each ' +
    'object at each PoP is a miss, so origin load rises right after a purge.';
  last = null; anim = null;
}

function distKm(a, b) {
  const R = 6371, toRad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * toRad, dLon = (b.lon - a.lon) * toRad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * toRad) * Math.cos(b.lat * toRad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
function rttMs(a, b) { return distKm(a, b) / KM_PER_MS_RTT; }

function nearestPop(u) {
  let best = POPS[0];
  for (const p of POPS) if (distKm(u, p) < distKm(u, best)) best = p;
  return best;
}

// 'fresh' | 'expired' | 'empty' for one content type at one PoP
function copyState(pop, c) {
  const t = cache[pop.id][c.key];
  if (t === undefined) return 'empty';
  return (clock - t) < c.ttl ? 'fresh' : 'expired';
}

function sendRequest(u) {
  const c = CONTENT[typeSelect.elt.selectedIndex];
  const pop = nearestPop(u);
  const direct = rttMs(u, ORIGIN) + ORIGIN_MS;
  const r = { user: u, pop: pop, content: c, directMs: direct, hitMs: rttMs(u, pop) + EDGE_MS };
  if (!cdnCheckbox.checked()) {
    r.result = 'DIRECT';
    r.segs = [['user ↔ origin', rttMs(u, ORIGIN), ORANGE], ['origin processing', ORIGIN_MS, AMBER]];
    anim = { legs: [[u, ORIGIN, ORANGE], [ORIGIN, u, ORANGE]], start: millis() };
    stats.direct++;
  } else {
    const state = copyState(pop, c);
    if (!c.cacheable) r.result = 'BYPASS';
    else if (state === 'fresh') r.result = 'HIT';
    else r.result = state === 'expired' ? 'EXPIRED' : 'MISS';
    if (r.result === 'HIT') {
      r.ageS = clock - cache[pop.id][c.key];
      r.segs = [['user ↔ edge', rttMs(u, pop), BLUE], ['edge processing', EDGE_MS, TEAL]];
      anim = { legs: [[u, pop, BLUE], [pop, u, BLUE]], start: millis() };
      stats.hits++;
    } else {
      if (r.result === 'EXPIRED') r.ageS = clock - cache[pop.id][c.key];
      r.segs = [['user ↔ edge', rttMs(u, pop), BLUE], ['edge processing', EDGE_MS, TEAL],
        ['edge ↔ origin', rttMs(pop, ORIGIN), PURPLE], ['origin processing', ORIGIN_MS, AMBER]];
      anim = { legs: [[u, pop, BLUE], [pop, ORIGIN, PURPLE], [ORIGIN, pop, PURPLE], [pop, u, BLUE]], start: millis() };
      if (c.cacheable) { cache[pop.id][c.key] = clock; stats.misses++; } else stats.bypass++;
    }
    stats.cdn++;
  }
  r.totalMs = r.segs.reduce((a, s) => a + s[1], 0);
  stats.n++; stats.sumMs += r.totalMs; stats.sumDirectMs += direct;
  last = r; notice = '';
}

function fmtClock(s) {
  const p = v => (v < 10 ? '0' : '') + v;
  return p(Math.floor(s / 3600)) + ':' + p(Math.floor(s / 60) % 60) + ':' + p(s % 60);
}
function fmtLeft(s) {
  if (s >= 3600) { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return h + ' h' + (m ? ' ' + m + ' min' : ''); }
  if (s >= 60) return Math.floor(s / 60) + ' min' + (s % 60 ? ' ' + (s % 60) + ' s' : '');
  return s + ' s';
}
function fmtKm(d) { return (Math.round(d / 10) * 10).toLocaleString('en-US') + ' km'; }

// ---------- drawing ----------
function mx(lon) { return mapX + (lon - LON0) / (LON1 - LON0) * mapW; }
function my(lat) { return mapY + (LAT1 - lat) / (LAT1 - LAT0) * mapH; }
function nx(n) { return mx(n.lon); }
function ny(n) { return my(n.lat); }

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
  fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(narrow ? 14.5 : 18);
  text(narrow ? 'CDN Routing and Cache Flow' : 'CDN Request Routing and Cache Flow', margin, 10);
  textAlign(RIGHT, TOP); textSize(narrow ? 12 : 13.5); fill(60);
  text('Clock ' + fmtClock(clock), canvasWidth - margin, narrow ? 12 : 13);
  textStyle(NORMAL);

  drawMap(narrow);
  drawLegend(narrow);
  const py = mapY + mapH + 24, ph = drawHeight - 8 - py, full = canvasWidth - margin * 2;
  if (!narrow) {
    const lw = Math.round(full * 0.6);
    drawRequestPanel(margin, py, lw, ph);
    drawSessionPanel(margin + lw + 8, py, full - lw - 8, ph);
  } else {
    drawRequestPanel(margin, py, full, ph);
  }
  drawTooltip();
}

function drawMap(narrow) {
  // sea, land, graticule; clipped to the map box
  noStroke(); fill(214, 232, 246); rect(mapX, mapY, mapW, mapH, 6);
  drawingContext.save();
  drawingContext.beginPath(); drawingContext.rect(mapX, mapY, mapW, mapH); drawingContext.clip();
  fill(236, 240, 232); stroke(190, 200, 188); strokeWeight(1);
  for (const ring of LAND) {
    beginShape(); for (const pt of ring) vertex(mx(pt[0]), my(pt[1])); endShape(CLOSE);
  }
  stroke(255, 255, 255, 150); strokeWeight(1);
  for (let lon = -120; lon <= 150; lon += 30) line(mx(lon), mapY, mx(lon), mapY + mapH);
  for (let lat = -30; lat <= 60; lat += 30) line(mapX, my(lat), mapX + mapW, my(lat));
  drawingContext.restore();
  noFill(); stroke(170, 190, 205); strokeWeight(1); rect(mapX, mapY, mapW, mapH, 6); noStroke();

  drawPath();

  const activePop = last && last.result !== 'DIRECT' ? last.pop : null;
  for (const p of POPS) drawPop(p, p === activePop, narrow);
  drawOrigin(narrow);
  for (const u of USERS) drawUser(u, last && last.user === u);

  let over = false;
  for (const u of USERS) if (dist(mouseX, mouseY, nx(u), ny(u)) < 13) over = true;
  cursor(over ? HAND : ARROW);
}

// A leg between two nodes as one or two on-map segments. When the shorter way round the globe
// crosses the Pacific (more than 180 degrees of longitude apart), the leg leaves through one
// side of the map and re-enters through the other, as it would on a wall map.
function legSegments(a, b) {
  let lonB = b.lon;
  if (Math.abs(b.lon - a.lon) <= 180) return [{ f0: 0, f1: 1, x0: nx(a), y0: ny(a), x1: nx(b), y1: ny(b) }];
  lonB += b.lon < a.lon ? 360 : -360;                 // unwrap b so the path goes the short way
  const span = lonB - a.lon;
  const exitLon = span > 0 ? LON1 : LON0, enterLon = span > 0 ? LON0 : LON1;
  const fExit = (exitLon - a.lon) / span;
  const fEnter = ((span > 0 ? LON0 + 360 : LON1 - 360) - a.lon) / span;
  const latAt = f => a.lat + (b.lat - a.lat) * f;
  return [
    { f0: 0, f1: fExit, x0: nx(a), y0: ny(a), x1: mx(exitLon), y1: my(latAt(fExit)) },
    { f0: fEnter, f1: 1, x0: mx(enterLon), y0: my(latAt(fEnter)), x1: nx(b), y1: ny(b) }
  ];
}

// the route of the last request: lines grow as the packet travels, then stay
function drawPath() {
  if (!anim) return;
  const legMs = 430;
  const k = (millis() - anim.start) / legMs;
  const done = k >= anim.legs.length;
  const seen = new Set();
  for (let i = 0; i < anim.legs.length; i++) {
    const [a, b, col] = anim.legs[i];
    if (i > k) break;
    const f = constrain(k - i, 0, 1);
    const key = [a.id, b.id].sort().join('|');
    for (const sg of legSegments(a, b)) {
      if (f <= sg.f0) continue;
      const g = constrain((f - sg.f0) / (sg.f1 - sg.f0), 0, 1);
      const x1 = lerp(sg.x0, sg.x1, g), y1 = lerp(sg.y0, sg.y1, g);
      if (!seen.has(key)) { stroke(col[0], col[1], col[2]); strokeWeight(2.5); line(sg.x0, sg.y0, x1, y1); noStroke(); }
      if (f < 1 && f < sg.f1) { fill(255, 235, 59); stroke(60); strokeWeight(1.5); circle(x1, y1, 10); noStroke(); }
    }
    if (f >= 1) seen.add(key);
  }
  if (done && last) {
    // label each distinct leg with its round-trip time
    const labels = [];
    for (const [a, b] of anim.legs) {
      const key = [a.id, b.id].sort().join('|');
      if (labels.find(l => l.key === key)) continue;
      labels.push({ key: key, a: a, b: b });
    }
    textSize(11); textStyle(BOLD); textAlign(CENTER, CENTER);
    for (const l of labels) {
      const t = Math.round(rttMs(l.a, l.b)) + ' ms';
      const w = textWidth(t) + 8;
      // use the longest on-map segment of the leg
      let sg = null;
      for (const c of legSegments(l.a, l.b)) if (!sg || dist(c.x0, c.y0, c.x1, c.y1) > dist(sg.x0, sg.y0, sg.x1, sg.y1)) sg = c;
      if (dist(sg.x0, sg.y0, sg.x1, sg.y1) < w + 26) continue;             // too short to label
      // slide the label along the leg to the spot farthest from any node and its name
      let cx = 0, cy = 0, bestGap = -1;
      for (const f of [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8]) {
        const px = lerp(sg.x0, sg.x1, f), py = lerp(sg.y0, sg.y1, f);
        let gap = 1e9;
        for (const n of USERS.concat(POPS, [ORIGIN])) {
          const ox = n.lab === 'R' ? 30 : (n.lab === 'L' ? -30 : 0);
          const oy = n.lab === 'T' ? -14 : (n.lab === 'B' ? 14 : 0);
          gap = Math.min(gap, dist(px, py, nx(n), ny(n)), dist(px, py, nx(n) + ox, ny(n) + oy),
            dist(px, py, nx(n) + ox * 2, ny(n) + oy));
        }
        if (gap > bestGap + 6) { bestGap = gap; cx = px; cy = py; }
      }
      if (bestGap < 34) continue;                    // crowded: the panel below gives the figure
      fill(255, 255, 255, 235); stroke(150); strokeWeight(1); rect(cx - w / 2, cy - 8, w, 16, 4); noStroke();
      fill(30); text(t, cx, cy);
    }
    textStyle(NORMAL);
  }
}

function nodeLabel(n, str, r, bold) {
  textSize(11); textStyle(bold ? BOLD : NORMAL); noStroke();
  const x = nx(n), y = ny(n), w = textWidth(str);
  let tx = x, ty = y;
  if (n.lab === 'R') { textAlign(LEFT, CENTER); tx = x + r + 3; }
  else if (n.lab === 'L') { textAlign(RIGHT, CENTER); tx = x - r - 3; }
  else if (n.lab === 'T') { textAlign(CENTER, BOTTOM); ty = y - r - 1; }
  else { textAlign(CENTER, TOP); ty = y + r + 2; }
  // keep the label inside the map box
  if (n.lab === 'R' && tx + w > mapX + mapW - 2) { textAlign(RIGHT, CENTER); tx = x - r - 3; }
  if ((n.lab === 'T' || n.lab === 'B') && tx - w / 2 < mapX + 2) { textAlign(LEFT, n.lab === 'T' ? BOTTOM : TOP); tx = mapX + 2; }
  fill(255, 255, 255, 200);
  const al = drawingContext.textAlign, bl = drawingContext.textBaseline;
  const bx = al === 'left' ? tx - 1 : (al === 'right' ? tx - w - 1 : tx - w / 2 - 1);
  const by = bl === 'middle' ? ty - 7 : (bl === 'top' ? ty - 1 : ty - 13);
  rect(bx, by, w + 2, 14, 3);
  fill(30); text(str, tx, ty);
  textStyle(NORMAL);
}

function drawPop(p, active, narrow) {
  const x = nx(p), y = ny(p), r = active ? 8 : 6.5;
  stroke(active ? color(30) : color(255)); strokeWeight(active ? 2 : 1.2);
  fill(TEAL[0], TEAL[1], TEAL[2]);
  quad(x, y - r, x + r, y, x, y + r, x - r, y);
  noStroke();
  // two cache slots under the PoP: static copy, API copy
  for (let i = 0; i < 2; i++) {
    const st = copyState(p, CONTENT[i]);
    const sx = x - 7 + i * 8, sy = y + r + 2;
    stroke(90); strokeWeight(1);
    if (st === 'fresh') fill(GREEN[0], GREEN[1], GREEN[2]);
    else if (st === 'expired') fill(AMBER[0], AMBER[1], AMBER[2]);
    else fill(255);
    rect(sx, sy, 6, 6, 1); noStroke();
  }
  if (!narrow || active) nodeLabel(p, p.name, r, active);
}

function drawOrigin(narrow) {
  const x = nx(ORIGIN), y = ny(ORIGIN);
  stroke(255); strokeWeight(1.5); fill(ORANGE[0], ORANGE[1], ORANGE[2]);
  rect(x - 7, y - 7, 14, 14, 3); noStroke();
  nodeLabel(ORIGIN, narrow ? 'Origin' : ORIGIN.name, 7, true);
}

function drawUser(u, active) {
  const x = nx(u), y = ny(u);
  const hover = dist(mouseX, mouseY, x, y) < 13;
  stroke(active ? color(30) : color(255)); strokeWeight(active ? 2.2 : 1.5);
  fill(hover ? color(66, 150, 240) : color(BLUE[0], BLUE[1], BLUE[2]));
  circle(x, y, active || hover ? 17 : 14); noStroke();
  nodeLabel(u, u.name, 8, active);
}

function drawLegend(narrow) {
  const y = mapY + mapH + 12;
  let x = margin + 2;
  textSize(11); textAlign(LEFT, CENTER); textStyle(NORMAL); noStroke();
  const item = (drawGlyph, label) => {
    drawGlyph(x + 6, y); noStroke(); fill(70); text(label, x + 16, y);
    x += 16 + textWidth(label) + 14;
  };
  item((gx, gy) => { stroke(255); strokeWeight(1); fill(BLUE[0], BLUE[1], BLUE[2]); circle(gx, gy, 11); },
    narrow ? 'user (click)' : 'user (click to send a request)');
  item((gx, gy) => { stroke(255); strokeWeight(1); fill(TEAL[0], TEAL[1], TEAL[2]); quad(gx, gy - 6, gx + 6, gy, gx, gy + 6, gx - 6, gy); },
    narrow ? 'PoP' : 'CDN PoP');
  item((gx, gy) => { stroke(255); strokeWeight(1); fill(ORANGE[0], ORANGE[1], ORANGE[2]); rect(gx - 5, gy - 5, 10, 10, 2); }, 'origin');
  if (canvasWidth >= 520) {
    item((gx, gy) => {
      stroke(90); strokeWeight(1); fill(GREEN[0], GREEN[1], GREEN[2]); rect(gx - 6, gy - 3, 6, 6, 1);
      fill(255); rect(gx + 2, gy - 3, 6, 6, 1);
    }, narrow ? ' static | API copy' : ' cached copy at a PoP: static | API (green fresh, amber expired)');
  }
}

function panel(x, y, w, h) {
  fill(255); stroke(200); strokeWeight(1); rect(x, y, w, h, 8); noStroke();
}

const BADGE = {
  HIT: ['CACHE HIT', GREEN], MISS: ['CACHE MISS', RED], EXPIRED: ['TTL EXPIRED', AMBER],
  BYPASS: ['NOT CACHEABLE', PURPLE], DIRECT: ['NO CDN', ORANGE]
};

function drawRequestPanel(x, y, w, h) {
  panel(x, y, w, h);
  const tx = x + 10, tw = w - 20, limit = y + h - 4;
  let ty = y + 8;
  if (!last) {
    fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(13.5);
    text(fitText(notice ? 'Cache state changed' : 'Send a request', tw), tx, ty); textStyle(NORMAL);
    ty += 21;
    const msg = notice || ('Click a user. The request is routed to the nearest point of presence (real CDNs choose it with ' +
      'DNS-based routing or anycast). The PoP answers from its cache if it holds a fresh copy (a hit); otherwise it ' +
      'fetches the object from the origin, stores it for the TTL, and returns it (a miss).');
    ty = drawWrapped(msg, tx, ty, tw, 12.5, 16.5, color(30), limit) + 5;
    drawWrapped('Model: 1 ms of round-trip time per 100 km (light in fibre, about 200,000 km/s), origin processing ' +
      '40 ms, edge processing 5 ms. Illustrative.', tx, ty, tw, 11.5, 15, color(100), limit);
    return;
  }
  const r = last, b = BADGE[r.result];
  // heading and result badge
  textSize(13.5); textStyle(BOLD); textAlign(LEFT, TOP);
  const head = r.result === 'DIRECT' ? r.user.name + ' → origin' : r.user.name + ' → ' + r.pop.name + ' PoP';
  textSize(11); const bw = textWidth(b[0]) + 14; textSize(13.5);
  fill(NAVY[0], NAVY[1], NAVY[2]); text(fitText(head, tw - bw - 8), tx, ty);
  const hx = tx + Math.min(textWidth(head), tw - bw - 8) + 8;
  fill(b[1][0], b[1][1], b[1][2]); rect(hx, ty - 1, bw, 17, 4);
  fill(255); textSize(11); textAlign(CENTER, CENTER); text(b[0], hx + bw / 2, ty + 8);
  textStyle(NORMAL);
  ty += 24;

  // two bars on a fixed scale: this request, and the reference case
  const labW = Math.min(118, tw * 0.3), barX = tx + labW, barW = tw - labW - 56;
  const refSegs = r.result === 'DIRECT'
    ? [['user ↔ edge', rttMs(r.user, r.pop), BLUE], ['edge processing', EDGE_MS, TEAL]]
    : [['user ↔ origin', rttMs(r.user, ORIGIN), ORANGE], ['origin processing', ORIGIN_MS, AMBER]];
  const rows = [[r.result === 'DIRECT' ? 'Direct to origin' : 'This request', r.segs, r.totalMs],
    [r.result === 'DIRECT' ? 'CDN cache hit' : 'Direct, no CDN', refSegs, r.result === 'DIRECT' ? r.hitMs : r.directMs]];
  for (const row of rows) {
    fill(40); textSize(12); textAlign(LEFT, CENTER); text(fitText(row[0], labW - 4), tx, ty + 7);
    fill(236, 239, 242); rect(barX, ty, barW, 14, 3);
    let bx = barX;
    for (const s of row[1]) {
      const sw = barW * Math.min(s[1], BAR_SCALE_MS) / BAR_SCALE_MS;
      fill(s[2][0], s[2][1], s[2][2]); rect(bx, ty, Math.max(1.5, sw), 14, 2); bx += sw;
    }
    fill(20); textStyle(BOLD); textAlign(LEFT, CENTER); text(Math.round(row[2]) + ' ms', barX + barW + 6, ty + 7); textStyle(NORMAL);
    ty += 19;
  }
  // key to the segments used above
  const keys = [];
  for (const s of r.segs.concat(refSegs)) if (!keys.find(k => k[0] === s[0])) keys.push(s);
  let kx = tx; textSize(11); textAlign(LEFT, CENTER);
  for (const s of keys) {
    const lbl = s[0] + ' ' + Math.round(s[1]) + ' ms';
    if (kx + 12 + textWidth(lbl) > tx + tw) { kx = tx; ty += 15; }       // wrap the key
    fill(s[2][0], s[2][1], s[2][2]); rect(kx, ty + 2, 8, 8, 2);
    fill(80); text(lbl, kx + 11, ty + 6.5);
    kx += 11 + textWidth(lbl) + 10;
  }
  ty += 18;

  // what happened, in words
  const d = Math.round(r.directMs) - Math.round(r.totalMs);
  const ue = fmtKm(distKm(r.user, r.pop)), uo = fmtKm(distKm(r.user, ORIGIN));
  let msg;
  if (r.result === 'HIT') {
    msg = 'The PoP ' + ue + ' away holds a fresh copy (' + fmtLeft(r.content.ttl - r.ageS) + ' of its TTL left), so the origin ' +
      uo + ' away is never contacted: ' + d + ' ms faster than going direct.';
  } else if (r.result === 'MISS') {
    msg = 'The PoP had no copy, so it fetched from the origin, stored the object for ' + fmtLeft(r.content.ttl) +
      ', and returned it. This miss is ' + Math.abs(d) + ' ms ' + (d < 0 ? 'slower' : 'faster') +
      ' than going direct; the next request through this PoP is a hit.';
  } else if (r.result === 'EXPIRED') {
    msg = 'The stored copy was ' + fmtLeft(r.ageS) + ' old against a TTL of ' + fmtLeft(r.content.ttl) + ', so the PoP went back ' +
      'to the origin before answering (real PoPs revalidate with a conditional request). The copy is fresh again.';
  } else if (r.result === 'BYPASS') {
    msg = 'A personalized response differs for every user, so the PoP may not store it and relays every request to the origin: ' +
      Math.abs(d) + ' ms ' + (d < 0 ? 'slower' : 'faster') + ' than going direct, and it lowers the hit ratio.';
  } else {
    msg = 'With the CDN off, DNS resolves straight to the origin ' + uo + ' away and every request pays the full round trip. ' +
      'A hit at the ' + r.pop.name + ' PoP (' + ue + ') would take ' + Math.round(r.hitMs) + ' ms.';
  }
  drawWrapped(msg, tx, ty, tw, 12.5, 16, color(30), limit);
}

function drawSessionPanel(x, y, w, h) {
  panel(x, y, w, h);
  const tx = x + 10, tw = w - 20, limit = y + h - 4;
  let ty = y + 8;
  fill(NAVY[0], NAVY[1], NAVY[2]); textAlign(LEFT, TOP); textStyle(BOLD); textSize(13.5);
  text('Session totals', tx, ty); textStyle(NORMAL); ty += 22;
  const ratio = stats.cdn ? stats.hits / stats.cdn : 0;
  fill(40); textSize(12.5); text('Cache hit ratio', tx, ty);
  textAlign(RIGHT, TOP); textStyle(BOLD); textSize(15);
  fill(stats.cdn ? color(GREEN[0], GREEN[1], GREEN[2]) : color(120));
  text(stats.cdn ? Math.round(ratio * 100) + '%' : 'no data', tx + tw, ty - 2); textStyle(NORMAL);
  ty += 19;
  fill(236, 239, 242); rect(tx, ty, tw, 8, 4);
  if (stats.cdn) { fill(GREEN[0], GREEN[1], GREEN[2]); rect(tx, ty, Math.max(ratio > 0 ? 4 : 0, tw * ratio), 8, 4); }
  ty += 14;
  textAlign(LEFT, TOP);
  const plural = (n, s) => n + ' ' + s + (n === 1 ? '' : (s === 'miss' ? 'es' : 's'));
  ty = drawWrapped(plural(stats.hits, 'hit') + ', ' + plural(stats.misses, 'miss') + ', ' + stats.bypass + ' not cacheable' +
    (stats.direct ? ', ' + stats.direct + ' sent direct' : ''), tx, ty, tw, 12, 15.5, color(50), limit);
  ty = drawWrapped('Requests that reached the origin: ' + (stats.misses + stats.bypass + stats.direct) + ' of ' + stats.n,
    tx, ty, tw, 12, 15.5, color(50), limit);
  if (stats.n) {
    ty = drawWrapped('Mean response ' + Math.round(stats.sumMs / stats.n) + ' ms (all direct: ' +
      Math.round(stats.sumDirectMs / stats.n) + ' ms)', tx, ty, tw, 12, 15.5, color(20), limit);
  }
  drawWrapped('Hit ratio = hits ÷ requests routed through the CDN.', tx, ty + 3, tw, 11.5, 15, color(100), limit);
}

// hovering a PoP lists what it holds and how much TTL is left
function drawTooltip() {
  let pop = null;
  for (const p of POPS) if (dist(mouseX, mouseY, nx(p), ny(p) + 3) < 11) pop = p;
  if (!pop) return;
  const lines = [pop.name + ' PoP'];
  for (let i = 0; i < 2; i++) {
    const c = CONTENT[i], st = copyState(pop, c);
    const name = i === 0 ? 'Static asset' : 'API response';
    if (st === 'empty') lines.push(name + ': not cached');
    else if (st === 'fresh') lines.push(name + ': fresh, ' + fmtLeft(c.ttl - (clock - cache[pop.id][c.key])) + ' left');
    else lines.push(name + ': expired (' + fmtLeft(clock - cache[pop.id][c.key]) + ' old)');
  }
  textSize(11.5); textStyle(NORMAL);
  let w = 0; for (const l of lines) w = Math.max(w, textWidth(l));
  w += 16;
  const h = lines.length * 15 + 10;
  const x = constrain(mouseX + 12, 4, canvasWidth - w - 4), y = constrain(mouseY + 14, 4, drawHeight - h - 4);
  fill(40, 40, 40, 235); noStroke(); rect(x, y, w, h, 5);
  fill(255); textAlign(LEFT, TOP);
  for (let i = 0; i < lines.length; i++) { textStyle(i === 0 ? BOLD : NORMAL); text(lines[i], x + 8, y + 6 + i * 15); }
  textStyle(NORMAL);
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
  if (mouseY > drawHeight) return;
  for (const u of USERS) {
    if (dist(mouseX, mouseY, nx(u), ny(u)) < 13) { sendRequest(u); return; }
  }
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
