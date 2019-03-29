// @flow
import type { Dispatch, Scene } from 'mobile/reducers';
import type { ServerMatch } from 'mobile/api/serverTypes';

export type NewMatchInitiated_Action = {
  type: 'NEW_MATCH__INITIATED',
  payload: {},
  meta: {}
};

export type NewMatchCompleted_Action = {
  type: 'NEW_MATCH__COMPLETED',
  payload: { scene: Scene, match: ServerMatch },
  meta: {}
};

function initiate(): NewMatchInitiated_Action {
  return {
    type: 'NEW_MATCH__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(match: ServerMatch, scene: Scene): NewMatchCompleted_Action {
  return {
    type: 'NEW_MATCH__COMPLETED',
    payload: { match, scene },
    meta: {}
  };
}

export default (match: ServerMatch, scene: Scene) => (dispatch: Dispatch) => {
  dispatch(initiate());
  dispatch(complete(match, scene));
};
