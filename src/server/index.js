// @flow

const express = require('express');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const api = require('./routes/api');

if (process.env.NODE_ENV === undefined) {
  // TODO: Log failure
  process.exit(1);
}

const app = express();
app.use(bodyParser.json());

// Define all routes here.
app.use('/', index);
app.use('/api', api);

// Listen!
app.listen(3000, () => {
  // TODO: Log success that app is listening
  /* eslint-disable no-console */
  console.log('JumboSmash Server listening on port 3000!');
  /* eslint-enable */
});
