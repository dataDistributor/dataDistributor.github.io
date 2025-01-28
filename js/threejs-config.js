function initThreeJS() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000);
  document.body.appendChild(renderer.domElement);

  // Controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 5;
  controls.maxDistance = 15;

  // Chessboard
  const tileSize = 1.01;
  const loader = new THREE.TextureLoader();
  
  for(let i = 0; i < 8; i++) {
    for(let j = 0; j < 8; j++) {
      const texture = loader.load(`textures/${(i+j)%2 === 0 ? 'black' : 'white'}-marble.jpg`);
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.4,
        metalness: 0.3
      });
      const geometry = new THREE.BoxGeometry(tileSize, 0.1, tileSize);
      const tile = new THREE.Mesh(geometry, material);
      tile.position.set(i - 3.5, 0, j - 3.5);
      scene.add(tile);
    }
  }

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Camera
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Dark Mode Toggle
  document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    renderer.setClearColor(document.body.classList.contains('light-mode') ? 0xffffff : 0x000000);
  });
}

// Initialize after DOM loads
document.addEventListener('DOMContentLoaded', initThreeJS);