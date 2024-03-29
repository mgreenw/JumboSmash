// @flow

// Self contained API file for sendVerificationEmail.
// NOTE: must be kept in sync with send-verifcation-email.js
import type { SendVerificationEmail_Response } from 'mobile/actions/auth/sendVerificationEmail';
import { BAD_REQUEST } from 'mobile/api/sharedResponseCodes';
import Sentry from 'sentry-expo';
import apiRequest from '../utils/apiRequest';
import { SEND_VERIFCATION_EMAIL__ROUTE } from '../routes';

type Request = {|
  email: string,
  forceResend?: boolean
|};

// all the codes we might get back
const SEND_VERIFICATION_EMAIL__SUCCESS = 'SEND_VERIFICATION_EMAIL__SUCCESS';
const SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT =
  'SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT';
const SEND_VERIFICATION_EMAIL__EMAIL_NOT_FOUND =
  'SEND_VERIFICATION_EMAIL__EMAIL_NOT_FOUND';
const SEND_VERIFICATION_EMAIL__EMAIL_NOT_2019 =
  'SEND_VERIFICATION_EMAIL__EMAIL_NOT_2019';
const SEND_VERIFICATION_EMAIL__EMAIL_NOT_STUDENT =
  'SEND_VERIFICATION_EMAIL__EMAIL_NOT_STUDENT';
const SEND_VERIFICATION_EMAIL__NOT_TUFTS_EMAIL =
  'SEND_VERIFICATION_EMAIL__NOT_TUFTS_EMAIL';
const SEND_VERIFICATION_EMAIL__TOO_MANY_EMAILS =
  'SEND_VERIFICATION_EMAIL__TOO_MANY_EMAILS';

// Helpful for debugging, easier than having a conditional type based on an enum
const NO_EMAIL = 'NO EMAIL FOR THIS RESPONSE CODE';
const NO_CLASS_YEAR = 'NO CLASS YEAR FOR THIS RESPONSE CODE';
const NO_UTLN = 'NO UTLN FOR THIS RESPONSE';

const TUFTS_EMAIL_DOMAIN = '@tufts.edu';
const JUMBOSMASH_EMAIL_DOMAIN = '@jumbosmash.com';

// A nice helper to allow us to just input the UTLN :)
function allowRawUtlnInRequest(request: Request): Request {
  const { email } = request;
  if (
    email.includes(TUFTS_EMAIL_DOMAIN) ||
    email.includes(JUMBOSMASH_EMAIL_DOMAIN)
  ) {
    return request;
  }
  // append @tufts.edu
  return {
    ...request,
    email: email + TUFTS_EMAIL_DOMAIN
  };
}

export default function sendVerificationEmail(
  request: Request
): Promise<SendVerificationEmail_Response> {
  return apiRequest(
    'POST',
    SEND_VERIFCATION_EMAIL__ROUTE,
    allowRawUtlnInRequest(request)
  ).then(response => {
    // We use this to ASSERT what the type of the response is.
    switch (response.status) {
      // Valid EMAIL
      case SEND_VERIFICATION_EMAIL__SUCCESS:
        return {
          statusCode: 'SUCCESS',
          responseEmail: response.data.email,
          requestEmail: request.email,
          classYear: NO_CLASS_YEAR,
          utln: response.data.utln
        };
      case SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT:
        return {
          statusCode: 'ALREADY_SENT',
          requestEmail: request.email,
          responseEmail: response.data.email,
          classYear: NO_CLASS_YEAR,
          utln: response.data.utln
        };
      // Invalid EMAIL
      case SEND_VERIFICATION_EMAIL__EMAIL_NOT_FOUND:
        return {
          statusCode: 'NOT_FOUND',
          responseEmail: NO_EMAIL,
          requestEmail: request.email,
          classYear: NO_CLASS_YEAR,
          utln: NO_UTLN
        };
      case SEND_VERIFICATION_EMAIL__EMAIL_NOT_STUDENT: // e.g. mgreen01
        return {
          statusCode: 'NOT_STUDENT',
          responseEmail: NO_EMAIL,
          requestEmail: request.email,
          classYear: NO_CLASS_YEAR,
          utln: NO_UTLN
        };
      case SEND_VERIFICATION_EMAIL__EMAIL_NOT_2019:
        return {
          statusCode: 'WRONG_CLASS_YEAR',
          classYear: response.data.classYear,
          responseEmail: NO_EMAIL,
          requestEmail: request.email,
          utln: NO_UTLN
        };
      case SEND_VERIFICATION_EMAIL__NOT_TUFTS_EMAIL:
        return {
          statusCode: 'NOT_TUFTS_EMAIL',
          classYear: NO_CLASS_YEAR,
          responseEmail: NO_EMAIL,
          requestEmail: request.email,
          utln: NO_UTLN
        };
      case BAD_REQUEST: {
        // Temporary logic to handle invalid request email type
        if (response.message === 'data.email should match format "email"') {
          Sentry.captureException(new Error(response.message), {
            extra: {
              request,
              eventName: 'SendVerificationEmail BadRequest'
            }
          });

          return {
            statusCode: 'NOT_FOUND',
            responseEmail: NO_EMAIL,
            requestEmail: request.email,
            classYear: NO_CLASS_YEAR,
            utln: NO_UTLN
          };
        }
        throw new Error(response);
      }
      case SEND_VERIFICATION_EMAIL__TOO_MANY_EMAILS: {
        return {
          statusCode: 'TOO_MANY_EMAILS',
          responseEmail: NO_EMAIL,
          requestEmail: request.email,
          classYear: NO_CLASS_YEAR,
          utln: NO_UTLN
        };
      }
      default:
        throw new Error(response);
    }
  });
}
