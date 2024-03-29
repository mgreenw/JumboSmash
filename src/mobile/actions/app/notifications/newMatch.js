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
  payload: { scene: Scene, match: ServerMatch, clientInitiatedMatch: boolean },
  meta: {}
};

function initiate(): NewMatchInitiated_Action {
  return {
    type: 'NEW_MATCH__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(
  match: ServerMatch,
  scene: Scene,
  clientInitiatedMatch: boolean
): NewMatchCompleted_Action {
  return {
    type: 'NEW_MATCH__COMPLETED',
    payload: { match, scene, clientInitiatedMatch },
    meta: {}
  };
}

/**
 * Triggers the `New Match Toast` and calls the `getMatches` action to refresh the match list.
 * clicking on that toast goes to the matches screen, which would cause a match refresh anyways;
 * this handles the case when a new match occurs while on the Matches screen.
 */
export default (
  match: ServerMatch,
  scene: Scene,
  clientInitiatedMatch: boolean
) => (dispatch: Dispatch) => {
  dispatch(initiate());
  dispatch(getMatches());
  dispatch(complete(match, scene, clientInitiatedMatch));
};
