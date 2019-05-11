// @flow

const express = require('express');
const getYaks = require('./get-yaks');
const postYak = require('./post-yak');

const yaksRouter = express.Router();

yaksRouter.get('/', getYaks.handler);
yaksRouter.post('/', postYak.handler);

module.exports = yaksRouter;
