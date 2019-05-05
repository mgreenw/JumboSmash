// @flow
import { LocalAuthentication, SecureStore } from 'expo';
import promptPassword from './promptPassword';

function setStoredPassword(newPassword: string): Promise<string> {
  return SecureStore.setItemAsync('adminPassword', newPassword, {
    keychainAccessible: SecureStore.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY
  });
}

export default async function setFingerPrintPassword(): Promise<string> {
  const [hasHardware, authenticationTypes] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync()
  ]);

  if (!hasHardware) throw new Error('FINGERPRINT_NO_HARDWARE');

  // 1 is enum for fingerprint, 2 is enum for faceId
  if (authenticationTypes.indexOf(1) === -1)
    throw new Error('FINGERPRINT_NOT_SETUP');

  const { success, error } = await LocalAuthentication.authenticateAsync();
  if (!success) throw error;

  const pass = await promptPassword('New Password');
  await setStoredPassword(pass);
  return pass;
}
