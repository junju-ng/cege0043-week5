var xhrNode; //define global variable to process AJAX request

// AJAX request function
function callDivNodeJSChange(){
	xhrNode = new XMLHttpRequest();
	var url = "http://developer.cege.ucl.ac.uk:" + httpPortNumber; //get url with non-hardcoded port number
	xhrNode.open("GET", url, true); // send to server
	xhrNode.onreadystatechange = processDivNodeJSChange;
	try {
		xhrNode.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	}
	catch (e) {
		// this only works in internet explorer
	}
	xhrNode.send();
}

// AJAX response function
function processDivNodeJSChange(){
	if (xhrNode.readyState < 4) //while waiting for response from server
		document.getElementById('ajaxtext').innerHTML = "Loading...";
	else if (xhrNode.readyState === 4) { // 4 = response from server completely loaded
		if (xhrNode.status > 199 && xhrNode.status < 300) 
			// http status between 200 to 299 are all successful
			document.getElementById('ajaxtext').innerHTML = xhrNode.responseText;
	}
}