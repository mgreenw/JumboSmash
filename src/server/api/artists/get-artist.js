// @flow

import type { $Request } from 'express';

const { status, asyncHandler } = require('../utils');
const codes = require('../status-codes');
const Spotify = require('./utils/Spotify');

/**
 * @api {get} /artists/:artistid
 *
 */
const getArtist = async (artistId: string) => {
  const response = await Spotify.getArtist(artistId);
  if (!response) {
    return status(codes.GET_ARTIST__NOT_FOUND).noData();
  }

  return status(codes.GET_ARTIST__SUCCESS).data({
    artist: response,
  });
};

const handler = [
  asyncHandler(async (req: $Request) => {
    return getArtist(req.params.artistId);
  }),
];

module.exports = {
  handler,
  apply: getArtist,
};
