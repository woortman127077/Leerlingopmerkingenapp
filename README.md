# Leerlingopmerkingenapp
Webapp for storing remarks about pupils (Javascript, jQuery, Firebase)

Install:
- Enter your firebase database url in js/opmerkingform.js
- Enter the secret token of your firebase app in php/createtoken.php
- Upload the entire php directory to a secure (https) php server
- Enter the url of that location in the createToken function in js/opmerkingform.js
- Deploy the rest (without the php-directory) to your firebase app location

Documentation:
Documentation on design of the app can be found in /docs. 
Included there are 
- UML sequence diagrams that can be viewed directly (.pdf) or opened and edited by sdedit (download is found at http://sdedit.sourceforge.net/download/index.html).
- database design both relational and object oriented. The current implementation is a very simplified version of that design.
