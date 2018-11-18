// @flow

const app = require('./app');

const utils = require('./utils');

const NODE_ENV = utils.getNodeEnv();

if (NODE_ENV === undefined) {
  // TODO: Log failure
  process.exit(1);
}

// Listen!
app.listen(3001, () => {
  // TODO: Log success that app is listening
  /* eslint-disable no-console */
  console.log('Koh listening on port 3001!');
  /* eslint-enable */
});
