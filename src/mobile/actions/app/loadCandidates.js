// @flow
import type { Dispatch } from "redux";
import DevTesting from "../../utils/DevTesting";
import type { Candidate } from "mobile/reducers";
import type { ServerCandidate } from "mobile/api/relationships/GetSceneCandidates";
import {
  getSceneCandidates,
  parseCandidates
} from "mobile/api/relationships/GetSceneCandidates";

export const LOAD_CANDIDATES__INITIATED = "LOAD_CANDIDATES__INITIATED";
export const LOAD_CANDIDATES__COMPLETED = "LOAD_CANDIDATES__COMPLETED";
type LOAD_CANDIDATES__INITIATED_TYPE = { type: string };
type LOAD_CANDIDATES__COMPLETED_TYPE = {
  type: string,
  candidates: ?Array<Candidate>
};

type request = {
  token: string
};

function parseCandidate(candidate: ServerCandidate): Candidate {
  return {
    userId: candidate.userId,
    profile: {
      displayName: candidate.displayName,
      birthday: candidate.birthday, // TODO: convert
      bio: candidate.bio
    }
  };
}

function initiate(): LOAD_CANDIDATES__INITIATED_TYPE {
  return {
    type: LOAD_CANDIDATES__INITIATED
  };
}

function complete(
  candidates: ?Array<Candidate>
): LOAD_CANDIDATES__COMPLETED_TYPE {
  return {
    type: LOAD_CANDIDATES__COMPLETED,
    candidates
  };
}

// TODO: catch errors, e.g. the common network timeout.
export function loadCandidates(token: string) {
  return function(dispatch: Dispatch) {
    dispatch(initiate());
    DevTesting.fakeLatency(() => {
      getSceneCandidates(
        {
          token
        },
        (response, request) => {
          const candidates = parseCandidates(response.candidates);
          dispatch(complete(candidates));
        },
        (response, request) => {
          console.log("invalid scene");
        },
        (response, request) => {
          console.log("bad request");
        },
        (error, request) => {
          console.log(error);
        }
      );
    });
  };
}
