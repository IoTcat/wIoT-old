var wiot = require('wiot');

//create a new client
MyMCU = new wiot.client({MAC: "3C:71:BF:3A:F7:66", pin: {D4: wiot.OUTPUT}}); 

var myLED = wiot.led(MyMCU, wiot.D4); //create a new LED
//custom LED anime
myLED.set([0, 80, 0, 255], [1000, 1000, 400, 400], true);