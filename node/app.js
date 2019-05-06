var wiot = require('./wiot');
MyMCU = new wiot.client({MAC: "3C:71:BF:3A:F6:CF", pin: {D4: wiot.OUTPUT},debug: 0});
//q = new wiot.client({MAC: "3C:71:BF:3A:F6:83", pin: {D3: 1} });
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