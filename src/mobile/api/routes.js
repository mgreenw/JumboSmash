// @flow
import Expo from "expo";
const { manifest } = Expo.Constants;

// if in dev mode, use the same IP address as the hosting expo server. Otherwise,
// use prod server.
const SERVER_ROUTE = `http://server.jumbosmash.com`;

///////////////////////
// ROUTE CONSTRUCTORS:
///////////////////////

const API = "/api";
const AUTH = "/auth";
const USERS = "/users";
const PHOTOS = "/photos";

const AUTH_ROUTE = SERVER_ROUTE + API + AUTH;
const USERS_ROUTE = SERVER_ROUTE + API + USERS;
const PHOTOS_ROUTE = SERVER_ROUTE + API + PHOTOS;

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

// Photos:
const SIGN_URL = "/sign-url/";
export const GET_SIGN_URL__ROUTE = PHOTOS_ROUTE + SIGN_URL;
const CONFIRM_PHOTO = "/confirm-upload/";
export const CONFIRM_PHOTO__ROUTE = PHOTOS_ROUTE + CONFIRM_PHOTO;

// My Photos (For onboarding):
export const GET_MY_PHOTOS__ROUTE = USERS_ROUTE + MY + "/photos/";
export const GET_PHOTO__ROUTE = PHOTOS_ROUTE + "/";
export const DELETE_PHOTO__ROUTE = PHOTOS_ROUTE + "/";
