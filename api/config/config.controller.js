var fs = require('fs');
var path = require('path');
module.exports = {
    getConfig: function(req, res){
        var config = {};
        try {
            config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'config.json'), 'utf8'));
            res.status(200).json(config);
        }
        catch(error){
            res.status(500).json(JSON.parse(error));
        }
    },
    saveConfig: function(req, res){
        var config = req.body;
        try{
            fs.writeFile(path.join(__dirname,'..','..', 'config.json'), JSON.stringify(config), function(err){
                if(err) res.status(500).json({
                    error: 'UNABLE TO SAVE CONFIG TO FILE',
                    msg: 'Can\'t save the config to config.json in server'
                });
                res.status(200).json(config);
            });
        }
        catch(error){
            res.status(500).json(JSON.parse(error));
        }
    }
};