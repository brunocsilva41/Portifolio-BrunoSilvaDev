import { CASE_STUDIES } from '../data/case-studies.js';
import { PROJECT_GROUPS } from '../data/projects.js';
import { tr, ts } from '../i18n/i18n.js';

function renderCaseDetails(container, project) {
  container.innerHTML = '';
  const cs = project.caseStudy && CASE_STUDIES[project.caseStudy];
  if (!cs) return;

  const addSection = (titleKey, contentEl) => {
    const section = document.createElement('div');
    section.className = 'space-cs-section';
    const h = document.createElement('h4');
    h.textContent = ts(titleKey);
    section.appendChild(h);
    section.appendChild(contentEl);
    container.appendChild(section);
  };

  const problem = document.createElement('p');
  problem.textContent = tr(cs.problem);
  addSection('cases.problemSolves', problem);

  if (cs.solution?.length) {
    const ul = document.createElement('ul');
    cs.solution.forEach(item => {
      const li = document.createElement('li');
      li.textContent = tr(item);
      ul.appendChild(li);
    });
    addSection('cases.solution', ul);
  }

  if (cs.impact) {
    const impact = document.createElement('p');
    impact.textContent = tr(cs.impact);
    addSection('cases.impact', impact);
  }

  const note = document.createElement('p');
  note.className = 'space-cs-note';
  note.textContent = ts('cases.confidentialNote');
  container.appendChild(note);
}

export function showProjectOverlay(project) {
  const overlay = document.getElementById('project-overlay');
  if (!overlay) return;
  const pTag = document.getElementById('p-tag');
  const pTitle = document.getElementById('p-title');
  const pRole = document.getElementById('p-role');
  const pDesc = document.getElementById('p-desc');
  const tc = document.getElementById('p-tech');
  const lc = document.getElementById('p-links');
  const qrSection = document.getElementById('p-qr');
  if (pTag) pTag.textContent = tr(project.tag);
  const pGroup = document.getElementById('p-group');
  if (pGroup) {
    const group = project.group && PROJECT_GROUPS[project.group];
    if (group) {
      pGroup.textContent = group.label;
      pGroup.style.color = group.color;
      pGroup.style.display = '';
    } else {
      pGroup.style.display = 'none';
    }
  }
  if (pTitle) pTitle.textContent = project.title;
  if (pRole) pRole.textContent = tr(project.role) || '';
  if (pDesc) pDesc.textContent = tr(project.desc);
  const pCase = document.getElementById('p-case');
  if (pCase) renderCaseDetails(pCase, project);
  if (tc) {
    tc.innerHTML = '';
    project.tech.forEach(t => {
      const s = document.createElement('span');
      s.textContent = t;
      tc.appendChild(s);
    });
  }
  if (lc) {
    lc.innerHTML = '';
    if (project.links.github) {
      const a = document.createElement('a');
      a.href = project.links.github; a.target = '_blank'; a.className = 'btn-primary';
      a.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> GitHub';
      lc.appendChild(a);
    }
  }
  if (qrSection) {
    if (project.isCenter) {
      qrSection.style.display = 'block';
      const qrImg = document.getElementById('qr-img');
      if (qrImg) qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('https://github.com/brunocsilva41')}`;
    } else {
      qrSection.style.display = 'none';
    }
  }
  overlay.classList.add('active');
}

export function hideProjectOverlay() {
  document.getElementById('project-overlay')?.classList.remove('active');
}

export function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._hide);
  el._hide = setTimeout(() => el.classList.remove('show'), 3000);
}
