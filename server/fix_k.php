<?php
include 'functions.php';

yimian__header("Yimian Home");
yimian__headerEnd();

$l=$_REQUEST['l'];
$d=$_REQUEST['d'];
?>

<h3>厨房人数</h3>
<br/>
<button onclick="window.location.href='./fix_h.php?l=<?php echo $l;?>&d=<?php echo $d;?>&k=0'">0 人</button>
<button onclick="window.location.href='./fix_h.php?l=<?php echo $l;?>&d=<?php echo $d;?>&k=1'">1 人</button>
<button onclick="window.location.href='./fix_h.php?l=<?php echo $l;?>&d=<?php echo $d;?>&k=2'">2 人</button>
<button onclick="window.location.href='./fix_h.php?l=<?php echo $l;?>&d=<?php echo $d;?>&k=3'">3 人</button>
<button onclick="window.location.href='./fix_h.php?l=<?php echo $l;?>&d=<?php echo $d;?>&k=4'">4 人</button>

<br/>
<br/>
<br/>
<br/>
<?php
yimian__footer();