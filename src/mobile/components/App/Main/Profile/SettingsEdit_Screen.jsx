// @flow
/* eslint-disable */

import React from 'react';
import { Text, View, StyleSheet, Switch, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { logout } from 'mobile/actions/auth/logout';
import { GenderSelector } from 'mobile/components/shared/GenderSelector';
import type { Genders, UserSettings, ReduxState } from 'mobile/reducers';
import type { Dispatch } from 'redux';
import { routes } from 'mobile/components/Navigation';
import GEMHeader from 'mobile/components/shared/Header';
import { Colors } from 'mobile/styles/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PrimaryButton } from 'mobile/components/shared/buttons/PrimaryButton';
import { SecondaryButton } from 'mobile/components/shared/buttons/SecondaryButton';
import NavigationService from 'mobile/NavigationService';
import { textStyles } from 'mobile/styles/textStyles';

const wavesFull = require('../../../../assets/waves/wavesFullScreen/wavesFullScreen.png');

const styles = StyleSheet.create({
  settingsBlock: {
    backgroundColor: Colors.White,
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 20,
    marginBottom: 20,
    paddingBottom: 20,
  },
});

type NavigationProps = {
  navigation: any,
};

type ReduxProps = {
  settings: UserSettings,
  logoutInProgress: boolean,
};

type DispatchProps = {
  logout: () => void,
  saveSettings: (settings: UserSettings) => void,
};

type Props = NavigationProps & ReduxProps & DispatchProps;

type State = {
  editedSettings: UserSettings,
  showOnSmash: boolean, // temporary for UI testing
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props): ReduxProps {
  if (!reduxState.client) {
    throw new Error('Redux Client is null in Settings Edit');
  }
  return {
    logoutInProgress: reduxState.inProgress.logout,
    settings: reduxState.client.settings,
  };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props): DispatchProps {
  return {
    logout: () => {
      dispatch(logout());
    },
    saveSettings: () => {
      // TODO
    },
  };
}

class SettingsScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editedSettings: props.settings,
      showOnSmash: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { navigation } = this.props;
    if (!this.props.logoutInProgress && prevProps.logoutInProgress != this.props.logoutInProgress) {
      // disable back button when performing a syncronous action.
      navigation.setParams({
        headerLeft: this.props.logoutInProgress ? null : '',
      });

      // For recieving the logout completion
      navigation.navigate(routes.Splash, {});
    }
  }

  _onUseGendersChange = (useGenders: Genders) => {
    this.setState(state => ({
      editedSettings: {
        ...state.editedSettings,
        useGenders,
      },
    }));
  };

  _onWantGendersChange = (wantGenders: Genders) => {
    this.setState(state => ({
      editedSettings: {
        ...state.editedSettings,
        wantGenders,
      },
    }));
  };

  _onBack = () => {
    this.props.saveSettings(this.state.editedSettings);
    NavigationService.back();
  };

  render() {
    const { showOnSmash, editedSettings } = this.state;
    const { logoutInProgress } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <GEMHeader title="Edit Settings" leftIconName="back" onLeftIconPress={this._onBack} />
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={wavesFull}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          />
          <KeyboardAwareScrollView
            extraScrollHeight={35}
            style={{
              backgroundColor: 'transparent',
            }}
          >
            <View
              style={[
                styles.settingsBlock,
                { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
              ]}
            >
              <Text style={textStyles.headline6Style}>Show me on Smash</Text>
              <Switch
                value={showOnSmash}
                tintColor={Colors.AquaMarine /* TODO: investigate if this is deprecated */}
                onTintColor={Colors.AquaMarine}
                trackColor={Colors.AquaMarine}
                ios_backgroundColor={Colors.AquaMarine}
                onValueChange={value => {
                  this.setState({
                    showOnSmash: value,
                  });
                }}
              />
            </View>
            <View style={styles.settingsBlock}>
              <Text style={[textStyles.headline6Style, { textAlign: 'center' }]}>
                {'Gender Preferences'}
              </Text>
              <Text style={[textStyles.body2Style, { padding: 10 }]}>
                {
                  'Your gender preferences help determine who you’ll be shown to and who to show to you for JumboSmash. Your preferences will never be shown on your profile. '
                }
              </Text>
              <Text style={[textStyles.headline6Style, { textAlign: 'center', paddingBottom: 10 }]}>
                {'I identify as:'}
              </Text>
              <GenderSelector
                defaultGenders={editedSettings.useGenders}
                onChange={this._onUseGendersChange}
                plural={false}
              />
              <Text style={[textStyles.headline6Style, { textAlign: 'center', padding: 10 }]}>
                {'I identify as:'}
              </Text>
              <GenderSelector
                defaultGenders={editedSettings.wantGenders}
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
                onPress={this.props.logout}
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
  mapDispatchToProps,
)(SettingsScreen);
