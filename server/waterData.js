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
var wF2 = fs.readFileSync('waterFlow2.txt');
var topW = parseFloat(fs.readFileSync('topW.txt'));

var w1Obj=new Object;
var w2Obj=new Object;
var fw1Obj=new Object;
var fw2Obj=new Object;

var cnt_open_w1=0;
var cnt_send_w1=0;
var cnt_recv_w1=0;
var change1=0;
var change1_time=0;

var sms_sent=parseFloat(fs.readFileSync('smsTimeout.txt'));

var on_w1=parseInt(fs.readFileSync('on_w1.txt'));
var on_w2=parseInt(fs.readFileSync('on_w2.txt'));




var socket_w1 = new WebSocket('ws://192.168.3.101:81');
function rec_w1(obj)
{
	w1CtlObj=obj;
	wF1=obj.waterFlow1;
	//console.log('Client received a message',w1CtlObj);
	let fd = fs.openSync('waterFlow1.txt','w');

	change1=wF1-fw1Obj.waterFlow1;
	change1_time=Date.parse(new Date());

	fs.writeFileSync(fd, wF1);

	fs.closeSync(fd);
	console.log('w1 '+obj.waterFlow1);
	w1Obj=obj;
	//$.post("http://127.0.0.1/water.php",obj,function(msg){console.log(msg)});
	cnt_recv_w1++;
}

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
	{console.log('waiting connection');cnt_open_w1++;		let fd_i = fs.openSync('on_w1.txt','w');
		fs.writeFileSync(fd_i,'0');
		fs.closeSync(fd_i);}
	if(cnt_send_w1>800||cnt_open_w1>1000) socket_w1.close();

};




function action_w1()
{

let fd_i = fs.openSync('on_w1.txt','w');
fs.writeFileSync(fd_i,'0');
fs.closeSync(fd_i);

socket_open_w1();
socket_w1.onmessage = function(event) {
var obj = eval('(' + event.data + ')');
if(obj.wIoT == 1) {
	if(obj.waterFlow1<10) {obj.waterFlow1=wF1;socket_w1.send('{"wIoT":'+wF1+'}');}
	rec_w1(obj);
	fw1Obj=obj;
		let fd_f = fs.openSync('on_w1.txt','w');
		fs.writeFileSync(fd_f,'1');
		fs.closeSync(fd_f);
	}
};
// 监听Socket的关闭
socket_w1.onclose = function(event) {
console.log('Client notified socket has closed');
socket_open_w1();
};

setInterval(w1CtlData,8000);

socket_w1.onerror = function(e){
		console.log('error_w1 '+e);
		let fd = fs.openSync('on_w1.txt','w');
		fs.writeFileSync(fd,'0');
		fs.closeSync(fd);
	}

}

if(on_w1==1) action_w1();
else setTimeout("action_w1",60000);


var cnt_open_w2=0;
var cnt_send_w2=0;
var cnt_recv_w2=0;
var change2=0;
var change2_time=0;

var socket_w2 = new WebSocket('ws://192.168.3.107:81');
function rec_w2(obj)
{
	w2CtlObj=obj;
	wF2=obj.waterFlow2;
	//console.log('Client received a message',w1CtlObj);
	let fd = fs.openSync('waterFlow2.txt','w');

	fs.writeFileSync(fd, wF2);

	fs.closeSync(fd);

	change2=wF2-fw2Obj.waterFlow2;
	change2_time=Date.parse(new Date());

	console.log('w2 '+obj.waterFlow2);
	w2Obj=obj;
	//$.post("http://127.0.0.1/water.php",obj,function(msg){console.log(msg)});
	cnt_recv_w2++;
}

function socket_open_w2(){
	if(socket_w2.readyState ==3 ){
		socket_w2 = new WebSocket('ws://192.168.3.107:81');
		socket_w2.onopen = function(event) {}
		socket_w2.onmessage = function(event) {
cnt_recv_w2=cnt_send_w2;
//console.log('Client received a message',event.data);
var obj = eval('(' + event.data + ')');
if(obj.wIoT == 1) {
	rec_w2(obj);
	}
};
	}
	else{
		socket_w2.onopen = function(event) {}
	}
	cnt_open_w2++;//console.log('cnt_open_w2 ',cnt_open_w2);
	setTimeout(socket_open_w2,15000);
}
function w2CtlData(){
	if(socket_w2.readyState ==1)
	{
		if(cnt_send_w2>cnt_recv_w2+30)
			socket_open_w2();
		else
		{
			socket_w2.send('{"wIoT":'+wF2+'}');
			cnt_send_w2++;//console.log('cnt_send_w2 ',cnt_send_w2);
		}
	}
	else
	{console.log('waiting connection');cnt_open_w2++;		let fd_i = fs.openSync('on_w1.txt','w');
		fs.writeFileSync(fd_i,'0');
		fs.closeSync(fd_i);}
	if(cnt_send_w2>800||cnt_open_w2>1000) socket_w2.close();

};



function action_w2()
{

let fd_i2 = fs.openSync('on_w2.txt','w');
fs.writeFileSync(fd_i2,'0');
fs.closeSync(fd_i2);

socket_open_w2();
socket_w2.onmessage = function(event) {
var obj = eval('(' + event.data + ')');
if(obj.wIoT == 1) {
	if(obj.waterFlow2<10) {obj.waterFlow2=wF2;socket_w2.send('{"wIoT":'+wF2+'}');}
	rec_w2(obj);
	fw2Obj=obj;

		let fd_f2 = fs.openSync('on_w2.txt','w');
		fs.writeFileSync(fd_f2,'1');
		fs.closeSync(fd_f2);
	}
};
// 监听Socket的关闭
socket_w2.onclose = function(event) {
console.log('Client notified socket has closed');
socket_open_w2();
};

setInterval(w2CtlData,8000);

	socket_w2.onerror = function(e){
		console.log('error_w2 '+e);
		let fd = fs.openSync('on_w2.txt','w');
		fs.writeFileSync(fd,'0');
		fs.closeSync(fd);

	}
}

if(on_w2==1) action_w2();
else setTimeout("action_w2",60000);



function judge_mode(obj)
{
	//加水
	if(obj.waterAdd&&change1&&change2) return 2;

	//用换热器水
	if(obj.waterAdd&&change1&&!change2) return 3;

	//洗澡||旁路加水
	if(obj.waterAdd&&!change1&&change2) return 4;

	//未加水未用水||干路停水
	if(obj.waterAdd&&!change1&&!change2) return 1;

	//洗澡||旁路加水
	if(!obj.waterAdd&&change2) return 4;

	//未开启换热器或太阳能或太阳能未用水
	if(!obj.waterAdd&&!change2) return 1;
}


function record_topWater(obj)
{
	if(isNaN(topW)) topW=0;
	if(!isNaN(change1)&&!isNaN(change2)&&change1_time>Date.parse(new Date())-12000&&change2_time>Date.parse(new Date())-12000&&change1) topW=topW-change2;
	else if(!isNaN(change1)&&!isNaN(change2)&&change1_time>Date.parse(new Date())-12000&&change2_time>Date.parse(new Date())-12000) topW=topW+change2;
	console.log('Client '+topW);
	let fd = fs.openSync('topW.txt','w');

	fs.writeFileSync(fd, topW);

	fs.closeSync(fd);

}


function adjust_topWater(obj)
{
	if(topW>0)  {socket_w1.send('{"btn-on":"tap"}');let fd = fs.openSync('alert.txt','w');fs.writeFileSync(fd, '0');fs.closeSync(fd);}
	if(judge_mode(obj)==2&&topW<=0) {socket_w1.send('{"btn-off":"tap"}');let fd = fs.openSync('alert.txt','w');fs.writeFileSync(fd, '1');fs.closeSync(fd);if(sms_sent<Date.parse(new Date())-12*3600000) {$.post("https://cn.yimian.xyz/msg.php?tel=18888283877&tpl=4");$.post("https://cn.yimian.xyz/msg.php?tel=13371035727&tpl=4");let fd_sms = fs.openSync('smsTimeout.txt','w');fs.writeFileSync(fd_sms, Date.parse(new Date()));fs.closeSync(fd_sms);}}
	if(judge_mode(obj)==1&&topW<=0) topW=topW+0.1;
}


function report()
{
	var obj=new Object;
	Object.assign(obj, w1Obj);
	Object.assign(obj, w2Obj);
	$.post("http://127.0.0.1/water.php",obj,function(msg){console.log(msg)});
	
	if(on_w1==1&&on_w2==1)
	{


	record_topWater(obj);
	adjust_topWater(obj);

	let fd = fs.openSync('wStatus.txt','w');

	fs.writeFileSync(fd, judge_mode(obj));

	fs.closeSync(fd);
	//if(!w1Obj.waterAdd&&change2&&change1==0) socket_w1.send('{"btn-on":"tap"}');
	//if(w1Obj.waterAdd&&change1<change2) socket_w1.send('{"btn-off":"tap"}');
	}
	else
	{
	let fd = fs.openSync('wStatus.txt','w');

	if(on_w1==1)
	fs.writeFileSync(fd, '-2');

	if(on_w2==1)
	fs.writeFileSync(fd, '-1');

	if(!(on_w1||on_w2))
	fs.writeFileSync(fd, '-3');


	fs.closeSync(fd);
	}

	console.log('c '+change1+' '+change2+' '+w1Obj.waterAdd+' '+judge_mode(obj));
}

setInterval(report,8000);



let fd_w1 = fs.openSync('on_w1.txt','w');
fs.writeFileSync(fd_w1,'1');
fs.closeSync(fd_w1);

let fd_w2 = fs.openSync('on_w2.txt','w');
fs.writeFileSync(fd_w2,'1');
fs.closeSync(fd_w2);