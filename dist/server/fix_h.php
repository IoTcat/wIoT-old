<?php
include 'functions.php';

yimian__header("Yimian Home");
yimian__headerEnd();

$l=$_REQUEST['l'];
$d=$_REQUEST['d'];
$k=$_REQUEST['k'];

db__pushData(db__connect(),"People_learning",array("time"=>millis(),"l"=>$l,"d"=>$d,"k"=>$k));
header("Location: http://home.yimian.xyz");
yimian__footer();