// @flow

// Self contained API file for validateToken

import { timeout } from './../utils/timeout';

// TODO: We're not looking for server or timeout errors here.
// For now, consider ANYTHING that causes an error as a token invalidation.
// Eventually, we DON'T want this behavoir, especially for network timeouts.
// For now, this is a fine solution as we're kinda punting server error + client
// network error handling.

type validateTokenResponse__VALID = {
  status: string,
  token: string,
}

type verifyTokenResponse__INVALID = {
  status: string,
  token: string,
}

const VALIDATE_TOKEN__VALID = 'VALIDATE_TOKEN__VALID';
const VALIDATE_TOKEN__INVALID = 'VALIDATE_TOKEN__INVALID';

export default function verify(
  utln: string,
  token: string,
  callback__VALID: (response: validateTokenResponse__VALID) => void,
  callback__INVALID: (response: verifyTokenResponse__INVALID) => void,
  callback__ERROR: (response: any) => void,
){
  return timeout(30000,
    // Send a request to the server to check if UTLN is valid. If it is, send
    // a verification email, and return that email address.
    // TODO: on dev mode hit local, on prod hit prod.
    fetch('http://127.0.0.1:3000/api/auth/verify/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        utln: utln,
        token: token,
      }),
    })
  )
  .then(response => response.json())
  .then(response => {
    console.log(response);
    // We use this to ASSERT what the type of the response is.
    switch (response.status) {
      case VALIDATE_TOKEN__VALID:
        callback__VALID(response);
        break;
      case VALIDATE_TOKEN__INVALID:
        callback__INVALID(response);
        break;
      default:
        callback__ERROR(response);
      }
    })
  .catch(error => {
    callback__ERROR(error)
  });
}
