// Servidor HTTP mínimo sobre dist/ usado pelo prerender. Rotas limpas devolvem o template
// original (lido em memória antes de o prerender sobrescrever dist/); o resto é arquivo estático.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { templateForPath } from './routes.mjs';

export const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

export function mimeFor(file) {
  return MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
}

/** Resolve um pathname dentro de root sem permitir sair dele. */
export function safeJoin(root, pathname) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { return null; }
  const target = path.normalize(path.join(root, decoded));
  const rel = path.relative(root, target);
  if (rel.startsWith('..') || path.isAbsolute(rel)) return null;
  return target;
}

/**
 * @param {{ root: string, templates: Record<string, string> }} options
 *   templates: conteúdo HTML original por nome de template (index.html, cases.html, case.html...).
 */
export function startPrerenderServer({ root, templates }) {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const template = templateForPath(url.pathname) || (url.pathname === '/' ? 'index.html' : null);
    if (template && templates[template]) {
      res.writeHead(200, { 'content-type': MIME['.html'] });
      res.end(templates[template]);
      return;
    }
    const file = safeJoin(root, url.pathname);
    if (!file) {
      res.writeHead(400);
      res.end();
      return;
    }
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': mimeFor(file) });
      res.end(body);
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('not found');
    }
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({
        origin: `http://127.0.0.1:${port}`,
        close: () => new Promise(done => server.close(() => done())),
      });
    });
  });
}
