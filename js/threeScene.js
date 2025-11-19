import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

// Data-flow style background using instancing, no external helpers
const containerElement = document.getElementById('scene-container');
if (!containerElement) {
  console.warn('No scene container found for Three.js background');
}

// Scene and camera
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x02030a, 0.018);

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);
camera.position.set(0, 10, 80);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.setClearColor(0x000000, 0);

if (containerElement) {
  containerElement.appendChild(renderer.domElement);
}

// Lights
const ambientLight = new THREE.AmbientLight(0x8899ff, 0.6);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(30, 40, 50);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0x4f9dff, 0.8);
rimLight.position.set(-40, -20, -30);
scene.add(rimLight);

// Central “core” object
const coreGeometry = new THREE.IcosahedronGeometry(12, 2);
const coreMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x7ee0ff,
  metalness: 0.7,
  roughness: 0.18,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  emissive: 0x0a3e8a,
  emissiveIntensity: 0.7,
  transmission: 0.4,
  thickness: 4
});
const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
scene.add(coreMesh);

// Quality presets for desktop vs mobile
const isMobile = window.matchMedia('(max-width: 768px)').matches;

const orbitCount = isMobile ? 260 : 520;
const streamCount = isMobile ? 80 : 150;

// Orbiting data nodes (instanced spheres)
const orbitGeometry = new THREE.SphereGeometry(0.7, 12, 12);
const orbitMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.8,
  roughness: 0.25
});

const orbitMesh = new THREE.InstancedMesh(orbitGeometry, orbitMaterial, orbitCount);
orbitMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
scene.add(orbitMesh);

const orbitData = [];
const orbitColor = new THREE.Color();

for (let i = 0; i < orbitCount; i += 1) {
  const radius = 18 + Math.random() * 55;
  const verticalOffset = (Math.random() - 0.5) * 24;
  const speed =
    (0.15 + Math.random() * 0.35) * (Math.random() > 0.5 ? 1 : -1);
  const phase = Math.random() * Math.PI * 2;

  const hue = 0.52 + (radius / 80) * 0.12;
  orbitColor.setHSL(hue, 0.8, 0.6);
  orbitMesh.setColorAt(i, orbitColor);

  orbitData.push({
    radius,
    verticalOffset,
    speed,
    phase
  });
}

if (orbitMesh.instanceColor) {
  orbitMesh.instanceColor.needsUpdate = true;
}

// Streaming “packets” that move toward the core
const streamGeometry = new THREE.BoxGeometry(0.35, 0.35, 3.1);
const streamMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0x00f7ff,
  emissiveIntensity: 1.6,
  metalness: 0.3,
  roughness: 0.35
});

const streamMesh = new THREE.InstancedMesh(
  streamGeometry,
  streamMaterial,
  streamCount
);
streamMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
scene.add(streamMesh);

const streamData = [];
const streamOriginLeft = new THREE.Vector3(-60, 0, -40);
const streamOriginRight = new THREE.Vector3(60, 0, -40);

for (let i = 0; i < streamCount; i += 1) {
  const fromLeft = i % 2 === 0;
  const basePosition = fromLeft
    ? streamOriginLeft.clone()
    : streamOriginRight.clone();

  const targetPosition = new THREE.Vector3(
    (Math.random() - 0.5) * 26,
    (Math.random() - 0.5) * 20,
    -4 + Math.random() * 16
  );

  const travelDuration = 3.5 + Math.random() * 4.0;
  const offsetTime = Math.random() * travelDuration;

  streamData.push({
    basePosition,
    targetPosition,
    travelDuration,
    offsetTime
  });
}

// Interaction state
const interactionState = {
  pointerX: 0,
  pointerY: 0,
  cameraX: 0,
  cameraY: 8,
  cameraZ: 80
};

window.addEventListener('pointermove', (event) => {
  const normalizedX = event.clientX / window.innerWidth - 0.5;
  const normalizedY = event.clientY / window.innerHeight - 0.5;
  interactionState.pointerX = normalizedX;
  interactionState.pointerY = normalizedY;
});

window.addEventListener('scroll', () => {
  const scrollNormalized = window.scrollY / (window.innerHeight * 2);
  const clamped = THREE.MathUtils.clamp(scrollNormalized, 0, 1);
  interactionState.cameraZ = 80 - clamped * 18;
});

// Resize handling
function handleResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

window.addEventListener('resize', handleResize);

// Animation loop setup
const orbitMatrix = new THREE.Matrix4();
const orbitPosition = new THREE.Vector3();
const orbitQuaternion = new THREE.Quaternion();
const orbitScale = new THREE.Vector3(1, 1, 1);
const orbitEuler = new THREE.Euler();

const streamMatrix = new THREE.Matrix4();
const streamPosition = new THREE.Vector3();
const streamLookTarget = new THREE.Vector3();
const streamDirection = new THREE.Vector3();
const streamQuaternion = new THREE.Quaternion();
const streamScale = new THREE.Vector3();

const clock = new THREE.Clock();

function renderFrame() {
  const elapsed = clock.getElapsedTime();

  // Core motion
  coreMesh.rotation.y = elapsed * 0.25;
  coreMesh.rotation.x = Math.sin(elapsed * 0.35) * 0.25;

  // Camera parallax and subtle dolly
  const parallaxStrengthX = 12;
  const parallaxStrengthY = 10;

  const targetX = interactionState.pointerX * parallaxStrengthX;
  const targetY = 8 - interactionState.pointerY * parallaxStrengthY;

  interactionState.cameraX += (targetX - interactionState.cameraX) * 0.06;
  interactionState.cameraY += (targetY - interactionState.cameraY) * 0.06;

  camera.position.x = interactionState.cameraX;
  camera.position.y = interactionState.cameraY;
  camera.position.z += (interactionState.cameraZ - camera.position.z) * 0.06;
  camera.lookAt(0, 0, 0);

  // Update orbit instances
  for (let i = 0; i < orbitCount; i += 1) {
    const orbitInfo = orbitData[i];
    const angle = orbitInfo.phase + elapsed * orbitInfo.speed;

    const baseX = Math.cos(angle) * orbitInfo.radius;
    const baseZ = Math.sin(angle) * orbitInfo.radius;
    const wobble =
      Math.sin(elapsed * 0.9 + orbitInfo.phase) * 2.5 +
      Math.sin(elapsed * 1.3 + orbitInfo.phase * 1.7) * 1.1;

    const y = orbitInfo.verticalOffset + wobble;

    orbitPosition.set(baseX, y, baseZ);

    orbitEuler.set(
      Math.sin(elapsed * 0.6 + orbitInfo.phase) * 0.5,
      angle,
      0
    );
    orbitQuaternion.setFromEuler(orbitEuler);

    orbitMatrix.compose(orbitPosition, orbitQuaternion, orbitScale);
    orbitMesh.setMatrixAt(i, orbitMatrix);
  }
  orbitMesh.instanceMatrix.needsUpdate = true;

  // Update streaming packets
  for (let i = 0; i < streamCount; i += 1) {
    const packetInfo = streamData[i];

    const streamTime =
      (elapsed + packetInfo.offsetTime) % packetInfo.travelDuration;
    const normalizedTime = streamTime / packetInfo.travelDuration;
    const easedTime = THREE.MathUtils.smoothstep(normalizedTime, 0, 1);

    streamPosition
      .copy(packetInfo.basePosition)
      .lerp(packetInfo.targetPosition, easedTime);

    streamLookTarget.copy(packetInfo.targetPosition);
    streamLookTarget.y += 0.5;

    streamDirection
      .subVectors(streamLookTarget, streamPosition)
      .normalize();

    streamQuaternion.setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      streamDirection
    );

    const baseScale = 1 + easedTime * 1.0;
    streamScale.set(1, 1, baseScale);

    streamMatrix.compose(streamPosition, streamQuaternion, streamScale);
    streamMesh.setMatrixAt(i, streamMatrix);
  }
  streamMesh.instanceMatrix.needsUpdate = true;

  renderer.render(scene, camera);
  requestAnimationFrame(renderFrame);
}

renderFrame();

console.log('Three.js data-flow background initialised (no postprocessing)');

