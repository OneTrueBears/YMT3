var canvas1 = document.getElementById("sliderCanvas");
var sliderCtx = canvas1.getContext("2d");
var sliderWrapper = document.getElementById("sliderWrapper");
sliderCtx.canvas.height = window.innerHeight;
sliderCtx.canvas.width = sliderWrapper.offsetWidth;

var canvas2 = document.getElementById("mapCanvas");
var mapCtx = canvas2.getContext("2d");
mapCtx.canvas.width = window.innerWidth;
mapCtx.canvas.height = window.innerHeight;
mapCtx.canvas.x = 0;
mapCtx.canvas.y = 0;

var canvas3 = document.getElementById("gridCanvas");
var gridCtx = canvas3.getContext("2d");
gridCtx.canvas.width = window.innerWidth;
gridCtx.canvas.height = window.innerHeight;
gridCtx.canvas.x = 0;
gridCtx.canvas.y = 0;

var map = document.getElementById("mapWrapper");

var mapImage = document.getElementById("map");
console.log(document.getElementById("map").getBoundingClientRect().height);

sliderCtx.font = "15px Arial";
sliderCtx.fillStyle = "white";
mapCtx.font = "15px Arial";

var maxAltitude = 10000;
var minAltitude = 0;
var totalAltitude = maxAltitude - minAltitude;

var quantity = 10;
var partition = window.innerHeight/quantity;
partition = (window.innerHeight - partition)/quantity;
var mappedAltitude = (totalAltitude)/(window.innerHeight-(partition*2));

//scrubby zoom. scale determines how far off the zooming is from starting value (1). This value is crucial for most other features.
var scale = 1;
var panning = false;
var xoff = 0;
var yoff = 0;
//var xoff = (window.innerWidth/2)*-1;
//var yoff = (window.innerHeight/2)*-1;
var previousYoff = 0;
var start = {x: 0, y: 0};

console.log("(Map) " + "Height: " + mapCtx.canvas.height + " - " + "Width: " + mapCtx.canvas.width, "x: " + mapCtx.canvas.x + " - y: " + mapCtx.canvas.y);
console.log("(Map) " + "Height: " + mapImage.height + " - " + "Width: " + mapImage.width, "x: " + mapImage.x + " - y: " + mapImage.y);

var mapHeight = map.style.height * scale;
var sliderArticleContainer = document.getElementById("sliderArticleContainer");
var articles = getArticles();
calculateAltitudes();

var starmap = document.getElementById("starmap");

var aboutButton = document.getElementById("aboutBtn");
aboutButton.onclick = gotoStarMap;

var audio = new Audio('sounds/Mountain_01.mp3');
audio.loop = true;
audio.volume = 0.2;

document.getElementById("muteImage").style.display = "none";

var movement = false;

//checkForStarMapGo();

setTransform();


function logoSequence(){
	document.getElementById("logoGif").style.opacity = 1;
	document.getElementById("logoGif").style.display = "block";
	setTimeout(loadPage, 2000);
}

function loadPage(){
	document.getElementById("logoGif").style.opacity = 0;
	setTimeout(function () {
       document.getElementById("logoGif").style.display = "none";
	}, 1000);
	document.getElementById("container").style.opacity = 1;
}

//Calculate and write the altitudes associated with the mountain. 
function calculateAltitudes(){
	mapHeight = mapImage.height * scale;
	var mapRatio = (totalAltitude)/(mapHeight);
	var screenOccupationPercentage = (window.innerHeight-partition*2)/mapHeight;
	sliderCtx.clearRect(0, 0, canvas1.width, canvas1.height);
	for(position = 1; position<=quantity; position++){
		var float = (totalAltitude + yoff*mapRatio - partition*mapRatio) - (position-1)*(((mapHeight*screenOccupationPercentage)*mapRatio)/(quantity-1)) + position*3;
		var number = Math.trunc(float);
		sliderCtx.fillStyle = "rgb(255, 255, 255)";
		if((number < 12000)&&(number > -2500)){
			sliderCtx.fillText(number.toString(), (canvas1.width/2)-16, partition*position);
		}
	}
	scaleArticles();
}

function getArticles(){
	var articles = document.getElementsByClassName("articleTag");
	return articles;
}

function mapAltitudeToScreen(number){
	window.innerHeight/mapHeight;
	return altitudePosition;
}

function scaleArticles(){
	for(var article = 0; article < articles.length; article++){
		articles[article].style.fontSize = (25/scale).toString() + "px";
	}
}

function write(newText, x, y){
	mapCtx.fillText(newText, x, y);
}

function updateSliderGradient(){
	slider.style.transform = "translate(" + "5%" + yoff + "px) scale(" + scale + ")";
	slider.style.top = (-(window.innerHeight/4) + yoff + "px");
	slider.style.height = ((150*scale).toString() + "vw");
	//sliderArticleContainer.style.transform = "translate(" + "5%" + yoff + "px) scale(" + scale + ")";
	sliderArticleContainer.style.top = (yoff + "px");
	sliderArticleContainer.style.height = ((100*scale).toString() + "vw");
	//sliderArticleContainer.style.height = ((document.getElementById("map").getBoundingClientRect().height).toString() + "px");
	//console.log((window.innerHeight*scale).toString() + "px");
}

//call transformation
function setTransform(){
	setTimeout(function () {
		movement = true;
		map.style.transform = "translate(" + xoff + "px, " + yoff + "px) scale(" + scale + ")";
		calculateAltitudes();
		updateSliderGradient();
		//checkForStarMapGo();
	}, 0);
	//movement = false;
	/*map.style.transform = "translate(" + xoff + "px, " + yoff + "px) scale(" + scale + ")";
	calculateAltitudes();
	updateSliderGradient();
	checkForStarMap();*/
}

map.onmousedown = function(e){
	e.preventDefault();
	start = {x: e.clientX - xoff, y: e.clientY - yoff};    
	panning = true;
}

//check for mouse-hover
map.onmouseup = function(e){
	panning = false;
}

map.onmousemove = function(e){
	e.preventDefault();         
	if (!panning) {
		return;
	}
	xoff = (e.clientX - start.x);
	yoff = (e.clientY - start.y);
	map.style.transitionDuration = "0s";
	slider.style.transitionDuration = "0s";
	//console.log("x: " + xoff);
	//console.log("y: " + yoff);
	setTransform();
}

//check for touch
map.ontouchstart = function(e){
	e.preventDefault();
	start = {x: e.clientX - xoff, y: e.clientY - yoff};    
	panning = true;
}

map.ontouchend = function(e){
	map.style.transitionDuration = "0.3s";
	panning = false;
}

map.ontouchmove = function(e){
	e.preventDefault();         
	if (!panning) {
		return;
	}
	xoff = (e.clientX - start.x);
	yoff = (e.clientY - start.y);
	map.style.transitionDuration = "0s";
	slider.style.transitionDuration = "0s";
	setTransform();
}

map.onwheel = function(e){
	e.preventDefault();
	//take the scale into account with the offset
	if((scale <= 5)&&(scale >= 0.3)){
		var xs = (e.clientX - xoff) / scale,
		ys = (e.clientY - yoff) / scale,
		delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);

		// get scroll direction & set zoom level
		(delta > 0) ? (scale *= 1.2) : (scale /= 1.2);
		
		if(scale < 0.5){
			scale = 0.5;
		}
		if(scale > 5){
			scale = 5;
		}
		
		// reverse the offset amount with the new scale
		xoff = e.clientX - xs * scale;
		yoff = e.clientY - ys * scale;
		
		map.style.transitionDuration = "0.3s";
		slider.style.transitionDuration = "0.3s";
		setTransform();
	}      
}

function gotoStarMap(){
	aboutButton.onclick = exitStarMap;
	aboutButton.textContent = "Map";
	starmap.style.opacity = "1";
	//starmap.style.display = "block";
	map.style.transitionDuration = "1s";
	slider.style.transitionDuration = "1s";
	previousYoff = yoff;
	yoff = window.innerHeight;
	setTransform();
}

function exitStarMap(){
	aboutButton.onclick = gotoStarMap;
	aboutButton.textContent = "About";
	map.style.transitionDuration = "1s";
	slider.style.transitionDuration = "1s";
	starmap.style.opacity = "0";
	//starmap.style.display = "none";
	yoff = previousYoff;
	setTransform();
}

function mute(){
	audio.pause();
	document.getElementById("muteImage").style.display = "none";
	document.getElementById("unmuteImage").style.display = "block";
}

function unmute(){
	audio.play();
	document.getElementById("unmuteImage").style.display = "none";
	document.getElementById("muteImage").style.display = "block";
}

function checkForStarMapGo(){
	setTimeout(function(){
		
		if(movement){
			clearInterval();
		}
	}, 4000);
	gotoStarMap()
	console.log(movement);
	checkForStarMapGo();
}