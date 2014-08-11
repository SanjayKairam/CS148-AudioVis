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
	far = 10000,
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

/*
var groundTex = THREE.ImageUtils.loadTexture('../../images/MetallicAssembly-ColorMap.png');
groundTex.wrapS = THREE.RepeatWrapping; 
groundTex.wrapT = THREE.RepeatWrapping; 
groundTex.repeat.x = 256; 
groundTex.repeat.y = 256; 
var groundMat = new THREE.MeshLambertMaterial({map:groundTex});
var groundGeo = new THREE.PlaneGeometry(400,400); 

var ground = new THREE.Mesh(groundGeo,groundMat);
ground.rotation.x = Math.PI/2;
ground.doubleSided = true; 
ground.material.side = THREE.DoubleSide;
ground.position.set(0, 0, 0);
scene.add(ground); 
*/

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
/*
var i = 0;
for(var x = -16; x < 16; x += 2) {
	var j = 0;
	cubes[i] = new Array();
	for(var y = -16; y < 16; y += 2) {

		cubes[i][j] = createBuilding(mode);
		cubes[i][j].position = new THREE.Vector3(x, 0, y);
		
		scene.add(cubes[i][j]);
		j++;
	}
	i++;
}
*/
/***************
 * Create a cow *
 ***************/
var loadr = new THREE.JSONLoader();
var cowcallback = function (geometry) {  
    var color = new THREE.MeshLambertMaterial( { color: randomFairColor(), opacity: 1.0, transparent: false } ); 
    cow = new THREE.Mesh( geometry, color );
    cow.scale.x = cow.scale.y = cow.scale.z = 10.0; 
    cow.position.x = 25;
    cow.position.y = 6;
    cow.position.z = 25;
    scene.add(cow);
};

loadr.load('../../images/cow.js', cowcallback);

/***************
 * Create a bunny *
 ***************/
 var loadr = new THREE.JSONLoader();
var bunnycallback = function (geometry) {  
    var color = new THREE.MeshLambertMaterial( { color: randomFairColor(), opacity: 1.0, transparent: false } ); 
    bun = new THREE.Mesh( geometry, color );
    bun.scale.x = bun.scale.y = bun.scale.z = 20.0; 
    bun.position.x = -25;
    bun.position.z = 25;
    bun.position.y = -.8;

    scene.add(bun);
};

loadr.load('../../images/bunny.js', bunnycallback);

/***************
 * Create a car *
 ***************/
var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {

		console.log( item, loaded, total );

	};

var car;
var pivot;
var parent;

var loader = new THREE.BinaryLoader();
loader.load('../../images/veyron/VeyronNoUv_bin.js', 
	function(geometry) { 
    var red = new THREE.MeshLambertMaterial( { color: 0xd90217, opacity: 1.0, transparent: false } ); 
    car = new THREE.Mesh( geometry, red );
    car.scale.x = car.scale.y = car.scale.z = 0.05; 
    car.position.y = 1.8;
    car.position.z += 5.5;

    parent = new THREE.Object3D();
    scene.add(parent);

    pivot = new THREE.Object3D();
    pivot.rotation.x = 0;
    parent.add(pivot);   
    
    pivot.add(car);
    
});





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
	//controls.pan(new THREE.Vector3(0, 1, 0));
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
			
			// var scale = (array[k] + boost) / 75;
			// cubes[iVal][jVal].scale.y = (scale < 1 ? 1 : scale);
			
			// k += (k < array.length ? 1 : 0);

		}
		

		
		if (pivot.rotation.x <= Math.PI / 4) {
			pivot.rotation.x -= .01;
		}
		if (pivot.rotation.x < -Math.PI / 4) {
			pivot.rotation.x = 0;
		}
		//console.log('pivot rotation = ' + pivot.rotation.x);
	}

	// Set render function to next animation frame
	requestAnimFrame(render);
	controls.update();
	renderer.render(scene, camera);
}

function randomFairColor() {
	var min = 64;
	var max = 224;
	var r = (Math.floor(Math.random() * (max - min + 1)) + min) * 65536;
	var g = (Math.floor(Math.random() * (max - min + 1)) + min) * 256;
	var b = (Math.floor(Math.random() * (max - min + 1)) + min);
	return r + g + b;
}

// Don't forget to call render! That was a stupid problem to debug.
render();







