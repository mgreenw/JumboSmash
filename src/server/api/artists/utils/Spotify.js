// @flow

const config = require('config');
const querystring = require('querystring');
const axios = require('axios');
const logger = require('../../../logger');

const CLIENT_ID = config.get('spotify_client_id');
const CLIENT_SECRET = config.get('spotify_client_secret');

const BasicAuthorization = `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`;

type SpotifyAuthorization = {
  token: string,
  expiration: Date
};

let authorization: ?SpotifyAuthorization = null;
let authorizationRequest: ?Promise<SpotifyAuthorization> = null;

async function requestAuthorization(): Promise<SpotifyAuthorization> {
  try {
    logger.debug('Spotify: requesting authorization token');
    const response = await axios({
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({ grant_type: 'client_credentials' }),
      headers: {
        Authorization: BasicAuthorization,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const {
      token_type: tokenType,
      access_token: accessToken,
      expires_in: expiresIn,
    } = response.data;

    const token = `${tokenType} ${accessToken}`;

    // We subtract 20 seconds from the actual expiration to give us time to fetch
    // a new token
    const expiration = new Date(new Date().getTime() + (1000 * (expiresIn - 20)));

    return { token, expiration };
  } catch (error) {
    logger.error('Failed to get Spotify Token', error);
    throw error;
  }
}

async function getToken(): Promise<string> {
  // If there is already a token, use it.
  if (authorization) {
    if (authorization.expiration > new Date()) {
      logger.debug('Spotify: reusing cached auth token');
      return authorization.token;
    }

    // If the expiration has passed, invalidate the authorization
    authorization = null;
  }

  // If there is already an auth request, DRY.
  if (authorizationRequest) {
    await authorizationRequest;
    return getToken();
  }

  // Request authorization
  authorization = null;
  authorizationRequest = requestAuthorization();
  authorization = await authorizationRequest;
  authorizationRequest = null;

  return authorization.token;
}

async function get(resource: string): Promise<any> {
  const token = await getToken();
  try {
    const response = await axios({
      method: 'GET',
      url: `https://api.spotify.com/v1/${encodeURI(resource)}`,
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // 400 or 404 means the artist id is bad. All other responses are the fault
      // of the server.
      if (error.response.status === 404 || error.response.status === 400) {
        logger.info(`Spotify resource not found: ${resource}. Code: ${error.response.status}`);
        return null;
      }
    }

    throw error;
  }
}

function getArtist(artistId: string): Promise<any> {
  return get(`artists/${artistId}`);
}

module.exports = {
  get,
  getArtist,
};
