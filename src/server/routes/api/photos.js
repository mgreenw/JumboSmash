// @flow

const express = require('express');

const photosController = require('../../controllers/photos');

const photosRouter = express.Router();

// HAS PROFILE ONLY METHODS
photosRouter.get('/confirm-upload', photosController.confirmUpload);
photosRouter.get('/sign-url', photosController.signUrl);
photosRouter.get('/:photoId', photosController.getPhoto);
photosRouter.delete('/:photoId', photosController.deletePhoto);
photosRouter.patch('/reorder', photosController.reorderPhotos);

module.exports = photosRouter;
