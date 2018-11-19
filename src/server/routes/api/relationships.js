// @flow

const express = require('express');

const relationshipsController = require('../../controllers/relationships');

const relationshipsRouter = express.Router();

// HAS PROFILE ONLY METHODS - defined in /api/index.js
relationshipsRouter.get('/candidates/:scene', relationshipsController.getSceneCandidates);

module.exports = relationshipsRouter;
