import * as THREE from "https://threejs.org/build/three.module.js";
import { TrackballControls } from 'https://threejs.org/examples/jsm/controls/TrackballControls.js';
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
    sceneCSS.scale.set(.1, .1, .1);
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
    
    controls = new TrackballControls( camera, rendererCSS3D.domElement );

    // objects //

    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial( { color: 0xbfc908 } ); //4d4d4d grey //bfc908 yellow
    const cube = new THREE.Mesh( geometry, material );
    scene.add(cube);
    objects.push(cube);

    // css3d test //

    let element = document.createElement( 'div' );
    element.textContent = "hi";
    element.width = '25%';
    element.height = '25%';
    element.style.color = '#1a1a1a';
    element.style.fontSize = '12px';
    element.style.opacity = .5;
    element.setAttribute("class", "labeltext");

    const css3d = new CSS3DObject( element );
    css3d.position.x = 0;
    css3d.position.y = 0;
    css3d.position.z = 15;
    sceneCSS.add(css3d);
    objects.push(css3d);

    // events //

    document.addEventListener('mousemove', onMouseMove, false);
    target = new THREE.Vector3();
    mouseX = 0, mouseY = 0;

    window.addEventListener( 'resize', onWindowResize, false );

    camera.position.z = 6;

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
    update();
    render();
};
animate();

function update() {
    // cube.rotation.x += 0.001;
    // cube.rotation.y += 0.001;

    target.x += ( mouseX - target.x ) * .01;
    target.y += ( mouseY - target.y ) * .01;
    target.z = camera.position.z / 10; // assuming the camera is located at ( 0, 0, z );

    //let textpos = new THREE.Vector3(objects[1].postition);
    objects[0].lookAt(target);
    objects[1].lookAt(target);
    //objects[1].position.set(textpos);
}

function render() {
    rendererWEBGL.render( scene, camera );
    rendererCSS3D.render( sceneCSS, camera );
}
