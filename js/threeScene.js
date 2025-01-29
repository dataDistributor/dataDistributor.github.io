import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const container = document.getElementById('scene-container');

// Setup
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Chessboard
const boardSize = 8;
const geometry = new THREE.BoxGeometry(1, 0.2, 1);
const darkMaterial = new THREE.MeshPhongMaterial({ color: 0x4F46E5 });
const lightMaterial = new THREE.MeshPhongMaterial({ color: 0x10B981 });

for(let i = 0; i < boardSize; i++) {
    for(let j = 0; j < boardSize; j++) {
        const material = (i + j) % 2 === 0 ? lightMaterial : darkMaterial;
        const tile = new THREE.Mesh(geometry, material);
        tile.position.set(i - boardSize/2, 0, j - boardSize/2);
        scene.add(tile);
    }
}

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Camera
camera.position.set(8, 8, 8);
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

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});