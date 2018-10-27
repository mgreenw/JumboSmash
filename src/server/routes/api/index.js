// @flow

const express = require('express');

const authRouter = require('./auth');

const apiRouter = express.Router();
const authenticated = require('../../controllers/auth/middleware/authenticated');
const onboarded = require('../../controllers/auth/middleware/onboarded');


// API ROUTES

// --> Public Routers <--
// All routers that require some level of public access must be in this section
// If they want to include more specificity on which routes require
// authentication or onboarding, they may use the middleware directly.
apiRouter.use('/auth', authRouter);


// --> Authenticated Routers <--
apiRouter.use(authenticated);
// Authenticated: a user has verified that they are the user for that utln
// All routers that require some level of public access must be in this section
// If they want to include more specificity on which routes require
// authentication or onboarding, they may use the middleware directly.


// --> Onboarded Routers <--
apiRouter.use(onboarded);
// Onboarded: the user has gone through the required profile setup.
// Any router for which every route requires the user to be onboarded should
// go in this section

module.exports = apiRouter;
