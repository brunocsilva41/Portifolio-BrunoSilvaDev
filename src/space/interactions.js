import * as THREE from 'three';
import { goToOverview, selectStar, travelToConstellation } from './camera-travel.js';
import { fx } from './effects.js';
import { hideProjectOverlay, showToast } from './overlay.js';
import { camera, controls, renderer, scene } from './scene.js';
import { registry, state } from './state.js';

export function setupInteractions({ rebuildConstellation, switchView }) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function onPointerDown(event) {
    if (state.isAnimating) return;
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const meshes = registry.starMeshes.filter(m => !m.userData.isRing);
    const intersects = raycaster.intersectObjects(meshes);
    if (intersects.length > 0) {
      const hit = intersects[0].object;
      if (hit.userData.isConstellationCenter) {
        travelToConstellation(hit.userData.constellationKey);
        return;
      }
      const id = hit.userData.projectId;
      if (id !== undefined) selectStar(id);
    }
  }

  renderer.domElement.addEventListener('pointerdown', onPointerDown);

  document.getElementById('close-btn')?.addEventListener('click', () => {
    if (state.isAnimating) return;
    state.isAnimating = true;
    hideProjectOverlay();
    // Volta para o ponto de onde a estrela foi selecionada, mantendo o foco na constelação
    const origin = state.cameraOrigin?.clone() || new THREE.Vector3(0, 24, 0.1);
    const targetTo = state.targetControls?.target?.clone()
      || state.constellationFocus?.position?.clone()
      || new THREE.Vector3(0, 0, 0);
    state.animTarget = {
      from: camera.position.clone(), to: origin,
      targetFrom: controls.target.clone(), targetTo,
      progress: 0, duration: 0.8,
    };
    setTimeout(() => {
      controls.enabled = true; state.selectedStar = null; state.cameraOrigin = null;
      setTimeout(() => { controls.autoRotate = true }, 3000);
    }, 800);
  });

  const themeCycle = [
    { name: 'Azul', bg: 0x040a1a, c1: [0.03, 0.06, 0.20], c2: [0.08, 0.15, 0.35], c3: [0.10, 0.04, 0.22], op: 0.42 },
    { name: 'Roxo', bg: 0x0a0518, c1: [0.12, 0.05, 0.25], c2: [0.25, 0.10, 0.45], c3: [0.08, 0.02, 0.15], op: 0.42 },
    { name: 'Vermelho', bg: 0x180808, c1: [0.20, 0.04, 0.04], c2: [0.35, 0.08, 0.10], c3: [0.12, 0.02, 0.02], op: 0.38 },
    { name: 'Verde', bg: 0x06120a, c1: [0.04, 0.12, 0.06], c2: [0.08, 0.25, 0.12], c3: [0.02, 0.08, 0.04], op: 0.38 },
    { name: 'Preto', bg: 0x000000, c1: [0.02, 0.02, 0.05], c2: [0.04, 0.05, 0.10], c3: [0.02, 0.01, 0.05], op: 0.16 },
  ];
  document.getElementById('theme-btn')?.addEventListener('click', () => {
    state.themeIdx = (state.themeIdx + 1) % themeCycle.length;
    const t = themeCycle[state.themeIdx];
    scene.background.setHex(t.bg);
    renderer.setClearColor(t.bg, 1);
    fx.nebulaMat.uniforms.uColor1.value.set(t.c1[0], t.c1[1], t.c1[2]);
    fx.nebulaMat.uniforms.uColor2.value.set(t.c2[0], t.c2[1], t.c2[2]);
    fx.nebulaMat.uniforms.uColor3.value.set(t.c3[0], t.c3[1], t.c3[2]);
    fx.nebulaMat.uniforms.uOpacity.value = t.op;
    showToast(`Tema: ${t.name}`);
  });

  document.getElementById('overview-btn')?.addEventListener('click', goToOverview);

  document.getElementById('view-btn')?.addEventListener('click', () => {
    switchView(state.currentView === 'projects' ? 'stacks' : 'projects');
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.nav-star');
    if (btn && btn.dataset.group) travelToConstellation(btn.dataset.group);
  });

  runLoadingSequence();
}

function runLoadingSequence() {
  const loadingText = 'INICIALIZANDO CONSTELAÇÃO...';
  const loadingEl = document.getElementById('loading-text');
  if (loadingEl) {
    let idx = 0;
    function typeNext() {
      if (idx < loadingText.length) {
        loadingEl.textContent += loadingText[idx];
        idx++;
        setTimeout(typeNext, 60 + Math.random() * 40);
      } else {
        setTimeout(() => {
          document.getElementById('loading').classList.add('hidden');
          document.getElementById('main-content').classList.add('visible');
        }, 600);
      }
    }
    typeNext();
  }
}
