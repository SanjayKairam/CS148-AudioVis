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

	// lotSize = 3,
	 gapSize = 0.5;


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

var groundTex = THREE.ImageUtils.loadTexture('../../images/Tarmac_Road_Texture_Pack_5x_by_suicidecrew.jpg');
groundTex.wrapS = THREE.RepeatWrapping;
groundTex.wrapT = THREE.RepeatWrapping;
groundTex.repeat.set(9, 9);
var groundMat = new THREE.MeshLambertMaterial({ 
	color: "#111111",
	map: groundTex,
	side: THREE.DoubleSide
});

var ground = new THREE.Mesh(groundGeom, groundMat);
ground.position.set(0, 0, 0);
ground.rotation.x = Math.PI * 3 / 2;
ground.receiveShadow = true;
scene.add(ground);

// Sky
var skyGeom = new THREE.CubeGeometry(110, 110, 110);
skyGeom.faces.splice(3, 1);

var spectrum = document.querySelector('#Spectrum').getContext('2d');
spectrum.fillStyle = '#ffffff';
spectrum.fillRect(0, 0, spectrum.canvas.width, spectrum.canvas.height);

var imgW = 256,
	imgH = 256,
	re = [],
	im = [];

var image = new Image();
image.src = '../../images/moon_square_256.jpg';
image.addEventListener('load', function(e) {
	imgW = image.width,
	imgH = image.height,
	re = [],
	im = [];
	try {
	  FFT.init(imgW);
	  FrequencyFilter.init(imgW);
	  SpectrumViewer.init(spectrum);
	  //apply($('input[name=filter]:checked').val());
	} catch(e) {
	  alert(e);
	}
}, false);

var moonSource = document.createElement("canvas");
moonSource.width = 256;
moonSource.height = 256;

var moonSourceCtx = moonSource.getContext("2d");
moonSourceCtx.drawImage(image, 0, 0);						// Moon context now contains moon image data.

var moonResult = document.querySelector('#Result');
moonResult.width = 256;
moonResult.height = 256;

var result = moonResult.getContext("2d");
result.fillStyle = '#000000';
result.fillRect(0, 0, result.canvas.width, result.canvas.height);

var skyMaterials = [
	new THREE.MeshBasicMaterial({ color: "#000000", side: THREE.BackSide }),
	new THREE.MeshBasicMaterial({ color: "#000000", side: THREE.BackSide }),
	new THREE.MeshBasicMaterial({ color: "#111122", side: THREE.BackSide }),
	new THREE.MeshBasicMaterial({ color: "#000000", side: THREE.BackSide }),
	new THREE.MeshBasicMaterial({ color: "#000000", side: THREE.BackSide }),
	new THREE.MeshBasicMaterial({ map: null, side: THREE.BackSide }),
];
var skyMat = new THREE.MeshFaceMaterial(skyMaterials);
var sky = new THREE.Mesh(skyGeom, skyMat);
sky.position.set(0, 55, 0);
scene.add(sky);

function updateMoonTexture(val) {

	var moonResult = document.querySelector('#Result');
	moonResult.width = 256;
	moonResult.height = 256;

	var result = moonResult.getContext("2d");
	result.fillStyle = '#000000';
	result.fillRect(0, 0, result.canvas.width, result.canvas.height);

	function apply(type) {
	  console.log("Apply with type: " + type);
	  try {
	    spectrum.drawImage(image, 0, 0);							// draw image on to spectrum
	    console.log(imgW);
	    console.log(imgH);
	    console.log("apply 0");
	    var src = spectrum.getImageData(0, 0, imgW, imgH),			// get the image data
	        data = src.data,										// I guess this is the data data?
	        val = Math.min(Math.max($('#Slider').slider('option', 'value'), 100), 5000),	// clamped slider val
	        radius = Math.round((127 * val - 7800) / 4900);			// mapped back to normal amounts
	        i = 0,
	        val = 0,
	        p = 0;
	    console.log(val);
	    console.log(radius);
	    for(var y=0; y<h; y++) {
	      i = y*w;
	      for(var x=0; x<w; x++) {
	        re[i + x] = data[(i << 2) + (x << 2)];
	        im[i + x] = 0.0;
	      }
	    }
	    console.log("apply 1")
	    FFT.fft2d(re, im);
	    console.log("apply 2");
	    FrequencyFilter.swap(re, im);
	    if(type == 'HPF') {
	      FrequencyFilter.HPF(re, im, radius);
	    } else {
	      FrequencyFilter.LPF(re, im, radius);
	    }
	    console.log("apply 3");
	    //SpectrumViewer.render(re, im, true);
	    console.log("apply 4");
	    FrequencyFilter.swap(re, im);
	    FFT.ifft2d(re, im);
	    console.log("apply 5")
	    for(var y=0; y<h; y++) {
	      i = y*w;
	      for(var x=0; x<w; x++) {
	        val = re[i + x];
	        val = val > 255 ? 255 : val < 0 ? 0 : val;
	        p = (i << 2) + (x << 2);
	        data[p] = data[p + 1] = data[p + 2] = val;
	      }
	    }
	    console.log("apply 6");
	    result.putImageData(src, 0, 0);
		var moonTexture = new THREE.Texture(moonResult);
		moonTexture.needsUpdate = true;
		sky.material.materials[5].map = moonTexture;
	    console.log("apply 7");
	  } catch(e) {
	    alert(e);
	  }
	}

	function checkTypedArray() {
	  try {
	    var u8 = new Uint8Array(1),
	        f64 = new Float64Array(1);
	  } catch(e) {
	    console.log(e);
	  }
	}

	var imgData = moonSourceCtx.getImageData(0, 0, 256, 256);
	apply("LPF");
	// result.putImageData(imgData, 0, 0);
	// var moonTexture = new THREE.Texture(moonResult);
	// moonTexture.needsUpdate = true;
	// sky.material.materials[5].map = moonTexture;
}

updateMoonTexture($('#Slider').slider('option', 'value'));

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
		cubes[i][j].position = new THREE.Vector3(iPos, 5, jPos);
		cubes[i][j].castShadow = true;
		cubes[i][j].receiveShadow = true;
		scene.add(cubes[i][j]);
	}
}


// Calculate distance from center.
var centerDist = function(xzCoord, dim) { 
	return Math.abs(xzCoord[0] - ((dim - 1)/2)) + Math.abs(xzCoord[1] - ((dim - 1)/2));
};

// Sort coordinate array from center to outside.
xzCoords.sort(function(a,b) { return centerDist(a,citySize) - centerDist(b,citySize); });

/***************
 * Create a tree *
 ***************/
var treeTex = THREE.ImageUtils.loadTexture('../../images/bark.jpg');
var radius = 50;
var numTrees = 34;
var tree_gap = 12.5;
var loader = new THREE.JSONLoader();
var tree, treegeo, treeMat;
var clones = [];
var treecallback = function(geometry) {
	treegeo = geometry;
	treeMat = new THREE.MeshLambertMaterial( {map:treeTex} ); 
	var x_pos = -1 * radius;
	var z_pos = x_pos;
	for (var i = 0; i < numTrees; i += 1) {
		clones[i] = new THREE.Mesh(geometry, treeMat); 
		if (i == 9) {
			z_pos = radius;
			x_pos = -1 * radius;
		}
		if (i == 18) {
			x_pos = -1 * radius;
			z_pos = -1 * radius + tree_gap;
		}
		if (i == 26) {
			x_pos = radius;
			z_pos = -1 * radius;
		}
		clones[i].position.x = x_pos;
		clones[i].position.z = z_pos;

		// var theta = 2.0 * Math.PI * i / numTrees;
		// clones[i].position.x = radius * Math.cos(theta);
		// clones[i].position.z = radius * Math.sin(theta);
		clones[i].scale.x = clones[i].scale.y = clones[i].scale.z = 10.0;
		clones[i].rotation.y = 2 * Math.PI * Math.random();
		clones[i].castShadow = true;
		clones[i].receiveShadow = true;
		scene.add(clones[i]);

		/* trees on night side */
		/*
		var ni = i + (numTrees / 2);
		clones[ni] = new THREE.Mesh(geometry, treeMat);
		clones[ni].position.x = x_pos;
		clones[ni].position.z = z_pos;
		clones[ni].scale.x = clones[ni].scale.z = 15.0;
		clones[ni].scale.y = -15.0;
		scene.add(clones[ni]);
		*/

		if (i < 18) x_pos += tree_gap;
		if (i >= 19) z_pos += tree_gap;
	}

}
loader.load('../../images/tree.js', treecallback);

/************
 * Create cars *
 ************/
var cars = [];
var step = 6;
var numCars = 14;
var loader = new THREE.BinaryLoader();
loader.load('../../images/veyron/VeyronNoUv_bin.js', 
	function(geometry) { 
	for (var i = 0; i < (numCars / 2); i += 1) {
	    var color = new THREE.MeshLambertMaterial( { color: rainbow((numCars / 2), i) } ); 
	    //var color = new THREE.MeshLambertMaterial( { color: randomFairColor(), opacity: 1.0, transparent: false } ); 
	    cars[i] = new THREE.Mesh( geometry, color );
	    cars[i].position.z = -50.0;
		cars[i].visibility = true;
		var slot = (0 - lotSize - step * 3 * lotSize) + (6 * i * lotSize) + (gapSize * 2);
		cars[i].position.x = slot;
		cars[i].scale.x = cars[i].scale.y = cars[i].scale.z = 0.015; 
	    cars[i].position.y = 0.6;
		cars[i].castShadow = true;
		cars[i].receiveShadow = true;
		scene.add(cars[i]);

		/* cars on night side */
		/*
		cars[i + (numCars / 2)] = new THREE.Mesh(geometry, color);
	    cars[i + (numCars / 2)].position.z = -50.0;
		cars[i + (numCars / 2)].visibility = false;
		cars[i + (numCars / 2)].position.x = slot;
		cars[i + (numCars / 2)].scale.x = cars[i + (numCars / 2)].scale.z = 0.015; 
	    cars[i + (numCars / 2)].position.y = -0.6;
	    cars[i + (numCars / 2)].scale.y = -0.015;
		scene.add(cars[i + (numCars / 2)]);
		*/
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


/****************
 * Set lighting *
 ****************/

// TODO - PLAY WITH LIGHTING
// Possibly different lighting settings for different modes?

// Add Ambient light
var light = new THREE.AmbientLight(0x333333);
scene.add(light);

renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;

// Moonlight
var moonlight = new THREE.SpotLight(0xffffff, 1.0);
moonlight.position.set(-15, 55, -55);
moonlight.castShadow = true;
moonlight.shadowDarkness = 0.5;
scene.add(moonlight);

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
			cubes[xCoord][zCoord].position.y = 5 * cubes[xCoord][zCoord].scale.y;
		}

		// Moving Cars
		for (var i = 0; i < cars.length; i += 1) {
			if ((boost / i) > i * 1.5 ){
				cars[i].z = -50.0;
				cars[i].visibility = true;
			}
			if (cars[i].position.z <= 50.0) {
				cars[i].position.z += boost / (100 + (i * 10));	
			} else {
				cars[i].position.z = -50.0;
				cars[i].visibility = false;
			}
		}

		/***** bouncing day trees */
		
		for (var i = 0; i < numTrees; i += 1) {
			if (i % 2) clones[i].scale.y = (scale < 1 ? 10.0 : scale * 12.0);
			else clones[i].scale.y = (scale < 1 ? 12.0 : scale * 10.0);
		}
		/***** bouncing night trees */
		/*
		for (var i = (numTrees / 2); i < numTrees; i += 1) {
			if (i % 2) clones[i].scale.y = (scale < 1 ? -15.0 : scale * -12.0);
			else clones[i].scale.y = (scale < 1 ? -15.0 : scale * -12.0);

		}
		*/
	}

	//updateMoonTexture();

	// Set render function to next animation frame
	requestAnimFrame(render);
	controls.update();
	renderer.render(scene, camera);
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







