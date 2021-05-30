import * as THREE from "https://threejs.org/build/three.module.js";

import { TrackballControls } from 'https://threejs.org/examples/jsm/controls/TrackballControls.js';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';

import { CSS3DRenderer, CSS3DObject } from 'https://threejs.org/examples/jsm/renderers/CSS3DRenderer.js';
import { TWEEN } from 'https://threejs.org/examples/jsm/libs/tween.module.min.js';
import Stats from 'https://threejs.org/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://threejs.org/examples/jsm/libs/dat.gui.module.js';

import { OBJLoader } from 'https://threejs.org/examples/jsm/loaders/OBJLoader.js';
import { EffectComposer } from 'https://threejs.org/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://threejs.org/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://threejs.org/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from 'https://threejs.org/examples/jsm/postprocessing/OutlinePass.js';
import { FXAAShader } from 'https://threejs.org/examples/jsm/shaders/FXAAShader.js';

let scene,
    sceneCSS, 
    camera,
    rendererWEBGL,
    rendererCSS3D,
    controls,
    target,
    mouseX,
    mouseY;

const cssScale = 10 // scaling factor for html/css elements
init();

// objects //

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial( { color: 0xbfc908 } ); //4d4d4d grey //bfc908 yellow
const cube = new THREE.Mesh( geometry, material );
scene.add(cube);

// CSS3D elements //

let element = document.createElement( 'div' );
element.setAttribute("style", "width: 20px; height: 20px; background = none; padding: 0px;"); // 20px = 10 * box value of that number
element.innerHTML = `
    <button type="button"
            class="labeltext"
            onclick="location.href = '/';"
            style="
                margin: auto
                width: 50%
                color: #1a1a1a;
                font-size: 2px;
                padding: 0px;
                margin-top: -10px;
                border: none;
                background: none;
                opacity: .5;
    ">
        Click Here</br>for homepage
    </button>
`;
element.onmouseover = function() {
    element.style.background = '#b88700';
}
element.onmouseleave = function() {
    element.style.background = 'none';
}

const css3d = new CSS3DObject( element );
css3d.scale.set(-1,1,1);
css3d.position.x = 0;
css3d.position.y = 0;
css3d.position.z = 15;
sceneCSS.add(css3d);

// events //

document.addEventListener('mousemove', onMouseMove, false);
target = new THREE.Vector3();
mouseX = 0, mouseY = 0;

window.addEventListener( 'resize', onWindowResize, false );

camera.position.z = 6;

animate();

function init() {
    // core THREE.js //
    scene = new THREE.Scene();
    sceneCSS = new THREE.Scene();
    sceneCSS.scale.set(1/cssScale, 1/cssScale, 1/cssScale);
    scene.fog = new THREE.Fog( new THREE.Color( 0x1a1a1a), 0, 10)

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    rendererWEBGL = new THREE.WebGLRenderer( { alpha: true } );
    rendererWEBGL.setSize( window.innerWidth, window.innerHeight );
    rendererWEBGL.setClearColor( 0x000000, 0 );
    document.getElementById('webgl').appendChild( rendererWEBGL.domElement );

    rendererCSS3D = new CSS3DRenderer();
    rendererCSS3D.setSize( window.innerWidth, window.innerHeight );
    rendererCSS3D.domElement.style.position = 'absolute';
    document.getElementById('css3d').appendChild( rendererCSS3D.domElement );    
    
    controls = new TrackballControls( camera, rendererCSS3D.domElement );
    controls.noZoom = true;
    controls.panSpeed = 5;
    controls.rotateSpeed = 5;
    controls.dynamicDampingFactor = 0.04; // MAKE IT SO ONMOUSEDOWN THIS IS MORE, LIKE .1 or .15
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

function affixtext(textObj, blockObj) {
    // get midpoint + rotation matrix of front face and move / rotate the text obj
    let transformMatrix = blockObj.matrix;
    let z = blockObj.geometry.parameters.depth;
    
    textObj.position.set(0,0,(z / 2) * cssScale);
    textObj.position.applyMatrix4(transformMatrix);
    textObj.lookAt(blockObj.position);
}

function affixlabeltext(labelObj, blockObj) { // THIS IMPLIES NO CONTROLS CUZ IT SCREWS IT UP

    // get midpoint of front face
    let transformMatrix = blockObj.matrix;
    let z = blockObj.geometry.parameters.depth;
    
    labelObj.position.set(0,0,(z / 2) * cssScale);
    labelObj.scale.set(1,1,1);
    labelObj.lookAt(camera.position);
    // labelObj.rotation.set(camera.rotation);
    labelObj.position.applyMatrix4(transformMatrix);
}

function animate() { // animate loop
    requestAnimationFrame( animate );
    update();
    render();
};
animate();

function update() {

    // target.x += ( mouseX - target.x ) * .01; // FOLLOW MOUSE
    // target.y += ( mouseY - target.y ) * .01;
    // target.z = camera.position.z / 10; // assuming the camera is located at ( 0, 0, z );
    // cube.lookAt(target);
    

    affixtext(css3d, cube);
    controls.update();
}

function render() {
    rendererWEBGL.render( scene, camera );
    rendererCSS3D.render( sceneCSS, camera );
}

function mainRedirect(event) {
    // window.location.href('/threejs')
}

function resetView() {
    camera.up = new THREE.Vector3(0,0,1);
    camera.lookAt(new THREE.Vector3(0,0,0));
}