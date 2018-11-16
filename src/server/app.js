// @flow

const express = require('express');
const bodyParser = require('body-parser');

const logger = require('./logger');
const index = require('./routes/index');
const api = require('./routes/api');
const utils = require('./utils');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  const body = req.body ? JSON.stringify(req.body, null, 2) : '';
  logger.info(`${req.method} ${req.url} ${body}`);
  next();
});

// Define all routes here.
app.use('/', index);
app.use('/api', api);

module.exports = app;
