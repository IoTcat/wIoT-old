var wiot = require('wiot');

//create two clients
MyMCU = new wiot.client({MAC: "3C:71:BF:3A:F7:66", pin: {D4: wiot.OUTPUT}});
MyMCU2 = new wiot.client({MAC: "BC:DD:C2:2F:EC:A8"});

var myLED = wiot.led(MyMCU, wiot.D4); //create a new LED
var myLightSensor = wiot.lightSensor(MyMCU, wiot.D1); //create a new LightSensor

// register two behaviors between the LightSensor and the LED
wiot.register.set(myLightSensor.getStatus, wiot.HIGH, ()=>{
    myLED.set(wiot.HIGH);
});

wiot.register.set(myLightSensor.getStatus, wiot.LOW, ()=>{
    myLED.set(wiot.LOW);
});