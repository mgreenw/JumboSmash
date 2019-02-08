// @flow

const app = require('./app');
const logger = require('./logger');

const utils = require('./utils');

const NODE_ENV = utils.getNodeEnv();

if (NODE_ENV === undefined) {
  // TODO: Log failure
  process.exit(1);
}

// Listen!
app.listen(3004, () => {
  logger.info('Listening on port 3004!');
});
