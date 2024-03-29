// @flow
/* eslint-disable */

import React from 'react';
import { Text, View, Image } from 'react-native';
import { connect } from 'react-redux';
import { styles } from 'mobile/styles/auth';
import type { Dispatch } from 'mobile/reducers';
import type { ReduxState } from 'mobile/reducers/index';
import { Arthur_Styles } from 'mobile/styles/Arthur_Styles';
import { textStyles } from 'mobile/styles/textStyles';
import routes from 'mobile/components/navigation/routes';
import AuthLayout from 'mobile/components/Auth/Login/Layout';
import GEMHeader from 'mobile/components/shared/Header';
import { PrimaryButton } from 'mobile/components/shared/buttons';
import { type NavigationScreenProp } from 'react-navigation';

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};

type Props = NavigationProps;

type State = {};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class ExpiredCodeScreen extends React.Component<Props, State> {
  //TODO: Resend code functionality
  render() {
    const { navigation } = this.props;
    return (
      <AuthLayout
        navigationKey={navigation.state.key}
        title={'Verification'}
        bodyText={
          'Oops! Looks like your verification code has expired. Probably TuftsSecure’s fault. Hit the button below to get another one. '
        }
        buttonText={'Send New Code'}
        onButtonPress={() => console.log('pressed')}
        loading={false}
        buttonDisabled={false}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpiredCodeScreen);
