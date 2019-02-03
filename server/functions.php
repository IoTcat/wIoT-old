<?php
include 'config.php';

session_start();

/**global var**/
$jquery=0;


/**functions for html **/

//print a html header
function yimian__header($title="Yimian",$keywords="yimian",$description="Yimian Website")
{

	echo "<!--

   ___     ___
  |\  \    |  |
  \ \  \   |  |
   \ \  \  |  |
    \ \  \_|  |  ___    _____________    ___    _________      _________     
     \ \     /  |\  \  |\   __   __  \  |\  \  |\   ___  \    |\   ___  \ 
      \ \  \/   \ \  \ \ \  \-\  \-\  \ \ \  \ \ \  \--\  \   \ \  \--\  \ 
       \ \  \    \ \  \ \ \  \ \  \ \  \ \ \  \ \ \  \  \  \   \ \  \  \  \
        \ \  \    \ \  \ \ \  \ \  \ \  \ \ \  \ \ \  \__\  \___\ \  \  \  \ 
         \ \__\    \ \__\ \ \__\ \__\ \__\ \ \__\ \ \___________\\ \__\  \__\
          \|__|     \|__|  \|__| |__| |__|  \|__|  \|___________| \|__|  |__|

-->
";
	echo "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">
";

	echo "<head>
	<meta charset=\"utf-8\">
    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\">
	<link rel=\"icon\" href=\"https://cdn.yimian.ac.cn/img/logo/logo.ico\" type=\"image/x-icon\"/>
	<title>".$title."</title>
    <meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no\"/>
   	<meta name=\"Keywords\" content=\"".$keywords."\">
	<meta name=\"Description\" content=\"".$description."\">";
}


//jquery install
function js__jquery()
{
	if(!$GLOBALS['jquery'])
	{	
	echo "<!-- Include js Jquery and Pjax -->
<script type=\"text/javascript\" src=\"https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js\"></script>
<script type=\"text/javascript\" src=\"https://cdn.bootcss.com/jquery.pjax/2.0.1/jquery.pjax.js\"></script>";
	$GLOBALS['jquery']=1;
	}
}


function js__device()
{
	echo "
<script src=\"https://cdn.bootcss.com/device.js/0.2.7/device.min.js\"></script>";
}


function css__cleverLogin()
{
	echo "
<link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdn.yimian.ac.cn/clever-login/clever-login_base.css\" />
<link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdn.yimian.ac.cn/clever-login/clever-login_icon.css\" />
<link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdn.yimian.ac.cn/clever-login/clever-login_normal.css\" />
<link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdn.yimian.ac.cn/clever-login/clever-login_reg.css\" />";
}

function css__easyVer()
{
	echo "
<link type=\"text/css\" rel=\"stylesheet\" href=\"https://cdn.yimian.ac.cn/easyVer/easyVer.min.css\">";
}

//mark the end of the html header
function yimian__headerEnd()
{
	js__jquery();
	echo "
<script>console.log('\\n' + ' %c Yimian  %c https://www.yimian.xyz ' + '\\n', 'color: #00FFFF; background: #030307; padding:5px 0;', 'background: #4682B4; padding:5px 0;');</script>
<script>console.log('Thankfully / Proudly include Plugins:'+'\\n');";

if($GLOBALS['jquery']==1)
echo "console.log('\\n' + ' %c jQuery v3.3.1 %c https://jquery.com '+ '\\n', 'color: #fadfa3; background: #030307; padding:5px 0;', 'background: #fadfa3; padding:5px 0;');console.log('\\n' + ' %c jquery-pjax v2.0.1 %c https://github.com/defunkt/jquery-pjax ' + '\\n', 'color: #fadfa3; background: #030307; padding:5px 0;', 'background: #fadfa3; padding:5px 0;');";
	
echo "</script>
<script src=\"https://cdn.yimian.ac.cn/cookie/cookie.js\"></script>
<script src=\"https://pv.sohu.com/cityjson?ie=utf-8\"></script>
<script type=\"text/javascript\">ip=returnCitySN.cip;ipCity=returnCitySN.cname;</script>
<script src=\"https://cdn.yimian.ac.cn/fp/fp.js\"></script>
</head>
	
<body>";
}

function js__easyVer()
{
	echo "
<script type=\"text/javascript\" src=\"https://cdn.yimian.ac.cn/easyVer/easyVer.min.js\"></script>";
}

function js__cleverLogin()
{
	echo "
<script type=\"text/javascript\" src=\"https://cdn.yimian.ac.cn/clever-login/polygonizr.min.js\"></script>
<script type=\"text/javascript\">$('#site-landing').polygonizr();</script>
<script type=\"text/javascript\" src=\"https://cdn.yimian.ac.cn/clever-login/clever-login.min.js\"></script>";
	js__easyVer();
}


function yimian__heartbeat()
{
	echo "
<script>$.post(\"/heartbeat.php\",{\"ip\":ip,\"fp\":fp,\"city\":ipCity})</script>";
}


function yimian__simpleFooter($bodyEnd=0)
{
	
	if(!$bodyEnd) echo "
</body>";
	yimian__heartbeat();
		echo "
</html>";
	
		
}

//print a html footer
function yimian__footer($wordColor="#C7C7C7",$backgroundColor="#2B2B2B",$urlColor="#87CEEB")
{
	echo "	<style>/*footer theme*/footer{padding:1.5rem 1rem;color:".$wordColor.";font-size:1.2rem;line-height:1.4;text-align:center;background:".$backgroundColor.";border-top:1px solid #C7C7C7}a.footera:link{color: ".$urlColor." ; text-decoration:none;}a.footera:visited {color:#79CDCD}</style>
	<script>function openwin(){window.open(\"https://cn.yimian.xyz\");}</script>
	<footer class=\"footer\">Copyright © 2019.<a class=\"footera\" onclick=\"openwin()\" href=\"#\">Yimian LIU</a> All rights reserved.</footer>";
	yimian__heartbeat();
	echo "</body>
</html>";
}


/**added functions**/
//get millis time stamp
function millis() {
list($msec, $sec) = explode(' ', microtime());
return $msectime = (float)sprintf('%.0f', (floatval($msec) + floatval($sec)) * 1000);
}



/**database connection**/

//connect to database
function db__connect($servername="",$username="",$password="",$dbname="")
{
	/* reset */
	if($servername=="") $servername=$GLOBALS['g_db_serverName'];
	if($username=="") $username=$GLOBALS['g_db_usrName'];
	if($password=="") $password=$GLOBALS['g_db_psswd'];
	if($dbname=="") $dbname=$GLOBALS['g_db_dbName'];
	
	$conn = new mysqli($servername, $username, $password, $dbname);

	if ($conn->connect_error) 
	{
		die("Mysql Connect Failed: " . $conn->connect_error);
	} 

	return ($conn);
}

//get table row number::(data_cnnct var,table name) ::(row number)
function db__rowNum($conn,$table,$clmnName="",$value="",$clmnName2="",$value2="")
{
	
	$table=db__antisql($table);
	$clmnName=db__antisql($clmnName);
	$value=db__antisql($value);
	$clmnName2=db__antisql($clmnName2);
	$value2=db__antisql($value2);
	
	
	if($clmnName=="") $sql = "SELECT COUNT(*) FROM $table";
	elseif($clmnName2=="") $sql = "SELECT COUNT(*) FROM $table where $clmnName='$value'";
	else $sql = "SELECT COUNT(*) FROM $table where $clmnName='$value' AND $clmnName2='$value2'";
	
	$row_count = $conn->query($sql);   
	list($row_num) = $row_count->fetch_row(); 
	return ($row_num);
}

//get row data from database::(data_cnnct var, table name,column name, column value)::(row info)
function db__getData($conn,$table,$clmnName="",$value="",$clmnName2="",$value2="")
{
	
	$table=db__antisql($table);
	$clmnName=db__antisql($clmnName);
	$value=db__antisql($value);
	$clmnName2=db__antisql($clmnName2);
	$value2=db__antisql($value2);
		

	if($clmnName=="") $sql = "SELECT * FROM $table";
	elseif($clmnName2=="") $sql = "SELECT * FROM $table where $clmnName='$value'";
	else $sql = "SELECT * FROM $table where $clmnName='$value' AND $clmnName2='$value2'";
		
	$result = $conn->query($sql);
	//no data
	if ($result->num_rows > 0) {}else{return 404;}

	$i=0;
	$arr=array();
	while($row = $result->fetch_assoc()) {
		$arr[$i++]=$row;
	}
	return ($arr);
}


//fnct for insert a row to database
function db__insertData($conn,$table,$content)
{	
	$table=db__antisql($table);
	
	$key=array_keys($content);
	
	$key=db__antisql($key);
	
	$sql="insert INTO $table (";
	
	for($i=0;$i<count($key);$i++)
	{
		$sql.="$key[$i]";
		if($i!=count($key)-1) $sql.=", ";
	}
	
	$sql.=") VALUES (";
	
	for($i=0;$i<count($key);$i++)
	{
		$tmp_key=$key[$i];
		$content[$tmp_key]=db__antisql($content[$tmp_key]);
		$sql.="'$content[$tmp_key]'";
		if($i!=count($key)-1) $sql.=", ";
	}
	
	$sql.=")";
	
	if (!($conn->query($sql) === TRUE))  echo "SQL Insert Error: " . $sql . "<br>" . $conn->error;

}


//fnct for update a row to database without check
function db__updateData($conn,$table,$content,$index)
{	
	$key=array_keys($content);
	$key=db__antisql($key);
	
	$sql="UPDATE $table SET ";
	
	for($i=0;$i<count($key);$i++)
	{
		$tmp_key=$key[$i];
		$content[$tmp_key]=db__antisql($content[$tmp_key]);
		$sql.="$key[$i]='$content[$tmp_key]'";
		if($i!=count($key)-1) $sql.=", ";
	}
	
	$key=array_keys($index);
	$key=db__antisql($key);
	
	$sql.=" WHERE ";
	
	for($i=0;$i<count($key);$i++)
	{
		$tmp_key=$key[$i];
		$index[$tmp_key]=db__antisql($index[$tmp_key]);
		$sql.="$tmp_key='$index[$tmp_key]'";
		if($i!=count($key)-1) $sql.=" AND ";
	}
	
	if (!($conn->query($sql) === TRUE))  echo "SQL Insert Error: " . $sql . "<br>" . $conn->error;

}




//push row data from database::(data_cnnct var, table name,column name, column value)::(row info)
function db__pushData($conn,$table,$content,$index="",$is_force=1)
{
	if($index)
	{
		$index_keys=array_keys($index);

		if(count($index_keys)==1) $result=db__rowNum($conn,$table,$index_keys[0],$index[$index_keys[0]]); 
			
		elseif(count($index_keys)==2)	$result=db__rowNum($conn,$table,$index_keys[0],$index[$index_keys[0]],$index_keys[1],$index[$index_keys[1]]); 
			
		else return -1;
			
		if($result>0) db__updateData($conn,$table,$content,$index);
		else if($is_force) db__insertData($conn,$table,$content);
			
	}
	else
		db__insertData($conn,$table,$content);
}

//anti sql
function db__antisql($str)
{
	return(str_ireplace("'","",$str));
}


/***tools***/
//fnct of get usr ip::()::(ip)
function getip() 
{
	if (getenv("HTTP_CLIENT_IP") && strcasecmp(getenv("HTTP_CLIENT_IP"), "unknown")) 
	{
		$ip = getenv("HTTP_CLIENT_IP");
	} 
	else
		if (getenv("HTTP_X_FORWARDED_FOR") && strcasecmp(getenv("HTTP_X_FORWARDED_FOR"), "unknown")) 
		{
			$ip = getenv("HTTP_X_FORWARDED_FOR");
		}
		else
			if (getenv("REMOTE_ADDR") && strcasecmp(getenv("REMOTE_ADDR"), "unknown")) 
			{
				$ip = getenv("REMOTE_ADDR");
			} 
			else
				if (isset ($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] && strcasecmp($_SERVER['REMOTE_ADDR'], "unknown")) 
				{
					$ip = $_SERVER['REMOTE_ADDR'];
				} 
				else 
				{
					$ip = "unknown";
				}
return ($ip);
}

/**functions for aplayer**/

//put this function to where you want the aplayer to dispaly
function aplayer__element()
{
	echo "<div id=\"aplayer\" class=\"aplayer\"></div>";
}
	
	
//this should put at the near the need of a body,
//the js object name is ap.
function aplayer__setup()
{
	echo "<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/aplayer@1.10/dist/APlayer.min.css\">
<script src=\"https://cdn.jsdelivr.net/npm/aplayer@1.10/dist/APlayer.min.js\"></script>";
	echo "<script src=\"https://cdn.yimian.ac.cn/aplayer/setup.js\"></script>";
}


//this should put at the near the need of a body,
//the js object name is ap.
function aplayer__setup_mini()
{
	echo "<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/aplayer@1.10/dist/APlayer.min.css\">
<script src=\"https://cdn.jsdelivr.net/npm/aplayer@1.10/dist/APlayer.min.js\"></script>";
	echo "<script src=\"https://cdn.yimian.ac.cn/aplayer/setup_mini.js\"></script>";
}

//the should put behind the setup function
function aplayer__add($name="",$artist="unknown",$url="",$coverurl="",$lrcurl="",$theme="#ebd0c2")
{
	echo "<script>//script for adding a new music to aplayer
	ap.list.add([{
    name: '".$name."',
    artist: '".$artist."',
    url: '".$url."',
    cover: '".$coverurl."',
    lrc: '".$lrcurl."',
    theme: '".$theme."'
}]);
</script>";
}

//play a netease playlist
function aplayer__netease($playlistid="2012006204",$loadStart=0,$numLimit=10,$theme="#ebd0c2")
{
	if(!$GLOBALS['jquery']) js__jquery();
	echo "<script>
	var nameList=new Array();
	var artistList=new Array();
	var urlList=new Array();
	var coverList=new Array();
	var lrcList=new Array();
	var themeList=new Array();
	$.ajax({
        type: \"GET\",
        url: 'https://api.bzqll.com/music/netease/songList',
        data: { \"key\": 579621905,
			  	\"id\": $playlistid,
				\"limit\": $numLimit},
        traditional: true,
        dataType: 'json',
        success: function (msg) {
		   for(var i=$loadStart;i<Math.min(msg.data.songListCount,$numLimit);i++)
		   {
		   		ap.list.add([{
				name: msg.data.songs[i].name,
				artist: msg.data.songs[i].singer,
				url: msg.data.songs[i].url,
				cover: msg.data.songs[i].pic,
				lrc: msg.data.songs[i].lrc,
				theme: '$theme'
				}]);
				
				nameList[i-$loadStart]=msg.data.songs[i].name;
				artistList[i-$loadStart]=msg.data.songs[i].singer;
				urlList[i-$loadStart]=msg.data.songs[i].url;
				coverList[i-$loadStart]=msg.data.songs[i].pic;
				lrcList[i-$loadStart]=msg.data.songs[i].lrc;
				themeList[i-$loadStart]='$theme';
		   }
        }
    });
	</script>";
	
}




/**functions for dplayer**/

//put this function to where you want the dplayer to dispaly
function dplayer__element()
{
	echo "<div id=\"dplayer\"></div>";
}
	
	
//this should put at the near the need of a body,
//the js object name is dp.
function dplayer__setup()
{
	echo "<script src=\"https://pv.sohu.com/cityjson?ie=utf-8\"></script>
";
	echo "<link rel=\"stylesheet\" href=\"https://cn.yimian.xyz/etc/dplayer/DPlayer.min.css\">
<script src=\"https://cn.yimian.xyz/etc/dplayer/DPlayer.min.js\"></script>";
	echo "<script type=\"text/javascript\" src=\"/etc/dplayer/setup.js\"></script>
";
echo "<script src=\"https://pv.sohu.com/cityjson?ie=utf-8\"></script>";
}

	
//this should put at the near the need of a body,
//the js object name is dp.
function dplayer__setup_once($id)
{
	echo "<script src=\"https://pv.sohu.com/cityjson?ie=utf-8\"></script>
<script src=\"https://cdn.bootcss.com/hls.js/0.10.1/hls.min.js\"></script>
";
	echo "<link rel=\"stylesheet\" href=\"https://cn.yimian.xyz/etc/dplayer/DPlayer.min.css\">
<script src=\"https://cn.yimian.xyz/etc/dplayer/DPlayer.min.js\"></script>";
	echo "<script type=\"text/javascript\">//script for set up the dplayer
//global var for storing current video info
var g_vId=$id;
</script>
<script src=\"/etc/dplayer/setup_once.js\"></script>
";
echo "<script src=\"https://pv.sohu.com/cityjson?ie=utf-8\"></script>";
}

//this should put behind the setup function
function dplayer__add($id="234")
{
	echo "<script>//script for adding a new video to aplayer
newVideo('$id');
</script>";
}




/****API******/


//fnct for dogecloud API
function api__dogecloud($platform,$vcode,$ip,$AccessKey,$SecretKey){
	
	$url="https://api.dogecloud.com/video/streams.json?platform=$platform&vcode=$vcode&ip=$ip";
	
	$str="/video/streams.json?platform=$platform&vcode=$vcode&ip=$ip"."\n";

	$str  = hash_hmac("sha1", $str, $SecretKey);
	
    $headerArray =array("Host:api.dogecloud.com","Authorization: TOKEN ".$AccessKey.":".$str);
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, TRUE); 
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, TRUE); 
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch,CURLOPT_HTTPHEADER,$headerArray);
    $output = curl_exec($ch);
	if($errno = curl_errno($ch)) {
    	$error_message = curl_strerror($errno);
		echo "cURL error ({$errno}):\n {$error_message}";
	}

    curl_close($ch);
	
    return $output;
}



/****Yimian Video*******/

function video__bodyUp()
{
	if(!isset($_REQUEST['_pjax'])) 
	{
		yimian__header("Yimian Video","video,Yimian","This is the page for showing video class.");

		echo "<link rel=\"stylesheet\" type=\"text/css\" href=\"https://cn.yimian.xyz/video/css/bootstrap.css\">
<link rel=\"stylesheet\" href=\"https://cn.yimian.xyz/video/css/style.css\">";
		

		yimian__headerEnd();


		echo file_get_contents("https://cn.yimian.xyz/video/body_up.html");
	}
}


function video__bodyDown()
{
	if(!isset($_REQUEST['_pjax'])) 
	{
		echo file_get_contents("https://cn.yimian.xyz/video/body_down.html");
		yimian__simpleFooter();
	}
}

