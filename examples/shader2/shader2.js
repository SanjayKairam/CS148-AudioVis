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

var attributes = {
  displacement: {
    type: 'f', // a float
    value: [] // an empty array
  }
};

var uniforms = {
  amplitude: {
    type: 'f', // a float
    value: 0
  }
};

// Create the sphere material using shader
var sphereMaterial = new THREE.ShaderMaterial({
  uniforms: uniforms,
  attributes: attributes,
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

// Populate the attribute info used by the shaders
var vertices = sphere.geometry.vertices;
var values = attributes.displacement.value
for(var v = 0; v < vertices.length; v++) {
  values.push(Math.random() * 30);
}

// Add sphere to scene
scene.add(sphere);

    /******************
     * Set Animation *
     ******************/

    var frame = 0;
    function update() {
      // Update amplitude based on frame value
      uniforms.amplitude.value = Math.sin(frame);

      // Update frame counter
      frame += 0.1;

      // Remember this guy? Now we're calling the same function but for each frame.
      renderer.render(scene, camera);

      // Set up next call
      requestAnimFrame(update);
    }

    requestAnimFrame(update);