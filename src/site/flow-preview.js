import '../styles/architecture-board.css';
import { prepareArchitecture, shorten, wrapText } from './architecture-board.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
let previewSequence = 0;

const COPY = {
  pt: { flow: 'Fluxo' },
  en: { flow: 'Flow' },
};

/*
 * Variant geometry in SVG user units. `labelFont` drives the mono character estimate (0.6em).
 * stub = horizontal room reserved between a label and the next column for the edge elbow.
 */
const VARIANTS = {
  hero: { w: 600, h: 240, padX: 16, top: 44, bottom: 20, mark: 10, labelFont: 11, headerFont: 10, titles: true, layerNames: true, stub: 18 },
  row: { w: 480, h: 360, padX: 12, top: 52, bottom: 28, mark: 10, labelFont: 10.5, headerFont: 10.5, titles: true, layerNames: false, stub: 14 },
  thumb: { w: 480, h: 360, padX: 20, top: 56, bottom: 36, mark: 14, labelFont: 13, headerFont: 13, titles: false, layerNames: false, stub: 18 },
};

function svgElement(tag, attrs = {}, text = '') {
  const element = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value !== undefined && value !== null) element.setAttribute(key, String(value));
  });
  if (text) element.textContent = text;
  return element;
}

/** DOM-free preview geometry (exported for layout checks). */
export function layoutFlowPreview(prepared, variant = 'row') {
  const V = VARIANTS[variant] || VARIANTS.row;
  const { columns, info, edges } = prepared;
  const count = columns.length;
  const colW = (V.w - V.padX * 2) / count;
  const maxRows = Math.max(1, ...columns.map(column => column.ids.length));
  const pitch = (V.h - V.top - V.bottom) / maxRows;
  const charW = V.labelFont * 0.6;
  const lineH = V.labelFont * 1.2;
  const labelX = V.mark + 5;
  const maxLabelW = colW - labelX - V.stub;
  const maxChars = Math.max(4, Math.floor(maxLabelW / charW));

  const nodes = new Map();
  const layers = columns.map((column, col) => {
    const x = V.padX + col * colW;
    const offset = (maxRows - column.ids.length) * pitch / 2;
    column.ids.forEach((id, row) => {
      const cy = V.top + offset + row * pitch + pitch / 2;
      const lines = V.titles ? wrapText(info.get(id).title, maxChars, 2) : [];
      const textW = lines.length ? Math.max(...lines.map(line => Array.from(line).length)) * charW : 0;
      nodes.set(id, {
        id, col, row, x, cy, type: info.get(id).type, lines,
        labelBox: lines.length ? { x: x + labelX, y: cy - (lines.length * lineH) / 2, w: textW, h: lines.length * lineH } : null,
        portX: lines.length ? x + labelX + textW + 4 : x + V.mark + 3,
      });
    });
    const header = V.layerNames ? `${String(col + 1).padStart(2, '0')} ${column.label}` : String(col + 1).padStart(2, '0');
    return { x, index: col, text: shorten(header, Math.floor((colW - 12) / (V.headerFont * 0.6))) };
  });

  const routes = edges.map(edge => {
    const a = nodes.get(edge.from);
    const b = nodes.get(edge.to);
    const m = V.mark;
    let d;
    let tick;
    if (a.col < b.col) {
      const x1 = a.portX;
      const y1 = a.cy;
      const x2 = b.x - 1;
      const y2 = b.cy;
      const bus = x2 - 7;
      const dy = y2 - y1;
      const r = Math.min(3, Math.abs(dy) / 2);
      if (Math.abs(dy) < 0.5) d = `M ${x1} ${y1} H ${x2}`;
      else if (bus - r <= x1) d = `M ${x1} ${y1} L ${x2} ${y2}`;
      else {
        const s = Math.sign(dy);
        d = `M ${x1} ${y1} H ${bus - r} Q ${bus} ${y1} ${bus} ${y1 + s * r} V ${y2 - s * r} Q ${bus} ${y2} ${bus + r} ${y2} H ${x2}`;
      }
      tick = { x: x1 + 4, y: y1, vertical: false };
    } else if (a.col === b.col && Math.abs(a.row - b.row) === 1) {
      const x = a.x + m / 2;
      const down = b.row > a.row;
      const y1 = a.cy + (down ? m / 2 : -m / 2);
      const y2 = b.cy + (down ? -m / 2 - 1 : m / 2 + 1);
      d = `M ${x} ${y1} V ${y2}`;
      tick = { x, y: y1 + (down ? 4 : -4), vertical: true };
    } else if (a.col === b.col) {
      const x = a.x;
      d = `M ${x} ${a.cy} H ${x - 5} V ${b.cy} H ${x - 1}`;
      tick = { x: x - 5, y: (a.cy + b.cy) / 2, vertical: true };
    } else {
      d = `M ${a.x} ${a.cy} L ${b.portX + 1} ${b.cy}`;
      tick = { x: a.x - 4, y: a.cy, vertical: false };
    }
    return { ...edge, d, tick, layer: a.col };
  });

  return { width: V.w, height: V.h, variant: VARIANTS[variant] ? variant : 'row', V, nodes, layers, routes, lineH };
}

function markShape(type, x, y, m) {
  const cls = `flow-preview__mark flow-preview__mark--${type}`;
  const c = m / 2;
  if (type === 'database') return [svgElement('circle', { class: cls, cx: x + c, cy: y + c, r: c })];
  if (type === 'security') return [svgElement('polygon', { class: cls, points: `${x + c},${y} ${x + m},${y + c} ${x + c},${y + m} ${x},${y + c}` })];
  const box = svgElement('rect', { class: cls, x, y, width: m, height: m });
  if (type === 'input') return [box, svgElement('circle', { class: 'flow-preview__mark-detail flow-preview__mark-detail--fill', cx: x + c, cy: y + c, r: m * 0.15 })];
  if (type === 'queue') {
    const inset = m * 0.25;
    return [box, svgElement('path', { class: 'flow-preview__mark-detail', d: `M ${x + inset} ${y + m * 0.38} H ${x + m - inset} M ${x + inset} ${y + m * 0.62} H ${x + m - inset}` })];
  }
  return [box];
}

/**
 * Compact, muted SVG of a case architecture. Appends itself to `container`.
 * Returns { el, setActive(bool), destroy() }; a no-op handle when there are no nodes.
 */
export function renderFlowPreview(container, caseItem, { lang = 'pt', variant = 'row' } = {}) {
  const noop = { el: null, setActive() {}, destroy() {} };
  const safeLang = lang === 'en' ? 'en' : 'pt';
  const prepared = prepareArchitecture(caseItem?.architecture, safeLang);
  if (!container || !prepared) return noop;

  const layout = layoutFlowPreview(prepared, variant);
  const { V } = layout;
  const id = `flow-preview-${++previewSequence}`;
  const el = document.createElement('div');
  el.className = `flow-preview flow-preview--${layout.variant}`;
  if (caseItem?.accent) el.dataset.accent = caseItem.accent;

  const titles = prepared.order.map(nodeId => prepared.info.get(nodeId).title);
  const svg = svgElement('svg', {
    class: 'flow-preview__svg', viewBox: `0 0 ${layout.width} ${layout.height}`,
    role: 'img', 'aria-label': `${COPY[safeLang].flow}: ${titles.join(' → ')}`,
    preserveAspectRatio: 'xMidYMid meet', focusable: 'false',
  });
  const defs = svgElement('defs');
  [['head', ''], ['head-lit', ' flow-preview__arrow--lit']].forEach(([suffix, extra]) => {
    const marker = svgElement('marker', {
      id: `${id}-${suffix}`, viewBox: '0 0 6 5', refX: 6, refY: 2.5, markerWidth: 6, markerHeight: 5,
      orient: 'auto', markerUnits: 'userSpaceOnUse',
    });
    marker.appendChild(svgElement('path', { d: 'M 0 0 L 6 2.5 L 0 5 Z', class: `flow-preview__arrow${extra}` }));
    defs.appendChild(marker);
  });
  svg.appendChild(defs);

  const headerY = V.top - 22;
  const header = svgElement('g', { class: 'flow-preview__layers', 'aria-hidden': 'true' });
  layout.layers.forEach((layer, index) => {
    const nextX = index < layout.layers.length - 1 ? layout.layers[index + 1].x : layout.width - V.padX + 12;
    header.append(
      svgElement('text', { x: layer.x, y: headerY, class: 'flow-preview__layer', 'font-size': V.headerFont }, layer.text),
      svgElement('line', { x1: layer.x, y1: headerY + 7, x2: nextX - 12, y2: headerY + 7, class: 'flow-preview__rule' }),
    );
  });
  svg.appendChild(header);

  const tickFor = (route, cls) => {
    if (route.kind !== 'secure') return null;
    const { x, y, vertical } = route.tick;
    return svgElement('rect', { class: cls, x: x - (vertical ? 2 : 1.5), y: y - (vertical ? 1.5 : 2), width: vertical ? 4 : 3, height: vertical ? 3 : 4 });
  };

  const base = svgElement('g', { class: 'flow-preview__edges', 'aria-hidden': 'true' });
  const lit = svgElement('g', { class: 'flow-preview__lit', 'aria-hidden': 'true' });
  layout.routes.forEach((route, index) => {
    base.appendChild(svgElement('path', { d: route.d, class: `flow-preview__edge flow-preview__edge--${route.kind}`, 'marker-end': `url(#${id}-head)` }));
    const baseTick = tickFor(route, 'flow-preview__tick');
    if (baseTick) base.appendChild(baseTick);

    const maskId = `${id}-draw-${index}`;
    const mask = svgElement('mask', { id: maskId, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: layout.width, height: layout.height });
    const draw = svgElement('path', { d: route.d, class: 'flow-preview__draw', pathLength: 1, stroke: 'white' });
    draw.style.setProperty('--layer', route.layer);
    mask.appendChild(draw);
    defs.appendChild(mask);
    const group = svgElement('g', { mask: `url(#${maskId})` });
    group.appendChild(svgElement('path', { d: route.d, class: `flow-preview__edge flow-preview__edge--${route.kind}`, 'marker-end': `url(#${id}-head-lit)` }));
    const litTick = tickFor(route, 'flow-preview__tick');
    if (litTick) group.appendChild(litTick);
    lit.appendChild(group);
  });
  svg.append(base, lit);

  const nodeGroup = svgElement('g', { class: 'flow-preview__nodes', 'aria-hidden': 'true' });
  layout.nodes.forEach(node => {
    const g = svgElement('g', { class: `flow-preview__node flow-preview__node--${node.type}` });
    g.style.setProperty('--layer', node.col);
    markShape(node.type, node.x, node.cy - V.mark / 2, V.mark).forEach(shape => g.appendChild(shape));
    node.lines.forEach((line, index) => {
      g.appendChild(svgElement('text', {
        x: node.labelBox.x, y: node.labelBox.y + layout.lineH * (index + 1) - V.labelFont * 0.28,
        class: 'flow-preview__label', 'font-size': V.labelFont,
      }, line));
    });
    nodeGroup.appendChild(g);
  });
  svg.appendChild(nodeGroup);
  el.appendChild(svg);
  container.appendChild(el);

  let active = false;
  let destroyed = false;
  return {
    el,
    setActive(value) {
      const next = Boolean(value);
      if (destroyed || next === active) return;
      active = next;
      el.classList.toggle('is-active', active);
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      el.remove();
    },
  };
}
