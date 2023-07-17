import * as THREE from 'three';

// ----- 주제: 브라우저 창 사이즈 변경에 대응하기

export default function example() {
    // Renderer
    const canvas = document.querySelector('#three-canvas');
    const renderer = new THREE.WebGLRenderer({ 
        canvas,
        antialias: true,
        // alpha: true
     }); //이것도 가능
    renderer.setSize(window.innerWidth, window.innerHeight);
    // console.log(window.devicePixelRatio);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    // renderer.setClearAlpha(0.5);
    // renderer.setClearColor(0x00ff00);
    // renderer.setClearColor('#00ff00');
    // renderer.setClearAlpha(0.5);
    
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('blue');
    
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
    // camera.position.x = 2;
    // camera.position.y = 2;
    camera.position.z = 5;
    camera.lookAt(0, 0, 0);
    camera.zoom = 0.5;
    camera.updateProjectionMatrix();
    scene.add(camera);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.x = 1;
    light.position.z = 2; 
    scene.add(light);
    
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
    const clock = new THREE.Clock();

    function draw() {
        // console.log(clock.getElapsedTime());
        // const time = clock.getElapsedTime();
        const delta = clock.getDelta();

        // 각도는 Radian을 사용
        // 360도는 2파이
        //mesh.rotation.y += 0.1;
        // mesh.rotation.y += THREE.MathUtils.degToRad(10);
        mesh.rotation.y += 2 * delta;
        mesh.position.y += 3 * delta;
        if(mesh.position.y > 3) {
            mesh.position.y = 0;
        }
        renderer.render(scene, camera);

        window.requestAnimationFrame(draw);
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

