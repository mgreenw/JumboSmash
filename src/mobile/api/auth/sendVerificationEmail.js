// @flow

// Self contained API file for sendVerificationEmail.
// NOTE: must be kept in sync with send-verifcation-email.js
import { apiRequest } from "../utils/apiRequest";
import { SEND_VERIFCATION_EMAIL__ROUTE } from "../routes";

type verificationEmailResponse__SUCCESS = {
  status: string,
  email: string
};

type verificationEmailResponse__EMAIL_ALREADY_SENT = {
  status: string,
  email: string
};

type verificationEmailResponse__NOT_2019 = {
  status: string,
  classYear: string
};

type verificationEmailResponse__NOT_FOUND = {
  status: string
};

type request = {
  utln: string,
  forceResend?: boolean
};

const SEND_VERIFICATION_EMAIL__SUCCESS = "SEND_VERIFICATION_EMAIL__SUCCESS";
const SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT =
  "SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT";
const SEND_VERIFICATION_EMAIL__UTLN_NOT_FOUND =
  "SEND_VERIFICATION_EMAIL__UTLN_NOT_FOUND";
const SEND_VERIFICATION_EMAIL__UTLN_NOT_2019 =
  "SEND_VERIFICATION_EMAIL__UTLN_NOT_2019";

export default function sendVerificationEmail(
  request: request,
  callback__SUCCESS: (
    response: verificationEmailResponse__SUCCESS,
    request: request
  ) => void,
  callback__NOT_2019: (
    response: verificationEmailResponse__NOT_2019,
    request: request
  ) => void,
  callback__NOT_FOUND: (
    response: verificationEmailResponse__NOT_FOUND,
    request: request
  ) => void,
  callback__EMAIL_ALREADY_SENT: (
    response: verificationEmailResponse__EMAIL_ALREADY_SENT,
    request: request
  ) => void,
  callback__ERROR: (response: any, request: request) => void
) {
  return apiRequest("POST", SEND_VERIFCATION_EMAIL__ROUTE, null, request)
    .then(response => {
      // We use this to ASSERT what the type of the response is.
      switch (response.status) {
        case SEND_VERIFICATION_EMAIL__SUCCESS:
          callback__SUCCESS(response, request);
          break;
        case SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT:
          callback__EMAIL_ALREADY_SENT(response, request);
          break;
        case SEND_VERIFICATION_EMAIL__UTLN_NOT_FOUND:
          callback__NOT_FOUND(response, request);
          break;
        case SEND_VERIFICATION_EMAIL__UTLN_NOT_2019:
          callback__NOT_2019(response, request);
          break;
        default:
          callback__ERROR(response, request);
      }
    })
    .catch(error => {
      callback__ERROR(error, request);
    });
}
