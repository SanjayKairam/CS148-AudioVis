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
	far = 3000;

var citySize = 16,				// # buildings in a row and column
	blockSize = 4,				// # buildings in a block [still to be implemented]
	lotSize = 2,
	roadWidth = 2;

// These 3 lines get repeated a lot!
var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(view_angle, aspect_ratio, near, far);
var scene = new THREE.Scene();

// Add camera to scene
scene.add(camera);

// Set camera position
camera.position.z = 75;
camera.position.y = 10;

// Set renderer size and attach to container div
renderer.setSize(w, h);
$("#container").append(renderer.domElement);

/***************************
 * Create ground, fog, sky *
 ***************************/

// Ground
var groundGeom = new THREE.PlaneGeometry(110, 110);
var groundMat = new THREE.MeshLambertMaterial({ color: "#111111"});
var ground = new THREE.Mesh(groundGeom, groundMat);
ground.position.set(0, 0, 0);
ground.rotation.x = Math.PI * 3 / 2;
scene.add(ground);

// Sky: Day Side
var skyGeom = new THREE.CubeGeometry(110, 80, 110);
skyGeom.faces.splice(3, 1);

var skyMaterials = [
	new THREE.MeshBasicMaterial({ color: "#000000", side: THREE.BackSide }),
	new THREE.MeshBasicMaterial({ color: "#000000", side: THREE.BackSide }),
	new THREE.MeshBasicMaterial({ color: "#111122", side: THREE.BackSide }),
	new THREE.MeshBasicMaterial({ color: "#000000", side: THREE.BackSide }),
	new THREE.MeshBasicMaterial({ color: "#000000", side: THREE.BackSide }),
	new THREE.MeshBasicMaterial({ 
		map: THREE.ImageUtils.loadTexture('../../images/clem_full_moon_strtrk.jpg'), 
		side: THREE.BackSide
	}),
];
var skyMat = new THREE.MeshFaceMaterial(skyMaterials);
var sky = new THREE.Mesh(skyGeom, skyMat);
sky.position.set(0, 40, 0);
scene.add(sky);

// Fog (duh)
// scene.fog = new THREE.Fog(0x333333, 50, 150);

/****************
 * Create cubes *
 ****************/

// Array to sort coordinates in center-out order.
var xzCoords = [];

var cubes = new Array();

var centerOffset = ((citySize * lotSize) + (roadWidth * (citySize/blockSize - 1))) / 2;

for (var i = 0 ; i < citySize ; i += 1) {
	cubes[i] = new Array();
	for (var j = 0 ; j < citySize ; j += 1) {
		xzCoords.push([i, j]);
		var iPos = (i * lotSize) + (Math.floor(i/4) * roadWidth) - centerOffset;
		var jPos = (j * lotSize) + (Math.floor(j/4) * roadWidth) - centerOffset;

		cubes[i][j] = createBuilding("night");
		cubes[i][j].position = new THREE.Vector3(iPos, 3, jPos);
		scene.add(cubes[i][j]);
	}
}

// Calculate distance from center.
var centerDist = function(xzCoord, dim) { 
	return Math.abs(xzCoord[0] - ((dim - 1)/2)) + Math.abs(xzCoord[1] - ((dim - 1)/2));
};

// Sort coordinate array from center to outside.
xzCoords.sort(function(a,b) { return centerDist(a,citySize) - centerDist(b,citySize); });

/****************
 * Set lighting *
 ****************/

// TODO - PLAY WITH LIGHTING
// Possibly different lighting settings for different modes?

// Add Ambient light
var light = new THREE.AmbientLight(0x333333);
scene.add(light);

// Day-side directional light
var dLight = new THREE.DirectionalLight(0xffffdd, 0.8);
dLight.position.set(30, 30, 30);
scene.add(dLight);

// Night-side directional light
dLight = new THREE.DirectionalLight(0xffddff, 0.4);
dLight.position.set(30, -30, 30);
scene.add(dLight);

/****************
 * Set Controls *
 ****************/

// Uses the linked OrbitControls.js library (linked)
var controls = new THREE.OrbitControls(camera);
controls.addEventListener('change', render);

/*******************
 * Render Function *
 *******************/

// Render is called on each animation frame and whenever controls are used.
var render = function () {
	if (typeof array === "object" && array.length > 0) {
		// Map buildings to appropriate array items
		for (var i = 0 ; i < (citySize * citySize) ; i++) {
			var arrIdx = Math.floor((i * array.length) / (citySize * citySize));

			var xCoord = xzCoords[i][0];
			var zCoord = xzCoords[i][1];

			var scale = (array[arrIdx] + boost) / 80;

			cubes[xCoord][zCoord].scale.y = (scale < 1 ? 1 : scale);
			cubes[xCoord][zCoord].position.y = 3 * cubes[xCoord][zCoord].scale.y;
		}
	}

	// Set render function to next animation frame
	requestAnimFrame(render);
	controls.update();
	renderer.render(scene, camera);
}

// Don't forget to call render! That was a stupid problem to debug.
render();







