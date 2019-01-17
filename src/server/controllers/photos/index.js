// @flow

const confirmUpload = require('./confirm-upload');
const getPhoto = require('./get-photo');
const signUrl = require('./sign-url');
const deletePhoto = require('./delete-photo');
const reorderPhotos = require('./reorder-photos');

module.exports = {
  confirmUpload,
  getPhoto,
  signUrl,
  deletePhoto,
  reorderPhotos,
};
