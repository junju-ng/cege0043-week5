
//create global variables httpPortNumber and httpsPortNumber
var httpPortNumber;
var httpsPortNumber;

function getPort(){
	var xhr = new XMLHttpRequest();
	// listener for when there is an XMLHttpRequest
	xhr.addEventListener("load", function() {
		var parser = new DOMParser();
		var doc = parser.parseFromString(xhr.responseText, "application/xml");
		// get httpPortNumber in port.xml file
		httpPortNumber = doc.getElementsByTagName("node-port-http").item(0).textContent;
		httpsPortNumber = doc.getElementsByTagName("node-port-https").item(0).textContent;
		
		alert("Port: " + httpPortNumber); // alert that will output port number
		trackAndCircle();
		startFormDataLoad();
	});
	
	// depending on whether we are in a browser or on a phone
	// the location of the config file is different
	// if we are on a phone then http and https won't be present
	var configLocation = "res/port.xml";
	xhr.open("get", configLocation, true);
	xhr.send();
}
