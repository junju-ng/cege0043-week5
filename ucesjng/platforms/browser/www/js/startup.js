function trackAndCircle(){
	trackLocation();
	addPointLinePoly();
	//getEarthquakes();
}

function quizStartup(){
	alert('Starting quiz');
	document.addEventListener('DOMContentLoaded',function(){
		getPort();
		loadW3HTML();
		trackLocation(); // function to automatically track user's location
	},false);
}

// function to process the html
function loadW3HTML(){
	w3.includeHTML();
}

// add Point/Line/Circle data and track location automatically - useful for setting up different startup functions!
function startup(){
	document.addEventListener('DOMContentLoaded',function(){
		getPort();
		loadW3HTML();
	},false);
}