// @flow

import { apiRequest } from "../utils/apiRequest";
import { VERIFY__ROUTE } from "../routes";

type verifyResponse__SUCCESS = {
  status: string,
  token: any
};

type verifyResponse__BAD_CODE = {
  status: string
};

type verifyResponse__NO_EMAIL_SENT = {
  status: string
};

type verifyResponse__EXPIRED_CODE = {
  status: string
};

type request = {
  utln: string,
  code: string
};

const VERIFY__SUCCESS = "VERIFY__SUCCESS";
const VERIFY__BAD_CODE = "VERIFY__BAD_CODE";
const VERIFY__EXPIRED_CODE = "VERIFY__EXPIRED_CODE";
const VERIFY__NO_EMAIL_SENT = "VERIFY__NO_EMAIL_SENT";

export default function verify(
  request: request,
  callback__SUCCESS: (
    response: verifyResponse__SUCCESS,
    request: request
  ) => void,
  callback__BAD_CODE: (
    response: verifyResponse__BAD_CODE,
    request: request
  ) => void,
  callback__EXPIRED_CODE: (
    response: verifyResponse__EXPIRED_CODE,
    request: request
  ) => void,
  callback__NO_EMAIL_SENT: (
    response: verifyResponse__NO_EMAIL_SENT,
    request: request
  ) => void,
  callback__ERROR: (error: any, request: request) => void
) {
  // Send a request to the server to check if UTLN is valid. If it is, send
  // a verification email, and return that email address.
  return apiRequest("POST", VERIFY__ROUTE, null, request)
    .then(response => {
      // We use this to ASSERT what the type of the response is.
      switch (response.status) {
        case VERIFY__SUCCESS:
          callback__SUCCESS(response, request);
          break;
        case VERIFY__BAD_CODE:
          callback__BAD_CODE(response, request);
          break;
        case VERIFY__EXPIRED_CODE:
          callback__EXPIRED_CODE(response, request);
          break;
        case VERIFY__NO_EMAIL_SENT:
          callback__NO_EMAIL_SENT(response, request);
          break;
        default:
          callback__ERROR(response, request);
      }
    })
    .catch(error => {
      callback__ERROR(error, request);
    });
}
