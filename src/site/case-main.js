import {
  CASE_CATEGORIES,
  caseTechnologyText,
  caseText,
  caseUrl,
  getAdjacentCase,
  getCaseBySlug,
  metricStatusText,
} from '../data/case-view-model.js';
import { PROFILE } from '../data/profile.js';
import { pageMeta, pagePath } from '../config/seo.js';
import { getLang, localePath } from '../i18n/i18n.js';
import { applyPageMeta, initShell } from './shell.js';
import { renderArchitectureBoard } from './architecture-board.js';

const COPY = {
  pt: {
    skip: 'Pular para o conteúdo',
    navMenu: 'Menu', navAria: 'Navegação principal', langAria: 'Idioma',
    navCases: 'Cases', navDepth: 'Profundidade', navHire: 'Como trabalho', navTrajectory: 'Trajetória', navContact: 'Contato', navSpace: 'Visão espacial',
    home: 'Início',
    caseLabel: 'Case',
    facts: { client: 'Cliente', period: 'Período', team: 'Equipe', role: 'Papel', stack: 'Stack', confidentiality: 'Confidencialidade' },
    confidentialityValue: 'Dados de clientes preservados',
    chapters: {
      visao: { rail: 'Visão geral' },
      numeros: { rail: 'Números', title: 'Resultados em números' },
      contexto: { rail: 'Contexto', title: 'O contexto do negócio' },
      desafio: { rail: 'Desafio', title: 'O desafio' },
      solucao: { rail: 'Solução', title: 'O que entreguei' },
      'como-funciona': {
        rail: 'Como funciona', title: 'Como funciona',
        intro: 'Siga o trabalho atravessando o sistema, etapa por etapa, ou clique em qualquer componente do quadro para ver o que ele faz.',
      },
      componentes: { rail: 'Componentes', title: 'Componentes do sistema' },
      decisoes: { rail: 'Decisões', title: 'Decisões que sustentam o sistema' },
      resultados: { rail: 'Resultados', title: 'Resultado para o negócio' },
      papel: { rail: 'Meu papel', title: 'Meu papel' },
      stack: { rail: 'Stack', title: 'Stack por camada' },
      licoes: { rail: 'Lições', title: 'O que levo deste projeto' },
    },
    client: 'Cliente',
    purpose: 'O que resolve',
    mechanism: 'Como funciona',
    tradeoffs: 'Trade-offs assumidos',
    recap: 'Em números',
    responsibilities: 'Pelo que respondi',
    technologies: 'Tecnologias',
    boardHint: 'Percorra o fluxo abaixo',
    walk: {
      label: 'Percorra o fluxo',
      steps: 'Etapas do fluxo',
      keys: 'trocam de etapa',
      count: (current, total) => `Etapa ${String(current).padStart(2, '0')} de ${String(total).padStart(2, '0')}`,
      total: total => `${total} ${total === 1 ? 'etapa' : 'etapas'}`,
      introTitle: 'Do começo ao fim',
      introText: 'Escolha uma etapa ou pressione Reproduzir para acompanhar o fluxo inteiro. Enquanto isso, o quadro destaca por onde o trabalho passa.',
      controls: 'Controles do percurso',
      prev: 'Anterior', next: 'Próximo', play: 'Reproduzir', pause: 'Pausar', whole: 'Mostrar fluxo completo',
    },
    next: 'Próximo case',
    closing: 'Qual é o próximo sistema que a sua empresa precisa?',
    closingAction: 'Escrever um e-mail',
    engagements: 'Como trabalho',
    closingSubject: caseTitle => `Conversa a partir do case ${caseTitle}`,
    floatCta: 'Conversar',
    footerNote: '© 2026 Bruno Silva · BC Consultoria e Desenvolvimento de Softwares · CNPJ 60.589.106/0001-02',
    errorIndex: 'Ver o índice de cases',
    errorHome: 'Voltar ao início',
    errorKicker: 'Case não encontrado',
    errorMissingTitle: 'Este endereço não aponta para nenhum case.',
    errorMissingText: 'Falta o identificador do case no link. Todos os cases publicados estão no índice.',
    errorUnknownTitle: 'Não encontrei esse case.',
    errorUnknownText: 'O link pode ter mudado ou ter um erro de digitação. Os cases publicados continuam no índice.',
  },
  en: {
    skip: 'Skip to content',
    navMenu: 'Menu', navAria: 'Main navigation', langAria: 'Language',
    navCases: 'Cases', navDepth: 'Depth', navHire: 'How I work', navTrajectory: 'Career', navContact: 'Contact', navSpace: 'Space view',
    home: 'Home',
    caseLabel: 'Case',
    facts: { client: 'Client', period: 'Period', team: 'Team', role: 'Role', stack: 'Stack', confidentiality: 'Confidentiality' },
    confidentialityValue: 'Client data kept private',
    chapters: {
      visao: { rail: 'Overview' },
      numeros: { rail: 'Numbers', title: 'Results in numbers' },
      contexto: { rail: 'Context', title: 'The business context' },
      desafio: { rail: 'Challenge', title: 'The challenge' },
      solucao: { rail: 'Solution', title: 'What I delivered' },
      'como-funciona': {
        rail: 'How it works', title: 'How it works',
        intro: 'Follow the work through the system step by step, or click any component on the board to see what it does.',
      },
      componentes: { rail: 'Components', title: 'System components' },
      decisoes: { rail: 'Decisions', title: 'Decisions that hold the system up' },
      resultados: { rail: 'Results', title: 'Business results' },
      papel: { rail: 'My role', title: 'My role' },
      stack: { rail: 'Stack', title: 'Stack by layer' },
      licoes: { rail: 'Lessons', title: 'What I take from this project' },
    },
    client: 'Client',
    purpose: 'What it solves',
    mechanism: 'How it works',
    tradeoffs: 'Trade-offs I accepted',
    recap: 'By the numbers',
    responsibilities: 'What I owned',
    technologies: 'Technologies',
    boardHint: 'Walk through the flow below',
    walk: {
      label: 'Walk through the flow',
      steps: 'Flow steps',
      keys: 'change step',
      count: (current, total) => `Step ${String(current).padStart(2, '0')} of ${String(total).padStart(2, '0')}`,
      total: total => `${total} ${total === 1 ? 'step' : 'steps'}`,
      introTitle: 'From start to finish',
      introText: 'Pick a step or press Play to follow the whole flow. The board highlights where the work goes as you move along.',
      controls: 'Walkthrough controls',
      prev: 'Previous', next: 'Next', play: 'Play', pause: 'Pause', whole: 'Show the whole flow',
    },
    next: 'Next case',
    closing: 'What’s the next system your business needs?',
    closingAction: 'Send an email',
    engagements: 'How I work',
    closingSubject: caseTitle => `A conversation about the ${caseTitle} case`,
    floatCta: 'Let’s talk',
    footerNote: '© 2026 Bruno Silva · BC Consultoria e Desenvolvimento de Softwares · CNPJ 60.589.106/0001-02',
    errorIndex: 'See the case index',
    errorHome: 'Back to home',
    errorKicker: 'Case not found',
    errorMissingTitle: 'This address does not point to a case.',
    errorMissingText: 'The link is missing the case identifier. Every published case is listed in the index.',
    errorUnknownTitle: 'I could not find that case.',
    errorUnknownText: 'The link may have changed or contain a typo. The published cases are all in the index.',
  },
};

const STEP_MS = 4500;
const ICONS = {
  prev: 'M3 2v10M12 2 5 7l7 5z',
  next: 'M11 2v10M2 2l7 5-7 5z',
  play: 'M3 1.5 12 7l-9 5.5z',
  pause: 'M3 2h3v10H3zM8 2h3v10H8z',
};

const lang = getLang();
const copy = COPY[lang] || COPY.pt;
const byId = id => document.getElementById(id);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const pad = value => String(value).padStart(2, '0');

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function icon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 14 14');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('class', 'walkthrough__icon');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', ICONS[name]);
  svg.appendChild(path);
  return svg;
}

const t = value => caseText(value, lang).trim();
const textList = values => (Array.isArray(values) ? values.map(t).filter(Boolean) : []);

function applyCopy() {
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  document.querySelectorAll('[data-copy]').forEach(element => {
    const value = copy[element.dataset.copy];
    if (typeof value === 'string') element.textContent = value;
  });
  document.querySelectorAll('[data-copy-label]').forEach(element => {
    const value = copy[element.dataset.copyLabel];
    if (typeof value === 'string') element.setAttribute('aria-label', value);
  });
}

/* ---------- Reveal ---------- */

const revealObserver = !reducedMotion.matches && 'IntersectionObserver' in window
  ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.reveal').forEach(node => node.classList.add('is-visible'));
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 })
  : null;

function markReveal(nodes) {
  nodes.filter(Boolean).forEach((node, index) => {
    node.classList.add('reveal');
    node.style.setProperty('--i', String(Math.min(index, 8)));
  });
}

function observeReveal(container) {
  if (revealObserver) revealObserver.observe(container);
  else container.querySelectorAll('.reveal').forEach(node => node.classList.add('is-visible'));
}

/* ---------- Metrics ---------- */

function metricBlock(metric, { compact = false } = {}) {
  const block = el('div', compact ? 'metric metric--compact' : 'metric');
  const provisional = metric.basis === 'estimated' || metric.basis === 'illustrative';
  if (provisional) block.dataset.basis = metric.basis;
  const value = el('span', 'metric__value', t(metric.value));
  const count = metric.count;
  if (count && Number.isFinite(Number(count.to))) {
    value.setAttribute('data-count', String(count.to));
    if (count.prefix) value.setAttribute('data-count-prefix', count.prefix);
    const suffix = typeof count.suffix === 'string' ? count.suffix : caseText(count.suffix, lang);
    if (suffix) value.setAttribute('data-count-suffix', suffix);
    if (count.decimals) value.setAttribute('data-count-decimals', String(count.decimals));
  }
  block.appendChild(value);
  const label = t(metric.label);
  if (label) block.appendChild(el('span', 'metric__label', label));
  const context = t(metric.context);
  if (context && !compact) block.appendChild(el('span', 'metric__context', context));
  // Only estimates and visual examples carry a status; nothing is rendered otherwise.
  const status = provisional ? metricStatusText(metric, lang).trim() : '';
  if (status) block.appendChild(el('span', 'metric__status', status));
  return block;
}

function usableMetrics(item) {
  return (item.metrics || []).filter(metric => t(metric.value)).slice(0, 4);
}

/* ---------- Hero ---------- */

function renderHero(item) {
  const title = t(item.title);
  const hero = byId('visao');
  hero.setAttribute('data-rail', '');
  hero.dataset.railIndex = '01';
  hero.dataset.railLabel = copy.chapters.visao.rail;

  const number = byId('case-number');
  number.textContent = `${copy.caseLabel} ${item.number}`;
  number.style.viewTransitionName = `case-number-${item.slug}`;
  byId('case-category').textContent = t(CASE_CATEGORIES[item.category]);

  const heading = byId('case-title');
  heading.textContent = title;
  heading.style.viewTransitionName = `case-title-${item.slug}`;

  [['case-pitch', item.pitch], ['case-summary', item.summary]].forEach(([id, value]) => {
    const text = t(value);
    byId(id).textContent = text;
    byId(id).hidden = !text;
  });

  const crumb = byId('case-crumb');
  crumb.textContent = title;
  crumb.hidden = false;

  const facts = byId('case-facts');
  facts.replaceChildren();
  const stack = (item.technologies || []).slice(0, 6).map(value => caseTechnologyText(value, lang)).join(' · ');
  [
    ['client', t(item.client), ''],
    ['period', t(item.period), 'case-facts__value--mono'],
    ['team', t(item.team), ''],
    ['role', t(item.roleTitle), ''],
    ['stack', stack, 'case-facts__value--mono'],
    ['confidentiality', item.confidentiality?.level ? copy.confidentialityValue : '', 'case-facts__value--quiet'],
  ].forEach(([key, value, modifier]) => {
    if (!value) return;
    const group = el('div', `case-facts__item case-facts__item--${key}`);
    group.append(el('dt', 'label', copy.facts[key]), el('dd', `case-facts__value ${modifier}`.trim(), value));
    facts.appendChild(group);
  });
  facts.hidden = facts.childElementCount === 0;
}

/* ---------- Chapter scaffolding ---------- */

function createChapter(id, { band = false, intro = '' } = {}) {
  const meta = copy.chapters[id];
  const section = el('section', `case-chapter case-chapter--${id}${band ? ' band band--raised' : ''}`);
  section.id = id;
  section.setAttribute('data-rail', '');
  section.dataset.railLabel = meta.rail;
  section.setAttribute('aria-labelledby', `${id}-title`);
  const inner = el('div', 'container case-chapter__inner');
  const opener = el('header', 'section-opener case-chapter__opener');
  const index = el('span', 'section-opener__index');
  index.setAttribute('data-rail-target', '');
  const heading = el('h2', 'section-opener__title', meta.title || meta.rail);
  heading.id = `${id}-title`;
  opener.append(index, heading);
  const introText = intro || meta.intro || '';
  if (introText) opener.appendChild(el('p', 'section-opener__intro', introText));
  const body = el('div', 'case-chapter__body');
  inner.append(opener, body);
  section.appendChild(inner);
  return { id, section, inner, opener, index, body, mount: null, extra: [] };
}

function numbered(index) {
  const span = el('span', 'case-index', pad(index + 1));
  span.setAttribute('aria-hidden', 'true');
  return span;
}

/* ---------- Chapters ---------- */

function chapterNumbers(item) {
  const metrics = usableMetrics(item);
  if (!metrics.length) return null;
  const chapter = createChapter('numeros', { band: true });
  const list = el('ul', 'case-metrics');
  list.style.setProperty('--count', String(metrics.length));
  metrics.forEach(metric => {
    const li = el('li', 'case-metrics__item');
    li.appendChild(metricBlock(metric));
    list.appendChild(li);
  });
  chapter.body.appendChild(list);
  return chapter;
}

function chapterContext(item) {
  const context = t(item.businessContext);
  if (!context) return null;
  const chapter = createChapter('contexto');
  const client = t(item.client);
  if (client) {
    const side = el('dl', 'case-chapter__side');
    const row = el('div', 'case-side__item');
    row.append(el('dt', 'label', copy.client), el('dd', 'case-side__value', client));
    side.appendChild(row);
    const period = t(item.period);
    if (period) {
      const periodRow = el('div', 'case-side__item');
      periodRow.append(el('dt', 'label', copy.facts.period), el('dd', 'case-side__value case-side__value--mono', period));
      side.appendChild(periodRow);
    }
    chapter.body.appendChild(side);
  }
  chapter.body.appendChild(el('p', 'case-chapter__lede case-chapter__main', context));
  return chapter;
}

function chapterChallenge(item) {
  const problem = t(item.problem);
  const points = (item.challengePoints || []).filter(point => t(point.title));
  if (!problem && !points.length) return null;
  const chapter = createChapter('desafio');
  if (problem) chapter.body.appendChild(el('p', 'case-chapter__lede case-chapter__main', problem));
  if (points.length) {
    const list = el('ol', 'case-points');
    points.forEach((point, index) => {
      const li = el('li', 'case-points__item');
      li.append(numbered(index), el('h3', 'case-points__title', t(point.title)));
      const text = t(point.text);
      if (text) li.appendChild(el('p', 'case-points__text', text));
      list.appendChild(li);
    });
    chapter.body.appendChild(list);
  }
  return chapter;
}

function chapterSolution(item) {
  const solution = t(item.solution);
  const deliverables = (item.deliverables || []).filter(entry => t(entry.title));
  if (!solution && !deliverables.length) return null;
  const chapter = createChapter('solucao');
  if (solution) chapter.body.appendChild(el('p', 'case-chapter__text case-chapter__main', solution));
  if (deliverables.length) {
    const list = el('ol', 'case-deliverables');
    deliverables.forEach((entry, index) => {
      const li = el('li', 'case-deliverables__item');
      li.append(numbered(index), el('h3', 'case-deliverables__title', t(entry.title)));
      const text = t(entry.text);
      if (text) li.appendChild(el('p', 'case-deliverables__text', text));
      list.appendChild(li);
    });
    chapter.body.appendChild(list);
  }
  return chapter;
}

function chapterHowItWorks(item) {
  if (!item.architecture?.nodes?.length) return null;
  const steps = (item.walkthrough || []).filter(step => t(step.title));
  const chapter = createChapter('como-funciona', { band: true });
  const flow = el('div', 'case-flow');
  const boardHost = el('div', 'case-flow__board');
  const below = el('div', 'case-flow__below container');
  const inspectorHost = el('div', 'case-flow__inspector');
  flow.append(boardHost, below);
  chapter.section.appendChild(flow);
  chapter.extra.push(boardHost, below);

  chapter.mount = () => {
    let board;
    let walkthrough = null;
    try {
      board = renderArchitectureBoard(boardHost, item.architecture, {
        lang,
        inspectorHost,
        hintSuffix: steps.length ? copy.boardHint : '',
        onSelect: id => walkthrough?.detach(id),
      });
    } catch {
      return false;
    }
    if (!boardHost.childElementCount) return false;
    if (steps.length) {
      walkthrough = createWalkthrough(steps, board, flow);
      activeWalkthrough = walkthrough;
      below.append(walkthrough.root, inspectorHost);
    } else {
      below.classList.add('case-flow__below--solo');
      below.appendChild(inspectorHost);
    }
    return true;
  };
  return chapter;
}

/* ---------- Guided walkthrough ---------- */

function createWalkthrough(steps, board, flowRoot) {
  const w = copy.walk;
  const root = el('div', 'walkthrough');
  const labelId = 'walkthrough-label';

  const head = el('div', 'walkthrough__head');
  const label = el('p', 'label walkthrough__label', w.label);
  label.id = labelId;
  const keys = el('p', 'walkthrough__keys');
  keys.append(el('kbd', 'walkthrough__key', '←'), el('kbd', 'walkthrough__key', '→'), el('span', '', w.keys));
  head.append(label, keys);

  const list = el('ol', 'walkthrough__steps');
  list.setAttribute('aria-label', w.steps);
  const stepButtons = steps.map((step, index) => {
    const li = el('li', 'walkthrough__steps-item');
    const button = el('button', 'walkthrough__step');
    button.type = 'button';
    button.dataset.index = String(index);
    button.append(
      el('span', 'walkthrough__step-index', pad(index + 1)),
      el('span', 'walkthrough__step-title', t(step.title)),
    );
    const mark = el('span', 'walkthrough__step-mark', '+');
    mark.setAttribute('aria-hidden', 'true');
    const bar = el('span', 'walkthrough__step-bar');
    bar.setAttribute('aria-hidden', 'true');
    button.append(mark, bar);
    li.appendChild(button);
    list.appendChild(li);
    return button;
  });

  const panel = el('div', 'walkthrough__panel');
  panel.setAttribute('aria-live', 'polite');
  panel.setAttribute('aria-atomic', 'true');
  const count = el('p', 'label walkthrough__count');
  const title = el('h3', 'walkthrough__title');
  const text = el('p', 'walkthrough__text');
  const metric = el('p', 'walkthrough__metric');
  panel.append(count, title, text, metric);

  const controls = el('div', 'walkthrough__controls');
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', w.controls);
  const makeButton = (className, iconName, labelText, iconAfter = false) => {
    const button = el('button', `walkthrough__control ${className}`);
    button.type = 'button';
    const labelNode = el('span', 'walkthrough__control-label', labelText);
    if (iconName && !iconAfter) button.append(icon(iconName), labelNode);
    else if (iconName) button.append(labelNode, icon(iconName));
    else button.append(labelNode);
    return { button, labelNode };
  };
  const prev = makeButton('walkthrough__control--prev', 'prev', w.prev);
  const play = makeButton('walkthrough__control--play', 'play', w.play);
  const next = makeButton('walkthrough__control--next', 'next', w.next, true);
  const whole = makeButton('walkthrough__control--whole', '', w.whole);
  play.button.setAttribute('aria-pressed', 'false');
  controls.append(prev.button, play.button, next.button, whole.button);
  if (reducedMotion.matches) play.button.hidden = true;

  root.append(head, list, panel, controls);

  /* State */
  const state = { index: -1, playing: false, holds: new Set(), timer: 0 };

  const renderPanel = () => {
    const step = steps[state.index];
    if (!step) {
      count.textContent = w.total(steps.length);
      title.textContent = w.introTitle;
      text.textContent = w.introText;
      metric.textContent = '';
      metric.hidden = true;
      return;
    }
    count.textContent = w.count(state.index + 1, steps.length);
    title.textContent = t(step.title);
    text.textContent = t(step.text);
    const value = t(step.metric);
    metric.textContent = value;
    metric.hidden = !value;
  };

  const restartBar = () => {
    root.classList.remove('is-running');
    void root.offsetWidth;
    if (state.playing && !state.holds.size) root.classList.add('is-running');
  };

  const schedule = () => {
    window.clearTimeout(state.timer);
    state.timer = 0;
    const running = state.playing && !state.holds.size;
    root.classList.toggle('is-held', state.playing && state.holds.size > 0);
    if (!running) {
      root.classList.remove('is-running');
      return;
    }
    restartBar();
    state.timer = window.setTimeout(() => {
      if (state.index >= steps.length - 1) {
        setPlaying(false);
        return;
      }
      go(state.index + 1);
    }, STEP_MS);
  };

  const sync = () => {
    stepButtons.forEach((button, index) => {
      const current = index === state.index;
      button.classList.toggle('is-current', current);
      button.classList.toggle('is-done', index < state.index);
      if (current) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    prev.button.disabled = state.index <= 0;
    next.button.disabled = state.index >= steps.length - 1;
    whole.button.disabled = state.index < 0 && !root.classList.contains('is-detached');
    root.classList.toggle('has-step', state.index >= 0);
    renderPanel();
  };

  const go = (index, { focusStep = false } = {}) => {
    const bounded = Math.max(0, Math.min(steps.length - 1, index));
    state.index = bounded;
    root.classList.remove('is-detached');
    const step = steps[bounded];
    board.highlight({ nodes: step.nodes || [], edges: step.edges || [] });
    sync();
    if (focusStep) stepButtons[bounded].focus();
    if (state.playing) schedule();
  };

  const setPlaying = playing => {
    if (playing && reducedMotion.matches) return;
    state.playing = playing;
    play.button.setAttribute('aria-pressed', String(playing));
    play.labelNode.textContent = playing ? w.pause : w.play;
    play.button.querySelector('.walkthrough__icon path')?.setAttribute('d', ICONS[playing ? 'pause' : 'play']);
    // Live announcements are muted while the sequence advances on its own.
    panel.setAttribute('aria-live', playing ? 'off' : 'polite');
    root.classList.toggle('is-playing', playing);
    if (playing && (state.index < 0 || state.index >= steps.length - 1)) {
      go(0);
      return;
    }
    schedule();
  };

  const reset = () => {
    setPlaying(false);
    state.index = -1;
    root.classList.remove('is-detached');
    board.clearHighlight();
    sync();
  };

  const hold = reason => {
    state.holds.add(reason);
    if (state.playing) schedule();
  };
  const release = reason => {
    if (!state.holds.delete(reason)) return;
    if (state.playing) schedule();
  };

  /* Events */
  const listeners = [];
  const on = (target, type, handler, options) => {
    target.addEventListener(type, handler, options);
    listeners.push(() => target.removeEventListener(type, handler, options));
  };
  on(list, 'click', event => {
    const button = event.target.closest?.('button[data-index]');
    if (!button) return;
    go(Number(button.dataset.index));
  });
  on(prev.button, 'click', () => go(state.index - 1));
  on(next.button, 'click', () => go(state.index + 1));
  on(play.button, 'click', () => setPlaying(!state.playing));
  on(whole.button, 'click', reset);
  on(root, 'keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const onStep = Boolean(event.target.closest?.('.walkthrough__step'));
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      go(state.index + (event.key === 'ArrowRight' ? 1 : -1), { focusStep: onStep });
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      go(event.key === 'Home' ? 0 : steps.length - 1, { focusStep: onStep });
    }
  });

  // Pause while the reader explores: hovering or focusing the board, the step list or the step text.
  const boardStage = flowRoot.querySelector('.case-flow__board');
  [boardStage, list, panel].forEach((target, position) => {
    if (!target) return;
    const key = `hover-${position}`;
    on(target, 'pointerenter', () => hold(key));
    on(target, 'pointerleave', () => release(key));
  });
  if (boardStage) {
    on(boardStage, 'focusin', () => hold('focus-board'));
    on(boardStage, 'focusout', event => {
      if (!boardStage.contains(event.relatedTarget)) release('focus-board');
    });
  }
  on(list, 'focusin', () => hold('focus-steps'));
  on(list, 'focusout', event => {
    if (!list.contains(event.relatedTarget)) release('focus-steps');
  });
  on(document, 'visibilitychange', () => {
    if (document.visibilityState === 'hidden') hold('hidden');
    else release('hidden');
  });
  const onMotion = () => {
    play.button.hidden = reducedMotion.matches;
    if (reducedMotion.matches) setPlaying(false);
  };
  reducedMotion.addEventListener?.('change', onMotion);
  listeners.push(() => reducedMotion.removeEventListener?.('change', onMotion));

  sync();

  return {
    root,
    /** The reader picked a node on the board: stop the sequence and show the step list as detached. */
    detach(nodeId) {
      setPlaying(false);
      if (nodeId === null) {
        // Esc on the board returns it to the full flow; the stepper goes back to its overview.
        state.index = -1;
        root.classList.remove('is-detached');
      } else {
        root.classList.add('is-detached');
      }
      sync();
    },
    destroy() {
      window.clearTimeout(state.timer);
      listeners.splice(0).forEach(fn => fn());
    },
  };
}

/* ---------- Remaining chapters ---------- */

function chapterComponents(item) {
  const components = (item.components || []).filter(component => t(component.title));
  if (!components.length) return null;
  const chapter = createChapter('componentes');
  const list = el('ol', 'case-components');
  components.forEach((component, index) => {
    const li = el('li', 'case-component');
    li.append(numbered(index), el('h3', 'case-component__title', t(component.title)));
    const details = el('dl', 'case-component__details');
    [[copy.purpose, t(component.purpose)], [copy.mechanism, t(component.mechanism)]].forEach(([label, value]) => {
      if (!value) return;
      const group = el('div', 'case-component__detail');
      group.append(el('dt', 'label', label), el('dd', '', value));
      details.appendChild(group);
    });
    if (details.childElementCount) li.appendChild(details);
    const stack = (component.stack || []).map(value => caseTechnologyText(value, lang)).join(' · ');
    if (stack) li.appendChild(el('p', 'case-component__stack', stack));
    list.appendChild(li);
  });
  chapter.body.appendChild(list);
  return chapter;
}

function chapterDecisions(item) {
  const decisions = (item.decisions || [])
    .map(decision => ({ title: t(decision?.title), rationale: t(decision?.rationale) }))
    .filter(decision => decision.title || decision.rationale);
  const tradeoffs = textList(item.tradeoffs);
  if (!decisions.length && !tradeoffs.length) return null;
  const chapter = createChapter('decisoes');
  if (decisions.length) {
    const list = el('ol', 'case-decisions case-chapter__main');
    decisions.forEach((decision, index) => {
      const li = el('li', 'case-decisions__item');
      li.appendChild(numbered(index));
      if (decision.title) li.appendChild(el('h3', 'case-decisions__title', decision.title));
      if (decision.rationale) li.appendChild(el('p', 'case-decisions__text', decision.rationale));
      list.appendChild(li);
    });
    chapter.body.appendChild(list);
  }
  if (tradeoffs.length) {
    const aside = el('aside', 'case-notes');
    aside.appendChild(el('p', 'label', copy.tradeoffs));
    const notes = el('ul', 'case-notes__list');
    tradeoffs.forEach(note => notes.appendChild(el('li', 'case-notes__item', note)));
    aside.appendChild(notes);
    chapter.body.appendChild(aside);
  }
  return chapter;
}

function chapterResults(item) {
  const impact = textList(item.impact);
  if (!impact.length) return null;
  const chapter = createChapter('resultados');
  const list = el('ul', 'case-impact case-chapter__main');
  impact.forEach((entry, index) => {
    const li = el('li', 'case-impact__item');
    li.append(numbered(index), el('p', 'case-impact__text', entry));
    list.appendChild(li);
  });
  chapter.body.appendChild(list);
  const metrics = usableMetrics(item);
  if (metrics.length) {
    const aside = el('aside', 'case-recap');
    aside.appendChild(el('p', 'label', copy.recap));
    const recap = el('ul', 'case-recap__list');
    metrics.forEach(metric => {
      const li = el('li', 'case-recap__item');
      li.appendChild(metricBlock(metric, { compact: true }));
      recap.appendChild(li);
    });
    aside.appendChild(recap);
    chapter.body.appendChild(aside);
  }
  return chapter;
}

function chapterRole(item) {
  const role = t(item.role);
  const responsibilities = textList(item.responsibilities);
  if (!role && !responsibilities.length) return null;
  const chapter = createChapter('papel');
  const roleTitle = t(item.roleTitle);
  if (roleTitle) {
    const side = el('dl', 'case-chapter__side');
    const row = el('div', 'case-side__item');
    row.append(el('dt', 'label', copy.facts.role), el('dd', 'case-side__value', roleTitle));
    side.appendChild(row);
    const team = t(item.team);
    if (team) {
      const teamRow = el('div', 'case-side__item');
      teamRow.append(el('dt', 'label', copy.facts.team), el('dd', 'case-side__value', team));
      side.appendChild(teamRow);
    }
    chapter.body.appendChild(side);
  }
  if (role) chapter.body.appendChild(el('p', 'case-chapter__lede case-chapter__main', role));
  if (responsibilities.length) {
    const block = el('div', 'case-duties');
    block.appendChild(el('p', 'label', copy.responsibilities));
    const list = el('ul', 'case-duties__list');
    responsibilities.forEach(entry => list.appendChild(el('li', 'case-duties__item', entry)));
    block.appendChild(list);
    chapter.body.appendChild(block);
  }
  return chapter;
}

function chapterStack(item) {
  let groups = (item.stackGroups || [])
    .map(group => ({ label: t(group.label), items: (group.items || []).map(value => caseTechnologyText(value, lang)).filter(Boolean) }))
    .filter(group => group.label && group.items.length);
  if (!groups.length && item.technologies?.length) {
    groups = [{ label: copy.technologies, items: item.technologies.map(value => caseTechnologyText(value, lang)) }];
  }
  if (!groups.length) return null;
  const chapter = createChapter('stack', { band: true });
  const list = el('ul', 'case-stack');
  list.style.setProperty('--count', String(Math.min(groups.length, 4)));
  groups.forEach(group => {
    const li = el('li', 'case-stack__group');
    li.appendChild(el('h3', 'case-stack__label label', group.label));
    const items = el('ul', 'case-stack__items');
    group.items.forEach(name => items.appendChild(el('li', 'case-stack__item', name)));
    li.appendChild(items);
    list.appendChild(li);
  });
  chapter.body.appendChild(list);
  return chapter;
}

function chapterLessons(item) {
  const lessons = textList(item.lessons);
  if (!lessons.length) return null;
  const chapter = createChapter('licoes');
  const list = el('ol', 'case-lessons case-chapter__main');
  lessons.forEach((lesson, index) => {
    const li = el('li', 'case-lessons__item');
    li.append(numbered(index), el('p', 'case-lessons__text', lesson));
    list.appendChild(li);
  });
  chapter.body.appendChild(list);
  return chapter;
}

function revealTargets(chapter) {
  const targets = [chapter.opener];
  chapter.body.childNodes.forEach(node => {
    if (node.nodeType !== 1) return;
    if (node.matches('ol, ul')) targets.push(...node.children);
    else targets.push(node);
  });
  targets.push(...chapter.extra);
  return targets;
}

let activeWalkthrough = null;

function renderChapters(item) {
  const root = byId('case-chapters');
  activeWalkthrough?.destroy();
  activeWalkthrough = null;
  root.replaceChildren();
  const chapters = [
    chapterNumbers(item),
    chapterContext(item),
    chapterChallenge(item),
    chapterSolution(item),
    chapterHowItWorks(item),
    chapterComponents(item),
    chapterDecisions(item),
    chapterResults(item),
    chapterRole(item),
    chapterStack(item),
    chapterLessons(item),
  ].filter(Boolean).filter(chapter => {
    root.appendChild(chapter.section);
    if (!chapter.mount || chapter.mount()) return true;
    chapter.section.remove();
    return false;
  });

  chapters.forEach((chapter, position) => {
    // The hero is chapter 01; the rest follow without gaps.
    const index = pad(position + 2);
    chapter.index.textContent = index;
    chapter.section.dataset.railIndex = index;
    markReveal(revealTargets(chapter));
    observeReveal(chapter.section);
  });
  return chapters;
}

/* ---------- Next case, closing CTA, floating contact ---------- */

function renderNext(item) {
  const next = getAdjacentCase(item.slug);
  if (!next) return;
  byId('case-next-link').href = localePath(caseUrl(next));
  byId('case-next-number').textContent = next.number;
  byId('case-next-name').textContent = t(next.title);
  const pitch = t(next.pitch);
  const pitchEl = byId('case-next-pitch');
  pitchEl.textContent = pitch;
  pitchEl.hidden = !pitch;
  const section = byId('case-next');
  section.dataset.accent = next.accent;
  section.hidden = false;
}

function renderClosing(item) {
  const profile = PROFILE && typeof PROFILE === 'object' ? PROFILE : null;
  const statement = t(profile?.closing?.statement);
  if (statement) byId('closing-title').textContent = statement;
  const text = t(profile?.closing?.text);
  const textEl = byId('closing-text');
  textEl.textContent = text;
  textEl.hidden = !text;

  // Convite aberto: nenhum formato de contratação listado; o bloco antigo fica sempre oculto.
  byId('closing-engagements')?.replaceChildren();
  const block = byId('closing-engagements-block');
  if (block) block.hidden = true;

  const email = typeof profile?.contact?.email === 'string' ? profile.contact.email : '';
  if (!email) return;
  const caseTitle = t(item?.title);
  const primary = byId('closing-primary');
  if (primary) primary.href = caseTitle ? `mailto:${email}?subject=${encodeURIComponent(copy.closingSubject(caseTitle))}` : `mailto:${email}`;
}

let floatObservers = [];

function initFloatingCta() {
  floatObservers.splice(0).forEach(observer => observer.disconnect());
  const watch = (target, callback, options) => {
    const observer = new IntersectionObserver(callback, options);
    observer.observe(target);
    floatObservers.push(observer);
  };
  const cta = byId('case-float-cta');
  const hero = byId('visao');
  const closing = byId('contact');
  const flow = document.querySelector('.case-flow');
  if (!cta) return;
  cta.hidden = false;
  document.body.classList.add('has-float-cta');
  if (!('IntersectionObserver' in window)) return;
  const state = { heroPassed: false, nearClosing: false, overBoard: false };
  const update = () => {
    const visible = state.heroPassed && !state.nearClosing && !state.overBoard;
    cta.classList.toggle('is-hidden', !visible);
    if (visible) cta.removeAttribute('tabindex');
    else cta.setAttribute('tabindex', '-1');
  };
  cta.classList.add('is-hidden');
  cta.setAttribute('tabindex', '-1');
  if (hero) {
    watch(hero, entries => {
      entries.forEach(entry => { state.heroPassed = !entry.isIntersecting && entry.boundingClientRect.top < 0; });
      update();
    });
  }
  if (closing) {
    watch(closing, entries => {
      entries.forEach(entry => { state.nearClosing = entry.isIntersecting; });
      update();
    }, { rootMargin: '0px 0px 30% 0px' });
  }
  if (flow) {
    watch(flow, entries => {
      entries.forEach(entry => { state.overBoard = entry.isIntersecting; });
      update();
    }, { threshold: 0.1 });
  }
}

/* ---------- Error state ---------- */

function renderError(kind) {
  const missing = kind === 'missing';
  applyPageMeta(pageMeta({ page: 'notfound', lang }), { noindex: true });
  document.body.dataset.shellLabel = copy.errorKicker;
  delete byId('main-content').dataset.accent;
  byId('case-article').hidden = true;
  byId('case-crumb').hidden = true;
  byId('case-error-kicker').textContent = copy.errorKicker;
  byId('case-error-title').textContent = missing ? copy.errorMissingTitle : copy.errorUnknownTitle;
  byId('case-error-text').textContent = missing ? copy.errorMissingText : copy.errorUnknownText;
  byId('case-error').hidden = false;
  renderClosing(null);
  initShell({ sections: [] });
}

/* ---------- Init ---------- */

/** Slug from `/cases/<slug>` or `/en/cases/<slug>`; legacy `?slug=` as fallback. */
function requestedSlug() {
  const path = window.location.pathname.replace(/^\/en(?=\/|$)/, '');
  const match = path.match(/^\/cases\/([^/]+)\/?$/);
  if (match) {
    try {
      return decodeURIComponent(match[1]).trim();
    } catch {
      return match[1].trim();
    }
  }
  return (new URLSearchParams(window.location.search).get('slug') || '').trim();
}

/** Aliases and legacy `?slug=` links settle on the clean canonical path. */
function canonicalize(item) {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('slug');
    const path = pagePath({ page: 'case', lang, slug: item.slug });
    if (url.pathname === path && !window.location.search.includes('slug=')) return;
    window.history.replaceState(null, '', `${path}${url.search}${url.hash}`);
  } catch {
    /* Canonical URL is cosmetic; the case already rendered. */
  }
}

function render() {
  applyCopy();
  const requested = requestedSlug();
  if (!requested) {
    renderError('missing');
    return;
  }
  const item = getCaseBySlug(requested);
  if (!item) {
    renderError('unknown');
    return;
  }
  canonicalize(item);

  applyPageMeta(pageMeta({ page: 'case', lang, item }));
  document.head.querySelector('meta[name="robots"][content*="noindex"]')?.remove();
  document.body.dataset.shellLabel = t(item.title);
  const main = byId('main-content');
  main.dataset.accent = item.accent;

  byId('case-error').hidden = true;
  byId('case-article').hidden = false;
  renderHero(item);
  renderChapters(item);
  renderNext(item);
  renderClosing(item);

  initFloatingCta();
  initShell();
}

render();
