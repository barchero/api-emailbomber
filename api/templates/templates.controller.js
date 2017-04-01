var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var unzip = require('unzipper');
var rimraf = require('rimraf');
module.exports = {
    listTemplates: function(req, res){
        var response = [];
        var folders = fs.readdirSync(path.join(__dirname, 'availableTemplates'));
        for(var folderIndex in folders){
            var folder = folders[folderIndex];
            if(fs.lstatSync(path.join(__dirname, 'availableTemplates', folder)).isDirectory()) {
                response.push(JSON.parse(fs.readFileSync(path.join(__dirname, 'availableTemplates', folder, 'meta.json'), 'utf8')));
            }
        }
        res.json(response);
    },
    addTemplate: function(req, res){
        cleanTempFolders(function(){
            uploadData(req, function(fileName){
                if(fileName.indexOf(" ") == -1) {
                    if (!fs.existsSync(path.join(__dirname, 'tmp', fileName.split('.')[0]))) {
                        unzipFile(fileName, path.join(__dirname, 'tmp', fileName.split('.')[0]), function () {
                            var fileList = walkSync(path.join(__dirname, 'tmp', fileName.split('.')[0]));
                            if (fileList.indexOf('cids') !== -1 &&
                                fileList.indexOf('structure') !== -1 &&
                                fileList.indexOf('html.ejs') !== -1 &&
                                fileList.indexOf('text.ejs') !== -1) {
                                unzipFile(fileName, path.join(__dirname, 'availableTemplates', fileName.split('.')[0]), function () {
                                    rimraf(path.join(__dirname, 'tmp', '*'), function () {
                                        if (fileList.indexOf('meta.json') !== -1) {
                                            readMetaFile(fileName.split('.')[0], function (templateFolder, meta) {
                                                var data = {
                                                    name: req.body.name || '',
                                                    creationDate: new Date().toString(),
                                                    variables: JSON.parse(req.body.variables || "[]")
                                                };
                                                data = Object.assign(data, meta);
                                                data.id = templateFolder;
                                                generateMetaFile(templateFolder, data, function (meta) {
                                                    res.status(200).json(meta);
                                                });
                                            });
                                        } else {
                                            generateMetaFile(fileName.split('.')[0], {
                                                id: fileName.split('.')[0],
                                                name: req.body.name || '',
                                                creationDate: new Date().toString(),
                                                variables: JSON.parse(req.body.variables || "[]")
                                            }, function (meta) {
                                                res.status(200).json(meta);
                                            })
                                        }

                                    });
                                });
                            } else {
                                rimraf(path.join(__dirname, 'tmp', '*'), function () {
                                    res.status(400).json({
                                        error: "INVALID STRUCTURE",
                                        msg: "The zip file structure is invalid"
                                    });
                                });
                            }
                        })
                    } else {
                        res.status(400).json({
                            error: "DUPLICATED TEMPLATE",
                            msg: "Already exists a template with the same name in the server. Please change the zip file name"
                        });
                    }
                }else{
                    res.status(400).json({
                        error: "TEMPLATE NAME WITH SPACES",
                        msg: "Template name can\'t contain spaces. Please change the zip file name"
                    });
                }
            });
        });
    },
    removeTemplate: function(req, res){
        var template = req.params.id;
        if(template) {
            if (fs.existsSync(path.join(__dirname, 'availableTemplates', template))){
                rimraf(path.join(__dirname, 'availableTemplates', template), function () {
                    res.status(200).send();
                })
            }else{
                res.status(400).json({
                    error: 'TEMPLATE NOT FOUND',
                    msg: 'The template name specified can\'t be found'
                })
            }
        }else{
            res.status(400).json({
                error: 'TEMPLATE NOT SPECIFIED',
                msg: 'Template name must be specified in URL'
            })
        }
    },
    editTemplate: function(req, res){
        var template = req.params.id;
        if(template) {
            readMetaFile(template, function (templateFolder, meta) {
                var data = {
                    name: req.body.name || '',
                    variables: typeof req.body.variables === "string" ? JSON.parse(req.body.variables || "[]") : req.body.variables
                };
                data = Object.assign(meta, data);
                fs.truncate(path.join(__dirname, 'availableTemplates', template, 'meta.json'), 0, function() {
                    generateMetaFile(templateFolder, data, function (meta) {
                        res.status(200).json(meta);
                    });
                });
            });
        }else{
            res.status(400).json({
                error: 'TEMPLATE NOT SPECIFIED',
                msg: 'Template name must be specified in URL'
            })
        }
    }
};
////////////////////////////
////Add Template methods////
////////////////////////////
var readMetaFile = function(templateFolder, cb){
  fs.readFile(path.join(__dirname, 'availableTemplates', templateFolder, 'meta.json'),'utf8', function(err,data){
      cb(templateFolder, JSON.parse(data || {}));
  })
};
var generateMetaFile = function(templateFolder, data, cb){
    var json = JSON.stringify(data);
    fs.writeFile(path.join(__dirname, 'availableTemplates', templateFolder, 'meta.json'), json, 'utf8', function () {
        cb(data);
    });
};
// List all files in a directory in Node.js recursively in a synchronous fashion
var walkSync = function(dir, filelist) {
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        filelist.push(file);
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            filelist = walkSync(dir + '/' + file, filelist);
        }
    });
    return filelist;
};
var unzipFile = function(fileName, dest, cb){
    fs.createReadStream(path.join(__dirname, 'tmp', fileName))
        .pipe(unzip.Extract({
            path: dest
        }))
    .on('close', function(){
        setTimeout( function(){
            cb();
        }, 100);
    });
};
var cleanTempFolders = function(cb){
    rimraf(path.join(__dirname, 'tmp', '*'), cb);
};
var uploadData = function(req, cb){
    // create an incoming form object
    var form = new formidable.IncomingForm();

    var fileName = "";

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, 'tmp');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
        if(fileName.length <= 0){ fileName = file.name}
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        setTimeout(function(){
            cb(fileName);
        }, 100);
    });

    // parse the incoming request containing the form data
    form.parse(req, function(err, field){
        req.body = field;
    });
};
////////////////////////////
////////////////////////////
////////////////////////////