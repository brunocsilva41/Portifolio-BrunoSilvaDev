#!/usr/bin/env node
/*
 * Prerender estático do portfólio (roda depois de `vite build`).
 *
 *   npm run build                      → vite build && node scripts/prerender.mjs
 *   SITE_URL=https://meu.dominio npm run build   → canonical/og/sitemap com outro domínio
 *
 * Para cada rota (PT e EN) carrega o template construído em dist/ num navegador happy-dom
 * (JS ligado, prefers-reduced-motion: reduce, sem rede externa), espera o render, injeta o <head>
 * de SEO e grava o HTML final. Gera também 404.html, sitemap.xml, robots.txt, llms.txt,
 * llms-full.txt, imagens Open Graph e ícones.
 *
 * Falha (exit 1) se alguma página registrar erro de JS, renderizar "undefined"/"NaN"/
 * "[object Object]", não tiver h1 visível, tiver ids duplicados ou não renderizar o conteúdo
 * esperado (ex.: título do case).
 */
import { Browser, VirtualConsoleLogLevelEnum } from 'happy-dom';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  SITE_URL, SITE_NAME, THEME_COLOR, OG_SIZE, HTML_LANG,
  pageMeta, jsonLd, pagePath, absoluteUrl, SERVICE_TEXT,
} from '../src/config/seo.js';
import { CASES, CASE_CATEGORIES, getCaseBySlug } from '../src/data/case-view-model.js';
import { PROFILE } from '../src/data/profile.js';
import { EXPERIENCE, EDUCATION } from '../src/data/experience.js';

import { buildRoutes } from './lib/routes.mjs';
import { startPrerenderServer } from './lib/static-server.mjs';
import { applyHead, rewriteLinks, FONT_PRELOADS } from './lib/head.mjs';
import { writeOgImage, writeIcons, hasEmbeddedFonts } from './lib/og.mjs';
import { sitemapXml, robotsTxt, llmsTxt, llmsFullTxt } from './lib/text-files.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const RENDER_TIMEOUT_MS = 10000;
const BAD_TEXT = /\bundefined\b|\bNaN\b|\[object Object\]/;

const failures = [];
const fail = (route, message) => failures.push(`${route}: ${message}`);

function buildDate() {
  const epoch = Number(process.env.SOURCE_DATE_EPOCH);
  const date = Number.isFinite(epoch) && epoch > 0 ? new Date(epoch * 1000) : new Date();
  return date.toISOString().slice(0, 10);
}

/* ---------- pré-condições ---------- */

async function readTemplates() {
  const templates = {};
  for (const name of ['index.html', 'cases.html', 'case.html', 'space.html']) {
    const file = path.join(DIST, name);
    if (!existsSync(file)) throw new Error(`dist/${name} não existe — rode "vite build" antes do prerender.`);
    const html = await readFile(file, 'utf8');
    if (/data-prerendered=/.test(html)) {
      throw new Error(`dist/${name} já foi prerenderizado — rode "vite build" de novo (use "npm run build").`);
    }
    templates[name] = html;
  }
  return templates;
}

async function checkVercelRedirects() {
  const file = path.join(ROOT, 'vercel.json');
  const config = JSON.parse(await readFile(file, 'utf8'));
  const redirects = Array.isArray(config.redirects) ? config.redirects : [];
  for (const item of CASES) {
    for (const value of [item.slug, ...item.aliases]) {
      for (const source of ['/case.html', '/case']) {
        const found = redirects.some(rule => rule.source === source
          && rule.destination === pagePath({ page: 'case', lang: 'pt', slug: item.slug })
          && rule.permanent === true
          && (rule.has || []).some(cond => cond.type === 'query' && cond.key === 'slug' && cond.value === value));
        if (!found) fail('vercel.json', `falta redirect ${source}?slug=${value} → /cases/${item.slug}`);
      }
    }
  }
}

/* ---------- render ---------- */

function newBrowser(lang) {
  const language = HTML_LANG[lang];
  return new Browser({
    settings: {
      enableJavaScriptEvaluation: true,
      suppressInsecureJavaScriptEnvironmentWarning: true,
      disableCSSFileLoading: false,
      enableImageFileLoading: false,
      errorCapture: 'tryAndCatch',
      device: { prefersReducedMotion: 'reduce', prefersColorScheme: 'dark' },
      viewport: { width: 1440, height: 900, devicePixelRatio: 1 },
      timer: { maxTimeout: 2500, preventTimerLoops: true },
      navigation: {
        // Runtime antigo decide o idioma por navigator.language; o novo, pelo pathname.
        beforeContentCallback: window => {
          for (const [key, value] of [['language', language], ['languages', [language, lang]]]) {
            try { Object.defineProperty(window.navigator, key, { configurable: true, get: () => value }); } catch { /* noop */ }
          }
          window.__prerenderErrors = [];
          window.addEventListener('error', event => {
            window.__prerenderErrors.push(String(event?.error?.stack || event?.message || event));
          });
          window.addEventListener('unhandledrejection', event => {
            window.__prerenderErrors.push('unhandledrejection: ' + String(event?.reason?.stack || event?.reason));
          });
        },
      },
      fetch: {
        interceptor: {
          // Só o servidor local; qualquer outra origem (Google Fonts, APIs) recebe resposta vazia.
          beforeAsyncRequest: async ({ request, window }) => {
            if (new URL(request.url).origin !== window.location.origin) {
              return new window.Response('', { status: 204 });
            }
            return undefined;
          },
          beforeSyncRequest: ({ request, window }) => {
            if (new URL(request.url).origin !== window.location.origin) {
              return { status: 204, statusText: 'No Content', ok: true, url: request.url, redirected: false, headers: new window.Headers(), body: Buffer.alloc(0) };
            }
            return undefined;
          },
        },
      },
    },
  });
}

function visibleText(document) {
  const clone = document.body.cloneNode(true);
  clone.querySelectorAll('script, style, template, noscript').forEach(node => node.remove());
  return (clone.textContent || '').replace(/\s+/g, ' ').trim();
}

function validate(route, document, errors) {
  const label = route.path;
  for (const error of new Set(errors.map(entry => entry.split('\n')[0].trim()))) fail(label, `erro de JS: ${error}`);

  const text = visibleText(document);
  const bad = BAD_TEXT.exec(text);
  if (bad) {
    const at = Math.max(0, bad.index - 60);
    fail(label, `texto inválido "${bad[0]}" em: …${text.slice(at, bad.index + 40)}…`);
  }
  document.querySelectorAll('*').forEach(element => {
    if (element.tagName === 'SCRIPT') return;
    for (const attr of element.attributes) {
      if (BAD_TEXT.test(attr.value)) fail(label, `atributo ${element.tagName.toLowerCase()}[${attr.name}="${attr.value}"]`);
    }
  });
  const ids = new Map();
  document.querySelectorAll('[id]').forEach(element => ids.set(element.id, (ids.get(element.id) || 0) + 1));
  const dupes = [...ids].filter(([, count]) => count > 1).map(([id, count]) => `${id}×${count}`);
  if (dupes.length) fail(label, `ids duplicados: ${dupes.join(', ')}`);

  const h1s = [...document.querySelectorAll('h1')].filter(h1 => !h1.closest('[hidden]') && h1.textContent.trim());
  if (!h1s.length) fail(label, 'sem h1 visível');

  if (route.page === 'case') {
    const title = document.getElementById('case-title')?.textContent.trim();
    const expected = route.item.title[route.lang];
    if (title !== expected) fail(label, `h1 do case "${title}" ≠ "${expected}" (slug não renderizado?)`);
    if (document.getElementById('case-article')?.hidden) fail(label, 'artigo do case oculto');
  }
  if (route.page === 'notfound' && document.getElementById('case-error')?.hidden) fail(label, 'estado de erro não renderizado');
  if (route.page === 'home' && !document.querySelector('#case-list a[href]')) fail(label, 'lista de cases da home vazia');
  if (route.page === 'cases' && !document.querySelector('#cases-list a[href]')) fail(label, 'índice de cases vazio');

  const words = text ? text.split(' ').length : 0;
  return { words, h1: h1s[0]?.textContent.replace(/\s+/g, ' ').trim() || '' };
}

async function renderRoute(origin, route, fontPreloads) {
  const browser = newBrowser(route.lang);
  try {
    const page = browser.newPage();
    await page.goto(origin + route.loadPath);
    let timedOut = false;
    await Promise.race([
      page.waitUntilComplete(),
      new Promise(resolve => setTimeout(() => { timedOut = true; resolve(); }, RENDER_TIMEOUT_MS)),
    ]);
    const window = page.mainFrame.window;
    const { document } = window;

    const consoleErrors = page.virtualConsolePrinter.readAsString(VirtualConsoleLogLevelEnum.error).trim();
    const errors = [...(window.__prerenderErrors || [])];
    // Cada erro do console traz o stack em várias linhas indentadas; uma linha sem indentação abre um erro.
    if (consoleErrors) errors.push(...consoleErrors.split(/\n(?=\S)/).filter(Boolean));
    if (timedOut) console.warn(`  aviso: ${route.path} não sinalizou fim em ${RENDER_TIMEOUT_MS} ms; serializando o estado atual.`);

    const meta = pageMeta({ page: route.page, lang: route.lang, item: route.item });
    const ld = route.page === 'notfound' ? null : jsonLd({ page: route.page, lang: route.lang, item: route.item, cases: CASES });

    document.documentElement.setAttribute('lang', meta.htmlLang);
    document.documentElement.setAttribute('data-prerendered', route.lang);
    rewriteLinks(document, { lang: route.lang, resolveSlug: slug => getCaseBySlug(slug)?.slug });
    applyHead(document, { meta, ld, siteName: SITE_NAME, themeColor: THEME_COLOR, fontPreloads, ogSize: OG_SIZE });

    const stats = validate(route, document, errors);
    const html = '<!doctype html>\n' + document.documentElement.outerHTML + '\n';
    return { html, meta, ld, ...stats };
  } finally {
    await browser.close();
  }
}

/* ---------- space.html: só head (WebGL não roda no happy-dom) ---------- */

async function finishSpace(template) {
  const browser = new Browser({ settings: { enableJavaScriptEvaluation: false, disableJavaScriptFileLoading: true, disableCSSFileLoading: true } });
  try {
    const page = browser.newPage();
    page.content = template;
    const { document } = page.mainFrame;
    const head = document.head;
    const add = (selector, tag, attrs) => {
      if (head.querySelector(selector)) return;
      const element = document.createElement(tag);
      for (const [key, value] of Object.entries(attrs)) element.setAttribute(key, value);
      head.appendChild(element);
    };
    add('meta[name="robots"]', 'meta', { name: 'robots', content: 'noindex,follow' });
    add('meta[name="theme-color"]', 'meta', { name: 'theme-color', content: THEME_COLOR });
    add('link[rel="icon"][href="/favicon.ico"]', 'link', { rel: 'icon', href: '/favicon.ico', sizes: '32x32' });
    add('link[rel="apple-touch-icon"]', 'link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' });
    add('link[rel="manifest"]', 'link', { rel: 'manifest', href: '/site.webmanifest' });
    return '<!doctype html>\n' + document.documentElement.outerHTML + '\n';
  } finally {
    await browser.close();
  }
}

/* ---------- main ---------- */

const pad = (value, size) => String(value).padEnd(size);
const padStart = (value, size) => String(value).padStart(size);

async function main() {
  const started = Date.now();
  console.log(`\nprerender · SITE_URL=${SITE_URL}`);
  const templates = await readTemplates();
  await checkVercelRedirects();

  const fontPreloads = FONT_PRELOADS.filter(href => existsSync(path.join(DIST, href)));
  const missingFonts = FONT_PRELOADS.filter(href => !fontPreloads.includes(href));
  if (missingFonts.length) console.warn(`  aviso: fontes ausentes em dist (sem preload): ${missingFonts.join(', ')}`);

  const routes = buildRoutes({ cases: CASES, pagePath });
  const server = await startPrerenderServer({ root: DIST, templates });
  const results = [];
  try {
    for (const route of routes) {
      const result = await renderRoute(server.origin, route, fontPreloads);
      results.push({ route, ...result });
    }
  } finally {
    await server.close();
  }

  // Gravação só depois de todos os renders (os templates originais estão em memória).
  for (const { route, html } of results) {
    const file = path.join(DIST, route.out);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, html);
  }
  // /case.html sem slug válido (os válidos são redirecionados pela Vercel) mostra a página 404, noindex.
  const notFound = results.find(result => result.route.page === 'notfound');
  if (notFound) await writeFile(path.join(DIST, 'case.html'), notFound.html);
  await writeFile(path.join(DIST, 'space.html'), await finishSpace(templates['space.html']));

  // Open Graph: padrão + um por case, nos dois idiomas.
  const ogDir = path.join(DIST, 'og');
  const og = [];
  for (const lang of ['pt', 'en']) {
    const suffix = lang === 'en' ? '-en' : '';
    og.push([`default${suffix}.png`, {
      eyebrow: `${PROFILE.role[lang]} · São Paulo`,
      title: PROFILE.headline[lang],
      pitch: lang === 'pt' ? 'Integração ERP, automação fiscal, segurança do trabalho e IA aplicada.' : 'ERP integration, tax automation, workplace safety and applied AI.',
      footer: SITE_URL.replace(/^https?:\/\//, ''),
      accent: 'neutral',
    }]);
    for (const item of CASES) {
      og.push([`${item.slug}${suffix}.png`, {
        eyebrow: `Case ${item.number} · ${CASE_CATEGORIES[item.category]?.[lang] || ''}`,
        title: item.title[lang],
        pitch: item.pitch[lang] || item.preview.summary[lang],
        footer: `${PROFILE.name} · ${PROFILE.role[lang]}`,
        accent: item.accent,
      }]);
    }
  }
  if (!hasEmbeddedFonts()) console.warn('  aviso: scripts/assets/fonts sem TTF; OG usa fontes do sistema.');
  for (const [name, card] of og) await writeOgImage(path.join(ogDir, name), card);

  const icons = await writeIcons({ faviconSvgPath: path.join(DIST, 'favicon.svg'), outDir: DIST });

  // sitemap, robots, llms.
  const indexable = results.filter(result => result.route.indexable);
  await writeFile(path.join(DIST, 'sitemap.xml'), sitemapXml(indexable.map(result => ({
    loc: result.meta.canonical,
    alternates: result.meta.alternates,
  })), buildDate()));
  await writeFile(path.join(DIST, 'robots.txt'), robotsTxt(SITE_URL));

  const metaIndex = { home: {}, cases: {}, case: {} };
  for (const lang of ['pt', 'en']) {
    metaIndex.home[lang] = pageMeta({ page: 'home', lang });
    metaIndex.cases[lang] = pageMeta({ page: 'cases', lang });
    for (const item of CASES) {
      metaIndex.case[item.slug] ??= {};
      metaIndex.case[item.slug][lang] = pageMeta({ page: 'case', lang, item });
    }
  }
  const url = ({ page, lang, slug, file }) => (file ? SITE_URL + file : absoluteUrl(pagePath({ page, lang, slug })));
  await writeFile(path.join(DIST, 'llms.txt'), llmsTxt({ profile: PROFILE, cases: CASES, meta: metaIndex, url, serviceText: SERVICE_TEXT }));
  await writeFile(path.join(DIST, 'llms-full.txt'), llmsFullTxt({
    profile: PROFILE, experience: EXPERIENCE, education: EDUCATION, cases: CASES, categories: CASE_CATEGORIES, meta: metaIndex, url, serviceText: SERVICE_TEXT,
  }));

  // Resumo.
  console.log('');
  console.log(`${pad('rota', 26)} ${pad('arquivo', 24)} ${padStart('título', 6)} ${padStart('desc', 5)} ${padStart('palavras', 8)}  h1`);
  for (const { route, meta, words, h1 } of results) {
    console.log(`${pad(route.path, 26)} ${pad(route.out, 24)} ${padStart(meta.title.length, 6)} ${padStart(meta.description.length, 5)} ${padStart(words, 8)}  ${h1.slice(0, 60)}`);
  }
  console.log(`\nOG: ${og.length} imagens em dist/og · ícones: ${Object.keys(icons).join(', ')}`);
  console.log(`sitemap.xml: ${indexable.length} URLs · robots.txt · llms.txt · llms-full.txt · 404.html`);
  console.log(`tempo: ${((Date.now() - started) / 1000).toFixed(1)} s`);

  if (failures.length) {
    console.error(`\nprerender FALHOU (${failures.length}):`);
    for (const message of failures) console.error('  - ' + message);
    process.exitCode = 1;
    return;
  }
  console.log('prerender ok\n');
}

main().catch(error => {
  console.error('\nprerender FALHOU:', error?.stack || error);
  process.exitCode = 1;
});
