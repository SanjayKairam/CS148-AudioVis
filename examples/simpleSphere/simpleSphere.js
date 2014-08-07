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

/*****************
 * Create Sphere *
 *****************/

// Create sphere material (using Three.JS default)
// THREE.MeshLambertMaterial reference: http://threejs.org/docs/#Reference/Materials/MeshLambertMaterial
var sphereMaterial = new THREE.MeshLambertMaterial( { color : 0xCC0000 });

// Set up variables to define sphere
var radius = 50,
	segments = 16,
	rings = 16;

// This seems to be where Three.JS really makes life easy!
var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), sphereMaterial);

// Add sphere to scene
scene.add(sphere);

/**************
 * Add Lights *
 **************/

// Create a point light (again using Three.JS default)
// THREE.PointLight reference: http://threejs.org/docs/#Reference/Lights/PointLight
var pointLight = new THREE.PointLight(0xFFFFFF);

// Position light
pointLight.position.x = 0;
pointLight.position.y = 60;
pointLight.position.z = 130;

// Add light to scene
scene.add(pointLight);

/****************
 * Render Scene *
 ****************/

renderer.render(scene, camera);