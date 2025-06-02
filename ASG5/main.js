import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const loader = new THREE.TextureLoader();

const cubeTextureLoader = new THREE.CubeTextureLoader();
const skyboxTexture = cubeTextureLoader.load([
  'px.jpg',
  'nx.jpg',
  'py.jpg',
  'ny.jpg',
  'pz.jpg',
  'nz.jpg',
]);

const mtlLoader = new MTLLoader();
const objLoader = new OBJLoader();

mtlLoader.load('Cat/12221_Cat_v1_l3.mtl', (materials) => {
  materials.preload();
  objLoader.setMaterials(materials);
  objLoader.load('Cat/12221_Cat_v1_l3.obj', (object) => {
    object.scale.set(0.05, 0.05, 0.05); // Scale down the model
    object.position.set(-1, 0, 0);       // Optional: position it
    object.rotation.x = -Math.PI / 2;


    scene.add(object);
  });
});


// Create scene
const scene = new THREE.Scene();
//scene.background = new THREE.Color(0x202020);

scene.background = skyboxTexture; // 🔹 Set skybox as background


// Camera with perspective projection
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit controls (optional for camera movement)
const controls = new OrbitControls(camera, renderer.domElement);

// Add a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Soft white light
scene.add(ambientLight);


/* // Cube
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.x = -2;
scene.add(cube); */


// Cube with texture
const texture = loader.load('red-brick-wall-128x128.jpg'); // Replace with your texture file path
const cubeMaterial = new THREE.MeshStandardMaterial({ map: texture });
const cubeGeometry = new THREE.BoxGeometry();
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.x = -2;
scene.add(cube);

// Sphere
const sphereGeometry = new THREE.SphereGeometry(0.75, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = 0;
scene.add(sphere);

// Cylinder
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinder.position.x = 2;
scene.add(cylinder);

// Animate (rotate cube)
function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  controls.update(); // required if OrbitControls is used
  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
