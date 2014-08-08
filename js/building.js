var createBuilding = function() {
	var geometry = new THREE.CubeGeometry(1.5, 1.5, 1.5);
	
	var material = new THREE.MeshPhongMaterial({
		color: randomFairColor(),
		ambient: 0x808080,
		specular: 0xffffff,
		shininess: 20,
		reflectivity: 5.5 
	});
	
	return new THREE.Mesh(geometry, material);
}