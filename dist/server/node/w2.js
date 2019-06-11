
var client = require('./client').client;

var fs = require('fs');


var w1 = client({
    ip: "192.168.3.107",
    port: 8848,
    name: "w2",
    intervalTime: 10000,
    errDelayTime: 15000,
    send: ()=>{
        return '_wiot_';
    },
    res: (data)=>{
        fs.writeFile('data/w2Data.json', JSON.stringify(data), ()=>{});
        fs.writeFile('data/w2Status.txt', '1', ()=>{});
    },
    err: ()=>{
        fs.writeFile('data/w2Status.txt', '0', ()=>{});
    },
    debug: true,
});


