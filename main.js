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

const light2 = new THREE.AmbientLight("darkblue");
light2.intensity = 8;
light2.position.set(0, -2, 0);
scene.add(light2);

const directionalLight1 = new THREE.DirectionalLight("darkblue", 1);
directionalLight1.position.set(0, 1, 2.5);
scene.add(directionalLight1);

//point light
const pointLight = new THREE.PointLight(0x000000);
pointLight.intensity = 15;
pointLight.position.set(0, 0, 0);
scene.add(pointLight);
//spot light
const spotLight = new THREE.SpotLight("blue", 1);
spotLight.position.set(0, 1, 0);
scene.add(spotLight);

let mixer, action;
const gltfLoader = new GLTFLoader();
gltfLoader.load("./Model/whale.glb", (gltf) => {
  const whale = gltf.scene;
  whale.scale.set(0.35, 0.35, 0.35);
  whale.position.set(-1.8, 0.1, 2.5);
  whale.rotation.set(0, -0.5, 0);
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
    duration: 12,
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

        duration: 12,
        y: -2.8,
      });
    },
  })
    .to(whale.position, {
      x: -10,
      delay: 3,
      duration: 15,
      onComplete: () => {
        gsap.to(whale.rotation, {
          scrollTrigger: {
            trigger: ".section1",
            start: "top top",
            end: "top",
            scrub: 1,
          },
          delay: 1,
          y: -0.1,
        });
      },
    })
    .to(whale.position, {
      x: 0,

      duration: 10,
    })
    .to(whale.position, {
      x: 10,
      duration: 10,
      onComplete: () => {
        gsap.to(whale.rotation, {
          scrollTrigger: {
            trigger: ".section1",
            start: "top top",
            end: "top",
            scrub: 1,
          },
          delay: 1,
          y: -2.8,
        });
      },
    })

    .to(whale.position, {
      x: -12,
      delay: 6,
      duration: 16,
    });

  ScrollTrigger.create({
    trigger: ".section1",
    animation: t1,
    start: "top top",
    end: "+=3700px",
    scrub: 1,
  });
  //traverse to add metalness
  whale.traverse((o) => {
    if (o.isMesh) {
      o.material.metalness = 0.6;
      o.material.roughness = 0.5;
    }
  });

  scene.add(whale);
});

camera.position.set(0, 0, 5);

// Add OrbitControls
// const controls = new OrbitControls(camera, renderer.domElement);

// controls.update();

function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(0.04);

  //   controls.update();
  renderer.render(scene, camera);
}

animate();
