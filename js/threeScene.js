import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true
});

// Setup
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

// Chessboard with Glowing Effect
const boardSize = 8;
const tileGeometry = new THREE.BoxGeometry(1, 0.1, 1);
const darkMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x111111,
    metalness: 0.9,
    roughness: 0.5
});
const lightMaterial = new THREE.MeshStandardMaterial({
    color: 0x00f7ff,
    emissive: 0x003344,
    metalness: 0.95,
    roughness: 0.1
});

// Grid Alignment
for(let i = 0; i < boardSize; i++) {
    for(let j = 0; j < boardSize; j++) {
        const material = (i + j) % 2 === 0 ? lightMaterial : darkMaterial;
        const tile = new THREE.Mesh(tileGeometry, material);
        tile.position.set(
            i - boardSize/2 + 0.5,  // Center alignment
            0,
            j - boardSize/2 + 0.5
        );
        scene.add(tile);
    }
}

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00ffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Camera
camera.position.set(8, 12, 8);
camera.lookAt(0, 0, 0);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Animation
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});