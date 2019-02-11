// @flow

const express = require('express');

const authRouter = require('./auth');
const usersRouter = require('./users');
const relationshipsRouter = require('./relationships');
const photosRouter = require('./photos');
const messagesRouter = require('./messages');

const codes = require('./status-codes');
const logger = require('../logger');

const { authenticated, hasProfile } = require('./utils').middleware;


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

// --> Profile-Only Routers <--
apiRouter.use(hasProfile);
// hasProfile: the user has gone through the required profile setup.
// Any router for which every route requires the user to have already setup
// a profile for themselves
apiRouter.use('/relationships', relationshipsRouter);
apiRouter.use('/messages', messagesRouter);

// --> Main Erro Handler! <--
/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */
apiRouter.use((err, req, res, _next) => {
  logger.error('Server Error: ', err);
  return res.status(500).json({
    status: codes.SERVER_ERROR,
  });
});

module.exports = apiRouter;
