// @flow

import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Switch,
  ImageBackground,
  Linking
} from 'react-native';
import { connect } from 'react-redux';
import logoutAction from 'mobile/actions/auth/logout';
import { GenderSelector } from 'mobile/components/shared/GenderSelector';
import type {
  Genders,
  UserSettings,
  ReduxState,
  Dispatch
} from 'mobile/reducers';
import routes from 'mobile/components/navigation/routes';
import GEMHeader from 'mobile/components/shared/Header';
import { Colors } from 'mobile/styles/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PrimaryButton } from 'mobile/components/shared/buttons/PrimaryButton';
import { SecondaryButton } from 'mobile/components/shared/buttons/SecondaryButton';
import NavigationService from 'mobile/components/navigation/NavigationService';
import { textStyles } from 'mobile/styles/textStyles';
import saveSettingsAction from 'mobile/actions/app/saveSettings';
import Collapsible from 'react-native-collapsible';
import { Constants } from 'expo';

const wavesFull = require('../../../../assets/waves/wavesFullScreen/wavesFullScreen.png');

const styles = StyleSheet.create({
  settingsBlock: {
    backgroundColor: Colors.White,
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 20,
    marginBottom: 20,
    paddingBottom: 20
  }
});

const Spacer = () => {
  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <View
        style={{
          paddingTop: 8,
          marginBottom: 4,
          borderTopWidth: 1,
          width: '80%',
          borderColor: Colors.Grey80
        }}
      />
    </View>
  );
};

type NavigationProps = {
  navigation: any
};

type ReduxProps = {
  settings: UserSettings,
  logoutInProgress: boolean
};

type DispatchProps = {
  logout: () => void,
  saveSettings: (settings: UserSettings) => void
};

type Props = NavigationProps & ReduxProps & DispatchProps;

type State = {
  editedSettings: UserSettings
};

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  if (!reduxState.client) {
    throw new Error('Redux Client is null in Settings Edit');
  }
  return {
    logoutInProgress: reduxState.inProgress.logout,
    settings: reduxState.client.settings
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    logout: () => {
      dispatch(logoutAction());
    },
    saveSettings: (settings: UserSettings) => {
      dispatch(saveSettingsAction(settings));
    }
  };
}

class SettingsScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editedSettings: props.settings
    };
  }

  componentDidUpdate(prevProps) {
    const { navigation } = this.props;
    const { logoutInProgress } = this.props;
    if (!logoutInProgress && prevProps.logoutInProgress !== logoutInProgress) {
      // For recieving the logout completion
      navigation.navigate(routes.Splash, {});
    }
  }

  _onIdentifyAsGendersChange = (identifyAsGenders: Genders) => {
    this.setState(state => ({
      editedSettings: {
        ...state.editedSettings,
        identifyAsGenders
      }
    }));
  };

  _onWantGendersChange = (lookingForGenders: Genders) => {
    this.setState(state => ({
      editedSettings: {
        ...state.editedSettings,
        lookingForGenders
      }
    }));
  };

  _onSmashSwitchChange = (smash: boolean) => {
    this.setState(state => ({
      editedSettings: {
        ...state.editedSettings,
        activeScenes: {
          ...state.editedSettings.activeScenes,
          smash
        }
      }
    }));
  };

  _onSocialSwitchChange = (social: boolean) => {
    this.setState(state => ({
      editedSettings: {
        ...state.editedSettings,
        activeScenes: {
          ...state.editedSettings.activeScenes,
          social
        }
      }
    }));
  };

  _onBack = () => {
    const { saveSettings } = this.props;
    const { editedSettings } = this.state;
    saveSettings(editedSettings);
    NavigationService.back();
  };

  render() {
    const { editedSettings } = this.state;
    const { logoutInProgress, logout } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <GEMHeader
          title="Edit Settings"
          leftIconName="back"
          onLeftIconPress={this._onBack}
        />
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={wavesFull}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          />
          <KeyboardAwareScrollView
            extraScrollHeight={35}
            enableOnAndroid
            style={{
              backgroundColor: 'transparent'
            }}
          >
            <View style={[styles.settingsBlock, { marginTop: 20 }]}>
              <View style={{ paddingHorizontal: 10 }}>
                <Text
                  style={[
                    textStyles.headline5Style,
                    { textAlign: 'center', paddingBottom: 5 }
                  ]}
                >
                  {'JumboSocial 🐘'}
                </Text>
                <Text style={[textStyles.body2Style, { paddingBottom: 12 }]}>
                  {
                    'JumboSocial is where you can match with people for hanging out.'
                  }
                </Text>
              </View>
              <Spacer />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 15,
                  paddingLeft: 10
                }}
              >
                <Text style={textStyles.body1Style}>Show me on Social</Text>
                <Switch
                  value={editedSettings.activeScenes.social}
                  trackColor={{ true: Colors.AquaMarine }}
                  onValueChange={this._onSocialSwitchChange}
                />
              </View>
            </View>
            <View style={[styles.settingsBlock]}>
              <View style={{ paddingHorizontal: 10 }}>
                <Text
                  style={[
                    textStyles.headline5Style,
                    { textAlign: 'center', paddingBottom: 5 }
                  ]}
                >
                  {'JumboSmash 🍑'}
                </Text>
                <Text style={[textStyles.body2Style, { paddingBottom: 12 }]}>
                  {
                    'JumboSmash is where you can get it on. You know what this is.'
                  }
                </Text>
              </View>
              <Spacer />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingBottom: 20,
                  alignItems: 'center',
                  paddingLeft: 10
                }}
              >
                <Text style={textStyles.body1Style}>Show me on Smash</Text>
                <Switch
                  value={editedSettings.activeScenes.smash}
                  trackColor={{ true: Colors.AquaMarine }}
                  onValueChange={this._onSmashSwitchChange}
                />
              </View>
              <Collapsible collapsed={!editedSettings.activeScenes.smash}>
                <Spacer />
                <Text style={[textStyles.body1Style, { textAlign: 'center' }]}>
                  {'Gender Preferences'}
                </Text>
                <Text style={[textStyles.body2Style, { padding: 10 }]}>
                  {
                    'This helps JumboSmash match you with the right people. For more information, check out our '
                  }
                  <Text
                    style={{
                      color: Colors.Grapefruit,
                      textDecorationLine: 'underline'
                    }}
                    onPress={() => {
                      // TODO: Make this go to the jumbosmash.com
                      Linking.openURL(
                        'https://arthur.jumbosmash.com/gender.html'
                      );
                    }}
                  >
                    {'Statement on Gender'}
                  </Text>
                  {
                    '. None of the following information will be shown on your profile. '
                  }
                </Text>
                <Spacer />
                <Text
                  style={[
                    textStyles.body1Style,
                    { textAlign: 'center', paddingBottom: 10 }
                  ]}
                >
                  {'I identify as:'}
                </Text>
                <GenderSelector
                  defaultGenders={editedSettings.identifyAsGenders}
                  onChange={this._onIdentifyAsGendersChange}
                  plural={false}
                />
                <Text
                  style={[
                    textStyles.body1Style,
                    { textAlign: 'center', padding: 10 }
                  ]}
                >
                  {"I'm looking for:"}
                </Text>
                <GenderSelector
                  defaultGenders={editedSettings.lookingForGenders}
                  onChange={this._onWantGendersChange}
                  plural
                />
              </Collapsible>
            </View>

            <View style={styles.settingsBlock}>
              <View style={{ paddingHorizontal: 10 }}>
                <Text
                  style={[
                    textStyles.headline5Style,
                    { textAlign: 'center', paddingBottom: 5 }
                  ]}
                >
                  {'Safety & Legal'}
                </Text>
                <Text style={[textStyles.body2Style, { paddingBottom: 12 }]}>
                  {
                    'Resources, information, and terms and conditions related to usage of JumboSmash'
                  }
                </Text>
              </View>
              <Spacer />
              {/* <View style={{ paddingBottom: 20 }}>
                <SecondaryButton
                  title="Safety on JumboSmash"
                  onPress={() => {}}
                  disabled={logoutInProgress}
                  loading={false}
                />
              </View> */}
              <View style={{ paddingBottom: 20 }}>
                <SecondaryButton
                  title="Terms and Conditions"
                  onPress={() => {
                    // Todo: Make this go to the real website
                    Linking.openURL('https://arthur.jumbosmash.com/terms.html');
                  }}
                  disabled={logoutInProgress}
                  loading={false}
                />
              </View>
              <View style={{ paddingBottom: 20 }}>
                <PrimaryButton
                  title="Log Out"
                  onPress={logout}
                  disabled={logoutInProgress}
                  loading={logoutInProgress}
                />
              </View>
              <Spacer />
              <Text style={[{ textAlign: 'center' }, textStyles.body2Style]}>
                {`Version ${Constants.manifest.version}`}
              </Text>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreen);
