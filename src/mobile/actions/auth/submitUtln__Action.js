// @flow
import { timeout } from '../../api/utils/timeout'

import { TIMEOUT,
         SERVER_ERROR,
       } from '../../api/errorResponseCodes'

import type { Dispatch } from 'redux';

export const SEND_VERIFICATION_EMAIL__INITIATE = 'SEND_VERIFICATION_EMAIL__INITIATE';
const initiate__SendVerificationEmail = () => ({
  type: SEND_VERIFICATION_EMAIL__INITIATE,
});

export const SEND_VERIFICATION_EMAIL__RESOLVE = 'SEND_VERIFICATION_EMAIL__RESOLVE';
const resolve__SendVerificationEmail = (statusCode: string, body?: Object) => ({
  type: SEND_VERIFICATION_EMAIL__RESOLVE,
  statusCode: statusCode,
  body: body,
})

export const sendVerificationEmail = (utln: string) => {
  return async (dispatch: Dispatch) => {
    // First, let Redux know we've begun an action.
    dispatch(initiate__SendVerificationEmail());

    // Temporary timeout to ensure we our setting our state for loading icon
    setTimeout(
      () => {
        timeout(1000,
          // Send a request to the server to check if UTLN is valid. If it is, send
          // a verification email, and return that email address.
          fetch('http://127.0.0.1:3000/api/auth/send-verification-email/', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              utln: utln,
            }),
          })
        )
        .then(response => response.json())
        .then((response) => {
          resolve__SendVerificationEmail(response.statusCode, response)
        });
      },
      2000
    );

    // TODO: create a standardized set of front-end routes


    // .catch(
    //   (error) => {
    //     if (error == TIMEOUT) {
    //       dispatch(failSendVerificationEmail(TIMEOUT))
    //     } else {
    //       console.log("Uncaught error");
    //       // TODO: create a catch for 'TypeError: Network request failed',
    //       // maybe as a middleware, on the timeout function itself, as a more
    //       // specific one for wrapping these requests.
    //       dispatch(failSendVerificationEmail(error))
    //     }
    //   }
    // );
  }
};
