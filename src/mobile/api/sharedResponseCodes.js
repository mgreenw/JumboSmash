// @flow

// //////////
// SHARED //
// //////////
export const SERVER_ERROR = 'SERVER_ERROR';
export const BAD_REQUEST = 'BAD_REQUEST';

// TIMTEOUT is special -- we won't recieve this from the server, only from our
//  middleware timeout function. Used to handle aborting a Fetch request.
export const TIMEOUT = 'TIMEOUT';

// These are used for two purposes:
// 1) for the get-token-utln API
// 2) as middleware for any API call going to the app API (not the auth API).
export const AUTHORIZED = 'AUTHORIZED';
export const UNAUTHORIZED = 'UNAUTHORIZED';

export const TERMINATED = 'TERMINATED';
export const BIRTHDAY_UNDER_18 = 'BIRTHDAY_UNDER_18';

export const NETWORK_REQUEST_FAILED = 'NETWORK_REQUEST_FAILED';
