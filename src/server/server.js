// @flow

const app = require('./app');
const logger = require('./logger');
const repl = require('./repl');
const utils = require('./utils');

const NODE_ENV = utils.getNodeEnv();

if (NODE_ENV === undefined) {
  // TODO: Log failure
  process.exit(1);
}

// Listen!
app.listen(3000, () => {
  logger.info('Listening on port 3000!');
});

repl.listen(3001, () => {
  logger.info('Repl listening on 3001');
});
