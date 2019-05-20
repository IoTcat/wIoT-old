<?php
include 'functions.php';

yimian__header("Yimian Home");
yimian__headerEnd();

$l=$_REQUEST['l'];
?>

<h3>餐厅人数</h3>
<br/>
<button onclick="window.location.href='./fix_k.php?l=<?php echo $l;?>&d=0'">0 人</button>
<button onclick="window.location.href='./fix_k.php?l=<?php echo $l;?>&d=1'">1 人</button>
<button onclick="window.location.href='./fix_k.php?l=<?php echo $l;?>&d=2'">2 人</button>
<button onclick="window.location.href='./fix_k.php?l=<?php echo $l;?>&d=3'">3 人</button>
<button onclick="window.location.href='./fix_k.php?l=<?php echo $l;?>&d=4'">4 人</button>

<br/>
<br/>
<br/>
<br/>
<?php
yimian__footer();