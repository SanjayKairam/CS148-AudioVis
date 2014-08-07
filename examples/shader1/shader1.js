/************************
 * Setting up the scene *
 ************************/

// Set scene dimensions
var w = 400,
	h = 300;

// Set camera attributes
var view_angle = 45,
	aspect_ratio = w / h,
	near = 0.1,
	far = 10000;

// These 3 lines get repeated a lot!
var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(view_angle, aspect_ratio, near, far);
var scene = new THREE.Scene();

// Add camera to scene
scene.add(camera);

// Set camera position
camera.position.z = 300;

// Set renderer size and attach to container div
renderer.setSize(w, h);
$("#container").append(renderer.domElement);

/************************
 * Invoking the Shaders *
 ************************/

// Create the sphere material using the shaders
// Using jQuery to grab the shader programs that we saved as <script> elements on the page.
var sphereMaterial = new THREE.ShaderMaterial({
	vertexShader: $("#vertexshader").text(),
	fragmentShader: $("#fragmentshader").text()
});

/*****************
 * Create Sphere *
 *****************/

// Set up variables to define sphere
var radius = 50,
	segments = 16,
	rings = 16;

// This seems to be where Three.JS really makes life easy!
var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), sphereMaterial);

// Add sphere to scene
scene.add(sphere);

/****************
 * Render Scene *
 ****************/

renderer.render(scene, camera);