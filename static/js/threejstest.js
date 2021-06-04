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
    holding;
const cssScale = 50 // scaling factor for html/css elements


init();
// OBJECTS //

    // webgl //
const geometry = new THREE.BoxGeometry(2, 2, 2); // CONTROL CUBE
const material = new THREE.MeshBasicMaterial( { color: 0xbfc908 } ); //4d4d4d grey //bfc908 yellow
const cube = new THREE.Mesh( geometry, material );
scene.add(cube);

    // css3d //
let element = document.createElement( 'div' );
element.setAttribute("class", "htmlplate"); // 20px = 10 * box value of that number
element.innerHTML = `
    <button type="button" class="html textface" onclick="location.href = '/';">
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

let labelF = document.createElement('div');
let labelR = document.createElement('div');
let labelU = document.createElement('div');
let labelB = document.createElement('div');
let labelL = document.createElement('div');
let labelD = document.createElement('div');
labelF.classList.add('html', 'label');
labelR.classList.add('html', 'label');
labelU.classList.add('html', 'label');
labelB.classList.add('html', 'label');
labelL.classList.add('html', 'label');
labelD.classList.add('html', 'label');
labelF.innerHTML = 'Front';
labelR.innerHTML = 'Right';
labelU.innerHTML = 'Upper';
labelB.innerHTML = 'Back';
labelL.innerHTML = 'Left';
labelD.innerHTML = 'Down';

const f = new CSS3DObject( labelF );
f.scale.set(-1,1,1);
f.position.set(0,0,120);

const r = new CSS3DObject( labelR );
r.scale.set(-1,1,1);
r.position.set(0,0,0);

const u = new CSS3DObject( labelU );
u.scale.set(-1,1,1);
u.position.set(0,0,0);

const b = new CSS3DObject( labelB );
b.scale.set(-1,1,1);
b.position.set(0,0,0);

const l = new CSS3DObject( labelL );
l.scale.set(-1,1,1);
l.position.set(0,0,0);

const d = new CSS3DObject( labelD );
d.scale.set(-1,1,1);
d.position.set(0,0,0);

sceneCSS.add(f);
sceneCSS.add(r);
sceneCSS.add(u);
sceneCSS.add(b);
sceneCSS.add(l);
sceneCSS.add(d);

// EVENTS //

let target = new THREE.Vector3();
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', function(e) {
    mouseX = ( e.clientX / window.innerWidth ) * 2 - 1;
    mouseY = - ( e.clientY / window.innerHeight ) * 2 + 1;

    if (holding == true) {
        resetView();
    }
});

window.addEventListener( 'resize', function(e) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    rendererWEBGL.setSize(window.innerWidth, window.innerHeight);
    rendererCSS3D.setSize(window.innerWidth, window.innerHeight);
});


window.addEventListener( 'mousedown', function(e) {
    holding = true;
});
window.addEventListener( 'mouseup', function(e) {
    holding = false;
});

animate();

// INIT and ANIMATION LOOP //

function init() {
    // core THREE.js //
    scene = new THREE.Scene();
    sceneCSS = new THREE.Scene();
    sceneCSS.scale.set(1/cssScale, 1/cssScale, 1/cssScale);
    scene.fog = new THREE.Fog( new THREE.Color( 0x1a1a1a), 0, 10)

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 6;

    rendererWEBGL = new THREE.WebGLRenderer( { alpha: true } );
    rendererWEBGL.setSize( window.innerWidth, window.innerHeight );
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

function animate() { // animate loop
    requestAnimationFrame( animate );
    update();
    render();
};
animate();

function update() {
    affixtext(css3d, cube);
    affixlabeltext(f, cube, 'f');
    affixlabeltext(r, cube, 'r');
    affixlabeltext(u, cube, 'u');
    affixlabeltext(b, cube, 'b');
    affixlabeltext(l, cube, 'l');
    affixlabeltext(d, cube, 'd');

    controls.update();
}

function render() {
    rendererWEBGL.render( scene, camera );
    rendererCSS3D.render( sceneCSS, camera );
}

// FUNCTIONS //

function mainRedirect(event) {
    // window.location.href('/threejs')
}

function resetView() {
    camera.up = new THREE.Vector3(0,0,1);
    camera.lookAt(new THREE.Vector3(0,0,0));
}

function affixtext(textObj, blockObj) {
    // get midpoint + rotation matrix of front face and move / rotate the text obj
    let transformMatrix = blockObj.matrix;
    let z = blockObj.geometry.parameters.depth;
    
    textObj.position.set(0,0,(z / 2) * cssScale);
    textObj.position.applyMatrix4(transformMatrix);
    textObj.lookAt(blockObj.position);
}

function affixlabeltext(labelObj, blockObj, side, offsetunits) { // THIS IMPLIES NO CONTROLS CUZ IT SCREWS IT UP
    // get midpoint of front face
    let transformMatrix = blockObj.matrix;
    let z = blockObj.geometry.parameters.depth * 1.25;
    let y = blockObj.geometry.parameters.width * 1.25;
    let x = blockObj.geometry.parameters.height * 1.25;
    
    switch(side) {
        case 'f':
            labelObj.position.set(0,0,(z) * cssScale);
            break;
        case 'b':
            labelObj.position.set(0,0,(z) * -cssScale);
            break;
            
        case 'u':
            labelObj.position.set(0,(y) * cssScale,0);
            break;
        case 'd':
            labelObj.position.set(0,(y) * -cssScale,0);
            break;
        case 'l':
            labelObj.position.set((x) * -cssScale,0,0);
            break;
        case 'r':
            labelObj.position.set((x) * cssScale,0,0);
            break;
    }


    labelObj.scale.set(1,1,1);
    labelObj.lookAt(camera.position);

    labelObj.position.applyMatrix4(transformMatrix);
    labelObj.quaternion.copy(camera.quaternion);

    // if (follow) { // BROKEN WITH CONTROLS
    //     followMouse(css3d);
    //     labelObj.scale.set(-1,1,1);
    // }
}

function followMouse (obj) {
    target.x += ( mouseX - target.x ) * .004; // FOLLOW MOUSE
    target.y += ( mouseY - target.y ) * .004;
    target.z = camera.position.z / 10; // assuming the camera is located at ( 0, 0, z );
    obj.lookAt(target);
}