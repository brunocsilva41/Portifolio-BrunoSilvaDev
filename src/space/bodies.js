import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { PROJECT_GROUPS, PROJECT_VIEWS, getProjectViewPositions } from '../data/projects.js';
import { camera, createGlowTexture, haloGroup, labelGroup, lineGroup, shootingStarGroup, starGroup } from './scene.js';
import { registry, state } from './state.js';

const STACK_GALAXY_SCALE = 3.2;
const PROJECT_GALAXY_RADIUS = 1.35;
const PROJECT_GALAXY_Y = 1.3;

export function clearScene() {
  [starGroup, lineGroup, haloGroup, labelGroup, shootingStarGroup].forEach(group => {
    while (group.children.length) {
      const child = group.children[0];
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (child.material.map) child.material.map.dispose();
        child.material.dispose();
      }
      group.remove(child);
    }
  });
  registry.starMeshes.length = 0;
  registry.glowSprites.length = 0;
  registry.lineMeshes.length = 0;
  registry.orbitLines.length = 0;
  registry.shootingStars.length = 0;
  registry.constellationOrbits.length = 0;
  registry.labelObjects.length = 0;
}

export function getStackConfigs() {
  const byGroup = {};
  state.projects.forEach(p => {
    if (p.group && !p.isCenter) {
      if (!byGroup[p.group]) byGroup[p.group] = [];
      byGroup[p.group].push(p);
    }
  });
  const shortNames = { game: 'GAME', ai: 'AI', infra: 'INFRA', web: 'WEB', empresa: 'CASES' };
  const entries = Object.entries(byGroup).filter(([name]) => PROJECT_GROUPS[name]);
  return entries.map(([name, members]) => {
    const gCfg = PROJECT_GROUPS[name];
    const base = new THREE.Vector3(gCfg.centerPos.x, gCfg.centerPos.y, gCfg.centerPos.z);
    base.multiplyScalar(STACK_GALAXY_SCALE);
    return {
      color: gCfg.color,
      label: shortNames[name] || gCfg.label,
      members,
      spread: Math.max(2.6, Math.min(4.8, 2.3 + members.length * 0.14)),
      key: name,
      centerPos: base,
    };
  });
}

export function getProjectConfigs() {
  const positions = getProjectViewPositions();
  const byGroup = {};
  PROJECT_VIEWS.forEach(pv => {
    const members = pv.repoIds.map(id => state.projects.find(p => p.id === id)).filter(Boolean);
    if (members.length > 0) byGroup[pv.name] = members;
  });
  const entries = Object.entries(byGroup);
  return entries.map(([name, members], i) => {
    const pv = PROJECT_VIEWS.find(p => p.name === name);
    const pos = positions[i] || { x: 0, y: 0, z: 0 };
    return {
      color: pv ? pv.color : '#6c8cff',
      label: name,
      members,
      spread: Math.max(2.0, Math.min(4.8, 2.3 + members.length * 0.14)),
      key: name,
      centerPos: new THREE.Vector3(
        pos.x * PROJECT_GALAXY_RADIUS,
        (pos.y + PROJECT_GALAXY_Y) * 2.1,
        pos.z * PROJECT_GALAXY_RADIUS,
      ),
    };
  });
}

export function buildScene(viewMode) {
  if (!state.projects || state.projects.length === 0) return;
  clearScene();
  registry.orbitData.length = 0;

  const configs = viewMode === 'stacks' ? getStackConfigs() : getProjectConfigs();

  function makePlanet(pos, color, p, isCenter = false) {
    const techCount = (p.tech && p.tech.length) || 3;
    const radius = isCenter ? 0.65 : (0.18 + Math.min(techCount, 8) * 0.035);

    const geo = new THREE.SphereGeometry(radius, 32, 32);
    const mat = new THREE.MeshPhysicalMaterial({
      color, emissive: color, emissiveIntensity: isCenter ? 0.8 : 0.25,
      metalness: isCenter ? 0.0 : 0.1, roughness: isCenter ? 0.2 : 0.6,
      clearcoat: isCenter ? 0.6 : 0.3, clearcoatRoughness: 0.15,
      transparent: true,
      opacity: 1,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    mesh.userData = { projectId: p.id, phase: Math.random() * Math.PI * 2, radius, isCenter, groupKey: p.group || 'center' };
    starGroup.add(mesh);
    registry.starMeshes.push(mesh);

    const gSize = isCenter ? 2.5 : 1.0;
    const gMat = new THREE.SpriteMaterial({
      map: createGlowTexture(isCenter ? new THREE.Color('#ffffff') : color),
      blending: THREE.AdditiveBlending, transparent: true,
      opacity: isCenter ? 0.02 : 0.008, depthWrite: false,
    });
    const glow = new THREE.Sprite(gMat);
    glow.scale.set(gSize, gSize, 1);
    glow.position.copy(pos);
    glow.userData = { parentMesh: mesh, groupKey: p.group || 'center' };
    starGroup.add(glow);
    registry.glowSprites.push(glow);

    const lDiv = document.createElement('div');
    lDiv.className = isCenter ? 'star-label center-star-label' : 'star-label';
    lDiv.textContent = p.title;
    lDiv.style.color = isCenter ? '#ffffff' : p.color;
    const label = new CSS2DObject(lDiv);
    label.position.set(pos.x, pos.y - radius - (isCenter ? 0.9 : 0.55), pos.z);
    label.userData = { groupKey: p.group || 'center', isCenter };
    labelGroup.add(label);
    registry.labelObjects.push(label);

    return { mesh, glow, label, radius };
  }

  function buildConstellation(cfg) {
    const gc = cfg.centerPos ? cfg.centerPos.clone() : new THREE.Vector3(0, 0, 0);
    const members = cfg.members;
    const spread = cfg.spread;

    const sunRadius = 0.35;
    const sGeo = new THREE.SphereGeometry(sunRadius, 24, 24);
    const sMat = new THREE.MeshPhysicalMaterial({
      color: cfg.color, emissive: cfg.color, emissiveIntensity: 0.6,
      metalness: 0.3, roughness: 0.4,
      transparent: true,
      opacity: 1,
    });
    const sunMesh = new THREE.Mesh(sGeo, sMat);
    sunMesh.position.copy(gc);
    sunMesh.userData = { isGroupSun: true, isConstellationCenter: true, constellationKey: cfg.key, phase: Math.random() * Math.PI * 2, groupKey: cfg.key };
    starGroup.add(sunMesh);
    registry.starMeshes.push(sunMesh);

    const sGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: createGlowTexture(new THREE.Color(cfg.color)),
      blending: THREE.AdditiveBlending, transparent: true,
      opacity: 0.25, depthWrite: false,
    }));
    sGlow.scale.set(3.5, 3.5, 1);
    sGlow.position.copy(gc);
    starGroup.add(sGlow);
    registry.glowSprites.push(sGlow);

    const sLabel = document.createElement('div');
    sLabel.className = 'star-label center-label';
    sLabel.textContent = cfg.label;
    sLabel.style.color = cfg.color;
    const sLabelObj = new CSS2DObject(sLabel);
    sLabelObj.position.set(gc.x, gc.y - sunRadius - 0.6, gc.z);
    sLabelObj.userData = { groupKey: cfg.key, isCenter: true };
    labelGroup.add(sLabelObj);
    registry.labelObjects.push(sLabelObj);

    // Subtle horizontal ring
    const r1 = new THREE.Mesh(
      new THREE.RingGeometry(spread - 0.005, spread, 16),
      new THREE.MeshBasicMaterial({ color: cfg.color, transparent: true, opacity: 0.004, side: THREE.DoubleSide, depthWrite: false })
    );
    r1.position.copy(gc);
    r1.rotation.x = -Math.PI / 2;
    r1.userData.isRingGeo = true;
    haloGroup.add(r1);

    const memberCount = members.length;
    const groupSpeed = 0.2;
    const planets = [];
    members.forEach((proj, mi) => {
      const angle = (mi / memberCount) * Math.PI * 2;
      const px = gc.x + Math.cos(angle) * spread;
      const py = gc.y;
      const pz = gc.z + Math.sin(angle) * spread;
      const initPos = new THREE.Vector3(px, py, pz);

      const { mesh, glow, label, radius } = makePlanet(initPos, new THREE.Color(proj.color), proj);

      const orbit = { center: gc.clone(), angle, dist: spread, speed: groupSpeed };
      mesh.userData.orbit = orbit;
      mesh.userData.label = label;
      mesh.userData.glow = glow;
      mesh.userData.groupKey = cfg.key;
      glow.userData.orbit = orbit;
      glow.userData.groupKey = cfg.key;
      label.userData.groupKey = cfg.key;
      planets.push({ mesh, glow, label, orbit });
    });

    registry.constellationOrbits.push({
      key: cfg.key,
      label: cfg.label,
      spread, sunMesh, sGlow, sLabelObj, sunRadius,
      ringMesh: r1,
      planets,
    });
  }

  const center = state.projects.find(p => p.isCenter);
  if (center) {
    makePlanet(new THREE.Vector3(0, 0, 0), new THREE.Color('#ffffff'), center, true);
  }

  configs.forEach(cfg => buildConstellation(cfg));

  buildLines();
}

export function updateNavButtons(mode) {
  const container = document.querySelector('.console-btns');
  if (!container) return;
  const configs = mode === 'stacks' ? getStackConfigs() : getProjectConfigs();
  container.innerHTML = configs.map(c => {
    const color = c.color;
    const label = c.label;
    return `<button class="nav-star" data-group="${c.key}">
      <svg class="star-icon" width="20" height="20" viewBox="0 0 48 48"><path d="M24 3 L28.5 17 L43 17 L31 27 L35 42 L24 33 L13 42 L17 27 L5 17 L19.5 17 Z" fill="${color}"/></svg>
      <span class="nav-label">${label}</span>
    </button>`;
  }).join('');
}

function addLine(a, b, color, opacity, groupKey) {
  const pts = [a.clone(), b.clone()];
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({
    color, transparent: true, opacity,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const line = new THREE.Line(geo, mat);
  line.userData.groupKey = groupKey;
  lineGroup.add(line);
  registry.lineMeshes.push(line);
  return line;
}

function buildLines() {
  registry.lineMeshes.length = 0;
  registry.orbitLines.length = 0;

  registry.constellationOrbits.forEach(co => {
    const center = new THREE.Vector3(0, 0, 0);

    // Line from solar center to constellation center (live ref to sunMesh.position)
    const mainLine = addLine(center, co.sunMesh.position, 0x4466aa, 0.12, co.key);
    registry.orbitLines.push({ line: mainLine, a: center, b: co.sunMesh.position, groupKey: co.key });

    // Lines from constellation center to each planet (live refs)
    co.planets.forEach(p => {
      const innerLine = addLine(co.sunMesh.position, p.mesh.position, 0x6688ff, 0.09, co.key);
      registry.orbitLines.push({ line: innerLine, a: co.sunMesh.position, b: p.mesh.position, groupKey: co.key });
    });
  });
}

export function animateStars(time) {
  registry.starMeshes.forEach(m => {
    const ph = m.userData.phase || 0;
    const pulse = 0.9 + 0.1 * Math.sin(time * 0.8 + ph);
    if (!m.userData.isGroupSun) m.scale.set(pulse, pulse, pulse);
    m.rotation.y += 0.003;

    const isFocused = !state.focusGroup || m.userData.isCenter || m.userData.groupKey === state.focusGroup;
    if (m.material) {
      m.material.transparent = true;
      m.material.opacity = isFocused ? 1 : 0.16;
    }

    if (m.userData.orbit) {
      const o = m.userData.orbit;
      o.angle += 0.004 * o.speed;
      const nx = o.center.x + Math.cos(o.angle) * o.dist;
      const ny = o.center.y;
      const nz = o.center.z + Math.sin(o.angle) * o.dist;
      m.position.set(nx, ny, nz);
      if (m.userData.glow) m.userData.glow.position.set(nx, ny, nz);
      if (m.userData.label) {
        const rad = m.userData.radius || 0.3;
        m.userData.label.position.set(nx, ny - rad - 0.55, nz);
      }
    }
  });
  registry.glowSprites.forEach(s => {
    const m = s.userData.parentMesh;
    if (!m) return;
    const ph = m.userData.phase || 0;
    const pulse = 0.8 + 0.2 * Math.sin(time * 0.7 + ph);
    s.scale.set(2.5 * pulse, 2.5 * pulse, 1);
    const isFocused = !state.focusGroup || s.userData.groupKey === state.focusGroup || m.userData.isCenter;
    s.material.opacity = (0.18 + 0.08 * Math.sin(time * 0.6 + ph)) * (isFocused ? 1 : 0.18);
  });
}

export function animateLines(time) {
  registry.orbitLines.forEach((ol, i) => {
    const pos = ol.line.geometry.attributes.position.array;
    pos[0] = ol.a.x; pos[1] = ol.a.y; pos[2] = ol.a.z;
    pos[3] = ol.b.x; pos[4] = ol.b.y; pos[5] = ol.b.z;
    ol.line.geometry.attributes.position.needsUpdate = true;
    const focusFactor = !state.focusGroup || ol.groupKey === state.focusGroup ? 1 : 0.16;
    ol.line.material.opacity = (0.08 + 0.04 * Math.sin(time * 0.3 + i)) * focusFactor;
  });
}

let lastLabelUpdate = 0;
export function updateLabelScales(now) {
  if (now - lastLabelUpdate < 150) return;
  lastLabelUpdate = now;
  const dist = camera.position.length();
  const scale = Math.max(0.45, Math.min(1.55, 16 / dist));
  registry.labelObjects.forEach(obj => {
    const isFocused = !state.focusGroup || obj.userData?.isCenter || obj.userData?.groupKey === state.focusGroup;
    const labelScale = obj.userData?.isCenter ? scale * 1.08 : scale;
    obj.element.style.fontSize = (10 * labelScale) + 'px';
    obj.element.style.opacity = isFocused ? String(Math.min(1, 0.85 + scale * 0.2)) : String(Math.max(0.05, 0.08 * scale));
  });
}
