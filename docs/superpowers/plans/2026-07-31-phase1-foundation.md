# Phase 1 — Foundation (Refactor) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Behavior-preserving refactor — single data source in `src/data/`, modular space mode in `src/space/`, normal mode rendered from `PROJECT_VIEWS`, CSS extracted from HTML.

**Architecture:** Vite multi-entry (index.html + space.html) stays. `src/main.js` (1,091 lines) is split into `src/space/*` modules sharing a mutable `state`/`registry` singleton. `src/projects.js` (813 lines) splits into `src/data/{projects,storage,github}.js`. Normal mode gets `src/site/site-main.js` replacing the inline `<script>` and its duplicated `projectData`.

**Tech Stack:** Vite 8, vanilla JS ES modules, Three.js 0.184 (only runtime dep). No test framework — verification is `npm run build` + `node` smoke checks on pure modules + manual browser smoke tests.

## Global Constraints

- Behavior-preserving: both pages must look and behave exactly as before each commit.
- No new dependencies.
- All UI text stays Portuguese (i18n is Phase 4).
- Spec: `docs/superpowers/specs/2026-07-31-portfolio-professionalization-design.md`. Module additions vs spec: `space/state.js` and `space/overlay.js` (approved refinement to avoid circular imports).
- Success criteria per task: `npm run build` exits 0; manual smoke test passes.
- Manual smoke test (space mode) = load `/space.html`: loading screen types out, constellation renders, click planet → overlay + camera travel, close → camera returns, click constellation sun → travel + warp, nav-star buttons travel, view-btn switches PROJETOS/STACKS, overview-btn recenters, theme-btn cycles, import modal opens, delete/reset show toast and rebuild.
- Manual smoke test (normal mode) = load `/`: starfield background, navbar, hero, sobre, skills, project cards render, card click opens modal, ESC/backdrop/× closes, GitHub icons work.

---

### Task 1: Extract normal-mode CSS to `src/styles/site.css`

**Files:**
- Create: `src/styles/site.css`
- Modify: `index.html` (lines 9–545: the whole `<style>` block)

**Interfaces:**
- Produces: `/src/styles/site.css` linked from `index.html`. Later tasks (4) append to this file.

- [ ] **Step 1: Create `src/styles/site.css`**

Copy the exact contents of `index.html` lines 10–544 (everything between `<style>` and `</style>`, starting at `*, *::before, *::after { margin: 0; ... }` and ending with the `@media (max-width: 768px)` block's closing `}`) into `src/styles/site.css`. Do not alter any rule.

- [ ] **Step 2: Replace the style block in `index.html`**

Delete lines 9–545 (`<style>` through `</style>`) and put in their place:

```html
    <link rel="stylesheet" href="/src/styles/site.css" />
```

- [ ] **Step 3: Verify build and dev**

Run: `npm run build`
Expected: exit 0, `dist/` contains a CSS asset for the index entry.

Run: `npm run dev`, open `http://localhost:5173/`
Expected: page identical to before (starfield, navbar, hero, cards styled).

- [ ] **Step 4: Commit**

```bash
git add index.html src/styles/site.css
git commit -m "refactor: extract normal-mode CSS to src/styles/site.css"
```

---

### Task 2: Move space-mode CSS to `src/styles/space.css`

**Files:**
- Move: `src/style.css` → `src/styles/space.css`
- Modify: `space.html:8`

**Interfaces:**
- Produces: `/src/styles/space.css` linked from `space.html`.

- [ ] **Step 1: Move the file**

```bash
git mv src/style.css src/styles/space.css
```

- [ ] **Step 2: Update the link in `space.html`**

Line 8, change:

```html
    <link rel="stylesheet" href="/src/style.css" />
```

to:

```html
    <link rel="stylesheet" href="/src/styles/space.css" />
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: exit 0.

Run: `npm run dev`, open `http://localhost:5173/space.html`
Expected: space mode fully styled (loading screen, nav console, bottom bar).

- [ ] **Step 4: Commit**

```bash
git add space.html src/styles/space.css
git commit -m "refactor: move space-mode CSS to src/styles/space.css"
```

---

### Task 3: Split data layer into `src/data/{projects,storage,github}.js` and move import-ui to `src/ui/`

**Files:**
- Create: `src/data/projects.js`, `src/data/storage.js`, `src/data/github.js`
- Move: `src/import-ui.js` → `src/ui/import-ui.js`
- Modify: `src/main.js:7-8`, `src/ui/import-ui.js:1`
- Delete: `src/projects.js`

**Interfaces:**
- Produces (`src/data/projects.js`): `PROJECT_GROUPS`, `DEFAULT_PROJECTS`, `PROJECT_VIEWS`, `getProjectViewPositions()`, `getGroupPositions(projects)`, `getAbsolutePosition(project)`, `autoConnectProjects(projects)`, `generateColor(index)`, `COLORS` — identical signatures/content to current `src/projects.js`.
- Produces (`src/data/storage.js`): `loadProjects()`, `saveProjects(projects)`, `resetProjects()` — identical behavior, key `portfolio-projects-v2`.
- Produces (`src/data/github.js`): `parseGitHubUrl(url)`, `fetchRepoFromGitHub(url)`, `extractDescriptionFromReadme(readme)`, `extractTechFromReadme(readme)`, `compileProject(imported, projectsCount)` — identical behavior.

- [ ] **Step 1: Create `src/data/projects.js`**

Copy from current `src/projects.js`, keeping EXACTLY these parts (verbatim):
- Line 2 (`COLORS`), line 4 (`GROUP_RADIUS`), lines 6–37 (`PROJECT_GROUPS`), lines 39–541 (`DEFAULT_PROJECTS`), lines 543–593 (`PROJECT_VIEWS`), lines 595–608 (`getProjectViewPositions`), lines 632–646 (`getGroupPositions`), lines 648–659 (`getAbsolutePosition`), lines 661–699 (`autoConnectProjects`), lines 788–790 (`generateColor`).
- Add `export` to `COLORS`: `export const COLORS = [...]` (github.js task uses `generateColor`, keep it exported as today).

- [ ] **Step 2: Create `src/data/storage.js`**

```js
import { DEFAULT_PROJECTS } from './projects.js'

const STORAGE_KEY = 'portfolio-projects-v2'

export function loadProjects() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return structuredClone(DEFAULT_PROJECTS)
}

export function saveProjects(projects) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  } catch {}
}

export function resetProjects() {
  localStorage.removeItem(STORAGE_KEY)
  return structuredClone(DEFAULT_PROJECTS)
}
```

- [ ] **Step 3: Create `src/data/github.js`**

Copy verbatim from current `src/projects.js`: lines 701–705 (`parseGitHubUrl`), 707–731 (`fetchRepoFromGitHub`), 733–753 (`buildProjectFromGitHub`, stays non-exported), 755–765 (`extractDescriptionFromReadme`), 767–786 (`extractTechFromReadme`), 792–813 (`compileProject`). Add at top:

```js
import { generateColor } from './projects.js'
```

- [ ] **Step 4: Move import-ui and update imports**

```bash
git mv src/import-ui.js src/ui/import-ui.js
git rm src/projects.js
```

`src/ui/import-ui.js` line 1, change to:

```js
import { fetchRepoFromGitHub, compileProject } from '../data/github.js'
```

`src/main.js` lines 7–8, change to:

```js
import { autoConnectProjects, PROJECT_GROUPS, PROJECT_VIEWS } from './data/projects.js';
import { loadProjects, saveProjects, resetProjects } from './data/storage.js';
import { setupImportUI } from './ui/import-ui.js';
```

- [ ] **Step 5: Node smoke check on pure data module**

Run:
```bash
node --input-type=module -e "const m = await import('./src/data/projects.js'); console.log(m.DEFAULT_PROJECTS.length, m.PROJECT_VIEWS.length, typeof m.autoConnectProjects)"
```
Expected output: `45 8 function`

- [ ] **Step 6: Verify build + space smoke test**

Run: `npm run build` → exit 0. Run `npm run dev`, open `/space.html`, run the full space smoke test from Global Constraints (import modal included — it exercises `github.js`).

- [ ] **Step 7: Commit**

```bash
git add src/data/ src/ui/import-ui.js src/main.js
git commit -m "refactor: split data layer into src/data modules, move import-ui to src/ui"
```

---

### Task 4: Render normal mode from `PROJECT_VIEWS` via `src/site/site-main.js`

**Files:**
- Create: `src/site/site-main.js`
- Modify: `index.html` (remove entire inline `<script>` block with `projectData`, add module script; remove `onclick` attributes from modal), `src/styles/site.css` (append repo-list styles)

**Interfaces:**
- Consumes: `PROJECT_VIEWS`, `DEFAULT_PROJECTS` from `../data/projects.js` (Task 3).
- Produces: normal mode fully data-driven; 8 cards (one per PROJECT_VIEW); modal shows the view's repos with GitHub links.

- [ ] **Step 1: Create `src/site/site-main.js`**

```js
import { DEFAULT_PROJECTS, PROJECT_VIEWS } from '../data/projects.js';

const GITHUB_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>';

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

function openProjectModal(view) {
  const repos = getViewRepos(view);
  const tagEl = document.getElementById('modal-tag');
  tagEl.textContent = repos.length === 1 ? '1 repositório' : repos.length + ' repositórios';
  tagEl.style.cssText = 'background:rgba(' + hexToRgb(view.color) + ',0.15);color:' + view.color;
  document.getElementById('modal-title').textContent = view.name;
  document.getElementById('modal-role').textContent = repos[0]?.role || '';
  document.getElementById('modal-desc').textContent = view.desc;

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
  repos.forEach(repo => {
    const a = document.createElement('a');
    a.className = 'modal-repo';
    a.href = repo.links.github;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.innerHTML = GITHUB_ICON + '<span>' + repo.title + '</span>';
    list.appendChild(a);
  });
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
  PROJECT_VIEWS.forEach(view => {
    const repos = getViewRepos(view);
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.setProperty('--card-accent', view.color);
    const mainRepo = repos[0];
    card.innerHTML =
      (mainRepo ? '<a href="' + mainRepo.links.github + '" target="_blank" rel="noopener noreferrer" class="card-github-icon">' + GITHUB_ICON + '</a>' : '') +
      '<div class="project-card-header"><span class="project-card-tag" style="background:rgba(' + hexToRgb(view.color) + ',0.15);color:' + view.color + '">' +
      (repos.length === 1 ? '1 repositório' : repos.length + ' repositórios') + '</span>' +
      '<h3 class="project-card-title">' + view.name + '</h3></div>' +
      '<p class="project-card-desc">' + view.desc + '</p>' +
      '<div class="project-card-techs">' + getViewTechs(view, 4).map(t => '<span class="project-card-tech">' + t + '</span>').join('') + '</div>';
    card.querySelector('.card-github-icon')?.addEventListener('click', e => e.stopPropagation());
    card.addEventListener('click', () => openProjectModal(view));
    container.appendChild(card);
  });
}

renderCards();
document.querySelector('#project-modal .modal-backdrop')?.addEventListener('click', closeProjectModal);
document.querySelector('#project-modal .modal-close')?.addEventListener('click', closeProjectModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeProjectModal();
});
```

Note: all interpolated values (`view.name`, `view.desc`, `repo.title`, techs) come from the static `src/data/projects.js` file, not user input — innerHTML here matches the existing pattern and threat model.

- [ ] **Step 2: Update `index.html`**

1. Delete the entire inline `<script>...</script>` block (currently lines 684–779, containing `projectData`, `openProjectModal`, `closeProjectModal`, `hexToRgb` and listeners).
2. In its place add:

```html
    <script type="module" src="/src/site/site-main.js"></script>
```

3. Remove the `onclick="closeProjectModal()"` attributes from `.modal-backdrop` and `.modal-close` (site-main.js now attaches listeners).

- [ ] **Step 3: Append repo-list styles to `src/styles/site.css`**

```css
/* ── Modal repo list ── */
.modal-repo-list {
  display: flex; flex-direction: column; gap: 8px; width: 100%;
}
.modal-repo {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 10px 16px; border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(200, 215, 255, 0.07);
  color: rgba(200, 215, 255, 0.6);
  text-decoration: none; font-size: 12px; font-weight: 500;
  transition: all 0.3s ease;
}
.modal-repo:hover {
  background: rgba(108, 140, 255, 0.08);
  border-color: rgba(108, 140, 255, 0.25);
  color: #fff;
}
.modal-repo svg { width: 14px; height: 14px; flex-shrink: 0; }
```

- [ ] **Step 4: Verify**

Run: `npm run build` → exit 0. Run `npm run dev`, open `/`:
Expected: 8 cards (Café Gourmet, Casamento, Steuer & SEFAZ, Kippis, AI & Automação, Ferramentas DevOps, Aplicações Web, TrioOnline), each with repo-count tag, desc, up to 4 techs. Click card → modal with title, desc, techs, repo links. ESC/backdrop/× close it. `/space.html` still fully works.

- [ ] **Step 5: Commit**

```bash
git add index.html src/site/site-main.js src/styles/site.css
git commit -m "refactor: render normal mode from PROJECT_VIEWS, removing duplicated project data"
```

---

### Task 5: Move `src/main.js` to `src/space/space-main.js`

**Files:**
- Move: `src/main.js` → `src/space/space-main.js`
- Modify: `space.html:156`

**Interfaces:**
- Produces: `/src/space/space-main.js` as the space entry point. Tasks 6–9 extract modules out of it.

- [ ] **Step 1: Move and fix relative imports**

```bash
git mv src/main.js src/space/space-main.js
```

In `src/space/space-main.js`, update the imports (added in Task 3) to go one level up:

```js
import { autoConnectProjects, PROJECT_GROUPS, PROJECT_VIEWS } from '../data/projects.js';
import { loadProjects, saveProjects, resetProjects } from '../data/storage.js';
import { setupImportUI } from '../ui/import-ui.js';
```

- [ ] **Step 2: Update `space.html`**

Change the script tag (last line before `</body>`):

```html
    <script type="module" src="/src/space/space-main.js"></script>
```

- [ ] **Step 3: Verify**

`npm run build` → exit 0. `npm run dev` → `/space.html` full smoke test passes.

- [ ] **Step 4: Commit**

```bash
git add space.html src/space/space-main.js
git commit -m "refactor: move space entry point to src/space/space-main.js"
```

---

### Task 6: Extract `src/space/state.js` and `src/space/scene.js`

**Files:**
- Create: `src/space/state.js`, `src/space/scene.js`
- Modify: `src/space/space-main.js`

**Interfaces:**
- Produces (`state.js`): mutable singletons `state` and `registry` (exact shape below). All later modules import these.
- Produces (`scene.js`): `scene`, `camera`, `renderer`, `labelRenderer`, `composer`, `controls`, `starGroup`, `lineGroup`, `haloGroup`, `labelGroup`, `shootingStarGroup`, `createStarTexture(size)`, `createGlowTexture(color, size)`.

- [ ] **Step 1: Create `src/space/state.js`**

```js
// Mutable shared state for the space scene. Modules read/write via these
// singletons instead of file-scope globals.
export const state = {
  projects: [],
  currentView: 'projects',
  selectedStar: null,
  isAnimating: false,
  animTarget: null,
  travelTarget: null,
  cameraOrigin: null,
  targetControls: null,
  constellationFocus: null,
  themeIdx: 0,
};

export const registry = {
  starMeshes: [],
  glowSprites: [],
  lineMeshes: [],
  orbitLines: [],
  orbitData: [],
  shootingStars: [],
  labelObjects: [],
  constellationOrbits: [],
};
```

- [ ] **Step 2: Create `src/space/scene.js`**

Move from `space-main.js` (original `main.js` line numbers): the Three.js setup block, lines 13–73 (`scene`, `camera`, `renderer`, `labelContainer`, `labelRenderer`, `composer`, `bloomPass`, `controls`, the two `pointerdown`/`pointerup` autoRotate listeners, group creation/adds), texture helpers lines 102–137 (`createStarTexture`, `createGlowTexture`), and `onResize` + its listener, lines 858–864. File starts with:

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
```

Export: `export { scene, camera, renderer, labelRenderer, composer, controls, starGroup, lineGroup, haloGroup, labelGroup, shootingStarGroup, createStarTexture, createGlowTexture };`

- [ ] **Step 3: Rewire `space-main.js`**

1. Add imports at top:

```js
import { state, registry } from './state.js';
import { scene, camera, renderer, labelRenderer, composer, controls, starGroup, lineGroup, haloGroup, labelGroup, shootingStarGroup, createStarTexture, createGlowTexture } from './scene.js';
```

2. Delete the moved blocks from `space-main.js`.
3. Replace the old globals with the singletons, mechanically, across the whole file:
   - `let projects = ...` → `state.projects = autoConnectProjects(loadProjects());` and every bare `projects` → `state.projects`
   - `currentView` → `state.currentView` (delete `let currentView = 'projects'`)
   - `selectedStar` → `state.selectedStar`; `isAnimating` → `state.isAnimating`; `animTarget` → `state.animTarget`; `travelTarget` → `state.travelTarget` (delete `let travelTarget = null`); `cameraOrigin` → `state.cameraOrigin`; `targetControls` → `state.targetControls`; `constellationFocus` → `state.constellationFocus`; `themeIdx` → `state.themeIdx`
   - Arrays: `starMeshes` → `registry.starMeshes`, `glowSprites` → `registry.glowSprites`, `lineMeshes` → `registry.lineMeshes`, `orbitLines` → `registry.orbitLines`, `orbitData` → `registry.orbitData`, `shootingStars` → `registry.shootingStars`, `labelObjects` → `registry.labelObjects`, `constellationOrbits` → `registry.constellationOrbits` (delete the old declarations)
4. `space-main.js` still uses `CSS2DObject` (in `makePlanet`/`buildConstellation`), so its Three import line becomes:

```js
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
```

- [ ] **Step 4: Verify**

`npm run build` → exit 0. `/space.html` full smoke test (pay attention to: select → close → travel sequence, delete/reset, theme cycle — they all touch migrated state).

- [ ] **Step 5: Commit**

```bash
git add src/space/state.js src/space/scene.js src/space/space-main.js
git commit -m "refactor: extract space state and scene setup modules"
```

---

### Task 7: Extract `src/space/effects.js`

**Files:**
- Create: `src/space/effects.js`
- Modify: `src/space/space-main.js`

**Interfaces:**
- Consumes: `scene`, `shootingStarGroup`, `createStarTexture` from `./scene.js`; `registry` from `./state.js`.
- Produces: `fx` (mutable namespace: `fx.bg`, `fx.nebulaMat`, `fx.warpParticles`, `fx.dustParticles`), `initEffects()`, `animateEffects(time, delta)`, `triggerShootingStar()`.

- [ ] **Step 1: Create `src/space/effects.js`**

Move these blocks from `space-main.js` (original line numbers): `createBackground` (398–424), the `nebulaShaderMat` ShaderMaterial + `nebulaSphere` (431–507, including both GLSL strings verbatim), `animateBg` (509–517), `initShootingStars` (519–539), `triggerShootingStar` (573–592), `animateShootingStars` (832–856), `createWarpParticles` (957–978), `createSpaceDust` (981–1002). Structure:

```js
import * as THREE from 'three';
import { scene, shootingStarGroup, createStarTexture } from './scene.js';
import { registry } from './state.js';

export const fx = {
  bg: null,
  nebulaMat: null,
  warpParticles: null,
  dustParticles: null,
};

// moved functions here, with these mechanical renames:
//  - `bg` → `fx.bg` (assigned inside initEffects)
//  - `nebulaShaderMat` → `fx.nebulaMat` (material creation moves into
//    initNebula(), which also builds nebulaSphere and adds it to scene)
//  - `warpParticles` → `fx.warpParticles`; `dustParticles` → `fx.dustParticles`
//  - `shootingStars` → `registry.shootingStars` (already renamed in Task 6)

export function initEffects() {
  fx.bg = createBackground();
  initNebula();
  initShootingStars();
  createWarpParticles();
  fx.dustParticles = createSpaceDust();
}

export function animateEffects(time, delta) {
  fx.bg.pts.rotation.y = time * 0.003;
  fx.bg.pts.rotation.x = Math.sin(time * 0.0008) * 0.02;
  fx.nebulaMat.uniforms.uTime.value = time;
  if (fx.dustParticles) {
    fx.dustParticles.rotation.y += delta * 0.006;
    fx.dustParticles.rotation.x += delta * 0.002;
  }
  animateShootingStars(time, delta);
}
```

`triggerShootingStar` is exported with its moved body. All GLSL strings and numeric constants move verbatim — do not change any value.

- [ ] **Step 2: Rewire `space-main.js`**

1. Add: `import { fx, initEffects, animateEffects, triggerShootingStar } from './effects.js';`
2. Delete moved blocks. Replace the old top-level calls (`const bg = createBackground()`, `initShootingStars()`, `createWarpParticles()`, `const dustParticles = createSpaceDust()`) with a single `initEffects();`.
3. In the animate loop, replace `animateBg(totalTime, delta);` and `animateShootingStars(totalTime, delta);` with `animateEffects(totalTime, delta);`.
4. Remaining references: `warpParticles` → `fx.warpParticles` (in `animateCamera` and `travelToConstellation`); theme handler: `nebulaShaderMat.uniforms` → `fx.nebulaMat.uniforms`.

- [ ] **Step 3: Verify**

`npm run build` → exit 0. `/space.html`: background stars rotate, nebula animates, shooting stars appear within ~15s, constellation travel shows warp particles, theme button recolors nebula and background.

- [ ] **Step 4: Commit**

```bash
git add src/space/effects.js src/space/space-main.js
git commit -m "refactor: extract space visual effects module"
```

---

### Task 8: Extract `src/space/overlay.js` and `src/space/bodies.js`

**Files:**
- Create: `src/space/overlay.js`, `src/space/bodies.js`
- Modify: `src/space/space-main.js`

**Interfaces:**
- Produces (`overlay.js`): `showProjectOverlay(project)`, `hideProjectOverlay()`, `showToast(msg)` — pure DOM, no Three.js imports.
- Produces (`bodies.js`): `clearScene()`, `buildScene(viewMode)`, `getStackConfigs()`, `getProjectConfigs()`, `updateNavButtons(mode)`, `animateStars(time)`, `animateLines(time)`, `updateLabelScales(now)`.

- [ ] **Step 1: Create `src/space/overlay.js`**

Move verbatim from `space-main.js` (original line numbers): `showProjectOverlay` (681–728), `hideProjectOverlay` (730–732), `showToast` (757–764). No imports needed (pure DOM). Export all three.

- [ ] **Step 2: Create `src/space/bodies.js`**

Move from `space-main.js` (original line numbers): `clearScene` (81–100), `getStackConfigs` (145–169), `getProjectConfigs` (171–192), `buildScene` with nested `makePlanet`/`buildConstellation` (194–331), `updateNavButtons` (333–345), `addLine` (366–377), `buildLines` (379–396), `animateStars` (791–820), `animateLines` (822–830), `updateLabelScales` + its `lastLabelUpdate` variable (1058–1067). Header:

```js
import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { starGroup, lineGroup, haloGroup, labelGroup, shootingStarGroup, camera, createGlowTexture } from './scene.js';
import { state, registry } from './state.js';
import { PROJECT_GROUPS, PROJECT_VIEWS } from '../data/projects.js';
```

All `state.projects` / `registry.*` references were already renamed in Task 6 — code moves as-is. Export: `clearScene`, `buildScene`, `getStackConfigs`, `getProjectConfigs`, `updateNavButtons`, `animateStars`, `animateLines`, `updateLabelScales`.

- [ ] **Step 3: Rewire `space-main.js`**

```js
import { showProjectOverlay, hideProjectOverlay, showToast } from './overlay.js';
import { buildScene, updateNavButtons, animateStars, animateLines, updateLabelScales } from './bodies.js';
```

Delete moved blocks. Remaining callers (`switchView`, `selectStar`, close/delete/reset handlers, animate loop, `rebuildConstellation`) now use imports. Remove the `CSS2DObject` import from `space-main.js` if no longer referenced, and drop `PROJECT_GROUPS`/`PROJECT_VIEWS` from its data import if now unused.

- [ ] **Step 4: Verify**

`npm run build` → exit 0. `/space.html` full smoke test — especially view toggle (PROJETOS/STACKS rebuilds scene + nav buttons), labels scale on zoom, orbit lines follow planets.

- [ ] **Step 5: Commit**

```bash
git add src/space/overlay.js src/space/bodies.js src/space/space-main.js
git commit -m "refactor: extract overlay and scene-bodies modules"
```

---

### Task 9: Extract `src/space/camera-travel.js` and `src/space/interactions.js`

**Files:**
- Create: `src/space/camera-travel.js`, `src/space/interactions.js`
- Modify: `src/space/space-main.js`

**Interfaces:**
- Produces (`camera-travel.js`): `selectStar(id)`, `animateCamera(delta)`, `travelToConstellation(group)`, `goToOverview()`, `easeInOutCubic(t)`.
- Produces (`interactions.js`): `setupInteractions({ rebuildConstellation, switchView })` — attaches ALL DOM listeners and runs the loading typewriter.
- Consumes: everything above.

- [ ] **Step 1: Create `src/space/camera-travel.js`**

Move from `space-main.js` (original line numbers): `selectStar` (594–626), `animateCamera` (628–677), `easeInOutCubic` (679), `travelToConstellation` (1007–1053), plus the overview-button handler body (905–922) as a named export:

```js
export function goToOverview() {
  if (state.isAnimating) return;
  state.isAnimating = true;
  controls.autoRotate = false;
  state.constellationFocus = null;
  const overviewTarget = new THREE.Vector3(0, 8, 0.1);
  state.travelTarget = {
    from: camera.position.clone(), to: overviewTarget,
    targetFrom: controls.target.clone(), targetTo: new THREE.Vector3(0, 0, 0),
    progress: 0, duration: 2.0, group: '__overview__',
  };
  const status = document.getElementById('travel-status');
  if (status) {
    status.textContent = 'VISÃO GERAL DA CONSTELAÇÃO';
    status.classList.add('active');
    setTimeout(() => status.classList.remove('active'), 2800);
  }
}
```

Header:

```js
import * as THREE from 'three';
import { camera, controls } from './scene.js';
import { state, registry } from './state.js';
import { fx, triggerShootingStar } from './effects.js';
import { showProjectOverlay } from './overlay.js';
```

`selectStar` keeps calling `showProjectOverlay(project)`; `travelToConstellation` keeps its `hideProjectOverlay()` call — add it to the overlay import if used.

- [ ] **Step 2: Create `src/space/interactions.js`**

Move from `space-main.js`: raycaster + `pointer` (549–550), `onPointerDown` + listener registration (552–571), close-btn handler (734–755), delete-btn handler (766–779), reset-btn handler (781–789), `themeCycle` array + theme-btn handler (886–903), overview-btn listener (now `document.getElementById('overview-btn')?.addEventListener('click', goToOverview)`), view-btn listener (924–926), nav-star delegated click (951–954), loading typewriter (932–949). Structure:

```js
import { camera, controls, renderer, scene } from './scene.js';
import { state, registry } from './state.js';
import { fx } from './effects.js';
import { hideProjectOverlay, showToast } from './overlay.js';
import { selectStar, travelToConstellation, goToOverview } from './camera-travel.js';
import { autoConnectProjects } from '../data/projects.js';
import { saveProjects, resetProjects } from '../data/storage.js';
import * as THREE from 'three';

export function setupInteractions({ rebuildConstellation, switchView }) {
  // all moved listener registrations, using the callbacks where the old
  // code called rebuildConstellation() (delete/reset handlers) and
  // switchView() (view button)
  runLoadingSequence();
}

function runLoadingSequence() {
  // moved typewriter block (932–949), verbatim
}
```

- [ ] **Step 3: Slim `space-main.js` to the orchestrator**

Final `space-main.js`:

```js
import { autoConnectProjects } from '../data/projects.js';
import { loadProjects, saveProjects } from '../data/storage.js';
import { setupImportUI } from '../ui/import-ui.js';
import { state } from './state.js';
import { camera, controls, composer, labelRenderer, scene } from './scene.js';
import { initEffects, animateEffects } from './effects.js';
import { buildScene, updateNavButtons, animateStars, animateLines, updateLabelScales } from './bodies.js';
import { animateCamera } from './camera-travel.js';
import { hideProjectOverlay, showToast } from './overlay.js';
import { setupInteractions } from './interactions.js';

state.projects = autoConnectProjects(loadProjects());

initEffects();

function rebuildConstellation() {
  if (state.isAnimating) return;
  hideProjectOverlay();
  state.selectedStar = null; state.cameraOrigin = null;
  state.animTarget = null; state.isAnimating = false;
  state.constellationFocus = null;
  camera.position.set(0, 8, 0.1);
  controls.target.set(0, 0, 0);
  controls.autoRotate = true;
  controls.update();
  buildScene(state.currentView);
}

function switchView(mode) {
  if (mode === state.currentView) return;
  state.currentView = mode;
  state.constellationFocus = null;
  buildScene(mode);
  controls.autoRotate = true;
  controls.target.set(0, 0, 0);
  camera.position.set(0, 8, 0.1);
  controls.update();
  const btn = document.getElementById('view-btn');
  if (btn) btn.innerHTML = mode === 'projects'
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> STACKS'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> PROJETOS';
  updateNavButtons(mode);
  showToast(`Visão: ${mode === 'projects' ? 'Projetos' : 'Stacks'}`);
}

setupImportUI((newProjects) => {
  const list = Array.isArray(newProjects) ? newProjects : [newProjects];
  list.forEach(p => state.projects.push(p));
  state.projects = autoConnectProjects(state.projects);
  saveProjects(state.projects);
  rebuildConstellation();
});

setupInteractions({ rebuildConstellation, switchView });

buildScene('projects');
updateNavButtons('projects');
setTimeout(() => { controls.autoRotate = true }, 2000);

let lastTime = performance.now();
let totalTime = 0;

function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const delta = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;
  totalTime += delta;

  if (state.isAnimating && !state.animTarget && !state.travelTarget) {
    state.isAnimating = false;
  }

  animateStars(totalTime);
  animateLines(totalTime);
  animateEffects(totalTime, delta);
  if (state.animTarget || state.travelTarget) animateCamera(delta);
  updateLabelScales(totalTime);
  controls.update();
  composer.render();
  labelRenderer.render(scene, camera);
}

animate();
```

- [ ] **Step 4: Verify**

`npm run build` → exit 0. `/space.html` FULL smoke test from Global Constraints — every item.

- [ ] **Step 5: Commit**

```bash
git add src/space/camera-travel.js src/space/interactions.js src/space/space-main.js
git commit -m "refactor: extract camera travel and interactions, slim space entry to orchestrator"
```

---

### Task 10: Final verification

**Files:**
- Verify only (fix regressions if found)

- [ ] **Step 1: Confirm final structure**

Run: `ls src/data src/space src/site src/styles src/ui`
Expected:
```
src/data:   github.js  projects.js  storage.js
src/space:  bodies.js  camera-travel.js  effects.js  interactions.js  overlay.js  scene.js  space-main.js  state.js
src/site:   site-main.js
src/styles: site.css  space.css
src/ui:     import-ui.js
```
`src/main.js`, `src/projects.js`, `src/import-ui.js`, `src/style.css` must NOT exist.

- [ ] **Step 2: Production build + preview**

Run: `npm run build && npm run preview`
Expected: build exit 0. Against the preview URL, run BOTH smoke tests (normal + space), including localStorage flows: import a repo by URL → reload → planet persists; reset → default constellation restored.

- [ ] **Step 3: Commit any fixes**

If regressions were found and fixed:

```bash
git add -u
git commit -m "fix: post-refactor regressions found in final verification"
```
