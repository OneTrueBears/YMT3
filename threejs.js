var camera, scene, renderer;
var geometry, material, box;

const canvas1 = document.querySelector("#glCanvas");
const gl = canvas1.getContext("webgl");

const canvas2 = document.querySelector("#flatCanvas");
const ctx = canvas2.getContext("2D");

canvas2.width  = window.innerWidth;
canvas2.height = window.innerHeight;

var TwoDBackground = document.getElementById("flatBackground");

init();
animate();

function init(){
	scene = new THREE.Scene();
	
	geometry = new THREE.BoxGeometry();
	material = new THREE.MeshNormalMaterial();
	box = new THREE.Mesh(geometry, material);
	scene.add(box);
	
	var fov = 70;
	var aspect = window.innerWidth/window.innerHeight;
	var near = 0.10;
	var far = 100;
	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.z = 4;
	
	renderer = new THREE.WebGLRenderer({canvas: canvas1, antialas: true});
	//renderer.setSize(window.innerWidth, window.innerHeight);
	//document.body.appendChild(renderer.domElement);
	
}

function animate(){
	requestAnimationFrame(animate);
	autoRotate();
	renderer.render(scene, camera);
}

function autoRotate(){
	box.rotation.x += 0.01;
	box.rotation.y += 0.02;
}

var ThreeDimensional;

var dimensionToggle = document.getElementById("dToggle");
ThreeDimensional = dimensionToggle.checked;
if(!ThreeDimensional){
	canvas1.style.display = "none";
	TwoDBackground.style.display = "block";
}
else{
	TwoDBackground.style.display = "none";
	canvas1.style.display = "block";
}

dimensionToggle.addEventListener("change", function(element){
	ThreeDimensional = dimensionToggle.checked;
	console.log(dimensionToggle.checked);
	if(ThreeDimensional){
		TwoDBackground.style.display = "none";
		canvas1.style.display = "block";
	}
	else{
		canvas1.style.display = "none";
		TwoDBackground.style.display = "block";
	}
});