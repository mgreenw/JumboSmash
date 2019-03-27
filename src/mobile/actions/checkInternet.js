// @flow
import {
  checkInternetConnection,
  offlineActionTypes
} from 'react-native-offline';
import type { Dispatch } from 'mobile/reducers';

export default () => (dispatch: Dispatch) => {
  checkInternetConnection().then(isConnected => {
    // Dispatching can be done inside a connected component, a thunk (where dispatch is injected), saga, or any sort of middleware
    // In this example we are using a thunk
    dispatch({
      type: offlineActionTypes.CONNECTION_CHANGE,
      payload: isConnected
    });
  });
};
