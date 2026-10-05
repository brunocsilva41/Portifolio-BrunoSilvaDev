import { STRINGS } from './translations.js';

const LANG_KEY = 'portfolio-lang';
const LANGS = ['pt', 'en'];

function currentPath() {
  try {
    return window.location.pathname || '/';
  } catch {
    return '/';
  }
}

function isEnglishPath(pathname) {
  return pathname === '/en' || pathname.startsWith('/en/');
}

/** The space view has no /en route: only there the remembered choice decides the language. */
function isSpacePath(pathname) {
  return pathname === '/space' || pathname === '/space.html' || pathname.startsWith('/space/');
}

function readSaved() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    return LANGS.includes(saved) ? saved : null;
  } catch {
    return null;
  }
}

function remember(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {}
}

/**
 * Language comes from the URL: `/en` and `/en/...` are English, everything else is Portuguese.
 * Exception: the space view (no /en route) falls back to the last remembered choice.
 */
export function getLang() {
  const pathname = currentPath();
  if (isEnglishPath(pathname)) return 'en';
  if (isSpacePath(pathname)) return readSaved() || 'pt';
  return 'pt';
}

/** Removes the `/en` prefix: `/en` → `/`, `/en/cases` → `/cases`. */
function stripLocale(pathname) {
  if (pathname === '/en') return '/';
  if (pathname.startsWith('/en/')) return pathname.slice(3) || '/';
  return pathname;
}

/** Paths that exist only once (assets, files, the space view) never get the `/en` prefix. */
function isUnlocalized(pathname) {
  return isSpacePath(pathname)
    || pathname.startsWith('/assets/')
    || pathname.startsWith('/fonts/')
    || /\.[a-z0-9]+$/i.test(pathname);
}

/**
 * Internal path in the given language (default: the current one).
 * `localePath('/')` → `/en`, `localePath('/cases/steuer')` → `/en/cases/steuer`, `localePath('/#cases')` → `/en#cases`.
 * External URLs, anchors, mailto/tel and file paths are returned unchanged.
 */
export function localePath(path, lang = getLang()) {
  const value = String(path ?? '/');
  if (!value.startsWith('/') || value.startsWith('//')) return value;
  const cut = value.search(/[?#]/);
  const pathname = cut >= 0 ? value.slice(0, cut) : value;
  const rest = cut >= 0 ? value.slice(cut) : '';
  const base = stripLocale(pathname);
  if (lang !== 'en' || isUnlocalized(base)) return base + rest;
  return (base === '/' ? '/en' : '/en' + base) + rest;
}

/** Clean path of the current page, also when it was opened through a legacy file URL. */
function cleanCurrentPath(params) {
  const base = stripLocale(currentPath());
  if (base === '/index.html') return '/';
  if (base === '/cases.html') return '/cases';
  if (base === '/case.html') {
    const slug = (params.get('slug') || '').trim();
    params.delete('slug');
    return slug ? '/cases/' + encodeURIComponent(slug) : '/cases';
  }
  return base;
}

/** Navigates to the same page in the other language (query and hash are kept). */
export function setLang(lang) {
  if (!LANGS.includes(lang)) return;
  remember(lang);
  if (isSpacePath(currentPath())) {
    location.reload();
    return;
  }
  const params = new URLSearchParams(location.search);
  const path = cleanCurrentPath(params);
  const query = params.toString();
  location.assign(localePath(path, lang) + (query ? '?' + query : '') + location.hash);
}

export function tr(value) {
  if (value && typeof value === 'object') {
    return value[getLang()] ?? value.pt ?? '';
  }
  return value ?? '';
}

export function ts(key) {
  const entry = STRINGS[key];
  return entry ? tr(entry) : key;
}

export function applyStaticTranslations() {
  const lang = getLang();
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  document.title = ts('meta.title');
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = ts(el.getAttribute('data-i18n'));
  });
}

// In memory only: an attribute would survive prerendering and skip the binding on the live page.
const boundToggles = new WeakSet();

/** Marks the active language and binds the toggle buttons once (safe to call again). */
export function initLangToggle() {
  const lang = getLang();
  if (!isSpacePath(currentPath())) remember(lang);
  document.querySelectorAll('.lang-toggle').forEach(toggle => {
    toggle.querySelectorAll('button[data-lang]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
      if (boundToggles.has(btn)) return;
      boundToggles.add(btn);
      btn.addEventListener('click', () => {
        if (btn.dataset.lang !== getLang()) setLang(btn.dataset.lang);
      });
    });
  });
}
