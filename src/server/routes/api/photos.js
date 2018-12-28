// @flow

const express = require('express');

const photosController = require('../../controllers/photos');

const photosRouter = express.Router();

// HAS PROFILE ONLY METHODS
photosRouter.post('/confirm-upload', photosController.confirmUpload);
photosRouter.get('/sign-url', photosController.signUrl);
photosRouter.get('/:photoId', photosController.getPhoto);

module.exports = photosRouter;
