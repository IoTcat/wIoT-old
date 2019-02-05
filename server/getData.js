/*include ws*/
const WebSocket = require('ws');
/*include jquery*/
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const {document} = (new JSDOM('<!doctype html><html><body></body></html>')).window;
global.document = document;
const window = document.defaultView;
const $ = require('jquery')(window);


var hallCtlObj = new Object;
var livingRmSnsrObj = new Object;
var livingRmCtlObj = new Object;


var cnt_open_hall=0;
var cnt_send_hall=0;
var cnt_recv_hall=0;

function rec_hall(obj)
{
	hallCtlObj=obj;
	console.log('Client received a message',hallCtlObj);
	//$.post("http://127.0.0.1/wIoT.php",obj,function(msg){console.log(msg)});
	cnt_recv_hall++;
}

var socket_hall = new WebSocket('ws://192.168.3.102:81');
socket_open_hall();
socket_hall.onmessage = function(event) {
var obj = eval('(' + event.data + ')');
if(obj.wIoT == 1) {
	rec_hall(obj);
	}
};

function socket_open_hall(){
	if(socket_hall.readyState ==3 ){
		socket_hall = new WebSocket('ws://192.168.3.102:81');
		socket_hall.onopen = function(event) {}
		socket_hall.onmessage = function(event) {
cnt_recv_hall=cnt_send_hall;
console.log('Client received a message',event.data);
var obj = eval('(' + event.data + ')');
if(obj.wIoT == 1) {
	rec_hall(obj);
	}
};
	}
	else{
		socket_hall.onopen = function(event) {}
	}
	cnt_open_hall++;console.log('cnt_open_hall ',cnt_open_hall);
	setTimeout(socket_open_hall,15000);
}
function hallCtlData(){
	if(socket_hall.readyState ==1)
	{
		if(cnt_send_hall>cnt_recv_hall+30)
			socket_open_hall();
		else
		{
			socket_hall.send('{"wIoT":}');
			cnt_send_hall++;console.log('cnt_send_hall ',cnt_send_hall);
		}
	}
	else
	{console.log('waiting connection');cnt_open_hall++;}
	if(cnt_send_hall>800||cnt_open_hall>1000) socket_hall.close();

};
// 监听Socket的关闭
socket_hall.onclose = function(event) {
console.log('Client notified socket has closed');
socket_open_hall();
};

setInterval(hallCtlData,400);





var cnt_open_ls=0;
var cnt_send_ls=0;
var cnt_recv_ls=0;

function rec_ls(obj)
{
	livingRmSnsrObj=obj;
	console.log('Client received a message',livingRmSnsrObj);
	//$.post("http://127.0.0.1/wIoT.php",obj,function(msg){console.log(msg)});
	cnt_recv_ls++;
}

var socket_ls = new WebSocket('ws://192.168.3.106:81');
socket_open_ls();
socket_ls.onmessage = function(event) {
var obj = eval('(' + event.data + ')');
if(obj.wIoT == 1) {
	rec_ls(obj);
	}
};

function socket_open_ls(){
	if(socket_ls.readyState ==3 ){
		socket_ls = new WebSocket('ws://192.168.3.106:81');
		socket_ls.onopen = function(event) {}
		socket_ls.onmessage = function(event) {
cnt_recv_ls=cnt_send_ls;
console.log('Client received a message',event.data);
var obj = eval('(' + event.data + ')');
if(obj.wIoT == 1) {
	rec_ls(obj);
	}
};
	}
	else{
		socket_ls.onopen = function(event) {}
	}
	cnt_open_ls++;console.log('cnt_open_ls ',cnt_open_ls);
	setTimeout(socket_open_ls,15000);
}
function lsCtlData(){
	if(socket_ls.readyState ==1)
	{
		if(cnt_send_ls>cnt_recv_ls+30)
			socket_open_ls();
		else
		{
			socket_ls.send('{"wIoT":}');
			cnt_send_ls++;console.log('cnt_send_ls ',cnt_send_ls);
		}
	}
	else
	{console.log('waiting connection');cnt_open_ls++;}
	if(cnt_send_ls>800||cnt_open_ls>1000) socket_ls.close();

};
// 监听Socket的关闭
socket_ls.onclose = function(event) {
console.log('Client notified socket has closed');
socket_open_ls();
};

setInterval(lsCtlData,400);




var cnt_open_lc=0;
var cnt_send_lc=0;
var cnt_recv_lc=0;

function rec_lc(obj)
{
	livingRmCtlObj=obj;
	console.log('Client received a message',livingRmCtlObj);
	//$.post("http://127.0.0.1/wIoT.php",obj,function(msg){console.log(msg)});
	cnt_recv_lc++;
}

var socket_lc = new WebSocket('ws://192.168.3.105:81');
socket_open_lc();
socket_lc.onmessage = function(event) {
var obj = eval('(' + event.data + ')');
if(obj.wIoT == 1) {
	rec_lc(obj);
	}
};

function socket_open_lc(){
	if(socket_lc.readyState ==3 ){
		socket_lc = new WebSocket('ws://192.168.3.105:81');
		socket_lc.onopen = function(event) {}
		socket_lc.onmessage = function(event) {
cnt_recv_lc=cnt_send_lc;
console.log('Client received a message',event.data);
var obj = eval('(' + event.data + ')');
if(obj.wIoT == 1) {
	rec_lc(obj);
	}
};
	}
	else{
		socket_lc.onopen = function(event) {}
	}
	cnt_open_lc++;console.log('cnt_open_lc ',cnt_open_lc);
	setTimeout(socket_open_lc,15000);
}
function lcCtlData(){
	if(socket_lc.readyState ==1)
	{
		if(cnt_send_lc>cnt_recv_lc+30)
			socket_open_lc();
		else
		{
			socket_lc.send('{"wIoT":}');
			cnt_send_lc++;console.log('cnt_send_lc ',cnt_send_lc);
		}
	}
	else
	{console.log('waiting connection');cnt_open_lc++;}
	if(cnt_send_lc>800||cnt_open_lc>1000) socket_lc.close();

};
// 监听Socket的关闭
socket_lc.onclose = function(event) {
console.log('Client notified socket has closed');
socket_open_lc();
};

setInterval(lcCtlData,400);

var cnt_livingRmNoPeople=0;
var cnt_hallNoPeople=0;

function log()
{
	var obj=new Object;
	Object.assign(obj, hallCtlObj);
	Object.assign(obj, livingRmSnsrObj);
	Object.assign(obj, livingRmCtlObj);
	console.log(obj);
	$.post("http://127.0.0.1/wIoT.php",obj,function(msg){console.log(msg)});
	if(obj.R5+obj.R6+obj.R7+obj.R9+obj.R10+obj.R11+obj.R12>1&&obj.L2==1) socket_lc.send('{"w-light":1}');
	if(obj.R5+obj.R6+obj.R7+obj.R9+obj.R10+obj.R11+obj.R12==0) cnt_livingRmNoPeople++;
	else cnt_livingRmNoPeople=0;
	if(cnt_livingRmNoPeople>1000) {socket_lc.send('{"w-light":0}');cnt_livingRmNoPeople=0;}
	
	if(obj.R1+obj.R2+obj.R3+obj.R5>1&&obj.L1==0) socket_hall.send('{"w-light":1}');
	if(obj.R1+obj.R2+obj.R3+obj.R4+obj.R5==0) cnt_hallNoPeople++;
	else cnt_hallNoPeople=0;
	if(cnt_hallNoPeople>40) 
	{
		socket_hall.send('{"w-light":0}');
		cnt_hallNoPeople=0;
	}
}

setInterval(log,500);
