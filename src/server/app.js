// @flow

const express = require('express');
const Sentry = require('@sentry/node');

const logger = require('./logger');
const api = require('./api');
const { notFound } = require('./api/utils');
const codes = require('./api/status-codes');
const slack = require('./slack');
const utils = require('./utils');
const { version } = require('./package.json');

const NODE_ENV = utils.getNodeEnv();

const SENTRY_ENV = ['production', 'staging', 'development'];
Sentry.init({
  dsn: SENTRY_ENV.includes(NODE_ENV) ? 'https://79851436560a4133a55510f62d656e6f@sentry.io/1441637' : '',
  release: version,
  environment: NODE_ENV,
});

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

    logger.info(`${req.method} ${req.originalUrl} (${latency}ms) ${body}`, {
      httpRequest: {
        status: res.statusCode,
        requestUrl: req.originalUrl,
        requestMethod: req.method,
        remoteIp: req.connection.remoteAddress,
        latency,
        timeout,
        user: req.user,
        // etc.
      },
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
  slack.postServerUpdate(`SERVER ERROR
    Environment: *${NODE_ENV}*

    ${err.message}
    ${err.stack}
  `);
  return res.status(500).json({
    status: codes.SERVER_ERROR.status,
    version: utils.version,
  });
});


module.exports = app;
