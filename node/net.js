var net   = require('net')
var Socket = net.Socket

var arr_ip = new Array();

var ip   = '192.168.4'
var port  = 80
var scan = function(host, cb) {
 var socket = new Socket()
 var status = null
 socket.setTimeout(1500)
 socket.on('connect', function() {
  socket.end()
  cb && cb(null, host)
 })
 socket.on('timeout', function() {
  socket.destroy()
  cb && cb(new Error('timeout'), host)
 })
 socket.on('error', function(err) {
  cb && cb(err, host)
 })
 socket.on('close', function(err) {
 })
 socket.connect(port, host)
}
for(var i = 1; i <= 255; i++ ) {
 scan(ip+'.'+i, function(err, host) {
  if (err) {
   //console.log('Not found', host)
   return
  }
  arr_ip.push(host);
  console.log("Found: ", host)
 })
}