// @flow

const express = require('express')
const bodyParser = require('body-parser')

const apiRouter = require('./api');

const app = express()
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(3000, () => console.log('Example app listening on port 3000!'))

app.use('/api', apiRouter);
