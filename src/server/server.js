// @flow

const Sentry = require('@sentry/node');

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

if (NODE_ENV === undefined) {
  // TODO: Log failure
  process.exit(1);
}

// Listen!
const server = app.listen(3000, () => {
  logger.info('Listening on port 3000!');
});

socket.init(server);
