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

var view_angle = 45,
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
camera.position.z = 75;

// Set renderer size and attach to container div
renderer.setSize(w, h);
$("#container").append(renderer.domElement);

/***************************
 * Create ground, fog, sky *
 ***************************/

// Set up two-sides to the ground.
var groundGeom1 = new THREE.PlaneGeometry(200, 200);
var groundMat1 = new THREE.MeshLambertMaterial({ color: "#99BB99"});
var ground1 = new THREE.Mesh(groundGeom1, groundMat1);
ground1.position.set(0, 0, 0);
ground1.rotation.x = Math.PI * 3 / 2;
scene.add(ground1);

var groundGeom2 = new THREE.PlaneGeometry(200, 200);
var groundMat2 = new THREE.MeshLambertMaterial({ color: "#994433"});
var ground2 = new THREE.Mesh(groundGeom2, groundMat2);
ground2.position.set(0, 0, 0);
ground2.rotation.x = Math.PI / 2;
scene.add(ground2);

var skyGeom1 = new THREE.CubeGeometry(200, 200, 200);
skyGeom1.faces.splice(3, 1);
var skyMat1 = new THREE.MeshBasicMaterial({ color: "#0099ee", side: THREE.BackSide });
var sky1 = new THREE.Mesh(skyGeom1, skyMat1);
sky1.position.set(0, 100, 0);
scene.add(sky1);

var skyGeom2 = new THREE.CubeGeometry(200, 200, 200);
skyGeom2.faces.splice(2, 1);
var skyMat2 = new THREE.MeshBasicMaterial({ color: "#222255", side: THREE.BackSide });
var sky2 = new THREE.Mesh(skyGeom2, skyMat2);
sky2.position.set(0, -100, 0);
scene.add(sky2);

scene.fog = new THREE.Fog(0xaaaaaa, 0.015, 350);

/****************
 * Create cubes *
 ****************/

//Don't kill me for these arrays--- I couldn't get the algorithm for spiraling to work, so we're doing this.
// var xArr = [9, 9, 8, 8, 8, 9, 10, 10, 10, 10, 9, 8, 7, 7, 7, 7, 7, 8, 9, 10, 11, 11, 11, 11, 11, 11, 10, 9, 8, 7, 6, 6, 6, 6, 6, 6, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12, 12, 12, 12, 11, 10, 9, 8, 7, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 7, 8, 9, 10, 11, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 2, 2, 2 ,2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
// var yArr = [9, 8, 8, 9, 10, 10, 10, 9, 8, 7, 7, 7, 7, 8, 9, 10, 11, 11, 11, 11, 11, 10, 9, 8, 7, 6, 6, 6, 6, 6, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12, 12, 12, 11, 10, 9, 8, 7, 6, 5, 5, 5, 5, 5, 5, 5, 5, 6, 7, 8, 9, 10, 11, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

var xzCoords = [];

var dayCubes = new Array();
var nightCubes = new Array();

for (var i = 0 ; i < 16 ; i += 1) {
	dayCubes[i] = new Array();
	nightCubes[i] = new Array();
	for (var j = 0 ; j < 16 ; j += 1) {
		xzCoords.push([i, j]);

		dayCubes[i][j] = createBuilding("day");
		dayCubes[i][j].position = new THREE.Vector3(i * 2 - 16, 3, j * 2 - 16);
		scene.add(dayCubes[i][j]);

		nightCubes[i][j] = createBuilding("night");
		nightCubes[i][j].position = new THREE.Vector3(i * 2 - 16, -3, j * 2 - 16);
		scene.add(nightCubes[i][j]);
	}
}

var centerDist = function(xzCoord, dim) { 
	return Math.abs(xzCoord[0] - ((dim - 1)/2)) + Math.abs(xzCoord[1] - ((dim - 1)/2));
};
xzCoords.sort(function(a,b) { return centerDist(a,16) - centerDist(b,16); });

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
	if (typeof array === "object" && array.length > 0) {
		for (var i = 0 ; i < 256 ; i++) {
			if (i > array.length) break;

			var xCoord = xzCoords[i][0];
			var zCoord = xzCoords[i][1];

			var scale = (array[i] + boost) / 80;

			dayCubes[xCoord][zCoord].scale.y = (scale < 1 ? 1 : scale);
			dayCubes[xCoord][zCoord].position.y = 3 * dayCubes[xCoord][zCoord].scale.y;

			nightCubes[xCoord][zCoord].scale.y = (scale < 1 ? 1 : scale);
			nightCubes[xCoord][zCoord].position.y = -3 * nightCubes[xCoord][zCoord].scale.y;
		}
	}

	// Set render function to next animation frame
	requestAnimFrame(render);
	controls.update();
	renderer.render(scene, camera);
}

// Don't forget to call render! That was a stupid problem to debug.
render();







