import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
});

// Renderer Configuration
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('scene-container').appendChild(renderer.domElement);

// Chessboard Materials
const darkMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x111111,
    emissive: 0x222222,
    emissiveIntensity: 1.5,
    metalness: 0.95,
    roughness: 0.2
});

const lightMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x008888,
    emissiveIntensity: 2.0,
    metalness: 0.98,
    roughness: 0.1
});

// Chessboard Construction
const boardSize = 8;
const tileGeometry = new THREE.BoxGeometry(1, 0.1, 1);

for(let i = 0; i < boardSize; i++) {
    for(let j = 0; j < boardSize; j++) {
        const material = (i + j) % 2 === 0 ? lightMaterial : darkMaterial;
        const tile = new THREE.Mesh(tileGeometry, material);
        tile.position.set(
            i - boardSize/2 + 0.5,
            0,
            j - boardSize/2 + 0.5
        );
        scene.add(tile);
    }
}

const gridHelper = new THREE.GridHelper(
    8,          // Size of the grid (matches chessboard size)
    8,          // Number of divisions
    0x444444,   // Center line color (dark gray)
    0x888888    // Grid line color (light gray)
  );
  gridHelper.position.y = -0.1; // Slightly below the tiles
  scene.add(gridHelper);
  
// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00ffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Camera & Controls
camera.position.set(8, 12, 8);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Window Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});