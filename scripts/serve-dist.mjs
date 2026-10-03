#!/usr/bin/env node
/*
 * Servidor local de dist/ que emula o roteamento estático da Vercel definido em vercel.json:
 * redirects (com condição `has` de query), trailingSlash: false, cleanUrls: true, headers e
 * 404.html. Serve só para checagens locais — o comportamento real da Vercel pode diferir em
 * detalhes (ex.: repasse da query string em redirects).
 *
 *   npm run serve:dist              → http://127.0.0.1:4173
 *   node scripts/serve-dist.mjs --port 5000
 */
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { mimeFor, safeJoin } from './lib/static-server.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function isFile(file) {
  try { return (await stat(file)).isFile(); } catch { return false; }
}

// Padrão de source da Vercel ("/assets/(.*)", "/case.html") → RegExp ancorada.
function sourceToRegExp(source) {
  const escaped = source.split('(.*)').map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('(.*)');
  return new RegExp('^' + escaped + '$');
}

function matchesHas(rule, url) {
  return (rule.has || []).every(cond => {
    if (cond.type !== 'query') return false;
    const value = url.searchParams.get(cond.key);
    return value !== null && (cond.value === undefined || cond.value === value);
  });
}

export async function createVercelLikeServer({ root = path.join(ROOT, 'dist'), configPath = path.join(ROOT, 'vercel.json') } = {}) {
  const config = JSON.parse(await readFile(configPath, 'utf8'));
  const redirects = (config.redirects || []).map(rule => ({ ...rule, re: sourceToRegExp(rule.source) }));
  const headerRules = (config.headers || []).map(rule => ({ ...rule, re: sourceToRegExp(rule.source) }));

  const redirect = (res, status, location, extra) => {
    res.writeHead(status, { location, ...extra });
    res.end();
  };

  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let pathname = url.pathname;
    const extraHeaders = {};
    for (const rule of headerRules) {
      if (rule.re.test(pathname)) for (const { key, value } of rule.headers) extraHeaders[key] = value;
    }

    // 1. redirects do vercel.json (a query original é repassada — pior caso; ver cabeçalho).
    for (const rule of redirects) {
      if (rule.re.test(pathname) && matchesHas(rule, url)) {
        const status = rule.statusCode || (rule.permanent ? 308 : 307);
        redirect(res, status, rule.destination + url.search, extraHeaders);
        return;
      }
    }
    // 2. trailingSlash: false
    if (config.trailingSlash === false && pathname.length > 1 && pathname.endsWith('/')) {
      redirect(res, 308, pathname.replace(/\/+$/, '') + url.search, extraHeaders);
      return;
    }
    // 3. cleanUrls: /x.html → /x, /x/index.html → /x
    if (config.cleanUrls && pathname.endsWith('.html')) {
      const clean = pathname.replace(/\/index\.html$/, '').replace(/\.html$/, '') || '/';
      redirect(res, 308, clean + url.search, extraHeaders);
      return;
    }
    // 4. filesystem
    const candidates = [];
    if (pathname === '/') candidates.push('/index.html');
    else {
      candidates.push(pathname);
      if (config.cleanUrls) candidates.push(pathname + '.html', pathname + '/index.html');
    }
    for (const candidate of candidates) {
      const file = safeJoin(root, candidate);
      if (file && await isFile(file)) {
        const body = await readFile(file);
        res.writeHead(200, { 'content-type': mimeFor(file), ...extraHeaders });
        res.end(req.method === 'HEAD' ? undefined : body);
        return;
      }
    }
    // 5. 404.html
    const notFound = path.join(root, '404.html');
    const body = await isFile(notFound) ? await readFile(notFound) : Buffer.from('not found');
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8', ...extraHeaders });
    res.end(req.method === 'HEAD' ? undefined : body);
  });
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const index = process.argv.indexOf('--port');
  const port = index > -1 ? Number(process.argv[index + 1]) : 4173;
  const server = await createVercelLikeServer();
  server.listen(port, '127.0.0.1', () => console.log(`dist em http://127.0.0.1:${port} (emulação Vercel: cleanUrls, redirects, 404)`));
}
