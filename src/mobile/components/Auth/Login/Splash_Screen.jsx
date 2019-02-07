// @flow

import React from 'react';
import { Text, Image, View } from 'react-native';
import { PrimaryInput } from 'mobile/components/shared/PrimaryInput';
import { connect } from 'react-redux';
import { sendVerificationEmailAction } from 'mobile/actions/auth/sendVerificationEmail';
import type { Dispatch } from 'redux';
import type { ReduxState } from 'mobile/reducers/index';
import { Arthur_Styles } from 'mobile/styles/Arthur_Styles';
import { PrimaryButton } from 'mobile/components/shared/buttons/PrimaryButton';
import { TertiaryButton } from 'mobile/components/shared/buttons/TertiaryButton';
import { routes } from 'mobile/components/Navigation';
import { KeyboardView } from 'mobile/components/shared/KeyboardView';
import type { sendVerificationEmail_response } from 'mobile/actions/auth/sendVerificationEmail';
import { Transition } from 'react-navigation-fluid-transitions';
import Popup from 'mobile/components/shared/Popup';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';

const ArthurUri = require('../../../assets/arthurIcon.png');

type reduxProps = {
  sendVerificationEmail_inProgress: boolean,
  sendVerificationEmail_response: ?sendVerificationEmail_response,
};

type navigationProps = {
  navigation: any,
};

type dispatchProps = {
  sendVerificationEmail: (utln: string) => void,
};

type Props = reduxProps & navigationProps & dispatchProps;

type State = {
  utln: string,
  errorMessageUtln: string,
  showPopup: boolean,
};

function mapStateToProps(reduxState: ReduxState): reduxProps {
  return {
    sendVerificationEmail_inProgress: reduxState.inProgress.sendVerificationEmail,
    sendVerificationEmail_response: reduxState.response.sendVerificationEmail,
  };
}

function mapDispatchToProps(dispatch: Dispatch): dispatchProps {
  return {
    // no need for force resend here.
    sendVerificationEmail: (utln) => {
      dispatch(sendVerificationEmailAction(utln, false));
    },
  };
}

class SplashScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    const error = navigation.getParam('error', null);
    this.state = {
      utln: '',
      errorMessageUtln: '',
      showPopup: error != null,
    };
  }

  componentDidUpdate(prevProps: Props) {
    const {
      sendVerificationEmail_inProgress: newPropsSendVerificationEmail_inProgress,
    } = this.props;

    const {
      sendVerificationEmail_inProgress: oldPropsSendVerificationEmail_inProgress,
    } = prevProps;
    if (
      oldPropsSendVerificationEmail_inProgress !== newPropsSendVerificationEmail_inProgress
      && !oldPropsSendVerificationEmail_inProgress
    ) {
      const { sendVerificationEmail_response: response } = this.props;
      if (!response) {
        throw new Error('Error in Login: Send Verification Email complete but no response');
      }
      switch (response.statusCode) {
        case 'SUCCESS': {
          this._onSuccess(response.utln, response.email, false);
          break;
        }
        case 'ALREADY_SENT': {
          this._onSuccess(response.utln, response.email, true);
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
        default: {
          throw new Error(
            `Error in Login: unkown Send Verification Email Response: ${response.statusCode}`,
          );
        }
      }
    }
  }

  // utln and email should be params, not from state, to ensure it's the
  // same that were submitted!
  _onSuccess = (utln: string, email: string, alreadySent: boolean) => {
    const { navigation } = this.props;
    navigation.navigate(routes.Verify, {
      utln,
      email,
      alreadySent,
    });
  };

  _onNot2019 = (classYear: string) => {
    const { navigation } = this.props;
    navigation.navigate(routes.Not2019, {
      classYear,
    });
  };

  _onNotFound = () => {
    this._utlnInputError('Could not find UTLN');
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
          errorMessageUtln: '',
        },
        () => {
          sendVerificationEmail(utln);
        },
      );
    }
  };

  _utlnInputError = (errorMessage: string) => {
    this.setState({
      errorMessageUtln: errorMessage,
    });
  };

  // TODO: more client side validation!
  _validateUtln = () => {
    const { utln } = this.state;
    if (utln === '') {
      this._utlnInputError('Required');
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
        utln: lowerCaseUtln,
      });
    } else {
      this.setState({ utln: lowerCaseUtln });
    }
  };

  render() {
    // this is the navigator we passed in from App.js
    const { utln, errorMessageUtln, showPopup } = this.state;
    const { sendVerificationEmail_inProgress } = this.props;

    return (
      <View style={Arthur_Styles.container}>
        <View style={{ height: 64 }} />
        <KeyboardView waves={1}>
          <Transition inline appear="horizontal">
            <View style={{ flex: 1 }}>
              <View style={{ flex: 2, alignItems: 'center' }}>
                <Text style={Arthur_Styles.title}>Project Gem</Text>
                <Image
                  resizeMode="contain"
                  style={{
                    flex: 1,
                    maxWidth: '60%',
                  }}
                  source={ArthurUri} // TODO: investigate why mobile/ does not work
                />
                <PrimaryInput
                  label="UTLN"
                  onChange={this._onInputChange}
                  error={errorMessageUtln}
                  assistive="Ex: jjaffe01"
                  containerStyle={{ width: '60%' }}
                  autoCapitalize="none"
                />
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                }}
              >
                <View style={{ flex: 1 }} />
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'space-around',
                  }}
                >
                  <PrimaryButton
                    onPress={this._onSubmit}
                    title="Roll 'Bos'"
                    disabled={sendVerificationEmail_inProgress || utln === ''}
                    loading={sendVerificationEmail_inProgress}
                  />
                  <TertiaryButton onPress={this._onHelp} title="Having Touble?" />
                </View>
                <View style={{ flex: 1 }} />
              </View>
            </View>
          </Transition>
        </KeyboardView>
        <Popup
          visible={showPopup}
          onTouchOutside={() => {
            this.setState({ showPopup: false });
          }}
        >
          <Text
            style={[
              textStyles.headline4StyleMedium,
              {
                color: Colors.Grapefruit,
                textAlign: 'center',
              },
            ]}
          >
            {'Your session has expired, please login again!'}
          </Text>
        </Popup>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SplashScreen);