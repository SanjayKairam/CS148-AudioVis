/*
 * Sound City Audio Visualization
 * ------------------------------
 * Brandon Gottfried, Sanjay Kairam, Haley Sayres
 * Portions of this project adapted from:
 *  http://srchea.com/experimenting-with-web-audio-api-three-js-webgl
 *  http://learningthreejs.com/blog/2013/08/02/how-to-do-a-procedural-city-in-100lines/
 */

/*******************
 * Animating Stuff *
 *******************/

// A lot of people seem to be fond of this replacement for the default requestAnimFrame function
// @see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function(/* function */ callback, /* DOMElement */ element){
              window.setTimeout(callback, 1000 / 60);
            };
  })();

/************************
 * Setting up the scene *
 ************************/

// Full window width and height
var w = $(window).width(),
	h = $(window).height();

var view_angle = 50,
	aspect_ratio = w / h,
	near = 1,
	far = 1000;

// These 3 lines get repeated a lot!
var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(view_angle, aspect_ratio, near, far);
var scene = new THREE.Scene();

// Add camera to scene
scene.add(camera);

// Set camera position
camera.position.z = 50;

// Set renderer size and attach to container div
renderer.setSize(w, h);
$("#container").append(renderer.domElement);

/****************
 * Create cubes *
 ****************/

var cubes = new Array();

var i = 0;
for(var x = 0; x < 32; x += 2) {
	var j = 0;
	cubes[i] = new Array();
	for(var y = 0; y < 32; y += 2) {

		cubes[i][j] = createBuilding();
		cubes[i][j].position = new THREE.Vector3(x, 0, y);
		
		scene.add(cubes[i][j]);
		j++;
	}
	i++;
}

/****************
 * Set lighting *
 ****************/

// Add Ambient light
var light = new THREE.AmbientLight(0x505050);
scene.add(light);

// Add Directional Lights
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);


directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(0, -1, -1);
scene.add(directionalLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(-1, -1, 0);
scene.add(directionalLight);

/****************
 * Set Controls *
 ****************/

// Uses the linked OrbitControls.js library (linked)
var controls = new THREE.OrbitControls(camera);
controls.addEventListener('change', render);

// I believe this is what sets up the passive rotation, but not quite sure yet.
for (var i = 0 ; i < 7 ; i++) {
	controls.pan(new THREE.Vector3(1, 0, 0))
	controls.pan(new THREE.Vector3(0, 1, 0));
}

/*******************
 * Render Function *
 *******************/

// Render is called on each animation frame and whenever controls are used.
var render = function () {
	if (typeof array === 'object' && array.length > 0) {
		var k = 0;
		// Iterate through cubes and modify based on audio data.
		for (var i = 0 ; i < cubes.length ; i++) {
			for (var j = 0 ; j < cubes[i].length ; j++) {
				// Scale each cube according to "boost", calculated in audio.js
				var scale = (array[k] + boost) / 30;
				cubes[i][j].scale.y = (scale < 1 ? 1 : scale);
				k += (k < array.length ? 1 : 0);
			}
		}
	}

	// Set render function to next animation frame
	requestAnimFrame(render);
	controls.update();
	renderer.render(scene, camera);
}

// Don't forget to call render! That was a stupid problem to debug.
render();

function randomFairColor() {
	var min = 64;
	var max = 224;
	var r = (Math.floor(Math.random() * (max - min + 1)) + min) * 65536;
	var g = (Math.floor(Math.random() * (max - min + 1)) + min) * 256;
	var b = (Math.floor(Math.random() * (max - min + 1)) + min);
	return r + g + b;
}








