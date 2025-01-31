import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

// Debug initialization
console.log('Initializing 3D scene...');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
});

// Renderer Setup
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('scene-container').appendChild(renderer.domElement);
console.log('Renderer initialized:', renderer.domElement);

// Enhanced Materials with Brighter Emission
const darkMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x111111,
    emissive: 0x444444,  // Brighter emission
    emissiveIntensity: 2.5,
    metalness: 0.9,
    roughness: 0.1
});

const lightMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x006666,  // Increased emission
    emissiveIntensity: 3.0,
    metalness: 0.8,
    roughness: 0.2
});

// Chessboard Construction (Larger Tiles)
const boardSize = 8;
const tileSize = 1.5;  // Increased tile size
const tileGeometry = new THREE.BoxGeometry(tileSize, 0.2, tileSize);

for(let i = 0; i < boardSize; i++) {
    for(let j = 0; j < boardSize; j++) {
        const material = (i + j) % 2 === 0 ? lightMaterial : darkMaterial;
        const tile = new THREE.Mesh(tileGeometry, material);
        tile.position.set(
            i * tileSize - (boardSize * tileSize)/2 + tileSize/2,
            -0.1,
            j * tileSize - (boardSize * tileSize)/2 + tileSize/2
        );
        scene.add(tile);
    }
}

// Enhanced Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
directionalLight.position.set(10, 15, 10);
scene.add(directionalLight);

// Camera Configuration
camera.position.set(10, 15, 10);  // Higher vantage point
camera.lookAt(0, 0, 0);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 8;
controls.maxDistance = 25;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Initialization Check
scene.add(new THREE.AxesHelper(5));  // Debug axes
animate();

console.log('Scene initialized with:', scene.children.length, 'objects');