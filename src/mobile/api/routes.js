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

("http://127.0.0.1:3000/api/auth/send-verification-email/");

///////////////////////
// ROUTE CONSTRUCTORS:
///////////////////////

const API = "/api";
const AUTH = "/auth";
const APP = "/app";

const AUTH_ROUTE = SERVER_ROUTE + API + AUTH;
const APP_ROUTE = SERVER_ROUTE + API + APP;

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
