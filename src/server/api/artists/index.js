// @flow

const express = require('express');

const searchArtists = require('./search-artists');
const getArtist = require('./get-artist');

const artistsRouter = express.Router();

artistsRouter.get('/', searchArtists.handler);
artistsRouter.get('/:artistId', getArtist.handler);

module.exports = artistsRouter;
