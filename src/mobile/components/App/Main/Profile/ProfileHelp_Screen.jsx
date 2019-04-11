// @flow

import React from 'react';
import { Text, View, ImageBackground, Linking } from 'react-native';
import GEMHeader from 'mobile/components/shared/Header';
import { Colors } from 'mobile/styles/colors';
import { PrimaryButton } from 'mobile/components/shared/buttons';
import FeedbackPopup from 'mobile/components/App/Meta/FeedbackPopup';
import NavigationService from 'mobile/components/navigation/NavigationService';
import { textStyles } from 'mobile/styles/textStyles';

const wavesFull = require('../../../../assets/waves/wavesFullScreen/wavesFullScreen.png');

type Props = {};

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
    NavigationService.back();
  };

  render() {
    const { showFeedbackPopup } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <GEMHeader
          title="Help & Contact"
          leftIconName="back"
          onLeftIconPress={this._onBack}
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
                onPress={() => Linking.openURL('mailto:jumbosmash19@gmail.com')}
                title="support@jumbosmash.com"
              />
            </View>
          </View>
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
              <Text style={textStyles.headline4StyleDemibold}>
                GIVE US FEEDBACK
              </Text>
            </View>
            <View style={{ marginBottom: 30 }}>
              <Text style={textStyles.body1style}>
                Help us make the app better.
              </Text>
            </View>
            <View style={{ marginLeft: 10, marginRight: 10 }}>
              <PrimaryButton
                onPress={() => this.setState({ showFeedbackPopup: true })}
                title="Send Feedback"
              />
            </View>
          </View>
        </View>
        <FeedbackPopup
          visible={showFeedbackPopup}
          onCancel={() => this.setState({ showFeedbackPopup: false })}
          onDone={() => this.setState({ showFeedbackPopup: false })}
        />
      </View>
    );
  }
}

export default ProfileHelp;
