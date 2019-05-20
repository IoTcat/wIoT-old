<?php
include './functions.php';

yimian__header("Yimian Home","This is a sample page for Yimian Home","Home, Yimian");
js__device();
?>
    <meta name="viewport" content="width=device-width">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0/dist/Chart.min.js"></script>
    <style>
    canvas{
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }
    </style>
<?php
yimian__headerEnd();
?>
    <div id="c1" style="width:75%;">
        <canvas id="canvas2"></canvas>
        <canvas id="canvas"></canvas>
        <canvas id="canvas3"></canvas>
        <canvas id="canvas4"></canvas>
    </div>
<br/>
<p><a href="./display.php">切换到实时数据页面</a></p>
<br/>
<br/>

    <script type="text/javascript">'use strict';

window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

(function(global) {
    var MONTHS = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    var COLORS = [
        '#4dc9f6',
        '#f67019',
        '#f53794',
        '#537bc4',
        '#acc236',
        '#166a8f',
        '#00a950',
        '#58595b',
        '#8549ba'
    ];

    var Samples = global.Samples || (global.Samples = {});
    var Color = global.Color;

    Samples.utils = {
        // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
        srand: function(seed) {
            this._seed = seed;
        },

        rand: function(min, max) {
            var seed = this._seed;
            min = min === undefined ? 0 : min;
            max = max === undefined ? 1 : max;
            this._seed = (seed * 9301 + 49297) % 233280;
            return min + (this._seed / 233280) * (max - min);
        },

        numbers: function(config) {
            var cfg = config || {};
            var min = cfg.min || 0;
            var max = cfg.max || 1;
            var from = cfg.from || [];
            var count = cfg.count || 8;
            var decimals = cfg.decimals || 8;
            var continuity = cfg.continuity || 1;
            var dfactor = Math.pow(10, decimals) || 0;
            var data = [];
            var i, value;

            for (i = 0; i < count; ++i) {
                value = (from[i] || 0) + this.rand(min, max);
                if (this.rand() <= continuity) {
                    data.push(Math.round(dfactor * value) / dfactor);
                } else {
                    data.push(null);
                }
            }

            return data;
        },

        labels: function(config) {
            var cfg = config || {};
            var min = cfg.min || 0;
            var max = cfg.max || 100;
            var count = cfg.count || 8;
            var step = (max - min) / count;
            var decimals = cfg.decimals || 8;
            var dfactor = Math.pow(10, decimals) || 0;
            var prefix = cfg.prefix || '';
            var values = [];
            var i;

            for (i = min; i < max; i += step) {
                values.push(prefix + Math.round(dfactor * i) / dfactor);
            }

            return values;
        },

        months: function(config) {
            var cfg = config || {};
            var count = cfg.count || 12;
            var section = cfg.section;
            var values = [];
            var i, value;

            for (i = 0; i < count; ++i) {
                value = MONTHS[Math.ceil(i) % 12];
                values.push(value.substring(0, section));
            }

            return values;
        },

        color: function(index) {
            return COLORS[index % COLORS.length];
        },

        transparentize: function(color, opacity) {
            var alpha = opacity === undefined ? 0.5 : 1 - opacity;
            return Color(color).alpha(alpha).rgbString();
        }
    };

    // DEPRECATED
    window.randomScalingFactor = function() {
        return Math.round(Samples.utils.rand(-100, 100));
    };

    // INITIALIZATION

    Samples.utils.srand(Date.now());

    /* eslint-enable */

}(this));</script>
    <script>

        var config = {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Light Sensor1',
                    backgroundColor: window.chartColors.red,
                    borderColor: window.chartColors.red,
                    data: [],
                    fill: false,
                }, {
                    label: 'Light Sensor2',
                    fill: false,
                    backgroundColor: window.chartColors.blue,
                    borderColor: window.chartColors.blue,
                    data: [],
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Light data'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Time'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Value'
                        }
                    }]
                }
            }
        };
var config2 = {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Temp Sensor',
                    backgroundColor: window.chartColors.red,
                    borderColor: window.chartColors.red,
                    data: [],
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Temp data'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Time'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Value'
                        }
                    }]
                }
            }
        };

var color = Chart.helpers.color;
        var config3 = {
            labels: ['走廊', '餐厅', '客厅', '厨房'],
            datasets: [{
                label: '房间人数',
                backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                borderColor: window.chartColors.red,
                borderWidth: 1,
                data: [1,2,3,4]
            }]
        };
var randomScalingFactor = function() {
            return Math.round(Math.random() * 100);
        };
var config3 = {
            type: 'pie',
            data: {
                datasets: [{
                    data: [
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor()
                        ],
                    backgroundColor: [
                        window.chartColors.red,
                        window.chartColors.yellow,
                        window.chartColors.green,
                        window.chartColors.blue,
                    ],
                    label: '房间人数'
                }],
                labels: ['走廊', '餐厅', '客厅', '厨房'],
            },
            options: {
                responsive: true
            }
        };

var config4 = {
            labels: ['R1', 'R2', 'R3', 'R4','R5', 'R6', 'R7', 'R8','R9', 'R10', 'R11', 'R12','R13', 'R14', 'R15', 'R16','R17', 'R18', 'R19', 'R20'],
            datasets: [{
                label: '人体传感器',
                backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                borderColor: window.chartColors.blue,
                borderWidth: 1,
                data: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
            }]
        };
        window.onload = function() {
            var ctx = document.getElementById('canvas').getContext('2d');
            var ctx2 = document.getElementById('canvas2').getContext('2d');
            var ctx3 = document.getElementById('canvas3').getContext('2d');
            var ctx4 = document.getElementById('canvas4').getContext('2d');
            window.myLine = new Chart(ctx, config);
            window.myLine2 = new Chart(ctx2, config2);
            window.myLine3 = new Chart(ctx3, config3);
            window.myLine4 = new Chart(ctx4, {
                type: 'bar',
                data: config4,
                options: {
                    responsive: true,
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Body Sensor Data'
                    }
                }
            });
        };

        var colorNames = Object.keys(window.chartColors);


    </script>

    <script type="text/javascript">
var lightSensorCnt = 1;
        function add_light_data(val,val2,val3,val4) {
            if (config.data.datasets.length > 0) {
                config2.data.labels.push(lightSensorCnt);
                config.data.labels.push(lightSensorCnt++);
                var i = 0;
                config.data.datasets.forEach(function(dataset) {
                    dataset.data.push(val[i++]);
                });

                config2.data.datasets.forEach(function(dataset) {
                    dataset.data.push(val2);
                });

                config3.data.datasets[0].data = val3;
                config4.datasets[0].data = val4;

                window.myLine.update();
                window.myLine2.update();
                window.myLine3.update();
                window.myLine4.update();
            }
        }

    </script>

<script>

if(device.mobile()) $("#c1").css("width","100%");

function action()
{   
    $.post("./data.php",function(msg){
        msg = eval('(' + msg + ')');
    
        $('#wF1').html(msg.wF1+' L');
        $('#wF2').html(msg.wF2+' L');
        $('#dl').html(msg.dl);
        $('#wS').html(msg.wS);
        $('#lS').html(msg.lS);
        $('#tW').html(msg.tW+" L");
        $('#temp').html(msg.temp+" ℃ ");
        $('#Ls').html(msg.Ls2+" ");
        $('#lP').html(msg.lP+' 人');
        $('#dP').html(msg.dP+' 人');
        $('#kP').html(msg.kP+' 人');
        $('#hP').html(msg.hP+' 人');

        if(Number(msg.temp)>60) msg.temp = undefined;
        add_light_data([parseInt(msg.Ls2),Number(msg.Ls3)], Number(msg.temp),[Number(msg.hP),Number(msg.dP),Number(msg.lP),Number(msg.kP)],[Number(msg.R1),Number(msg.R2),Number(msg.R3),Number(msg.R4),Number(msg.R5),Number(msg.R6),Number(msg.R7),Number(msg.R8),Number(msg.R9),Number(msg.R10),Number(msg.R11),Number(msg.R12),Number(msg.R13),Number(msg.R14),Number(msg.R15),Number(msg.R16),Number(msg.R17),Number(msg.R18),Number(msg.R19),Number(msg.R20)]);

    });
}
    
setInterval("action()",500);
</script>
<?php
yimian__footer();
