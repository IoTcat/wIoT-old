<?php
include './functions.php';

yimian__header("Yimian Home","This is a sample page for Yimian Home","Home, Yimian");
yimian__headerEnd();
?>

<h4>换热器用水：<span id="wF1"></span></h4>
<h4>太阳能用水：<span id="wF2"></span></h4>
<h4>水流系统状态：<span id="wS"></span></h4>
<h4>灯系统状态：<span id="lS"></span></h4>
<h4>客厅人数：<span id="lP"></span></h4>
<h4>餐厅人数：<span id="dP"></span></h4>
<h4>厨房人数：<span id="kP"></span></h4>
<h4>走廊人数：<span id="hP"></span></h4>
<h4><a href="./fix_l.php">人数有错？戳这里~</a></h4>

<script>
function action()
{	
	$.post("./data.php",function(msg){
		msg = eval('(' + msg + ')');
	
		$('#wF1').html(msg.wF1+' L');
		$('#wF2').html(msg.wF2+' L');
		$('#wS').html(msg.wS);
		$('#lS').html(msg.lS);
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