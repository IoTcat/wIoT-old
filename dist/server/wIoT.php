<?php
header('Access-Control-Allow-Origin:*');
include './functions.php';

$mode2=$_REQUEST['mode2'];
$mode3=$_REQUEST['mode3'];
$mode4=$_REQUEST['mode4'];
$mode5=$_REQUEST['mode5'];
$mode6=$_REQUEST['mode6'];

$ice2=$_REQUEST['ice2'];
$ice3=$_REQUEST['ice3'];
$ice4=$_REQUEST['ice4'];
$ice5=$_REQUEST['ice5'];

$L1=$_REQUEST['L1'];
$L2=$_REQUEST['L2'];
$L3=$_REQUEST['L3'];
$L4=$_REQUEST['L4'];

$S1=$_REQUEST['S1'];
$S2=$_REQUEST['S2'];
$S3=$_REQUEST['S3'];
$S4=$_REQUEST['S4'];

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
$R13=$_REQUEST['R13'];
$R14=$_REQUEST['R14'];
$R15=$_REQUEST['R15'];
$R16=$_REQUEST['R16'];
$R17=$_REQUEST['R17'];
$R18=$_REQUEST['R18'];
$R19=$_REQUEST['R19'];
$R20=$_REQUEST['R20'];

$ll1=$_REQUEST['ll1'];
$ll2=$_REQUEST['ll2'];
$ll3=$_REQUEST['ll3'];
$ll4=$_REQUEST['ll4'];
$ll5=$_REQUEST['ll5'];

$Ls1=$_REQUEST['Ls1'];
$Ls2=$_REQUEST['Ls2'];
$Ls3=$_REQUEST['Ls3'];

$B1=$_REQUEST['B1'];
$B2=$_REQUEST['B2'];

$Sh1=$_REQUEST['Sh1'];

$Tp1=$_REQUEST['Tp1'];

$conn=db__connect();

db__pushData($conn,"wiot_data",array("time"=>millis(),"mode2"=>$mode2,"mode3"=>$mode3,"mode4"=>$mode4,"mode5"=>$mode5,"mode6"=>$mode6,"ice2"=>$ice2,"ice3"=>$ice3,"ice4"=>$ice4,"ice5"=>$ice5,"L1"=>$L1,"L2"=>$L2,"L3"=>$L3,"L4"=>$L4,"S1"=>$S1,"S2"=>$S2,"S3"=>$S3,"S4"=>$S4,"T"=>$T,"Top"=>$To,"R1"=>$R1,"R2"=>$R2,"R3"=>$R3,"R4"=>$R4,"R5"=>$R5,"R6"=>$R6,"R7"=>$R7,"R8"=>$R8,"R9"=>$R9,"R10"=>$R10,"R11"=>$R11,"R12"=>$R12,"R13"=>$R13,"R14"=>$R14,"R15"=>$R15,"R16"=>$R16,"R17"=>$R17,"R18"=>$R18,"R19"=>$R19,"R20"=>$R20,"ll1"=>$ll1,"ll2"=>$ll2,"ll3"=>$ll3,"ll4"=>$ll4,"ll5"=>$ll5,"Ls1"=>$Ls1,"Ls2"=>$Ls2,"Ls3"=>$Ls3,"B1"=>$B1,"B2"=>$B2,"Sh1"=>$Sh1,"Tp1"=>$Tp1));

