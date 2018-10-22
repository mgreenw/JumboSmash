// @flow

const express = require('express');

const authController = require('../../controllers/auth');

const authRouter = express.Router();

authRouter.post('/check-token-valid', authController.checkTokenValid);
authRouter.post('/send-verification-email', authController.sendVerificationEmail);
authRouter.post('/verify/', authController.verify);

module.exports = authRouter;
