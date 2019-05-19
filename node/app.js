var wiot = require('./wiot');/*
MyMCU = new wiot.client({MAC: "3C:71:BF:3A:F7:66", pin: {D4: 1}, okDelayTime: 30,hint: 1,debug: 1});
MyMCU2 = new wiot.client({MAC: "BC:DD:C2:2F:EC:A8"});*/
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




//var myLED = wiot.led(MyMCU, wiot.D4); //新建一个led对象，使用MCU0上的D4口
/*
myLED.set([wiot.HIGH, wiot.LOW, 30, 0], [3000, 4000, 2000, 1000], true);

/*
myLED.set(wiot.LOW);


setTimeout(()=>{
    if(!myLED.getStatus()){
    myLED.set(wiot.HIGH);
}
}, 15000);
*/


//var pir = wiot.pir(MyMCU, wiot.D2);
/*

pir.on("detected", ()=>{
    console.log("Found People!!!");
});

pir.on("undetected", ()=>{
    console.log("No People");
});

pir.on("change", ()=>{
    console.log("PIR State Changed!!!");
});

pir.on("change", ()=>{
    console.log("PIR2222222222222222 State Changed!!!");
});

*/

/*wiot.register.set(pir.getStatus, wiot.HIGH, ()=>{
    myLED.set(wiot.HIGH);
});

wiot.register.set(wiot.LOW, pir.getStatus, ()=>{
    myLED.clear();
});

var light = wiot.lightSensor(MyMCU, wiot.D1);
*/
/*
wiot.register.set(light.getStatus, wiot.HIGH, ()=>{
    myLED.set(wiot.HIGH);
});

wiot.register.set(wiot.LOW, light.getStatus, ()=>{
    myLED.clear();
});
*/

/*
var ir = wiot.ir(MyMCU2, wiot.D8);

wiot.register.set(ir.getStatus, wiot.HIGH, ()=>{
    myLED.set(wiot.HIGH);
});

wiot.register.set(wiot.LOW, ir.getStatus, ()=>{
    myLED.clear();
});
*/


var gugu = wiot.guguji("9e55121803474371bfa25d20e554b31d", "832598", "b3ee06a8bd9b49e1");

gugu.print("kkk");