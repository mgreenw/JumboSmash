// @flow

const express = require('express');

const authController = require('../../controllers/auth');

const authRouter = express.Router();

authRouter.post('/send-verification-email', authController.sendVerificationEmail);
authRouter.get('/verify/:code', authController.verify);

module.exports = authRouter;
