// @flow

const express = require('express');

const authController = require('../../controllers/auth');
const authenticated = require('../../controllers/auth/middleware/authenticated');

const authRouter = express.Router();

// PUBLIC METHODS

authRouter.post('/send-verification-email', authController.sendVerificationEmail);
authRouter.post('/verify', authController.verify);

authRouter.use(authenticated);

// PRIVATE METHODS

authRouter.get('/get-token-utln', authController.getTokenUtln);


module.exports = authRouter;
