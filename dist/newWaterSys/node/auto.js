
var fs = require('fs');
var rate = Number(fs.readFileSync('config/rate.txt').toString());
var fAdd = Number(fs.readFileSync('ctl.txt').toString());
var AddTime = Number(fs.readFileSync('config/AddTime.txt').toString());


setInterval(() => {

    var timestamp = new Date();

    var data = JSON.parse(fs.readFileSync('data.json').toString());
    var fdata = JSON.parse(fs.readFileSync('data/fdata.json').toString());

    var w1InsFlow = (data.w1Flow - fdata.w1Flow > 0) ? data.w1Flow - fdata.w1Flow : 0;
    var w2InsFlow = (data.w2Flow - fdata.w2Flow > 0) ? data.w2Flow - fdata.w2Flow : 0;
    fs.writeFileSync('data/w1InsFlow.txt', w1InsFlow * rate, () => {});
    fs.writeFileSync('data/w2InsFlow.txt', w2InsFlow, () => {});
    console.log('w1: ' + w1InsFlow * rate + '  w2: ' + w2InsFlow);
    //console.log(fdata);

    var isAuto = Number(fs.readFileSync('config/auto.txt').toString());
    var isAdd = Number(fs.readFileSync('ctl.txt').toString());
    var isReset = Number(fs.readFileSync('config/reset.txt').toString());

    if (isReset) {

        fdata = data;
        fs.writeFileSync('data/fdata.json', JSON.stringify(data), () => {});

        isReset = 0;
        fs.writeFileSync('config/reset.txt', '0', () => {});
    }
    if (isAdd != fAdd) {

        isAuto = 0;
        fs.writeFileSync('config/auto.txt', '0', () => {});
    }

    if (isAuto) {

        if (timestamp.getHours() == AddTime || timestamp.getHours() == AddTime + 1) {

            if (w2InsFlow * 2 < w1InsFlow * rate) {

                fs.writeFileSync('config/_ctl.txt', '1', () => {});
                isAdd = 1;
                fAdd = 1;

                fs.writeFileSync('ctl.txt', '1', () => {});

            } else {

                fs.writeFileSync('config/_ctl.txt', '0', () => {});
                isAdd = 0;
                fAdd = 0;

                fs.writeFileSync('ctl.txt', '0', () => {});

            }

        } else {

            fs.writeFileSync('config/_ctl.txt', '0', () => {});
            isAdd = 0;
            fAdd = 0;

            fs.writeFileSync('ctl.txt', '0', () => {});


        }
    } else {

        if (isAdd) {

            fs.writeFileSync('config/_ctl.txt', '1', () => {});
        } else {
            fs.writeFileSync('config/_ctl.txt', '0', () => {});
        }
    }
    if (timestamp.getHours() == AddTime + 2 && timestamp.getMinutes() == 1) {

        fdata = data;
        fs.writeFileSync('data/fdata.json', JSON.stringify(fdata), () => {});

    }
    fAdd = isAdd;

}, 3000);