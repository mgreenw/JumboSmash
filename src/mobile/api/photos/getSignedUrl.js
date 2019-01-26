// @flow

import { apiRequest } from "../utils/apiRequest";
import { GET_SIGN_URL__ROUTE } from "../routes";

const SIGN_URL__SUCCESS = "SIGN_URL__SUCCESS";

// This is how we encode profiles on the server, which is the schema of the
// profiles database

type Request = {
  token: string
};

type SignUrlPayload = {
  url: string,
  fields: Object
};

function getSignedUrl(request: Request): Promise<SignUrlPayload> {
  return apiRequest("GET", GET_SIGN_URL__ROUTE, request.token)
    .then(response => {
      switch (response.status) {
        case SIGN_URL__SUCCESS:
          return response.payload;
        default:
          throw { response };
      }
    })
    .catch(error => {
      throw { error, request };
    });
}

export { getSignedUrl };
