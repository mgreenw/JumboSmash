// @flow
import type { Dispatch } from 'redux';

export const INITIATE_REGISTRATION = 'INITIATE_REGISTRATION';
export const initiateRegistration = () => ({
  type: INITIATE_REGISTRATION,
});

export const SUCCEED_REGISTRATION = 'SUCCEED_REGISTRATION';
export const succeedRegistration = () => ({
  type: SUCCEED_REGISTRATION,
});

export const register = (utln: string, password: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(initiateRegistration());
    setTimeout(()=>{dispatch(succeedRegistration())}, 1000)
    // Dispatch action for initiating signUp

    // Make API Call
      // Dispatch API Call result -> Success, Failure (bad utln, bad password, already registered, or server error)
  }
};
