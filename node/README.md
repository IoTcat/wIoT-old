## wIoT for NodeJS
适用于NodeJS的wIoT服务器控制组件，轻松物联

## 先觉条件
 - 拥有烧录好wIoT固件的**D1 MINI**单片机
 - 一台或多台无线WiFi路由器2.4G/5G
 - 局域网内拥有一台装有**NodeJS**的服务器或电脑 (NodeJS装法非常简单, 请自行Google或百度)
 - 配置好**npm**

## 快速开始

### 单片机接入
1. 使用MicroUSB, 5V, 或3V pin脚给单片机供电
2. 用一根导线连接D0脚与3V3脚，持续一秒以上拔出，以重置单片机
3. 用手机或电脑搜索它的WiFi热点，名称格式`wiot-xx:xx:xx:xx:xx:xx`
4. 连接上此热点，密码为`1234567890`
5. 用浏览器打开网址`http://192.168.0.1`，记录网页中的MAC地址，这将用于识别此单片机
6. 配置你无线路由器的ssid(即wifi名称，注意不能有非ASCII字符，比如汉字)和密码
7. 配置完成后热点将自动断开，单片机将连接到你的无线路由器

### 依赖安装
在你的项目文件夹下打开命令行，输入以下指令安装wiot:
````shell
$ npm install wiot
````
### 使用方法
在你的项目文件夹中新建一个app.js文件，输入以下内容：

```js
var wiot = require('wiot'); //引入wiot依赖包

// 新建一个单片机对象
// 这里使用了两个参数，MAC是单片机的MAC地址，pin中指定需要OUTPUT输出的端口
// 请自行修改MAC地址的值
var MyMCU = new wiot.client({MAC: "xx:xx:xx:xx:xx:xx", pin: {D4: wiot.OUTPUT}});


// 以下代码将实现，板载led亮1秒，灭1秒的循环

// 等待所有单品即准备就绪
wiot.begin([MyMCU], ()=>{ // 第一个参数为要等待的单片机对象数组，第二个参数为要执行的函数
    // 设置计时器，每隔2000毫秒, MyMCU的3号pin口将拉高一次电平
    setInterval(()=>{
        MyMCU.write(wiot.D4, wiot.HIGH);
    }, 2000);

    // 设置计时器，延时1000毫秒后开始执行大括号中指令
    setTimeout(()=>{
        // 设置计时器，每隔2000毫秒，MyMCU的3号pin口将拉低一次电平
        setInterval(()=>{
            MyMCU.write(wiot.D4, wiot.LOW);
        }, 2000);
    }, 1000);
});
```

### 开始执行
在项目文件夹中打开命令行，输入以下指令:
````shell
node app.js
````

### 预期结果
如果一切顺利，你现在应该会发现你的板载led在闪烁了


## 进阶设置

### wiot.client参数说明
名称 | 默认值 | 描述
----|-------|----
MAC | "" | 单片机的MAC地址
pin | {D1: 0, D2: 0, D3: 0, D4: 0, D5: 0, D6: 0, D7: 0, D8: 0} | pin脚的模式, 0为INPUT, 1为OUTPUT, 2为INPUT_PULLUP 
hint | true | 是否显示状态提示
debug | false | 是否开启debug模式
ip | "default" | 指定单片机IP, 请在长时间搜索不到IP时尝试此选项
ip_range | "192.168.0" | IP搜索字段，请在长时间搜索不到IP时尝试此选项
localIP | "127.0.0.1" | 本机IP
errDelayTime | 2000 | 遇到网络错误时重试间隔时间(毫秒)
okDelayTime | 30 | 收到网络请求后延时等待时间(毫秒)
resetDelayTime | 4500 | 向单片机发送重置指令后多久不再发送新消息(毫秒)
noTryMaxTime | 15000 | 经过此时间单片机仍未响应则重新发送消息(毫秒)
IntervalTime | 2000 | 监听行为心跳间隔
MaxToReScanTime | 180000 | 经过此事件单片机无响应则从新扫描IP地址(毫秒)
MinResearchTime | 5000 | 搜索IP经过一此轮询后间隔时间(毫秒)
IpScanTimeout | 1 | IP扫描时的Ping检测超时时间(秒)
pingTimeout | 2 | 心跳Ping检测的超时时间(秒)
MaxTraceBackTimes | 8 | 判断连接状态所向前追溯的历史心跳个数


例如：

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

### API

+ `wiot.begin()`: 单片机准备完成后开始执行
```js
MCU0 = new wiot.client({MAC: "xx:xx:xx:xx:xx:xx", pin: {D4: wiot.OUTPUT}});
MCU1 = new wiot.client({MAC: "xx:xx:xx:xx:xx:ww"});

wiot.begin([MCU0, MCU1], ()=>{
    //这里放你要执行的指令
    //这些指令将会在MCU0和MCU1准备就绪后开始执行
});
```

+ `wiot.loop()`: 循环执行的指令，适合于条件控制语句
```js
MCU0 = new wiot.client({MAC: "xx:xx:xx:xx:xx:xx", pin: {D4: wiot.OUTPUT}});
MCU1 = new wiot.client({MAC: "xx:xx:xx:xx:xx:ww"});

// 以下代码将实现: 当MCU0的D5接收到HIGH，MCU1的D4将会输出HIGH
//                当MCU0的D5接收到LOW, MCU1的D4将会输出LOW
// 本函数接受两个参数: 第一个是MCU对象数组, 第二个是参数为MCU对象数组的函数
wiot.loop([MCU0, MCU1], () => {
    if(MCU1.read(wiot.D5) == wiot.HIGH){
        MCU0.write(wiot.D4, wiot.HIGH);
    }else{
        MCU0.write(wiot.D4, wiot.LOW);
    }
});

```


### wiot.client事件绑定
`.on(event, handler)`

```js
var MCU = new wiot.client({"MAC": "xx:xx:xx:xx:xx:xx"});

MCU.on('disConnected', function () {
    // 当与MCU失联时会执行此处指令
    console.log('Disconnected with MCU!!');
});
```

**事件列表**
- `begin`  开始于单片机正常交互
- `disConnected`  与单片机断开连接
- `reConnected`   与单片机恢复连接
