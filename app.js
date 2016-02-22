//var helpers = require("./helpers");
var AWS = require("aws-sdk");
var AWS_CONFIG_FILE = "./config.json";
var http = require('http');
var fs = require('fs');
var async = require('async');
var express = require('express');
var app = express();
var sendfile = require("./actions/action").action;
var uploadFile = require('./actions/upload').upload;
var browseFiles = require('./actions/browse.js').browse;
var downloadFile = require('./actions/dl.js').download;
var deleteFile = require('./actions/del.js').delete;
var sendForm = require('./actions/prepare.js').action;
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
AWS.config.update({ region: 'us-west-2' });

//var listen = require("./digest").action
//var file = require("./file").action
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var publicdir = __dirname + '/public';
app.use(express.static(__dirname + '/public'));

var PORT = 8080;


app.get("/", function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});
app.get("/upload", sendForm);
app.post("/uploadFile", upload.single('file'), uploadFile);
app.get("/files", browseFiles);
app.get("/download", downloadFile);
app.get("/delete", deleteFile);

var server = app.listen(PORT, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("App started on: " + host + ":" + port);
});


var urlMap = [
    { path: "/", action: sendfile },
    { path: "/upload", action: sendfile },
    { path: "/uploadfile", action: uploadFile }
	];

//function request(req, resp){
//    //console.log("user request" + req.url);
//    if (req.method == 'GET' && req.url == '/') {
//        fs.readFile(__dirname + "/index.html", function (err, data) {
//            resp.writeHead(200, { "Context-Type": "text/html" });
//            resp.write(data);
//            resp.end();
//        });
//    } else {
//        resp.writeHead(200, { "Context-Type": "text/plain" });
//        resp.write("some data");
//        resp.end();
//    }
//}

//http.createServer(request).listen(8888);
//var service = require('webs-weeia').http(urlMap);
//service(PORT);

