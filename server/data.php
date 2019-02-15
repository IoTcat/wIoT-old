<?php
include './functions.php';

$conn=db__connect();
$learn_count=db__rowNum($conn,"People_learning","d",1);

if(file_get_contents('./wStatus.txt')=="1") $wS="未用水";
if(file_get_contents('./wStatus.txt')=="2") 
{
	$wS="正在加水 ";
	$wS.=substr(((file_get_contents('./waterFlow2.txt')-file_get_contents('./topW_end.txt'))/(file_get_contents('./topW_end.txt')-file_get_contents('./topW_start.txt')))*100,0,5);
	$wS.="%";
	
}
if(file_get_contents('./wStatus.txt')=="3") $wS="换热器用水";
if(file_get_contents('./wStatus.txt')=="4") $wS="太阳能用水";
if(file_get_contents('./wStatus.txt')=="-1") $wS="主厕系统故障";
if(file_get_contents('./wStatus.txt')=="-2") $wS="副厕系统故障";
if(file_get_contents('./wStatus.txt')=="-3") $wS="主、副厕系统故障";

if(file_get_contents('fon_hall.txt')=="1" && file_get_contents('fon_kit.txt')==1 && file_get_contents('fon_din.txt')==1 && file_get_contents('fon_liv.txt')==1 && file_get_contents('fon_livS.txt')==1) $lS="正常运行";
else
{
	$lS="";
	if(file_get_contents('fon_hall.txt')==0) $lS.="走廊 ";
	if(file_get_contents('fon_kit.txt')==0) $lS.="厨房 ";
	if(file_get_contents('fon_din.txt')==0) $lS.="餐厅 ";
	if(file_get_contents('fon_liv.txt')==0) $lS.="客厅控制 ";
	if(file_get_contents('fon_livS.txt')==0) $lS.="客厅传感 ";
	$lS.="故障！";
}

if($lS=="正常运行")
	if(file_get_contents('isLight.txt')==1) $lS="智慧照明开启";
	else $lS="智慧照明已关闭";

$pdata=file_get_contents('pdata.txt');

$Ls2=file_get_contents('./Ls2.txt');
if($Ls2>814) $Ls2.=" (黑夜)";
elseif($Ls2>700) $Ls2.=" (暗)";
elseif($Ls2>400) $Ls2.=" (还行)";
elseif($Ls2>200) $Ls2.=" (亮)";


echo json_encode( array(dl=>$learn_count/100,temp=>substr(41.2-file_get_contents('./Tp1.txt')/24.75,0,4),Ls2=>$Ls2,tW=>(file_get_contents('./is_add_water.txt')==0)?substr((file_get_contents('./waterFlow2.txt')-file_get_contents('./topW_start.txt')),0,5):substr((file_get_contents('./topW_end.txt')-file_get_contents('./topW_start.txt')),0,5),wF1=>file_get_contents('./waterFlow1.txt'),wF2=>file_get_contents('./waterFlow2.txt'),wS=>$wS,lS=>$lS,hP=>substr($pdata,0,1),dP=>substr($pdata,1,1),lP=>substr($pdata,2,1),kP=>substr($pdata,3,1)));