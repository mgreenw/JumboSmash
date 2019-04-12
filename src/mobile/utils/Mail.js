// @flow
import { Linking } from 'react-native';
import Sentry from 'sentry-expo';

/**
 * Open up the mail app with an email to support@jumbosmash.com.
 * Sentry logs if there is an error (e.g. no mail client).
 */
const sendSupportEmail = () => {
  Linking.openURL('mailto:support@jumbosmash.com')
    .then()
    .catch(err => Sentry.captureException(new Error(JSON.stringify(err))));
};
export { sendSupportEmail };
