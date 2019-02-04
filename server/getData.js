/*include ws*/
const WebSocket = require('ws');
/*include jquery*/
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const {document} = (new JSDOM('<!doctype html><html><body></body></html>')).window;
global.document = document;
const window = document.defaultView;
const $ = require('jquery')(window);
var cnt_open=0;
var cnt_send=0;
var cnt_recv=0;


function logic(obj)
{
	if(obj.R1+obj.R2+obj.R3+obj.R4>=2&&obj.L1==0)socket.send('{"w-light":1}');
	else if(obj.L1==1&&obj.R1+obj.R2+obj.R3+obj.R4==0)socket.send('{"w-light":0}');
	$.post("http://127.0.0.1/wIoT.php",obj);
	cnt_recv++;
}

var socket = new WebSocket('ws://192.168.3.102:81');
socket_open();
socket.onmessage = function(event) {
console.log('Client received a message',event.data);
var obj = eval('(' + event.data + ')');
if(obj.wIoT == 1) {
	logic(obj);
	}
};

function socket_open(){
	if(socket.readyState ==3 ){
		socket = new WebSocket('ws://192.168.3.102:81');
		socket.onopen = function(event) {}
		socket.onmessage = function(event) {
cnt_recv=cnt_send;
console.log('Client received a message',event.data);
var obj = eval('(' + event.data + ')');
if(obj.wIoT == 1) {
	logic(obj);
	}
};
	}
	else{
		socket.onopen = function(event) {}
	}
	cnt_open++;console.log('cnt_open ',cnt_open);
	setTimeout(socket_open,15000);
}
function hallCtlData(){
	if(socket.readyState ==1)
	{
		if(cnt_send>cnt_recv+30)
			socket_open();
		else
		{
			socket.send('{"wIoT":}');
			cnt_send++;console.log('cnt_send ',cnt_send);
		}
	}
	else
	{console.log('waiting connection');cnt_open++;}
	if(cnt_send>800||cnt_open>1000) socket.close();

};
// 监听Socket的关闭
socket.onclose = function(event) {
console.log('Client notified socket has closed');
socket_open();
};

setInterval(hallCtlData,400);