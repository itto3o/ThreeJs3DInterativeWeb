import * as THREE from 'three';

// 동적으로 캔버스 조립하기
// // console.log(THREE);
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// // console.log(renderer.domElement);
// document.body.appendChild(renderer.domElement);

const canvas = document.querySelector('#three-canvas');
// const renderer = new THREE.WebGLRenderer({ canvas: canvas });
const renderer = new THREE.WebGLRenderer({ 
    canvas,
    antialias: true
 }); //이것도 가능
renderer.setSize(window.innerWidth, window.innerHeight);

// Scene
const scene = new THREE.Scene();

// Camera
// const camera = new THREE.PerspectiveCamera(
//     75, // 시야각(field of view)
//     window.innerWidth / window.innerHeight, // 종횡비(aspect)
//     0.1, // near
//     1000 // far
// );
// camera.position.x = 1;
// camera.position.y = 2;
// camera.position.z = 5;

// Orthographic Camera
const camera = new THREE.OrthographicCamera(
    -(window.innerWidth / window.innerHeight), // left
    window.innerWidth / window.innerHeight, // right
    1,
    -1,
    0.1,
    1000
);
camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 5;
camera.lookAt(0, 0, 0);
camera.zoom = 0.5;
camera.updateProjectionMatrix();
scene.add(camera);

// Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
    // color: 0xff0000
    // color: '#ff0000'
    color: 'red'
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// 그리기
renderer.render(scene, camera);