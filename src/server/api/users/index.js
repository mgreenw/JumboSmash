// @flow

const express = require('express');

const finalizeProfileSetup = require('./finalize-profile-setup');
const getMySettings = require('./get-my-settings');
const updateMySettings = require('./update-my-settings');
const getMyProfile = require('./get-my-profile');
const updateMyProfile = require('./update-my-profile');
const getProfile = require('./get-profile');
const getMyPhotos = require('./get-my-photos');

const { hasProfile, isAfterLaunch } = require('../utils').middleware;

const usersRouter = express.Router();

// AUTHENTICATED METHODS
usersRouter.post('/me/profile', finalizeProfileSetup.handler);
usersRouter.get('/me/settings', getMySettings.handler);
usersRouter.patch('/me/settings', updateMySettings.handler);
usersRouter.get('/me/photos', getMyPhotos.handler);

// HAS PROFILE ONLY METHODS
usersRouter.use(hasProfile);

usersRouter.get('/me/profile', getMyProfile.handler);
usersRouter.patch('/me/profile', updateMyProfile.handler);

usersRouter.get('/:userId(\\d+)/profile', getProfile.handler);

// POSTLAUNCH ONLY METHODS
usersRouter.use(isAfterLaunch);

module.exports = usersRouter;
