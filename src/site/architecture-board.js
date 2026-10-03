import '../styles/architecture-board.css';

const SVG_NS = 'http://www.w3.org/2000/svg';
export const NODE_TYPES = ['input', 'service', 'queue', 'database', 'external', 'security', 'output'];
export const EDGE_KINDS = ['sync', 'async', 'secure', 'external'];
let boardSequence = 0;

const COPY = {
  pt: {
    board: 'Diagrama de arquitetura. Use as setas para percorrer os componentes, Enter ou espaço para selecionar e Esc para limpar a seleção.',
    caption: (nodes, edges, layers) => `${nodes} ${nodes === 1 ? 'componente' : 'componentes'} · ${edges} ${edges === 1 ? 'conexão' : 'conexões'} · ${layers} ${layers === 1 ? 'camada' : 'camadas'}`,
    hintClick: 'Clique em um componente para ver detalhes',
    hintKeys: 'para navegar',
    scrollHint: 'arraste para ver o fluxo',
    components: 'Componentes',
    inspector: 'Componente selecionado',
    emptyTitle: 'Explore o sistema',
    emptyText: 'Selecione um componente no quadro para ver o que ele faz, de onde recebe dados e para onde envia.',
    emptyList: 'Ou comece por aqui',
    type: 'Tipo', layer: 'Camada', technology: 'Tecnologia',
    detail: 'Em detalhe',
    incoming: 'Recebe de', outgoing: 'Envia para',
    isolated: 'Sem conexões neste fluxo.',
    legend: 'Legenda',
    textSummary: 'Descrição textual do fluxo',
    kinds: { sync: 'Síncrono', async: 'Assíncrono', secure: 'Canal seguro', external: 'Integração externa' },
    types: { input: 'Entrada', service: 'Serviço', queue: 'Fila', database: 'Banco de dados', external: 'Sistema externo', security: 'Segurança', output: 'Saída' },
    typesShort: { input: 'Entrada', service: 'Serviço', queue: 'Fila', database: 'Banco', external: 'Externo', security: 'Segurança', output: 'Saída' },
    nodeName: ({ title, type, technology, layer }) => `${title}. ${type}${technology ? `, ${technology}` : ''}. Camada ${layer}.`,
    edgeSentence: ({ from, to, label, kind }) => `De ${from} para ${to}${label ? ` — ${label}` : ''} (${kind.toLowerCase()}).`,
  },
  en: {
    board: 'Architecture diagram. Use the arrow keys to move between components, Enter or Space to select, and Esc to clear the selection.',
    caption: (nodes, edges, layers) => `${nodes} ${nodes === 1 ? 'component' : 'components'} · ${edges} ${edges === 1 ? 'connection' : 'connections'} · ${layers} ${layers === 1 ? 'layer' : 'layers'}`,
    hintClick: 'Click a component to see details',
    hintKeys: 'to navigate',
    scrollHint: 'drag to see the flow',
    components: 'Components',
    inspector: 'Selected component',
    emptyTitle: 'Explore the system',
    emptyText: 'Select a component on the board to see what it does, where its data comes from and where it goes next.',
    emptyList: 'Or start here',
    type: 'Type', layer: 'Layer', technology: 'Technology',
    detail: 'In detail',
    incoming: 'Receives from', outgoing: 'Sends to',
    isolated: 'No connections in this flow.',
    legend: 'Legend',
    textSummary: 'Text description of the flow',
    kinds: { sync: 'Synchronous', async: 'Asynchronous', secure: 'Secure channel', external: 'External integration' },
    types: { input: 'Input', service: 'Service', queue: 'Queue', database: 'Database', external: 'External system', security: 'Security', output: 'Output' },
    typesShort: { input: 'Input', service: 'Service', queue: 'Queue', database: 'Database', external: 'External', security: 'Security', output: 'Output' },
    nodeName: ({ title, type, technology, layer }) => `${title}. ${type}${technology ? `, ${technology}` : ''}. Layer: ${layer}.`,
    edgeSentence: ({ from, to, label, kind }) => `From ${from} to ${to}${label ? ` — ${label}` : ''} (${kind.toLowerCase()}).`,
  },
};

/* Geometry, in SVG user units. Mono text is estimated at 0.6em per character. */
const BOARD = {
  pad: 24, colW: 160, gap: 128, headerY: 26, ruleY: 40, top: 72,
  nodeH: 100, rowGap: 48, bottom: 40, minWidth: 640,
  labelChar: 7.2, labelLine: 14, titleChars: 17, techChars: 18, headerChars: 16,
  stub: 14, corner: 8, packetW: 10, packetH: 12,
};

/* Packet rhythm in seconds. Async edges travel in short bursts (queued work); the others at a steady pace. */
const RHYTHM = {
  sync: { period: 2.8, travel: 1.7, burst: 1, spacing: 0 },
  external: { period: 3.2, travel: 2.1, burst: 1, spacing: 0 },
  secure: { period: 2.8, travel: 1.9, burst: 1, spacing: 0 },
  async: { period: 3.6, travel: 1.5, burst: 2, spacing: 0.34 },
};
const MAX_PACKETS = 24;
const EMPHASIS_SPEED = 1.45;

const GLYPHS = {
  input: 'M1 8h9M7 5l3 3-3 3M12 2h3v12h-3',
  output: 'M4 2H1v12h3M6 8h9M12 5l3 3-3 3',
  service: 'M2 2h12v12H2zM5.5 5.5h5v5h-5z',
  queue: 'M1 4h10M1 8h10M1 12h10M14 2v12',
  database: 'M2 4c0-2.4 12-2.4 12 0s-12 2.4-12 0zM2 4v8c0 2.4 12 2.4 12 0V4M2 8c0 2.4 12 2.4 12 0',
  external: 'M9 2h5v5M14 2 7.5 8.5M12 10v4H2V4h4',
  security: 'M3.5 7h9v7h-9zM5.5 7V5a2.5 2.5 0 0 1 5 0v2M8 10v1.5',
};
const LOCK_GLYPH = 'M0.5 4h7v5.5h-7zM2 4V2.6a2 2 0 0 1 4 0V4';
const DOC_GLYPH = 'M0 0H7L10 3V12H0Z';
const DOC_FOLD = 'M7 0V3H10';

function localized(value, lang) {
  if (typeof value === 'string') return value.trim();
  if (value && typeof value === 'object') {
    const selected = value[lang] || value.pt || value.en;
    return typeof selected === 'string' ? selected.trim() : '';
  }
  return '';
}

function asId(value) {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (value && typeof value === 'object') return String(value.id ?? value.key ?? '');
  return '';
}

function layerKey(value, lang) {
  return asId(value) || layerName(value, lang);
}

function layerName(layer, lang) {
  if (typeof layer === 'string') return layer.trim();
  return localized(layer?.title, lang) || localized(layer?.name, lang) || localized(layer?.label, lang) || asId(layer);
}

function svgElement(tag, attrs = {}, text = '') {
  const element = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value !== undefined && value !== null) element.setAttribute(key, String(value));
  });
  if (text) element.textContent = text;
  return element;
}

function htmlElement(tag, className, text = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

export function shorten(text, max = 25) {
  const chars = Array.from(text);
  if (chars.length <= max) return text;
  return `${chars.slice(0, Math.max(1, max - 1)).join('').trimEnd()}…`;
}

/** Word-wrap into at most `maxLines` lines of `limit` characters; overflow ends with an ellipsis. */
export function wrapText(value, limit, maxLines = 2) {
  const words = String(value || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  let truncated = false;
  for (let index = 0; index < words.length; index += 1) {
    const next = current ? `${current} ${words[index]}` : words[index];
    if (!current || Array.from(next).length <= limit) {
      current = next;
      continue;
    }
    if (lines.length === maxLines - 1) {
      truncated = true;
      break;
    }
    lines.push(current);
    current = words[index];
  }
  if (current) lines.push(current);
  return lines.map((line, index) => {
    if (Array.from(line).length > limit) return shorten(line, limit);
    if (truncated && index === lines.length - 1) return Array.from(line).length < limit ? `${line}…` : shorten(line, limit);
    return line;
  });
}

function lineKind(edge, source, target) {
  const kind = String(edge?.flow || edge?.kind || edge?.type || '').toLowerCase();
  if (edge?.secure === true || edge?.isSecure === true || kind.includes('secure') || kind.includes('safe')) return 'secure';
  if (kind.includes('async') || kind.includes('assinc') || kind.includes('event') || kind.includes('queue')) return 'async';
  if (kind.includes('external') || source?.type === 'external' || target?.type === 'external') return 'external';
  return 'sync';
}

function textForEdge(edge, lang) {
  return localized(edge?.label, lang) || localized(edge?.protocol, lang);
}

/** Short payload tag for a moving packet: explicit `payload` field, else a short first word of the label. */
function payloadForEdge(edge, label, lang) {
  const explicit = localized(edge?.payload, lang);
  if (explicit) return Array.from(explicit).slice(0, 6).join('');
  const first = String(label || '').split(/[\s/]+/).filter(Boolean)[0] || '';
  return Array.from(first).length <= 6 ? first : '';
}

function normalizedGraph(architecture, lang) {
  const nodes = architecture.nodes.filter(node => node && typeof node === 'object' && asId(node.id));
  const nodeById = new Map(nodes.map(node => [asId(node.id), node]));
  const layers = [];
  const seen = new Set();
  (Array.isArray(architecture.layers) ? architecture.layers : []).forEach((layer, index) => {
    const id = layerKey(layer, lang) || `layer-${index}`;
    if (!seen.has(id)) {
      seen.add(id);
      layers.push({ id, label: layerName(layer, lang) || id });
    }
  });
  nodes.forEach(node => {
    const id = layerKey(node.layer, lang) || 'components';
    if (!seen.has(id)) {
      seen.add(id);
      layers.push({ id, label: layerName(node.layer, lang) || (id === 'components' ? COPY[lang].components : id) });
    }
  });
  const buckets = new Map(layers.map(layer => [layer.id, []]));
  nodes.forEach(node => {
    const id = layerKey(node.layer, lang) || 'components';
    buckets.get(id).push(asId(node.id));
  });
  const edges = (Array.isArray(architecture.edges) ? architecture.edges : [])
    .filter(edge => edge && typeof edge === 'object' && nodeById.has(String(edge.from)) && nodeById.has(String(edge.to)) && String(edge.from) !== String(edge.to))
    .map(edge => ({ ...edge, from: String(edge.from), to: String(edge.to) }));
  return { nodes, nodeById, layers, buckets, edges };
}

function permutations(items) {
  if (items.length <= 1) return [items.slice()];
  const result = [];
  items.forEach((item, index) => {
    const rest = items.slice(0, index).concat(items.slice(index + 1));
    permutations(rest).forEach(tail => result.push([item, ...tail]));
  });
  return result;
}

/**
 * Order nodes inside each layer (top to bottom) so that same-layer edges join adjacent rows and
 * cross-layer edges stay as level as possible. Small layers are solved exhaustively; ties keep data order.
 */
function arrangeColumns(graph) {
  const columns = graph.layers
    .map(layer => ({ id: layer.id, label: layer.label, ids: (graph.buckets.get(layer.id) || []).slice() }))
    .filter(column => column.ids.length);
  const colOf = new Map();
  columns.forEach((column, index) => column.ids.forEach(id => colOf.set(id, index)));
  const maxRows = Math.max(1, ...columns.map(column => column.ids.length));
  const slot = (count, row) => (maxRows - count) / 2 + row;
  const yOf = new Map();
  // Sweep left→right using the previous layers, then refine both ways using every placed neighbour.
  const arrange = (column, index) => {
    const count = column.ids.length;
    const candidates = count <= 6 ? permutations(column.ids) : [column.ids];
    let best = column.ids;
    let bestCost = Infinity;
    candidates.forEach(candidate => {
      const rowOf = new Map(candidate.map((id, row) => [id, row]));
      let cost = 0;
      graph.edges.forEach(edge => {
        const a = colOf.get(edge.from);
        const b = colOf.get(edge.to);
        if (a === index && b === index) cost += 10 * Math.max(0, Math.abs(rowOf.get(edge.from) - rowOf.get(edge.to)) - 1);
        else if (a === index && yOf.has(edge.to)) cost += Math.abs(slot(count, rowOf.get(edge.from)) - yOf.get(edge.to));
        else if (b === index && yOf.has(edge.from)) cost += Math.abs(slot(count, rowOf.get(edge.to)) - yOf.get(edge.from));
      });
      if (cost < bestCost - 1e-9) {
        best = candidate;
        bestCost = cost;
      }
    });
    column.ids = best;
    best.forEach((id, row) => yOf.set(id, slot(count, row)));
  };
  columns.forEach((column, index) => arrange(column, index));
  for (let index = columns.length - 2; index >= 0; index -= 1) arrange(columns[index], index);
  columns.forEach((column, index) => arrange(column, index));
  return columns;
}

/** Topological reading order (sources first); ties and cycles fall back to data order. */
function readingOrder(graph) {
  const ids = graph.nodes.map(node => asId(node.id));
  const indegree = new Map(ids.map(id => [id, 0]));
  graph.edges.forEach(edge => indegree.set(edge.to, indegree.get(edge.to) + 1));
  const order = [];
  const done = new Set();
  while (order.length < ids.length) {
    let next = ids.find(id => !done.has(id) && indegree.get(id) === 0);
    if (!next) next = ids.find(id => !done.has(id));
    done.add(next);
    order.push(next);
    graph.edges.forEach(edge => {
      if (edge.from === next) indegree.set(edge.to, indegree.get(edge.to) - 1);
    });
  }
  return order;
}

function describeNode(node, layerLabel, lang) {
  const id = asId(node.id);
  const type = NODE_TYPES.includes(node.type) ? node.type : 'service';
  return {
    id,
    type,
    title: localized(node.title, lang) || localized(node.name, lang) || id,
    technology: localized(node.technology, lang) || (Array.isArray(node.technologies) ? node.technologies.filter(item => typeof item === 'string').join(' · ') : ''),
    description: localized(node.description, lang) || localized(node.summary, lang),
    detail: localized(node.detail, lang),
    layer: layerLabel,
  };
}

/**
 * Shared, DOM-free preparation used by the board and the flow preview.
 * Returns null when there is nothing to draw.
 */
export function prepareArchitecture(architecture, lang = 'pt') {
  const safeLang = lang === 'en' ? 'en' : 'pt';
  if (!architecture || !Array.isArray(architecture.nodes) || !architecture.nodes.length) return null;
  const graph = normalizedGraph(architecture, safeLang);
  if (!graph.nodes.length) return null;
  const columns = arrangeColumns(graph);
  const layerOfNode = new Map();
  columns.forEach(column => column.ids.forEach(id => layerOfNode.set(id, column.label)));
  const info = new Map(graph.nodes.map(node => [asId(node.id), describeNode(node, layerOfNode.get(asId(node.id)) || '', safeLang)]));
  const edges = graph.edges.map((edge, index) => {
    const label = textForEdge(edge, safeLang);
    return {
      index,
      from: edge.from,
      to: edge.to,
      kind: lineKind(edge, graph.nodeById.get(edge.from), graph.nodeById.get(edge.to)),
      label,
      payload: payloadForEdge(edge, label, safeLang),
    };
  });
  return { lang: safeLang, columns, info, edges, order: readingOrder(graph) };
}

function sideX(type, side, localY, width, height) {
  const t = 1 - Math.abs(localY - height / 2) / (height / 2);
  if (side === 'left' && type === 'input') return 10 * t;
  if (side === 'right' && type === 'output') return width - 12 + 12 * t;
  return side === 'left' ? 0 : width;
}

function overlaps(a, b, margin = 4) {
  return a.x < b.x + b.w + margin && b.x < a.x + a.w + margin && a.y < b.y + b.h + margin && b.y < a.y + a.h + margin;
}

/** Orthogonal polyline with rounded corners. */
function roundedPath(points, radius) {
  const pts = points.filter((point, index) => index === 0 || Math.abs(point.x - points[index - 1].x) > 0.01 || Math.abs(point.y - points[index - 1].y) > 0.01);
  if (pts.length < 2) return `M ${pts[0].x} ${pts[0].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let index = 1; index < pts.length - 1; index += 1) {
    const prev = pts[index - 1];
    const point = pts[index];
    const next = pts[index + 1];
    const inLen = Math.hypot(point.x - prev.x, point.y - prev.y);
    const outLen = Math.hypot(next.x - point.x, next.y - point.y);
    const r = Math.min(radius, inLen / 2, outLen / 2);
    const ax = point.x - ((point.x - prev.x) / inLen) * r;
    const ay = point.y - ((point.y - prev.y) / inLen) * r;
    const bx = point.x + ((next.x - point.x) / outLen) * r;
    const by = point.y + ((next.y - point.y) / outLen) * r;
    d += ` L ${ax} ${ay} Q ${point.x} ${point.y} ${bx} ${by}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L ${last.x} ${last.y}`;
}

/** Sample an SVG path made of M/L/H/V/Q/C commands into points with cumulative length. */
export function samplePath(d) {
  const tokens = String(d).match(/[A-Za-z]|-?[\d.]+(?:e-?\d+)?/g) || [];
  const points = [];
  let i = 0;
  let cx = 0;
  let cy = 0;
  let cmd = '';
  const num = () => parseFloat(tokens[i++]);
  const push = (x, y) => {
    const last = points[points.length - 1];
    const l = last ? last.l + Math.hypot(x - last.x, y - last.y) : 0;
    points.push({ x, y, l });
  };
  const line = (x, y) => {
    const steps = Math.max(1, Math.ceil(Math.hypot(x - cx, y - cy) / 6));
    for (let k = 1; k <= steps; k += 1) push(cx + ((x - cx) * k) / steps, cy + ((y - cy) * k) / steps);
    cx = x;
    cy = y;
  };
  while (i < tokens.length) {
    if (/[A-Za-z]/.test(tokens[i])) cmd = tokens[i++];
    if (cmd === 'M') { cx = num(); cy = num(); push(cx, cy); }
    else if (cmd === 'L') line(num(), num());
    else if (cmd === 'H') line(num(), cy);
    else if (cmd === 'V') line(cx, num());
    else if (cmd === 'Q') {
      const x1 = num(); const y1 = num(); const x = num(); const y = num();
      for (let k = 1; k <= 8; k += 1) {
        const s = k / 8; const u = 1 - s;
        push(u * u * cx + 2 * u * s * x1 + s * s * x, u * u * cy + 2 * u * s * y1 + s * s * y);
      }
      cx = x; cy = y;
    } else if (cmd === 'C') {
      const x1 = num(); const y1 = num(); const x2 = num(); const y2 = num(); const x = num(); const y = num();
      for (let k = 1; k <= 40; k += 1) {
        const s = k / 40; const u = 1 - s;
        push(u ** 3 * cx + 3 * u * u * s * x1 + 3 * u * s * s * x2 + s ** 3 * x, u ** 3 * cy + 3 * u * u * s * y1 + 3 * u * s * s * y2 + s ** 3 * y);
      }
      cx = x; cy = y;
    } else break;
  }
  return points;
}

/** Point at fraction `t` (0..1) of a sampled path. */
export function pointAt(samples, t) {
  if (!samples.length) return { x: 0, y: 0 };
  const total = samples[samples.length - 1].l;
  const target = Math.max(0, Math.min(1, t)) * total;
  let lo = 0;
  let hi = samples.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (samples[mid].l < target) lo = mid + 1;
    else hi = mid;
  }
  const b = samples[lo];
  const a = samples[Math.max(0, lo - 1)];
  const span = b.l - a.l;
  const f = span > 0 ? (target - a.l) / span : 0;
  return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
}

function packetBox(point) {
  return { x: point.x - BOARD.packetW / 2, y: point.y - BOARD.packetH / 2, w: BOARD.packetW, h: BOARD.packetH };
}

/** DOM-free board geometry: lanes, node boxes, edge paths, label boxes, parked packet positions. */
export function layoutBoard(prepared) {
  const B = BOARD;
  const { columns, info, edges } = prepared;
  const maxRows = Math.max(1, ...columns.map(column => column.ids.length));
  const pitch = B.nodeH + B.rowGap;
  const rawWidth = B.pad * 2 + columns.length * B.colW + Math.max(0, columns.length - 1) * B.gap;
  const width = Math.max(B.minWidth, rawWidth);
  const offsetX = (width - rawWidth) / 2;
  const height = B.top + maxRows * B.nodeH + (maxRows - 1) * B.rowGap + B.bottom;
  const nodes = new Map();
  const layers = columns.map((column, col) => {
    const x = offsetX + B.pad + col * (B.colW + B.gap);
    const offset = (column.ids.length < maxRows ? (maxRows - column.ids.length) * pitch / 2 : 0);
    column.ids.forEach((id, row) => {
      nodes.set(id, { id, col, row, x, y: B.top + offset + row * pitch, w: B.colW, h: B.nodeH, type: info.get(id).type });
    });
    const laneX = col === 0 ? 0 : x - B.gap / 2;
    const laneEnd = col === columns.length - 1 ? width : x + B.colW + B.gap / 2;
    return { id: column.id, label: column.label, x, index: col, laneX, laneW: laneEnd - laneX };
  });

  // Traffic per gap (gap g sits between column g and g + 1), used to send same-layer loops to the quieter side.
  const gapLoad = new Array(Math.max(0, columns.length - 1)).fill(0);
  edges.forEach(edge => {
    const ca = nodes.get(edge.from).col;
    const cb = nodes.get(edge.to).col;
    for (let g = Math.min(ca, cb); g < Math.max(ca, cb); g += 1) gapLoad[g] += 1;
  });
  const routes = edges.map(edge => {
    const a = nodes.get(edge.from);
    const b = nodes.get(edge.to);
    let mode;
    let fromSide;
    let toSide;
    if (Math.abs(a.col - b.col) >= 2) [mode, fromSide, toSide] = a.col < b.col ? ['skip', 'right', 'left'] : ['skip', 'left', 'right'];
    else if (a.col < b.col) [mode, fromSide, toSide] = ['forward', 'right', 'left'];
    else if (a.col > b.col) [mode, fromSide, toSide] = ['backward', 'left', 'right'];
    else if (Math.abs(a.row - b.row) === 1) [mode, fromSide, toSide] = b.row > a.row ? ['vertical', 'bottom', 'top'] : ['vertical', 'top', 'bottom'];
    else {
      const left = a.col > 0 ? gapLoad[a.col - 1] : Infinity;
      const right = a.col < columns.length - 1 ? gapLoad[a.col] : Infinity;
      const side = left < right ? 'left' : 'right';
      if (Number.isFinite(left) || Number.isFinite(right)) gapLoad[side === 'left' ? a.col - 1 : a.col] += 1;
      [mode, fromSide, toSide] = ['loop', side, side];
    }
    return { ...edge, mode, fromSide, toSide, a, b };
  });

  // Spread ports along each side, ordered by where the other end sits, so arrowheads never stack.
  const ports = new Map();
  const addPort = (node, side, route, end, key) => {
    const mapKey = `${node.id}:${side}`;
    if (!ports.has(mapKey)) ports.set(mapKey, []);
    ports.get(mapKey).push({ route, end, key });
  };
  routes.forEach(route => {
    const horizontal = side => side === 'left' || side === 'right';
    addPort(route.a, route.fromSide, route, 'from', horizontal(route.fromSide) ? route.b.y + route.b.h / 2 : route.b.x);
    addPort(route.b, route.toSide, route, 'to', horizontal(route.toSide) ? route.a.y + route.a.h / 2 : route.a.x);
  });
  ports.forEach((list, mapKey) => {
    const [id, side] = [mapKey.slice(0, mapKey.lastIndexOf(':')), mapKey.slice(mapKey.lastIndexOf(':') + 1)];
    const node = nodes.get(id);
    list.sort((p, q) => p.key - q.key || p.route.index - q.route.index);
    list.forEach((port, index) => {
      const fraction = (index + 1) / (list.length + 1);
      let point;
      if (side === 'left' || side === 'right') {
        const localY = node.h * fraction;
        point = { x: node.x + sideX(node.type, side, localY, node.w, node.h), y: node.y + localY };
      } else {
        point = { x: node.x + node.w * fraction, y: node.y + (side === 'bottom' ? node.h : 0) };
      }
      port.route[port.end === 'from' ? 'p1' : 'p2'] = point;
    });
  });

  const nodeBoxes = [...nodes.values()].map(node => ({ x: node.x, y: node.y, w: node.w, h: node.h, id: node.id }));
  const sequence = routes.slice().sort((p, q) => p.a.col - q.a.col || p.a.row - q.a.row || p.b.col - q.b.col || p.b.row - q.b.row || p.index - q.index);

  /* 1. Paths. Edges that skip a layer travel along a free horizontal corridor between rows. */
  const corridors = [];
  sequence.forEach((route, order) => {
    route.order = order;
    const { p1, p2 } = route;
    if (route.mode === 'forward' || route.mode === 'backward') {
      const dx = (p2.x - p1.x) / 2;
      route.d = Math.abs(p1.y - p2.y) < 0.5
        ? `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`
        : `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`;
      route.mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      route.labelRoom = B.gap - 8;
    } else if (route.mode === 'vertical') {
      route.d = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
      route.mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      route.labelRoom = B.colW - 16;
    } else if (route.mode === 'loop') {
      const bulge = route.fromSide === 'left' ? -40 : 40;
      route.d = `M ${p1.x} ${p1.y} C ${p1.x + bulge} ${p1.y}, ${p2.x + bulge} ${p2.y}, ${p2.x} ${p2.y}`;
      const gapCenter = route.fromSide === 'left' ? route.a.x - B.gap / 2 : route.a.x + B.colW + B.gap / 2;
      route.mid = { x: (gapCenter + p1.x + bulge * 0.75) / 2, y: (p1.y + p2.y) / 2 };
      route.labelRoom = B.gap - 8;
    } else {
      const dir = route.b.col > route.a.col ? 1 : -1;
      const xa = p1.x + dir * B.stub;
      const xb = p2.x - dir * B.stub;
      const lo = Math.min(route.a.col, route.b.col);
      const hi = Math.max(route.a.col, route.b.col);
      const between = nodeBoxes.filter(box => {
        const col = nodes.get(box.id).col;
        return col > lo && col < hi;
      });
      const target = (p1.y + p2.y) / 2;
      const spanX = [Math.min(xa, xb), Math.max(xa, xb)];
      let best = null;
      for (let y = B.ruleY + 16; y <= height - 12; y += 4) {
        if (between.some(box => y > box.y - 12 && y < box.y + box.h + 12)) continue;
        if (corridors.some(c => Math.abs(c.y - y) < 12 && c.x0 < spanX[1] && spanX[0] < c.x1)) continue;
        if (!best || Math.abs(y - target) < Math.abs(best - target)) best = y;
      }
      const y = best ?? height - 12;
      corridors.push({ y, x0: spanX[0], x1: spanX[1] });
      route.d = roundedPath([p1, { x: xa, y: p1.y }, { x: xa, y }, { x: xb, y }, { x: xb, y: p2.y }, p2], B.corner);
      const midCol = layers[Math.round((route.a.col + route.b.col) / 2)];
      route.mid = { x: midCol.x + B.colW / 2, y };
      route.labelRoom = B.colW - 16;
    }
    route.samples = samplePath(route.d);
    route.length = route.samples.length ? route.samples[route.samples.length - 1].l : 0;
  });

  /* 2. Labels: avoid nodes, other labels and every other edge line. */
  const placed = [];
  const crossesOtherRoute = (box, self) => sequence.some(other => other !== self && other.samples.some(pt => pt.x > box.x - 2 && pt.x < box.x + box.w + 2 && pt.y > box.y - 2 && pt.y < box.y + box.h + 2));
  sequence.forEach(route => {
    if (!route.label) return;
    // Leading icon slot: a document glyph (the payload) plus a lock on secure channels.
    const lock = route.kind === 'secure' ? 12 : 0;
    const icon = 14 + lock;
    const shape = (room, maxLines) => {
      const maxChars = Math.max(4, Math.floor((room - 12 - icon) / B.labelChar));
      const lines = wrapText(route.label, maxChars, maxLines);
      return { lines, w: Math.max(...lines.map(line => Array.from(line).length)) * B.labelChar + 12 + icon, h: lines.length * B.labelLine + 8 };
    };
    const shifts = [0, 18, -18, 36, -36, 54, -54, 72, -72, 90, -90, 108, -108];
    const slides = [0, -16, 16, -28, 28];
    const candidatesFor = ({ w, h }) => {
      const at = (cx, cy) => ({ x: cx - w / 2, y: cy - h / 2, w, h });
      const along = route.mode === 'forward' || route.mode === 'backward'
        ? [0.35, 0.65, 0.25, 0.75].map(t => pointAt(route.samples, t)).map(pt => at(pt.x, pt.y))
        : [];
      return [
        ...shifts.slice(0, 3).flatMap(shift => slides.map(slide => at(route.mid.x + slide, route.mid.y + shift))),
        ...along,
        ...shifts.slice(3).flatMap(shift => slides.map(slide => at(route.mid.x + slide, route.mid.y + shift))),
      ];
    };
    const fits = candidate => candidate.y >= B.ruleY + 4 && candidate.y + candidate.h <= height - 2
      && !placed.some(other => overlaps(candidate, other)) && !nodeBoxes.some(other => overlaps(candidate, other, 2));
    // Preferred shape first; a narrower three-line chip is the fallback for crowded gaps.
    const shapes = [shape(route.labelRoom, 2), shape(Math.round(route.labelRoom * 0.7), 3)];
    let chosen = null;
    let fallback = null;
    for (const option of shapes) {
      const lineFree = option.lines.every(line => !line.includes('…'));
      for (const candidate of candidatesFor(option)) {
        if (!fits(candidate)) continue;
        if (!fallback) fallback = { box: candidate, option };
        if (!lineFree || crossesOtherRoute(candidate, route)) continue;
        chosen = { box: candidate, option };
        break;
      }
      if (chosen) break;
    }
    const pick = chosen || fallback || { box: { x: route.mid.x - shapes[0].w / 2, y: route.mid.y - shapes[0].h / 2, w: shapes[0].w, h: shapes[0].h }, option: shapes[0] };
    placed.push(pick.box);
    route.labelBox = { ...pick.box, lines: pick.option.lines, lock, icon };
  });

  /* 3. Parked packets (reduced motion): a spot on the edge clear of nodes, labels and other parked packets. */
  const parkedBoxes = [];
  sequence.forEach(route => {
    if (route.labelBox) {
      const box = route.labelBox;
      route.park = { x: box.x + 6 + box.lock + BOARD.packetW / 2, y: box.y + box.h / 2, inLabel: true };
      return;
    }
    let chosen = null;
    const spots = [];
    for (let t = 0.5, k = 0; k <= 42; k += 1) spots.push(t + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * 0.02);
    for (const t of spots) {
      if (t < 0.06 || t > 0.94) continue;
      const point = pointAt(route.samples, t);
      const box = packetBox(point);
      if (nodeBoxes.some(n => overlaps(box, n, 4))) continue;
      if (placed.some(label => overlaps(box, label, 1))) continue;
      if (parkedBoxes.some(other => overlaps(box, other, 2))) continue;
      chosen = point;
      parkedBoxes.push(box);
      break;
    }
    route.park = chosen;
  });

  return { width, height, nodes, layers, routes: sequence, maxRows };
}

function nodeShape(type, W, H) {
  const cls = 'architecture-board__node-shape';
  if (type === 'input') return svgElement('polygon', { class: cls, points: `0,0 ${W},0 ${W},${H} 0,${H} 10,${H / 2}` });
  if (type === 'output') return svgElement('polygon', { class: cls, points: `0,0 ${W - 12},0 ${W},${H / 2} ${W - 12},${H} 0,${H}` });
  if (type === 'security') {
    const c = 10;
    return svgElement('polygon', { class: cls, points: `${c},0 ${W - c},0 ${W},${c} ${W},${H - c} ${W - c},${H} ${c},${H} 0,${H - c} 0,${c}` });
  }
  return svgElement('rect', { class: cls, x: 0, y: 0, width: W, height: H });
}

function nodeDetail(type, W, H) {
  if (type === 'queue') return svgElement('path', { class: 'architecture-board__node-detail', d: `M ${W - 5} 8 V ${H - 8} M ${W - 9} 8 V ${H - 8}` });
  if (type === 'database') return svgElement('path', { class: 'architecture-board__node-detail', d: `M 0 5 H ${W}` });
  return null;
}

function packetElement(route, withLabel) {
  const group = svgElement('g', { class: `architecture-board__packet architecture-board__packet--${route.kind}` });
  const doc = svgElement('g', { transform: `translate(${-BOARD.packetW / 2} ${-BOARD.packetH / 2})` });
  doc.append(
    svgElement('path', { d: DOC_GLYPH, class: 'architecture-board__packet-doc' }),
    svgElement('path', { d: DOC_FOLD, class: 'architecture-board__packet-fold' }),
  );
  if (route.kind === 'secure') doc.appendChild(svgElement('path', { d: LOCK_GLYPH, class: 'architecture-board__packet-lock', transform: 'translate(1 -9) scale(.9)' }));
  group.appendChild(doc);
  if (withLabel && route.payload) {
    const chars = Array.from(route.payload).length;
    const w = chars * 5.6 + 8;
    group.append(
      svgElement('rect', { x: 8, y: -7, width: w, height: 14, class: 'architecture-board__packet-chip' }),
      svgElement('text', { x: 12, y: 3.5, class: 'architecture-board__packet-text' }, route.payload),
    );
  }
  return group;
}

const noopBoard = () => {
  const api = () => {};
  api.highlight = () => {};
  api.clearHighlight = () => {};
  api.select = () => {};
  return api;
};

/**
 * Render an accessible, responsive SVG architecture board.
 * Returns a cleanup function that also exposes `highlight({ nodes, edges })`, `clearHighlight()` and `select(nodeId)`.
 * Options: `lang`, `inspectorHost` (element that receives the inspector instead of the board grid),
 * `hintSuffix` (extra hint text), `onSelect(nodeId | null)` (called on user selection).
 */
export function renderArchitectureBoard(container, architecture, { lang = 'pt', inspectorHost = null, hintSuffix = '', onSelect = null } = {}) {
  if (!container) return noopBoard();
  const safeLang = lang === 'en' ? 'en' : 'pt';
  const locale = safeLang === 'en' ? 'en' : 'pt-BR';
  const copy = COPY[safeLang];
  const prepared = prepareArchitecture(architecture, safeLang);
  if (!prepared) {
    container.replaceChildren();
    return noopBoard();
  }

  const { info } = prepared;
  const layout = layoutBoard(prepared);
  const instanceId = `architecture-board-${++boardSequence}`;
  const reduceQuery = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const prefersReduced = () => Boolean(reduceQuery?.matches);
  const W = BOARD.colW;
  const H = BOARD.nodeH;

  const shell = htmlElement('div', 'architecture-board');
  shell.setAttribute('data-architecture-board', '');
  if (inspectorHost) shell.classList.add('architecture-board--external-inspector');

  /* Stage: toolbar (counts + interaction hint), canvas, scroll hint */
  const stage = htmlElement('div', 'architecture-board__stage');
  const toolbar = htmlElement('div', 'architecture-board__toolbar');
  toolbar.appendChild(htmlElement('p', 'architecture-board__caption', copy.caption(info.size, layout.routes.length, layout.layers.length)));
  const hintBar = htmlElement('p', 'architecture-board__hint');
  const cursor = svgElement('svg', { class: 'architecture-board__hint-glyph', viewBox: '0 0 12 14', 'aria-hidden': 'true', focusable: 'false' });
  cursor.appendChild(svgElement('path', { d: 'M1 1 L1 11 L4 8.5 L6.2 13 L8 12.2 L5.9 7.8 L10 7.6 Z' }));
  const keyLeft = htmlElement('kbd', 'architecture-board__key', '←');
  const keyRight = htmlElement('kbd', 'architecture-board__key', '→');
  const sep = () => {
    const span = htmlElement('span', 'architecture-board__hint-sep', '·');
    span.setAttribute('aria-hidden', 'true');
    return span;
  };
  hintBar.append(cursor, htmlElement('span', '', copy.hintClick), sep(), keyLeft, keyRight, htmlElement('span', '', copy.hintKeys));
  if (hintSuffix) hintBar.append(sep(), htmlElement('span', '', hintSuffix));
  toolbar.appendChild(hintBar);
  stage.appendChild(toolbar);

  const canvas = htmlElement('div', 'architecture-board__canvas');
  const svg = svgElement('svg', {
    class: 'architecture-board__svg', viewBox: `0 0 ${layout.width} ${layout.height}`,
    role: 'group', 'aria-label': copy.board, preserveAspectRatio: 'xMidYMin meet',
  });
  svg.style.setProperty('--board-min-width', `${Math.round(layout.width * 0.82)}px`);
  svg.style.setProperty('--board-max-width', `${Math.round(layout.width * 1.12)}px`);
  const defs = svgElement('defs');
  const markerId = `${instanceId}-head`;
  const marker = svgElement('marker', {
    id: markerId, viewBox: '0 0 10 8', refX: 10, refY: 4, markerWidth: 9, markerHeight: 7.2,
    orient: 'auto', markerUnits: 'userSpaceOnUse',
  });
  marker.appendChild(svgElement('path', { d: 'M 0 0 L 10 4 L 0 8 Z', class: 'architecture-board__arrow' }));
  defs.appendChild(marker);
  svg.appendChild(defs);

  /* Swimlanes: alternating bands, separators and labelled headers */
  const laneGroup = svgElement('g', { class: 'architecture-board__lanes', 'aria-hidden': 'true' });
  layout.layers.forEach(layer => {
    laneGroup.appendChild(svgElement('rect', {
      x: layer.laneX, y: 0, width: layer.laneW, height: layout.height,
      class: `architecture-board__lane${layer.index % 2 ? ' architecture-board__lane--alt' : ''}`,
    }));
    if (layer.index > 0) laneGroup.appendChild(svgElement('line', { x1: layer.laneX, y1: 0, x2: layer.laneX, y2: layout.height, class: 'architecture-board__lane-sep' }));
    const text = svgElement('text', { x: layer.x, y: BOARD.headerY, class: 'architecture-board__layer' });
    text.appendChild(svgElement('tspan', { class: 'architecture-board__layer-index' }, String(layer.index + 1).padStart(2, '0')));
    text.appendChild(svgElement('tspan', { class: 'architecture-board__layer-name', x: layer.x + 26 }, shorten(layer.label.toLocaleUpperCase(locale), BOARD.headerChars)));
    laneGroup.append(text, svgElement('line', { x1: layer.x, y1: BOARD.ruleY, x2: layer.x + W, y2: BOARD.ruleY, class: 'architecture-board__layer-rule' }));
  });
  svg.appendChild(laneGroup);

  /* Edges */
  const nodeDelay = col => col * 140;
  const edgesStart = nodeDelay(layout.layers.length - 1) + 360;
  const edgeGroup = svgElement('g', { class: 'architecture-board__edges', 'aria-hidden': 'true' });
  const labelGroup = svgElement('g', { class: 'architecture-board__labels', 'aria-hidden': 'true' });
  const packetGroup = svgElement('g', { class: 'architecture-board__packets', 'aria-hidden': 'true' });
  const edgeKey = (from, to) => `${from}\u0000${to}`;
  const edgeViews = layout.routes.map(route => {
    const delay = edgesStart + route.order * 110;
    const group = svgElement('g', { class: `architecture-board__edge architecture-board__edge--${route.kind}`, 'data-from': route.from, 'data-to': route.to });
    const maskId = `${instanceId}-draw-${route.order}`;
    const mask = svgElement('mask', { id: maskId, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: layout.width, height: layout.height });
    const draw = svgElement('path', { d: route.d, class: 'architecture-board__draw', pathLength: 1, stroke: 'white' });
    draw.style.setProperty('--delay', `${delay}ms`);
    mask.appendChild(draw);
    defs.appendChild(mask);
    const body = svgElement('g', { class: 'architecture-board__edge-body', mask: `url(#${maskId})` });
    body.appendChild(svgElement('path', { d: route.d, class: 'architecture-board__edge-line' }));
    if (route.kind === 'secure') body.appendChild(svgElement('path', { d: route.d, class: 'architecture-board__edge-inner' }));
    body.appendChild(svgElement('path', { d: route.d, class: 'architecture-board__edge-head', 'marker-end': `url(#${markerId})` }));
    group.appendChild(body);
    edgeGroup.appendChild(group);

    let label = null;
    if (route.labelBox) {
      const box = route.labelBox;
      label = svgElement('g', { class: 'architecture-board__edge-label', 'data-from': route.from, 'data-to': route.to });
      label.style.setProperty('--delay', `${delay + 320}ms`);
      label.appendChild(svgElement('rect', { x: box.x, y: box.y, width: box.w, height: box.h, class: 'architecture-board__edge-label-bg' }));
      if (box.lock) {
        label.appendChild(svgElement('path', {
          d: LOCK_GLYPH, class: 'architecture-board__edge-lock',
          transform: `translate(${box.x + 6} ${box.y + box.h / 2 - 5})`,
        }));
      }
      const doc = svgElement('g', { class: 'architecture-board__edge-doc', transform: `translate(${box.x + 6 + box.lock} ${box.y + box.h / 2 - BOARD.packetH / 2})` });
      doc.append(svgElement('path', { d: DOC_GLYPH, class: 'architecture-board__packet-doc' }), svgElement('path', { d: DOC_FOLD, class: 'architecture-board__packet-fold' }));
      label.appendChild(doc);
      box.lines.forEach((line, index) => {
        label.appendChild(svgElement('text', {
          x: box.x + box.icon + (box.w - box.icon) / 2, y: box.y + 15 + index * BOARD.labelLine,
          'text-anchor': 'middle', class: 'architecture-board__edge-label-text',
        }, line));
      });
      labelGroup.appendChild(label);
    }
    return { route, key: edgeKey(route.from, route.to), group, label, mask, body, packets: [], parked: null };
  });
  svg.append(edgeGroup, labelGroup, packetGroup);

  /* Nodes */
  const nodeGroup = svgElement('g', { class: 'architecture-board__nodes' });
  const nodeViews = new Map();
  const defaultId = prepared.order[0];
  layout.nodes.forEach((position, id) => {
    const item = info.get(id);
    const group = svgElement('g', {
      class: `architecture-board__node architecture-board__node--${item.type}`,
      transform: `translate(${position.x} ${position.y})`,
      role: 'button', tabindex: id === defaultId ? 0 : -1,
      'aria-label': copy.nodeName({ title: item.title, type: copy.types[item.type], technology: item.technology, layer: item.layer }),
      'aria-pressed': 'false', 'data-node-id': id,
    });
    group.appendChild(svgElement('rect', { x: -5, y: -5, width: W + 10, height: H + 10, class: 'architecture-board__node-focus' }));
    if (id === defaultId) group.appendChild(svgElement('rect', { x: -1, y: -1, width: W + 2, height: H + 2, class: 'architecture-board__node-ring' }));
    const body = svgElement('g', { class: 'architecture-board__node-body' });
    body.style.setProperty('--delay', `${nodeDelay(position.col)}ms`);
    body.appendChild(nodeShape(item.type, W, H));
    const detail = nodeDetail(item.type, W, H);
    if (detail) body.appendChild(detail);
    body.appendChild(svgElement('path', { d: GLYPHS[item.type], class: 'architecture-board__node-glyph', transform: 'translate(14 12)' }));
    body.appendChild(svgElement('text', { x: 38, y: 24, class: 'architecture-board__node-type' }, copy.typesShort[item.type].toLocaleUpperCase(locale)));
    // Inspectable affordance: a small "+" in the top-right corner.
    const plusX = item.type === 'output' ? W - 30 : W - 20;
    body.appendChild(svgElement('path', { d: `M ${plusX + 4} 14 H ${plusX + 12} M ${plusX + 8} 10 V 18`, class: 'architecture-board__node-plus' }));
    body.appendChild(svgElement('line', { x1: 14, y1: 34, x2: item.type === 'output' ? W - 24 : W - 14, y2: 34, class: 'architecture-board__node-divider' }));
    const titleLines = wrapText(item.title, BOARD.titleChars, 2);
    titleLines.forEach((line, index) => {
      body.appendChild(svgElement('text', { x: 14, y: 54 + index * 18, class: 'architecture-board__node-title' }, line));
    });
    if (item.technology) {
      const techLines = wrapText(item.technology, BOARD.techChars, titleLines.length > 1 ? 1 : 2);
      techLines.forEach((line, index) => {
        body.appendChild(svgElement('text', { x: 14, y: H - 13 - (techLines.length - 1 - index) * 14, class: 'architecture-board__node-tech' }, line));
      });
    }
    group.appendChild(body);
    nodeGroup.appendChild(group);
    nodeViews.set(id, { element: group, item, position });
  });
  svg.appendChild(nodeGroup);
  canvas.appendChild(svg);
  const hint = htmlElement('p', 'architecture-board__scroll-hint');
  hint.append(htmlElement('span', 'architecture-board__scroll-hint-icon', '↔'), document.createTextNode(` ${copy.scrollHint}`));
  hint.firstChild.setAttribute('aria-hidden', 'true');
  stage.append(canvas, hint);

  /* Inspector */
  const inspector = htmlElement('aside', 'architecture-board__inspector');
  const kicker = htmlElement('p', 'architecture-board__inspector-kicker', copy.inspector);
  kicker.id = `${instanceId}-inspector`;
  inspector.setAttribute('aria-labelledby', kicker.id);
  const inspectorBody = htmlElement('div', 'architecture-board__inspector-body');
  inspectorBody.setAttribute('aria-live', 'polite');
  inspector.append(kicker, inspectorBody);

  /* Legend */
  const legend = htmlElement('div', 'architecture-board__legend');
  const legendHeading = htmlElement('h3', 'architecture-board__legend-heading', copy.legend);
  legendHeading.id = `${instanceId}-legend`;
  const legendList = htmlElement('ul', 'architecture-board__legend-list');
  legendList.setAttribute('aria-labelledby', legendHeading.id);
  EDGE_KINDS.forEach(kind => {
    const li = htmlElement('li', `architecture-board__legend-item architecture-board__legend-item--${kind}`);
    const sample = svgElement('svg', { class: 'architecture-board__legend-sample', viewBox: '0 0 40 12', 'aria-hidden': 'true', focusable: 'false' });
    const g = svgElement('g', { class: `architecture-board__edge architecture-board__edge--${kind}` });
    g.appendChild(svgElement('path', { d: 'M 1 6 H 32', class: 'architecture-board__edge-line' }));
    if (kind === 'secure') g.appendChild(svgElement('path', { d: 'M 1 6 H 32', class: 'architecture-board__edge-inner' }));
    g.appendChild(svgElement('path', { d: 'M 31 2.5 L 39 6 L 31 9.5 Z', class: 'architecture-board__arrow' }));
    sample.appendChild(g);
    li.append(sample, htmlElement('span', '', copy.kinds[kind]));
    legendList.appendChild(li);
  });
  legend.append(legendHeading, legendList);

  /* Text equivalent */
  const details = htmlElement('details', 'architecture-board__text');
  details.appendChild(htmlElement('summary', 'architecture-board__text-summary', copy.textSummary));
  const textList = htmlElement('ol', 'architecture-board__text-list');
  const orderIndex = new Map(prepared.order.map((id, index) => [id, index]));
  prepared.edges
    .slice()
    .sort((p, q) => orderIndex.get(p.from) - orderIndex.get(q.from) || orderIndex.get(p.to) - orderIndex.get(q.to))
    .forEach(edge => {
      textList.appendChild(htmlElement('li', '', copy.edgeSentence({
        from: info.get(edge.from).title, to: info.get(edge.to).title, label: edge.label, kind: copy.kinds[edge.kind],
      })));
    });
  details.appendChild(textList);

  if (inspectorHost) {
    shell.append(stage, legend, details);
    inspectorHost.replaceChildren(inspector);
  } else {
    shell.append(stage, inspector, legend, details);
  }

  /* ---------- Packets ---------- */
  const packetLabels = layout.routes.length * 2 <= MAX_PACKETS;
  let budget = MAX_PACKETS;
  edgeViews.forEach(view => {
    const rhythm = RHYTHM[view.route.kind] || RHYTHM.sync;
    const count = Math.max(1, Math.min(rhythm.burst, budget - (edgeViews.length - edgeViews.indexOf(view) - 1)));
    for (let k = 0; k < count && budget > 0; k += 1) {
      const element = packetElement(view.route, packetLabels);
      element.style.opacity = '0';
      packetGroup.appendChild(element);
      view.packets.push(element);
      budget -= 1;
    }
    if (view.route.park && !view.route.park.inLabel) {
      const parked = packetElement(view.route, false);
      parked.classList.add('architecture-board__packet--parked');
      parked.setAttribute('transform', `translate(${view.route.park.x} ${view.route.park.y})`);
      packetGroup.appendChild(parked);
      view.parked = parked;
    }
  });

  const flow = { clock: 0, last: 0, frame: 0, inView: false, entered: false, hidden: typeof document !== 'undefined' && document.visibilityState === 'hidden' };
  const ease = t => (t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2);
  const columnRank = new Map();
  edgeViews.forEach(view => {
    const key = view.route.a.col;
    columnRank.set(key, (columnRank.get(key) || 0) + 1);
    view.offset = view.route.a.col * 0.6 + (columnRank.get(key) - 1) * 0.22;
  });

  const drawPackets = () => {
    const emphasis = state.emphasis;
    edgeViews.forEach(view => {
      const active = !emphasis || emphasis.edges.has(view.key);
      const rhythm = RHYTHM[view.route.kind] || RHYTHM.sync;
      const speed = emphasis && active ? EMPHASIS_SPEED : 1;
      const period = rhythm.period / speed;
      const travel = rhythm.travel / speed;
      view.packets.forEach((element, k) => {
        if (!active) {
          if (element.style.opacity !== '0') element.style.opacity = '0';
          return;
        }
        const local = flow.clock - view.offset - k * rhythm.spacing;
        if (local < 0) {
          element.style.opacity = '0';
          return;
        }
        const phase = local % period;
        if (phase >= travel) {
          if (element.style.opacity !== '0') element.style.opacity = '0';
          return;
        }
        const p = ease(phase / travel);
        const point = pointAt(view.route.samples, p);
        element.setAttribute('transform', `translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})`);
        element.style.opacity = String(Math.min(1, p / 0.08, (1 - p) / 0.08).toFixed(2));
      });
    });
  };

  const tick = now => {
    flow.frame = 0;
    const dt = flow.last ? Math.min(0.1, (now - flow.last) / 1000) : 0;
    flow.last = now;
    flow.clock += dt;
    drawPackets();
    flow.frame = requestAnimationFrame(tick);
  };
  const canFlow = () => flow.entered && flow.inView && !flow.hidden && !prefersReduced() && !disposed;
  const updateFlow = () => {
    shell.classList.toggle('is-static-flow', prefersReduced());
    shell.classList.toggle('is-flowing', canFlow());
    if (canFlow()) {
      if (!flow.frame) {
        flow.last = 0;
        flow.frame = requestAnimationFrame(tick);
      }
    } else if (flow.frame) {
      cancelAnimationFrame(flow.frame);
      flow.frame = 0;
    }
  };

  /* ---------- Selection and emphasis ---------- */
  const state = { selected: null, emphasis: null, path: false };
  const neighborsOf = id => new Set(prepared.edges.flatMap(edge => (edge.from === id ? [edge.to] : edge.to === id ? [edge.from] : [])));

  const connectionList = (heading, edges, direction) => {
    const section = htmlElement('div', 'architecture-board__connections');
    section.appendChild(htmlElement('h4', 'architecture-board__connections-heading', heading));
    const list = htmlElement('ul', 'architecture-board__connections-list');
    edges.forEach(edge => {
      const peerId = direction === 'in' ? edge.from : edge.to;
      const peer = info.get(peerId);
      const li = htmlElement('li');
      const button = htmlElement('button', 'architecture-board__connection');
      button.type = 'button';
      button.dataset.nodeId = peerId;
      const icon = htmlElement('span', 'architecture-board__connection-icon', direction === 'in' ? '←' : '→');
      icon.setAttribute('aria-hidden', 'true');
      const meta = [edge.label, copy.kinds[edge.kind]].filter(Boolean).join(' · ');
      button.append(icon, htmlElement('span', 'architecture-board__connection-name', peer.title), htmlElement('span', 'architecture-board__connection-meta', meta));
      li.appendChild(button);
      list.appendChild(li);
    });
    section.appendChild(list);
    return section;
  };

  const renderEmpty = () => {
    const content = [
      htmlElement('h3', 'architecture-board__inspector-title', copy.emptyTitle),
      htmlElement('p', 'architecture-board__inspector-description', copy.emptyText),
    ];
    const section = htmlElement('div', 'architecture-board__connections');
    section.appendChild(htmlElement('h4', 'architecture-board__connections-heading', copy.emptyList));
    const list = htmlElement('ul', 'architecture-board__connections-list');
    prepared.order.slice(0, 4).forEach(id => {
      const li = htmlElement('li');
      const button = htmlElement('button', 'architecture-board__connection');
      button.type = 'button';
      button.dataset.nodeId = id;
      const icon = htmlElement('span', 'architecture-board__connection-icon', '+');
      icon.setAttribute('aria-hidden', 'true');
      button.append(icon, htmlElement('span', 'architecture-board__connection-name', info.get(id).title), htmlElement('span', 'architecture-board__connection-meta', copy.types[info.get(id).type]));
      li.appendChild(button);
      list.appendChild(li);
    });
    section.appendChild(list);
    content.push(section);
    inspectorBody.replaceChildren(...content);
    inspector.classList.add('is-empty');
  };

  const renderInspector = id => {
    if (!id || !info.has(id)) {
      renderEmpty();
      return;
    }
    inspector.classList.remove('is-empty');
    const item = info.get(id);
    const content = [];
    content.push(htmlElement('h3', 'architecture-board__inspector-title', item.title));
    const meta = htmlElement('dl', 'architecture-board__meta');
    [[copy.type, copy.types[item.type]], [copy.layer, item.layer], [copy.technology, item.technology]].forEach(([label, value]) => {
      if (!value) return;
      const row = htmlElement('div', 'architecture-board__meta-row');
      row.append(htmlElement('dt', '', label), htmlElement('dd', '', value));
      meta.appendChild(row);
    });
    content.push(meta);
    if (item.description) content.push(htmlElement('p', 'architecture-board__inspector-description', item.description));
    if (item.detail) {
      const block = htmlElement('div', 'architecture-board__inspector-detail');
      block.append(htmlElement('h4', 'architecture-board__connections-heading', copy.detail), htmlElement('p', 'architecture-board__inspector-description', item.detail));
      content.push(block);
    }
    const incoming = prepared.edges.filter(edge => edge.to === id);
    const outgoing = prepared.edges.filter(edge => edge.from === id);
    if (incoming.length) content.push(connectionList(copy.incoming, incoming, 'in'));
    if (outgoing.length) content.push(connectionList(copy.outgoing, outgoing, 'out'));
    if (!incoming.length && !outgoing.length) content.push(htmlElement('p', 'architecture-board__inspector-description', copy.isolated));
    inspectorBody.replaceChildren(...content);
  };

  const apply = () => {
    const { selected, emphasis } = state;
    nodeViews.forEach((view, id) => {
      const isSelected = id === selected;
      const strong = emphasis ? emphasis.nodes.has(id) : false;
      view.element.classList.toggle('is-selected', isSelected);
      view.element.classList.toggle('is-emphasis', Boolean(emphasis) && strong);
      view.element.classList.toggle('is-muted', Boolean(emphasis) && !strong);
      view.element.setAttribute('aria-pressed', String(isSelected));
    });
    edgeViews.forEach(view => {
      const strong = emphasis ? emphasis.edges.has(view.key) : false;
      [view.group, view.label, view.parked].forEach(element => {
        if (!element) return;
        element.classList.toggle('is-emphasis', Boolean(emphasis) && strong);
        element.classList.toggle('is-muted', Boolean(emphasis) && !strong);
      });
    });
    shell.classList.toggle('is-engaged', Boolean(emphasis));
    renderInspector(selected);
    if (!flow.frame && !prefersReduced()) drawPackets();
  };

  const setRoving = id => {
    nodeViews.forEach((view, nodeId) => view.element.setAttribute('tabindex', nodeId === id ? '0' : '-1'));
  };

  const selectNode = (id, { focus = false, user = false } = {}) => {
    if (!nodeViews.has(id)) return;
    const neighbors = neighborsOf(id);
    state.selected = id;
    state.path = false;
    state.emphasis = {
      nodes: new Set([id, ...neighbors]),
      edges: new Set(prepared.edges.filter(edge => edge.from === id || edge.to === id).map(edge => edgeKey(edge.from, edge.to))),
    };
    setRoving(id);
    apply();
    if (focus) nodeViews.get(id).element.focus();
    if (user && typeof onSelect === 'function') onSelect(id);
  };

  const clearAll = ({ user = false } = {}) => {
    state.selected = null;
    state.emphasis = null;
    state.path = false;
    apply();
    if (user && typeof onSelect === 'function') onSelect(null);
  };

  const highlight = ({ nodes = [], edges = [] } = {}) => {
    if (disposed) return;
    const edgeSet = new Set();
    const nodeSet = new Set((Array.isArray(nodes) ? nodes : []).map(String).filter(id => nodeViews.has(id)));
    (Array.isArray(edges) ? edges : []).forEach(pair => {
      if (!Array.isArray(pair) || pair.length < 2) return;
      const [from, to] = pair.map(String);
      const forward = edgeViews.find(view => view.route.from === from && view.route.to === to);
      const backward = forward ? null : edgeViews.find(view => view.route.from === to && view.route.to === from);
      const view = forward || backward;
      if (!view) return;
      edgeSet.add(view.key);
      nodeSet.add(view.route.from);
      nodeSet.add(view.route.to);
    });
    if (!nodeSet.size) {
      clearAll();
      return;
    }
    const ordered = (Array.isArray(nodes) ? nodes : []).map(String).filter(id => nodeViews.has(id));
    state.selected = ordered[ordered.length - 1] || [...nodeSet][nodeSet.size - 1];
    state.emphasis = { nodes: nodeSet, edges: edgeSet };
    state.path = true;
    setRoving(state.selected);
    apply();
  };

  const columnsIds = prepared.columns.map(column => column.ids);
  const layoutOrder = columnsIds.flat();
  const neighborInDirection = (id, key) => {
    const { col, row } = layout.nodes.get(id);
    if (key === 'ArrowUp' || key === 'ArrowDown') {
      const ids = columnsIds[col];
      return ids[Math.max(0, Math.min(ids.length - 1, row + (key === 'ArrowDown' ? 1 : -1)))];
    }
    const step = key === 'ArrowRight' ? 1 : -1;
    const targetCol = col + step;
    if (targetCol < 0 || targetCol >= columnsIds.length) return id;
    const position = layout.nodes.get(id);
    const center = position.y + position.h / 2;
    return columnsIds[targetCol].reduce((best, candidate) => {
      const p = layout.nodes.get(candidate);
      const b = layout.nodes.get(best);
      return Math.abs(p.y + p.h / 2 - center) < Math.abs(b.y + b.h / 2 - center) ? candidate : best;
    }, columnsIds[targetCol][0]);
  };

  const onClick = event => {
    const node = event.target.closest?.('[data-node-id]');
    if (node && svg.contains(node)) selectNode(node.getAttribute('data-node-id'), { user: true });
  };
  const onKeyDown = event => {
    const current = event.target.closest?.('[data-node-id]');
    if (!current || !svg.contains(current)) return;
    const id = current.getAttribute('data-node-id');
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      const next = neighborInDirection(id, event.key);
      if (next && next !== id) selectNode(next, { focus: true, user: true });
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      selectNode(event.key === 'Home' ? layoutOrder[0] : layoutOrder[layoutOrder.length - 1], { focus: true, user: true });
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectNode(id, { user: true });
    } else if (event.key === 'Escape') {
      if (!state.emphasis && !state.selected) return;
      event.preventDefault();
      clearAll({ user: true });
    }
  };
  const onFocusIn = event => {
    const node = event.target.closest?.('[data-node-id]');
    if (node && svg.contains(node)) setRoving(node.getAttribute('data-node-id'));
  };
  const onInspectorClick = event => {
    const button = event.target.closest?.('button[data-node-id]');
    if (button && inspector.contains(button)) selectNode(button.dataset.nodeId, { focus: true, user: true });
  };
  svg.addEventListener('click', onClick);
  svg.addEventListener('keydown', onKeyDown);
  svg.addEventListener('focusin', onFocusIn);
  inspector.addEventListener('click', onInspectorClick);

  /* Entrance: nodes layer by layer, then edges drawn in sequence; once, on first view. Then packets start. */
  let observer = null;
  let viewObserver = null;
  let revealTimer = 0;
  let ringTimer = 0;
  let frame = 0;
  let disposed = false;
  const dropMasks = () => {
    edgeViews.forEach(view => {
      view.body.removeAttribute('mask');
      view.mask.remove();
    });
  };
  const hintFirstNode = () => {
    if (prefersReduced()) return;
    const first = nodeViews.get(defaultId)?.element;
    if (!first) return;
    first.classList.add('is-hinting');
    ringTimer = window.setTimeout(() => first.classList.remove('is-hinting'), 1800);
  };
  const finishEntrance = () => {
    shell.classList.remove('is-pending', 'is-revealing');
    dropMasks();
    flow.entered = true;
    updateFlow();
    hintFirstNode();
  };
  const reveal = () => {
    shell.classList.add('is-revealing');
    frame = requestAnimationFrame(() => {
      frame = 0;
      shell.classList.remove('is-pending');
    });
    const total = edgesStart + Math.max(0, edgeViews.length - 1) * 110 + 480 + 600;
    revealTimer = window.setTimeout(finishEntrance, total);
  };
  const hasObserver = typeof IntersectionObserver === 'function';
  if (hasObserver && !prefersReduced()) {
    shell.classList.add('is-pending');
    observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      observer = null;
      reveal();
    }, { threshold: 0.2 });
  } else {
    dropMasks();
    flow.entered = true;
  }
  if (hasObserver) {
    viewObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { flow.inView = entry.isIntersecting; });
      updateFlow();
    }, { threshold: 0 });
  } else {
    flow.inView = true;
  }
  const onVisibility = () => {
    flow.hidden = document.visibilityState === 'hidden';
    updateFlow();
  };
  document.addEventListener('visibilitychange', onVisibility);
  const onMotionChange = () => updateFlow();
  reduceQuery?.addEventListener?.('change', onMotionChange);

  container.replaceChildren(shell);
  setRoving(defaultId);
  apply();
  observer?.observe(shell);
  viewObserver?.observe(canvas);
  updateFlow();

  const cleanup = () => {
    if (disposed) return;
    disposed = true;
    observer?.disconnect();
    viewObserver?.disconnect();
    if (frame) cancelAnimationFrame(frame);
    if (flow.frame) cancelAnimationFrame(flow.frame);
    flow.frame = 0;
    window.clearTimeout(revealTimer);
    window.clearTimeout(ringTimer);
    document.removeEventListener('visibilitychange', onVisibility);
    reduceQuery?.removeEventListener?.('change', onMotionChange);
    svg.removeEventListener('click', onClick);
    svg.removeEventListener('keydown', onKeyDown);
    svg.removeEventListener('focusin', onFocusIn);
    inspector.removeEventListener('click', onInspectorClick);
    if (container.contains(shell)) shell.remove();
    if (inspectorHost && inspectorHost.contains(inspector)) inspector.remove();
  };
  cleanup.highlight = highlight;
  cleanup.clearHighlight = () => { if (!disposed) clearAll(); };
  cleanup.select = id => { if (!disposed) selectNode(String(id)); };
  return cleanup;
}
