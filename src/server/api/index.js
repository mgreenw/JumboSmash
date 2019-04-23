// @flow

const express = require('express');

const authRouter = require('./auth');
const usersRouter = require('./users');
const relationshipsRouter = require('./relationships');
const photosRouter = require('./photos');
const conversationsRouter = require('./conversations');
const metaRouter = require('./meta');
const adminRouter = require('./admin');
const artistsRouter = require('./artists');

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
apiRouter.use('/artists', artistsRouter);

// --> Profile-Only Routers <--
apiRouter.use(hasProfile);
// hasProfile: the user has gone through the required profile setup.
// Any router for which every route requires the user to have already setup
// a profile for themselves
apiRouter.use('/relationships', relationshipsRouter);
apiRouter.use('/admin', adminRouter);

// --> After Launch Only Routers <--
apiRouter.use(isAfterLaunch);
// Conversations are the only routes that are truly post-launch
// We need other routes to interact with profiles and potentially relationships
// to block other users.
apiRouter.use('/conversations', conversationsRouter);

module.exports = apiRouter;
