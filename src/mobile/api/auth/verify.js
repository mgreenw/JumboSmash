// @flow

import { apiRequest } from "../utils/apiRequest";
import { VERIFY__ROUTE } from "../routes";
import type { login_response } from "mobile/actions/auth/login";

type request = {
  utln: string,
  code: string
};

const VERIFY__SUCCESS = "VERIFY__SUCCESS";
const VERIFY__BAD_CODE = "VERIFY__BAD_CODE";
const VERIFY__EXPIRED_CODE = "VERIFY__EXPIRED_CODE";
const VERIFY__NO_EMAIL_SENT = "VERIFY__NO_EMAIL_SENT";

export default function verify(request: request): Promise<login_response> {
  // Send a request to the server to check if UTLN is valid. If it is, send
  // a verification email, and return that email address.
  return apiRequest("POST", VERIFY__ROUTE, null, request)
    .then(response => {
      // We use this to ASSERT what the type of the response is.
      switch (response.status) {
        case VERIFY__SUCCESS:
          return {
            statusCode: "SUCCESS",
            token: response.data.token
          };
        case VERIFY__BAD_CODE:
          return {
            statusCode: "BAD_CODE",
            token: response.data.token
          };
        case VERIFY__EXPIRED_CODE:
          return {
            statusCode: "EXPIRED_CODE",
            token: response.data.token
          };
        case VERIFY__NO_EMAIL_SENT:
          return {
            statusCode: "NO_EMAIL_SENT",
            token: response.data.token
          };
        default:
          throw { response };
      }
    })
    .catch(error => {
      throw { error, request };
    });
}
