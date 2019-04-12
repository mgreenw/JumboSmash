// @flow

import React from 'react';
import { Keyboard, Text, Image, View, Platform } from 'react-native';
import { PrimaryInput } from 'mobile/components/shared/PrimaryInput';
import { connect } from 'react-redux';
import { sendVerificationEmailAction } from 'mobile/actions/auth/sendVerificationEmail';
import type { ReduxState, Dispatch } from 'mobile/reducers/index';
import { Arthur_Styles } from 'mobile/styles/Arthur_Styles';
import { PrimaryButton } from 'mobile/components/shared/buttons';
import TertiaryButton from 'mobile/components/shared/buttons/TertiaryButton';
import routes from 'mobile/components/navigation/routes';
import KeyboardView from 'mobile/components/shared/KeyboardView';
import type { SendVerificationEmail_Response } from 'mobile/actions/auth/sendVerificationEmail';
import { Transition } from 'react-navigation-fluid-transitions';
import Collapsible from 'react-native-collapsible';

const ArthurUri = require('../../../assets/arthurIcon.png');

type reduxProps = {
  sendVerificationEmail_inProgress: boolean,
  sendVerificationEmail_response: ?SendVerificationEmail_Response
};

type navigationProps = {
  navigation: any
};

type dispatchProps = {
  sendVerificationEmail: (utln: string) => void
};

type Props = reduxProps & navigationProps & dispatchProps;

type State = {
  utln: string,
  errorMessageUtln: string,
  hasHadError: boolean,
  keyboardUp: boolean
};

function mapStateToProps(reduxState: ReduxState): reduxProps {
  return {
    sendVerificationEmail_inProgress:
      reduxState.inProgress.sendVerificationEmail,
    sendVerificationEmail_response: reduxState.response.sendVerificationEmail
  };
}

function mapDispatchToProps(dispatch: Dispatch): dispatchProps {
  return {
    // no need for force resend here.
    sendVerificationEmail: utln => {
      dispatch(sendVerificationEmailAction(utln, false));
    }
  };
}

class SplashScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      utln: '',
      errorMessageUtln: '',
      hasHadError: false,
      keyboardUp: false
    };
  }

  componentWillMount() {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    this.keyboardWillShowListener = Keyboard.addListener(
      showEvent,
      this._keyboardWillShow
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      hideEvent,
      this._keyboardWillHide
    );
  }

  componentDidUpdate(prevProps: Props) {
    const { sendVerificationEmail_inProgress: sendingEmail } = this.props;
    const { sendVerificationEmail_inProgress: wasSendingEmail } = prevProps;

    // This logic determines that an email has been sent, because we maintain
    // as an invariant that the progress of this action defaults to false.
    if (sendingEmail !== wasSendingEmail && !sendingEmail) {
      const { sendVerificationEmail_response: response } = this.props;
      if (!response) {
        throw new Error(
          'Error in Login: Send Verification Email complete but no response'
        );
      }
      const { statusCode } = response;
      switch (statusCode) {
        case 'SUCCESS': {
          this._onSuccess(
            response.requestEmail,
            response.responseEmail,
            response.utln,
            false
          );
          break;
        }
        case 'ALREADY_SENT': {
          this._onSuccess(
            response.requestEmail,
            response.responseEmail,
            response.utln,
            true
          );
          break;
        }
        case 'WRONG_CLASS_YEAR': {
          this._onNot2019(response.classYear);
          break;
        }
        // TODO: maybe this needs its own case or be part of Not_2019?
        case 'NOT_STUDENT': {
          this._onNotFound();
          break;
        }
        case 'NOT_FOUND': {
          this._onNotFound();
          break;
        }
        case 'NOT_TUFTS_EMAIL': {
          this._onNotTuftsEmail();
          break;
        }
        default: {
          // eslint-disable-next-line no-unused-expressions
          (statusCode: empty); // ensures we have handled all cases
        }
      }
    }
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  _onNotTuftsEmail = () => {
    this._utlnInputError('Not a valid Tufts email');
  };

  // utln and email should be params, not from state, to ensure it's the
  // same that were submitted!
  _onSuccess = (
    requestEmail: string,
    responseEmail: string,
    utln: string,
    alreadySent: boolean
  ) => {
    const { navigation } = this.props;
    navigation.navigate(routes.Verify, {
      requestEmail,
      responseEmail,
      utln,
      alreadySent
    });
  };

  _onNot2019 = (classYear: string) => {
    const { navigation } = this.props;
    navigation.navigate(routes.Not2019, {
      classYear
    });
  };

  _onNotFound = () => {
    this._utlnInputError('Could not find email');
  };

  _onHelp = () => {
    const { navigation } = this.props;
    navigation.navigate(routes.AuthHelp, {});
  };

  _onSubmit = () => {
    // First, we validate the UTLN to preliminarily display errors
    const { sendVerificationEmail } = this.props;
    const { utln } = this.state;
    if (this._validateUtln()) {
      this.setState(
        {
          errorMessageUtln: ''
        },
        () => {
          sendVerificationEmail(utln);
        }
      );
    }
  };

  _utlnInputError = (errorMessage: string) => {
    this.setState({
      hasHadError: true,
      errorMessageUtln: errorMessage
    });
  };

  // TODO: more client side validation!
  _validateUtln = () => {
    const { utln } = this.state;
    if (utln === '') {
      this._utlnInputError('Required');
      return false;
    }
    // Hardcoded for apple / google tester
    if (utln === 'tester@jumbosmash.com') {
      return true;
    }
    if (utln.includes('@') && !utln.includes('@tufts.edu')) {
      this._onNotTuftsEmail();
      return false;
    }
    return true;
  };

  _onInputChange = (newUtln: string) => {
    const lowerCaseUtln = newUtln.toLowerCase();
    const { utln: oldUtln } = this.state;
    if (lowerCaseUtln !== oldUtln && !oldUtln) {
      this.setState({
        errorMessageUtln: '',
        utln: lowerCaseUtln
      });
    } else {
      this.setState({ utln: lowerCaseUtln });
    }
  };

  _keyboardWillShow = () => {
    this.setState({
      keyboardUp: true
    });
  };

  _keyboardWillHide = () => {
    this.setState({
      keyboardUp: false
    });
  };

  keyboardWillShowListener: any;

  keyboardWillHideListener: any;

  render() {
    // this is the navigator we passed in from App.js
    const { utln, errorMessageUtln, hasHadError, keyboardUp } = this.state;
    const { sendVerificationEmail_inProgress } = this.props;

    const ImageView = Collapsible;

    return (
      <View style={Arthur_Styles.container}>
        <View style={{ height: '9.6%' }} />
        <KeyboardView waves={1}>
          <Transition inline appear="horizontal">
            <View style={{ flex: 1 }}>
              <Text style={Arthur_Styles.title}>JumboSmash</Text>
              <View
                style={{
                  flex: 2,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ImageView collapsed={keyboardUp}>
                  <Image
                    resizeMode="contain"
                    style={{
                      width: 200,
                      height: 200
                    }}
                    source={ArthurUri}
                  />
                </ImageView>
                <PrimaryInput
                  label="Tufts Email"
                  onChange={this._onInputChange}
                  error={errorMessageUtln}
                  assistive="Ex: anthony.monaco@tufts.edu"
                  containerStyle={{ width: '60%' }}
                  autoCapitalize="none"
                />
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
                  title="Verify I'm a Senior!"
                  disabled={sendVerificationEmail_inProgress || utln === ''}
                  loading={sendVerificationEmail_inProgress}
                  hidden={!hasHadError}
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
