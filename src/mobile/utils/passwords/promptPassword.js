// @flow
import { AlertIOS } from 'react-native';

export default function promptPassword(message: string): Promise<string> {
  return new Promise(resolve => {
    AlertIOS.prompt('Please enter your password', message, text => {
      resolve(text);
    });
  });
}
