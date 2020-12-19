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
camera.position.y = 75;
camera.position.z = 50;

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
function onClick() {
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    let aux = squares.filter((sqr) => sqr.id === intersects[0].object.id);
    if (aux.length > 0) {
      if (!aux[0].inUse) {
        aux[0].inUse = true;
        aux[0].player = currentPlayer;
        if (currentPlayer) {
          aux[0].material.color = new THREE.Color(0xe10040);
        } else {
          aux[0].material.color = new THREE.Color(0x00eee1);
        }
        let result = checkForWinner();
        if (result !== "NO") {
          let ref;
          if (result) {
            ref = document.getElementById("player1");
          } else {
            ref = document.getElementById("player2");
          }
          ref.innerText = parseInt(ref.innerText) + 1;
          squares.forEach((sqrt) => scene.remove(sqrt));
          createGame();
        } else {
          currentPlayer = !currentPlayer;
          document.getElementsByClassName(
            "player"
          )[0].innerText = `Current Player: ${currentPlayer ? "Red" : "Blue"}`;
        }
      }
    }
  }
}
window.addEventListener("mousemove", onMouseMove, false);
window.addEventListener("click", onClick, false);

//LIGHTS
const light1 = new THREE.AmbientLight(0xfffaff, 0.7);
const light2 = new THREE.SpotLight(0xfffaaf, 1);
light2.position.set(-40, 20, 0);
light2.castShadow = true;
light2.shadow.mapSize.width = 1024;
light2.shadow.mapSize.height = 1024;
light2.shadow.camera.near = 0.1;
light2.shadow.camera.far = 3000;
light2.shadow.camera.fov = 70;
light2.angle = -Math.PI / 4;
light2.penumbra = 1;
light2.decay = 0;
light2.distance = 3000;
light2.rotation.z = Math.PI / 2;

scene.add(light1);
scene.add(light2);

//RENDER LOOP
let currentPlayer = true;
let squares = [];
function render() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  squares.forEach((sqrt) =>
    sqrt.inUse === false
      ? (sqrt.material.color = new THREE.Color(0xe1e1e1))
      : null
  );
  if (intersects.length > 0) {
    let aux = squares.filter((sqr) => sqr.id === intersects[0].object.id);
    if (aux.length > 0) {
      aux[0].inUse ? null : (aux[0].material.color = new THREE.Color(0x313131));
    }
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

// Helpers
function createGame() {
  requestAnimationFrame(render);
  squares = [];
  let x = 0;
  let z = -2;
  for (let i = 0; i < 9; i++) {
    const geometry = new THREE.BoxGeometry(20, 5, 20);
    const material = new THREE.MeshLambertMaterial({ color: 0xfafafa });
    const square = new THREE.Mesh(geometry, material);
    if (i % 3 === 0) {
      x = -1;
      z++;
    }
    square.rotateX(Math.PI / 1);
    square.rotateY(Math.PI / 2);
    square.position.set(23 * x, -10, 23 * z);
    square.inUse = false;
    squares.push(square);
    scene.add(squares[i]);
    x++;
  }
}
createGame();

function checkForWinner() {
  let winner = null;

  for (let i = 0; i < 3; i++) {
    // X Axis
    if (equals(squares[3 * i], squares[3 * i + 1], squares[3 * i + 2])) {
      winner = squares[3 * i];
    }

    // Y Axis
    if (equals(squares[i], squares[i + 3], squares[i + 6])) {
      winner = squares[i];
    }
  }

  // XY-Axis
  if (equals(squares[0], squares[4], squares[8])) {
    winner = squares[0];
  }
  if (equals(squares[2], squares[4], squares[6])) {
    winner = squares[2];
  }

  if (winner !== null) {
    return winner.player;
  } else {
    return "NO";
  }
}

function equals(a, b, c) {
  return (
    a.player === b.player && b.player === c.player && a.player !== undefined
  );
}
