// @flow

const express = require('express');

const authRouter = require('./auth');

const apiRouter = express.Router();
const authenticated = require('../../controllers/auth/middleware/authenticated');
const onboarded = require('../../controllers/auth/middleware/onboarded');

// The order here is important
apiRouter.use('/auth', authRouter);

// Authenticated: a user has verified that they are the user for that utln
// Onboarded: the user has gone through the required profile setup.
apiRouter.use(authenticated);
apiRouter.use(onboarded);

apiRouter.get('/ping', (req, res) => {
  res.send(200).json({
    status: 'woo',
  });
});

module.exports = apiRouter;
