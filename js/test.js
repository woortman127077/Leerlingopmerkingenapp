$(document).ready(function runScript(){  

	var usersRef = new Firebase("https://torrid-inferno-6428.firebaseio.com/loapp_users");
	// Authenticate users with a custom Firebase token
	var userRef = usersRef.child('BAAJ');
	// Attach an asynchronous callback to read the data at our user reference
	userRef.once("value", 
		function getHandler(snapshot) {
			if (snapshot.val().password == '7916') {
			    alert("Maak token");
				// createToken(user);
				// ref.authWithCustomToken(token, authHandler); veplaatst naar creatToken .done callback
			} else {
				alert("Gebruikersnaam en code komen niet overeen");
				// ref.unauth();
			}
		},
		function errorHandler(errorObject) {
			alert("Ophalen van gebruikersgegevens is mislukt: " + errorObject.code);
		}
	);

});

