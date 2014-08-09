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

//Don't kill me for these arrays--- I couldn't get the algorithm for spiraling to work, so we're doing this.
var xArr = [9, 9, 8, 8, 8, 9, 10, 10, 10, 10, 9, 8, 7, 7, 7, 7, 7, 8, 9, 10, 11, 11, 11, 11, 11, 11, 10, 9, 8, 7, 6, 6, 6, 6, 6, 6, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12, 12, 12, 12, 11, 10, 9, 8, 7, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 7, 8, 9, 10, 11, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 2, 2, 2 ,2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var yArr = [9, 8, 8, 9, 10, 10, 10, 9, 8, 7, 7, 7, 7, 8, 9, 10, 11, 11, 11, 11, 11, 10, 9, 8, 7, 6, 6, 6, 6, 6, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12, 12, 12, 11, 10, 9, 8, 7, 6, 5, 5, 5, 5, 5, 5, 5, 5, 6, 7, 8, 9, 10, 11, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

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
	far = 1000,
	mode = "day";

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

/***************************
 * Create ground, fog, sky *
 ***************************/

var groundMaterial = (mode == "day") ? new THREE.MeshLambertMaterial({ color: "#338855"}) : 
	new THREE.MeshLambertMaterial({ color: "#103010"})
var ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), groundMaterial);
ground.material.side = THREE.DoubleSide;
ground.position.set(0, 0, 0);
ground.rotation.x = Math.PI / 2;
scene.add(ground);

var skyMaterial = (mode == "day") ? new THREE.MeshBasicMaterial({ color: "#0099ee", side: THREE.BackSide }) :
	new THREE.MeshBasicMaterial({ color: "#333388", side: THREE.BackSide });
var skyBox = new THREE.Mesh(new THREE.CubeGeometry(200, 50, 200), skyMaterial);
skyBox.position.set(0,24.5,0);
scene.add(skyBox);

scene.fog = (mode == "day") ? new THREE.Fog(0xffffff, 0.015, 150) : new THREE.Fog(0x666666, 0.015, 150);

/****************
 * Create cubes *
 ****************/

var cubes = new Array();

var i = 0;
for(var x = -16; x < 16; x += 2) {
	var j = 0;
	cubes[i] = new Array();
	for(var y = -16; y < 16; y += 2) {

		cubes[i][j] = createBuilding(mode);
		cubes[i][j].position = new THREE.Vector3(x*2, 0, y*2);
		
		scene.add(cubes[i][j]);
		j++;
	}
	i++;
}

/****************
 * Set lighting *
 ****************/

// TODO - PLAY WITH LIGHTING
// Possibly different lighting settings for different modes?

// Add Ambient light
var light = (mode == "day") ? new THREE.AmbientLight(0x605550) : new THREE.AmbientLight(0x605550);
scene.add(light);

// Add Directional Lights
var directionalLight = (mode == "day") ? new THREE.DirectionalLight(0xffffff, 0.7) : new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.position.set(3, 1.5, 3);
scene.add(directionalLight);


/****************
 * Set Controls *
 ****************/

// Uses the linked OrbitControls.js library (linked)
var controls = new THREE.OrbitControls(camera);
controls.addEventListener('change', render);

// I believe this is what sets up the passive rotation, but not quite sure yet.
for (var i = 0 ; i < 7 ; i++) {
	// controls.pan(new THREE.Vector3(1, 0, 0))
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
		/*for (var i = 0 ; i < cubes.length ; i++) {
			for (var j = 0 ; j < cubes[i].length ; j++) {
				// Scale each cube according to "boost", calculated in audio.js
				var scale = (array[k] + boost) / 30;
				cubes[i][j].scale.y = (scale < 1 ? 1 : scale);
				k += (k < array.length ? 1 : 0);
			}
		}*/
		for (var i = 0 ; i < 256; i++) {
            		var iVal = xArr[i] - 1;
            		var jVal = yArr[i] - 1;
			// Scale each cube according to "boost", calculated in audio.js
			var scale = (array[k] + boost) / 75;
			cubes[iVal][jVal].scale.y = (scale < 1 ? 1 : scale);
			k += (k < array.length ? 1 : 0);
		}
	}

	// Set render function to next animation frame
	requestAnimFrame(render);
	controls.update();
	renderer.render(scene, camera);
}

// Don't forget to call render! That was a stupid problem to debug.
render();







