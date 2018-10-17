// @flow
import type { Dispatch } from 'redux';
import { TIMEOUT } from './errors'
import { timeout } from './timeout'

export const SEND_VERIFICATION_EMAIL__INITIATE = 'SEND_VERIFICATION_EMAIL__INITIATE';
export const initiateSendVerificationEmail = () => ({
  type: SEND_VERIFICATION_EMAIL__INITIATE,
});

export const SEND_VERIFICATION_EMAIL__SUCCESS = 'SEND_VERIFICATION_EMAIL__SUCCESS';
export const succeedSendVerificationEmail = (email: string) => ({
  type: SEND_VERIFICATION_EMAIL__SUCCESS,
  email: email,
});

export const SEND_VERIFICATION_EMAIL__FAILURE = 'SEND_VERIFICATION_EMAIL__FAILURE';
export const failSendVerificationEmail = (errorMessage: string) => ({
  type: SEND_VERIFICATION_EMAIL__FAILURE,
  errorMessage: errorMessage,
});

export const sendVerificationEmail = (utln: string) => {
  return async (dispatch: Dispatch) => {
    // First, let Redux know we've begun an action.
    dispatch(initiateSendVerificationEmail());

    // Send a request to the server to check if UTLN is valid. If it is, send
    // a verification email, and return that email address.

    // TODO: create a standardized set of front-end routes
    timeout(1000,
      fetch('http://127.0.0.1:3000/api/auth/send-verification-email/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          utln: utln,
        }),
      }))
    .then(response => response.json())
    .then(response => {
      console.log(response);
    });

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
