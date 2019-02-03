<?php
header('Access-Control-Allow-Origin:*');
include './functions.php';

$L1=$_REQUEST['L1'];
$S1=$_REQUEST['S1'];
$T=$_REQUEST['T'];
$R1=$_REQUEST['R1'];
$R2=$_REQUEST['R2'];
$R3=$_REQUEST['R3'];
$R4=$_REQUEST['R4'];
$l1=$_REQUEST['l1'];

$conn=db__connect();

db__pushData($conn,"hallCtl",array("time"=>millis(),"L"=>$L1,"S"=>$S1,"T"=>$T,"R1"=>$R1,"R2"=>$R2,"R3"=>$R3,"R4"=>$R4,"l1"=>$l1));