var wiot = require('./wiot');
MyMCU = new wiot.client({MAC: "3C:71:BF:3A:F7:66", pin: {D4: wiot.OUTPUT},debug: 0});
//q = new wiot.client({MAC: "3C:71:BF:3A:F6:83", pin: {D3: 1} });

var i = 0;

setInterval(()=>{
    i++;
}, 90);

wiot.loop([MyMCU], ()=>{
    if(i%512 < 256){
        MyMCU.write(MyMCU.D4, i%256);
    }else{
        MyMCU.write(MyMCU.D4, 511 - i%512);
    }
});