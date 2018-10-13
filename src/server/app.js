// @flow

const express = require('express');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const api = require('./routes/api');

const app = express();
app.use(bodyParser.json());

// Define all routes here.
app.use('/', index);
app.use('/api', api);

module.exports = app;
