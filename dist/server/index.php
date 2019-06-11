<?php
include './functions.php';

yimian__header("Yimian Home","This is a sample page for Yimian Home","Home, Yimian");
yimian__headerEnd();
?>
<h4>参考温度：<span id="temp"></span> &nbsp;&nbsp;&nbsp;&nbsp;参考亮度：<span id="Ls"></span></h4>
<h4>换热器水流量：<span id="wF1"></span></h4>
<h4>太阳能水流量：<span id="wF2"></span></h4>
<h4><span id="tW"></span><br/><button id="isAuto" onClick="auto()"></button>&nbsp;&nbsp;<button id="reset" onClick="reset()">重置</button></h4>
<h4>水流系统状态：<span id="wS"></span>&nbsp;&nbsp;&nbsp;&nbsp;<button id="isAdd" onClick="manual()"></button></h4>
<h4>灯系统状态：<span id="lS"></span></h4>
<h4>客厅人数：<span id="lP"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button onClick="openDoor()">戳我开门</button></h4>
<h4>餐厅人数：<span id="dP"></span></h4>
<h4>厨房人数：<span id="kP"></span></h4>
<h4>走廊人数：<span id="hP"></span></h4>
<h4><a href="./fix_l.php">人数有错？戳这里~</a>&nbsp;&nbsp;&nbsp;&nbsp;神经网络成长度：<span id="dl"></span>%</h4>

<h4><a href="http://cloud.home.yimian.xyz">点击进入家庭云盘</a>&nbsp;&nbsp;&nbsp;&nbsp;☜ 你想要的都在这里</h4>

<script>

var wAddStatus = 1;
var wAutoStatus = 0;

function action()
{	
	$.post("./data.php",function(msg){
		msg = eval('(' + msg + ')');
	
		$('#wF1').html(msg.wF1+' L');
		$('#wF2').html(msg.wF2+' L');
		$('#dl').html(msg.dl);
		$('#wS').html(msg.wS);
		$('#lS').html(msg.lS);
		$('#tW').html(msg.tW+"H");
		$('#temp').html(msg.temp+" ℃ ");
		$('#Ls').html(msg.Ls2+" ");
		$('#lP').html(msg.lP+' 人');
		$('#dP').html(msg.dP+' 人');
		$('#kP').html(msg.kP+' 人');
		$('#hP').html(msg.hP+' 人');

		if(msg.wAddStatus == '1'){
			wAddStatus = 0;
			$('#isAdd').text("手动停止加水");
		}else{
			wAddStatus = 1;
			$('#isAdd').text("手动开始加水");
		}
		
		if(msg.wAutoStatus == '1'){
			wAutoStatus = 0;
			$('#isAuto').text("切换到手动模式");
		}else{
			wAutoStatus = 1;
			$('#isAuto').text("切换到自动模式");
	
		}

		if(msg.tW<3) {$("#btn").hide();$('#btn').attr('disabled',"true");}
		else {$("#btn").show();$('#btn').removeAttr("disabled");}
	});
}
	
setInterval("action()",500);

function openDoor()
{
	$.post("./openDoor.php");
}
	
	
function shower()
{
	$.post("./shower.php");
}
	
function addWater()
{
	$.post("./addWater.php");
}

function reset(){

	$.post("./reset.php?key=15");
}

function manual(){

	$.post("./addWater.php?key=15&cmd=" + wAddStatus);
}
function auto(){

	$.post("./auto.php?key=15&cmd=" + wAutoStatus);
}
</script>
<?php
yimian__footer();