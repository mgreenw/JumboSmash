// @flow

const Sentry = require('@sentry/node');
const { startup } = require('./startup');

const utils = require('./utils');
const { version } = require('./package.json');

const NODE_ENV = utils.getNodeEnv();

// Initialize Sentry immediately so we can catch uncaught exceptions
const SENTRY_ENV = ['production', 'development'];
Sentry.init({
  dsn: SENTRY_ENV.includes(NODE_ENV) ? 'https://79851436560a4133a55510f62d656e6f@sentry.io/1441637' : '',
  release: version,
  environment: NODE_ENV,
});

const app = require('./app');
const logger = require('./logger');
const socket = require('./socket');
const redis = require('./redis');
const db = require('./db');
const expo = require('./expo');

if (NODE_ENV === undefined) {
  // TODO: Log failure
  process.exit(1);
}

// Listen!
const server = app.listen(3000, () => {
  logger.info('Listening on port 3000!');
});

// Only start the socket once startup is complete
startup.then(() => {
  socket.init(server);
});


function closeServer(reason) {
  logger.debug('Closing server...', reason);
  socket.close().then(() => {
    logger.debug('Closed all socket connections.');
    server.close(() => {
      logger.debug('Closed server.');
      Promise.all([
        redis.shared.quit(),
        new Promise(resolve => db.end(resolve)),
        expo.close(),
      ]).then(() => {
        logger.debug('Successfully exited Redis, Database, and Expo.');
      });
    });
  });
}

process.on('SIGTERM', () => closeServer('SIGTERM'));
process.on('SIGINT', () => closeServer('SIGINT'));
