var path = require('path');
var fs = require('fs');
var EmailTemplate = require('email-templates').EmailTemplate;
var nodemailer = require('nodemailer');
module.exports = {
    sendEmail: function(info,cb) {
/*{
 "config": {
    "host": "smtp.rieratuto.net",
    "port": 25,
    "secure": false,
    "tls": {
        "rejectUnauthorized": false
    },
    "auth": {
        "user": "christian@rieratuto.net",
        "pass": "27Pllsn.4"
    },
    "from": {
        "name": "RIERA TUTÓ",
        "address": "christian@rieratuto.net"
    },
    "stackSize": 100,
    "testTo": "christian@rieratuto.net"
 },
 "template": "reca-tarifas2-esES",
 "to": "christianbartrina@gmail.com",
 "cc": "test1@gmail.com,test2@gmail.com",
 "cco": "test3@gmail.com,test4@gmail.com",
 "subject": "Test email",
 "variables": {
    "test23": "testingValue1",
    "test52": "testingValue2"
 },
 "attachments": [
    {
        "filename": "Captura.PNG",
       "path": "C:\\Users\\Christian\\WebstormProjects\\API - EmailBomber\\api\\templates\\availableTemplates\\reca-tarifas2-esES\\cids\\Captura.PNG",
        "cid": "captura"
    },
    {
        "filename": "dsc_8589_low.jpg",
       "path": "C:\\Users\\Christian\\WebstormProjects\\API - EmailBomber\\api\\email\\tmp\\dsc_8589_low.jpg"
    },
    {
        "filename": "laser-cutting-b-pillar.jpg",
        "path": "C:\\Users\\Christian\\WebstormProjects\\API - EmailBomber\\api\\email\\tmp\\laser-cutting-b-pillar.jpg"
    },
    {
        "filename": "Lasercutting_in_the_automotive_industry.jpg",
        "path": "C:\\Users\\Christian\\WebstormProjects\\API - EmailBomber\\api\\email\\tmp\\Lasercutting_in_the_automotive_industry.jpg"
    },
    {
        "filename": "maxresdefault.jpg",
        "path": "C:\\Users\\Christian\\WebstormProjects\\API - EmailBomber\\api\\email\\tmp\\maxresdefault.jpg"
    }
 ]
 }*/
        var template = new EmailTemplate(path.join(__dirname, '..','templates','availableTemplates', info.template, 'structure'));
        info.config.tls = info.config.tls || {rejectUnauthorized:false} ;
        var transport = nodemailer.createTransport(info.config);

        // Send a single email
        template.render(info.variables || {}, function (err, results) {
            if (err) {
                console.log('error',err);
                //return;
            }
            results = results || {};
            results.html = results.html || fs.readFileSync(path.join(__dirname, '..', 'templates', 'availableTemplates', info.template, 'structure', 'html.ejs'));
            results.text = results.text || fs.readFileSync(path.join(__dirname, '..', 'templates', 'availableTemplates', info.template, 'structure', 'text.ejs'));

            transport.sendMail({
                from: info.config.from,
                to: info.to,
                cc: info.cc,
                bcc: info.cco,
                subject: info.subject,
                html: results.html,
                text: results.text,
                attachments: info.attachments
            },function(err, status){
                cb(err, status);
            });
        });
    }
};
