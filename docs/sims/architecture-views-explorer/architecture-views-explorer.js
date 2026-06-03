// Architecture Views Explorer
// CANVAS_HEIGHT: 600
// Bloom L2 (Understand): students explain why multiple views are necessary by
// switching between three views of the SAME e-commerce system and seeing which
// stakeholder concerns each view addresses — and which it deliberately omits.

function box(id, label, x, y, bg, border, fontColor) {
  return {
    id: id, label: label, x: x, y: y,
    shape: 'box',
    color: { background: bg, border: border },
    font: { color: fontColor || '#0d2c54', size: 15 }
  };
}

function edge(from, to, label, color) {
  return {
    from: from, to: to, label: label,
    color: { color: color, highlight: color },
    font: { size: 12, color: color, strokeWidth: 4, strokeColor: '#ffffff' },
    width: 2
  };
}

// each view: nodes, edges, a single node-click message, and a viewpoint "recipe"
const views = {
  cc: {
    title: 'Component & Connector View',
    nodeMessage: ['This is a runtime component.',
      'Stakeholders: Development Team, Operations. Primary concerns: interfaces, ' +
      'responsibilities, and runtime dependencies between services.'],
    footer: 'Viewpoint used: <b>Component &amp; Connector</b> &nbsp;|&nbsp; ' +
      'Stakeholders: <b>Development Team, Operations</b><br/>' +
      'What it shows: <b>runtime components and the protocols that connect them</b> &nbsp;|&nbsp; ' +
      'Deliberately omits: <b>physical deployment, hardware, and trust boundaries</b>',
    nodes: [
      box('frontend', 'Web Frontend', -330, -170, '#90caf9', '#1565c0'),
      box('gateway', 'API Gateway', -330, -20, '#90caf9', '#1565c0'),
      box('order', 'Order Service', -90, -20, '#90caf9', '#1565c0'),
      box('inventory', 'Inventory Service', 150, -110, '#90caf9', '#1565c0'),
      box('payment', 'Payment Service', 150, 30, '#90caf9', '#1565c0'),
      box('orderdb', 'Order Database', -90, 130, '#a5d6a7', '#2e7d32'),
      box('eventbus', 'Event Bus', 150, 150, '#ffe082', '#ff8f00')
    ],
    edges: [
      edge('frontend', 'gateway', 'REST', '#ef6c00'),
      edge('gateway', 'order', 'REST', '#ef6c00'),
      edge('gateway', 'inventory', 'REST', '#ef6c00'),
      edge('order', 'payment', 'REST', '#ef6c00'),
      edge('order', 'orderdb', 'SQL', '#c62828'),
      edge('order', 'eventbus', 'publish', '#2e7d32'),
      edge('eventbus', 'inventory', 'subscribe', '#2e7d32')
    ]
  },
  deployment: {
    title: 'Deployment View',
    nodeMessage: ['This is a deployment unit.',
      'Stakeholders: Operations, Security Team. Primary concerns: network topology, ' +
      'availability zones, scaling policies, and where each component physically runs.'],
    footer: 'Viewpoint used: <b>Deployment</b> &nbsp;|&nbsp; ' +
      'Stakeholders: <b>Operations, Security Team</b><br/>' +
      'What it shows: <b>how software maps onto infrastructure, scaling units, and network paths</b> &nbsp;|&nbsp; ' +
      'Deliberately omits: <b>internal component logic and data classification</b>',
    nodes: [
      box('cdn', 'CDN / Edge', -330, -150, '#b3e5fc', '#0277bd'),
      box('k8s', 'Kubernetes Cluster\n(us-east-1)', -110, -150, '#80cbc4', '#00695c'),
      box('podOrder', 'order-svc Pods\n(replicas ×3)', 140, -180, '#80cbc4', '#00695c'),
      box('podInv', 'inventory-svc Pods\n(replicas ×2)', 140, -50, '#80cbc4', '#00695c'),
      box('rds', 'Managed PostgreSQL\n(Multi-AZ RDS)', 140, 100, '#a5d6a7', '#2e7d32'),
      box('mq', 'Managed Event Bus\n(SNS / SQS)', -110, 100, '#ffe082', '#ff8f00')
    ],
    edges: [
      edge('cdn', 'k8s', 'HTTPS', '#0277bd'),
      edge('k8s', 'podOrder', 'pod net', '#00695c'),
      edge('k8s', 'podInv', 'pod net', '#00695c'),
      edge('podOrder', 'rds', 'TCP 5432', '#2e7d32'),
      edge('podOrder', 'mq', 'publish', '#ff8f00'),
      edge('mq', 'podInv', 'deliver', '#ff8f00')
    ]
  },
  security: {
    title: 'Security View',
    nodeMessage: ['This is a trust boundary / security zone.',
      'Stakeholders: Security Team, Compliance. Primary concerns: authentication points, ' +
      'data in transit, data classification, and the system’s attack surface.'],
    footer: 'Viewpoint used: <b>Security</b> &nbsp;|&nbsp; ' +
      'Stakeholders: <b>Security Team, Compliance</b><br/>' +
      'What it shows: <b>trust boundaries, authentication flows, and data-classification zones</b> &nbsp;|&nbsp; ' +
      'Deliberately omits: <b>performance characteristics and deployment scaling</b>',
    nodes: [
      box('internet', 'Public Internet\n(Untrusted)', -330, -150, '#ffcdd2', '#c62828', '#7f1d1d'),
      box('waf', 'WAF + API Gateway\n(Authentication)', -100, -150, '#ffe0b2', '#ef6c00', '#7a3b00'),
      box('dmz', 'DMZ\nTrust Boundary', -100, -10, '#fff9c4', '#f9a825', '#5f4b00'),
      box('order', 'Order Service\n(App Trust Zone)', 150, -10, '#bbdefb', '#1565c0'),
      box('dataZone', 'Restricted Data Zone\n(PII)', 150, 130, '#e1bee7', '#6a1b9a', '#3b0a52'),
      box('orderdb', 'Order DB\n(Encrypted at rest)', -100, 130, '#e1bee7', '#6a1b9a', '#3b0a52')
    ],
    edges: [
      edge('internet', 'waf', 'TLS 1.3', '#c62828'),
      edge('waf', 'dmz', 'OAuth2 / JWT', '#ef6c00'),
      edge('dmz', 'order', 'mTLS', '#1565c0'),
      edge('order', 'dataZone', 'authz check', '#6a1b9a'),
      edge('dataZone', 'orderdb', 'encrypted', '#6a1b9a')
    ]
  }
};

let network;

function isInIframe() {
  try { return window.self !== window.top; } catch (e) { return true; }
}

function setInfo(title, body) {
  document.getElementById('infobox-title').textContent = title;
  document.getElementById('infobox-body').textContent = body;
}

let activeMessage = views.cc.nodeMessage;

function showView(key) {
  const v = views[key];
  activeMessage = v.nodeMessage;
  network.setData({ nodes: new vis.DataSet(v.nodes), edges: new vis.DataSet(v.edges) });
  network.once('afterDrawing', function () { network.fit({ animation: false }); });

  document.getElementById('title').textContent = v.title;
  document.getElementById('footer').innerHTML = v.footer;
  setInfo('Click any node', 'Click a node in the ' + v.title + ' to see which stakeholders care about it and why.');

  document.querySelectorAll('.tab').forEach(function (t) {
    t.classList.toggle('active', t.dataset.view === key);
  });
}

function initializeNetwork() {
  const enableMouse = !isInIframe();
  const options = {
    layout: { improvedLayout: false },
    physics: { enabled: false },
    interaction: {
      selectConnectedEdges: false,
      zoomView: enableMouse,
      dragView: enableMouse,
      dragNodes: false,
      navigationButtons: true,
      keyboard: { enabled: false }
    },
    nodes: {
      shape: 'box', margin: 10,
      font: { size: 15, face: 'Arial', multi: false },
      borderWidth: 2,
      shadow: { enabled: true, color: 'rgba(0,0,0,0.2)', size: 5, x: 2, y: 2 }
    },
    edges: {
      arrows: { to: { enabled: true, scaleFactor: 0.9 } },
      width: 2,
      smooth: { type: 'curvedCW', roundness: 0.15 }
    }
  };

  network = new vis.Network(
    document.getElementById('network'),
    { nodes: new vis.DataSet([]), edges: new vis.DataSet([]) },
    options
  );

  network.on('click', function (params) {
    if (params.nodes.length > 0) {
      setInfo(activeMessage[0], activeMessage[1]);
    }
  });

  showView('cc');
}

document.addEventListener('DOMContentLoaded', function () {
  initializeNetwork();
  document.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () { showView(t.dataset.view); });
  });
});
