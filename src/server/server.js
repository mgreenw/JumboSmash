// @flow

const app = require('./app');

const utils = require('./utils');

const NODE_ENV = utils.getNodeEnv();

if (NODE_ENV === undefined) {
  // TODO: Log failure
  process.exit(1);
}

// Listen!
app.listen(3000, () => {
  // TODO: Log success that app is listening
  /* eslint-disable no-console */
  console.log('Listening on port 3000!');
  /* eslint-enable */
});
