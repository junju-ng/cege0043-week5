var client;
var earthquakes;
function addPointLinePoly(){
	alert("This will add a point, line and polygon.");
	
	// add a point
	L.marker([51.524048, -0.139924]).addTo(mymap)
	.bindPopup("<b>This is the Warren Street point.").openPopup();
			
	// add a line
	var myLine = [
    [51.5, -0.07],
    [51.51, -0.08]
	];
	L.polyline(myLine,{color:'green'})
	.addTo(mymap).bindPopup("I am a line.");
	
	// add a circle
	L.circle([51.508, -0.11], 500,{
		color:'red',
		fillColor:'#f03',
		fillOpacity: 0.5
	}).addTo(mymap).bindPopup("I am a circle.");
			
	// add a polygon with 3 end points (i.e. a triangle)
	var myPolygon = L.polygon([
		[51.509, -0.08],
		[51.503, -0.06],
		[51.51,-0.047]
	],{
		color:'red',
		fillColor:'#f03',
		fillOpacity:0.5
	}).addTo(mymap).bindPopup("I am a polygon.");
}


// create the code to get the Earthquakes data using an XMLHttpRequest
function getEarthquakes(){
	alert("This will get all the earthquakes.");
	client = new XMLHttpRequest();
	client.open('GET','https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson');
	client.onreadystatechange = earthquakeResponse;
	client.send()
}

// create the code to wait for the response from the data server, and process the response once it is received
function earthquakeResponse(){
	// this function listens out for the server to say that the data is ready (i.e. has state 4)
	if (client.readyState == 4) {
		//once daata is ready, process the data
		var earthquakedata = client.responseText;
		loadEarthquakelayer(earthquakedata);
	}
}

// define a global variable to hold the layer so we can use it later on
var earthquakelayer;
		
// convert the received data (which is text) into JSON format and add it to the map
function loadEarthquakelayer(earthquakedata){
	// convert text to JSON
	var earthquakejson = JSON.parse(earthquakedata);
	earthquakes = earthquakejson;
			
	// load geoJSON earthquake layer using custom markers
	earthquakelayer = L.geoJSON(earthquakejson,
	{
		// use point to layer to create the points
		pointToLayer: function(feature, latlng){
			// look at properties of GeoJSON file to see EQ magnitude and use different marker depending on magnitude
			if (feature.properties.mag > 1.75){
				return L.marker(latlng, {icon: testMarkerRed}).bindPopup("<b>"+
				feature.properties.place+"</b>");
			}
					
			else { 
			return L.marker(latlng, {icon: testMarkerPink}).bindPopup("<b>"+
				feature.properties.place+"</b>");
			}
		},					
	}).addTo(mymap);
			
	// change the map zoom so that all the data is shown
	mymap.fitBounds(earthquakelayer.getBounds());
}

var xhrFormData; // define global variable to process AJAX request to get formdata
//var allForms;
var formDataLayer; // global variable to hold formdata for later use

// AJAX request function to load formdata
function startFormDataLoad(){
	xhrFormData = new XMLHttpRequest();
	var url = "http://developer.cege.ucl.ac.uk:" + httpPortNumber + "/getFormData/" + httpPortNumber; //get url with non-hardcoded port number
	xhrFormData.open("GET", url, true); // send to server
	xhrFormData.onreadystatechange = processFormData;
	try {
		xhrFormData.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	}
	catch (e) {
		// this only works in internet explorer
	}
	xhrFormData.send();
}

// AJAX request function to load London POI data
function getPOIData(){
	xhrFormData = new XMLHttpRequest();
	var url = "http://developer.cege.ucl.ac.uk:" + httpPortNumber + "/getGeoJSON/london_poi/geom"; //get url with non-hardcoded port number
	xhrFormData.open("GET", url, true); // send to server
	xhrFormData.onreadystatechange = processFormData;
	try {
		xhrFormData.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	}
	catch (e) {
		// this only works in internet explorer
	}
	xhrFormData.send();
}

// AJAX request function to load London highways data
function getHighwaysData(){
	xhrFormData = new XMLHttpRequest();
	var url = "http://developer.cege.ucl.ac.uk:" + httpPortNumber + "/getGeoJSON/london_highway/geom"; //get url with non-hardcoded port number
	xhrFormData.open("GET", url, true); // send to server
	xhrFormData.onreadystatechange = processFormData;
	try {
		xhrFormData.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	}
	catch (e) {
		// this only works in internet explorer
	}
	xhrFormData.send();
}

// AJAX response function
function processFormData(){
	if (xhrFormData.readState < 4){
		console.log('Loading...');
	}
	else if (xhrFormData.readyState === 4) { // 4 = response from server completely loaded
		if (xhrFormData.status > 199 && xhrFormData.status < 300) {
			var formData = xhrFormData.responseText;
			loadFormDataLayer(formData);
		}
	}
}

// convert the received data (which is text) into JSON format and add it to the map
function loadFormDataLayer(formData){
	// convert text to JSON
	var formdatajson = JSON.parse(formData);
	//allForms = formdatajson;
			
	// load geoJSON earthquake layer using custom markers
	formDataLayer = L.geoJSON(formdatajson,
	{
		// use point to layer to create the red points
		pointToLayer: function(feature, latlng){
			// in this case, build an HTML DIV string using values in the data
			var htmlString = "<DIV id='popup'" + feature.properties.id + "><h2>" + feature.properties.name + "</h2><br>";
			htmlString = htmlString + "<h3>" + feature.properties.surname + "</h3><br>";
			htmlString = htmlString + "<input type='radio' name='answer' id='" + feature.properties.id + " 1'/>" + feature.properties.module + "<br>";
			htmlString = htmlString + "<input type='radio' name='answer' id='" + feature.properties.id + " 2'/>" + feature.properties.module + "<br>";
			htmlString = htmlString + "<input type='radio' name='answer' id='" + feature.properties.id + " 3'/>" + feature.properties.module + "<br>";
			htmlString = htmlString + "<input type='radio' name='answer' id='" + feature.properties.id + " 4'/>" + feature.properties.module + "<br>";
			htmlString = htmlString + "<button onclick='checkAnswer(" + feature.properties.id + "); return false;'> Submit Answer</button>";
			
			// include hidden element with the answer (in this case answer in the first choice
			// use feature.properties.correct answer for the assignment
			htmlString = htmlString + "<div id=answer" + feature.properties.id + " hidden>1</div>";
			htmlString = htmlString + "</div>";
			
			return L.marker(latlng, {icon: testMarkerRed}).bindPopup(htmlString);
			}					
	}).addTo(mymap);
			
	// change the map zoom so that all the data is shown
	mymap.fitBounds(formDataLayer.getBounds());
	closestFormPoint(); // get popup for closest point in formDataLayer
}

// process button click in formData popup
// will get it to return data sent here but can use this to submit answers to server in assignment
function checkAnswer(questionID){
	// get answer from the hidden div
	// NB - do this BEFORE you close the pop-up as when you close the pop-up the DIV is destroyed
	var answer = document.getElementById("answer"+questionID).innerHTML;
	var correctAnswer = false;
	var answerSelected = 0;
	// loop through all 4 radio buttons
	for (var i=1; i<5; i++){
		if (document.getElementById(questionID + " " + i).checked){
			answerSelected = 1;
		}
		if ((document.getElementById(questionID+ " " + i).checked) && (i == answer)){
			alert("Well done");
			correctAnswer = true;
		}
	}
	if (correctAnswer === false){
		alert("Better luck next time");
	}
	//close the popup
	mymap.closePopup();
	
	//code to upload the answer to the server would go here
	// call an AJAX routine using the data
	// the answerSelected variable holds the number of the answer that the user picked
}

function closestFormPoint(){
	// take leaflet formdata layer
	// go through each point and measure distance to Warren Street
	// show pop-up of closest point from Warren Street
	var minDistance = 100000000000000000;
	var closestFormPoint = 0;
	// for this example, use latitude/longitude of Warren Street
	// replace with user's location in assignment
	var userlat = 51.524048;
	var userlng = -0.139924;
	formDataLayer.eachLayer(function(layer){
		var distance = calculateDistance(userlat, userlng, layer.getLatLng().lat, layer.getLatLng().lng, 'K');
		if (distance < minDistance){
			minDistance = distance;
			closestFormPoint = layer.feature.properties.id;
		}
	});
	// for this to be a proximity alert, the minDistance must be
	// closer than a given distance - you can check that here using an if statement
	
	// show popup for closest point
	formDataLayer.eachLayer(function(layer){
		if (layer.feature.properties.id == closestFormPoint){
			layer.openPopup();
		}
	});
}
	
// create red test marker
var testMarkerRed = L.AwesomeMarkers.icon({
	icon: 'play',
	markerColor: 'red'
});


// create pink test marker
var testMarkerPink = L.AwesomeMarkers.icon({
	icon: 'play',
	markerColor: 'pink'
});


