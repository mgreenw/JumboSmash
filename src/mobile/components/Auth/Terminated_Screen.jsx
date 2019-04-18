// @flow

import React from 'react';
import { Text, View } from 'react-native';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { type NavigationScreenProp } from 'react-navigation';
import GEMHeader from 'mobile/components/shared/Header';
import { textStyles } from 'mobile/styles/textStyles';
import KeyboardView from 'mobile/components/shared/KeyboardView';
import { WebBrowser } from 'expo';
import { Colors } from 'mobile/styles/colors';
import * as Animatable from 'react-native-animatable';

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};

type Props = NavigationProps;

type State = {};

class TerminatedScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <KeyboardView waves={1}>
          <View style={{ flex: 1, paddingHorizontal: '6.4%' }}>
            <GEMHeader title="" />
            <Animatable.View>
              <Text
                style={[textStyles.headline4Style, { textAlign: 'center' }]}
                transition="fadeIn"
              >
                {'Your Account Has Been Terminated'}
              </Text>
            </Animatable.View>
            <View
              style={{
                flex: 1,
                justifyContent: 'space-around',
                paddingBottom: '25%'
              }}
            >
              <Animatable.View>
                <Text
                  style={textStyles.body1Style}
                  transition="fadeIn"
                  delay={1000}
                >
                  {'Your account has been terminated for violating the '}
                  <Terms />
                  {
                    '. You won’t be able to log into this account and no one else will be able to see it.'
                  }
                </Text>
              </Animatable.View>
              <Animatable.View>
                <Text
                  style={textStyles.body1Style}
                  transition="fadeIn"
                  delay={2000}
                >
                  {'As per the '}
                  <Terms />
                  {
                    ', JumboSmash reserves the right to make the final determination with respect to such matters, and this decision will not be reversed.'
                  }
                </Text>
              </Animatable.View>
              <Animatable.View>
                <Text
                  style={textStyles.body1Style}
                  transition="fadeIn"
                  delay={10000}
                >
                  {'Congrats to you and the rest of the class of 2019! 🥂🎓🐘'}
                </Text>
              </Animatable.View>
            </View>
            <AndroidBackHandler onBackPress={() => true} />
          </View>
        </KeyboardView>
      </View>
    );
  }
}

const Terms = () => (
  <Text
    style={{
      color: Colors.Grapefruit,
      textDecorationLine: 'underline'
    }}
    onPress={() => {
      // TODO: Make this go to the jumbosmash.com
      WebBrowser.openBrowserAsync('https://arthur.jumbosmash.com/terms.html');
    }}
  >
    Terms and Conditions
  </Text>
);

export default TerminatedScreen;
