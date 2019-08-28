var https = require('https');
var fs = require("fs");
var express = require('express');   //引入express模块
var bodyParser = require('body-parser');    //req.body要用到

var options = {
    key: fs.readFileSync('./certificate/privatekey.pem'),
    cert: fs.readFileSync('./certificate/certificate.pem')
};

var route = require('./routes/route');

var app = express();        //创建express的实例

app.use(bodyParser.json());

app.use('/api', route)

https.createServer(options, app).listen(3011, function () {
    console.log('Https server listening on port ' + 3011);
});