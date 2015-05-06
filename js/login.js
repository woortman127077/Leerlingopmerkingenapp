$(document).ready(function(){  

	// Monitoring User Authentication State

	// Use the onAuth() method to listen for changes in user authentication state

	// Create a callback which logs the current auth state
	function authDataCallback(authData) {
		if (authData) {
			console.log("User " + authData.uid + " is logged in with " + authData.provider);
			ref.child('loapp_users').child(authData.uid.replace('custom:', '')).update(authData);
		} else {
			console.log("User is logged out");
			$("#loginform").show();
			$("#form").hide();
		}
	}
	// Register the callback to be fired every time auth state changes
	ref = new Firebase("https://torrid-inferno-6428.firebaseio.com");
	ref.onAuth(authDataCallback);

	// LOGIN
	// The code to authenticate a user varies by provider and transport method, but they all have similar signatures and 
	// accept a callback function. Use it to handle errors and process the results of a successful login.

	// Create a callback to handle the result of the authentication
	function authHandler(error, authData) {
	  if (error) {
		console.log("Login Failed!", error);
	  } else {
			console.log("Authenticated successfully with payload:", authData);
			$("#loginform").hide();
			$("#form").show();
	  }
	};

	$("#login").click(
		function() {
		
			var _user = $("#Door").val();
			var _level = "docent";
			var _password = $("#Code").val();
			if(
				_user == "Maak een keuze..." || _user == "" || 
				_password == "" 
				) {
				alert("Selecteer docent en typ jouw toegangscode in.");   	
			} else {

				var usersRef = new Firebase("https://torrid-inferno-6428.firebaseio.com/loapp_users");
				// Authenticate users with a custom Firebase token
				var userRef = usersRef.child(_user);
				var updatedObj = {
					"uid": "custom:"+_user,
					"level": "docent"
				}
				// Attach an asynchronous callback to read the data at our user reference
				userRef.on("value", function(snapshot) {
					if (snapshot.val().password == _password) {
					
						var tokenGenerator = new FirebaseTokenGenerator("HhQ4rZxUmEmV40zdpelTj73qFyxGEEP41Eh8ld7K");
						var token = tokenGenerator.createToken(updatedObj);
		
						ref.authWithCustomToken(token, authHandler);
						} else {
						console.log("Gebruikersnaam en code komen niet overeen");
						ref.unauth();
						}
					}, function (errorObject) {
					  console.log("The read failed: " + errorObject.code);
					});
			}
		}
	);

	
});

