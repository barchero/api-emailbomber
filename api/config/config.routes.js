var express = require('express');
var router = express.Router();
var configController = require('./config.controller');
router.get('/', configController.getConfig);
router.post('/', configController.saveConfig);

module.exports = router;