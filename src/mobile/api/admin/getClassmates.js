// @flow

import type { ServerClassmate } from 'mobile/api/serverTypes';
import apiRequest from 'mobile/api/utils/apiRequest';
import { GET_CLASSMATES_ROUTE } from 'mobile/api/routes';

const GET_CLASSMATES__SUCCESS = 'GET_CLASSMATES__SUCCESS';
export default function getClassmates(
  password: string
): Promise<{
  classmates: ServerClassmate[]
}> {
  return apiRequest('GET', GET_CLASSMATES_ROUTE, undefined, password).then(
    response => {
      switch (response.status) {
        case GET_CLASSMATES__SUCCESS:
          return response.data;
        default:
          throw new Error(response);
      }
    }
  );
}
