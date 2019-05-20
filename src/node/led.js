var wiot = require('./wiot');

var MyMCU = new wiot.client({MAC: "BC:DD:C2:24:85:9F", pin: {D5: 1, D6: 1, D7: 1, D8: 1}});

var led = wiot.led(MyMCU, wiot.D6);

wiot.begin([MyMCU], ()=>{
    led.breath(2000);
});