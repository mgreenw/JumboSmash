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
  const start = new Date().getTime();
  let logged = false;

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

module.exports = app;
