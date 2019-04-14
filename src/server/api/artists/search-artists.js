// @flow

import type { $Request } from 'express';

const { status, asyncHandler } = require('../utils');
const codes = require('../status-codes');
const Spotify = require('./utils/Spotify');


/**
 * @api {get} /artists
 *
 */
const searchArtists = async (artistName: string) => {
  const response = await Spotify.get(`search?q=${artistName}&type=artist`);
  return status(codes.SEARCH_ARTISTS__SUCCESS).data({
    artists: response.artists.items,
  });
};

const handler = [
  asyncHandler(async (req: $Request) => {
    return searchArtists(req.query.name);
  }),
];

module.exports = {
  handler,
  apply: searchArtists,
};
