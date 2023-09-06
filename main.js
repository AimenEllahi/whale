import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
gsap.registerPlugin(ScrollTrigger);
let t1 = gsap.timeline({
  default: { ease: "power1.easeInOut" },
});
const canvas = document.getElementById("scene");
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
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Loads environment map

new RGBELoader()
  .setPath("./Assets/")
  .load("photo_studio_01_1k.hdr", function (texture) {
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

let mixer, action;
const gltfLoader = new GLTFLoader();
gltfLoader.load("./Model/whale.glb", (gltf) => {
  const whale = gltf.scene;
  console.log(whale);
  whale.scale.set(0.4, 0.4, 0.4);
  whale.position.set(-2, 0.1, 2);
  whale.rotation.set(0, -0.8, 0);
  //to load embedded animation in glb file
  mixer = new THREE.AnimationMixer(whale);

  const whaleClip = THREE.AnimationUtils.subclip(
    gltf.animations[0],
    "Walk",
    0,
    300
  );

  action = mixer.clipAction(whaleClip);
  action.clampWhenFinished = false;
  action.setLoop(THREE.LoopPingPong);
  action.play();

  t1.to(whale.position, {
    x: 2.3,
    duration: 7,
    ease: "power1.easeInOut",

    //on start
    onStart: () => {
      gsap.to(whale.rotation, {
        scrollTrigger: {
          trigger: ".section1",
          start: "top top",
          end: "bottom",
          scrub: 1,
        },
        delay: 1,
        ease: "power1.easeInOut",

        duration: 7,
        y: -2.8,
      });
    },
  })
    .to(whale.position, {
      x: -3,
      delay: 3,
      duration: 15,
      //on start
      onStart: () => {
        gsap.to(whale.rotation, {
          scrollTrigger: {
            trigger: ".section1",
            start: "top top",
            end: "bottom",
            scrub: 1,
          },
          delay: 1,
          duration: 15,
          z: -1.3,
          y: -1,
        });
      },
    })
    .to(whale.rotation, {
      //on start
      onStart: () => {
        gsap.to(whale.rotation, {
          scrollTrigger: {
            trigger: ".section1",
            start: "top top",
            end: "bottom",
            scrub: 1,
          },
          delay: 1,
          duration: 15,
          z: 0,
          y: -0.8,
        });
      },
      duration: 5,
    })
    .to(whale.position, {
      x: 14,
      delay: 3,
      duration: 10,
    })
    .to(whale.rotation, {
      //on start
      onStart: () => {
        gsap.to(whale.rotation, {
          scrollTrigger: {
            trigger: ".section1",
            start: "top top",
            end: "bottom",
            scrub: 1,
          },
          delay: 1,
          duration: 15,
          z: 0,
          y: -2.8,
        });
      },
      duration: 5,
    })
    .to(whale.position, {
      x: 2.2,
      delay: 6,
      duration: 10,
    });

  ScrollTrigger.create({
    trigger: ".section1",
    animation: t1,
    start: "top top",
    end: "+=3200px",
    scrub: 1,
  });

  scene.add(whale);
});

camera.position.set(0, 0, 5);

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
