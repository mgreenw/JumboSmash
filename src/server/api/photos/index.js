// @flow

const express = require('express');

const confirmUpload = require('./confirm-upload');
const signUrl = require('./sign-url');
const getPhoto = require('./get-photo');
const deletePhoto = require('./delete-photo');
const reorderPhotos = require('./reorder-photos');

const photosRouter = express.Router();

// Authenticated methods
// NOTE: Technically get-photo is a post-launch only method. However, because
// guessing UUIDs is statistically impossible, we do not actually need to secure
// it. Users will be able to get their photos but they won't be able to get
// other user's photos because they won't have the necessary UUIDs.

photosRouter.get('/confirm-upload', confirmUpload.handler);
photosRouter.get('/sign-url', signUrl.handler);
photosRouter.get('/:photoUuid', getPhoto.handler);
photosRouter.delete('/:photoUuid', deletePhoto.handler);
photosRouter.patch('/reorder', reorderPhotos.handler);

module.exports = photosRouter;
