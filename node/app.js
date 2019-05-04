var wiot = require('./wiot');
w = new wiot.client({MAC: "3C:71:BF:3A:F6:CF", pin: {D3: 1}, debug:1});
q = new wiot.client({MAC: "3C:71:BF:3A:F6:83", pin: {D3: 1} });
var i = 0;
w.on = () => {
setInterval(() => {
        //console.log(q.read(4));
    if(q.read(4) == q.HIGH){
        w.write(3, w.HIGH);
    }else{
        w.write(3, w.LOW);
    }
}, 50);
};

