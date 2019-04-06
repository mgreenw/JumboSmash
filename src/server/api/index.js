// @flow

const express = require('express');

const authRouter = require('./auth');
const usersRouter = require('./users');
const relationshipsRouter = require('./relationships');
const photosRouter = require('./photos');
const conversationsRouter = require('./conversations');
const metaRouter = require('./meta');

const codes = require('./status-codes');
const logger = require('../logger');
const slack = require('../slack');
const utils = require('../utils');

const NODE_ENV = utils.getNodeEnv();

const { authenticated, hasProfile, isAfterLaunch } = require('./utils').middleware;


const apiRouter = express.Router();

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
apiRouter.use('/photos', photosRouter);
apiRouter.use('/meta', metaRouter);

// --> Profile-Only Routers <--
apiRouter.use(hasProfile);
// hasProfile: the user has gone through the required profile setup.
// Any router for which every route requires the user to have already setup
// a profile for themselves
apiRouter.use('/relationships', relationshipsRouter);

// --> After Launch Only Routers <--
apiRouter.use(isAfterLaunch);
// Conversations are the only routes that are truly post-launch
// We need other routes to interact with profiles and potentially relationships
// to block other users.
apiRouter.use('/conversations', conversationsRouter);

// --> Main Erro Handler! <--
/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */
apiRouter.use((err, req, res, _next) => {
  logger.error('Server Error: ', err);
  slack.postServerUpdate(`SERVER ERROR
    Environment: *${NODE_ENV}*

    ${err.message}
    ${err.stack}
  `);
  return res.status(500).json({
    status: codes.SERVER_ERROR.status,
    version: utils.version,
  });
});

module.exports = apiRouter;
