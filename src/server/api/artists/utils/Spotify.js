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
    if (authorization.expiration < new Date()) {
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
  const response = await axios({
    method: 'GET',
    url: `https://api.spotify.com/v1/${resource}`,
    headers: {
      Authorization: token,
    },
  });

  return response.data;
}

module.exports = {
  get,
};
