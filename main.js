import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
gsap.registerPlugin(ScrollTrigger);
let t1 = gsap.timeline();
const canvas = document.getElementById("scene-container");
document.body.appendChild(canvas);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//load renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  alpha: true,
  encoding: THREE.sRGBEncoding,
});
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
document.body.appendChild(renderer.domElement);
// Loads environment map

let envmapLoader = new THREE.PMREMGenerator(renderer);
let envmap;
new RGBELoader()
  .setPath("./Assets/")
  .load("photo_studio_01_1k.hdr", function (texture) {
    envmap = envmapLoader.fromCubemap(texture).texture;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    //scene.background = texture;
  });

const light2 = new THREE.AmbientLight(0xffffff, 0.8, 10);
light2.position.set(0, 0, 0);
scene.add(light2);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight1.position.set(0, 1, 2.5); // Adjust position as needed
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight2.position.set(-2, 1, 1); // Adjust position as needed
scene.add(directionalLight2);

const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight3.position.set(2, 1, 1); // Adjust position as needed
scene.add(directionalLight3);

// Create a new material for the other sides with a grey color
const greyMaterial = new THREE.MeshBasicMaterial({ color: "#808080" });
let mixer;
const gltfLoader = new GLTFLoader();
gltfLoader.load("./Model/whale.glb", (gltf) => {
  const whale = gltf.scene;
  console.log(whale);
  whale.scale.set(0.4, 0.4, 0.4);
  whale.position.set(-1.2, 0.1, 0);
  whale.rotation.set(0, -0.8, 0);
  //to load embedded animation in glb file
  mixer = new THREE.AnimationMixer(whale);
  const action = mixer.clipAction(gltf.animations[0]);
  //   action.play();

  t1.to(whale.position, {
    scrollTrigger: {
      trigger: ".section1",
      start: "top top",
      end: "bottom",
      scrub: 1,
      onUpdate: (self) => {
        console.log(self.progress);
        action.play();
      },
    },
    duration: 10,
    x: 2.2,
    ease: "out",
  });
  t1.to(whale.rotation, {
    scrollTrigger: {
      trigger: ".section1",
      start: "top top",
      end: "bottom",
      scrub: 1,
      onUpdate: (self) => {
        console.log(self.progress);
        action.play();
      },
    },
    duration: 10,
    y: -2.8,
    ease: "out",
    onComplete: () => {
      gsap.to(whale.position, {
        scrollTrigger: {
          trigger: ".section1",
          start: "top top",
          end: "bottom",
          scrub: 1,
        },
        x: -2.2,
        ease: "out",
      });
    },
  });

  scene.add(whale);
});

camera.position.set(0, 0.2, 2);

// Add OrbitControls
// const controls = new OrbitControls(camera, renderer.domElement);

// controls.update();

function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(0.02);
  //   controls.update();
  renderer.render(scene, camera);
}

animate();
