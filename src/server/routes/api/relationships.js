// @flow

const express = require('express');

const relationshipsController = require('../../controllers/relationships');

const relationshipsRouter = express.Router();

// HAS PROFILE ONLY METHODS - defined in /api/index.js
relationshipsRouter.get('/candidates/:scene', relationshipsController.getSceneCandidates);
relationshipsRouter.get('/matches', relationshipsController.getMatches);
relationshipsRouter.post('/judge', relationshipsController.judge);

module.exports = relationshipsRouter;
