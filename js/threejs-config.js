// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);

// OrbitControls setup
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 5;
controls.maxDistance = 5;

// Chessboard texture setup
const loader = new THREE.TextureLoader();
const tileGeometry = new THREE.BoxGeometry(1.01, 0.1, 1.01);

Array(8).fill().forEach((_, row) => {
  Array(8).fill().forEach((_, col) => {
    const material = new THREE.MeshStandardMaterial({
      map: loader.load(`textures/${(row + col) % 2 ? 'white' : 'black'}-marble.jpg`),
      roughness: 0.5,
      metalness: 0.3
    });
    const tile = new THREE.Mesh(tileGeometry, material);
    tile.position.set(col - 3.5, 0, row - 3.5);
    scene.add(tile);
  });
});

// Lighting setup
scene.add(new THREE.AmbientLight(0x404040));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

// Camera positioning
camera.position.set(-5, 5, 10);
camera.lookAt(0, 0, 0);

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Dark mode toggle
document.getElementById('dark-mode-toggle').addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  renderer.setClearColor(document.body.classList.contains('light-mode') ? 0xffffff : 0x000000);
});