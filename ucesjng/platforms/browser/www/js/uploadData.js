function startDataUpload(){
	var name = document.getElementById("name").value; // get name
	var surname = document.getElementById("surname").value; // get surname
	var module = document.getElementById("module").value; //get module
	// create postString with name surname and module
	var postString = "name=" + name + "&surname=" + surname + "&module=" + module;
	
	// get checkbox values - separate with a | so they can be split later on if needed
	var checkString = "";
	for (var i=1; i<5; i++){
		if (document.getElementById("check"+i).checked === true){
			checkString = checkString + document.getElementById("check"+i).value + "||"
		}
	}
		postString = postString + "&moduleslist=" + checkString;
	
	// get radio button values
	if (document.getElementById("morning").checked){
		postString = postString + "&lecturetime=morning";
	}
	if (document.getElementById("afternoon").checked){
		postString = postString + "&lecturetime=afternoon";
	}
	
	// get select box values
	var language = document.getElementById("languageselectbox").value;
	postString = postString + "&language=" + language;
	
	// get coordinates
	var latitude = document.getElementById("latitude").value;
	var longitude = document.getElementById("longitude").value;
	postString = postString + "&latitude=" + latitude + "&longitude=" + longitude;
	
	processData(postString); //call processData so it actually runs
	
}


var client; // global variable to hold AJAX request

// create AJAX request
function processData(postString){
	client = new XMLHttpRequest();
	client.open('POST','http://developer.cege.ucl.ac.uk:30296/reflectData',true);
	client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	client.onreadystatechange = dataUploaded;
	client.send(postString);
}

// create code to wait for response from server and process response once it is received
function dataUploaded(){
	// function listens for server to say data is readyState
	if (client.readyState === 4){
		// change data upload result DIV to show response
		document.getElementById("dataUploadResult").innerHTML = client.responseText;
	}
}

