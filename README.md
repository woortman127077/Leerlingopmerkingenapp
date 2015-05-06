# Leerlingopmerkingenapp
Webapp for storing remarks about pupils (Javascript, jQuery, Firebase)

Install:
- Enter your firebase database url in js/opmerkingform.js
- Enter the secret token of your firebase app in php/createtoken.php
- Upload the entire php directory to a secure (https) php server
- Enter the url of that location in the createToken function in js/opmerkingform.js
- Deploy the rest (without the php-directory) to your firebase app location