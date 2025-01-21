const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();
const blackTexture = loader.load('textures/black_marble.jpg');
const whiteTexture = loader.load('textures/white_marble.jpg');

const tileSize = 1;
const boardSize = 8;

for (let row = 0; row < boardSize; row++) {
  for (let col = 0; col < boardSize; col++) {
    const material = new THREE.MeshStandardMaterial({
      map: (row + col) % 2 === 0 ? blackTexture : whiteTexture,
      roughness: 0.5,
      metalness: 0.3
    });
    const geometry = new THREE.BoxGeometry(tileSize, 0.1, tileSize);
    const tile = new THREE.Mesh(geometry, material);
    tile.position.set((col - boardSize / 2) * tileSize, 0, (row - boardSize / 2) * tileSize);
    scene.add(tile);
  }
}

const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0); // Light from above
scene.add(directionalLight);

const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(5, 10, 5);
scene.add(light);

camera.position.set(-5, 5, 10); // Position the camera
camera.lookAt(0, 0, 0); // Look at the center of the board
renderer.render(scene, camera);

// Use renderer's `toDataURL` method to capture the rendered image
const imgData = renderer.domElement.toDataURL();
document.body.removeChild(renderer.domElement); // Clean up after capturing the image
