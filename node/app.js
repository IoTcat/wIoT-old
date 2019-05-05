var wiot = require('./wiot');
w = new wiot.client({MAC: "3C:71:BF:3A:F6:CF", pin: {D4: 1},debug: 0});
//q = new wiot.client({MAC: "3C:71:BF:3A:F6:83", pin: {D3: 1} });

wiot.loop([w], (w) => {
    w[0].write(3, wiot.HIGH);
});

w.on('disConnected', ()=>{
    console.log('hhhhhhhhhhhhh');
})