// Tactic Interaction Web
// CANVAS_HEIGHT: 560
// Bloom L4 (Analyze): students EXAMINE how applying a tactic to improve one quality
// attribute can degrade another, and trace the chain to the compensating tactic the
// tradeoff requires. QA nodes (blue ellipses), tactic nodes (gold boxes), and compensating
// tactics (orange boxes) are linked by green (improves), red dashed (degrades), and orange
// (compensation) edges. These tactic interactions are the classic ATAM tradeoff points.

function qaNode(id, label, x, y) {
  return { id, label, x, y, shape: 'ellipse', group: 'qa',
    color: { background: '#bbdefb', border: '#1565c0', highlight: { background: '#90caf9', border: '#0d47a1' } },
    font: { color: '#0d2c54', size: 16, face: 'Arial', bold: { color: '#0d2c54' } } };
}
function tacNode(id, label, x, y) {
  return { id, label, x, y, shape: 'box', group: 'tac',
    color: { background: '#ffe082', border: '#ff8f00', highlight: { background: '#ffd54f', border: '#e65100' } },
    font: { color: '#5f4b00', size: 13, face: 'Arial' } };
}
function compNode(id, label, x, y) {
  return { id, label, x, y, shape: 'box', group: 'comp',
    color: { background: '#ffcc80', border: '#ef6c00', highlight: { background: '#ffb74d', border: '#bf360c' } },
    font: { color: '#5f3000', size: 12, face: 'Arial' } };
}

const qaNodes = [
  qaNode('perf', 'Performance', 0, -260),
  qaNode('cons', 'Consistency', -320, -60),
  qaNode('sec', 'Security', 320, -60),
  qaNode('avail', 'Availability', -190, 230),
  qaNode('mod', 'Modifiability', 190, 230)
];
const tacNodes = [
  tacNode('caching', 'Caching', -150, -440),
  tacNode('pooling', 'Connection Pooling', 170, -440),
  tacNode('redundancy', 'Redundancy', -500, 150),
  tacNode('retry', 'Retry', -380, 380),
  tacNode('breaker', 'Circuit Breaker', -120, 470),
  tacNode('ratelimit', 'Rate Limiting', 500, 150),
  tacNode('encryption', 'Encryption', 540, -280),
  tacNode('infohide', 'Information Hiding', 380, 380),
  tacNode('di', 'Dependency Injection', 120, 470)
];
const compNodes = [
  compNode('cacheinval', 'Cache Invalidation\nStrategy', -470, -440),
  compNode('asyncrepl', 'Asynchronous\nReplication', -740, 110),
  compNode('hsm', 'HSM Offload', 760, -360)
];

// edges with mechanism + example for click-to-explore
function E(from, to, type, mech, ex) { return { from, to, type, mech, ex }; }
const edgeData = [
  // improves (green)
  E('caching', 'perf', 'improves', 'Serves hot data from memory, cutting read latency.', 'a product page that drops from 200ms to 15ms on a cache hit.'),
  E('pooling', 'perf', 'improves', 'Reuses established connections instead of paying setup cost per request.', 'a DB pool that removes the 30ms TCP+TLS handshake per query.'),
  E('redundancy', 'avail', 'improves', 'A standby replica takes over when the primary fails.', 'a multi-AZ database that fails over with no committed data lost.'),
  E('retry', 'avail', 'improves', 'Re-attempts transient failures so a blip does not become an outage.', 'a request that succeeds on its second try after a brief network hiccup.'),
  E('breaker', 'avail', 'improves', 'Stops calling a failing dependency, shedding load so it can recover.', 'an open breaker that returns fast fallbacks instead of piling up timeouts.'),
  E('ratelimit', 'avail', 'improves', 'Caps inbound load so a traffic spike cannot exhaust the service.', 'a 1000 req/s limit that protects the API during a flash sale.'),
  E('encryption', 'sec', 'improves', 'Protects data confidentiality in transit and at rest.', 'TLS + AES-256 so intercepted traffic and stolen disks reveal nothing.'),
  E('infohide', 'mod', 'improves', 'Hides volatile decisions behind a stable interface.', 'a storage interface that lets you swap S3 for GCS without touching callers.'),
  E('infohide', 'sec', 'improves', 'Narrows what callers can see and reach.', 'a module that exposes only a read API, hiding write internals.'),
  E('di', 'mod', 'improves', 'Decouples a component from its collaborators, easing change and substitution.', 'injecting a fake gateway in tests without changing production code.'),
  // degrades (red dashed)
  E('caching', 'cons', 'degrades', 'Cached copies can go stale relative to the source of truth.', 'a price change that users still see at the old value until the TTL expires.'),
  E('redundancy', 'perf', 'degrades', 'Keeping replicas in sync adds coordination latency.', 'a synchronous write that must be acknowledged by two replicas.'),
  E('retry', 'perf', 'degrades', 'Retries add latency and can amplify load into a retry storm.', 'three retries turning a 5s slow call into a 15s wait.'),
  E('encryption', 'perf', 'degrades', 'Cryptographic work adds CPU cost and latency.', 'TLS handshakes and per-message encryption adding measurable overhead.'),
  E('ratelimit', 'perf', 'degrades', 'Throttling queues or rejects bursts, hurting tail latency for legit users.', 'a burst of valid requests delayed behind the rate limit.'),
  E('pooling', 'avail', 'degrades', 'A fixed pool can be exhausted, blocking new work.', 'all pool connections held by slow queries, so new requests wait or fail.'),
  E('breaker', 'mod', 'degrades', 'Adds failure-handling states and config that complicate the code.', 'extra Closed/Open/Half-Open logic and thresholds to reason about.'),
  // compensation (orange, tactic -> compensating tactic)
  E('caching', 'cacheinval', 'compensation', 'The consistency hit from caching is compensated by an invalidation strategy.', 'TTLs plus event-based eviction that evict on write.'),
  E('redundancy', 'asyncrepl', 'compensation', 'The performance hit from synchronous replication is compensated by async replication.', 'replicating in the background, trading some consistency for latency.'),
  E('encryption', 'hsm', 'compensation', 'The performance hit from encryption is compensated by offloading crypto to hardware.', 'an HSM / crypto accelerator that handles key ops off the hot path.')
];

const QA_LABEL = { perf: 'Performance', cons: 'Consistency', sec: 'Security', avail: 'Availability', mod: 'Modifiability' };
const NODE_LABEL = {};
[...qaNodes, ...tacNodes, ...compNodes].forEach(n => { NODE_LABEL[n.id] = n.label.replace('\n', ' '); });
const compChain = {
  caching: { qa: 'cons', comp: 'cacheinval' },
  redundancy: { qa: 'perf', comp: 'asyncrepl' },
  encryption: { qa: 'perf', comp: 'hsm' }
};

let network, edges, chainMode = false;

function isInIframe() { try { return window.self !== window.top; } catch (e) { return true; } }
function setInfo(t, b) { document.getElementById('infobox-title').textContent = t; document.getElementById('infobox-body').textContent = b; }

function buildEdges() {
  return edgeData.map((e, i) => {
    const base = { id: 'e' + i, from: e.from, to: e.to, arrows: { to: { enabled: true, scaleFactor: 0.8 } }, width: 2 };
    if (e.type === 'improves') base.color = { color: '#2e7d32', highlight: '#1b5e20' };
    else if (e.type === 'degrades') { base.color = { color: '#c62828', highlight: '#b71c1c' }; base.dashes = [6, 5]; }
    else { base.color = { color: '#ef6c00', highlight: '#bf360c' }; base.width = 3; }
    base.smooth = { type: 'curvedCW', roundness: 0.18 };
    return base;
  });
}

function tacticInfo(id) {
  const imp = edgeData.filter(e => e.from === id && e.type === 'improves').map(e => QA_LABEL[e.to]);
  const deg = edgeData.filter(e => e.from === id && e.type === 'degrades').map(e => QA_LABEL[e.to]);
  let body = '';
  if (imp.length) body += 'Improves: ' + imp.join(', ') + '. ';
  if (deg.length) body += 'Degrades: ' + deg.join(', ') + '. ';
  if (compChain[id]) body += 'Its ' + QA_LABEL[compChain[id].qa] + ' tradeoff can be compensated by ' + NODE_LABEL[compChain[id].comp] + '.';
  if (!imp.length && !deg.length) body = 'A compensating tactic.';
  return body;
}
function qaInfo(id) {
  const imp = edgeData.filter(e => e.to === id && e.type === 'improves').map(e => NODE_LABEL[e.from]);
  const deg = edgeData.filter(e => e.to === id && e.type === 'degrades').map(e => NODE_LABEL[e.from]);
  let body = '';
  body += imp.length ? 'Improved by: ' + imp.join(', ') + '. ' : '';
  body += deg.length ? 'Degraded by: ' + deg.join(', ') + '.' : '';
  return body || 'No tactics affect this attribute in the model.';
}

function onClick(params) {
  if (params.nodes.length > 0) {
    const id = params.nodes[0];
    if (chainMode && compChain[id]) {
      const ch = compChain[id];
      setInfo('Interaction chain: ' + NODE_LABEL[id],
        NODE_LABEL[id] + ' improves a quality attribute but degrades ' + QA_LABEL[ch.qa] +
        ' — so it may require ' + NODE_LABEL[ch.comp] + ' to compensate. This is exactly the kind of ' +
        'tradeoff point an ATAM evaluation surfaces.');
      network.selectNodes([id, ch.qa, ch.comp]);
      return;
    }
    if (QA_LABEL[id]) setInfo(QA_LABEL[id] + ' (quality attribute)', qaInfo(id));
    else setInfo(NODE_LABEL[id] + ' (tactic)', tacticInfo(id));
  } else if (params.edges.length > 0) {
    const idx = parseInt(params.edges[0].slice(1), 10);
    const e = edgeData[idx];
    if (!e) return;
    const word = e.type === 'improves' ? 'improves' : (e.type === 'degrades' ? 'degrades' : 'compensates');
    setInfo(NODE_LABEL[e.from] + ' → ' + (QA_LABEL[e.to] || NODE_LABEL[e.to]) + '  (' + word + ')',
      e.mech + '  For example, ' + e.ex);
  }
}

function initializeNetwork() {
  const enableMouse = !isInIframe();
  edges = new vis.DataSet(buildEdges());
  const options = {
    layout: { improvedLayout: false },
    physics: { enabled: false },
    interaction: { selectConnectedEdges: true, zoomView: enableMouse, dragView: enableMouse, dragNodes: false, navigationButtons: true, keyboard: { enabled: false } },
    nodes: { margin: 10, borderWidth: 2, shadow: { enabled: true, color: 'rgba(0,0,0,0.2)', size: 5, x: 2, y: 2 } },
    edges: { width: 2 }
  };
  network = new vis.Network(document.getElementById('network'),
    { nodes: new vis.DataSet([...qaNodes, ...tacNodes, ...compNodes]), edges: edges }, options);
  network.on('click', onClick);
  network.once('afterDrawing', function () { network.fit({ animation: false }); });
}

document.addEventListener('DOMContentLoaded', function () {
  initializeNetwork();
  document.getElementById('chainBtn').addEventListener('click', function () {
    chainMode = !chainMode;
    this.classList.toggle('active', chainMode);
    this.textContent = chainMode ? 'Chain Mode: ON' : 'Show Interaction Chains';
    network.unselectAll();
    setInfo(chainMode ? 'Interaction-chain mode' : 'Click a tactic, a quality attribute, or an edge',
      chainMode ? 'Click Caching, Redundancy, or Encryption to trace its tradeoff to the compensating tactic it requires.'
                : 'Click a tactic to see what it improves (green) and degrades (red). Click an edge for the mechanism and an example.');
  });
});
