import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

// Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}
Array(200).fill().forEach(addStar);

// Background
const spaceTexture = new THREE.TextureLoader().load('mountains-clouds-forest-fog.webp');
scene.background = spaceTexture;

// Moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);
moon.position.set(-10, 0, 30);
scene.add(moon);

// Avatar (Pab)
let pab;
const loader = new GLTFLoader();

loader.load('avatar_hiking.glb', (gltf) => {
  pab = gltf.scene;
  pab.position.set(-1, -1, 13);
  pab.scale.set(0.01, 0.01, 0.01);
  scene.add(pab);

  const direction = new THREE.Vector3();
  direction.subVectors(camera.position, pab.position).normalize();
  const angle = Math.atan2(direction.x, direction.z);
  pab.rotation.y = angle + Math.PI - 12;

  const targetScale = new THREE.Vector3(14, 14, 14);
  const duration = 60;
  let frame = 0;

  function scaleIn() {
    if (!pab || frame >= duration) return;
    const progress = frame / duration;
    pab.scale.lerpVectors(new THREE.Vector3(0.15, 0.15, 0.15), targetScale, progress);
    frame++;
    requestAnimationFrame(scaleIn);
  }
  scaleIn();
});

// Scroll Animation (sin afectar a pab)
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  camera.position.z = 30 + t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}
document.body.onscroll = moveCamera;
moveCamera();

// Click → Pab mira a la cámara
window.addEventListener('click', () => {
  if (!pab) return;

  const direction = new THREE.Vector3();
  direction.subVectors(camera.position, pab.position).normalize();
  const angle = Math.atan2(direction.x, direction.z);
  pab.rotation.y = angle + Math.PI - 11;
});

// Arrastrar Pab
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDragging = false;
let lastMouse = { x: 0, y: 0 };

window.addEventListener('mousedown', (event) => {
  if (!pab) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(pab, true);

  if (intersects.length > 0) {
    isDragging = true;
    lastMouse.x = event.clientX;
    lastMouse.y = event.clientY;
  }
});

window.addEventListener('mousemove', (event) => {
  if (!isDragging || !pab) return;

  const deltaX = event.clientX - lastMouse.x;
  const deltaY = event.clientY - lastMouse.y;

  pab.rotation.y += deltaX * 0.005;
  pab.rotation.x += deltaY * 0.005;

  lastMouse.x = event.clientX;
  lastMouse.y = event.clientY;
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

// GitHub Cube (menu button)
let targetCubePosition = new THREE.Vector3();

const githubTexture = new THREE.TextureLoader().load('github.png');
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ map: githubTexture })
);
scene.add(cube);

// Mantener el cubo en esquina inferior derecha
function updateCubeScreenPosition() {
  const vector = new THREE.Vector3(0.78, -0.78, 0.1); // NDC
  vector.unproject(camera);

  const dir = vector.sub(camera.position).normalize();
  const distance = 20;
  const pos = camera.position.clone().add(dir.multiplyScalar(distance));
  targetCubePosition.copy(pos);
}

// Click en cubo abre GitHub
window.addEventListener('click', (event) => {

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(cube);

  if (intersects.length > 0) {
    window.open('https://github.com/pab-mchn', '_blank'); // ← Cambia "tu_usuario"
  }
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  moon.rotation.x += 0.005;

  if (pab && !isDragging) {
    pab.rotation.y += 0.005;
  }

  cube.rotation.y += 0.01;
  cube.rotation.x += 0.005;
  cube.position.lerp(targetCubePosition, 0.1);

  updateCubeScreenPosition();
  renderer.render(scene, camera);
}
animate();


