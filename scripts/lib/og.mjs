// Imagens Open Graph (1200×630) e ícones gerados com @resvg/resvg-js a partir de SVG.
// Fontes: TTF (OFL) em scripts/assets/fonts — o resvg não lê woff2.
import { Resvg } from '@resvg/resvg-js';
import { existsSync } from 'node:fs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FONT_DIR = path.join(HERE, '..', 'assets', 'fonts');
const FONT_FILES = ['geist-400.ttf', 'geist-600.ttf', 'instrument-serif-italic.ttf']
  .map(file => path.join(FONT_DIR, file))
  .filter(file => existsSync(file));

// Cores dos tokens de src/styles/site.css (--bg, --text-1, --text-2, --line e acentos de domínio).
export const COLORS = {
  bg: '#0B0E11',
  surface: '#12161A',
  line: '#262D34',
  text1: '#EDEFEA',
  text2: '#A9B1AC',
  accent: '#7FB2FF',
  fiscal: '#FF8A6B',
  ops: '#5FD39A',
  ai: '#B49CFF',
  fitness: '#62D0E6',
  neutral: '#7FB2FF',
};

const escapeXml = value => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/** Quebra aproximada por largura média de caractere (em unidades de font-size). */
function wrap(text, fontSize, maxWidth, maxLines, avg = 0.52) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const limit = Math.max(8, Math.floor(maxWidth / (fontSize * avg)));
  const lines = [];
  let current = '';
  for (const word of words) {
    const next = current ? current + ' ' + word : word;
    if (next.length > limit && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1].replace(/[\s,.;:·—-]*$/, '') + '…';
    return kept;
  }
  return lines;
}

function tspans(lines, x, lineHeight) {
  return lines.map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`).join('');
}

/**
 * @param {{ eyebrow: string, title: string, pitch: string, footer: string, accent: string }} card
 */
export function ogSvg({ eyebrow, title, pitch, footer, accent = 'neutral' }) {
  const color = COLORS[accent] || COLORS.accent;
  const titleSize = title.length > 48 ? 64 : 76;
  const titleLines = wrap(title, titleSize, 1040, 3, 0.5);
  const titleY = Math.round(214 + titleSize * 0.95);
  const pitchY = titleY + titleLines.length * titleSize * 1.08 + 34;
  const pitchLines = wrap(pitch, 34, 1040, 2, 0.42);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${COLORS.bg}"/>
  <rect x="0" y="0" width="1200" height="8" fill="${color}"/>
  <g stroke="${COLORS.line}" stroke-width="1">
    <line x1="80" y1="120" x2="1120" y2="120"/>
    <line x1="80" y1="530" x2="1120" y2="530"/>
  </g>
  <circle cx="1084" cy="84" r="10" fill="${color}"/>
  <text x="80" y="92" font-family="Geist" font-weight="600" font-size="30" fill="${COLORS.text1}">Bruno Silva</text>
  <text x="80" y="186" font-family="Geist" font-weight="400" font-size="24" letter-spacing="3" fill="${color}">${escapeXml(eyebrow.toUpperCase())}</text>
  <text x="80" y="${titleY}" font-family="Geist" font-weight="600" font-size="${titleSize}" fill="${COLORS.text1}" letter-spacing="-1.5">${tspans(titleLines, 80, Math.round(titleSize * 1.08))}</text>
  <text x="80" y="${Math.round(pitchY)}" font-family="Instrument Serif" font-style="italic" font-size="34" fill="${COLORS.text2}">${tspans(pitchLines, 80, 42)}</text>
  <text x="80" y="580" font-family="Geist" font-weight="400" font-size="24" fill="${COLORS.text2}">${escapeXml(footer)}</text>
</svg>`;
}

export function renderSvg(svg, width) {
  const resvg = new Resvg(svg, {
    fitTo: width ? { mode: 'width', value: width } : { mode: 'original' },
    font: {
      fontFiles: FONT_FILES,
      loadSystemFonts: FONT_FILES.length === 0,
      defaultFontFamily: 'Geist',
      sansSerifFamily: 'Geist',
      serifFamily: 'Instrument Serif',
    },
    background: 'rgba(0,0,0,0)',
  });
  return resvg.render().asPng();
}

export async function writeOgImage(file, card) {
  await mkdir(path.dirname(file), { recursive: true });
  const png = renderSvg(ogSvg(card));
  await writeFile(file, png);
  return png.length;
}

/** ICO com entradas PNG (suportado por todos os navegadores atuais). */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  let offset = 6 + images.length * 16;
  for (const { size, png } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    entries.push(entry);
  }
  return Buffer.concat([header, ...entries, ...images.map(image => image.png)]);
}

/** favicon.ico, apple-touch-icon.png (opaco), icon-192.png e icon-512.png a partir do favicon.svg. */
export async function writeIcons({ faviconSvgPath, outDir, background = COLORS.bg }) {
  const source = await readFile(faviconSvgPath, 'utf8');
  const inner = source.replace(/<\?xml[^>]*>/, '').trim();
  // Versão opaca com respiro, para ícones que o sistema recorta (iOS, Android).
  const padded = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${background}"/>
  <svg x="64" y="64" width="384" height="384" viewBox="0 0 32 32">${inner.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</svg>
</svg>`;
  const written = {};
  const ico = buildIco([16, 32, 48].map(size => ({ size, png: renderSvg(inner, size) })));
  await writeFile(path.join(outDir, 'favicon.ico'), ico);
  written['favicon.ico'] = ico.length;
  for (const [name, size] of [['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
    const png = renderSvg(padded, size);
    await writeFile(path.join(outDir, name), png);
    written[name] = png.length;
  }
  return written;
}

export const hasEmbeddedFonts = () => FONT_FILES.length > 0;
