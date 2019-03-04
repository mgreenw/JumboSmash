// @flow
import { Permissions, Notifications } from 'expo';
import { Alert } from 'react-native';

export default async function requestNotificationToken(): Promise<?string> {
  // https://docs.expo.io/versions/latest/guides/push-notifications/
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    Alert.alert(
      "Please enable push notifications in your phone's settings to proceed"
    );
    return null;
  }

  // Get the token that uniquely identifies this device
  const token = await Notifications.getExpoPushTokenAsync();

  return token;
}