<?php
include './functions.php';

$conn=db__connect();
$learn_count=db__rowNum($conn,"People_learning","d",1);

if(file_get_contents('./wStatus.txt')=="1") $wS="未用水";
if(file_get_contents('./wStatus.txt')=="2") $wS="正在加水";
if(file_get_contents('./wStatus.txt')=="3") $wS="换热器用水";
if(file_get_contents('./wStatus.txt')=="4") $wS="太阳能用水";
if(file_get_contents('./wStatus.txt')=="-1") $wS="主厕系统故障";
if(file_get_contents('./wStatus.txt')=="-2") $wS="副厕系统故障";
if(file_get_contents('./wStatus.txt')=="-3") $wS="主、副厕系统故障";

if(file_get_contents('on_hall.txt')=="1" && file_get_contents('on_kit.txt')==1 && file_get_contents('on_din.txt')==1 && file_get_contents('on_liv.txt')==1 && file_get_contents('on_livS.txt')==1) $lS="正常运行";
else
{
	$lS="";
	if(file_get_contents('on_hall.txt')==0) $lS.="走廊 ";
	if(file_get_contents('on_kit.txt')==0) $lS.="厨房 ";
	if(file_get_contents('on_din.txt')==0) $lS.="餐厅 ";
	if(file_get_contents('on_liv.txt')==0) $lS.="客厅控制 ";
	if(file_get_contents('on_livS.txt')==0) $lS.="客厅传感 ";
	$lS.="故障！";
}

if($lS=="正常运行")
	if(file_get_contents('isLight.txt')==1) $lS="智慧照明开启";
	else $lS="智慧照明已关闭";

$pdata=file_get_contents('pdata.txt');

echo json_encode( array(dl=>$learn_count/100,temp=>file_get_contents('./Tp1.txt'),Ls2=>file_get_contents('./Ls2.txt'),tW=>substr(file_get_contents('./topW.txt'),0,5),wF1=>file_get_contents('./waterFlow1.txt'),wF2=>file_get_contents('./waterFlow2.txt'),wS=>$wS,lS=>$lS,hP=>substr($pdata,0,1),dP=>substr($pdata,1,1),lP=>substr($pdata,2,1),kP=>substr($pdata,3,1)));