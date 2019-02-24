// @flow

const express = require('express');
const bodyParser = require('body-parser');

const logger = require('./logger');
const api = require('./api');

const app = express();
app.use(bodyParser.json());

// Log each incoming request
app.use((req, res, next) => {
  const body = Object.entries(req.body).length !== 0
    ? JSON.stringify(req.body, null, 2)
    : '';
  logger.info(`${req.method} ${req.url} ${body}`);
  next();
});

// Define all routes here.
app.use('/api', api);

module.exports = app;
