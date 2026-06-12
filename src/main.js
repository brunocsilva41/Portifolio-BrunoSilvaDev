import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { loadProjects, saveProjects, autoConnectProjects, resetProjects, getAbsolutePosition, PROJECT_GROUPS } from './projects.js';
import { setupImportUI } from './import-ui.js';

let projects = loadProjects();
projects = autoConnectProjects(projects);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x040a1a);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 18);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x040a1a, 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.9;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.prepend(renderer.domElement);

const labelContainer = document.createElement('div');
labelContainer.id = 'label-container';
document.body.appendChild(labelContainer);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'fixed';
labelRenderer.domElement.style.top = '0';
labelRenderer.domElement.style.pointerEvents = 'none';
labelContainer.appendChild(labelRenderer.domElement);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.15, 0.2, 0.1
);
composer.addPass(bloomPass);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 4;
controls.maxDistance = 30;
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.4;
controls.target.set(0, 0, 0);
controls.update();

document.body.addEventListener('pointerdown', () => { controls.autoRotate = false });
document.body.addEventListener('pointerup', () => {
  setTimeout(() => { controls.autoRotate = true }, 4000);
});

const starGroup = new THREE.Group();
const lineGroup = new THREE.Group();
const haloGroup = new THREE.Group();
const labelGroup = new THREE.Group();
const shootingStarGroup = new THREE.Group();
scene.add(starGroup);
scene.add(lineGroup);
scene.add(haloGroup);
scene.add(labelGroup);
scene.add(shootingStarGroup);

const starMeshes = [];
const glowSprites = [];
const lineMeshes = [];
const lineAnimData = [];
const shootingStars = [];

function clearScene() {
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
  starMeshes.length = 0;
  glowSprites.length = 0;
  lineMeshes.length = 0;
  lineAnimData.length = 0;
  lineConnections.length = 0;
  shootingStars.length = 0;
}

function createStarTexture(size = 128) {
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx = size / 2, cy = size / 2;

  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.05, 'rgba(255,255,255,0.85)');
  grad.addColorStop(0.2, 'rgba(255,255,255,0.25)');
  grad.addColorStop(0.5, 'rgba(255,255,255,0.03)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

function createGlowTexture(color, size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  const c = new THREE.Color(color);
  const cx = size / 2, cy = size / 2;

  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx);
  grad.addColorStop(0, `rgba(${c.r*255|0},${c.g*255|0},${c.b*255|0},1)`);
  grad.addColorStop(0.05, `rgba(${c.r*255|0},${c.g*255|0},${c.b*255|0},0.5)`);
  grad.addColorStop(0.25, `rgba(${c.r*255|0},${c.g*255|0},${c.b*255|0},0.1)`);
  grad.addColorStop(0.6, `rgba(${c.r*255|0},${c.g*255|0},${c.b*255|0},0.02)`);
  grad.addColorStop(1, `rgba(0,0,0,0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

let groupCenters = {};

const orbitData = [];

function buildScene(projList) {
  if (!projList || projList.length === 0) return;
  clearScene();
  groupCenters = {};
  orbitData.length = 0;

  const byGroup = {};
  projList.forEach(p => {
    if (p.group && !p.isCenter) {
      if (!byGroup[p.group]) byGroup[p.group] = [];
      byGroup[p.group].push(p);
    }
  });

  const drawnGroups = new Set();

  function makePlanet(pos, color, p, isCenter) {
    const techCount = (p.tech && p.tech.length) || 3;
    const radius = isCenter ? 0.5 : 0.18 + Math.min(techCount, 8) * 0.035;
    const segs = isCenter ? 48 : 24;

    const geo = new THREE.SphereGeometry(radius, segs, segs);
    const mat = new THREE.MeshPhysicalMaterial({
      color, emissive: color, emissiveIntensity: isCenter ? 0.6 : 0.25,
      metalness: isCenter ? 0.6 : 0.1, roughness: isCenter ? 0.2 : 0.6,
      clearcoat: isCenter ? 1.0 : 0.3, clearcoatRoughness: 0.15,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    mesh.userData = { projectId: p.id, phase: Math.random() * Math.PI * 2, isCenter };
    starGroup.add(mesh);
    starMeshes.push(mesh);

    if (!isCenter && Math.random() < 0.35) {
      const rg = new THREE.TorusGeometry(radius * 1.7, radius * 0.12, 12, 32);
      const rm = new THREE.MeshPhysicalMaterial({
        color, emissive: color, emissiveIntensity: 0.1,
        transparent: true, opacity: 0.2, side: THREE.DoubleSide,
        metalness: 0.3, roughness: 0.7,
      });
      const ringM = new THREE.Mesh(rg, rm);
      ringM.position.copy(pos);
      ringM.rotation.x = Math.PI / 2.8 + (Math.random() - 0.5) * 0.4;
      ringM.rotation.z = (Math.random() - 0.5) * 0.3;
      ringM.userData = { isRing: true };
      starGroup.add(ringM);
      starMeshes.push(ringM);
    }

    const gMat = new THREE.SpriteMaterial({
      map: createGlowTexture(color),
      blending: THREE.AdditiveBlending, transparent: true,
      opacity: isCenter ? 0.5 : 0.2, depthWrite: false,
    });
    const glow = new THREE.Sprite(gMat);
    glow.scale.set(isCenter ? 6 : 2.5, isCenter ? 6 : 2.5, 1);
    glow.position.copy(pos);
    glow.userData = { parentMesh: mesh, isCenter };
    starGroup.add(glow);
    glowSprites.push(glow);

    const lDiv = document.createElement('div');
    lDiv.className = 'star-label' + (isCenter ? ' center-label' : '');
    lDiv.textContent = isCenter ? 'MEU PERFIL' : p.title;
    lDiv.style.color = isCenter ? '#ffffff' : p.color;
    const label = new CSS2DObject(lDiv);
    const lo = isCenter ? 0.9 : 0.55;
    label.position.set(pos.x, pos.y - radius - lo, pos.z);
    labelGroup.add(label);

    if (isCenter) {
      const rGeo = new THREE.TorusGeometry(0.65, 0.03, 24, 48);
      const rMat = new THREE.MeshPhysicalMaterial({
        color: '#4488ff', emissive: '#4488ff', emissiveIntensity: 0.3,
        transparent: true, opacity: 0.4, metalness: 0.9, roughness: 0.1,
      });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.position.copy(pos);
      ring.rotation.x = Math.PI / 2.5;
      ring.userData = { isRing: true };
      starGroup.add(ring);
      starMeshes.push(ring);
    }

    return { mesh, glow, label, radius };
  }

  projList.forEach((p) => {
    if (p.isCenter) {
      const abs = getAbsolutePosition(p);
      const pos = new THREE.Vector3(abs.x, abs.y, abs.z);
      makePlanet(pos, new THREE.Color(p.color), p, true);
      return;
    }

    if (p.group && !drawnGroups.has(p.group)) {
      drawnGroups.add(p.group);
      const gCfg = PROJECT_GROUPS[p.group];
      if (!gCfg) return;
      const gc = new THREE.Vector3(gCfg.centerPos.x, gCfg.centerPos.y, gCfg.centerPos.z);
      groupCenters[p.group] = gc;

      const members = byGroup[p.group] || [];

      const sunRadius = 0.3;
      const sGeo = new THREE.SphereGeometry(sunRadius, 24, 24);
      const sMat = new THREE.MeshPhysicalMaterial({
        color: gCfg.color, emissive: gCfg.color, emissiveIntensity: 0.5,
        metalness: 0.3, roughness: 0.4,
      });
      const sunMesh = new THREE.Mesh(sGeo, sMat);
      sunMesh.position.copy(gc);
      sunMesh.userData = { isGroupSun: true, phase: Math.random() * Math.PI * 2 };
      starGroup.add(sunMesh);
      starMeshes.push(sunMesh);

      const sGlow = new THREE.Sprite(new THREE.SpriteMaterial({
        map: createGlowTexture(new THREE.Color(gCfg.color)),
        blending: THREE.AdditiveBlending, transparent: true,
        opacity: 0.3, depthWrite: false,
      }));
      sGlow.scale.set(4, 4, 1);
      sGlow.position.copy(gc);
      starGroup.add(sGlow);
      glowSprites.push(sGlow);

      const sLabel = document.createElement('div');
      sLabel.className = 'star-label center-label';
      const shortNames = { frontend: 'FRONT', backend: 'BACK', tools: 'AI' };
      sLabel.textContent = shortNames[p.group] || gCfg.label;
      sLabel.style.color = gCfg.color;
      const sLabelObj = new CSS2DObject(sLabel);
      sLabelObj.position.set(gc.x, gc.y - sunRadius - 0.7, gc.z);
      labelGroup.add(sLabelObj);

      const spread = 2.2;

      const r1 = new THREE.Mesh(
        new THREE.RingGeometry(spread - 0.08, spread, 64),
        new THREE.MeshBasicMaterial({ color: gCfg.color, transparent: true, opacity: 0.05, side: THREE.DoubleSide, depthWrite: false })
      );
      r1.position.copy(gc); r1.lookAt(0, 0, 0);
      haloGroup.add(r1);

      const r2 = new THREE.Mesh(
        new THREE.RingGeometry(spread + 0.02, spread + 0.08, 64),
        new THREE.MeshBasicMaterial({ color: gCfg.color, transparent: true, opacity: 0.02, side: THREE.DoubleSide, depthWrite: false })
      );
      r2.position.copy(gc); r2.lookAt(0, 0, 0);
      haloGroup.add(r2);

      const dotCount = 36;
      const dp = new Float32Array(dotCount * 3);
      for (let j = 0; j < dotCount; j++) {
        const a = (j / dotCount) * Math.PI * 2;
        dp[j*3] = gc.x + Math.cos(a) * spread;
        dp[j*3+1] = gc.y + Math.sin(a) * 0.3;
        dp[j*3+2] = gc.z + Math.sin(a) * spread * 0.6;
      }
      const dMesh = new THREE.Points(
        new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(dp, 3)),
        new THREE.PointsMaterial({ color: gCfg.color, size: 0.07, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true })
      );
      haloGroup.add(dMesh);

      const gRing = new THREE.Sprite(new THREE.SpriteMaterial({
        map: createGlowTexture(new THREE.Color(gCfg.color), 64),
        blending: THREE.AdditiveBlending, transparent: true, opacity: 0.03, depthWrite: false,
      }));
      gRing.scale.set(spread * 4, spread * 4, 1);
      gRing.position.copy(gc);
      haloGroup.add(gRing);

      const oct = 50;
      const op = new Float32Array(oct * 3);
      for (let j = 0; j < oct; j++) {
        const a = (j / oct) * Math.PI * 2 + Math.random() * 0.2;
        const r = spread + 0.6 + Math.random() * 0.5;
        op[j*3] = gc.x + Math.cos(a) * r;
        op[j*3+1] = gc.y + Math.sin(a) * (0.2 + Math.random() * 0.15);
        op[j*3+2] = gc.z + Math.sin(a) * r * 0.5;
      }
      const oMesh = new THREE.Points(
        new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(op, 3)),
        new THREE.PointsMaterial({ color: gCfg.color, size: 0.03, transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true })
      );
      oMesh.userData = { isOrbit: true, speed: 0.04 + Math.random() * 0.02 };
      haloGroup.add(oMesh);

      const memberCount = members.length;
      const groupSpeed = 0.2;
      members.forEach((proj, mi) => {
        const angle = (mi / memberCount) * Math.PI * 2;
        const dist = spread;
        const yOff = Math.sin(angle * 2) * 0.25;

        const initX = gc.x + Math.cos(angle) * dist;
        const initZ = gc.z + Math.sin(angle) * dist;
        const initPos = new THREE.Vector3(initX, gc.y + yOff, initZ);

        const { mesh, glow, label, radius } = makePlanet(initPos, new THREE.Color(proj.color), proj, false);

        mesh.userData.orbit = { center: gc.clone(), angle, dist, yOff, speed: groupSpeed };
        mesh.userData.label = label;
        mesh.userData.glow = glow;
        glow.userData.orbit = mesh.userData.orbit;
      });
    }
  });

  buildLines(projList);
}

const lineConnections = [];

function buildLines(projList) {
  lineConnections.length = 0;

  const meshMap = {};
  starMeshes.forEach(m => {
    if (m.userData.projectId !== undefined) meshMap[m.userData.projectId] = m;
  });

  const drawn = new Set();
  projList.forEach(p => {
    if (!p.connections) return;
    p.connections.forEach(connId => {
      const key = Math.min(p.id, connId) + '-' + Math.max(p.id, connId);
      if (drawn.has(key)) return;
      drawn.add(key);
      const fromMesh = meshMap[p.id];
      const toMesh = meshMap[connId];
      if (!fromMesh || !toMesh) return;

      const getPos = (m) => m.position.clone();

      const from = getPos(fromMesh);
      const to = getPos(toMesh);
      const mid = from.clone().add(to).multiplyScalar(0.5);
      const offset = mid.clone().normalize().multiplyScalar(0.3);
      const ctrl = mid.clone().add(offset);

      const sameGroup = p.group && projList.find(pr => pr.id === connId)?.group === p.group;
      const lineColor = sameGroup ? 0x6688ff : 0x4466aa;
      const opacity = sameGroup ? 0.2 : 0.08;

      const cpts = new THREE.QuadraticBezierCurve3(from, ctrl, to).getPoints(24);
      const geo = new THREE.BufferGeometry().setFromPoints(cpts);
      const mat = new THREE.LineBasicMaterial({
        color: lineColor, transparent: true, opacity,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const line = new THREE.Line(geo, mat);
      lineGroup.add(line);
      lineMeshes.push(line);
      lineConnections.push({ line, fromMesh, toMesh, ctrl, sameGroup, opacity });
      lineAnimData.push({ opacity, phase: Math.random() * Math.PI * 2, speed: 0.3 + Math.random() * 0.2 });

      if (sameGroup) {
        const dotMat = new THREE.PointsMaterial({
          color: 0x88aaff, size: 0.05, transparent: true, opacity: 0.2,
          blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
        });
        const dp = new Float32Array(16 * 3);
        const dg = new THREE.BufferGeometry();
        dg.setAttribute('position', new THREE.Float32BufferAttribute(dp, 3));
        const dots = new THREE.Points(dg, dotMat);
        lineGroup.add(dots);
        lineMeshes.push(dots);
        lineConnections.push({ isDots: true, dots, fromMesh, toMesh, ctrl, offset: Math.random() });
        lineAnimData.push({ opacity: 0.15, phase: Math.random() * Math.PI * 2, isDots: true, offset: Math.random() });
      }
    });
  });
}

function createBackground() {
  const count = 4000;
  const pos = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 20 + Math.random() * 80;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i*3+1] = r * Math.cos(phi) * (0.15 + Math.random() * 0.2);
    pos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
    const c = new THREE.Color().setHSL(0.58 + Math.random() * 0.25, 0.2, 0.3 + Math.random() * 0.55);
    colors[i*3] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const tex = createStarTexture(64);
  const mat = new THREE.PointsMaterial({
    size: 0.18, map: tex, vertexColors: true,
    transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending,
    depthWrite: false, sizeAttenuation: true,
  });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);
  return { pts };
}

const bg = createBackground();

let nebulaTheme = { r: 0.25, g: 0.15, b: 0.5 };
function setNebulaTheme(color) { nebulaTheme = color; }

const nebulaShaderMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color(0.12, 0.05, 0.25) },
    uColor2: { value: new THREE.Color(0.25, 0.10, 0.45) },
    uColor3: { value: new THREE.Color(0.08, 0.02, 0.15) },
    uOpacity: { value: 0.6 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform float uOpacity;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float fbm(vec2 p) {
      float val = 0.0;
      float amp = 0.5;
      float freq = 1.0;
      for (int i = 0; i < 5; i++) {
        val += amp * noise(p * freq);
        freq *= 2.0;
        amp *= 0.5;
      }
      return val;
    }

    void main() {
      vec2 uv = vUv;
      float t = uTime * 0.015;
      float n1 = fbm(uv * 2.5 + vec2(t * 0.3, t * 0.2));
      float n2 = fbm(uv * 4.0 - vec2(t * 0.2, t * 0.4));
      float n3 = fbm(uv * 1.5 + vec2(t * 0.5, -t * 0.3));

      vec3 col = mix(uColor1, uColor2, n1);
      col = mix(col, uColor3, n2 * 0.6);
      col += vec3(0.02, 0.01, 0.04) * n3;

      float bright = 0.3 + 0.7 * (n1 * 0.5 + n2 * 0.3 + n3 * 0.2);
      col *= bright;

      gl_FragColor = vec4(col, uOpacity * (0.4 + 0.3 * n1));
    }
  `,
  transparent: true, depthWrite: false, side: THREE.DoubleSide,
});

const nebulaSphere = new THREE.Mesh(
  new THREE.SphereGeometry(45, 32, 24),
  nebulaShaderMat
);
nebulaSphere.material.side = THREE.BackSide;
scene.add(nebulaSphere);

function animateBg(time, delta) {
  bg.pts.rotation.y = time * 0.003;
  bg.pts.rotation.x = Math.sin(time * 0.0008) * 0.02;
  nebulaShaderMat.uniforms.uTime.value = time;
  if (dustParticles) {
    dustParticles.rotation.y += delta * 0.006;
    dustParticles.rotation.x += delta * 0.002;
  }
}

function initShootingStars() {
  for (let i = 0; i < 3; i++) {
    const trail = 15;
    const pos = new Float32Array(trail * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xffffff, size: 0.1, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    });
    const pts = new THREE.Points(geo, mat);
    shootingStarGroup.add(pts);
    shootingStars.push({
      mesh: pts, active: false, trail,
      cooldown: Math.random() * 10, speed: 30 + Math.random() * 40,
      life: 0, maxLife: 0.5 + Math.random() * 0.4,
      dir: new THREE.Vector3((Math.random()-0.5)*2, -0.3-Math.random()*0.4, (Math.random()-0.5)*2).normalize(),
      startPos: new THREE.Vector3((Math.random()-0.5)*20, 5+Math.random()*5, -8+Math.random()*8),
    });
  }
}
initShootingStars();

let selectedStar = null;
let isAnimating = false;
let animTarget = null;
let cameraOrigin = null;
let targetControls = null;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerDown(event) {
  if (isAnimating) return;
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const meshes = starMeshes.filter(m => !m.userData.isRing);
  const intersects = raycaster.intersectObjects(meshes);
  if (intersects.length > 0) {
    const hit = intersects[0].object;
    const id = hit.userData.projectId;
    if (id !== undefined) selectStar(id);
  }
}

renderer.domElement.addEventListener('pointerdown', onPointerDown);

function triggerShootingStar() {
  const ss = shootingStars.find(s => !s.active);
  if (!ss) return;
  const pos = new THREE.Vector3(
    (Math.random() - 0.5) * 15,
    3 + Math.random() * 4,
    -5 + Math.random() * 5
  );
  const dir = new THREE.Vector3(
    (Math.random() - 0.5) * 0.5,
    -0.4 - Math.random() * 0.3,
    -1
  ).normalize();
  ss.active = true; ss.life = 0;
  ss.startPos.copy(pos);
  ss.dir.copy(dir);
  ss.speed = 30 + Math.random() * 25;
  ss.maxLife = 0.3 + Math.random() * 0.2;
  ss.mesh.material.opacity = 0.6;
}

function selectStar(id) {
  const project = projects.find(p => p.id === id);
  if (!project || isAnimating) return;
  isAnimating = true;
  selectedStar = id;
  controls.autoRotate = false;
  cameraOrigin = camera.position.clone();
  targetControls = { target: controls.target.clone() };
  triggerShootingStar();

  const absp = getAbsolutePosition(project);
  const tp = new THREE.Vector3(absp.x, absp.y, absp.z);
  const dir = tp.clone().normalize();
  const ct = tp.clone().add(dir.multiplyScalar(3));

  animTarget = {
    from: camera.position.clone(), to: ct,
    targetFrom: controls.target.clone(), targetTo: tp,
    progress: 0, duration: 1.0,
  };
  showProjectOverlay(project);
}

function animateCamera(delta) {
  const target = animTarget || travelTarget;
  if (!target) return;
  target.progress += delta / target.duration;
  const t = easeInOutCubic(Math.min(target.progress, 1));
  camera.position.lerpVectors(target.from, target.to, t);
  controls.target.lerpVectors(target.targetFrom, target.targetTo, t);
  controls.update();

  const isTravel = target === travelTarget;
  if (isTravel && warpParticles?.userData.active) {
    const pos = warpParticles.geometry.attributes.position.array;
    const vel = warpParticles.userData.vel;
    const speed = 2 + t * 6;
    for (let i = 0; i < pos.length / 3; i++) {
      pos[i*3] *= 1 + delta * speed * 0.5;
      pos[i*3+1] *= 1 + delta * speed * 0.5;
      pos[i*3+2] += vel[i] * speed * delta * 3;
      if (Math.abs(pos[i*3]) > 20 || Math.abs(pos[i*3+1]) > 15 || pos[i*3+2] > 20) {
        const a = Math.random() * Math.PI * 2;
        const r = 2 + Math.random() * 5;
        pos[i*3] = Math.cos(a) * r;
        pos[i*3+1] = Math.sin(a) * r * 0.6;
        pos[i*3+2] = -10 - Math.random() * 10;
      }
    }
    warpParticles.geometry.attributes.position.needsUpdate = true;
    warpParticles.material.opacity = Math.sin(t * Math.PI) * 0.5;
  }

  if (target.progress >= 1) {
    if (isTravel) {
      travelTarget = null;
      if (warpParticles) { warpParticles.material.opacity = 0; warpParticles.userData.active = false; }
      const status = document.getElementById('travel-status');
      if (status) setTimeout(() => status.classList.remove('active'), 800);
    } else {
      animTarget = null;
      setTimeout(() => { controls.autoRotate = true }, 3000);
    }
    isAnimating = false;
  }
}

function easeInOutCubic(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2 }

function showProjectOverlay(project) {
  const overlay = document.getElementById('project-overlay');
  document.getElementById('p-tag').textContent = project.tag;
  document.getElementById('p-title').textContent = project.title;
  document.getElementById('p-role').textContent = project.role || '';
  document.getElementById('p-desc').textContent = project.desc;
  const tc = document.getElementById('p-tech');
  tc.innerHTML = '';
  project.tech.forEach(t => {
    const s = document.createElement('span');
    s.textContent = t;
    tc.appendChild(s);
  });
  const lc = document.getElementById('p-links');
  lc.innerHTML = '';
  if (project.links.github) {
    const a = document.createElement('a');
    a.href = project.links.github; a.target = '_blank'; a.className = 'btn-primary';
    a.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> GitHub';
    lc.appendChild(a);
  }
  if (project.links.demo) {
    const a = document.createElement('a');
    a.href = project.links.demo; a.target = '_blank'; a.className = 'btn-secondary';
    a.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Demo';
    lc.appendChild(a);
  }
  const qrSection = document.getElementById('p-qr');
  const qrImg = document.getElementById('qr-img');
  if (project.isCenter) {
    qrSection.style.display = 'flex';
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(project.links.github || 'https://github.com/brunocsilva41')}`;
    qrImg.alt = 'QR Code GitHub';
  } else {
    qrSection.style.display = 'none';
  }
  overlay.classList.add('active');
}

function hideProjectOverlay() {
  document.getElementById('project-overlay').classList.remove('active');
}

document.getElementById('close-btn').addEventListener('click', () => {
  if (isAnimating) return;
  isAnimating = true;
  hideProjectOverlay();
  const project = projects.find(p => p.id === selectedStar);
  if (project && cameraOrigin) {
    animTarget = {
      from: camera.position.clone(), to: cameraOrigin,
      targetFrom: controls.target.clone(), targetTo: targetControls?.target || new THREE.Vector3(0,0,0),
      progress: 0, duration: 0.8,
    };
    setTimeout(() => {
      controls.enabled = true; selectedStar = null;
      setTimeout(() => { controls.autoRotate = true }, 3000);
    }, 800);
  } else {
    controls.enabled = true; selectedStar = null; isAnimating = false;
    setTimeout(() => { controls.autoRotate = true }, 3000);
  }
});

function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._hide);
  el._hide = setTimeout(() => el.classList.remove('show'), 3000);
}

document.getElementById('delete-btn')?.addEventListener('click', () => {
  if (isAnimating || selectedStar === null) return;
  const project = projects.find(p => p.id === selectedStar);
  if (!project || project.isCenter) {
    showToast('Nao é possivel remover a estrela central');
    return;
  }
  projects = projects.filter(p => p.id !== selectedStar);
  projects = autoConnectProjects(projects);
  saveProjects(projects);
  hideProjectOverlay();
  showToast(`"${project.title}" removido da constelação`);
  rebuildConstellation();
});

document.getElementById('reset-btn')?.addEventListener('click', () => {
  if (isAnimating) return;
  projects = resetProjects();
  projects = autoConnectProjects(projects);
  saveProjects(projects);
  hideProjectOverlay();
  showToast('Constelação restaurada para o padrão');
  rebuildConstellation();
});

function animateStars(time) {
  starMeshes.forEach(m => {
    if (m.userData.isRing) {
      m.rotation.z += 0.004; m.rotation.x += 0.002; return;
    }
    const ph = m.userData.phase || 0;
    const pulse = 0.9 + 0.1 * Math.sin(time * 0.8 + ph);
    if (!m.userData.isCenter && !m.userData.isGroupSun) m.scale.set(pulse, pulse, pulse);
    m.rotation.y += 0.003;

    if (m.userData.orbit) {
      const o = m.userData.orbit;
      o.angle += 0.004 * o.speed;
      const x = o.center.x + Math.cos(o.angle) * o.dist;
      const z = o.center.z + Math.sin(o.angle) * o.dist;
      m.position.set(x, o.center.y + o.yOff, z);
      if (m.userData.glow) m.userData.glow.position.copy(m.position);
      if (m.userData.label) {
        const lo = m.userData.isCenter ? 0.9 : 0.55;
        const rad = m.userData.isCenter ? 0.5 : (0.18 + (m.userData.techCount || 3) * 0.035);
        m.userData.label.position.set(m.position.x, m.position.y - rad - lo, m.position.z);
      }
    }
  });
  haloGroup.children.forEach(c => {
    if (c.userData?.isOrbit) c.rotation.y += c.userData.speed * 0.01;
  });
  glowSprites.forEach(s => {
    const m = s.userData.parentMesh;
    if (!m) return;
    const ph = m.userData.phase || 0;
    const pulse = 0.8 + 0.2 * Math.sin(time * 0.7 + ph);
    const bs = s.userData.isCenter ? 6 : 2.5;
    s.scale.set(bs * pulse, bs * pulse, 1);
    s.material.opacity = s.userData.isCenter ? 0.5 : (0.18 + 0.08 * Math.sin(time * 0.6 + ph));
  });
}

function animateLines(time) {
  for (let i = 0; i < lineConnections.length; i++) {
    const conn = lineConnections[i];
    const anim = lineAnimData[i];
    if (!conn || !anim) continue;

    const from = conn.fromMesh?.position;
    const to = conn.toMesh?.position;
    if (!from || !to) continue;

    if (conn.isDots && conn.dots) {
      const flow = (time * 0.3 + conn.offset) % 1;
      const pos = conn.dots.geometry.attributes.position.array;
      const cnt = pos.length / 3;
      const mid = from.clone().add(to).multiplyScalar(0.5);
      const norm = mid.clone().normalize().multiplyScalar(0.3);
      const ctrl = mid.clone().add(norm);
      const curve = new THREE.QuadraticBezierCurve3(from.clone(), ctrl, to.clone());
      for (let j = 0; j < cnt; j++) {
        const t = ((j / cnt) + flow) % 1;
        const pt = curve.getPoint(t);
        pos[j*3] = pt.x; pos[j*3+1] = pt.y; pos[j*3+2] = pt.z;
      }
      conn.dots.geometry.attributes.position.needsUpdate = true;
      conn.dots.material.opacity = 0.06 + 0.06 * Math.sin(time * 0.5 + anim.phase);
    } else if (conn.line) {
      const mid = from.clone().add(to).multiplyScalar(0.5);
      const norm = mid.clone().normalize().multiplyScalar(0.3);
      const ctrl = mid.clone().add(norm);
      const cpts = new THREE.QuadraticBezierCurve3(from.clone(), ctrl, to.clone()).getPoints(24);
      const pos = conn.line.geometry.attributes.position.array;
      for (let j = 0; j < cpts.length && j * 3 + 2 < pos.length; j++) {
        pos[j*3] = cpts[j].x; pos[j*3+1] = cpts[j].y; pos[j*3+2] = cpts[j].z;
      }
      conn.line.geometry.attributes.position.needsUpdate = true;
      conn.line.material.opacity = anim.opacity * (0.6 + 0.4 * Math.sin(time * 0.3 + anim.phase));
    }
  }
}

function animateShootingStars(time, delta) {
  shootingStars.forEach(ss => {
    if (!ss.active) {
      ss.cooldown -= delta;
      if (ss.cooldown <= 0) {
        ss.active = true; ss.life = 0;
        ss.startPos.set((Math.random()-0.5)*20, 4+Math.random()*6, -10+Math.random()*10);
        ss.dir.set((Math.random()-0.5)*2, -0.3-Math.random()*0.3, (Math.random()-0.5)*2).normalize();
        ss.speed = 25 + Math.random() * 35; ss.maxLife = 0.4 + Math.random() * 0.4;
      }
      ss.mesh.material.opacity = 0; return;
    }
    ss.life += delta;
    const p = ss.life / ss.maxLife;
    if (p >= 1) { ss.active = false; ss.cooldown = 5 + Math.random() * 10; ss.mesh.material.opacity = 0; return; }
    const pos = ss.startPos.clone().add(ss.dir.clone().multiplyScalar(ss.speed * ss.life));
    const arr = ss.mesh.geometry.attributes.position.array;
    for (let j = ss.trail - 1; j > 0; j--) {
      arr[j*3] = arr[(j-1)*3]; arr[j*3+1] = arr[(j-1)*3+1]; arr[j*3+2] = arr[(j-1)*3+2];
    }
    arr[0] = pos.x; arr[1] = pos.y; arr[2] = pos.z;
    ss.mesh.geometry.attributes.position.needsUpdate = true;
    ss.mesh.material.opacity = (1 - p) * 0.5;
  });
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  composer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize);

function rebuildConstellation() {
  if (isAnimating) return;
  hideProjectOverlay();
  controls.autoRotate = false;
  selectedStar = null; cameraOrigin = null; animTarget = null; isAnimating = false;
camera.position.set(0, 2, 18);
  controls.target.set(0, 0, 0);
  controls.update();
document.getElementById('overview-btn')?.addEventListener('click', () => {
  if (isAnimating) return;
  isAnimating = true;
  controls.autoRotate = false;
  const overviewTarget = new THREE.Vector3(0, 1, 22);
  travelTarget = {
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
});

const themeCycle = [
  { name: 'Azul', bg: 0x040a1a, c1: [0.03, 0.06, 0.20], c2: [0.08, 0.15, 0.35], c3: [0.02, 0.04, 0.12] },
  { name: 'Roxo', bg: 0x0a0518, c1: [0.12, 0.05, 0.25], c2: [0.25, 0.10, 0.45], c3: [0.08, 0.02, 0.15] },
  { name: 'Vermelho', bg: 0x180808, c1: [0.20, 0.04, 0.04], c2: [0.35, 0.08, 0.10], c3: [0.12, 0.02, 0.02] },
  { name: 'Verde', bg: 0x06120a, c1: [0.04, 0.12, 0.06], c2: [0.08, 0.25, 0.12], c3: [0.02, 0.08, 0.04] },
  { name: 'Preto', bg: 0x000000, c1: [0.0, 0.0, 0.0], c2: [0.01, 0.01, 0.02], c3: [0.0, 0.0, 0.0] },
];
let themeIdx = 0;
document.getElementById('theme-btn')?.addEventListener('click', () => {
  themeIdx = (themeIdx + 1) % themeCycle.length;
  const t = themeCycle[themeIdx];
  scene.background.setHex(t.bg);
  renderer.setClearColor(t.bg, 1);
  nebulaShaderMat.uniforms.uColor1.value.set(t.c1[0], t.c1[1], t.c1[2]);
  nebulaShaderMat.uniforms.uColor2.value.set(t.c2[0], t.c2[1], t.c2[2]);
  nebulaShaderMat.uniforms.uColor3.value.set(t.c3[0], t.c3[1], t.c3[2]);
  showToast(`Tema: ${t.name}`);
});

buildScene(projects);
  setTimeout(() => { controls.autoRotate = true }, 2000);
}

setupImportUI((newProject) => {
  projects.push(newProject);
  projects = autoConnectProjects(projects);
  saveProjects(projects);
  rebuildConstellation();
});

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

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.nav-star');
  if (btn && btn.dataset.group) travelToConstellation(btn.dataset.group);
});

let warpParticles = null;
function createWarpParticles() {
  if (warpParticles) return;
  const count = 800;
  const pos = new Float32Array(count * 3);
  const vel = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i*3] = (Math.random() - 0.5) * 30;
    pos[i*3+1] = (Math.random() - 0.5) * 20;
    pos[i*3+2] = (Math.random() - 0.5) * 40 - 20;
    vel[i] = 0.5 + Math.random() * 1.5;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 0x88aaff, size: 0.15, transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  });
  warpParticles = new THREE.Points(geo, mat);
  warpParticles.userData.vel = vel;
  warpParticles.userData.active = false;
  scene.add(warpParticles);
}
createWarpParticles();

function createSpaceDust() {
  const count = 800;
  const pos = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i*3] = (Math.random() - 0.5) * 60;
    pos[i*3+1] = (Math.random() - 0.5) * 40;
    pos[i*3+2] = (Math.random() - 0.5) * 60;
    sizes[i] = 0.01 + Math.random() * 0.03;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
  const mat = new THREE.PointsMaterial({
    color: 0x8888cc, size: 0.02, transparent: true, opacity: 0.15,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  });
  const pts = new THREE.Points(geo, mat);
  pts.userData = { isDust: true, speed: 0.003 };
  scene.add(pts);
  return pts;
}
const dustParticles = createSpaceDust();

let travelTarget = null;

function travelToConstellation(group) {
  if (isAnimating && !animTarget && !travelTarget) isAnimating = false;
  if (isAnimating || !group) return;
  const gCfg = PROJECT_GROUPS[group];
  if (!gCfg) return;
  isAnimating = true;
  controls.autoRotate = false;
  hideProjectOverlay();
  selectedStar = null;

  document.querySelectorAll('.nav-star').forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.nav-star[data-group="${group}"]`);
  activeBtn?.classList.add('active');

  const dist = 4 + Math.sqrt(gCfg.centerPos.x**2 + gCfg.centerPos.y**2 + gCfg.centerPos.z**2) * 0.3;
  const targetPos = new THREE.Vector3(gCfg.centerPos.x, gCfg.centerPos.y, gCfg.centerPos.z + dist);
  const targetLook = new THREE.Vector3(gCfg.centerPos.x, gCfg.centerPos.y, gCfg.centerPos.z);
  const from = camera.position.clone();
  const fromTarget = controls.target.clone();

  const duration = 1.5 + dist * 0.08;
  travelTarget = {
    from, to: targetPos,
    targetFrom: fromTarget, targetTo: targetLook,
    progress: 0, duration: Math.min(duration, 3.5), group,
  };

  const status = document.getElementById('travel-status');
  if (status) {
    const names = { frontend: 'FRONTEND & WEB', backend: 'BACKEND & INFRA', tools: 'AI & AUTOMAÇÃO' };
    status.textContent = `VIAGEM PARA ${names[group] || group}`;
    status.classList.add('active');
  }

  if (warpParticles) {
    warpParticles.userData.active = true;
    const pos = warpParticles.geometry.attributes.position.array;
    for (let i = 0; i < pos.length / 3; i++) {
      pos[i*3] = (Math.random() - 0.5) * 30;
      pos[i*3+1] = (Math.random() - 0.5) * 20;
      pos[i*3+2] = (Math.random() - 0.5) * 30 - 15;
    }
    warpParticles.geometry.attributes.position.needsUpdate = true;
  }
}

buildScene(projects);

let lastTime = performance.now();
let totalTime = 0;

function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const delta = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;
  totalTime += delta;

  if (isAnimating && !animTarget && !travelTarget) {
    isAnimating = false;
  }

  animateStars(totalTime);
  animateLines(totalTime);
  animateBg(totalTime, delta);
  animateShootingStars(totalTime, delta);
  if (animTarget || travelTarget) animateCamera(delta);
  controls.update();
  composer.render();
  labelRenderer.render(scene, camera);
}

animate();
