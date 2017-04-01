var formidable = require('formidable');
var parse = require('csv-parse/lib/sync');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var EmailService = require('./email.service');
module.exports = {
    sendEmails: function(req, res){
        /*{
           template: '',
            csv: File,
            attachments: File[],
            to: string,
            cco: string,
            cc: string,
            subject: string,
            template: string
        }*/
        cleanTempFolders(function(){
            uploadData(req, function(){
                getConfig(function(config){
                    var data = req.body;
                    var emailData = {};
                    var meta = loadMeta(data.template);
                    var cids = getCIDS(data.template);
                    var attachments = getAttachments();
                    var csvData = getCSV();
                    emailData.config = config;
                    emailData.template = data.template;
                    /*[ { test23: 'Hello',
                          test52: 'World',
                          to: 'christianbartrina@gmail.com',
                          cco: 'brchro@gmail.com',
                          cc: 'christianbartrina@telefonica.net' },
                    ]   { test23: 'Hello2',
                          test52: 'World2',
                          to: 'christianbartrina@gmail.com',
                          cco: 'brchro@gmail.com',
                          cc: 'christianbartrina@telefonica.net' } ]*/

                    if(csvData.length > 0){
                        var errors = [];
                        var responses = [];
                        var send = function(i, cb){
                            if(csvData[i] !== undefined) {
                                var currentData = csvData[i];
                                if (currentData.to) {
                                    emailData.to = currentData.to;
                                } else if (data.to) {
                                    emailData.to = data.to;
                                }
                                if (currentData.cc) {
                                    emailData.cc = currentData.cc;
                                } else if (data.cc) {
                                    emailData.cc = data.cc;
                                }
                                if (currentData.cco) {
                                    emailData.cco = currentData.cco;
                                } else if (data.cco) {
                                    emailData.cco = data.cco;
                                }
                                if (currentData.subject) {
                                    emailData.subject = currentData.subject;
                                } else if (data.subject) {
                                    emailData.subject = data.subject;
                                }
                                if (meta.variables.length > 0) {
                                    var csvVariables = Object.assign({}, currentData);
                                    delete csvVariables.to;
                                    delete csvVariables.cc;
                                    delete csvVariables.cco;
                                    delete csvVariables.subject;
                                    delete csvVariables.method;
                                    delete csvVariables.template;
                                    emailData.variables = csvVariables;
                                }
                                if (cids.length > 0) {
                                    emailData.attachments = emailData.attachments !== undefined ? emailData.attachments.concat(cids) : cids;
                                }
                                if (attachments.length > 0) {
                                    emailData.attachments = emailData.attachments !== undefined ? emailData.attachments.concat(attachments) : attachments;
                                }

                                if (!emailData.subject || !emailData.to) {
                                    errors.push({
                                        error: 'NO SUBJECT OR DESTINATION EMAIL PROVIDED',
                                        msg: 'You must provide a destination email (to:) and any subject'
                                    });
                                } else {
                                    EmailService.sendEmail(emailData, function (err, status) {
                                        if (err) errors.push(err);
                                        responses.push(status);
                                        send(++i, cb);
                                    });
                                }
                            }else{
                                cb();
                            }
                        };
                        send(0, function(){
                            rimraf(path.join(__dirname,'tmp','attachments','*'), function(){
                                rimraf(path.join(__dirname,'tmp','csv','*'), function(){
                                    var response = {
                                        errors: errors,
                                        data: responses
                                    };
                                    if(responses.length > 0){
                                        res.status(200).json(response);
                                    }else{
                                        res.status(400).json(response);
                                    }
                                });
                            });
                        });
                    }else {
                        if (data.to) {
                            emailData.to = data.to;
                        }
                        if (data.cc) {
                            emailData.cc = data.cc;
                        }
                        if (data.cco) {
                            emailData.cco = data.cco;
                        }
                        if (data.subject) {
                            emailData.subject = data.subject;
                        }
                        if (meta.variables.length > 0) {
                            var variables = Object.assign({}, data);
                            delete variables.to;
                            delete variables.cc;
                            delete variables.cco;
                            delete variables.subject;
                            delete variables.method;
                            delete variables.template;
                            emailData.variables = variables;
                        }
                        if (cids.length > 0) {
                            emailData.attachments = emailData.attachments !== undefined ? emailData.attachments.concat(cids) : cids;
                        }
                        if (attachments.length > 0) {
                            emailData.attachments = emailData.attachments !== undefined ? emailData.attachments.concat(attachments) : attachments;
                        }
                        if (!data.subject || !data.to) {
                            res.status(400).json({
                                error: 'NO SUBJECT OR DESTINATION EMAIL PROVIDED',
                                msg: 'You must provide a destination email (to:) and any subject'
                            });
                        } else {
                            EmailService.sendEmail(emailData, function (err, status) {
                                rimraf(path.join(__dirname,'tmp','attachments','*'), function(){
                                    rimraf(path.join(__dirname,'tmp','csv','*'), function(){
                                        if (err) res.status(400).json(err);
                                        res.status(200).json(status);
                                    });
                                });
                            });
                        }
                    }
                });
            });
        });

    }
};
/*
 var input = '"key_1","key_2"\n"value 1","value 2"';
 var records = parse(input, {columns: true});
 */
/*var parseVariables = function(variables, values){
    var result = {};
    for(var i = 0; i<variables.length; i++){
        result[variables[i]] = values[i] || '';
    }
    return result;
};*/
var cleanTempFolders = function(cb){
    rimraf(path.join(__dirname, 'tmp', '*'), cb);
};

var getAttachments = function(){
    var result = [];
    try{
        var files = fs.readdirSync(path.join(__dirname, 'tmp', 'attachments'));
        for(var fileKey in files){
            var file = files[fileKey];
            var newAttachment = {
                filename: file,
                path: path.join(__dirname,'tmp','attachments',file)
            };
            result.push(newAttachment);
        }
    }
    catch(error){
    }
    finally{
        return result;
    }
};
var getCIDS = function(template){
    var result = [];
    var cids = fs.readdirSync(path.join(__dirname, '..', 'templates','availableTemplates', template, 'cids'));
    for( var cidKey in cids){
        var cid = cids[cidKey];
        var newCid = {
            filename: cid,
            path: path.join(__dirname, '..', 'templates', 'availableTemplates',template, 'cids', cid),
            cid: cid.replace(/\.[^/.]+$/, '').toLowerCase()
        };
        result.push(newCid);
    }
    return result;
};
var loadMeta = function(template){
  var data = fs.readFileSync(path.join(__dirname,'..','templates','availableTemplates', template, 'meta.json'),'utf8');
  return JSON.parse(data || {});
};
var getConfig = function(cb){
    var config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'config.json'), 'utf8'));
    cb(config);
};
var getCSV = function(){
    try{
        var csvFile = fs.readdirSync(path.join(__dirname, 'tmp','csv'));
        if(csvFile.length > 0) {
            var input = fs.readFileSync(path.join(__dirname, 'tmp', 'csv', csvFile[0]), 'utf8');
            return parse(input, {columns: true, delimiter: ';'});
        }else{
            return [];
        }
    }
    catch(err){
        return [];
    }
};
var mkdirSync = function(path){
    if (!fs.existsSync(path)){
        fs.mkdirSync(path);
    }
};

var uploadData = function(req, cb){
    // create an incoming form object
    var form = new formidable.IncomingForm();

    // store all uploads in the /uploads directory
    form.attachmentsDir = path.join(__dirname, 'tmp', 'attachments');
    form.csvDir = path.join(__dirname, 'tmp', 'csv');
    mkdirSync(form.attachmentsDir);
    mkdirSync(form.csvDir);

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
        if(field == 'csv'){
            fs.rename(file.path, path.join(form.csvDir, file.name));
        }else{
            fs.rename(file.path, path.join(form.attachmentsDir, file.name));
        }
    });

    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        setTimeout(function(){
            cb();
        }, 100);
    });

    // parse the incoming request containing the form data
    form.parse(req, function(err, field){
        req.body = field;
    });
};