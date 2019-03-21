<?php
include './functions.php';

yimian__header("Yimian Home","This is a sample page for Yimian Home","Home, Yimian");

yimian__headerEnd();
?>
<h4>参考温度：<span id="temp"></span> &nbsp;&nbsp;&nbsp;&nbsp;参考亮度：<span id="Ls"></span></h4>
<h4>换热器用水：<span id="wF1"></span></h4>
<h4>太阳能用水：<span id="wF2"></span></h4>
<h4>本次太阳能用水：<span id="tW"></span>&nbsp;&nbsp;&nbsp;&nbsp;</h4>
<h4>水流系统状态：<span id="wS"></span>&nbsp;&nbsp;&nbsp;&nbsp;</h4>
<h4>灯系统状态：<span id="lS"></span></h4>
<h4>客厅人数：<span id="lP"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h4>
<h4>餐厅人数：<span id="dP"></span></h4>
<h4>厨房人数：<span id="kP"></span></h4>
<h4>走廊人数：<span id="hP"></span></h4>
<p><a href="./chart.php">切换到图表界面</a></p>

<h4><font color="red">注：以上仅是一个示例界面，所示数据已经过处理，不代表真实数据！</font></h4>


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

	});
}
	
setInterval("action()",500);
</script>
<?php
yimian__footer();
