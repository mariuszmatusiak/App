//var helpers = require("./helpers");
var AWS = require("aws-sdk");
var AWS_CONFIG_FILE = "./config.json";
//var ACTION = require('./actions/action.js');
var http = require('http');
var fs = require('fs');
var async = require('async');
var sendFile = require("./actions/action").action;

AWS.config.loadFromPath(AWS_CONFIG_FILE);

//var listen = require("./digest").action
//var file = require("./file").action

var PORT = 8080;

var urlMap = [
    { path: "/", action: sendFile },
    { path: "/upload", action: sendFile }
	];

function request(req, resp){
    //console.log("user request" + req.url);
    if (req.method == 'GET' && req.url == '/') {
        fs.readFile(__dirname + "/index.html", function (err, data) {
            resp.writeHead(200, { "Context-Type": "text/html" });
            resp.write(data);
            resp.end();
        });
    } else {
        resp.writeHead(200, { "Context-Type": "text/plain" });
        resp.write("some data");
        resp.end();
    }
}
//http.createServer(request).listen(8888);
var service = require('webs-weeia').http(urlMap);
service(PORT);

