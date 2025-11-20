// ATAM Process Interactive Flowchart MicroSim
// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 12;

// Global variables for responsive design
let containerWidth;
let containerHeight = canvasHeight;

// ATAM Process boxes and connections
let boxes = [];
let currentHoveredBox = null;
let infoText = "";

// Colors
let inputColor = '#E3F2FD';      // Light blue for inputs
let processColor = '#FFF3E0';    // Light orange for process
let outputColor = '#E8F5E8';     // Light green for outputs
let hoverColor = '#FFE082';      // Yellow for hover
let textColor = '#333333';
let boxStroke = '#666666';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  
  // Initialize ATAM process boxes
  initializeATAMBoxes();
  
  describe('Interactive ATAM (Architecture Trade-off Analysis Method) process flowchart. Hover over boxes to learn about each step.', LABEL);
}

function initializeATAMBoxes() {
  let boxWidth = 140;
  let boxHeight = 35;
  let spacing = 20;
  
  // Calculate layout based on container width
  let col1X = margin + 20;
  let col2X = containerWidth * 0.33;
  let col3X = containerWidth * 0.66;
  
  // Input boxes (left column)
  boxes.push({
    x: col1X, y: 50, w: boxWidth, h: boxHeight,
    text: "Business Drivers",
    type: "input",
    description: "Strategic goals and objectives that drive architectural decisions. Includes business constraints, functional and non-functional requirements, and aspirations that shape the architecture."
  });
  
  boxes.push({
    x: col1X, y: 100, w: boxWidth, h: boxHeight,
    text: "Architecture Plan",
    type: "input",
    description: "The blueprint of the system's architecture including architectural styles, patterns, and structural organization that will be evaluated."
  });
  
  boxes.push({
    x: col1X, y: 150, w: boxWidth, h: boxHeight,
    text: "Quality Attributes",
    type: "input",
    description: "Non-functional requirements such as performance, security, maintainability, usability, and reliability that the system must satisfy."
  });
  
  boxes.push({
    x: col1X, y: 200, w: boxWidth, h: boxHeight,
    text: "Architectural Approaches",
    type: "input",
    description: "Strategies and techniques used to address quality attributes, including specific design patterns, architectural styles, and system principles."
  });
  
  boxes.push({
    x: col1X, y: 250, w: boxWidth, h: boxHeight,
    text: "User Stories",
    type: "input",
    description: "High-level descriptions of functionality from an end-user perspective that help ensure the architecture addresses real user needs and requirements."
  });
  
  // Process boxes (middle column)
  boxes.push({
    x: col2X, y: 125, w: boxWidth, h: boxHeight,
    text: "Architectural Decisions",
    type: "process",
    description: "Concrete decisions about the architecture informed by business drivers, quality attributes, and architectural approaches. These decisions form the foundation for analysis."
  });
  
  boxes.push({
    x: col2X, y: 200, w: boxWidth, h: boxHeight,
    text: "Analysis",
    type: "process",
    description: "The core of ATAM where architectural decisions are scrutinized. Architectural strategies are evaluated against desired quality attributes through various analysis techniques and scenario-based evaluation."
  });
  
  // Output boxes (right column)
  boxes.push({
    x: col3X, y: 50, w: boxWidth, h: boxHeight,
    text: "Tradeoffs",
    type: "output",
    description: "Analysis of architectural decisions and their impact on different quality attributes, revealing where compromises are made and their implications."
  });
  
  boxes.push({
    x: col3X, y: 100, w: boxWidth, h: boxHeight,
    text: "Sensitivity Points",
    type: "output",
    description: "Points in the architecture that are sensitive to changes. Understanding these helps predict the impact of modifications on system quality attributes."
  });
  
  boxes.push({
    x: col3X, y: 150, w: boxWidth, h: boxHeight,
    text: "Non-Risks",
    type: "output",
    description: "Architectural aspects determined not to pose risk to the project. Typically well-understood areas with known solutions and proven approaches."
  });
  
  boxes.push({
    x: col3X, y: 200, w: boxWidth, h: boxHeight,
    text: "Risks",
    type: "output",
    description: "Potential problems that could threaten project success. May stem from ambitious quality goals, novel technology dependencies, or architectural uncertainties."
  });
  
  boxes.push({
    x: col3X, y: 250, w: boxWidth, h: boxHeight,
    text: "Risk Themes",
    type: "output",
    description: "Broad areas of concern that emerge from the analysis. These themes help prioritize subsequent actions and guide architectural refinements."
  });
  
  boxes.push({
    x: col3X, y: 300, w: boxWidth, h: boxHeight,
    text: "Distilled Information",
    type: "output",
    description: "Comprehensive summary of identified risks, non-risks, sensitivity points, and tradeoffs that helps stakeholders make informed architectural decisions."
  });
}

function draw() {
  // Drawing area background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, containerWidth, drawHeight);
  
  // Controls area background
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, containerWidth, controlHeight);
  
  // Title
  fill('black');
  noStroke();
  textSize(20);
  textAlign(CENTER, TOP);
  text("ATAM Process Interactive Flowchart", containerWidth/2, margin);
  
  // Column headers
  textSize(14);
  fill('#444444');
  textAlign(CENTER, TOP);
  text("Inputs", containerWidth * 0.2, 35);
  text("Process", containerWidth * 0.5, 35);
  text("Outputs", containerWidth * 0.8, 35);
  
  // Draw connections/arrows
  drawConnections();
  
  // Draw boxes
  drawBoxes();
  
  // Draw info text area
  drawInfoText();
  
  // Instructions
  textSize(12);
  textAlign(LEFT, TOP);
  fill('#666666');
  text("Hover over boxes to learn about each step in the ATAM process", margin, drawHeight + 10);
}

function drawConnections() {
  stroke('#888888');
  strokeWeight(2);
  
  // Arrows from inputs to process
  let processX = containerWidth * 0.33;
  let inputX = margin + 160;
  
  // Multiple input arrows to Architectural Decisions
  for (let i = 0; i < 5; i++) {
    let startY = 67 + (i * 50);
    drawArrow(inputX, startY, processX - 10, 142);
  }
  
  // Arrow from Architectural Decisions to Analysis
  drawArrow(processX + 70, 160, processX + 70, 190);
  
  // Arrows from Analysis to outputs
  let outputX = containerWidth * 0.66;
  let analysisX = processX + 140;
  let analysisY = 217;
  
  for (let i = 0; i < 6; i++) {
    let endY = 67 + (i * 50);
    drawArrow(analysisX + 10, analysisY, outputX - 10, endY);
  }
}

function drawArrow(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);
  
  // Arrow head
  push();
  translate(x2, y2);
  let angle = atan2(y2 - y1, x2 - x1);
  rotate(angle);
  line(0, 0, -8, -3);
  line(0, 0, -8, 3);
  pop();
}

function drawBoxes() {
  // Check for hover
  currentHoveredBox = null;
  for (let box of boxes) {
    if (isMouseOverBox(box)) {
      currentHoveredBox = box;
      infoText = box.description;
      break;
    }
  }
  
  // Draw all boxes
  for (let box of boxes) {
    // Determine box color
    let boxColor;
    if (box.type === "input") boxColor = inputColor;
    else if (box.type === "process") boxColor = processColor;
    else boxColor = outputColor;
    
    // Highlight if hovered
    if (box === currentHoveredBox) {
      boxColor = hoverColor;
    }
    
    // Draw box
    fill(boxColor);
    stroke(boxStroke);
    strokeWeight(1);
    rect(box.x, box.y, box.w, box.h, 5);
    
    // Draw text
    fill(textColor);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(11);
    text(box.text, box.x + box.w/2, box.y + box.h/2);
  }
}

function drawInfoText() {
  // Info text background
  let infoY = drawHeight + 30;
  let infoHeight = 80;
  
  fill('#f8f9fa');
  stroke('#dee2e6');
  strokeWeight(1);
  rect(margin, infoY, containerWidth - 2*margin, infoHeight, 5);
  
  // Info text
  fill('#333333');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);
  
  if (infoText !== "") {
    // Word wrap the text
    let words = infoText.split(' ');
    let lines = [];
    let currentLine = '';
    let maxWidth = containerWidth - 4*margin;
    
    for (let word of words) {
      let testLine = currentLine + word + ' ';
      if (textWidth(testLine) > maxWidth && currentLine !== '') {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine !== '') {
      lines.push(currentLine.trim());
    }
    
    // Draw lines
    for (let i = 0; i < Math.min(lines.length, 4); i++) {
      text(lines[i], margin + 10, infoY + 10 + i * 16);
    }
  } else {
    fill('#888888');
    text("Hover over a box above to see detailed information about that step.", margin + 10, infoY + 15);
  }
}

function isMouseOverBox(box) {
  return mouseX >= box.x && mouseX <= box.x + box.w &&
         mouseY >= box.y && mouseY <= box.y + box.h;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  initializeATAMBoxes(); // Recalculate box positions
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.max(Math.floor(container.width), 600); // Minimum width for readability
  canvasWidth = containerWidth;
}