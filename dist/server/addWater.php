<?php
$myfile = fopen("is_add_water.txt", "w") or die("Unable to open file!");
$txt = "1";
fwrite($myfile, $txt);
fclose($myfile);
$myfile = fopen("topW_end.txt", "w") or die("Unable to open file!");
$txt = file_get_contents("./waterFlow2.txt");
fwrite($myfile, $txt);
fclose($myfile);
