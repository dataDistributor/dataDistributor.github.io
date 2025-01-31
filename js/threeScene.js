import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

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

// Enhanced Materials
const darkMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x111111,
    emissive: 0x222222,
    emissiveIntensity: 1.5,
    metalness: 0.95,
    roughness: 0.1
});

const lightMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x004444,
    emissiveIntensity: 2.0,
    metalness: 0.9,
    roughness: 0.2
});

// Chessboard Construction
const boardSize = 8;
const tileSize = 1;
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

// Grid Helper
const gridHelper = new THREE.GridHelper(boardSize, boardSize, 0x444444, 0x888888);
gridHelper.position.y = -0.11;
scene.add(gridHelper);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Camera & Controls
camera.position.set(6, 10, 6);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.04;
controls.minDistance = 5;
controls.maxDistance = 15;

// Animation Loop
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