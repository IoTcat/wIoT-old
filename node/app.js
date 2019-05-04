var wiot = require('./wiot');
w = new wiot.client({MAC: "3C:71:BF:3A:F6:CF", pin: {D3: 1}});

var i = 0;
w.on = () => {
    setInterval(()=>{w.write("D3", i%256);i+=10;}, 200);
}