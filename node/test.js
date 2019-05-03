var http=require('http');
var urlExists = require('url-exists'); 
var net   = require('net');
var arp = require('node-arp');
var os=require('os');
var Socket = net.Socket;

var arr_ip = {};
var ip_range   = '192.168.0'
var port  = 80

var OUTPUT = 1;
var INPUT = 0;
var INPUT_PULLUP = 2;

var HIGH = 1;
var LOW = 0;


var obj = {};
var pin = {"D1": 0, "D2": 0, "D3": 0, "D4": 0, "D5": 0, "D6": 0, "D7": 0, "D8": 0};
var exc = 1;
var httpSocket;
var MAC = "3C:71:BF:3A:F6:CF";
var ip = "";
var errDelayTime = 500;
var okDelayTime = 300;
var resetDelayTime = 7000;
var noTryMaxTime = 60000;
var reScanIpTime = 5000;
var LastConnectTime = Date.parse(new Date());
var isConnected = false;
var LastTryTime = Date.parse(new Date());

var t_fin = 0;




var scan = function (host, cb) {
    var socket = new Socket()
    var status = null
    socket.setTimeout(1500)
    socket.on('connect', function () {
        socket.end()
        cb && cb(null, host)
    })
    socket.on('timeout', function () {
        socket.destroy()
        cb && cb(new Error('timeout'), host)
    })
    socket.on('error', function (err) {
        cb && cb(err, host)
    })
    socket.on('close', function (err) {})
    socket.connect(port, host)
}





function http_error_callback(callback = () => {}) {
    callback();
}

function http_connected_callback(callback = () => {}) {
    callback();
}


function lstn(){
setInterval(() => {
    urlExists('http://' + ip + '/get', (err, exists) => {
        if (isConnected != exists) {
            if (exists == true) {
                http_connected_callback();
            } else {
                http_error_callback();
            }
        }
        if(exists && LastTryTime + noTryMaxTime < Date.parse(new Date())) {
            core();
        }
        isConnected = exists;
        console.log('Exist: ' + exists);
    });
}, 1000);

}

function http_ok() {
    setTimeout(core, okDelayTime);
}

function http_error() {
    setTimeout(core, errDelayTime);
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function http_update(){
    http_request('http://'+ip+'/get', http_update_success, http_update_err);
}

function http_update_success(res){
    obj = res;
    http_ok();
}

function http_update_err(err){
    http_error();
}

function http_request(url, callback = (res) => {}, err = (e) => {}){

    if(isConnected){
    LastTryTime = Date.parse(new Date());
    http.get(url, (res) => {
        res.setEncoding('utf8');
        res.on('data',function(data){
            if(IsJsonString(data)){
                var dataObj = JSON.parse(data);
                callback(dataObj);
            }else{
                err(e);
                console.log("err_"+ip+": Not Stadnard JSON Response!!");
            }
            LastConnectTime = Date.parse(new Date());
        });
    }).on('error', function(e){
    err(e);
    console.log("err_"+ip+": Lost Connection!!");
  }).end();

}else{
    http_error();
}
}

function core(){


        if(exc){
            http_update();
        }else{
            http_error();
        }
    
    console.log(obj);
}


function setPinMode(pin, mode){
    if(pin < 1 || pin > 8) throw "Illegal Pin Number!!";
    if(mode == INPUT_PULLUP || mode == 2){
        mode = "INPUT_PULLUP";
    }else if(mode == OUTPUT || mode == 1){
        mode = "OUTPUT";
    }else{
        mode = "INPUT";
    }
    http_request('http://'+ip+'/pinMode?pin='+pin+'&mode='+mode);

}


function http_update_pin(){
    if(isConnected){
    http_request('http://'+ip+'/getPinMode', (res) => {
        if(JSON.stringify(pin) != JSON.stringify(res)) {
            for(var i in pin){
                if(i.substr(0,1) == "D"){
                    setPinMode(i.substr(1,1), pin[i]);
                }else if(i.length == 1){
                    setPinMode(i, pin[i]);
                }

            }
                setTimeout(()=>{http_request('http://'+ip+'/reset');}, resetDelayTime);
                setTimeout(() => {core();}, resetDelayTime + errDelayTime);
                console.log("reset");
        }

                setTimeout(() => {core();}, resetDelayTime + errDelayTime);
    }, (e) => {
        setTimeout(http_update_pin, errDelayTime);
    });

    }else{
        setTimeout(http_update_pin, errDelayTime);
    }
}

function analogWrite(pin, out, callback = () => {}, err = () => {}){
    if(isNaN(pin)) pin = pin.substr(1,1);
    if(isNaN(out)) out = 0;
    if(out > 255 || out == "HIGH" || out == HIGH) out = 255;
    if(out < 0 || out == "LOW" || out == LOW) out = 0;
    http_request('http://'+ip+'/set?pin='+pin+'&output='+out, callback, err);
}

function digitalWrite(pin, out, callback = () => {}, err = () => {}){
    if(out == HIGH || out == "HIGH" || out == 1){
        out = 255;
    }else{
        out = 0;
    }
    analogWrite(pin, out, callback, err);
}


function digitalRead(pin){
    if(!isNaN(pin)) pin = 'D'+pin;
    return obj[pin];
}

function analogRead(pin = "A0"){
    if(!isNaN(pin)) pin = 'A'+pin;
    return obj["A0"];
}

function read(pin){
    if(isNaN(pin)){
        if(pin.substr(0,1) == "D"){
            digitalRead(pin);
        }else{
            analogRead(pin);
        }
    }else{
        if(pin > 0){
            digitalRead(pin);
        }else{
            analogRead(pin);
        }
    }
}

function write(pin, out, callback = () => {}, err = () => {}){
    analogWrite(pin, out, callback, err);
}

function getIps() {
    for (var i = 1; i <= 255; i++) {
        scan(ip_range + '.' + i, function (err, host) {
            if (!err) {

                arr_ip[host] = "";
                console.log("Found: ", host)
            }
            t_fin++;
        })
    }
}
function getMac() {

    if (t_fin < 255) {
        setTimeout(getMac, errDelayTime);
        return;
    }
    for (var i in arr_ip) {
        console.log(i);
        arp.getMAC(i, function (err, mac) {
            if (!err) {
                if (mac.toUpperCase() == MAC) {
                    ip = i;
                    lstn();
                    setup();
                    return;
                }
            }
        });
    }
    setTimeout(()=>{if(ip == "") ini();}, reScanIpTime);

}
function getIpRange() {
    iptable = {},
        ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
        ifaces[dev].forEach(function (details, alias) {
            if ((details.family == 'IPv4') && (details.internal == false)) {
                iptable['localIP'] = details.address;
            }
        });
    }
    var t_ip = new Array();
    t_ip = iptable.localIP.split('.');

    ip_range = t_ip[0] + '.' + t_ip[1] + '.' + t_ip[2];
    //console.log(ip_range);
}

function ini() {
    
    getIpRange();
    getIps();
    getMac();

}

function setup() {

    http_update_pin();

}


ini();
//setup();