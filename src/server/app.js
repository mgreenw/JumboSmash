// @flow

const express = require('express');
const Sentry = require('@sentry/node');

const logger = require('./logger');
const api = require('./api');
const { notFound } = require('./api/utils');
const codes = require('./api/status-codes');
const utils = require('./utils');

const app = express();
app.use(Sentry.Handlers.requestHandler());

app.use(express.json());

// Log each incoming request
app.use((req, res, next) => {
  const body = Object.entries(req.body).length !== 0
    ? JSON.stringify(req.body, null, 2)
    : '';
  const start = new Date().getTime();
  let logged = false;

  Sentry.getHubFromCarrier(req).configureScope((scope) => {
    scope.setTag('method', req.method);
    scope.setTag('url', req.originalUrl);
  });

  function logRequest(timeout: boolean = false) {
    if (logged) {
      return;
    }

    // Calculate the latency
    const end = new Date().getTime();
    const latency = end - start;

    // Nanos represents the remaining nanos after seconds is counted.
    // This is somewhat silly but Google requires this format
    const seconds = Math.floor(latency / 1000);
    const nanos = (latency - (seconds * 1000)) * 1000000;

    logger.info(`${req.method} ${req.originalUrl} (${latency}ms) ${body}`, {
      httpRequest: {
        status: res.statusCode,
        requestUrl: req.originalUrl,
        requestMethod: req.method,
        remoteIp: req.connection.remoteAddress,
        latency: { seconds, nanos },
        // etc.
      },
      timeout,
      user: req.user,
    });

    logged = true;
  }

  const timeout = setTimeout(() => {
    res.status(503).send('Too many wanderers are lost.').end();
    logRequest(true);
  }, 30000);

  // Log all incoming api requests!
  // The httpRequest allows Google Stackdriver to parse and display the
  // information about the API request, so we include it here.
  res.on('finish', () => {
    clearTimeout(timeout);
    logRequest();
  });
  next();
});

// Define all routes here.
app.use('/api', api);
app.use(notFound);

// --> Main Error Handler! <--
/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */
app.use(Sentry.Handlers.errorHandler());
app.use((err, req, res, _next) => {
  logger.error('Server Error: ', err);
  return res.status(500).json({
    status: codes.SERVER_ERROR.status,
    version: utils.version,
  });
});


module.exports = app;
