<?php
	$url="http://192.168.3.102:81";

	$headerArray =array("GET ws://192.168.3.102:81/ HTTP/1.1","Host: 192.168.3.102:81","Connection: Upgrade","Pragma: no-cache","Cache-Control: no-cache","User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36","Upgrade: websocket","Origin: http://www.blue-zero.com","Sec-WebSocket-Version: 13","Accept-Encoding: gzip, deflate","Accept-Language: zh,zh-TW;q=0.9,en;q=0.8,zh-CN;q=0.7","Sec-WebSocket-Key: +IR3db7vH9rKu6rCSTd/LA==","Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits","{\"wIoT\":\"\"}");
	
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE); 
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch,CURLOPT_HTTPHEADER,$headerArray);
    echo curl_exec($ch);
	curl_close($ch);