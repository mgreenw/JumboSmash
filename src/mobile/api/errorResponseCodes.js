// @flow

////////////
// SHARED //
////////////
export const SERVER_ERROR = 'SERVER_ERROR';
export const BAD_REQUEST = 'BAD_REQUEST';
export const TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS';

// TIMTEOUT is special -- we won't recieve this from the server, only from our
//  middleware timeout function. Used to handle aborting a Fetch request.
export const TIMEOUT = 'TIMEOUT'
