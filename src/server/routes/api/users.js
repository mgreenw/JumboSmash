// @flow

const express = require('express');

const usersController = require('../../controllers/users');
const hasProfile = require('../../controllers/auth/middleware/hasProfile');

const usersRouter = express.Router();

// AUTHENTICATED METHODS
usersRouter.post('/me/profile', usersController.createMyProfile);

usersRouter.get('/me/settings', usersController.getMySettings);
usersRouter.patch('/me/settings', usersController.updateMySettings);

// HAS PROFILE ONLY METHODS
usersRouter.use(hasProfile);

usersRouter.get('/me/profile', usersController.getMyProfile);
usersRouter.patch('/me/profile', usersController.updateMyProfile);
usersRouter.get('/:userId(\\d+)/profile', usersController.getProfile);

module.exports = usersRouter;
