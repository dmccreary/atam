// Architecture Building Blocks Explorer
// CANVAS_HEIGHT: 560
// Bloom L2 (Understand): students explain the roles of components, connectors,
// and styles by clicking each in a sample e-commerce system and seeing the
// quality-attribute consequences of each connector and style choice.

// ---- connector (edge) styling by kind ----
const connectorStyle = {
  rest:  { color: '#ef6c00', dashes: false,    label: 'REST' },
  grpc:  { color: '#6a1b9a', dashes: false,    label: 'gRPC' },
  async: { color: '#2e7d32', dashes: [2, 6],   label: 'Async Event' },
  db:    { color: '#c62828', dashes: [8, 5],   label: 'DB Access' }
};

function compNode(id, label, x, y) {
  return {
    id: id, label: label, x: x, y: y,
    shape: 'box',
    color: { background: '#90caf9', border: '#1565c0' },
    font: { color: '#0d2c54', size: 16 }
  };
}

function connector(id, from, to, kind) {
  const s = connectorStyle[kind];
  return {
    id: id, from: from, to: to, kind: kind,
    label: s.label,
    color: { color: s.color, highlight: s.color },
    dashes: s.dashes,
    width: 2,
    font: { size: 12, color: s.color, strokeWidth: 4, strokeColor: '#ffffff' }
  };
}

// ---- the three architectural-style views ----
const views = {
  microservices: {
    summary: 'Microservices View — each business capability is an independently ' +
      'deployable service. Favors modifiability and independent scaling, but every ' +
      'synchronous call couples the availability of the caller to the callee.',
    nodes: [
      compNode('frontend', 'Web Frontend', -320, -190),
      compNode('gateway', 'API Gateway', -320, -40),
      compNode('order', 'Order Service', -90, -40),
      compNode('payment', 'Payment Service', 150, -160),
      compNode('inventory', 'Inventory Service', 150, 40),
      compNode('orderdb', 'Order Database', -90, 150),
      compNode('eventbus', 'Event Bus', 150, 175),
      compNode('notification', 'Notification Service', 360, 175)
    ],
    edges: [
      connector('e1', 'frontend', 'gateway', 'rest'),
      connector('e2', 'gateway', 'order', 'rest'),
      connector('e3', 'gateway', 'inventory', 'rest'),
      connector('e4', 'order', 'payment', 'rest'),
      connector('e5', 'order', 'inventory', 'grpc'),
      connector('e6', 'order', 'orderdb', 'db'),
      connector('e7', 'order', 'eventbus', 'async'),
      connector('e8', 'eventbus', 'notification', 'async'),
      connector('e9', 'eventbus', 'inventory', 'async')
    ]
  },
  monolith: {
    summary: 'Monolith View — the same capabilities collapse into one deployable ' +
      'application. Simplifies deployment and removes network latency between ' +
      'modules, but the whole application scales and fails as a single unit, and ' +
      'a change to any module requires redeploying everything.',
    nodes: [
      compNode('frontend', 'Web Frontend', -300, -150),
      compNode('gateway', 'API Gateway', -300, 0),
      compNode('monolith', 'E-Commerce Monolith\n(Order + Inventory +\nPayment + Notify)', -40, 0),
      compNode('orderdb', 'Application Database', -40, 170)
    ],
    edges: [
      connector('m1', 'frontend', 'gateway', 'rest'),
      connector('m2', 'gateway', 'monolith', 'rest'),
      connector('m3', 'monolith', 'orderdb', 'db')
    ]
  },
  'event-driven': {
    summary: 'Event-Driven View — synchronous service-to-service calls are replaced ' +
      'with asynchronous events through the Event Bus. Greatly improves availability ' +
      'and decoupling (a slow Payment Service no longer blocks Order), at the cost of ' +
      'eventual consistency and harder end-to-end tracing.',
    nodes: [
      compNode('frontend', 'Web Frontend', -340, -170),
      compNode('gateway', 'API Gateway', -340, -20),
      compNode('eventbus', 'Event Bus', -90, 20),
      compNode('order', 'Order Service', 150, -160),
      compNode('payment', 'Payment Service', 150, -40),
      compNode('inventory', 'Inventory Service', 150, 90),
      compNode('notification', 'Notification Service', 150, 200),
      compNode('orderdb', 'Order Database', 360, -160)
    ],
    edges: [
      connector('v1', 'frontend', 'gateway', 'rest'),
      connector('v2', 'gateway', 'eventbus', 'async'),
      connector('v3', 'eventbus', 'order', 'async'),
      connector('v4', 'eventbus', 'payment', 'async'),
      connector('v5', 'eventbus', 'inventory', 'async'),
      connector('v6', 'eventbus', 'notification', 'async'),
      connector('v7', 'order', 'orderdb', 'db')
    ]
  }
};

// ---- click info for components ----
const nodeInfo = {
  frontend: ['Web Frontend (Component: UI client)',
    'A browser/mobile client. Responsibilities: render UI, collect input, call the API. ' +
    'Primary quality attributes: usability and perceived performance.'],
  gateway: ['API Gateway (Component: gateway)',
    'Single entry point that routes, authenticates, and rate-limits requests. ' +
    'Primary quality attributes: security and availability — it is a chokepoint, so it must be highly available.'],
  order: ['Order Service (Component: service)',
    'Owns order creation and orchestration. Responsibilities: validate, persist, and ' +
    'coordinate payment and fulfillment. Primary quality attributes: modifiability and consistency.'],
  payment: ['Payment Service (Component: service)',
    'Processes payments via external providers. Primary quality attributes: security and ' +
    'reliability — money movement must be correct and auditable.'],
  inventory: ['Inventory Service (Component: service)',
    'Tracks stock levels and reservations. Primary quality attributes: consistency and scalability.'],
  notification: ['Notification Service (Component: service)',
    'Sends email/SMS/push. Naturally asynchronous. Primary quality attribute: availability ' +
    '(a notification outage should never block an order).'],
  orderdb: ['Order Database (Component: data store)',
    'Persistent store of record for orders. Primary quality attributes: reliability and ' +
    'consistency. Direct access by multiple services would couple their schemas.'],
  eventbus: ['Event Bus (Component: connector infrastructure)',
    'Message broker that decouples publishers from subscribers. Primary quality attributes: ' +
    'availability and scalability — it absorbs load spikes and isolates failures.'],
  monolith: ['E-Commerce Monolith (Component: application)',
    'All business capabilities in one deployable. Primary quality attributes: simplicity and ' +
    'low internal latency, traded against independent deployability and fault isolation.']
};

// ---- click info for connectors ----
const edgeInfo = {
  rest: ['REST connector (synchronous, HTTP/JSON)',
    'Typical latency: tens of milliseconds per hop. ',
    'Synchronous: the caller waits for the callee. An outage in the callee propagates directly ' +
    'back to the caller. An async event connector would decouple their availability.'],
  grpc: ['gRPC connector (synchronous, binary HTTP/2)',
    'Typical latency: low single-digit milliseconds; higher throughput than REST. ',
    'Still synchronous, so it shares REST’s availability coupling, but its binary contract ' +
    'is more rigid — schema changes need coordinated client/server updates.'],
  async: ['Async Event connector (publish/subscribe)',
    'Latency: variable; delivery is eventual, not immediate. ',
    'Decouples sender and receiver availability and smooths load spikes, but introduces ' +
    'eventual consistency and makes end-to-end tracing harder.'],
  db: ['Direct Database Access connector',
    'Latency: low, but it couples the service to the database schema. ',
    'Sharing a database directly between services is an anti-pattern: it couples their ' +
    'deployment and data models, undermining modifiability.']
};

let network;
let currentNodes, currentEdges;

function isInIframe() {
  try { return window.self !== window.top; } catch (e) { return true; }
}

function buildView(key) {
  const v = views[key];
  currentNodes = new vis.DataSet(v.nodes);
  currentEdges = new vis.DataSet(v.edges);
  network.setData({ nodes: currentNodes, edges: currentEdges });
  network.once('afterDrawing', function () {
    network.fit({ animation: false });
  });
  setInfo('Architectural Style: ' + key, v.summary);
}

function setInfo(title, body) {
  document.getElementById('infobox-title').textContent = title;
  document.getElementById('infobox-body').innerHTML = body;
}

function handleClick(params) {
  if (params.nodes.length > 0) {
    const info = nodeInfo[params.nodes[0]];
    if (info) setInfo(info[0], info[1]);
    return;
  }
  if (params.edges.length > 0) {
    const edge = currentEdges.get(params.edges[0]);
    if (edge && edgeInfo[edge.kind]) {
      const info = edgeInfo[edge.kind];
      setInfo(info[0], info[1] + '<span class="tradeoff">Tradeoff: </span>' + info[2]);
    }
  }
}

function initializeNetwork() {
  const enableMouse = !isInIframe();
  const options = {
    layout: { improvedLayout: false },
    physics: { enabled: false },
    interaction: {
      selectConnectedEdges: false,
      hover: true,
      zoomView: enableMouse,
      dragView: enableMouse,
      dragNodes: false,
      navigationButtons: true,
      keyboard: { enabled: false }
    },
    nodes: {
      shape: 'box',
      margin: 10,
      widthConstraint: { maximum: 150 },
      font: { size: 16, face: 'Arial' },
      borderWidth: 2,
      shadow: { enabled: true, color: 'rgba(0,0,0,0.2)', size: 5, x: 2, y: 2 }
    },
    edges: {
      arrows: { to: { enabled: true, scaleFactor: 0.9 } },
      width: 2,
      smooth: { type: 'curvedCW', roundness: 0.15 }
    }
  };

  const container = document.getElementById('network');
  network = new vis.Network(container, { nodes: new vis.DataSet([]), edges: new vis.DataSet([]) }, options);
  network.on('click', handleClick);

  buildView('microservices');
}

document.addEventListener('DOMContentLoaded', function () {
  initializeNetwork();
  document.getElementById('style-select').addEventListener('change', function (e) {
    buildView(e.target.value);
  });
});
