import { CASE_STUDIES } from '../data/case-studies.js';
import { EDUCATION, EXPERIENCE } from '../data/experience.js';
import { DEFAULT_PROJECTS, PROJECT_VIEWS } from '../data/projects.js';
import { applyStaticTranslations, initLangToggle, tr, ts } from '../i18n/i18n.js';
import { openCaseStudyModal } from '../ui/case-study-modal.js';

const GITHUB_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>';

const TECH_START_YEAR = 2021;

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return r + ',' + g + ',' + b;
}

function getViewRepos(view) {
  return view.repoIds
    .map(id => DEFAULT_PROJECTS.find(p => p.id === id))
    .filter(Boolean);
}

function getViewTechs(view, limit) {
  const techs = [];
  for (const repo of getViewRepos(view)) {
    for (const t of repo.tech) {
      if (!techs.includes(t)) techs.push(t);
    }
  }
  return limit ? techs.slice(0, limit) : techs;
}

function viewHasDemo(view) {
  return getViewRepos(view).some(repo => repo.links.demo);
}

function repoCountLabel(count) {
  return count === 1 ? ts('projects.one') : count + ' ' + ts('projects.many');
}

function buildRepoEntry(repo) {
  const entry = document.createElement('div');
  entry.className = 'modal-repo-entry';

  if (repo.caseStudy && CASE_STUDIES[repo.caseStudy]) {
    const btn = document.createElement('button');
    btn.className = 'modal-repo modal-repo-case';
    btn.type = 'button';
    btn.innerHTML = '<span>' + repo.title + '</span><span class="card-case-badge">' + ts('cases.badge') + '</span>';
    btn.addEventListener('click', () => openCaseStudyModal(CASE_STUDIES[repo.caseStudy]));
    entry.appendChild(btn);
  } else if (repo.links.github) {
    const a = document.createElement('a');
    a.className = 'modal-repo';
    a.href = repo.links.github;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.innerHTML = GITHUB_ICON + '<span>' + repo.title + '</span>' +
      (repo.links.demo ? '<span class="card-demo-badge">' + ts('projects.demo') + '</span>' : '');
    entry.appendChild(a);
  } else {
    const div = document.createElement('div');
    div.className = 'modal-repo modal-repo-static';
    div.innerHTML = '<span>' + repo.title + '</span>';
    entry.appendChild(div);
  }

  const desc = document.createElement('p');
  desc.className = 'modal-repo-desc';
  desc.textContent = tr(repo.desc);
  entry.appendChild(desc);
  return entry;
}

function openProjectModal(view) {
  if (view.isCaseStudy && CASE_STUDIES[view.caseStudy]) {
    openCaseStudyModal(CASE_STUDIES[view.caseStudy]);
    return;
  }
  const repos = getViewRepos(view);
  const tagEl = document.getElementById('modal-tag');
  tagEl.textContent = repoCountLabel(repos.length);
  tagEl.style.cssText = 'background:rgba(' + hexToRgb(view.color) + ',0.15);color:' + view.color;
  document.getElementById('modal-title').textContent = tr(view.displayName || view.name);
  document.getElementById('modal-role').textContent = repos[0]?.role || '';
  document.getElementById('modal-desc').textContent = tr(view.desc);

  const techsEl = document.getElementById('modal-techs');
  techsEl.innerHTML = '';
  getViewTechs(view, 12).forEach(t => {
    const s = document.createElement('span');
    s.className = 'modal-tech';
    s.textContent = t;
    techsEl.appendChild(s);
  });

  const linksEl = document.getElementById('modal-links');
  linksEl.innerHTML = '';
  const list = document.createElement('div');
  list.className = 'modal-repo-list';
  repos.forEach(repo => list.appendChild(buildRepoEntry(repo)));
  linksEl.appendChild(list);

  document.getElementById('project-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  document.getElementById('project-modal').classList.remove('active');
  document.body.style.overflow = '';
}

function renderCards() {
  const container = document.getElementById('project-cards');
  if (!container) return;
  container.innerHTML = '';
  PROJECT_VIEWS.forEach(view => {
    const repos = getViewRepos(view);
    const card = document.createElement('div');
    card.className = 'project-card reveal';
    card.style.setProperty('--card-accent', view.color);
    const mainRepo = repos[0];
    const showGithub = !view.isCaseStudy && mainRepo?.links.github;
    const badges =
      (view.isCaseStudy ? '<span class="card-case-badge">' + ts('cases.badge') + '</span>' : '') +
      (viewHasDemo(view) ? '<span class="card-demo-badge">' + ts('projects.demo') + '</span>' : '');
    card.innerHTML =
      (showGithub ? '<a href="' + mainRepo.links.github + '" target="_blank" rel="noopener noreferrer" class="card-github-icon">' + GITHUB_ICON + '</a>' : '') +
      '<div class="project-card-header"><span class="project-card-tag" style="background:rgba(' + hexToRgb(view.color) + ',0.15);color:' + view.color + '">' +
      repoCountLabel(repos.length) + '</span>' + badges +
      '<h3 class="project-card-title">' + tr(view.displayName || view.name) + '</h3></div>' +
      '<p class="project-card-desc">' + tr(view.desc) + '</p>' +
      '<div class="project-card-techs">' + getViewTechs(view, 4).map(t => '<span class="project-card-tech">' + t + '</span>').join('') + '</div>';
    card.querySelector('.card-github-icon')?.addEventListener('click', e => e.stopPropagation());
    card.addEventListener('click', () => openProjectModal(view));
    container.appendChild(card);
  });
}

function renderCaseStudyCards() {
  const container = document.getElementById('case-study-cards');
  if (!container) return;
  container.innerHTML = '';
  Object.values(CASE_STUDIES).forEach(cs => {
    const card = document.createElement('div');
    card.className = 'cs-highlight-card reveal';
    card.style.setProperty('--cs-accent', cs.color);
    card.innerHTML =
      '<div class="cs-highlight-badges"><span class="card-case-badge">' + ts('cases.badge') + '</span></div>' +
      '<h3 class="cs-highlight-title">' + tr(cs.name) + '</h3>' +
      '<p class="cs-highlight-subtitle">' + tr(cs.subtitle) + '</p>' +
      '<div class="cs-highlight-block"><span class="cs-highlight-label">' + ts('cases.problem') + '</span>' +
      '<p>' + tr(cs.problem) + '</p></div>' +
      '<div class="cs-highlight-block"><span class="cs-highlight-label">' + ts('cases.impact') + '</span>' +
      '<p>' + tr(cs.impact) + '</p></div>' +
      '<button type="button" class="cs-highlight-cta">' + ts('cases.view') + ' →</button>';
    card.addEventListener('click', () => openCaseStudyModal(cs));
    container.appendChild(card);
  });
}

function renderExperience() {
  const container = document.getElementById('experience-timeline');
  if (!container) return;
  container.innerHTML = '';
  EXPERIENCE.forEach(exp => {
    const item = document.createElement('div');
    item.className = 'timeline-item reveal';
    item.innerHTML =
      '<div class="timeline-dot"></div>' +
      '<div class="timeline-content">' +
      '<span class="timeline-period">' + tr(exp.period) + '</span>' +
      '<h3 class="timeline-role">' + tr(exp.role) + '</h3>' +
      '<div class="timeline-company">' + exp.company + ' · ' + tr(exp.location) + '</div>' +
      '<p class="timeline-summary">' + tr(exp.summary) + '</p>' +
      '<ul class="timeline-bullets">' + exp.bullets.map(b => '<li>' + tr(b) + '</li>').join('') + '</ul>' +
      '</div>';
    container.appendChild(item);
  });

  const edu = document.createElement('div');
  edu.className = 'timeline-item timeline-education reveal';
  edu.innerHTML =
    '<div class="timeline-dot"></div>' +
    '<div class="timeline-content">' +
    '<span class="timeline-period">' + tr(EDUCATION.period) + '</span>' +
    '<h3 class="timeline-role">' + tr(EDUCATION.degree) + '</h3>' +
    '<div class="timeline-company">' + tr(EDUCATION.school) + '</div>' +
    '</div>';
  container.appendChild(edu);
}

function renderStats() {
  const projects = DEFAULT_PROJECTS.filter(p => !p.isCenter);
  const techs = new Set();
  projects.forEach(p => p.tech.forEach(t => techs.add(t)));
  const caseStudies = projects.filter(p => p.caseStudy).length;
  const years = new Date().getFullYear() - TECH_START_YEAR;
  const stats = {
    'stat-years': years + '+',
    'stat-projects': projects.length,
    'stat-techs': techs.size + '+',
    'stat-cases': caseStudies,
  };
  for (const [id, value] of Object.entries(stats)) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
}

function initReveal() {
  const targets = document.querySelectorAll('.reveal, .port-section .section-title, .timeline-item, .how-card');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach(el => el.classList.add('revealed'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

applyStaticTranslations();
initLangToggle();
renderStats();
renderExperience();
renderCaseStudyCards();
renderCards();
initReveal();
document.querySelector('#project-modal .modal-backdrop')?.addEventListener('click', closeProjectModal);
document.querySelector('#project-modal .modal-close')?.addEventListener('click', closeProjectModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeProjectModal();
});
