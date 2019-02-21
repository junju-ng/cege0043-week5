function trackAndCircle(){
	trackLocation();
	addPointLinePoly();
	getEarthquakes();

}

// add Point/Line/Circle data and track location automatically - useful for setting up different startup functions!
function startup(){
	document.addEventListener('DOMContentLoaded',function(){
		trackAndCircle();
	},false);
}