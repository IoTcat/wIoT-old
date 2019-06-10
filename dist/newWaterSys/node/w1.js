
var client = require('./client').client;

var fs = require('fs');


var w1 = client({
    ip: "192.168.3.101",
    port: 8848,
    name: "w1",
    ctl: 0,
    send: ()=>{
        w1.ctl = fs.readFileSync('ctl.txt').toString();
        return '_wiot_' + w1.ctl;
    },
    res: (data)=>{
        fs.writeFile('data/w1Status.txt', '1', ()=>{});
        fs.writeFile('data/w1Data.json', JSON.stringify(data), ()=>{});
    },
    err: ()=>{
        fs.writeFile('data/w1Status.txt', '0', ()=>{});
    },
    debug: true,
});


