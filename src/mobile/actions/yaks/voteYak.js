// @flow
import type { Dispatch, GetState } from 'mobile/reducers';
import type { Yak } from 'mobile/api/serverTypes';
import { apiErrorHandler } from 'mobile/actions/apiErrorHandler';
import voteYak from 'mobile/api/yaks/voteYak';

export type VoteYakInitiated_Action = {
  type: 'VOTE_YAK__INITIATED',
  payload: { id: number },
  meta: {}
};
export type VoteYakCompleted_Action = {
  type: 'VOTE_YAK__COMPLETED',
  payload: { id: number, yak: Yak },
  meta: {}
};
export type VoteYakFailed_Action = {
  type: 'VOTE_YAK__FAILED',
  payload: { id: number },
  meta: {}
};

function initiate(id: number): VoteYakInitiated_Action {
  return {
    type: 'VOTE_YAK__INITIATED',
    payload: { id },
    meta: {}
  };
}

function complete(id: number, yak: Yak): VoteYakCompleted_Action {
  return {
    type: 'VOTE_YAK__COMPLETED',
    payload: { id, yak },
    meta: {}
  };
}

function fail(id: number): VoteYakFailed_Action {
  return {
    type: 'VOTE_YAK__FAILED',
    payload: { id },
    meta: {}
  };
}

export default (id: number, liked: boolean) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const { yaks } = getState();
  if (yaks.inProgress.vote[id]) return; // don't double vote

  dispatch(initiate(id));
  voteYak(id, liked)
    .then(({ yak }) => {
      dispatch(complete(id, yak));
    })
    .catch(error => {
      dispatch(fail(id));
      dispatch(apiErrorHandler(error));
    });
};
