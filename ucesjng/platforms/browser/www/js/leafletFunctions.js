var client;
var earthquakes;
function addPointLinePoly(){
	alert("This will add a point, line and polygon.");
	
	// add a point
	L.marker([51.5, -0.09]).addTo(mymap)
	.bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();
			
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


