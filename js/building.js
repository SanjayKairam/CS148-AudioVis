var createBuilding = function(texMode) {
	
	// Base geometry for building
	var geometry = new THREE.CubeGeometry(lotSize - gapSize, 10, lotSize - gapSize);

	// Splice out the floor.
	geometry.faces.splice(3, 1);

	// Set UV (texture coordinates) for the top face (roof)
	geometry.faceVertexUvs[0][2][0].set( 0, 0 );
	geometry.faceVertexUvs[0][2][1].set( 0, 0 );
	geometry.faceVertexUvs[0][2][2].set( 0, 0 );
	geometry.faceVertexUvs[0][2][3].set( 0, 0 );

	// http://threejs.org/docs/#Reference/Textures/Texture
	var texture = new THREE.Texture(generateTextureCanvas(texMode));
	// http://en.wikipedia.org/wiki/Anisotropic_filtering
	texture.anisotropy = renderer.getMaxAnisotropy();
	// Used if a texture is going to be changed after creation.
	texture.needsUpdate = true;

	// Create the material
	var material = new THREE.MeshLambertMaterial({
		emissive: new THREE.Color(0xaaaa33),
		map : texture,
		vertexColors : THREE.VertexColors
	});

	// Create mesh using geometry and material
	return new THREE.Mesh(geometry, material);
}

var generateTextureCanvas = function(mode) {
	if (mode == "day") return generateDayTextureCanvas();
	else return generateNightTextureCanvas();
}

var generateDayTextureCanvas = function() {

	// Build a small 32x64 canvas and paint it white.
	var canvas = document.createElement("canvas");
	canvas.width = 32;
	canvas.height = 64;
	var context = canvas.getContext("2d");
	context.fillStyle = "#ffffff";
	context.fillRect(0, 0, 32, 64);

	// Draw the window rows - small noise to simulate light variations.
	for (var y = 4 ; y < 64 ; y += 4) {
		for (var x = 0 ; x < 32 ; x += 2) {
			var value = Math.floor(Math.random() * 64);
			context.fillStyle = 'rgb(' + [value, value, value].join(',') + ")";
			context.fillRect(x, y, 2, 1);
		}
	}

	return canvas;
}

var generateNightTextureCanvas = function() {

	// Build a small 32x64 canvas and paint it white.
	var canvas = document.createElement("canvas");
	canvas.width = 32;
	canvas.height = 64;
	var context = canvas.getContext("2d");
	context.fillStyle = "#222222";
	context.fillRect(0, 0, 32, 64);

	// Draw the window rows - small noise to simulate light variations.
	for (var y = 4 ; y < 64 ; y += 4) {
		for (var x = 0 ; x < 32 ; x += 2) {
			var value = Math.floor(Math.random() * 256);
			context.fillStyle = 'rgb(' + [value, value, value/3].join(',') + ")";
			context.fillRect(x, y, 2, 1);
		}
	}

	return canvas;
}