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
	mode = "day";
	far = 3000;

var citySize = 32,				// # buildings in a row and column
	blockSize = 4,				// # buildings in a block [still to be implemented]
	lotSize = 2,
	roadWidth = 4;

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

// var groundMaterial = (mode == "day") ? new THREE.MeshLambertMaterial({ color: "#338855"}) : 
// 	new THREE.MeshLambertMaterial({ color: "#103010"})
// var ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), groundMaterial);
// ground.material.side = THREE.DoubleSide;
// ground.position.set(0, 0, 0);
// ground.rotation.x = Math.PI / 2;
// scene.add(ground);

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

// Ground: Day Side
var groundGeom1 = new THREE.PlaneGeometry(2000, 2000);
var groundMat1 = new THREE.MeshLambertMaterial({ color: "#99BB99"});
var ground1 = new THREE.Mesh(groundGeom1, groundMat1);
ground1.position.set(0, 0, 0);
ground1.rotation.x = Math.PI * 3 / 2;
scene.add(ground1);

// Ground: Night Side
var groundGeom2 = new THREE.PlaneGeometry(2000, 2000);
var groundMat2 = new THREE.MeshLambertMaterial({ color: "#994433"});
var ground2 = new THREE.Mesh(groundGeom2, groundMat2);
ground2.position.set(0, 0, 0);
ground2.rotation.x = Math.PI / 2;
scene.add(ground2);

// Sky: Day Side
var skyGeom1 = new THREE.CubeGeometry(2000, 2000, 2000);
skyGeom1.faces.splice(3, 1);
var skyMat1 = new THREE.MeshBasicMaterial({ color: "#0099ee", side: THREE.BackSide });
var sky1 = new THREE.Mesh(skyGeom1, skyMat1);
sky1.position.set(0, 1000, 0);
scene.add(sky1);

// Sky: Night Side
var skyGeom2 = new THREE.CubeGeometry(2000, 2000, 2000);
skyGeom2.faces.splice(2, 1);
var skyMat2 = new THREE.MeshBasicMaterial({ color: "#222255", side: THREE.BackSide });
var sky2 = new THREE.Mesh(skyGeom2, skyMat2);
sky2.position.set(0, -1000, 0);
scene.add(sky2);

// Fog (duh)
scene.fog = new THREE.Fog(0xaaaaaa, 0.015, 1500);

/****************
 * Create cubes *
 ****************/
// var cubes = new Array();

// var i = 0;
// for(var x = -16; x < 16; x += 2) {
// 	var j = 0;
// 	cubes[i] = new Array();
// 	for(var y = -16; y < 16; y += 2) {

//Don't kill me for these arrays--- I couldn't get the algorithm for spiraling to work, so we're doing this.
// var xArr = [9, 9, 8, 8, 8, 9, 10, 10, 10, 10, 9, 8, 7, 7, 7, 7, 7, 8, 9, 10, 11, 11, 11, 11, 11, 11, 10, 9, 8, 7, 6, 6, 6, 6, 6, 6, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12, 12, 12, 12, 11, 10, 9, 8, 7, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 7, 8, 9, 10, 11, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 2, 2, 2 ,2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
// var yArr = [9, 8, 8, 9, 10, 10, 10, 9, 8, 7, 7, 7, 7, 8, 9, 10, 11, 11, 11, 11, 11, 10, 9, 8, 7, 6, 6, 6, 6, 6, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12, 12, 12, 11, 10, 9, 8, 7, 6, 5, 5, 5, 5, 5, 5, 5, 5, 6, 7, 8, 9, 10, 11, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

// Array to sort coordinates in center-out order.
var xzCoords = [];

var dayCubes = new Array();
var nightCubes = new Array();

var centerOffset = ((citySize * lotSize) + (roadWidth * (citySize/blockSize - 1))) / 2;

for (var i = 0 ; i < citySize ; i += 1) {
	dayCubes[i] = new Array();
	nightCubes[i] = new Array();
	for (var j = 0 ; j < citySize ; j += 1) {
		xzCoords.push([i, j]);
		var iPos = (i * lotSize) + (Math.floor(i/4) * roadWidth) - centerOffset;
		var jPos = (j * lotSize) + (Math.floor(j/4) * roadWidth) - centerOffset;

		dayCubes[i][j] = createBuilding("day");
		dayCubes[i][j].position = new THREE.Vector3(iPos, 3, jPos);
		scene.add(dayCubes[i][j]);

		nightCubes[i][j] = createBuilding("night");
		nightCubes[i][j].position = new THREE.Vector3(iPos, -3, jPos);
		scene.add(nightCubes[i][j]);
	}
}
/***************
 * Create a tree *
 ***************/
var treeTex = THREE.ImageUtils.loadTexture('../../images/tree_pink.jpg');
var radius = 90;
var numTrees = 76;
var tree_gap = 20;
var loader = new THREE.JSONLoader();
var tree, treegeo, treeMat;
var clones = [];
var treecallback = function(geometry) {
	treegeo = geometry;
	treeMat = new THREE.MeshLambertMaterial( { color: randomFairColor(), opacity: 1.0, transparent: false, map:treeTex } ); 
	var x_pos = -1 * radius;
	var z_pos = x_pos;
	for (var i = 0; i < (numTrees / 2); i += 1) {
		clones[i] = new THREE.Mesh(geometry, treeMat); 
		if (i == 10) {
			z_pos = radius;
			x_pos = -1 * radius;
		}
		if (i == 20) {
			x_pos = -1 * radius;
			z_pos = -1 * radius + tree_gap;
		}
		if (i == 29) {
			x_pos = radius;
			z_pos = -1 * radius;
		}
		clones[i].position.x = x_pos;
		clones[i].position.z = z_pos;

		// var theta = 2.0 * Math.PI * i / numTrees;
		// clones[i].position.x = radius * Math.cos(theta);
		// clones[i].position.z = radius * Math.sin(theta);
		clones[i].scale.x = clones[i].scale.y = clones[i].scale.z = 15.0;
		scene.add(clones[i]);

		/* trees on night side */
		var ni = i + (numTrees / 2);
		clones[ni] = new THREE.Mesh(geometry, treeMat);
		clones[ni].position.x = x_pos;
		clones[ni].position.z = z_pos;
		clones[ni].scale.x = clones[ni].scale.z = 15.0;
		clones[ni].scale.y = -15.0;
		scene.add(clones[ni]);

		if (i < 20) x_pos += tree_gap;
		if (i >= 20) z_pos += tree_gap;
	}

}
loader.load('../../images/tree.js', treecallback);

/************
 * Create cars *
 ************/
var cars = [];
var car;
// for (var i = 0; i < 4; i += 1) {
// 	var car = createCar();
// 	cars[i] = car;
// 	cars[i].visibility = true;
// 	cars[i].position.z = centerOffset - (i * roadWidth);
// 	cars[i].position.x = 0;
// 	cars[i].scale.x = cars[i].scale.y = cars[i].scale.z = 0.01; 
//     cars[i].position.y = 0.5;
// 	scene.add(cars[i]);
// }
var step = 6;
var numCars = 14;
var loader = new THREE.BinaryLoader();
loader.load('../../images/veyron/VeyronNoUv_bin.js', 
	function(geometry) { 
	for (var i = 0; i < (numCars / 2); i += 1) {
	    var color = new THREE.MeshLambertMaterial( { color: rainbow(4, i), opacity: 1.0, transparent: false } ); 
//	    var color = new THREE.MeshLambertMaterial( { color: randomFairColor(), opacity: 1.0, transparent: false } ); 
	    cars[i] = new THREE.Mesh( geometry, color );
	    cars[i].position.z = -50.0;
		cars[i].visibility = false;
		var slot = (0 - lotSize - step * 3 * lotSize) + (6 * i * lotSize);
		cars[i].position.x = slot;
		cars[i].scale.x = cars[i].scale.y = cars[i].scale.z = 0.015; 
	    cars[i].position.y = 0.6;
		scene.add(cars[i]);

		/* cars on night side */
		cars[i + (numCars / 2)] = new THREE.Mesh(geometry, color);
	    cars[i + (numCars / 2)].position.z = -50.0;
		cars[i + (numCars / 2)].visibility = false;
		cars[i + (numCars / 2)].position.x = slot;
		cars[i + (numCars / 2)].scale.x = cars[i + (numCars / 2)].scale.z = 0.015; 
	    cars[i + (numCars / 2)].position.y = -0.6;
	    cars[i + (numCars / 2)].scale.y = -0.015;
		scene.add(cars[i + (numCars / 2)]);

	}
});


/***************
 * Create a cow *
 ***************/
// var loadr = new THREE.JSONLoader();
// var cowcallback = function (geometry) {  
//     var color = new THREE.MeshLambertMaterial( { color: randomFairColor(), opacity: 1.0, transparent: false } ); 
//     cow = new THREE.Mesh( geometry, color );
//     cow.scale.x = cow.scale.y = cow.scale.z = 10.0; 
//     cow.position.x = 25;
//     cow.position.y = 6;
//     cow.position.z = 25;
//     scene.add(cow);
// };

// loadr.load('../../images/cow.js', cowcallback);

/***************
 * Create a bunny *
 ***************/
// var loadr = new THREE.JSONLoader();
// var bunnycallback = function (geometry) {  
//     var color = new THREE.MeshLambertMaterial( { color: randomFairColor(), opacity: 1.0, transparent: false } ); 
//     bun = new THREE.Mesh( geometry, color );
//     bun.scale.x = bun.scale.y = bun.scale.z = 20.0; 
//     bun.position.x = -25;
//     bun.position.z = 25;
//     bun.position.y = -.8;

//     scene.add(bun);
// };

// loadr.load('../../images/bunny.js', bunnycallback);



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
var light = new THREE.AmbientLight(0x605550);
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
	if (typeof array === "object" && array.length > 0) {
		// Map buildings to appropriate array items
		for (var i = 0 ; i < (citySize * citySize) ; i++) {
			var arrIdx = Math.floor((i * array.length) / (citySize * citySize));

			var xCoord = xzCoords[i][0];
			var zCoord = xzCoords[i][1];

			var scale = (array[arrIdx] + boost) / 80;

			dayCubes[xCoord][zCoord].scale.y = (scale < 1 ? 1 : scale);
			dayCubes[xCoord][zCoord].position.y = 3 * dayCubes[xCoord][zCoord].scale.y;

			nightCubes[xCoord][zCoord].scale.y = (scale < 1 ? 1 : scale);
			nightCubes[xCoord][zCoord].position.y = -3 * nightCubes[xCoord][zCoord].scale.y;

		}
		
		for (var i = 0; i < cars.length; i += 1) {
			if ((boost / i) > i * 1.5 ){
				cars[i].z = -50;
				cars[i].visibility = true;
			}
			if (cars[i].position.z <= 50.0) {
				cars[i].position.z += boost / (100 + (i * 10));	
			} else {
				cars[i].position.z = -50.0;
				cars[i].visibility = false;
			}
		}


		for (var i = 0; i < (numTrees / 2); i += 1) {
			if (i % 2) clones[i].scale.y = (scale < 1 ? 15.0 : scale * 12.0);
			else clones[i].scale.y = (scale < 1 ? 15.0 : scale * 12.0);
		}
		for (var i = (numTrees / 2); i < numTrees; i += 1) {
			if (i % 2) clones[i].scale.y = (scale < 1 ? -15.0 : scale * -12.0);
			else clones[i].scale.y = (scale < 1 ? -15.0 : scale * -12.0);
		}
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

function rainbow(numOfSteps, step) {
// HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch(i % 6){
        case 0: r = 1, g = f, b = 0; break;
        case 1: r = q, g = 1, b = 0; break;
        case 2: r = 0, g = 1, b = f; break;
        case 3: r = 0, g = q, b = 1; break;
        case 4: r = f, g = 0, b = 1; break;
        case 5: r = 1, g = 0, b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
}

// Don't forget to call render! That was a stupid problem to debug.
render();







