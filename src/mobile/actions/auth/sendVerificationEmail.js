// @flow
/* eslint-disable */

import type { Dispatch } from 'mobile/reducers';
import sendVerificationEmail_api from 'mobile/api/auth/sendVerificationEmail';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import DevTesting from '../../utils/DevTesting';

type StatusCode =
  | 'SUCCESS'
  | 'ALREADY_SENT'
  | 'WRONG_CLASS_YEAR'
  | 'NOT_STUDENT'
  | 'NOT_FOUND'
  | 'NOT_TUFTS_EMAIL';

export type SendVerificationEmail_Response = {
  statusCode: StatusCode,
  requestEmail: string,
  responseEmail: string,
  classYear: string,
  utln: string
};

export type SendVerificationEmailCompleted_Action = {
  type: 'SEND_VERIFICATION_EMAIL_COMPLETED',
  payload: {
    response: SendVerificationEmail_Response
  },
  meta: {}
};

export type SendVerificationEmailInitiated_Action = {
  type: 'SEND_VERIFICATION_EMAIL_INITIATED',
  payload: {},
  meta: {}
};

function initiate(): SendVerificationEmailInitiated_Action {
  return {
    type: 'SEND_VERIFICATION_EMAIL_INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(
  response: SendVerificationEmail_Response
): SendVerificationEmailCompleted_Action {
  return {
    type: 'SEND_VERIFICATION_EMAIL_COMPLETED',
    payload: { response },
    meta: {}
  };
}

export function sendVerificationEmailAction(
  email: string,
  forceResend: boolean
) {
  return function(dispatch: Dispatch) {
    dispatch(initiate());
    DevTesting.fakeLatency(() => {
      sendVerificationEmail_api({ email, forceResend })
        .then(response => {
          dispatch(complete(response));
        })
        .catch(error => {
          dispatch(apiErrorHandler(error));
        });
    });
  };
}
