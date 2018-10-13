// @flow

const express = require('express');

const indexRouter = express.Router();

indexRouter.get('/ping', async (req, res) => {
  res.send('Smash.');
});
indexRouter.get('/verified', async (req, res) => {
  res.send('You have been verified! Return to the app and login.');
});
indexRouter.get('/not-verified', async (req, res) => {
  res.send('Verification failed. Try again.');
});

module.exports = indexRouter;
