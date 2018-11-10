// @flow

const express = require('express');

const indexRouter = express.Router();

indexRouter.get('/ping', async (req, res) => {
  res.send('Smash.');
});

module.exports = indexRouter;
