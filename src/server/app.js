// @flow

const express = require('express');
const bodyParser = require('body-parser');
const aws = require('aws-sdk');

const logger = require('./logger');
const api = require('./api');

const app = express();
app.use(bodyParser.json());

aws.config.region = 'us-east-1';

app.use((req, res, next) => {
  const body = req.body ? JSON.stringify(req.body, null, 2) : '';
  logger.info(`${req.method} ${req.url} ${body}`);
  next();
});

// Define all routes here.
app.use('/api', api.router);

module.exports = app;
