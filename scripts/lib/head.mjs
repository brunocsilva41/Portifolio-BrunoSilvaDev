// Manipulação do DOM prerenderizado: <head> de SEO e reescrita de links internos.

// Fontes self-hosted (PERF) que valem preload; só entram se o arquivo existir em dist/fonts.
export const FONT_PRELOADS = ['/fonts/geist-latin-var.woff2', '/fonts/instrument-serif-latin-italic.woff2'];

const MANAGED_SELECTORS = [
  'title',
  'meta[name="description"]',
  'meta[name="robots"]',
  'meta[name="theme-color"]',
  'meta[name^="twitter:"]',
  'meta[property^="og:"]',
  'link[rel="canonical"]',
  'link[rel="alternate"][hreflang]',
  'link[rel="manifest"]',
  'link[rel="icon"]',
  'link[rel="shortcut icon"]',
  'link[rel="apple-touch-icon"]',
  'link[rel="preload"][as="font"]',
  'script[type="application/ld+json"]',
];

function node(document, tag, attrs) {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === true) element.setAttribute(key, '');
    else if (value !== undefined && value !== null && value !== false) element.setAttribute(key, String(value));
  }
  return element;
}

/** Tags gerenciadas pelo prerender, na ordem em que entram no <head>. */
export function headTags(document, { meta, ld, siteName, themeColor, fontPreloads = [], ogSize }) {
  const tags = [];
  const title = document.createElement('title');
  title.textContent = meta.title;
  tags.push(title);
  tags.push(node(document, 'meta', { name: 'description', content: meta.description }));
  tags.push(node(document, 'meta', { name: 'robots', content: meta.robots }));
  if (meta.canonical) tags.push(node(document, 'link', { rel: 'canonical', href: meta.canonical }));
  if (meta.alternates) {
    tags.push(node(document, 'link', { rel: 'alternate', hreflang: 'pt-BR', href: meta.alternates.pt }));
    tags.push(node(document, 'link', { rel: 'alternate', hreflang: 'en', href: meta.alternates.en }));
    tags.push(node(document, 'link', { rel: 'alternate', hreflang: 'x-default', href: meta.alternates.xDefault }));
  }
  tags.push(node(document, 'meta', { name: 'theme-color', content: themeColor }));
  for (const href of fontPreloads) {
    tags.push(node(document, 'link', { rel: 'preload', href, as: 'font', type: 'font/woff2', crossorigin: true }));
  }
  tags.push(node(document, 'link', { rel: 'icon', href: '/favicon.ico', sizes: '32x32' }));
  tags.push(node(document, 'link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }));
  tags.push(node(document, 'link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }));
  tags.push(node(document, 'link', { rel: 'manifest', href: '/site.webmanifest' }));

  const og = {
    'og:type': meta.ogType,
    'og:site_name': siteName,
    'og:locale': meta.ogLocale,
    'og:locale:alternate': meta.alternates ? meta.ogLocaleAlternate : null,
    'og:title': meta.title,
    'og:description': meta.description,
    'og:url': meta.canonical,
    'og:image': meta.ogImage,
    'og:image:type': 'image/png',
    'og:image:width': ogSize.width,
    'og:image:height': ogSize.height,
    'og:image:alt': meta.ogImageAlt,
  };
  for (const [property, content] of Object.entries(og)) {
    if (content) tags.push(node(document, 'meta', { property, content }));
  }
  const twitter = {
    'twitter:card': 'summary_large_image',
    'twitter:title': meta.title,
    'twitter:description': meta.description,
    'twitter:image': meta.ogImage,
    'twitter:image:alt': meta.ogImageAlt,
  };
  for (const [name, content] of Object.entries(twitter)) {
    if (content) tags.push(node(document, 'meta', { name, content }));
  }
  if (ld) {
    const script = node(document, 'script', { type: 'application/ld+json' });
    // "<" escapado para o JSON nunca fechar o <script>.
    script.textContent = JSON.stringify(ld).replace(/</g, '\\u003c');
    tags.push(script);
  }
  return tags;
}

/** Remove as tags gerenciadas e insere as novas logo após charset/viewport. */
export function applyHead(document, options) {
  const head = document.head;
  head.querySelectorAll(MANAGED_SELECTORS.join(',')).forEach(element => element.remove());
  const anchor = head.querySelector('meta[name="viewport"]') || head.querySelector('meta[charset]');
  const tags = headTags(document, options);
  const ref = anchor ? anchor.nextSibling : head.firstChild;
  for (const tag of tags) head.insertBefore(tag, ref);
  // Reindenta: um elemento por linha, sem as linhas vazias deixadas pelas tags removidas.
  [...head.childNodes].forEach(child => {
    if (child.nodeType === 3 && !child.textContent.trim()) child.remove();
  });
  [...head.children].forEach(child => head.insertBefore(document.createTextNode('\n    '), child));
  head.appendChild(document.createTextNode('\n  '));
}

/** Link legado → rota limpa (independe do idioma). resolveSlug canonicaliza aliases. */
export function normalizeLegacyHref(href, resolveSlug) {
  if (!href || !href.startsWith('/') || href.startsWith('//')) return href;
  let url;
  try { url = new URL(href, 'http://x'); } catch { return href; }
  let pathname = url.pathname;
  const search = new URLSearchParams(url.search);
  if (pathname === '/index.html') pathname = '/';
  else if (pathname === '/cases.html') pathname = '/cases';
  else if (pathname === '/space.html') pathname = '/space';
  else if (pathname === '/case.html' && search.get('slug')) {
    const slug = resolveSlug(search.get('slug')) || search.get('slug');
    pathname = '/cases/' + encodeURIComponent(slug);
    search.delete('slug');
  } else {
    return href;
  }
  const query = search.toString();
  return pathname + (query ? '?' + query : '') + url.hash;
}

/** Prefixa /en em links internos de página (exceto assets, /space, arquivos e âncoras puras). */
export function localizeHref(href, lang) {
  if (lang !== 'en' || !href || !href.startsWith('/') || href.startsWith('//')) return href;
  const match = /^([^?#]*)(.*)$/.exec(href);
  const pathname = match[1] || '/';
  const rest = match[2] || '';
  if (pathname === '/en' || pathname.startsWith('/en/')) return href;
  if (/^\/(assets|fonts|og|space)(\/|$)/.test(pathname)) return href;
  const last = pathname.split('/').pop();
  if (last.includes('.')) return href;
  return (pathname === '/' ? '/en' : '/en' + pathname) + rest;
}

export function rewriteLinks(document, { lang, resolveSlug }) {
  let changed = 0;
  document.querySelectorAll('a[href], area[href]').forEach(anchor => {
    const original = anchor.getAttribute('href');
    const next = localizeHref(normalizeLegacyHref(original, resolveSlug), lang);
    if (next !== original) {
      anchor.setAttribute('href', next);
      changed += 1;
    }
  });
  return changed;
}
