// @flow

const express = require('express');

const getSceneCandidates = require('./get-scene-candidates');
const getMatches = require('./get-matches');
const judge = require('./judge');
const report = require('./report');
const unmatch = require('./unmatch');

const { isAfterLaunch } = require('../utils').middleware;

const relationshipsRouter = express.Router();

// HAS PROFILE ONLY METHODS - defined in /api/index.js
relationshipsRouter.post('/report', report.handler);

// POSTLAUNCH ONLY METHODS
relationshipsRouter.use(isAfterLaunch);

relationshipsRouter.get('/candidates/:scene', getSceneCandidates.handler);
relationshipsRouter.get('/matches', getMatches.handler);
relationshipsRouter.post('/judge', judge.handler);
relationshipsRouter.post('/unmatch/:matchUserId(\\d+$)', unmatch.handler);

module.exports = relationshipsRouter;
