var aws = require('aws-sdk');
var helpers = require('./helpers');
var Policy = require('./s3post').Policy;
var S3Form = require('./s3post').S3Form;
var external = require('externalip');
var async = require('async');
var fs = require('fs');
var AWS_CFG_FILE =  "./config.json";
var POLICY_FILE = "./policy.json";
var FILE = "./file.ejs";
var queueUrl = "https://sqs.us-west-2.amazonaws.com/983680736795/matusiakSQS";
var bucket = "mariusz.matusiak";
var ejs = require('ejs');

aws.config.loadFromPath(AWS_CFG_FILE);

var task = function (request, callback) {
    var s3 = new aws.S3();
    var key = request.query.file;
    //var senderip = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;
    var params = {
        Bucket: bucket,
        Key: key
    };
    s3.getObject(params, function (err, data) {
        if (err) callback.send("Cannot download file");
        else {
            var pos = key.lastIndexOf("/");
            var path = key.substring(pos + 1);
            fs.writeFileSync('public/images/' + path, data.Body);
            callback.render(FILE, {
                file: path
            });
        }
    });
    //callback.send("download");
    //s3.listObjects(params, function (err, data) {
    //    if (err) console.log(err);
    //    else {
    //        var images = data;
    //        callback.render(LIST, {
    //            Contents: data.Contents
    //        });
    //    }
    //});
    //callback.render(INDEX,  fields );
}
exports.download = task;