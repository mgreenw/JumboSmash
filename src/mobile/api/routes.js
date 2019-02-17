// @flow

import Expo from 'expo';

const { manifest } = Expo.Constants;

// if in dev mode, use the same IP address as the hosting expo server. Otherwise,
// use prod server.
export const SERVER_ROUTE =
  typeof manifest.packagerOpts === 'object' && manifest.packagerOpts.dev
    ? `http://${manifest.debuggerHost
        .split(':')
        .shift()
        .concat(':3000')}`
    : 'jumbosmash.com';

// /////////////////////
// ROUTE CONSTRUCTORS:
// /////////////////////

const API = '/api';
const AUTH = '/auth';
const USERS = '/users';
const PHOTOS = '/photos';
const RELATIONSHIPS = '/relationships';

const AUTH_ROUTE = SERVER_ROUTE + API + AUTH;
const USERS_ROUTE = SERVER_ROUTE + API + USERS;
const PHOTOS_ROUTE = SERVER_ROUTE + API + PHOTOS;
const RELATIONSHIPS_ROUTE = SERVER_ROUTE + API + RELATIONSHIPS;

// //////////////
// AUTH ROUTES:
// //////////////

const SEND_VERIFCATION_EMAIL = '/send-verification-email/';
export const SEND_VERIFCATION_EMAIL__ROUTE =
  AUTH_ROUTE + SEND_VERIFCATION_EMAIL;

const GET_TOKEN_UTLN = '/get-token-utln/';
export const GET_TOKEN_UTLN__ROUTE = AUTH_ROUTE + GET_TOKEN_UTLN;

const VERIFY = '/verify/';
export const VERIFY__ROUTE = AUTH_ROUTE + VERIFY;

// //////////////
// APP ROUTES:
// //////////////
const MY = '/me';
const PROFILE = '/profile/';
export const MY_PROFILE__ROUTE = USERS_ROUTE + MY + PROFILE;

const SETTINGS = '/settings/';
export const MY_SETTINGS__ROUTE = USERS_ROUTE + MY + SETTINGS;

// Photos:
const SIGN_URL = '/sign-url/';
export const GET_SIGN_URL__ROUTE = PHOTOS_ROUTE + SIGN_URL;
const CONFIRM_PHOTO = '/confirm-upload/';
export const CONFIRM_PHOTO__ROUTE = PHOTOS_ROUTE + CONFIRM_PHOTO;

// My Photos (For onboarding):
export const GET_MY_PHOTOS__ROUTE = `${USERS_ROUTE + MY}/photos/`;
export const GET_PHOTO__ROUTE = `${PHOTOS_ROUTE}/`;
export const DELETE_PHOTO__ROUTE = `${PHOTOS_ROUTE}/`;

// Candidates:
const CANDIDATES = '/candidates/';
const SMASH = 'smash';
const SOCIAL = 'social';
const STONE = 'stone';
const SMASH_CANDIDATES__ROUTE = RELATIONSHIPS_ROUTE + CANDIDATES + SMASH;
const SOCIAL_CANDIDATES__ROUTE = RELATIONSHIPS_ROUTE + CANDIDATES + SOCIAL;
const STONE_CANDIDATES__ROUTE = RELATIONSHIPS_ROUTE + CANDIDATES + STONE;
export const SCENE_CANDIDATES__ROUTES = {
  smash: SMASH_CANDIDATES__ROUTE,
  social: SOCIAL_CANDIDATES__ROUTE,
  stone: STONE_CANDIDATES__ROUTE
};

// Matches
const MATCHES = '/matches/';
export const GET_MATCHES__ROUTE = RELATIONSHIPS_ROUTE + MATCHES;

// Judge
const JUDGE = '/judge/';
export const JUDGE_SCENE_CANDIDATE__ROUTE = RELATIONSHIPS_ROUTE + JUDGE;
