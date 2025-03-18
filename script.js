import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.155/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("webgl") });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

// Space Background
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];
for (let i = 0; i < 6000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Planets (Representing Portfolio Projects)
const planets = [];
const planetData = [
    { name: "QuickPark Assist", texture: 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg', position: [-5, 0, -15] },
    { name: "Stock Management", texture: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Mars_Earth_Comparison.png', position: [0, 0, -20] },
    { name: "Sorting Visualizer", texture: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Jupiter.jpg', position: [5, 0, -25] }
];

planetData.forEach((data) => {
    const texture = new THREE.TextureLoader().load(data.texture);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const geometry = new THREE.SphereGeometry(1.5, 32, 32);
    const planet = new THREE.Mesh(geometry, material);
    planet.position.set(...data.position);
    planets.push(planet);
    scene.add(planet);
});

// Camera Controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 2, 5);

// Interaction: Click to view project details
document.addEventListener("click", (event) => {
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects(planets);
    if (intersects.length > 0) {
        const selectedPlanet = planets.indexOf(intersects[0].object);
        alert("Project: " + planetData[selectedPlanet].name);
    }
});

// Responsive Handling
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    stars.rotation.y += 0.0005; // Background star animation
    planets.forEach((planet) => {
        planet.rotation.y += 0.005; // Planet rotation animation
    });
    renderer.render(scene, camera);
}
animate();
