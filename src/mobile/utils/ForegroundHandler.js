// @flow

import NavigationService from 'mobile/components/navigation/NavigationService';
import routes from 'mobile/components/navigation/routes';
import getConversationAction from 'mobile/actions/app/getConversation';
import store from 'mobile/store';

/**
 * Called when the app opens.
 * Updates messages if on a messages screen.
 */
export default function() {
  const { routeName, params } = NavigationService.getCurrentRoute();
  if (routeName === routes.Message) {
    // Optional chaining, where art thou?
    if (params && params.match && params.match.userId) {
      // Ensure we type this function
      const getConversationThunk = getConversationAction(params.match.userId);

      // TODO: correctly type thunks
      // We have to ignore flow here because dispatch expects a normal action not a thunk.
      // $FlowFixMe
      store.dispatch(getConversationThunk);
    }
  }
  return;
}
