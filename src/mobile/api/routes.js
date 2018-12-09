// @flow
import Expo from "expo";
const { manifest } = Expo.Constants;

// if in dev mode, use the same IP address as the hosting expo server. Otherwise,
// use prod server.
const SERVER_ROUTE =
  typeof manifest.packagerOpts === `object` && manifest.packagerOpts.dev
    ? "http://" +
      manifest.debuggerHost
        .split(`:`)
        .shift()
        .concat(`:3000`)
    : `jumbosmash.com`;

///////////////////////
// ROUTE CONSTRUCTORS:
///////////////////////

const API = "/api";
const AUTH = "/auth";
const USERS = "/users";
const RELATIONSHIPS = "/relationships";

const AUTH_ROUTE = SERVER_ROUTE + API + AUTH;
const USERS_ROUTE = SERVER_ROUTE + API + USERS;
const RELATIONSHIPS_ROUTE = SERVER_ROUTE + API + RELATIONSHIPS;

////////////////
// AUTH ROUTES:
////////////////

const SEND_VERIFCATION_EMAIL = "/send-verification-email/";
export const SEND_VERIFCATION_EMAIL__ROUTE =
  AUTH_ROUTE + SEND_VERIFCATION_EMAIL;

const GET_TOKEN_UTLN = "/get-token-utln/";
export const GET_TOKEN_UTLN__ROUTE = AUTH_ROUTE + GET_TOKEN_UTLN;

const VERIFY = "/verify/";
export const VERIFY__ROUTE = AUTH_ROUTE + VERIFY;

////////////////
// APP ROUTES:
////////////////
const MY = "/me";
const PROFILE = "/profile/";
export const MY_PROFILE__ROUTE = USERS_ROUTE + MY + PROFILE;

const SETTINGS = "/settings/";
export const MY_SETTINGS__ROUTE = USERS_ROUTE + MY + SETTINGS;

const CANDIDATES = "/candidates";
const CANDIDATES__ROUTE = RELATIONSHIPS_ROUTE + CANDIDATES;
const SMASH = "/smash/";
const SOCIAL = "/social/";
const STONE = "/stone/";

export const SMASH_CANDIDATES__ROUTE = CANDIDATES__ROUTE + SMASH;
export const SOCIAL_CANDIDATES__ROUTE = CANDIDATES__ROUTE + SOCIAL;
export const STONE_CANDIDATES__ROUTE = CANDIDATES__ROUTE + STONE;
