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



//Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.1, 14, 14);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}
Array(200).fill().forEach(addStar);


scene.background = new THREE.Color(0x1a1a1a);



// planet
let planet;
const loader = new GLTFLoader();

loader.load('planet_earth/scene.gltf', (gltf) => {
  planet = gltf.scene;
  planet.position.set(0, 0, -120);
  planet.scale.set(0.001, 0.001, 0.001);
  scene.add(planet);

  const direction = new THREE.Vector3();
  direction.subVectors(camera.position, planet.position).normalize();
  const angle = Math.atan2(direction.x, direction.z);
  planet.rotation.y = angle + Math.PI - 12;

  const targetScale = new THREE.Vector3(14, 14, 14);
  const duration = 200;
  let frame = 0;

  function scaleIn() {
    if (!planet || frame >= duration) return;
    const progress = frame / duration;
    planet.scale.lerpVectors(new THREE.Vector3(0.15, 0.15, 0.15), targetScale, progress);
    frame++;
    requestAnimationFrame(scaleIn);
  }
  scaleIn();
});

// move planet
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDragging = false;
let lastMouse = { x: 0, y: 0 };

window.addEventListener('mousedown', (event) => {
  if (!planet) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(planet, true);

  if (intersects.length > 0) {
    isDragging = true;
    lastMouse.x = event.clientX;
    lastMouse.y = event.clientY;
  }
});

window.addEventListener('mousemove', (event) => {
  if (!isDragging || !planet) return;

  const deltaX = event.clientX - lastMouse.x;
  const deltaY = event.clientY - lastMouse.y;

  planet.rotation.y += deltaX * 0.005;
  planet.rotation.x += deltaY * 0.005;

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

// cube in right bottom corner
function updateCubeScreenPosition() {
  const vector = new THREE.Vector3(0.78, -0.78, 0.1); // NDC
  vector.unproject(camera);

  const dir = vector.sub(camera.position).normalize();
  const distance = 20;
  const pos = camera.position.clone().add(dir.multiplyScalar(distance));
  targetCubePosition.copy(pos);
}


// Click to GitHub
window.addEventListener('click', (event) => {

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(cube);

  if (intersects.length > 0) {
    window.open('https://github.com/pab-mchn', '_blank');
  }
});

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});



// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  if (planet && !isDragging) {
    planet.rotation.y += 0.001;
  }

  cube.rotation.y += 0.01;
  cube.rotation.x += 0.005;
  cube.position.lerp(targetCubePosition, 0.1);

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(cube);

  if (intersects.length > 0) {
    document.body.style.cursor = 'pointer';
  } else {
    document.body.style.cursor = 'default';
  }


  updateCubeScreenPosition();
  renderer.render(scene, camera);
}
animate();
