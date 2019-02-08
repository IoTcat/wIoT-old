/*include ws*/
const WebSocket = require('ws');
/*include jquery*/
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const {document} = (new JSDOM('<!doctype html><html><body></body></html>')).window;
global.document = document;
const window = document.defaultView;
const $ = require('jquery')(window);

var fs = require("fs");
var wF1 = fs.readFileSync('waterFlow1.txt');

var cnt_open_w1=0;
var cnt_send_w1=0;
var cnt_recv_w1=0;

function rec_w1(obj)
{
	w1CtlObj=obj;
	wF1=obj.waterFlow;
	//console.log('Client received a message',w1CtlObj);
	let fd = fs.openSync('waterFlow1.txt','w');

	fs.writeFileSync(fd, wF1);

	fs.closeSync(fd);
	console.log(obj.waterFlow);
	$.post("http://127.0.0.1/water.php",obj,function(msg){console.log(msg)});
	cnt_recv_w1++;
}

var socket_w1 = new WebSocket('ws://192.168.3.101:81');
socket_open_w1();
socket_w1.onmessage = function(event) {
var obj = eval('(' + event.data + ')');
if(obj.wIoT == 1) {
	if(obj.waterFlow<10) {obj.waterFlow=wF1;socket_w1.send('{"wIoT":'+wF1+'}');}
	rec_w1(obj);
	}
};

function socket_open_w1(){
	if(socket_w1.readyState ==3 ){
		socket_w1 = new WebSocket('ws://192.168.3.101:81');
		socket_w1.onopen = function(event) {}
		socket_w1.onmessage = function(event) {
cnt_recv_w1=cnt_send_w1;
//console.log('Client received a message',event.data);
var obj = eval('(' + event.data + ')');
if(obj.wIoT == 1) {
	rec_w1(obj);
	}
};
	}
	else{
		socket_w1.onopen = function(event) {}
	}
	cnt_open_w1++;//console.log('cnt_open_w1 ',cnt_open_w1);
	setTimeout(socket_open_w1,15000);
}
function w1CtlData(){
	if(socket_w1.readyState ==1)
	{
		if(cnt_send_w1>cnt_recv_w1+30)
			socket_open_w1();
		else
		{
			socket_w1.send('{"wIoT":'+wF1+'}');
			cnt_send_w1++;//console.log('cnt_send_w1 ',cnt_send_w1);
		}
	}
	else
	{console.log('waiting connection');cnt_open_w1++;}
	if(cnt_send_w1>800||cnt_open_w1>1000) socket_w1.close();

};
// 监听Socket的关闭
socket_w1.onclose = function(event) {
console.log('Client notified socket has closed');
socket_open_w1();
};

setInterval(w1CtlData,4000);
