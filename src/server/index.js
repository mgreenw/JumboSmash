// @flow

const express = require('express')
const bodyParser = require('body-parser')

const apiRouter = require('./api');

const app = express()
app.use(bodyParser.json())

app.listen(3000, () => console.log('JumboSmash Server listening on port 3000!'));

app.use('/api', apiRouter);
