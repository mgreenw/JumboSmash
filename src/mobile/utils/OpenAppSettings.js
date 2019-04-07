// @flow

import { Linking, IntentLauncherAndroid, Constants } from 'expo';

import { Platform } from 'react-native';

/**
 * Opens the phone's settings for the app.
 * Currently navigates to main settings (not the specific page for a permision).
 */
export default function() {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    // https://forums.expo.io/t/opening-device-settings-on-android-using-linking/2059/7
    IntentLauncherAndroid.startActivityAsync(
      // TODO: I'm not certain this is the right page --
      // Needs to be tested on a physical device.
      IntentLauncherAndroid.ACTION_APPLICATION_DETAILS_SETTINGS,
      {},
      `package:${Constants.manifest.android.package}`
    );
  }
}
