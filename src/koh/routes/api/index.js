// @flow

const express = require('express');

const apiRouter = express.Router();
const getMemberInfo = require('../../controllers/get-member-info');

module.exports = apiRouter;

apiRouter.get('/member-info/:utln', getMemberInfo);
