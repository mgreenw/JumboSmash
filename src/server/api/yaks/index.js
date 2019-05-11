// @flow

const express = require('express');
const getYaks = require('./get-yaks');
const postYak = require('./post-yak');
const voteOnYak = require('./vote-on-yak');
const getMyYaks = require('./get-my-yaks');

const yaksRouter = express.Router();

yaksRouter.get('/', getYaks.handler);
yaksRouter.post('/', postYak.handler);

yaksRouter.get('/me', getMyYaks.handler);
yaksRouter.patch('/:yakId(\\d+$)', voteOnYak.handler);

module.exports = yaksRouter;
