/*include ws*/
const WebSocket = require('ws');

/*include jquery*/
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const {document} = (new JSDOM('<!doctype html><html><body></body></html>')).window;
global.document = document;
const window = document.defaultView;
const $ = require('jquery')(window);






/* overall var */

var hallCtlObj = new Object;
var livingRmSnsrObj = new Object;
var livingRmCtlObj = new Object;
var dinnerRmCtlObj = new Object;
var kitchenCtlObj = new Object;

var fs = require("fs");
var pdata = fs.readFileSync('pdata.txt');
var pHal=parseInt(pdata.slice(0,1));
var pDin=parseInt(pdata.slice(1,2));
var pLiv=parseInt(pdata.slice(2,3));
var pKit=parseInt(pdata.slice(3,4));

var cnt_livingRmNoPeople = parseInt(fs.readFileSync('cnt_livingRmNoPeople.txt'));
var cnt_dinnerRmNoPeople = parseInt(fs.readFileSync('cnt_dinnerRmNoPeople.txt'));





var on_hall=parseInt(fs.readFileSync('on_hall.txt'));
var on_livS=parseInt(fs.readFileSync('on_livS.txt'));
var on_liv=parseInt(fs.readFileSync('on_liv.txt'));
var on_din=parseInt(fs.readFileSync('on_din.txt'));
var on_kit=parseInt(fs.readFileSync('on_kit.txt'));




/* hall var */

var cnt_open_hall=0;
var cnt_send_hall=0;
var cnt_recv_hall=0;

function rec_hall(obj)
{
	hallCtlObj=obj;
	//console.log('Client received a message',hallCtlObj);
	//$.post("http://127.0.0.1/wIoT.php",obj,function(msg){console.log(msg)});
	cnt_recv_hall++;
}

function socket_open_hall(){
	if(socket_hall.readyState ==3 ){
		socket_hall = new WebSocket('ws://192.168.3.102:81');
		socket_hall.onopen = function(event) {}
		socket_hall.onmessage = function(event) {
cnt_recv_hall=cnt_send_hall;
//console.log('Client received a message',event.data);
var obj = eval('(' + event.data + ')');
if(obj.wIoT == 1) {
	rec_hall(obj);
	}
};
	}
	else{
		socket_hall.onopen = function(event) {}
	}
	cnt_open_hall++;//console.log('cnt_open_hall ',cnt_open_hall);
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
			cnt_send_hall++;//console.log('cnt_send_hall ',cnt_send_hall);
		}
	}
	else
	{console.log('waiting connection');cnt_open_hall++;}
	if(cnt_send_hall>800||cnt_open_hall>1000) socket_hall.close();

};

var socket_hall = new WebSocket('ws://192.168.3.102:81');



/* hall ctl */

if(on_hall)
{
	socket_open_hall();
	socket_hall.onmessage = function(event) {
	var obj = eval('(' + event.data + ')');
	if(obj.wIoT == 1) {
		rec_hall(obj);
		}
	};

	// 监听Socket的关闭
	socket_hall.onclose = function(event) {
	console.log('Client notified socket has closed');
	socket_open_hall();
	};

	setInterval(hallCtlData,400);

	socket_hall.onerror = function(e){
		console.log('error_hall '+e);
		let fd = fs.openSync('on_hall.txt','w');
		fs.writeFileSync(fd,'0');
		fs.closeSync(fd);
	}
}



/* livS var */

var cnt_open_ls=0;
var cnt_send_ls=0;
var cnt_recv_ls=0;

function rec_ls(obj)
{
	livingRmSnsrObj=obj;
	//console.log('Client received a message',livingRmSnsrObj);
	//$.post("http://127.0.0.1/wIoT.php",obj,function(msg){console.log(msg)});
	cnt_recv_ls++;
}

function socket_open_ls(){
	if(socket_ls.readyState ==3 ){
		socket_ls = new WebSocket('ws://192.168.3.106:81');
		socket_ls.onopen = function(event) {}
		socket_ls.onmessage = function(event) {
cnt_recv_ls=cnt_send_ls;
//console.log('Client received a message',event.data);
var obj = eval('(' + event.data + ')');
if(obj.wIoT == 1) {
	rec_ls(obj);
	}
};
	}
	else{
		socket_ls.onopen = function(event) {}
	}
	cnt_open_ls++;//console.log('cnt_open_ls ',cnt_open_ls);
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
			cnt_send_ls++;//console.log('cnt_send_ls ',cnt_send_ls);
		}
	}
	else
	{console.log('waiting connection');cnt_open_ls++;}
	if(cnt_send_ls>800||cnt_open_ls>1000) socket_ls.close();

};



/* livS ctl */
if(on_livS)
{
	var socket_ls = new WebSocket('ws://192.168.3.106:81');
	socket_open_ls();
	socket_ls.onmessage = function(event) {
	var obj = eval('(' + event.data + ')');
	if(obj.wIoT == 1) {
		rec_ls(obj);
		}
	};

	// 监听Socket的关闭
	socket_ls.onclose = function(event) {
	console.log('Client notified socket has closed');
	socket_open_ls();
	};

	setInterval(lsCtlData,400);


	socket_ls.onerror = function(e){
		console.log('error_livS '+e);
		let fd = fs.openSync('on_livS.txt','w');
		fs.writeFileSync(fd,'0');
		fs.closeSync(fd);
	}
}



/* liv var */

var cnt_open_lc=0;
var cnt_send_lc=0;
var cnt_recv_lc=0;

function rec_lc(obj)
{
	livingRmCtlObj=obj;
	//console.log('Client received a message',livingRmCtlObj);
	//$.post("http://127.0.0.1/wIoT.php",obj,function(msg){console.log(msg)});
	cnt_recv_lc++;
}

function socket_open_lc(){
	if(socket_lc.readyState ==3 ){
		socket_lc = new WebSocket('ws://192.168.3.105:81');
		socket_lc.onopen = function(event) {}
		socket_lc.onmessage = function(event) {
cnt_recv_lc=cnt_send_lc;
//console.log('Client received a message',event.data);
var obj = eval('(' + event.data + ')');
if(obj.wIoT == 1) {
	rec_lc(obj);
	}
};
	}
	else{
		socket_lc.onopen = function(event) {}
	}
	cnt_open_lc++;//console.log('cnt_open_lc ',cnt_open_lc);
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
			cnt_send_lc++;//console.log('cnt_send_lc ',cnt_send_lc);
		}
	}
	else
	{console.log('waiting connection');cnt_open_lc++;}
	if(cnt_send_lc>800||cnt_open_lc>1000) socket_lc.close();

};


/* liv ctl */

if(on_liv)
{

	var socket_lc = new WebSocket('ws://192.168.3.105:81');
	socket_open_lc();
	socket_lc.onmessage = function(event) {
	var obj = eval('(' + event.data + ')');
	if(obj.wIoT == 1) {
		rec_lc(obj);
		}
	};

	// 监听Socket的关闭
	socket_lc.onclose = function(event) {
	console.log('Client notified socket has closed');
	socket_open_lc();
	};

	setInterval(lcCtlData,400);

	socket_lc.onerror = function(e){
		console.log('error_liv '+e);
		let fd = fs.openSync('on_liv.txt','w');
		fs.writeFileSync(fd,'0');
		fs.closeSync(fd);
	}
}



/* din var */

var cnt_open_dc=0;
var cnt_send_dc=0;
var cnt_recv_dc=0;

function rec_dc(obj)
{
	dinnerRmCtlObj=obj;
	//console.log('Client received a message',dinnerRmCtlObj);
	//$.post("http://127.0.0.1/wIoT.php",obj,function(msg){console.log(msg)});
	cnt_recv_dc++;
}

function socket_open_dc(){
	if(socket_dc.readyState ==3 ){
		socket_dc = new WebSocket('ws://192.168.3.103:81');
		socket_dc.onopen = function(event) {}
		socket_dc.onmessage = function(event) {
cnt_recv_dc=cnt_send_dc;
//console.log('Client received a message',event.data);
var obj = eval('(' + event.data + ')');
if(obj.wIoT == 1) {
	rec_dc(obj);
	}
};
	}
	else{
		socket_dc.onopen = function(event) {}
	}
	cnt_open_dc++;//console.log('cnt_open_dc ',cnt_open_dc);
	setTimeout(socket_open_dc,15000);
}
function dcCtlData(){
	if(socket_dc.readyState ==1)
	{
		if(cnt_send_dc>cnt_recv_dc+30)
			socket_open_dc();
		else
		{
			socket_dc.send('{"wIoT":}');
			cnt_send_dc++;//console.log('cnt_send_dc ',cnt_send_dc);
		}
	}
	else
	{console.log('waiting connection');cnt_open_dc++;}
	if(cnt_send_dc>800||cnt_open_dc>1000) socket_dc.close();

};

/* din ctl */
if(on_din)
{
	var socket_dc = new WebSocket('ws://192.168.3.103:81');
	socket_open_dc();
	socket_dc.onmessage = function(event) {
	var obj = eval('(' + event.data + ')');
	if(obj.wIoT == 1) {
		rec_dc(obj);
		}
	};

	// 监听Socket的关闭
	socket_dc.onclose = function(event) {
	console.log('Client notified socket has closed');
	socket_open_dc();
	};

	setInterval(dcCtlData,400);

	socket_dc.onerror = function(e){
		console.log('error_din '+e);
		let fd = fs.openSync('on_din.txt','w');
		fs.writeFileSync(fd,'0');
		fs.closeSync(fd);
	}
}


/* kit var */

var cnt_open_kc=0;
var cnt_send_kc=0;
var cnt_recv_kc=0;

function rec_kc(obj)
{
	kitchenCtlObj=obj;
	//console.log('Client received a message',kitchenCtlObj);
	//$.post("http://127.0.0.1/wIoT.php",obj,function(msg){console.log(msg)});
	cnt_recv_kc++;
}

function socket_open_kc(){
	if(socket_kc.readyState ==3 ){
		socket_kc = new WebSocket('ws://192.168.3.104:81');
		socket_kc.onopen = function(event) {}
		socket_kc.onmessage = function(event) {
cnt_recv_kc=cnt_send_kc;
//console.log('Client received a message',event.data);
var obj = eval('(' + event.data + ')');
if(obj.wIoT == 1) {
	rec_kc(obj);
	}
};
	}
	else{
		socket_kc.onopen = function(event) {}
	}
	cnt_open_kc++;/*console.log('cnt_open_kc ',cnt_open_kc);*/
	setTimeout(socket_open_kc,15000);
}
function kcCtlData(){
	if(socket_kc.readyState ==1)
	{
		if(cnt_send_kc>cnt_recv_kc+30)
			socket_open_kc();
		else
		{
			socket_kc.send('{"wIoT":}');
			cnt_send_kc++;/*console.log('cnt_send_kc ',cnt_send_kc);*/
		}
	}
	else
	{console.log('waiting connection');cnt_open_kc++;}
	if(cnt_send_kc>800||cnt_open_kc>1000) socket_kc.close();

};


/* kit ctl */

if(on_kit)
{
	var socket_kc = new WebSocket('ws://192.168.3.104:81');
	socket_open_kc();
	socket_kc.onmessage = function(event) {
	var obj = eval('(' + event.data + ')');
	if(obj.wIoT == 1) {
		rec_kc(obj);
		}
	};

	// 监听Socket的关闭
	socket_kc.onclose = function(event) {
	console.log('Client notified socket has closed');
	socket_open_kc();
	};

	setInterval(kcCtlData,400);

	socket_kc.onerror = function(e){
		console.log('error_kit '+e);
		let fd = fs.openSync('on_kit.txt','w');
		fs.writeFileSync(fd,'0');
		fs.closeSync(fd);
	}

}








var cnt_hallNoPeople=0;
var cnt_kitchenNoPeople=0;

function log()
{
	var obj=new Object;
	Object.assign(obj, hallCtlObj);
	Object.assign(obj, livingRmSnsrObj);
	Object.assign(obj, livingRmCtlObj);
	Object.assign(obj, dinnerRmCtlObj);
	Object.assign(obj, kitchenCtlObj);
	//console.log(obj);
	$.post("http://127.0.0.1/wIoT.php",obj,function(msg){console.log(msg)});
	

	if(on_liv)
	{
		if(!l_liv(obj)) cnt_livingRmNoPeople++;
		else cnt_livingRmNoPeople=0;
		if(cnt_livingRmNoPeople>350) {cnt_livingRmNoPeople=0;if(pLiv>0) pLiv--;}

		let fd1 = fs.openSync('cnt_livingRmNoPeople.txt','w');
		fs.writeFileSync(fd1, cnt_livingRmNoPeople);
		fs.closeSync(fd1);
	}

	if(on_hall)
	{
		if(!l_hal(obj)) cnt_hallNoPeople++;
		else cnt_hallNoPeople=0;
		if(cnt_hallNoPeople>100) {cnt_hallNoPeople=0;if(pHal>0) pHal--;}
	}

	if(on_din)
	{
		if(!l_din(obj)) cnt_dinnerRmNoPeople++;
		else cnt_dinnerRmNoPeople=0;
		if(cnt_dinnerRmNoPeople>350) {cnt_dinnerRmNoPeople=0;if(pDin>0) pDin--;}

		let fd2 = fs.openSync('cnt_dinnerRmNoPeople.txt','w');
		fs.writeFileSync(fd2, cnt_dinnerRmNoPeople);
		fs.closeSync(fd2);
	}


	if(on_kit)
	{
		if(!l_kit(obj)) cnt_kitchenNoPeople++;
		else cnt_kitchenNoPeople=0;
		if(cnt_kitchenNoPeople>150) {cnt_kitchenNoPeople=0;if(pKit>0) pKit--;}

	}

	logic(obj);
	console.log(pHal+',,'+pDin+',,'+pLiv+',,'+pKit);

	record_error();
	
	
	let fd = fs.openSync('pdata.txt','w');

	fs.writeFileSync(fd, ''+pHal+''+pDin+''+pLiv+''+pKit);

	fs.closeSync(fd);
	
	if(isLight()) {
		light();
		let fd_l = fs.openSync('isLight.txt','w');
		fs.writeFileSync(fd_l, "1");
		fs.closeSync(fd_l);
	}
	else
	{
		let fd_l = fs.openSync('isLight.txt','w');
		fs.writeFileSync(fd_l, "0");
		fs.closeSync(fd_l);
	}

	if(parseInt(fs.readFileSync('alert.txt'))) socket_lc.send('{"w-alert":1}');
	else socket_lc.send('{"w-alert":0}');


	let fd_Tp1 = fs.openSync('Tp1.txt','w');
	fs.writeFileSync(fd_Tp1,obj.Tp1);
	fs.closeSync(fd_Tp1);

	let fd_Ls2 = fs.openSync('Ls2.txt','w');
	fs.writeFileSync(fd_Ls2,obj.Ls2);
	fs.closeSync(fd_Ls2);

	if(parseInt(fs.readFileSync('open_door.txt'))==1){
	if(socket_hall) socket_hall.send('{"btn-uDoorOpen":1}');
	let fd_ud = fs.openSync('open_door.txt','w');
	fs.writeFileSync(fd_ud,'0');
	fs.closeSync(fd_ud);
	}
	
	fobj=obj;
}

setInterval(log,500);

var lightVal=0;

var lightVal = parseInt(fs.readFileSync('lightVal.txt'));

function isLight()
{
	var d = new Date();

	if((d.getHours()>15||d.getHours()==0)&&livingRmSnsrObj.Ls1) lightVal=1;
	if(d.getHours()==9) lightVal=0;
	if(d.getHours()>=7&&d.getHours()<9&&!livingRmSnsrObj.Ls1) lightVal=0;
	if(d.getHours()==1) lightVal=0;
	if(d.getHours()==1&&d.getMinutes()==1&&d.getSeconds()<10) {if(socket_hall)socket_hall.send('{"w-light":0}');if(socket_dc)socket_dc.send('{"w-light":0}');if(socket_lc)socket_lc.send('{"w-light":0}');if(socket_kc)socket_kc.send('{"w-light":0}');}
	if(d.getHours()==8&&d.getMinutes()==1&&d.getSeconds()<10) {if(socket_hall)socket_hall.send('{"w-light":0}');if(socket_dc)socket_dc.send('{"w-light":0}');if(socket_lc)socket_lc.send('{"w-light":0}');if(socket_kc)socket_kc.send('{"w-light":0}');}
	if(d.getHours()==5) lightVal=1;

	let fd = fs.openSync('lightVal.txt','w');

	fs.writeFileSync(fd, lightVal);

	fs.closeSync(fd);

	if(d.getHours()<1||(d.getHours()>5&&d.getHours()<7)||d.getHours()>17||lightVal==1) return 1;
	else return 0;
}

var fobj = new Object;

var tHal=0;
var fHal=0;
var ftHal=0;

var tDin=0;
var fDin=0;
var ftDin=0;
var iceDoor=0

var tLiv=0;
var fLiv=0;
var ftLiv=0;

var tKit=0;
var fKit=0;
var ftKit=0;

var changeTime=0;
var dchangeTime=0;
var lchangeTime=0;
var kchangeTime=0;

function logic(obj)
{
	// Hall
	if(fHal==0&&l_hal(obj))
	{
		ftHal=tHal;
		tHal=Date.parse(new Date());
		fHal=1;
	}
	else if(!l_hal(obj))
	{
		fHal=0;
	}
	
	// Din
	if(fDin==0&&l_din(obj))
	{
		ftDin=tDin;
		tDin=Date.parse(new Date());console.log('ld');

		fDin=1;
		
		//if(iceDoor==0&&l_newDoor(obj)) {pDin++;iceDoor=1;}
	}
	else if(!l_din(obj))
	{
		fDin=0;
		iceDoor=0;
	}
	

	// Liv
	if(fLiv==0&&l_liv(obj))
	{
		ftLiv=tLiv;
		tLiv=Date.parse(new Date());
		
		fLiv=1;
	}
	else if(!l_din(obj))
	{
		fLiv=0;
	}
	
	// Kit
	if(fKit==0&&l_kit(obj))
	{
		ftKit=tKit;
		tKit=Date.parse(new Date());
		
		fKit=1;
	}
	else if(!l_kit(obj))
	{
		fKit=0;
	}
	
	
	//normal logic
	//d to l
	if((obj.R5&&!fobj.R12&&obj.R12))
	{
		if(pDin>0) pDin--;console.log("dlss");
		pLiv++;
		changeTime=Date.parse(new Date());
		dchangeTime=Date.parse(new Date());
	}
	
	//l to d
	if((obj.R12&&!fobj.R13&&obj.R13))
	{
		if(pLiv>0) pLiv--;console.log('ldss');
		pDin++;
		changeTime=Date.parse(new Date());
		lchangeTime=Date.parse(new Date());
	}
	
	//console.log("kkk",obj.R18,(!fobj.R20),fobj.R20);
	//d to k
	if((obj.R18&&(!fobj.R20)&&obj.R20)&&pKit<3)
	{
		if(pDin>0) pDin--;console.log('dkss');
		pKit++;
		changeTime=Date.parse(new Date());
		dchangeTime=Date.parse(new Date());
	}

	//k to d
	if((obj.R20&&(!fobj.R18)&&obj.R18))
	{
		if(pKit>0) pKit--;console.log('kdss');
		pDin++;
		changeTime=Date.parse(new Date());
		kchangeTime=Date.parse(new Date());
	}
	
	//h to d
	if((obj.R4&&(!fobj.R13)&&obj.R13))
	{
		if(pHal>0) pHal--;
		pDin++;
		changeTime=Date.parse(new Date());

	}
	
	//d to h
	if((obj.R13&&(!fobj.R4)&&obj.R4))
	{
		if(pDin>0) pDin--;
		pHal++;
		changeTime=Date.parse(new Date());
		dchangeTime=Date.parse(new Date());
	}
	
	
	if(pKit>3) pKit=3;
	if(pDin>4) pDin=4;
	if(pLiv>4) pLiv=4;
	
	if(pLiv==0&&(obj.R6||obj.R12||obj.R9||/*obj.R11||*/obj.R7)&&Date.parse(new Date())>changeTime+9000) pLiv=2;
	if(pDin==0&&(obj.R18||/*obj.R8||*/obj.R17)&&Date.parse(new Date())>changeTime+9000) pDin=1;
	if(pKit==0&&l_kit(obj)&&Date.parse(new Date())>changeTime+9000) pKit=1;
	if(pHal==0&&(obj.R4||obj.R1&&obj.R2)&&Date.parse(new Date())>changeTime+9000) pHal=1;
	
	
	
}

function l_hal(obj)
{
	if(obj.R1||obj.R2||obj.R3||obj.R4) return 1;
	else return 0;
}

function l_din(obj)
{
	if(/*obj.R8||*/obj.R13||obj.R14||obj.R15||obj.R16||obj.R17||obj.R18) return 1;
	else return 0;
}
	
function l_liv(obj)
{
	if(obj.R5||obj.R6||obj.R7||obj.R9||obj.R10||/*obj.R11||*/obj.R12) return 1;
	else return 0;
}
	
function l_kit(obj)
{
	if(obj.R19||obj.R20) return 1;
	else return 0;
}
		   
function l_halDir(obj)
{
	if(obj.R1+obj.R2>obj.R3+obj.R4) return 1;
	else return -1;
}
		   
function l_newDoor(obj)
{
	if(/*obj.R8&&*/obj.R14) return 1;
	else return -1;
}

function light()
{
	
	if(on_hall)
		if(pHal>=1) socket_hall.send('{"w-light":1}');
		else if(pHal==0)socket_hall.send('{"w-light":0}');
	
	if(on_din)		
		if(pDin>=1) socket_dc.send('{"w-light":1}');
		else if(pDin==0&&dchangeTime<Date.parse(new Date())-10000)socket_dc.send('{"w-light":0}');

	if(on_liv)
		if(pLiv>=1) socket_lc.send('{"w-light":1}');
		else if(pLiv==0&&lchangeTime<Date.parse(new Date())-10000)socket_lc.send('{"w-light":0}');


	if(on_kit)
		if(pKit>=1) socket_kc.send('{"w-light":1}');
		else if(pKit==0&&kchangeTime<Date.parse(new Date())-10000)socket_kc.send('{"w-light":0}');
}





let fd_livS = fs.openSync('on_livS.txt','w');
fs.writeFileSync(fd_livS,'1');
fs.closeSync(fd_livS);

let fd_hall = fs.openSync('on_hall.txt','w');
fs.writeFileSync(fd_hall,'1');
fs.closeSync(fd_hall);

let fd_liv = fs.openSync('on_liv.txt','w');
fs.writeFileSync(fd_liv,'1');
fs.closeSync(fd_liv);

let fd_din = fs.openSync('on_din.txt','w');
fs.writeFileSync(fd_din,'1');
fs.closeSync(fd_din);

let fd_kit = fs.openSync('on_kit.txt','w');
fs.writeFileSync(fd_kit,'1');
fs.closeSync(fd_kit);


function record_error()
{
if(parseInt(fs.readFileSync('on_livS.txt'))==1&&socket_ls)
{
let ffd_livS = fs.openSync('fon_livS.txt','w');
fs.writeFileSync(ffd_livS,'1');
fs.closeSync(ffd_livS);
}
else
{
let ffd_livS = fs.openSync('fon_livS.txt','w');
fs.writeFileSync(ffd_livS,'0');
fs.closeSync(ffd_livS);
}


if(parseInt(fs.readFileSync('on_hall.txt'))==1&&socket_hall)
{
let ffd_hall = fs.openSync('fon_hall.txt','w');
fs.writeFileSync(ffd_hall,'1');
fs.closeSync(ffd_hall);
}
else
{
let ffd_hall = fs.openSync('fon_hall.txt','w');
fs.writeFileSync(ffd_hall,'0');
fs.closeSync(ffd_hall);
}

if(parseInt(fs.readFileSync('on_liv.txt'))==1&&socket_lc)
{
let ffd_liv = fs.openSync('fon_liv.txt','w');
fs.writeFileSync(ffd_liv,'1');
fs.closeSync(ffd_liv);
}
else
{
let ffd_liv = fs.openSync('fon_liv.txt','w');
fs.writeFileSync(ffd_liv,'0');
fs.closeSync(ffd_liv);
}

if(parseInt(fs.readFileSync('on_din.txt'))==1&&socket_dc)
{
let ffd_din = fs.openSync('fon_din.txt','w');
fs.writeFileSync(ffd_din,'1');
fs.closeSync(ffd_din);
}
else
{
let ffd_din = fs.openSync('fon_din.txt','w');
fs.writeFileSync(ffd_din,'0');
fs.closeSync(ffd_din);
}


if(parseInt(fs.readFileSync('on_kit.txt'))==1&&socket_kc)
{
let ffd_kit = fs.openSync('fon_kit.txt','w');
fs.writeFileSync(ffd_kit,'1');
fs.closeSync(ffd_kit);
}
else
{
let ffd_kit = fs.openSync('fon_kit.txt','w');
fs.writeFileSync(ffd_kit,'0');
fs.closeSync(ffd_kit);
}



}
