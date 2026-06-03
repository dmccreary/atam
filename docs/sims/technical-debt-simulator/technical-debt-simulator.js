// Technical Debt Accumulation Simulator
// CANVAS_HEIGHT: 550
// Bloom L3 (Apply): students manipulate architectural quality, feature pressure,
// and refactoring investment to observe how technical debt accumulates over 24
// months and erodes feature-delivery velocity — and how an early ATAM evaluation
// bends the trajectory. Default state is paused (a required MicroSim standard).

// ---- Responsive canvas geometry ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;          // top drawing/plot region
let controlHeight = 150;       // bottom control region (4 rows)
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 230;    // room for "Feature Pressure: 100%" + slider
let defaultTextSize = 16;

// ---- Controls ----
let startButton, resetButton, atamCheckbox;
let qualitySlider, pressureSlider, refactorSlider;

// ---- Simulation state ----
let isRunning = false;         // MicroSim standard: start paused
let currentMonth = 0;          // 0..24, advanced by the animation timer
const totalMonths = 24;
let lastStepTime = 0;
const stepIntervalMs = 400;    // one simulated month per 400ms

// trajectory arrays recomputed each frame from the current slider values
let debt = [];
let delivery = [];
let service = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: buttons + ATAM toggle
  startButton = createButton('Start');
  startButton.position(10, drawHeight + 8);
  startButton.mousePressed(toggleSimulation);

  resetButton = createButton('Reset');
  resetButton.position(75, drawHeight + 8);
  resetButton.mousePressed(resetSimulation);

  atamCheckbox = createCheckbox(' Show ATAM Effect', false);
  atamCheckbox.position(145, drawHeight + 10);
  atamCheckbox.style('font-size', '15px');

  // Rows 2-4: parameter sliders
  qualitySlider = createSlider(0, 100, 70, 1);
  qualitySlider.position(sliderLeftMargin, drawHeight + 40);
  qualitySlider.size(canvasWidth - sliderLeftMargin - margin);

  pressureSlider = createSlider(0, 100, 50, 1);
  pressureSlider.position(sliderLeftMargin, drawHeight + 75);
  pressureSlider.size(canvasWidth - sliderLeftMargin - margin);

  refactorSlider = createSlider(0, 20, 5, 1);
  refactorSlider.position(sliderLeftMargin, drawHeight + 110);
  refactorSlider.size(canvasWidth - sliderLeftMargin - margin);

  describe('A time-series simulation showing how technical debt accumulates over ' +
    '24 months based on architectural quality, feature pressure, and refactoring ' +
    'investment, with an optional ATAM evaluation that improves the trajectory.', LABEL);
}

function draw() {
  updateCanvasSize();
  computeTrajectory();

  // advance the animation one month per interval while running
  if (isRunning && millis() - lastStepTime > stepIntervalMs) {
    lastStepTime = millis();
    if (currentMonth < totalMonths) {
      currentMonth++;
    } else {
      isRunning = false;
      startButton.html('Start');
    }
  }

  const crisis = delivery[currentMonth] < 50;

  // ---- drawing region background (flush red when delivery is critically low) ----
  if (crisis) {
    fill(255, 235, 235);
  } else {
    fill('aliceblue');
  }
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // control region background
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  drawPlot(crisis);
  drawControlLabels();
}

// Recompute the full 24-month trajectory from current slider values.
function computeTrajectory() {
  const archQ = qualitySlider.value();
  const pressure = pressureSlider.value();
  const refac = refactorSlider.value();
  const atamOn = atamCheckbox.checked();

  debt = [0];
  for (let m = 1; m <= totalMonths; m++) {
    let accum = (pressure / 100) * (1 - archQ / 100) * 16;
    // An ATAM evaluation at month 3 surfaces risks and drives architectural
    // improvements, sharply lowering the rate of new debt afterward.
    if (atamOn && m >= 3) accum *= 0.35;
    const paydown = (refac / 100) * 8;
    debt[m] = constrain(debt[m - 1] + accum - paydown, 0, 100);
  }
  delivery = [];
  service = [];
  for (let m = 0; m <= totalMonths; m++) {
    delivery[m] = constrain(100 - debt[m] * 0.6, 0, 100);
    service[m] = constrain(debt[m] * 0.5, 0, 100);
  }
}

function drawPlot(crisis) {
  const plotLeft = 55;
  const plotRight = canvasWidth - 20;
  const plotTop = 70;
  const plotBottom = drawHeight - 35;

  const xOf = (m) => map(m, 0, totalMonths, plotLeft, plotRight);
  const yOf = (v) => map(v, 0, 100, plotBottom, plotTop);

  // title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(22);
  text('Technical Debt Accumulation', canvasWidth / 2, 12);

  // horizontal gridlines + y labels
  textSize(12);
  textAlign(RIGHT, CENTER);
  for (let v = 0; v <= 100; v += 25) {
    const gy = yOf(v);
    stroke(225);
    strokeWeight(1);
    line(plotLeft, gy, plotRight, gy);
    noStroke();
    fill(110);
    text(v + '%', plotLeft - 6, gy);
  }

  // x axis labels (months)
  textAlign(CENTER, TOP);
  for (let m = 0; m <= totalMonths; m += 6) {
    const gx = xOf(m);
    fill(110);
    noStroke();
    text('M' + m, gx, plotBottom + 6);
  }

  // ---- accumulated technical debt: red filled area ----
  noStroke();
  fill(220, 70, 70, 90);
  beginShape();
  vertex(xOf(0), yOf(0));
  for (let m = 0; m <= currentMonth; m++) vertex(xOf(m), yOf(debt[m]));
  vertex(xOf(currentMonth), yOf(0));
  endShape(CLOSE);

  // debt outline
  stroke(200, 50, 50);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let m = 0; m <= currentMonth; m++) vertex(xOf(m), yOf(debt[m]));
  endShape();

  // ---- feature delivery rate: green line ----
  stroke(40, 160, 70);
  strokeWeight(3);
  noFill();
  beginShape();
  for (let m = 0; m <= currentMonth; m++) vertex(xOf(m), yOf(delivery[m]));
  endShape();

  // ---- debt service cost: orange dashed line ----
  stroke(240, 150, 40);
  strokeWeight(2);
  drawDashedLine(xOf, yOf, service);

  // ---- ATAM evaluation marker at month 3 ----
  if (atamCheckbox.checked()) {
    const ax = xOf(3);
    stroke(90, 90, 200);
    strokeWeight(2);
    drawingContext.setLineDash([5, 4]);
    line(ax, plotTop, ax, plotBottom);
    drawingContext.setLineDash([]);
    noStroke();
    fill(70, 70, 180);
    textSize(11);
    textAlign(LEFT, BOTTOM);
    text('ATAM Evaluation', ax + 3, plotTop + 12);
  }

  drawLegend(plotLeft, plotTop);

  // crisis message
  if (crisis) {
    noStroke();
    fill(180, 30, 30);
    textSize(13);
    textAlign(CENTER, BOTTOM);
    text('Delivery velocity critically impaired — architectural rescue required.',
      canvasWidth / 2, plotBottom - 4);
  }

  // current-month / value readout
  noStroke();
  fill(60);
  textSize(13);
  textAlign(RIGHT, TOP);
  text('Month ' + currentMonth + '   Delivery ' + nf(delivery[currentMonth], 0, 0) +
    '%   Debt ' + nf(debt[currentMonth], 0, 0) + '%', plotRight, plotTop - 22);
}

function drawDashedLine(xOf, yOf, arr) {
  noFill();
  drawingContext.setLineDash([6, 5]);
  beginShape();
  for (let m = 0; m <= currentMonth; m++) vertex(xOf(m), yOf(arr[m]));
  endShape();
  drawingContext.setLineDash([]);
}

function drawLegend(plotLeft, plotTop) {
  const lx = plotLeft + 6;
  let ly = plotTop + 4;
  textSize(12);
  textAlign(LEFT, CENTER);
  const items = [
    [color(40, 160, 70), 'Feature Delivery Rate'],
    [color(200, 50, 50), 'Accumulated Technical Debt'],
    [color(240, 150, 40), 'Debt Service Cost']
  ];
  for (const [c, label] of items) {
    stroke(c);
    strokeWeight(3);
    line(lx, ly, lx + 22, ly);
    noStroke();
    fill(60);
    text(label, lx + 28, ly);
    ly += 17;
  }
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Architectural Quality: ' + qualitySlider.value() + '%', 10, drawHeight + 50);
  text('Feature Pressure: ' + pressureSlider.value() + '%', 10, drawHeight + 85);
  text('Refactoring Investment: ' + refactorSlider.value() + '%', 10, drawHeight + 120);
}

function toggleSimulation() {
  // restart from the beginning if the run already finished
  if (currentMonth >= totalMonths) currentMonth = 0;
  isRunning = !isRunning;
  lastStepTime = millis();
  startButton.html(isRunning ? 'Pause' : 'Start');
}

function resetSimulation() {
  isRunning = false;
  currentMonth = 0;
  startButton.html('Start');
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  qualitySlider.size(canvasWidth - sliderLeftMargin - margin);
  pressureSlider.size(canvasWidth - sliderLeftMargin - margin);
  refactorSlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
