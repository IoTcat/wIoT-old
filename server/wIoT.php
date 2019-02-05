<?php
header('Access-Control-Allow-Origin:*');
include './functions.php';

$mode2=$_REQUEST['mode2'];
$mode5=$_REQUEST['mode5'];
$mode6=$_REQUEST['mode6'];

$ice2=$_REQUEST['ice2'];
$ice5=$_REQUEST['ice5'];

$L1=$_REQUEST['L1'];
$L2=$_REQUEST['L2'];

$S1=$_REQUEST['S1'];
$S2=$_REQUEST['S2'];

$T=$_REQUEST['T'];
$To=$_REQUEST['To'];

$R1=$_REQUEST['R1'];
$R2=$_REQUEST['R2'];
$R3=$_REQUEST['R3'];
$R4=$_REQUEST['R4'];
$R5=$_REQUEST['R5'];
$R6=$_REQUEST['R6'];
$R7=$_REQUEST['R7'];
$R8=$_REQUEST['R8'];
$R9=$_REQUEST['R9'];
$R10=$_REQUEST['R10'];
$R11=$_REQUEST['R11'];
$R12=$_REQUEST['R12'];

$ll1=$_REQUEST['ll1'];
$ll2=$_REQUEST['ll2'];
$ll3=$_REQUEST['ll3'];

$Ls1=$_REQUEST['Ls1'];
$Ls2=$_REQUEST['Ls2'];

$B1=$_REQUEST['B1'];
$B2=$_REQUEST['B2'];

$Sh1=$_REQUEST['Sh1'];

$Tp1=$_REQUEST['Tp1'];

$conn=db__connect();

db__pushData($conn,"wIoT_Data",array("time"=>millis(),"mode2"=>$mode2,"mode5"=>$mode5,"mode6"=>$mode6,"ice2"=>$ice2,"ice5"=>$ice5,"L1"=>$L1,"L2"=>$L2,"S1"=>$S1,"S2"=>$S2,"T"=>$T,"Top"=>$To,"R1"=>$R1,"R2"=>$R2,"R3"=>$R3,"R4"=>$R4,"R5"=>$R5,"R6"=>$R6,"R7"=>$R7,"R8"=>$R8,"R9"=>$R9,"R10"=>$R10,"R11"=>$R11,"R12"=>$R12,"ll1"=>$ll1,"ll2"=>$ll2,"ll3"=>$ll3,"Ls1"=>$Ls1,"Ls2"=>$Ls2,"B1"=>$B1,"B2"=>$B2,"Sh1"=>$Sh1,"Tp1"=>$Tp1));

