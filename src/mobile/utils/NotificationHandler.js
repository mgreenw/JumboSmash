// @flow

import type {
  NewMatch_PushNotificationData,
  NewMessage_PushNotificationData
} from 'mobile/api/serverTypes';
import NavigationService from 'mobile/components/navigation/NavigationService';
import routes from 'mobile/components/navigation/routes';

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
  switch (notification.origin) {
    // Notification occured in app.
    // This should have a corresponding socket notification, so we handle these there,
    // because we aren't gaurenteed all users will have push notifications
    case 'received': {
      return;
    }

    // App opened in response to a notification.
    // TODO: Replace body of this statement with:
    // 1) Action to fetch latest conversation for that match
    // 2 a) If a message, go to conversation
    // 2 b) If a new match, go to messages screen (we don't have the match in redux yet so this is way safer than awaiting the fetch)
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