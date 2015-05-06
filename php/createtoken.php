<?php 
	header('Access-Control-Allow-Origin: *'); 
	include_once "FirebaseToken.php";


	$uid = "custom:".$_POST['uid'];
	$level = $_POST['level'];

	$tokenGen = new Services_FirebaseTokenGenerator("<enter your firebase secretkey here>");
	$token = $tokenGen->createToken(array("uid" => $uid, "level" => $level), array("admin" => False));

	echo $token;
?>