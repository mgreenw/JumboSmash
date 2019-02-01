// @flow

const express = require('express');

const getConversation = require('./get-conversation');
const sendMessage = require('./send-message');

const messagesRouter = express.Router();

// Authenticated methods
messagesRouter.get('/:userId(\\d+$)', getConversation.handler);
messagesRouter.post('/:userId(\\d+$)', sendMessage.handler);

module.exports = messagesRouter;
