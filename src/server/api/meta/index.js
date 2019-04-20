// @flow

const express = require('express');

const sendFeedback = require('./send-feedback');
const getLaunchDate = require('./get-launch-date');

const metaRouter = express.Router();

// Authenticated methods
metaRouter.post('/feedback', sendFeedback.handler);
metaRouter.get('/launch-date', getLaunchDate.handler);

module.exports = metaRouter;
