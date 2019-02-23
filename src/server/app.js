// @flow

const express = require('express');
const bodyParser = require('body-parser');
const aws = require('aws-sdk');
const config = require('config');

const logger = require('./logger');
const api = require('./api');

const app = express();
app.use(bodyParser.json());

aws.config.region = 'us-east-1';

// If the aws credentials are already set, don't do anything!
// If they are not, try to read them from the config file
// If the config file does not have them, exit.
if (!aws.config.credentials) {
  if (!config.has('aws_credentials')) {
    throw new Error('Could not find AWS credentials. Exiting.');
  }
  aws.config.update(config.get('aws_credentials'));
}

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
