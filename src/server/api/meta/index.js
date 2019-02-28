// @flow

const express = require('express');

const sendFeedback = require('./send-feedback');

const metaRouter = express.Router();

// Authenticated methods
metaRouter.post('/feedback', sendFeedback.handler);

module.exports = metaRouter;
