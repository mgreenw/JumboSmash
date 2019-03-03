// @flow
import type { Dispatch } from 'mobile/reducers';

export type NewMatchInitiated_Action = {
  type: 'NEW_MATCH__INITIATED',
  payload: {},
  meta: {}
};

export type NewMatchCompleted_Action = {
  type: 'NEW_MATCH__COMPLETED',
  payload: {},
  meta: {}
};

function initiate(): NewMatchInitiated_Action {
  return {
    type: 'NEW_MATCH__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(): NewMatchCompleted_Action {
  return {
    type: 'NEW_MATCH__COMPLETED',
    payload: {},
    meta: {}
  };
}

export default () => (dispatch: Dispatch) => {
  dispatch(initiate());
  dispatch(complete());
};
