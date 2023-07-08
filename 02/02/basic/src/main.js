import * as THREE from 'three';

// 동적으로 캔버스 조립하기
// // console.log(THREE);
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// // console.log(renderer.domElement);
// document.body.appendChild(renderer.domElement);

const canvas = document.querySelector('#three-canvas');
// const renderer = new THREE.WebGLRenderer({ canvas: canvas });
const renderer = new THREE.WebGLRenderer({ canvas }); //이것도 가능
renderer.setSize(window.innerWidth, window.innerHeight);

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    75, // 시야각(field of view)
    window.innerWidth / window.innerHeight, // 종횡비(aspect)
    0.1, // near
    1000 // far
);
camera.position.z = 5;
scene.add(camera);