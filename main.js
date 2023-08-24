import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let dogObject;

const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x252525);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, 3, 11);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

const groundGeometry = new THREE.PlaneGeometry(10, 10, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x161616,
    side: THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.castShadow = false;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

const spotLight = new THREE.SpotLight(0xffffff, 3, 100, 0.75, 0.75);
spotLight.position.set(0, 25, 2);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

const loader = new GLTFLoader().setPath('public/models/dog_pooping/');
loader.load('scene.gltf', (gltf) =>{
    const mesh = gltf.scene;

    mesh.traverse((child) => {
        if(child.isMesh){
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    mesh.position.set(0, 2, 0);
    mesh.scale.set(3, 3, 3);
    scene.add(mesh);
    dogObject = mesh;
});


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    dogObject.rotation.y += 0.01;
    dogObject.rotation.x += 0.02;
}

animate();