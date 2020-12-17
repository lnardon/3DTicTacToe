// IMPORTS
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/MTLLoader.js";

//SCENE
const scene = new THREE.Scene();

//RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
  antialias: true,
});
renderer.setClearColor(0x070707);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//CAMERA
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);
camera.position.x = 50;
camera.position.y = 50;
camera.position.z = 75;

window.addEventListener(
  "resize",
  function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
// controls.autoRotate = true;

// RAYCASTER
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener("mousemove", onMouseMove, false);

//LIGHTS
const light1 = new THREE.AmbientLight(0xffffff, 0.8);
const light2 = new THREE.PointLight(0xffffff, 1);

scene.add(light1);
scene.add(light2);

//OBJECT
const obj = new OBJLoader();
const mtl = new MTLLoader();
let squares = [];
let x = 0;
let z = -2;
for (let i = 0; i < 9; i++) {
  const geometry = new THREE.BoxGeometry(20, 5, 20);
  const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const square = new THREE.Mesh(geometry, material);
  if (i % 3 === 0) {
    x = -1;
    z++;
  }
  square.rotateX(Math.PI / 1);
  square.rotateY(Math.PI / 2);
  square.position.set(23 * x, 0, 23 * z);
  squares.push(square);
  scene.add(squares[i]);
  x++;
}

//RENDER LOOP
requestAnimationFrame(render);
function render() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  squares.forEach((sqrt) => (sqrt.material.color = new THREE.Color(0xffffff)));
  if (intersects.length > 0) {
    let aux = squares.filter((sqr) => sqr.id === intersects[0].object.id);
    if (aux.length > 0) {
      aux[0].material.color = new THREE.Color(0xe10040);
    }
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
