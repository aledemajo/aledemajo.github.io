var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 10; // position of the camera on the Z axis ?

var animate = function () {

	requestAnimationFrame(animate);

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	cube.material.color.setHex('0x' + randomHexColor());

	renderer.render(scene, camera);
};


function randomHexColor() {
	return Math.floor(Math.random()*16777215).toString(16);
}

async function run() {
	animate();
}

run();