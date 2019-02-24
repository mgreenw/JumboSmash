// @flow

const express = require('express');

const reportUser = require('./report-user');
const sendFeedback = require('./send-feedback');

const metaRouter = express.Router();

// Authenticated methods
metaRouter.post('/report', reportUser.handler);
metaRouter.post('/feedback', sendFeedback.handler);

module.exports = metaRouter;
