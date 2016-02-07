var AWS = require('aws-sdk');
var helpers = require('./helpers');
var Policy = require('./s3post').Policy;
var S3Form = require('./s3post').S3Form;
var external = require('externalip');
var async = require('async');
var fs = require('fs');
var AWS_CFG_FILE =  "./config.json";
var POLICY_FILE = "./policy.json";
var INDEX = "./index.html";
var queueUrl = "https://sqs.us-west-2.amazonaws.com/983680736795/matusiakSQS";

var task = function (request, callback) {
    var s3 = new AWS.S3();
    var ip1 = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;
    if (typeof request.query.key != 'undefined') {
        var params = {
            MessageBody: request.query.key,
            QueueUrl: queueUrl

        };
        var sqs = new AWS.SQS();
        sqs.sendMessage(params, function (err, data) {
            if (err) console.log(err, err.stack);
            else console.log(data);
        });
    }
    console.log(ip1);
    var ip;
    ip = external(function (err, ip) {
        console.log(ip);
        var awsPolicy = {
            expiration: {
                day: 1
            },
            conditions: [
                ["starts-with", "$key", "files/" + ip1 + "/"],
                { acl: "private" },
                { bucket: "mariusz.matusiak" },
                { "success_action_redirect": "http://localhost" + ":8080/upload" },
                { "x-amz-meta-ip": ip1 },
                ["content-length-range", 0, 10485760]
            ]
        }
        var policy = new Policy(awsPolicy);
        var count = 0;
        async.whilst(
            function () { return true },
            
            function (callback) {
                var date = Date.now();
                console.log(date);
                setTimeout(function () {
                    callback(null, date);
                }, 2000);
            },
            function (err, n) {

            }
        );
        callback.sendFile(INDEX);
    })
};

    //var params = {
    //    Bucket: 'mariusz.matusiak',
    //    Key: 'files/' + request.body.file,
    //    ACL: 'private',
    //    Body: request.body.fileContent,
    //    RequestPayer: 'requester'
    //};
    //console.log(params);
    //s3.putObject(params, function (err, data) {
    //    if (err) {
    //        //callback.writeHead(200, { "Context-Type": "text/plain" });
    //        //callback.write("Error occured during file upload. \n" + err);
    //        //callback.end();
    //        callback(null, "error: " + err.stack);
    //    } else {
    //        //callback.writeHead(200, { "Context-Type": "text/plain" });
    //        //callback.write("Your file " + data.ETag + " has been successfully send");
    //        //callback.end();
    //        //callback(null, data);
    //    }
    //});


exports.action = task;