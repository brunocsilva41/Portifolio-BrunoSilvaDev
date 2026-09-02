import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x040a1a);
scene.fog = new THREE.FogExp2(0x030712, 0.0011);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1200);
camera.position.set(0, 8, 0.1);

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
  0.3, 0.35, 0.12
);
composer.addPass(bloomPass);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 4;
controls.maxDistance = 140;
controls.minPolarAngle = 0.1;
controls.maxPolarAngle = 1.2;
controls.enablePan = true;
controls.screenSpacePanning = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.24;
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

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  composer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize);

export { camera, composer, controls, createGlowTexture, createStarTexture, haloGroup, labelGroup, labelRenderer, lineGroup, renderer, scene, shootingStarGroup, starGroup };

