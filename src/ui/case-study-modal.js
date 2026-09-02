import { tr, ts } from '../i18n/i18n.js';

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return r + ',' + g + ',' + b;
}

function ensureModal() {
  let modal = document.getElementById('case-study-modal');
  if (modal) return modal;
  modal = document.createElement('div');
  modal.id = 'case-study-modal';
  modal.innerHTML =
    '<div class="modal-backdrop"></div>' +
    '<div class="modal-card cs-card">' +
    '<div class="cs-header">' +
    '<button class="modal-close">&times;</button>' +
    '<div class="cs-badges"><span class="cs-badge-case"></span><span class="cs-badge-confidential"></span></div>' +
    '<h3 class="modal-title cs-title"></h3>' +
    '<div class="modal-role cs-subtitle"></div>' +
    '</div>' +
    '<div class="cs-body"></div>' +
    '</div>';
  document.body.appendChild(modal);
  modal.querySelector('.modal-backdrop').addEventListener('click', closeCaseStudyModal);
  modal.querySelector('.modal-close').addEventListener('click', closeCaseStudyModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCaseStudyModal();
  });
  return modal;
}

function sectionTitle(text) {
  const h = document.createElement('h4');
  h.className = 'cs-section-title';
  h.textContent = text;
  return h;
}

function bulletList(items, className) {
  const ul = document.createElement('ul');
  ul.className = className;
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = tr(item);
    ul.appendChild(li);
  });
  return ul;
}

export function openCaseStudyModal(cs) {
  const modal = ensureModal();
  const accent = cs.color || '#f97373';
  modal.querySelector('.cs-card').style.setProperty('--cs-accent', accent);
  const badgeCase = modal.querySelector('.cs-badge-case');
  badgeCase.textContent = ts('cases.badge');
  badgeCase.style.cssText = 'background:rgba(' + hexToRgb(accent) + ',0.15);color:' + accent;
  modal.querySelector('.cs-badge-confidential').textContent = ts('cases.confidential');
  modal.querySelector('.cs-title').textContent = tr(cs.name);
  modal.querySelector('.cs-subtitle').textContent = tr(cs.subtitle);

  const body = modal.querySelector('.cs-body');
  body.innerHTML = '';

  const problem = document.createElement('div');
  problem.className = 'cs-problem';
  problem.appendChild(sectionTitle(ts('cases.problemSolves')));
  const problemText = document.createElement('p');
  problemText.textContent = tr(cs.problem);
  problem.appendChild(problemText);
  body.appendChild(problem);

  if (cs.solution?.length) {
    const solution = document.createElement('div');
    solution.className = 'cs-solution';
    solution.appendChild(sectionTitle(ts('cases.solution')));
    solution.appendChild(bulletList(cs.solution, 'cs-list'));
    body.appendChild(solution);
  }

  if (cs.components?.length) {
    const components = document.createElement('div');
    components.className = 'cs-components';
    components.appendChild(sectionTitle(ts('cases.components')));
    cs.components.forEach(c => {
      const item = document.createElement('div');
      item.className = 'cs-component';
      const name = document.createElement('div');
      name.className = 'cs-component-name';
      name.textContent = tr(c.name);
      const stack = document.createElement('div');
      stack.className = 'cs-component-stack';
      stack.textContent = tr(c.stack);
      const desc = document.createElement('p');
      desc.className = 'cs-component-desc';
      desc.textContent = tr(c.desc);
      item.append(name, stack, desc);
      components.appendChild(item);
    });
    body.appendChild(components);
  }

  if (cs.domainChallenges?.length) {
    const challenges = document.createElement('div');
    challenges.className = 'cs-challenges';
    challenges.appendChild(sectionTitle(ts('cases.challenges')));
    challenges.appendChild(bulletList(cs.domainChallenges, 'cs-list'));
    body.appendChild(challenges);
  }

  if (cs.engineeringHighlights?.length) {
    const highlights = document.createElement('div');
    highlights.className = 'cs-highlights';
    highlights.appendChild(sectionTitle(ts('cases.highlights')));
    highlights.appendChild(bulletList(cs.engineeringHighlights, 'cs-list'));
    body.appendChild(highlights);
  }

  if (cs.impact) {
    const impact = document.createElement('div');
    impact.className = 'cs-impact';
    impact.appendChild(sectionTitle(ts('cases.impact')));
    const impactText = document.createElement('p');
    impactText.textContent = tr(cs.impact);
    impact.appendChild(impactText);
    body.appendChild(impact);
  }

  if (cs.confidential) {
    const note = document.createElement('p');
    note.className = 'cs-confidential';
    note.textContent = ts('cases.confidentialNote');
    body.appendChild(note);
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

export function closeCaseStudyModal() {
  const modal = document.getElementById('case-study-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}
