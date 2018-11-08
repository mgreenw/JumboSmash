// @flow

const express = require('express');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const api = require('./routes/api');
const utils = require('./utils');

const app = express();
app.use(bodyParser.json());

// In development, log all api requests to the console.
if (utils.getNodeEnv() === 'development') {
  app.use((req, res, next) => {
    const body = req.body ? JSON.stringify(req.body, null, 2) : '';
    /* eslint-disable no-console */
    console.log(`${req.method} ${req.url} ${body}`);
    /* eslint-enable */
    next();
  });
}

// Define all routes here.
app.use('/', index);
app.use('/api', api);

module.exports = app;
