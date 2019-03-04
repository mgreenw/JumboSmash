// @flow

const app = require('./app');
const logger = require('./logger');
const socket = require('./socket');
const utils = require('./utils');

const NODE_ENV = utils.getNodeEnv();

if (NODE_ENV === undefined) {
  // TODO: Log failure
  process.exit(1);
}

// Listen!
const server = app.listen(3000, () => {
  logger.info('Listening on port 3000!');
});

// Trigger Server Build???
// Trigger it Again!!
// Another One
// Another One

socket.init(server);
