// @flow

// Self contained API file for sendVerificationEmail.
// NOTE: must be kept in sync with send-verifcation-email.js

import { timeout } from './../utils/timeout';

type verifyResponse__SUCCESS = {
  status: string,
  token: any,
}

type verifyResponse__BAD_CODE = {
  status: string,
}

type verifyResponse__NO_EMAIL_SENT = {
  status: string,
  utln: string,
}

type verifyResponse__EXPIRED_CODE = {
  status: string,
}


const VERIFY__SUCCESS = 'VERIFY__SUCCESS';
const VERIFY__BAD_CODE = 'VERIFY__BAD_CODE';
const VERIFY__EXPIRED_CODE = 'VERIFY__EXPIRED_CODE';
const VERIFY__NO_EMAIL_SENT = 'VERIFY__NO_EMAIL_SENT';

export default function verify(
  utln: string,
  code: string,
  callback__SUCCESS: (response: verifyResponse__SUCCESS) => void,
  callback__BAD_CODE: (response: verifyResponse__BAD_CODE) => void,
  callback__EXPIRED_CODE: (response: verifyResponse__EXPIRED_CODE) => void,
  callback__NO_EMAIL_SENT: (response: verifyResponse__NO_EMAIL_SENT) => void,
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
        code: code,
      }),
    })
  )
  .then(response => response.json())
  .then(response => {
    console.log(response);
    // We use this to ASSERT what the type of the response is.
    switch (response.status) {
      case VERIFY__SUCCESS:
        callback__SUCCESS(response);
        break;
      case VERIFY__BAD_CODE:
        callback__BAD_CODE(response);
        break;
      case VERIFY__EXPIRED_CODE:
        callback__EXPIRED_CODE(response);
        break;
      case VERIFY__NO_EMAIL_SENT:
        callback__NO_EMAIL_SENT(response);
        break;
      default:
        callback__ERROR(response);
      }
    })
  .catch(error => {
    callback__ERROR(error)
  });
}
