import { getLang, initLangToggle, localePath } from '../i18n/i18n.js';

const MOBILE_QUERY = '(max-width: 860px)';
const RAIL_QUERY = '(min-width: 1100px)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
const CROSSFADE_MS = 160;
/* Mirrors --dur-3: the target lights once the beam has finished drawing. */
const BEAM_MS = 480;
const COUNT_MS = 900;
const COUNT_THRESHOLD = 0.4;
const REFRESH_DEBOUNCE_MS = 120;
/* Minimum distance (in progress units) between two consecutive rail ticks. */
const MIN_TICK_GAP = 0.02;
/* Horizontal gaps between the rail, the beam and its target, in px. */
const BEAM_START_GAP = 8;
const BEAM_END_GAP = 12;

const clamp01 = value => Math.min(1, Math.max(0, value));
const mediaQuery = query => (typeof window.matchMedia === 'function'
  ? window.matchMedia(query)
  : { matches: false, addEventListener() {}, removeEventListener() {} });

let activeShell = null;

/* ==========================================================================
   Count-up
   ========================================================================== */

const countState = new WeakMap();
let countObserver = null;

function localeFor(lang) {
  return lang === 'en' ? 'en-US' : 'pt-BR';
}

function readCount(el) {
  const raw = (el.getAttribute('data-count') || '').trim();
  const to = Number(raw);
  if (!raw || !Number.isFinite(to)) return null;

  const decimalsAttr = Number.parseInt(el.getAttribute('data-count-decimals') ?? '', 10);
  const inferred = raw.includes('.') ? raw.split('.')[1].length : 0;
  const decimals = Number.isFinite(decimalsAttr) && decimalsAttr >= 0 ? Math.min(decimalsAttr, 6) : inferred;
  const prefix = el.getAttribute('data-count-prefix') ?? '';
  const suffix = el.getAttribute('data-count-suffix') ?? '';
  const formatter = new Intl.NumberFormat(localeFor(getLang()), {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return { to, format: value => `${prefix}${formatter.format(value)}${suffix}` };
}

function runCount(el) {
  const spec = readCount(el);
  countState.set(el, 'done');
  if (!spec) return;
  if (mediaQuery(REDUCED_QUERY).matches) {
    el.textContent = spec.format(spec.to);
    return;
  }
  const start = performance.now();
  const step = now => {
    if (!el.isConnected) return;
    const k = clamp01((now - start) / COUNT_MS);
    if (k >= 1) {
      el.textContent = spec.format(spec.to);
      return;
    }
    const eased = 1 - (1 - k) ** 3;
    el.textContent = spec.format(spec.to * eased);
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function getCountObserver() {
  if (countObserver) return countObserver;
  countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.intersectionRatio < COUNT_THRESHOLD) return;
      countObserver.unobserve(entry.target);
      runCount(entry.target);
    });
  }, { threshold: [COUNT_THRESHOLD] });
  return countObserver;
}

/**
 * Animates every not-yet-initialised `[data-count]` element under `root` once,
 * when it is at least 40% visible. Final text is always
 * `prefix + Intl.NumberFormat(to) + suffix`.
 * Reduced motion (or no IntersectionObserver): final value is written immediately.
 * Safe to call repeatedly; already handled elements are skipped.
 * @param {ParentNode} [root=document]
 */
export function initCountUp(root = document) {
  if (!root) return;
  const elements = [];
  if (root.nodeType === 1 && root.hasAttribute('data-count')) elements.push(root);
  if (typeof root.querySelectorAll === 'function') elements.push(...root.querySelectorAll('[data-count]'));

  const immediate = mediaQuery(REDUCED_QUERY).matches || !('IntersectionObserver' in window);
  elements.forEach(el => {
    if (countState.has(el)) return;
    const spec = readCount(el);
    if (!spec) {
      countState.set(el, 'skip');
      return;
    }
    if (immediate) {
      countState.set(el, 'done');
      el.textContent = spec.format(spec.to);
      return;
    }
    countState.set(el, 'pending');
    el.textContent = spec.format(0);
    getCountObserver().observe(el);
  });
}

/* ==========================================================================
   Page meta
   ========================================================================== */

function setMetaContent(name, content) {
  if (!content) return;
  let meta = document.head.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

/**
 * Writes the document title, description and (when given) robots directive
 * from a `pageMeta()` result, so the live page matches the prerendered head.
 * @param {{ title?: string, description?: string, robots?: string } | null} meta
 * @param {{ noindex?: boolean }} [options] `noindex` forces a robots directive containing noindex.
 */
export function applyPageMeta(meta, { noindex = false } = {}) {
  if (meta?.title) document.title = meta.title;
  setMetaContent('description', meta?.description);
  const robots = meta?.robots || '';
  if (noindex) setMetaContent('robots', /noindex/i.test(robots) ? robots : 'noindex');
  else if (robots) setMetaContent('robots', robots);
}

/* ==========================================================================
   Shell
   ========================================================================== */

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function ensureId(el, position) {
  if (el.id) return el.id;
  const base = `rail-${slugify(el.dataset.railLabel) || slugify(el.dataset.railIndex) || position + 1}`;
  let id = base;
  let n = 2;
  while (document.getElementById(id)) id = `${base}-${n++}`;
  el.id = id;
  return id;
}

/** Scroll progress (0..1) at which each element's top crosses the viewport centre. */
function activationPoints(elements, maxScroll) {
  const half = window.innerHeight * 0.5;
  const scrollY = window.scrollY;
  const points = elements.map(el => {
    if (maxScroll <= 0) return 0;
    const top = el.getBoundingClientRect().top + scrollY;
    return clamp01((top - half) / maxScroll);
  });
  /* Keep ticks strictly ordered and distinct, also for short trailing sections. */
  for (let i = points.length - 2; i >= 0; i -= 1) {
    points[i] = Math.max(0, Math.min(points[i], points[i + 1] - MIN_TICK_GAP));
  }
  for (let i = 1; i < points.length; i += 1) {
    points[i] = Math.max(points[i], points[i - 1]);
  }
  return points;
}

function lastReached(points, progress) {
  let index = -1;
  for (let i = 0; i < points.length; i += 1) {
    if (points[i] <= progress + 1e-4) index = i;
  }
  return index;
}

/**
 * Shared navigation shell: scroll progress, current-section indicator,
 * mobile menu, language toggle, signal rail and count-up.
 * Calling it again replaces the previous instance.
 * @param {{ sections?: Array<{ id: string, index: string, label: string }> }} [options]
 *   Sections for the nav indicator; when empty they are derived from `[data-rail]`.
 * @returns {{ destroy: () => void, refresh: () => void }}
 */
export function initShell({ sections = [] } = {}) {
  activeShell?.destroy();

  const cleanups = [];
  const on = (target, type, handler, opts) => {
    target.addEventListener(type, handler, opts);
    cleanups.push(() => target.removeEventListener(type, handler, opts));
  };
  const onMedia = (mql, handler) => {
    mql.addEventListener('change', handler);
    cleanups.push(() => mql.removeEventListener('change', handler));
  };

  initLangToggle();
  const lang = getLang();
  /* Static internal links follow the page language (idempotent; prerendered EN pages are already prefixed). */
  document.querySelectorAll('a[href^="/"]').forEach(link => {
    const href = link.getAttribute('href');
    const localized = localePath(href, lang);
    if (localized !== href) link.setAttribute('href', localized);
  });

  const root = document.documentElement;
  const nav = document.querySelector('.site-nav');
  const reducedMotion = mediaQuery(REDUCED_QUERY);
  const mobile = mediaQuery(MOBILE_QUERY);
  const railQuery = mediaQuery(RAIL_QUERY);
  const explicitSections = Array.isArray(sections) ? sections.filter(section => section?.id) : [];

  /* ---- Nav current indicator ---- */
  const current = nav?.querySelector('.site-nav__current') ?? null;
  const indexEl = nav?.querySelector('.site-nav__current-index') ?? null;
  const labelEl = nav?.querySelector('.site-nav__current-label') ?? null;
  const links = nav ? [...nav.querySelectorAll('.site-nav__link[data-section]')] : [];
  const home = {
    id: '',
    index: '00',
    label: document.body?.dataset.shellLabel || (lang === 'en' ? 'Home' : 'Início'),
  };

  let activeId = '';
  let swapTimer = 0;

  const writeIndicator = section => {
    if (indexEl) indexEl.textContent = section.index ?? '';
    if (labelEl) labelEl.textContent = section.label ?? '';
  };

  const setNavCurrent = section => {
    if (section.id === activeId) return;
    activeId = section.id;

    links.forEach(link => {
      if (section.id && link.dataset.section === section.id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });

    if (!current) return;
    clearTimeout(swapTimer);
    if (reducedMotion.matches) {
      current.classList.remove('is-changing');
      writeIndicator(section);
      return;
    }
    current.classList.add('is-changing');
    swapTimer = setTimeout(() => {
      writeIndicator(section);
      current.classList.remove('is-changing');
    }, CROSSFADE_MS);
  };
  cleanups.push(() => clearTimeout(swapTimer));
  writeIndicator(home);

  /* ---- State shared by layout / frame ---- */
  let tracked = [];        // nav indicator sections [{ id, index, label, el }]
  let trackedPoints = [];
  let railSections = [];   // [{ el, id, index, label, target, accents[] }]
  let railPoints = [];
  let railSignature = '';
  let rail = null;
  let railTrack = null;
  let railSignal = null;
  let railTrail = null;
  let railItems = [];
  let beam = null;
  let trackHeight = 0;
  let railX = 0;
  let navBottom = 0;

  let currentIndex = -2;   // -2 = never painted, -1 = before the first section
  let currentAccent = null;
  let beamDrawn = false;
  let beamTimer = 0;
  let litTarget = null;
  let frameId = 0;

  const railActive = () => Boolean(rail) && railQuery.matches;

  /* ---- Rail DOM ---- */
  const removeRail = () => {
    rail?.remove();
    beam?.remove();
    rail = railTrack = railSignal = railTrail = beam = null;
    railItems = [];
  };

  const buildRail = () => {
    removeRail();
    /* A prerendered page already carries a serialized rail/beam: drop it before building the live one. */
    document.querySelectorAll('body > .signal-rail, body > .signal-beam').forEach(el => el.remove());
    if (!railSections.length) return;

    rail = document.createElement('nav');
    rail.className = 'signal-rail';
    rail.setAttribute('aria-label', lang === 'en' ? 'Section navigation' : 'Navegação por seções');

    const line = document.createElement('span');
    line.className = 'signal-rail__line';
    line.setAttribute('aria-hidden', 'true');
    railTrail = document.createElement('span');
    railTrail.className = 'signal-rail__trail';
    railTrail.setAttribute('aria-hidden', 'true');

    railTrack = document.createElement('ol');
    railTrack.className = 'signal-rail__list';
    railItems = railSections.map(section => {
      const item = document.createElement('li');
      item.className = 'signal-rail__item';
      const link = document.createElement('a');
      link.className = 'signal-rail__tick';
      link.href = `#${section.id}`;
      const mark = document.createElement('span');
      mark.className = 'signal-rail__mark';
      mark.setAttribute('aria-hidden', 'true');
      const text = document.createElement('span');
      text.className = 'signal-rail__text';
      const index = document.createElement('span');
      index.className = 'signal-rail__index';
      index.textContent = section.index;
      const label = document.createElement('span');
      label.className = 'signal-rail__label';
      label.textContent = section.label;
      if (section.index && section.label) text.append(index, document.createTextNode(' '), label);
      else text.append(section.index ? index : label);
      link.append(mark, text);
      item.append(link);
      railTrack.append(item);
      return { item, link };
    });

    railSignal = document.createElement('span');
    railSignal.className = 'signal-rail__signal';
    railSignal.setAttribute('aria-hidden', 'true');

    rail.append(line, railTrail, railTrack, railSignal);

    beam = document.createElement('span');
    beam.className = 'signal-beam';
    beam.setAttribute('aria-hidden', 'true');
    const beamLine = document.createElement('span');
    beamLine.className = 'signal-beam__line';
    beam.append(beamLine);

    document.body.append(rail, beam);
  };

  /* ---- Section discovery ---- */
  const scan = () => {
    const found = [...document.querySelectorAll('[data-rail]')];
    railSections = found.map((el, position) => {
      const id = ensureId(el, position);
      return {
        el,
        id,
        index: el.dataset.railIndex || String(position + 1).padStart(2, '0'),
        label: el.dataset.railLabel || '',
        target: el.querySelector('[data-rail-target]'),
        accents: [...el.querySelectorAll('[data-accent]')],
      };
    });

    const signature = railSections.map(s => `${s.id}|${s.index}|${s.label}`).join('§');
    const sameElements = rail && railItems.length === railSections.length
      && railItems.every((entry, i) => entry.link.getAttribute('href') === `#${railSections[i].id}`);
    if (signature !== railSignature || !sameElements) {
      railSignature = signature;
      clearLit();
      document.querySelectorAll('[data-rail-target].is-lit').forEach(el => el.classList.remove('is-lit'));
      document.querySelectorAll('.is-current[data-rail], [data-rail][style*="--rail-lit"]').forEach(el => {
        el.classList.remove('is-current');
        el.style.removeProperty('--rail-lit');
      });
      buildRail();
      currentIndex = -2;
      beamDrawn = false;
    }
    root.classList.toggle('has-signal-rail', railSections.length > 0);

    const source = explicitSections.length
      ? explicitSections
      : railSections.map(({ id, index, label }) => ({ id, index, label }));
    tracked = source
      .map(section => ({ ...section, el: document.getElementById(section.id) }))
      .filter(section => section.el);
  };

  /* ---- Layout (positions depend on document height) ---- */
  const layout = () => {
    const maxScroll = root.scrollHeight - window.innerHeight;
    trackedPoints = activationPoints(tracked.map(s => s.el), maxScroll);
    railPoints = activationPoints(railSections.map(s => s.el), maxScroll);
    railItems.forEach((entry, i) => {
      entry.item.style.setProperty('--p', railPoints[i].toFixed(4));
      // Rótulo cresce para dentro do trilho: para baixo na metade de cima, para cima na de baixo.
      entry.item.classList.toggle('is-lower', railPoints[i] > 0.5);
    });
    if (rail) {
      const rect = rail.getBoundingClientRect();
      trackHeight = rect.height;
      railX = rect.left;
    }
    navBottom = nav ? Math.max(0, nav.getBoundingClientRect().bottom) : 0;
  };

  /* ---- Current section / beam ---- */
  const clearLit = () => {
    clearTimeout(beamTimer);
    litTarget?.classList.remove('is-lit');
    litTarget = null;
  };

  const light = target => {
    clearLit();
    if (!target) return;
    target.classList.add('is-lit');
    litTarget = target;
  };

  const hideBeam = () => beam?.classList.remove('is-visible');

  const drawBeam = section => {
    beamDrawn = true;
    if (!beam) return;
    if (reducedMotion.matches) {
      beam.classList.add('is-drawn');
      light(section.target);
      return;
    }
    beam.classList.remove('is-drawn');
    void beam.offsetWidth; // restart the scaleX transition
    beam.classList.add('is-drawn');
    clearTimeout(beamTimer);
    beamTimer = setTimeout(() => light(section.target), BEAM_MS);
  };

  const updateBeam = section => {
    if (!beam || !section || !section.target || !railActive()) {
      hideBeam();
      return;
    }
    const rect = section.target.getBoundingClientRect();
    const visible = rect.height > 0 && rect.bottom > navBottom && rect.top < window.innerHeight;
    const x0 = railX + BEAM_START_GAP;
    const width = rect.left - BEAM_END_GAP - x0;
    if (!visible || width < BEAM_START_GAP) {
      hideBeam();
      return;
    }
    beam.style.transform = `translate3d(${Math.round(x0)}px, ${Math.round(rect.top + rect.height / 2)}px, 0)`;
    beam.style.width = `${Math.round(width)}px`;
    beam.classList.add('is-visible');
    if (!beamDrawn) drawBeam(section);
  };

  const pickAccent = section => {
    if (!section) return null;
    const half = window.innerHeight * 0.5;
    let best = null;
    let bestDistance = Infinity;
    section.accents.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.height <= 0 || rect.bottom <= 0 || rect.top >= window.innerHeight) return;
      const distance = rect.top <= half && rect.bottom >= half
        ? 0
        : Math.min(Math.abs(rect.top - half), Math.abs(rect.bottom - half));
      if (distance < bestDistance) {
        bestDistance = distance;
        best = el;
      }
    });
    const source = best || section.el.closest('[data-accent]');
    return source ? source.getAttribute('data-accent') || '' : null;
  };

  const applyAccent = (section, accent) => {
    if (accent === currentAccent) return;
    currentAccent = accent;
    [rail, beam].forEach(el => {
      if (!el) return;
      if (accent === null) el.removeAttribute('data-accent');
      else el.setAttribute('data-accent', accent);
    });
    if (section && rail && typeof getComputedStyle === 'function') {
      const color = getComputedStyle(rail).getPropertyValue('--rail-color').trim();
      if (color) section.el.style.setProperty('--rail-lit', color);
    }
  };

  const setRailCurrent = index => {
    if (index === currentIndex) return;
    const previous = railSections[currentIndex];
    if (previous) {
      previous.el.classList.remove('is-current');
      previous.el.style.removeProperty('--rail-lit');
    }
    currentIndex = index;
    clearLit();
    beamDrawn = false;
    beam?.classList.remove('is-drawn');
    hideBeam();
    currentAccent = undefined;

    railItems.forEach((entry, i) => {
      entry.item.classList.toggle('is-passed', i <= index);
      entry.item.classList.toggle('is-current', i === index);
      if (i === index) entry.link.setAttribute('aria-current', 'true');
      else entry.link.removeAttribute('aria-current');
    });

    const section = railSections[index];
    if (!section) return;
    section.el.classList.add('is-current');
    /* Without the beam (narrow screens) the target lights straight away. */
    if (!railActive()) light(section.target);
  };

  const frame = () => {
    frameId = 0;
    const maxScroll = root.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? clamp01(window.scrollY / maxScroll) : 0;
    nav?.style.setProperty('--progress', progress.toFixed(4));

    const navIndex = lastReached(trackedPoints, maxScroll > 0 ? progress : 1);
    setNavCurrent(navIndex >= 0 ? tracked[navIndex] : home);

    if (!railSections.length) return;
    const index = lastReached(railPoints, maxScroll > 0 ? progress : 1);
    setRailCurrent(index);
    const section = railSections[index];
    applyAccent(section, pickAccent(section));

    if (!railActive()) {
      hideBeam();
      return;
    }
    const position = reducedMotion.matches ? (index >= 0 ? railPoints[index] : 0) : progress;
    if (railSignal) railSignal.style.transform = `translate3d(0, ${(position * trackHeight).toFixed(1)}px, 0)`;
    if (railTrail) railTrail.style.transform = `scaleY(${position.toFixed(4)})`;
    rail.classList.toggle('is-idle', index < 0);
    updateBeam(section);
  };

  const requestFrame = () => {
    if (!frameId) frameId = requestAnimationFrame(frame);
  };
  cleanups.push(() => frameId && cancelAnimationFrame(frameId));

  const relayout = () => {
    layout();
    requestFrame();
  };

  const refresh = () => {
    scan();
    initCountUp(document);
    relayout();
  };

  scan();
  layout();
  frame();
  initCountUp(document);

  on(window, 'scroll', requestFrame, { passive: true });
  on(window, 'resize', relayout, { passive: true });
  on(window, 'load', relayout);
  onMedia(railQuery, () => {
    beamDrawn = false;
    if (railSections[currentIndex] && !railActive()) light(railSections[currentIndex].target);
    else clearLit();
    relayout();
  });

  if (typeof ResizeObserver === 'function' && document.body) {
    const resizeObserver = new ResizeObserver(() => relayout());
    resizeObserver.observe(document.body);
    cleanups.push(() => resizeObserver.disconnect());
  }

  if (typeof MutationObserver === 'function') {
    const watched = document.querySelector('main') || document.body;
    let refreshTimer = 0;
    const isCountTick = record => {
      const node = record.target;
      const el = node.nodeType === 1 ? node : node.parentElement;
      return Boolean(el?.closest?.('[data-count]'));
    };
    const mutationObserver = new MutationObserver(records => {
      if (records.every(isCountTick)) return;
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(refresh, REFRESH_DEBOUNCE_MS);
    });
    if (watched) mutationObserver.observe(watched, { childList: true, subtree: true });
    cleanups.push(() => {
      clearTimeout(refreshTimer);
      mutationObserver.disconnect();
    });
  }

  /* ---- Mobile menu ---- */
  const toggle = nav?.querySelector('.site-nav__toggle');
  const menu = nav?.querySelector('.site-nav__menu');

  if (nav && toggle && menu) {
    const isOpen = () => nav.classList.contains('is-open');
    const setOpen = (open, { returnFocus = false } = {}) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (!open && returnFocus) toggle.focus();
    };

    on(toggle, 'click', () => setOpen(!isOpen()));
    on(document, 'keydown', event => {
      if (event.key === 'Escape' && isOpen()) {
        event.preventDefault();
        setOpen(false, { returnFocus: true });
      }
    });
    on(document, 'click', event => {
      if (isOpen() && !nav.contains(event.target)) setOpen(false);
    });
    on(menu, 'click', event => {
      if (isOpen() && event.target instanceof Element && event.target.closest('a[href]')) setOpen(false);
    });
    onMedia(mobile, event => {
      if (!event.matches && isOpen()) setOpen(false);
    });

    setOpen(false);
  }

  cleanups.push(() => {
    clearLit();
    railSections.forEach(section => {
      section.el.classList.remove('is-current');
      section.el.style.removeProperty('--rail-lit');
    });
    removeRail();
    root.classList.remove('has-signal-rail');
  });

  const shell = {
    refresh,
    destroy() {
      cleanups.splice(0).forEach(fn => fn());
      if (activeShell === shell) activeShell = null;
    },
  };
  activeShell = shell;
  return shell;
}

/**
 * Re-scans `[data-rail]` sections and `[data-count]` elements and recomputes
 * rail positions. Use after rendering content asynchronously (it also runs
 * automatically, debounced, when `main` changes).
 */
export function refreshShell() {
  activeShell?.refresh();
}
