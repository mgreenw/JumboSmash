// @flow

const express = require('express');

const messagesController = require('../../controllers/messages');

const messagesRouter = express.Router();

// Authenticated methods
messagesRouter.get('/:userId(\\d+$)', messagesController.getConversation);
messagesRouter.post('/:userId(\\d+$)', messagesController.sendMessage);

module.exports = messagesRouter;
