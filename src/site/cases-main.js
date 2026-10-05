import * as caseModel from '../data/case-view-model.js';
import {
  CASES,
  CASE_CATEGORIES,
  CASE_DOMAINS,
  caseTechnologyText,
  caseText,
  caseUrl,
  metricStatusText,
} from '../data/case-view-model.js';
import { pageMeta } from '../config/seo.js';
import { getLang, localePath } from '../i18n/i18n.js';
import { applyPageMeta, initShell } from './shell.js';
import { renderFlowPreview } from './flow-preview.js';

/* profile.js is optional: the glob resolves to {} while the file does not exist. */
const profileModules = import.meta.glob('../data/profile.js', { eager: true });
const PROFILE = Object.values(profileModules)[0]?.PROFILE || null;

const COPY = {
  pt: {
    shellLabel: 'Cases',
    skip: 'Pular para o conteúdo',
    navMenu: 'Menu', navAria: 'Navegação principal', langAria: 'Idioma',
    navCases: 'Cases', navDepth: 'Profundidade', navHire: 'Como trabalho', navTrajectory: 'Trajetória', navContact: 'Contato', navSpace: 'Visão espacial',
    railWork: 'Trabalho', railIndex: 'Índice', railContact: 'Contato',
    eyebrow: 'Cases · em produção',
    headline: 'Sistemas que sustentam a operação de empresas.',
    intro: 'Integração fiscal com ERP, segurança do trabalho com app de campo, prospecção comercial com IA e a operação de uma academia com duas unidades. São sistemas que construí para empresas e que rodam em produção. Cada estudo mostra o problema de negócio, como a solução funciona por dentro e o impacto que ela trouxe.',
    facts: {
      cases: n => (n === 1 ? 'sistema em produção' : 'sistemas em produção'),
      domains: n => (n === 1 ? 'domínio de negócio' : 'domínios de negócio'),
      tech: n => (n === 1 ? 'tecnologia no stack' : 'tecnologias no stack'),
    },
    factsAria: 'O trabalho em números',
    browseTitle: 'Escolha pelo problema.',
    browseIntro: 'Filtre por área, domínio ou tecnologia e abra o estudo completo de cada sistema.',
    filtersAria: 'Busca e filtros',
    categoryLabel: 'Categoria', allCategories: 'Todos',
    searchLabel: 'Buscar', searchPlaceholder: 'Problema, cliente, papel ou tecnologia',
    domainLabel: 'Domínio', allDomains: 'Todos os domínios',
    techLabel: 'Tecnologia', allTech: 'Todas as tecnologias',
    count: (shown, total) => (shown === total
      ? `${total} ${total === 1 ? 'case' : 'cases'}`
      : `${shown} de ${total} ${total === 1 ? 'case' : 'cases'}`),
    cta: 'Ver estudo de caso',
    previewCaption: number => `${number} · fluxo do sistema`,
    peekMetrics: 'Impacto',
    emptyTitle: 'Nada corresponde a essa combinação.',
    emptyText: 'Tente outro termo ou remova algum filtro. A busca olha título, proposta, cliente, papel, domínios e tecnologias.',
    clear: 'Limpar filtros',
    closingLabel: 'Contato',
    closing: 'Tem um sistema para construir ou destravar?',
    closingText: 'Me conte o problema ou a ideia, do jeito que ela estiver. Eu volto com um caminho técnico claro e o primeiro passo para colocar no ar.',
    closingSubject: 'Um sistema para conversar',
    closingAction: 'Escrever um e-mail',
    footerNote: '© 2026 Bruno Silva · BC Consultoria e Desenvolvimento de Softwares · CNPJ 60.589.106/0001-02',
  },
  en: {
    shellLabel: 'Cases',
    skip: 'Skip to content',
    navMenu: 'Menu', navAria: 'Main navigation', langAria: 'Language',
    navCases: 'Cases', navDepth: 'Depth', navHire: 'How I work', navTrajectory: 'Career', navContact: 'Contact', navSpace: 'Space view',
    railWork: 'Work', railIndex: 'Index', railContact: 'Contact',
    eyebrow: 'Cases · in production',
    headline: 'Systems that keep businesses running.',
    intro: 'Tax integration with an ERP, workplace-safety operations with a field app, AI-driven sales prospecting and a two-location gym’s operation. These are systems I built for companies, running in production. Each study covers the business problem, how the solution works inside and the impact it delivered.',
    facts: {
      cases: n => (n === 1 ? 'system in production' : 'systems in production'),
      domains: n => (n === 1 ? 'business domain' : 'business domains'),
      tech: n => (n === 1 ? 'technology in the stack' : 'technologies in the stack'),
    },
    factsAria: 'The work in numbers',
    browseTitle: 'Pick by problem.',
    browseIntro: 'Filter by area, domain or technology and open the full study of each system.',
    filtersAria: 'Search and filters',
    categoryLabel: 'Category', allCategories: 'All',
    searchLabel: 'Search', searchPlaceholder: 'Problem, client, role or technology',
    domainLabel: 'Domain', allDomains: 'All domains',
    techLabel: 'Technology', allTech: 'All technologies',
    count: (shown, total) => (shown === total
      ? `${total} ${total === 1 ? 'case' : 'cases'}`
      : `${shown} of ${total} ${total === 1 ? 'case' : 'cases'}`),
    cta: 'Read the case study',
    previewCaption: number => `${number} · system flow`,
    peekMetrics: 'Impact',
    emptyTitle: 'Nothing matches that combination.',
    emptyText: 'Try a different term or drop a filter. Search looks at title, pitch, client, role, domains and technologies.',
    clear: 'Clear filters',
    closingLabel: 'Contact',
    closing: 'Got a system to build or unblock?',
    closingText: 'Tell me the problem or the idea, however rough it is. I’ll come back with a clear technical path and the first step to get it live.',
    closingSubject: 'A system to talk about',
    closingAction: 'Send an email',
    footerNote: '© 2026 Bruno Silva · BC Consultoria e Desenvolvimento de Softwares · CNPJ 60.589.106/0001-02',
  },
};

const lang = getLang();
const copy = COPY[lang] || COPY.pt;
const byId = id => document.getElementById(id);
const desktopPreview = window.matchMedia('(min-width: 1100px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const els = {
  facts: byId('cases-facts'),
  tabs: byId('cases-tabs'),
  search: byId('cases-search'),
  domain: byId('cases-domain'),
  tech: byId('cases-tech'),
  count: byId('cases-count'),
  list: byId('cases-list'),
  empty: byId('cases-empty'),
  clear: byId('cases-clear'),
  preview: byId('cases-preview'),
  previewCaption: byId('cases-preview-caption'),
  peekBody: byId('cases-peek-body'),
  engagements: byId('closing-engagements'),
  closingText: byId('closing-text'),
};

const state = { q: '', cat: '', domain: '', tech: '' };

/* ---------- Data helpers (guarded: new schema fields may be absent) ---------- */

const SHOW_ILLUSTRATIVE = caseModel.SHOW_ILLUSTRATIVE_METRICS !== false;

function visibleMetrics(item) {
  return (item.metrics || []).filter(metric => SHOW_ILLUSTRATIVE || !metric?.illustrative);
}

function keyMetrics(item, n = 3) {
  if (typeof caseModel.keyMetrics === 'function') {
    return caseModel.keyMetrics(item, n).filter(metric => SHOW_ILLUSTRATIVE || !metric?.illustrative);
  }
  return visibleMetrics(item).slice(0, n);
}

const pitchOf = item => caseText(item.pitch, lang) || caseText(item.preview?.summary, lang) || caseText(item.summary, lang);
const clientOf = item => caseText(item.client, lang) || caseText(item.context, lang);
const roleOf = item => caseText(item.roleTitle, lang) || caseText(item.preview?.role, lang);

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

function applyCopy() {
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  applyPageMeta(pageMeta({ page: 'cases', lang }));
  document.body.dataset.shellLabel = copy.shellLabel;
  document.querySelectorAll('[data-copy]').forEach(element => {
    const value = copy[element.dataset.copy];
    if (typeof value === 'string') element.textContent = value;
  });
  document.querySelectorAll('[data-copy-label]').forEach(element => {
    const value = copy[element.dataset.copyLabel];
    if (typeof value === 'string') element.setAttribute('aria-label', value);
  });
  byId('work')?.setAttribute('data-rail-label', copy.railWork);
  byId('index')?.setAttribute('data-rail-label', copy.railIndex);
  byId('contact')?.setAttribute('data-rail-label', copy.railContact);
  els.search.placeholder = copy.searchPlaceholder;
}

/* ---------- Search index (data, not DOM text) ---------- */

const SEARCH_INDEX = new Map(CASES.map(item => {
  const parts = [
    caseText(item.title, lang),
    caseText(item.pitch, lang),
    caseText(item.summary, lang),
    caseText(item.preview?.summary, lang),
    caseText(item.client, lang),
    caseText(item.context, lang),
    caseText(item.roleTitle, lang),
    caseText(item.problem, lang),
    caseText(item.role, lang),
    caseText(item.preview?.role, lang),
    caseText(CASE_CATEGORIES[item.category], lang),
    ...(item.domains || []).map(domain => caseText(CASE_DOMAINS[domain], lang) || domain),
    ...(item.technologies || []).flatMap(tech => [tech, caseTechnologyText(tech, lang)]),
  ];
  return [item.slug, normalize(parts.join(' '))];
}));

function matches(item) {
  if (state.cat && item.category !== state.cat) return false;
  if (state.domain && !(item.domains || []).includes(state.domain)) return false;
  if (state.tech && !(item.technologies || []).includes(state.tech)) return false;
  const terms = normalize(state.q).split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const haystack = SEARCH_INDEX.get(item.slug) || '';
  return terms.every(term => haystack.includes(term));
}

/* ---------- Controls ---------- */

const CATEGORY_IDS = Object.keys(CASE_CATEGORIES).filter(id => CASES.some(item => item.category === id));
const DOMAIN_IDS = Object.keys(CASE_DOMAINS).filter(id => CASES.some(item => (item.domains || []).includes(id)));
const TECH_IDS = [...new Set(CASES.flatMap(item => item.technologies || []))]
  .sort((a, b) => caseTechnologyText(a, lang).localeCompare(caseTechnologyText(b, lang), lang));

function categoryAccent(id) {
  return CASES.find(item => item.category === id)?.accent || 'neutral';
}

function buildTabs() {
  els.tabs.replaceChildren();
  const entries = [['', copy.allCategories, CASES.length, null], ...CATEGORY_IDS.map(id => [
    id,
    caseText(CASE_CATEGORIES[id], lang),
    CASES.filter(item => item.category === id).length,
    categoryAccent(id),
  ])];
  entries.forEach(([id, label, amount, accent]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cases-tab';
    button.dataset.cat = id;
    if (accent) {
      button.dataset.accent = accent;
      const swatch = document.createElement('span');
      swatch.className = 'cases-tab__swatch';
      swatch.setAttribute('aria-hidden', 'true');
      button.appendChild(swatch);
    }
    const text = document.createElement('span');
    text.className = 'cases-tab__label';
    text.textContent = label;
    const count = document.createElement('span');
    count.className = 'cases-tab__count';
    count.textContent = String(amount).padStart(2, '0');
    button.append(text, count);
    button.addEventListener('click', () => {
      state.cat = id;
      update();
    });
    els.tabs.appendChild(button);
  });
}

function fillSelect(select, allLabel, values, labelFor) {
  select.replaceChildren();
  const all = document.createElement('option');
  all.value = '';
  all.textContent = allLabel;
  select.appendChild(all);
  values.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = labelFor(value);
    select.appendChild(option);
  });
}

function readUrlState() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q') || '';
  const cat = params.get('cat') || '';
  const domain = params.get('domain') || '';
  const tech = params.get('tech') || '';
  state.q = q.slice(0, 120);
  state.cat = CATEGORY_IDS.includes(cat) ? cat : '';
  state.domain = DOMAIN_IDS.includes(domain) ? domain : '';
  state.tech = TECH_IDS.includes(tech) ? tech : '';
}

function writeUrlState() {
  const params = new URLSearchParams();
  if (state.q.trim()) params.set('q', state.q.trim());
  if (state.cat) params.set('cat', state.cat);
  if (state.domain) params.set('domain', state.domain);
  if (state.tech) params.set('tech', state.tech);
  const query = params.toString();
  const url = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
  try {
    window.history.replaceState(null, '', url);
  } catch {
    /* replaceState can fail on some file:// contexts; URL state is optional. */
  }
}

function syncControls() {
  els.search.value = state.q;
  els.domain.value = state.domain;
  els.tech.value = state.tech;
  els.tabs.querySelectorAll('.cases-tab').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.cat === state.cat));
  });
}

/* ---------- Building blocks ---------- */

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

/** Sets the count-up contract attributes read by shell.js (value text stays final for no-JS / reduced motion). */
function applyCount(node, count) {
  if (!count || typeof count.to !== 'number' || !Number.isFinite(count.to)) return;
  node.dataset.count = String(count.to);
  const prefix = caseText(count.prefix, lang);
  const suffix = caseText(count.suffix, lang);
  if (prefix) node.dataset.countPrefix = prefix;
  if (suffix) node.dataset.countSuffix = suffix;
  if (Number.isInteger(count.decimals)) node.dataset.countDecimals = String(count.decimals);
}

function metricBlock(metric, { count = true, compact = true } = {}) {
  const block = el('div', compact ? 'metric metric--compact' : 'metric');
  if (metric.basis) block.dataset.basis = metric.basis;
  const value = el('span', 'metric__value', caseText(metric.value, lang));
  if (count) applyCount(value, metric.count);
  block.appendChild(value);
  const label = caseText(metric.label, lang);
  if (label) block.appendChild(el('span', 'metric__label', label));
  const status = metricStatusText(metric, lang);
  if (status) block.appendChild(el('span', 'metric__status', status));
  return block;
}

/* ---------- Header facts (derived from data, never hardcoded) ---------- */

function buildFacts() {
  if (!els.facts) return;
  els.facts.replaceChildren();
  els.facts.setAttribute('aria-label', copy.factsAria);
  const facts = [
    [CASES.length, copy.facts.cases(CASES.length)],
    [DOMAIN_IDS.length, copy.facts.domains(DOMAIN_IDS.length)],
    [TECH_IDS.length, copy.facts.tech(TECH_IDS.length)],
  ].filter(([value]) => value > 0);
  facts.forEach(([value, label], index) => {
    const item = el('div', 'cases-head__fact');
    item.style.setProperty('--i', String(index));
    const number = el('dd', 'cases-head__fact-value', String(value));
    number.dataset.count = String(value);
    const term = el('dt', 'cases-head__fact-label', label);
    item.append(term, number);
    els.facts.appendChild(item);
  });
  els.facts.hidden = facts.length === 0;
}

/* ---------- Rows ---------- */

function buildRow(item) {
  const li = el('li', 'case-row');
  li.dataset.slug = item.slug;
  li.dataset.accent = item.accent;

  const article = el('article', 'case-row__inner');
  const title = caseText(item.title, lang);

  const numberCell = el('div', 'case-row__cell case-row__cell--number');
  const numberText = el('span', 'case-row__number', item.number);
  numberText.style.viewTransitionName = `case-number-${item.slug}`;
  numberCell.appendChild(numberText);

  const main = el('div', 'case-row__cell case-row__cell--main');

  const metaParts = [caseText(CASE_CATEGORIES[item.category], lang), clientOf(item), caseText(item.period, lang)].filter(Boolean);
  if (metaParts.length) {
    const meta = el('p', 'case-row__meta label');
    metaParts.forEach((part, index) => {
      const span = el('span', index === 0 ? 'case-row__category label--domain' : 'case-row__meta-item', part);
      meta.appendChild(span);
    });
    main.appendChild(meta);
  }

  const heading = el('h3', 'case-row__title');
  heading.style.viewTransitionName = `case-title-${item.slug}`;
  const link = el('a', 'case-row__link', title);
  link.href = localePath(caseUrl(item));
  heading.appendChild(link);
  main.appendChild(heading);

  const pitch = pitchOf(item);
  if (pitch) main.appendChild(el('p', 'case-row__pitch', pitch));

  const role = roleOf(item);
  if (role) main.appendChild(el('p', 'case-row__role', role));

  const stack = (item.technologies || []).slice(0, 6).map(tech => caseTechnologyText(tech, lang)).join(' · ');
  if (stack) main.appendChild(el('p', 'case-row__stack', stack));

  const cta = el('span', 'case-row__cta');
  cta.setAttribute('aria-hidden', 'true');
  cta.append(el('span', 'case-row__cta-text', copy.cta), el('span', 'case-row__cta-icon', '→'));
  main.appendChild(cta);

  article.append(numberCell, main);

  const metric = keyMetrics(item, 1)[0];
  if (metric) {
    const metricCell = el('div', 'case-row__cell case-row__cell--metric');
    metricCell.appendChild(metricBlock(metric));
    article.appendChild(metricCell);
  }

  li.appendChild(article);
  return li;
}

const ROWS = new Map(CASES.map(item => [item.slug, buildRow(item)]));

/* ---------- Peek: flow thumb + key metrics ---------- */

const previews = new Map();
let activeSlug = '';
let shownSlug = '';

function buildPeekBody(item) {
  const body = el('div', 'cases-peek__item');
  body.dataset.accent = item.accent;

  const head = el('p', 'cases-peek__title label');
  head.append(el('span', 'label--domain', item.number), el('span', '', caseText(item.title, lang)));
  body.appendChild(head);

  const pitch = pitchOf(item);
  if (pitch) body.appendChild(el('p', 'cases-peek__pitch', pitch));

  const metrics = keyMetrics(item, 3);
  if (metrics.length) {
    const list = el('ul', 'cases-peek__metrics');
    metrics.forEach(metric => {
      const li = el('li', 'cases-peek__metric');
      li.appendChild(metricBlock(metric, { count: false }));
      list.appendChild(li);
    });
    body.appendChild(list);
  }

  const facts = [caseText(item.team, lang), caseText(item.period, lang)].filter(Boolean).join(' · ');
  if (facts) body.appendChild(el('p', 'cases-peek__facts', facts));
  return body;
}

function previewFor(item) {
  if (previews.has(item.slug)) return previews.get(item.slug);
  const holder = el('div', 'cases-peek__flow');
  holder.dataset.accent = item.accent;
  els.preview.appendChild(holder);
  let handle = null;
  try {
    // Rendered while displayed so the preview can measure its container; showPreview decides visibility next.
    handle = renderFlowPreview(holder, item, { lang, variant: 'thumb' });
  } catch {
    handle = null;
  }
  holder.hidden = true;
  const body = buildPeekBody(item);
  body.hidden = true;
  els.peekBody.appendChild(body);
  const entry = { holder, handle, body, hasFlow: Boolean(handle?.el) };
  previews.set(item.slug, entry);
  return entry;
}

function showPreview(slug, { active = true } = {}) {
  if (!desktopPreview.matches) return;
  const item = CASES.find(value => value.slug === slug);
  if (!item) return;
  previews.forEach((entry, key) => {
    if (key === slug) return;
    entry.holder.hidden = true;
    entry.body.hidden = true;
    entry.body.classList.remove('is-entering');
    entry.handle?.setActive?.(false);
  });
  const entry = previewFor(item);
  entry.holder.hidden = false;
  entry.body.hidden = false;
  if (shownSlug !== slug && !reducedMotion.matches) {
    entry.body.classList.remove('is-entering');
    void entry.body.offsetWidth; // restart the entrance animation
    entry.body.classList.add('is-entering');
  }
  shownSlug = slug;
  entry.handle?.setActive?.(active);
  els.preview.hidden = !entry.hasFlow;
  els.previewCaption.hidden = !entry.hasFlow;
  els.previewCaption.textContent = entry.hasFlow ? copy.previewCaption(item.number) : '';
  els.peekBody.parentElement.dataset.accent = item.accent;
  els.peekBody.parentElement.classList.toggle('is-active', active);
}

function setActiveRow(slug) {
  if (slug === activeSlug) return;
  activeSlug = slug;
  ROWS.forEach((row, key) => row.classList.toggle('is-active', key === slug));
  els.list.classList.toggle('is-hovering', Boolean(slug));
  if (slug) showPreview(slug, { active: true });
  else resetPreview();
}

function firstVisibleSlug() {
  return CASES.find(item => !ROWS.get(item.slug).hidden)?.slug || '';
}

function resetPreview() {
  const slug = firstVisibleSlug();
  if (!slug) {
    previews.forEach(entry => {
      entry.holder.hidden = true;
      entry.body.hidden = true;
      entry.handle?.setActive?.(false);
    });
    shownSlug = '';
    els.previewCaption.textContent = '';
    els.peekBody.parentElement.classList.remove('is-active');
    return;
  }
  showPreview(slug, { active: false });
}

function bindRowInteractions() {
  els.list.addEventListener('pointerover', event => {
    if (event.pointerType === 'touch') return;
    const row = event.target.closest('.case-row');
    if (row && !row.hidden) setActiveRow(row.dataset.slug);
  });
  els.list.addEventListener('pointerleave', () => {
    if (!els.list.contains(document.activeElement)) setActiveRow('');
  });
  els.list.addEventListener('focusin', event => {
    const row = event.target.closest('.case-row');
    if (row) setActiveRow(row.dataset.slug);
  });
  els.list.addEventListener('focusout', event => {
    if (!els.list.contains(event.relatedTarget)) setActiveRow('');
  });
  const onBreakpoint = () => { if (desktopPreview.matches) resetPreview(); };
  if (desktopPreview.addEventListener) desktopPreview.addEventListener('change', onBreakpoint);
}

/* ---------- Closing: convite aberto (sem rotular formatos de contratação) ---------- */

function buildClosing() {
  if (els.engagements) {
    els.engagements.replaceChildren();
    els.engagements.hidden = true;
  }
  const email = typeof PROFILE?.contact?.email === 'string' ? PROFILE.contact.email : '';
  const mail = byId('closing-mail');
  if (mail && email) mail.href = `mailto:${email}?subject=${encodeURIComponent(copy.closingSubject)}`;
}

/* ---------- Render ---------- */

function update({ writeUrl = true } = {}) {
  syncControls();
  let shown = 0;
  CASES.forEach(item => {
    const visible = matches(item);
    ROWS.get(item.slug).hidden = !visible;
    if (visible) shown += 1;
  });
  els.count.textContent = copy.count(shown, CASES.length);
  els.empty.hidden = shown !== 0;
  els.list.hidden = shown === 0;
  if (activeSlug && ROWS.get(activeSlug)?.hidden) setActiveRow('');
  else if (!activeSlug) resetPreview();
  if (writeUrl) writeUrlState();
}

function debounce(fn, wait) {
  let timer = 0;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), wait);
  };
}

function resetPreviews() {
  previews.forEach(entry => entry.handle?.destroy?.());
  previews.clear();
  activeSlug = '';
  shownSlug = '';
  els.preview.replaceChildren();
  els.peekBody.replaceChildren();
  els.previewCaption.textContent = '';
  els.peekBody.parentElement.classList.remove('is-active');
  els.list.classList.remove('is-hovering');
  ROWS.forEach(row => row.classList.remove('is-active'));
}

/** Builds every data-driven block from scratch; safe to run again (also over prerendered HTML). */
function render() {
  applyCopy();
  resetPreviews();
  buildFacts();
  buildTabs();
  fillSelect(els.domain, copy.allDomains, DOMAIN_IDS, id => caseText(CASE_DOMAINS[id], lang) || id);
  fillSelect(els.tech, copy.allTech, TECH_IDS, value => caseTechnologyText(value, lang));
  els.list.replaceChildren(...CASES.map(item => ROWS.get(item.slug)));
  buildClosing();

  readUrlState();
  update({ writeUrl: false });
}

function init() {
  render();

  const onSearch = debounce(() => update(), 180);
  els.search.addEventListener('input', () => {
    state.q = els.search.value;
    onSearch();
  });
  els.search.addEventListener('keydown', event => {
    if (event.key === 'Escape' && els.search.value) {
      event.preventDefault();
      state.q = '';
      update();
    }
  });
  els.domain.addEventListener('change', () => { state.domain = els.domain.value; update(); });
  els.tech.addEventListener('change', () => { state.tech = els.tech.value; update(); });
  els.clear.addEventListener('click', () => {
    Object.assign(state, { q: '', cat: '', domain: '', tech: '' });
    update();
    els.search.focus();
  });

  bindRowInteractions();
  // No explicit sections: the shell derives rail ticks and the nav indicator from [data-rail].
  initShell();
}

init();
