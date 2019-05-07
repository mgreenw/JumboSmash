// @flow

import React from 'react';
import { Text, View, StyleSheet, Switch, ImageBackground } from 'react-native';
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
import {
  PrimaryButton,
  SecondaryButton
} from 'mobile/components/shared/buttons';
import NavigationService from 'mobile/components/navigation/NavigationService';
import { textStyles } from 'mobile/styles/textStyles';
import saveSettingsAction from 'mobile/actions/app/saveSettings';
import Collapsible from 'react-native-collapsible';
import { Constants, WebBrowser } from 'expo';
import requestNotificationToken from 'mobile/utils/requestNotificationToken';
import Spacer from 'mobile/components/shared/Spacer';
import type {
  NavigationEventPayload,
  NavigationScreenProp,
  NavigationEventSubscription
} from 'react-navigation';
import { sceneToEmoji } from 'mobile/utils/emojis';
import { subYears, isAfter } from 'date-fns';

const wavesFull = require('../../../../assets/waves/wavesFullScreen/wavesFullScreen.png');

const AccountLock = () => (
  <Text
    style={[
      textStyles.body2Style,
      {
        textAlign: 'left',
        color: Colors.Grapefruit,
        paddingTop: 10,
        paddingLeft: 10
      }
    ]}
  >
    {
      'Your account is currently locked. Please check your email for more information.'
    }
  </Text>
);

const AgeLock = () => (
  <Text
    style={[
      textStyles.body2Style,
      {
        textAlign: 'left',
        color: Colors.Grapefruit,
        paddingTop: 10,
        paddingLeft: 10
      }
    ]}
  >
    {'You must be at least 21 years old to use this feature.'}
  </Text>
);

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

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};

type ReduxProps = {
  settings: UserSettings,
  is21: boolean,
  logoutInProgress: boolean,
  logoutSuccess: ?boolean
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
  // Bluryface check
  const twentyOneYearsAgo = subYears(new Date(), 21);
  if (!reduxState.client) {
    throw new Error('Redux Client is null in Settings Edit');
  }
  const is21 = isAfter(
    twentyOneYearsAgo,
    new Date(reduxState.client.profile.fields.birthday)
  );
  if (!reduxState.client) {
    throw new Error('Redux Client is null in Settings Edit after date ');
  }

  return {
    logoutInProgress: reduxState.inProgress.logout,
    settings: reduxState.client.settings,
    logoutSuccess: reduxState.response.logoutSuccess,
    is21
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

    this.willBlurListener = props.navigation.addListener(
      'willBlur',
      this._onWillBlur
    );
  }

  componentDidUpdate(prevProps) {
    const { navigation } = this.props;
    const { logoutInProgress, logoutSuccess } = this.props;
    if (
      logoutSuccess &&
      !logoutInProgress &&
      prevProps.logoutInProgress !== logoutInProgress
    ) {
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

  _onStoneSwitchChange = (stone: boolean) => {
    this.setState(state => ({
      editedSettings: {
        ...state.editedSettings,
        activeScenes: {
          ...state.editedSettings.activeScenes,
          stone
        }
      }
    }));
  };

  _onBack = () => {
    const { navigation } = this.props;
    NavigationService.back(navigation.state.key);
  };

  /**
   * @param {boolean} enable
   * Enable or disable push notifications.
   * If enabling, will get a new push notification token.
   * If disabling, will clear the push notification token.
   */
  _onPushNotificationSwitchChange = (enable: boolean) => {
    if (!enable) {
      this.setState(state => ({
        editedSettings: {
          ...state.editedSettings,
          notificationsEnabled: false,
          expoPushToken: null
        }
      }));
    } else {
      requestNotificationToken().then(newToken => {
        if (newToken !== null) {
          this.setState(state => ({
            editedSettings: {
              ...state.editedSettings,
              notificationsEnabled: true,
              expoPushToken: newToken
            }
          }));
        }
      });
    }
  };

  _onWillBlur = (payload: NavigationEventPayload) => {
    if (payload.action.type === 'Navigation/BACK') {
      const { editedSettings } = this.state;
      const { saveSettings } = this.props;
      saveSettings(editedSettings);
      this.willBlurListener.remove();
    }
  };

  willBlurListener: NavigationEventSubscription;

  render() {
    const { editedSettings } = this.state;
    const { canBeActiveInScenes } = editedSettings;
    const { logoutInProgress, logout, is21 } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <GEMHeader
          title="Edit Settings"
          leftIcon={{ name: 'back', onPress: this._onBack }}
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
                  {`JumboSocial ${sceneToEmoji('social')}`}
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
                  paddingLeft: 10
                }}
              >
                <Text style={textStyles.body1Style}>Show me on Social</Text>
                <Switch
                  disabled={!canBeActiveInScenes}
                  value={editedSettings.activeScenes.social}
                  trackColor={{ true: Colors.AquaMarine }}
                  onValueChange={this._onSocialSwitchChange}
                />
              </View>
              {!canBeActiveInScenes && <AccountLock />}
            </View>
            <View style={[styles.settingsBlock]}>
              <View style={{ paddingHorizontal: 10 }}>
                <Text
                  style={[
                    textStyles.headline5Style,
                    { textAlign: 'center', paddingBottom: 5 }
                  ]}
                >
                  {`JumboSmash ${sceneToEmoji('smash')}`}
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
                  alignItems: 'center',
                  paddingLeft: 10
                }}
              >
                <Text style={textStyles.body1Style}>Show me on Smash</Text>
                <Switch
                  disabled={!canBeActiveInScenes}
                  value={editedSettings.activeScenes.smash}
                  trackColor={{ true: Colors.AquaMarine }}
                  onValueChange={this._onSmashSwitchChange}
                />
              </View>
              <Collapsible collapsed={!editedSettings.activeScenes.smash}>
                <View style={{ height: 8 }} />
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
                      WebBrowser.openBrowserAsync(
                        'https://jumbosmash.com/gender.html'
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
              {!canBeActiveInScenes && <AccountLock />}
            </View>

            <View style={styles.settingsBlock}>
              <View style={{ paddingHorizontal: 10 }}>
                <Text
                  style={[
                    textStyles.headline5Style,
                    { textAlign: 'center', paddingBottom: 5 }
                  ]}
                >
                  {`JumboStone ${sceneToEmoji('stone')}`}
                </Text>
                <Text style={[textStyles.body2Style, { paddingBottom: 12 }]}>
                  {
                    'JumboStone is where you can match with people for studying geology.'
                  }
                </Text>
              </View>
              <Spacer />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingLeft: 10
                }}
              >
                <Text style={textStyles.body1Style}>Show me on Stone</Text>
                <Switch
                  disabled={!canBeActiveInScenes || !is21}
                  value={editedSettings.activeScenes.stone}
                  trackColor={{ true: Colors.AquaMarine }}
                  onValueChange={this._onStoneSwitchChange}
                />
              </View>
              {canBeActiveInScenes && !is21 && <AgeLock />}
              {!canBeActiveInScenes && <AccountLock />}
            </View>

            <View style={[styles.settingsBlock]}>
              <View style={{ paddingHorizontal: 10 }}>
                <Text
                  style={[
                    textStyles.headline5Style,
                    { textAlign: 'center', paddingBottom: 5 }
                  ]}
                >
                  {'Notifications'}
                </Text>
                <Text style={[textStyles.body2Style, { paddingBottom: 12 }]}>
                  {
                    'JumboSmash uses push notifications to let you know when you have a new match or message.'
                  }
                </Text>
              </View>
              <Spacer />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingLeft: 10
                }}
              >
                <Text style={textStyles.body1Style}>Enable Notifications</Text>
                <Switch
                  value={editedSettings.notificationsEnabled}
                  trackColor={{ true: Colors.AquaMarine }}
                  onValueChange={this._onPushNotificationSwitchChange}
                />
              </View>
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
              <View style={{ paddingBottom: 20, paddingTop: 10 }}>
                <SecondaryButton
                  title="Safety on JumboSmash"
                  onPress={() => {
                    WebBrowser.openBrowserAsync(
                      'https://jumbosmash.com/safety.html'
                    );
                  }}
                  disabled={logoutInProgress}
                  loading={false}
                />
              </View>
              <View style={{ paddingBottom: 20 }}>
                <SecondaryButton
                  title="Terms and Conditions"
                  onPress={() => {
                    WebBrowser.openBrowserAsync(
                      'https://jumbosmash.com/terms.html'
                    );
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
