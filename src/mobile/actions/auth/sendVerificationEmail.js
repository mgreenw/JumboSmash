// @flow
import type { Dispatch } from "redux";
import { AsyncStorage } from "react-native";
import DevTesting from "../../utils/DevTesting";
import sendVerificationEmail_api from "mobile/api/auth/sendVerificationEmail";

type sendVerificationEmail_statusCode =
  | "SUCCESS"
  | "ALREADY_SENT"
  | "WRONG_CLASS_YEAR"
  | "NOT_STUDENT"
  | "NOT_FOUND";

export type sendVerificationEmail_response = {
  statusCode: sendVerificationEmail_statusCode,
  utln: string,
  email: string,
  classYear: string
};

export type SendVerificationEmailCompleted_Action = {
  type: "SEND_VERIFICATION_EMAIL_COMPLETED",
  response: sendVerificationEmail_response
};

export type SendVerificationEmailInitiated_Action = {
  type: "SEND_VERIFICATION_EMAIL_INITIATED"
};

function initiate(): SendVerificationEmailInitiated_Action {
  return {
    type: "SEND_VERIFICATION_EMAIL_INITIATED"
  };
}

function complete(
  response: sendVerificationEmail_response
): SendVerificationEmailCompleted_Action {
  return {
    type: "SEND_VERIFICATION_EMAIL_COMPLETED",
    response: response
  };
}

export function sendVerificationEmail(utln: string, forceResend: boolean) {
  return function(dispatch: Dispatch) {
    dispatch(initiate());
    DevTesting.fakeLatency(() => {
      sendVerificationEmail_api({ utln, forceResend }).then(response => {
        dispatch(complete(response));
      });
    });
  };
}
