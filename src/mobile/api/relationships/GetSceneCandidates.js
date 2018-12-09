// @flow

// Self contained API file for GetSceneCandidates

import { timeout } from "../utils/timeout";
import {
  SMASH_CANDIDATES__ROUTE,
  SOCIAL_CANDIDATES__ROUTE,
  STONE_CANDIDATES__ROUTE
} from "../routes";
import type { Candidate } from "mobile/reducers";

// This is how we encode profiles on the server, which is the schema of the
// profiles database
export type ServerCandidate = {
  userId: number,
  displayName: string,
  birthday: string,
  bio: string
};

type request = {
  token: string
};

type smashCandidatesResponse__SUCCESS = {
  status: string,
  candidates: Array<ServerCandidate>
};

type smashCandidatesResponse__BAD_REQUEST = {
  status: string
};

type smashCandidatesResponse__INVALID_SCENE = {
  status: string
};

const GET_SCENE_CANDIDATES__SUCCESS = "GET_SCENE_CANDIDATES__SUCCESS";
const GET_SCENE_CANDIDATES__INVALID_SCENE =
  "GET_SCENE_CANDIDATES__INVALID_SCENE";
const BAD_REQUEST = "BAD_REQUEST";

export function parseCandidate(candidate: ServerCandidate): Candidate {
  debugger;
  return {
    userId: candidate.userId,
    profile: {
      displayName: candidate.displayName,
      birthday: candidate.birthday, // TODO: convert
      bio: candidate.bio
    }
  };
}

export function parseCandidates(
  apiResponse: Array<ServerCandidate>
): Array<Candidate> {
  return apiResponse.map(c => parseCandidate(c));
}

export function getSceneCandidates(
  request: request,
  callback__SUCCESS: (
    response: smashCandidatesResponse__SUCCESS,
    request: request
  ) => void,
  callback__INVALID_SCENE: (
    response: smashCandidatesResponse__INVALID_SCENE,
    request: request
  ) => void,
  callback__BAD_REQUEST: (
    response: smashCandidatesResponse__BAD_REQUEST,
    request: request
  ) => void,
  callback__ERROR: (error: any, request: request) => void
) {
  return timeout(
    30000,
    // Send a request to the server to check if UTLN is valid. If it is, send
    // a verification email, and return that email address.
    // TODO: on dev mode hit local, on prod hit prod.
    fetch(SMASH_CANDIDATES__ROUTE, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: request.token
      }
    })
  )
    .then(response => response.json())
    .then(response => {
      // We use this to ASSERT what the type of the response is.
      switch (response.status) {
        case GET_SCENE_CANDIDATES__SUCCESS:
          callback__SUCCESS(response, request);
          break;
        case GET_SCENE_CANDIDATES__INVALID_SCENE:
          callback__INVALID_SCENE(response, request);
          break;
        case BAD_REQUEST:
          callback__BAD_REQUEST(response, request);
          break;
        default:
          callback__ERROR(response, request);
      }
    })
    .catch(error => {
      callback__ERROR(error, request);
    });
}
