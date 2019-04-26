// @flow

import type {
  NewMatch_PushNotificationData,
  NewMessage_PushNotificationData
} from 'mobile/api/serverTypes';
import NavigationService from 'mobile/components/navigation/NavigationService';
import routes from 'mobile/components/navigation/routes';
import store from 'mobile/store';
import type { ReduxState } from 'mobile/reducers';

/**
 *  https://docs.expo.io/versions/latest/guides/push-notifications/
 */
type Notification = {
  /**
   * Either selected or received. selected if the notification was tapped on by the user, received if the notification was received while the user was in the app.
   */
  origin: 'received' | 'selected',

  /**
   * Any data that has been attached with the notification.
   */
  data: NewMatch_PushNotificationData | NewMessage_PushNotificationData,

  /**
   *  true if the notification is a push notification, false if it is a local notification.
   */
  remote: boolean
};

/**
 * @param {*} notification The Notification object recieved when the listener is called by clicking a notification
 */
function handler(notification: Notification) {
  const state: ReduxState = store.getState();

  // All kinds of reasons the app might not be ready to go into the main app:
  const { client, token, authLoaded, appLoaded, onboardingCompleted } = state;

  // If ANY of those are not true, then we are NOT in the main app.
  if (!client || !token || !authLoaded || !appLoaded || !onboardingCompleted) {
    return;
  }

  switch (notification.origin) {
    // Notification occured in app.
    // This should have a corresponding socket notification, so we handle these there,
    // because we aren't gaurenteed all users will have push notifications
    case 'received': {
      return;
    }

    // App opened in response to a notification.
    case 'selected': {
      const { data } = notification;
      switch (data.type) {
        case 'NEW_MATCH': {
          NavigationService.navigate(routes.Matches);
          return;
        }

        case 'NEW_MESSAGE': {
          NavigationService.navigateToMatch(data.payload.senderUserId);
          return;
        }

        default: {
          // eslint-disable-next-line no-unused-expressions
          (data.type: empty); // ensures we have handled all cases
          return;
        }
      }
    }

    default: {
      // eslint-disable-next-line no-unused-expressions
      (notification.origin: empty); // ensures we have handled all cases
    }
  }
}

export default handler;
