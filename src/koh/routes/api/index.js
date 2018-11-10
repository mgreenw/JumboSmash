// @flow

const express = require('express');

const apiRouter = express.Router();
const getUserInfo = require('../../controllers/get-user-info');

module.exports = apiRouter;

apiRouter.get('/user-info/:utln', getUserInfo);
