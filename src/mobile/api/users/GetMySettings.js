// @flow

import type { UserSettings } from 'mobile/reducers';
import { serverSettingsToMobileSettings } from 'mobile/api/dataConversion';
import apiRequest from '../utils/apiRequest';
import { MY_SETTINGS__ROUTE } from '../routes';

const GET_SETTINGS__SUCCESS = 'GET_SETTINGS__SUCCESS';

export default function getMyProfile(): Promise<?UserSettings> {
  return apiRequest('GET', MY_SETTINGS__ROUTE)
    .then(response => {
      switch (response.status) {
        case GET_SETTINGS__SUCCESS:
          return serverSettingsToMobileSettings(response.data);
        default:
          throw { response };
      }
    })
    .catch(error => {
      throw { error };
    });
}
