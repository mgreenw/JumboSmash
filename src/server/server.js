// @flow

const app = require('./app');

if (process.env.NODE_ENV === undefined) {
  // TODO: Log failure
  process.exit(1);
}

// Listen!
app.listen(3000, () => {
  // TODO: Log success that app is listening
  /* eslint-disable no-console */
  console.log('JumboSmash Server listening on port 3000!');
  /* eslint-enable */
});
