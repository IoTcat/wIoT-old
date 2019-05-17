var wiot = require('./wiot');
MyMCU = new wiot.client({MAC: "3C:71:BF:3A:F7:66", pin: {D4: 1}, okDelayTime: 30,debug: 1});
//q = new wiot.client({MAC: "3C:71:BF:3A:F6:83", pin: {D3: 1} });
/*
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
});*/

var myLED = wiot.led(MyMCU, wiot.D4); //新建一个led对象，使用MCU0上的D4口

setTimeout(()=>{
    if(!myLED.getStatus()){
    myLED.set(wiot.HIGH);
}
}, 15000)