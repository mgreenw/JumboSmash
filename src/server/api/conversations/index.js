// @flow

const express = require('express');

const getConversation = require('./get-conversation');
const sendMessage = require('./send-message');

const conversationsRouter = express.Router();

// Authenticated methods
conversationsRouter.get('/:userId(\\d+$)', getConversation.handler);
conversationsRouter.post('/:userId(\\d+$)', sendMessage.handler);

module.exports = conversationsRouter;
