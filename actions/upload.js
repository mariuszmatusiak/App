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
    var s3 = new aws.S3();
    var sqs = new aws.SQS();
    var senderip = request.ip;  
    console.log(senderip);   
        var uploadParams = {
            ACL: "private",
            Bucket: bucket,
            Key: "files/" + senderip + "/" + request.file.originalname,
            Body: fs.readFileSync(request.file.path)
        };
        s3.putObject(uploadParams, function (err, data) {
            if (err) console.log(err +": " +  err.stack);
        else console.log(data);
        var settings = request.body;
        settings['file'] = uploadParams['Key'];
        var params ={
           MessageBody: JSON.stringify(settings),
           QueueUrl: queueUrl
        };
        sqs.sendMessage(params, function (err, data) {
            if (err) console.log(err + ": " + err.stack);
            else console.log(data);
            callback.send("File uploaded");
        });
    });
}

exports.upload = upload;