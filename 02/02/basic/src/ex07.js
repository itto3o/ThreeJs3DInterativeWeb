import * as THREE from 'three';

// ----- 주제: 안개

export default function example() {
    // Renderer
    const canvas = document.querySelector('#three-canvas');
    const renderer = new THREE.WebGLRenderer({ 
        canvas,
        antialias: true,
     });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    
    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('black', 3, 7);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
        75, // 시야각(field of view)
        window.innerWidth / window.innerHeight, // 종횡비(aspect)
        0.1, // near
        1000 // far
    );
    // camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 5;
    
    // Orthographic Camera
    // const camera = new THREE.OrthographicCamera(
    //     -(window.innerWidth / window.innerHeight), // left
    //     window.innerWidth / window.innerHeight, // right
    //     1,
    //     -1,
    //     0.1,
    //     1000
    // );
    // camera.position.x = 2;
    // camera.position.y = 2;
    // camera.position.z = 5;
    // camera.lookAt(0, 0, 0);
    // camera.zoom = 0.5;
    // camera.updateProjectionMatrix();
    scene.add(camera);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.x = 1;
    light.position.y = 3;
    light.position.z = 5; 
    scene.add(light);
    
    // Mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
        // color: 0xff0000
        // color: '#ff0000'
        color: 'red'
    });

    const meshes = [];
    let mesh;
    for(let i = 0; i < 10; i++) {
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 5 - 2.5;
        mesh.position.z = Math.random() * 5 - 2.5;
        scene.add(mesh);
        meshes.push(mesh);
    }
    // const mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);

    // 그리기
    // const clock = new THREE.Clock();
    let oldTime = Date.now();

    function draw() {
        const newTime = Date.now();
        const deltaTime = newTime - oldTime;
        oldTime = newTime;
        // // console.log(clock.getElapsedTime());
        // // const time = clock.getElapsedTime();
        // // const delta = clock.getDelta();

        // // 각도는 Radian을 사용
        // // 360도는 2파이
        // //mesh.rotation.y += 0.1;
        // // mesh.rotation.y += THREE.MathUtils.degToRad(10);
        // mesh.rotation.y += deltaTime * 0.005;
        // mesh.position.y += deltaTime * 0.001;
        // if(mesh.position.y > 3) {
        //     mesh.position.y = 0;
        // }

        meshes.forEach(item => {
            item.rotation.y += deltaTime * 0.001;
        });
        renderer.render(scene, camera);

        // window.requestAnimationFrame(draw);
        renderer.setAnimationLoop(draw);
    }

    function setSize() {
        // 카메라
        camera.aspect = window.innerWidth / window.innerHeight;
        // updateProjectionMatrix 카메라 투영에 관련된 값에 변화가 있을 경우 실행해야 함
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }
    // 이벤트
    window.addEventListener('resize', setSize);

    draw();
}

