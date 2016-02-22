var aws = require('aws-sdk');
var helpers = require('./helpers.js');
var Policy = require('./s3post.js').Policy;
var S3Form = require('./s3post.js').S3Form;
var external = require('externalip');
var AWS_CFG_FILE = "./config.json";
var fs = require('fs');
var queueUrl = "https://sqs.us-west-2.amazonaws.com/983680736795/matusiakSQS";
var bucket = "mariusz.matusiak";

aws.config.update({ region: 'us-west-2' });

var upload = function (request, callback){
    
    var sqs = new aws.SQS();
    var senderip = request.ip;  
    console.log(senderip);   
            var settings = request.body;
            //settings['file'] = uploadParams['Key'];
            var params = {
                MessageBody: JSON.stringify(settings),
                QueueUrl: queueUrl
            };
            sqs.sendMessage(params, function (err, data) {
                if (err) callback.send(err + ": " + err.stack);
                else {
                    console.log(data);
                    callback.send("Files sent to process");
                }
            });
}

exports.upload = upload;