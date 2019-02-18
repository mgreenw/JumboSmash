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
import { routes } from 'mobile/components/Navigation';
import GEMHeader from 'mobile/components/shared/Header';
import { Colors } from 'mobile/styles/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PrimaryButton } from 'mobile/components/shared/buttons/PrimaryButton';
import { SecondaryButton } from 'mobile/components/shared/buttons/SecondaryButton';
import NavigationService from 'mobile/NavigationService';
import { textStyles } from 'mobile/styles/textStyles';
import saveSettingsAction from 'mobile/actions/app/saveSettings';

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
            <View
              style={[
                styles.settingsBlock,
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 20
                }
              ]}
            >
              <Text style={textStyles.headline6Style}>Show me on Smash</Text>
              <Switch
                value={editedSettings.activeScenes.smash}
                tintColor={
                  Colors.AquaMarine /* TODO: investigate if this is deprecated */
                }
                onTintColor={Colors.AquaMarine}
                trackColor={Colors.AquaMarine}
                ios_backgroundColor={Colors.AquaMarine}
                onValueChange={this._onSmashSwitchChange}
              />
            </View>
            <View style={styles.settingsBlock}>
              <Text
                style={[textStyles.headline6Style, { textAlign: 'center' }]}
              >
                {'Gender Preferences'}
              </Text>
              <Text style={[textStyles.body2Style, { padding: 10 }]}>
                {
                  'Your gender preferences help determine who you’ll be shown to and who to show to you for JumboSmash. Your preferences will never be shown on your profile. '
                }
              </Text>
              <Text
                style={[
                  textStyles.headline6Style,
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
                  textStyles.headline6Style,
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
            </View>

            <View style={styles.settingsBlock}>
              <View style={{ paddingBottom: 20 }}>
                <SecondaryButton
                  title="Safety on JumboSmash"
                  onPress={() => {
                    /* TODO */
                  }}
                  disabled={logoutInProgress}
                  loading={false}
                />
              </View>
              <View style={{ paddingBottom: 20 }}>
                <SecondaryButton
                  title="Terms and Conditions"
                  onPress={() => {
                    /* TODO */
                  }}
                  disabled={logoutInProgress}
                  loading={false}
                />
              </View>
              <PrimaryButton
                title="Log Out"
                onPress={logout}
                disabled={logoutInProgress}
                loading={logoutInProgress}
              />
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
