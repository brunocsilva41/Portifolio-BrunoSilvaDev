import * as THREE from 'three';
import { fx, triggerShootingStar } from './effects.js';
import { hideProjectOverlay, showProjectOverlay } from './overlay.js';
import { camera, controls } from './scene.js';
import { registry, state } from './state.js';

const CAMERA_PROFILES = {
  atlas: { minPolar: 0.18, maxPolar: 1.12, minDistance: 6, maxDistance: 140, autoRotateSpeed: 0.18 },
  sector: { minPolar: 0.12, maxPolar: Math.PI - 0.12, minDistance: 4, maxDistance: 90, autoRotateSpeed: 0.22 },
  cinematic: { minPolar: 0.16, maxPolar: 1.08, minDistance: 5, maxDistance: 120, autoRotateSpeed: 0.19 },
};

function applyCameraProfile(name) {
  const profile = CAMERA_PROFILES[name] || CAMERA_PROFILES.atlas;
  controls.minPolarAngle = profile.minPolar;
  controls.maxPolarAngle = profile.maxPolar;
  controls.minDistance = profile.minDistance;
  controls.maxDistance = profile.maxDistance;
  controls.autoRotateSpeed = profile.autoRotateSpeed;
}

function settleTopDownView(targetPoint, height = 14, radius = 0.2) {
  return new THREE.Vector3(targetPoint.x + radius, targetPoint.y + height, targetPoint.z + radius);
}

function getLateralAxis(centerPoint) {
  const up = new THREE.Vector3(0, 1, 0);
  const normal = centerPoint.clone().normalize();
  let side = new THREE.Vector3().crossVectors(up, normal);
  if (side.lengthSq() < 1e-4) side = new THREE.Vector3(1, 0, 0);
  return side.normalize();
}

function buildCinematicTravel(from, focus) {
  const toFocus = focus.clone().sub(from);
  const dir = toFocus.lengthSq() > 0.001 ? toFocus.clone().normalize() : new THREE.Vector3(0, -1, 0);
  const side = getLateralAxis(focus);
  const dist = Math.max(10, from.distanceTo(focus));

  const p0 = from.clone();
  const p1 = from.clone().add(dir.clone().multiplyScalar(dist * 0.2)).add(new THREE.Vector3(0, 3.5, 0));
  const p2 = from.clone().add(dir.clone().multiplyScalar(dist * 0.55)).add(side.clone().multiplyScalar(dist * 0.24)).add(new THREE.Vector3(0, 6.5, 0));
  const p3 = focus.clone().add(side.clone().multiplyScalar(Math.max(5.8, dist * 0.22))).add(new THREE.Vector3(0, Math.max(7.2, dist * 0.2), 0));

  const curve = new THREE.CatmullRomCurve3([p0, p1, p2, p3], false, 'catmullrom', 0.35);

  return {
    curve,
    finalPosition: p3,
  };
}

function animateWarpParticles(t, delta) {
  if (!fx.warpParticles?.userData.active) return;
  const pos = fx.warpParticles.geometry.attributes.position.array;
  const vel = fx.warpParticles.userData.vel;
  const speed = 2 + t * 6;
  for (let i = 0; i < pos.length / 3; i++) {
    pos[i * 3] *= 1 + delta * speed * 0.35;
    pos[i * 3 + 1] *= 1 + delta * speed * 0.35;
    pos[i * 3 + 2] += vel[i] * speed * delta * 2.8;
    if (Math.abs(pos[i * 3]) > 20 || Math.abs(pos[i * 3 + 1]) > 14 || pos[i * 3 + 2] > 20) {
      const a = Math.random() * Math.PI * 2;
      const r = 1.2 + Math.random() * 4;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.sin(a) * r * 0.5;
      pos[i * 3 + 2] = -10 - Math.random() * 14;
    }
  }
  fx.warpParticles.geometry.attributes.position.needsUpdate = true;
  fx.warpParticles.material.opacity = Math.sin(t * Math.PI) * 0.42;
}

function startWarpEffect() {
  if (!fx.warpParticles) return;
  fx.warpParticles.userData.active = true;
  const pos = fx.warpParticles.geometry.attributes.position.array;
  for (let i = 0; i < pos.length / 3; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 32;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 36 - 18;
  }
  fx.warpParticles.geometry.attributes.position.needsUpdate = true;
}

function stopWarpEffect() {
  if (!fx.warpParticles) return;
  fx.warpParticles.material.opacity = 0;
  fx.warpParticles.userData.active = false;
}

function interruptMotion({ resetProfile = true } = {}) {
  state.animTarget = null;
  state.travelTarget = null;
  state.isAnimating = false;
  if (resetProfile) applyCameraProfile('atlas');
  stopWarpEffect();
  const status = document.getElementById('travel-status');
  if (status) status.classList.remove('active');
}

export function selectStar(id) {
  if (state.isAnimating) interruptMotion({ resetProfile: false });
  const project = state.projects.find(p => p.id === id);
  if (!project) return;

  state.isAnimating = true;
  state.selectedStar = id;
  controls.autoRotate = false;
  state.cameraOrigin = camera.position.clone();
  state.targetControls = { target: controls.target.clone() };
  triggerShootingStar();

  const mesh = registry.starMeshes.find(m => m.userData.projectId === id);
  const tp = mesh ? mesh.position.clone() : new THREE.Vector3(0, 0, 0);
  const ct = settleTopDownView(tp, 11.5, 0.22);

  const owningCo = registry.constellationOrbits.find(co =>
    co.planets.some(p => p.mesh.userData.projectId === id)
  );
  if (owningCo) {
    state.focusGroup = owningCo.key;
    state.constellationFocus = {
      key: owningCo.key,
      position: owningCo.sunMesh.position.clone(),
    };
    applyCameraProfile('sector');
  }

  state.animTarget = {
    from: camera.position.clone(),
    to: ct,
    targetFrom: controls.target.clone(),
    targetTo: tp,
    progress: 0,
    duration: 0.95,
  };

  showProjectOverlay(project);
}

export function animateCamera(delta) {
  const target = state.animTarget || state.travelTarget;
  if (!target) return;

  target.progress += delta / target.duration;
  const t = easeInOutCubic(Math.min(target.progress, 1));

  if (target.curve) {
    const pos = target.curve.getPointAt(t);
    const ahead = target.curve.getPointAt(Math.min(1, t + 0.04));
    const focusBias = 0.28 + t * 0.72;
    const look = ahead.lerp(target.targetTo.clone(), focusBias);
    camera.position.copy(pos);
    controls.target.copy(look);
  } else {
    camera.position.lerpVectors(target.from, target.to, t);
    controls.target.lerpVectors(target.targetFrom, target.targetTo, t);
  }

  controls.update();

  const isTravel = target === state.travelTarget;
  if (isTravel) animateWarpParticles(t, delta);

  if (target.progress >= 1) {
    if (isTravel) {
      if (state.travelTarget.constellationKey && state.travelTarget.constellationKey !== '__overview__') {
        state.focusGroup = state.travelTarget.constellationKey;
        state.constellationFocus = {
          key: state.travelTarget.constellationKey,
          position: state.travelTarget.focusPosition,
        };
        applyCameraProfile('sector');
      } else {
        state.focusGroup = null;
        state.constellationFocus = null;
        applyCameraProfile('atlas');
      }
      state.travelTarget = null;
      stopWarpEffect();
      const status = document.getElementById('travel-status');
      if (status) setTimeout(() => status.classList.remove('active'), 650);
      setTimeout(() => { controls.autoRotate = true; }, 280);
    } else {
      if (target._resetCenter) controls.target.set(0, 0, 0);
      state.animTarget = null;
      setTimeout(() => { controls.autoRotate = true; }, 420);
    }
    state.isAnimating = false;
  }
}

export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function travelToConstellation(group) {
  if (!group) return;
  if (state.isAnimating) interruptMotion({ resetProfile: false });

  const co = registry.constellationOrbits.find(c => c.key === group);
  if (!co) return;

  state.isAnimating = true;
  controls.autoRotate = false;
  applyCameraProfile('cinematic');

  hideProjectOverlay();
  state.selectedStar = null;
  state.focusGroup = group;

  document.querySelectorAll('.nav-star').forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.nav-star[data-group="${group}"]`);
  activeBtn?.classList.add('active');

  const gc = co.sunMesh.position.clone();
  const from = camera.position.clone();
  const fromTarget = controls.target.clone();
  const travel = buildCinematicTravel(from, gc);
  const duration = Math.min(5.2, Math.max(2.4, from.distanceTo(travel.finalPosition) * 0.08));

  state.travelTarget = {
    from,
    to: travel.finalPosition,
    targetFrom: fromTarget,
    targetTo: gc,
    curve: travel.curve,
    progress: 0,
    duration,
    group,
    constellationKey: group,
    focusPosition: gc,
  };

  const status = document.getElementById('travel-status');
  if (status) {
    status.textContent = `TRAVESSIA PARA ${co.label ? co.label.toUpperCase() : group.toUpperCase()}`;
    status.classList.add('active');
  }

  startWarpEffect();
}

export function goToOverview() {
  interruptMotion({ resetProfile: true });
  state.isAnimating = true;
  controls.autoRotate = false;

  state.constellationFocus = null;
  state.focusGroup = null;

  const overviewTarget = new THREE.Vector3(0, 32, 0.1);
  state.travelTarget = {
    from: camera.position.clone(),
    to: overviewTarget,
    targetFrom: controls.target.clone(),
    targetTo: new THREE.Vector3(0, 0, 0),
    progress: 0,
    duration: 1.6,
    group: '__overview__',
  };

  const status = document.getElementById('travel-status');
  if (status) {
    status.textContent = 'RETORNANDO AO ATLAS';
    status.classList.add('active');
    setTimeout(() => status.classList.remove('active'), 2200);
  }
}
