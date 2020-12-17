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
renderer.setClearColor(0xe1e1e1);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//CAMERA
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);
camera.position.z = 100;
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

//LIGHTS
const light1 = new THREE.AmbientLight(0xffffff, 0.5);
const light2 = new THREE.PointLight(0xffffff, 1);

scene.add(light1);
scene.add(light2);

//OBJECT
const obj = new OBJLoader();
const mtl = new MTLLoader();
let main;
let circle;
let x = 0;
let y = -2;
for (let i = 0; i < 9; i++) {
  const geometry = new THREE.BoxGeometry(20, 5, 20);
  const material = new THREE.MeshDepthMaterial(0x111111);
  const square = new THREE.Mesh(geometry, material);
  square.rotateX(Math.PI / 1);
  square.rotateY(Math.PI / 2);
  if (i === 4) {
    main = square;
    scene.add(main);
  } else {
    if (i % 3 === 0) {
      x = -1;
      y++;
    }
    square.position.set(23 * x, 0, 23 * y);
    scene.add(square);
  }
  x++;
}

// mtl.load("circle.mtl", (materials) => {
//   materials.preload();
//   obj.setMaterials(materials).load("circle.obj", (object) => {
//     object.scale.set(0.2, 0.2, 0.2);
//     object.rotateX(Math.PI / 2);
//     circle = object;
//     scene.add(circle);
//   });
// });

//RENDER LOOP
requestAnimationFrame(render);
function render() {
  // if (circle) {
  //   circle.rotation.x += 0.01;
  //   circle.rotation.y += 0.03;
  // }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
