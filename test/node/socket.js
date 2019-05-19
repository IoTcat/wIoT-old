var net = require('net');

var HOST = '192.168.4.12';
var PORT = 8848;
var i = 0;

setInterval(()=>{client.write('_D4'+ (i++)%255 +'\n');console.log(i);}, 10);

var client = new net.Socket();
client.connect(PORT, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    client.write('_GET'+ '\n');

});

// 为客户端添加“data”事件处理函数
// data是服务器发回的数据
client.on('data', function(data) {

    console.log('DATA: ' + data);
        
        //client.write('_GET'+'\n');
        console.log(i);
    // 完全关闭连接
    //client.destroy();

});

// 为客户端添加“close”事件处理函数
client.on('close', function() {
    console.log('Connection closed');

});

// 为客户端添加“close”事件处理函数
client.on('error', function() {
    console.log('Connection error');
    client.destroy();

    client.connect(PORT, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // 建立连接后立即向服务器发送数据，服务器将收到这些数据 
    client.write('I am Chuck Norris!');

});

});