var express = require('express');
apiRouter = express.Router();

var templatesRouter = require('./templates/templates.routes');
apiRouter.use('/templates',templatesRouter);

var emailRouter = require('./email/email.routes');
apiRouter.use('/email', emailRouter);

var configRouter = require('./config/config.routes');
apiRouter.use('/config',configRouter);

module.exports = apiRouter;