<?php
include 'functions.php';

yimian__header("Yimian Home");
yimian__headerEnd();
?>

<h3>客厅人数</h3>
<br/>
<button onclick="window.location.href='./fix_d.php?l=0'">0 人</button>
<button onclick="window.location.href='./fix_d.php?l=1'">1 人</button>
<button onclick="window.location.href='./fix_d.php?l=2'">2 人</button>
<button onclick="window.location.href='./fix_d.php?l=3'">3 人</button>
<button onclick="window.location.href='./fix_d.php?l=4'">4 人</button>

<br/>
<br/>
<br/>
<br/>
<?php
yimian__footer();