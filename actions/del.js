var aws = require('aws-sdk');
var helpers = require('./helpers');
var Policy = require('./s3post').Policy;
var S3Form = require('./s3post').S3Form;
var external = require('externalip');
var async = require('async');
var fs = require('fs');
var AWS_CFG_FILE =  "./config.json";
var POLICY_FILE = "./policy.json";
var queueUrl = "https://sqs.us-west-2.amazonaws.com/983680736795/matusiakSQS";
var bucket = "mariusz.matusiak";
var ejs = require('ejs');

aws.config.update({ region: 'us-west-2' });

var task = function (request, callback) {
    var s3 = new aws.S3();
    var key = request.query.file;
    //var senderip = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;
    var params = {
        Bucket: bucket,
        Key: key
    };
    s3.deleteObject(params, function (err, data) {
        if (err) callback.send("Cannot delete file");
        else {
            //var pos = key.lastIndexOf("/");
            //var path = key.substring(pos + 1);
            //fs.writeFileSync(__dirname + '/../public/images/' + path, data.Body);
            callback.send("File successfully deleted");
        }
    });
}
exports.delete = task;