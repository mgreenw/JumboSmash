// @flow
import apiRequest from '../utils/apiRequest';
import { GET_LAUNCH_DATE__ROUTE } from '../routes';
import type { LaunchDateStatus } from '../serverTypes';

const GET_LAUNCH_DATE__SUCCESS = 'GET_LAUNCH_DATE__SUCCESS';

export default function checkLaunchDate(): Promise<LaunchDateStatus> {
  return apiRequest('GET', GET_LAUNCH_DATE__ROUTE).then(response => {
    switch (response.status) {
      case GET_LAUNCH_DATE__SUCCESS: {
        return response.data;
      }
      default:
        throw new Error(response);
    }
  });
}
