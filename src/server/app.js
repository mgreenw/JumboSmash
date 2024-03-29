// @flow

const express = require('express');
const Sentry = require('@sentry/node');
const mung = require('express-mung');

const logger = require('./logger');
const api = require('./api');
const { notFound } = require('./api/utils');
const codes = require('./api/status-codes');
const utils = require('./utils');
const { startup, startupComplete } = require('./startup');

const NODE_ENV = utils.getNodeEnv();

const app = express();
app.use(Sentry.Handlers.requestHandler());

app.use(express.json());

// This grabs the response body and puts it into the res.body field.
app.use(mung.json((body, req, res) => {
  res.body = body;
  return body;
}, { mungError: true }));

// Log each incoming request
app.use((req, res, next) => {
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

    const responseStatus = res.body && res.body.status;
    logger.info(`${req.method} ${req.originalUrl} (${latency}ms)`, {
      httpRequest: {
        status: res.statusCode,
        requestUrl: req.originalUrl,
        requestMethod: req.method,
        remoteIp: req.connection.remoteAddress,
        latency: { seconds, nanos },
        userAgent: req.get('User-Agent'),
      },
      request: {
        body: req.body,
        user: req.user,
      },
      response: {
        code: res.statusCode,
        status: responseStatus,
        latency,
        timeout,
      },
    });

    // Log body to debug console if in development
    if (NODE_ENV === 'development') {
      const requestHasBody = Object.entries(req.body).length !== 0;
      logger.debug(`${requestHasBody ? `\nBody: ${JSON.stringify(req.body, null, 2)}` : ''}\nResponse Status: ${responseStatus}`);
    }

    logged = true;
  }

  const timeout = setTimeout(() => {
    // Send a 503 to indicate a timeout
    if (!res.finished) {
      res.status(503).send('Too many wanderers are lost.').end();
    }

    // If the request hasn't already been logged, log it.
    // This is silly, but it semes to happen that requests hit this even though
    // they already logged...maybe it's an async problem
    if (!logged) {
      logRequest(true);
    }
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

// This will ensure migrations have run before the requests are served
app.use((req, res, next) => {
  if (startupComplete) return next();
  return startup.then(next).catch(next);
});

// Define all routes here.
app.get('/ping', (req, res) => res.status(200).send("Connection successful. Go 'Bos.").end());
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
