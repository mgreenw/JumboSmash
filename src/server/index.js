// @flow

const express = require('express')
const bodyParser = require('body-parser')

const apiRouter = require('./api');

const app = express()
app.use(bodyParser.json())

app.listen(3000, () => console.log('JumboSmash Server listening on port 3000!'));


app.get('/verified', async (req, res) => {
  res.send('You have been verified! Return to the app and login.');
});
app.get('/not-verified', async (req, res) => {
  res.send('Verification failed. Try again.');
});

app.use('/api', apiRouter);
