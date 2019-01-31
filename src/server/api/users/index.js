// @flow

const express = require('express');

const createMyProfile = require('./create-my-profile');
const getMySettings = require('./get-my-settings');
const updateMySettings = require('./update-my-settings');
const getMyProfile = require('./get-my-profile');
const updateMyProfile = require('./update-my-profile');
const getProfile = require('./get-profile');

const { hasProfile } = require('../utils').middleware;

const usersRouter = express.Router();

// AUTHENTICATED METHODS
usersRouter.post('/me/profile', createMyProfile.handler);

usersRouter.get('/me/settings', getMySettings.handler);
usersRouter.patch('/me/settings', updateMySettings.handler);

// HAS PROFILE ONLY METHODS
usersRouter.use(hasProfile);

usersRouter.get('/me/profile', getMyProfile.handler);
usersRouter.patch('/me/profile', updateMyProfile.handler);
usersRouter.get('/:userId(\\d+)/profile', getProfile.handler);

module.exports = {
  router: usersRouter,

  createMyProfile: createMyProfile.apply,
  getMySettings: getMySettings.apply,
  updateMySettings: updateMySettings.apply,
  getMyProfile: getMyProfile.apply,
  updateMyProfile: updateMyProfile.apply,
  getProfile: getMyProfile.apply,
};
