import * as THREE from 'three';
import { camera, createStarTexture, scene, shootingStarGroup } from './scene.js';
import { registry } from './state.js';

export const fx = {
  bg: null,
  nebulaMat: null,
  nebulaMesh: null,
  warpParticles: null,
  dustParticles: null,
};

function createStarLayer({ count, minR, maxR, size, opacity, flatten }) {
  const pos = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = minR + Math.random() * (maxR - minR);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    // flatten < 1 concentra as estrelas perto do plano do horizonte (faixa da "via láctea")
    const yScale = flatten + Math.random() * (1 - flatten);
    pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i*3+1] = r * Math.cos(phi) * yScale;
    pos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
    const c = new THREE.Color().setHSL(0.52 + Math.random() * 0.35, 0.25 + Math.random() * 0.35, 0.35 + Math.random() * 0.5);
    colors[i*3] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size, map: createStarTexture(64), vertexColors: true,
    transparent: true, opacity, blending: THREE.AdditiveBlending,
    depthWrite: false, sizeAttenuation: true,
  });
  const pts = new THREE.Points(geo, mat);
  pts.userData.followCamera = true;
  scene.add(pts);
  return pts;
}

function createBackground() {
  // Camada distante: milhares de estrelas pequenas cobrindo a esfera toda
  const pts = createStarLayer({ count: 6500, minR: 90, maxR: 300, size: 0.35, opacity: 0.85, flatten: 0.55 });
  // Camada próxima: estrelas maiores e mais brilhantes, esparsas
  const near = createStarLayer({ count: 900, minR: 50, maxR: 140, size: 0.9, opacity: 0.9, flatten: 0.35 });
  // Faixa galáctica: densa e achatada no plano do horizonte
  const band = createStarLayer({ count: 2600, minR: 120, maxR: 280, size: 0.28, opacity: 0.55, flatten: 0.06 });
  return { pts, near, band };
}

function initNebula() {
  fx.nebulaMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(0.03, 0.06, 0.20) },
      uColor2: { value: new THREE.Color(0.08, 0.15, 0.35) },
      uColor3: { value: new THREE.Color(0.10, 0.04, 0.22) },
      uOpacity: { value: 0.42 },
    },
    vertexShader: `
    varying vec3 vDir;
    void main() {
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vDir = normalize(worldPos.xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    precision highp float;
    varying vec3 vDir;
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform float uOpacity;

    float hash3(vec3 p) {
      return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
    }

    float noise3(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);

      float n000 = hash3(i + vec3(0.0, 0.0, 0.0));
      float n100 = hash3(i + vec3(1.0, 0.0, 0.0));
      float n010 = hash3(i + vec3(0.0, 1.0, 0.0));
      float n110 = hash3(i + vec3(1.0, 1.0, 0.0));
      float n001 = hash3(i + vec3(0.0, 0.0, 1.0));
      float n101 = hash3(i + vec3(1.0, 0.0, 1.0));
      float n011 = hash3(i + vec3(0.0, 1.0, 1.0));
      float n111 = hash3(i + vec3(1.0, 1.0, 1.0));

      float nx00 = mix(n000, n100, f.x);
      float nx10 = mix(n010, n110, f.x);
      float nx01 = mix(n001, n101, f.x);
      float nx11 = mix(n011, n111, f.x);
      float nxy0 = mix(nx00, nx10, f.y);
      float nxy1 = mix(nx01, nx11, f.y);

      return mix(nxy0, nxy1, f.z);
    }

    float fbm3(vec3 p) {
      float val = 0.0;
      float amp = 0.5;
      float freq = 1.0;
      for (int i = 0; i < 5; i++) {
        val += amp * noise3(p * freq);
        freq *= 2.0;
        amp *= 0.5;
      }
      return val;
    }

    void main() {
      float t = uTime * 0.06;
      vec3 p = vDir * 4.0;
      float n1 = fbm3(p + vec3(t * 0.20, -t * 0.16, t * 0.11));
      float n2 = fbm3(p * 1.8 + vec3(-t * 0.07, t * 0.13, t * 0.09));
      float n3 = fbm3(p * 2.6 + vec3(t * 0.04, t * 0.06, -t * 0.05));

      vec3 col = mix(uColor1, uColor2, n1);
      col = mix(col, uColor3, n2 * 0.55);
      col += vec3(0.012, 0.008, 0.022) * n3;

      float horizon = smoothstep(-0.25, 0.45, vDir.y);
      float bright = 0.32 + 0.68 * (n1 * 0.5 + n2 * 0.3 + n3 * 0.2);
      col *= bright;
      col *= mix(0.65, 1.08, horizon);

      float alpha = uOpacity * (0.30 + 0.34 * n1 + 0.18 * n2);
      gl_FragColor = vec4(col, alpha);
    }
  `,
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
  });

  fx.nebulaMesh = new THREE.Mesh(new THREE.SphereGeometry(320, 64, 64), fx.nebulaMat);
  fx.nebulaMesh.material.side = THREE.BackSide;
  fx.nebulaMesh.userData.followCamera = true;
  scene.add(fx.nebulaMesh);
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
    registry.shootingStars.push({
      mesh: pts, active: false, trail,
      cooldown: Math.random() * 10, speed: 30 + Math.random() * 40,
      life: 0, maxLife: 0.5 + Math.random() * 0.4,
      dir: new THREE.Vector3((Math.random()-0.5)*2, -0.3-Math.random()*0.4, (Math.random()-0.5)*2).normalize(),
      startPos: new THREE.Vector3((Math.random()-0.5)*20, 5+Math.random()*5, -8+Math.random()*8),
    });
  }
}

export function triggerShootingStar() {
  const ss = registry.shootingStars.find(s => !s.active);
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

function animateShootingStars(time, delta) {
  registry.shootingStars.forEach(ss => {
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

function createWarpParticles() {
  if (fx.warpParticles) return;
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
    color: 0x6699ff, size: 0.12, transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  });
  fx.warpParticles = new THREE.Points(geo, mat);
  fx.warpParticles.userData.vel = vel;
  fx.warpParticles.userData.active = false;
  scene.add(fx.warpParticles);
}

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
  pts.userData.followCamera = true;
  scene.add(pts);
  return pts;
}

export function initEffects() {
  fx.bg = createBackground();
  initNebula();
  initShootingStars();
  createWarpParticles();
  fx.dustParticles = createSpaceDust();
}

export function animateEffects(time, delta) {
  if (fx.nebulaMesh?.userData.followCamera) {
    fx.nebulaMesh.position.copy(camera.position);
  }
  if (fx.bg?.pts?.userData.followCamera) {
    fx.bg.pts.position.copy(camera.position);
    fx.bg.near?.position.copy(camera.position);
    fx.bg.band?.position.copy(camera.position);
  }
  if (fx.dustParticles?.userData.followCamera) {
    fx.dustParticles.position.copy(camera.position);
  }

  fx.bg.pts.rotation.y = time * 0.003;
  fx.bg.pts.rotation.x = Math.sin(time * 0.0008) * 0.02;
  if (fx.bg.near) fx.bg.near.rotation.y = time * 0.005;
  if (fx.bg.band) fx.bg.band.rotation.y = time * 0.002;
  fx.nebulaMat.uniforms.uTime.value = time;
  if (fx.dustParticles) {
    fx.dustParticles.rotation.y += delta * 0.006;
    fx.dustParticles.rotation.x += delta * 0.002;
  }
  animateShootingStars(time, delta);
}
