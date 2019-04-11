// @flow

import React from 'react';
import AuthLayout from 'mobile/components/Auth/Login/Layout';
import { sendSupportEmail } from 'mobile/utils/Mail';

const AuthHelpScreen = () => {
  return (
    <AuthLayout
      title={'Having Trouble?'}
      bodyText={
        'If you’re a senior and are having trouble logging in or signing up, email us at support@jumbosmash.com from your Tufts email, and the team will get you set up.'
      }
      buttonText={'Email the Team'}
      onButtonPress={sendSupportEmail}
      loading={false}
      buttonDisabled={false}
    />
  );
};

export default AuthHelpScreen;
