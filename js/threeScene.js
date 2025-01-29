import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
});

// Setup
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('scene-container').appendChild(renderer.domElement);

// Cyber Chessboard
const createBoard = () => {
    const boardSize = 8;
    const tileGeometry = new THREE.BoxGeometry(1, 0.1, 1);
    const darkMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        metalness: 0.8,
        roughness: 0.3
    });
    const lightMaterial = new THREE.MeshStandardMaterial({
        color: 0x00f7ff,
        emissive: 0x003344,
        metalness: 0.9,
        roughness: 0.1
    });

    for(let i = 0; i < boardSize; i++) {
        for(let j = 0; j < boardSize; j++) {
            const material = (i + j) % 2 === 0 ? lightMaterial : darkMaterial;
            const tile = new THREE.Mesh(tileGeometry, material);
            tile.position.set(i - 3.5, 0, j - 3.5);
            scene.add(tile);