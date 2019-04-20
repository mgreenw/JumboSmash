// @flow
// TODO: use a route meant for this! This is kinda expensive!!
import apiRequest from '../utils/apiRequest';
import { GET_MATCHES__ROUTE } from '../routes';

const PRELAUNCH_WALL_ACTIVE = 'PRELAUNCH_WALL_ACTIVE';
const GET_MATCHES__SUCCESS = 'GET_MATCHES__SUCCESS';

export default function checkLaunchDate(): Promise<Date> {
  return apiRequest('GET', GET_MATCHES__ROUTE).then(response => {
    switch (response.status) {
      case GET_MATCHES__SUCCESS:
        // The present is always before the future so we're safe!
        return new Date();
      case PRELAUNCH_WALL_ACTIVE: {
        const { launchDate } = response.data;
        return new Date(launchDate);
      }
      default:
        throw new Error(response);
    }
  });
}
