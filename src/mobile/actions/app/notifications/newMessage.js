// @flow
import type { Dispatch } from 'mobile/reducers';

export type NewMessageInitiated_Action = {
  type: 'NEW_MESSAGE__INITIATED',
  payload: {},
  meta: {}
};

export type NewMessageCompleted_Action = {
  type: 'NEW_MESSAGE__COMPLETED',
  payload: {},
  meta: {}
};

function initiate(): NewMessageInitiated_Action {
  return {
    type: 'NEW_MESSAGE__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(): NewMessageCompleted_Action {
  return {
    type: 'NEW_MESSAGE__COMPLETED',
    payload: {},
    meta: {}
  };
}

export default () => (dispatch: Dispatch) => {
  dispatch(initiate());
  dispatch(complete());
};
