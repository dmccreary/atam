// Separation of Concerns in a Layered Architecture
// CANVAS_HEIGHT: 470
// Bloom L2 (Understand): students explain why separating concerns into distinct
// layers reduces the blast radius of a change. A toggle compares a clean layered
// design against a concern-violation, and a "trigger change" button shows how many
// components a single Data-layer change affects in each case.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let defaultTextSize = 16;

let modeButton, changeButton;
let violationMode = false;   // false = clean, true = concern violation
let changeActive = false;    // whether a Data-layer change has been triggered
let selectedComp = null;

// Three layers, each with components. y/h set in layout().
const layers = [
  { name: 'Presentation', color: [187, 222, 251], border: [21, 101, 192],
    comps: [
      { id: 'webui', label: 'Web UI', resp: 'Renders pages and forms; collects user input. Should depend only on the Business Logic layer.' },
      { id: 'mobileui', label: 'Mobile UI', resp: 'Mobile client screens. Like the Web UI, it should never reach past Business Logic.' }
    ] },
  { name: 'Business Logic', color: [200, 230, 201], border: [46, 125, 50],
    comps: [
      { id: 'ordermgr', label: 'Order Manager', resp: 'Coordinates order workflow and rules. Depends on the Data Access layer for persistence.' },
      { id: 'pricing', label: 'Pricing Engine', resp: 'Computes prices and discounts. Reads product data through the Data Access layer.' }
    ] },
  { name: 'Data Access', color: [255, 224, 178], border: [239, 108, 0],
    comps: [
      { id: 'orderdao', label: 'Order DAO', resp: 'Maps orders to/from the database. This is the component we will change to test the blast radius.' },
      { id: 'productdao', label: 'Product DAO', resp: 'Reads and writes product records in the database.' }
    ] }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  modeButton = createButton('Mode: Clean Architecture');
  modeButton.position(10, drawHeight + 10);
  modeButton.mousePressed(toggleMode);

  changeButton = createButton('Trigger Data-Layer Change');
  changeButton.position(230, drawHeight + 10);
  changeButton.mousePressed(() => { changeActive = !changeActive; });

  describe('A three-layer architecture diagram comparing clean separation of concerns ' +
    'with a concern violation, showing how a Data-layer change propagates to more ' +
    'components when a layer is skipped.', LABEL);
}

function layout() {
  const leftW = canvasWidth * 0.6;
  const bandX = margin;
  const bandW = leftW - margin * 2;
  const top = 55;
  const bandH = 92;
  const gap = 18;
  for (let i = 0; i < layers.length; i++) {
    layers[i].x = bandX;
    layers[i].w = bandW;
    layers[i].y = top + i * (bandH + gap);
    layers[i].h = bandH;
    const cw = (bandW - 40) / 2;
    for (let j = 0; j < layers[i].comps.length; j++) {
      const c = layers[i].comps[j];
      c.x = bandX + 15 + j * (cw + 10);
      c.y = layers[i].y + 32;
      c.w = cw;
      c.h = 44;
    }
  }
  return leftW;
}

// Which components are affected by a change to Order DAO?
function affectedSet() {
  const set = {};
  if (!changeActive) return set;
  set['orderdao'] = true;          // the changed component
  set['ordermgr'] = true;          // Business depends on Data (1 hop)
  set['pricing'] = true;
  if (violationMode) set['webui'] = true; // skipped-layer dependency (2 hops)
  return set;
}

function draw() {
  updateCanvasSize();
  const leftW = layout();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  // title
  fill('black');
  textAlign(CENTER, TOP);
  textSize(22);
  text('Separation of Concerns', leftW / 2, 12);

  const affected = affectedSet();

  // layer bands + components
  for (const layer of layers) {
    noStroke();
    fill(layer.color[0], layer.color[1], layer.color[2], 120);
    rect(layer.x, layer.y, layer.w, layer.h, 8);
    fill(layer.border[0], layer.border[1], layer.border[2]);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(13);
    text(layer.name, layer.x + 8, layer.y + 6);

    for (const c of layer.comps) {
      const isAff = affected[c.id];
      if (isAff) { stroke(220, 50, 50); strokeWeight(3); fill(255, 205, 205); }
      else { stroke(layer.border[0], layer.border[1], layer.border[2]); strokeWeight(2); fill('white'); }
      rect(c.x, c.y, c.w, c.h, 8);
      noStroke();
      fill('black');
      textAlign(CENTER, CENTER);
      textSize(14);
      text(c.label, c.x + c.w / 2, c.y + c.h / 2);
    }
  }

  drawArrows();

  // blast-radius counter
  const count = Object.keys(affected).length;
  noStroke();
  textAlign(LEFT, TOP);
  textSize(15);
  fill(count > 0 ? color(180, 30, 30) : color(60));
  text('Change blast radius: ' + count + ' component' + (count === 1 ? '' : 's'),
    margin, drawHeight - 26);

  drawInfoPanel(leftW);
  drawControlLabel();
}

function drawArrows() {
  // clean downward dependency arrows: Presentation -> Business -> Data
  stroke(120);
  strokeWeight(2);
  arrow(midX(layers[0]), layers[0].y + layers[0].h, midX(layers[1]), layers[1].y, color(120));
  arrow(midX(layers[1]), layers[1].y + layers[1].h, midX(layers[2]), layers[2].y, color(120));

  // violation: red diagonal from Web UI straight into Order DAO (skips Business)
  if (violationMode) {
    const webui = layers[0].comps[0];
    const orderdao = layers[2].comps[0];
    arrow(webui.x + webui.w, webui.y + webui.h / 2,
          orderdao.x + orderdao.w, orderdao.y, color(220, 40, 40));
  }
}

function midX(layer) { return layer.x + layer.w / 2; }

function arrow(x1, y1, x2, y2, c) {
  stroke(c);
  strokeWeight(violationModeArrow(c) ? 3 : 2);
  line(x1, y1, x2, y2);
  const a = atan2(y2 - y1, x2 - x1);
  push();
  translate(x2, y2);
  rotate(a);
  fill(c);
  noStroke();
  triangle(0, 0, -9, -4, -9, 4);
  pop();
}

function violationModeArrow(c) {
  return red(c) > 200 && green(c) < 80;
}

function drawInfoPanel(leftW) {
  const px = leftW + 8;
  const pw = canvasWidth - px - margin;
  if (pw < 80) return;
  const py = 55;
  const ph = drawHeight - py - 20;
  noStroke();
  fill(255, 255, 255, 235);
  stroke(200);
  strokeWeight(1);
  rect(px, py, pw, ph, 10);
  noStroke();
  fill(30, 60, 120);
  textAlign(LEFT, TOP);
  textSize(15);
  text('Details', px + 12, py + 10);
  fill(50);
  textSize(13);
  if (selectedComp) {
    text(selectedComp.label, px + 12, py + 36, pw - 24);
    text(selectedComp.resp, px + 12, py + 60, pw - 24, ph - 70);
  } else {
    const msg = violationMode
      ? 'Concern Violation mode: the Web UI calls Order DAO directly (red arrow), skipping the Business Logic layer. Trigger a Data-layer change to see the larger blast radius.'
      : 'Clean Architecture mode: each layer depends only on the one below it. Click a component to read its responsibility, then trigger a Data-layer change to count affected components.';
    text(msg, px + 12, py + 36, pw - 24, ph - 46);
  }
}

function drawControlLabel() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(13);
  text(changeActive ? 'Change active — click again to clear' : '',
    410, drawHeight + 25);
}

function toggleMode() {
  violationMode = !violationMode;
  modeButton.html(violationMode ? 'Mode: Concern Violation' : 'Mode: Clean Architecture');
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  selectedComp = null;
  for (const layer of layers) {
    for (const c of layer.comps) {
      if (mouseX >= c.x && mouseX <= c.x + c.w && mouseY >= c.y && mouseY <= c.y + c.h) {
        selectedComp = c;
      }
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  changeButton.position(230, drawHeight + 10);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
