

var client = (o_params) => {

var o ={
    ip: 'undefined',
    port: 0,
    name: 'undefined',
    debug: false,
    intervalTime: 4000,
    data: {},
    send: ()=>{return ;},
    res: () => {},
    err: ()=>{},
    folder: "",
    LastConnectTime: 0,
    MaxNoTryTime: 4000,
    errDelayTime: 3000,
}

    var net = require('net');
    var fs = require('fs');


    Object.assign(o, o_params);

    var IsJsonString = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };


    o.client = new net.Socket();

    function connect() {
        o.client.connect(o.port, o.ip, function () {

            if(o.debug) console.log('wIoT - '+ o.name +': Socket Connected!!');
            o.client.write(o.send() + '\n');
            if(o.debug) console.log(o.send());
        });
    }

    connect();
    o.client.on('data', function (msg) {

        o.LastConnectTime = Date.parse(new Date());
        if (IsJsonString(msg)) {

            var obj = JSON.parse(msg);
            o.data = obj;
            if(o.debug) console.log('Socket: ' + msg);
            o.res(o.data);
            setTimeout(() => {
                o.client.write(o.send() + '\n');
                if(o.debug) console.log(o.send());
            }, o.intervalTime);

            return;
        }
        if(o.debug) console.log('socket recive not JSON!!');

    });

    o.client.on('close', function () {
        o.client.destroy();
        setTimeout(connect, o.errDelayTime);
    });

    o.client.on('error', function () {
        if(o.debug) console.log('Socket Connection error');
        o.err();
    });


    setInterval(()=>{
        if(Date.parse(new Date()) > o.LastConnectTime + o.intervalTime + o.MaxNoTryTime){
            o.client.destroy();
        }
    }, o.intervalTime);

    return o;
}



exports.client = client;