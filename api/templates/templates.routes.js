var express = require('express');
var router = express.Router();
var TemplatesController = require('./templates.controller');
router.get('/', TemplatesController.listTemplates);
router.post('/', TemplatesController.addTemplate);
router.delete('/:id', TemplatesController.removeTemplate);
router.put('/:id', TemplatesController.editTemplate);

module.exports = router;