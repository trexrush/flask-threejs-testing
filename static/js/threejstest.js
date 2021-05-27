import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { CSS3DRenderer, CSS3DObject } from 'https://threejs.org/examples/jsm/renderers/CSS3DRenderer.js';
import { TWEEN } from 'https://threejs.org/examples/jsm/libs/tween.module.min.js';

let scene,
    sceneCSS, 
    camera,
    rendererWEBGL,
    rendererCSS3D,
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
    sceneCSS = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    rendererWEBGL = new THREE.WebGLRenderer();
    rendererWEBGL.setSize( window.innerWidth, window.innerHeight );
    rendererWEBGL.setClearColor( 0x000000, 0 );
    document.getElementById('webgl').appendChild( rendererWEBGL.domElement );

    rendererCSS3D = new CSS3DRenderer();
    rendererCSS3D.setSize( window.innerWidth, window.innerHeight );
    rendererCSS3D.domElement.style.position = 'absolute';
    document.getElementById('css3d').appendChild( rendererCSS3D.domElement );

    scene.background = new THREE.Color( 0x1a1a1a );
    scene.fog = new THREE.Fog( new THREE.Color( 0x1a1a1a), 0, 10)
    
    controls = new OrbitControls( camera, rendererCSS3D.domElement);

    // objects //

    const geometry = new THREE.BoxGeometry(2, 2, 1);
    const material = new THREE.MeshBasicMaterial( { color: 0x4d4d4d } ); //becdbc dont like this one //bfc908 yellow
    const cube = new THREE.Mesh( geometry, material );
    scene.add(cube);
    objects.push(cube);

    // css3d test //

    let element = document.createElement( 'div' );
    // element.style.background = new THREE.Color ( 0x4d4d4d );
    element.textContent = "a";
    element.width = '20%';
    element.height = '20%';
    element.style.color = '#bfc908';
    element.style.fontSize = '3px';
    element.style.opacity = .2;

    const css3d = new CSS3DObject( element );
    css3d.position.x = 0;
    css3d.position.y = 0;
    css3d.position.z = 0;
    sceneCSS.add(css3d);
    objects.push(css3d);

    // events //

    document.addEventListener('mousemove', onMouseMove, false);
    target = new THREE.Vector3();
    mouseX = 0, mouseY = 0;

    window.addEventListener( 'resize', onWindowResize, false );

    camera.position.z = 5;
}

function onMouseMove(event) {
    mouseX = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouseY = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    rendererWEBGL.setSize(window.innerWidth, window.innerHeight);
    rendererCSS3D.setSize(window.innerWidth, window.innerHeight);
}

function animate() { // animate loop
    requestAnimationFrame( animate );

    // cube.rotation.x += 0.001;
    // cube.rotation.y += 0.001;

    target.x += ( mouseX - target.x ) * .004;
    target.y += ( mouseY - target.y ) * .004;
    target.z = camera.position.z; // assuming the camera is located at ( 0, 0, z );

    objects[0].lookAt( target );

    rendererWEBGL.render( scene, camera );
    rendererCSS3D.render( sceneCSS, camera );
};
animate();