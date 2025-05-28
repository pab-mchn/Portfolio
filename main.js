import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from "gsap";

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
  const geometry = new THREE.SphereGeometry(0.2, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}
Array(200).fill().forEach(addStar);


scene.background = new THREE.Color(0x1a1a1a);

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
moon.position.set(-30, 0, 15);
scene.add(moon);

// sun
const sunTexture = new THREE.TextureLoader().load('sun.jpg');
const normalsunTexture = new THREE.TextureLoader().load('normal.jpg');
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: sunTexture,
    normalMap: normalsunTexture,
  })
);
sun.position.set(-60, 30, 15);
scene.add(sun);

// asteroid
const asteroidTexture = new THREE.TextureLoader().load('cliff_side.webp');
const normalasteroidTexture = new THREE.TextureLoader().load('normal.jpg');
const asteroid = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: asteroidTexture,
    normalMap: normalasteroidTexture,
  })
);
asteroid.position.set(-30, 0, 50);
scene.add(asteroid);

// Avatar (Pab)
let pab;
const loader = new GLTFLoader();

loader.load('planet_earth/scene.gltf', (gltf) => {
  pab = gltf.scene;
  pab.position.set(0, 0, -120);
  pab.scale.set(0.001, 0.001, 0.001);
  scene.add(pab);

  const direction = new THREE.Vector3();
  direction.subVectors(camera.position, pab.position).normalize();
  const angle = Math.atan2(direction.x, direction.z);
  pab.rotation.y = angle + Math.PI - 12;

  const targetScale = new THREE.Vector3(14, 14, 14);
  const duration = 200;
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

// Scroll Animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  sun.rotation.x += 0.05;
  sun.rotation.y += 0.075;
  sun.rotation.z += 0.05;

  asteroid.rotation.x += 0.05;
  asteroid.rotation.y += 0.075;
  asteroid.rotation.z += 0.05;

  camera.position.z = 30 + t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}
document.body.onscroll = moveCamera;
moveCamera();


// move pab
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

  moon.rotation.x += 0.005;
  sun.rotation.x += 0.005;
  asteroid.rotation.x += 0.005;

  if (pab && !isDragging) {
    pab.rotation.y += 0.001;
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



//navbar

  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");
  const brand = document.getElementById("brand-name");
  const homeLink = document.getElementById('home-link');

  window.addEventListener('scroll', () => {
    const shouldHide = window.scrollY > 50; // o ajustá este valor
    brand.classList.toggle('hidden', shouldHide);
    homeLink.style.display = shouldHide ? 'inline' : 'none';
  });

  // Toggle menú hamburguesa
  hamburger.addEventListener("click", () => {
    menu.classList.toggle("show");
  });

  // hide brand scroll scroll
  window.addEventListener('scroll', () => {
    const brand = document.getElementById('brand-name');
    const homeLink = document.getElementById('home-link');
  
    const shouldHide = window.scrollY > 50;
  
    if (brand) brand.classList.toggle('hidden', shouldHide);
    if (homeLink) homeLink.style.display = shouldHide ? 'inline' : 'none';
  });

  // close menu after click 
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove("show");
    });
  });


  //scroll down
  const scrollIndicator = document.getElementById('scroll-down-indicator');

window.addEventListener('scroll', () => {
  const shouldHide = window.scrollY > 50;

  if (scrollIndicator) scrollIndicator.classList.toggle('hidden', shouldHide);
});


