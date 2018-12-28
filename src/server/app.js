// @flow

const express = require('express');
const bodyParser = require('body-parser');

const logger = require('./logger');
const index = require('./routes/index');
const api = require('./routes/api');

const app = express();
app.use(bodyParser.json());

const aws = require('aws-sdk');
aws.config.region = 'us-east-2';

app.use((req, res, next) => {
  const body = req.body ? JSON.stringify(req.body, null, 2) : '';
  logger.info(`${req.method} ${req.url} ${body}`);
  next();
});

// Define all routes here.
app.use('/', index);
app.use('/api', api);

module.exports = app;
