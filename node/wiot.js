/*
 * @Author: IoTcat (https://iotcat.me) 
 * @Date: 2019-05-04 18:59:49 
 * @Last Modified by: 
 * @Last Modified time: 2019-05-05 02:31:52
 */
 var wiot = function (o_params) {
     var o = {
         MAC: "",
         pin: {
             D1: 0,
             D2: 0,
             D3: 0,
             D4: 0,
             D5: 0,
             D6: 0,
             D7: 0,
             D8: 0
         },
         hint: true,
         debug: false,
         on: () => {},
         OUTPUT: 1,
         INPUT: 0,
         INPUT_PULLUP: 2,
         HIGH: 1,
         LOW: 0,
         data: {},
         ip: "default",
         ip_range: "192.168.4",
         version: "",
         errDelayTime: 2000,
         okDelayTime: 30,
         resetDelayTime: 4500,
         noTryMaxTime: 60000,
         IntervalTime: 2000,
         MaxToReScanTime: 180000,
         MinResearchTime: 5000,
         IpScanTimeOut: 300,
         pingTimeout: 2,
         LastConnectTime: Date.parse(new Date()),
         isConnected: false,
         LastTryTime: Date.parse(new Date()),
         firstReady: 0,
         pinCmd: {
             D1: 0,
             D2: 0,
             D3: 0,
             D4: 0,
             D5: 0,
             D6: 0,
             D7: 0,
             D8: 0
         }
     };

     /* merge paras */
     if (typeof o_params.pin != undefined) {
         o_params.pin = Object.assign(o.pin, o_params.pin);
     }
     Object.assign(o, o_params);

     /* require packages */
     var http = require('http');
     var net = require('net');
     var arp = require('@network-utils/arp-lookup');
     var ping = require('ping');
     var nodeArp = require('node-arp');

     /* tmp global var */
     var ip_point = 0;

     /* tools */
     var IsJsonString = (str) => {
         try {
             JSON.parse(str);
         } catch (e) {
             return false;
         }
         return true;
     };


     var ip_scan = function () {
         var socket = new net.Socket();
         socket.setTimeout(o.IpScanTimeOut);
         socket.on('connect', function () {
             socket.end();
             check_MAC();
         });
         socket.on('timeout', function () {
             socket.destroy();
             next_IP();
         });
         socket.on('error', function (err) {
             next_IP();
         });
         socket.on('close', function (err) {});
         socket.connect(80, generate_IP());
     };

     var check_MAC = () => {
         o.LastConnectTime = Date.parse(new Date());
         nodeArp.getMAC(generate_IP(), (err, mac) => {
             if (!err) {
                 if (o.debug) console.log('Searched IP: ' + generate_IP());
                 if (mac.toUpperCase() == o.MAC.toUpperCase()) {
                     if (o.hint) console.log('wiot - ' + o.MAC + ': Found MAC from ' + o.ip + ' :: Method: node-arp');
                     setTimeout(reCheck_MAC, o.IpScanTimeOut*2);
                     return;
                 }
                 next_IP();
                 return;
             }
             next_IP();
         });
     };

     var reCheck_MAC = () => {
         nodeArp.getMAC(generate_IP(), (err, mac) => {
             if(!err){
                if(o.debug) console.log('Checking IP: '+generate_IP());
                if(mac.toUpperCase() == o.MAC.toUpperCase()){
                    o.ip = generate_IP();
                    if (o.hint) console.log('wiot - ' + o.MAC + ': Confirm MAC from ' + o.ip + ' :: Method: node-arp');
                    lstn();
                    setup();
                    return;
                }
                next_IP();
                return;
             }
             next_IP();
         });
     }

     var generate_IP = () => {
         return o.ip_range + '.' + ip_point;
     };

     var next_IP = () => {
         if (ip_point >= 255) {
             ip_point = 0;
             setTimeout(ip_scan, o.MinResearchTime);
             return;
         }
         ip_point++;
         ip_scan();
     }

     var get_sync_url = () => {
         var s = 'http://' + o.ip + '/sync?D1=';
         s += o.pinCmd.D1;
         s += '&D2=';
         s += o.pinCmd.D2;
         s += '&D3=';
         s += o.pinCmd.D3;
         s += '&D4=';
         s += o.pinCmd.D4;
         s += '&D5=';
         s += o.pinCmd.D5;
         s += '&D6=';
         s += o.pinCmd.D6;
         s += '&D7=';
         s += o.pinCmd.D7;
         s += '&D8=';
         s += o.pinCmd.D8;

         return s;
     };

     var getVersion = () => {
         if (o.isConnected) {
             http_request('http://' + o.ip + '/getVersion', (res) => {
                 o.version = res.version;
                 if (o.hint) {
                     console.log('wiot - ' + o.MAC + ': Version: ' + o.version);
                 }
             }, getVersion);
             return;
         }
         setTimeout(getVersion, o.errDelayTime);
     };


     async function getMAC() {
         await arp.toIP(o.MAC).then((val) => {

             if (val != null) {
                 o.ip = val;
             } else if (ip == "default") {
                 ip_scan();
             }
             o.ip = val;

             if (o.debug) console.log('Found MAC: ' + o.MAC + '  from IP: ' + val + ' :: Method: arp-lookup');
             lstn();
             setup();
         }, (err) => {

             if (o.debug) console.log(err);
             setTimeout(getMAC, o.errDelayTime);
         });
     }


     /* http functions */
     var http_error_callback = (callback = () => {}) => {
         callback();
     };

     var http_connected_callback = (callback = () => {}) => {
         callback();
     };


     var http_ok = () => {
         setTimeout(core, o.okDelayTime);
     };

     var http_error = () => {
         setTimeout(core, o.errDelayTime);
     };


     var http_update = () => {
         http_request(get_sync_url(), http_update_success, http_update_err);
     };

     var http_update_success = (res) => {
         o.data = res;
         http_ok();
     };

     var http_update_err = () => {
         http_error();
     };

     var http_request = (url, callback = () => {}, err = () => {}) => {

         if (o.isConnected) {
             o.LastTryTime = Date.parse(new Date());
             http.get(url, (res) => {
                 res.setEncoding('utf8');
                 res.on('data', function (data) {
                     if (IsJsonString(data)) {
                         var dataObj = JSON.parse(data);
                         callback(dataObj);
                     } else {
                         err(e);
                         if (o.hint) console.log('wIoT - ' + o.MAC + ": err_" + o.ip + " - Not Stadnard JSON Response!!");
                     }
                     o.LastConnectTime = Date.parse(new Date());
                 });
             }).on('error', function (e) {
                 err(e);
                 if (o.hint) console.log('wIoT - ' + o.MAC + ": err_" + o.ip + " - Lost Connection!!");
             }).end();

         } else {
             http_error();
         }
     };


     /* pin Mode */
     var setPinMode = (pin, mode) => {
         if (pin < 1 || pin > 8) throw "Illegal Pin Number!!";
         if (mode == o.INPUT_PULLUP || mode == 2) {
             mode = "INPUT_PULLUP";
         } else if (mode == o.OUTPUT || mode == 1) {
             mode = "OUTPUT";
         } else {
             mode = "INPUT";
         }
         http_request('http://' + o.ip + '/pinMode?pin=' + pin + '&mode=' + mode);

     };


     var http_update_pin = () => {
         if (o.isConnected) {
             http_request('http://' + o.ip + '/getPinMode', (res) => {
                 if (JSON.stringify(o.pin) != JSON.stringify(res)) {
                     for (var i in o.pin) {
                         if (i.substr(0, 1) == "D") {
                             setPinMode(i.substr(1, 1), o.pin[i]);
                         } else if (i.length == 1) {
                             setPinMode(i, o.pin[i]);
                         }

                     }
                     setTimeout(() => {
                         http_request('http://' + o.ip + '/reset');
                     }, o.resetDelayTime);
                     setTimeout(() => {
                         core();
                     }, o.resetDelayTime + o.errDelayTime);
                     if (o.hint) console.log('wIoT - ' + o.MAC + ": Seting Pin Mode!!  reset...");
                 }

                 setTimeout(() => {
                     core();
                 }, o.resetDelayTime + o.errDelayTime);
             }, () => {
                 setTimeout(http_update_pin, o.errDelayTime);
             });

         } else {
             setTimeout(http_update_pin, o.errDelayTime);
         }
     };

     /* pin write */
     o.analogWrite = (pin, out, callback = () => {}, err = () => {}) => {
         if (!isNaN(pin)) pin = 'D' + pin;
         if (isNaN(out)) out = 0;
         if (out > 255 || out == "HIGH" || out == o.HIGH) out = 255;
         if (out < 0 || out == "LOW" || out == o.LOW) out = 0;

         if (o.hint && o.pinCmd[pin] != out) console.log('wIoT - ' + o.MAC + ': Write Value ' + out + ' to ' + pin);
         o.pinCmd[pin] = out;
     };

     o.digitalWrite = (pin, out, callback = () => {}, err = () => {}) => {
         if (out == o.HIGH || out == "HIGH" || out == 1) {
             out = 255;
         } else {
             out = 0;
         }
         o.analogWrite(pin, out, callback, err);
     };

     /* pin read and write */
     o.digitalRead = (pin) => {
         if (!isNaN(pin)) pin = 'D' + pin;
         return o.data[pin];
     };

     o.analogRead = (pin = "A0") => {
         if (!isNaN(pin)) pin = 'A' + pin;
         return o.data.A0;
     };

     o.read = function (pin) {
         if (isNaN(pin)) {
             if (pin.substr(0, 1) == "D") {
                 return o.digitalRead(pin);
             } else {
                 return o.analogRead(pin);
             }
         } else {
             if (pin > 0) {
                 return o.digitalRead(pin);
             } else {
                 return o.analogRead(pin);
             }
         }
     };

     o.write = (pin, out, callback = () => {}, err = () => {}) => {
         o.analogWrite(pin, out, callback, err);
     };
     o.ready = function () {
         if (!o.isConnected || JSON.stringify(o.data) == JSON.stringify({})) {
             return false;
         }
         return true;
     };

     /* exc functions */
     var ini = function () {
         if (o.hint) console.log('wiot - ' + o.MAC + ': init...');
         //getMAC();
         ip_scan();
     };

     async function lstn() {
         setInterval(async () => {
             if (o.LastConnectTime + o.errDelayTime > Date.parse(new Date())) {
                 o.isConnected = true;
                 http_connected_callback();
                 return;
             }
             ping.promise.probe(o.ip, {
                 timeout: o.pingTimeout
             }).then(function (res) {
                 if (o.isConnected != res.alive) {
                     if (res.alive == true) {
                         o.LastConnectTime = Date.parse(new Date());
                         http_connected_callback();
                     } else {
                         http_error_callback();
                     }
                 }
                 if (!res.alive && o.LastConnectTime + o.MaxToReScanTime < Date.parse(new Date())) {
                     ini();
                 } else if (res.alive && o.LastTryTime + o.noTryMaxTime < Date.parse(new Date())) {
                     core();
                 }
                 o.isConnected = res.alive;
                 if (o.debug) console.log('Exist: ' + res.alive + ' From IP: ' + o.ip);


             });

         }, o.IntervalTime);

     };


     var setup = () => {

         if (o.isConnected) {

             getVersion();
             http_update_pin();
             return;
         }

         setTimeout(setup, o.errDelayTime);
     };


     var core = () => {

         http_update();

         if (!o.firstReady && o.ready()) {
             o.on();
             o.firstReady = 1;
             if (o.hint) console.log('wIoT - ' + o.MAC + ': Connected!!');
         }
         if (o.debug) console.log(o.data);
     };

     /* exc cmd */
     ini();

     return o;

 };

 exports.client = wiot;