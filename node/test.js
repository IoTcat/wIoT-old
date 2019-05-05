const request = require('request');
const fs = require('fs');
const http = require('http');



function download(url, fileName, callback = ()=>{upload();}) {
    var stream = fs.createWriteStream(fileName);
    request(url).pipe(stream).on('close', callback);
}


download('https://github.com/IoTcat/wIoT/blob/master/bin/wemos_D1_mini.ino.bin', 'wiot.bin');

function upload(){
var boundaryKey = '----' + new Date().getTime();
var options = {
host:'192.168.4.12',//远端服务器域名
port:80,//远端服务器端口号
method:'POST',
path:'/update',//上传服务路径
headers:{
'Content-Type':'multipart/form-data; boundary=' + boundaryKey,
'Connection':'keep-alive'
}
};
var req = http.request(options,function(res){
res.setEncoding('utf8');
res.on('data', function (chunk) {
console.log('body: ' + chunk);
});
res.on('end',function(){
console.log('res end.');
});
});
req.write(
'--' + boundaryKey + '\r\n' +
'Content-Disposition: form-data; name="upload"; filename="wiot.bin"\r\n'
+
'Content-Type: application/x-zip-compressed\r\n\r\n'
);
//设置1M的缓冲区
var fileStream = fs.createReadStream('wiot.bin',{bufferSize:1024
* 1024});
fileStream.pipe(req,{end:false});
fileStream.on('end',function(){
req.end('\r\n--' + boundaryKey + '--');
});
}

