// @flow
import type { Dispatch, Scene } from 'mobile/reducers';

export type NewMatchInitiated_Action = {
  type: 'NEW_MATCH__INITIATED',
  payload: {},
  meta: {}
};

export type NewMatchCompleted_Action = {
  type: 'NEW_MATCH__COMPLETED',
  payload: { scene: Scene },
  meta: {}
};

function initiate(): NewMatchInitiated_Action {
  return {
    type: 'NEW_MATCH__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(scene: Scene): NewMatchCompleted_Action {
  return {
    type: 'NEW_MATCH__COMPLETED',
    payload: { scene },
    meta: {}
  };
}

export default (scene: Scene) => (dispatch: Dispatch) => {
  dispatch(initiate());
  dispatch(complete(scene));
};
