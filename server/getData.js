/*include ws*/
const WebSocket = require('ws');
/*include jquery*/
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const {document} = (new JSDOM('<!doctype html><html><body></body></html>')).window;
global.document = document;
const window = document.defaultView;
const $ = require('jquery')(window);


var socket = new WebSocket('ws://192.168.3.102:81');
// 打开Socket
socket.onopen = function(event) {
// 发送一个初始化消息
socket.send('{"wIoT":""}');
// 监听消息
socket.onmessage = function(event) {
console.log('Client received a message',event.data);
var obj = eval('(' + event.data + ')');
if(obj.T == 0) socket.close();
};
// 监听Socket的关闭
socket.onclose = function(event) {
console.log('Client notified socket has closed');
};
// 关闭Socket....
//socket.close();
};