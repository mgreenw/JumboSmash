// @flow

// Self contained API file for validateToken

import { apiRequest } from "../utils/apiRequest";
import { GET_TOKEN_UTLN__ROUTE } from "../routes";
import { AUTHORIZED, UNAUTHORIZED } from "../sharedResponseCodes";

// TODO: We're not looking for server or timeout errors here.
// For now, consider ANYTHING that causes an error as a token invalidation.
// Eventually, we DON'T want this behavoir, especially for network timeouts.
// For now, this is a fine solution as we're kinda punting server error + client
// network error handling.

type validateTokenResponse__VALID = {
  status: string,
  utln: string
};

type verifyTokenResponse__INVALID = {
  status: string
};

type request = {
  token: string
};

export default function getTokenUtln(
  request: request,
  callback__AUTHORIZED: (
    response: validateTokenResponse__VALID,
    request: request
  ) => void,
  callback__UNAUTHORIZED: (
    response: verifyTokenResponse__INVALID,
    request: request
  ) => void,
  callback__ERROR: (response: any, request: request) => void
) {
  return apiRequest("GET", GET_TOKEN_UTLN__ROUTE, request.token)
    .then(response => {
      // We use this to ASSERT what the type of the response is.
      switch (response.status) {
        case AUTHORIZED:
          callback__AUTHORIZED(response, request);
          break;
        case UNAUTHORIZED:
          callback__UNAUTHORIZED(response, request);
          break;
        default:
          callback__ERROR(response, request);
      }
    })
    .catch(error => {
      callback__ERROR(error, request);
    });
}
