// @flow

const express = require('express');
const getYaks = require('./get-yaks');

const yaksRouter = express.Router();

yaksRouter.get('/', getYaks.handler);

module.exports = yaksRouter;
