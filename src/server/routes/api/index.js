// @flow

const express = require('express');

const authRouter = require('./auth');
const usersRouter = require('./users');
const photosRouter = require('./photos');

const apiRouter = express.Router();
const authenticated = require('../../controllers/auth/middleware/authenticated');
const hasProfile = require('../../controllers/auth/middleware/hasProfile');


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
apiRouter.use('/users', usersRouter);


// --> Profile-Only Routers <--
apiRouter.use(hasProfile);
// hasProfile: the user has gone through the required profile setup.
// Any router for which every route requires the user to have already setup
// a profile for themselves

apiRouter.use('/photos', photosRouter);

module.exports = apiRouter;
