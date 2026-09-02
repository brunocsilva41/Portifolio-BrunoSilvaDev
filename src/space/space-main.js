import { autoConnectProjects } from '../data/projects.js';
import { loadProjects } from '../data/storage.js';
import { animateLines, animateStars, buildScene, updateLabelScales, updateNavButtons } from './bodies.js';
import { animateCamera } from './camera-travel.js';
import { animateEffects, initEffects } from './effects.js';
import { setupInteractions } from './interactions.js';
import { hideProjectOverlay, showToast } from './overlay.js';
import { camera, composer, controls, labelRenderer, scene } from './scene.js';
import { state } from './state.js';

state.projects = autoConnectProjects(loadProjects());

initEffects();

function rebuildConstellation() {
  if (state.isAnimating) return;
  hideProjectOverlay();
  state.selectedStar = null; state.cameraOrigin = null;
  state.animTarget = null; state.isAnimating = false;
  state.constellationFocus = null;
  state.focusGroup = null;
  camera.position.set(0, 24, 0.1);
  controls.target.set(0, 0, 0);
  controls.autoRotate = true;
  controls.update();
  buildScene(state.currentView);
}

function switchView(mode) {
  if (mode === state.currentView) return;
  state.currentView = mode;
  state.constellationFocus = null;
  state.focusGroup = null;
  buildScene(mode);
  controls.autoRotate = true;
  controls.target.set(0, 0, 0);
  camera.position.set(0, 24, 0.1);
  controls.update();
  const btn = document.getElementById('view-btn');
  if (btn) btn.innerHTML = mode === 'projects'
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> STACKS'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> PROJETOS';
  updateNavButtons(mode);
  showToast(`Visão: ${mode === 'projects' ? 'Projetos' : 'Stacks'}`);
}

setupInteractions({ rebuildConstellation, switchView });

buildScene('projects');
updateNavButtons('projects');
camera.position.set(0, 24, 0.1);
controls.target.set(0, 0, 0);
controls.update();
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
