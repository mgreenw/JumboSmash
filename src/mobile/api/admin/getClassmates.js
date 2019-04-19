// @flow

import type { ServerClassmate } from '../serverTypes';
import apiRequest from '../utils/apiRequest';
import { GET_CLASSMATES_ROUTE } from '../routes';

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
