// @flow

const express = require('express');

const apiUtils = require('../utils');
const sendVerificationEmail = require('./send-verification-email');
const verify = require('./verify');
const getTokenUtln = require('./get-token-utln');


const authRouter = express.Router();

authRouter.post('/send-verification-email', sendVerificationEmail.handler);
authRouter.post('/verify', verify.handler);

authRouter.use(apiUtils.middleware.authenticated);

// PRIVATE METHODS

authRouter.get('/get-token-utln', getTokenUtln.handler);

module.exports = authRouter;
