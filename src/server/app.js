// @flow

const express = require('express');

const logger = require('./logger');
const api = require('./api');
const { notFound } = require('./api/utils');

const app = express();
app.use(express.json());

// Log each incoming request
app.use((req, res, next) => {
  const body = Object.entries(req.body).length !== 0
    ? JSON.stringify(req.body, null, 2)
    : '';

  // Log all incoming api requests!
  // The httpRequest allows Google Stackdriver to parse and display the
  // information about the API request, so we include it here.
  logger.info(`${req.method} ${req.url} ${body}`, {
    httpRequest: {
      status: res.statusCode,
      requestUrl: req.url,
      requestMethod: req.method,
      remoteIp: req.connection.remoteAddress,
      // etc.
    },
  });
  next();
});

// Define all routes here.
app.use('/api', api);

app.use(notFound);

module.exports = app;
