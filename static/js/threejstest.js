import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { CSS3DRenderer, CSS3DObject } from 'https://threejs.org/examples/jsm/renderers/CSS3DRenderer.js';
import { TWEEN } from 'https://threejs.org/examples/jsm/libs/tween.module.min.js';

let scene, 
    camera,
    renderer,
    controls,
    target,
    mouseX,
    mouseY;

const objects = [];

init();
animate();

function init() {

    // core THREE.js //

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    renderer = new CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('container').appendChild( renderer.domElement );

    scene.background = new THREE.Color( 0x1a1a1a );
    scene.fog = new THREE.Fog( new THREE.Color( 0x1a1a1a), 0, 10)
    
    controls = new OrbitControls( camera, renderer.domElement);

    // objects //

    const geometry = new THREE.BoxGeometry(2, 2, 1);
    const material = new THREE.MeshBasicMaterial( { color: 0x4d4d4d } ); //becdbc dont like this one //bfc908 yellow
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    objects.push( cube );

    // css3d test //

    const css3d = new CSS3DObject();
    css3d.element.
    scene.add(css3d);
    objects.push(css3d);





    // events //

    document.addEventListener('mousemove', onMouseMove, false);
    target = new THREE.Vector3();
    mouseX = 0, mouseY = 0;

    window.addEventListener( 'resize', onWindowResize, false );
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    camera.position.z = 5;
}

function onMouseMove(event) {
    mouseX = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouseY = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function animate() { // animate loop
    requestAnimationFrame( animate );

    // cube.rotation.x += 0.001;
    // cube.rotation.y += 0.001;

    target.x += ( mouseX - target.x ) * .004;
    target.y += ( mouseY - target.y ) * .004;
    target.z = camera.position.z; // assuming the camera is located at ( 0, 0, z );

    objects[0].lookAt( target );

    renderer.render( scene, camera );
};
animate();