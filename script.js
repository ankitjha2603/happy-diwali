console.log("Happy Diwali 2023 🪔✨");
//--------------------------------------------
// Set up scene, camera, and renderer
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/loaders/GLTFLoader.js";
//--------------------------------------------

//--------------------------------------------
// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 20, 40);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadows
document.body.appendChild(renderer.domElement);
//--------------------------------------------

//--------------------------------------------
//NOTE Percpective controll
const orbit = new OrbitControls(camera, renderer.domElement);
//--------------------------------------------

//--------------------------------------------
//NOTE - direction light
const directionLight = new THREE.DirectionalLight(0xffffff, 3);
scene.add(directionLight);
directionLight.position.set(5, 20, 50);
directionLight.castShadow = true;
// Adjust shadow camera settings for larger coverage
const frustumSize = 100; // Increase the frustum size
directionLight.shadow.camera.left = -frustumSize;
directionLight.shadow.camera.right = frustumSize;
directionLight.shadow.camera.top = frustumSize;
directionLight.shadow.camera.bottom = -frustumSize;
//--------------------------------------------

//--------------------------------------------
//NOTE - ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);
//--------------------------------------------

//--------------------------------------------
//NOTE -load manager
const loadingManager = new THREE.LoadingManager();
const progressBar = document.getElementById("progress-bar");
loadingManager.onProgress = function (url, loaded, total) {
  progressBar.value = (loaded / total) * 100;
};
const progressBarContainer = document.querySelector(".progress-bar-container");
loadingManager.onLoad = function () {
  setTimeout(() => {
    progressBarContainer.style.display = "none";
  }, 2500);
};
//--------------------------------------------

//--------------------------------------------
//NOTE - texture Loader
const textureLoader = new THREE.TextureLoader(loadingManager);
//--------------------------------------------

//--------------------------------------------
//NOTE - creating plane
const plane = (dimen, color, rx, ry, rz) => {
  const planGeometry = new THREE.PlaneGeometry(dimen, dimen);
  const planMaterial = new THREE.MeshStandardMaterial({
    color,
    side: THREE.DoubleSide,
  });
  const planMesh = new THREE.Mesh(planGeometry, planMaterial);
  scene.add(planMesh);
  planMesh.rotation.set(rx, ry, rz);
  planMesh.receiveShadow = true;
};
plane(250, 0x000080, -0.5 * Math.PI, 0, 0);
//--------------------------------------------

//--------------------------------------------
// Create 3D text
const loader = new THREE.FontLoader(loadingManager);
const makeText = (text, x, y, size, color, font_name, callback = () => {}) => {
  loader.load(
    `https://ankitjha2603.github.io/font/${font_name}.json`,
    function (font) {
      const geometry = new THREE.TextGeometry(text, {
        font: font,
        size: size,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      });
      const textMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.5,
        metalness: 0.5,
      });
      const textMesh = new THREE.Mesh(geometry, textMaterial);
      textMesh.castShadow = true;
      textMesh.receiveShadow = true; // Enable shadow receiving
      scene.add(textMesh);

      textMesh.position.y = y;
      textMesh.position.x = x;
      callback(textMesh);
    }
  );
};
makeText("Happy Diwali", -15, 13, 3, 0xff9933, "regular-font");
makeText(
  "Wishing you and your family a joyful and prosperous Diwali!",
  -23,
  10,
  1.2,
  0xffffff,
  "regular-font"
);
makeText("शुभ दीपावली", -12, 5.5, 3, 0x00ff00, "Akshar Unicode_Regular");
makeText(
  "आपको और आपके परिवार को दीपावली की हार्दिक शुभकामनाएँ!",
  -18.5,
  3,
  1.2,
  0x00ff00,
  "Akshar Unicode_Regular"
);
//--------------------------------------------

//--------------------------------------------
// Insert 3d model
const gltf_loader = new GLTFLoader(loadingManager);
const showGltf = (name, x, y, z, scale, callback = () => {}) => {
  gltf_loader.load(`model/${name}.gltf`, (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(x, y, z);
    model.scale.set(scale, scale, scale);
    model.castShadow = true;
    callback(model);
  });
};
showGltf("diya/scene", -25, 0, 10, 2);
showGltf("diya/scene", 25, 0, 10, 2);
showGltf("diya/scene", -25, 0, -10, 2);
showGltf("diya/scene", 25, 0, -10, 2);
showGltf("bow-and-arrow/scene", -12, 22.5, 0, 25, (model) => {
  model.rotation.set(-Math.PI / 2, 0, 0);
});
//--------------------------------------------

//--------------------------------------------
// Animate the text
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};
animate();
//--------------------------------------------

//--------------------------------------------
//NOTE - resize camera view
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
//--------------------------------------------
