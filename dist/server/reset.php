<?php

if($_REQUEST['key'] != '15') die();
$myfile = fopen("./node/config/reset.txt", "w") or die("Unable to open file!");
$txt = '1'
fwrite($myfile, $txt);
fclose($myfile);
