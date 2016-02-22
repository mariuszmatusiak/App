var AWS = require('aws-sdk');
var helpers = require('./helpers');
var Policy = require('./s3post').Policy;
var S3Form = require('./s3post').S3Form;
var external = require('externalip');
var async = require('async');
var fs = require('fs');
var AWS_CFG_FILE =  "./config.json";
var INDEX = "./up.ejs";
var queueUrl = "https://sqs.us-west-2.amazonaws.com/983680736795/matusiakSQS";

var task = function (request, callback) {
    var s3 = new AWS.S3();
    var ip1 = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;
    var awsConfig = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
    var awsPolicy = {
            expiration: {
                day: 1
            },
            conditions: [
                ["starts-with", "$key", "files/" + ip1 + "/"],
                { acl: "private" },
                { bucket: "mariusz.matusiak" },
                { "success_action_redirect": "http://mmatusiakELB-791613050.us-west-2.elb.amazonaws.com"  },
                { "x-amz-meta-ip": ip1 },
                ["content-length-range", 0, 10485760]
            ]
    }
    //var awsPolicy2 = helpers.readJSONFile(POLICY_FILE);
    var policy = new Policy(awsPolicy);
    //var policy2 = new Policy(awsPolicy2);
    var formparams = new S3Form(policy);
    //var formparams = new S3Form(policy2);
    var formfields = formparams.generateS3FormFields();
    formparams.addS3CredientalsFields(formfields, awsConfig);
    callback.render(INDEX, {
        fields: formfields
    });    
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