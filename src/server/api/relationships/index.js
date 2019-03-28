// @flow

const express = require('express');

const getSceneCandidates = require('./get-scene-candidates');
const getMatches = require('./get-matches');
const judge = require('./judge');
const report = require('./report');
const unmatch = require('./unmatch');

const relationshipsRouter = express.Router();

// HAS PROFILE ONLY METHODS - defined in /api/index.js
relationshipsRouter.get('/candidates/:scene', getSceneCandidates.handler);
relationshipsRouter.get('/matches', getMatches.handler);
relationshipsRouter.post('/judge', judge.handler);
relationshipsRouter.post('/report', report.handler);
relationshipsRouter.post('/unmatch/:matchUserId', unmatch.handler);

module.exports = relationshipsRouter;
