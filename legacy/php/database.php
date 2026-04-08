<?php 
$host ="localhost";
$user = "root";
$password = "";
$database = "library_system";

//this connects to the database 
$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    die("Connection Failed". $conn->connect_error);
}

$conn->set_charset("utf8");
?>