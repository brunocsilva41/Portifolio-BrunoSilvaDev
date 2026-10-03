import {
  CASES,
  CASE_CATEGORIES,
  caseTechnologyText,
  caseText,
  caseUrl,
  getCaseBySlug,
  metricStatusText,
} from '../data/case-view-model.js';
import { EDUCATION, EXPERIENCE } from '../data/experience.js';
import { PROFILE } from '../data/profile.js';
import { INDEPENDENT_PROJECTS } from '../data/independent-projects.js';
import { pageMeta } from '../config/seo.js';
import { getLang, localePath, tr } from '../i18n/i18n.js';
import { applyPageMeta, initShell } from './shell.js';

const LANG = getLang();
const REDUCED_MOTION = matchMedia('(prefers-reduced-motion: reduce)');
const MOBILE_TABS = matchMedia('(max-width: 860px)');
const P = PROFILE && typeof PROFILE === 'object' ? PROFILE : {};

// Dicionário das strings curtas de interface da home. Conteúdo vem de PROFILE (profile.js) e CASES.
const HOME_COPY = {
  'a11y.skip': { pt: 'Pular para o conteúdo', en: 'Skip to content' },

  'nav.aria': { pt: 'Navegação principal', en: 'Main navigation' },
  'nav.menu': { pt: 'Menu', en: 'Menu' },
  'nav.cases': { pt: 'Cases', en: 'Cases' },
  'nav.depth': { pt: 'Profundidade', en: 'Depth' },
  'nav.work': { pt: 'Como trabalho', en: 'How I work' },
  'nav.trajectory': { pt: 'Trajetória', en: 'Career' },
  'nav.contact': { pt: 'Contato', en: 'Contact' },
  'nav.lang': { pt: 'Idioma', en: 'Language' },
  'nav.space': { pt: 'Visão espacial', en: 'Space view' },
  'shell.home': { pt: 'Início', en: 'Home' },
  'shell.projects': { pt: 'Independentes', en: 'Independent' },

  'hero.role': { pt: 'Engenheiro de software full stack', en: 'Full stack software engineer' },
  'hero.location': { pt: 'São Paulo', en: 'São Paulo, Brazil' },
  'hero.focus': { pt: 'Foco', en: 'Focus' },
  'hero.cta.cases': { pt: 'Ver projetos', en: 'See the projects' },
  'hero.cta.contact': { pt: 'Conversar', en: 'Let’s talk' },
  'hero.credentials': { pt: 'Em números', en: 'By the numbers' },
  'hero.cue': { pt: 'Veja como cada um foi construído', en: 'See how each one was built' },

  'domain.fiscal': { pt: 'Fiscal', en: 'Tax' },
  'domain.ops': { pt: 'Operações', en: 'Operations' },
  'domain.ai': { pt: 'IA', en: 'AI' },
  'domain.fitness': { pt: 'Academias', en: 'Fitness' },

  'cases.tabs': { pt: 'Estudos de caso', en: 'Case studies' },
  'cases.deliverables': { pt: 'O que entreguei', en: 'What I delivered' },
  'cases.results': { pt: 'Resultados', en: 'Results' },
  'cases.stack': { pt: 'Stack', en: 'Stack' },
  'cases.read': { pt: 'Ver estudo de caso', en: 'Read the case study' },
  'cases.all': { pt: 'Todos os estudos de caso', en: 'All case studies' },

  'depth.title': { pt: 'O que sustenta cada entrega.', en: 'What holds every delivery together.' },
  'depth.applied': { pt: 'Aplicado em', en: 'Applied in' },

  'work.title': { pt: 'Do problema ao produto.', en: 'From problem to product.' },
  'work.cta': { pt: 'Conversar sobre a sua ideia', en: 'Talk about your idea' },
  'work.subject': { pt: 'Uma ideia para conversar', en: 'An idea to talk about' },

  'trajectory.title': { pt: 'Do suporte técnico ao full stack.', en: 'From technical support to full stack.' },
  'trajectory.education': { pt: 'Formação', en: 'Education' },

  'projects.title': { pt: 'Projetos independentes.', en: 'Independent projects.' },
  'projects.intro': {
    pt: 'O que eu construo por conta própria, por desafio e curiosidade: um jogo para a turma, ferramentas para agentes de IA e utilitários que faltavam no meu Windows.',
    en: 'What I build on my own, out of challenge and curiosity: a game for my friends, tooling for AI agents and utilities my Windows was missing.',
  },
  'projects.challenges': { pt: 'O que eu quis resolver', en: 'What I set out to solve' },
  'projects.stack': { pt: 'Stack', en: 'Stack' },
  'projects.status': { pt: 'Estado', en: 'Status' },
  'projects.more': { pt: 'Mais experimentos', en: 'More experiments' },
  'projects.inside': { pt: 'Por dentro', en: 'Under the hood' },
  'projects.github': { pt: 'no GitHub', en: 'on GitHub' },

  'contact.title': { pt: 'Contato', en: 'Contact' },
  'contact.statement': { pt: 'Qual é o próximo sistema que a sua empresa precisa?', en: 'What’s the next system your business needs?' },
  'contact.cta': { pt: 'Escrever um e-mail', en: 'Send an email' },
  'contact.list': { pt: 'Canais de contato', en: 'Contact channels' },

  'footer.cnpj': { pt: 'CNPJ', en: 'CNPJ' },
};

const NUMBER_WORDS = {
  pt: ['Nenhum', 'Um', 'Dois', 'Três', 'Quatro', 'Cinco', 'Seis'],
  en: ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'],
};

const DEFAULT_CONTACT = {
  email: 'brunocesar.social@gmail.com',
  linkedin: 'https://www.linkedin.com/in/dev-bruno-silva/',
  github: 'https://github.com/brunocsilva41',
  phone: '+55 11 98864-4269',
  phoneHref: 'tel:+5511988644269',
};
const CONTACT = { ...DEFAULT_CONTACT, ...(P.contact || {}) };

function t(key) {
  return tr(HOME_COPY[key]) || key;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function txt(value) {
  return caseText(value, LANG);
}

function list(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function hidden(node) {
  node.setAttribute('aria-hidden', 'true');
  return node;
}

function arrowIcon(symbol = '→') {
  return hidden(el('span', 'link-arrow__icon', symbol));
}

function btnArrow() {
  return hidden(el('span', '', '→'));
}

function domainLabel(item) {
  return txt(CASE_CATEGORIES[item.category]) || (HOME_COPY['domain.' + item.accent] ? t('domain.' + item.accent) : '');
}

function panelId(item) {
  return 'case-' + item.slug;
}

function tabId(item) {
  return 'case-tab-' + item.slug;
}

// Primeiras n métricas do case (as "métricas-chave"); mesmo contrato de keyMetrics() do view model.
function keyMetricsOf(item, n = 3) {
  return list(item?.metrics).slice(0, n);
}

function mailto(subject) {
  return 'mailto:' + CONTACT.email + (subject ? '?subject=' + encodeURIComponent(subject) : '');
}

/** Sequenciador de entrada: cada chamada marca o nó com .reveal e o próximo --i. */
function revealer(start = 0) {
  let i = start;
  return node => {
    node.classList.add('reveal');
    node.style.setProperty('--i', String(i++));
    return node;
  };
}

/** Aplica os atributos de count-up (lidos por initShell / initCountUp). O texto final fica no nó. */
function applyCount(node, count) {
  if (!count || typeof count !== 'object' || !Number.isFinite(Number(count.to))) return node;
  node.dataset.count = String(count.to);
  const prefix = txt(count.prefix);
  const suffix = txt(count.suffix);
  if (prefix) node.dataset.countPrefix = prefix;
  if (suffix) node.dataset.countSuffix = suffix;
  if (Number.isFinite(Number(count.decimals))) node.dataset.countDecimals = String(count.decimals);
  return node;
}

/* ---------- copy ---------- */

function applyCopy() {
  document.documentElement.lang = LANG === 'pt' ? 'pt-BR' : 'en';
  applyPageMeta(pageMeta({ page: 'home', lang: LANG }));
  document.querySelectorAll('[data-copy]').forEach(node => {
    if (HOME_COPY[node.dataset.copy]) node.textContent = t(node.dataset.copy);
  });
  document.querySelectorAll('[data-copy-aria]').forEach(node => {
    if (HOME_COPY[node.dataset.copyAria]) node.setAttribute('aria-label', t(node.dataset.copyAria));
  });
  document.querySelectorAll('[data-copy-rail]').forEach(node => {
    if (HOME_COPY[node.dataset.copyRail]) node.dataset.railLabel = t(node.dataset.copyRail);
  });
  document.body.dataset.shellLabel = t('shell.home');
}

/* ---------- metric ---------- */

function renderMetric(metric, { compact = false } = {}) {
  const block = el('div', compact ? 'metric metric--compact' : 'metric');
  if (metric.basis) block.dataset.basis = metric.basis;
  block.appendChild(applyCount(el('span', 'metric__value', txt(metric.value)), metric.count));
  if (txt(metric.label)) block.appendChild(el('span', 'metric__label', txt(metric.label)));
  // Só estimativas e exemplos visuais recebem marcação; nada de rótulo vazio.
  const status = metricStatusText(metric, LANG);
  if (status) block.appendChild(el('span', 'metric__status', status));
  return block;
}

/* ---------- 00 hero: apresentação + gancho ---------- */

function renderHero() {
  const location = document.getElementById('hero-location');
  if (location) location.textContent = txt(P.location) || t('hero.location');
  renderIdentity();

  const availability = document.getElementById('hero-availability');
  if (availability) {
    const value = txt(P.availability);
    availability.textContent = value;
    availability.hidden = !value;
  }

  renderHeadline();
  renderFeats();
  const hook = document.getElementById('hero-hook');
  if (hook) {
    const value = txt(P.hook);
    if (value) hook.textContent = value;
    hook.hidden = !hook.textContent.trim();
  }
  renderCredentials();
}

/** Nome em destaque + cargo, empresa e tecnologias de foco. */
function renderIdentity() {
  const name = document.getElementById('hero-title');
  if (name && P.name) name.textContent = P.name;
  const role = document.getElementById('hero-role');
  if (role) role.textContent = txt(P.role) || t('hero.role');
  const roleTitle = document.getElementById('hero-role-title');
  if (roleTitle) {
    const value = txt(P.title);
    roleTitle.textContent = value;
    roleTitle.hidden = !value;
    const sep = roleTitle.previousElementSibling;
    if (sep) sep.hidden = !value;
  }
  const focus = document.getElementById('hero-focus');
  if (focus) {
    const items = list(P.focus).map(item => txt(item)).filter(Boolean);
    focus.replaceChildren();
    focus.hidden = !items.length;
    if (items.length) focus.append(el('span', 'hero__focus-label', t('hero.focus')), document.createTextNode(' ' + items.join(' · ')));
  }
}

/** Uma linha de título, com a frase de destaque (headlineAccent) em serifa itálica quando presente. */
function headlineLine(text, accent) {
  const line = el('span', 'hero__line');
  const at = accent ? text.indexOf(accent) : -1;
  if (at < 0) {
    line.textContent = text;
    return line;
  }
  line.append(
    document.createTextNode(text.slice(0, at)),
    el('em', 'hero__accent', accent),
    document.createTextNode(text.slice(at + accent.length)),
  );
  return line;
}

/** H1 em duas linhas: quebra depois da primeira frase ("Me apresente um problema." / "Eu entrego …"). */
function renderHeadline() {
  const title = document.getElementById('hero-statement');
  const headline = txt(P.headline);
  if (!title || !headline) return;
  const accent = txt(P.headlineAccent);
  const match = headline.match(/^(.+?[.!?])\s+(.+)$/);
  const lines = match ? [match[1], match[2]] : [headline];
  title.replaceChildren();
  lines.forEach((line, index) => {
    if (index) title.appendChild(document.createTextNode(' '));
    title.appendChild(headlineLine(line, accent));
  });
}

/** Os quatro feitos do hero: uma linha cada, apontando para o case correspondente no seletor. */
function renderFeats() {
  const root = document.getElementById('hero-feats');
  if (!root) return;
  root.replaceChildren();
  const feats = list(P.feats).filter(feat => txt(feat.text));
  root.hidden = !feats.length;
  feats.forEach((feat, index) => {
    const li = el('li', 'hero__feat');
    const item = getCaseBySlug(feat.case);
    const text = txt(feat.text);
    let body;
    if (item) {
      body = el('a', 'hero__feat-link', text);
      body.href = '#' + panelId(item);
      li.dataset.accent = item.accent;
    } else {
      body = el('span', 'hero__feat-text', text);
    }
    li.append(hidden(el('span', 'hero__feat-number', pad(index + 1))), body);
    root.appendChild(li);
  });
}

function renderCredentials() {
  const root = document.getElementById('hero-credentials');
  if (!root) return;
  root.replaceChildren();
  const items = list(P.credentials).filter(item => txt(item.value) && txt(item.label));
  root.hidden = !items.length;
  items.forEach(item => {
    const li = el('li', 'credential');
    li.append(applyCount(el('span', 'credential__value', txt(item.value)), item.count), el('span', 'credential__label', txt(item.label)));
    root.appendChild(li);
  });
}

/* ---------- 01 cases: seletor (tablist + todos os painéis no DOM) ---------- */

function casesTitle(count) {
  const words = NUMBER_WORDS[LANG] || NUMBER_WORDS.pt;
  const n = words[count] || String(count);
  if (LANG === 'en') return count === 1 ? 'One system the business relies on every day.' : n + ' systems the business relies on every day.';
  return count === 1 ? 'Um sistema que o negócio usa todo dia.' : n + ' sistemas que o negócio usa todo dia.';
}

function renderCaseTab(item, selected) {
  const tab = el('button', 'case-tab');
  tab.type = 'button';
  tab.id = tabId(item);
  tab.dataset.slug = item.slug;
  tab.dataset.accent = item.accent;
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-controls', panelId(item));
  tab.setAttribute('aria-selected', String(selected));
  tab.tabIndex = selected ? 0 : -1;
  if (selected) tab.classList.add('is-active');

  const body = el('span', 'case-tab__body');
  body.appendChild(el('span', 'case-tab__title', txt(item.title)));
  const meta = [domainLabel(item), txt(item.client)].filter(Boolean).join(' · ');
  if (meta) body.appendChild(el('span', 'case-tab__meta', meta));
  const pitch = txt(item.pitch);
  if (pitch) body.appendChild(el('span', 'case-tab__pitch', pitch));
  tab.append(hidden(el('span', 'case-tab__number', item.number)), body);
  return tab;
}

function renderCasePanel(item, selected) {
  const panel = el('div', 'case-panel');
  panel.id = panelId(item);
  panel.dataset.accent = item.accent;
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-labelledby', tabId(item));
  panel.hidden = !selected;
  const url = localePath(caseUrl(item));
  const title = txt(item.title);

  const meta = el('p', 'case-panel__meta');
  meta.appendChild(hidden(el('span', 'case-panel__number', item.number)));
  const domain = domainLabel(item);
  if (domain) meta.appendChild(el('span', 'label label--domain case-panel__domain', domain));
  const facts = [txt(item.client), txt(item.period)].filter(Boolean).join(' · ');
  if (facts) meta.appendChild(el('span', 'case-panel__facts', facts));
  panel.appendChild(meta);

  const heading = el('h3', 'case-panel__title');
  const link = el('a', 'case-panel__link', title);
  link.href = url;
  heading.appendChild(link);
  panel.appendChild(heading);

  if (txt(item.pitch)) panel.appendChild(el('p', 'case-panel__pitch', txt(item.pitch)));
  const summary = txt(item.summary) || txt(item.solution);
  if (summary) panel.appendChild(el('p', 'case-panel__summary', summary));

  const metrics = keyMetricsOf(item, 3).filter(metric => txt(metric.value));
  if (metrics.length) {
    const box = el('div', 'case-panel__metrics');
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', t('cases.results') + ' — ' + title);
    metrics.forEach(metric => box.appendChild(renderMetric(metric, { compact: true })));
    panel.appendChild(box);
  }

  const deliverables = list(item.deliverables).filter(d => txt(d.title)).slice(0, 3);
  if (deliverables.length) {
    const block = el('div', 'case-panel__deliverables');
    block.appendChild(el('p', 'label case-panel__label', t('cases.deliverables')));
    const ol = el('ol', 'case-panel__deliverable-list');
    deliverables.forEach((d, i) => {
      const li = el('li', 'case-panel__deliverable');
      li.append(hidden(el('span', 'case-panel__deliverable-number', pad(i + 1))), el('span', 'case-panel__deliverable-title', txt(d.title)));
      ol.appendChild(li);
    });
    block.appendChild(ol);
    panel.appendChild(block);
  }

  const foot = el('div', 'case-panel__foot');
  const techs = list(item.technologies).map(value => caseTechnologyText(value, LANG));
  if (techs.length) {
    const shown = techs.slice(0, 6);
    const stack = el('p', 'case-panel__stack');
    stack.append(el('span', 'visually-hidden', t('cases.stack') + ': '), document.createTextNode(shown.join(' · ')));
    if (techs.length > shown.length) stack.appendChild(el('span', 'case-panel__stack-more', ' +' + (techs.length - shown.length)));
    foot.appendChild(stack);
  }
  const cta = el('a', 'btn-primary case-panel__cta');
  cta.href = url;
  cta.setAttribute('aria-label', t('cases.read') + ': ' + title);
  cta.append(el('span', '', t('cases.read')), document.createTextNode(' '), btnArrow());
  foot.appendChild(cta);
  panel.appendChild(foot);
  return panel;
}

function initialCaseSlug() {
  const hash = decodeURIComponent((location.hash || '').slice(1));
  const fromHash = CASES.find(item => panelId(item) === hash);
  return (fromHash || CASES[0])?.slug || '';
}

function renderCaseSelector() {
  const title = document.getElementById('cases-title');
  if (title) title.textContent = casesTitle(CASES.length);
  const selector = document.getElementById('case-selector');
  const tabs = document.getElementById('case-tabs');
  const panels = document.getElementById('case-list');
  if (!selector || !tabs || !panels) return;
  tabs.replaceChildren();
  panels.replaceChildren();
  selector.hidden = !CASES.length;
  if (!CASES.length) return;

  const selected = initialCaseSlug();
  CASES.forEach(item => {
    tabs.appendChild(renderCaseTab(item, item.slug === selected));
    panels.appendChild(renderCasePanel(item, item.slug === selected));
  });
  tabs.setAttribute('aria-orientation', MOBILE_TABS.matches ? 'horizontal' : 'vertical');
  selector.dataset.revealGroup = '';
  const reveal = revealer();
  reveal(selector.querySelector('.case-selector__nav'));
  reveal(panels);
  bindCaseSelector(tabs);
}

/** Troca o case selecionado: só atributos (aria-selected, tabindex, hidden); o crossfade é CSS. */
function selectCase(slug, { focus = false } = {}) {
  const tabs = [...document.querySelectorAll('#case-tabs [role="tab"]')];
  const target = tabs.find(tab => tab.dataset.slug === slug);
  if (!target) return;
  tabs.forEach(tab => {
    const active = tab === target;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    tab.classList.toggle('is-active', active);
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    if (panel) panel.hidden = !active;
  });
  if (focus) target.focus();
  if (MOBILE_TABS.matches && typeof target.scrollIntoView === 'function') {
    target.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: REDUCED_MOTION.matches ? 'auto' : 'smooth' });
  }
}

// Contêineres estáticos persistem entre renders: liga os eventos uma única vez (sem marcar o DOM).
const boundSelectors = new WeakSet();
let globalSelectorEvents = false;

function bindCaseSelector(tablist) {
  if (!boundSelectors.has(tablist)) {
    boundSelectors.add(tablist);
    tablist.addEventListener('click', event => {
      const tab = event.target instanceof Element ? event.target.closest('[role="tab"]') : null;
      if (tab) selectCase(tab.dataset.slug);
    });
    tablist.addEventListener('keydown', event => {
      const tabs = [...tablist.querySelectorAll('[role="tab"]')];
      const index = tabs.indexOf(document.activeElement);
      if (index < 0) return;
      let next = -1;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      if (next < 0) return;
      event.preventDefault();
      selectCase(tabs[next].dataset.slug, { focus: true });
    });
  }
  if (globalSelectorEvents) return;
  globalSelectorEvents = true;
  // Âncoras #case-<slug> (feitos do hero, "Aplicado em") abrem o painel certo e levam até a seção.
  const openFromHash = hash => {
    const item = CASES.find(entry => panelId(entry) === hash);
    if (!item) return false;
    selectCase(item.slug);
    document.getElementById('cases')?.scrollIntoView({ behavior: REDUCED_MOTION.matches ? 'auto' : 'smooth' });
    return true;
  };
  document.addEventListener('click', event => {
    const link = event.target instanceof Element ? event.target.closest('a[href^="#case-"]') : null;
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const hash = decodeURIComponent(link.getAttribute('href').slice(1));
    if (!openFromHash(hash)) return;
    event.preventDefault();
    if (history.replaceState) history.replaceState(null, '', '#' + hash);
  });
  window.addEventListener('hashchange', () => openFromHash(decodeURIComponent(location.hash.slice(1))));
  const syncOrientation = () => {
    document.getElementById('case-tabs')?.setAttribute('aria-orientation', MOBILE_TABS.matches ? 'horizontal' : 'vertical');
  };
  if (MOBILE_TABS.addEventListener) MOBILE_TABS.addEventListener('change', syncOrientation);
}

/* ---------- 02 capabilities ---------- */

function renderCapabilities() {
  const root = document.getElementById('capability-list');
  if (!root) return;
  root.replaceChildren();
  const capabilities = list(P.capabilities).filter(cap => txt(cap.title));
  root.hidden = !capabilities.length;

  capabilities.forEach((cap, index) => {
    const li = el('li', 'capability');
    li.dataset.revealGroup = '';
    const reveal = revealer();
    const head = reveal(el('p', 'capability__head'));
    head.appendChild(hidden(el('span', 'capability__number', pad(index + 1))));
    li.appendChild(head);
    li.appendChild(reveal(el('h3', 'capability__title', txt(cap.title))));
    if (txt(cap.text)) li.appendChild(reveal(el('p', 'capability__text', txt(cap.text))));

    const stack = list(cap.stack);
    if (stack.length) li.appendChild(reveal(el('p', 'capability__stack', stack.join(' · '))));
    const refs = list(cap.cases).map(slug => getCaseBySlug(slug)).filter(Boolean);
    if (refs.length) {
      const applied = reveal(el('p', 'capability__refs'));
      applied.appendChild(el('span', 'label', t('depth.applied')));
      refs.forEach(item => {
        const link = el('a', 'capability__ref');
        link.href = '#' + panelId(item);
        link.dataset.accent = item.accent;
        link.append(el('span', 'capability__ref-number', item.number), document.createTextNode(' ' + txt(item.title)));
        applied.appendChild(link);
      });
      li.appendChild(applied);
    }
    root.appendChild(li);
  });
}

/* ---------- 03 como trabalho ---------- */

function renderApproach() {
  const approach = P.approach || {};
  const title = document.getElementById('work-title');
  if (title) title.textContent = txt(approach.title) || t('work.title');
  const intro = document.getElementById('approach-intro');
  if (intro) {
    const value = txt(approach.intro);
    if (value) intro.textContent = value;
    intro.hidden = !intro.textContent.trim();
  }
  const cta = document.getElementById('approach-cta');
  if (cta) cta.href = mailto(t('work.subject'));

  const root = document.getElementById('approach-steps');
  if (!root) return;
  root.replaceChildren();
  const steps = list(approach.steps).filter(step => txt(step.title));
  root.hidden = !steps.length;
  root.dataset.revealGroup = '';
  const reveal = revealer();
  steps.forEach((step, index) => {
    const li = reveal(el('li', 'approach__step'));
    li.appendChild(hidden(el('span', 'approach__number', pad(index + 1))));
    li.appendChild(el('h3', 'approach__title', txt(step.title)));
    if (txt(step.text)) li.appendChild(el('p', 'approach__text', txt(step.text)));
    root.appendChild(li);
  });
}

/* ---------- 04 trajectory ---------- */

function renderTrajectory() {
  const intro = document.getElementById('trajectory-intro');
  if (intro && txt(P.trajectoryIntro)) intro.textContent = txt(P.trajectoryIntro);
  const root = document.getElementById('trajectory-list');
  if (!root) return;
  root.replaceChildren();
  EXPERIENCE.forEach(exp => {
    const row = el('li', 'trajectory-row');
    row.dataset.revealGroup = '';
    const reveal = revealer();
    row.appendChild(reveal(el('p', 'trajectory-row__period', tr(exp.period))));
    const role = reveal(el('div', 'trajectory-row__role'));
    role.append(
      el('h3', 'trajectory-row__title', tr(exp.role)),
      el('p', 'trajectory-row__company', [exp.company, tr(exp.location)].filter(Boolean).join(' · ')),
    );
    row.appendChild(role);
    const scope = reveal(el('div', 'trajectory-row__scope'));
    if (tr(exp.summary)) scope.appendChild(el('p', 'trajectory-row__summary', tr(exp.summary)));
    const bullets = list(exp.bullets).map(bullet => tr(bullet)).filter(Boolean);
    if (bullets.length) {
      const ul = el('ul', 'trajectory-row__bullets');
      bullets.forEach(bullet => ul.appendChild(el('li', '', bullet)));
      scope.appendChild(ul);
    }
    row.appendChild(scope);
    root.appendChild(row);
  });

  if (EDUCATION) {
    const row = el('li', 'trajectory-row trajectory-row--education');
    row.dataset.revealGroup = '';
    const reveal = revealer();
    row.appendChild(reveal(el('p', 'trajectory-row__period', tr(EDUCATION.period))));
    const role = reveal(el('div', 'trajectory-row__role'));
    role.append(el('h3', 'trajectory-row__title', tr(EDUCATION.degree)), el('p', 'trajectory-row__company', tr(EDUCATION.school)));
    row.appendChild(role);
    const scope = reveal(el('div', 'trajectory-row__scope'));
    scope.appendChild(el('p', 'label', t('trajectory.education')));
    row.appendChild(scope);
    root.appendChild(row);
  }
}

/* ---------- 05 independent projects ---------- */

/** Texto localizado de um campo {pt,en} dos projetos independentes. */
function indieText(value) {
  return tr(value) || '';
}

/** Linha mono de stack, com rótulo para leitores de tela. */
function indieStackLine(project, className) {
  const stack = list(project.stack);
  if (!stack.length) return null;
  const line = el('p', className);
  line.append(el('span', 'visually-hidden', t('projects.stack') + ': '), document.createTextNode(stack.join(' · ')));
  return line;
}

/** Link "GitHub ↗" — só existe para repositórios públicos (campo `repo`). */
function indieRepoLink(project, className) {
  if (!project.repo) return null;
  const link = el('a', 'link-arrow ' + className, 'GitHub ');
  link.href = project.repo;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', project.title + ' ' + t('projects.github'));
  link.appendChild(arrowIcon('↗'));
  return link;
}

/** Status em mono, com rótulo para leitores de tela. */
function indieStatus(project, className) {
  if (!indieText(project.status)) return null;
  const status = el('p', className);
  status.append(el('span', 'visually-hidden', t('projects.status') + ': '), document.createTextNode(indieText(project.status)));
  return status;
}

/** Desafios numerados (01, 02…) como lista ordenada. */
function indieChallenges(project) {
  const items = list(project.challenges).filter(item => indieText(item.title) || indieText(item.text));
  if (!items.length) return null;
  const ol = el('ol', 'indie-challenges');
  items.forEach((item, index) => {
    const li = el('li', 'indie-challenges__item');
    li.appendChild(hidden(el('span', 'indie-challenges__number', pad(index + 1))));
    const body = el('div', 'indie-challenges__body');
    if (indieText(item.title)) body.appendChild(el('h4', 'indie-challenges__title', indieText(item.title)));
    if (indieText(item.text)) body.appendChild(el('p', 'indie-challenges__text', indieText(item.text)));
    li.appendChild(body);
    ol.appendChild(li);
  });
  return ol;
}

/** Destaques numéricos (0–2). Valor só com dígitos ganha count-up do shell. */
function indieHighlights(project) {
  const items = list(project.highlights).filter(item => item && item.value && indieText(item.label));
  if (!items.length) return null;
  const dl = el('dl', 'indie-card__highlights');
  items.slice(0, 2).forEach(item => {
    const wrap = el('div', 'indie-card__highlight');
    const value = el('dt', 'indie-card__highlight-value', String(item.value));
    if (/^\d+$/.test(String(item.value))) value.dataset.count = String(item.value);
    wrap.append(value, el('dd', 'indie-card__highlight-label', indieText(item.label)));
    dl.appendChild(wrap);
  });
  return dl;
}

/** `<details>` "Por dentro": história + desafios (+ extras). Nada é criado se não houver conteúdo. */
function indieDetails(project, { title, extras = [] } = {}) {
  const challenges = indieChallenges(project);
  const story = indieText(project.story);
  const extra = extras.filter(Boolean);
  if (!story && !challenges && !extra.length) return null;
  const details = el('details', 'indie-details');
  const summary = el('summary', 'indie-details__summary');
  if (title) {
    summary.appendChild(title);
  } else {
    summary.append(el('span', '', t('projects.inside')), el('span', 'visually-hidden', ': ' + project.title));
  }
  summary.appendChild(hidden(el('span', 'indie-details__icon', '+')));
  details.appendChild(summary);
  const panel = el('div', 'indie-details__panel');
  if (story) panel.appendChild(el('p', 'indie-details__story', story));
  if (challenges) {
    panel.appendChild(el('p', 'label indie-details__label', t('projects.challenges')));
    panel.appendChild(challenges);
  }
  extra.forEach(node => panel.appendChild(node));
  details.appendChild(panel);
  return details;
}

/** Projeto em destaque: célula da grade 2×2, detalhes recolhidos. */
function renderIndieCard(project, index) {
  const article = el('article', 'indie-card');
  article.id = 'indie-' + project.id;
  const titleId = article.id + '-title';
  article.setAttribute('aria-labelledby', titleId);

  const meta = el('p', 'indie-card__meta');
  meta.appendChild(hidden(el('span', 'indie-card__number', pad(index + 1))));
  if (indieText(project.kind)) meta.appendChild(el('span', 'indie-card__kind', indieText(project.kind)));
  article.appendChild(meta);
  const title = el('h3', 'indie-card__title', project.title);
  title.id = titleId;
  article.appendChild(title);
  if (indieText(project.tagline)) article.appendChild(el('p', 'indie-card__tagline', indieText(project.tagline)));
  const highlights = indieHighlights(project);
  if (highlights) article.appendChild(highlights);
  const stack = indieStackLine(project, 'indie-card__stack');
  if (stack) article.appendChild(stack);

  const foot = el('div', 'indie-card__foot');
  const status = indieStatus(project, 'indie-card__status');
  if (status) foot.appendChild(status);
  const repo = indieRepoLink(project, 'indie-card__repo');
  if (repo) foot.appendChild(repo);
  if (foot.childNodes.length) article.appendChild(foot);

  const details = indieDetails(project);
  if (details) article.appendChild(details);
  return article;
}

/** Demais projetos: uma linha cada (título · proposta · stack), expansível. */
function renderIndieLine(project) {
  const li = el('li', 'indie-line');
  li.id = 'indie-' + project.id;
  const head = el('span', 'indie-line__head');
  head.appendChild(el('span', 'indie-line__title', project.title));
  if (indieText(project.tagline)) head.appendChild(el('span', 'indie-line__tagline', indieText(project.tagline)));
  const stack = list(project.stack);
  if (stack.length) head.appendChild(el('span', 'indie-line__stack', stack.slice(0, 3).join(' · ')));

  const facts = el('div', 'indie-line__facts');
  if (indieText(project.kind)) facts.appendChild(el('p', 'indie-line__kind', indieText(project.kind)));
  const fullStack = indieStackLine(project, 'indie-line__stack-full');
  if (fullStack) facts.appendChild(fullStack);
  const status = indieStatus(project, 'indie-line__status');
  if (status) facts.appendChild(status);
  const repo = indieRepoLink(project, 'indie-line__repo');
  if (repo) facts.appendChild(repo);

  const details = indieDetails(project, { title: head, extras: [facts.childNodes.length ? facts : null] });
  if (details) {
    details.classList.add('indie-line__details');
    li.appendChild(details);
  } else {
    li.appendChild(head);
  }
  return li;
}

function renderIndependentProjects() {
  const root = document.getElementById('independent-list');
  if (!root) return;
  root.replaceChildren();
  const projects = list(INDEPENDENT_PROJECTS).filter(project => project && project.id && project.title);
  root.closest('section')?.toggleAttribute('hidden', !projects.length);
  if (!projects.length) return;

  const featured = projects.filter(project => project.featured).slice(0, 4);
  const rest = projects.filter(project => !featured.includes(project));
  if (featured.length) {
    const grid = el('div', 'indie__grid');
    grid.dataset.revealGroup = '';
    const reveal = revealer();
    featured.forEach((project, index) => grid.appendChild(reveal(renderIndieCard(project, index))));
    root.appendChild(grid);
  }
  if (rest.length) {
    const wrap = el('div', 'indie-more');
    wrap.dataset.revealGroup = '';
    const reveal = revealer();
    const heading = reveal(el('h3', 'label indie-more__label', t('projects.more')));
    heading.id = 'indie-more-title';
    const ul = reveal(el('ul', 'indie-more__list'));
    ul.setAttribute('aria-labelledby', heading.id);
    rest.forEach(project => ul.appendChild(renderIndieLine(project)));
    wrap.append(heading, ul);
    root.appendChild(wrap);
  }
}

/* ---------- 06 contact + footer ---------- */

function renderContact() {
  const closing = P.closing || {};
  const statement = document.getElementById('contact-statement');
  if (statement) statement.textContent = txt(closing.statement) || t('contact.statement');
  const text = document.getElementById('contact-text');
  if (text) {
    const value = txt(closing.text);
    text.textContent = value;
    text.hidden = !value;
  }
  const cta = document.getElementById('contact-cta');
  if (cta) cta.href = mailto();

  const root = document.getElementById('contact-list');
  if (!root) return;
  root.replaceChildren();
  const add = (href, label, external) => {
    if (!href || !label) return;
    const li = el('li');
    const link = el('a', '', label);
    link.href = href;
    if (external) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.append(document.createTextNode(' '), hidden(el('span', '', '↗')));
    }
    li.appendChild(link);
    root.appendChild(li);
  };
  // mailto/tel sem target; externos com rel noopener.
  add(CONTACT.email && 'mailto:' + CONTACT.email, CONTACT.email, false);
  add(CONTACT.linkedin, 'LinkedIn', true);
  add(CONTACT.github, 'GitHub', true);
  add(CONTACT.phoneHref || (CONTACT.phone && 'tel:' + CONTACT.phone.replace(/[^\d+]/g, '')), CONTACT.phone, false);
}

function renderFooter() {
  const legal = document.getElementById('footer-legal');
  if (!legal) return;
  const company = P.company || {};
  const parts = ['© 2026 ' + (P.name || 'Bruno Silva')];
  if (company.name) parts.push(company.name);
  if (company.taxID) parts.push(t('footer.cnpj') + ' ' + company.taxID);
  legal.textContent = parts.join(' · ');
}

/* ---------- reveal ---------- */

function initReveal() {
  const groups = document.querySelectorAll('[data-reveal-group]');
  const show = group => group.querySelectorAll('.reveal').forEach(node => node.classList.add('is-visible'));
  const showGroup = group => {
    if (group.classList.contains('reveal')) group.classList.add('is-visible');
    show(group);
  };
  if (REDUCED_MOTION.matches || !('IntersectionObserver' in window)) {
    groups.forEach(showGroup);
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      showGroup(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  groups.forEach(group => observer.observe(group));
}

/* ---------- boot ---------- */

/** Renderiza a página inteira; cada bloco limpa o próprio contêiner, então pode rodar de novo sobre HTML pré-renderizado. */
function render() {
  applyCopy();
  renderHero();
  renderCaseSelector();
  renderCapabilities();
  renderApproach();
  renderTrajectory();
  renderIndependentProjects();
  renderContact();
  renderFooter();
  initReveal();
}

render();
initShell({
  sections: [
    { id: 'cases', index: '01', label: t('nav.cases') },
    { id: 'depth', index: '02', label: t('nav.depth') },
    { id: 'work', index: '03', label: t('nav.work') },
    { id: 'trajectory', index: '04', label: t('nav.trajectory') },
    { id: 'projects', index: '05', label: t('shell.projects') },
    { id: 'contact', index: '06', label: t('nav.contact') },
  ].filter(section => document.getElementById(section.id)),
});
