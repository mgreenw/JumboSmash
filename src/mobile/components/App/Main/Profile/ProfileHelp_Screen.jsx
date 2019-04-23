// @flow

import React from 'react';
import { Text, View, ImageBackground } from 'react-native';
import GEMHeader from 'mobile/components/shared/Header';
import { Colors } from 'mobile/styles/colors';
import { PrimaryButton } from 'mobile/components/shared/buttons';
import NavigationService from 'mobile/components/navigation/NavigationService';
import { textStyles } from 'mobile/styles/textStyles';
import { sendSupportEmail } from 'mobile/utils/Mail';
import type { NavigationScreenProp } from 'react-navigation';

const wavesFull = require('../../../../assets/waves/wavesFullScreen/wavesFullScreen.png');

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};

type Props = NavigationProps;

type State = {
  showFeedbackPopup: boolean
};

class ProfileHelp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showFeedbackPopup: false
    };
  }

  _onBack = () => {
    const { navigation } = this.props;
    NavigationService.back(navigation.state.key);
  };

  render() {
    const { showFeedbackPopup } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <GEMHeader
          title="Help & Contact"
          leftIcon={{
            name: 'back',
            onPress: this._onBack
          }}
        />
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={wavesFull}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          />

          <View
            style={{
              backgroundColor: Colors.White,
              paddingLeft: 44,
              paddingRight: 44,
              paddingTop: 20,
              marginBottom: 20,
              paddingBottom: 20,
              marginTop: 20
            }}
          >
            <View style={{ marginBottom: 30, alignItems: 'center' }}>
              <Text style={textStyles.headline4StyleDemibold}>NEED HELP?</Text>
            </View>
            <View style={{ marginBottom: 30 }}>
              <Text style={textStyles.body1style}>
                Send the team an email and they’ll get back to you the moment
                they’re sober.
              </Text>
            </View>
            <View style={{ marginLeft: 10, marginRight: 10 }}>
              <PrimaryButton
                onPress={sendSupportEmail}
                title="support@jumbosmash.com"
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default ProfileHelp;
