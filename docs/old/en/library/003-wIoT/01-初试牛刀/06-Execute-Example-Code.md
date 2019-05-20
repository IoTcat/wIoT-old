##Execute Example Code         
If you have successfully connect D1 MINI to your Wi-Fi, you can execute the example code below to realize a simple function of wIoT
Before executing the code, you should first connect a LED to D1 MINI with positive pole connect to pin D4 and negative pole connect to GND


```
var wiot = require('wiot'); //Import wiot package from npm

// Create an object of single chip
// Here are two parameters£¬MAC is the MAC adress of single chip£¬the output port should be defined in pin
// The MAC address should be editted by user
var MyMCU = new wiot.client({MAC: "3C:71:BF:3A:F6:CF", pin: {D4 : 1}, hint : true});


// The following code can let the BUILTIN_LED turn on for one second and off for one second periodically

// Wait for all the chips to get ready
wiot.begin([MyMCU], ()=>{ // First parameter is the name of chip£¬second parameter is the function that is going to be executed
    // Set timer£¬pin 3 of MyMCU will pull up every 2 seconds
    setInterval(()=>{
        MyMCU.write(wiot.D4, wiot.HIGH);
    }, 2000);

    // Set timer£¬executer the command in {} after a one-second delay
    setTimeout(()=>{

    // Set timer£¬pin 3 of MyMCU will pull down every 2 seconds
        setInterval(()=>{
            MyMCU.write(wiot.D4, wiot.LOW);
        }, 2000);
    }, 1000);
});
```

The LED is expected to blink after you execute the code
