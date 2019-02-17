// @flow

import type { UserSettings } from 'mobile/reducers';
import { MY_SETTINGS__ROUTE } from '../routes';
import apiRequest from '../utils/apiRequest';

const UPDATE_MY_SETTINGS__SUCCESS = 'UPDATE_SETTINGS__SUCCESS';

export default function updateMySettings(
  request: UserSettings
): Promise<UserSettings> {
  return apiRequest('PATCH', MY_SETTINGS__ROUTE, request)
    .then(response => {
      switch (response.status) {
        case UPDATE_MY_SETTINGS__SUCCESS: {
          const data: UserSettings = response.data;
          return data;
        }
        default:
          throw { response };
      }
    })
    .catch(error => {
      throw { error, request };
    });
}
