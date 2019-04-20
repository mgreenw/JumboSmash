// @flow
import apiRequest from '../utils/apiRequest';
import { GET_LAUNCH_DATE__ROUTE } from '../routes';

const GET_LAUNCH_DATE__SUCCESS = 'GET_LAUNCH_DATE__SUCCESS';

export default function checkLaunchDate(): Promise<Date> {
  return apiRequest('GET', GET_LAUNCH_DATE__ROUTE).then(response => {
    switch (response.status) {
      case GET_LAUNCH_DATE__SUCCESS:
        return new Date(response.launchDate);
      default:
        throw new Error(response);
    }
  });
}
