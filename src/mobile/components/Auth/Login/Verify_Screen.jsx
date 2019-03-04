// @flow

import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import loginAction from 'mobile/actions/auth/login';
import type { ReduxState, Dispatch, PopupCode } from 'mobile/reducers/index';
import { Colors } from 'mobile/styles/colors';
import { textStyles } from 'mobile/styles/textStyles';
import { PrimaryButton } from 'mobile/components/shared/buttons/PrimaryButton';
import TertiaryButton from 'mobile/components/shared/buttons/TertiaryButton';
import { CodeInput } from 'mobile/components/shared/DigitInput';
import routes from 'mobile/components/navigation/routes';
import KeyboardView from 'mobile/components/shared/KeyboardView';
import type { Login_Response } from 'mobile/actions/auth/login';
import { Transition } from 'react-navigation-fluid-transitions';
import GEMHeader from 'mobile/components/shared/Header';
import { summonPopup as summonPopupAction } from 'mobile/actions/popup';
import NavigationService from '../../navigation/NavigationService';

const NUM_DIGITS = 6;

type State = {
  code: string,
  errorMessageCode: string
};

type reduxProps = {
  login_inProgress: boolean,
  login_response: ?Login_Response
};
type navigationProps = {
  navigation: any
};
type dispatchProps = {
  login: (utln: string, code: string) => void,
  summonPopup: (code: PopupCode) => void
};

type Props = reduxProps & navigationProps & dispatchProps;

function mapStateToProps(reduxState: ReduxState): reduxProps {
  return {
    login_inProgress: reduxState.inProgress.login,
    login_response: reduxState.response.login
  };
}

function mapDispatchToProps(dispatch: Dispatch): dispatchProps {
  return {
    login: (utln, code) => {
      dispatch(loginAction(utln, code));
    },
    summonPopup: code => {
      dispatch(summonPopupAction(code));
    }
  };
}

class SplashScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      code: '',
      errorMessageCode: ''
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { login_inProgress, login_response, navigation } = this.props;
    if (prevProps.login_inProgress !== login_inProgress) {
      if (!login_inProgress && !!login_response) {
        const { statusCode } = login_response;
        if (statusCode === 'SUCCESS') {
          navigation.navigate(routes.AppSwitch, {});
        } else if (statusCode === 'BAD_CODE') {
          this._codeInputError('Incorrect verification code');
        } else if (statusCode === 'EXPIRED_CODE') {
          this._onExpiredCode();
        } else {
          // TODO: more verbose errors
          this._codeInputError(statusCode);
        }
      }
    }
  }

  _validateUtln = () => {
    const { code } = this.state;
    if (code === '') {
      this._codeInputError('Required');
      return false;
    }
    return true;
  };

  _codeInputError = (errorMessage: string) => {
    this.setState({
      errorMessageCode: errorMessage
    });
  };

  _onExpiredCode = () => {
    const { summonPopup } = this.props;
    summonPopup('EXPIRED_VERIFY_CODE');
    NavigationService.reset();
  };

  _onHelp = () => {
    const { navigation } = this.props;
    navigation.navigate(routes.AuthHelp, {});
  };

  // When we submit, a few things happen.
  // First, we set the state of this component to have isSubmitting = true,
  // so that we lock the UI to disable going back, editting the fields,
  // clicking more things, etc. Essentially, causing a syncronous behavoir.
  //
  // Because we want to ensure the request completes before continuing, we
  // assign a callback for EACH CASE of the possible responses (as defined
  // by the contract of the 'verify' function.)
  //
  // E.g. On success, we login to the app with credentials, or on failure
  // we display an appropriate message.
  _onSubmit = () => {
    if (!this._validateUtln()) {
      return;
    }
    const { code } = this.state;
    const { login } = this.props;
    const { navigation } = this.props;
    const utln = navigation.getParam('utln', null);
    const email = navigation.getParam('responseEmail', null);
    if (!utln || !email) {
      throw ('Error in Verify Screen: utln or email null: ', utln, email);
    }
    this.setState(
      {
        errorMessageCode: ''
      },
      () => {
        login(utln, code);
      }
    );
  };

  _onChangeText = (text: string) => {
    this.setState({ code: text, errorMessageCode: '' });
  };

  render() {
    const { navigation, login_inProgress } = this.props;
    const { code, errorMessageCode } = this.state;
    const responseEmail: string = navigation.getParam('responseEmail', '');
    const alreadySent: boolean = navigation.getParam('alreadySent', false);
    const isLoading = login_inProgress;
    const message = `Congrats on graduating! ${
      alreadySent
        ? `Looks like a verification code already been sent to `
        : `A verification code has been sent to `
    } ${responseEmail}.  Enter it below to start using JumboSmash.`;

    return (
      <View style={{ flex: 1 }}>
        <GEMHeader
          title={'Verification'}
          leftIconName={'back'}
          loading={isLoading}
        />
        <KeyboardView waves={1}>
          <Transition inline appear={'horizontal'}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 2,
                  paddingLeft: 40,
                  paddingRight: 40
                }}
              >
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center'
                  }}
                >
                  <View style={{ paddingTop: 20 }}>
                    <Text style={textStyles.body1Style}>{message}</Text>
                  </View>
                </View>
                <View
                  style={{
                    width: '100%',
                    paddingTop: 10
                  }}
                >
                  <CodeInput
                    value={code}
                    onChangeValue={this._onChangeText}
                    maxLength={NUM_DIGITS}
                    primaryColor={Colors.Black}
                    errorColor={Colors.Grapefruit}
                    error={errorMessageCode}
                    assistive={'Make sure to check your spam folder!'}
                  />
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <PrimaryButton
                  onPress={this._onSubmit}
                  title="Verify"
                  disabled={isLoading || code.length !== NUM_DIGITS}
                  loading={isLoading}
                />
                <TertiaryButton
                  onPress={this._onHelp}
                  title="Having Trouble?"
                />
              </View>
            </View>
          </Transition>
        </KeyboardView>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SplashScreen);
