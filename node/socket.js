var wiot = require('./wiot');
MyMCU = new wiot.client({MAC: "BC:DD:C2:2F:52:64", pin: {D4: 1}, hint: 1,debug: 1, OnlyHTTP: false});

var myLED = wiot.led(MyMCU, wiot.D4);

wiot.begin([MyMCU], ()=>{
    
    myLED.breath(2000);
    //myLED.set([wiot.HIGH, wiot.LOW], [3000, 4000]);
});

MyMCU.pinOn(wiot.D4, 'on', function () {
    // 当MCU的D2电位由低到高时会执行
    console.log('D2 from LOW to HIGH!!');
});