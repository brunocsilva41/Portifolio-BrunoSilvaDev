import { STRINGS } from './translations.js';

const LANG_KEY = 'portfolio-lang';

export function getLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'pt' || saved === 'en') return saved;
  } catch {}
  return (navigator.language || 'pt').toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

export function setLang(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {}
  location.reload();
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

export function initLangToggle() {
  const lang = getLang();
  document.querySelectorAll('.lang-toggle').forEach(toggle => {
    toggle.querySelectorAll('button[data-lang]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
      btn.addEventListener('click', () => {
        if (btn.dataset.lang !== lang) setLang(btn.dataset.lang);
      });
    });
  });
}
