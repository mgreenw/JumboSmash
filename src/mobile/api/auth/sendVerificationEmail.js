// @flow

// Self contained API file for sendVerificationEmail.
// NOTE: must be kept in sync with send-verifcation-email.js
import { apiRequest } from "../utils/apiRequest";
import { SEND_VERIFCATION_EMAIL__ROUTE } from "../routes";
import type { sendVerificationEmail_response } from "mobile/actions/auth/sendVerificationEmail";

type request = {
  utln: string,
  forceResend?: boolean
};

// all the codes we might get back
const SEND_VERIFICATION_EMAIL__SUCCESS = "SEND_VERIFICATION_EMAIL__SUCCESS";
const SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT =
  "SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT";
const SEND_VERIFICATION_EMAIL__UTLN_NOT_FOUND =
  "SEND_VERIFICATION_EMAIL__UTLN_NOT_FOUND";
const SEND_VERIFICATION_EMAIL__UTLN_NOT_2019 =
  "SEND_VERIFICATION_EMAIL__UTLN_NOT_2019";
const SEND_VERIFICATION_EMAIL__UTLN_NOT_STUDENT =
  "SEND_VERIFICATION_EMAIL__UTLN_NOT_STUDENT";

// Helpful for debugging, easier than having a conditional type based on an enum
const NO_EMAIL = "NO EMAIL FOR THIS RESPONSE CODE";
const NO_CLASS_YEAR = "NO CLASS YEAR FOR THIS RESPONSE CODE";

export default function sendVerificationEmail(
  request: request
): Promise<sendVerificationEmail_response> {
  return apiRequest("POST", SEND_VERIFCATION_EMAIL__ROUTE, null, request)
    .then(response => {
      // We use this to ASSERT what the type of the response is.
      switch (response.status) {
        // Valid UTLN
        case SEND_VERIFICATION_EMAIL__SUCCESS:
          return {
            statusCode: "SUCCESS",
            email: response.email,
            utln: request.utln,
            classYear: NO_CLASS_YEAR
          };
        case SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT:
          return {
            statusCode: "ALREADY_SENT",
            utln: request.utln,
            email: response.email,
            classYear: NO_CLASS_YEAR
          };
        // Invalid UTLN
        case SEND_VERIFICATION_EMAIL__UTLN_NOT_FOUND:
          return {
            statusCode: "NOT_FOUND",
            email: NO_EMAIL,
            utln: request.utln,
            classYear: NO_CLASS_YEAR
          };
        case SEND_VERIFICATION_EMAIL__UTLN_NOT_STUDENT: // e.g. mgreen01
          return {
            statusCode: "NOT_STUDENT",
            email: NO_EMAIL,
            utln: request.utln,
            classYear: NO_CLASS_YEAR
          };
        case SEND_VERIFICATION_EMAIL__UTLN_NOT_2019:
          return {
            statusCode: "WRONG_CLASS_YEAR",
            classYear: response.classYear,
            email: NO_EMAIL,
            utln: request.utln
          };
        default:
          throw { response };
      }
    })
    .catch(error => {
      throw { error, request };
    });
}
