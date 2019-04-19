// @flow

import type { Dispatch } from 'mobile/reducers';
import type { ServerClassmate } from 'mobile/api/serverTypes';
import getClassmatesApi from 'mobile/api/admin/getClassmates';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';

export type GetClassmatesInitiated_Action = {
  type: 'GET_CLASSMATES__INITIATED',
  payload: {},
  meta: {}
};

export type GetClassmatesCompleted_Action = {
  type: 'GET_CLASSMATES__COMPLETED',
  payload: ServerClassmate[],
  meta: {}
};

export type GetClassmatesFailed_Action = {
  type: 'GET_CLASSMATES__FAILED',
  payload: {},
  meta: {}
};

function initiate(): GetClassmatesInitiated_Action {
  return {
    type: 'GET_CLASSMATES__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(
  classmates: ServerClassmate[]
): GetClassmatesCompleted_Action {
  return {
    type: 'GET_CLASSMATES__COMPLETED',
    payload: classmates,
    meta: {}
  };
}

function fail(): GetClassmatesFailed_Action {
  return {
    type: 'GET_CLASSMATES__FAILED',
    payload: {},
    meta: {}
  };
}

export default (password: string) => (dispatch: Dispatch) => {
  dispatch(initiate());
  getClassmatesApi(password)
    .then(({ classmates }) => {
      dispatch(complete(classmates));
    })
    .catch(error => {
      dispatch(fail());
      dispatch(apiErrorHandler(error));
    });
};
