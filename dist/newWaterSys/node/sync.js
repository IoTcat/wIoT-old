
var fs = require('fs');
var mysql  = require('mysql');
var moment = require('moment');
 
var connection = mysql.createConnection({     
  host     : '192.168.3.15',       
  user     : 'home',              
  password : 'KJ4j2JL6s^k@jsa2',       
  port: '3306',                   
  database: 'home' 
}); 
 
connection.connect();

var  addSql = 'INSERT INTO waterSysRe(timestamp,w1Flow,w2Flow,ctl,w1Status,w2Status) VALUES(?,?,?,?,?,?)';
var data = {};

setInterval(()=>{

    
    var w1 = JSON.parse(fs.readFileSync('data/w1Data.json').toString());
    var w2 = JSON.parse(fs.readFileSync('data/w2Data.json').toString());
    data.w1Flow = w1.flow;
    data.w2Flow = w2.flow;
    data.ctl = w1.ctl;
    data.w1Status = fs.readFileSync('data/w1Status.txt').toString();
    data.w2Status = fs.readFileSync('data/w2Status.txt').toString();
    data.timestamp = Date.parse(new Date());

    
    fs.writeFile('data.json', JSON.stringify(data), ()=>{});

    console.log(data);

    var addSqlParams = [moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), data.w1Flow, data.w2Flow, data.ctl, data.w1Status, data.w2Status];

    connection.query(addSql,addSqlParams,function (err, result) {
        if(err){
         console.log('[INSERT ERROR] - ',err.message);
         return;
        }        
    });
 
    
}, 5000);


//connection.end();