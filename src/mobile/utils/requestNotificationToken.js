// @flow
import {
  Permissions,
  Notifications,
  Linking,
  IntentLauncherAndroid,
  Constants
} from 'expo';
import { Platform } from 'react-native';

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
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      // https://forums.expo.io/t/opening-device-settings-on-android-using-linking/2059/7
      IntentLauncherAndroid.startActivityAsync(
        // TODO: I'm not certain this is the right page but I need a physical device to test this better.
        IntentLauncherAndroid.ACTION_APPLICATION_DETAILS_SETTINGS,
        {},
        `package:${Constants.manifest.android.package}`
      );
    }
    return null;
  }

  // Get the token that uniquely identifies this device
  const token = await Notifications.getExpoPushTokenAsync();

  return token;
}
