# Quick Start

## Current Support devices
 - D1 MINI


## Node.js Install Node.js

Node.js is a widely used programming language for web developers. To make use of wIoT, you should first install Node.js to your computer.  

For **windows** user, you can follow the instruction in [this website](https://www.jianshu.com/p/03a76b2e7e00)    


## Install wIoT package

After install Node.js and configure npm successfully, you should then use npm to download wIoT package by enter following command in your command window.

```shell
npm install wiot
```

Windows user can use cmd or powershell.It should be notice that this may report error for some users. The solution is to open your cmd window as administrator. You can right click on cmd and choose *run as an administrator*. You can also press windows+R and input *cmd* then press Ctrl+Shift+Enter to open it as administrator.  


## Burn firmware


## Connect your device to D1 MINI
 - After burning the firmware, you should try to connect your device to D1 MINI
Follow the steps below, I'm sure it would not be a problem for such a smart person like you  

### 1. Reset your D1 MINI
 - Find pin **D0** on your D1 MINI, it should be in the middle of A0 and D5.      
 - Use a wire to connect **3V3** to **D0**. If your MINI works normally, you would see its BUILT-IN LED blink. 
 - You **don't** have to wait until it stops blink, just stay for **2s**, then you can pull out the wire and your MINI would reset.  

### 2.Find your D1 MINI on your device
 - After you finish step 1, your MINI would work in AP mode, which means you can search it with your smart phone or personal computer by scanning the Wi-Fi around     
 - If your MINI was reset successfully, you would find a Wi-Fi with SSID in the form of **wiot-xx:xx:xx:xx:xx:xx**.  
Example:         
![ssid](https://image.yimian.xyz/docs/wiot/ssid.png)          
"xx:xx:xx:xx:xx:xx" is the MAC address of this MINI, please try to remember the address for you may use it later 

The default password for D1 MINI is **1234567890**, enter the password and you should be able to connect to your MINI.

## Connect D1 MINI to your Wi-Fi
Congratulations, you have successfully connect your device to D1 MINI        
However, this is not the end, you should now try to connect D1 MINI to your Wi-Fi          
Use the device which had just been connected to D1 MINI and follow the steps below            
                   
### 1. Visit the control page of D1 MINI
Visit **http://192.168.0.1** with the browser on your device             
Normally, you would see a webpage like this:          
![webpage](https://image.yimian.xyz/docs/wiot/webpage.png)            
In this page, you can see the MAC Address and wIoT version of your MINI  
Again, please **remember** the MAC Address  

### 2.Submit SSID and password to your MINI         
From the page, you can see two blanks that ask the SSID and password of your Wi-Fi            
Input information of the Wi-FI which you would like to connect your MINI, click *Submit*             
If you have input the right SSID and password, you will see a page showing the message: **Set Successfully!! Rebooting!!**         
Then, after a minute, you will see the SSID of D1 MINI has vanished               
                  
If you submitted the wrong message, do not try to directly reconnect to D1 MINI.  Restart the whole procedure from the reset part of the last section


## Execute Example Code         
If you have successfully connect D1 MINI to your Wi-Fi, you can execute the example code below to realize a simple function of wIoT
Before executing the code, you should first connect a LED to D1 MINI with positive pole connect to pin D4 and negative pole connect to GND

```js
var wiot = require('wiot'); //Import wiot package from npm

// Create an object of single chip
// Here are two parameters, MAC is the MAC adress of single chip, the output port should be defined in pin
// The MAC address should be editted by user
var MyMCU = new wiot.client({MAC: "3C:71:BF:3A:F6:CF", pin: {D4 : 1}, hint : true});


// The following code can let the BUILTIN_LED turn on for one second and off for one second periodically

// Wait for all the chips to get ready
wiot.begin([MyMCU], ()=>{ 
    // First parameter is the name of chip, second parameter is the function that is going to be executed

    // Set timer, pin 3 of MyMCU will pull up every 2 seconds
    setInterval(()=>{
        MyMCU.write(wiot.D4, wiot.HIGH);
    }, 2000);

    // Set timer, executer the command in {} after a one-second delay
    setTimeout(()=>{

    // Set timer, pin 3 of MyMCU will pull down every 2 seconds
        setInterval(()=>{
            MyMCU.write(wiot.D4, wiot.LOW);
        }, 2000);
    }, 1000);
});

```

The LED is expected to blink after you execute the code



# Advanced development

## Parameters

Name | Default Value | Declaration
----|-------|----
MAC | "" | MAC Address of MCU
pin | {D1: 0, D2: 0, D3: 0, D4: 0, D5: 0, D6: 0, D7: 0, D8: 0} | Mode of each pin, 0 is INPUT, 1 is OUTPUT, 2is INPUT_PULLUP 
hint | true | Whether print the status prompt
debug | false | Whether open the debug mode
ip | "default" | Specify MCU IP, please try this option when you cannot find IP for a long time
port | 8848 | TCP Socket communication port for Client, default 8848
ip_range | "192.168.0" | IP search field, try this option if you cannot find IP for a long time
localIP | "127.0.0.1" | local IP
errDelayTime | 2000 | Retry interval when network error is encountered (milliseconds)
okDelayTime | 30 | Waiting time after receiving the network request (milliseconds)
resetDelayTime | 4500 | Waiting time for stop sending new messages after sending reset instructions to MCU (milliseconds)
noTryMaxTime | 15000 | If the MCU fails to respond after this time, the message will be sent again (milliseconds).
IntervalTime | 2000 | Interval between monitoring (heartbeat)
MaxToReScanTime | 180000 | After this time, if the MCU has no response, it will scan the IP address again (in milliseconds).
MinResearchTime | 5000 | Interval between each polling
IpScanTimeout | 1 | Ping detection timeout for IP scanning (seconds)
pingTimeout | 2 | Timeout of Heartbeat Ping detection (seconds)
MaxTraceBackTimes | 8 | Determine the number of historical heartbeats traced back to the connection state


## Parameters Declaration Example

### General Example

```js
var MyMCU = new wiot.client({
    MAC: "xx:xx:xx:xx:xx:xx",
    pin: {
        D1: 0,
        D2: 0,
        D3: 1,
        D4: 1,
        D5: 0,
        D6: 1,
        D7: 0,
        D8: 0
    },
    hint: true,
    debug: false,
    ip: "192.168.0.55",
    port: 6666,
    ip_range: "192.168.0",
    localIP: "127.0.0.1",
    errDelayTime: 2000,
    okDelayTime: 30,
    resetDelayTime: 4500,
    noTryMaxTime: 15000,
    IntervalTime: 2000,
    MaxToReScanTime: 180000,
    MinResearchTime: 5000,
    IpScanTimeOut: 1,
    pingTimeout: 2,
    MaxTraceBackTimes: 8
});

```



## Event Binding
### Client

`.on(event, handler)`

#### Event List of client

- `begin`  It begins when MCU starts to interact normally
- `disConnected`  Disconnect from MCU
- `reConnected`   Connection with MCU restored

```
js
var MCU = new wiot.client({"MAC": "xx:xx:xx:xx:xx:xx"});

MCU.on('disConnected', function () {

    // Execute the command below when lost connection with MCU
    console.log('Disconnected with MCU!!');
});

```

### Pin

`.pinOn(pin, event, handler)`

#### Event List of pin

- `on` Change output of pin from LOW to HIGH
- `off` Change output of pin from HIGH to LOW
- `change` Change the output of pin

```js

var MCU = new wiot.client({"MAC": "xx:xx:xx:xx:xx:xx"});

MCU.pinOn(wiot.D2, 'on', function () {
    // Execute when the output of D2 changes from LOW to HIGH
    console.log('D2 from LOW to HIGH!!');
});


```


### API

+ `wiot.begin()`: Execute when MCU is ready

```js

MCU0 = new wiot.client({MAC: "xx:xx:xx:xx:xx:xx", pin: {D4: wiot.OUTPUT}});
MCU1 = new wiot.client({MAC: "xx:xx:xx:xx:xx:ww"});

wiot.begin([MCU0, MCU1], ()=>{

    //Write the command you want to execute here
    //These command would execute once MCU0 and MCU1 are ready
});


```



+
 `wiot.loop()`: A loop command，Suitable for conditional control statements

```js

MCU0 = new wiot.client({MAC: "xx:xx:xx:xx:xx:xx", pin: {D4: wiot.OUTPUT}});
MCU1 = new wiot.client({MAC: "xx:xx:xx:xx:xx:ww"});


// Following code would realize: When pin D5 of MCU0 receive HIGH，D4 of MCU1 would output HIGH
// When pin D5 of MCU0 receive LOW，D4 of MCU1 would output LOW

// This function receives two parameters: first is an array of objects for MCU, second is a function which use MCU array of objects as its parameter

wiot.loop([MCU0, MCU1], () => {
    if(MCU1.read(wiot.D5) == wiot.HIGH){
        MCU0.write(wiot.D4, wiot.HIGH);
    }else{
        MCU0.write(wiot.D4, wiot.LOW);
    }
});



```


### Register

+ `wiot.register.set(status1, status2, function)`: Add a rule to register that status can be either value or function,
function would trigger if status1 == status2
The registry is designed to facilitate the use of various extension modules, See [extension module] below (# Sensor Extension Module).

+ `wiot.register.set(status, function)`: You can also pass in two functions, where the return value of status is of type bool, it would trigger the function if it changes to true



```js

var myLED = wiot.led(MyMCU, wiot.D4);
var pir = wiot.pir(MyMCU, wiot.D2);

//Sign up for a rule that says myLED lights up when pir detects a person
wiot.register.set(pir.getStatus, wiot.HIGH, ()=>{
    myLED.set(wiot.HIGH);
});

//Sign up for a rule that when people leave, myLED goes off
wiot.register.set(()=>{
    return (wiot.LOW == pir.getStatus);
}, ()=>{
    myLED.clear();
});

```


## Sensor extension module

### LED

+ `wiot.led(MCU, pin)`: Declare a LED module
+ `wiot.led.getStatus()`: Get status of LED

+ `wiot.led.set(status, time = 0, isSmooth = false)`: Set led state, initial state, intermediate state, final state, period
+ `wiot.led.breath(period)`: Set a breathing LED
+ `wiot.led.clear()`: Reset LED

```js
var wiot = require('wiot'); //Import wiot package from npm
MCU0 = new wiot.client({MAC: "3C:71:BF:3A:F6:CF", pin: {D4: wiot.OUTPUT}});

var myLED = wiot.led(MCU0, wiot.D4); //Create a new led object using the D4 port on MCU0

/* If myLED is not shining, light it up*/
if(!myLED.getStatus()){
    myLED.set(wiot.HIGH);
}

/* Set a breathing light with cycle of 2s */
myLED.breath(2000);

/* Set a LED which light 3 seconds and off 4 seconds */
myLED.set([wiot.HIGH, wiot.LOW], [3000, 4000]);

/* Set a breathing light which use 1 second to light and 3 second to extinguish */
myLED.set([wiot.LOW, wiot.HIGH], [1000, 3000], true);

/* Set a LED which shine with half brightness for 2 seconds, shine with full brightness for 3 seconds and then dextinguish for 2 seconds  */
myLED.set([100, wiot.HIGH, wiot.LOW], [2000, 3000, 2000]);

/* Turn off LED */
myLED.clear();

```

### PIR (Passive Infrared Sensor)
+ `wiot.pir(MCU, pin)`: Declare a PIR module
+ `wiot.pir.getStatus()`: Gets the PIR state, returns the value wiot.high (have people), wiot.low (no people)

#### Event Trigger
+ `wiot.pir.on(event, handler)`



**Events List**

- `detected`  Person detected
- `undetected`  People out of the detective field
- `change`   State change, includes from detected to undetected and from undetected to detected

```js
var wiot = require('wiot'); //Import wiot package from npm

MCU0 = new wiot.client({MAC: "3C:71:BF:3A:F6:CF"});

var myPIR = wiot.pir(MCU0, wiot.D2); //Create an object of pir, use the D2 port on MCU0

/* Output the status of pir to console */
console.log(myPIR.getStatus());

/* When human is detected，print "Detected People!" to console */
myPIR.on("detected", ()=>{
    console.log("Detected People!");
});

/* When human is out of the detection zone，print "No People!!" to console */
myPIR.on("undetected", ()=>{
    console.log("No People!!");
});

/* When there is a change to status, execute your command */
myPIR.on("change", ()=>{
    /* Write command in here */
});

```


### IR Infrared Sensor

+ `wiot.ir(MCU, pin)`: Declare an IR module, pin can be analog or digital port
+ `wiot.ir.getStatus()`: Get IR state, return value wiot.high (with a barrier), wiot.low (with no barrier), or a value of 0-1024 (only for analog port)

#### Event Trigger

+ `wiot.ir.on(event, handler)`



**Event List**

- `detected`  Barrier detected
- `undetected`  Barrier vanished
- `change`   Change state

```js
MCU0 = new wiot.client({MAC: "xx:xx:xx:xx:xx:xx"});

var myIR = wiot.ir(MCU0, wiot.D2); //Create a new ir object using the D2 port on MCU0

/* Output ir status to console */
console.log(myIR.getStatus());

/* When an object is detected, print "Detected Object!" to the console */
myIR.on("detected", ()=>{
    console.log("Detected Object!");
});

/* When the object move out of the detective area, print "No Object!!" to the console */
myIR.on("undetected", ()=>{
    console.log("No Object!!");
});

/* Execute the command when state changes */
myIR.on("change", ()=>{
    /* Your command */
});

```


### lightSensor


+ `wiot.lightSensor(MCU, pin)`: Declare a lightSensor module, pin can be analog or digital port
+ `wiot.lightSensor.getStatus()`: Get lightSensor state, return value wiot.HIGH(light), wiot.LOW(dark), or a value of 0-1024 (limited to analog port)

#### Event Trigger
+ `wiot.light.on(event, handler)`



**Event List**

- `light`  From dark to light
- `dark`  From light to dark
- `change`   Change state

```js

MCU0 = new wiot.client({MAC: "xx:xx:xx:xx:xx:xx"});
var myLightSensor = wiot.lightSensor(MCU0, wiot.D1); //Create a new pir object using the D2 port on MCU0

/* Output the LightSensor state to the console */
console.log(mylightSensor.getStatus());

/* When going from dark to Light, print "Light!!!" to the console */
myLightSensor.on("light", ()=>{
    console.log("Light!");
});

/* When going from light to Dark, print "Dark!!" to the console */
myLightSensor.on("dark", ()=>{
    console.log("Dark!!");
});

/* When the state changes, execute the command */
myLightSensor.on("change", ()=>{
    /* Your command */
});

```


## Internet Extension Module


### Mail module
Use this module to send messages to the specified mailbox. Proudly built with reference to [Yimian API](https://api.yimian.xyz/)!



+ `wiot.mail(to, from = "wIoT")`: Declare an mail module with sender's name and reveiver's address
+ `wiot.mail.send(subject, body)`: Send email with a subject and content

```js
var mail = wiot.mail("i@iotcat.me", "wIoT Test");

mail.send("Test", "Test from wiot!!");

```



### guguji 
Use this module to send messages to the specified cooing machine.Goo goo is a portable private printer, see [official website](https://www.memobird.shop/).
To use this module, you need to apply for your own developer ak in advance on the official website. See [here](https://api.yimian.xyz/gugu/intro.php). Proudly reference [Yimian API](https://api.yimian.xyz/)!

+ `wiot.guguji(ak, userID, memobirdID)`: Declare a goo goo chicken module, parameter: developer's ak, user id, cooing machine id
+ `wiot.guguji.send(msg)`: Send message, need to pass in the message to be sent

```js
var gugu = wiot.guguji("9e55121803474371bfa25d20e554b31f", "832598", "b3ee06a8bd9b49e1");

gugu.print("This is from wIoT!!");

```

