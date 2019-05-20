<?php
include './functions.php';

yimian__header("Yimian Home","This is a sample page for Yimian Home","Home, Yimian");
yimian__headerEnd();
?>
<h4>参考温度：<span id="temp"></span> &nbsp;&nbsp;&nbsp;&nbsp;参考亮度：<span id="Ls"></span></h4>
<h4>换热器用水：<span id="wF1"></span></h4>
<h4>太阳能用水：<span id="wF2"></span></h4>
<h4>本次太阳能用水：<span id="tW"></span>&nbsp;&nbsp;&nbsp;&nbsp;<!--<button onClick="shower()">开始洗澡</button>--></h4>
<h4>水流系统状态：<span id="wS"></span>&nbsp;&nbsp;&nbsp;&nbsp;<!--<button id="btn" onClick="addWater()">开始加水</button>--></h4>
<h4>灯系统状态：<span id="lS"></span></h4>
<h4>客厅人数：<span id="lP"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button onClick="openDoor()">戳我开门</button></h4>
<h4>餐厅人数：<span id="dP"></span></h4>
<h4>厨房人数：<span id="kP"></span></h4>
<h4>走廊人数：<span id="hP"></span></h4>
<h4><a href="./fix_l.php">人数有错？戳这里~</a>&nbsp;&nbsp;&nbsp;&nbsp;神经网络成长度：<span id="dl"></span>%</h4>

<h4><a href="http://cloud.home.yimian.xyz">点击进入家庭云盘</a>&nbsp;&nbsp;&nbsp;&nbsp;☜ 你想要的都在这里</h4>

<script>

function action()
{	
	$.post("./data.php",function(msg){
		msg = eval('(' + msg + ')');
	
		$('#wF1').html(msg.wF1+' L');
		$('#wF2').html(msg.wF2+' L');
		$('#dl').html(msg.dl);
		$('#wS').html(msg.wS);
		$('#lS').html(msg.lS);
		$('#tW').html(msg.tW+" L");
		$('#temp').html(msg.temp+" ℃ ");
		$('#Ls').html(msg.Ls2+" ");
		$('#lP').html(msg.lP+' 人');
		$('#dP').html(msg.dP+' 人');
		$('#kP').html(msg.kP+' 人');
		$('#hP').html(msg.hP+' 人');
		
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

</script>
<?php
yimian__footer();