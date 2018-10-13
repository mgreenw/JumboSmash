// @flow

const express = require('express');

const authController = require('../../controllers/auth');

const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.get('/verify/:hash', authController.verify);
authRouter.post('/login', authController.login);

module.exports = authRouter;
