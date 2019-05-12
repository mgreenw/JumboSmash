// @flow

import { Constants } from 'expo';

const manifest = Constants.manifest;

// if in dev mode, use the same IP address as the hosting expo server. Otherwise,
// use prod server.
export const SERVER_ROUTE =
  typeof manifest.packagerOpts === 'object' && manifest.packagerOpts.dev
    ? `http://${manifest.debuggerHost
        .split(':')
        .shift()
        .concat(':3000/')}`
    : 'https://server.jumbosmash.com/';

// /////////////////////
// ROUTE CONSTRUCTORS:
// /////////////////////

const API = 'api/';
const AUTH = 'auth/';
const USERS = 'users/';
const PHOTOS = 'photos/';
const RELATIONSHIPS = 'relationships/';
const CONVERSATIONS = 'conversations/';
const META = 'meta/';
const ADMIN = 'admin/';
const ARTISTS = 'artists/';
const YAKS = 'yaks/';

const AUTH_ROUTE = SERVER_ROUTE + API + AUTH;
const USERS_ROUTE = SERVER_ROUTE + API + USERS;
const PHOTOS_ROUTE = SERVER_ROUTE + API + PHOTOS;
const RELATIONSHIPS_ROUTE = SERVER_ROUTE + API + RELATIONSHIPS;
const CONVERSATIONS_ROUTE = SERVER_ROUTE + API + CONVERSATIONS;
const META_ROUTE = SERVER_ROUTE + API + META;
const ADMIN_ROUTE = SERVER_ROUTE + API + ADMIN;
export const ARTIST_ROUTE = SERVER_ROUTE + API + ARTISTS;
const YAK_ROUTE = SERVER_ROUTE + API + YAKS;

// //////////////
// AUTH ROUTES:
// //////////////

const SEND_VERIFCATION_EMAIL = 'send-verification-email/';
export const SEND_VERIFCATION_EMAIL__ROUTE =
  AUTH_ROUTE + SEND_VERIFCATION_EMAIL;

const GET_TOKEN_UTLN = 'get-token-utln/';
export const GET_TOKEN_UTLN__ROUTE = AUTH_ROUTE + GET_TOKEN_UTLN;

const VERIFY = 'verify/';
export const VERIFY__ROUTE = AUTH_ROUTE + VERIFY;

const LOGOUT = 'logout/';
export const LOGOUT__ROUTE = AUTH_ROUTE + LOGOUT;

// //////////////
// APP ROUTES:
// //////////////
const MY = 'me/';
const PROFILE = 'profile/';
export const MY_PROFILE__ROUTE = USERS_ROUTE + MY + PROFILE;

export const GET_PROFILE__ROUTE__GENERATOR = (userId: number) =>
  `${USERS_ROUTE}${userId}/${PROFILE}`;

const SETTINGS = 'settings/';
export const MY_SETTINGS__ROUTE = USERS_ROUTE + MY + SETTINGS;

// Photos:
const SIGN_URL = 'sign-url/';
export const GET_SIGN_URL__ROUTE = PHOTOS_ROUTE + SIGN_URL;
const CONFIRM_PHOTO = 'confirm-upload/';
export const CONFIRM_PHOTO__ROUTE = PHOTOS_ROUTE + CONFIRM_PHOTO;

// My Photos (For onboarding):
export const GET_MY_PHOTOS__ROUTE = USERS_ROUTE + MY + PHOTOS;
export const GET_PHOTO__ROUTE = PHOTOS_ROUTE;
export const DELETE_PHOTO__ROUTE = PHOTOS_ROUTE;

// Candidates:
const CANDIDATES = 'candidates/';
const SMASH = 'smash/';
const SOCIAL = 'social/';
const STONE = 'stone/';
const SMASH_CANDIDATES__ROUTE = RELATIONSHIPS_ROUTE + CANDIDATES + SMASH;
const SOCIAL_CANDIDATES__ROUTE = RELATIONSHIPS_ROUTE + CANDIDATES + SOCIAL;
const STONE_CANDIDATES__ROUTE = RELATIONSHIPS_ROUTE + CANDIDATES + STONE;
export const SCENE_CANDIDATES__ROUTES = {
  smash: SMASH_CANDIDATES__ROUTE,
  social: SOCIAL_CANDIDATES__ROUTE,
  stone: STONE_CANDIDATES__ROUTE
};

// Matches
const MATCHES = 'matches/';
export const GET_MATCHES__ROUTE = RELATIONSHIPS_ROUTE + MATCHES;

// Relationships:
// Judge
const JUDGE = 'judge/';
export const JUDGE_SCENE_CANDIDATE__ROUTE = RELATIONSHIPS_ROUTE + JUDGE;

// Unmatch
const UNMATCH = 'unmatch/';
export const UNMATCH__ROUTE = RELATIONSHIPS_ROUTE + UNMATCH;

// Report
const REPORT = 'report/';
export const REPORT_USER__ROUTE = RELATIONSHIPS_ROUTE + REPORT;

// Messages
export const GET_CONVERSATION = CONVERSATIONS_ROUTE;
export const SEND_MESSAGE__ROUTE = CONVERSATIONS_ROUTE;

/**
 * NOTE: this should be used for ANY message editting. For now, we only allow reading.
 */
export const READ_MESSAGE__ROUTE__GENERATOR = (
  matchUserId: number,
  messageId: number
) => `${CONVERSATIONS_ROUTE}${matchUserId}/messages/${messageId}`;

// Admin:
// Get Classmates
const CLASSMATES = 'classmates/';
export const GET_CLASSMATES_ROUTE = ADMIN_ROUTE + CLASSMATES;

const REVIEW = 'review/';
export const REVIEW_PROFILE__ROUTE__GENERATOR = (userId: number) =>
  `${ADMIN_ROUTE + CLASSMATES + userId}/${REVIEW}`;

// Send Feedback
const FEEDBACK = 'feedback/';
export const SEND_FEEDBACK__ROUTE = META_ROUTE + FEEDBACK;

const LAUNCH_DATE = 'launch-date/';
export const GET_LAUNCH_DATE__ROUTE = META_ROUTE + LAUNCH_DATE;

// Yaks:
export const GET_YAKS__ROUTE = YAK_ROUTE;
export const POST_YAK__ROUTE = YAK_ROUTE;
export const VOTE_YAK__ROUTE__GENERATOR = (yakId: number) =>
  `${YAK_ROUTE + yakId}`;
export const REPORT_YAK__ROUTE__GENERATOR = (yakId: number) =>
  `${YAK_ROUTE + yakId}/report`;
