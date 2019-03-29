// @flow
import type { Dispatch, Scene } from 'mobile/reducers';
import type { ServerMatch } from 'mobile/api/serverTypes';
import getMatches from 'mobile/actions/app/getMatches';

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

/**
 * Triggers the `New Match Toast` and calls the `getMatches` action to refresh match list.
 * TODO: change this so that `getMatches` has an optional flag to trigger the toast if we want to enable clicking on toast functionality.
 */
export default (match: ServerMatch, scene: Scene) => (dispatch: Dispatch) => {
  dispatch(initiate());
  dispatch(getMatches());
  dispatch(complete(match, scene));
};
