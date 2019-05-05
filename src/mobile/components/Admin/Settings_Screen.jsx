// @flow

import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  SafeAreaView,
  Alert,
  Text,
  TextInput
} from 'react-native';
import GEMHeader from 'mobile/components/shared/Header';
import NavigationService from 'mobile/components/navigation/NavigationService';
import { Colors } from 'mobile/styles/colors';
import routes from 'mobile/components/navigation/routes';
import type { NavigationScreenProp } from 'react-navigation';
import Spacer from 'mobile/components/shared/Spacer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { textStyles } from 'mobile/styles/textStyles';
import { Icon } from 'react-native-elements';
import { setPassword, requestPassword } from 'mobile/utils/passwords';

const wavesFull = require('../../assets/waves/wavesFullScreen/wavesFullScreen.png');

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

type Props = NavigationProps;

type State = {
  viewPassword: boolean,
  storedPassword: null | string
};

class ClassmateOverviewScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      viewPassword: false,
      storedPassword: null
    };
  }

  componentDidMount() {
    requestPassword(false).then(password => {
      this.setState({
        storedPassword: password
      });
    });
  }

  _onBack = () => {
    const { navigation } = this.props;
    NavigationService.back(navigation.state.key);
  };

  _onClassmatesListPress = () => {
    const { navigation } = this.props;
    navigation.navigate(routes.AdminClassmateList);
  };

  _onAdminSettingsPress = () => {
    const { navigation } = this.props;
    navigation.navigate(routes.AdminSettings);
  };

  _toggleViewPassword = () => {
    this.setState(prevState => ({
      viewPassword: !prevState.viewPassword
    }));
  };

  _onEditPassword = () => {
    setPassword()
      .then(password => {
        this.setState({
          storedPassword: password
        });
      })
      .catch(() => {
        Alert.alert('Could not save password. Sorry.');
      });
  };

  render() {
    const { viewPassword, storedPassword } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <GEMHeader
          title="Admin Settings"
          leftIcon={{ name: 'back', onPress: this._onBack }}
        />
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={wavesFull}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          />
          <SafeAreaView>
            <KeyboardAwareScrollView
              extraScrollHeight={35}
              enableOnAndroid
              style={{
                backgroundColor: 'transparent',
                height: '100%'
              }}
            >
              <View
                style={[
                  styles.settingsBlock,
                  { marginTop: 20, paddingHorizontal: 10 }
                ]}
              >
                <Text
                  style={[
                    textStyles.headline5Style,
                    { textAlign: 'center', paddingBottom: 5 }
                  ]}
                >
                  {'Password'}
                </Text>
                <Text style={[textStyles.body2Style, { paddingBottom: 12 }]}>
                  {
                    'Use this to change the password associated with this phone.'
                  }
                </Text>
                <Spacer />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <TextInput
                    style={[
                      textStyles.body1Style,
                      {
                        flex: 1,
                        color: storedPassword ? 'black' : 'red'
                      }
                    ]}
                    secureTextEntry={!viewPassword}
                    editable={false}
                    value={storedPassword || 'No password set.'}
                  />
                  <Icon
                    containerStyle={{
                      padding: 5,
                      margin: -5
                    }}
                    onPress={this._toggleViewPassword}
                    name={viewPassword ? 'visibility' : 'visibility-off'}
                  />
                  <Icon
                    containerStyle={{
                      padding: 5,
                      margin: -5,
                      paddingLeft: 20
                    }}
                    onPress={this._onEditPassword}
                    name={'edit'}
                  />
                </View>
              </View>
            </KeyboardAwareScrollView>
          </SafeAreaView>
        </View>
      </View>
    );
  }
}

export default ClassmateOverviewScreen;
