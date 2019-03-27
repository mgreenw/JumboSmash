// @flow
// https://github.com/rgommezz/react-native-offline/blob/master/src/redux/actionCreators.js
import {
  checkInternetConnection,
  offlineActionTypes
} from 'react-native-offline';
import type { Dispatch } from 'mobile/reducers';

export default () => (dispatch: Dispatch) => {
  checkInternetConnection().then(isConnected => {
    dispatch({
      type: offlineActionTypes.CONNECTION_CHANGE,
      payload: isConnected
    });
  });
};
