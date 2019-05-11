// @flow

const express = require('express');
const getYaks = require('./get-yaks');
const postYak = require('./post-yak');
const voteOnYak = require('./vote-on-yak');
const getMyYaks = require('./get-my-yaks');
const reportYak = require('./report-yak');

const yaksRouter = express.Router();

yaksRouter.get('/', getYaks.handler);
yaksRouter.post('/', postYak.handler);

yaksRouter.get('/me', getMyYaks.handler);
yaksRouter.patch('/:yakId(\\d+$)', voteOnYak.handler);
yaksRouter.post('/:yakId(\\d+)/report', reportYak.handler);

module.exports = yaksRouter;
