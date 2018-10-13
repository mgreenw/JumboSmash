// @flow

const express = require('express');

const authRouter = require('./auth');

const apiRouter = express.Router();
const authenticated = require('../../controllers/auth/middleware/authenticated');

// The order here is important
apiRouter.use('/auth', authRouter);

// All authenticated endpoints must come after this next line. This is special
apiRouter.use(authenticated);

module.exports = apiRouter;
