/***************
 * Create a car *
 ***************/

var createCar = function(){
    var car;
    var pivot;
    var parent;

    var loader = new THREE.BinaryLoader();
    loader.load('../images/veyron/VeyronNoUv_bin.js', 
    	function(geometry) { 
        var color = new THREE.MeshLambertMaterial( { color: randomFairColor(), opacity: 1.0, transparent: false } ); 
        car = new THREE.Mesh( geometry, color );
        // car.position.z = -50.0;
        console.log(car);
    });

    console.log('return from createCar');
    return car;
} 

function randomFairColor() {
    var min = 64;
    var max = 224;
    var r = (Math.floor(Math.random() * (max - min + 1)) + min) * 65536;
    var g = (Math.floor(Math.random() * (max - min + 1)) + min) * 256;
    var b = (Math.floor(Math.random() * (max - min + 1)) + min);
    return r + g + b;
}