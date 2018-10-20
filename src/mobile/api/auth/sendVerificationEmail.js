// @flow

// Self contained API file for sendVerificationEmail.
// NOTE: must be kept in sync with send-verifcation-email.js

import { timeout } from './../utils/timeout';

type verificationEmailResponse__SUCCESS = {
  status: string,
  email: string,
}

type verificationEmailResponse__NOT_2019 = {
  status: string,
  classYear: string,
}

type verificationEmailResponse__NOT_FOUND = {
  status: string,
}

type verificationEmailResponse__TOO_MANY_REQUESTS = {
  status: string,
  message: string,
  nextDate: string,
}


const TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS';
const SEND_VERIFICATION_EMAIL__SUCCESS = 'SEND_VERIFICATION_EMAIL__SUCCESS';
const SEND_VERIFICATION_EMAIL__UTLN_NOT_FOUND = 'SEND_VERIFICATION_EMAIL__UTLN_NOT_FOUND';
const SEND_VERIFICATION_EMAIL__UTLN_NOT_2019 = 'SEND_VERIFICATION_EMAIL__UTLN_NOT_2019';

export default function sendVerificationEmail(
  utln: string,
  callback__SUCCESS: (response: verificationEmailResponse__SUCCESS) => void,
  callback__NOT_2019: (response: verificationEmailResponse__NOT_2019) => void,
  callback__NOT_FOUND: (response: verificationEmailResponse__NOT_FOUND) => void,
  callback__TOO_MANY_REQUESTS: (response: verificationEmailResponse__TOO_MANY_REQUESTS) => void,
  callback__ERROR: (response: any) => void,
){
  return timeout(30000,
    // Send a request to the server to check if UTLN is valid. If it is, send
    // a verification email, and return that email address.
    // TODO: on dev mode hit local, on prod hit prod.
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
  .then(response => {
    // We use this to ASSERT what the type of the response is.
    switch (response.status) {
      case SEND_VERIFICATION_EMAIL__SUCCESS:
        callback__SUCCESS(response);
        break;
      case TOO_MANY_REQUESTS:
        callback__TOO_MANY_REQUESTS(response);
        break;
      case SEND_VERIFICATION_EMAIL__UTLN_NOT_FOUND:
        callback__NOT_FOUND(response);
        break;
      case SEND_VERIFICATION_EMAIL__UTLN_NOT_2019:
        callback__NOT_2019(response);
        break;
      default:
        callback__ERROR(response);
      }
    })
  .catch(error => {
    callback__ERROR(error)
  });
}
