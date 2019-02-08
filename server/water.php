<?php
header('Access-Control-Allow-Origin:*');
include './functions.php';

$waterAdd=$_REQUEST['waterAdd'];
$waterFlow1=$_REQUEST['waterFlow'];

$conn=db__connect();

db__pushData($conn,"waterSys",array("time"=>millis(),"waterAdd"=>$waterAdd,"waterFlow1"=>$waterFlow1));