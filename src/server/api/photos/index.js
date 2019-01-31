// @flow

const express = require('express');

const confirmUpload = require('./confirm-upload');
const signUrl = require('./sign-url');
const getPhoto = require('./get-photo');
const deletePhoto = require('./delete-photo');
const reorderPhotos = require('./reorder-photos');

const photosRouter = express.Router();

// Authenticated methods
photosRouter.get('/confirm-upload', confirmUpload.handler);
photosRouter.get('/sign-url', signUrl.handler);
photosRouter.get('/:photoId(\\d+$)', getPhoto.handler);
photosRouter.delete('/:photoId(\\d+$)', deletePhoto.handler);
photosRouter.patch('/reorder', reorderPhotos.handler);

module.exports = {
  router: photosRouter,

  confirmUpload: confirmUpload.apply,
  signUrl: signUrl.apply,
  getPhoto: getPhoto.apply,
  deletePhoto: deletePhoto.apply,
  reorderPhotos: reorderPhotos.apply,
};
