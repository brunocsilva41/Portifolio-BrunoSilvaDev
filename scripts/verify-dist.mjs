#!/usr/bin/env node
/*
 * Verificação de dist/ sem JavaScript (como um crawler): sobe o emulador da Vercel
 * (scripts/serve-dist.mjs) numa porta livre e confere rotas, redirects, head de SEO, JSON-LD,
 * sitemap, robots, llms e imagens OG. Exit 1 se algo falhar.
 *
 *   npm run build && npm run verify:dist
 */
import { Window } from 'happy-dom';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE_URL, pageMeta, pagePath } from '../src/config/seo.js';
import { CASES } from '../src/data/case-view-model.js';
import { PROFILE } from '../src/data/profile.js';
import { AI_BOTS } from './lib/text-files.mjs';
import { createVercelLikeServer } from './serve-dist.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const problems = [];
const check = (ok, message) => { if (!ok) problems.push(message); return ok; };

function parse(html, type = 'text/html') {
  const window = new Window();
  return new window.DOMParser().parseFromString(html, type);
}

function wordsWithoutJs(document) {
  const body = document.body.cloneNode(true);
  body.querySelectorAll('script, style, template, noscript').forEach(node => node.remove());
  const text = (body.textContent || '').replace(/\s+/g, ' ').trim();
  return text ? text.split(' ').length : 0;
}

const server = await createVercelLikeServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const get = (pathname, init) => fetch(origin + pathname, { redirect: 'manual', ...init });

const placeholderStrings = [
  ...CASES.flatMap(item => item.metrics.filter(metric => metric.placeholder).flatMap(metric => [
    `${metric.value.pt} ${metric.label.pt}`, `${metric.value.en} ${metric.label.en}`,
  ])),
  ...(PROFILE.credentials || []).filter(entry => entry.placeholder).flatMap(entry => [
    `${entry.value} ${entry.label.pt}`, `${entry.value} ${entry.label.en}`,
  ]),
];
const hasPlaceholder = text => placeholderStrings.find(value => text.includes(value));

try {
  /* ---------- páginas ---------- */
  const pages = [];
  for (const lang of ['pt', 'en']) {
    pages.push({ page: 'home', lang, minWords: 1500 });
    pages.push({ page: 'cases', lang, minWords: 300 });
    for (const item of CASES) pages.push({ page: 'case', lang, item, minWords: 1500 });
  }
  const rows = [];
  for (const entry of pages) {
    const meta = pageMeta(entry);
    const route = pagePath({ page: entry.page, lang: entry.lang, slug: entry.item?.slug });
    const res = await get(route);
    const html = await res.text();
    check(res.status === 200, `${route}: status ${res.status}`);
    const doc = parse(html);
    const head = doc.head;
    const attr = (selector, name) => head.querySelector(selector)?.getAttribute(name) || '';
    const title = head.querySelector('title')?.textContent || '';
    const description = attr('meta[name="description"]', 'content');
    check(title === meta.title, `${route}: title "${title}"`);
    check(description === meta.description, `${route}: description diferente do seo.js`);
    check(head.querySelectorAll('title').length === 1, `${route}: mais de um <title>`);
    check(head.querySelectorAll('meta[name="description"]').length === 1, `${route}: mais de uma description`);
    check(attr('link[rel="canonical"]', 'href') === meta.canonical, `${route}: canonical ${attr('link[rel="canonical"]', 'href')}`);
    check(attr('link[hreflang="pt-BR"]', 'href') === meta.alternates.pt, `${route}: hreflang pt-BR`);
    check(attr('link[hreflang="en"]', 'href') === meta.alternates.en, `${route}: hreflang en`);
    check(attr('link[hreflang="x-default"]', 'href') === meta.alternates.xDefault, `${route}: hreflang x-default`);
    check(attr('meta[name="robots"]', 'content').startsWith('index'), `${route}: robots ${attr('meta[name="robots"]', 'content')}`);
    check(attr('meta[property="og:image"]', 'content') === meta.ogImage, `${route}: og:image`);
    check(doc.documentElement.getAttribute('lang') === meta.htmlLang, `${route}: html lang ${doc.documentElement.getAttribute('lang')}`);
    const ldNodes = [...head.querySelectorAll('script[type="application/ld+json"]')];
    let ldTypes = '';
    check(ldNodes.length === 1, `${route}: ${ldNodes.length} blocos JSON-LD`);
    for (const node of ldNodes) {
      try {
        const data = JSON.parse(node.textContent);
        ldTypes = data['@graph'].map(n => n['@type']).join('+');
        const leak = hasPlaceholder(node.textContent);
        check(!leak, `${route}: JSON-LD contém métrica placeholder "${leak}"`);
      } catch (error) {
        check(false, `${route}: JSON-LD inválido (${error.message})`);
      }
    }
    check(!hasPlaceholder(description), `${route}: description com métrica placeholder`);
    const h1 = [...doc.querySelectorAll('h1')].filter(node => !node.closest('[hidden]') && node.textContent.trim());
    check(h1.length >= 1, `${route}: sem h1 visível`);
    const words = wordsWithoutJs(doc);
    check(words >= entry.minWords, `${route}: só ${words} palavras sem JS`);
    if (entry.lang === 'en') {
      const ptLinks = [...doc.querySelectorAll('a[href^="/"]')].map(a => a.getAttribute('href'))
        .filter(href => /^\/(cases(\/|$)|#|$)/.test(href));
      check(!ptLinks.length, `${route}: links internos sem /en: ${ptLinks.join(', ')}`);
    }
    rows.push([route, res.status, title.length, description.length, words, h1[0]?.textContent.trim().slice(0, 40) || '', ldTypes]);
  }

  /* ---------- redirects / 404 ---------- */
  const expectRedirect = async (from, status, to) => {
    const res = await get(from);
    const location = res.headers.get('location') || '';
    check(res.status === status && location.split('?')[0] === to, `${from}: esperado ${status} → ${to}, veio ${res.status} → ${location}`);
    return `${from} → ${res.status} ${location}`;
  };
  const redirects = [
    await expectRedirect('/case.html?slug=gestao-fiscal', 308, '/cases/steuer'),
    await expectRedirect('/case.html?slug=steuer', 308, '/cases/steuer'),
    await expectRedirect('/case.html?slug=prospeccao-comercial', 308, '/cases/leadspector'),
    await expectRedirect('/cases.html', 308, '/cases'),
    await expectRedirect('/index.html', 308, '/'),
    await expectRedirect('/en/', 308, '/en'),
    await expectRedirect('/space.html', 308, '/space'),
    await expectRedirect('/case.html?slug=inexistente', 308, '/case'),
  ];
  {
    const res = await get('/case?slug=inexistente');
    const doc = parse(await res.text());
    check(res.status === 200 && doc.querySelector('meta[name="robots"]')?.getAttribute('content').startsWith('noindex'),
      `/case?slug=inexistente: status ${res.status}, robots noindex esperado`);
    redirects.push(`/case?slug=inexistente → ${res.status} (página 404 prerenderizada, noindex)`);
  }
  {
    const res = await get('/pagina-que-nao-existe');
    const doc = parse(await res.text());
    check(res.status === 404, `/pagina-que-nao-existe: status ${res.status}`);
    check(doc.querySelector('meta[name="robots"]')?.getAttribute('content').startsWith('noindex'), '404.html sem noindex');
    check(!doc.querySelector('link[rel="canonical"]'), '404.html com canonical');
    redirects.push(`/pagina-que-nao-existe → ${res.status} (404.html, noindex)`);
  }
  {
    const res = await get('/space');
    const doc = parse(await res.text());
    check(res.status === 200, `/space: status ${res.status}`);
    check((doc.querySelector('meta[name="robots"]')?.getAttribute('content') || '').startsWith('noindex'), '/space sem noindex');
  }
  {
    const res = await get('/assets/');
    void res;
    const asset = (await readFile(path.join(DIST, 'index.html'), 'utf8')).match(/\/assets\/[^"]+\.js/)?.[0];
    const assetRes = await get(asset);
    check(/immutable/.test(assetRes.headers.get('cache-control') || ''), `${asset}: sem cache immutable`);
    check(assetRes.headers.get('x-content-type-options') === 'nosniff', `${asset}: sem nosniff`);
  }

  /* ---------- sitemap / robots / llms ---------- */
  const sitemapRes = await get('/sitemap.xml');
  const sitemapText = await sitemapRes.text();
  const sitemap = parse(sitemapText, 'application/xml');
  check(!sitemap.querySelector('parsererror'), 'sitemap.xml mal formado');
  const locs = [...sitemap.getElementsByTagName('loc')].map(node => node.textContent);
  const expected = pages.map(entry => pageMeta(entry).canonical);
  check(locs.length === 12, `sitemap.xml: ${locs.length} URLs`);
  check(expected.every(url => locs.includes(url)), 'sitemap.xml não lista todas as canônicas');
  check(sitemap.getElementsByTagName('xhtml:link').length === 36, `sitemap.xml: ${sitemap.getElementsByTagName('xhtml:link').length} alternates (esperado 36)`);

  const robots = await (await get('/robots.txt')).text();
  check(robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`), 'robots.txt sem Sitemap');
  for (const bot of AI_BOTS) check(robots.includes(`User-agent: ${bot}\n`), `robots.txt sem ${bot}`);
  check(robots.includes('Disallow: /case.html'), 'robots.txt sem Disallow /case.html');

  const llmsRes = await get('/llms.txt');
  const llms = await llmsRes.text();
  const llmsFull = await (await get('/llms-full.txt')).text();
  check(llmsRes.status === 200 && llms.startsWith('# '), 'llms.txt ausente');
  check(llmsFull.length > 20000, `llms-full.txt curto (${llmsFull.length})`);
  for (const [name, text] of [['llms.txt', llms], ['llms-full.txt', llmsFull]]) {
    const leak = hasPlaceholder(text);
    check(!leak, `${name} contém métrica placeholder "${leak}"`);
    check(!/\bundefined\b|\[object Object\]|\bNaN\b/.test(text), `${name} contém undefined/NaN/[object Object]`);
  }

  /* ---------- imagens ---------- */
  const pngSize = buffer => ({ ok: buffer.subarray(1, 4).toString() === 'PNG', width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) });
  const images = ['/og/default.png', '/og/default-en.png', ...CASES.flatMap(item => [`/og/${item.slug}.png`, `/og/${item.slug}-en.png`])];
  for (const image of images) {
    const res = await get(image);
    const info = pngSize(Buffer.from(await res.arrayBuffer()));
    check(res.status === 200 && info.ok && info.width === 1200 && info.height === 630, `${image}: ${res.status} ${info.width}×${info.height}`);
  }
  for (const [icon, size] of [['/apple-touch-icon.png', 180], ['/icon-192.png', 192], ['/icon-512.png', 512]]) {
    const res = await get(icon);
    const info = pngSize(Buffer.from(await res.arrayBuffer()));
    check(res.status === 200 && info.width === size, `${icon}: ${res.status} ${info.width}`);
  }
  check((await get('/favicon.ico')).status === 200, 'favicon.ico ausente');
  const manifest = await get('/site.webmanifest');
  try { JSON.parse(await manifest.text()); } catch { check(false, 'site.webmanifest inválido'); }

  /* ---------- relatório ---------- */
  console.log(`\nverify-dist · ${origin} · SITE_URL=${SITE_URL}\n`);
  console.log('rota                      status título desc palavras(sem JS)  h1 · JSON-LD');
  for (const [route, status, t, d, w, h1, ld] of rows) {
    console.log(`${route.padEnd(26)}${String(status).padEnd(7)}${String(t).padStart(6)}${String(d).padStart(5)}${String(w).padStart(17)}  ${h1} · ${ld}`);
  }
  console.log('\nredirects / 404:');
  for (const line of redirects) console.log('  ' + line);
  console.log(`\nsitemap: ${locs.length} URLs · robots: ${AI_BOTS.length} bots · llms.txt ${llms.length} B · llms-full.txt ${llmsFull.length} B · OG ${images.length}`);
} finally {
  server.close();
}

if (problems.length) {
  console.error(`\nverify-dist FALHOU (${problems.length}):`);
  for (const problem of problems) console.error('  - ' + problem);
  process.exitCode = 1;
} else {
  console.log('\nverify-dist ok');
}
