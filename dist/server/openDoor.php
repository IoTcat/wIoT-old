<?php
$myfile = fopen("open_door.txt", "w") or die("Unable to open file!");
$txt = "1";
fwrite($myfile, $txt);
fclose($myfile);