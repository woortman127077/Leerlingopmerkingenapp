$(document).ready(function runScript(){  

	switchForm("logout");
	var firebaseurl = "https://torrid-inferno-6428.firebaseio.com";
	var phpserver = "https://computerhuys.nl/llopmapp/php/createtoken.php";
	
	// Monitoring User Authentication State

	// Use the onAuth() method to listen for changes in user authentication state

	// Create a callback which logs the current auth state
	function authDataCallback(authData) {
		if (authData) {
			console.log("User " + authData.uid + " is logged in with " + authData.provider);
			ref.child('loapp_users').child(authData.uid.replace('custom:', '')).update(authData);
			switchForm("login");
		} else {
			console.log("User is logged out");
			switchForm("logout");
		}
	}
	
	// Register the callback to be fired every time auth state changes
	ref = new Firebase(firebaseurl);
	ref.onAuth(authDataCallback);
	ref.onDisconnect(function disconnectHandler() {
		ref.unauth();  // voorkomen dat ie ingelogd blijft
		switchForm();
	});

	// LOGIN
	// The code to authenticate a user varies by provider and transport method, but they all have similar signatures and 
	// accept a callback function. Use it to handle errors and process the results of a successful login.

	// Create a callback to handle the result of the authentication
	function authHandler(error, authData) {
		if (error) {
			console.log("Login Failed!", error);
		} else {
			console.log("Authenticated successfully with payload:", authData);
		}
	};

	function switchForm(log) {
		$("#opmerkingcontainer").hide();
		$("#geenopmerkingcontainer").hide();
		$('#loginForm')[0].reset();
		$('#opmForm')[0].reset();

		if (log == "login") {
			$("#loginForm").hide();
			$("#opmForm").show();
		} else if (log == "logout") {
			$("#opmForm").hide();
			$("#loginForm").show();
		} else {
			$("#loginForm").hide();
			$("#opmForm").hide();
		}
	}
	
	$("#login").click(
		function loginClickHandler() {

			// inputRead:
			    _user = $("#Door").val();
			var _level = "docent";
			var _password = $("#Code").val();
			
			if (inputValidateLogin(_user, _password)) {
				getUser(_user, _password);
			}
			// event.preventDefault();
		}
	);
	
	function inputValidateLogin(user, password) {
		if(
			user == "Maak een keuze..." || user == "" || 
			password == "" 
			) {
			alert("Selecteer docent en typ jouw toegangscode in");
			return false;
		} else {
			return true;
		}
	};

	function getUser(user, password) {
		var users_fburl = firebaseurl + "/loapp_users";
		var usersRef = new Firebase(users_fburl);
		// Authenticate users with a custom Firebase token
		var userRef = usersRef.child(user);
		// Attach an asynchronous callback to read the data at our user reference
		userRef.once("value", 
			function getHandler(snapshot) {
				if (snapshot.val().password == password) {
					createToken(user);
					// ref.authWithCustomToken(token, authHandler); veplaatst naar creatToken .done callback
				} else {
					alert("Gebruikersnaam en code komen niet overeen");
					ref.unauth();
				}
			},
			function errorHandler(errorObject) {
				alert("Ophalen van gebruikersgegevens is mislukt: " + errorObject.code);
			}
		);
	}
	
	// bron: http://stackoverflow.com/questions/16834138/javascript-function-post-and-call-php-script
	
	function createToken(user) {
		$.post(phpserver, {uid: user, level: 'docent'}).done(doneCallback).error(function(error){
				alert("Create token mislukt: "+error);
			});
	};
	
	function doneCallback(token) {
		ref.authWithCustomToken(token, authHandler);
	}
	/*
	function createToken(user) {
		var tokenGenerator = new FirebaseTokenGenerator("HhQ4rZxUmEmV40zdpelTj73qFyxGEEP41Eh8ld7K");
		var updatedObj = {
			"uid": "custom:"+user,
			"level": "docent"
		}
		return tokenGenerator.createToken(updatedObj);
	};
	*/
	
	$("#logout").click(
		function logoutClickHandler() {
			ref.unauth();           // dit triggert authDataCallback met authData = null
			// ref.offAuth(authDataCallback); // dat is dubbelop, is al geregistreerd bij ref.onAuth()!
			// event.preventDefault();
		}
	);	

	$("#Leerling").change(function changeHandler(){
		$("#Opmerking").val("");
		$("#Bestanden").val("");
		$(this).css("background-color", "lightblue");
		var leerlingNummer = this.value.substring(0,6).trim();
		

		if (this.value !== "Maak een keuze..." && 
			this.value !== "5H:" &&
			this.value !== "6V:") {
			getOpmerkingen(leerlingNummer);
		} else {
			$("#opmerkingcontainer").hide();
			$("#geenopmerkingcontainer").hide();
			$("#opmtablebody").html("");
		}
	});

	$("#submit").click(function submitClickHandler(){
		var _leerling = $("#Leerling").val();
		var _opmerking = $("#Opmerking").val();
		var _bestanden = $("#Bestanden").val();
		var _user = ref.getAuth().uid.replace("custom:","");
		success = true;

		if (inputValidateOpm(_leerling, _opmerking)) {
			// event.preventDefault();
			var leerlingNummer = updateLeerling(_leerling);
			pushOpmerking(leerlingNummer, _opmerking, _bestanden, _user);
		}
	});

	function inputValidateOpm(leerling, opmerking) {
		if (
			leerling == "Maak een keuze..." || leerling == "" || leerling == "5H:" || leerling == "6V:" || 
			opmerking == "Jouw opmerking over deze leerling..." || opmerking == "" 
			) {											//errorHandler
			alert("Alle velden met * zijn verplicht");  
			return false;
		} else {
			return true;
		}
	}
	
	function updateLeerling(leerling) {
		ref = new Firebase(firebaseurl);
		var leerlingNummer = leerling.substring(0,6).trim();
		var updatedObj = {              
			"naam": leerling.substring(7,33).trim(),
			"klas": leerling.substring(34,38),
			"klaskort": leerling.substring(35,37),
			"leerlingdropdown": leerling};

		ref.child("leerling").child(leerlingNummer).update(updatedObj, function updateHandler(data) {
				if (data) { alert(data); success = false; }
		});	
		return leerlingNummer;
	};
	
	function pushOpmerking(leerlingNummer, opmerking, bestanden, user) {
		ref.child("leerling").child(leerlingNummer).child("opmerkingen").push({
			"opmerking": opmerking,
			"bestanden": bestanden,
			"door": user}, 
			function pushHandler(data) {
				if (data) { alert(data); success = false; }
				if (success) { 
					alert("Bedankt! Jouw opmerking is opgeslagen.");
					$("#Leerling").triggerHandler("change");
					/*
					$('#opmForm')[0].reset(); //To reset form fields
					$("#opmerkingcontainer").hide();
					$("#geenopmerkingcontainer").hide();
					*/
				}
			});
	};
				
	function getOpmerkingen(leerling) {
		leerling_fburl = firebaseurl + "/leerling";
		var leerlingenRef = new Firebase(leerling_fburl);
		var leerlingRef = leerlingenRef.child(leerling).child("opmerkingen");

		leerlingRef.once("value", 
			function getHandler(snapshot) {
				populateOpmContainer(snapshot);
				switchOpmContainer(snapshot);
			}, 
			function errorHandler(errorObject) {
				alert("Ophalen van opmerkingen is mislukt: " + errorObject.code);
			}
		);
	};
	
	function populateOpmContainer(snapshot) {
		$("#opmtablebody").html("");
		snapshot.forEach(function(data) {
			var cel1 = data.val().opmerking;
			var cel2 = data.val().bestanden;
			var cel3 = data.val().door;
			var tr = "<tr><td>"+cel1+"</td><td>"+cel2+"</td><td>"+cel3+"</td></tr>";
			$("#opmtablebody").prepend(tr);    // nieuwste bovenaan zetten met prepend ipv append
		});	
	};
	
	function switchOpmContainer(snapshot) {
		if (!snapshot.exists()) {
			$("#geenopmerkingcontainer").show();
			$("#opmerkingcontainer").hide();
			} else {
			$("#geenopmerkingcontainer").hide();
			$("#opmerkingcontainer").show();
			}	
	};
});

