// @flow
import { LocalAuthentication, SecureStore } from 'expo';
import promptPassword from './promptPassword';

function getStoredPassword(): Promise<null | string> {
  return SecureStore.getItemAsync('adminPassword', {
    keychainAccessible: SecureStore.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY
  });
}

async function requestFingerPrintPassword(): Promise<string> {
  const [hasHardware, authenticationTypes, storedPassword] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
    getStoredPassword()
  ]);

  if (!hasHardware) throw new Error('FINGERPRINT_NO_HARDWARE');

  // 1 is enum for fingerprint, 2 is enum for faceId
  if (authenticationTypes.indexOf(1) === -1)
    throw new Error('FINGERPRINT_NOT_SETUP');

  if (!storedPassword) throw new Error('NO_STORED_PASSWORD');

  const { success, error } = await LocalAuthentication.authenticateAsync();
  if (!success) throw error;
  return storedPassword;
}

export default async function requestPasswordAsync(
  promptIfNotSaved: boolean = true
): Promise<null | string> {
  try {
    const pass = await requestFingerPrintPassword();
    return pass;
  } catch (error) {
    if (promptIfNotSaved) {
      const pass = await promptPassword('Could not retrieve stored password.');
      return pass;
    }
    return null;
  }
}
