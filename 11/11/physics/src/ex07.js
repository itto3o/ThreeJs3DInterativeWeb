import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';
import { PreventDragClick } from './PreventDragClick';
// import { MySphere } from './MySphere';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Domino } from './Domino';

// ----- 주제: 도미노

// cannon.js 문서
// http://schteppe.github.io/cannon.js/docs/
// 주의! https 아니고 http

export default function example() {
	// Renderer
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	// Scene
	const scene = new THREE.Scene();

	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.y = 1.5;
	camera.position.z = 4;
	scene.add(camera);

	// Light
	const ambientLight = new THREE.AmbientLight('white', 0.5);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.x = 1;
	directionalLight.position.z = 2;
    directionalLight.castShadow = true;
	scene.add(directionalLight);

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);

    // Loader
    const gltfLoader = new GLTFLoader();

	// Cannon(물리 엔진)
	const cannonWorld = new CANNON.World();
	cannonWorld.gravity.set(0, -10, 0);

	// 성능을 위한 세팅
	// cannonWorld.allowSleep = true; // Body가 엄청 느려지면 테스트 안함
	cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld);

    // Contact Material
    const defaultMaterial = new CANNON.Material('default');

    const defaultContactMaterial = new CANNON.ContactMaterial(
        defaultMaterial,
        defaultMaterial,
        {
            friction: 0.01,
            restitution: 0.9
        }
    );
    cannonWorld.defaultContactMaterial = defaultContactMaterial;


	const floorShape = new CANNON.Plane();
	const floorBody = new CANNON.Body({
		mass: 0, //1이면 똑같이 중력의 영향을 받아서 box와 함께 같이 추락함
		position: new CANNON.Vec3(0, 0, 0),
		shape: floorShape,
        material: defaultMaterial
	});
	floorBody.quaternion.setFromAxisAngle(
		new CANNON.Vec3(-1, 0, 0),
		Math.PI / 2
	);
	cannonWorld.addBody(floorBody);

	// Mesh
	const floorMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(100, 100),
		new THREE.MeshStandardMaterial({
			color: 'slategray'
		})
	);
	floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
	scene.add(floorMesh);

    // 도미노 생성
    const dominos = [];
    let domino;
    for (let i = -3; i < 17; i++) {
        domino = new Domino({
			index: i,
            scene,
            cannonWorld,
            gltfLoader,
			// y: 2,
            z: -i * 0.8
        });
        dominos.push(domino);
    }

    // const spheres = [];
	// const sphereGeometry = new THREE.SphereGeometry(0.5);
	// const sphereMaterial = new THREE.MeshStandardMaterial({
	// 	color: 'seagreen'
	// });

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

		// 주사율에 따라 stepTime 다르게 설정하기
		let cannonStepTime = 1/60;
		if (delta < 0.01) cannonStepTime = 1/120;
		cannonWorld.step(1/60, delta, 3);

        // spheres.forEach(item => {
        //     item.mesh.position.copy(item.cannonBody.position);
        //     item.mesh.quaternion.copy(item.cannonBody.quaternion);
        // });

		dominos.forEach(item => {
			if(item.cannonBody) {
				item.modelMesh.position.copy(item.cannonBody.position);
				item.modelMesh.quaternion.copy(item.cannonBody.quaternion);
			}
		})

		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

    const sound = new Audio('./sounds/boing.mp3');

    // function collide(e) {
    //     const velocity = e.contact.getImpactVelocityAlongNormal();
    //     console.log(velocity);
    //     if (velocity > 3) {
    //         sound.currentTime = 0;
    //         sound.play();
    //     }
    // }


	// Raycaster
	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();

	function checkIntersects() {
		raycaster.setFromCamera(mouse, camera);

		const intersects = raycaster.intersectObjects(scene.children);
		console.log(intersects[0].object.name);

		for (const item of intersects) {
			if(item.object.cannonBody) {
				item.object.cannonBody.applyForce(
					new CANNON.Vec3(0, 0, -100),
					new CANNON.Vec3(0, 0, 0)
				);
				break;
			}
		}
		// if(intersects[0].object.cannonBody) {
		// 	intersects[0].object.cannonBody.applyForce(
		// 		new CANNON.Vec3(0, 0, -100),
		// 		new CANNON.Vec3(0, 0, 0)
		// 	);
		// }
	}

	// 이벤트
	window.addEventListener('resize', setSize);
    canvas.addEventListener('click', e => {
        // const mySphere = new MySphere({
        //     // scene: scene,
        //     scene,
        //     cannonWorld,
        //     geometry: sphereGeometry,
        //     material: sphereMaterial,
        //     x: (Math.random() - 0.5) * 2,
        //     y: Math.random() * 5 + 2,
        //     z: (Math.random() - 0.5) * 2,
        //     scale: Math.random() + 0.2
        // });

        // spheres.push(mySphere);

        // mySphere.cannonBody.addEventListener('collide', collide);

		if(preventDragClick.mouseMoved) return;
		
		mouse.x = e.clientX / canvas.clientWidth * 2 - 1;
		mouse.y = -(e.clientY / canvas.clientHeight * 2 - 1);

		checkIntersects();
    });
    
    const preventDragClick = new PreventDragClick(canvas);

    // // 삭제하기
    // const btn = document.createElement('button');
    // btn.style.cssText = 'position: absolute; left: 20px; top: 20px; font-size: 20px';
    // btn.innerHTML = '삭제';
    // document.body.append(btn);

    // btn.addEventListener('click', () => {
    //     spheres.forEach(item => {
    //         item.cannonBody.removeEventListener('collide', collide);
    //         cannonWorld.removeBody(item.cannonBody);
    //         scene.remove(item.mesh);
    //     });
    // });

	draw();
}
