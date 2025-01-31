document.addEventListener('DOMContentLoaded', () => {
  // Initialize loading overlay
  const loadingOverlay = document.getElementById('loading-overlay');
  
  try {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    document.body.appendChild(renderer.domElement);

    // Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 15;

    // Temporary test cube
    const testGeometry = new THREE.BoxGeometry(1, 1, 1);
    const testMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const testCube = new THREE.Mesh(testGeometry, testMaterial);
    scene.add(testCube);

    // Chessboard setup
    const tileSize = 1.01;
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = '';

    // Load textures with error handling
    Promise.all([
      new Promise((resolve) => loader.load('textures/black-marble.jpg', resolve)),
      new Promise((resolve) => loader.load('textures/white-marble.jpg', resolve))
    ]).then(([blackTexture, whiteTexture]) => {
      for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
          const material = new THREE.MeshStandardMaterial({
            map: (i + j) % 2 === 0 ? blackTexture : whiteTexture,
            roughness: 0.4,
            metalness: 0.3
          });
          const geometry = new THREE.BoxGeometry(tileSize, 0.1, tileSize);
          const tile = new THREE.Mesh(geometry, material);
          tile.position.set(i - 3.5, 0, j - 3.5);
          scene.add(tile);
        }
      }
      scene.remove(testCube); // Remove temporary cube
    }).catch((error) => {
      console.error('Texture loading failed:', error);
      testCube.material.color.set(0x00ff00); // Change test cube color to green
    });

    // Lighting
    scene.add(new THREE.AmbientLight(0x404040));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Camera position
    camera.position.set(5, 5, 5);
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

    // Hide loading overlay
    loadingOverlay.style.opacity = '0';
    setTimeout(() => {
      loadingOverlay.style.display = 'none';
    }, 1000);

  } catch (error) {
    console.error('Three.js initialization failed:', error);
    loadingOverlay.innerHTML = '<p>Error initializing visualization. Please check console for details.</p>';
  }

  // Dark mode toggle
  document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    renderer.setClearColor(document.body.classList.contains('light-mode') ? 0xffffff : 0x000000);
  });
});